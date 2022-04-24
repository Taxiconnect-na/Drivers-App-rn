// ignore_for_file: file_names, non_constant_identifier_names

import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

//? HOME PROVIDER
// Will hold all the home related globals - only!

class HomeProvider with ChangeNotifier {
  // final String bridge = 'http://localhost:9999';
  final String bridge = 'https://taxiconnectnanetwork.com:9999';

  late AnimationController controllerSwicther; //The bottom switcher animator

  Map<dynamic, dynamic> onlineOfflineData = {
    'flag': 'offline'
  }; //! Will hold the online/offline and suspension status of the driver

  Map<String, bool> goingOnlineOfflineVars = {
    'isGoingOnline': false,
    'isGoingOffline': false
  }; //Vars to manage to going online and offline states.

  late String logginStatus =
      'out'; //! To know if the user is logged in (logged) or out (out)

  String user_fingerprint =
      ''; //Will hold the single user fp that can also be found in the user account details var

  Map<dynamic, dynamic> userAccountDetails =
      {}; //Will contain all the account details

  Map<dynamic, dynamic> generalNumbers =
      {}; //Will hold all the drivers general numbers: rides, deliveries, trips, revenue, rating,...

  List rideHistory = []; //Will hold the ride history list

  String tempoRideHistoryFocusedFP =
      ''; //Will hold the currently selected ride history f[]
  List rideHistorySelectedData =
      []; //Will hold the data for the temporarily selected ride history record.

  String userStatus =
      'known_user'; //Tempo variable to hold the status of the user : new_user or registered_user

  String otpValue = ''; //Will hold the OTP value

  bool shouldShowGenericLoader = true; //If should show the generic loader

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
    'Deliveries': 'delivery',
    'Scheduled': 'scheduled'
  };

  final Map<String, String> codesToOptions = {
    'accepted': 'Accepted trips',
    'ride': 'Rides',
    'delivery': 'Deliveries',
    'scheduled': 'Scheduled'
  };

  bool shouldShowMainLoader = true; //If to show the central main loader
  //...Accepting requests processes
  Map<String, dynamic> targetRequestProcessor = {
    'isProcessingRequest': false, //If a request is being accepted
    'request_fp': '', //The fingerprint of the request being accepted
  };
  //...Declining requests
  Map<String, dynamic> declineRequestProcessor = {
    'isProcessingRequest': false, //If a request is being accepted
    'request_fp': '', //The fingerprint of the request being accepted
  };

  bool shouldShowBlurredBackground = false;

  Map tmpSelectedTripData =
      {}; //The temporarily selected trip data for details viewing.

  //Requests graphs
  Map requestsGraphData = {
    'rides': 0,
    'deliveries': 0,
    'scheduled': 0,
    'accepted': 0
  }; //Will contain the requests graph data

  //Wallet data
  Map walletData = {}; //Will hold all the wallet data
  //Transactions data
  Map walletTransactionsData = {}; //Will hold all the wallet transactions data
  //Auth & daily earning data
  Map authAndDailyEarningsData =
      {}; //Will hold all the authentication and daily earnings for the driver.

  //Selected country code for phone input
  Map selectedCountryCodeData = {
    "name": "Namibia",
    "flag": "🇳🇦",
    "code": "NA",
    "dial_code": "+264"
  }; //Defaults - Namibia
  String enteredPhoneNumber = ''; //Default - empty
  //...Camera
  late CameraController cameraController;
  //...

  //! Persist data map
  void peristDataMap() {
    Map<String, dynamic> globalStateData = toMap();
    String stateString = json.encode(globalStateData).toString();

    // log(globalStateData.toString());

    //Write
    writeStateToFile(stateString);
  }

  //! Restore data map
  void restoreStateData({required BuildContext context}) {
    // print('Restore registration provider state - Home');
    Future<Map<String, dynamic>> restoredState = readStateFile();
    restoredState.then((state) {
      // print(state);
      if (state['logginStatus'] == 'out' ||
          state['logginStatus'] == null) //?No state saved yet
      {
        log('No state saved found - HOME');
        Navigator.of(context).pushNamed('/Entry');
        //? Close loader
        // isLoadingRegistration = false;
        //?....
        notifyListeners();
      } else //Found a saved state
      {
        log('Found saved home state - HOME');
        //? Restore
        logginStatus = state['logginStatus'];
        user_fingerprint = state['user_fingerprint'];
        userAccountDetails = state['userAccountDetails'];
        userStatus = state['userStatus'];

        //Check the user nature
        if (state['userStatus'] ==
            'new_user') //New user - check if RIDE or COURIER or nothing yet
        {
          if (context.read<RegistrationProvider>().driverNature ==
              'RIDE') //Ride registration
          {
            //CHeck the driver person
            if (context.read<RegistrationProvider>().driverTypeProperty ==
                'TAXI') {
              Navigator.of(context).pushNamed('/RegistrationRide');
            } else //INDIVIDUAL
            {
              Navigator.of(context).pushNamed('/RegistrationRideIndividual');
            }
          } else if (context.read<RegistrationProvider>().driverNature ==
              'COURIER') //Courier registration
          {
            Navigator.of(context).pushNamed('/RegistrationDelivery');
          } else //Nothing yet selected
          {
            Navigator.of(context).pushNamed('/SignupEntry');
          }
        } else //Registered user
        {
          Navigator.of(context).pushNamed('/Home');
        }
        //?....
        notifyListeners();
      }
    });
  }

  //The higher order absolute class
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  //The full file path
  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/homeProvider.txt');
  }

  //Write to file
  Future<File> writeStateToFile(String state) async {
    final file = await _localFile;

    // Write the file
    return file.writeAsString(state);
  }

  //Read file
  Future<Map<String, dynamic>> readStateFile() async {
    try {
      final file = await _localFile;

      // Read the file
      final contents = await file.readAsString();

      return json.decode(contents);
    } catch (e) {
      log('5');
      log(e.toString());
      // If encountering an error, return 0
      return {};
    }
  }

  //! Convert class to Map
  Map<String, dynamic> toMap() {
    return {
      'logginStatus': logginStatus,
      'user_fingerprint': user_fingerprint,
      'userAccountDetails': userAccountDetails,
      'userStatus': userStatus
    };
  }

  //! Clear everything
  void clearEverything() {
    logginStatus = 'out';
    user_fingerprint = '';
    userAccountDetails = {};
    userStatus = 'new_user';
    tripRequestsData = [];
    //...
    peristDataMap();
    //...
    // notifyListeners();
  }
  //!-----------------

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
      // print('UPDATED GLOBAL STATE FOR LOCATION SERVICE STATUS');
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
      // print('Updated location with new ones');
      //..
      notifyListeners();
    }
  }

  //? 5. Update the automatic asking for gprs coordinate
  void updateAutoAskGprsCoords({required bool didAsk}) {
    if (didAutomaticallyAskedForGprsPerm != didAsk) //New data
    {
      // print('UPDATING AUTO ASK FOR GPRS COORDS.');
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
    if (tripRequestsData.toString() != newTripList.toString()) {
      tripRequestsData = newTripList;
      //Update the select trip data if new
      if (tmpSelectedTripData['request_fp'] != null) //Has selected some trips
      {
        for (int i = 0; i < newTripList.length; i++) {
          if (newTripList[i]['request_fp'] ==
              tmpSelectedTripData['request_fp']) //Same as the selected trip
          {
            log('New trip data detected');
            updateTmpSelectedTripsData(data: newTripList[i]);
          }
        }
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
  void updateMainLoaderVisibility(
      {required bool option, bool shouldUpdate = true}) {
    if (shouldShowMainLoader != option) {
      shouldShowMainLoader = option;
      if (shouldUpdate) {
        notifyListeners();
      }
    }
  }

  //? 13. Update the targeted requests processor
  void updateTargetedRequestPro(
      {required bool isBeingProcessed, required String request_fp}) {
    targetRequestProcessor['isProcessingRequest'] = isBeingProcessed;
    targetRequestProcessor['request_fp'] = request_fp;
    notifyListeners();
  }

  //? 13.b Update the targeted requests processor for declined requests
  void updateTargetedDeclinedRequestPro(
      {required bool isBeingProcessed, required String request_fp}) {
    declineRequestProcessor['isProcessingRequest'] = isBeingProcessed;
    declineRequestProcessor['request_fp'] = request_fp;
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

  //? 16. Update requests graph data
  void updateRequestsGraphData({required Map data}) {
    if (!mapEquals(data, requestsGraphData)) {
      requestsGraphData = data;
      notifyListeners();
    }
  }

  //? 17. Update the wallet data
  void updateWalletData({required Map data}) {
    if (data.toString() != walletData.toString()) //New data
    {
      walletData = data;
      notifyListeners();
    }
  }

  //? 18. Update the wallet transactional data
  void updateWalletTransactionalData({required Map data}) {
    if (data.toString() != walletTransactionsData.toString()) //New data
    {
      walletTransactionsData = data;
      notifyListeners();
    }
  }

  //? 18. Update Auth earning data
  void updateAuthEarningData({required Map data}) {
    if (data.toString() != authAndDailyEarningsData.toString() ||
        selectedOption !=
            data['supported_requests_types']
                .toString()
                .toLowerCase()) //New data
    {
      authAndDailyEarningsData = data;
      //Auto selected ride/delivery based on the supported request type
      if (data['supported_requests_types'] == 'Ride' &&
          selectedOption == 'delivery') {
        selectedOption = 'ride';
      } else if (data['supported_requests_types'] == 'Delivery' &&
          selectedOption == 'ride') {
        selectedOption = 'delivery';
      }
      //...
      notifyListeners();
    }
  }

  //? 19. Update selected country code
  void updateSelectedCountryCode({required Map dialData}) {
    selectedCountryCodeData = dialData;
    // log(dialData.toString());
    notifyListeners();
  }

  //? 20. Update entered phone number
  void updateEnteredPhoneNumber({required String phone}) {
    enteredPhoneNumber = phone;
    log(phone);
    notifyListeners();
  }

  //? 21. Update the account details
  void updateAccountDetails({required Map<dynamic, dynamic> data}) {
    userAccountDetails = data;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }

  //?22. Update the user fp
  void updateUserFpData({required String data}) {
    user_fingerprint = data;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }

  //?23. Update the user's registration status
  void updateRegistrationStatus({required String data}) {
    userStatus = data;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }

  //?24. Update the otp value
  void updateOTPValueData({required String data}) {
    otpValue = data;
    notifyListeners();
  }

  //?25. Update the generic loader status
  void updateGenericLoaderShow({required bool state}) {
    shouldShowGenericLoader = state;
    notifyListeners();
  }

  //?26. Update the loggin status
  void updateLogginStatus({required String status}) {
    logginStatus = status;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }

  //? 27. Update the online/offline and suspension data
  void updateOnlineOfflineData({required Map<dynamic, dynamic> data}) {
    onlineOfflineData = data;
    notifyListeners();
  }

  //? 28. Update the going online state
  void updateGoingOnlineOffline(
      {required String scenario, required bool state}) {
    switch (scenario) {
      case 'online':
        goingOnlineOfflineVars['isGoingOnline'] = state;
        notifyListeners();
        break;
      case 'offline':
        goingOnlineOfflineVars['isGoingOffline'] = state;
        notifyListeners();
        break;
      default:
    }
  }

  //? 29. Update the drivers general numbers
  void updateDriverGeneralNumbers({required Map<dynamic, dynamic> data}) {
    generalNumbers = data;
    notifyListeners();
  }

  //? 30. Update the ride history list
  void updateRideHistoryList({required List data}) {
    rideHistory = data;
    notifyListeners();
  }

  //? 31. Update the tempo selected ride history fp
  void updateTempoRideHistorySelected({required String data}) {
    tempoRideHistoryFocusedFP = data;
    notifyListeners();
  }

  //? 32. Update ride history selected record data
  void updateRideHistorySelectedData({required List data}) {
    rideHistorySelectedData = data;
    notifyListeners();
  }

  //? 33. Initialize the animation controller
  void initializeAnimationSwictherController(
      {required AnimationController controller}) {
    controllerSwicther = controller;
    // notifyListeners();
  }
}
