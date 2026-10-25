// kit.js — палитра, математика, типографика и кинетика для music_animation.
// Все иллюстрации строятся из векторных примитивов и SVG + сгенерированные
// текстуры (зерно/сканлайны) — никаких сторонних артов.

var W = 1080, H = 1920;
var FPS = 30;
var BEAT = 23.6842; // 76 BPM: кадров на бит

var C = {
  bg: '#05060d', panel: '#0b0e1c', line: '#1d2438',
  white: '#f4f6ff', muted: '#8b93b8', dim: '#4a5272',
  violet: '#8b5cf6', violetL: '#c4b5fd', ice: '#7dd3fc',
  cyan: '#22d3ee', acid: '#c8ff2f', red: '#ff2d55',
  pink: '#fb7185', amber: '#fbbf24', mint: '#34d399',
  stroke: '#1d2438', green: '#34d399', // алиасы для ранних сцен
};

// --- Easing -------------------------------------------------------------------
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function seg(f, a, b) { return clamp((f - a) / (b - a || 1), 0, 1); }
function lerp(a, b, t) { return a + (b - a) * t; }
function eo3(t) { return 1 - Math.pow(1 - t, 3); }
function eoExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function eio3(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function eoBack(t) {
  var c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Детерминированный «шум» — никакого Math.random между кадрами.
function rnd(seed) {
  var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function noise1(t, seed) {
  var i = Math.floor(t), f = t - i;
  var u = f * f * (3 - 2 * f);
  return lerp(rnd(i + seed * 57.31), rnd(i + 1 + seed * 57.31), u) * 2 - 1;
}

function pulse(f, amt) {
  var p = seg(f % BEAT, 0, BEAT * 0.42);
  return Math.exp(-4 * p) * (amt == null ? 1 : amt);
}
function beat(f) { return Math.floor(f / BEAT); }
function shake(f, amp, freq) {
  var s = amp * Math.exp(-3 * seg(f % BEAT, 0, BEAT * 0.5));
  return { x: noise1(f * (freq || 0.7), 3) * s, y: noise1(f * (freq || 0.7), 11) * s };
}

function AA(hex, aa) { return '#' + aa + hex.substring(1); }

// --- Раскладка ------------------------------------------------------------------
function at(node, cx, cy) {
  var w = node.width || 0, h = node.height || 0;
  node.positioned = { left: Math.round(cx - w / 2), top: Math.round(cy - h / 2) };
  return node;
}
function fullW(node, top) {
  return { type: 'container', width: W, positioned: { left: 0, top: top || 0 }, child: node };
}

// --- Типографика ----------------------------------------------------------------
function text(str, size, color, opts) {
  opts = opts || {};
  var n = {
    type: 'text', text: str, textAlign: 'center',
    style: {
      fontFamily: opts.family || 'SS3 Black', fontSize: size, color: color,
      letterSpacing: opts.spacing != null ? opts.spacing : -1,
      lineHeight: opts.lineHeight || 1.05,
    },
  };
  if (opts.gradient) n.style.gradient = opts.gradient;
  return n;
}
function glowText(str, size, color, glow, blur) {
  return {
    type: 'stack', children: [
      { type: 'text', text: str, textAlign: 'center', blur: blur || 20,
        opacity: 0.9, style: { fontFamily: 'SS3 Black', fontSize: size, color: glow, letterSpacing: -1 } },
      text(str, size, color),
    ],
  };
}
function cap(str, color, size) {
  return text(str, size || 30, color || C.muted,
    { family: 'SS3 Bold', spacing: (size || 30) * 0.22 });
}

// --- SVG ------------------------------------------------------------------------
function svg(s, w, h) { return { type: 'svg', data: s, width: w, height: h }; }
function svgOpen(w, h) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">';
}

// --- Панели ----------------------------------------------------------------------
function panel(w, h, child, opts) {
  opts = opts || {};
  return {
    type: 'container', width: w, height: h,
    color: opts.color || AA(C.panel, 'd9'),
    borderColor: opts.borderColor || C.line, borderWidth: opts.borderWidth || 2,
    borderRadius: opts.borderRadius || 26,
    padding: opts.padding || 26,
    child: child,
  };
}
function column(children, opts) {
  return { type: 'column', mainAxisAlignment: (opts && opts.main) || 'center',
    crossAxisAlignment: 'center', spacing: (opts && opts.gap) || 0, children: children };
}

function sceneIn(f, node) {
  var p = eo3(seg(f, 0, 22));
  return { type: 'container', scale: 0.94 + 0.06 * p, opacity: p,
    child: { type: 'stack', fit: 'expand', children: [node] } };
}
function pushIf(arr, node) { if (node) arr.push(node); }

// finish(): хук для финальных проходов по графу. `spacing` у Row/Column
// поддержан нативно в js_widget_runtime (Flutter Flex.spacing).
function finish(root) { return root; }

function money(v) {
  var s = String(Math.abs(Math.round(v)));
  var out = '';
  while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
  return (v < 0 ? '-' : '') + s + out + ' \u20BD';
}

// --- Кинетика строк ---------------------------------------------------------------
// rows: [ [ {t, c, g, s}, ... ], ... ]
// opt: top, size, gap, rowGap, line, start, step, rgb(fr)
function lyric(f, rows, opt) {
  opt = opt || {};
  var size = opt.size || 62;
  var out = [];
  var idx = 0;
  var start = opt.start == null ? 6 : opt.start;
  var step = opt.step == null ? 11 : opt.step;
  for (var r = 0; r < rows.length; r++) {
    var kids = [];
    for (var i = 0; i < rows[r].length; i++) {
      var wd = rows[r][i];
      var st = start + idx * step + (wd.late || 0);
      if (opt.line != null && LINES[opt.line] && LINES[opt.line].words[idx] != null) {
        st = LINES[opt.line].words[idx] + (wd.late || 0);
      }
      var p = eoBack(seg(f, st, st + 12));
      var gl = opt.rgb && opt.rgb(f) && rnd(idx + Math.floor(f / 2) * 13) > 0.45;
      var color = wd.c || C.white;
      var size2 = wd.s || size;
      var node;
      if (wd.g) node = glowText(wd.t, size2, color, wd.g, 26);
      else node = text(wd.t, size2, color);
      if (gl) {
        node = { type: 'stack', children: [
          { type: 'text', text: wd.t, offsetX: 5, textAlign: 'center',
            style: { fontFamily: 'SS3 Black', fontSize: size2, color: C.red } },
          { type: 'text', text: wd.t, offsetX: -5, textAlign: 'center',
            style: { fontFamily: 'SS3 Black', fontSize: size2, color: C.cyan } },
          node,
        ] };
      }
      kids.push({ type: 'container', opacity: seg(f, st, st + 4),
        scale: 0.7 + 0.3 * p,
        child: { type: 'container', offsetY: (1 - eo3(seg(f, st, st + 12))) * 44, child: node } });
      idx++;
    }
    out.push({ type: 'row', mainAxisAlignment: 'center', spacing: size * 0.30,
      positioned: { left: 0, top: (opt.top == null ? 250 : opt.top) + r * (opt.rowGap || size * 1.32) },
      width: W, children: kids });
  }
  return { type: 'stack', children: out };
}

// --- Глитч -----------------------------------------------------------------------
function glitchOn(f, idx) {
  var b = beat(f);
  return (f % BEAT < 4 && b % 4 === (idx || 0) % 4) || rnd(Math.floor(f / 3) * 7 + (idx || 0)) > 0.93;
}
function glitchBars(f, color, seed) {
  var out = [];
  if (!glitchOn(f, seed)) return out;
  for (var i = 0; i < 3; i++) {
    var y = 420 + rnd(i + Math.floor(f / 2) * 31 + seed) * 1150;
    out.push({ type: 'container', width: W, height: 4 + rnd(i + f) * 14,
      positioned: { left: 0, top: Math.round(y) },
      color: color, opacity: 0.16 + rnd(i * 3 + f) * 0.2,
      offsetX: Math.round(noise1(f * 0.9, i) * 40) });
  }
  return out;
}

// --- Волна ----------------------------------------------------------------------
function waveRow(f, n, w, hMax, color, seed, active) {
  // Ранний вариант: waveRow(count, barWidth, maxHeight, valueFn, color, seed)
  // — статичная волна по функции значений (демо-плеер, DAW).
  if (typeof hMax === 'function') {
    var count = f, barW = n, maxH = w, fn = hMax, col = color;
    var bars = [];
    for (var bi = 0; bi < count; bi++) {
      bars.push({ type: 'container', width: barW, height: 4 + fn(bi) * maxH,
        borderRadius: 3, color: col, opacity: 0.95 });
    }
    return { type: 'row', mainAxisAlignment: 'spaceEvenly',
      crossAxisAlignment: 'center', width: count * (barW + 6), height: maxH + 8,
      children: bars };
  }
  var kids = [];
  var bw = w / n;
  for (var i = 0; i < n; i++) {
    var v = 0.22 + 0.78 * Math.abs(noise1(i * 0.33 + f * 0.22, seed || 1));
    if (active === false) v = 0.16 + 0.1 * rnd(i);
    kids.push({ type: 'container', width: Math.max(3, bw * 0.52),
      height: 6 + v * hMax, borderRadius: 3, color: color, opacity: active === false ? 0.45 : 0.95 });
  }
  return { type: 'row', mainAxisAlignment: 'spaceEvenly', crossAxisAlignment: 'center',
    width: w, height: hMax + 6, children: kids };
}

// --- Вспышка ----------------------------------------------------------------------
function flash(f, atFrame, dur, color, peak) {
  var t = seg(f, atFrame, atFrame + dur);
  if (t <= 0 || t >= 1) return null;
  return { type: 'container', color: color, opacity: (1 - t) * (peak || 0.75) };
}

// T(): текст с опциями узла (offsetX/offsetY/opacity) — для RGB-дублей и штампов.
function T(str, size, color, opts) {
  opts = opts || {};
  if (opts.style && opts.style.fontFamily) opts.family = opts.style.fontFamily;
  var n = text(str, size, color, opts);
  if (opts.offsetX != null) n.offsetX = opts.offsetX;
  if (opts.offsetY != null) n.offsetY = opts.offsetY;
  if (opts.opacity != null) n.opacity = opts.opacity;
  return n;
}

// glitchShift(): дрожание кадра во время глитча (RGB-split рассинхрон).
function glitchShift(f, idx) {
  if (!glitchOn(f, idx)) return { x: 0, y: 0 };
  return { x: noise1(f * 1.3, 5 + (idx || 0)) * 9, y: noise1(f * 1.1, 9 + (idx || 0)) * 5 };
}

// F: семейства шрифтов (некоторые сцены передают их через opts.style).
var F = { black: 'SS3 Black', bold: 'SS3 Bold', reg: 'SS3' };
