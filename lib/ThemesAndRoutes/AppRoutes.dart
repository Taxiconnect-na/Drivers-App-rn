// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Home/Home.dart';
import 'package:taxiconnectdrivers/Components/Login/EntryScreen.dart';
import 'package:taxiconnectdrivers/Components/Login/RegisterOptions.dart';
import 'package:taxiconnectdrivers/Components/Login/RegistrationDelivery.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCar.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarColor.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarDirectory.dart';
import 'package:taxiconnectdrivers/Components/Login/SelectCarModels.dart';
import 'package:taxiconnectdrivers/Components/Login/SignupEntry.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Payouts.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Summary.dart';
import 'package:taxiconnectdrivers/Components/Wallet/Wallet.dart';
import 'package:taxiconnectdrivers/ThemesAndRoutes/AppTheme.dart' as AppTheme;

class AppGeneralEntry extends StatefulWidget {
  const AppGeneralEntry({Key? key}) : super(key: key);

  @override
  _AppGeneralEntryState createState() => _AppGeneralEntryState();
}

class _AppGeneralEntryState extends State<AppGeneralEntry> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: AppTheme.appTheme,
        initialRoute: '/RegistrationDelivery',
        routes: {
          '/Entry': (context) => EntryScreen(),
          '/SignupEntry': (context) => SignupEntry(),
          '/RegisterOptions': (context) => RegisterOptions(),
          '/RegistrationDelivery': (context) => RegistrationDelivery(),
          '/SelectCar': (context) => SelectCar(),
          '/SelectCarDirectory': (context) => SelectCarDirectory(),
          '/SelectCarModels': (context) => SelectCarModels(),
          '/SelectCarColor': (context) => SelectCarColor(),
          '/Home': (context) => Home(),
          '/Wallet': (context) => Wallet(),
          '/WalletSummary': (context) => Summary(),
          '/WalletPayout': (context) => Payouts()
        });
  }
}
