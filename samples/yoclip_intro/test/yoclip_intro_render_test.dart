import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:path/path.dart' as path;
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart' as encoder_lib;

import 'test_paths.dart';

void main() {
  final outputPath = Platform.environment['YOCLIP_OUTPUT'];

  testWidgets(
    'yoclip v2 intro renders to mp4',
    (tester) async {
      if (outputPath == null) return;
      final projectPath = yoclipIntroProjectPath;

      final storage = LocalFileSystemStorage(projectPath);
      final project = await YoclipProject.load(storage, projectPath);

      final runtime = YoclipQuickJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);

      final scenes = <YoclipScene>[];
      for (final scenePath in project.scenePaths) {
        scenes.add(await loadSceneFromFile(runtime, storage, scenePath));
      }

      final cacheRoot = path.absolute(projectPath, '.yoclip_cache');
      final resolver = ExternalAssetResolver(cacheRoot: cacheRoot);
      final resolved = await tester.runAsync(
        () => resolver.resolve(
          project.externalAssets.map(
            (id, asset) => MapEntry(id, {'type': asset.type, 'path': asset.path}),
          ),
          fps: project.config.fps,
          width: project.config.width,
          height: project.config.height,
        ),
      );

      final audioTracks = await YoclipV2AudioResolver(storage).resolveAll(
        project,
        scenes,
        externalAudioFiles: resolved!.audioFiles,
      );
      final audioSpecs = await YoclipV2AudioResolver(storage).toEncoderSpecs(audioTracks);

      final encoderSpecs = audioSpecs
          .map(
            (s) => YoclipAudioTrackSpec(
              source: s.source,
              volume: s.volume,
              startFrame: s.startFrame,
            ),
          )
          .toList();

      final encoder = encoder_lib.YoclipEncoderTool(
        outputPath: outputPath,
        width: project.config.width,
        height: project.config.height,
        fps: project.config.fps,
        audioTracks: encoderSpecs,
      );

      final renderer = YoclipV2Renderer(
        project: project,
        scenes: scenes,
        storage: storage,
        externalFiles: resolved.files,
        externalFrameDirs: resolved.frameDirs,
      );

      await tester.runAsync(encoder.start);
      await renderer.renderToRgba(tester, (frame, rgba) async {
        await tester.runAsync(() => encoder.appendFrame(Uint8List.fromList(rgba)));
      });
      await tester.runAsync(encoder.finish);

      final outputFile = File(outputPath);
      expect(outputFile.existsSync(), isTrue);
      expect(outputFile.lengthSync(), greaterThan(1000));
    },
    skip: outputPath == null,
  );
}
