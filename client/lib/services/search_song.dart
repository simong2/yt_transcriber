import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> search(String query) async {
  final url = Uri.parse('http://localhost:3000/search');

  final response = await http.post(url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"query": query}));

  if (response.statusCode == 200) {
    print("response: ${response.body}");
  } else {
    print('failed');
  }
}
