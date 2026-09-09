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

  // Real glyphs for the golden captures: the tester's default font paints
  // every glyph as a solid block, which is useless for text-driven scenes
  // (the kaomoji IS text). Load the SDK's Roboto as "Roboto" and also as
  // "monospace" — the terminal scenes ask for the mono family, and the
  // tester has no platform font fallback.
  Future<void> ensureTestFont() async {
    final mono = FontLoader('monospace');
    mono.addFont(
      Future.value(ByteData.view(io.File('/opt/homebrew/share/flutter/bin/'
              'cache/artifacts/material_fonts/Roboto-Regular.ttf')
          .readAsBytesSync().buffer)),
    );
    await mono.load();
    final roboto = FontLoader('Roboto');
    roboto.addFont(
      Future.value(ByteData.view(io.File('/opt/homebrew/share/flutter/bin/'
              'cache/artifacts/material_fonts/Roboto-Regular.ttf')
          .readAsBytesSync().buffer)),
    );
    await roboto.load();
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

  // Probes the single morph scene at one frame per storyboard beat.
  const probes = <int>[
    156, // wink pre-roll
    159, // wink pre-roll
    163, // wink mid-slide sharp
    166, // wink slide end
    169, // rounding start
    172, // rounding near-done
    175, // fold first frames
    178, // fold early
    10, // 01 icon hold (dark glass, cursor pulse)
    60, // 02 boot scan — teal line sweeping the icon
    84, // 05 hero zoom settling
    100, // 06 cue band + pre-morph hold
    132, // 08 the mouth lifted off its slot
    140, // 08 the mouth pursed to a dash: `>-`
    150, // 08 the wire mid-curl
    168, // 09 the wink: mouth closed flat, eye pinched `>-`
    174, // 09 the mouth popped back open: `>o` (fold begins)
    176, // tmp fold vertex
    180, // tmp fold vertex
    184, // tmp fold vertex
    190, // tmp bar+accent emerging
    192, // 10 the arms folded into the stem line
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

  // The kaomoji face: eyes open with the bar cursor, the solid-block
  // cursor phase, and both squint beats — the glyph-swap beats are the
  // ones a silent regression would flatten.
  const kaomojiProbes = <int>[
    60, // 0_0, solid-block cursor (fully appeared)
    42, // 0_0, thin-bar cursor
    100, // ( > < ) first squint
    198, // ( > < ) second squint
  ];

  // The code-wall face: the glitch stop, the four face states, and the
  // final icon bloom.
  const codeFaceProbes = <int>[
    45, // mid-glitch: tear bars + flashing rows
    100, // ( 0_0 ) with the sharp ___ mouth
    130, // ( >|< )
    160, // ( > o )
    182, // ( > - )
    234, // the Fa icon bloom
  ];

  for (final frame in codeFaceProbes) {
    testWidgets('code_face frame $frame compiles and renders', (tester) async {
      await ensureLoaded();
      await ensureTestFont();
      final scene = _scenes['code_face'];
      expect(scene, isNotNull, reason: 'scene code_face must load');
      final graph = scene!.render(frame);
      expect(graph, isA<Map<String, dynamic>>());
      await pumpGraph(tester, graph, 'code_face-$frame');
      expect(tester.takeException(), isNull);
    });
  }

  for (final frame in kaomojiProbes) {
    testWidgets('kaomoji frame $frame compiles and renders', (tester) async {
      await ensureLoaded();
      await ensureTestFont();
      final scene = _scenes['kaomoji'];
      expect(scene, isNotNull, reason: 'scene kaomoji must load');
      final graph = scene!.render(frame);
      expect(graph, isA<Map<String, dynamic>>());
      await pumpGraph(tester, graph, 'kaomoji-$frame');
      expect(tester.takeException(), isNull);
    });
  }
}
