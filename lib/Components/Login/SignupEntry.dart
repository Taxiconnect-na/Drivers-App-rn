// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';

class SignupEntry extends StatefulWidget {
  const SignupEntry({Key? key}) : super(key: key);

  @override
  _SignupEntryState createState() => _SignupEntryState();
}

class _SignupEntryState extends State<SignupEntry> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: Padding(
          padding: const EdgeInsets.only(right: 8.0, left: 5),
          child: Icon(Icons.arrow_back),
        ),
        leadingWidth: 15,
        title: Text('Sign up to drive',
            style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 20)),
        centerTitle: false,
      ),
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(
                height: 25,
              ),
              SizedBox(
                width: MediaQuery.of(context).size.width,
                child: SizedBox(
                  width: 100,
                  height: 100,
                  child: Image.asset('assets/Images/3398662.jpg'),
                ),
              ),
              const SizedBox(
                height: 35,
              ),
              const DotPoints(
                title: 'Pickup people in your city.',
              ),
              const DotPoints(title: 'Delivery packages.'),
              const DotPoints(title: 'Make extra cash, any time.'),
              const DotPoints(title: 'Get paid very fast.'),
              const SizedBox(
                height: 35,
              ),
              const Text("What's your city?",
                  style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 17)),
              const SizedBox(height: 15),
              const CitySelect(),
              Expanded(child: Text('')),
              RichText(
                  text: TextSpan(children: [
                TextSpan(text: 'Our terms and conditions are available at '),
                TextSpan(text: 'taxiconnectna.com/terms')
              ])),
              GenericRectButton(
                  label: 'Next',
                  horizontalPadding: 0,
                  labelFontSize: 20,
                  actuatorFunctionl: () {})
            ],
          ),
        ),
      ),
    );
  }
}

class DotPoints extends StatelessWidget {
  final String title;

  const DotPoints({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Row(
        children: [
          Icon(
            Icons.circle,
            size: 7,
          ),
          SizedBox(
            width: 3,
          ),
          Text(title, style: TextStyle(fontSize: 15))
        ],
      ),
    );
  }
}

class CitySelect extends StatelessWidget {
  const CitySelect({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey.shade200,
      width: MediaQuery.of(context).size.width * 0.8,
      child: Padding(
        padding: const EdgeInsets.only(left: 8, right: 8),
        child: DropdownButton(
          isExpanded: true,
          underline: Divider(
            color: Colors.grey.shade200,
          ),
          hint: const Text('Select your city'),
          items: ['Windhoek', 'Swakopmund', 'Walvis Bay'].map((String value) {
            return DropdownMenuItem(child: Text(value), value: value);
          }).toList(),
          onChanged: (value) => print(value),
        ),
      ),
    );
  }
}
