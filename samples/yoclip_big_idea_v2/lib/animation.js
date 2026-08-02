// Shared animation helpers for yoclip_about.
//
// Declared in project.js as `lib: 'lib/animation.js'` so every scene can reuse
// these functions without copying them. The goal of this library is to make
// authoring a new promo scene a matter of composing small, readable primitives
// instead of hand-rolling easing math every time.
//
// Conventions:
//   - Every "frame" argument is the LOCAL frame of the current scene.
//   - Normalized easings take t in 0..1 and return 0..1 (sometimes overshooting).
//   - `seg(frame, start, end)` is the workhorse: clamped linear 0..1 progress.

// ---- Basics -----------------------------------------------------------------

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

/// Clamped linear progress of `frame` between `start` and `end` -> 0..1.
function seg(frame, start, end) {
  if (end <= start) return frame >= end ? 1 : 0;
  return clamp((frame - start) / (end - start), 0, 1);
}

// ---- Normalized easings (t in 0..1) -----------------------------------------

function ei3(t) { return t * t * t; }
function eo3(t) { var u = 1 - t; return 1 - u * u * u; }
function eio3(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function eo4(t) { var u = 1 - t; return 1 - u * u * u * u; }
function eio4(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; }
function eoExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function eoBack(t) {
  var c1 = 1.70158;
  var c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function eoElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}

/// Eased 0..1 progress between start/end, shaped by a normalized easing fn.
function ease(frame, start, end, fn) {
  return fn(seg(frame, start, end));
}

// ---- Presence (fade in / hold / fade out) -----------------------------------

/// Opacity that fades in over `fadeIn` frames, holds, then fades out over
/// `fadeOut` frames ending at `outEnd`. Returns 0..1.
function presence(frame, fadeIn, hold, fadeOut) {
  var fin = seg(frame, 0, fadeIn);
  var fout = seg(frame, fadeIn + hold, fadeIn + hold + fadeOut);
  return fin * (1 - fout);
}

/// 0..1 fade-in over `dur` frames (eased out).
function fadeIn(frame, dur) { return eo3(seg(frame, 0, dur)); }

/// 0..1 fade-out between `end - dur` and `end`.
function fadeOut(frame, end, dur) { return 1 - eo3(seg(frame, end - dur, end)); }

// ---- Motion primitives ------------------------------------------------------

/// Vertical slide-in: returns an offsetY that goes from `from` to 0.
function riseIn(frame, dur, from) {
  return from * (1 - eo3(seg(frame, 0, dur)));
}

/// Scale that pops 0 -> 1 with a little overshoot, paired with opacity 0..1.
/// Returns { scale, opacity }.
function pop(frame, start, dur) {
  var t = seg(frame - start, 0, dur);
  return { scale: eoBack(t), opacity: eo3(t) };
}

/// Smooth sine bob around 0, amplitude `amp`, `speed` radians per frame.
function float(frame, amp, speed, phase) {
  return Math.sin(frame * (speed || 0.05) + (phase || 0)) * amp;
}

/// Constant-speed rotation in degrees.
function spin(frame, degPerFrame) {
  return frame * degPerFrame;
}

/// 0..1 triangle wave for pulsing glows (period in frames).
function shimmer(frame, period) {
  var p = period || 60;
  var x = (frame % p) / p;
  return 1 - Math.abs(x * 2 - 1);
}

// ---- Counters & text --------------------------------------------------------

/// Animated integer counter from `from` to `to` between start and start+dur.
function counter(frame, start, dur, from, to) {
  var t = eo3(seg(frame, start, start + dur));
  return Math.round(from + (to - from) * t);
}

/// Typewriter: returns the first N characters of `text`, typing at `cps`
/// characters per second (fps 30) starting at local frame `start`.
function typewriter(text, frame, start, cps) {
  var perFrame = (cps || 30) / 30;
  var count = Math.floor((frame - start) * perFrame);
  if (count < 0) count = 0;
  if (count > text.length) count = text.length;
  return text.slice(0, count);
}

/// Jitter-free typewriter pair: returns [typed, rest]. Render BOTH as
/// adjacent text nodes with identical style — `rest` in a fully transparent
/// color ('#00000000') — so the line's measured width stays constant while
/// typing. A growing single text node makes the renderer re-measure every
/// frame, which shows up as a ±5px oscillation of the whole line (and as
/// drift whenever the line is center-anchored).
///
/// Trailing spaces are moved from `typed` into `rest`: the renderer trims
/// trailing whitespace when measuring, so a typed string ending in a space
/// shifts the whole line by half a space-width for one frame — the visible
/// "jump" at every word boundary.
function typewriterParts(text, frame, start, cps) {
  var typed = typewriter(text, frame, start, cps);
  var rest = text.slice(typed.length);
  var trailing = / +$/.exec(typed);
  if (trailing) {
    typed = typed.slice(0, typed.length - trailing[0].length);
    rest = trailing[0] + rest;
  }
  return [typed, rest];
}

/// Per-item stagger progress 0..1. Item `index` begins at start + index*delay.
function staggerItem(frame, index, start, delay, dur) {
  return seg(frame, start + index * delay, start + index * delay + dur);
}

// ---- Legacy helpers (kept for existing scenes) ------------------------------

function slideValue(frame, fadeIn, hold, fadeOut, start, end) {
  if (frame < 0) return start;
  if (frame < fadeIn) {
    return start + (end - start) * easeOut(frame, 0, 1, fadeIn);
  }
  if (frame < fadeIn + hold) return end;
  if (frame < fadeIn + hold + fadeOut) {
    return end + (start - end) * easeInOut(frame - fadeIn - hold, 0, 1, fadeOut);
  }
  return start;
}

function progress(frame, duration) {
  return clamp(frame / duration, 0, 1);
}

function blink(frame, period) {
  return (Math.floor(frame / period) % 2) === 0 ? 1 : 0;
}

function typeText(text, frame, charsPerFrame) {
  var count = Math.floor(frame / charsPerFrame);
  return text.slice(0, Math.max(0, Math.min(text.length, count)));
}

function stagger(frame, itemDuration, itemDelay, count) {
  var total = itemDuration + (count - 1) * itemDelay;
  var t = clamp(frame / total, 0, 1);
  var active = Math.min(count - 1, Math.floor(frame / itemDelay));
  var local = clamp((frame - active * itemDelay) / itemDuration, 0, 1);
  return { active: active, t: local };
}

// ---- Variants: localization + per-variant assets ------------------------------
//
// The Studio Variants panel (or `yoclip render -V <id>`) picks a variant from
// yoclip.yaml. Its params land here as the global `yoclipVariant`; the
// dictionaries from project.js land as `yoclipTexts`. Both fall back to safe
// defaults when a scene is rendered without any variant selected.

/// Params of the active variant ({} when none is selected).
function yoclipVariantParams() {
  return (typeof yoclipVariant !== 'undefined' && yoclipVariant) || {};
}

/// Active language — variant param `lang`, default 'en'.
function yoclipLang() {
  return yoclipVariantParams().lang || 'en';
}

/// Dictionary section for the active language: yoclipT('intro') returns
/// texts[lang].intro, falling back to English, then to {} (scenes should keep
/// an inline `|| 'English fallback'` on every lookup).
function yoclipT(section) {
  var all = (typeof yoclipTexts !== 'undefined' && yoclipTexts) || {};
  var dict = all[yoclipLang()] || all.en || {};
  return dict[section] || {};
}

/// Logo wordmark asset for the active variant — light themes swap in the
/// dark-ink logo via the variant param `logo`.
function yoclipLogoSource() {
  return yoclipVariantParams().logo || 'external:logo';
}

// ---- Theme helpers --------------------------------------------------------------

/// Theme color with fallback: yoclipColor('primary', '#7c3aed').
function yoclipColor(key, fallback) {
  var t = (typeof yoclipTheme !== 'undefined' && yoclipTheme) || {};
  var c = t.colors || {};
  return c[key] || fallback;
}

/// Theme color with an alpha byte (AARRGGBB): yoclipColorA('primary', 0x80)
/// is primary at 50% opacity. Strips any existing alpha from the base color.
function yoclipColorA(key, alpha, fallback) {
  var hex = yoclipColor(key, fallback || '#000000').replace('#', '');
  if (hex.length === 8) hex = hex.slice(2);
  var a = Math.max(0, Math.min(255, Math.round(alpha))).toString(16);
  if (a.length < 2) a = '0' + a;
  return '#' + a + hex;
}

/// Theme font size with fallback: yoclipSize('h5', 72). Sizes live in
/// yoclip.yaml -> theme.sizes so one edit rescales every scene.
function yoclipSize(key, fallback) {
  var t = (typeof yoclipTheme !== 'undefined' && yoclipTheme) || {};
  var s = t.sizes || {};
  return s[key] || fallback;
}

/// Theme font family: yoclipFont(). Family lives in yoclip.yaml ->
/// theme.font.family; falls back to Geneva.
function yoclipFont() {
  var t = (typeof yoclipTheme !== 'undefined' && yoclipTheme) || {};
  var f = t.font || {};
  return f.family || 'Geneva';
}

/// True when the active theme's background is light (relative luminance above
/// 0.5), so scenes can swap to dark-on-light palettes. Parses #rgb / #rrggbb.
function yoclipIsLight() {
  var hex = yoclipColor('background', '#0a0a12');
  var m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return false;
  var h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var r = parseInt(h.slice(0, 2), 16) / 255,
      g = parseInt(h.slice(2, 4), 16) / 255,
      b = parseInt(h.slice(4, 6), 16) / 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 0.5;
}

/// Current render orientation from the `yoclipFormat` global
/// ('landscape' | 'portrait' | 'square'). A variant with an explicit
/// width/height (e.g. shorts 1080x1920) retargets the whole render, and
/// scenes branch their layout on this instead of assuming landscape.
function yoclipOrientation() {
  var f = (typeof yoclipFormat !== 'undefined' && yoclipFormat) || {};
  return f.orientation || 'landscape';
}

/// True when rendering a portrait (vertical) frame — stack layouts, shrink
/// wide panels, enlarge the logo.
function yoclipIsPortrait() {
  return yoclipOrientation() === 'portrait';
}

// ---- 3D mesh generators (JSR scene3d `meshes` path) ---------------------------
//
// The software scene3d renderer takes plain `{vertices, faces, color}` meshes:
// vertices are [x,y,z] triples, faces are triangles of vertex indices. These
// generators build low-poly primitives centered at the origin; meshXform
// bakes per-mesh scale/rotation/translation into the vertices (the node's own
// `rotation` applies to the whole scene, per frame, from render()).

/// Box centered at origin: meshCube(2, 3, 0.6).
function meshCube(sx, sy, sz) {
  var x = (sx || 1) / 2, y = (sy || 1) / 2, z = (sz || 1) / 2;
  var v = [
    [-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z],
    [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z],
  ];
  var quads = [
    [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7],
    [1, 5, 6, 2], [4, 5, 1, 0], [7, 3, 2, 6],
  ];
  var f = [];
  for (var i = 0; i < quads.length; i++) {
    var q = quads[i];
    f.push([q[0], q[1], q[2]]);
    f.push([q[0], q[2], q[3]]);
  }
  return { vertices: v, faces: f };
}

/// Cylinder along the Y axis, centered: meshCylinder(1, 2, 14).
function meshCylinder(r, h, n) {
  n = n || 14;
  var v = [], f = [], hh = (h || 1) / 2;
  for (var i = 0; i < n; i++) {
    var a = (i / n) * Math.PI * 2;
    var c = Math.cos(a) * r, s = Math.sin(a) * r;
    v.push([c, -hh, s]);
    v.push([c, hh, s]);
  }
  var bot = v.length, top = v.length + 1;
  v.push([0, -hh, 0]);
  v.push([0, hh, 0]);
  for (var j = 0; j < n; j++) {
    var a0 = j * 2, b0 = ((j + 1) % n) * 2;
    f.push([a0, b0, b0 + 1]);
    f.push([a0, b0 + 1, a0 + 1]);
    f.push([bot, b0, a0]);
    f.push([top, a0 + 1, b0 + 1]);
  }
  return { vertices: v, faces: f };
}

/// Cone (apex up) along the Y axis, centered: meshCone(1, 2, 14).
function meshCone(r, h, n) {
  n = n || 14;
  var v = [], f = [], hh = (h || 1) / 2;
  for (var i = 0; i < n; i++) {
    var a = (i / n) * Math.PI * 2;
    v.push([Math.cos(a) * r, -hh, Math.sin(a) * r]);
  }
  var apex = v.length, ctr = v.length + 1;
  v.push([0, hh, 0]);
  v.push([0, -hh, 0]);
  for (var j = 0; j < n; j++) {
    var k = (j + 1) % n;
    f.push([j, k, apex]);
    f.push([ctr, k, j]);
  }
  return { vertices: v, faces: f };
}

/// Torus around the Y axis: meshTorus(1.4, 0.35, 20, 10).
function meshTorus(R, r, nu, nv) {
  nu = nu || 20;
  nv = nv || 10;
  var v = [], f = [];
  for (var i = 0; i < nu; i++) {
    var u = (i / nu) * Math.PI * 2;
    for (var j = 0; j < nv; j++) {
      var w = (j / nv) * Math.PI * 2;
      v.push([
        (R + r * Math.cos(w)) * Math.cos(u),
        r * Math.sin(w),
        (R + r * Math.cos(w)) * Math.sin(u),
      ]);
    }
  }
  for (var a = 0; a < nu; a++) {
    for (var b = 0; b < nv; b++) {
      var p = a * nv + b;
      var q = ((a + 1) % nu) * nv + b;
      var p2 = a * nv + ((b + 1) % nv);
      var q2 = ((a + 1) % nu) * nv + ((b + 1) % nv);
      f.push([p, q, q2]);
      f.push([p, q2, p2]);
    }
  }
  return { vertices: v, faces: f };
}

/// Bakes scale/rotate(deg, X→Y→Z)/translate into a mesh's vertices and sets
/// its color: meshXform(meshCube(1,1,1), {color:'#7c3aed', scale:[2,1,1],
/// rotate:{y:30}, translate:[0,0.5,0]}).
function meshXform(m, o) {
  o = o || {};
  var s = o.scale == null ? [1, 1, 1] : (typeof o.scale === 'number' ? [o.scale, o.scale, o.scale] : o.scale);
  var rot = o.rotate || {};
  var rx = (rot.x || 0) * Math.PI / 180;
  var ry = (rot.y || 0) * Math.PI / 180;
  var rz = (rot.z || 0) * Math.PI / 180;
  var t = o.translate || [0, 0, 0];
  var cx = Math.cos(rx), sx = Math.sin(rx);
  var cy = Math.cos(ry), sy = Math.sin(ry);
  var cz = Math.cos(rz), sz = Math.sin(rz);
  var out = [];
  for (var i = 0; i < m.vertices.length; i++) {
    var p = m.vertices[i];
    var x = p[0] * s[0], y = p[1] * s[1], z = p[2] * s[2];
    var y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    var x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
    var x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;
    out.push([x3 + t[0], y3 + t[1], z2 + t[2]]);
  }
  return { vertices: out, faces: m.faces, color: o.color || m.color };
}

/// Sets just the color (keeps geometry reference).
function meshTint(m, color) {
  return { vertices: m.vertices, faces: m.faces, color: color };
}

// ---- Voxel letters (minecraft-style block typography) -------------------------
//
// 5x7 pixel-font patterns; voxelLetterMesh builds one merged mesh per letter
// (cubes of size v, extruded `depth` along z), so a word is placed/animated
// per letter with meshXform. Used by the Hollywood-sign world, the flying
// banner and the rally poster.

var VOXEL_FONT = {
  Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  C: ['.XXX.', 'X...X', 'X....', 'X....', 'X....', 'X...X', '.XXX.'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  I: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', 'XXXXX'],
  P: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X....', 'X....', 'X....'],
};

/// One merged voxel mesh for a letter: voxelLetterMesh('Y', 0.2, 0.12, '#fff')
/// Local origin: letter starts at (0,0,0) and extends +x (5*v), -y (7*v).
function voxelLetterMesh(ch, v, depth, color) {
  var rows = VOXEL_FONT[ch];
  if (!rows) return null;
  var verts = [], faces = [];
  for (var r = 0; r < rows.length; r++) {
    for (var c = 0; c < rows[r].length; c++) {
      if (rows[r].charAt(c) !== 'X') continue;
      var cube = meshCube(v, v, depth);
      for (var i = 0; i < cube.vertices.length; i++) {
        var p = cube.vertices[i];
        verts.push([p[0] + c * v, p[1] - r * v, p[2]]);
      }
      var base = verts.length - cube.vertices.length;
      for (var j = 0; j < cube.faces.length; j++) {
        faces.push([cube.faces[j][0] + base, cube.faces[j][1] + base, cube.faces[j][2] + base]);
      }
    }
  }
  return { vertices: verts, faces: faces, color: color };
}

/// Width of a voxel word in world units (letters + 1-voxel gap).
function voxelWordWidth(text, v) {
  return text.length * 6 * v - v;
}
