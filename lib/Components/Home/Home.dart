// ignore_for_file: file_names

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
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
  GetOnlineOfflineStatus _getOnlineOfflineStatus = GetOnlineOfflineStatus();
  GlobalDataFetcher globalDataFetcher = GlobalDataFetcher();
  GetRequestsGraphNet getRequestsGraphNet = GetRequestsGraphNet();
  GetDailyEarningAndAuthChecks getDailyEarningAndAuthChecks =
      GetDailyEarningAndAuthChecks();
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
      {'name': 'GetOnlineOfflineStatus', 'actuator': _getOnlineOfflineStatus},
      {
        'name': 'GlobalDataFetcher',
        'actuator': globalDataFetcher
      }, //Get trips data
      {'name': 'LocationOpsHandler', 'actuator': locationOpsHandler},
      {'name': 'GetRequestsGraphData', 'actuator': getRequestsGraphNet},
      {
        'name': 'GetDailyEarningAndAuthChecks',
        'actuator': getDailyEarningAndAuthChecks
      }
    ]);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    globalDataFetcher.dispose();
    locationOpsHandler.dispose();
    watcher.dispose();
  }

  @override
  Widget build(BuildContext context) {
    OneSignal.shared.setAppId("a7e445ea-0852-4bdc-afd0-345c9cd30095");

    // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.shared.promptUserForPushNotificationPermission().then((accepted) {
      // print("Accepted permission: $accepted");
    });

    OneSignal.shared
        .setSubscriptionObserver((OSSubscriptionStateChanges changes) {
      // Will be called whenever the subscription changes
      // (ie. user gets registered with OneSignal and gets a user ID)
      print(changes);
    });
    OneSignal.shared.getDeviceState().then((deviceState) {
      context
          .read<HomeProvider>()
          .updatePushnotification_token(data: deviceState?.jsonRepresentation());
      // print("DeviceState: ${deviceState?.jsonRepresentation()}");
    });

    return WillPopScope(
      onWillPop: () async {
        return Future.value(false);
      },
      child: Scaffold(
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
          )),
    );
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
