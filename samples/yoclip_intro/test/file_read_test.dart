import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'test_paths.dart';

void main() {
  testWidgets('file read', (tester) async {
    final projectPath = yoclipIntroProjectPath;
    print('CWD: ${Directory.current.path}');
    print('Project path: $projectPath');
    print('Files: ${Directory(projectPath).listSync().map((e) => e.path).toList()}');
    final text = File('$projectPath/yoclip.yaml').readAsStringSync();
    print('YAML: $text');
  });
}
