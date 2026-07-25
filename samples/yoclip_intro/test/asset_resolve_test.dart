import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

import 'test_paths.dart';

void main() {
  testWidgets('resolves external assets', (tester) async {
    final projectPath = yoclipIntroProjectPath;
    final storage = LocalFileSystemStorage(projectPath);
    final project = await YoclipProject.load(storage, projectPath);

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

    expect(resolved!.files, contains('laptop_open'));
    expect(resolved.files, contains('logo'));
    expect(resolved.frameDirs, contains('laptop_open'));
    expect(resolved.audioFiles, contains('laptop_open'));

    final audioFile = File(resolved.audioFiles['laptop_open']!);
    expect(audioFile.existsSync(), isTrue);
    expect(audioFile.lengthSync(), greaterThan(1000));

    final header = audioFile.readAsBytesSync().sublist(0, 4);
    expect(String.fromCharCodes(header), 'RIFF');
  });
}
