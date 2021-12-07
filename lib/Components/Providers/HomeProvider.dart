// ignore_for_file: file_names, non_constant_identifier_names

import 'dart:developer';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

//? HOME PROVIDER
// Will hold all the home related globals - only!

class HomeProvider with ChangeNotifier {
  final String bridge = 'http://192.168.8.104:9999';
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

  String selectedOption =
      'ride'; //The current selected option: ride, delivery, scheduled, accepted

  final Map<String, String> mapOptionsToCodes = {
    'Accepted trips': 'accepted',
    'Rides': 'ride',
    'Scheduled': 'scheduled'
  };

  final Map<String, String> codesToOptions = {
    'accepted': 'Accepted trips',
    'ride': 'Rides',
    'scheduled': 'Scheduled'
  };

  bool shouldShowMainLoader = true; //If to show the central main loader
  //...Accepting requests processes
  Map<String, dynamic> targetRequestProcessor = {
    'isProcessingRequest': false, //If a request is being accepted
    'request_fp': '', //The fingerprint of the request being accepted
  };

  bool shouldShowBlurredBackground = false;

  Map tmpSelectedTripData =
      {}; //The temporarily selected trip data for details viewing.
  //...

  //?4. Update the GPRS service status and the location permission
  void updateGPRSServiceStatusAndLocationPermissions(
      {required bool gprsServiceStatus,
      required bool locationPermission,
      bool isDeniedForever = false}) {
    // print(locationServicesStatus.toString());

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
      //Update the select trip data if new
      if (tmpSelectedTripData['request_fp'] != null) //Has selected some trips
      {
        tripRequestsData.map((trip) {
          if (trip['request_fp'] ==
              tmpSelectedTripData['request_fp']) //Same as the selected trip
          {
            updateTmpSelectedTripsData(data: trip);
          }
        });
      }

      notifyListeners();
    }
  }

  //?11. Update the selected switch option
  void updateSelectedSwitchOption({required String newOption}) {
    selectedOption = newOption;
    notifyListeners();
  }

  //? 12. Update main loader visibility
  void updateMainLoaderVisibility({required bool option}) {
    if (shouldShowMainLoader != option) {
      shouldShowMainLoader = option;
      notifyListeners();
    }
  }

  //? 13. Update the targeted requests processor
  void updateTargetedRequestPro(
      {required bool isBeingProcessed, required String request_fp}) {
    targetRequestProcessor['isProcessingRequest'] = isBeingProcessed;
    targetRequestProcessor['request_fp'] = request_fp;
    notifyListeners();
  }

  //? 14. Update blurred background status
  void updateBlurredBackgroundState({required bool shouldShow}) {
    shouldShowBlurredBackground = shouldShow;
    notifyListeners();
  }

  //? 15. Update the tmp selected trips data for details.
  void updateTmpSelectedTripsData({required Map data}) {
    if (!mapEquals(data, tmpSelectedTripData)) //New data
    {
      tmpSelectedTripData = data;
      notifyListeners();
    }
  }
}
