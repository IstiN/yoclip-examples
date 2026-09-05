import 'dart:io' as io;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
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

  /// Load the workspace Geneva face so captured frames show real text
  /// instead of flutter_test's block glyphs.
  Future<void> ensureFonts(WidgetTester tester) async {
    final bytes = (await tester.runAsync(
      () => rootBundle.load('packages/yoclip_core/fonts/Geneva.ttf'),
    ))!;
    final loader = FontLoader('Geneva')..addFont(Future.value(bytes));
    await loader.load();
  }

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

  /// Set YOCLIP_CAPTURE_DIR to dump every probed frame as a PNG — the
  /// agent-friendly golden check (`YOCLIP_CAPTURE_DIR=/tmp/wall flutter test`).
  Future<void> pumpGraph(
    WidgetTester tester,
    Map<String, dynamic> graph,
    String captureName,
  ) async {
    await ensureFonts(tester);
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = const Size(1920, 1080);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: RepaintBoundary(key: const ValueKey('capture'),
            child: SizedBox(
              width: 1920,
              height: 1080,
              child: compiler.compile(graph, 0),
            ),
          ),
        ),
      ),
    );
    await tester.pump();

    final captureDir = io.Platform.environment['YOCLIP_CAPTURE_DIR'];
    if (captureDir == null || captureDir.isEmpty) return;
    final boundary =
        tester.renderObject<RenderRepaintBoundary>(
            find.byKey(const ValueKey('capture')));
    final ui.Image? image =
        await tester.runAsync(() => boundary.toImage(pixelRatio: 1.0));
    ByteData? bytes;
    await tester.runAsync(() async {
      if (image != null) {
        bytes = await image.toByteData(format: ui.ImageByteFormat.png);
      }
    });
    final dir = io.Directory(captureDir);
    if (!dir.existsSync()) dir.createSync(recursive: true);
    final data = bytes;
    if (data != null) {
      io.File('$captureDir/$captureName.png')
          .writeAsBytesSync(data.buffer.asUint8List());
    }
  }

  // Probes each scene at frames that hit every animation phase: entrance
  // (mid-tween), hold (all windows complete), and for the sequence scene the
  // post-footer settle.
  const probes = <String, List<int>>{
    'wall': [10, 40, 119],
    'logo': [16, 46, 100],
    'finale': [16, 40, 110],
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
          await pumpGraph(tester, graph, '$sceneId-$frame');
          expect(tester.takeException(), isNull);
        },
      );
    }
  });

  test('project anchors the three demo scenes with 120-frame timelines',
      () async {
    await ensureLoaded();
    expect(_scenes.keys, containsAll(['wall', 'logo', 'finale']));
    for (final scene in _scenes.values) {
      expect(scene.duration, 120);
    }
  });
}
