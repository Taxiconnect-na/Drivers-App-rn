// ignore_for_file: file_names

class DateParser {
  final String dateString;

  DateParser(this.dateString);

  //?1. Get normal readable time
  String getReadableTime() {
    DateTime dateTime = DateTime.parse(dateString);

    return '${dateTime.hour}:${dateTime.minute}';
  }
}
