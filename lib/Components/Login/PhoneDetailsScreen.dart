// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericCircButton/GenericCircButton.dart';
import 'package:taxiconnectdrivers/Components/Modules/PhoneNumberInput/PhoneNumberInputEntry.dart';

class PhoneDetailsScreen extends StatefulWidget {
  const PhoneDetailsScreen({Key? key}) : super(key: key);

  @override
  _PhoneDetailsScreenState createState() => _PhoneDetailsScreenState();
}

class _PhoneDetailsScreenState extends State<PhoneDetailsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Container(
          child: Column(
            children: [
              ListTile(
                leading: InkWell(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: const Icon(Icons.arrow_back,
                        size: 33, color: Colors.black)),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: SizedBox(
                    width: MediaQuery.of(context).size.width,
                    child: const Text("What's your phone number?",
                        style: TextStyle(
                            fontFamily: 'MoveTextBold',
                            fontSize: 22,
                            color: Colors.black))),
              ),
              const SizedBox(
                height: 15,
              ),
              Expanded(
                  child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 15),
                      child: SizedBox(
                        width: MediaQuery.of(context).size.width,
                        child: const PhoneNumberInputEntry(),
                      ))),
              Padding(
                  padding: const EdgeInsets.symmetric(vertical: 25),
                  child: SizedBox(
                    height: 100,
                    child: ListTile(
                      leading: SizedBox(
                        width: MediaQuery.of(context).size.width / 2.2,
                        child: const Text(
                          'By proceeding, you will receive an SMS and data fees may apply.',
                          style: TextStyle(fontSize: 15),
                        ),
                      ),
                      trailing: GenericCircButton(
                        actuatorFunctionl: () => Navigator.pushNamed(
                            context, '/OTPVerificationEntry'),
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
