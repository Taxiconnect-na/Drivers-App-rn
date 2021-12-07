//Responsible for taking any function and spining it up in a specified interval.

// ignore_for_file: file_names

import 'dart:async';

import 'package:flutter/material.dart';

class Watcher with ChangeNotifier {
  // Duration? timerInterval = const Duration(seconds: 2);
  late Timer mainLoop;

  // Watcher({required this.actuatorFunctions, this.timerInterval});

  void startWatcher(
      {required List<dynamic> actuatorFunctions,
      Duration? timerInterval = const Duration(seconds: 3),
      required BuildContext context}) {
    //Start the timer
    mainLoop = Timer.periodic(timerInterval!, (Timer t) {
      for (int i = 0; i < actuatorFunctions.length; i++) {
        //? Structure
        // {name:'data fetcher name', actuator: Specific class instance child}
        //Call the tmp function
        switch (actuatorFunctions[i]['name']) {
          case 'GlobalDataFetcher':
            actuatorFunctions[i]['actuator'].getCoreDate(context: context);
            break;
          case 'LocationOpsHandler':
            actuatorFunctions[i]['actuator'].runLocationOpasHandler();
            break;
          default:
        }
      }
    });
  }
}
