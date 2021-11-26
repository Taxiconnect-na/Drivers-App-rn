import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/ThemesAndRoutes/AppRoutes.dart';

void main() {
  runApp(MultiProvider(
    providers: [ChangeNotifierProvider(create: (_) => HomeProvider())],
    child: const AppGeneralEntry(),
  ));
}
