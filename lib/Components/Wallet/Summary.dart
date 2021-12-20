// ignore_for_file: file_names

import 'dart:developer';

import 'package:badges/badges.dart';
import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/DateParser.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Watcher.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Summary extends StatefulWidget {
  const Summary({Key? key}) : super(key: key);

  @override
  _SummaryState createState() => _SummaryState();
}

class _SummaryState extends State<Summary> {
  final Color genericColor = const Color.fromRGBO(14, 132, 145, 1);

  // Create a new networking instance
  GetWalletDataNet getWalletDataNet = GetWalletDataNet();
  Watcher watcher = Watcher();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    watcher.startWatcher(actuatorFunctions: [
      {'name': 'GetWalletDataNet', 'actuator': getWalletDataNet}
    ], context: context);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    watcher.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.white,
        elevation: 0,
        leading: InkWell(
            onTap: () => Navigator.of(context).pop(() {
                  dispose();
                }),
            child: const Icon(Icons.arrow_back, color: Colors.black)),
        title: const Text(
          'Summary',
          style: TextStyle(
              color: Colors.black, fontFamily: 'MoveBold', fontSize: 23),
        ),
      ),
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 15, right: 15, top: 20, bottom: 20),
            child: Text(
                'Here is quick overview of your wallet balance and the TaxiConnect commission.',
                style: TextStyle(fontFamily: 'MoveTextLight', fontSize: 15)),
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: Text('Due to you',
                      style: TextStyle(
                          fontFamily: 'MoveTextMedium', fontSize: 16)),
                ),
                Padding(
                  padding: const EdgeInsets.all(15),
                  child: Text(
                      context.watch<HomeProvider>().walletData['header'] != null
                          ? context.watch<HomeProvider>().walletData['header']
                                      ['remaining_due_to_driver'] !=
                                  null
                              ? 'N\$${context.watch<HomeProvider>().walletData['header']['remaining_due_to_driver']}'
                              : 'N\$0'
                          : 'N\$0',
                      style: const TextStyle(
                          fontFamily: 'MoveBold', fontSize: 27)),
                ),
                const Divider(
                  thickness: 1,
                  height: 20,
                )
              ],
            ),
          ),
          SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(left: 15, right: 15, top: 15),
                  child: Text('TaxiConnect commission',
                      style: TextStyle(
                          fontFamily: 'MoveTextMedium', fontSize: 16)),
                ),
                Padding(
                  padding: const EdgeInsets.all(15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                          context.watch<HomeProvider>().walletData['header'] !=
                                  null
                              ? context
                                              .watch<HomeProvider>()
                                              .walletData['header']
                                          ['remaining_commission'] !=
                                      null
                                  ? 'N\$${double.parse(context.watch<HomeProvider>().walletData['header']['remaining_commission'].toString()).ceil().toString()}'
                                  : 'N\$0'
                              : 'N\$0',
                          style: TextStyle(
                              fontFamily: 'MoveBold',
                              fontSize: 27,
                              color: genericColor)),
                      Visibility(
                        visible: context
                                    .watch<HomeProvider>()
                                    .walletData['header'] !=
                                null
                            ? context.watch<HomeProvider>().walletData['header']
                                        ['remaining_due_to_driver'] !=
                                    null
                                ? true
                                : false
                            : false,
                        child: Badge(
                          toAnimate: true,
                          shape: BadgeShape.square,
                          badgeColor: const Color.fromRGBO(226, 72, 55, 1),
                          borderRadius: BorderRadius.circular(20),
                          badgeContent: const Padding(
                            padding: EdgeInsets.only(left: 10, right: 10),
                            child: Text('Pending',
                                style: TextStyle(color: Colors.white)),
                          ),
                        ),
                      )
                    ],
                  ),
                ),
                const Divider(
                  thickness: 1,
                  height: 20,
                  color: Colors.white,
                )
              ],
            ),
          ),
          SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 15, right: 15, top: 20),
                  child: Text('Payment date',
                      style: TextStyle(
                          fontFamily: 'MoveTextMedium',
                          color: Colors.grey.shade700)),
                ),
                Padding(
                  padding: const EdgeInsets.all(15),
                  child:
                      context.watch<HomeProvider>().walletData['header'] != null
                          ? context.watch<HomeProvider>().walletData['header']
                                      ['scheduled_payment_date'] !=
                                  null
                              ? Padding(
                                  padding: const EdgeInsets.only(top: 5),
                                  child: Text(
                                      DateParser(context
                                                  .watch<HomeProvider>()
                                                  .walletData['header']
                                              ['scheduled_payment_date'])
                                          .getReadableDate(),
                                      style: const TextStyle(
                                          fontFamily: 'MoveTextMedium',
                                          fontSize: 18,
                                          color: Colors.black)),
                                )
                              : const SizedBox(
                                  width: 15,
                                  height: 15,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.black,
                                  ),
                                )
                          : const SizedBox(
                              width: 15,
                              height: 15,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.black,
                              ),
                            ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 15, right: 15, top: 25),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.only(right: 5),
                        child: Icon(Icons.info, size: 17),
                      ),
                      Flexible(
                        child: Text(
                            'It is important to note that failure to pay the commission at the payment date or 1 day after the payment date will result in your account being temporarily suspended.',
                            style: TextStyle(
                                fontFamily: 'MoveTextRegular',
                                fontSize: 15,
                                color: Colors.grey.shade700)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
