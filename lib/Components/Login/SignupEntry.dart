// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Modal.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Modules/GenericRectButton/GenericRectButton.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class SignupEntry extends StatefulWidget {
  const SignupEntry({Key? key}) : super(key: key);

  @override
  _SignupEntryState createState() => _SignupEntryState();
}

class _SignupEntryState extends State<SignupEntry> {
  @override
  Widget build(BuildContext context) {
    //! Update the user phone number entered
    context.read<RegistrationProvider>().updateUserPhoneNumberPicked(
        data:
            '${context.read<HomeProvider>().selectedCountryCodeData['dial_code']}${context.read<HomeProvider>().enteredPhoneNumber}');

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          padding: EdgeInsets.only(left: 0),
          visualDensity: VisualDensity.comfortable,
          onPressed: () {
            //Clear everything
            //! 1. Registration
            context.read<RegistrationProvider>().clearEverything();
            //! 2. Home
            context.read<HomeProvider>().clearEverything();
            //...
            Navigator.of(context).pushNamed('/PhoneDetailsScreen');
          },
          icon: Icon(Icons.arrow_back),
        ),
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
              const DotPoints(title: 'Accept rides in your city.'),
              const DotPoints(title: 'Get paid very fast.'),
              const SizedBox(
                height: 35,
              ),
              const Text("What's your city?",
                  style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 17)),
              const SizedBox(height: 15),
              const CitySelect(),
              const Expanded(child: Text('')),
              RichText(
                  text: const TextSpan(
                      style: TextStyle(
                          color: Colors.black,
                          fontFamily: 'MoveTextLight',
                          fontSize: 15),
                      children: [
                    TextSpan(
                        text: 'Our terms and conditions are available at '),
                    TextSpan(
                        text: 'taxiconnectna.com/terms',
                        style: TextStyle(fontFamily: 'MoveTextMedium'))
                  ])),
              GenericRectButton(
                  label: 'Next',
                  horizontalPadding: 0,
                  labelFontSize: 20,
                  actuatorFunctionl: () {
                    //! Check if a city was selected
                    if (context.read<RegistrationProvider>().city ==
                        null) //No city selected
                    {
                      showModalBottomSheet(
                          context: context,
                          builder: (context) {
                            return Container(
                                color: Colors.white,
                                child: SafeArea(
                                    child: Container(
                                        width:
                                            MediaQuery.of(context).size.width,
                                        color: Colors.white,
                                        child: Modal(
                                            scenario:
                                                'error_not_city_selected_signup'))));
                          });
                    } else //A city was selected
                    {
                      Navigator.of(context).pushNamed('/RegisterOptions');
                    }
                  })
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
          value: context.watch<RegistrationProvider>().city,
          isExpanded: true,
          underline: Divider(
            color: Colors.grey.shade200,
          ),
          hint: const Text('Select your city'),
          items: ['Windhoek', 'Swakopmund', 'Walvis Bay'].map((String value) {
            return DropdownMenuItem(child: Text(value), value: value);
          }).toList(),
          onChanged: (value) => context
              .read<RegistrationProvider>()
              .updateSelectedCity(data: value as String?),
        ),
      ),
    );
  }
}
