import 'package:http/http.dart' as http;
import 'dart:convert';

Future<String> search(String query) async {
  final url = Uri.parse('http://localhost:3000/search');

  final response = await http.post(url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"query": query}));

  if (response.statusCode == 200) {
    print("response: ${response.body}");
    String res = jsonDecode(response.body)['res'];
    return res;
  } else {
    print('failed');
    return "Failed to generate text from video";
  }
}
