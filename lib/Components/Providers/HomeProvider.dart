// ignore_for_file: file_names

import 'dart:developer';

import 'package:flutter/material.dart';

//? HOME PROVIDER
// Will hold all the home related globals - only!

class HomeProvider with ChangeNotifier {
  Map<dynamic, dynamic> locationServicesStatus = {
    'isLocationServiceEnabled': false,
    'isLocationPermissionGranted': false,
    'isLocationDeniedForever': false
  }; //Will hold the status of the GPRS service and the one of the location permission.
  late Map userLocationCoords = {}; //The user location coordinates: lat/long
  bool didAutomaticallyAskedForGprsPerm =
      false; //To know whether to ask for permission again or not.

  //?4. Update the GPRS service status and the location permission
  void updateGPRSServiceStatusAndLocationPermissions(
      {required bool gprsServiceStatus,
      required bool locationPermission,
      bool isDeniedForever = false}) {
    print(locationServicesStatus.toString());

    if (gprsServiceStatus !=
            locationServicesStatus['isLocationServiceEnabled'] ||
        locationPermission !=
            locationServicesStatus['isLocationPermissionGranted'] ||
        locationServicesStatus['isLocationDeniedForever'] !=
            isDeniedForever) //new values received
    {
      locationServicesStatus['isLocationServiceEnabled'] = gprsServiceStatus;
      locationServicesStatus['isLocationPermissionGranted'] =
          locationPermission;
      locationServicesStatus['isLocationDeniedForever'] = isDeniedForever;
      //...Update
      print('UPDATED GLOBAL STATE FOR LOCATION SERVICE STATUS');
      notifyListeners();
    }
  }

  //?5. Update the rider's location coordinates
  void updateRidersLocationCoordinates(
      {required double latitude, required double longitude}) {
    if (userLocationCoords['latitude'] != latitude &&
        userLocationCoords['longitude'] != longitude) //new Data received
    {
      userLocationCoords['latitude'] = latitude;
      userLocationCoords['longitude'] = longitude;
      print('Updated location with new ones');
      //..
      notifyListeners();
    }
  }

  //? 5. Update the automatic asking for gprs coordinate
  void updateAutoAskGprsCoords({required bool didAsk}) {
    if (didAutomaticallyAskedForGprsPerm != didAsk) //New data
    {
      print('UPDATING AUTO ASK FOR GPRS COORDS.');
      didAutomaticallyAskedForGprsPerm = didAsk;
    }
  }
}
