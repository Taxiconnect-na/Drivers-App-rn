// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Helpers/LocationOpsHandler.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Watcher.dart';
import 'package:taxiconnectdrivers/Components/Home/CenterArea.dart';
import 'package:taxiconnectdrivers/Components/Home/DrawerMenu.dart';
import 'package:taxiconnectdrivers/Components/Home/HeaderGeneral.dart';
import 'package:taxiconnectdrivers/Components/Home/SwitcherArea.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  // Create a new networking instance
  GlobalDataFetcher globalDataFetcher = GlobalDataFetcher();
  late LocationOpsHandler locationOpsHandler;
  Watcher watcher = Watcher();

  //Initialize socket events
  void initState() {
    super.initState();

    //Start with the timers
    //Location operation handlers
    locationOpsHandler = LocationOpsHandler(context: context);
    //Ask once for the location permission
    locationOpsHandler.requestLocationPermission();
    //globalDataFetcher.getCoreDate(context: context);
    watcher.startWatcher(context: context, actuatorFunctions: [
      {
        'name': 'GlobalDataFetcher',
        'actuator': globalDataFetcher
      }, //Get trips data
      {'name': 'LocationOpsHandler', 'actuator': locationOpsHandler}
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        drawer: const DrawerMenu(),
        body: Container(
          decoration: BoxDecoration(border: Border.all(color: Colors.black)),
          child: Column(
            children: const [HeaderGeneral(), CenterArea(), SwictherArea()],
          ),
        ));
  }
}
