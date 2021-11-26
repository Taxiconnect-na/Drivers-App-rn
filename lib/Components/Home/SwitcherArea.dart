// ignore_for_file: file_names
import 'dart:developer';
import 'package:flutter/material.dart';

class SwictherArea extends StatefulWidget {
  const SwictherArea({Key? key}) : super(key: key);

  @override
  _SwictherAreaState createState() => _SwictherAreaState();
}

class _SwictherAreaState extends State<SwictherArea> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: 110,
        width: MediaQuery.of(context).size.width,
        child: InkWell(
          onTap: () => showModalBottomSheet(
              context: context,
              builder: (context) {
                return Container(
                  color: Colors.white,
                  child: SafeArea(
                      bottom: false,
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: const ModalForSelections(),
                      )),
                );
              }),
          child: SafeArea(
            top: false,
            child: Container(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.only(top: 8.0, left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(
                          Icons.stop,
                          size: 15,
                        ),
                        Text(
                          'Rides',
                          style: TextStyle(
                              fontFamily: 'MoveTextBold', fontSize: 23),
                        )
                      ],
                    ),
                    const NumberIndicator(number: 4)
                  ],
                ),
              ),
            ),
          ),
        ));
  }
}

// The number indicator showing the number of trips for various scenarios
class NumberIndicator extends StatelessWidget {
  final int number;

  const NumberIndicator({Key? key, required this.number}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      alignment: Alignment.center,
      decoration: BoxDecoration(
          color: const Color.fromRGBO(178, 34, 34, 1),
          border: Border.all(color: const Color.fromRGBO(178, 34, 34, 1)),
          borderRadius: BorderRadius.circular(100)),
      child: Text(number.toString(),
          style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontFamily: 'MoveTextRegular')),
    );
  }
}

// The modal for the various selections
class ModalForSelections extends StatelessWidget {
  const ModalForSelections({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        Padding(
          padding: EdgeInsets.only(top: 30, bottom: 35),
          child: Text('What do you want to see?',
              style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 22)),
        ),
        MenuOption(
          titleOption: 'Accepted trips',
          showDivider: true,
          showIndicator: true,
        ),
        MenuOption(
          titleOption: 'Rides',
          showDivider: true,
          showIndicator: true,
        ),
        MenuOption(
          titleOption: 'Scheduled',
          showDivider: true,
          showIndicator: false,
        ),
        OnlineOfflineBtns(titleOption: 'Go offline', showDivider: false)
      ],
    );
  }
}

class MenuOption extends StatelessWidget {
  final String titleOption;
  final bool showDivider;
  final bool showIndicator;

  const MenuOption(
      {Key? key,
      required this.titleOption,
      required this.showDivider,
      required this.showIndicator})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: Text(
            titleOption,
            style: const TextStyle(fontFamily: 'MoveTextRegular', fontSize: 19),
          ),
          trailing: showIndicator
              ? const NumberIndicator(
                  number: 2,
                )
              : const Text(''),
        ),
        showDivider ? const Divider() : const Text('')
      ],
    );
  }
}

//Go offline/online buttons
class OnlineOfflineBtns extends StatelessWidget {
  final String titleOption;
  final bool showDivider;

  const OnlineOfflineBtns(
      {Key? key, required this.titleOption, required this.showDivider})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: Text(
            titleOption,
            style: const TextStyle(
                fontFamily: 'MoveTextMedium',
                fontSize: 19,
                color: Color.fromRGBO(178, 34, 34, 1)),
          ),
          trailing: const Icon(
            Icons.arrow_forward_ios,
            size: 15,
            color: Color.fromRGBO(178, 34, 34, 1),
          ),
        ),
        showDivider ? const Divider() : const Text('')
      ],
    );
  }
}
