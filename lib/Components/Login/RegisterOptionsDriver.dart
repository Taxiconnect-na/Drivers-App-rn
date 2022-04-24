import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class RegisterOptionsDriver extends StatefulWidget {
  const RegisterOptionsDriver({Key? key}) : super(key: key);

  @override
  _RegisterOptionsDriverState createState() => _RegisterOptionsDriverState();
}

class _RegisterOptionsDriverState extends State<RegisterOptionsDriver> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 25, bottom: 5, top: 0),
            child: InkWell(
              onTap: () => Navigator.of(context).pop(),
              child: const Icon(
                Icons.arrow_back,
                size: 30,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.only(left: 25, bottom: 45, top: 30),
            child: Text('Who are you?',
                style: TextStyle(fontFamily: 'MoveBold', fontSize: 28)),
          ),
          Options(
            title: 'Taxi driver',
            // subTitle: 'For anyone who is legaly registered as a taxi driver',
            subTitle: '',
            icoRepr: Icons.stop,
            actuator: () {
              //Update the driver nature person
              context
                  .read<RegistrationProvider>()
                  .updateSelectedDriverPerson(data: 'TAXI');
              //..
              Navigator.of(context).pushNamed('/RegistrationRide');
            },
          ),
          const Divider(
            thickness: 1,
            height: 30,
          ),
          Options(
            title: 'Individual',
            // subTitle:
            //     'For anyone having a car but is not a registered taxi driver.',
            subTitle: '',
            icoRepr: Icons.stop,
            actuator: () {
              //Update the driver nature person
              context
                  .read<RegistrationProvider>()
                  .updateSelectedDriverPerson(data: 'INDIVIDUAL');
              //..
              Navigator.of(context).pushNamed('/RegistrationRideIndividual');
            },
          )
        ],
      )),
    );
  }
}

class Options extends StatelessWidget {
  final String title;
  final String subTitle;
  final IconData icoRepr;
  final actuator;

  const Options(
      {Key? key,
      required this.title,
      required this.subTitle,
      required this.icoRepr,
      required this.actuator})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
        onTap: actuator,
        horizontalTitleGap: 5,
        leading: Container(
            alignment: Alignment.center,
            width: 30,
            height: 30,
            decoration: BoxDecoration(
                // border: Border.all(width: 1),
                borderRadius: BorderRadius.circular(200)),
            child: Icon(icoRepr, color: Colors.black, size: 15,)),
        title: Padding(
          padding: const EdgeInsets.only(top:15),
          child: Text(title,
              style: const TextStyle(fontFamily: 'MoveTextMedium', fontSize: 20)),
        ),
        subtitle: Text(subTitle),
        trailing: const Icon(Icons.arrow_forward_ios,
            size: 17, color: Color.fromRGBO(9, 110, 212, 1)));
  }
}
