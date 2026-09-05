import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';


import 'test_paths.dart';

/// The playground project proves the newest scene features end to end:
/// loads every scene through the QuickJS runtime (jsr.motion builtins +
/// the sample lib) and compiles each into real widgets at entrance, mid,
/// and hold frames. Any regression in shapes, motion, or sequence helper
/// shows up here first.
///
/// Tests register statically (a lazily-initialized shared runtime supplies
/// the scenes), so a broken loader still fails every probe loudly.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  YoclipJsRuntime? _runtime;
  final _scenes = <String, YoclipScene>{};

  Future<void> ensureLoaded() async {
    if (_scenes.isNotEmpty) return;
    final projectPath = motionShapesProjectPath;
    final storage = LocalFileSystemStorage(projectPath);
    final project = await YoclipProject.load(storage, projectPath);

    final runtime = YoclipQuickJsRuntime();
    await runtime.init();
    _runtime = runtime;

    // The project scenes loader is the house entry point: it evaluates
    // project.js, loads the shared lib (project.js `lib`), applies anchors,
    // and wires yoclipTheme for every scene.
    final loaded = await loadYoclipProjectScenes(runtime, project, storage);
    for (final scene in loaded) {
      _scenes[scene.id] = scene;
    }
  }

  tearDownAll(() {
    _runtime?.dispose();
  });

  final compiler = YoclipWidgetRenderer();

  Future<void> pumpGraph(WidgetTester tester, Map<String, dynamic> graph) {
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = const Size(1920, 1080);
    addTearDown(tester.view.reset);
    return tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(body: compiler.compile(graph, 0)),
      ),
    );
  }

  // Probes each scene at frames that hit every animation phase: entrance
  // (mid-tween), hold (all windows complete), and for the sequence scene the
  // post-footer settle.
  const probes = <String, List<int>>{
    'shapes': [10, 40, 119],
    'motion': [30, 80, 119],
    'sequence': [10, 50, 90],
  };

  probes.forEach((sceneId, frames) {
    for (final frame in frames) {
      testWidgets(
        '$sceneId: frame $frame compiles and renders',
        (tester) async {
          await ensureLoaded();
          final scene = _scenes[sceneId];
          expect(scene, isNotNull, reason: 'scene $sceneId must load');
          final graph = scene!.render(frame);
          expect(graph, isA<Map<String, dynamic>>());
          await pumpGraph(tester, graph);
          expect(tester.takeException(), isNull);
        },
      );
    }
  });

  test('project anchors the three demo scenes with 120-frame timelines',
      () async {
    await ensureLoaded();
    expect(_scenes.keys, containsAll(['shapes', 'motion', 'sequence']));
    for (final scene in _scenes.values) {
      expect(scene.duration, 120);
    }
  });
}
