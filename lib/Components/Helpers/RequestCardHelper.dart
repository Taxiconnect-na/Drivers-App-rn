// ignore_for_file: file_names

import 'package:flutter/material.dart';

class RequestCardHelper {
  //?1. Fit destination widgets to List
  List<Widget> fitLocationWidgetsToList(
      {required BuildContext context, required List<dynamic> locationData}) {
    List<Widget> finalCompilation = [];

    for (int i = 0; i < locationData.length; i++) {
      //? Essentials
      //1. Suburb
      String suburb = locationData[i]['suburb'] != false &&
              locationData[i]['suburb'] != 'false' &&
              locationData[i]['suburb'] != null
          ? locationData[i]['suburb']
          : locationData[i]['location_name'] != false &&
                  locationData[i]['location_name'] != 'false' &&
                  locationData[i]['location_name'] != null
              ? locationData[i]['location_name']
              : locationData[i]['street_name'] != false &&
                      locationData[i]['street_name'] != 'false' &&
                      locationData[i]['street_name'] != null
                  ? locationData[i]['street_name']
                  : 'Unclear location';

      //2. Location name
      String location_name = locationData[i]['location_name'] != false &&
              locationData[i]['location_name'] != 'false' &&
              locationData[i]['location_name'] != null
          ? locationData[i]['location_name'] != suburb
              ? locationData[i]['location_name']
              : ''
          : locationData[i]['street_name'] != false &&
                  locationData[i]['street_name'] != 'false' &&
                  locationData[i]['street_name'] != null
              ? locationData[i]['street_name']
              : '';

      //3. Street name
      String street_name = locationData[i]['street_name'] != false &&
              locationData[i]['street_name'] != 'false' &&
              locationData[i]['street_name'] != null
          ? locationData[i]['street_name'] != suburb &&
                  locationData[i]['street_name'] != location_name
              ? locationData[i]['street_name']
              : ''
          : '';

      //? ---
      Widget tempPass = Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Text(suburb,
                style:
                    const TextStyle(fontFamily: 'MoveTextBold', fontSize: 19)),
          ),
          SizedBox(
              width: MediaQuery.of(context).size.width,
              child: Text(
                  '$location_name${location_name.isNotEmpty && street_name.isNotEmpty ? ', ' : ''}$street_name',
                  style: const TextStyle(fontSize: 15)))
        ],
      );

      //Save
      finalCompilation.add(tempPass);
    }
    //DONE
    return finalCompilation;
  }

  //Get the realistic names for the location name, suburb and street name
  Map<String, String> getRealisticPlacesNames({required Map locationData}) {
    //? Essentials
    //1. Suburb
    String suburb = locationData['suburb'] != false &&
            locationData['suburb'] != 'false' &&
            locationData['suburb'] != null
        ? locationData['suburb']
        : locationData['location_name'] != false &&
                locationData['location_name'] != 'false' &&
                locationData['location_name'] != null
            ? locationData['location_name']
            : locationData['street_name'] != false &&
                    locationData['street_name'] != 'false' &&
                    locationData['street_name'] != null
                ? locationData['street_name']
                : 'Unclear location';

    //2. Location name
    String location_name = locationData['location_name'] != false &&
            locationData['location_name'] != 'false' &&
            locationData['location_name'] != null
        ? locationData['location_name'] != suburb
            ? locationData['location_name']
            : ''
        : locationData['street_name'] != false &&
                locationData['street_name'] != 'false' &&
                locationData['street_name'] != null
            ? locationData['street_name']
            : '';

    //3. Street name
    String street_name = locationData['street_name'] != false &&
            locationData['street_name'] != 'false' &&
            locationData['street_name'] != null
        ? locationData['street_name'] != suburb &&
                locationData['street_name'] != location_name
            ? locationData['street_name']
            : ''
        : '';

    //? ---

    return {
      'location_name': location_name,
      'street_name': street_name,
      'suburb': suburb
    };
  }
}
