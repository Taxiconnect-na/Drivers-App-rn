// ignore_for_file: file_names

import 'package:flutter/material.dart';

class HeaderGeneral extends StatefulWidget {
  const HeaderGeneral({Key? key}) : super(key: key);

  @override
  _HeaderGeneralState createState() => _HeaderGeneralState();
}

class _HeaderGeneralState extends State<HeaderGeneral> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      minimum: const EdgeInsets.only(bottom: 0),
      child: Container(
        decoration: BoxDecoration(color: Colors.white,
            // border: Border.all(color: Colors.red),
            boxShadow: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 0,
                  blurRadius: 7,
                  offset: Offset.fromDirection(1.5, 13))
            ]),
        height: 70,
        child: Padding(
          padding: const EdgeInsets.only(
            left: 15,
            right: 15,
          ),
          child: Row(
            children: [
              InkWell(
                onTap: () => Scaffold.of(context).openDrawer(),
                child: const Icon(
                  Icons.menu,
                  size: 37,
                ),
              ),
              Expanded(
                  child: Container(
                      alignment: Alignment.center,
                      // decoration: BoxDecoration(
                      //     border: Border.all(color: Colors.black)),
                      child: Container(
                          height: 45,
                          width: 120,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                              boxShadow: [
                                BoxShadow(
                                    color: Colors.grey.withOpacity(0.5),
                                    spreadRadius: 5,
                                    blurRadius: 7)
                              ],
                              color: Colors.black,
                              border: Border.all(color: Colors.black),
                              borderRadius: BorderRadius.circular(70)),
                          child: const Text('N\$ 300',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'MoveTextBold',
                                  fontSize: 20))))),
              Text('Other')
            ],
          ),
        ),
      ),
    );
  }
}
