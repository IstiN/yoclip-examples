// WRITE THE LIGHT — narrative scenes and kinetic typography.
// All positions are 1920×1080 design pixels; all motion is master-frame pure.

var PAPER = '#f1efe8';
var WHITE = '#f8f7ff';
var INK = '#0a0a0d';
var ORANGE = '#ff5a36';
var VIOLET = '#7c3aed';
var LILAC = '#a78bfa';
var CYAN = '#22d3ee';
var LIME = '#c7f464';
var ACTIVE_FILM_CONTEXT = null;

function rootPlace(node) {
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
function fullColor(color) {
  return box({ width: 1920, height: 1080, color: color, positioned: { left: 0, top: 0 } });
}
function filmRoot(children, mode) {
  var all = [], ctx = ACTIVE_FILM_CONTEXT;
  if (mode === 'paper') all.push(fullColor(PAPER));
  if (mode === 'black' || mode === 'staticBlack') all.push(fullColor('#020204'));
  for (var i = 0; i < children.length; i++) all.push(rootPlace(children[i]));
  if (mode === 'fixed' || mode === 'staticBlack') return stack(all, { fit: 'expand' });
  var zoom = 1, offsetX = 0, offsetY = 0, focusPush = 0;
  if (ctx) {
    var entrance = cueEnter(ctx, 0.3);
    focusPush = focusPushForContext(ctx);
    var longFocusLine = ctx.lyric && ctx.lyric.text.length > 35;
    zoom = (mode === 'paper' ? 1.035 : 1.05) + (1 - entrance) * 0.065 + focusPush * (0.075 - (longFocusLine ? 0.045 : 0));
    if (!ctx.lyric) zoom = 1 + ctx.progress * (ctx.act.name === 'riser' ? 0.14 : 0.035);
    if (ctx.word) zoom += Math.exp(-ctx.wordProgress * 5) * 0.018;
    if (ctx.focusSet) {
      var maxX = mode === 'paper' ? Math.max(0, (zoom - 1) * 960 - 4) : 85;
      var maxY = mode === 'paper' ? Math.max(0, (zoom - 1) * 540 - 4) : 60;
      offsetX = clamp((960 - ctx.focusX) * (zoom - 1) * 0.9, -maxX, maxX);
      offsetY = clamp((540 - ctx.focusY) * (zoom - 1) * 0.9, -maxY, maxY);
    }
    offsetX += Math.sin(ctx.time * 1.7) * 1.2;
    offsetY += Math.cos(ctx.time * 1.35) * 0.8;
  }
  if (focusPush > 0.01) {
    all.push(box({ width: 1920, height: 1080, positioned: { left: 0, top: 0 }, gradient: { type: 'radial', colors: ['#00000000', alphaColor(mode === 'paper' ? INK : '#000000', mode === 'paper' ? 0.24 : 0.48)] }, opacity: focusPush }));
  }
  return stack(all, { fit: 'expand', scale: zoom, offsetX: offsetX, offsetY: offsetY });
}
function display(value, o) {
  o = o || {};
  o.font = 'Anton';
  o.fontWeight = 400;
  if (o.fontSize === undefined) o.fontSize = 128;
  if (o.letterSpacing === undefined) o.letterSpacing = 0.8;
  if (o.lineHeight === undefined) o.lineHeight = 0.96;
  return txt(value, o);
}
function mono(value, o) {
  o = o || {};
  o.font = (o.fontWeight || 400) >= 600 ? 'Space Mono Bold' : 'Space Mono';
  if (o.fontSize === undefined) o.fontSize = 20;
  return txt(value, o);
}
function micro(value, o) {
  o = o || {};
  if (o.fontSize === undefined) o.fontSize = 15;
  if (o.letterSpacing === undefined) o.letterSpacing = 2.0;
  return mono(value, o);
}
function wrapText(value, maxChars) {
  var words = value.split(/\s+/), lines = [], line = '';
  for (var i = 0; i < words.length; i++) {
    var next = line ? line + ' ' + words[i] : words[i];
    if (line && next.length > maxChars) { lines.push(line); line = words[i]; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function textBlock(value, o) {
  o = o || {};
  var lines = o.lines || wrapText(value, o.maxChars || 24), children = [];
  for (var i = 0; i < lines.length; i++) {
    children.push((o.mono ? mono : display)(lines[i], {
      fontSize: o.fontSize || 128,
      color: o.color || '#ffffff',
      letterSpacing: o.letterSpacing,
      lineHeight: o.lineHeight || 0.96,
      textAlign: o.textAlign || 'left',
      margin: { top: i ? (o.lineGap === undefined ? 6 : o.lineGap) : 0 },
      shadows: o.shadows,
    }));
  }
  return column(children, {
    width: o.width, crossAxisAlignment: o.crossAxisAlignment || 'start',
    alignment: o.alignment || 'topLeft', offsetX: o.x || 0, offsetY: o.y || 0,
    opacity: o.opacity, scale: o.scale, rotation: o.rotation,
  });
}
function antonUnits(value) {
  var units = 0;
  for (var i = 0; i < value.length; i++) {
    var ch = value[i];
    if (/[IJ1.,'’!?:;]/.test(ch)) units += 0.29;
    else if (/[MW]/.test(ch)) units += 0.82;
    else units += 0.51;
  }
  return units;
}
function measureTextCamera(ctx, lines, size, o) {
  if (!ctx.word) return;
  var lineStep = size * (o.lineHeight || 0.96) + (o.lineGap === undefined ? 6 : o.lineGap);
  var totalHeight = size * (o.lineHeight || 0.96) + (lines.length - 1) * lineStep;
  var alignment = o.alignment || 'topLeft', baseY = o.y || 0;
  if (alignment === 'center') baseY = 540 - totalHeight / 2;
  else if (alignment === 'bottomCenter' || alignment === 'bottomLeft') baseY = 1080 + baseY - totalHeight;
  var positions = [], globalIndex = 0;
  for (var li = 0; li < lines.length; li++) {
    var tokens = lines[li].split(/\s+/), widths = [], lineWidth = 0;
    for (var ti = 0; ti < tokens.length; ti++) {
      var width = antonUnits(tokens[ti]) * size;
      widths.push(width); lineWidth += width + (ti ? size * 0.23 : 0);
    }
    var lineX = o.x || 0;
    if (alignment === 'center' || alignment === 'topCenter') lineX = 960 - lineWidth / 2;
    else if (o.textAlign === 'center' && o.width) lineX += (o.width - lineWidth) / 2;
    var cursor = lineX;
    for (var wi = 0; wi < tokens.length; wi++) {
      positions[globalIndex] = { x: cursor + widths[wi] / 2, y: baseY + li * lineStep + size * 0.5 };
      cursor += widths[wi] + size * 0.23; globalIndex++;
    }
  }
  var index = ctx.word.wordIndex, current = positions[index] || positions[0];
  if (!current) return;
  var previous = positions[Math.max(0, index - 1)] || current;
  var travel = eo3(clamp(ctx.wordProgress / 0.35, 0, 1));
  ctx.focusX = lerp(previous.x, current.x, travel);
  ctx.focusY = lerp(previous.y, current.y, travel);
  ctx.focusSet = true;
}
function wordTextBlock(ctx, o) {
  o = o || {};
  var value = ctx.lyric ? ctx.lyric.text : '';
  var lines = o.lines || wrapText(value, o.maxChars || 24), rows = [], globalWord = 0;
  var activeIndex = ctx.word ? ctx.word.wordIndex : -1;
  var baseColor = o.color || '#ffffff';
  var accent = o.accent || (ctx.act.mode === 'paper' ? ORANGE : CYAN);
  for (var li = 0; li < lines.length; li++) {
    var tokens = lines[li].split(/\s+/), words = [];
    for (var ti = 0; ti < tokens.length; ti++) {
      var active = globalWord === activeIndex;
      var future = activeIndex >= 0 && globalWord > activeIndex;
      words.push(display(tokens[ti], {
        fontSize: o.fontSize || 128, color: active ? accent : baseColor,
        letterSpacing: o.letterSpacing, lineHeight: o.lineHeight || 0.96,
        textAlign: 'left', opacity: future ? 0.52 : 1,
        scale: active ? 1.025 + ctx.beat.pulse * 0.045 : 1,
        margin: { right: ti === tokens.length - 1 ? 0 : (o.fontSize || 128) * 0.23 },
        shadows: o.shadows,
      }));
      globalWord++;
    }
    rows.push(row(words, {
      mainAxisAlignment: o.textAlign === 'center' ? 'center' : (o.textAlign === 'right' ? 'end' : 'start'),
      crossAxisAlignment: 'center', margin: { top: li ? (o.lineGap === undefined ? 6 : o.lineGap) : 0 },
    }));
  }
  measureTextCamera(ctx, lines, o.fontSize || 128, o);
  return column(rows, {
    width: o.width, crossAxisAlignment: o.crossAxisAlignment || 'start',
    alignment: o.alignment || 'topLeft', offsetX: o.x || 0, offsetY: o.y || 0,
    opacity: o.opacity, scale: o.scale, rotation: o.rotation,
  });
}
function cueEnter(ctx, duration) {
  if (!ctx.lyric) return 1;
  return eo3(clamp(((ctx.visualTime === undefined ? ctx.time : ctx.visualTime) - ctx.lyric.t) / (duration || 0.28), 0, 1));
}
function cueBlock(ctx, o) {
  o = o || {};
  if (!ctx.lyric) return spacer(0, 0);
  var enter = cueEnter(ctx, o.duration || 0.26);
  var style = ctx.lyric.style;
  var size = o.fontSize || (style === 'hook' ? 190 : (style === 'giant' ? 142 : 116));
  var max = o.maxChars || (style === 'hook' ? 20 : 25);
  var lines = wrapText(ctx.lyric.text, max);
  if (lines.length > 2 && !o.fontSize) size = Math.min(size, 118);
  var color = o.color || (ctx.act.mode === 'paper' ? INK : '#ffffff');
  return wordTextBlock(ctx, {
    lines: lines, fontSize: size, maxChars: max, color: color, accent: o.accent,
    width: o.width || 1700, x: o.x === undefined ? 110 : o.x,
    y: o.y === undefined ? 280 : o.y, alignment: o.alignment || 'topLeft',
    textAlign: o.textAlign || 'left', crossAxisAlignment: o.crossAxisAlignment || 'start',
    opacity: 1, scale: (o.scale || 1) * (0.94 + enter * 0.06 + ctx.beat.pulse * (o.beatScale || 0.018)),
    rotation: o.rotation || 0,
    shadows: o.shadows,
  });
}
function hookWord(ctx, index, value, o) {
  o = o || {};
  var active = ctx.word && ctx.word.wordIndex === index;
  var future = ctx.word && index > ctx.word.wordIndex;
  return display(value, {
    fontSize: o.fontSize, color: active ? (o.accent || ORANGE) : (o.color || '#ffffff'),
    letterSpacing: o.letterSpacing, opacity: active ? 1 : (o.opacity === undefined ? 1 : o.opacity) * (future ? 0.55 : 1),
    scale: (o.scale || 1) * (active ? 1.025 + ctx.beat.pulse * 0.04 : 1),
    margin: o.margin, shadows: o.shadows, rotation: o.rotation,
    alignment: o.alignment, offsetX: o.offsetX, offsetY: o.offsetY,
  });
}
function techStamp(ctx, color) {
  return row([
    micro('WRITE THE LIGHT', { color: color || '#8d8d99' }),
    micro('  /  ', { color: color || '#555560' }),
    micro(timecode(Math.floor(ctx.time * 30), 30), { color: color || '#8d8d99' }),
  ], { alignment: 'bottomLeft', offsetX: 72, offsetY: -54 });
}
function beatBorder(ctx, color, width) {
  return box({
    width: 1920, height: 1080, borderColor: alphaColor(color || CYAN, 0.2 + ctx.beat.pulse * 0.65),
    borderWidth: (width || 3) + ctx.beat.pulse * 4, alignment: 'center',
  });
}
function hash(i, salt) {
  var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
function confetti(ctx, count, paper) {
  var children = [];
  for (var i = 0; i < count; i++) {
    var lane = (ctx.beat.index + i * 7) % 31;
    var x = hash(lane, 2) * 1920, y = hash(lane, 3) * 1080;
    var colors = paper ? [INK, ORANGE, VIOLET] : [VIOLET, CYAN, '#ffffff', ORANGE];
    children.push(box({
      width: 5 + hash(i, 4) * 12, height: 5 + hash(i, 5) * 24,
      color: colors[i % colors.length], rotation: hash(i, 6) * 160,
      opacity: 0.18 + ctx.beat.pulse * 0.55,
      positioned: { left: x, top: y },
    }));
  }
  return stack(children);
}
function chatBubble(text, mine, o) {
  o = o || {};
  return box({
    width: o.width || 720, padding: { left: 28, right: 28, top: 22, bottom: 22 },
    color: mine ? CYAN : '#202028', borderRadius: 8,
    alignment: o.alignment || 'bottomCenter', offsetY: o.y === undefined ? -110 : o.y,
    offsetX: o.x || 0, opacity: o.opacity, scale: o.scale,
    child: txt(text, { fontSize: o.fontSize || 34, color: mine ? INK : '#ffffff', fontWeight: 600, lineHeight: 1.18 }),
  });
}

// 00 — Friday, 4:59 -----------------------------------------------------------
function renderColdOpen(ctx) {
  var children = [], style = ctx.lyric ? ctx.lyric.style : '';
  children.push(micro('BOT-001  /  INCOMING TRANSMISSION', { color: '#777784', alignment: 'topLeft', offsetX: 76, offsetY: 66 }));
  if (style === 'clock' || !ctx.lyric) {
    var e = cueEnter(ctx, 0.5);
    children.push(display('4:59', { fontSize: 310, color: '#ffffff', alignment: 'topLeft', offsetX: 86, offsetY: 205, opacity: e, scale: 0.96 + e * 0.04 }));
    children.push(micro('FRIDAY', { fontSize: 26, color: ORANGE, alignment: 'topLeft', offsetX: 100, offsetY: 120 }));
    children.push(mono('THE WEEKEND IS RIGHT THERE.', { fontSize: 25, color: '#8d8d99', alignment: 'topLeft', offsetX: 104, offsetY: 560 }));
    children.push(box({ width: 5, height: 160, color: ORANGE, alignment: 'topRight', offsetX: -170, offsetY: 240, opacity: 0.4 + ctx.beat.pulse * 0.6 }));
  } else {
    var reply = style === 'reply', enter = cueEnter(ctx, 0.3);
    children.push(display(reply ? 'YEAH.' : 'HEY TEAM.', {
      fontSize: reply ? 260 : 190, color: reply ? CYAN : '#ffffff',
      alignment: 'topLeft', offsetX: 100, offsetY: 130 + 40 * (1 - enter), opacity: enter,
    }));
    children.push(textBlock(ctx.lyric.text, {
      lines: reply ? ['GIVE ME A MINUTE.'] : wrapText(ctx.lyric.text, 31), fontSize: reply ? 86 : 72,
      color: reply ? '#ffffff' : '#c8c8d0', x: 110, y: 470, width: 1500,
    }));
    children.push(chatBubble(ctx.lyric.text, reply, { y: -110, opacity: enter, scale: 0.95 + enter * 0.05 }));
  }
  children.push(techStamp(ctx));
  return filmRoot(children, 'black');
}

// 01 — Boot / repo ------------------------------------------------------------
function renderBoot(ctx) {
  var t = ctx.local, children = [];
  var lines = [
    '$ yoclip init product_film',
    '  [OK]  project.js',
    '  [OK]  scenes/film.scene.js',
    '  [OK]  three/world.js',
    '  [OK]  Flutter GPU online',
    '  [OK]  master audio · 117.454 BPM',
  ];
  var rows = [];
  for (var i = 0; i < lines.length; i++) {
    var visible = t > 0.7 + i * 1.25;
    rows.push(mono(visible ? lines[i] : ' ', { fontSize: 25, color: i === 0 ? CYAN : (i > 3 ? LIME : '#a9a9b6'), margin: { bottom: 22 } }));
  }
  children.push(micro('NEW PROJECT  /  NO FOOTAGE FOUND', { color: ORANGE, alignment: 'topLeft', offsetX: 90, offsetY: 90 }));
  children.push(column(rows, { alignment: 'topLeft', offsetX: 110, offsetY: 220, scale: 1 + ctx.progress * 0.08 }));
  var bootCode = 'export function scene({ frame }) { … }';
  var bootTypeFrame = Math.floor(t * 30);
  var typedBootCode = typewriter(bootCode, bootTypeFrame, 20, 34);
  // One fixed-size, left-aligned monospace node: an inline block caret avoids
  // trailing-space width changes and caret layout shifts during typing.
  children.push(mono(typedBootCode + (blink(bootTypeFrame, 13) ? '█' : ' '), {
    fontSize: 29, color: '#ffffff', width: 1100, height: 48,
    textAlign: 'left', alignment: 'bottomLeft', offsetX: 110, offsetY: -170,
  }));
  children.push(display('ONE MINUTE.', { fontSize: 128, color: alphaColor('#ffffff', 0.06 + ctx.progress * 0.12), alignment: 'topRight', offsetX: -90, offsetY: 180 }));
  children.push(techStamp(ctx));
  return filmRoot(children, 'staticBlack');
}

// 02 — Verse one --------------------------------------------------------------
function renderVerseCode(ctx) {
  var children = [], e = cueEnter(ctx, 0.35);
  children.push(micro('SCENE 01  /  EMPTY REPO', { color: CYAN, alignment: 'topLeft', offsetX: 86, offsetY: 78 }));
  // Reserve the right third for Yo; long lyrics must not cover the character's face.
  children.push(cueBlock(ctx, { fontSize: 128, maxChars: 20, y: 250, width: 1280, beatScale: 0.008 }));
  var line = ctx.lyric ? ctx.lyric.text : '';
  var code = line.indexOf('EMPTY REPO') >= 0 ? 'scenes: []  →  scenes: [film]' : (line.indexOf('FUNCTION') >= 0 ? 'export function scene({ frame })' : '// no camera. just coordinates.');
  children.push(mono(code, { fontSize: 26, color: LIME, alignment: 'bottomLeft', offsetX: 110, offsetY: -130, opacity: e }));
  children.push(box({ width: 2, height: 560, color: alphaColor(CYAN, 0.28), alignment: 'topLeft', offsetX: 72, offsetY: 230 }));
  children.push(techStamp(ctx));
  return filmRoot(children);
}

// 03 — The first build --------------------------------------------------------
function renderBuild(ctx) {
  var children = [], cue = ctx.lyric, local = cue ? ctx.time - cue.t : 0;
  if (!cue) return filmRoot(children);
  if (cue.text.indexOf('I WROTE A STACK') === 0) {
    var words = ['STACK', 'SPARK', 'FRAME'], cueIndices = [3, 6, 9];
    for (var i = 0; i < 3; i++) {
      var cueIndex = cueIndices[i], cueWord = ctx.lyric.words && ctx.lyric.words[cueIndex];
      var wordLocal = cueWord ? cueWord.t - cue.t : i * 0.65;
      var e = eo3(clamp(((ctx.visualTime === undefined ? ctx.time : ctx.visualTime) - cue.t - wordLocal + 0.12) / 0.25, 0, 1));
      children.push(hookWord(ctx, cueIndex, words[i], {
        fontSize: 190, color: '#ffffff', accent: i === 1 ? ORANGE : CYAN,
        alignment: 'topLeft', offsetX: 90 + i * 610, offsetY: 290 + i * 145,
        opacity: e, scale: 0.72 + e * 0.28 + ctx.beat.pulse * 0.035, rotation: (i - 1) * 3,
      }));
      children.push(micro('0' + (i + 1), { color: CYAN, alignment: 'topLeft', offsetX: 100 + i * 610, offsetY: 255 + i * 145, opacity: e }));
    }
    children.push(cueBlock(ctx, { fontSize: 62, maxChars: 38, x: 280, y: 920, width: 1360, textAlign: 'center', accent: ORANGE }));
  } else if (cue.text.indexOf('HIT PREVIEW') === 0) {
    var p = eo3(clamp(local / 0.5, 0, 1));
    children.push(box({ width: 400 * p, height: 210 * p, borderColor: CYAN, borderWidth: 3, alignment: 'topLeft', offsetX: 80, offsetY: 205 }));
    children.push(hookWord(ctx, 1, 'PREVIEW', { fontSize: 90, color: '#ffffff', accent: CYAN, alignment: 'topLeft', offsetX: 110, offsetY: 245, scale: 0.75 + p * 0.25 + ctx.beat.pulse * 0.025 }));
    children.push(micro('THE PIXELS CAME ALIVE', { color: CYAN, alignment: 'bottomCenter', offsetY: -225 }));
    children.push(cueBlock(ctx, { fontSize: 62, maxChars: 32, x: 350, y: 920, width: 1220, textAlign: 'center', accent: CYAN }));
  } else if (cue.text.indexOf('HOT RELOAD') === 0) {
    children.push(hookWord(ctx, 0, 'HOT', { fontSize: 280, color: '#ffffff', accent: CYAN, alignment: 'topLeft', offsetX: 90, offsetY: 160, scale: 1 + ctx.beat.pulse * 0.035 }));
    children.push(hookWord(ctx, 1, 'RELOAD', { fontSize: 220, color: '#ffffff', accent: ORANGE, alignment: 'topRight', offsetX: -90, offsetY: 305, scale: 1 + ctx.beat.pulse * 0.035 }));
    children.push(mono('save()  →  frame  →  alive', { fontSize: 30, color: CYAN, alignment: 'bottomCenter', offsetY: -225 }));
    children.push(cueBlock(ctx, { fontSize: 62, maxChars: 32, x: 350, y: 920, width: 1220, textAlign: 'center', accent: ORANGE }));
  } else {
    var writingCue = cue.text.indexOf("I'M NOT CUTTING") === 0;
    children.push(micro('NOT CUTTING CLIPS.', { fontSize: 30, color: '#9c9ca8', alignment: 'topLeft', offsetX: 100, offsetY: 160 }));
    children.push(cueBlock(ctx, {
      fontSize: writingCue ? 116 : 174,
      maxChars: writingCue ? 28 : 20,
      x: 90, y: writingCue ? 760 : 280,
      width: writingCue ? 1560 : 1740,
      accent: CYAN,
    }));
  }
  if (ctx.progress > 0.48) {
    children.push(micro('YO / “HIT PREVIEW. THE PIXELS CAME ALIVE.”', { color: WHITE, alignment: 'topRight', offsetX: -90, offsetY: 92, opacity: clamp((ctx.progress - 0.48) / 0.08, 0, 1) }));
  }
  children.push(techStamp(ctx));
  // The Three.js camera owns the push-in; keep typography inside its safe area
  // and away from the driver instead of applying a second Flutter zoom.
  return filmRoot(children, 'fixed');
}

// 04 — Paper typographic break ------------------------------------------------
function renderPaperBreak(ctx) {
  var children = [], e = cueEnter(ctx, 0.24), index = Math.max(0, Math.round((ctx.time - 40.46) / 3));
  children.push(micro('0' + (index + 1) + '  /  REMOVE THE FRICTION', { color: INK, alignment: 'topLeft', offsetX: 76, offsetY: 65 }));
  children.push(box({ width: 120, height: 18, color: ORANGE, alignment: 'topRight', offsetX: -80, offsetY: 70, scale: 1 + ctx.beat.pulse * 0.4 }));
  children.push(cueBlock(ctx, { color: INK, fontSize: 155, maxChars: 23, y: 245 + (index % 2) * 90, rotation: index % 2 ? -1.5 : 1.2, beatScale: 0.012 }));
  if (ctx.time >= 49.2 && ctx.time < 51.38) {
    children.push(mono('scale: 1.00  →  scale: ' + (1 + eo3(clamp((ctx.time - 49.2) / 2.18, 0, 1))).toFixed(2), { fontSize: 30, color: VIOLET, alignment: 'bottomLeft', offsetX: 110, offsetY: -105 }));
  } else {
    children.push(mono('// less dragging. more directing.', { fontSize: 25, color: '#55555d', alignment: 'bottomLeft', offsetX: 110, offsetY: -105 }));
  }
  children.push(box({ width: 1920, height: 7, color: INK, alignment: 'bottomLeft', offsetY: -40 }));
  return filmRoot(children, 'paper');
}

// Shared chorus language ------------------------------------------------------
function renderChorus(ctx, finalPass) {
  var children = [], cue = ctx.lyric;
  children.push(micro(finalPass ? 'YOCLIP  /  FINAL TAKE' : 'YOCLIP  /  ROLL CAMERA', { color: finalPass ? '#a8b0bc' : CYAN, alignment: 'topLeft', offsetX: 72, offsetY: 58 }));
  if (!finalPass) children.push(confetti(ctx, 20, false));
  if (cue) {
    var e = cueEnter(ctx, 0.18), hook = cue.style === 'hook';
    var short = cue.text.length < 22;
    if (cue.repeat) {
      children.push(cueBlock(ctx, {
        fontSize: finalPass ? 184 : 168, maxChars: 16, alignment: 'center', x: 0, y: 0,
        width: 1760, textAlign: 'center', crossAxisAlignment: 'center', color: '#ffffff', accent: ORANGE,
        beatScale: 0.035, shadows: [{ color: '#a77c3aed', blur: 28, offsetY: 6 }],
      }));
    } else if (hook && short && cue.text.indexOf('WRITE THE LIGHT') >= 0) {
      var alt = ctx.beat.bar % 2 === 0;
      children.push(hookWord(ctx, 0, 'WRITE', {
        fontSize: finalPass ? 280 : 250, color: '#ffffff', accent: alt ? ORANGE : CYAN, alignment: 'topLeft',
        offsetX: alt ? 80 : 510, offsetY: alt ? 160 : 110, opacity: e,
        scale: 0.86 + e * 0.14 + ctx.beat.pulse * 0.04,
        shadows: [{ color: '#b37c3aed', blur: 34, offsetY: 8 }],
      }));
      children.push(row([
        hookWord(ctx, 1, 'THE', { fontSize: finalPass ? 250 : 220, color: alt ? CYAN : ORANGE, accent: '#ffffff', margin: { right: 34 } }),
        hookWord(ctx, 2, 'LIGHT', { fontSize: finalPass ? 250 : 220, color: alt ? CYAN : ORANGE, accent: '#ffffff' }),
      ], {
        alignment: 'topRight', offsetX: alt ? -90 : -430, offsetY: alt ? 540 : 490,
        opacity: e, scale: 0.86 + e * 0.14 + ctx.beat.pulse * 0.04,
      }));
    } else if (cue.text.indexOf('EVERY SINGLE PIXEL') >= 0) {
      // DJ Yo owns the centre stage; keep the karaoke clear of the face and decks.
      children.push(cueBlock(ctx, {
        fontSize: finalPass ? 108 : 96, maxChars: 24, alignment: 'topLeft', x: 100, y: 105,
        width: 1720, textAlign: 'left', crossAxisAlignment: 'start', color: '#ffffff', accent: CYAN,
        beatScale: 0.02, shadows: [{ color: '#a77c3aed', blur: 24, offsetY: 5 }],
      }));
    } else if (cue.text.indexOf('WORLD IN FLIGHT') >= 0) {
      children.push(cueBlock(ctx, {
        fontSize: finalPass ? 104 : 108, maxChars: 35, alignment: 'topLeft', x: 100, y: finalPass ? 820 : 790,
        width: 1720, textAlign: 'left', crossAxisAlignment: 'start', color: '#ffffff',
        accent: ORANGE, beatScale: finalPass ? 0.035 : 0.018,
        shadows: [{ color: '#d0000000', blur: 22, offsetY: 5 }],
      }));
    } else {
      children.push(cueBlock(ctx, {
        fontSize: hook ? (cue.text.length > 35 ? 128 : 174) : 112,
        maxChars: hook ? 23 : 31, alignment: 'center', x: 0, y: 0,
        width: 1760, textAlign: 'center', crossAxisAlignment: 'center',
        color: '#ffffff', beatScale: finalPass ? 0.045 : 0.025,
        shadows: [{ color: '#a77c3aed', blur: 28, offsetY: 6 }],
      }));
    }
  }
  if (finalPass && ctx.beat.index % 8 === 0) children.push(fullColor(alphaColor('#ffffff', 0.05 + ctx.beat.pulse * 0.08)));
  children.push(beatBorder(ctx, finalPass ? ORANGE : VIOLET, finalPass ? 1 : 3));
  return filmRoot(children, finalPass ? 'fixed' : undefined);
}

// 06 — Code in / film out -----------------------------------------------------
function renderSplit(ctx) {
  var children = [], invert = ctx.beat.index % 2 === 0;
  children.push(box({ width: 960, height: 1080, color: invert ? PAPER : INK, positioned: { left: 0, top: 0 } }));
  children.push(box({ width: 960, height: 1080, color: invert ? INK : PAPER, positioned: { left: 960, top: 0 } }));
  children.push(display('CODE IN', { fontSize: 205, color: invert ? INK : PAPER, alignment: 'topLeft', offsetX: 70, offsetY: 350, scale: 1 + ctx.beat.pulse * 0.045 }));
  children.push(display('FILM OUT', { fontSize: 195, color: invert ? PAPER : INK, alignment: 'topRight', offsetX: -65, offsetY: 350, scale: 1 + ctx.beat.pulse * 0.045 }));
  children.push(mono('scene(frame)', { fontSize: 28, color: invert ? VIOLET : CYAN, alignment: 'bottomLeft', offsetX: 78, offsetY: -115 }));
  children.push(mono('RGBA → MP4', { fontSize: 28, color: invert ? ORANGE : VIOLET, alignment: 'bottomRight', offsetX: -78, offsetY: -115 }));
  children.push(box({ width: 6, height: 1080, color: ORANGE, positioned: { left: 957, top: 0 } }));
  return filmRoot(children);
}

// 07 — Native GPU story -------------------------------------------------------
function renderGpuStory(ctx) {
  var children = [], station = Math.min(2, Math.floor(ctx.progress * 3));
  children.push(micro('YO\'S DANCE & BRICK LAB  /  THREE.JS · FLUTTER GPU', { color: CYAN, alignment: 'topLeft', offsetX: 74, offsetY: 65 }));
  children.push(column([
    micro('01  CODE  /  JS SCENES', { color: station === 0 ? CYAN : '#656571', margin: { bottom: 16 } }),
    micro('02  3D  /  NATIVE GPU', { color: station === 1 ? VIOLET : '#656571', margin: { bottom: 16 } }),
    micro('03  EXPORT  /  MP4', { color: station === 2 ? ORANGE : '#656571' }),
  ], { alignment: 'topRight', offsetX: -76, offsetY: 155, crossAxisAlignment: 'end' }));
  children.push(cueBlock(ctx, { fontSize: 100, maxChars: 31, y: 790, width: 1700, beatScale: 0.008, shadows: [{ color: '#d0000000', blur: 22, offsetY: 5 }] }));
  children.push(beatBorder(ctx, CYAN, 2));
  children.push(techStamp(ctx));
  return filmRoot(children);
}

// 08 — Formats / golden frames ------------------------------------------------
function formatFrame(label, ratio, w, h, x, y, entry, ctx, index) {
  var accents = [CYAN, VIOLET, ORANGE], accent = accents[index % 3];
  var e = eo3(clamp(entry, 0, 1));
  return box({
    width: w, height: h, borderRadius: 26,
    gradient: { colors: ['#f21b1b2d', '#f005050a'], begin: 'topLeft', end: 'bottomRight' },
    borderColor: alphaColor(accent, 0.25 + e * 0.75), borderWidth: 2 + e * 3,
    shadow: { color: alphaColor(accent, 0.1 + e * 0.55), blur: 30 + e * 45, offsetY: 22 },
    positioned: { left: x, top: y + (1 - e) * 150 }, opacity: 0.16 + e * 0.84,
    scale: 0.76 + e * 0.24 + (e > 0.99 ? ctx.beat.pulse * 0.018 : 0),
    rotation: (index - 1) * (1 - e) * 12, rotateY: (1 - e) * 52,
    child: stack([
      box({ width: w - 44, height: 2, color: alphaColor(accent, 0.6), alignment: 'topCenter', offsetY: 58 }),
      micro('0' + (index + 1) + '  /  MASTER', { color: alphaColor('#ffffff', 0.7), alignment: 'topLeft', offsetX: 24, offsetY: 22 }),
      box({ width: 10, height: 10, borderRadius: 5, color: accent, alignment: 'topRight', offsetX: -25, offsetY: 25 }),
      display(label, { fontSize: Math.min(92, h * 0.2), color: e > 0.75 ? '#ffffff' : '#8d8d99', alignment: 'center', shadows: [{ color: alphaColor(accent, 0.75), blur: 24, offsetY: 3 }] }),
      micro(ratio, { fontSize: 22, color: accent, alignment: 'bottomCenter', offsetY: -28 }),
      box({ width: w * 0.62, height: 5, color: alphaColor(accent, 0.7), alignment: 'bottomCenter', offsetY: -68, rotation: index === 1 ? 90 : 0 }),
    ]),
  });
}
function renderFormats(ctx) {
  var children = [], t = ctx.time;
  children.push(micro('FORMAT FOUNDRY  /  ONE SOURCE · EVERY SCREEN', { color: CYAN, alignment: 'topLeft', offsetX: 74, offsetY: 58 }));
  children.push(mono('1920 × 1080  /  MASTER 01', { fontSize: 18, color: '#777782', alignment: 'topRight', offsetX: -74, offsetY: 60 }));
  children.push(cueBlock(ctx, { fontSize: 100, maxChars: 32, y: 115, width: 1760, color: '#ffffff', beatScale: 0.008, shadows: [{ color: '#b3000000', blur: 22, offsetY: 5 }] }));
  if (t < 97.88) {
    var scan = (t * 0.65) % 1, flash = Math.exp(-Math.max(0, t - 94.14) * 4);
    children.push(box({ width: 1210, height: 570, borderRadius: 28, positioned: { left: 355, top: 440 }, color: '#d9080910', borderColor: alphaColor(CYAN, 0.65), borderWidth: 3, shadow: { color: '#667c3aed', blur: 70, offsetY: 25 } }));
    children.push(box({ width: 1120, height: 470, positioned: { left: 400, top: 490 }, gradient: { type: 'radial', colors: ['#b37c3aed', '#24050508', '#00000000'] } }));
    children.push(display('GOLDEN', { fontSize: 168, color: '#ffffff', alignment: 'topCenter', offsetY: 575, shadows: [{ color: '#cc22d3ee', blur: 35, offsetY: 5 }] }));
    children.push(micro('FRAME 0001  /  PIXEL-PERFECT OR NOTHING', { color: ORANGE, alignment: 'topCenter', offsetY: 790 }));
    children.push(box({ width: 1120, height: 5, color: CYAN, positioned: { left: 400, top: 490 + scan * 465 }, shadow: { color: '#ff22d3ee', blur: 25, offsetY: 0 } }));
    var corners = [[335,420],[1545,420],[335,990],[1545,990]];
    for (var i = 0; i < corners.length; i++) children.push(box({ width: 34, height: 34, color: i % 2 ? ORANGE : CYAN, positioned: { left: corners[i][0], top: corners[i][1] }, rotation: 45 }));
    children.push(box({ width: 1920, height: 1080, color: alphaColor('#ffffff', flash * 0.38), positioned: { left: 0, top: 0 } }));
  } else {
    children.push(formatFrame('WIDE', '16:9', 590, 332, 100, 570, (t - 97.55) / 0.55, ctx, 0));
    children.push(formatFrame('TALL', '9:16', 310, 551, 795, 455, (t - 98.62) / 0.55, ctx, 1));
    children.push(formatFrame('SQUARE', '1:1', 450, 450, 1300, 555, (t - 99.78) / 0.55, ctx, 2));
    children.push(mono('16:9  →  9:16  →  1:1', { fontSize: 27, color: '#ffffff', alignment: 'bottomCenter', offsetY: -45 }));
  }
  children.push(beatBorder(ctx, VIOLET, 2));
  return filmRoot(children);
}

// 09 — Export roulette --------------------------------------------------------
function renderPreTwo(ctx) {
  var children = [], t = ctx.time, i;
  children.push(micro('EXPORT DEPARTMENT  /  FINAL MEANS FINAL', { color: '#ff9a62', alignment: 'topLeft', offsetX: 75, offsetY: 58, shadows: [{ color: '#ff000000', blur: 10, offsetY: 2 }] }));
  children.push(mono('PIPELINE  /  JS → GPU → H.264', { fontSize: 17, color: '#777782', alignment: 'topRight', offsetX: -75, offsetY: 60 }));
  for (i = 0; i < 12; i++) children.push(box({ width: 1, height: 1080, color: alphaColor(CYAN, 0.07), positioned: { left: i * 175, top: 0 } }));
  if (t < 106.14) {
    var renderP = clamp((t - 102.16) / 3.98, 0, 1), percent = Math.floor(renderP * 100);
    children.push(box({
      width: 660, height: 650, positioned: { left: 105, top: 220 }, borderRadius: 28,
      gradient: { colors: ['#f2181825', '#f207070d'], begin: 'topLeft', end: 'bottomRight' },
      borderColor: '#557c3aed', borderWidth: 2, shadow: { color: '#667c3aed', blur: 60, offsetY: 24 },
    }));
    children.push(micro('RENDER QUEUE  /  LIVE', { color: CYAN, alignment: 'topLeft', offsetX: 145, offsetY: 258 }));
    children.push(display(String(percent).padStart(2, '0') + '%', { fontSize: 150, color: '#ffffff', alignment: 'topLeft', offsetX: 140, offsetY: 305 }));
    children.push(box({ width: 555, height: 9, color: '#33333d', positioned: { left: 145, top: 490 }, borderRadius: 5 }));
    children.push(box({ width: Math.max(8, 555 * renderP), height: 9, color: ORANGE, positioned: { left: 145, top: 490 }, borderRadius: 5, shadow: { color: '#ccff5a36', blur: 20, offsetY: 0 } }));
    var files = ['01_scenes.js', '02_master.wav', '03_gpu.frames', '04_final.mp4'];
    for (i = 0; i < files.length; i++) {
      var done = renderP * 4 > i + 1, active = !done && renderP * 4 > i;
      children.push(micro((done ? 'OK  ' : (active ? '>  ' : '·  ')) + files[i], { fontSize: 18, color: done ? LIME : (active ? ORANGE : '#777782'), alignment: 'topLeft', offsetX: 150, offsetY: 555 + i * 57 }));
      children.push(box({ width: 180, height: 3, color: done ? LIME : alphaColor(CYAN, active ? 0.9 : 0.18), positioned: { left: 535, top: 565 + i * 57 } }));
    }
    children.push(cueBlock(ctx, { fontSize: 112, maxChars: 19, x: 870, y: 300, width: 900, color: '#ffffff', accent: ORANGE, shadows: [{ color: '#cc000000', blur: 25, offsetY: 5 }] }));
    children.push(mono('render_final_FINAL_v27_actual.mp4', { fontSize: 22, color: '#8d8d99', alignment: 'bottomLeft', offsetX: 875, offsetY: -125 }));
  } else if (t < 108.18) {
    var typed = clamp((t - 106.14) / 0.9, 0, 1), title = 'WRITE THE LIGHT';
    children.push(box({ width: 1540, height: 475, positioned: { left: 190, top: 175 }, color: '#ee090911', borderRadius: 24, borderColor: '#4b22d3ee', borderWidth: 2, shadow: { color: '#5522d3ee', blur: 55, offsetY: 22 } }));
    children.push(micro('SCENE.JS  /  ONE-LINE PATCH', { color: CYAN, alignment: 'topLeft', offsetX: 235, offsetY: 215 }));
    children.push(mono('108', { fontSize: 30, color: '#555560', alignment: 'topLeft', offsetX: 250, offsetY: 325 }));
    children.push(mono('- title: "FINAL_FINAL_v27"', { fontSize: 40, color: ORANGE, alignment: 'topLeft', offsetX: 345, offsetY: 320 }));
    children.push(box({ width: 1280, height: 92, color: alphaColor(LIME, 0.08 + typed * 0.12), positioned: { left: 300, top: 410 }, borderRadius: 8 }));
    children.push(mono('109', { fontSize: 30, color: '#555560', alignment: 'topLeft', offsetX: 250, offsetY: 440 }));
    children.push(mono('+ title: "' + title.slice(0, Math.ceil(title.length * typed)) + '"', { fontSize: 44, color: LIME, alignment: 'topLeft', offsetX: 345, offsetY: 430 }));
    children.push(box({ width: 4, height: 52, color: LIME, positioned: { left: 370 + typed * 650, top: 432 }, opacity: blink(Math.floor(t * 30), 8) }));
    children.push(micro('OK 0 FILES RENDERED AGAIN  /  OK ANIMATION PRESERVED', { color: LIME, alignment: 'topLeft', offsetX: 350, offsetY: 565 }));
    children.push(cueBlock(ctx, { fontSize: 116, maxChars: 28, x: 180, y: 745, width: 1580, accent: LIME }));
  } else {
    children.push(cueBlock(ctx, { fontSize: 104, maxChars: 34, alignment: 'topLeft', x: 90, y: 105, width: 1720, textAlign: 'left', crossAxisAlignment: 'start', accent: ORANGE, shadows: [{ color: '#ff000000', blur: 28, offsetY: 5 }] }));
    children.push(mono('WHEEL  /  BRAKE  /  BODY  —  ONE CAMERA MOVE', { fontSize: 20, color: '#ffffff', alignment: 'bottomLeft', offsetX: 92, offsetY: -72 }));
    children.push(micro('EVERY LAYER  /  EVERY FRAME  /  ONE MASTER', { color: CYAN, alignment: 'bottomRight', offsetX: -90, offsetY: -70 }));
  }
  if (t < 108.18) children.push(beatBorder(ctx, ORANGE, 2));
  return filmRoot(children, 'fixed');
}

// 11 — Phone notes ------------------------------------------------------------
function phonePreviewBot(accent, pop, resize) {
  return stack([
    box({ width: 84, height: 62, borderRadius: 18, color: VIOLET, alignment: 'center', offsetY: 8, borderColor: alphaColor('#ffffff', 0.35), borderWidth: 2 }),
    box({ width: 62, height: 38, borderRadius: 10, color: INK, alignment: 'center', offsetY: 8 }),
    box({ width: 9, height: 13, borderRadius: 3, color: CYAN, alignment: 'center', offsetX: -15, offsetY: 5 }),
    box({ width: 9, height: 13, borderRadius: 3, color: CYAN, alignment: 'center', offsetX: 15, offsetY: 5 }),
    box({ width: 25, height: 4, borderRadius: 2, color: '#ffffff', alignment: 'center', offsetY: 20 }),
    box({ width: 4, height: 24, borderRadius: 2, color: LILAC, alignment: 'center', offsetY: -37 }),
    box({ width: 14, height: 14, borderRadius: 7, color: ORANGE, alignment: 'center', offsetY: -52, scale: 0.9 + pop * 0.25 }),
    box({ width: 22, height: 8, borderRadius: 4, color: accent, alignment: 'center', offsetX: -24, offsetY: 48 }),
    box({ width: 22, height: 8, borderRadius: 4, color: accent, alignment: 'center', offsetX: 24, offsetY: 48 }),
  ], { width: 130, height: 130, alignment: 'center', offsetY: resize > 0.5 ? -105 : -65, scale: 0.78 + resize * 0.2 + pop * 0.08 });
}
function renderPhone(ctx) {
  var children = [], cue = ctx.lyric, t = ctx.time, i;
  // Effects begin on the word that requests them, then hold through the reply.
  var resize = eo3(clamp((t - 130.90) / 1.55, 0, 1));
  var edit = eo3(clamp((t - 134.86) / 1.55, 0, 1));
  var pop = eo3(clamp((t - 138.54) / 0.90, 0, 1));
  var drop = eo3(clamp((t - 139.60) / 0.24, 0, 1));
  var phoneW = lerp(690, 420, resize), phoneH = lerp(430, 820, resize);
  var phoneX = 110 + (690 - phoneW) / 2, phoneY = 135 + (820 - phoneH) / 2;
  var accent = pop > 0 ? ORANGE : (edit > 0 ? LIME : CYAN);
  var mine = cue && cue.style === 'phoneYo';
  var newTitle = 'WRITE THE LIGHT', typedTitle = newTitle.slice(0, Math.ceil(newTitle.length * edit));
  var phoneTitle = edit > 0 ? typedTitle.replace('THE ', 'THE\n') : 'PRODUCT\nDEMO';
  children.push(fullColor(alphaColor('#020204', 0.72)));
  children.push(micro('LIVE NOTES  /  RESPONSIVE PLAYGROUND', { color: CYAN, alignment: 'topLeft', offsetX: 75, offsetY: 58 }));
  children.push(mono('BOT-001  ·  HOT RELOAD', { fontSize: 17, color: '#8d8d99', alignment: 'topRight', offsetX: -75, offsetY: 60 }));
  if (pop > 0) {
    for (i = 0; i < 5; i++) {
      var ring = 460 + i * 105 + ctx.beat.pulse * 35 + drop * 80;
      children.push(box({ width: ring, height: ring, borderRadius: ring / 2, borderColor: alphaColor(i % 2 ? VIOLET : ORANGE, pop * (0.44 - i * 0.065)), borderWidth: 3, positioned: { left: 450 - ring / 2, top: 545 - ring / 2 }, scale: 0.8 + pop * 0.2 }));
    }
    for (i = 0; i < 22; i++) {
      var confettiX = 80 + hash(i, 71) * 760, confettiY = 120 + hash(i, 72) * 780;
      children.push(box({ width: 8 + hash(i, 73) * 12, height: 8 + hash(i, 74) * 18, borderRadius: 2, color: i % 3 === 0 ? ORANGE : (i % 3 === 1 ? CYAN : LIME), positioned: { left: confettiX, top: confettiY - drop * 70 }, rotation: i * 23 + drop * 90, opacity: pop * (0.35 + drop * 0.65) }));
    }
  }
  children.push(box({ width: phoneW + 28, height: phoneH + 28, borderRadius: 52, positioned: { left: phoneX - 14, top: phoneY - 5 }, color: alphaColor(accent, 0.12 + pop * 0.18), shadow: { color: alphaColor(accent, 0.7), blur: 65 + pop * 45, offsetY: 25 }, rotation: -4 * (1 - resize) }));
  children.push(box({
    width: phoneW, height: phoneH, borderRadius: 42, positioned: { left: phoneX, top: phoneY },
    gradient: { colors: [pop > 0 ? '#fa32162f' : '#fa202030', '#f0080810'], begin: 'topLeft', end: 'bottomRight' },
    borderColor: alphaColor(accent, 0.9), borderWidth: 4, rotation: -4 * (1 - resize), scale: 1 + drop * 0.025,
    child: stack([
      micro('YOCLIP  /  LIVE', { color: accent, alignment: 'topLeft', offsetX: 28, offsetY: 26 }),
      box({ width: 70, height: 7, borderRadius: 4, color: '#555560', alignment: 'topCenter', offsetY: 18 }),
      micro(resize > 0.65 ? '9:16' : '16:9', { color: '#ffffff', alignment: 'topRight', offsetX: -28, offsetY: 26 }),
      box({ width: phoneW - 52, height: Math.max(180, phoneH - 180), borderRadius: 24, alignment: 'center', gradient: { type: 'radial', colors: [alphaColor(accent, 0.30 + pop * 0.22), '#e0090912', '#00000000'] }, borderColor: alphaColor(accent, 0.4), borderWidth: 2 }),
      phonePreviewBot(accent, pop, resize),
      display(phoneTitle, { fontSize: resize > 0.65 ? 62 : 55, color: '#ffffff', alignment: 'center', offsetY: resize > 0.5 ? 70 : 45, textAlign: 'center', lineHeight: 0.95, scale: 1 + pop * ctx.beat.pulse * 0.07 + drop * 0.06, shadows: [{ color: alphaColor(accent, 0.85), blur: 28, offsetY: 4 }] }),
      micro(edit >= 1 ? 'TITLE UPDATED / OK' : (edit > 0 ? 'EDITING STRING...' : 'MASTER TITLE'), { color: accent, alignment: 'bottomCenter', offsetY: -85 }),
      box({ width: Math.max(40, (phoneW - 110) * (0.25 + resize * 0.75)), height: 5, color: accent, alignment: 'bottomCenter', offsetY: -55, borderRadius: 3 }),
      micro(pop > 0 ? 'NEON + BEAT REACTIVE' : 'SAFE AREA / LIVE LAYOUT', { color: pop > 0 ? LIME : '#8d8d99', alignment: 'bottomCenter', offsetY: -28 }),
    ]),
  }));
  if ((t >= 132.82 && t < 133.85) || (t >= 136.45 && t < 137.25)) {
    var replyLabel = t < 134 ? 'RESIZED / OK' : 'STRING UPDATED';
    children.push(box({ width: 245, height: 64, borderRadius: 32, color: LIME, positioned: { left: 530, top: 155 }, rotation: -7, shadow: { color: '#88c7f464', blur: 30, offsetY: 10 }, child: stack([micro(replyLabel, { fontSize: 20, color: INK, alignment: 'center' })]) }));
  }
  var activeStep = t < 134.02 ? 0 : (t < 137.36 ? 1 : 2);
  var stageName = '0' + (activeStep + 1) + '  /  ' + ['RESIZE', 'RETITLE', 'REMIX'][activeStep];
  children.push(micro(stageName, { color: accent, alignment: 'topLeft', offsetX: 940, offsetY: 205 }));
  children.push(cueBlock(ctx, {
    fontSize: mine ? 136 : 104, maxChars: mine ? 12 : 17, x: 930, y: 285, width: 900,
    accent: mine ? CYAN : accent, color: '#ffffff', beatScale: mine ? 0.028 : 0.012,
    shadows: [{ color: '#d9000000', blur: 26, offsetY: 6 }],
  }));
  if (pop > 0) {
    for (i = 0; i < 16; i++) {
      var level = 0.25 + hash(i, 17) * 0.75, barH = 20 + level * 130 * pop * (0.65 + ctx.beat.pulse * 0.35 + drop * 0.35);
      children.push(box({ width: 25, height: barH, borderRadius: 5, color: i % 3 === 0 ? ORANGE : (i % 3 === 1 ? CYAN : VIOLET), positioned: { left: 955 + i * 49, top: 850 - barH } }));
    }
    children.push(mono('style = "neon + beat";', { fontSize: 25, color: ORANGE, alignment: 'bottomLeft', offsetX: 950, offsetY: -105 }));
  } else {
    var codeLine = activeStep === 0 ? 'format = "' + (resize > 0.65 ? '9:16' : '16:9') + '";' : 'title = "' + typedTitle + '";';
    children.push(mono(codeLine, { fontSize: 27, color: edit > 0 ? LIME : '#8d8d99', alignment: 'bottomLeft', offsetX: 945, offsetY: -145 }));
  }
  var steps = ['RESIZE', 'RETITLE', 'REMIX'];
  for (i = 0; i < 3; i++) {
    children.push(micro('0' + (i + 1) + '  ' + steps[i], { color: i === activeStep ? accent : (i < activeStep ? '#c7f464' : '#555560'), alignment: 'bottomLeft', offsetX: 945 + i * 270, offsetY: -55 }));
    children.push(box({ width: 210, height: 3, color: i <= activeStep ? (i === activeStep ? accent : LIME) : '#33333d', positioned: { left: 945 + i * 270, top: 1005 } }));
  }
  children.push(beatBorder(ctx, accent, 2 + drop * 4));
  return filmRoot(children, 'fixed');
}

// 12 — Riser / silence --------------------------------------------------------
function renderRiser(ctx) {
  var children = [], p = ctx.progress, i;
  if (ctx.time > 149.25 && ctx.time < 149.72) {
    children.push(box({ width: 13, height: 30, color: '#ffffff', alignment: 'center', opacity: blink(Math.floor(ctx.time * 30), 8) }));
    return filmRoot(children, 'black');
  }
  children.push(fullColor(alphaColor('#020204', 0.42)));
  children.push(micro('MASTER TIMELINE  /  EIGHT BEATS TO LIFTOFF', { color: CYAN, alignment: 'topCenter', offsetY: 82 }));
  children.push(mono('140.50  →  148.14  /  HOLD THE FRAME', { fontSize: 18, color: '#777782', alignment: 'topCenter', offsetY: 125 }));
  var radius = 350 - p * 95;
  for (i = 0; i < 48; i++) {
    var angle = i / 48 * Math.PI * 2, active = i / 48 < p;
    var barH = 45 + p * 125 + (active ? ctx.beat.pulse * 24 : 0);
    children.push(box({
      width: active ? 10 : 6, height: barH, borderRadius: 4,
      color: active ? (i % 8 === 0 ? ORANGE : CYAN) : alphaColor(VIOLET, 0.2),
      positioned: { left: 960 + Math.cos(angle) * radius, top: 540 + Math.sin(angle) * radius - barH / 2 },
      rotation: angle * 180 / Math.PI + 90, opacity: active ? 0.95 : 0.32,
      shadow: active ? { color: '#8822d3ee', blur: 18, offsetY: 0 } : undefined,
    }));
  }
  var count = Math.max(1, 8 - Math.floor(p * 8));
  children.push(display('0' + count, { fontSize: 265, color: '#ffffff', alignment: 'center', scale: 0.88 + p * 0.12 + ctx.beat.pulse * 0.025, shadows: [{ color: '#aa7c3aed', blur: 45, offsetY: 5 }] }));
  children.push(micro('WAIT FOR THE DROP', { fontSize: 22, color: ORANGE, alignment: 'topCenter', offsetY: 725 }));
  for (i = 0; i < 8; i++) {
    children.push(box({ width: 165, height: 7, borderRadius: 4, color: i < Math.ceil(p * 8) ? (i === 7 ? ORANGE : CYAN) : '#33333d', positioned: { left: 275 + i * 175, top: 940 } }));
    children.push(micro('0' + (i + 1), { color: i < Math.ceil(p * 8) ? '#ffffff' : '#555560', alignment: 'topLeft', offsetX: 330 + i * 175, offsetY: 970 }));
  }
  children.push(beatBorder(ctx, VIOLET, 2));
  return filmRoot(children);
}

// 13 — Breakdown --------------------------------------------------------------
function breakdownYo(index, active, sceneMode) {
  var accent = sceneMode ? ORANGE : CYAN;
  return stack([
    box({ width: 104, height: 74, borderRadius: 22, color: alphaColor(VIOLET, active ? 0.18 : 0.08), borderColor: alphaColor(accent, 0.3), borderWidth: 3, alignment: 'center', offsetX: -38, offsetY: 2, opacity: active ? 0.45 : 0 }),
    box({ width: 104, height: 74, borderRadius: 22, color: alphaColor(VIOLET, active ? 0.18 : 0.08), borderColor: alphaColor(accent, 0.3), borderWidth: 3, alignment: 'center', offsetX: 38, offsetY: 2, opacity: active ? 0.45 : 0 }),
    box({ width: 104, height: 74, borderRadius: 22, color: VIOLET, alignment: 'center', borderColor: alphaColor('#ffffff', 0.35), borderWidth: 2 }),
    box({ width: 76, height: 43, borderRadius: 12, color: INK, alignment: 'center', offsetY: 1 }),
    box({ width: 10, height: 15, borderRadius: 3, color: accent, alignment: 'center', offsetX: -19, offsetY: -3 }),
    box({ width: 10, height: 15, borderRadius: 3, color: accent, alignment: 'center', offsetX: 19, offsetY: -3 }),
    box({ width: 28, height: 5, borderRadius: 3, color: '#ffffff', alignment: 'center', offsetY: 15 }),
    box({ width: 5, height: 27, borderRadius: 3, color: LILAC, alignment: 'center', offsetY: -51 }),
    box({ width: 15, height: 15, borderRadius: 8, color: ORANGE, alignment: 'center', offsetY: -67 }),
    box({ width: 12, height: 58, borderRadius: 6, color: LILAC, alignment: 'center', offsetX: -66, offsetY: 5, rotation: -25 - index * 13 }),
    box({ width: 12, height: 58, borderRadius: 6, color: LILAC, alignment: 'center', offsetX: 66, offsetY: 5, rotation: 25 + index * 13 }),
    box({ width: 30, height: 10, borderRadius: 4, color: accent, alignment: 'center', offsetX: -28, offsetY: 51 }),
    box({ width: 30, height: 10, borderRadius: 4, color: accent, alignment: 'center', offsetX: 28, offsetY: 51 }),
  ], { width: 210, height: 155, alignment: 'center', offsetY: 8 + Math.sin(index * 1.4) * 18, rotation: (index - 2) * 0.055, scale: active ? 1.08 : 0.88 });
}
function renderBreakdown(ctx) {
  var children = [], e = cueEnter(ctx, 0.12), i;
  if (ctx.time > 155.82) return filmRoot([], 'black');
  var sceneMode = ctx.lyric && ctx.lyric.text.indexOf('SCENE') >= 0;
  var ink = sceneMode ? INK : '#ffffff', accent = sceneMode ? ORANGE : CYAN;
  var count = sceneMode ? 4 : 5, activeIndex = ctx.beat.index % count;
  if (!sceneMode) children.push(fullColor(alphaColor('#020204', 0.60)));
  children.push(micro('CUTTING ROOM  /  ' + (sceneMode ? 'ASSEMBLY / 4 SHOTS' : 'ONION SKIN / LIVE FRAMES'), { color: accent, alignment: 'topLeft', offsetX: 75, offsetY: 62 }));
  children.push(mono(timecode(Math.floor(ctx.time * 30), 30) + '  /  30 FPS', { fontSize: 20, color: sceneMode ? INK : '#8d8d99', alignment: 'topRight', offsetX: -75, offsetY: 62 }));
  children.push(cueBlock(ctx, { color: ink, accent: accent, fontSize: 132, maxChars: 14, x: 105, y: 135, width: 1350, beatScale: 0.025, shadows: sceneMode ? undefined : [{ color: '#cc000000', blur: 30, offsetY: 6 }] }));
  children.push(mono(sceneMode ? 'scene.map(shot => shot.render())' : 'scene({ frame: ' + String(4520 + activeIndex) + ' })  →  RGBA', { fontSize: 24, color: sceneMode ? INK : LIME, alignment: 'topRight', offsetX: -105, offsetY: 315 }));
  children.push(micro(sceneMode ? 'FOUR HARD CUTS / ONE STORY' : 'SAME SCENE / DIFFERENT MASTER FRAME', { color: alphaColor(ink, 0.62), alignment: 'topLeft', offsetX: 110, offsetY: 330 }));
  var cardW = sceneMode ? 360 : 310, gap = sceneMode ? 60 : 35;
  for (i = 0; i < count; i++) {
    var active = i === activeIndex, cardX = (sceneMode ? 110 : 100) + i * (cardW + gap);
    var labels = sceneMode ? ['CODE', 'GPU', 'TYPE', 'EXPORT'] : ['POSE A', 'POSE B', 'HERO', 'POSE C', 'POSE D'];
    children.push(box({
      width: cardW, height: 300, borderRadius: 20, positioned: { left: cardX, top: 440 },
      gradient: { colors: [sceneMode ? (active ? '#fff3e4d8' : '#f7d9d0c8') : (active ? '#fa18223a' : '#e20b0b18'), sceneMode ? '#fff1efe8' : '#f8070712'], begin: 'topLeft', end: 'bottomRight' },
      borderColor: active ? accent : alphaColor(ink, 0.25), borderWidth: active ? 5 : 2,
      scale: active ? 1.035 : 0.96, rotation: (i % 2 ? 1 : -1) * (active ? 0 : 1.2),
      shadow: active ? { color: alphaColor(accent, 0.45), blur: 32, offsetY: 12 } : undefined,
      child: stack([
        micro(sceneMode ? '0' + (i + 1) + ' / ' + labels[i] : 'F 00' + String(4520 + i), { color: active ? accent : (sceneMode ? INK : '#8d8d99'), alignment: 'topLeft', offsetX: 18, offsetY: 16 }),
        breakdownYo(i, active, sceneMode),
        micro(sceneMode ? 'HARD CUT / READY' : (active ? 'ONION SKIN / CURRENT' : 'RGBA / CACHED'), { color: sceneMode ? INK : '#ffffff', alignment: 'bottomLeft', offsetX: 18, offsetY: -16 }),
      ]),
    }));
    if (sceneMode && i < count - 1) children.push(display('→', { fontSize: 42, color: accent, positioned: { left: cardX + cardW + 8, top: 555 } }));
  }
  var playX = (sceneMode ? 110 : 100) + activeIndex * (cardW + gap) + cardW / 2;
  children.push(box({ width: 4, height: 350, color: accent, positioned: { left: playX, top: 405 }, opacity: 0.8 }));
  children.push(box({ width: 18, height: 12, color: accent, positioned: { left: playX - 7, top: 398 }, rotation: 45 }));
  for (i = 0; i < 30; i++) {
    var tickActive = sceneMode ? i <= activeIndex * 10 + 9 : Math.floor(i / 6) <= activeIndex;
    children.push(box({ width: 43, height: tickActive ? 14 : 8, borderRadius: 3, color: tickActive ? accent : alphaColor(ink, 0.18), positioned: { left: 110 + i * 57, top: 875 }, opacity: e }));
  }
  children.push(mono(sceneMode ? 'CUT 01  →  CUT 02  →  CUT 03  →  EXPORT' : '30 fps  /  deterministic seek  /  no wall clock', { fontSize: 22, color: ink, alignment: 'bottomLeft', offsetX: 110, offsetY: -105 }));
  children.push(micro('SCENE → FRAME → WORD → BEAT', { color: accent, alignment: 'bottomLeft', offsetX: 115, offsetY: -62 }));
  return filmRoot(children, sceneMode ? 'paper' : undefined);
}

// 16 — The boss's final note --------------------------------------------------
function renderQuestion(ctx) {
  var children = [], reply = ctx.lyric && ctx.lyric.style === 'reply';
  children.push(micro('BOT-001  /  ONE MORE THING', { color: '#777782', alignment: 'topLeft', offsetX: 76, offsetY: 65 }));
  if (!reply) {
    children.push(display('GREAT.', { fontSize: 105, color: '#8d8d99', alignment: 'topLeft', offsetX: 105, offsetY: 180 }));
    children.push(textBlock('CAN YOU MAKE TWELVE MORE?', { lines: ['CAN YOU MAKE', 'TWELVE MORE?'], fontSize: 188, color: '#ffffff', x: 100, y: 340, width: 1740 }));
    children.push(box({ width: 930, height: 12, color: ORANGE, alignment: 'bottomLeft', offsetX: 110, offsetY: -145 }));
  } else {
    var e = cueEnter(ctx, 0.5);
    children.push(display('…YEAH.', { fontSize: 210, color: '#ffffff', alignment: 'center', opacity: e, scale: 0.95 + e * 0.05 }));
    children.push(mono('scene.count = 1;  // for now', { fontSize: 25, color: '#777782', alignment: 'bottomCenter', offsetY: -130 }));
  }
  return filmRoot(children, 'black');
}

// 17 — Outro ------------------------------------------------------------------
function renderOutro(ctx) {
  var children = [];
  if (ctx.time > 200.48) return filmRoot([], 'black');
  if (ctx.time < 199.32) {
    children.push(cueBlock(ctx, { fontSize: ctx.time < 196.58 ? 245 : 190, maxChars: 20, alignment: 'center', x: 0, y: 0, width: 1760, textAlign: 'center', crossAxisAlignment: 'center', beatScale: 0.05 }));
    children.push(beatBorder(ctx, ORANGE, 5));
  } else {
    // Transparent Flutter layer: the drift reveals the real extruded
    // official YoClip lockup + .studio suffix. No competing flat title.
    children.push(micro('A YOCLIP MUSIC FILM  /  CODE IN. FILM OUT.', { color: CYAN, alignment: 'bottomCenter', offsetY: -75 }));
  }
  return filmRoot(children, ctx.time >= 199.32 ? null : 'black');
}

function renderFilm(frame) {
  var ctx = filmContext(frame), name = ctx.act.name;
  ACTIVE_FILM_CONTEXT = ctx;
  if (name === 'cold_open') return renderColdOpen(ctx);
  if (name === 'boot') return renderBoot(ctx);
  if (name === 'verse_code') return renderVerseCode(ctx);
  if (name === 'build') return renderBuild(ctx);
  if (name === 'pre_cut') return renderPaperBreak(ctx);
  if (name === 'chorus_one') return renderChorus(ctx, false);
  if (name === 'post_chorus') return renderSplit(ctx);
  if (name === 'gpu_story') return renderGpuStory(ctx);
  if (name === 'formats') return renderFormats(ctx);
  if (name === 'pre_two') return renderPreTwo(ctx);
  if (name === 'chorus_two') return renderChorus(ctx, false);
  if (name === 'phone') return renderPhone(ctx);
  if (name === 'riser') return renderRiser(ctx);
  if (name === 'breakdown') return renderBreakdown(ctx);
  if (name === 'final_one' || name === 'final_two') return renderChorus(ctx, true);
  if (name === 'question') return renderQuestion(ctx);
  return renderOutro(ctx);
}
