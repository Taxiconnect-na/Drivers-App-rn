// ignore_for_file: file_names

import 'dart:developer';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter_mapbox_navigation/library.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Navigation {
  MapBoxNavigation directions = MapBoxNavigation();

  Map blueMapFix(double latitude, double longitude) {
    if (latitude > 0) //Swap
    {
      return {'latitude': longitude, 'longitude': latitude};
    }

    //...
    return {'latitude': latitude, 'longitude': longitude};
  }

  void startNavigation(
      {required Map origin,
      required Map destination,
      required BuildContext context}) async {
    // log(origin.toString());

    MapBoxOptions options = MapBoxOptions(
        initialLatitude:
            context.read<HomeProvider>().userLocationCoords['latitude'],
        initialLongitude:
            context.read<HomeProvider>().userLocationCoords['longitude'],
        zoom: 13.0,
        tilt: 0.0,
        bearing: 0.0,
        enableRefresh: true,
        // alternatives: true,
        // isOptimized: true,
        voiceInstructionsEnabled: true,
        bannerInstructionsEnabled: true,
        allowsUTurnAtWayPoints: true,
        mode: MapBoxNavigationMode.drivingWithTraffic,
        // mapStyleUrlDay: "https://url_to_day_style",
        // mapStyleUrlNight: "https://url_to_night_style",
        units: VoiceUnits.metric,
        simulateRoute: false,
        language: "en");

    //....
    Map originCorrectData = blueMapFix(
        double.parse(origin['latitude'].toString()),
        double.parse(origin['longitude'].toString()));

    Map destinationCorrectData = blueMapFix(
        double.parse(destination['latitude'].toString()),
        double.parse(destination['longitude'].toString()));

    final WayPoint point1 = WayPoint(
        name: origin['name'].toString(),
        latitude: originCorrectData['latitude'],
        longitude: originCorrectData['longitude']);
    final WayPoint point2 = WayPoint(
        name: destination['name'].toString(),
        latitude: destinationCorrectData['latitude'],
        longitude: destinationCorrectData['longitude']);
    //....
    List<WayPoint> wayPoints = [];
    wayPoints.add(point1);
    wayPoints.add(point2);

    await directions.startNavigation(wayPoints: wayPoints, options: options);
  }
}
