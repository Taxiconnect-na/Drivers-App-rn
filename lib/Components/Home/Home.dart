// ignore_for_file: file_names

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/LocationOpsHandler.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Watcher.dart';
import 'package:taxiconnectdrivers/Components/Home/CenterArea.dart';
import 'package:taxiconnectdrivers/Components/Home/DrawerMenu.dart';
import 'package:taxiconnectdrivers/Components/Home/HeaderGeneral.dart';
import 'package:taxiconnectdrivers/Components/Home/SwitcherArea.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  // Create a new networking instance
  GlobalDataFetcher globalDataFetcher = GlobalDataFetcher();
  GetRequestsGraphNet getRequestsGraphNet = GetRequestsGraphNet();
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
      {'name': 'LocationOpsHandler', 'actuator': locationOpsHandler},
      {'name': 'GetRequestsGraphData', 'actuator': getRequestsGraphNet}
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        drawer: const DrawerMenu(),
        body: Container(
          decoration: BoxDecoration(border: Border.all(color: Colors.black)),
          child: Stack(children: [
            Column(
              children: [
                HeaderGeneral(),
                LoaderInstance(),
                CenterArea(),
                SwictherArea(),
              ],
            ),
            Visibility(
              visible:
                  context.watch<HomeProvider>().shouldShowBlurredBackground,
              child: SizedBox(
                  // color: Colors.red,
                  height: 50,
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                    child: const SizedBox(height: 20, width: 20),
                  )),
            )
          ]),
        ));
  }
}

class LoaderInstance extends StatelessWidget {
  const LoaderInstance({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: context.watch<HomeProvider>().shouldShowMainLoader,
      child: SizedBox(
        height: 2,
        width: MediaQuery.of(context).size.width,
        child: LinearProgressIndicator(
          backgroundColor: Colors.grey.withOpacity(0.15),
          color: Colors.black,
        ),
      ),
    );
  }
}
