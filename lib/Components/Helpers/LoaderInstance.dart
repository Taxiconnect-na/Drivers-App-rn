import 'package:flutter/material.dart';
import 'package:provider/src/provider.dart';
import 'package:taxiconnectdrivers/Components/Providers/HomeProvider.dart';

class LoaderInstance extends StatelessWidget {
  const LoaderInstance({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: context.watch<HomeProvider>().shouldShowGenericLoader,
      child: SizedBox(
        height: 2,
        width: MediaQuery.of(context).size.width,
        child: LinearProgressIndicator(
          backgroundColor: Colors.white,
          color: Colors.black,
        ),
      ),
    );
  }
}
