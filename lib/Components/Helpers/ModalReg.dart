// ignore_for_file: file_names

import 'dart:developer';
import 'dart:io';

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
      case 'application_success_drivers':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.5,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              const Icon(Icons.check_circle,
                  size: 45, color: Color.fromRGBO(9, 134, 74, 1)),
              Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text('Successfully applied',
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    "We have successfully received your application, it is currently being processed, we'll get back to you in the next 3 business days.",
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              SafeArea(
                child: GenericRectButton(
                    label: 'Done',
                    labelFontSize: 22,
                    isArrowShow: true,
                    actuatorFunctionl: () {
                      //! Clear everything
                      //! 1. Registration
                      context.read<RegistrationProvider>().clearEverything();
                      //! 2. Home
                      context.read<HomeProvider>().clearEverything();
                      //...
                      Navigator.of(context).pushNamed('/Entry');
                    }),
              )
            ]),
          ),
        );
      case 'error_application_already_submitted':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.5,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              Icon(Icons.warning,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text('Already applied',
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    "Sorry, it looks like you've already applied to be a driver with us, please wait until you receive a call from us, which will be very soon. Thanks.",
                    textAlign: TextAlign.center,
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
                    }),
              )
            ]),
          ),
        );
      case 'error_application_something':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.5,
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.only(top: 40),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.start, children: [
              Icon(Icons.error,
                  size: 45, color: Color.fromRGBO(178, 34, 34, 1)),
              Padding(
                padding: EdgeInsets.only(top: 25),
                child: Text('Error applying',
                    style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
              ),
              Padding(
                padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                child: Text(
                    "Sorry, due to an unexpected error we were unable to proceed with your application, please check your Internet and try again, or contact Support for more help.",
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontFamily: 'MoveTextRegular', fontSize: 17)),
              ),
              const Expanded(child: Text('')),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.only(left: 15, right: 15),
                  child: Row(
                    children: [
                      Flexible(
                        child: GenericRectButton(
                            label: 'Close',
                            labelFontSize: 19,
                            horizontalPadding: 0,
                            isArrowShow: false,
                            backgroundColor: Colors.grey.shade400,
                            textColor: Colors.black,
                            actuatorFunctionl: () {
                              Navigator.of(context).pop();
                            }),
                      ),
                      SizedBox(
                        width: 15,
                      ),
                      Flexible(
                        flex: 2,
                        child: GenericRectButton(
                            label: 'Call Support',
                            labelFontSize: 20,
                            horizontalPadding: 0,
                            isArrowShow: true,
                            actuatorFunctionl: () {
                              Navigator.of(context).pop();
                            }),
                      ),
                    ],
                  ),
                ),
              )
            ]),
          ),
        );
      case 'show_loading_submission':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.7,
          alignment: Alignment.center,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.only(left: 15, right: 15),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const CircularProgressIndicator(
                        color: Colors.black,
                      ),
                      const Padding(
                          padding: EdgeInsets.only(top: 45, bottom: 20),
                          child: Text('Submitting your application',
                              style: TextStyle(
                                  fontFamily: 'MoveBold',
                                  fontSize: 22,
                                  color: Color.fromRGBO(9, 110, 212, 1)))),
                      Text('Please do not close the app during this process.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 16, color: Colors.grey.shade700))
                    ]),
              ),
            ),
          ),
        );
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
                        title: context
                                .watch<RegistrationProvider>()
                                .personalDetails['name']!
                                .isEmpty
                            ? 'Name'
                            : context
                                .watch<RegistrationProvider>()
                                .personalDetails['name'] as String,
                        nature: 'personal_details_name',
                      ),
                      const SizedBox(
                        width: 15,
                      ),
                      BasicInputText(
                        title: context
                                .watch<RegistrationProvider>()
                                .personalDetails['surname']!
                                .isEmpty
                            ? 'Surname'
                            : context
                                .watch<RegistrationProvider>()
                                .personalDetails['surname'] as String,
                        nature: 'personal_details_surname',
                      )
                    ]),
                    const SizedBox(
                      height: 15,
                    ),
                    BasicInputText(
                      title: context
                              .watch<RegistrationProvider>()
                              .personalDetails['email']!
                              .isEmpty
                          ? 'Email'
                          : context
                              .watch<RegistrationProvider>()
                              .personalDetails['email'] as String,
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
                child: context.watch<RegistrationProvider>().driverPhoto == null
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
                child: context.watch<RegistrationProvider>().carPhoto == null
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
                child: context.watch<RegistrationProvider>().licensePhoto ==
                        null
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
                            'This document will be used to verify your identify.',
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
                child: context.watch<RegistrationProvider>().idPhoto == null
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
                            'This document will be used to verify your identify.',
                        natureData: 'idPhoto')),
          ),
        );
      case 'bluePaper_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: context.watch<RegistrationProvider>().bluepaperPhoto ==
                        null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath: 'assets/Images/logo.png',
                        title: 'Blue paper',
                        descr1:
                            'Please make sure that the document your are sending is your Blue Paper.',
                        descr2: '',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the card is captured.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'bluepaperPhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'This document will be used to verify your identify.',
                        natureData: 'bluepaperPhoto')),
          ),
        );
      case 'whitePaper_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: context.watch<RegistrationProvider>().whitepaperPhoto ==
                        null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath: 'assets/Images/logo.png',
                        title: 'White paper',
                        descr1:
                            'Please make sure that the document your are sending is your White Paper.',
                        descr2: '',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the card is captured.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'whitepaperPhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'This document will be used to verify your identify.',
                        natureData: 'whitepaperPhoto')),
          ),
        );
      case 'permit_photo_take':
        return Container(
          // color: Colors.red,
          height: MediaQuery.of(context).size.height * 0.75,
          alignment: Alignment.topLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 15, right: 15),
            child: SafeArea(
                child: context.watch<RegistrationProvider>().permitPhoto == null
                    ? showTakeProfilePicData(
                        context: context,
                        illustrationExamplePath: 'assets/Images/logo.png',
                        title: 'Permit',
                        descr1:
                            'Please make sure that the document your are sending is your permit.',
                        descr2: '',
                        instructions: generateInstructions(
                          stringRequirements: [
                            'Make sure that all the card is captured.',
                            'Make sure the photo is well fit, free of glare and in focus.',
                          ],
                        ),
                        natureData: 'permitPhoto')
                    : showPreviewImageSelected(
                        context: context,
                        description:
                            'This document will be used to verify your identify.',
                        natureData: 'permitPhoto')),
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
    XFile? pictureAsset;
    //Get the correct ressource
    if (natureData == 'profilePhoto') {
      pictureAsset = context.read<RegistrationProvider>().driverPhoto;
    } else if (natureData == 'vehiclePhoto') {
      pictureAsset = context.read<RegistrationProvider>().carPhoto;
    } else if (natureData == 'licensePhoto') {
      pictureAsset = context.read<RegistrationProvider>().licensePhoto;
    } else if (natureData == 'idPhoto') {
      pictureAsset = context.read<RegistrationProvider>().idPhoto;
    }
    //! only for ride registration
    else if (natureData == 'bluepaperPhoto') {
      pictureAsset = context.read<RegistrationProvider>().bluepaperPhoto;
    } else if (natureData == 'whitepaperPhoto') {
      pictureAsset = context.read<RegistrationProvider>().whitepaperPhoto;
    } else if (natureData == 'permitPhoto') {
      pictureAsset = context.read<RegistrationProvider>().permitPhoto;
    }

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
                    Navigator.of(context).pop();
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
              File(pictureAsset!.path),
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
      final XFile? image = await _picker.pickImage(
          source: ImageSource.gallery,
          maxWidth: 700,
          maxHeight: 700,
          imageQuality: 70,
          preferredCameraDevice: CameraDevice.front);
      // final XFile? image = await _picker.pickImage(source: ImageSource.camera);
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
          //! Only for ride registration
          case 'bluepaperPhoto':
            context
                .read<RegistrationProvider>()
                .updateBluePaperPhoto(photo: image);
            break;
          case 'whitepaperPhoto':
            context
                .read<RegistrationProvider>()
                .updateWhitePaperPhoto(photo: image);
            break;
          case 'permitPhoto':
            context
                .read<RegistrationProvider>()
                .updatePermitPhoto(photo: image);
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
            case 'vehicle_details_taxi_number':
              setState(() {
                textEditingController.text = value.toUpperCase();
                textEditingController.selection = TextSelection.fromPosition(
                    TextPosition(offset: textEditingController.text.length));
              });

              context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
                  nature: 'taxi_number', data: value.toUpperCase());
              break;
            case 'vehicle_details_permit_number':
              setState(() {
                textEditingController.text = value.toUpperCase();
                textEditingController.selection = TextSelection.fromPosition(
                    TextPosition(offset: textEditingController.text.length));
              });

              context.read<RegistrationProvider>().updateDefinitiveVehicleInfos(
                  nature: 'permit_number', data: value.toUpperCase());
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
