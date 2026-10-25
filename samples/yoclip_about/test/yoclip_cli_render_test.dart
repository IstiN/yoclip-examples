import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart' as encoder_lib;

void main() {
  final outputPath = Platform.environment['YOCLIP_OUTPUT'];

  final externalImageBytes = <String, Uint8List>{
    'logo': File('/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/yoclip_about/assets/images/yoclip_logo.svg').readAsBytesSync(),
    'logo_on_light': File('/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/yoclip_about/assets/images/yoclip_logo_on_light.svg').readAsBytesSync(),
  };

  testWidgets(
    'yoclip render mp4',
    (tester) async {
      if (outputPath == null) return;
      const projectPath = '/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/yoclip_about';

      final storage = LocalFileSystemStorage(projectPath);
      final project = await YoclipProject.load(storage, projectPath);

      final runtime = YoclipQuickJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);

      final scenes = await loadYoclipProjectScenes(runtime, project, storage);

      final audioTracks = await YoclipV2AudioResolver(storage).resolveAll(
        project,
        scenes,
        externalAudioFiles: {},
      );
      final audioSpecs = await YoclipV2AudioResolver(storage).toEncoderSpecs(audioTracks);
      final encoderAudioSpecs = audioSpecs
          .map(
            (s) => encoder_lib.YoclipAudioTrackSpec(
              source: s.source,
              volume: s.volume,
              startFrame: s.startFrame,
            ),
          )
          .toList();

      final adjustedProject = YoclipProject(
        rootPath: project.rootPath,
        config: YoclipProjectConfig(
          duration: project.config.duration,
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
      );

      final renderer = YoclipV2Renderer(
        project: adjustedProject,
        scenes: scenes,
        storage: storage,
        externalFiles: {
          'logo': '$projectPath/assets/images/yoclip_logo.svg',
          'logo_on_light': '$projectPath/assets/images/yoclip_logo_on_light.svg',
          'studio': '$projectPath/assets/images/studio.png',
        },
        externalFrameDirs: {},
        externalImageBytes: externalImageBytes,
      );

      final encoder = encoder_lib.YoclipEncoderTool(
        outputPath: outputPath,
        width: project.config.width,
        height: project.config.height,
        fps: project.config.fps,
        audioTracks: encoderAudioSpecs,
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
