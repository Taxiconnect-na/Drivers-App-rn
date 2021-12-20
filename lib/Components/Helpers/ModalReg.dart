// ignore_for_file: file_names

import 'dart:developer';
import 'dart:io';

import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:camera/camera.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class ModalReg extends StatefulWidget {
  final String scenario;

  const ModalReg({Key? key, required this.scenario}) : super(key: key);

  @override
  _ModalRegState createState() => _ModalRegState(scenario: scenario);
}

class _ModalRegState extends State<ModalReg> {
  final String scenario;
  final ImagePicker _picker = ImagePicker();
  XFile? _imageSelected;

  _ModalRegState({required this.scenario});

  @override
  Widget build(BuildContext context) {
    return getContent(context: context, scenario: scenario);
  }

  //Return the correct content based on the scenario
  Widget getContent({required BuildContext context, required String scenario}) {
    switch (scenario) {
      case 'show_perso_details':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.7,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Personal details',
                      style: TextStyle(fontFamily: 'MoveBold', fontSize: 22),
                    ),
                    const SizedBox(
                      height: 25,
                    ),
                    Row(mainAxisSize: MainAxisSize.max, children: [
                      BasicInputText(
                        title: 'Name',
                        nature: 'personal_details_name',
                      ),
                      SizedBox(
                        width: 15,
                      ),
                      BasicInputText(
                        title: 'Surname',
                        nature: 'personal_details_surname',
                      )
                    ]),
                    const SizedBox(
                      height: 15,
                    ),
                    BasicInputText(
                      title: 'Email',
                      nature: 'personal_details_email',
                    ),
                    const Expanded(child: Text('')),
                    GenericRectButton(
                        label: 'Done',
                        labelFontSize: 20,
                        isArrowShow: false,
                        horizontalPadding: 0,
                        actuatorFunctionl: () {
                          Navigator.of(context).pop();
                        })
                  ]),
            ),
          ),
        );
      case 'driver_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: _imageSelected == null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath: 'assets/Images/girlModel.png',
                        title: 'Take your profile photo',
                        descr1:
                            'Your profile picture help people recognise you.',
                        descr2:
                            'Please note that once you have submitted your profile photo, it cannot be changed.',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Face the camera and make sure your eyes and mouth are clearly visible.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                            'No photos of a photo, filters or alterations'
                          ],
                        ),
                        natureData: 'profilePhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'For safety reasons, all the riders will be able to see your profile picture.',
                        natureData: 'profilePhoto')),
          ),
        );
      case 'car_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: _imageSelected == null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath:
                            'assets/Images/vehicleSide.jpg',
                        title: 'Take a photo of your vehicle',
                        descr1:
                            'Your vehicle picture help people recognise you.',
                        descr2:
                            'Please note that once you have submitted your vehicle photo, it cannot be changed.',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the vehicle right or left side are visible.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'vehiclePhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'For safety reasons, all the riders will be able to see your vehicle picture.',
                        natureData: 'vehiclePhoto')),
          ),
        );
      case 'license_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: _imageSelected == null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath:
                            'assets/Images/licenseTemplate.jpg',
                        title: 'License picture',
                        descr1:
                            'Please make sure that the document your are sending is your license.',
                        descr2: '',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the document is captured.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'licensePhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'For safety reasons, all the riders will be able to see your vehicle picture.',
                        natureData: 'licensePhoto')),
          ),
        );
      case 'id_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: _imageSelected == null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath: 'assets/Images/IDTemplate.png',
                        title: 'Identity document',
                        descr1:
                            'Please make sure that the document your are sending is your ID.',
                        descr2: '',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the card is captured.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'idPhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'For safety reasons, all the riders will be able to see your vehicle picture.',
                        natureData: 'idPhoto')),
          ),
        );
      default:
        return Text('');
    }
  }

  List<Widget> generateInstructions(
      {required List<String> stringRequirements}) {
    List<Widget> genList = [];

    for (int i = 0; i < stringRequirements.length; i++) {
      if (i + 1 < stringRequirements.length) {
        genList.add(Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${i + 1}.',
              style: TextStyle(color: Colors.grey.shade800),
            ),
            const SizedBox(
              width: 5,
            ),
            Flexible(
              child: Text(
                stringRequirements[i],
                style: TextStyle(color: Colors.grey.shade800),
              ),
            )
          ],
        ));
        //..Add spacer
        genList.add(
          const SizedBox(
            height: 10,
          ),
        );
      } else //without spacer - last item
      {
        genList.add(Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${i + 1}.',
              style: TextStyle(color: Colors.grey.shade800),
            ),
            const SizedBox(
              width: 5,
            ),
            Flexible(
              child: Text(
                stringRequirements[i],
                style: TextStyle(color: Colors.grey.shade800),
              ),
            )
          ],
        ));
      }
    }

    //...
    return genList;
  }

  //SHow Take profile picture data
  Widget showPreviewImageSelected(
      {required BuildContext context,
      String description = '',
      required String natureData}) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 7),
            child: Row(
              children: [
                InkWell(
                  onTap: () {
                    setState(() {
                      _imageSelected = null;
                    });
                  },
                  child: const Icon(
                    Icons.close,
                    size: 26,
                    color: Color.fromRGBO(178, 34, 34, 1),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 15,
          ),
          Container(
            width: MediaQuery.of(context).size.width * 0.85,
            height: 250,
            decoration: BoxDecoration(border: Border.all(width: 0)),
            child: Image.file(
              File(_imageSelected!.path),
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(
            height: 35,
          ),
          const Text(
            'Want to use this photo?',
            style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 20),
            textAlign: TextAlign.center,
          ),
          const SizedBox(
            height: 15,
          ),
          Text(
            description,
            style: TextStyle(fontSize: 15, color: Colors.grey.shade700),
            textAlign: TextAlign.center,
          ),
          const Expanded(child: Text('')),
          Row(
            children: [
              Flexible(
                child: GenericRectButton(
                    backgroundColor: Colors.grey.shade300,
                    textColor: Colors.black,
                    label: 'Retake',
                    labelFontSize: 19,
                    isArrowShow: false,
                    horizontalPadding: 0,
                    actuatorFunctionl: () {
                      // Navigator.of(context).pop();
                      openCameraHandler(
                          context: context,
                          shouldOpenCam: false,
                          natureData: natureData);
                    }),
              ),
              const SizedBox(
                width: 15,
              ),
              Flexible(
                child: GenericRectButton(
                    label: 'Save',
                    labelFontSize: 19,
                    isArrowShow: false,
                    horizontalPadding: 0,
                    actuatorFunctionl: () {
                      Navigator.of(context).pop();
                    }),
              ),
            ],
          )
        ]);
  }

  //SHow Take profile picture data
  Widget showTakeProfilePicData(
      {required BuildContext context,
      required String title,
      required String descr1,
      String descr2 = 'description 2',
      required List<Widget> instructions,
      required String illustrationExamplePath,
      required String natureData}) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontFamily: 'MoveTextBold', fontSize: 20),
          ),
          const SizedBox(
            height: 25,
          ),
          Text(descr1, style: const TextStyle(fontSize: 15)),
          Text(descr2, style: const TextStyle(fontSize: 15)),
          const SizedBox(
            height: 15,
          ),
          //Generate instructions
          Column(
            children: instructions,
          ),
          SizedBox(
            height: 30,
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            // color: Colors.red,
            alignment: Alignment.center,
            child: SizedBox(
              width: MediaQuery.of(context).size.width * 0.6,
              height: 200,
              child: Image.asset(illustrationExamplePath),
            ),
          ),
          const Expanded(child: Text('')),
          GenericRectButton(
              label: 'Take a picture',
              labelFontSize: 20,
              isArrowShow: false,
              horizontalPadding: 0,
              actuatorFunctionl: () {
                // Navigator.of(context).pop();
                openCameraHandler(
                    context: context,
                    shouldOpenCam: false,
                    natureData: natureData);
              })
        ]);
  }

  //Camera
  void openCameraHandler(
      {required BuildContext context,
      required bool shouldOpenCam,
      required String natureData}) async {
    if (shouldOpenCam) //Open the camera
    {
      final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    } else //Open the gallery
    {
      // final XFile? image = await _picker.pickImage(
      //     source: ImageSource.gallery,
      //     maxWidth: 700,
      //     maxHeight: 700,
      //     imageQuality: 70,
      //     preferredCameraDevice: CameraDevice.front);
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);
      setState(() {
        print(image);
        _imageSelected = image;
        //! Update globals
        switch (natureData) {
          case 'profilePhoto':
            context
                .read<RegistrationProvider>()
                .updateDriverPhoto(photo: image);
            break;
          case 'vehiclePhoto':
            context.read<RegistrationProvider>().updateCarPhoto(photo: image);
            break;
          case 'licensePhoto':
            context
                .read<RegistrationProvider>()
                .updateLicensePhoto(photo: image);
            break;
          case 'idPhoto':
            context.read<RegistrationProvider>().updateIDPhoto(photo: image);
            break;
          default:
        }
      });
    }
  }
}

class BasicInputText extends StatefulWidget {
  final String title;
  final String nature;

  BasicInputText({Key? key, required this.title, required this.nature})
      : super(key: key);

  @override
  _BasicInputTextState createState() =>
      _BasicInputTextState(title: this.title, nature: this.nature);
}

class _BasicInputTextState extends State<BasicInputText> {
  final String title;
  final String nature;
  bool showTextCounter;
  TextEditingController textEditingController = TextEditingController();

  _BasicInputTextState(
      {Key? key,
      required this.title,
      this.nature = 'default',
      this.showTextCounter = false});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: TextField(
        controller: textEditingController,
        maxLength: showTextCounter ? 15 : null,
        onChanged: (value) {
          switch (nature) {
            case 'personal_details_name':
              print(value);
              context
                  .read<RegistrationProvider>()
                  .updatePersonalDetails(nature: 'name', data: value);
              break;
            case 'personal_details_surname':
              context
                  .read<RegistrationProvider>()
                  .updatePersonalDetails(nature: 'surname', data: value);
              break;
            case 'personal_details_email':
              context
                  .read<RegistrationProvider>()
                  .updatePersonalDetails(nature: 'email', data: value);
              break;
            case 'vehicle_details_plate_number':
              setState(() {
                textEditingController.text = value.toUpperCase();
                textEditingController.selection = TextSelection.fromPosition(
                    TextPosition(offset: textEditingController.text.length));
              });

              context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
                  nature: 'plate_number', data: value.toUpperCase());
              break;
            default:
          }
        },
        decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey.shade200,
            floatingLabelStyle: const TextStyle(color: Colors.black),
            label: Text(title),
            enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(color: Colors.grey.shade200)),
            focusedBorder: OutlineInputBorder(
                borderSide:
                    const BorderSide(color: Color.fromRGBO(9, 110, 212, 1)),
                borderRadius: BorderRadius.circular(1)),
            border: OutlineInputBorder(
                borderSide: BorderSide(color: Colors.grey.shade200),
                borderRadius: BorderRadius.circular(1))),
      ),
    );
  }
}
