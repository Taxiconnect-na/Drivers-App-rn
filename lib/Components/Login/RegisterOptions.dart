import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';
import 'package:taxiconnectdrivers/Components/Providers/RegistrationProvider.dart';

class RegisterOptions extends StatefulWidget {
  const RegisterOptions({Key? key}) : super(key: key);

  @override
  _RegisterOptionsState createState() => _RegisterOptionsState();
}

class _RegisterOptionsState extends State<RegisterOptions> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 25, bottom: 45, top: 60),
            child: Text('Register as',
                style: TextStyle(fontFamily: 'MoveBold', fontSize: 28)),
          ),
          Options(
            title: 'Driver',
            subTitle: 'To pickup and drop off people.',
            icoRepr: Icons.person,
            actuator: () {
              //Update the driver nature
              context
                  .read<RegistrationProvider>()
                  .updateSelectedDriverNature(data: 'RIDE');
              Navigator.of(context).pushNamed('/RegistrationRide');
            },
          ),
          const Divider(
            thickness: 1,
            height: 30,
          ),
          Options(
            title: 'Courier',
            subTitle: 'To deliver packages anywhere in your city.',
            icoRepr: Icons.widgets,
            actuator: () {
              //Update the driver nature
              context
                  .read<RegistrationProvider>()
                  .updateSelectedDriverNature(data: 'COURIER');
              Navigator.of(context).pushNamed('/RegistrationDelivery');
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
            child: Icon(icoRepr, color: Colors.black)),
        title: Text(title,
            style: const TextStyle(fontFamily: 'MoveTextBold', fontSize: 18)),
        subtitle: Text(subTitle),
        trailing: const Icon(Icons.arrow_forward_ios,
            size: 17, color: Color.fromRGBO(9, 110, 212, 1)));
  }
}
