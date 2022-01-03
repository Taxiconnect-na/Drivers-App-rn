// ignore_for_file: file_names

import 'package:audioplayers/audioplayers.dart';

class Sound {
  void playSound({String audio = 'notification.mp3'}) {
    AudioCache player = AudioCache();

    //Audios
    //1. Notifications: notification.mp3
    //2. Going online click: onclick.mp3
    //3. Going online success: success.mp3

    String audioPath = audio;
    player.play(audioPath, isNotification: true);
  }
}
