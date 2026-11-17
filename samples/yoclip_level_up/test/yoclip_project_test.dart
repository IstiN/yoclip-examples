import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:yoclip_core/yoclip_core.dart';

void main() {
  test('102-second boss fight loads and every round renders deterministically', () async {
    final path = Directory.current.path;
    final storage = LocalFileSystemStorage(path);
    final project = await YoclipProject.load(storage, path);
    expect(project.config.duration, 3060);
    expect(project.config.fps, 30);
    expect(project.config.width, 1920);
    expect(project.config.height, 1080);
    final runtime = createYoclipJsRuntime();
    await runtime.init();
    addTearDown(runtime.dispose);
    final scenes = await loadYoclipProjectScenes(runtime, project, storage);
    expect(scenes, hasLength(2));
    final film = scenes.singleWhere((scene) => scene.id == 'film');
    final three = scenes.singleWhere((scene) => scene.id == 'three_world');
    expect(film.duration, 3060);
    expect(three.duration, 3060);
    for (final beat in <int>[8, 42, 78, 106, 136, 171, 184, 202]) {
      final frame = (beat * 60 / 140 * 30).round();
      final first = film.render(frame);
      expect(jsonEncode(first), jsonEncode(film.render(frame)), reason: 'beat $beat');
      final background = three.render(frame);
      expect(background['type'], 'three_scene');
      expect(background['params'], isA<Map<String, dynamic>>());
    }
  });

  test('all 3060 frames have finite combat state and measured audio features', () async {
    final path = Directory.current.path;
    final runtime = createYoclipJsRuntime();
    await runtime.init();
    addTearDown(runtime.dispose);
    final lib = await File('$path/lib/audio_features.js').readAsString() +
        await File('$path/lib/timeline.js').readAsString() +
        await File('$path/lib/animation.js').readAsString() +
        await File('$path/lib/film.js').readAsString();
    final scene = await runtime.loadScene('''
scene = {
  id: 'level_up_audit', duration: 3060,
  render(frame) {
    var failures = [], sections = {}, maxBeat = 0;
    if (!LEVEL_AUDIO.frames || LEVEL_AUDIO.frames.length !== 3060) {
      failures.push({kind: 'audioLength', value: LEVEL_AUDIO.frames ? LEVEL_AUDIO.frames.length : -1});
    }
    for (var f = 0; f < 3060; f++) {
      var ctx = levelContext(f), values = [ctx.time, ctx.exactBeat, ctx.audio.rms,
        ctx.audio.bass, ctx.audio.mid, ctx.audio.high, ctx.audio.onset,
        ctx.playerHealth, ctx.bossHealth, ctx.impact, ctx.glitch];
      for (var vi = 0; vi < values.length; vi++) {
        if (!isFinite(values[vi]) || values[vi] < 0) failures.push({kind: 'value', frame: f, index: vi, value: values[vi]});
      }
      if (ctx.playerHealth > 1 || ctx.bossHealth > 1) failures.push({kind: 'health', frame: f});
      sections[ctx.section.id] = true;
      maxBeat = Math.max(maxBeat, ctx.beat.index);
      if (f % 15 === 0) JSON.stringify(renderLevelUp(f));
    }
    if (Object.keys(sections).length !== 8) failures.push({kind: 'sections', value: Object.keys(sections)});
    if (maxBeat !== 237) failures.push({kind: 'maxBeat', value: maxBeat});
    return {type: 'Text', text: JSON.stringify({failures: failures.slice(0, 30), sections: Object.keys(sections), maxBeat: maxBeat})};
  }
};
''', filename: 'level_up_audit.scene.js', libSource: lib);
    final result = jsonDecode(scene.render(0)['text'] as String) as Map<String, dynamic>;
    expect(result['failures'], isEmpty, reason: jsonEncode(result['failures']));
    expect(result['sections'], hasLength(8));
    expect(result['maxBeat'], 237);
  });
}
