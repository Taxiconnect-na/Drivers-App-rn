// ignore_for_file: file_names, library_prefixes

import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
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
      'requestType': 'ride',
      'app_version': '3.0.02'
    };

    ///....
    try {
      http.Response response = await http.post(globalTrips, body: bundleData);

      if (response.statusCode == 200) //well received
      {
        if (response.body.toString() == '{response: \'no_rides\'}' ||
            response.body.toString() ==
                '{response: \'error\'}') //No trips found
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
          context.read<HomeProvider>().updateTripRequestsMetadata(
              newTripList: json.decode(response.body));
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
