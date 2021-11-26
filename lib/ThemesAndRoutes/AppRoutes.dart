// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Home/Home.dart';
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
        initialRoute: '/Home',
        routes: {'/Home': (context) => const Home()});
  }
}
