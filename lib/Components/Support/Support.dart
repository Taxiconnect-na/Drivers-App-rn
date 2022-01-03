import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';

class Support extends StatefulWidget {
  const Support({Key? key}) : super(key: key);

  @override
  _SupportState createState() => _SupportState();
}

class _SupportState extends State<Support> {
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
            title: const Text('Support',
                style: TextStyle(fontFamily: 'MoveTextRegular', fontSize: 20)),
            centerTitle: true),
        backgroundColor: Colors.white,
        body: ListView(
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.8,
              height: 160,
              child: Image.asset('assets/Images/faq.jpg'),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 15, bottom: 20),
              child: Container(
                alignment: Alignment.center,
                width: MediaQuery.of(context).size.width,
                child: const Text(
                  'We are here for you.',
                  style: TextStyle(fontFamily: 'MoveBold', fontSize: 25),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(left: 15, right: 15),
              child: Text(
                'If clients left their belonging in your taxi or you need assistance on using The TaxiConnect platform, contact Us.',
                style: TextStyle(fontSize: 16),
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(left: 15, right: 15),
              child: Text(
                'In case of an emergency, youn can contact the police.',
                style: TextStyle(fontSize: 16),
              ),
            ),
            const SizedBox(
              height: 35,
            ),
            Options(
                title: 'Contact TaxiConnect',
                icon: const Icon(Icons.phone,
                    color: Color.fromRGBO(9, 110, 212, 1)),
                isTitleBold: true,
                actuator: () => _callNumber(phone: '+264814400089')),
            SizedBox(height: 25),
            Options(
                title: 'Call City Police',
                icon: Icon(Icons.shield, color: Color.fromRGBO(178, 34, 34, 1)),
                isTitleBold: true,
                actuator: () => _callNumber(phone: '+2646110111'))
          ],
        ),
      ),
    );
  }

  void _callNumber({required String phone}) async {
    bool? res = await FlutterPhoneDirectCaller.callNumber(phone);
  }
}

class Options extends StatelessWidget {
  final String title;
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
      required this.icon})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxHeight: 50),
      child: ListTile(
        onTap: actuator,
        leading: icon,
        horizontalTitleGap: 0,
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
            color: Colors.black,
            size: 15,
          ),
        ),
      ),
    );
  }
}
