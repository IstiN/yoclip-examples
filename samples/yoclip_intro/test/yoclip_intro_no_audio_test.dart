import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart';

import 'test_paths.dart';

void main() {
  testWidgets('yoclip v2 intro renders without audio', (tester) async {
    final outputPath = '/tmp/yoclip_intro_v2_no_audio.mp4';
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

    final cacheRoot = '$projectPath/.yoclip_cache';
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

    final encoder = YoclipEncoderTool(
      outputPath: outputPath,
      width: project.config.width,
      height: project.config.height,
      fps: project.config.fps,
      audioTracks: const [],
    );

    final renderer = YoclipV2Renderer(
      project: project,
      scenes: scenes,
      storage: storage,
      externalFiles: resolved!.files,
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
  });
}
