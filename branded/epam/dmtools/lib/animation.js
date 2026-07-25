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
