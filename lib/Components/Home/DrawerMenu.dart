// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class DrawerMenu extends StatefulWidget {
  const DrawerMenu({Key? key}) : super(key: key);

  @override
  _DrawerMenuState createState() => _DrawerMenuState();
}

class _DrawerMenuState extends State<DrawerMenu> {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          Container(
            width: MediaQuery.of(context).size.width,
            alignment: Alignment.centerLeft,
            child: DrawerHeader(
                padding: const EdgeInsets.only(left: 0, top: 30),
                decoration: const BoxDecoration(color: Colors.black),
                child: SafeArea(
                    child: ListTile(
                  horizontalTitleGap: 10,
                  leading: const CircleAvatar(
                    radius: 35,
                    backgroundColor: Colors.grey,
                    backgroundImage: AssetImage('assets/Images/girl.jpg'),
                  ),
                  title: const Text(
                    'Alex',
                    style: TextStyle(
                        fontFamily: 'MoveTextMedium',
                        fontSize: 20,
                        color: Colors.white),
                  ),
                  subtitle: Text(
                      context
                                  .watch<HomeProvider>()
                                  .userLocationDetails['osm_id'] !=
                              null
                          ? context
                              .watch<HomeProvider>()
                              .userLocationDetails['city']
                          : 'Searching...',
                      style:
                          const TextStyle(color: Colors.white, fontSize: 15)),
                ))),
          ),
          const MenuOption(
            titleOption: 'Your rides',
            showDivider: true,
          ),
          const MenuOption(
            titleOption: 'Wallet',
            showDivider: true,
          ),
          const MenuOption(
            titleOption: 'Settings',
            showDivider: true,
          ),
          const MenuOption(
            titleOption: 'Support',
            showDivider: false,
          ),
          Expanded(
              child: SafeArea(
            child: Container(
                alignment: Alignment.bottomLeft,
                // decoration:
                //     BoxDecoration(border: Border.all(color: Colors.red)),
                child: Container(
                    width: MediaQuery.of(context).size.width,
                    height: 50,
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(
                                width: 1,
                                color: Colors.grey.withOpacity(0.2)))),
                    child: const Padding(
                      padding: EdgeInsets.only(top: 10),
                      child: ListTile(
                        leading: Text('Legal', style: TextStyle(fontSize: 16)),
                        trailing: Text('v3.0.05',
                            style: TextStyle(fontSize: 16, color: Colors.grey)),
                      ),
                    ))),
          ))
        ],
      ),
    );
  }
}

class MenuOption extends StatelessWidget {
  final String titleOption;
  final bool showDivider;

  const MenuOption(
      {Key? key, required this.titleOption, required this.showDivider})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: Text(
            titleOption,
            style: const TextStyle(fontFamily: 'MoveTextMedium', fontSize: 22),
          ),
        ),
        showDivider ? const Divider() : const Text('')
      ],
    );
  }
}
