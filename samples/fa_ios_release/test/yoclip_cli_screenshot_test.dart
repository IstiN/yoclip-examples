import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  final outputFile = Platform.environment['YOCLIP_OUTPUT'];
  final frameEnv = Platform.environment['YOCLIP_FRAME'];

  final externalImageBytes = <String, Uint8List>{
    for (final e in {}.entries)
      e.key: base64Decode(e.value as String),
  };

  testWidgets(
    'yoclip screenshot',
    (tester) async {
      if (outputFile == null || frameEnv == null) return;
      // Absolute: `flutter test` inside a pub workspace runs with
      // Directory.current at the workspace root, not the package dir.
      final projectPath = "/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/fa_ios_release/.";
      final frame = int.parse(frameEnv);
      print('SCREENSHOT: output=$outputFile frame=$frame');

      final storage = LocalFileSystemStorage(projectPath);
      print('SCREENSHOT: loading project');
      final project = await YoclipProject.load(storage, projectPath);
      print('SCREENSHOT: project loaded');

      final runtime = createYoclipJsRuntime();
      print('SCREENSHOT: init runtime');
      await runtime.init();
      print('SCREENSHOT: runtime init done');
      addTearDown(runtime.dispose);

      final variant = project.config.variants.firstWhere(
        (v) => v.id == "dark_horizontal",
        orElse: () => throw StateError(
          'Unknown variant "dark_horizontal". Available: ${project.config.variants.map((v) => v.id).join(', ')}',
        ),
      );
      final scenes = await loadYoclipProjectScenes(runtime, project, storage, variant: variant);
      print('SCREENSHOT: scenes loaded');

      final captureFrame = frame;

      final renderer = YoclipV2Renderer(
        project: applyVariantResolution(project, variant),
        scenes: scenes,
        storage: storage,
        externalFiles: {"intro_video":"/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/fa_ios_release/.yoclip_cache/external/intro_video/intro_video.mp4"},
        externalFrameDirs: {"intro_video":"/Users/Uladzimir_Klyshevich/git/yoclip/samples/samples/fa_ios_release/.yoclip_cache/external/intro_video/frames"},
        externalImageBytes: externalImageBytes,
      );

      print('SCREENSHOT: capturing frame $captureFrame');
      final bytes = await renderer.capturePng(tester, captureFrame);
      print('SCREENSHOT: captured png, length ${bytes.length}');

      print('SCREENSHOT: writing file');
      await tester.runAsync(() => File(outputFile).writeAsBytes(bytes));
      stdout.writeln('Screenshot saved to $outputFile');
    },
    skip: outputFile == null || frameEnv == null,
  );
}
