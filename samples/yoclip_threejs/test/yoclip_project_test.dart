import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  test('120-second project loads and every editorial scene renders', () async {
    final path = Directory.current.path;
    final storage = LocalFileSystemStorage(path);
    final project = await YoclipProject.load(storage, path);
    expect(project.config.duration, 3600);
    expect(project.config.fps, 30);
    expect(project.config.width, 1920);
    expect(project.config.height, 1080);
    final runtime = createYoclipJsRuntime();
    await runtime.init();
    addTearDown(runtime.dispose);
    final scenes = await loadYoclipProjectScenes(runtime, project, storage);
    expect(scenes, hasLength(14));
    expect(
      scenes.singleWhere((scene) => scene.id == 'three_world').duration,
      3600,
    );
    expect(scenes.singleWhere((scene) => scene.id == 'hud').duration, 3600);
    final chapters = scenes
        .where((scene) => scene.layer == 'content')
        .toList(growable: false);
    expect(chapters, hasLength(12));
    for (var index = 0; index < chapters.length; index++) {
      final scene = chapters[index];
      expect(scene.duration, 300, reason: scene.id);
      expect(scene.from, index * 300, reason: scene.id);
      expect(scene.render(150), isA<Map<String, dynamic>>(), reason: scene.id);
    }
  });
}
