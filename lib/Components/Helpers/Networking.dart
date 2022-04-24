// ignore_for_file: file_names, library_prefixes

import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:taxiconnectdrivers/Components/Helpers/Modal.dart';
import 'package:taxiconnectdrivers/Components/Helpers/ModalReg.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Sound.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class getRideHistoryTargeted {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/getRides_historyRiders_batchOrNot'));

    //Assemble the bundle data
    //* @param type: the type of request (past, scheduled, business)
    Map<String, String> bundleData = {
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint,
      'target': 'single',
      'user_nature': 'driver',
      'request_fp': context.read<HomeProvider>().tempoRideHistoryFocusedFP
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGet = json.decode(response.body);
        if (responseGet['response'] == 'success') //Go the data
        {
          //Deactivate the loader
          context
              .read<HomeProvider>()
              .updateMainLoaderVisibility(option: false);
          // log(responseGet.toString());
          //!remove any False
          List data = responseGet['data'];
          //....
          context
              .read<HomeProvider>()
              .updateRideHistorySelectedData(data: data);
        } else //No data
        {
          resetRideHistoryList(context: context);
        }
      } else //Has some errors
      {
        //Mark as offline
        // log(response.statusCode.toString());
        resetRideHistoryList(context: context);
      }
    } catch (e) {
      log('8');
      log(e.toString());
      resetRideHistoryList(context: context);
    }
  }

  //Reset the ride history to 0
  void resetRideHistoryList({required BuildContext context}) {
    //Deactivate the loader
    context.read<HomeProvider>().updateMainLoaderVisibility(option: false);
  }
}

class getRideHistoryBatch {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/getRides_historyRiders_batchOrNot'));

    //Assemble the bundle data
    //* @param type: the type of request (past, scheduled, business)
    Map<String, String> bundleData = {
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint,
      'ride_type': 'past',
      'user_nature': 'driver',
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGet = json.decode(response.body);
        if (responseGet['response'] == 'success') //Go the data
        {
          //Deactivate the loader
          context
              .read<HomeProvider>()
              .updateMainLoaderVisibility(option: false);
          // log(responseGet.toString());
          //!remove any False
          List rawData = responseGet['data'];
          List filteredData = rawData
              .where((element) => element != false && element != null)
              .toList();
          //....
          context
              .read<HomeProvider>()
              .updateRideHistoryList(data: filteredData);
        } else //No data
        {
          resetRideHistoryList(context: context);
        }
      } else //Has some errors
      {
        //Mark as offline
        // log(response.statusCode.toString());
        resetRideHistoryList(context: context);
      }
    } catch (e) {
      log('9');
      log(e.toString());
      resetRideHistoryList(context: context);
    }
  }

  //Reset the ride history to 0
  void resetRideHistoryList({required BuildContext context}) {
    //Deactivate the loader
    context.read<HomeProvider>().updateMainLoaderVisibility(option: false);
    context.read<HomeProvider>().updateRideHistoryList(data: []);
  }
}

class GetDriverGeneralNumbers {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/driversOverallNumbers'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGet = json.decode(response.body);
        if (responseGet['rides'] != null) //Got something
        {
          context
              .read<HomeProvider>()
              .updateDriverGeneralNumbers(data: responseGet);
        } else //Error?
        {
          context.read<HomeProvider>().updateDriverGeneralNumbers(data: {});
        }
      } else //Has some errors
      {
        // log(response.statusCode.toString());
        context.read<HomeProvider>().updateDriverGeneralNumbers(data: {});
      }
    } catch (e) {
      log('10');
      log(e.toString());
      context.read<HomeProvider>().updateDriverGeneralNumbers(data: {});
    }
  }
}

class GetOnlineOfflineStatus {
  Future execGet({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/goOnline_offlineDrivers_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'action': 'get',
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGet = json.decode(response.body);
        if (context.toString().contains('no widget') == false) {
          context
              .read<HomeProvider>()
              .updateOnlineOfflineData(data: responseGet);
        }
      } else //Has some errors
      {
        //Mark as offline
        // log(response.statusCode.toString());
        if (context.toString().contains('no widget') == false) {
          context.read<HomeProvider>().updateOnlineOfflineData(data: {
            "response": "successfully_got",
            "flag": "offline",
            "suspension_infos": {"is_suspended": false, "message": false}
          });
        }
      }
    } catch (e) {
      log('11');
      log(e.toString());
      if (context.toString().contains('no widget') == false) {
        context.read<HomeProvider>().updateOnlineOfflineData(data: {
          "response": "successfully_got",
          "flag": "offline",
          "suspension_infos": {"is_suspended": false, "message": false}
        });
      }
    }
  }
}

class SetOnlineOfflineStatus {
  final Sound _sound = Sound();

  Future execGet({required BuildContext context, required String state}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/goOnline_offlineDrivers_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint,
      'state': state, //online or offline
      'action': 'make',
    };

    // print(bundleData);

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        resetLoadingStates(context: context, state: state);
      } else //Has some errors
      {
        //Mark as offline
        // log(response.statusCode.toString());
        resetLoadingStates(context: context, state: state);
        showErrorGoingOnline(context: context);
      }
    } catch (e) {
      log('12');
      log(e.toString());
      resetLoadingStates(context: context, state: state);
      showErrorGoingOnline(context: context);
    }
  }

  //Show unable to go online modal
  void showErrorGoingOnline({required BuildContext context}) {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          return Container(
            color: Colors.white,
            child: SafeArea(
                child: Container(
              width: MediaQuery.of(context).size.width,
              color: Colors.white,
              child: const Modal(scenario: 'error_going_online'),
            )),
          );
        }).whenComplete(() {
      context.read<HomeProvider>().controllerSwicther.reverse();
      resetLoadingStates(context: context, state: 'online');
    });
  }

  //Reset the loading states
  void resetLoadingStates(
      {required BuildContext context, required String state}) {
    Timer(const Duration(milliseconds: 500), () {
      try {
        if (RegExp(r"no widget").hasMatch(context.toString())) //! Dirty state
        {
          _sound.playSound(audio: 'success.mp3');
        } else {
          context
              .read<HomeProvider>()
              .updateGoingOnlineOffline(scenario: 'online', state: false);
          context
              .read<HomeProvider>()
              .updateGoingOnlineOffline(scenario: 'offline', state: false);
          //Close modal if switch to offline
          if (state == 'offline') {
            // Empty the ride array
            context
                .read<HomeProvider>()
                .updateTripRequestsMetadata(newTripList: []);
            Navigator.of(context).pop();
          } else {
            _sound.playSound(audio: 'success.mp3');
          }
        }
      } on Exception catch (e) {
        // TODO
        log('13');
        log(e.toString());
      }
    });
  }
}

class GlobalDataFetcher with ChangeNotifier {
  Future getCoreDate({required BuildContext context}) async {
    Uri globalTrips = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/update_passenger_location'));

    // print('get code data called');
    Map<String, String> bundleData = {
      'latitude': context
          .read<HomeProvider>()
          .userLocationCoords['latitude']
          .toString(),
      'longitude': context
          .read<HomeProvider>()
          .userLocationCoords['longitude']
          .toString(),
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint,
      'pushnotif_token': 'abc',
      'user_nature': 'driver',
      'requestType': context.read<HomeProvider>().selectedOption,
      'app_version': '3.4.0'
    };

    // print(bundleData);

    ///....
    try {
      http.Response response = await http.post(globalTrips, body: bundleData);

      if (context.toString().contains('no widget') == false) {
        if (response.statusCode == 200) //well received
        {
          // log(response.body.toString());
          //Close the main loader
          context
              .read<HomeProvider>()
              .updateMainLoaderVisibility(option: false);
          // log(response.body.toString());
          if (response.body.toString() == '{"response":"no_requests"}' ||
              response.body.toString() == '{"response":"no_rides"}' ||
              response.body.toString() == '{"request_status":"no_rides"}' ||
              response.body.toString() ==
                  '{"response":"error"}') //No trips found
          {
            String responseGot = response.body.toString().contains('response')
                ? json.decode(response.body)['response']
                : json.decode(response.body)['request_status'];
            switch (responseGot) {
              case 'no_requests':
                // No rides fetched
                // log('No rides got');
                // Empty the ride array
                context
                    .read<HomeProvider>()
                    .updateTripRequestsMetadata(newTripList: []);
                break;
              case 'error':
                //Some error
                // log('Unexpected errors');
                // Empty the ride array
                context
                    .read<HomeProvider>()
                    .updateTripRequestsMetadata(newTripList: []);
                break;
              default:
                // Empty the ride array
                context
                    .read<HomeProvider>()
                    .updateTripRequestsMetadata(newTripList: []);
            }
          } else //Most likely got some rides - 100%
          {
            if (json.decode(response.body) != false) {
              if (context.read<HomeProvider>().selectedOption ==
                  json
                      .decode(response.body)[0]['request_type']
                      .toString()
                      .toLowerCase()) {
                //! Remove all the accepted results
                List results = json.decode(response.body);
                results.removeWhere((element) =>
                    element['ride_basic_infos']['isAccepted'] == true);
                //!--
                // log(response.body.toString());
                context
                    .read<HomeProvider>()
                    .updateTripRequestsMetadata(newTripList: results);
              } else if (context.read<HomeProvider>().selectedOption ==
                  'accepted') {
                // log(json.decode(response.body).toString());
                context.read<HomeProvider>().updateTripRequestsMetadata(
                    newTripList: json.decode(response.body));
              } else {
                context
                    .read<HomeProvider>()
                    .updateTripRequestsMetadata(newTripList: []);
              }
            } else //Inconsistent selected options
            {
              context
                  .read<HomeProvider>()
                  .updateTripRequestsMetadata(newTripList: []);
            }
          }
        } else //No proper result received
        {
          // log(response.body.toString());
          // Empty the ride array
          context
              .read<HomeProvider>()
              .updateTripRequestsMetadata(newTripList: []);
        }
      }
    } catch (e) {
      log('14');
      log(e.toString());
      print(context);
      if (context.toString().contains('no widget') == false) {
        context
            .read<HomeProvider>()
            .updateTripRequestsMetadata(newTripList: []);
      }
    }
  }
}

//Get request graphs
class GetRequestsGraphNet {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/update_requestsGraph'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        log(response.body.toString());
        updateGraphData(context: context, graph: json.decode(response.body));
      } else //Has some errors
      {
        print('HAS SOME ERRORS');
        updateGraphData(context: context, graph: {
          'rides': 0,
          'deliveries': 0,
          'scheduled': 0,
          'accepted': 0
        });
      }
    } catch (e) {
      log('15');
      log(e.toString());
      updateGraphData(
          context: context,
          graph: {'rides': 0, 'deliveries': 0, 'scheduled': 0, 'accepted': 0});
    }
  }

  //Update graph data
  void updateGraphData({required BuildContext context, required Map graph}) {
    if (context.toString().contains('no widget') == false) {
      context.read<HomeProvider>().updateRequestsGraphData(data: graph);
    }
  }
}

//Accept request
class AcceptRequestNet {
  Future exec(
      {required BuildContext context, required String request_fp}) async {
    //Init the sound
    Sound sound = Sound();

    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/accept_request_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'request_fp': request_fp,
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] ==
            'successfully_accepted') //Successfully accepted
        {
          //Close the processor loader
          CloseLoader(context, request_fp);
          // log('Accepted');
          context.read<HomeProvider>().updateBlurredBackgroundState(
              shouldShow: true); //Show blurred background

          showModalBottomSheet(
                  isDismissible: false,
                  enableDrag: false,
                  context: context,
                  builder: (context) {
                    sound.playSound();
                    //...
                    return Container(
                      color: Colors.white,
                      child: SafeArea(
                          bottom: false,
                          child: Container(
                            width: MediaQuery.of(context).size.width,
                            color: Colors.white,
                            child: const Modal(scenario: 'accepted_request'),
                          )),
                    );
                  })
              .whenComplete(() => context
                  .read<HomeProvider>()
                  .updateBlurredBackgroundState(shouldShow: false));
        } else //Unable to accept for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          // log('Unable to accept');
          UnableToAccept(context);
        }
      } else //Has some errors
      {
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        // log('Unable to accept');
        UnableToAccept(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);
      log('17');
      log(e.toString());
      UnableToAccept(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(milliseconds: 500), () {
        context
            .read<HomeProvider>()
            .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
        Navigator.of(context).pop();
      });
    }
    //Conditional popping & unblurred
    else {
      context
          .read<HomeProvider>()
          .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
    }
  }

  //Unable to accept request
  void UnableToAccept(BuildContext context) {
    context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child: const Modal(scenario: 'unable_to_accept_request'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
    });
  }
}

//Cancel request
class CancelRequestNet {
  Future exec(
      {required BuildContext context, required String request_fp}) async {
    //Init the sound
    Sound sound = Sound();

    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/cancel_request_driver_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'request_fp': request_fp,
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] ==
            'successfully_cancelled') //Successfully cancelled
        {
          //Close the processor loader
          // CloseLoader(context, request_fp);
          //! Remove the tmp selected data
          Timer(const Duration(milliseconds: 500), () {
            // Navigator.of(context).pop();
            Navigator.of(context).pop(() {
              //...
              context.read<HomeProvider>().updateTmpSelectedTripsData(data: {});
              context.read<HomeProvider>().updateBlurredBackgroundState(
                  shouldShow: false); //Show blurred background
            });
            context.read<HomeProvider>().updateTargetedRequestPro(
                isBeingProcessed: false, request_fp: '');
          });

          // log('Cancelled');
        } else //Unable to cancel for some reasons
        {
          // log(response.body.toString());
          if (json.decode(response.body)['response'] ==
              'unable_to_cancel_request_error_daily_cancellation_limit_exceeded') {
            context
                .read<HomeProvider>()
                .updateBlurredBackgroundState(shouldShow: true);
            showModalBottomSheet(
                context: context,
                builder: (context) {
                  //...
                  return Container(
                    color: Colors.white,
                    child: SafeArea(
                        bottom: false,
                        child: Container(
                          width: MediaQuery.of(context).size.width,
                          color: Colors.white,
                          child: const Modal(
                              scenario: 'warning_due_to_excessive_cancel'),
                        )),
                  );
                }).whenComplete(() {
              context
                  .read<HomeProvider>()
                  .updateBlurredBackgroundState(shouldShow: false);
            });
          } else {
            UnableToDo(context);
          }
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          log('Unable to cancel');
        }
      } else //Has some errors
      {
        // log(response.body.toString());
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        // log('Unable to cancel');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);
      log('16');
      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(milliseconds: 500), () {
        //! Remove the tmp selected data
        context.read<HomeProvider>().updateTmpSelectedTripsData(data: {});
        context
            .read<HomeProvider>()
            .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
        Navigator.of(context).pop();
      });
    }
    //Conditional popping & unblurred
    else {
      context
          .read<HomeProvider>()
          .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
    }
  }

  //Unable to process request
  void UnableToDo(BuildContext context) {
    context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child: const Modal(scenario: 'unable_to_cancel_request'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
    });
  }
}

//Confirm pickup
class ConfirmPickupRequestNet {
  Future exec(
      {required BuildContext context, required String request_fp}) async {
    //Init the sound
    Sound sound = Sound();

    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/confirm_pickup_request_driver_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'request_fp': request_fp,
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] ==
            'successfully_confirmed_pickup') //Successfully confirmed
        {
          //Close the processor loader
          CloseLoader(context, request_fp);
          log('confirmed pickup');
        } else //Unable to cancel for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          log('Unable to confirm pickup');
          UnableToDo(context);
        }
      } else //Has some errors
      {
        log(response.statusCode.toString());
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        log('Unable to confirm pickup');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);
      log('18');
      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(milliseconds: 500), () {
        context
            .read<HomeProvider>()
            .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
        Navigator.of(context).pop();
      });
    }
    //Conditional popping & unblurred
    else {
      context
          .read<HomeProvider>()
          .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
    }
  }

  //Unable to process request
  void UnableToDo(BuildContext context) {
    context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child:
                      const Modal(scenario: 'unable_to_confirmPickup_request'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
    });
  }
}

//Decline request
class DeclineRequestNet {
  Future exec(
      {required BuildContext context, required String request_fp}) async {
    //Init the sound
    Sound sound = Sound();

    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/declineRequest_driver'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'request_fp': request_fp,
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] ==
            'successfully_declined') //Successfully declined
        {
          //Close the processor loader
          CloseLoader(context, request_fp);
          log('Declined');
        } else //Unable to cancel for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          log('Unable to decline');
          UnableToDo(context);
        }
      } else //Has some errors
      {
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        log('Unable to decline');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);
      log('19');
      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(milliseconds: 500), () {
        context.read<HomeProvider>().updateTargetedDeclinedRequestPro(
            isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
      });
    }
    //Conditional popping & unblurred
    else {
      context.read<HomeProvider>().updateTargetedDeclinedRequestPro(
          isBeingProcessed: false, request_fp: '');
    }
  }

  //Unable to process request
  void UnableToDo(BuildContext context) {
    context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child: const Modal(scenario: 'unable_to_decline_request'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
    });
  }
}

//Confirm dropoff
class ConfirmDropoffRequestNet {
  Future exec(
      {required BuildContext context, required String request_fp}) async {
    //Init the sound
    // Sound sound = Sound();

    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/confirm_dropoff_request_driver_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'request_fp': request_fp,
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] ==
            'successfully_confirmed_dropoff') //Successfully confirmed
        {
          //Close the processor loader
          //! Remove the tmp selected data
          Timer(const Duration(milliseconds: 500), () {
            Navigator.of(context).pop();
            Navigator.of(context).pop(() {
              //...
              context.read<HomeProvider>().updateTmpSelectedTripsData(data: {});
              context.read<HomeProvider>().updateBlurredBackgroundState(
                  shouldShow: false); //Show blurred background
            });
            context.read<HomeProvider>().updateTargetedRequestPro(
                isBeingProcessed: false, request_fp: '');
          });
          // log('confirmed drop off');
        } else //Unable to cancel for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          // log('Unable to confirm dropoff');
          UnableToDo(context);
        }
      } else //Has some errors
      {
        // log(response.statusCode.toString());
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        // log('Unable to confirm dropoff');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);
      log('20');
      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(milliseconds: 500), () {
        context
            .read<HomeProvider>()
            .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
        Navigator.of(context).pop();
      });
    }
    //Conditional popping & unblurred
    else {
      context
          .read<HomeProvider>()
          .updateTargetedRequestPro(isBeingProcessed: false, request_fp: '');
    }
  }

  //Unable to process request
  void UnableToDo(BuildContext context) {
    context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child:
                      const Modal(scenario: 'unable_to_confirmDropoff_request'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
    });
  }
}

//Get wallet data
class GetWalletDataNet {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/getDrivers_walletInfosDeep_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (context.toString().contains('no widget') == false) {
        if (response.statusCode == 200) //Got some results
        {
          // log(response.body.toString());
          updateWalletData(context: context, data: json.decode(response.body));
        } else //Has some errors
        {
          updateWalletData(context: context, data: {});
        }
      }
    } catch (e) {
      log('22');
      log(e.toString());
      if (context.toString().contains('no widget') == false) {
        updateWalletData(context: context, data: {});
      }
    }
  }

  //Update wallet data
  void updateWalletData({required BuildContext context, required Map data}) {
    try {
      if (context.toString().contains('no widget') == false) {
        context.read<HomeProvider>().updateWalletData(data: data);
      }
    } on Exception catch (e) {
      // TODO
      log('23');
      log(e.toString());
    }
  }
}

//Get wallet transactional data
class GetWalletTransactionalDataNet {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/getRiders_walletInfos_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'user_fingerprint': context.read<HomeProvider>().user_fingerprint,
      'mode': 'detailed',
      'userType': 'driver'
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        updateWalletData(context: context, data: json.decode(response.body));
      } else //Has some errors
      {
        updateWalletData(context: context, data: {});
      }
    } catch (e) {
      log('24');
      log(e.toString());
      updateWalletData(context: context, data: {});
    }
  }

  //Update wallet data
  void updateWalletData({required BuildContext context, required Map data}) {
    try {
      if (context.toString().contains('no widget') == false) {
        context.read<HomeProvider>().updateWalletTransactionalData(data: data);
      }
    } on Exception catch (e) {
      // TODO
      log('25');
      log(e.toString());
    }
  }
}

//Get daily earning so far & auth checks data
class GetDailyEarningAndAuthChecks {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/computeDaily_amountMadeSoFar_io'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'driver_fingerprint': context.read<HomeProvider>().user_fingerprint,
    };
    // print(bundleData);

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      if (response.statusCode == 200) //Got some results
      {
        if (json.decode(response.body)['response'] != null &&
            json.decode(response.body)['response'] == 'success') //Got some data
        {
          // log(response.body.toString());
          updateAuthEarningData(
              context: context, data: json.decode(response.body));
        } else //No data got - defaults to empty
        {
          updateAuthEarningData(context: context, data: {
            'amount': 0,
            'currency': "NAD",
            'currency_symbol': "N\$",
            'supported_requests_types':
                json.decode(response.body)['supported_requests_types'],
            'response': "error",
          });
        }
      } else //Has some errors
      {
        updateAuthEarningData(context: context, data: {
          'amount': 0,
          'currency': "NAD",
          'currency_symbol': "N\$",
          'response': "error",
        });
      }
    } catch (e) {
      log('26');
      log(e.toString());
      updateAuthEarningData(context: context, data: {
        'amount': 0,
        'currency': "NAD",
        'currency_symbol': "N\$",
        'response': "error",
      });
    }
  }

  //Update auth earning data
  void updateAuthEarningData(
      {required BuildContext context, required Map data}) {
    try {
      if (context.toString().contains('no widget') == false) {
        context.read<HomeProvider>().updateAuthEarningData(data: data);
      }
    } on Exception catch (e) {
      // TODO
      // log(context.toString());
      log('27');
      log(e.toString());
    }
  }
}

//Submit courier registration
class SubmitCourierRegistrationNet {
  Future exec({required BuildContext context}) async {
    String mainUrl =
        '${context.read<HomeProvider>().bridge}/registerCourier_ppline';

    //? Convert images to base64
    //driver photo
    String driverPhotoExtension = context
        .read<RegistrationProvider>()
        .driverPhoto!
        .path
        .split('.')[context
            .read<RegistrationProvider>()
            .driverPhoto!
            .path
            .split('.')
            .length -
        1];
    List<int> driverPhotoBytes =
        await XFile(context.read<RegistrationProvider>().driverPhoto!.path)
            .readAsBytes();
    String driverPhotoBase64 = base64Encode(driverPhotoBytes);

    //vehicle photo
    String vehiclePhotoExtension = context
            .read<RegistrationProvider>()
            .carPhoto!
            .path
            .split('.')[
        context.read<RegistrationProvider>().carPhoto!.path.split('.').length -
            1];
    List<int> vehiclePhotoBytes =
        await XFile(context.read<RegistrationProvider>().carPhoto!.path)
            .readAsBytes();
    String vehiclePhotoBase64 = base64Encode(vehiclePhotoBytes);

    //License photo
    String licensePhotoExtension = context
        .read<RegistrationProvider>()
        .licensePhoto!
        .path
        .split('.')[context
            .read<RegistrationProvider>()
            .licensePhoto!
            .path
            .split('.')
            .length -
        1];
    List<int> licensePhotoBytes =
        await XFile(context.read<RegistrationProvider>().licensePhoto!.path)
            .readAsBytes();
    String licensePhotoBase64 = base64Encode(licensePhotoBytes);

    //Id photo
    String idPhotoExtension = context
            .read<RegistrationProvider>()
            .idPhoto!
            .path
            .split('.')[
        context.read<RegistrationProvider>().idPhoto!.path.split('.').length -
            1];
    List<int> idPhotoBytes =
        await XFile(context.read<RegistrationProvider>().idPhoto!.path)
            .readAsBytes();
    String idPhotoBase64 = base64Encode(idPhotoBytes);

    //Request data for files
    Map<String, String> bundleData = {
      'city': context.read<RegistrationProvider>().city as String,
      'phone': '${context.read<RegistrationProvider>().phoneNumberPicked}',
      'nature_driver': 'COURIER',
      "personal_details": json
          .encode(context.read<RegistrationProvider>().personalDetails)
          .toString(),
      'vehicle_details': json
          .encode(context.read<RegistrationProvider>().definitiveVehicleInfos)
          .toString(),
      'did_accept_terms': true.toString(),
      'did_certify_data_veracity': true.toString(),
      'driver_photo': driverPhotoBase64,
      'vehicle_photo': vehiclePhotoBase64,
      'license_photo': licensePhotoBase64,
      'id_photo': idPhotoBase64,
      'extensions': json.encode({
        'driver_photo': driverPhotoExtension,
        'vehicle_photo': vehiclePhotoExtension,
        'license_photo': licensePhotoExtension,
        'id_photo': idPhotoExtension
      }).toString()
    };

    // print(bundleData);

    try {
      var response = await Dio().post(
        mainUrl,
        data: bundleData,
        onSendProgress: (received, total) {
          if (total != -1) {
            context.read<RegistrationProvider>().updateRegistrationPercentage(
                data: (received / total * 100).toStringAsFixed(0) + '%');
            // print((received / total * 100).toStringAsFixed(0) + '%');
          }
        },
        onReceiveProgress: (received, total) {
          if (total != -1) {
            context.read<RegistrationProvider>().updateRegistrationPercentage(
                data: (received / total * 100).toStringAsFixed(0) + '%');
            // log((received / total * 100).toStringAsFixed(0) + '%'.toString());
          }
        },
      );

      if (response.statusCode == 200) //Got some results
      {
        String responseGot = json.encode(response.data);
        var responseGotData = json.decode(responseGot);

        if (responseGotData['response'] ==
            'error_duplicate_application') //Application realdy received
        {
          showModalBottomSheet(
              context: context,
              builder: (context) {
                //...
                return Container(
                  color: Colors.white,
                  child: SafeArea(
                      bottom: false,
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: const ModalReg(
                            scenario: 'error_application_already_submitted'),
                      )),
                );
              }).whenComplete(() {
            context
                .read<HomeProvider>()
                .updateBlurredBackgroundState(shouldShow: false);
            Navigator.of(context).pop();
          });
        } else if (RegExp(r"error")
            .hasMatch(responseGotData['response'])) //Has some errors
        {
          showErrorsApplying(context: context);
        } else //Successfully applied
        {
          showModalBottomSheet(
              context: context,
              builder: (context) {
                //...
                return Container(
                  color: Colors.white,
                  child: SafeArea(
                      bottom: false,
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: const ModalReg(
                            scenario: 'application_success_drivers'),
                      )),
                );
              }).whenComplete(() {
            context
                .read<HomeProvider>()
                .updateBlurredBackgroundState(shouldShow: false);
            Navigator.of(context).pop();
          });
        }
      } else //Has some errors
      {
        showErrorsApplying(context: context);
      }
    } catch (e) {
      log('28');
      log(e.toString());
      showErrorsApplying(context: context);
    }
  }

  //Show error applying
  void showErrorsApplying({required BuildContext context}) {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child:
                      const ModalReg(scenario: 'error_application_something'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
      Navigator.of(context).pop();
    });
  }

  //Update auth earning data
  void updateAuthEarningData(
      {required BuildContext context, required Map data}) {
    try {
      context.read<HomeProvider>().updateAuthEarningData(data: data);
    } on Exception catch (e) {
      // TODO
      log('29');
      log(e.toString());
    }
  }
}

//Submit rides registration
class SubmitRidesRegistrationNet {
  Future exec({required BuildContext context}) async {
    String mainUrl =
        '${context.read<HomeProvider>().bridge}/registerDriver_ppline';

    log(mainUrl);

    //? Convert images to base64
    //driver photo
    String driverPhotoExtension = context
        .read<RegistrationProvider>()
        .driverPhoto!
        .path
        .split('.')[context
            .read<RegistrationProvider>()
            .driverPhoto!
            .path
            .split('.')
            .length -
        1];
    List<int> driverPhotoBytes =
        await XFile(context.read<RegistrationProvider>().driverPhoto!.path)
            .readAsBytes();
    String driverPhotoBase64 = base64Encode(driverPhotoBytes);

    //vehicle photo
    String vehiclePhotoExtension = context
            .read<RegistrationProvider>()
            .carPhoto!
            .path
            .split('.')[
        context.read<RegistrationProvider>().carPhoto!.path.split('.').length -
            1];
    List<int> vehiclePhotoBytes =
        await XFile(context.read<RegistrationProvider>().carPhoto!.path)
            .readAsBytes();
    String vehiclePhotoBase64 = base64Encode(vehiclePhotoBytes);

    //License photo
    String licensePhotoExtension = context
        .read<RegistrationProvider>()
        .licensePhoto!
        .path
        .split('.')[context
            .read<RegistrationProvider>()
            .licensePhoto!
            .path
            .split('.')
            .length -
        1];
    List<int> licensePhotoBytes =
        await XFile(context.read<RegistrationProvider>().licensePhoto!.path)
            .readAsBytes();
    String licensePhotoBase64 = base64Encode(licensePhotoBytes);

    //Id photo
    String idPhotoExtension = context
            .read<RegistrationProvider>()
            .idPhoto!
            .path
            .split('.')[
        context.read<RegistrationProvider>().idPhoto!.path.split('.').length -
            1];
    List<int> idPhotoBytes =
        await XFile(context.read<RegistrationProvider>().idPhoto!.path)
            .readAsBytes();
    String idPhotoBase64 = base64Encode(idPhotoBytes);

    //Blue paper photo
    String bluepaperPhotoExtension =
        context.read<RegistrationProvider>().bluepaperPhoto != null
            ? context
                .read<RegistrationProvider>()
                .bluepaperPhoto!
                .path
                .split('.')[context
                    .read<RegistrationProvider>()
                    .bluepaperPhoto!
                    .path
                    .split('.')
                    .length -
                1]
            : 'null';
    List<int> bluepaperPhotoBytes = context
                .read<RegistrationProvider>()
                .bluepaperPhoto !=
            null
        ? await XFile(context.read<RegistrationProvider>().bluepaperPhoto!.path)
            .readAsBytes()
        : [];
    String bluepaperPhotoBase64 =
        context.read<RegistrationProvider>().bluepaperPhoto != null
            ? base64Encode(bluepaperPhotoBytes)
            : 'null';

    //White paper photo
    String whitepaperPhotoExtension =
        context.read<RegistrationProvider>().whitepaperPhoto != null
            ? context
                .read<RegistrationProvider>()
                .whitepaperPhoto!
                .path
                .split('.')[context
                    .read<RegistrationProvider>()
                    .whitepaperPhoto!
                    .path
                    .split('.')
                    .length -
                1]
            : 'null';
    List<int> whitepaperPhotoBytes =
        context.read<RegistrationProvider>().whitepaperPhoto != null
            ? await XFile(
                    context.read<RegistrationProvider>().whitepaperPhoto!.path)
                .readAsBytes()
            : [];
    String whitepaperPhotoBase64 =
        context.read<RegistrationProvider>().whitepaperPhoto != null
            ? base64Encode(whitepaperPhotoBytes)
            : 'null';

    //Permit photo
    String permitPhotoExtension =
        context.read<RegistrationProvider>().permitPhoto != null
            ? context.read<RegistrationProvider>().permitPhoto!.path.split('.')[
                context
                        .read<RegistrationProvider>()
                        .permitPhoto!
                        .path
                        .split('.')
                        .length -
                    1]
            : 'null';
    List<int> permitPhotoBytes = context
                .read<RegistrationProvider>()
                .permitPhoto !=
            null
        ? await XFile(context.read<RegistrationProvider>().permitPhoto!.path)
            .readAsBytes()
        : [];
    String permitPhotoBase64 =
        context.read<RegistrationProvider>().permitPhoto != null
            ? base64Encode(permitPhotoBytes)
            : 'null';

    //Request data for files
    Map<String, String> bundleData = {
      'city': context.read<RegistrationProvider>().city as String,
      'phone': '${context.read<RegistrationProvider>().phoneNumberPicked}',
      'nature_driver':
          context.read<RegistrationProvider>().driverNature as String,
      "personal_details": json
          .encode(context.read<RegistrationProvider>().personalDetails)
          .toString(),
      'vehicle_details': json
          .encode(context.read<RegistrationProvider>().definitiveVehicleInfos)
          .toString(),
      'did_accept_terms': true.toString(),
      'did_certify_data_veracity': true.toString(),
      'driver_photo': driverPhotoBase64,
      'vehicle_photo': vehiclePhotoBase64,
      'license_photo': licensePhotoBase64,
      'id_photo': idPhotoBase64,
      'bluepaper_photo': bluepaperPhotoBase64,
      'whitepaper_photo': whitepaperPhotoBase64,
      'permit_photo': permitPhotoBase64,
      'extensions': json.encode({
        'driver_photo': driverPhotoExtension,
        'vehicle_photo': vehiclePhotoExtension,
        'license_photo': licensePhotoExtension,
        'id_photo': idPhotoExtension,
        'bluepaper_photo': bluepaperPhotoExtension,
        'whitepaper_photo': whitepaperPhotoExtension,
        'permit_photo': permitPhotoExtension
      }).toString()
    };

    // print(bundleData);

    try {
      var response = await Dio().post(
        mainUrl,
        data: bundleData,
        onSendProgress: (received, total) {
          if (total != -1) {
            // print((received / total * 100).toStringAsFixed(0) + '%');
          }
        },
        onReceiveProgress: (received, total) {
          if (total != -1) {
            // log((received / total * 100).toStringAsFixed(0) + '%'.toString());
          }
        },
      );

      if (response.statusCode == 200) //Got some results
      {
        String responseGot = json.encode(response.data);
        var responseGotData = json.decode(responseGot);

        if (responseGotData['response'] ==
            'error_duplicate_application') //Application realdy received
        {
          showModalBottomSheet(
              context: context,
              builder: (context) {
                //...
                return Container(
                  color: Colors.white,
                  child: SafeArea(
                      bottom: false,
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: const ModalReg(
                            scenario: 'error_application_already_submitted'),
                      )),
                );
              }).whenComplete(() {
            context
                .read<HomeProvider>()
                .updateBlurredBackgroundState(shouldShow: false);
            Navigator.of(context).pop();
          });
        } else if (RegExp(r"error")
            .hasMatch(responseGotData['response'])) //Has some errors
        {
          showErrorsApplying(context: context);
        } else //Successfully applied
        {
          showModalBottomSheet(
              context: context,
              builder: (context) {
                //...
                return Container(
                  color: Colors.white,
                  child: SafeArea(
                      bottom: false,
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: const ModalReg(
                            scenario: 'application_success_drivers'),
                      )),
                );
              }).whenComplete(() {
            context
                .read<HomeProvider>()
                .updateBlurredBackgroundState(shouldShow: false);
            Navigator.of(context).pop();
          });
        }
      } else //Has some errors
      {
        showErrorsApplying(context: context);
      }
    } catch (e) {
      log('30');
      log(e.toString());
      showErrorsApplying(context: context);
    }
  }

  //Show error applying
  void showErrorsApplying({required BuildContext context}) {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                bottom: false,
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  color: Colors.white,
                  child:
                      const ModalReg(scenario: 'error_application_something'),
                )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
      Navigator.of(context).pop();
    });
  }

  //Update auth earning data
  void updateAuthEarningData(
      {required BuildContext context, required Map data}) {
    try {
      context.read<HomeProvider>().updateAuthEarningData(data: data);
    } on Exception catch (e) {
      // TODO
      log('31');
      log(e.toString());
    }
  }
}

//Send the OTP code
class SendOTPCodeNet {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/sendOtpAndCheckerUserStatusTc'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'user_nature': 'driver',
      'phone_number':
          '${context.read<HomeProvider>().selectedCountryCodeData['dial_code']}${context.read<HomeProvider>().enteredPhoneNumber}',
      'smsHashLinker': 'absdEjdjs'
    };

    // print(bundleData);

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      context.read<HomeProvider>().updateGenericLoaderShow(state: false);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGot = json.decode(response.body);
        if (RegExp(r"error").hasMatch(responseGot['response']) ==
            false) //No error found
        {
          if (RegExp(r"not_yet_registered")
              .hasMatch(responseGot['response'])) //Not yet registered
          {
            // log('driver not yet registered, move to registration');
            //! Update the user's status: new_user
            context
                .read<HomeProvider>()
                .updateRegistrationStatus(data: 'new_user');
          } else if (RegExp(r"registered")
              .hasMatch(responseGot['response'])) //registered driver
          {
            // log('registered, move forward');
            //Update the account details, user fp and move forward
            context
                .read<HomeProvider>()
                .updateAccountDetails(data: responseGot);
            context
                .read<HomeProvider>()
                .updateUserFpData(data: responseGot['user_fp']);
            //Done
            //! Update the user's status: registered_user
            context
                .read<HomeProvider>()
                .updateRegistrationStatus(data: 'registered_user');
          } else //Encountered some errors
          {
            // log('Encountered some errors.');
            showErrorsSendingCode(context: context);
          }
        } else //Found some errors
        {
          // log('Found some errors');
          showErrorsSendingCode(context: context);
        }
      } else //Has some errors
      {
        // log(response.statusCode.toString());
        showErrorsSendingCode(context: context);
      }
    } catch (e) {
      log('32');
      log(e.toString());
      showErrorsSendingCode(context: context);
    }
  }

  //Show error encountered
  void showErrorsSendingCode({required BuildContext context}) {
    // context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    context.read<HomeProvider>().updateRegistrationStatus(data: 'new_user');
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                child: Container(
              width: MediaQuery.of(context).size.width,
              color: Colors.white,
              child: const Modal(scenario: 'error_sending_otpCode'),
            )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
      Navigator.of(context).pushNamed('/PhoneDetailsScreen');
    });
  }
}

//Check the OTP code
class CheckOTPCodeNet {
  Future exec({required BuildContext context}) async {
    Uri mainUrl = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/checkThisOTP_SMS'));

    //Assemble the bundle data
    Map<String, String> bundleData = {
      'user_nature': 'driver',
      'phone_number':
          '${context.read<HomeProvider>().selectedCountryCodeData['dial_code']}${context.read<HomeProvider>().enteredPhoneNumber}',
      'otp': context.read<HomeProvider>().otpValue
    };

    try {
      http.Response response = await http.post(mainUrl, body: bundleData);

      context.read<HomeProvider>().updateGenericLoaderShow(state: false);

      if (response.statusCode == 200) //Got some results
      {
        // log(response.body.toString());
        Map responseGot = json.decode(response.body);
        if (responseGot['response'] == false &&
            context.read<HomeProvider>().userStatus ==
                'known_user') //Wrong OTP Code
        {
          log('Wrong code');
          showWrongCodeEntered(context: context);
        } else //True OTP code
        {
          log('True code');
          //Check the user status
          if (context.read<HomeProvider>().userStatus ==
              'new_user') //Move to signup
          {
            //! Update the loggin status
            context.read<HomeProvider>().updateLogginStatus(status: 'logged');
            //!...
            Navigator.of(context).pushNamed('/SignupEntry');
          } else //registered user
          {
            //? Get the user account details
            Map userAccountDetailsFull =
                context.read<HomeProvider>().userAccountDetails;
            // print(context.read<HomeProvider>().userAccountDetails);
            // Check the state of the account creation
            if (RegExp(r"(true|valid)")
                    .hasMatch(userAccountDetailsFull['account_state']) ||
                userAccountDetailsFull['account_state']) //Valid account
            {
              //! Update the loggin status
              context.read<HomeProvider>().updateLogginStatus(status: 'logged');
              //!...
              Navigator.of(context).pushNamed('/Home');
            } else if (RegExp(r"(suspended|blocked|deactivated|expelled)")
                .hasMatch(userAccountDetailsFull[
                    'account_state'])) //Blocked or suspendGetDailyEarningAndAuthChecks
            {
              log('Locked account');
            }
          }
        }
      } else //Has some errors
      {
        // log(response.statusCode.toString());
        showErrorsCheckingCode(context: context);
      }
    } catch (e) {
      log('33');
      log(e.toString());
      showErrorsCheckingCode(context: context);
    }
  }

  //Show error encountered
  void showErrorsCheckingCode({required BuildContext context}) {
    // context.read<HomeProvider>().updateBlurredBackgroundState(shouldShow: true);
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                child: Container(
              width: MediaQuery.of(context).size.width,
              color: Colors.white,
              child: const Modal(scenario: 'error_checking_otpCode'),
            )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
      //Navigator.of(context).pushNamed('/PhoneDetailsScreen');
    });
  }

  //Show wrong code
  void showWrongCodeEntered({required BuildContext context}) {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          //...
          return Container(
            color: Colors.white,
            child: SafeArea(
                child: Container(
              width: MediaQuery.of(context).size.width,
              color: Colors.white,
              child: const Modal(scenario: 'wrong_otp_code_entered'),
            )),
          );
        }).whenComplete(() {
      context
          .read<HomeProvider>()
          .updateBlurredBackgroundState(shouldShow: false);
      //Navigator.of(context).pushNamed('/PhoneDetailsScreen');
    });
  }
}
