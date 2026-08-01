import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core_vm.dart';

void main() {
  testWidgets('project loads and every scene renders first and last frame',
      (tester) async {
    const projectPath = '.';

    final storage = LocalFileSystemStorage(projectPath);
    final project = await YoclipProject.load(storage, projectPath);
    expect(project.scenePaths, isNotEmpty);

    final runtime = YoclipQuickJsRuntime();
    addTearDown(runtime.dispose);
    await runtime.init();

    final scenes = await loadYoclipProjectScenes(runtime, project, storage);
    expect(scenes, isNotEmpty);

    for (final scene in scenes) {
      final first = scene.render(0);
      expect(first, isA<Map>(), reason: '${scene.id} frame 0');
      final last = scene.render(scene.duration - 1);
      expect(last, isA<Map>(), reason: '${scene.id} frame ${scene.duration - 1}');
    }

    final hook = scenes.firstWhere((s) => s.id == 'hook');
    expect(hook.render(0)['type'], 'stack');
  });
}
