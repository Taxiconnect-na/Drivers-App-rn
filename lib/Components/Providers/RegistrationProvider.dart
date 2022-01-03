import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

class RegistrationProvider with ChangeNotifier {
  //? Loader vars
  bool isLoadingRegistration = true;

  //? I truly provided the right information
  bool iTrulyProvided = false;

  String? driverNature; //The type of driver selected: COURIER or RIDE

  String? city; //The default selected city for operations

  Map<String, String> personalDetails = {
    'name': '',
    'surname': '',
    'email': ''
  }; //Will store the personal details

  XFile? driverPhoto; //Will hold the driver photo

  Map<String, String> carDetails = {
    'brand': '',
    'plate_no': ''
  }; //Will hold the card details

  XFile? carPhoto; //Will hold the car photo

  XFile? licensePhoto; //Will hold the license photo

  XFile? idPhoto; //Will hold the ID photo

  //! Only for rides registration
  XFile? bluepaperPhoto; //Will hold the blue paper photo
  XFile? whitepaperPhoto; //Will hold the white paper photo
  XFile? permitPhoto; //Will hold the permit photo
  //!---

  //Vehicle directory
  Map<dynamic, dynamic> selectedBrandName = {}; //The vehicle brand selected
  String selectedModelName = ''; //The selected model
  String selectedVehicleColor = ''; //The selected vehicle color

  //? Definitive vehicle data
  Map<String, String> definitiveVehicleInfos = {
    'brand_name': '',
    'model_name': '',
    'color': '',
    'plate_number': '',
    //!Only for rides registration
    'taxi_number': '',
    'permit_number': ''
  }; //Will hold the final selections of the vehicle brand, model, color and plate number

  //! Persist data map
  void peristDataMap() {
    Map<String, dynamic> globalStateData = toMap();
    String stateString = json.encode(globalStateData).toString();

    //Write
    writeStateToFile(stateString);
  }

  //! Restore data map
  void restoreStateData() {
    print('Restore registration provider state');
    Future<Map<String, dynamic>> restoredState = readStateFile();
    restoredState.then((state) {
      if (mapEquals({}, state['personalDetails']) ||
          state['personalDetails'] == null) //?No state saved yet
      {
        log('No state saved found');
        //? Close loader
        isLoadingRegistration = false;
        //?....
        notifyListeners();
      } else //Found a saved state
      {
        // log(state['carPhoto']);
        city = state['city'] == null ? null : state['city'];
        driverNature = state['driverNature'] == null
            ? null
            : state['driverNature']; //! The type of driver
        //...
        personalDetails = {
          'name': state['personalDetails']['name'],
          'surname': state['personalDetails']['surname'],
          'email': state['personalDetails']['email']
        };
        driverPhoto =
            state['driverPhoto'] == null ? null : XFile(state['driverPhoto']);
        carDetails = {
          'brand': state['carDetails']['brand'],
          'plate_no': state['carDetails']['plate_no']
        };
        carPhoto = state['carPhoto'] == null ? null : XFile(state['carPhoto']);
        licensePhoto =
            state['licensePhoto'] == null ? null : XFile(state['licensePhoto']);
        idPhoto = state['idPhoto'] == null ? null : XFile(state['idPhoto']);
        definitiveVehicleInfos = {
          'brand_name': state['definitiveVehicleInfos']['brand_name'],
          'model_name': state['definitiveVehicleInfos']['model_name'],
          'color': state['definitiveVehicleInfos']['color'],
          'plate_number': state['definitiveVehicleInfos']['plate_number'],
          //! Only for ride registration
          'taxi_number': state['definitiveVehicleInfos']['taxi_number'],
          'permit_number': state['definitiveVehicleInfos']['permit_number']
        };
        //! Only for ride registration
        bluepaperPhoto = state['bluepaperPhoto'] == null
            ? null
            : XFile(state['bluepaperPhoto']);
        whitepaperPhoto = state['whitepaperPhoto'] == null
            ? null
            : XFile(state['whitepaperPhoto']);
        permitPhoto =
            state['permitPhoto'] == null ? null : XFile(state['permitPhoto']);
        //!---
        log('reg state complete!');
        //? Close loader
        isLoadingRegistration = false;
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
    return File('$path/registrationProvider.txt');
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
      log(e.toString());
      // If encountering an error, return 0
      return {};
    }
  }

  //! Convert class to Map
  Map<String, dynamic> toMap() {
    return {
      'city': city,
      'driverNature': driverNature,
      'personalDetails': personalDetails,
      'driverPhoto': driverPhoto == null ? null : driverPhoto!.path,
      'carDetails': carDetails,
      'carPhoto': carPhoto == null ? null : carPhoto!.path,
      'licensePhoto': licensePhoto == null ? null : licensePhoto!.path,
      'idPhoto': idPhoto == null ? null : idPhoto!.path,
      'definitiveVehicleInfos': definitiveVehicleInfos,
      //! Only for rides registration
      'bluepaperPhoto': bluepaperPhoto == null ? null : bluepaperPhoto!.path,
      'whitepaperPhoto': whitepaperPhoto == null ? null : whitepaperPhoto!.path,
      'permitPhoto': permitPhoto == null ? null : permitPhoto!.path
    };
  }

  //! Clear everything
  void clearEverything() {
    personalDetails = {'name': '', 'surname': '', 'email': ''};
    driverPhoto = null;
    carDetails = {'brand': '', 'plate_no': ''};
    carPhoto = null;
    licensePhoto = null;
    definitiveVehicleInfos = {
      'brand_name': '',
      'model_name': '',
      'color': '',
      'plate_number': '',
      //!Only for rides registration
      'taxi_number': '',
      'permit_number': ''
    };
    //...
    peristDataMap();
    //...
    //notifyListeners();
  }
  //!-----------------

  //?1. Update the personal details
  void updatePersonalDetails({required String nature, required String data}) {
    switch (nature) {
      case 'name':
        personalDetails['name'] = data;
        notifyListeners();
        break;
      case 'surname':
        personalDetails['surname'] = data;
        notifyListeners();
        break;
      case 'email':
        personalDetails['email'] = data;
        notifyListeners();
        break;
      default:
    }
    //? persist
    peristDataMap();
  }

  //?2. Update the driver photo
  void updateDriverPhoto({required XFile? photo}) {
    driverPhoto = photo;
    notifyListeners();
    //? persist
    peristDataMap();
  }

  //?3. Update the car details
  void updateCarDetails({required String nature, required String data}) {
    switch (nature) {
      case 'brand':
        carDetails['brand'] = data;
        notifyListeners();
        break;
      case 'plate_no':
        carDetails['plate_no'] = data;
        notifyListeners();
        break;
      default:
    }

    //? persist
    peristDataMap();
  }

  //?4. Update the car photo
  void updateCarPhoto({required XFile? photo}) {
    carPhoto = photo;
    notifyListeners();

    //? persist
    peristDataMap();
  }

  //?5. Update the license photo
  void updateLicensePhoto({required XFile? photo}) {
    licensePhoto = photo;
    notifyListeners();

    //? persist
    peristDataMap();
  }

  //! Only for ride registration
  //5.a Update the blue paper photo
  void updateBluePaperPhoto({required XFile? photo}) {
    bluepaperPhoto = photo;
    notifyListeners();

    //? persist
    peristDataMap();
  }

  //5.b Update the white paper photo
  void updateWhitePaperPhoto({required XFile? photo}) {
    whitepaperPhoto = photo;
    notifyListeners();

    //? perssist
    peristDataMap();
  }

  //5.c Update the permit photo
  void updatePermitPhoto({required XFile? photo}) {
    permitPhoto = photo;
    notifyListeners();

    //? perssist
    peristDataMap();
  }
  //!-----

  //?6. Update the id photo
  void updateIDPhoto({required var photo}) {
    idPhoto = photo;
    notifyListeners();

    //? persist
    peristDataMap();
  }

  //?7. Update the selected vehicle brand
  void updateVehicleBrand({required Map<dynamic, dynamic> brand}) {
    selectedBrandName = brand;
    notifyListeners();
  }

  //?8. Update the selected vehicle model
  void updateVehicleModel({required String model}) {
    selectedModelName = model;
    notifyListeners();
  }

  //?9. Update the selected vehicle color
  void updateSelectedVehicleColor({required String color}) {
    selectedVehicleColor = color;
    notifyListeners();
  }

  //?10. Update definitive vehicle infos
  void updateDefinitiveVehicleInfos(
      {required String nature, required String data}) {
    switch (nature) {
      case 'brand_name':
        definitiveVehicleInfos['brand_name'] = data;
        notifyListeners();
        break;
      case 'model_name':
        definitiveVehicleInfos['model_name'] = data;
        notifyListeners();
        break;
      case 'color':
        definitiveVehicleInfos['color'] = data;
        notifyListeners();
        break;
      case 'plate_number':
        definitiveVehicleInfos['plate_number'] = data;
        notifyListeners();
        break;
      case 'taxi_number':
        definitiveVehicleInfos['taxi_number'] = data;
        notifyListeners();
        break;
      case 'permit_number':
        definitiveVehicleInfos['permit_number'] = data;
        notifyListeners();
        break;
      default:
    }

    //? persist
    peristDataMap();
  }

  //! Update the loading of the registration
  void updateRegLoading({required bool state}) {
    isLoadingRegistration = state;
    notifyListeners();
  }

  //?11. Update the truly provided the right infos
  void updateTheTruylyProvidedInfos({required bool state}) {
    iTrulyProvided = state;
    notifyListeners();
  }

  //?12. Update the selected city
  void updateSelectedCity({required String? data}) {
    city = data;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }

  //?13. Update the selected driver type
  void updateSelectedDriverNature({required String data}) {
    driverNature = data;
    //...
    peristDataMap();
    //...
    notifyListeners();
  }
}
