import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/RequestCardHelper.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class DetailedTripShow extends StatefulWidget {
  const DetailedTripShow({Key? key}) : super(key: key);

  @override
  _DetailedTripShowState createState() => _DetailedTripShowState();
}

class _DetailedTripShowState extends State<DetailedTripShow> {
  getRideHistoryTargeted _getRideHistoryTargeted = getRideHistoryTargeted();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //Activate the loader
    context
        .read<HomeProvider>()
        .updateMainLoaderVisibility(option: true, shouldUpdate: false);
    //! Check if there are any tempo fp selected, else go back
    if (context.read<HomeProvider>().tempoRideHistoryFocusedFP.isEmpty) {
      Navigator.of(context).pop();
    } else //Get the data
    {
      _getRideHistoryTargeted.exec(context: context);
    }
    //..
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return Future.value(false);
      },
      child: Scaffold(
        appBar: AppBar(
            backgroundColor: Colors.black,
            leading: IconButton(
              padding: EdgeInsets.only(left: 0),
              visualDensity: VisualDensity.comfortable,
              onPressed: () {
                //Clear the array
                context
                    .read<HomeProvider>()
                    .updateRideHistorySelectedData(data: []);
                Navigator.of(context).pop();
              },
              icon: const Icon(Icons.arrow_back),
            ),
            title: const Text('Details',
                style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
            centerTitle: true),
        backgroundColor: Colors.white,
        body: RefreshIndicator(
          onRefresh: () async {
            _getRideHistoryTargeted.exec(context: context);
            //...
            return Future.delayed(Duration(seconds: 2), () {});
          },
          child: context
                      .watch<HomeProvider>()
                      .rideHistorySelectedData
                      .isEmpty &&
                  context.watch<HomeProvider>().shouldShowMainLoader == false
              ? Text('Error')
              : context.watch<HomeProvider>().rideHistorySelectedData.isEmpty &&
                      context.watch<HomeProvider>().shouldShowMainLoader
                  ? Container(
                      width: MediaQuery.of(context).size.width,
                      child: const LoaderInstance(),
                    )
                  : SafeArea(
                      child: ListView(
                        padding: const EdgeInsets.only(bottom: 70),
                        children: [
                          Container(
                            color: Colors.amber,
                            height: 200,
                            child: Image.network(
                              'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/17.0824,-22.5747,11.8,0/1280x1280?access_token=pk.eyJ1IjoiZG9taW5pcXVla3R0IiwiYSI6ImNrYXg0M3gyNDAybDgyem81cjZuMXp4dzcifQ.PpW6VnORUHYSYqNCD9n6Yg',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                      width: MediaQuery.of(context).size.width,
                                      height: 200,
                                      alignment: Alignment.center,
                                      child:
                                          const Text("Couldn't load the map.")),
                            ),
                          ),
                          Container(
                            width: MediaQuery.of(context).size.width,
                            decoration:
                                BoxDecoration(color: Colors.black, boxShadow: [
                              BoxShadow(
                                  color: Colors.grey.withOpacity(0.6),
                                  spreadRadius: 0,
                                  blurRadius: 4,
                                  offset: Offset.fromDirection(1.5, 6))
                            ]),
                            height: 35,
                            alignment: Alignment.centerLeft,
                            child: Padding(
                              padding: EdgeInsets.only(left: 15, right: 15),
                              child: Text(
                                context
                                    .watch<HomeProvider>()
                                    .rideHistorySelectedData[0]
                                        ['date_requested']
                                    .toString()
                                    .replaceAll('/', '-')
                                    .replaceFirst(', ', ' at '),
                                style: TextStyle(
                                    fontSize: 16, color: Colors.white),
                              ),
                            ),
                          ),
                          SizedBox(
                            height: 10,
                          ),
                          TitlePlaceholder(title: 'Trip'),
                          OriginDestinationPrest(
                              requestData: context
                                  .watch<HomeProvider>()
                                  .rideHistorySelectedData[0]),
                          Container(
                            color: Colors.grey.withOpacity(0.1),
                            height: 60,
                            child: Padding(
                              padding:
                                  const EdgeInsets.only(left: 15, right: 15),
                              child: Row(
                                children: [
                                  const Icon(Icons.circle,
                                      size: 10,
                                      color: Color.fromRGBO(9, 110, 212, 1)),
                                  SizedBox(
                                    width: 5,
                                  ),
                                  RichText(
                                      text: TextSpan(
                                          style: const TextStyle(
                                              fontFamily: 'MoveTextLight',
                                              fontSize: 17,
                                              color: Colors.black),
                                          children: [
                                        TextSpan(text: 'Approximately'),
                                        TextSpan(
                                            text:
                                                ' ${context.watch<HomeProvider>().rideHistorySelectedData[0]['estimated_travel_time']}.',
                                            style: const TextStyle(
                                                fontFamily: 'MoveTextRegular',
                                                color: Color.fromRGBO(
                                                    9, 110, 212, 1)))
                                      ]))
                                ],
                              ),
                            ),
                          ),
                          PaymentPassengersStrip(
                              tripData: context
                                  .watch<HomeProvider>()
                                  .rideHistorySelectedData[0]),
                          Divider(
                            thickness: 1,
                          ),
                          TitlePlaceholder(title: 'Rating'),
                          Padding(
                            padding: const EdgeInsets.only(
                                left: 15, right: 15, bottom: 15),
                            child: Row(
                              children: [
                                const Icon(Icons.star,
                                    size: 20, color: Colors.amber),
                                SizedBox(
                                  width: 5,
                                ),
                                Text(
                                    '${context.watch<HomeProvider>().rideHistorySelectedData[0]['ride_rating']}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                    ))
                              ],
                            ),
                          ),
                          Divider(
                            thickness: 1,
                          ),
                          TitlePlaceholder(title: 'Car details'),
                          DisplayCarInformation(
                              plateNumber: context
                                      .watch<HomeProvider>()
                                      .rideHistorySelectedData[0]['car_details']
                                  ['plate_number'],
                              carBrand: context
                                      .watch<HomeProvider>()
                                      .rideHistorySelectedData[0]['car_details']
                                  ['car_brand'],
                              carImageURL: context
                                      .watch<HomeProvider>()
                                      .rideHistorySelectedData[0]['car_details']
                                  ['car_picture'])
                        ],
                      ),
                    ),
        ),
      ),
    );
  }
}

class TitlePlaceholder extends StatelessWidget {
  final String title;

  const TitlePlaceholder({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 15, right: 15, top: 15, bottom: 15),
      child: Container(
        child: Text(title,
            style: TextStyle(
                fontFamily: 'MoveTextMedium',
                fontSize: 16,
                color: Colors.grey.shade400)),
      ),
    );
  }
}

class LoaderInstance extends StatelessWidget {
  const LoaderInstance({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: context.watch<HomeProvider>().shouldShowMainLoader,
      child: SizedBox(
        height: 3,
        width: MediaQuery.of(context).size.width,
        child: LinearProgressIndicator(
          backgroundColor: Colors.grey.withOpacity(0.15),
          color: Colors.blue,
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
        padding: const EdgeInsets.only(left: 15, right: 15),
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
                                            fontSize: 17,
                                            fontFamily: 'MoveTextMedium',
                                            context: context,
                                            locationData: [
                                          {'suburb': requestData['pickup_name']}
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
                                          fontSize: 17,
                                          fontFamily: 'MoveTextMedium',
                                          context: context,
                                          locationData: [
                                        {
                                          'suburb':
                                              requestData['destination_name']
                                        }
                                      ]),
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

//Payment-passenger strip
class PaymentPassengersStrip extends StatelessWidget {
  final Map tripData;
  const PaymentPassengersStrip({Key? key, required this.tripData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 5),
      child: Container(
        height: 60,
        decoration: BoxDecoration(
            // border: Border.all(color: Colors.red),
            // color: Colors.grey.withOpacity(0.1)
            ),
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              //Payment method
              SizedBox(
                width: 80,
                child: Row(
                  children: [
                    const Icon(Icons.credit_card, size: 20),
                    Text(tripData['payment_method'],
                        style: const TextStyle(fontSize: 17)),
                  ],
                ),
              ),
              //Amount payment
              Text('N\$${tripData['fare_amount']}',
                  style: const TextStyle(
                      fontFamily: 'MoveBold',
                      fontSize: 23,
                      color: Color.fromRGBO(9, 134, 74, 1))),
              //Number of passengers
              SizedBox(
                width: 100,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Icon(Icons.person, size: 19),
                    Text(tripData['numberOf_passengers'].toString(),
                        style: const TextStyle(
                            fontSize: 20, fontFamily: 'MoveTextMedium'))
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
