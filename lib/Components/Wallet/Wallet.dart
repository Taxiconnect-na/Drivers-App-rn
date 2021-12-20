// ignore_for_file: file_names

import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/DateParser.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Watcher.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Wallet extends StatefulWidget {
  const Wallet({Key? key}) : super(key: key);

  @override
  _WalletState createState() => _WalletState();
}

class _WalletState extends State<Wallet> {
  // Create a new networking instance
  GetWalletDataNet getWalletDataNet = GetWalletDataNet();
  Watcher watcher = Watcher();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    log('INITIALIZED');

    watcher.startWatcher(actuatorFunctions: [
      {'name': 'GetWalletDataNet', 'actuator': getWalletDataNet}
    ], context: context);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    log('DISPOSE');
    super.dispose();
    watcher.dispose();
  }

  @override
  void deactivate() {
    // TODO: implement deactivate
    super.deactivate();
    log('DEACTIVATED');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.white,
        elevation: 0,
        leading: InkWell(
            onTap: () => Navigator.of(context).pushReplacementNamed('/Home'),
            child: const Icon(Icons.arrow_back, color: Colors.black)),
        title: const Text(
          'Wallet',
          style: TextStyle(
              color: Colors.black, fontFamily: 'MoveBold', fontSize: 23),
        ),
      ),
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const HeaderPartWallet(),
          Expanded(
            child: SafeArea(
              bottom: false,
              child: Container(
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          spreadRadius: 3,
                          blurRadius: 6)
                    ],
                    color: Colors.white,
                    borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(35),
                        topRight: Radius.circular(35))),
                child: const Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: WalletBottomPart(),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

//Header part of the wallet entry
class HeaderPartWallet extends StatelessWidget {
  const HeaderPartWallet({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 250,
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 25),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(shape: BoxShape.circle, boxShadow: [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        spreadRadius: 4,
                        blurRadius: 8)
                  ]),
                  child: const CircleAvatar(
                    backgroundImage: AssetImage('assets/Images/girl.jpg'),
                    radius: 40,
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 20,
            ),
            Container(
              alignment: Alignment.center,
              width: MediaQuery.of(context).size.width,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                      context.watch<HomeProvider>().walletData['header'] != null
                          ? context.watch<HomeProvider>().walletData['header']
                                      ['remaining_due_to_driver'] !=
                                  null
                              ? 'N\$${context.watch<HomeProvider>().walletData['header']['remaining_due_to_driver']}'
                              : 'N\$0'
                          : 'N\$0',
                      style: const TextStyle(
                          fontFamily: 'MoveBold',
                          fontSize: 40,
                          color: Color.fromRGBO(14, 132, 145, 1))),
                  const Text('Your balance',
                      style: TextStyle(fontSize: 17, color: Colors.grey)),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

//Bottom part of the wallet entry
class WalletBottomPart extends StatelessWidget {
  final Color genericColor = const Color.fromRGBO(14, 132, 145, 1);

  const WalletBottomPart({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        ListTile(
          horizontalTitleGap: -5,
          contentPadding: const EdgeInsets.only(left: 15, right: 15),
          leading: const Icon(
            Icons.info,
            color: Colors.black,
            size: 25,
          ),
          title: const Text('Payment scheduled for the',
              style: TextStyle(fontSize: 16)),
          subtitle: context.watch<HomeProvider>().walletData['header'] != null
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
                              fontFamily: 'MoveBold',
                              fontSize: 17,
                              color: Colors.black)),
                    )
                  : const SizedBox(
                      width: 15,
                      height: 5,
                      child: LinearProgressIndicator(
                        color: Colors.black,
                        backgroundColor: Colors.grey,
                      ),
                    )
              : const SizedBox(
                  width: 15.0,
                  height: 35.0,
                  child: Center(
                    child: LinearProgressIndicator(
                      color: Colors.black,
                      backgroundColor: Colors.grey,
                    ),
                  ),
                ),
        ),
        const Divider(
          thickness: 1,
        ),
        Padding(
          padding: const EdgeInsets.only(left: 15, right: 15),
          child: Column(
            children: [
              ListTile(
                onTap: () => Navigator.of(context).pushNamed('/WalletSummary'),
                horizontalTitleGap: -5,
                contentPadding: const EdgeInsets.only(left: 0),
                leading: const Padding(
                  padding: EdgeInsets.only(bottom: 20),
                  child: Icon(
                    Icons.stop,
                    color: Colors.black,
                    size: 25,
                  ),
                ),
                title: Text('Summary',
                    style: TextStyle(
                        fontFamily: 'MoveTextMedium',
                        fontSize: 18,
                        color: genericColor)),
                subtitle: const Text('A quick overview of your wallet.'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 12),
              ),
              const Divider(),
              // ListTile(
              //   // onTap: () => Navigator.of(context).pushNamed('/WalletSummary'),
              //   horizontalTitleGap: -5,
              //   contentPadding: const EdgeInsets.only(left: 0),
              //   leading: const Icon(
              //     Icons.leaderboard,
              //     color: Colors.black,
              //     size: 25,
              //   ),
              //   title: Text('Earnings',
              //       style: TextStyle(
              //           fontFamily: 'MoveTextMedium',
              //           fontSize: 18,
              //           color: genericColor)),
              //   subtitle:
              //       const Text('View more details about your weekly earnings.'),
              //   trailing: const Icon(Icons.arrow_forward_ios, size: 12),
              // ),
              // const Divider(),
              ListTile(
                onTap: () => Navigator.of(context).pushNamed('/WalletPayout'),
                horizontalTitleGap: -5,
                contentPadding: const EdgeInsets.only(left: 0),
                leading: const Padding(
                  padding: EdgeInsets.only(bottom: 20),
                  child: Icon(
                    Icons.event_note,
                    color: Colors.black,
                    size: 25,
                  ),
                ),
                title: Text('Wallet payout',
                    style: TextStyle(
                        fontFamily: 'MoveTextMedium',
                        fontSize: 18,
                        color: genericColor)),
                subtitle: const Text(
                    'View all the individual transactions made to your wallet.'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
