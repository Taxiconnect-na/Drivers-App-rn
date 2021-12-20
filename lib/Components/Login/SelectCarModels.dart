import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/CarsBrandsModels.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class SelectCarModels extends StatefulWidget {
  const SelectCarModels({Key? key}) : super(key: key);

  @override
  _SelectCarModelsState createState() => _SelectCarModelsState();
}

class _SelectCarModelsState extends State<SelectCarModels> {
  List<Map<String, dynamic>> carsData = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //...
    carsData = context.read<RegistrationProvider>().selectedBrandName['models'];
  }

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
          title: const Text('Models',
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
                            List<Map<String, dynamic>> originalList = context
                                .read<RegistrationProvider>()
                                .selectedBrandName['models'];

                            carsData = originalList
                                .where((u) => (u['title']
                                    .toLowerCase()
                                    .contains(valueSearch.toLowerCase())))
                                .toList();
                          } else //Original list
                          {
                            carsData = context
                                .read<RegistrationProvider>()
                                .selectedBrandName['models'];
                          }
                        });
                      },
                      decoration: InputDecoration(
                          prefixIcon: Icon(Icons.search, color: Colors.black),
                          filled: true,
                          fillColor: Colors.grey.shade200,
                          floatingLabelStyle:
                              const TextStyle(color: Colors.black),
                          label: Text('Search vehicle model'),
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
              genericTileData(context: context, brand: carsData[index]),
          separatorBuilder: (context, index) => Divider(
                thickness: 1,
              ),
          itemCount: carsData.length),
    );
  }

  //Generic tile data
  Widget genericTileData({required BuildContext context, required Map brand}) {
    return ListTile(
      onTap: () {
        //Update the select vehicle
        context
            .read<RegistrationProvider>()
            .updateVehicleModel(model: brand['title']);
        //Go to next page
        Navigator.of(context).pushNamed('/SelectCarColor');
      },
      contentPadding: EdgeInsets.only(left: 20, right: 20),
      title: Text(
        brand['title'],
        style: TextStyle(
          fontSize: 17,
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        color: Color.fromRGBO(9, 110, 212, 1),
        size: 18,
      ),
    );
  }
}
