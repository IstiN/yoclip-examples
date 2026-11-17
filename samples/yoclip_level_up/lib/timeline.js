// LEVEL UP master clock. Seconds are derived from the measured 140 BPM grid;
// every value is a pure function of the composition frame.
var LEVEL_FPS = 30;
var LEVEL_DURATION = 3060;
var LEVEL_SECONDS = 102;
var LEVEL_BPM = 140;
var LEVEL_BEATS = 238;

// Provisional musical map in beats; aligned with analysis/audio_events.json.
var LEVEL_SECTIONS = [
  { id: 'boot', startBeat: 0, endBeat: 24, round: 'SYSTEM BOOT', accent: '#16e7ff' },
  { id: 'versus', startBeat: 24, endBeat: 60, round: 'ROUND 01', accent: '#a77bff' },
  { id: 'duel', startBeat: 60, endBeat: 96, round: 'NEON DUEL', accent: '#ff304f' },
  { id: 'overclock', startBeat: 96, endBeat: 116, round: 'OVERCLOCK', accent: '#ffe83d' },
  { id: 'chase', startBeat: 116, endBeat: 160, round: 'PAC-MODE', accent: '#ffe83d' },
  { id: 'showdown', startBeat: 160, endBeat: 182, round: 'FINAL SHOWDOWN', accent: '#ff304f' },
  { id: 'ko', startBeat: 182, endBeat: 186, round: 'K.O.', accent: '#ffffff' },
  { id: 'victory', startBeat: 186, endBeat: 238, round: 'VICTORY', accent: '#54ff9f' },
];

var LEVEL_TITLE_CUES = [
  { beat: 1, length: 7, kicker: 'INSERT COIN', text: 'LEVEL UP!', sub: 'A YOCLIP ARCADE EVENT', style: 'hero' },
  { beat: 22.1, length: 5, kicker: 'SYSTEM LOADING', text: 'SYSTEM ONLINE', sub: 'FLUTTER GPU // LINKED', style: 'cyan' },
  { beat: 28.8, length: 7, kicker: 'CHALLENGER 01', text: 'YOCLIP', sub: 'CODE-FORGED // GPU-POWERED', style: 'cyan' },
  { beat: 40.1, length: 7, kicker: 'CHALLENGER 02', text: 'CAPCUT', sub: 'TEMPLATE TITAN', style: 'red' },
  { beat: 59.7, length: 3, kicker: 'ROUND 01', text: 'READY?', sub: 'NO TEMPLATES. NO MERCY.', style: 'hero' },
  { beat: 62.8, length: 5, kicker: 'SYSTEM ARMED', text: 'FIGHT!', sub: 'COMPILE THE IMPOSSIBLE', style: 'impact' },
  { beat: 72, length: 4, kicker: 'COUNTER', text: 'DODGE!', sub: '+1 SCENE GRAPH SHIELD', style: 'cyan' },
  { beat: 84, length: 4, kicker: 'COMBO x08', text: 'COMPILE!', sub: 'NATIVE GPU COUNTERATTACK', style: 'cyan' },
  { beat: 95.2, length: 7, kicker: 'WAKA PROTOCOL', text: 'OVERCLOCK', sub: 'ARCADE ENGINE UNLOCKED', style: 'pac' },
  { beat: 104, length: 7, kicker: 'FORM CHANGE', text: 'PAC-MODE', sub: 'WAKA ENGINE // ONLINE', style: 'pac' },
  { beat: 120, length: 5, kicker: 'PELLET COMBO', text: 'WAKA!', sub: 'CHASE THE DROP', style: 'pac' },
  { beat: 144, length: 5, kicker: 'GHOST COMBO x16', text: 'CHOMP!', sub: 'TEMPLATE CACHE DELETED', style: 'pac' },
  { beat: 160, length: 5, kicker: 'FINAL ROUND', text: 'SHOWDOWN', sub: 'ONE FRAME. ONE WINNER.', style: 'impact' },
  { beat: 172, length: 1.2, kicker: 'BOSS HP // CRITICAL', text: 'FINISH!', sub: 'RELEASE THE RENDER', style: 'impact' },
  { beat: 181.7, length: 1.6, kicker: 'GAME OVER', text: 'K.O.', sub: 'CAPCUT CORE DISINTEGRATED', style: 'ko' },
  { beat: 183.4, length: 3.2, kicker: 'FLAWLESS VICTORY', text: 'YOCLIP WINS', sub: 'THE ARENA IS YOURS', style: 'hero' },
  { beat: 187, length: 7, kicker: 'NEW RANK UNLOCKED', text: 'LEVEL UP!', sub: 'RENDER THE IMPOSSIBLE', style: 'victory' },
  { beat: 202, length: 7, kicker: 'ARENA CHAMPION', text: 'RANK S', sub: 'NATIVE GPU // NO TEMPLATES', style: 'victory' },
  { beat: 218, length: 7, kicker: 'YOCLIP', text: 'PLAY AGAIN?', sub: 'PRESS START TO RENDER', style: 'cyan' },
  { beat: 230, length: 8, kicker: 'VICTORY SOUND', text: 'LEVEL UP!', sub: 'YOCLIP // RENDER THE IMPOSSIBLE', style: 'victory' },
];

function levelSectionAtBeat(beat) {
  for (var i = LEVEL_SECTIONS.length - 1; i >= 0; i--) {
    if (beat >= LEVEL_SECTIONS[i].startBeat) return i;
  }
  return 0;
}

function levelCueAtBeat(beat) {
  for (var i = 0; i < LEVEL_TITLE_CUES.length; i++) {
    var cue = LEVEL_TITLE_CUES[i];
    if (beat >= cue.beat && beat < cue.beat + cue.length) return cue;
  }
  return null;
}

function levelAudioAt(frame) {
  var empty = { rms: 0, bass: 0, mid: 0, high: 0, onset: 0 };
  if (typeof LEVEL_AUDIO === 'undefined' || !LEVEL_AUDIO) return empty;
  if (LEVEL_AUDIO.frames && LEVEL_AUDIO.frames.length) {
    var item = LEVEL_AUDIO.frames[Math.max(0, Math.min(LEVEL_AUDIO.frames.length - 1, frame))];
    return {
      rms: item.rms || 0, bass: item.bass || 0, mid: item.mid || 0,
      high: item.high || 0, onset: item.onset || item.onsetStrength || 0,
    };
  }
  function read(key) {
    var values = LEVEL_AUDIO[key];
    return values && values.length ? values[Math.max(0, Math.min(values.length - 1, frame))] || 0 : 0;
  }
  return {
    rms: read('rms'), bass: read('bass'), mid: read('mid'), high: read('high'),
    onset: read('onset') || read('onsetStrength'),
  };
}

function levelExactBeatAt(time) {
  if (typeof LEVEL_BEAT_TIMES === 'undefined' || !LEVEL_BEAT_TIMES.length) return time * LEVEL_BPM / 60;
  if (time <= LEVEL_BEAT_TIMES[0]) return 0;
  var last = LEVEL_BEAT_TIMES.length - 1;
  if (time >= LEVEL_BEAT_TIMES[last]) return last + (time - LEVEL_BEAT_TIMES[last]) * LEVEL_BPM / 60;
  var lo = 0, hi = last;
  while (lo + 1 < hi) {
    var mid = Math.floor((lo + hi) / 2);
    if (LEVEL_BEAT_TIMES[mid] <= time) lo = mid; else hi = mid;
  }
  return lo + (time - LEVEL_BEAT_TIMES[lo]) / (LEVEL_BEAT_TIMES[hi] - LEVEL_BEAT_TIMES[lo]);
}

var _levelContextFrame = -1;
var _levelContextValue = null;
function levelContext(frame) {
  if (frame === _levelContextFrame && _levelContextValue) return _levelContextValue;
  var time = frame / LEVEL_FPS;
  var exactBeat = levelExactBeatAt(time);
  var beatIndex = Math.max(0, Math.min(LEVEL_BEATS - 1, Math.floor(exactBeat)));
  var beatPhase = exactBeat - Math.floor(exactBeat);
  var sectionIndex = levelSectionAtBeat(exactBeat);
  var section = LEVEL_SECTIONS[sectionIndex];
  var sectionProgress = clamp((exactBeat - section.startBeat) / (section.endBeat - section.startBeat), 0, 1);
  var audio = levelAudioAt(frame);
  var downbeat = beatIndex % 4 === 0;
  var impact = downbeat ? Math.exp(-beatPhase * 8) : 0;
  if (beatIndex === section.startBeat) impact = Math.max(impact, Math.exp(-beatPhase * 5));
  var attack = 0;
  if (section.id === 'duel') attack = Math.max(0, Math.sin(exactBeat * Math.PI / 4)) * (0.35 + audio.bass * 0.65);
  if (section.id === 'showdown') attack = 0.45 + 0.55 * Math.max(0, Math.sin(exactBeat * Math.PI / 2));
  var chomp = section.id === 'chase' || section.id === 'overclock' ? (0.5 + 0.5 * Math.sin(exactBeat * Math.PI * 2)) : 0;
  var finisher = section.id === 'showdown' ? clamp((sectionProgress - 0.58) / 0.3, 0, 1) : (section.id === 'ko' ? 1 : 0);
  var bossHealth = 1;
  if (section.id === 'duel') bossHealth = lerp(1, 0.58, sectionProgress);
  else if (section.id === 'overclock') bossHealth = 0.58;
  else if (section.id === 'chase') bossHealth = lerp(0.58, 0.2, sectionProgress);
  else if (section.id === 'showdown') bossHealth = lerp(0.2, 0, Math.pow(sectionProgress, 1.7));
  else if (section.id === 'ko' || section.id === 'victory') bossHealth = 0;
  var playerHealth = section.id === 'duel' ? lerp(1, 0.74, sectionProgress) : (section.id === 'showdown' ? lerp(0.74, 0.9, sectionProgress) : 1);
  var glitch = clamp(audio.high * 0.32 + audio.onset * 0.8, 0, 1);
  if (beatIndex === section.startBeat || (section.id === 'overclock' && beatIndex % 2 === 0)) glitch = Math.max(glitch, Math.exp(-beatPhase * 10));
  var cameraShot = section.id;
  if (section.id === 'duel') cameraShot = ['duelWide', 'duelSide', 'duelOrbit'][Math.floor(beatIndex / 8) % 3];
  if (section.id === 'chase') cameraShot = beatIndex % 32 < 20 ? 'mazeFollow' : 'mazeTop';
  _levelContextFrame = frame;
  _levelContextValue = {
    frame: frame, time: time, exactBeat: exactBeat,
    beat: { index: beatIndex, phase: beatPhase, pulse: Math.exp(-beatPhase * 6), bar: Math.floor(beatIndex / 4), downbeat: downbeat },
    section: section, sectionIndex: sectionIndex, sectionProgress: sectionProgress,
    audio: audio, impact: impact, attack: attack, chomp: chomp, finisher: finisher,
    bossHealth: bossHealth, playerHealth: playerHealth, glitch: glitch,
    cameraShot: cameraShot, cue: levelCueAtBeat(exactBeat),
  };
  return _levelContextValue;
}
