// ignore_for_file: file_names

class DateParser {
  final String dateString;

  DateParser(this.dateString);

  //?1. Get normal readable time
  String getReadableTime() {
    DateTime dateTime = DateTime.parse(dateString);

    return '${dateTime.hour}:${dateTime.minute}';
  }

  //?2. Get normal readable date
  String getReadableDate() {
    DateTime dateTime = DateTime.parse(dateString);

    return '${dateTime.day}-${dateTime.month}-${dateTime.year} at ${getReadableTime()}';
  }
}
