// ignore_for_file: file_names, library_prefixes

import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:taxiconnectdrivers/Components/Helpers/Modal.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Sound.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class GlobalDataFetcher with ChangeNotifier {
  Future getCoreDate({required BuildContext context}) async {
    Uri globalTrips = Uri.parse(Uri.encodeFull(
        '${context.read<HomeProvider>().bridge}/update_passenger_location'));

    // print('get code data called');
    Map<String, dynamic> bundleData = {
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
      'app_version': '3.0.02'
    };

    ///....
    try {
      http.Response response = await http.post(globalTrips, body: bundleData);

      if (response.statusCode == 200) //well received
      {
        //Close the main loader
        context.read<HomeProvider>().updateMainLoaderVisibility(option: false);
        // log(response.body.toString());
        if (response.body.toString() == '{"response":"no_requests"}' ||
            response.body.toString() == '{"response":"error"}') //No trips found
        {
          String responseGot = json.decode(response.body)['response'];
          switch (responseGot) {
            case 'no_requests':
              // No rides fetched
              log('No rides got');
              // Empty the ride array
              context
                  .read<HomeProvider>()
                  .updateTripRequestsMetadata(newTripList: []);
              break;
            case 'error':
              //Some error
              log('Unexpected errors');
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
          // log(response.body.toString());
          if (context.read<HomeProvider>().selectedOption ==
              json
                  .decode(response.body)[0]['request_type']
                  .toString()
                  .toLowerCase()) {
            context.read<HomeProvider>().updateTripRequestsMetadata(
                newTripList: json.decode(response.body));
          } else //Inconsistent selected options
          {
            context
                .read<HomeProvider>()
                .updateTripRequestsMetadata(newTripList: []);
          }
        }
      } else //No proper result received
      {
        log(response.body.toString());
        // Empty the ride array
        context
            .read<HomeProvider>()
            .updateTripRequestsMetadata(newTripList: []);
      }
    } catch (e) {
      log(e.toString());
    }
  }
}

//Get request graphs
class GetRequestsGraphNet {
  Future exec({required BuildContext context}) async {
    //Init the sound
    Sound sound = Sound();

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
        updateGraphData(context: context, graph: json.decode(response.body));
      }
    } catch (e) {
      log(e.toString());
      updateGraphData(
          context: context,
          graph: {'rides': 0, 'deliveries': 0, 'scheduled': 0, 'accepted': 0});
    }
  }

  //Update graph data
  void updateGraphData({required BuildContext context, required Map graph}) {
    context.read<HomeProvider>().updateRequestsGraphData(data: graph);
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
          log('Accepted');
          context.read<HomeProvider>().updateBlurredBackgroundState(
              shouldShow: true); //Show blurred background

          showModalBottomSheet(
                  isDismissible: false,
                  enableDrag: false,
                  context: context,
                  builder: (context) {
                    sound.playSound(type: 'accept_request');
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
          log('Unable to accept');
          UnableToAccept(context);
        }
      } else //Has some errors
      {
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        log('Unable to accept');
        UnableToAccept(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);

      log(e.toString());
      UnableToAccept(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(seconds: 4), () {
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
          Timer(const Duration(seconds: 4), () {
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

          log('Cancelled');
        } else //Unable to cancel for some reasons
        {
          log(response.body.toString());
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
        log(response.body.toString());
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        log('Unable to cancel');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);

      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(seconds: 4), () {
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

      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(seconds: 4), () {
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

      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(seconds: 4), () {
        context.read<HomeProvider>().updateTargetedDeclinedRequestPro(
            isBeingProcessed: false, request_fp: '');
        context.read<HomeProvider>().updateBlurredBackgroundState(
            shouldShow: false); //Show blurred background
        Navigator.of(context).pop();
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
    Sound sound = Sound();

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
          Timer(const Duration(seconds: 4), () {
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
          log('confirmed drop off');
        } else //Unable to cancel for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          log('Unable to confirm dropoff');
          UnableToDo(context);
        }
      } else //Has some errors
      {
        log(response.statusCode.toString());
        //Close the processor loader
        CloseLoader(context, request_fp, ShouldPop: false);
        log('Unable to confirm dropoff');
        UnableToDo(context);
      }
    } catch (e) {
      CloseLoader(context, request_fp, ShouldPop: false);

      log(e.toString());
      UnableToDo(context);
    }
  }

  void CloseLoader(BuildContext context, String request_fp,
      {bool ShouldPop = true}) {
    //Close the processor loader
    if (ShouldPop) {
      Timer(const Duration(seconds: 4), () {
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
