import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Helpers/Networking.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';
import 'package:url_launcher/url_launcher.dart';

class Settings extends StatefulWidget {
  const Settings({Key? key}) : super(key: key);

  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  GetDriverGeneralNumbers _getDriverGeneralNumbers = GetDriverGeneralNumbers();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    _getDriverGeneralNumbers.exec(context: context);
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
            title: const Text('Settings',
                style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
            centerTitle: true),
        backgroundColor: Colors.white,
        body: RefreshIndicator(
          color: const Color.fromRGBO(9, 110, 212, 1),
          onRefresh: () async {
            print('Get driver data');
            _getDriverGeneralNumbers.exec(context: context);
            //Reload the data
            return Future.delayed(Duration(seconds: 2), () {
              print('Done');
            });
          },
          child: ListView(
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 25, bottom: 30),
                child: CircleAvatar(
                    radius: 37,
                    backgroundColor: Colors.white,
                    child: Container(
                      decoration: BoxDecoration(
                          // border: Border.all(
                          //   width: 1,
                          // ),
                          boxShadow: [
                            BoxShadow(
                                color: Colors.grey.shade300,
                                blurRadius: 5,
                                spreadRadius: 5)
                          ], shape: BoxShape.circle),
                      child: Image.network(
                        context
                                .watch<HomeProvider>()
                                .userAccountDetails['profile_pciture'] ??
                            '',
                        fit: BoxFit.cover,
                        width: 74.0,
                        height: 74.0,
                        errorBuilder: (context, error, stackTrace) {
                          return const CircleAvatar(
                            radius: 37,
                            backgroundColor: Colors.white,
                            backgroundImage: AssetImage(
                              'assets/Images/user.png',
                            ),
                          );
                        },
                      ),
                    )),
              ),
              Container(
                  alignment: Alignment.center,
                  width: MediaQuery.of(context).size.width,
                  child: Text(
                      '${context.watch<HomeProvider>().userAccountDetails['name']} ${context.watch<HomeProvider>().userAccountDetails['surname']}',
                      style: TextStyle(fontFamily: 'MoveBold', fontSize: 19))),
              Padding(
                padding: const EdgeInsets.only(
                    left: 15, right: 15, top: 35, bottom: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    StagedNumbers(
                      title: context
                                  .watch<HomeProvider>()
                                  .generalNumbers['trips'] !=
                              null
                          ? context
                              .watch<HomeProvider>()
                              .generalNumbers['trips']
                              .toString()
                          : '*',
                      subTitle: Text('Trips'),
                    ),
                    StagedNumbers(
                      title: context
                                  .watch<HomeProvider>()
                                  .generalNumbers['rating'] !=
                              null
                          ? context
                              .watch<HomeProvider>()
                              .generalNumbers['rating']
                              .toString()
                          : '*',
                      subTitle: Icon(Icons.star, color: Colors.amber),
                    ),
                    StagedNumbers(
                      title: context
                                  .watch<HomeProvider>()
                                  .generalNumbers['revenue'] !=
                              null
                          ? context
                              .watch<HomeProvider>()
                              .generalNumbers['revenue']
                              .toString()
                          : '*',
                      subTitle: Text('N\$'),
                    )
                  ],
                ),
              ),
              Divider(
                height: 20,
                thickness: 1,
              ),
              // TitlePlaceholder(
              //   title: 'Navigation',
              // ),
              // Options(
              //   title: 'Navigation settings',
              //   actuator: () {},
              // ),
              // SizedBox(
              //   height: 30,
              // ),
              TitlePlaceholder(title: 'Privacy'),
              Options(
                  title: 'Terms & Conditions',
                  actuator: () async {
                    if (!await launch('https://www.taxiconnectna.com/terms')) {
                      throw 'Could not launch the URL';
                    }
                  }),
              Options(
                  title: 'Privacy statements',
                  actuator: () async {
                    if (!await launch('https://www.taxiconnectna.com/terms')) {
                      throw 'Could not launch the URL';
                    }
                  }),
              SizedBox(
                height: 20,
              ),
              Divider(
                height: 20,
                thickness: 1,
              ),
              Options(
                  title: 'Sign Out',
                  color: Color.fromRGBO(178, 34, 34, 1),
                  showArrow: false,
                  isTitleBold: true,
                  actuator: () {
                    //Clear everything
                    context.read<HomeProvider>().clearEverything();
                    context.read<RegistrationProvider>().clearEverything();
                    //...
                    Navigator.of(context).pushReplacementNamed('/');
                  })
            ],
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
      padding: const EdgeInsets.only(left: 15, right: 15, top: 15, bottom: 5),
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

class Options extends StatelessWidget {
  final String title;
  Color color;
  final actuator;
  bool showArrow;
  bool isTitleBold;

  Options(
      {Key? key,
      required this.title,
      this.color = Colors.black,
      required this.actuator,
      this.showArrow = true,
      this.isTitleBold = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxHeight: 50),
      child: ListTile(
        onTap: actuator,
        title: Text(
          title,
          style: TextStyle(
              color: color,
              fontFamily: isTitleBold ? 'MoveTextMedium' : 'MoveTextRegular',
              fontSize: 18),
        ),
        trailing: Visibility(
          visible: showArrow,
          child: Icon(
            Icons.arrow_forward_ios,
            color: Colors.grey.shade600,
            size: 15,
          ),
        ),
      ),
    );
  }
}

class StagedNumbers extends StatelessWidget {
  final String title;
  final Widget subTitle;

  const StagedNumbers({Key? key, required this.title, required this.subTitle})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Flexible(
      child: SizedBox(
        // color: Colors.red,
        width: MediaQuery.of(context).size.width,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              title,
              style: TextStyle(fontFamily: 'MoveTextMedium', fontSize: 20),
            ),
            SizedBox(
              height: 5,
            ),
            subTitle
          ],
        ),
      ),
    );
  }
}
