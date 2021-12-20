import 'package:flutter/material.dart';

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
        children: const [
          Padding(
            padding: EdgeInsets.only(left: 25, bottom: 45, top: 60),
            child: Text('Register as',
                style: TextStyle(fontFamily: 'MoveBold', fontSize: 28)),
          ),
          Options(
              title: 'Driver',
              subTitle: 'To pickup and drop off people.',
              icoRepr: Icons.person),
          Divider(
            thickness: 1,
            height: 30,
          ),
          Options(
              title: 'Courier',
              subTitle: 'To deliver packages anywhere in your city.',
              icoRepr: Icons.widgets)
        ],
      )),
    );
  }
}

class Options extends StatelessWidget {
  final String title;
  final String subTitle;
  final IconData icoRepr;

  const Options(
      {Key? key,
      required this.title,
      required this.subTitle,
      required this.icoRepr})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
        horizontalTitleGap: 5,
        leading: InkWell(
          onTap: () => print('Option selected.'),
          child: Container(
              alignment: Alignment.center,
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                  // border: Border.all(width: 1),
                  borderRadius: BorderRadius.circular(200)),
              child: Icon(icoRepr, color: Colors.black)),
        ),
        title: Text(title,
            style: const TextStyle(fontFamily: 'MoveTextBold', fontSize: 18)),
        subtitle: Text(subTitle),
        trailing: const Icon(Icons.arrow_forward_ios,
            size: 17, color: Color.fromRGBO(9, 110, 212, 1)));
  }
}
