import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/CarsBrandsModels.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class SelectCarColor extends StatefulWidget {
  const SelectCarColor({Key? key}) : super(key: key);

  @override
  _SelectCarColorState createState() => _SelectCarColorState();
}

class _SelectCarColorState extends State<SelectCarColor> {
  List<Map<String, dynamic>> vehicleColor = CarsBrandsModels().carColors;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black,
          leading: IconButton(
            padding: EdgeInsets.only(left: 0),
            visualDensity: VisualDensity.comfortable,
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(Icons.arrow_back),
          ),
          title: const Text('Vehicle color',
              style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
        ),
        body: Container(
          // color: Colors.red,
          alignment: Alignment.topLeft,
          child: SafeArea(
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(
                    height: 25,
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 20, right: 20),
                    child: TextField(
                      onChanged: (valueSearch) {
                        setState(() {
                          if (valueSearch.isNotEmpty) {
                            List<Map<String, dynamic>> originalList =
                                CarsBrandsModels().carColors;

                            vehicleColor = originalList
                                .where((u) => (u['name']
                                    .toLowerCase()
                                    .contains(valueSearch.toLowerCase())))
                                .toList();
                          } else //Original list
                          {
                            vehicleColor = CarsBrandsModels().carColors;
                          }
                        });
                      },
                      decoration: InputDecoration(
                          prefixIcon: Icon(Icons.search, color: Colors.black),
                          filled: true,
                          fillColor: Colors.grey.shade200,
                          floatingLabelStyle:
                              const TextStyle(color: Colors.black),
                          label: Text('Search vehicle color'),
                          enabledBorder: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.grey.shade200)),
                          focusedBorder: OutlineInputBorder(
                              borderSide: const BorderSide(
                                  color: Color.fromRGBO(9, 110, 212, 1)),
                              borderRadius: BorderRadius.circular(1)),
                          border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.grey.shade200),
                              borderRadius: BorderRadius.circular(1))),
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  showListBrands(context: context)
                ]),
          ),
        ));
  }

  //SHow list of cars brands
  Widget showListBrands({required BuildContext context}) {
    return Expanded(
      child: ListView.separated(
          itemBuilder: (context, index) =>
              genericTileData(context: context, specs: vehicleColor[index]),
          separatorBuilder: (context, index) => Divider(
                thickness: 1,
              ),
          itemCount: vehicleColor.length),
    );
  }

  //Generic tile data
  Widget genericTileData({required BuildContext context, required Map specs}) {
    return ListTile(
      onTap: () {
        //Update the select vehicle
        context
            .read<RegistrationProvider>()
            .updateSelectedVehicleColor(color: specs['name']);
        //! Update the definitive data
        //Brand
        context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
            nature: 'brand_name',
            data: context
                .read<RegistrationProvider>()
                .selectedBrandName['brand']);
        //Model
        context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
            nature: 'model_name',
            data: context.read<RegistrationProvider>().selectedModelName);
        //Color
        context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
            nature: 'color',
            data: context.read<RegistrationProvider>().selectedVehicleColor);
        //Go back to car selection
        Navigator.of(context).pushReplacementNamed('/SelectCar');
      },
      contentPadding: EdgeInsets.only(left: 20, right: 20),
      leading: Container(
        decoration: BoxDecoration(
            border: Border.all(width: 1, color: Colors.grey),
            borderRadius: BorderRadius.circular(150),
            color: specs['color']),
        width: 25,
        height: 25,
      ),
      horizontalTitleGap: 0,
      title: Text(
        specs['name'],
        style: TextStyle(
          fontSize: 17,
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        color: Colors.grey,
        size: 18,
      ),
    );
  }
}
