import 'dart:io' as io;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

import 'test_paths.dart';

/// The Fa logo morph proves the brand-storyboard choreography end to end:
/// the scene loads through the QuickJS runtime (jsr.motion + the brand lib)
/// and the icon, glitch, prompt, morph, letterform and bloom beats compile
/// into real widgets. Any regression in geometry, mapper or timing shows up
/// here first. Set YOCLIP_CAPTURE_DIR to dump the probed frames as PNGs —
/// the agent-friendly visual golden check.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  YoclipJsRuntime? _runtime;
  final _scenes = <String, YoclipScene>{};

  Future<void> ensureLoaded() async {
    if (_scenes.isNotEmpty) return;
    final projectPath = faLogoMorphProjectPath;
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

  Future<void> pumpGraph(
    WidgetTester tester,
    Map<String, dynamic> graph,
    String captureName,
  ) async {
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = const Size(1920, 1080);
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: RepaintBoundary(
            key: const ValueKey('capture'),
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
    final boundary = tester.renderObject<RenderRepaintBoundary>(
      find.byKey(const ValueKey('capture')),
    );
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

  // Probes the single morph scene at one frame per storyboard beat.
  const probes = <int>[
    10, // 01 icon hold (dark glass, cursor pulse)
    60, // 02 boot scan — teal line sweeping the icon
    84, // 05 hero zoom settling
    100, // 06 cue band + pre-morph hold
    134, // 08 the bar lifted off its slot
    145, // 08 the tip reaching right
    158, // 08 the wire mid-curl
    174, // 09 the o's blink-off at center stage
    193, // 09 the split — rings gliding to accent + bowl
    214, // 11 the a's stem gradient drawing
    236, // 16 final bloom
  ];

  for (final frame in probes) {
    testWidgets('frame $frame compiles and renders', (tester) async {
      await ensureLoaded();
      final scene = _scenes['fa_morph'];
      expect(scene, isNotNull, reason: 'scene fa_morph must load');
      final graph = scene!.render(frame);
      expect(graph, isA<Map<String, dynamic>>());
      await pumpGraph(tester, graph, 'fa_morph-$frame');
      expect(tester.takeException(), isNull);
    });
  }

  test('the project anchors the morph scene with the 240-frame timeline',
      () async {
    await ensureLoaded();
    expect(_scenes.keys, contains('fa_morph'));
    expect(_scenes['fa_morph']!.duration, 240);
  });
}
