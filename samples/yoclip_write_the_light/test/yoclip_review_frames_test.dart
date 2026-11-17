import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  testWidgets('capture a full composition review frame', (tester) async {
    final projectPath = Directory.current.path;
    final storage = LocalFileSystemStorage(projectPath);
    late final YoclipProject project;
    late final List<YoclipScene> scenes;
    late final YoclipJsRuntime runtime;
    late final Uint8List logoBytes;
    await tester.runAsync(() async {
      project = await YoclipProject.load(storage, projectPath);
      runtime = createYoclipJsRuntime();
      await runtime.init();
      scenes = await loadYoclipProjectScenes(runtime, project, storage);
      logoBytes = await File(
        '$projectPath/assets/images/yoclip_logo.svg',
      ).readAsBytes();
    });
    addTearDown(runtime.dispose);
    final sceneId = Platform.environment['YOCLIP_SCENE'] ?? 'film';
    final localFrames = (Platform.environment['YOCLIP_FRAMES'] ??
            Platform.environment['YOCLIP_FRAME'] ??
            '1605')
        .split(',')
        .map(int.parse)
        .toList();
    final target = scenes.firstWhere((scene) => scene.id == sceneId);
    final renderer = YoclipV2Renderer(
      project: project,
      scenes: scenes,
      storage: storage,
      externalImageBytes: <String, Uint8List>{'logo': logoBytes},
    );
    for (final localFrame in localFrames) {
      expect(localFrame, inInclusiveRange(0, target.duration - 1));
      final frame = target.from + localFrame;
      final bytes = await renderer.capturePng(tester, frame);
      final outputDirectory = Platform.environment['YOCLIP_OUTPUT_DIR'];
      final output = File(
        outputDirectory != null
            ? '$outputDirectory/${sceneId}_$localFrame.png'
            : Platform.environment['YOCLIP_OUTPUT'] ??
                'review/${sceneId}_$localFrame.png',
      );
      await tester.runAsync(() async {
        await output.parent.create(recursive: true);
        await output.writeAsBytes(bytes, flush: true);
      });
      // ignore: avoid_print
      print('YOCLIP_REVIEW=${output.absolute.path}');
    }
  }, timeout: const Timeout(Duration(minutes: 3)));
}
