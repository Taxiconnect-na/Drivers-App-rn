// ignore_for_file: file_names
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

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
              decoration: BoxDecoration(
                  border: const Border(top: BorderSide(width: 2)),
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        spreadRadius: 0,
                        blurRadius: 7,
                        offset: Offset.fromDirection(-1.5, 13))
                  ]),
              child: Padding(
                padding: const EdgeInsets.only(top: 8.0, left: 15, right: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.stop,
                          size: 13,
                        ),
                        Text(
                          context
                              .watch<HomeProvider>()
                              .codesToOptions[
                                  context.watch<HomeProvider>().selectedOption]
                              .toString(),
                          style: const TextStyle(
                              fontFamily: 'MoveTextBold', fontSize: 20),
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
      children: [
        const Padding(
          padding: EdgeInsets.only(top: 30, bottom: 35),
          child: Text('What do you want to see?',
              style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 22)),
        ),
        MenuOption(
          titleOption: 'Accepted trips',
          showDivider: true,
          showIndicator: true,
          showChecked:
              context.watch<HomeProvider>().selectedOption == 'accepted',
        ),
        MenuOption(
            titleOption: 'Rides',
            showDivider: true,
            showIndicator: true,
            showChecked:
                context.watch<HomeProvider>().selectedOption == 'ride'),
        MenuOption(
          titleOption: 'Scheduled',
          showDivider: true,
          showIndicator: false,
          showChecked:
              context.watch<HomeProvider>().selectedOption == 'scheduled',
        ),
        const OnlineOfflineBtns(titleOption: 'Go offline', showDivider: false)
      ],
    );
  }
}

class MenuOption extends StatelessWidget {
  final String titleOption;
  final bool showDivider;
  final bool showIndicator;
  final bool showChecked;

  const MenuOption(
      {Key? key,
      required this.titleOption,
      required this.showDivider,
      required this.showIndicator,
      required this.showChecked})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        context.read<HomeProvider>().updateSelectedSwitchOption(
            newOption: context
                .read<HomeProvider>()
                .mapOptionsToCodes[titleOption] as String);
        //Clear the request array
        context
            .read<HomeProvider>()
            .updateTripRequestsMetadata(newTripList: []);
        //Activate the loader
        context.read<HomeProvider>().updateMainLoaderVisibility(option: true);
        //Close modal
        Navigator.of(context).pop();
      },
      child: Column(
        children: [
          SizedBox(
            height: 50,
            child: Padding(
              padding: const EdgeInsets.only(left: 15, right: 15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    titleOption,
                    style: const TextStyle(
                        fontFamily: 'MoveTextRegular', fontSize: 19),
                  ),
                  Row(
                    children: [
                      showIndicator
                          ? const NumberIndicator(
                              number: 2,
                            )
                          : const Text(''),
                      showChecked
                          ? const Padding(
                              padding: EdgeInsets.only(left: 5),
                              child: Icon(Icons.check,
                                  color: Color.fromRGBO(14, 132, 145, 1)),
                            )
                          : const Text(''),
                    ],
                  )
                ],
              ),
            ),
          ),
          showDivider ? const Divider() : const Text('')
        ],
      ),
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
