import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';
import 'package:yoclip_encoder/yoclip_encoder.dart' as encoder_lib;

void main() {
  final outputPath = Platform.environment['YOCLIP_OUTPUT'];

  final externalImageBytes = {
    for (final e in {"logo":"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDgyMCA1MjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lY2FwOnJvdW5kOyI+CiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjUsMCwwLDAuNSwwLDEwKSI+CiAgICAgICAgPHBhdGggZD0iTTgxMi42LDIwNC4zQzczNy43NTMsMTM4LjM4OSA2NDEuMzY5LDEwMiA1NDEuNjM3LDEwMkMzMTYuNzE4LDEwMiAxMzEuNjM3LDI4Ny4wODEgMTMxLjYzNyw1MTJDMTMxLjYzNyw3MzYuOTE5IDMxNi43MTgsOTIyIDU0MS42MzcsOTIyQzY0MS4zNjksOTIyIDczNy43NTMsODg1LjYxMSA4MTIuNiw4MTkuNyIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6cmdiKDE5LDE5LDI2KTtzdHJva2Utd2lkdGg6ODBweDsiLz4KICAgICAgICA8cGF0aCBkPSJNOTE1LDQwMEw5MTUsNjAwQzkxNSw2NTUuMTkyIDg3MC4xOTIsNzAwIDgxNSw3MDBMMzc1LDcwMEMzMTkuODA4LDcwMCAyNzUsNjU1LjE5MiAyNzUsNjAwTDI3NSw0MDBDMjc1LDM0NC44MDggMzE5LjgwOCwzMDAgMzc1LDMwMEw4MTUsMzAwQzg3MC4xOTIsMzAwIDkxNSwzNDQuODA4IDkxNSw0MDBaIiBzdHlsZT0iZmlsbDp1cmwoI19MaW5lYXIxKTsiLz4KICAgICAgICA8cGF0aCBkPSJNNjcwLDY2MEw3NjAsNzcwTDg0MCw2NDBMNjcwLDY2MFoiIHN0eWxlPSJmaWxsOnVybCgjX0xpbmVhcjIpO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMTI1LDAsMCwxLC0xMDguNjI1LDI0KSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik04NjksNDA1TDg2OSw0MjlDODY5LDQ0MC4wMzggODYxLjAzNCw0NDkgODUxLjIyMiw0NDlMODIyLjc3OCw0NDlDODEyLjk2Niw0NDkgODA1LDQ0MC4wMzggODA1LDQyOUw4MDUsNDA1QzgwNSwzOTMuOTYyIDgxMi45NjYsMzg1IDgyMi43NzgsMzg1TDg1MS4yMjIsMzg1Qzg2MS4wMzQsMzg1IDg2OSwzOTMuOTYyIDg2OSw0MDVaIiBzdHlsZT0iZmlsbDp3aGl0ZTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4xMjUsMCwwLDEsLTEwOC42MjUsMTIpIj4KICAgICAgICAgICAgPHBhdGggZD0iTTg2OSw1MTBMODY5LDUzNEM4NjksNTQ1LjAzOCA4NjEuMDM0LDU1NCA4NTEuMjIyLDU1NEw4MjIuNzc4LDU1NEM4MTIuOTY2LDU1NCA4MDUsNTQ1LjAzOCA4MDUsNTM0TDgwNSw1MTBDODA1LDQ5OC45NjIgODEyLjk2Niw0OTAgODIyLjc3OCw0OTBMODUxLjIyMiw0OTBDODYxLjAzNCw0OTAgODY5LDQ5OC45NjIgODY5LDUxMFoiIHN0eWxlPSJmaWxsOndoaXRlOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDM2MCwzODUpIj4KICAgICAgICAgICAgPHBhdGggZD0iTTIwLDEwTDcwLDExMEwxMjAsMTBNNzAsMTEwTDcwLDE5MCIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6d2hpdGU7c3Ryb2tlLXdpZHRoOjUycHg7c3Ryb2tlLWxpbmVqb2luOnJvdW5kOyIvPgogICAgICAgICAgICA8Y2lyY2xlIGN4PSIyMzAiIGN5PSIxMDUiIHI9IjY1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTp3aGl0ZTtzdHJva2Utd2lkdGg6NTJweDtzdHJva2UtbGluZWpvaW46cm91bmQ7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgogICAgPGc+CiAgICAgICAgPHBhdGggZD0iTTQ4NSwzNDRMNDg1LDE3NiIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6cmdiKDE5LDE5LDI2KTtzdHJva2Utd2lkdGg6MzJweDtzdHJva2UtbGluZWpvaW46cm91bmQ7Ii8+CiAgICAgICAgPHBhdGggZD0iTTU0NSwzNDRMNTQ1LDIzMiIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6cmdiKDE5LDE5LDI2KTtzdHJva2Utd2lkdGg6MzJweDtzdHJva2UtbGluZWpvaW46cm91bmQ7Ii8+CiAgICAgICAgPHBhdGggZD0iTTYwNSwzNDRMNjA1LDIzMiIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6cmdiKDE5LDE5LDI2KTtzdHJva2Utd2lkdGg6MzJweDtzdHJva2UtbGluZWpvaW46cm91bmQ7Ii8+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC45MTQyODYsMCwwLDEuMDY2NjY3LDYxLC0yMS4yNjY2NjcpIj4KICAgICAgICAgICAgPGVsbGlwc2UgY3g9IjY2NSIgY3k9IjI0NCIgcng9IjcwIiByeT0iNjAiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOnJnYigxOSwxOSwyNik7c3Ryb2tlLXdpZHRoOjMycHg7c3Ryb2tlLWxpbmVqb2luOnJvdW5kOyIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxjaXJjbGUgY3g9IjU0NSIgY3k9IjE4NCIgcj0iMjQiIHN0eWxlPSJmaWxsOnVybCgjX1JhZGlhbDMpOyIvPgogICAgPGNpcmNsZSBjeD0iNTQ1IiBjeT0iMTg0IiByPSIxMiIgc3R5bGU9ImZpbGw6d2hpdGU7Ii8+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Il9MaW5lYXIxIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoNDQwLDM5MCwtMzkwLDQ0MCwzNDAsMzMwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMTM5LDkyLDI0Nik7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjAuNTUiIHN0eWxlPSJzdG9wLWNvbG9yOnJnYig5OSwxMDIsMjQxKTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDU5LDEzMCwyNDYpO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Il9MaW5lYXIyIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoNDQwLDM5MCwtMzkwLDQ0MCwzNDAsMzMwKSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMTM5LDkyLDI0Nik7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjAuNTUiIHN0eWxlPSJzdG9wLWNvbG9yOnJnYig5OSwxMDIsMjQxKTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDU5LDEzMCwyNDYpO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9Il9SYWRpYWwzIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDI0LDAsMCwyNCw1NDUsMTg0KSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjpyZ2IoMTM5LDkyLDI0Nik7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjAuNTUiIHN0eWxlPSJzdG9wLWNvbG9yOnJnYig5OSwxMDIsMjQxKTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDU5LDEzMCwyNDYpO3N0b3Atb3BhY2l0eToxIi8+PC9yYWRpYWxHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+Cg=="}.entries)
      e.key: base64Decode(e.value as String),
  };

  testWidgets(
    'yoclip render mp4',
    (tester) async {
      if (outputPath == null) return;
      const projectPath = '/Users/Uladzimir_Klyshevich/git/yoclip/packages/yoclip_cli/../../samples/yoclip_about';

      final storage = LocalFileSystemStorage(projectPath);
      final project = await YoclipProject.load(storage, projectPath);

      final runtime = YoclipQuickJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);

      final scenes = await loadYoclipProjectScenes(runtime, project, storage);

      final audioTracks = await YoclipV2AudioResolver(storage).resolveAll(
        project,
        scenes,
        externalAudioFiles: {},
      );
      final audioSpecs = await YoclipV2AudioResolver(storage).toEncoderSpecs(audioTracks);
      final encoderAudioSpecs = audioSpecs
          .map(
            (s) => encoder_lib.YoclipAudioTrackSpec(
              source: s.source,
              volume: s.volume,
              startFrame: s.startFrame,
            ),
          )
          .toList();

      final adjustedProject = YoclipProject(
        rootPath: project.rootPath,
        config: YoclipProjectConfig(
          duration: 900,
          fps: 30,
          width: 1920,
          height: 1080,
          background: project.config.background,
          theme: project.config.theme,
          overlay: project.config.overlay,
        ),
        externalAssets: project.externalAssets,
        scenePaths: project.scenePaths,
        pluginPaths: project.pluginPaths,
      );

      final renderer = YoclipV2Renderer(
        project: adjustedProject,
        scenes: scenes,
        storage: storage,
        externalFiles: {"logo":"/Users/Uladzimir_Klyshevich/git/yoclip/samples/yoclip_about/.yoclip_cache/external/logo/yoclip_logo.svg"},
        externalFrameDirs: {},
        externalImageBytes: externalImageBytes,
      );

      final encoder = encoder_lib.YoclipEncoderTool(
        outputPath: outputPath,
        width: 1920,
        height: 1080,
        fps: 30,
        audioTracks: encoderAudioSpecs,
      );

      await tester.runAsync(encoder.start);
      await renderer.renderToRgba(tester, (frame, rgba) async {
        await tester.runAsync(() => encoder.appendFrame(Uint8List.fromList(rgba)));
      });
      await tester.runAsync(encoder.finish);

      final outputFile = File(outputPath);
      expect(outputFile.existsSync(), isTrue);
      expect(outputFile.lengthSync(), greaterThan(1000));
    },
    skip: outputPath == null,
  );
}
