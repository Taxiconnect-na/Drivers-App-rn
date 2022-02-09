import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/CarsBrandsModels.dart';
import 'package:taxiconnectdrivers/Components/Helpers/ModalReg.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class SelectCarRideIndividual extends StatefulWidget {
  const SelectCarRideIndividual({Key? key}) : super(key: key);

  @override
  _SelectCarRideIndividualState createState() =>
      _SelectCarRideIndividualState();
}

class _SelectCarRideIndividualState extends State<SelectCarRideIndividual> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black,
          leading: IconButton(
            padding: EdgeInsets.only(left: 0),
            visualDensity: VisualDensity.comfortable,
            onPressed: () =>
                Navigator.of(context).pushNamed('/RegistrationRideIndividual'),
            icon: Icon(Icons.arrow_back),
          ),
          title: const Text('Vehicle info',
              style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
        ),
        body: Container(
          // color: Colors.red,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(
                      height: 25,
                    ),
                    renderSelectedVehicle(context: context),
                    const SizedBox(
                      height: 25,
                    ),
                    Row(
                      children: [
                        BasicInputText(
                          title: context
                                  .watch<RegistrationProvider>()
                                  .definitiveVehicleInfos['plate_number']!
                                  .isEmpty
                              ? 'Plate number'
                              : context
                                      .watch<RegistrationProvider>()
                                      .definitiveVehicleInfos['plate_number']
                                  as String,
                          nature: 'vehicle_details_plate_number',
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    const Expanded(child: Text('')),
                    GenericRectButton(
                        label: 'Done',
                        labelFontSize: 20,
                        isArrowShow: false,
                        horizontalPadding: 0,
                        actuatorFunctionl: () {
                          Navigator.of(context)
                              .pushNamed('/RegistrationRideIndividual');
                        })
                  ]),
            ),
          ),
        ));
  }

  //Render selected vehicle
  Widget renderSelectedVehicle({required BuildContext context}) {
    Map<String, String> definitiveData =
        context.watch<RegistrationProvider>().definitiveVehicleInfos;
    //...
    if (definitiveData['brand_name']!.isEmpty &&
        definitiveData['model_name']!.isEmpty &&
        definitiveData['color']!.isEmpty) //Not yet Set
    {
      return Container(
        decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(4)),
        child: ListTile(
          contentPadding: EdgeInsets.only(left: 15, right: 15),
          onTap: () => Navigator.of(context).pushNamed('/SelectCarDirectory'),
          title: const Text(
            'Select transport',
            style: TextStyle(fontFamily: 'MoveTextMedium'),
          ),
          trailing: Icon(Icons.arrow_forward_ios, size: 18),
        ),
      );
    } else //? Already set
    {
      return Container(
        decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(4)),
        child: ListTile(
          leading: Container(
              width: 25,
              height: 25,
              decoration: BoxDecoration(
                border: Border.all(width: 1, color: Colors.grey),
                borderRadius: BorderRadius.circular(150),
                color: CarsBrandsModels().carColors.firstWhere((element) =>
                    element['name'] ==
                    context
                        .watch<RegistrationProvider>()
                        .definitiveVehicleInfos['color'])['color'],
              )),
          horizontalTitleGap: 0,
          contentPadding: EdgeInsets.only(left: 15, right: 15),
          onTap: () => Navigator.of(context).pushNamed('/SelectCarDirectory'),
          title: Text(
            context
                .watch<RegistrationProvider>()
                .definitiveVehicleInfos['brand_name'] as String,
            style: TextStyle(fontFamily: 'MoveTextMedium'),
          ),
          subtitle: Text(
              'Model: ${context.watch<RegistrationProvider>().definitiveVehicleInfos['model_name'] as String}'),
          trailing: Icon(Icons.arrow_forward_ios, size: 18),
        ),
      );
    }
  }
}
