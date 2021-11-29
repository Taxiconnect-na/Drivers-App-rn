// ignore_for_file: file_names

import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';

class TripDetails extends StatefulWidget {
  const TripDetails({Key? key}) : super(key: key);

  @override
  _TripDetailsState createState() => _TripDetailsState();
}

class _TripDetailsState extends State<TripDetails> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      height: MediaQuery.of(context).size.height,
      child: SafeArea(
          child: Column(
        children: [
          Container(
            decoration: BoxDecoration(color: Colors.white, boxShadow: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.08),
                  spreadRadius: 0,
                  blurRadius: 7,
                  offset: Offset.fromDirection(1.5, 13))
            ]),
            child: ListTile(
              horizontalTitleGap: 0,
              leading: InkWell(
                  onTap: () => Navigator.pop(context),
                  child: const Icon(Icons.arrow_back, color: Colors.black)),
              title: InkWell(
                onTap: () => Navigator.pop(context),
                child: const Text('Trip details',
                    style:
                        TextStyle(fontFamily: 'MoveTextMedium', fontSize: 17)),
              ),
              trailing: Text('Other'),
            ),
          ),
          // User details
          Container(
            height: 80,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.1),
            ),
            child: const ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.grey,
                radius: 30,
              ),
              title: Text('Jessy',
                  style: TextStyle(fontFamily: 'MoveTextBold', fontSize: 18)),
              subtitle: Text('Arrived',
                  style: TextStyle(
                      color: Color.fromRGBO(9, 110, 212, 1), fontSize: 15)),
              trailing: Icon(
                Icons.phone,
                color: Color.fromRGBO(9, 110, 212, 1),
                size: 30,
              ),
            ),
          ),
          // General buttons
          Padding(
            padding: const EdgeInsets.only(left: 15, right: 15, top: 15),
            child: Row(
              children: [
                ButtonGeneralPurpose(
                  title: 'Find client',
                  showIcon: true,
                  flex: 1,
                  alignment: Alignment.centerLeft,
                  textColor: Colors.white,
                  backgroundColor: Colors.black,
                  showTrailingArrow: false,
                ),
                const Padding(padding: EdgeInsets.symmetric(horizontal: 4)),
                ButtonGeneralPurpose(
                  title: 'Confirm pickup',
                  showIcon: false,
                  showTrailingArrow: true,
                  flex: 2,
                  fontFamily: 'MoveTextBold',
                  fontSize: 19,
                  backgroundColor: const Color.fromRGBO(9, 110, 212, 1),
                  textColor: Colors.white,
                  alignment: Alignment.center,
                )
              ],
            ),
          ),
          //Trip trajectory details
          const TitleIntros(
            title: 'Trip',
            topPadding: 45,
          ),
          //Pickup/destination details
          const OriginDestinationPrest(),
          //Payment-passengers strip
          const PaymentPassengersStrip(),
          //Safety section
          const TitleIntros(
            title: 'Safety',
            topPadding: 35,
          ),
          const ListTile(
            horizontalTitleGap: 0,
            leading:
                Icon(Icons.security, color: Color.fromRGBO(178, 34, 34, 1)),
            title: Text('Emergency call',
                style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 17)),
            subtitle: Text('Reach quickly the police.'),
          )
        ],
      )),
    );
  }
}

// Title intros
class TitleIntros extends StatelessWidget {
  final String title;
  final double topPadding;

  const TitleIntros({Key? key, required this.title, required this.topPadding})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      // decoration: BoxDecoration(border: Border.all(color: Colors.black)),
      child: Padding(
        padding: EdgeInsets.only(left: 15, top: topPadding, bottom: 15),
        child: Text(title,
            style: const TextStyle(
                fontFamily: 'MoveTextMedium',
                fontSize: 16,
                color: Color.fromRGBO(124, 110, 110, 1))),
      ),
    );
  }
}

// Button general purpose
class ButtonGeneralPurpose extends StatelessWidget {
  final String title;
  final bool showIcon;
  final int flex;
  final bool showTrailingArrow;
  double? fontSize = 15;
  String? fontFamily = 'MoveTextRegular';
  Color? textColor = Colors.white;
  Color? backgroundColor = const Color.fromRGBO(9, 110, 212, 1);
  Alignment? alignment = Alignment.center;

  ButtonGeneralPurpose({
    Key? key,
    required this.title,
    required this.showIcon,
    required this.flex,
    required this.showTrailingArrow,
    this.fontSize,
    this.fontFamily,
    this.textColor,
    this.backgroundColor,
    this.alignment,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Flexible(
      flex: flex,
      child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: EdgeInsets.zero,
            primary: backgroundColor,
          ),
          onPressed: () => print('Find client pressed'),
          child: ListTile(
            contentPadding: EdgeInsets.only(left: 5, right: 5),
            minVerticalPadding: 0,
            horizontalTitleGap: 0,
            minLeadingWidth: 0,
            leading: showIcon
                ? Container(
                    // color: Colors.amber,
                    height: 30,
                    child: Icon(Icons.navigation_sharp,
                        size: 18, color: textColor))
                : null,
            title: Container(
                height: 30,
                alignment: alignment,
                // color: Colors.red,
                child: Text(
                  title,
                  style: TextStyle(
                      fontSize: fontSize,
                      fontFamily: fontFamily,
                      color: textColor),
                )),
            trailing: showTrailingArrow
                ? Icon(
                    Icons.arrow_forward,
                    color: textColor,
                  )
                : null,
          )),
    );
  }
}

//Origin / destination drawing presentation
class OriginDestinationPrest extends StatelessWidget {
  const OriginDestinationPrest({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      // color: Colors.amber,
      alignment: Alignment.topLeft,
      child: Padding(
        padding: const EdgeInsets.only(left: 15, right: 15),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              // color: Colors.blue,
              child: Column(
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 7),
                    child: Icon(
                      Icons.circle,
                      size: 8,
                    ),
                  ),
                  DottedBorder(
                    color: Colors.black,
                    strokeWidth: 1,
                    padding: EdgeInsets.all(0.5),
                    borderType: BorderType.RRect,
                    dashPattern: [4, 1],
                    child: Container(
                      // width: 1,
                      height: 48,
                    ),
                  ),
                  const Icon(
                    Icons.stop,
                    size: 15,
                    color: Color.fromRGBO(9, 110, 212, 1),
                  )
                ],
              ),
            ),
            Expanded(
              child: Column(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          const SizedBox(
                            // color: Colors.green,
                            height: 33,
                            child: SizedBox(
                                width: 45,
                                child: Text(
                                  'From',
                                  style: TextStyle(fontFamily: 'MoveTextLight'),
                                )),
                          ),
                          Expanded(
                            child: Container(
                              alignment: Alignment.centerLeft,
                              // color: Colors.amber,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: MediaQuery.of(context).size.width,
                                    child: const Text('Academia',
                                        style: TextStyle(
                                            fontFamily: 'MoveTextBold',
                                            fontSize: 19)),
                                  ),
                                  SizedBox(
                                      width: MediaQuery.of(context).size.width,
                                      child: const Text('Voltaire street',
                                          style: TextStyle(fontSize: 15)))
                                ],
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  //Destination
                  Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Container(
                            // color: Colors.green,
                            height: 34,
                            child: const SizedBox(
                                width: 45,
                                child: Text(
                                  'To',
                                  style: TextStyle(fontFamily: 'MoveTextLight'),
                                )),
                          ),
                          Expanded(
                            child: Container(
                              alignment: Alignment.centerLeft,
                              // color: Colors.amber,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: MediaQuery.of(context).size.width,
                                    child: const Text('Katutura',
                                        style: TextStyle(
                                            fontFamily: 'MoveTextBold',
                                            fontSize: 19)),
                                  ),
                                  SizedBox(
                                      width: MediaQuery.of(context).size.width,
                                      child: const Text('Mika street',
                                          style: TextStyle(fontSize: 15)))
                                ],
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

//Payment-passenger strip
class PaymentPassengersStrip extends StatelessWidget {
  const PaymentPassengersStrip({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 45),
      child: Container(
        height: 60,
        decoration: BoxDecoration(
            // border: Border.all(color: Colors.red),
            color: Colors.grey.withOpacity(0.1)),
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              //Payment method
              SizedBox(
                width: 80,
                child: Row(
                  children: const [
                    Icon(Icons.credit_card, size: 20),
                    Text('Cash', style: TextStyle(fontSize: 17)),
                  ],
                ),
              ),
              //Amount payment
              const Text('N\$30',
                  style: TextStyle(
                      fontFamily: 'MoveBold',
                      fontSize: 25,
                      color: Color.fromRGBO(9, 134, 74, 1))),
              //Number of passengers
              SizedBox(
                width: 100,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: const [
                    Icon(Icons.person, size: 19),
                    Text('1',
                        style: TextStyle(
                            fontSize: 18, fontFamily: 'MoveTextMedium'))
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
