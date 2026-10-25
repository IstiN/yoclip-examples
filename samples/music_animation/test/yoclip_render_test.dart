// MP4 render harness for the music_animation clip.
//
//   YOCLIP_OUTPUT=/tmp/clip.mp4 flutter test test/yoclip_render_test.dart
//   YOCLIP_FRAMES=90 — рендер только первых N кадров (быстрая проверка).
//
// Run from the yoclip workspace root:
//   YOCLIP_OUTPUT=$PWD/out/clip.mp4 \
//     flutter test samples/samples/music_animation/test/yoclip_render_test.dart
import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart' as encoder_lib;

void main() {
  final outputPath = Platform.environment['YOCLIP_OUTPUT'];
  final framesEnv = Platform.environment['YOCLIP_FRAMES'];

  testWidgets(
    'music_animation render mp4',
    (tester) async {
      if (outputPath == null) return;
      const projectPath =
          '/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/music_animation';

      final storage = LocalFileSystemStorage(projectPath);
      final project = await YoclipProject.load(storage, projectPath);
      final runtime = createYoclipJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);
      final scenes = await loadYoclipProjectScenes(runtime, project, storage,
          onSceneError: (path, id, error) {
        print('SCENE ERROR $path ($id): $error');
      });

      final externalFiles = <String, String>{};
      final externalImageBytes = <String, Uint8List>{};
      for (final asset in project.externalAssets.values) {
        final path = asset.path.startsWith('/')
            ? asset.path
            : '$projectPath/${asset.path}';
        externalFiles[asset.id] = path;
        if (asset.type == 'image') {
          externalImageBytes[asset.id] = File(path).readAsBytesSync();
        }
      }

      final audioTracks = await YoclipV2AudioResolver(storage)
          .resolveAll(project, scenes, externalAudioFiles: {});
      final audioSpecs =
          await YoclipV2AudioResolver(storage).toEncoderSpecs(audioTracks);
      final encoderAudioSpecs = audioSpecs
          .map((s) => encoder_lib.YoclipAudioTrackSpec(
                source: s.source,
                volume: s.volume,
                startFrame: s.startFrame,
                envelope: s.envelope,
              ))
          .toList();

      final frames = framesEnv != null
          ? int.parse(framesEnv)
          : project.config.duration;
      final renderProject = YoclipProject(
        rootPath: project.rootPath,
        config: YoclipProjectConfig(
          duration: frames,
          fps: project.config.fps,
          width: project.config.width,
          height: project.config.height,
          background: project.config.background,
          theme: project.config.theme,
          overlay: project.config.overlay,
        ),
        externalAssets: project.externalAssets,
        scenePaths: project.scenePaths,
        pluginPaths: project.pluginPaths,
        fonts: project.fonts,
      );

      final renderer = YoclipV2Renderer(
        project: renderProject,
        scenes: scenes,
        storage: storage,
        externalFiles: externalFiles,
        externalFrameDirs: const {},
        externalImageBytes: externalImageBytes,
      );

      final encoder = encoder_lib.YoclipEncoderTool(
        outputPath: outputPath,
        width: project.config.width,
        height: project.config.height,
        fps: project.config.fps,
        audioTracks: encoderAudioSpecs,
        videoBitrate: null,
      );

      final watch = Stopwatch()..start();
      await tester.runAsync(encoder.start);
      await renderer.renderToRgba(tester, (frame, rgba) async {
        await tester
            .runAsync(() => encoder.appendFrame(Uint8List.fromList(rgba)));
        if (frame % 30 == 0) {
          print('RENDER frame $frame/$frames '
              '(${watch.elapsed.inSeconds}s elapsed)');
        }
      });
      await tester.runAsync(encoder.finish);
      print('RENDER DONE $frames frames in ${watch.elapsed.inSeconds}s '
          '-> $outputPath');

      final outputFile = File(outputPath);
      expect(outputFile.existsSync(), isTrue);
      expect(outputFile.lengthSync(), greaterThan(1000));
    },
    skip: outputPath == null,
    timeout: const Timeout(Duration(hours: 3)),
  );
}
