import 'dart:io' as io;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final compiler = YoclipWidgetRenderer();

  Future<void> ensureFonts() async {
    Future<void> load(String family, String path) async {
      final file = io.File(path);
      if (!file.existsSync()) return;
      final loader = FontLoader(family)
        ..addFont(Future.value(ByteData.view(file.readAsBytesSync().buffer)));
      await loader.load();
    }
    await load('RobotoCondensed', '/opt/homebrew/share/flutter/bin/cache/artifacts/material_fonts/RobotoCondensed-Bold.ttf');
    await load('DINCondensed', '/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf');
    await load('Impact', '/System/Library/Fonts/Supplemental/Impact.ttf');
  }

  testWidgets('probe fonts', (tester) async {
    await ensureFonts();
    tester.view.devicePixelRatio = 1.0;
    tester.view.physicalSize = const Size(1920, 1080);
    addTearDown(tester.view.reset);

    for (final font in ['Impact', 'DINCondensed']) {
      final graph = {
        'type': 'stack',
        'fit': 'expand',
        'children': [
          {'type': 'rect', 'width': 1920, 'height': 1080, 'fill': '#000000', 'positioned': {'left': 0, 'top': 0}},
          {
            'type': 'text',
            'text': 'AN AGENT',
            'width': 1920,
            'style': {
              'fontSize': font == 'Impact' ? 440 : 540,
              'fontFamily': font,
              'fontWeight': '700',
              'textAlign': 'center',
              'color': '#FFFFFF',
              'gradient': {
                'begin': 'topCenter',
                'end': 'bottomCenter',
                'colors': ['#FFFFFF', '#E8E8EE', '#A0A0AA'],
                'stops': [0.0, 0.45, 1.0],
              },
            },
            'positioned': {'left': 0, 'top': font == 'Impact' ? 50 : 30},
          },
          {
            'type': 'text',
            'text': 'POWERHOUSE',
            'width': 1920,
            'style': {
              'fontSize': font == 'Impact' ? 320 : 420,
              'fontFamily': font,
              'fontWeight': '700',
              'textAlign': 'center',
              'color': '#FFFFFF',
              'gradient': {
                'begin': 'topCenter',
                'end': 'bottomCenter',
                'colors': ['#B8B8C0', '#888892'],
                'stops': [0.0, 1.0],
              },
            },
            'positioned': {'left': 0, 'top': font == 'Impact' ? 580 : 560},
          },
        ],
      };

      await tester.pumpWidget(
        MaterialApp(
          debugShowCheckedModeBanner: false,
          home: Scaffold(
            body: RepaintBoundary(
              key: ValueKey('cap_$font'),
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

      final boundary = tester.renderObject<RenderRepaintBoundary>(find.byKey(ValueKey('cap_$font')));
      final image = await tester.runAsync(() => boundary.toImage(pixelRatio: 1.0));
      final bytes = await tester.runAsync(() => image!.toByteData(format: ui.ImageByteFormat.png));
      io.File('/tmp/probe_$font.png').writeAsBytesSync(bytes!.buffer.asUint8List());
    }
  });
}
