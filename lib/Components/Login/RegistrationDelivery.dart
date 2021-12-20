import 'dart:developer';
import 'dart:ui';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/ModalReg.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class RegistrationDelivery extends StatefulWidget {
  const RegistrationDelivery({Key? key}) : super(key: key);

  @override
  _RegistrationDeliveryState createState() => _RegistrationDeliveryState();
}

class _RegistrationDeliveryState extends State<RegistrationDelivery> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: const Padding(
          padding: EdgeInsets.only(right: 8.0, left: 5),
          child: Icon(Icons.arrow_back),
        ),
        leadingWidth: 15,
        title: const Text('Registration',
            style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
        centerTitle: false,
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 15, right: 15, top: 25),
            child: SafeArea(
              child: ListView(
                // crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // const Text('Welcome to TaxiConnect',
                  //     style:
                  //         TextStyle(fontFamily: 'MoveTextBold', fontSize: 21)),
                  const Padding(
                    padding: EdgeInsets.only(top: 5, bottom: 5),
                    child: Text('Required steps',
                        style: TextStyle(
                            fontFamily: 'MoveTextMedium', fontSize: 15)),
                  ),
                  Text("Here's what you need to set up your account.",
                      style:
                          TextStyle(fontSize: 15, color: Colors.grey.shade700)),
                  const SizedBox(
                    height: 25,
                  ),
                  Options(
                    title: 'Personal details',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'personal_details')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'personal_details')[0],
                    actuator: () => showModalActions(
                        context: context, scenario: 'show_perso_details'),
                  ),
                  const Divider(),
                  Options(
                    title: 'Driver photo',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'driver_photo')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'driver_photo')[0],
                    actuator: () => showModalActions(
                        context: context, scenario: 'driver_photo_take'),
                  ),
                  const Divider(),
                  Options(
                    title: 'Vehicle details',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'car_details')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'car_details')[0],
                    actuator: () =>
                        Navigator.of(context).pushNamed('/SelectCar'),
                  ),
                  const Divider(),
                  Options(
                    title: 'Vehicle photo',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'vehicle_photo')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'vehicle_photo')[0],
                    actuator: () => showModalActions(
                        context: context, scenario: 'car_photo_take'),
                  ),
                  const Divider(),
                  Options(
                    title: 'License',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'license_photo')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'license_photo')[0],
                    actuator: () => showModalActions(
                        context: context, scenario: 'license_photo_take'),
                  ),
                  const Divider(),
                  Options(
                    title: 'Identification document',
                    subTitle: showProgressIcoStatus(
                        context: context, nature: 'id_photo')[1],
                    icoRepr: showProgressIcoStatus(
                        context: context, nature: 'id_photo')[0],
                    actuator: () => showModalActions(
                        context: context, scenario: 'id_photo_take'),
                  ),
                  // Done
                  const SizedBox(
                    height: 50,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Checkbox(
                          activeColor: const Color.fromRGBO(9, 110, 212, 1),
                          value: true,
                          onChanged: (val) {}),
                      const Flexible(
                        child: Text(
                            "I'm sure that all the information provided are authentic and accurate.",
                            style: TextStyle(fontSize: 14)),
                      )
                    ],
                  ),
                  GenericRectButton(
                      label: 'Done',
                      horizontalPadding: 0,
                      labelFontSize: 20,
                      actuatorFunctionl: () {})
                ],
              ),
            ),
          ),
          Visibility(
            visible: context.watch<HomeProvider>().shouldShowBlurredBackground,
            child: SizedBox(
                // color: Colors.red,
                height: 50,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                  child: const SizedBox(height: 20, width: 20),
                )),
          )
        ],
      ),
    );
  }

  //SHow modal
  void showModalActions(
      {required BuildContext context, required String scenario}) {
    context.read<HomeProvider>().updateBlurredBackgroundState(
        shouldShow: true); //Show blurred background

    showMaterialModalBottomSheet(
      backgroundColor: Colors.white,
      duration: const Duration(milliseconds: 250),
      context: context,
      builder: (context) => SingleChildScrollView(
        padding: EdgeInsets.zero,
        controller: ModalScrollController.of(context),
        child: SafeArea(
            child: Container(
          width: MediaQuery.of(context).size.width,
          color: Colors.white,
          child: ModalReg(scenario: scenario),
        )),
      ),
    ).whenComplete(() => context
        .read<HomeProvider>()
        .updateBlurredBackgroundState(shouldShow: false));
  }

  //Show progress ico status
  List<dynamic> showProgressIcoStatus(
      {required BuildContext context, required String nature}) {
    switch (nature) {
      case 'personal_details':
        Map<String, String> data =
            context.watch<RegistrationProvider>().personalDetails;
        return data['name']!.isNotEmpty &&
                data['surname']!.isNotEmpty &&
                data['email']!.isNotEmpty
            ? [Icon(Icons.check_circle, color: Colors.green), 'Done']
            : data['name']!.isEmpty &&
                    data['surname']!.isEmpty &&
                    data['email']!.isEmpty
                ? [
                    const Icon(
                      Icons.description,
                      color: Colors.black,
                    ),
                    'Start here'
                  ]
                : [
                    Icon(Icons.warning, color: Colors.amber.shade600),
                    'Not completed'
                  ];
      case 'driver_photo':
        XFile? data = context.watch<RegistrationProvider>().driverPhoto;
        return data == null
            ? [
                const Icon(
                  Icons.description,
                  color: Colors.black,
                ),
                'Ready to begin'
              ]
            : [Icon(Icons.check_circle, color: Colors.green), 'Done'];

      case 'car_details':
        Map<String, String> data =
            context.watch<RegistrationProvider>().definitiveVehicleInfos;
        return data['brand_name']!.isNotEmpty &&
                data['model_name']!.isNotEmpty &&
                data['color']!.isNotEmpty &&
                data['plate_number']!.isNotEmpty
            ? [Icon(Icons.check_circle, color: Colors.green), 'Done']
            : data['brand_name']!.isEmpty &&
                    data['model_name']!.isEmpty &&
                    data['color']!.isEmpty &&
                    data['plate_number']!.isEmpty
                ? [
                    const Icon(
                      Icons.description,
                      color: Colors.black,
                    ),
                    'Ready to begin'
                  ]
                : [
                    Icon(Icons.warning, color: Colors.amber.shade600),
                    'Not completed'
                  ];
      case 'vehicle_photo':
        XFile? data = context.watch<RegistrationProvider>().carPhoto;
        return data == null
            ? [
                const Icon(
                  Icons.description,
                  color: Colors.black,
                ),
                'Ready to begin'
              ]
            : [Icon(Icons.check_circle, color: Colors.green), 'Done'];
      case 'license_photo':
        XFile? data = context.watch<RegistrationProvider>().licensePhoto;
        return data == null
            ? [
                const Icon(
                  Icons.description,
                  color: Colors.black,
                ),
                'Ready to begin'
              ]
            : [Icon(Icons.check_circle, color: Colors.green), 'Done'];
      case 'id_photo':
        XFile? data = context.watch<RegistrationProvider>().idPhoto;
        return data == null
            ? [
                const Icon(
                  Icons.description,
                  color: Colors.black,
                ),
                'Ready to begin'
              ]
            : [Icon(Icons.check_circle, color: Colors.green), 'Done'];
      default:
        return [
          const Icon(
            Icons.description,
            color: Colors.black,
          ),
          'Ready to begin'
        ];
    }
  }
}

class Options extends StatelessWidget {
  final String title;
  final String subTitle;
  final Widget icoRepr;
  final actuator;

  Options({
    Key? key,
    required this.title,
    required this.subTitle,
    required this.icoRepr,
    this.actuator,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: actuator,
      child: ListTile(
          contentPadding: EdgeInsets.zero,
          horizontalTitleGap: 5,
          leading: Container(
              alignment: Alignment.center,
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                  // border: Border.all(width: 1),
                  borderRadius: BorderRadius.circular(200)),
              child: icoRepr),
          title: Text(title,
              style:
                  const TextStyle(fontFamily: 'MoveTextMedium', fontSize: 16)),
          subtitle: Text(subTitle),
          trailing: Icon(Icons.arrow_forward_ios,
              size: 16, color: Colors.grey.shade400)),
    );
  }
}
