// ignore_for_file: file_names

import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Modal extends StatelessWidget {
  final String scenario;

  const Modal({Key? key, required this.scenario}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return getContent(context: context, scenario: scenario);
  }

  //Return the correct content based on the scenario
  Widget getContent({required BuildContext context, required String scenario}) {
    switch (scenario) {
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
      default:
        return Text('');
    }
  }
}
