// ignore_for_file: file_names, non_constant_identifier_names

import 'dart:developer';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

//? HOME PROVIDER
// Will hold all the home related globals - only!

class HomeProvider with ChangeNotifier {
  final String bridge = 'http://localhost:9999';
  String user_fingerprint =
      '91ae265bca710a49756d90e382f9591dceba4b26cc03c01aaca3828145376321f9b8b401ae7e1efa41c99e7f210ecc191c62b2dc7bcda566e312378e1a1fdf1b';

  Map<dynamic, dynamic> locationServicesStatus = {
    'isLocationServiceEnabled': true,
    'isLocationPermissionGranted': true,
    'isLocationDeniedForever': false
  }; //Will hold the status of the GPRS service and the one of the location permission.
  late Map userLocationCoords = {}; //The user location coordinates: lat/long
  bool didAutomaticallyAskedForGprsPerm =
      false; //To know whether to ask for permission again or not.

  Map<String, dynamic> userLocationDetails =
      {}; //The details of the user location: city, location name

  List<dynamic> tripRequestsData = []; //Will contain the trips metata

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

  //?9. Update user's current location
  void updateUsersCurrentLocation(
      {required Map<String, dynamic> newCurrentLocation}) {
    //Replace name by location_name
    newCurrentLocation['location_name'] = newCurrentLocation['street'];
    if (!mapEquals(newCurrentLocation, userLocationDetails)) //New data received
    {
      userLocationDetails = newCurrentLocation;
      notifyListeners();
    }
  }

  //?10. Update the trips metadata
  void updateTripRequestsMetadata({required List<dynamic> newTripList}) {
    if (!listEquals(tripRequestsData, newTripList)) {
      tripRequestsData = newTripList;
      notifyListeners();
    }
  }
}
