import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/LoaderInstance.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericCircButton/GenericCircButton.dart';
import 'package:taxiconnectdrivers/Components/Modules/OTPVerificationInput/OTPVerificationInput.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class OTPVerificationEntry extends StatefulWidget {
  const OTPVerificationEntry({Key? key}) : super(key: key);

  @override
  _OTPVerificationEntryState createState() => _OTPVerificationEntryState();
}

class _OTPVerificationEntryState extends State<OTPVerificationEntry> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //Send initial code
    SendOTPCodeNet sendOTPCodeNet = SendOTPCodeNet();
    sendOTPCodeNet.exec(context: context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Container(
          color: Colors.white,
          child: Column(
            children: [
              LoaderInstance(),
              ListTile(
                leading: InkWell(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: const Icon(Icons.arrow_back,
                        size: 33, color: Colors.black)),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Container(
                    width: MediaQuery.of(context).size.width,
                    child: Text("Enter the 5-digits code sent you.",
                        style: TextStyle(
                            fontFamily: 'MoveTextBold',
                            fontSize: 24,
                            color: Colors.black))),
              ),
              SizedBox(
                height: 15,
              ),
              Expanded(
                  child: Padding(
                      padding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        child: OTPVerificationInput(),
                      ))),
              Padding(
                  padding: EdgeInsets.symmetric(vertical: 25),
                  child: Container(
                    height: 100,
                    child: ListTile(
                      trailing: GenericCircButton(
                        actuatorFunctionl: () =>
                            Navigator.pushNamed(context, '/CreateAccountEntry'),
                      ),
                    ),
                  ))
            ],
          ),
        ),
      ),
    );
  }
}
