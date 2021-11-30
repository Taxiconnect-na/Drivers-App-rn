// ignore_for_file: file_names, library_prefixes

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

class GlobalDataFetcher with ChangeNotifier {
  Uri globalTrips = Uri.parse(
      Uri.encodeFull('http://192.168.8.132:9999/update_requestsGraph'));

  Future getCoreDate({required BuildContext context}) async {
    // print('get code data called');
    Map<String, dynamic> bundleData = {
      'driver_fingerprint':
          '91ae265bca710a49756d90e382f9591dceba4b26cc03c01aaca3828145376321f9b8b401ae7e1efa41c99e7f210ecc191c62b2dc7bcda566e312378e1a1fdf1b'
    };

    ///....
    http.Response response = await http.post(globalTrips, body: bundleData);

    if (response.statusCode == 200) //well received
    {
      // print(response.body);
    } else //No proper result received
    {
      print(response.body);
    }
  }
}
