// ignore_for_file: file_names

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/DateParser.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Watcher.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class Payouts extends StatefulWidget {
  const Payouts({Key? key}) : super(key: key);

  @override
  _PayoutsState createState() => _PayoutsState();
}

class _PayoutsState extends State<Payouts> {
  // Create a new networking instance
  GetWalletTransactionalDataNet getWalletDataNet =
      GetWalletTransactionalDataNet();
  Watcher watcher2 = Watcher();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    watcher2.startWatcher(actuatorFunctions: [
      {'name': 'GetWalletTransactionalDataNet', 'actuator': getWalletDataNet}
    ], context: context);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    watcher2.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.white,
        elevation: 0,
        leading: InkWell(
            onTap: () => Navigator.of(context).pop(),
            child: const Icon(Icons.arrow_back, color: Colors.black)),
        title: const Text(
          'Wallet payout',
          style: TextStyle(
              color: Colors.black, fontFamily: 'MoveBold', fontSize: 23),
        ),
      ),
      backgroundColor: Colors.white,
      body: SafeArea(
          child: context
                      .watch<HomeProvider>()
                      .walletTransactionsData['transactions_data'] !=
                  null
              ? context
                          .watch<HomeProvider>()
                          .walletTransactionsData['transactions_data']
                          .length >
                      0
                  ? ListView.separated(
                      padding: EdgeInsets.only(top: 15),
                      itemBuilder: (context, index) => PayoutElement(
                            transactionData: context
                                    .watch<HomeProvider>()
                                    .walletTransactionsData['transactions_data']
                                [index],
                          ),
                      separatorBuilder: (context, int) => Divider(),
                      itemCount:
                          context.watch<HomeProvider>().walletTransactionsData[
                                      'transactions_data'] !=
                                  null
                              ? context
                                  .watch<HomeProvider>()
                                  .walletTransactionsData['transactions_data']
                                  .length
                              : 0)
                  : emptyRecords(context: context)
              : emptyRecords(context: context)),
    );
  }

  Widget emptyRecords({required BuildContext context}) {
    return mapEquals({}, context.watch<HomeProvider>().walletTransactionsData)
        ? const SizedBox(
            height: 2,
            child: LinearProgressIndicator(
              color: Colors.black,
              backgroundColor: Colors.grey,
            ),
          )
        : SizedBox(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height * 0.5,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.widgets, size: 50, color: Colors.grey),
                Padding(
                  padding: const EdgeInsets.only(left: 15, right: 15, top: 25),
                  child: Text('Looks like your wallet payout is empty.',
                      style:
                          TextStyle(fontSize: 16, color: Colors.grey.shade700)),
                )
              ],
            ),
          );
  }
}

class PayoutElement extends StatelessWidget {
  final Color genericColor = const Color.fromRGBO(14, 132, 145, 1);
  final Map transactionData;

  const PayoutElement({Key? key, required this.transactionData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      horizontalTitleGap: -10,
      leading: const Padding(
        padding: EdgeInsets.only(top: 5),
        child: Icon(Icons.stop, size: 10, color: Colors.black),
      ),
      title: Text(
          getReadableNature(nature: transactionData['transaction_nature']),
          style: const TextStyle(fontFamily: 'MoveTextMedium')),
      subtitle: Text(transactionData['date_made']),
      trailing: Text('N\$${transactionData['amount']}',
          style: TextStyle(
              fontFamily: 'MoveBold', fontSize: 17, color: genericColor)),
    );
  }

  //Get the readable nature of the transaction
  String getReadableNature({required String nature}) {
    final Map natureCoresps = {
      'weeklypaiddriverautomatic': 'Weekly payout',
      'paiddriver': 'Received',
      'senttodriver': 'Received',
      'commissiontcsubtracted': 'Paid commission',
      'ride': 'Paid for ${nature.toLowerCase()}',
      'delivery': 'Paid for ${nature.toLowerCase()}'
    };
    //...
    try {
      return natureCoresps[nature.toLowerCase()];
    } catch (e) {
      return 'Transaction';
    }
  }
}
