import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class YourRides extends StatefulWidget {
  const YourRides({Key? key}) : super(key: key);

  @override
  _YourRidesState createState() => _YourRidesState();
}

class _YourRidesState extends State<YourRides> {
  getRideHistoryBatch _getRideHistoryBatch = getRideHistoryBatch();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    //Activate the loader
    context
        .read<HomeProvider>()
        .updateMainLoaderVisibility(option: true, shouldUpdate: false);
    _getRideHistoryBatch.exec(context: context);
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
                Navigator.of(context).pushReplacementNamed('/Home');
              },
              icon: const Icon(Icons.arrow_back),
            ),
            title: const Text('Your rides',
                style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
            centerTitle: true),
        backgroundColor: Colors.white,
        body: RefreshIndicator(
          onRefresh: () async {
            _getRideHistoryBatch.exec(context: context);
            return Future.delayed(Duration(seconds: 2), () {
              print('Done refreshing.');
            });
          },
          child: context.watch<HomeProvider>().rideHistory.isEmpty &&
                  context.watch<HomeProvider>().shouldShowMainLoader == false
              ? ListView(
                  padding: EdgeInsets.only(
                      top: MediaQuery.of(context).size.height * 0.2),
                  children: [
                    Container(
                        alignment: Alignment.center,
                        width: MediaQuery.of(context).size.width,
                        child: Icon(Icons.inbox, size: 50, color: Colors.grey)),
                    const SizedBox(
                      height: 10,
                    ),
                    Container(
                        alignment: Alignment.center,
                        width: MediaQuery.of(context).size.width,
                        child: const Text('No trips yet',
                            style: TextStyle(
                                fontFamily: 'MoveTextMedium',
                                fontSize: 17,
                                color: Colors.grey))),
                    SizedBox(
                      height: 10,
                    ),
                    Container(
                      alignment: Alignment.center,
                      width: MediaQuery.of(context).size.width,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Scroll down to refresh',
                            style: TextStyle(
                                fontSize: 15, color: Colors.grey.shade600),
                          ),
                          SizedBox(
                            width: 5,
                          ),
                          Icon(
                            Icons.arrow_downward,
                            size: 15,
                          )
                        ],
                      ),
                    )
                  ],
                )
              : context.watch<HomeProvider>().rideHistory.isEmpty &&
                      context.watch<HomeProvider>().shouldShowMainLoader
                  ? Container(
                      width: MediaQuery.of(context).size.width,
                      child: const LoaderInstance(),
                    )
                  : SafeArea(
                      child: ListView.separated(
                          padding: EdgeInsets.only(top: 15),
                          itemBuilder: (context, index) => Options(
                              title:
                                  'To ${reduceDestinationName(name: context.watch<HomeProvider>().rideHistory[index]['destination_name'])}',
                              icon: const Padding(
                                padding: EdgeInsets.only(top: 6.0),
                                child: Icon(
                                  Icons.stop,
                                  color: Colors.black,
                                  size: 10,
                                ),
                              ),
                              subtitleDate: context
                                  .watch<HomeProvider>()
                                  .rideHistory[index]['date_requested']
                                  .toString()
                                  .replaceAll('/', '-')
                                  .replaceFirst(', ', ' at '),
                              subtitleCar: context
                                  .watch<HomeProvider>()
                                  .rideHistory[index]['car_brand'],
                              isTitleBold: true,
                              actuator: () {
                                //! Update the tempo selected fp
                                context
                                    .read<HomeProvider>()
                                    .updateTempoRideHistorySelected(
                                        data: context
                                            .read<HomeProvider>()
                                            .rideHistory[index]['request_fp']);
                                //...
                                Navigator.of(context)
                                    .pushNamed('/DetailedTripShow');
                              }),
                          separatorBuilder: (context, index) => const Divider(
                                thickness: 1,
                                height: 20,
                              ),
                          itemCount:
                              context.watch<HomeProvider>().rideHistory.length),
                    ),
        ),
      ),
    );
  }

  //Limit destination name to some characters
  String reduceDestinationName({required String name}) {
    const int limit = 25;

    if (name.length > limit) {
      return '${name.substring(0, limit)}...';
    } else {
      return name;
    }
  }
}

class Options extends StatelessWidget {
  final String title;
  final String subtitleDate;
  final String subtitleCar;
  Color color;
  final actuator;
  bool showArrow;
  bool isTitleBold;
  final Widget icon;

  Options(
      {Key? key,
      required this.title,
      this.color = Colors.black,
      required this.actuator,
      this.showArrow = true,
      this.isTitleBold = false,
      required this.icon,
      required this.subtitleDate,
      required this.subtitleCar})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: ListTile(
        onTap: actuator,
        leading: icon,
        horizontalTitleGap: -20,
        title: Text(
          title,
          style: TextStyle(
              color: color,
              fontFamily: isTitleBold ? 'MoveTextMedium' : 'MoveTextRegular',
              fontSize: 16),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 5),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(subtitleDate),
              SizedBox(
                height: 5,
              ),
              Text(
                subtitleCar,
                style: TextStyle(color: Color.fromRGBO(14, 132, 145, 1)),
              )
            ],
          ),
        ),
        trailing: Visibility(
          visible: showArrow,
          child: Icon(
            Icons.arrow_forward_ios,
            color: Colors.grey.shade700,
            size: 12,
          ),
        ),
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
