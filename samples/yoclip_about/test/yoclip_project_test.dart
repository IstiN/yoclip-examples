import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core_vm.dart';

void main() {
  testWidgets('project loads and renders frame 0', (tester) async {
    const projectPath = '.';

    final storage = LocalFileSystemStorage(projectPath);
    final project = await YoclipProject.load(storage, projectPath);
    expect(project.scenePaths, isNotEmpty);

    final runtime = YoclipQuickJsRuntime();
    addTearDown(runtime.dispose);
    await runtime.init();

    final scenes = await loadYoclipProjectScenes(runtime, project, storage);
    final intro = scenes.firstWhere((s) => s.id == 'intro');

    final graph = intro.render(0);
    expect(graph['type'], 'stack');
  });
}
