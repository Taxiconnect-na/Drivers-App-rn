// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taxiconnectdrivers/Components/Helpers/DateParser.dart';
import 'package:taxiconnectdrivers/Components/Helpers/LocationOpsHandler.dart';
import 'package:taxiconnectdrivers/Components/Helpers/RequestCardHelper.dart';
import 'package:taxiconnectdrivers/Components/Home/TripDetails.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:provider/provider.dart';

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
          padding: const EdgeInsets.only(top: 7),
          child: context
                      .watch<HomeProvider>()
                      .locationServicesStatus['isLocationServiceEnabled'] &&
                  context
                      .watch<HomeProvider>()
                      .locationServicesStatus['isLocationPermissionGranted'] &&
                  context
                          .watch<HomeProvider>()
                          .locationServicesStatus['isLocationDeniedForever'] ==
                      false
              ? context.watch<HomeProvider>().tripRequestsData.isNotEmpty
                  ? ListView.separated(
                      padding: const EdgeInsets.only(top: 20, bottom: 70),
                      itemBuilder: (context, index) => RequestCard(
                          requestData: context
                              .read<HomeProvider>()
                              .tripRequestsData[index]),
                      separatorBuilder: (context, index) =>
                          const Padding(padding: EdgeInsets.only(top: 15)),
                      itemCount:
                          context.read<HomeProvider>().tripRequestsData.length)
                  : const EmptyTripsWindow()
              : const RequestLocationWindow()),
    ));
  }
}

//Show empty trips window
class EmptyTripsWindow extends StatelessWidget {
  const EmptyTripsWindow({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: Column(
        children: [
          Expanded(
              child: Padding(
            padding: const EdgeInsets.only(left: 20, right: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 15),
                  child: Icon(Icons.sync_outlined,
                      size: 50, color: Colors.grey.shade600),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Text('No rides to far',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontFamily: 'MoveTextMedium',
                          color: Colors.grey.shade600,
                          fontSize: 18)),
                ),
                Text('We\'ll notify you when new requests come.',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(color: Colors.grey.shade600, fontSize: 16)),
              ],
            ),
          ))
        ],
      ),
    );
  }
}

//Show request for location window
class RequestLocationWindow extends StatelessWidget {
  const RequestLocationWindow({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
            child: Padding(
          padding: const EdgeInsets.only(left: 20, right: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 15),
                child: Icon(Icons.sync_outlined,
                    size: 50, color: Colors.grey.shade600),
              ),
              Text(
                  'You will start seeing new requests after activating your location.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 15)),
            ],
          ),
        )),
        InkWell(
          onTap: () {
            //Update the auto ask state - free it
            context.read<HomeProvider>().updateAutoAskGprsCoords(didAsk: false);
            //...
            LocationOpsHandler locationOpsHandler =
                LocationOpsHandler(context: context);
            locationOpsHandler.requestLocationPermission(isUserTriggered: true);
          },
          child: Container(
              width: MediaQuery.of(context).size.width,
              alignment: Alignment.centerLeft,
              height: 200,
              decoration:
                  const BoxDecoration(color: Color.fromRGBO(9, 110, 212, 1)),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ListTile(
                      title: Row(
                        children: const [
                          Padding(
                            padding: EdgeInsets.only(right: 4),
                            child: Icon(Icons.location_disabled_sharp,
                                color: Colors.white),
                          ),
                          Text('Your location is off.',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'MoveBold',
                                  fontSize: 23)),
                        ],
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(left: 31, top: 10),
                        child: Column(
                          children: [
                            Text(
                                context
                                            .watch<HomeProvider>()
                                            .locationServicesStatus[
                                        'isLocationDeniedForever']
                                    ? 'Your locations services need to be on for an optimal experience. You need the activate it from your settings.'
                                    : 'Your locations services need to be on for an optimal experience.',
                                style: const TextStyle(color: Colors.white)),
                            Padding(
                              padding: const EdgeInsets.only(top: 12),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: const [
                                  Text('Click here to activate it.',
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontFamily: 'MoveTextMedium',
                                          fontSize: 16)),
                                  Icon(Icons.arrow_forward, color: Colors.white)
                                ],
                              ),
                            )
                          ],
                        ),
                      )),
                ],
              )),
        )
      ],
    );
  }
}

//The request card that showcase all the important requests infos.
class RequestCard extends StatelessWidget {
  final Map requestData;

  const RequestCard({Key? key, required this.requestData}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 7, right: 7),
      child: Container(
        decoration: BoxDecoration(
            border: Border.all(color: const Color.fromRGBO(208, 208, 208, 1)),
            borderRadius: BorderRadius.circular(5),
            boxShadow: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
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
                    children: [
                      const Icon(Icons.timer, size: 15),
                      const Padding(padding: EdgeInsets.only(left: 2)),
                      Text(
                        requestData['ride_basic_infos']['inRideToDestination']
                            ? 'Picked up'
                            : requestData['eta_to_passenger_infos']['eta'],
                        style: const TextStyle(
                            fontSize: 16, fontFamily: 'MoveTextMedium'),
                      ),
                    ],
                  ),
                  Text(
                    'Sent ${DateParser(requestData['ride_basic_infos']['wished_pickup_time']).getReadableTime()}',
                    style: const TextStyle(fontSize: 15),
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
                      child: Text(
                          requestData['ride_basic_infos']['connect_type'],
                          style: const TextStyle(
                              fontFamily: 'MoveTextBold', fontSize: 16))),
                ),
                Flexible(
                  child: Column(
                    children: [
                      Text(
                        'N\$${requestData['ride_basic_infos']['fare_amount']}',
                        style: const TextStyle(
                            fontFamily: 'MoveBold',
                            fontSize: 25,
                            color: Color.fromRGBO(9, 134, 74, 1)),
                      ),
                      Text(
                          requestData['ride_basic_infos']['payment_method']
                              .toString()
                              .toUpperCase(),
                          style: const TextStyle(
                              color: Color.fromRGBO(9, 134, 74, 1)))
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
                      children: [
                        const Icon(Icons.person, size: 20),
                        Text(
                            requestData['ride_basic_infos']['passengers_number']
                                .toString(),
                            style: const TextStyle(
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
            OriginDestinationPrest(
              requestData: requestData,
            ),
            const Divider(
              thickness: 1,
              height: 25,
            ),
            Padding(
              padding: const EdgeInsets.only(
                  top: 10, bottom: 15, left: 15, right: 10),
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
      ),
    );
  }
}

//Origin / destination drawing presentation
class OriginDestinationPrest extends StatelessWidget {
  final Map requestData;
  final RequestCardHelper requestCardHelper = RequestCardHelper();

  OriginDestinationPrest({Key? key, required this.requestData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      // color: Colors.amber,
      alignment: Alignment.topLeft,
      child: Padding(
        padding: const EdgeInsets.only(left: 8, right: 8),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 6),
                    child: Icon(
                      Icons.circle,
                      size: 8,
                    ),
                  ),
                  Flexible(
                    child: Container(
                      width: 1,
                      decoration: BoxDecoration(
                          border: Border.all(color: Colors.black)),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 23),
                    child: Icon(
                      Icons.stop,
                      size: 15,
                      color: Color.fromRGBO(9, 110, 212, 1),
                    ),
                  )
                ],
              ),
              Expanded(
                child: Column(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          // color: Colors.orange,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                // color: Colors.green,
                                height: 33,
                                child: const Padding(
                                  padding: EdgeInsets.only(top: 2),
                                  child: SizedBox(
                                      width: 45,
                                      child: Text(
                                        'From',
                                        style: TextStyle(
                                            fontFamily: 'MoveTextLight'),
                                      )),
                                ),
                              ),
                              Expanded(
                                child: Container(
                                  alignment: Alignment.centerLeft,
                                  // color: Colors.amber,
                                  child: Column(
                                    children: requestCardHelper
                                        .fitLocationWidgetsToList(
                                            context: context,
                                            locationData: [
                                          requestData[
                                                  'origin_destination_infos']
                                              ['pickup_infos']
                                        ]),
                                  ),
                                ),
                              )
                            ],
                          ),
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
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              // color: Colors.green,
                              height: 34,
                              child: const Padding(
                                padding: EdgeInsets.only(top: 3),
                                child: SizedBox(
                                    width: 45,
                                    child: Text(
                                      'To',
                                      style: TextStyle(
                                          fontFamily: 'MoveTextLight'),
                                    )),
                              ),
                            ),
                            Expanded(
                              child: Container(
                                alignment: Alignment.centerLeft,
                                // color: Colors.amber,
                                child: Column(
                                  children: requestCardHelper
                                      .fitLocationWidgetsToList(
                                          context: context,
                                          locationData: requestData[
                                                  'origin_destination_infos']
                                              ['destination_infos']),
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
      ),
    );
  }
}
