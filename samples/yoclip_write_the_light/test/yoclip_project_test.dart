import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  test(
    '200.72-second film loads and every act renders deterministically',
    () async {
      final path = Directory.current.path;
      final storage = LocalFileSystemStorage(path);
      final project = await YoclipProject.load(storage, path);
      expect(project.config.duration, 6022);
      expect(project.config.fps, 30);
      expect(project.config.width, 1920);
      expect(project.config.height, 1080);
      final runtime = createYoclipJsRuntime();
      await runtime.init();
      addTearDown(runtime.dispose);
      final scenes = await loadYoclipProjectScenes(runtime, project, storage);
      expect(scenes, hasLength(2));
      expect(
        scenes.singleWhere((scene) => scene.id == 'three_world').duration,
        6022,
      );
      final film = scenes.singleWhere((scene) => scene.id == 'film');
      expect(film.duration, 6022);
      const actMidpoints = <double>[
        3.6,
        11.9,
        23.3,
        35.7,
        47.4,
        63.6,
        78.4,
        88.6,
        98.3,
        107.3,
        120.8,
        134.9,
        145.1,
        152.9,
        167.9,
        184.9,
        192.3,
        197.7,
      ];
      for (final seconds in actMidpoints) {
        final frame = (seconds * 30).round();
        final first = film.render(frame);
        final second = film.render(frame);
        expect(first, isA<Map<String, dynamic>>(), reason: '$seconds seconds');
        expect(
          jsonEncode(first),
          jsonEncode(second),
          reason: 'non-deterministic act at $seconds',
        );
        final three = scenes
            .singleWhere((scene) => scene.id == 'three_world')
            .render(frame);
        expect(three['type'], 'three_scene');
        expect(three['params'], isA<Map<String, dynamic>>());
      }
    },
  );

  test('every measured word is selectable at its own onset', () async {
    final path = Directory.current.path;
    final runtime = createYoclipJsRuntime();
    await runtime.init();
    addTearDown(runtime.dispose);
    final timeline = await File('$path/lib/timeline.js').readAsString();
    final timings = await File('$path/lib/word_timings.js').readAsString();
    final scene = await runtime.loadScene(
      '''
scene = {
  id: 'word_timing_audit', duration: 6022,
  render(frame) {
    var failures = [], count = 0;
    for (var li = 0; li < LYRIC_CUES.length; li++) {
      var cue = LYRIC_CUES[li];
      for (var wi = 0; wi < cue.words.length; wi++) {
        var expected = cue.words[wi], probe = Math.ceil(expected.t * FILM_FPS) / FILM_FPS + 0.0001;
        var lyric = lyricAtSeconds(probe, probe), actual = activeWord(lyric, probe);
        count++;
        if (!lyric || lyric.text !== cue.text || !actual || actual.wordIndex !== wi) {
          failures.push({line: li, word: wi, text: expected.text, t: expected.t,
            selectedLine: lyric ? lyric.text : null, selectedWord: actual ? actual.text : null});
        }
      }
    }
    return {type: 'Text', text: JSON.stringify({count: count, failures: failures, lead: KARAOKE_VISUAL_LEAD})};
  }
};
''',
      filename: 'word_timing_audit.scene.js',
      libSource: '$timeline\n$timings',
    );
    final result =
        jsonDecode(scene.render(0)['text'] as String) as Map<String, dynamic>;
    expect(result['count'], 399);
    expect(result['lead'], 0);
    expect(result['failures'], isEmpty, reason: jsonEncode(result['failures']));
  });
}
