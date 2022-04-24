import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';
import 'package:taxiconnectdrivers/ThemesAndRoutes/AppRoutes.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';

void main() {
  debugPrint = (String? message, {int? wrapWidth}) => null;
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => HomeProvider()),
      ChangeNotifierProvider(create: (_) => RegistrationProvider())
    ],
    child: const AppGeneralEntry(),
  ));
}
