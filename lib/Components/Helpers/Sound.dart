// ignore_for_file: file_names

import 'package:audioplayers/audioplayers.dart';

class Sound {
  void playSound({required type}) {
    AudioCache player = AudioCache();

    switch (type) {
      case 'accept_request':
        String audioPath = 'notification.mp3';
        player.play(audioPath, isNotification: true);
        break;
      default:
    }
  }
}
