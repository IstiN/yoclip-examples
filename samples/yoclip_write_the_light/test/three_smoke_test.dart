import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  testWidgets('native THREE world presents a deterministic headless frame', (
    tester,
  ) async {
    const width = 960;
    const height = 540;
    const frame = int.fromEnvironment('YOCLIP_REVIEW_FRAME', defaultValue: 600);
    final graph = <String, dynamic>{
      'type': 'three_scene',
      'source': 'three/world.js',
      'frame': frame,
      'fps': 120,
      'width': width,
      'height': height,
      'fit': 'expand',
      'params': <String, dynamic>{
        'act': 3,
        'actProgress': 0.5,
        'beat': 70,
        'beatPulse': 1.0,
        'bar': 17,
        'lyricStyle': 'line',
      },
    };
    final renderer = HeadlessRenderer(
      composition: YoclipWidgetRenderer().compile(graph, frame),
      config: const VideoConfig(
        duration: 1,
        fps: 120,
        width: width,
        height: height,
      ),
    );
    debugPrint('SMOKE capture begin');
    final bytes = await renderer.captureFrame(
      tester,
      frame: 0,
      format: ui.ImageByteFormat.rawRgba,
    );
    debugPrint('SMOKE capture returned ${bytes.lengthInBytes}');
    final output = File('build/three_smoke_$frame.rgba');
    await tester.runAsync(() async {
      await output.parent.create(recursive: true);
      await output.writeAsBytes(bytes.buffer.asUint8List(), flush: true);
    });
    expect(bytes.lengthInBytes, greaterThan(10000));
    // ignore: avoid_print
    print('THREE_SMOKE=${output.absolute.path}');
  }, timeout: const Timeout(Duration(minutes: 3)));
}
