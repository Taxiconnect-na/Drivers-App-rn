// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:taxiconnectdrivers/Components/Home/CenterArea.dart';
import 'package:taxiconnectdrivers/Components/Home/DrawerMenu.dart';
import 'package:taxiconnectdrivers/Components/Home/HeaderGeneral.dart';
import 'package:taxiconnectdrivers/Components/Home/SwitcherArea.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        drawer: const DrawerMenu(),
        body: Container(
          decoration: BoxDecoration(border: Border.all(color: Colors.black)),
          child: Column(
            children: const [HeaderGeneral(), CenterArea(), SwictherArea()],
          ),
        ));
  }
}
