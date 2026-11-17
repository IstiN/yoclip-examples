// LEVEL UP — combat HUD, kinetic type and deterministic post effects.
var LU_CYAN = '#16e7ff';
var LU_BLUE = '#377dff';
var LU_VIOLET = '#8b4dff';
var LU_RED = '#ff304f';
var LU_ORANGE = '#ff7a32';
var LU_YELLOW = '#ffe83d';
var LU_GREEN = '#54ff9f';
var LU_WHITE = '#f4f8ff';
var LU_MUTED = '#8391ad';

function levelPlace(node) {
  if (!node || !node.alignment) return node;
  var a = node.alignment, x = node.offsetX || 0, y = node.offsetY || 0;
  var p = {}, keep = false;
  if (a === 'topLeft') { p.left = x; p.top = y; }
  else if (a === 'topRight') { p.right = -x; p.top = y; }
  else if (a === 'bottomLeft') { p.left = x; p.bottom = -y; }
  else if (a === 'bottomRight') { p.right = -x; p.bottom = -y; }
  else if (a === 'topCenter') { p.left = 0; p.right = 0; p.top = y; keep = true; }
  else if (a === 'bottomCenter') { p.left = 0; p.right = 0; p.bottom = -y; keep = true; }
  else if (a === 'center') { p.left = 0; p.right = 0; keep = true; }
  else return node;
  var placed = {};
  for (var key in node) if (key !== 'alignment' && key !== 'offsetX' && key !== 'offsetY') placed[key] = node[key];
  if (keep) placed.alignment = a;
  placed.positioned = p;
  return placed;
}

function luRect(x, y, w, h, color, opacity) {
  return box({ width: w, height: h, color: color, opacity: opacity === undefined ? 1 : opacity, positioned: { left: x, top: y } });
}

function luLabel(text, x, y, color, size, align) {
  return txt(text, {
    font: 'Space Mono', fontSize: size || 18, color: color || LU_MUTED,
    letterSpacing: 2, textAlign: align || 'left', positioned: { left: x, top: y },
  });
}

function luHealth(ctx) {
  var out = [];
  var active = ctx.exactBeat >= 24 && ctx.section.id !== 'victory';
  if (!active) return out;
  var enter = eo3(seg(ctx.exactBeat, 24, 27));
  var y = 48 - (1 - enter) * 90;
  out.push(luLabel('YOCLIP // RENDER RUNNER', 64, y, LU_CYAN, 18));
  out.push(luLabel('CAPCUT // TEMPLATE TITAN', 1320, y, LU_RED, 18));
  out.push(luRect(64, y + 35, 552, 24, '#33162932', 0.95));
  out.push(luRect(1304, y + 35, 552, 24, '#33162932', 0.95));
  out.push(luRect(68, y + 39, 544 * ctx.playerHealth, 16, LU_CYAN, 0.9));
  out.push(luRect(1308 + 544 * (1 - ctx.bossHealth), y + 39, 544 * ctx.bossHealth, 16, ctx.bossHealth < 0.25 ? LU_ORANGE : LU_RED, 0.95));
  for (var i = 1; i < 10; i++) {
    out.push(luRect(68 + i * 54.4, y + 39, 2, 16, '#02030a', 0.6));
    out.push(luRect(1308 + i * 54.4, y + 39, 2, 16, '#02030a', 0.6));
  }
  out.push(luLabel(Math.ceil(ctx.playerHealth * 100) + '%', 64, y + 66, LU_WHITE, 14));
  out.push(luLabel(Math.ceil(ctx.bossHealth * 100) + '%', 1796, y + 66, LU_WHITE, 14));
  out.push(txt(ctx.section.round, {
    font: 'Space Mono Bold', fontSize: 19, color: ctx.section.accent,
    letterSpacing: 4, alignment: 'topCenter', offsetY: y + 3,
    shadows: [{ color: alphaColor(ctx.section.accent, 0.65), blur: 18 }],
  }));
  out.push(txt('140 BPM  /  30 FPS  /  GPU LINK', {
    font: 'Space Mono', fontSize: 13, color: LU_MUTED,
    letterSpacing: 2, alignment: 'topCenter', offsetY: y + 36,
  }));
  return out;
}

function luAudioTelemetry(ctx) {
  var out = [];
  out.push(luLabel('MASTER // AUDIO REACTIVE', 64, 934, LU_CYAN, 14));
  var values = [ctx.audio.bass, ctx.audio.rms, ctx.audio.mid, ctx.audio.high];
  for (var i = 0; i < 24; i++) {
    var wave = 0.22 + 0.78 * Math.abs(Math.sin(i * 1.71 + ctx.exactBeat * 0.63));
    var value = values[i % values.length];
    var h = 8 + 70 * clamp(value * (0.55 + wave * 0.75), 0, 1);
    var color = i % 4 === 0 ? LU_VIOLET : (i % 3 === 0 ? LU_RED : LU_CYAN);
    out.push(luRect(64 + i * 16, 1010 - h, 9, h, color, 0.55 + value * 0.45));
  }
  out.push(luLabel('BASS ' + Math.round(ctx.audio.bass * 99) + '  /  ONSET ' + Math.round(ctx.audio.onset * 99), 64, 1020, LU_MUTED, 12));
  out.push(luLabel('FRAME ' + pad(ctx.frame, 4) + '  //  BEAT ' + pad(ctx.beat.index + 1, 3), 1510, 978, LU_MUTED, 14));
  out.push(luLabel('SCORE ' + pad(Math.floor(ctx.exactBeat * 137 + ctx.sectionIndex * 5000), 8), 1450, 1010, LU_YELLOW, 18));
  return out;
}

function luSectionRail(ctx) {
  var out = [];
  var x = 610, y = 1000, w = 700;
  out.push(luRect(x, y, w, 3, '#253149', 0.8));
  for (var i = 0; i < LEVEL_SECTIONS.length; i++) {
    var s = LEVEL_SECTIONS[i];
    var sx = x + w * s.startBeat / LEVEL_BEATS;
    var ex = x + w * s.endBeat / LEVEL_BEATS;
    out.push(luRect(sx, y - (i === ctx.sectionIndex ? 4 : 0), Math.max(3, ex - sx - 3), i === ctx.sectionIndex ? 11 : 3, i < ctx.sectionIndex ? LU_CYAN : s.accent, i === ctx.sectionIndex ? 1 : 0.45));
  }
  var px = x + w * clamp(ctx.exactBeat / LEVEL_BEATS, 0, 1);
  out.push(luRect(px - 2, y - 12, 4, 28, LU_WHITE, 0.95));
  return out;
}

function luCue(ctx) {
  var cue = ctx.cue;
  if (!cue) return [];
  var local = ctx.exactBeat - cue.beat;
  if (local < 0 || local > cue.length) return [];
  var enter = eoBack(seg(local, 0, 0.8));
  var exit = 1 - eo3(seg(local, cue.length - 0.8, cue.length));
  var opacity = clamp(seg(local, 0, 0.35) * exit, 0, 1);
  var scale = (0.72 + 0.28 * enter) * (1 + ctx.impact * 0.035);
  var style = cue.style;
  var color = style === 'red' || style === 'impact' ? LU_RED : (style === 'pac' ? LU_YELLOW : (style === 'victory' ? LU_GREEN : (style === 'cyan' ? LU_CYAN : LU_WHITE)));
  var size = style === 'ko' ? 350 : (style === 'impact' ? 205 : (style === 'hero' || style === 'victory' ? 190 : 155));
  var centerY = style === 'ko' ? 470 : 445;
  var out = [];
  if (ctx.section.id === 'versus' && (style === 'cyan' || style === 'red')) {
    var align = style === 'red' ? 'bottomRight' : 'bottomLeft';
    var ox = style === 'red' ? -96 : 96;
    return [
      box({ width: 800, height: 218, alignment: align, offsetX: style === 'red' ? -72 : 72, offsetY: -96, color: '#df050710', borderColor: color, borderWidth: 2, borderRadius: 3, opacity: opacity }),
      txt(cue.kicker, { font: 'Space Mono Bold', fontSize: 21, color: color, letterSpacing: 5, alignment: align, offsetX: ox, offsetY: -286, opacity: opacity }),
      txt(cue.text, { font: 'Anton', fontSize: cue.text.length > 9 ? 76 : 102, color: color, alignment: align, offsetX: ox, offsetY: -206, opacity: opacity, scale: scale, shadows: [{ color: alphaColor(color, 0.7), blur: 24 }] }),
      txt(cue.sub, { font: 'Space Mono Bold', fontSize: 22, color: LU_WHITE, letterSpacing: 3, alignment: align, offsetX: ox, offsetY: -126, opacity: opacity }),
    ];
  }
  if (style === 'pac') {
    return [
      box({ width: 920, height: 200, alignment: 'bottomCenter', offsetY: -108, color: '#df050710', borderColor: color, borderWidth: 1, borderRadius: 4, opacity: opacity }),
      txt(cue.kicker, { font: 'Space Mono Bold', fontSize: 20, color: color, letterSpacing: 4, alignment: 'bottomCenter', offsetY: -272, opacity: opacity }),
      txt(cue.text, { font: 'Anton', fontSize: 92, color: color, alignment: 'bottomCenter', offsetY: -196, opacity: opacity, scale: scale, shadows: [{ color: alphaColor(color, 0.65), blur: 22 }] }),
      txt(cue.sub, { font: 'Space Mono Bold', fontSize: 20, color: LU_WHITE, letterSpacing: 3, alignment: 'bottomCenter', offsetY: -130, opacity: opacity }),
    ];
  }
  out.push(box({ width: 1500, height: 310, alignment: 'center', offsetY: -70, color: '#b8050710', borderColor: alphaColor(color, 0.45), borderWidth: 1, borderRadius: 8, opacity: opacity * 0.9 }));
  out.push(txt(cue.kicker, {
    font: 'Space Mono Bold', fontSize: 23, color: color, letterSpacing: 7,
    alignment: 'topCenter', offsetY: 238, opacity: opacity,
    shadows: [{ color: alphaColor(color, 0.65), blur: 20 }],
  }));
  out.push(txt(cue.text, {
    font: 'Anton', fontSize: size, color: color, textAlign: 'center',
    alignment: 'center', offsetY: centerY - 540, opacity: opacity, scale: scale,
    shadows: [
      { color: alphaColor(color, 0.8), blur: style === 'ko' ? 55 : 35, offsetY: 8 },
      { color: '#cc02030a', blur: 4, offsetX: 8, offsetY: 12 },
    ],
  }));
  out.push(txt(cue.sub, {
    font: 'Space Mono Bold', fontSize: 22, color: LU_WHITE, letterSpacing: 4,
    alignment: 'topCenter', offsetY: 730, opacity: opacity * 0.92,
  }));
  // Split-color ghost passes create a short RGB impact without bitmap effects.
  if (ctx.glitch > 0.25 && local < 1.3) {
    out.push(txt(cue.text, {
      font: 'Anton', fontSize: size, color: alphaColor(LU_CYAN, 0.38), textAlign: 'center',
      alignment: 'center', offsetX: -10 * ctx.glitch, offsetY: centerY - 540 + 3,
      opacity: opacity * 0.5, scale: scale,
    }));
    out.push(txt(cue.text, {
      font: 'Anton', fontSize: size, color: alphaColor(LU_RED, 0.35), textAlign: 'center',
      alignment: 'center', offsetX: 12 * ctx.glitch, offsetY: centerY - 540 - 3,
      opacity: opacity * 0.5, scale: scale,
    }));
  }
  return out;
}

function luCombatCallouts(ctx) {
  var out = [];
  if (ctx.section.id === 'duel' || ctx.section.id === 'showdown') {
    var phase = (ctx.time * 140 / 60 / 4) % 1;
    var label = phase >= 0.42 && phase < 0.76 ? 'PARRY +11' : (phase >= 0.76 || phase < 0.08 ? 'COUNTER -64' : 'INCOMING');
    if (ctx.section.id === 'showdown') label = ctx.finisher > 0.58 ? 'RENDER BREAK' : (ctx.finisher > 0.35 ? 'DASH COUNTER' : 'BOSS CHARGE');
    var combo = Math.max(1, Math.floor((ctx.exactBeat - ctx.section.startBeat) / 4) + 1);
    out.push(txt(label, {
      font: 'Anton', fontSize: 58, color: label === 'INCOMING' || label === 'BOSS CHARGE' ? LU_RED : LU_CYAN,
      alignment: 'topRight', offsetX: -82, offsetY: 210,
      rotation: -0.06, opacity: 0.92,
    }));
    out.push(txt('x' + pad(combo, 2), {
      font: 'Anton', fontSize: 92, color: LU_YELLOW,
      alignment: 'topLeft', offsetX: 76, offsetY: 220,
      shadows: [{ color: '#aaff7a32', blur: 24 }],
    }));
    out.push(luLabel('HIT COMBO', 82, 326, LU_YELLOW, 16));
  }
  if (ctx.section.id === 'overclock') {
    out.push(txt(ctx.section.progress < 0.45 ? 'CITY COLLAPSE // FIGHTER DISASSEMBLY' : 'YOCLIP RECOMPILE → PAC-FORM', {
      font: 'Space Mono Bold', fontSize: 26, color: ctx.section.progress < 0.45 ? LU_CYAN : LU_YELLOW,
      alignment: 'topCenter', offsetY: 158, letterSpacing: 3,
    }));
  }
  if (ctx.section.id === 'chase') {
    out.push(txt('PELLETS ' + pad(Math.floor((ctx.exactBeat - 116) * 4), 3), {
      font: 'Space Mono Bold', fontSize: 24, color: LU_YELLOW,
      alignment: 'topCenter', offsetY: 142,
    }));
    out.push(txt('YOCLIP // PAC-FORM', {
      font: 'Anton', fontSize: 42, color: LU_CYAN,
      alignment: 'topLeft', offsetX: 74, offsetY: 184,
    }));
  }
  if (ctx.section.id === 'showdown' && ctx.finisher > 0.15) {
    out.push(box({
      width: 580, height: 68, alignment: 'bottomCenter', offsetY: -164,
      color: '#d9080710', borderColor: LU_RED, borderWidth: 2, borderRadius: 8,
      child: txt('Y + B  //  RENDER BREAKER', { font: 'Space Mono Bold', fontSize: 23, color: LU_WHITE, letterSpacing: 3 }),
      opacity: 0.65 + ctx.beat.pulse * 0.35,
    }));
  }
  return out;
}

function luGlitch(ctx) {
  var out = [];
  if (ctx.glitch < 0.12) return out;
  for (var i = 0; i < 7; i++) {
    var seed = Math.abs(Math.sin((ctx.frame + i * 97) * 12.9898) * 43758.5453) % 1;
    var y = Math.floor(seed * 1080);
    var h = 2 + (i % 3) * 3;
    var w = 180 + ((i * 271 + ctx.frame * 17) % 1100);
    var x = (i * 337 + ctx.frame * 11) % 1920;
    out.push(luRect(x - 200, y, w, h, i % 2 ? LU_CYAN : LU_RED, ctx.glitch * 0.24));
  }
  return out;
}

function luVignetteAndScanlines(ctx) {
  var out = [];
  out.push(box({
    width: 1920, height: 1080, positioned: { left: 0, top: 0 },
    gradient: { type: 'radial', colors: ['#00000000', '#00000000', '#ad010208'], stops: [0, 0.56, 1], center: 'center', radius: 0.78 },
  }));
  for (var y = 0; y < 1080; y += 12) out.push(luRect(0, y, 1920, 1, '#8ad7ff', 0.025));
  var flash = clamp(ctx.impact * (0.035 + ctx.audio.bass * 0.09), 0, 0.13);
  out.push(luRect(0, 0, 1920, 1080, ctx.section.id === 'duel' || ctx.section.id === 'showdown' ? LU_RED : LU_CYAN, flash));
  return out;
}

function luBoot(ctx) {
  if (ctx.section.id !== 'boot') return [];
  var out = [];
  var lines = ['> MOUNT /DEV/NEON_ARENA', '> LINK FLUTTER_GPU .......... [OK]', '> LOAD YOCLIP_FIGHTER ....... [OK]', '> ARM 140_BPM_CLOCK ........ [OK]'];
  for (var i = 0; i < lines.length; i++) {
    out.push(luLabel(lines[i], 76, 166 + i * 34, i === 3 ? LU_YELLOW : LU_CYAN, 17));
  }
  out.push(luLabel('BUILD 140.238 // ARCADE KERNEL', 76, 324, LU_MUTED, 13));
  return out;
}

function luVictory(ctx) {
  if (ctx.section.id !== 'victory') return [];
  var out = [];
  var enter = eoBack(seg(ctx.sectionProgress, 0, 0.18));
  out.push(imageNode(yoclipLogoSource(), {
    width: 190, height: 100, alignment: 'topCenter', offsetY: 142,
    opacity: enter, scale: enter,
  }));
  out.push(txt('S', {
    font: 'Anton', fontSize: 138, color: LU_YELLOW, alignment: 'topRight',
    offsetX: -94, offsetY: 180, rotation: 0.08, opacity: enter,
    shadows: [{ color: '#99ffe83d', blur: 30 }],
  }));
  out.push(luLabel('RANK', 1612, 330, LU_YELLOW, 17));
  out.push(txt('238 BEATS → ONE WINNER', {
    font: 'Space Mono Bold', fontSize: 19, color: LU_MUTED,
    alignment: 'bottomCenter', offsetY: -70, opacity: enter,
  }));
  return out;
}

function luVocalCaption(ctx) {
  if (typeof LEVEL_VOCAL_EVENTS === 'undefined') return [];
  for (var i = 0; i < LEVEL_VOCAL_EVENTS.length; i++) {
    var event = LEVEL_VOCAL_EVENTS[i];
    if (ctx.time < event.start || ctx.time > event.end) continue;
    var opacity = clamp(Math.min((ctx.time - event.start) * 8, (event.end - ctx.time) * 8), 0, 1);
    return [box({
      width: 720, height: 46, alignment: 'bottomCenter', offsetY: -122,
      color: '#d902030a', borderColor: alphaColor(event.color || LU_CYAN, 0.45),
      borderWidth: 1, borderRadius: 8, opacity: opacity * 0.94,
      child: txt('ANNOUNCER  //  "' + event.text + '"', {
        font: 'Space Mono Bold', fontSize: 18, color: event.color || LU_WHITE,
        letterSpacing: 2, textAlign: 'center',
      }),
    })];
  }
  return [];
}

function renderLevelUp(frame) {
  var ctx = levelContext(frame);
  var children = [];
  children = children.concat(luVignetteAndScanlines(ctx));
  children = children.concat(luBoot(ctx));
  children = children.concat(luHealth(ctx));
  children = children.concat(luCombatCallouts(ctx));
  children = children.concat(luCue(ctx));
  children = children.concat(luVocalCaption(ctx));
  children = children.concat(luAudioTelemetry(ctx));
  children = children.concat(luSectionRail(ctx));
  children = children.concat(luVictory(ctx));
  children = children.concat(luGlitch(ctx));
  children.push(luRect(0, 0, 1920, 3, ctx.section.accent, 0.5 + ctx.impact * 0.5));
  children.push(luRect(0, 1077, 1920, 3, ctx.section.accent, 0.25));
  return stack(children, { fit: 'expand' });
}
