import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart' as encoder_lib;

void main() {
  final outputPath = Platform.environment['YOCLIP_OUTPUT'];
  final startFrame =
      int.tryParse(Platform.environment['YOCLIP_START_FRAME'] ?? '') ?? 0;
  final requestedEndFrame = int.tryParse(
    Platform.environment['YOCLIP_END_FRAME'] ?? '',
  );
  testWidgets(
    'render the 102-second LEVEL UP MP4 master',
    (tester) async {
      if (outputPath == null) return;
      final projectPath = Directory.current.path;
      final storage = LocalFileSystemStorage(projectPath);
      late final YoclipProject project;
      late final List<YoclipScene> scenes;
      late final YoclipJsRuntime runtime;
      late final Uint8List logoBytes;
      late final List<YoclipAudioTrackSpec> audioSpecs;
      await tester.runAsync(() async {
        project = await YoclipProject.load(storage, projectPath);
        runtime = createYoclipJsRuntime();
        await runtime.init();
        scenes = await loadYoclipProjectScenes(runtime, project, storage);
        logoBytes = await File(
          '$projectPath/assets/images/yoclip_logo.svg',
        ).readAsBytes();
        final audioTracks = await YoclipV2AudioResolver(
          storage,
        ).resolveAll(project, scenes, externalAudioFiles: const {});
        // Excerpts are muxed against the matching master-audio range afterwards;
        // passing the full track here would incorrectly restart it at zero.
        audioSpecs = startFrame > 0
            ? const []
            : await YoclipV2AudioResolver(storage).toEncoderSpecs(audioTracks);
      });
      addTearDown(runtime.dispose);
      final renderer = YoclipV2Renderer(
        project: project,
        scenes: scenes,
        storage: storage,
        externalImageBytes: <String, Uint8List>{'logo': logoBytes},
      );
      final output = File(outputPath).absolute;
      await tester.runAsync(() => output.parent.create(recursive: true));
      final encoder = encoder_lib.YoclipEncoderTool(
        outputPath: output.path,
        width: project.config.width,
        height: project.config.height,
        fps: project.config.fps,
        audioTracks: audioSpecs
            .map(
              (track) => encoder_lib.YoclipAudioTrackSpec(
                source: track.source,
                volume: track.volume,
                startFrame: track.startFrame,
                envelope: track.envelope,
              ),
            )
            .toList(growable: false),
        videoBitrate: 18000000,
        audioBitrate: 256000,
      );
      await tester.runAsync(encoder.start);
      await renderer.renderToRgba(
        tester,
        (frame, rgba) async {
          await tester.runAsync(
            () => encoder.appendFrame(Uint8List.fromList(rgba)),
          );
          if (frame % 30 == 0 ||
              frame == (requestedEndFrame ?? project.config.duration) - 1) {
            // ignore: avoid_print
            print(
              'YOCLIP_RENDER frame=${frame + 1}/${requestedEndFrame ?? project.config.duration}',
            );
          }
        },
        startFrame: startFrame,
        endFrame: requestedEndFrame,
      );
      await tester.runAsync(encoder.finish);
      expect(output.existsSync(), isTrue);
      expect(output.lengthSync(), greaterThan(1000000));
      // ignore: avoid_print
      print('YOCLIP_MASTER=${output.path}');
    },
    timeout: const Timeout(Duration(hours: 2)),
    skip: outputPath == null,
  );
}
