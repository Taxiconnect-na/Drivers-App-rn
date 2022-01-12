// ignore_for_file: file_names

import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class Modal extends StatelessWidget {
  final String scenario;

  const Modal({Key? key, required this.scenario}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return getContent(context: context, scenario: scenario);
  }

  void _callNumber({required String phone}) async {
    bool? res = await FlutterPhoneDirectCaller.callNumber(phone);
  }

  //Return the correct content based on the scenario
  Widget getContent({required BuildContext context, required String scenario}) {
    switch (scenario) {
      case 'error_going_online':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.cloud_off_outlined,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              const Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text("Unable to go online",
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    'Sorry due to an unexpected error we were unable to go online, please check your Internet and try again.',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              GenericRectButton(
                  label: 'Close',
                  labelFontSize: 20,
                  isArrowShow: false,
                  actuatorFunctionl: () => Navigator.of(context).pop())
            ]),
          ),
        );
      case 'help_signup_details':
        return Container(
          // color: Colors.red,
          height: 250,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              ListTile(
                onTap: () {
                  _callNumber(phone: '0856997167');
                },
                leading: const Icon(Icons.phone, color: Colors.black),
                horizontalTitleGap: 0,
                title: const Text('Call support',
                    style:
                        TextStyle(fontSize: 18, fontFamily: 'MoveTextMedium')),
              ),
              const Divider(),
              ListTile(
                onTap: () {
                  //Clear everything
                  //! 1. Registration
                  context.read<RegistrationProvider>().clearEverything();
                  //! 2. Home
                  context.read<HomeProvider>().clearEverything();

                  Navigator.of(context).pushReplacementNamed('/Entry');
                },
                leading: Icon(Icons.logout, color: Colors.red.shade600),
                horizontalTitleGap: 0,
                title: const Text('Sign out',
                    style:
                        TextStyle(fontSize: 18, fontFamily: 'MoveTextMedium')),
              ),
            ]),
          ),
        );
      case 'error_checking_otpCode':
        return Container(
          // color: Colors.red,
          height: 450,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.error,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              const Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text("Couldn't check the OTP",
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    'Sorry due to an unexpected error we were unable to move forward with the authentication of your OTP, please try again.',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              GenericRectButton(
                  label: 'Try again',
                  labelFontSize: 20,
                  isArrowShow: false,
                  actuatorFunctionl: () =>
                      Navigator.of(context).pushNamed('/PhoneDetailsScreen'))
            ]),
          ),
        );
      case 'wrong_otp_code_entered':
        return Container(
          // color: Colors.red,
          height: 450,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.error,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              const Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text("Wrong code",
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    "Sorry, it looks like the code that you've entered is not the last one we've sent, please double check your SMS and try again.",
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              GenericRectButton(
                  label: 'Try again',
                  labelFontSize: 20,
                  isArrowShow: false,
                  actuatorFunctionl: () => Navigator.of(context).pop())
            ]),
          ),
        );
      case 'error_sending_otpCode':
        return Container(
          // color: Colors.red,
          height: 450,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.error,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              const Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text("Something's wrong",
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    'Sorry due to an unexpected error we were unable to move forward with the authentication of your phone number, please try again.',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              GenericRectButton(
                  label: 'Try again',
                  labelFontSize: 20,
                  isArrowShow: false,
                  actuatorFunctionl: () =>
                      Navigator.of(context).pushNamed('/PhoneDetailsScreen'))
            ]),
          ),
        );
      case 'accepted_request':
        return Container(
          // color: Colors.red,
          height: 250,
          alignment: Alignment.center,
          child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.check_circle,
                    size: 45, color: Color.fromRGBO(9, 134, 74, 1)),
                Padding(
                  padding: EdgeInsets.only(top: 25),
                  child: Text('Request accepted',
                      style: TextStyle(
                          fontFamily: 'MoveTextRegular', fontSize: 17)),
                )
              ]),
        );
      case 'unable_to_accept_request':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  Icon(Icons.error,
                      size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
                  Padding(
                    padding: EdgeInsets.only(top: 25),
                    child: Text('Couldn\'t accept',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 20)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                    child: Text(
                        'Sorry due to an unexpected error we were unable to move forward with accepting this request for you. Maybe try again later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontFamily: 'MoveTextRegular', fontSize: 17)),
                  )
                ]),
          ),
        );
      case 'warning_due_to_excessive_cancel':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.8,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.error,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              const Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text('Abusive behaviour detected',
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    'You\'ve exceeded your daily amount of cancelled requests, please try from now on to only accept the requests that you will complete to avoid any potential suspension.',
                    textAlign: TextAlign.left,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              SafeArea(
                child: GenericRectButton(
                    label: 'Close',
                    labelFontSize: 22,
                    isArrowShow: false,
                    actuatorFunctionl: () {
                      Navigator.of(context).pop();
                      Navigator.of(context).pop();
                    }),
              )
            ]),
          ),
        );
      case 'unable_to_cancel_request':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  Icon(Icons.error,
                      size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
                  Padding(
                    padding: EdgeInsets.only(top: 25),
                    child: Text('Couldn\'t accept',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 20)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                    child: Text(
                        'Sorry due to an unexpected error we were unable to move forward with the cancellation of the request. Maybe try again later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontFamily: 'MoveTextRegular', fontSize: 17)),
                  )
                ]),
          ),
        );
      case 'unable_to_decline_request':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  Icon(Icons.error,
                      size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
                  Padding(
                    padding: EdgeInsets.only(top: 25),
                    child: Text('Couldn\'t decline the request',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 20)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                    child: Text(
                        'Sorry due to an unexpected error we were unable to move forward with the declining of the request. Maybe try again later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontFamily: 'MoveTextRegular', fontSize: 17)),
                  )
                ]),
          ),
        );
      case 'unable_to_confirmPickup_request':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  Icon(Icons.error,
                      size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
                  Padding(
                    padding: EdgeInsets.only(top: 25),
                    child: Text('Couldn\'t confirm pickup',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 20)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                    child: Text(
                        'Sorry due to an unexpected error we were unable to move forward with the pickup confirmation of the request. Maybe try again later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontFamily: 'MoveTextRegular', fontSize: 17)),
                  )
                ]),
          ),
        );
      case 'unable_to_confirmDropoff_request':
        return Container(
          // color: Colors.red,
          height: 350,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: const [
                  Icon(Icons.error,
                      size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
                  Padding(
                    padding: EdgeInsets.only(top: 25),
                    child: Text('Couldn\'t confirm dropoff',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 20)),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                    child: Text(
                        'Sorry due to an unexpected error we were unable to move forward with the dropoff confirmation of the request. Maybe try again later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontFamily: 'MoveTextRegular', fontSize: 17)),
                  )
                ]),
          ),
        );
      case 'trip_cancellation_confirmation':
        return Container(
          height: 380,
          alignment: Alignment.center,
          child: Column(
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 20, bottom: 15),
                child: Text(
                  'Cancel the trip?',
                  style: TextStyle(fontSize: 23, fontFamily: 'MoveBold'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 20, left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Icon(Icons.info, size: 20),
                    SizedBox(
                      width: 5,
                    ),
                    Flexible(
                      child: Text(
                        'Note that excessive cancellation will ultimately lead to a temporary suspension of your account.',
                        style: TextStyle(
                            fontSize: 16, fontFamily: 'MoveTextRegular'),
                      ),
                    ),
                  ],
                ),
              ),
              GenericRectButton(
                  label: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? 'LOADING'
                      : 'Yes, cancel',
                  backgroundColor: Colors.grey.shade300,
                  textColor: Colors.black,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  verticalPadding: 10,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          //? Update the target processing state
                          context.read<HomeProvider>().updateTargetedRequestPro(
                              isBeingProcessed: true,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                          //?----
                          CancelRequestNet cancelRequestNet =
                              CancelRequestNet();
                          cancelRequestNet.exec(
                              context: context,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                        }),
              GenericRectButton(
                  label: 'Don\'t cancel',
                  backgroundColor: Colors.black,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          Navigator.of(context).pop();
                        })
            ],
          ),
        );
      case 'trip_pickupConfirmation_confirmation':
        return Container(
          height: 380,
          alignment: Alignment.center,
          child: Column(
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 20, bottom: 15),
                child: Text(
                  'Confirm pickup?',
                  style: TextStyle(fontSize: 23, fontFamily: 'MoveBold'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 20, left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info,
                        size: 20, color: Color.fromRGBO(178, 34, 34, 1)),
                    const SizedBox(
                      width: 5,
                    ),
                    Flexible(
                      child: Text(
                        context
                                        .read<HomeProvider>()
                                        .tmpSelectedTripData['ride_basic_infos']
                                    ['ride_mode'] ==
                                'RIDE'
                            ? 'By confirming the pickup you confirm that you\'ve picked up the passenger and you\'re ready to head to the destination.'
                            : 'By confirming the pickup you confirm that you\'ve picked up the package and you\'re ready to head to the dropoff destination.',
                        style: const TextStyle(
                            fontSize: 16, fontFamily: 'MoveTextRegular'),
                      ),
                    ),
                  ],
                ),
              ),
              GenericRectButton(
                  label: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? 'LOADING'
                      : 'Confirm pickup',
                  backgroundColor: Colors.black,
                  textColor: Colors.white,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  verticalPadding: 10,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          //? Update the target processing state
                          context.read<HomeProvider>().updateTargetedRequestPro(
                              isBeingProcessed: true,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                          //?----
                          ConfirmPickupRequestNet confirmPickupRequestNet =
                              ConfirmPickupRequestNet();
                          confirmPickupRequestNet.exec(
                              context: context,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                        }),
              GenericRectButton(
                  label: 'Cancel',
                  backgroundColor: Colors.grey.shade300,
                  textColor: Colors.black,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          Navigator.of(context).pop();
                        })
            ],
          ),
        );

      case 'trip_dropoffConfirmation_confirmation':
        return Container(
          height: 380,
          alignment: Alignment.center,
          child: Column(
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 20, bottom: 15),
                child: Text(
                  'Confirm dropoff?',
                  style: TextStyle(fontSize: 23, fontFamily: 'MoveBold'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 20, left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info,
                        size: 20, color: Color.fromRGBO(178, 34, 34, 1)),
                    const SizedBox(
                      width: 5,
                    ),
                    Flexible(
                      child: Text(
                        context
                                        .read<HomeProvider>()
                                        .tmpSelectedTripData['ride_basic_infos']
                                    ['ride_mode'] ==
                                'RIDE'
                            ? 'By confirming the drop off you confirm that you\’ve taken the passenger up till the final destination.'
                            : 'By confirming the drop off you confirm that you\’ve taken the package up till the final destination.',
                        style: const TextStyle(
                            fontSize: 16, fontFamily: 'MoveTextRegular'),
                      ),
                    ),
                  ],
                ),
              ),
              GenericRectButton(
                  label: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? 'LOADING'
                      : 'Confirm dropoff',
                  backgroundColor: Colors.black,
                  textColor: Colors.white,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  verticalPadding: 10,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          //? Update the target processing state
                          context.read<HomeProvider>().updateTargetedRequestPro(
                              isBeingProcessed: true,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                          //?----
                          ConfirmDropoffRequestNet confirmDropoffRequestNet =
                              ConfirmDropoffRequestNet();
                          confirmDropoffRequestNet.exec(
                              context: context,
                              request_fp: context
                                  .read<HomeProvider>()
                                  .tmpSelectedTripData['request_fp']);
                        }),
              GenericRectButton(
                  label: 'Cancel',
                  backgroundColor: Colors.grey.shade300,
                  textColor: Colors.black,
                  labelFontSize: 22,
                  horizontalPadding: 15,
                  isArrowShow: false,
                  actuatorFunctionl: context
                          .watch<HomeProvider>()
                          .targetRequestProcessor['isProcessingRequest']
                      ? () {}
                      : () {
                          Navigator.of(context).pop();
                        })
            ],
          ),
        );
      default:
        return Text('');
    }
  }
}
