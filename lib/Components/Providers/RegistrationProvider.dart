import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

class RegistrationProvider with ChangeNotifier {
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

  //Vehicle directory
  Map<dynamic, dynamic> selectedBrandName = {}; //The vehicle brand selected
  String selectedModelName = ''; //The selected model
  String selectedVehicleColor = ''; //The selected vehicle color
  //? Definitive vehicle data
  Map<String, String> definitiveVehicleInfos = {
    'brand_name': '',
    'model_name': '',
    'color': '',
    'plate_number': ''
  }; //Will hold the final selections of the vehicle brand, model, color and plate number

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
  }

  //?2. Update the driver photo
  void updateDriverPhoto({required XFile? photo}) {
    driverPhoto = photo;
    notifyListeners();
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
  }

  //?4. Update the car photo
  void updateCarPhoto({required XFile? photo}) {
    carPhoto = photo;
    notifyListeners();
  }

  //?5. Update the license photo
  void updateLicensePhoto({required XFile? photo}) {
    licensePhoto = photo;
    notifyListeners();
  }

  //?6. Update the id photo
  void updateIDPhoto({required var photo}) {
    idPhoto = photo;
    notifyListeners();
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
      default:
    }
  }
}
