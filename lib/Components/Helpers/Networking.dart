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
              });
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
          CloseLoader(context, request_fp);
          log('Cancelled');
        } else //Unable to cancel for some reasons
        {
          //Close the processor loader
          CloseLoader(context, request_fp, ShouldPop: false);
          log('Unable to cancel');
          UnableToDo(context);
        }
      } else //Has some errors
      {
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
