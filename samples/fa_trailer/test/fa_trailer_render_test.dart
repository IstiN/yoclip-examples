import 'dart:io' as io;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

import 'test_paths.dart';

/// The Fa trailer golden harness: every scene loads through the QuickJS
/// runtime and every storyboard beat compiles into real widgets. Set
/// YOCLIP_CAPTURE_DIR to dump the probed frames as PNGs — the agent-friendly
/// visual check the director reviews between cuts.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  YoclipJsRuntime? _runtime;
  final _scenes = <String, YoclipScene>{};

  Future<void> ensureLoaded() async {
    if (_scenes.isNotEmpty) return;
    final projectPath = faTrailerProjectPath;
    final storage = LocalFileSystemStorage(projectPath);
    final project = await YoclipProject.load(storage, projectPath);

    final runtime = YoclipQuickJsRuntime();
    await runtime.init();
    _runtime = runtime;

    final loaded = await loadYoclipProjectScenes(runtime, project, storage,
        onSceneError: (path, sceneId, error) {
      // ignore: avoid_print
      print('SCENE ERROR $path ($sceneId): $error');
    });
    for (final scene in loaded) {
      _scenes[scene.id] = scene;
    }
  }

  tearDownAll(() {
    _runtime?.dispose();
  });

  final compiler = YoclipWidgetRenderer();

  Future<void> ensureTestFont() async {
    Future<void> load(String family, String file) async {
      final fileObj = file.startsWith('/')
          ? io.File(file)
          : io.File('/opt/homebrew/share/flutter/bin/'
              'cache/artifacts/material_fonts/$file');
      if (!fileObj.existsSync()) return;
      final loader = FontLoader(family)
        ..addFont(
          Future.value(ByteData.view(fileObj.readAsBytesSync().buffer)),
        );
      await loader.load();
    }

    await load('monospace', 'Roboto-Regular.ttf');
    await load('Roboto', 'Roboto-Regular.ttf');
    await load('sans-serif', 'Roboto-Regular.ttf');
    await load('RobotoCondensed', 'RobotoCondensed-Bold.ttf');
    await load('DINCondensed', '/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf');
    await load('Impact', '/System/Library/Fonts/Supplemental/Impact.ttf');
  }

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

  // One probe per storyboard beat — the frames a silent regression would
  // flatten. Scene id -> the frames the director reviews.
  final probes = <String, List<int>>{
    '01_dark': [10, 60, 150, 200],
    '02_alive': [25, 60, 105, 140],
    '03_hardware': [40, 100, 170, 205],
    '04_core': [20, 70, 110, 160],
    '05_everywhere': [30, 90, 200],
    '06_power': [30, 110, 180],
    '07_work': [40, 120],
    '08_lockup': [50, 110, 170],
  };

  probes.forEach((sceneId, frames) {
    for (final frame in frames) {
      testWidgets('$sceneId frame $frame compiles and renders',
          (tester) async {
        await ensureLoaded();
        await ensureTestFont();
        final scene = _scenes[sceneId];
        expect(scene, isNotNull, reason: 'scene $sceneId must load');
        final graph = scene!.render(frame);
        expect(graph, isA<Map<String, dynamic>>());
        await pumpGraph(tester, graph, '$sceneId-$frame');
        expect(tester.takeException(), isNull);
      });
    }
  });

  test('the project anchors all eight shots with the 1560-frame film', () async {
    await ensureLoaded();
    expect(_scenes.keys, containsAll([
      '01_dark',
      '02_alive',
      '03_hardware',
      '04_core',
      '05_everywhere',
      '06_power',
      '07_work',
      '08_lockup',
    ]));
    expect(_scenes['01_dark']!.duration, 210);
    expect(_scenes['08_lockup']!.from, 1380);
  });
}
