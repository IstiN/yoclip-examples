import 'dart:io' as io;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

import 'test_paths.dart';

// Renders fa_ios_release scenes for ALL 4 variants (dark/light ×
// horizontal/vertical). A regression in the shared brand/fa kit, the theme
// resolver, orientation layouts, or a scene itself fails here.
//
// Golden captures: YOCLIP_CAPTURE_DIR=/tmp/fa_ios_caps flutter test ...

void main() {
  final projectDir = faIosReleaseProjectPath;

  // One runtime per variant: the JS globals (`yoclipVariant`,
  // `yoclipFormat`, theme) are configured at load time and shared, so
  // variants must not coexist on a single runtime.
  final runtimes = <String, YoclipQuickJsRuntime>{};
  final loaded = <String, List<YoclipScene>>{};

  setUpAll(() async {
    final storage = LocalFileSystemStorage(projectDir);
    final project = await YoclipProject.load(storage, projectDir);

    for (final variant in project.config.variants) {
      final runtime = YoclipQuickJsRuntime();
      await runtime.init();
      runtimes[variant.id] = runtime;
      final scenes = await loadYoclipProjectScenes(
        runtime,
        project,
        storage,
        variant: variant,
        onSceneError: (path, sceneId, error) {
          // ignore: avoid_print
          print('SCENE ERROR $path ($sceneId): $error');
        },
      );
      loaded[variant.id] = scenes;
    }
  });

  tearDownAll(() {
    for (final runtime in runtimes.values) {
      runtime.dispose();
    }
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
    await load('Impact', '/System/Library/Fonts/Supplemental/Impact.ttf');
  }

  Future<void> pumpGraph(
    WidgetTester tester,
    Map<String, dynamic> graph,
    String captureName,
    int w,
    int h,
    int frame,
  ) async {
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = Size(w.toDouble(), h.toDouble());
    addTearDown(tester.view.reset);

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          body: RepaintBoundary(
            key: const ValueKey('capture'),
            child: SizedBox(
              width: w.toDouble(),
              height: h.toDouble(),
              // Frame + YoclipExternalAssets: AnimVideo reads the current
              // frame from context and resolves `external:` ids to files.
              child: YoclipExternalAssets(
                files: {
                  'intro_video':
                      '$projectDir/assets/video/intro_video.mp4',
                },
                child: Frame(
                  value: frame,
                  child: compiler.compile(graph, frame),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 100));
    // Deterministic video frames: wait until AnimVideo finished decoding
    // the frame it needs instead of capturing a mid-load placeholder.
    await tester.runAsync(() => AnimVideo.waitForPendingLoads());
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

  // variant id -> (w, h)
  const sizes = {
    'dark_horizontal': (1920, 1080),
    'dark_vertical': (1080, 1920),
    'light_horizontal': (1920, 1080),
    'light_vertical': (1080, 1920),
  };

  // scene id -> frames the director reviews.
  // 00_intro is excluded: AnimVideo decodes via a live ffmpeg stream, which
  // hangs under widget-test FakeAsync. Video playback is verified in Studio
  // and CLI export instead.
  const probes = {
    '01_hook': [10, 30, 90, 100, 116, 128, 134, 140, 148, 155],
    '02_download': [7, 30, 120, 170],
    '02b_splash': [12, 24, 44, 62, 82, 90, 112],
    '03_connect': [4, 7, 20, 40, 60, 110, 126, 143, 152, 160, 166],
    '04_ask': [8, 60, 100, 120, 144, 168, 192, 212, 224, 236, 252, 300, 340, 368, 410, 430],
    '05_build': [40, 90, 140, 150, 190, 220, 232],
    '06_publish': [60, 120, 145, 180, 184],
    '07_lockup': [8, 50, 100, 135, 143],
  };

  test('all 4 variants load 13 scenes each', () {
    expect(loaded.keys, containsAll(sizes.keys));
    for (final entry in loaded.entries) {
      expect(entry.value.length, 13, reason: 'variant ${entry.key}');
    }
  });

  // Same layering the engine uses: background first, then content, overlay.
  const layerOrder = {'background': 0, 'content': 1, 'overlay': 2};

  for (final variantId in sizes.keys) {
    final (w, h) = sizes[variantId]!;
    for (final probe in probes.entries) {
      final sceneId = probe.key;
      for (final localFrame in probe.value) {
        testWidgets(
          '$variantId / $sceneId frame $localFrame compiles and renders',
          (tester) async {
            await ensureTestFont();
            final scenes = loaded[variantId]!;
            final scene = scenes.firstWhere((s) => s.id == sceneId);
            expect(localFrame, lessThan(scene.duration));
            final globalFrame = scene.from + localFrame;
            // 00_intro (AnimVideo) is skipped in compositing too: its
            // ffmpeg streaming decode hangs under FakeAsync. Hooks probed
            // at local <91 render without the intro layer underneath,
            // which only affects the backdrop, not the layout under test.
            final active = scenes
                .where(
                  (s) =>
                      globalFrame >= s.from &&
                      globalFrame < s.from + s.duration &&
                      s.id != '00_intro',
                )
                .toList()
              ..sort(
                (a, b) =>
                    (layerOrder[a.layer] ?? 1) - (layerOrder[b.layer] ?? 1),
              );
            final layers = <Map<String, dynamic>>[];
            for (final s in active) {
              final g = s.render(globalFrame - s.from);
              expect(g, isNotNull, reason: 'scene ${s.id}');
              layers.add(Map<String, dynamic>.from(g!));
            }
            final graph = <String, dynamic>{
              'type': 'stack',
              'fit': 'expand',
              'children': layers,
            };
            await pumpGraph(
              tester,
              graph,
              '${variantId}_${sceneId}_$localFrame',
              w,
              h,
              globalFrame,
            );
          },
        );
      }
    }
  }
}
