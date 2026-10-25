// Screenshot harness for agents and golden checks — mirrors the ai_conf
// pattern: env-driven single-frame PNG capture of any scene.
//
//   YOCLIP_OUTPUT=/tmp/x.png YOCLIP_FRAME=80 YOCLIP_SCENE=fit \
//     flutter test test/yoclip_cli_screenshot_test.dart
//
// YOCLIP_FRAME is scene-local; the harness translates it to the composition
// timeline and keeps ALL scenes loaded so cross-scene state resolves exactly
// as in the final render.

import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  final outputFile = Platform.environment['YOCLIP_OUTPUT'];
  final frameEnv = Platform.environment['YOCLIP_FRAME'];
  final sceneId = Platform.environment['YOCLIP_SCENE'] ?? 's1';

  testWidgets(
    'yoclip screenshot',
    (tester) async {
      if (outputFile == null || frameEnv == null) return;
      // Absolute: `flutter test` inside a pub workspace runs with
      // Directory.current at the workspace root, not the package dir.
      final projectPath = '/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/music_animation';
      final frame = int.parse(frameEnv);
      print('SCREENSHOT: output=$outputFile frame=$frame scene=$sceneId');

      final storage = LocalFileSystemStorage(projectPath);
      final project = await YoclipProject.load(storage, projectPath);
      print('SCREENSHOT: project loaded');

      final runtime = createYoclipJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);

      final scenes = await loadYoclipProjectScenes(runtime, project, storage);
      print('SCREENSHOT: scenes loaded');

      final targetScene = scenes.firstWhere(
        (s) => s.id == sceneId,
        orElse: () => throw StateError(
          'Unknown scene "$sceneId". '
          'Available: ${scenes.map((s) => s.id).join(', ')}',
        ),
      );
      // Scene-local frame -> composition timeline.
      final localFrame = frame.clamp(0, targetScene.duration - 1);
      if (localFrame != frame) {
        print('SCREENSHOT: frame $frame out of range for scene "$sceneId" '
            '(duration ${targetScene.duration}), clamped to $localFrame');
      }
      final captureFrame = targetScene.from + localFrame;

      // External images (grade plates, silhouette) must be decoded and handed
      // to the renderer — otherwise a full-frame "Missing image" placeholder
      // covers the composition.
      final externalFiles = <String, String>{};
      final externalImageBytes = <String, Uint8List>{};
      for (final asset in project.externalAssets.values) {
        final path = asset.path.startsWith('/')
            ? asset.path
            : '$projectPath/${asset.path}';
        externalFiles[asset.id] = path;
        if (asset.type == 'image') {
          final file = File(path);
          if (file.existsSync()) {
            externalImageBytes[asset.id] = file.readAsBytesSync();
          } else {
            print('SCREENSHOT: WARNING missing asset ${asset.id} at $path');
          }
        }
      }

      final renderer = YoclipV2Renderer(
        project: project,
        scenes: scenes,
        storage: storage,
        externalFiles: externalFiles,
        externalFrameDirs: const {},
        externalImageBytes: externalImageBytes,
      );

      print('SCREENSHOT: capturing frame $captureFrame');
      final bytes = await renderer.capturePng(tester, captureFrame);
      print('SCREENSHOT: captured png, length ${bytes.length}');

      await tester.runAsync(() => File(outputFile).writeAsBytes(bytes));
      stdout.writeln('Screenshot saved to $outputFile');
    },
    skip: outputFile == null || frameEnv == null,
  );
}
