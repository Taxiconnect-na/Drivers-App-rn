// ignore_for_file: file_names
import 'dart:developer';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Sound.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class SwictherArea extends StatefulWidget {
  const SwictherArea({Key? key}) : super(key: key);

  @override
  _SwictherAreaState createState() => _SwictherAreaState();
}

class _SwictherAreaState extends State<SwictherArea> {
  @override
  Widget build(BuildContext context) {
    Map graphData = context.watch<HomeProvider>().requestsGraphData;
    //! Handle the null
    graphData['rides'] = graphData['rides'] == null ? 0 : graphData['rides'];
    graphData['deliveries'] =
        graphData['deliveries'] == null ? 0 : graphData['deliveries'];
    graphData['scheduled'] =
        graphData['scheduled'] == null ? 0 : graphData['scheduled'];
    graphData['accepted'] =
        graphData['accepted'] == null ? 0 : graphData['accepted'];

    return SizedBox(
        height: 110,
        width: MediaQuery.of(context).size.width,
        child: context.watch<HomeProvider>().onlineOfflineData['flag'] ==
                'offline'
            ? const OfflineStrip()
            : InkWell(
                onTap: () {
                  context.read<HomeProvider>().updateBlurredBackgroundState(
                      shouldShow: true); //Show blurred background
                  showModalBottomSheet(
                      enableDrag: context
                              .read<HomeProvider>()
                              .goingOnlineOfflineVars['isGoingOffline']!
                          ? false
                          : true,
                      isDismissible: context
                              .read<HomeProvider>()
                              .goingOnlineOfflineVars['isGoingOffline']!
                          ? false
                          : true,
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
                      }).whenComplete(() {
                    context
                        .read<HomeProvider>()
                        .updateBlurredBackgroundState(shouldShow: false);
                  });
                },
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
                      padding:
                          const EdgeInsets.only(top: 8.0, left: 15, right: 15),
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
                                    .codesToOptions[context
                                        .watch<HomeProvider>()
                                        .selectedOption]
                                    .toString(),
                                style: const TextStyle(
                                    fontFamily: 'MoveTextBold', fontSize: 20),
                              )
                            ],
                          ),
                          Visibility(
                            visible: graphData['rides'] +
                                    graphData['deliveries'] +
                                    graphData['scheduled'] +
                                    graphData['accepted'] >
                                0,
                            child: NumberIndicator(
                                number: graphData['rides'] +
                                    graphData['deliveries'] +
                                    graphData['scheduled'] +
                                    graphData['accepted']),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ));
  }
}

class OfflineStrip extends StatefulWidget {
  const OfflineStrip({Key? key}) : super(key: key);

  @override
  _OfflineStripState createState() => _OfflineStripState();
}

class _OfflineStripState extends State<OfflineStrip>
    with SingleTickerProviderStateMixin {
  // late AnimationController _controller;
  late final Animation<double> scaleGoingOnline;
  final Interval forwardInterval =
      const Interval(0.0, 1.0, curve: Curves.easeInOutCubic);
  final Sound _sound = Sound();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    context.read<HomeProvider>().initializeAnimationSwictherController(
        controller: AnimationController(
            duration: const Duration(milliseconds: 800), vsync: this));

    scaleGoingOnline = Tween(begin: 0.0, end: 10.0).animate(CurvedAnimation(
        parent: context.read<HomeProvider>().controllerSwicther,
        curve: forwardInterval));
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    // context.read<HomeProvider>().controllerSwicther.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          height: 110,
          width: MediaQuery.of(context).size.width,
          child: ClipRRect(
            child: ScaleTransition(
              scale: scaleGoingOnline,
              child: Container(
                height: 50,
                width: 50,
                decoration: const BoxDecoration(
                    color: Color.fromRGBO(9, 110, 212, 1),
                    shape: BoxShape.circle),
              ),
            ),
          ),
        ),
        Container(
          child: DefaultTextStyle(
            style: const TextStyle(
              fontSize: 25.0,
              fontFamily: 'MoveBold',
            ),
            child: context
                    .watch<HomeProvider>()
                    .goingOnlineOfflineVars['isGoingOnline']!
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      SizedBox(
                          width: 15,
                          height: 15,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          )),
                      SizedBox(
                        width: 10,
                      ),
                      Text('Going online', style: TextStyle(fontSize: 22)),
                    ],
                  )
                : context
                        .watch<HomeProvider>()
                        .goingOnlineOfflineVars['isGoingOffline']!
                    ? Text('Going offline...', style: TextStyle(fontSize: 22))
                    : AnimatedTextKit(
                        repeatForever: true,
                        pause: const Duration(seconds: 1),
                        animatedTexts: [
                          RotateAnimatedText('Offline',
                              transitionHeight: 60,
                              duration: const Duration(seconds: 2),
                              textStyle: const TextStyle(
                                  color: Color.fromRGBO(178, 34, 34, 1))),
                          RotateAnimatedText('Go online',
                              transitionHeight: 60,
                              duration: const Duration(seconds: 2),
                              textStyle: const TextStyle(
                                  color: Color.fromRGBO(9, 110, 212, 1))),
                        ],
                        onTap: () {
                          _sound.playSound(audio: 'onclick.mp3');
                          //Set the going online button to true
                          context.read<HomeProvider>().updateGoingOnlineOffline(
                              scenario: 'online', state: true);
                          //...
                          context
                              .read<HomeProvider>()
                              .controllerSwicther
                              .forward()
                              .whenComplete(() {
                            // print('Going online set...');
                            SetOnlineOfflineStatus setOnlineOfflineStatus =
                                SetOnlineOfflineStatus();
                            setOnlineOfflineStatus.execGet(
                                context: context, state: 'online');
                          });
                        },
                      ),
          ),
        ),
      ],
    );
  }
}

// The number indicator showing the number of trips for various scenarios
class NumberIndicator extends StatelessWidget {
  final int number;
  final Color backgroundColor;

  const NumberIndicator(
      {Key? key,
      required this.number,
      this.backgroundColor = const Color.fromRGBO(178, 34, 34, 1)})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      alignment: Alignment.center,
      decoration: BoxDecoration(
          color: backgroundColor,
          border: Border.all(color: backgroundColor),
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
              style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 21)),
        ),
        MenuOption(
          titleOption: 'Accepted trips',
          showDivider: true,
          showIndicator:
              context.watch<HomeProvider>().requestsGraphData['accepted'] > 0,
          indicatorValue:
              context.watch<HomeProvider>().requestsGraphData['accepted'],
          showChecked:
              context.watch<HomeProvider>().selectedOption == 'accepted',
        ),
        Visibility(
          visible: mapEquals(
                  {}, context.watch<HomeProvider>().authAndDailyEarningsData)
              ? false
              : context
                      .watch<HomeProvider>()
                      .authAndDailyEarningsData['supported_requests_types'] ==
                  'Ride',
          child: MenuOption(
              titleOption: 'Rides',
              showDivider: true,
              showIndicator:
                  context.watch<HomeProvider>().requestsGraphData['rides'] > 0,
              indicatorValue:
                  context.watch<HomeProvider>().requestsGraphData['rides'],
              showChecked:
                  context.watch<HomeProvider>().selectedOption == 'ride'),
        ),
        Visibility(
          visible: mapEquals(
                  {}, context.watch<HomeProvider>().authAndDailyEarningsData)
              ? false
              : context
                      .watch<HomeProvider>()
                      .authAndDailyEarningsData['supported_requests_types'] ==
                  'Delivery',
          child: MenuOption(
              titleOption: 'Deliveries',
              showDivider: true,
              showIndicator: context
                      .watch<HomeProvider>()
                      .requestsGraphData['deliveries'] >
                  0,
              indicatorValue:
                  context.watch<HomeProvider>().requestsGraphData['deliveries'],
              showChecked:
                  context.watch<HomeProvider>().selectedOption == 'delivery'),
        ),
        MenuOption(
          titleOption: 'Scheduled',
          showDivider: true,
          showIndicator:
              context.watch<HomeProvider>().requestsGraphData['scheduled'] > 0,
          indicatorValue:
              context.watch<HomeProvider>().requestsGraphData['scheduled'],
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
  final int indicatorValue;

  const MenuOption(
      {Key? key,
      required this.titleOption,
      required this.showDivider,
      required this.showIndicator,
      required this.showChecked,
      required this.indicatorValue})
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
      child: Container(
        color: showChecked ? Colors.grey.shade200 : Colors.white,
        child: Column(
          children: [
            Container(
              color: showChecked ? Colors.grey.shade200 : Colors.white,
              child: SizedBox(
                height: 82,
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
                              ? NumberIndicator(
                                  number: indicatorValue,
                                  backgroundColor: titleOption ==
                                          'Accepted trips'
                                      ? Colors.black
                                      : const Color.fromRGBO(174, 34, 34, 1),
                                )
                              : const Text(''),
                          showChecked
                              ? const Padding(
                                  padding: EdgeInsets.only(left: 5),
                                  child: Icon(Icons.check,
                                      size: 30,
                                      color: Color.fromRGBO(14, 132, 145, 1)),
                                )
                              : const Padding(
                                  padding: EdgeInsets.only(left: 5),
                                  child: Opacity(
                                      opacity: 0,
                                      child: Icon(Icons.check, size: 30)),
                                ),
                        ],
                      )
                    ],
                  ),
                ),
              ),
            ),
            showDivider
                ? const Divider(
                    height: 0,
                  )
                : const Text('')
          ],
        ),
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
          onTap: () {
            // print('Going offline.');
            //Set going offline to true
            context
                .read<HomeProvider>()
                .updateGoingOnlineOffline(scenario: 'offline', state: true);
            //...
            SetOnlineOfflineStatus setOnlineOfflineStatus =
                SetOnlineOfflineStatus();
            setOnlineOfflineStatus.execGet(context: context, state: 'offline');
          },
          title: Text(
            titleOption,
            style: const TextStyle(
                fontFamily: 'MoveTextMedium',
                fontSize: 19,
                color: Color.fromRGBO(178, 34, 34, 1)),
          ),
          trailing: context
                  .watch<HomeProvider>()
                  .goingOnlineOfflineVars['isGoingOffline']!
              ? const SizedBox(
                  width: 15,
                  height: 15,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Color.fromRGBO(178, 34, 34, 1),
                  ),
                )
              : const Icon(
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
