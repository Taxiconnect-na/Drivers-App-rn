// ignore_for_file: file_names

import 'package:flutter/material.dart';

class CenterArea extends StatefulWidget {
  const CenterArea({Key? key}) : super(key: key);

  @override
  _CenterAreaState createState() => _CenterAreaState();
}

class _CenterAreaState extends State<CenterArea> {
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
          decoration: const BoxDecoration(color: Colors.grey),
          child: ListView(
            children: const [
              Text('Request 1'),
              Text('Request 1'),
              Text('Request 1')
            ],
          )),
    );
  }
}

//The request card that showcase all the important requests infos.
class RequestCard extends StatelessWidget {
  const RequestCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
