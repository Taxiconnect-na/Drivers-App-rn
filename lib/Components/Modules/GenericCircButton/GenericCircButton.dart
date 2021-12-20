// ignore_for_file: file_names

import 'package:flutter/material.dart';

class GenericCircButton extends StatelessWidget {
  final actuatorFunctionl; //! The function that will be fired when the button is clicked.
  const GenericCircButton({Key? key, required this.actuatorFunctionl})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: actuatorFunctionl,
        child: Container(
          width: 70,
          height: 70,
          decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 5,
                  blurRadius: 5,
                )
              ],
              shape: BoxShape.circle,
              color: const Color.fromRGBO(9, 110, 212, 1)),
          child: const Icon(
            Icons.arrow_forward,
            size: 33,
            color: Colors.white,
          ),
        ));
  }
}
