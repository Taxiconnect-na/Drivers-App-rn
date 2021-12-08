// ignore_for_file: file_names

import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';

class PhoneNumberCaller {
  static void callNumber({required String phoneNumber}) async {
    await FlutterPhoneDirectCaller.callNumber(phoneNumber);
  }
}
