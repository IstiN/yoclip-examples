// kit.js — палитра, математика, типографика и примитивы для music_animation2.
// Единый тёмный стиль: iOS-виджеты, неон (ice/violet/red), глитч, плёнка.
// Все цвета/шрифты/кегли читаются из yoclipTheme с hex-фолбэками.

var TH = (typeof yoclipTheme !== 'undefined' && yoclipTheme) || {};
var THC = TH.colors || {};
var THS = TH.sizes || {};
var THF = TH.font || {};

var W = (typeof yoclipFormat !== 'undefined' && yoclipFormat && yoclipFormat.width) || 1080;
var H = (typeof yoclipFormat !== 'undefined' && yoclipFormat && yoclipFormat.height) || 1920;
var FPS = 30;

// Темп трека — из scenes/music_timing.js (media_beats + сверка с онсетами).
var BPM = MT.pulse.bpm;          // 97.0
var BEAT = 60.0 / BPM * FPS;     // 18.557 кадра
var BAR = BEAT * 4;              // 74.227 кадра
var B0 = MT.pulse.phaseF;        // 40.7 — кадр трека первого бита (онсет 13.728 c)
var CLIP0 = MT.CLIP_START_F;     // 5820 — клип стартует с 194.0 c трека (строка «И дальше...»)

var C = {
  bg: THC.background || '#05060d',
  panel: THC.panel || '#0b0e1c',
  line: THC.panelLine || '#1d2438',
  white: THC.text || '#f4f6ff',
  muted: THC.textMuted || '#8b93b8',
  dim: THC.textDim || '#4a5272',
  ice: THC.ice || '#7dd3fc',
  blue: THC.blue || '#3b82f6',
  violet: THC.violet || '#8b5cf6',
  violetL: THC.violetLight || '#c4b5fd',
  red: THC.red || '#ff2d55',
  redDeep: THC.redDeep || '#c1123f',
};

var F = {
  black: THF.family || 'SS3 Black',
  bold: 'SS3 Bold',
  reg: 'SS3',
};

var SZ = {
  lyric: THS.lyric || 56,
  lyricBig: THS.lyricBig || 110,
  huge: THS.huge || 150,
  cap: THS.cap || 26,
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
  var i = Math.floor(t), fr = t - i;
  var u = fr * fr * (3 - 2 * fr);
  return lerp(rnd(i + seed * 57.31), rnd(i + 1 + seed * 57.31), u) * 2 - 1;
}

// --- Бит ----------------------------------------------------------------------
// f — кадр КЛИПА; фаза сетки задана в кадрах ТРЕКА -> переводим через CLIP0.
function beatPhase(f) { var g = f + CLIP0; var p = (g - B0) % BEAT; return p < 0 ? p + BEAT : p; }
function pulse(f, amt) {
  var p = seg(beatPhase(f), 0, BEAT * 0.42);
  return Math.exp(-4 * p) * (amt == null ? 1 : amt);
}
function beatIdx(f) { return Math.floor((f + CLIP0 - B0) / BEAT); }
function shake(f, amp, freq) {
  var s = amp * Math.exp(-3 * seg(beatPhase(f), 0, BEAT * 0.5));
  return { x: noise1(f * (freq || 0.7), 3) * s, y: noise1(f * (freq || 0.7), 11) * s };
}

function AA(hex, aa) { return '#' + aa + String(hex).substring(1); }

// --- Раскладка ------------------------------------------------------------------
function at(node, cx, cy) {
  var w = node.width || 0, h = node.height || 0;
  node.positioned = { left: Math.round(cx - w / 2), top: Math.round(cy - h / 2) };
  return node;
}
// Центрирование узла с неизвестной шириной (текст, stack): контейнер-обёртка.
function atC(node, cx, cy, w) {
  return at({ type: 'container', width: w || W, alignment: 'center', child: node }, cx, cy);
}
function fullW(node, top) {
  return { type: 'container', width: W, positioned: { left: 0, top: top || 0 }, child: node };
}

// --- Типографика ----------------------------------------------------------------
function text(str, size, color, opts) {
  opts = opts || {};
  return {
    type: 'text', text: str, textAlign: 'center',
    style: {
      fontFamily: opts.family || F.black, fontSize: size, color: color,
      letterSpacing: opts.spacing != null ? opts.spacing : -1,
      lineHeight: opts.lineHeight || 1.05,
    },
  };
}
function glowText(str, size, color, glow, blur) {
  return {
    type: 'stack', children: [
      { type: 'text', text: str, textAlign: 'center', blur: blur || 20,
        opacity: 0.9, style: { fontFamily: F.black, fontSize: size, color: glow, letterSpacing: -1 } },
      text(str, size, color),
    ],
  };
}
function cap(str, color, size) {
  return text(str, size || SZ.cap, color || C.muted,
    { family: F.bold, spacing: (size || SZ.cap) * 0.22 });
}

// --- SVG ------------------------------------------------------------------------
function svg(s, w, h) { return { type: 'svg', data: s, width: w, height: h }; }
function svgOpen(w, h) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">';
}
function svgPathNode(d, w, h, color, sw, opts) {
  var n = { type: 'path', path: d, width: w, height: h,
    color: color, strokeWidth: sw == null ? 4 : sw };
  if (opts && opts.progress != null) n.progress = opts.progress;
  if (opts && opts.opacity != null) n.opacity = opts.opacity;
  return n;
}

// --- Панели ----------------------------------------------------------------------
function panel(w, h, child, opts) {
  opts = opts || {};
  return {
    type: 'container', width: w, height: h,
    color: opts.color || AA(C.panel, 'd9'),
    borderColor: opts.borderColor || C.line, borderWidth: opts.borderWidth == null ? 2 : opts.borderWidth,
    borderRadius: opts.borderRadius == null ? 26 : opts.borderRadius,
    padding: opts.padding || 26,
    shadow: opts.shadow,
    child: child,
  };
}
function column(children, opts) {
  opts = opts || {};
  return { type: 'column', mainAxisAlignment: opts.main || 'center',
    crossAxisAlignment: opts.cross || 'center', spacing: opts.gap || 0, children: children };
}
function row(children, opts) {
  opts = opts || {};
  return { type: 'row', mainAxisAlignment: opts.main || 'center',
    crossAxisAlignment: opts.cross || 'center', spacing: opts.gap || 0, children: children };
}

// Аура: мягкий радиальный цветовой лепесток.
function aura(cx, cy, size, color, op) {
  return at({ type: 'container', width: size, height: size,
    gradient: { type: 'radial', colors: [AA(color, '40'), AA(color, '14'), '#00000000'],
      stops: [0, 0.45, 1], radius: 0.5 }, opacity: op == null ? 0.8 : op }, cx, cy);
}

// Вход в сцену — мягкий, без «моргания»: сцена появляется из полупрозрачности,
// лёгкий zoom 1.5%, короткое окно 14 кадров (было 22 / fade с нуля / zoom 6%).
function sceneIn(f, node, dur) {
  var p = eo3(seg(f, 0, dur || 14));
  return { type: 'container', scale: 0.985 + 0.015 * p, opacity: 0.5 + 0.5 * p,
    child: { type: 'stack', fit: 'expand', children: [node] } };
}
function finish(root) { return root; }

// --- Кинетика строк ---------------------------------------------------------------
// rows: [ { start, dur, top?, size?, words: [ {t, c, g, s} ] } ]
// Слова распределяются по окну строки и появляются с pop-анимацией на долях.
function lyric(f, rows) {
  var out = [];
  for (var r = 0; r < rows.length; r++) {
    var rw = rows[r];
    var size = rw.size || SZ.lyric;
    var n = rw.words.length;
    var win = rw.dur == null ? n * 7 : rw.dur;
    var kids = [];
    for (var i = 0; i < n; i++) {
      var wd = rw.words[i];
      var st = rw.start + win * (i / Math.max(1, n));
      var p = eoBack(seg(f, st, st + 12));
      var color = wd.c || C.white;
      var size2 = wd.s || size;
      var node = wd.g ? glowText(wd.t, size2, color, wd.g, 24) : text(wd.t, size2, color);
      kids.push({ type: 'container', opacity: seg(f, st, st + 4),
        scale: 0.7 + 0.3 * p,
        child: { type: 'container', offsetY: (1 - eo3(seg(f, st, st + 12))) * 40, child: node } });
    }
    var rowNode = { type: 'row', mainAxisAlignment: 'center', spacing: size * 0.28,
      positioned: { left: 0, top: rw.top != null ? rw.top : 1450 + r * size * 1.3 },
      width: W, children: kids };
    // rw.end — кадр, с которого строка гаснет (~22 ф), чтобы освободить top
    // следующей строки (сцены 06/07: второй куплет на тех же строках).
    if (rw.end != null) {
      var o = 1 - seg(f, rw.end, rw.end + 22);
      if (o <= 0) continue;
      rowNode.opacity = o;
    }
    out.push(rowNode);
  }
  return { type: 'stack', children: out };
}

// --- Караоке по транскрипту ---------------------------------------------------------
// Активная строка вокала из MT.LYR_LINES (реальный тайминг transcribe_audio).
// Классическое караоке: строка видна заранее — тусклым (C.dim); ТЕКУЩЕЕ слово
// (окно = до старта следующего слова) — ярко-белое с холодным свечением,
// чуть крупнее и приподнято; пропетые — белые; ключевые (gc) сохраняют свой неон.
// f — локальный кадр сцены, from — глобальный старт сцены (scene.from).
// skipFn(L) — необязательный фильтр строк (напр., если арт-текст сцены уже показывает её).
function sung(f, from, skipFn) {
  var empty = { type: 'stack', children: [] };
  var gf = f + from + MT.CLIP_START_F; // кадр трека
  var li = MT.lineIdxAt(gf);
  if (li < 0) return empty;
  var L = MT.LYR_LINES[li];
  if (skipFn && skipFn(L)) return empty;
  var op = 1;
  if (L.fadeF != null && gf > L.fadeF) op = 1 - seg(gf, L.fadeF, L.fEnd);
  if (op <= 0.02) return empty;
  var out = [];
  for (var r = 0; r < L.rows.length; r++) {
    var rowWords = L.rows[r];
    var kids = [];
    for (var i = 0; i < rowWords.length; i++) {
      var wd = rowWords[i];
      var st = wd.f - MT.CLIP_START_F - from; // локальный кадр слова (трек -> клип -> сцена)
      // окно «текущего» слова — до старта следующего (через границу строки)
      var nx = i + 1 < rowWords.length ? rowWords[i + 1].f
        : (r + 1 < L.rows.length ? L.rows[r + 1][0].f : L.fEnd);
      var active = gf >= wd.f && gf < nx; // слово поют прямо сейчас
      var past = gf >= nx;                // слово уже спето
      var p = eoBack(seg(f, st, st + 10)); // pop в момент вступления слова
      var node;
      if (active) {
        node = glowText(wd.t, L.size, wd.gc || C.white, wd.gc || C.ice, 30);
      } else if (past && wd.gc) {
        node = glowText(wd.t, L.size, wd.gc, wd.gc, 16);
      } else {
        node = text(wd.t, L.size, past ? C.white : C.dim);
      }
      kids.push({ type: 'container',
        opacity: (past || active) ? 1 : 0.85,
        scale: (active ? 1.08 : 1) * (0.85 + 0.15 * p),
        child: { type: 'container', offsetY: active ? -4 : 0, child: node } });
    }
    out.push({ type: 'row', mainAxisAlignment: 'center', spacing: Math.round(L.size * 0.3),
      width: W, opacity: op,
      positioned: { left: 0, top: L.blockTop + r * L.rowH }, children: kids });
  }
  return { type: 'stack', children: out };
}

// --- Глитч -----------------------------------------------------------------------
function glitchOn(f, idx) {
  var b = beatIdx(f);
  return (beatPhase(f) < 4 && ((b % 4) + 4) % 4 === (idx || 0) % 4) ||
    rnd(Math.floor(f / 3) * 7 + (idx || 0)) > 0.93;
}
function glitchBars(f, color, seed) {
  var out = [];
  if (!glitchOn(f, seed)) return out;
  for (var i = 0; i < 3; i++) {
    var y = 300 + rnd(i + Math.floor(f / 2) * 31 + seed) * 1300;
    out.push({ type: 'container', width: W, height: 4 + rnd(i + f) * 14,
      positioned: { left: 0, top: Math.round(y) },
      color: color, opacity: 0.16 + rnd(i * 3 + f) * 0.2,
      offsetX: Math.round(noise1(f * 0.9, i) * 40) });
  }
  return out;
}
function glitchShift(f, idx) {
  if (!glitchOn(f, idx)) return { x: 0, y: 0 };
  return { x: noise1(f * 1.3, 5 + (idx || 0)) * 9, y: noise1(f * 1.1, 9 + (idx || 0)) * 5 };
}
// RGB-сплит текста: красная и голубая копии с рассинхроном.
function rgbSplit(node, f, seed, amp) {
  var on = glitchOn(f, seed);
  var a = amp == null ? 6 : amp;
  var dx = on ? noise1(f * 1.7, seed) * a : 0;
  var col = node.style && node.style.color ? node.style.color : C.white;
  var size = node.style && node.style.fontSize;
  var txt = node.text;
  return { type: 'stack', children: [
    { type: 'text', text: txt, textAlign: 'center', offsetX: dx + a,
      style: { fontFamily: node.style.fontFamily, fontSize: size, color: C.red,
        letterSpacing: node.style.letterSpacing } },
    { type: 'text', text: txt, textAlign: 'center', offsetX: dx - a,
      style: { fontFamily: node.style.fontFamily, fontSize: size, color: C.ice,
        letterSpacing: node.style.letterSpacing } },
    node,
  ] };
}

// --- Вспышка -----------------------------------------------------------------------
function flash(f, atFrame, dur, color, peak) {
  var t = seg(f, atFrame, atFrame + dur);
  if (t <= 0 || t >= 1) return null;
  return { type: 'absolute_fill', color: color || '#ffffff', opacity: (1 - t) * (peak || 0.75) };
}

// --- iOS-примитивы -------------------------------------------------------------------
// Корпус телефона. ГЕОМЕТРИЯ: тело — один контейнер-подложка (radius r, clip) +
// ОДИН непрерывный path-контур (rounded rect, радиус r одинаков на всех четырёх
// углах, линии не имеют стыков). Экран — прямоугольник (w-16)x(h-16) с рамкой 8px
// со ВСЕХ сторон и концентрическими углами (r-8), так что контент не вылезает
// за корпус. Координаты детей экрана — от его левого верхнего угла.
function phoneShell(w, h, screen, opts) {
  opts = opts || {};
  var r = opts.radius || 64;
  var sw = w - 16, sh = h - 16, ri = Math.max(8, r - 8);
  var body = { type: 'container', width: w, height: h, borderRadius: r,
    color: '#05060d', clip: true,
    child: { type: 'stack', width: w, height: h, children: [
      at({ type: 'container', width: sw, height: sh, borderRadius: ri,
        color: opts.screenColor || '#070a16', clip: true,
        child: { type: 'stack', width: sw, height: sh,
          children: [screen,
            // чёлка (координаты от экрана)
            at({ type: 'container', width: w * 0.32, height: 26, borderRadius: 13,
              color: '#05060d' }, sw / 2, 24)] } }, w / 2, h / 2),
    ] } };
  // контур: единый путь со скруглением r-2 на каждом углу (inset 2 => обводка внутри тела)
  var i = 2, rc = r - i;
  var d = 'M ' + (i + rc) + ' ' + i +
    ' L ' + (w - i - rc) + ' ' + i +
    ' A ' + rc + ' ' + rc + ' 0 0 1 ' + (w - i) + ' ' + (i + rc) +
    ' L ' + (w - i) + ' ' + (h - i - rc) +
    ' A ' + rc + ' ' + rc + ' 0 0 1 ' + (w - i - rc) + ' ' + (h - i) +
    ' L ' + (i + rc) + ' ' + (h - i) +
    ' A ' + rc + ' ' + rc + ' 0 0 1 ' + i + ' ' + (h - i - rc) +
    ' L ' + i + ' ' + (i + rc) +
    ' A ' + rc + ' ' + rc + ' 0 0 1 ' + (i + rc) + ' ' + i + ' Z';
  var outline = { type: 'path', path: d, width: w, height: h,
    color: '#2c3552', strokeWidth: 3 };
  return { type: 'stack', width: w, height: h, children: [body, outline] };
}
// Спиннер загрузки: дуга, вращающаяся на f.
function spinner(size, color, f, opts) {
  opts = opts || {};
  var r = size / 2;
  var d = 'M ' + r + ' 4 A ' + (r - 4) + ' ' + (r - 4) + ' 0 0 1 ' +
    (r + (r - 4) * Math.cos(-Math.PI / 3.2)).toFixed(1) + ' ' +
    (r + (r - 4) * Math.sin(-Math.PI / 3.2)).toFixed(1);
  return { type: 'path', path: d, width: size, height: size,
    color: color, strokeWidth: opts.width || 5, rotation: (f * (opts.speed || 9)) % 360,
    opacity: opts.opacity == null ? 0.95 : opts.opacity };
}
// Статус-бар iOS.
function statusBar(w, f) {
  var sig = [];
  for (var i = 0; i < 4; i++) sig.push({ type: 'container', width: 5,
    height: 5 + i * 3.2, borderRadius: 1.5, color: i < 3 ? C.white : C.dim, opacity: 0.8 });
  return { type: 'container', width: w - 56, height: 30, positioned: { left: 28, top: 0 },
    child: { type: 'row', mainAxisAlignment: 'spaceBetween', crossAxisAlignment: 'center',
      children: [
        { type: 'text', text: '23:4' + (7 + (Math.floor(f / 300) % 2)), textAlign: 'left',
          style: { fontFamily: F.bold, fontSize: 17, color: C.white, letterSpacing: 0 } },
        { type: 'row', spacing: 7, crossAxisAlignment: 'center', children: [
            { type: 'row', spacing: 2.5, crossAxisAlignment: 'end', children: sig },
            { type: 'container', width: 26, height: 13, borderRadius: 4,
              borderColor: C.dim, borderWidth: 1.5,
              child: { type: 'container', width: 16, height: 8, borderRadius: 2,
                color: C.white, opacity: 0.85, margin: 1.5 } },
          ] },
      ] } };
}
// Виньетка: тёмные края кадра.
function vignette(strength) {
  return { type: 'container', width: W, height: H,
    gradient: { type: 'radial', colors: ['#00000000', '#00000000', '#b0000000'],
      stops: [0, 0.55, 1], radius: 0.72 }, opacity: strength == null ? 1 : strength };
}
