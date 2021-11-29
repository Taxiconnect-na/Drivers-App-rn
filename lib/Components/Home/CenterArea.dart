// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';

class CenterArea extends StatefulWidget {
  const CenterArea({Key? key}) : super(key: key);

  @override
  _CenterAreaState createState() => _CenterAreaState();
}

class _CenterAreaState extends State<CenterArea> {
  final Color mainBackgroundColor = Colors.grey.withOpacity(0.15);

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: Container(
      color: mainBackgroundColor,
      child: Padding(
          padding: const EdgeInsets.only(left: 7, right: 7, top: 7),
          child: ListView.separated(
              padding: const EdgeInsets.only(top: 20, bottom: 70),
              itemBuilder: (context, index) => const RequestCard(),
              separatorBuilder: (context, index) =>
                  const Padding(padding: EdgeInsets.only(top: 20)),
              itemCount: 20)),
    ));
  }
}

//The request card that showcase all the important requests infos.
class RequestCard extends StatelessWidget {
  const RequestCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          border: Border.all(color: const Color.fromRGBO(208, 208, 208, 1)),
          borderRadius: BorderRadius.circular(5),
          boxShadow: [
            BoxShadow(
                color: Colors.grey.withOpacity(0.2),
                spreadRadius: 2,
                blurRadius: 7)
          ],
          color: Colors.white),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 8, left: 8, right: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: const [
                    Icon(Icons.timer, size: 15),
                    Padding(padding: EdgeInsets.only(left: 2)),
                    Text(
                      '5 min away',
                      style:
                          TextStyle(fontSize: 16, fontFamily: 'MoveTextMedium'),
                    ),
                  ],
                ),
                const Text(
                  'Sent 15:05',
                  style: TextStyle(fontSize: 15),
                )
              ],
            ),
          ),
          const Divider(
            thickness: 1,
            height: 20,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Container(
                    alignment: Alignment.centerRight,
                    // color: Colors.red,
                    child: Text('ConnectUS',
                        style: TextStyle(
                            fontFamily: 'MoveTextBold', fontSize: 16))),
              ),
              Flexible(
                child: Column(
                  children: const [
                    Text(
                      'N\$30',
                      style: TextStyle(
                          fontFamily: 'MoveBold',
                          fontSize: 25,
                          color: Color.fromRGBO(9, 134, 74, 1)),
                    ),
                    Text('CASH',
                        style: TextStyle(color: Color.fromRGBO(9, 134, 74, 1)))
                  ],
                ),
              ),
              Flexible(
                child: Container(
                  alignment: Alignment.centerLeft,
                  // color: Colors.red,
                  width: 100,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: const [
                      Icon(Icons.person, size: 20),
                      Text('1',
                          style: TextStyle(
                              fontSize: 20, fontFamily: 'MoveTextMedium'))
                    ],
                  ),
                ),
              )
            ],
          ),
          const Divider(
            thickness: 1,
            height: 25,
          ),
          const OriginDestinationPrest(),
          const Divider(
            thickness: 1,
            height: 25,
          ),
          Padding(
            padding:
                const EdgeInsets.only(top: 10, bottom: 15, left: 15, right: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text(
                  'Decline',
                  style: TextStyle(
                      fontSize: 18, color: Color.fromRGBO(178, 34, 34, 1)),
                ),
                ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        primary: const Color.fromRGBO(9, 110, 212, 1),
                        padding: const EdgeInsets.only(
                            top: 17, bottom: 20, left: 40, right: 40),
                        textStyle: const TextStyle(
                            fontFamily: 'MoveBold', fontSize: 23)),
                    onPressed: () => showMaterialModalBottomSheet(
                        duration: const Duration(milliseconds: 350),
                        context: context,
                        builder: (context) {
                          return const TripDetails();
                        }),
                    child: const Text('Accept'))
              ],
            ),
          )
        ],
      ),
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
        padding: const EdgeInsets.only(left: 8, right: 8),
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
                  Container(
                    width: 1,
                    height: 48,
                    decoration:
                        BoxDecoration(border: Border.all(color: Colors.black)),
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
