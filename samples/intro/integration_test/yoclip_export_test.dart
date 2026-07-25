import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:intro/main.dart';
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart';

Future<List<YoclipAudioTrackSpec>> _resolveAudioTracks(
  List<AudioTrack> tracks,
) async {
  final resolved = <YoclipAudioTrackSpec>[];
  for (final track in tracks) {
    var source = track.source;
    if (source.startsWith('assets/')) {
      final data = await rootBundle.load(source);
      final tempDir = Directory.systemTemp.createTempSync('yoclip_audio');
      final file = File(path.join(tempDir.path, path.basename(source)));
      await file.writeAsBytes(data.buffer.asUint8List());
      source = file.path;
    }
    resolved.add(YoclipAudioTrackSpec(
      source: source,
      volume: track.volume,
      startFrame: track.start,
    ));
  }
  return resolved;
}

Future<ResolvedExternalAssets> _resolveExternalAssets() async {
  final yamlString = await rootBundle.loadString('yoclip.yaml');
  final fullConfig = loadYoclipConfigFromString(yamlString);
  final externalAssets =
      fullConfig['external_assets'] as Map<dynamic, dynamic>?;
  if (externalAssets == null || externalAssets.isEmpty) {
    return const ResolvedExternalAssets();
  }
  final appDir = await getApplicationDocumentsDirectory();
  final resolver = ExternalAssetResolver(cacheRoot: appDir.path);
  return resolver.resolve(
    externalAssets,
    fps: 30,
    width: 1920,
    height: 1080,
  );
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets(
    'yoclip export to mp4 with audio and external assets',
    (tester) async {
    final outputPath = Platform.environment['YOCLIP_OUTPUT'] ??
        path.join(
          Platform.environment['HOME']!,
          'Documents',
          'yoclip_export_test.mp4',
        );
    const config = VideoConfig(
      duration: 90,
      fps: 30,
      width: 1920,
      height: 1080,
    );

    const composition = IntroVideo();
    final encoder = YoclipEncoder();
    final audioTracks = await _resolveAudioTracks(composition.audio);
    final externalAssets = await _resolveExternalAssets();

    stdout.writeln('Encoder starting...');
    await encoder.start(
      outputPath: outputPath,
      width: config.width,
      height: config.height,
      fps: config.fps,
      audioTracks: audioTracks,
    );
    stdout.writeln('Encoder started');

    final wrappedComposition = YoclipExternalAssets(
      files: externalAssets.files,
      frameDirs: externalAssets.frameDirs,
      child: const Intro(),
    );

    final stopwatch = Stopwatch()..start();
    final renderer = HeadlessRenderer(
      composition: wrappedComposition,
      config: config,
      onProgress: (frame, total) {
        if (frame % 10 == 0 || frame == total) {
          stdout.writeln('Progress: $frame/$total');
        }
      },
    );

    await renderer.renderToRgba(tester, (frame, rgba) async {
      if (frame == 0) stdout.writeln('Appending first frame');
      await encoder.appendFrame(rgba);
      if (frame == 0) stdout.writeln('First frame appended');
    });

    stdout.writeln('Finishing...');
    await encoder.finish();
    stdout.writeln('Finished');
    stopwatch.stop();
    stdout.writeln('Done in ${stopwatch.elapsedMilliseconds}ms');

    expect(File(outputPath).existsSync(), isTrue);
    expect(File(outputPath).lengthSync(), greaterThan(1000));
  });
}
