// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Home/Home.dart';
import 'package:taxiconnectdrivers/Components/Login/EntryScreen.dart';
import 'package:taxiconnectdrivers/Components/Login/OTPVerificationEntry.dart';
import 'package:taxiconnectdrivers/Components/Login/PhoneDetailsScreen.dart';
import 'package:taxiconnectdrivers/Components/Login/RegisterOptions.dart';
import 'package:taxiconnectdrivers/Components/Login/RegistrationDelivery.dart';
import 'package:taxiconnectdrivers/Components/Login/RegistrationRide.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCar.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarColor.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarDirectory.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarModels.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarRide.dart';
import 'package:taxiconnectdrivers/Components/Login/SignupEntry.dart';
import 'package:taxiconnectdrivers/Components/Login/SplashScreen.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';
import 'package:taxiconnectdrivers/Components/Settings/Settings.dart';
import 'package:taxiconnectdrivers/Components/Support/Support.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Payouts.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Summary.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Wallet.dart';
import 'package:taxiconnectdrivers/Components/YourRides/DetailedTripShow.dart';
import 'package:taxiconnectdrivers/Components/YourRides/YourRides.dart';
import 'package:taxiconnectdrivers/ThemesAndRoutes/AppTheme.dart' as AppTheme;

class AppGeneralEntry extends StatefulWidget {
  const AppGeneralEntry({Key? key}) : super(key: key);

  @override
  _AppGeneralEntryState createState() => _AppGeneralEntryState();
}

class _AppGeneralEntryState extends State<AppGeneralEntry> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //Restore the registration flow
    context.read<RegistrationProvider>().restoreStateData();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(theme: AppTheme.appTheme, initialRoute: '/', routes: {
      '/': (context) => const SplashScreen(),
      '/Entry': (context) => const EntryScreen(),
      '/PhoneDetailsScreen': (context) => const PhoneDetailsScreen(),
      '/OTPVerificationEntry': (context) => const OTPVerificationEntry(),
      '/SignupEntry': (context) => const SignupEntry(),
      '/RegisterOptions': (context) => const RegisterOptions(),
      '/RegistrationDelivery': (context) => const RegistrationDelivery(),
      '/RegistrationRide': (context) => const RegistrationRide(),
      '/SelectCar': (context) => const SelectCar(),
      '/SelectCarRide': (context) => const SelectCarRide(),
      '/SelectCarDirectory': (context) => const SelectCarDirectory(),
      '/SelectCarModels': (context) => const SelectCarModels(),
      '/SelectCarColor': (context) => const SelectCarColor(),
      '/Home': (context) => Home(),
      '/YourRides': (context) => const YourRides(),
      '/DetailedTripShow': (context) => const DetailedTripShow(),
      '/Wallet': (context) => const Wallet(),
      '/WalletSummary': (context) => const Summary(),
      '/WalletPayout': (context) => const Payouts(),
      '/Settings': (context) => const Settings(),
      '/Support': (context) => const Support(),
    });
  }
}
