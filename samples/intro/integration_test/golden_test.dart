import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:intro/main.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('intro golden frame 45 renders readable text', (tester) async {
    const size = Size(1920, 1080);
    const frame = 45;

    final image = await yoclipCapture(
      tester: tester,
      composition: const Intro(),
      size: size,
      frame: frame,
    );

    expect(image.width, size.width.toInt());
    expect(image.height, size.height.toInt());

    final byteData = await tester.runAsync<ByteData?>(() async {
      return image.toByteData();
    });
    expect(byteData, isNotNull);

    final rgba = byteData!.buffer.asUint8List();
    var whitePixelCount = 0;
    for (var i = 0; i < rgba.length; i += 4) {
      final r = rgba[i];
      final g = rgba[i + 1];
      final b = rgba[i + 2];
      final a = rgba[i + 3];
      if (a > 200 && r > 200 && g > 200 && b > 200) {
        whitePixelCount++;
      }
    }

    expect(whitePixelCount, greaterThan(100),
        reason: 'Frame 45 should contain visible white text pixels');
  });
}
