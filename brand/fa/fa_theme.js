// fa_theme.js — dark/light theme resolver for Fa-branded videos.
//
// Reads the active video variant (`yoclipVariant.params.mode`, default
// 'dark') and returns a complete surface/text/accent palette built on the
// strict Fa brand colors. Both themes keep Royal Violet + Emerald Teal
// accents; only surfaces and text invert.
//
// Usage in any scene:
//   var T = faTheme();            // {bg, surface, surface2, card, border,
//                                 //  text, dim, faint, violet, violetDeep,
//                                 //  teal, tealBright, name, isLight}
//   var F = faFormat();           // {W, H, cx, cy, portrait, landscape, aspect}
//
// Opacity rule: values pushed into `opacity` fields must stay within
// [0.0, 1.0] — clamp anything that passes through easing overshoot.

function faTheme() {
  var mode = 'dark';
  try {
    if (typeof yoclipVariant !== 'undefined' && yoclipVariant &&
        yoclipVariant.mode) {
      mode = String(yoclipVariant.mode);
    }
  } catch (e) { /* keep dark default */ }

  var DARK = {
    bg: '#070a12',
    surface: '#0C1322',
    surface2: '#101522',
    card: '#0B0F19',
    border: '#1E2638',
    text: '#FFFFFF',
    dim: '#9E9EA8',
    faint: '#7A8CB6',
    violet: '#8F6BFF',
    violetDeep: '#5B61F6',
    violetPale: '#C9B8FF',
    teal: '#2EBD9E',
    tealBright: '#5CE8CF',
    tealDeep: '#1E826C',
    shadow: '#000000',
  };

  var LIGHT = {
    bg: '#F5F5F7',
    surface: '#FFFFFF',
    surface2: '#ECECEF',
    card: '#FFFFFF',
    border: '#D9DCE3',
    text: '#0B0F19',
    dim: '#5A6070',
    faint: '#8A90A2',
    violet: '#5B61F6',
    violetDeep: '#4A46E0',
    violetPale: '#7B6FF0',
    teal: '#1E826C',
    tealBright: '#2EBD9E',
    tealDeep: '#166B58',
    shadow: '#3A3F4E',
  };

  var t = (mode === 'light') ? LIGHT : DARK;
  t.name = mode === 'light' ? 'light' : 'dark';
  t.isLight = t.name === 'light';
  t.isDark = !t.isLight;
  return t;
}

// faFormat — canvas + orientation helper built on the engine-provided
// `yoclipFormat` (which already follows the active variant's resolution).
function faFormat() {
  var f = (typeof yoclipFormat !== 'undefined' && yoclipFormat)
      ? yoclipFormat
      : { width: 1920, height: 1080, aspect: 16 / 9,
          orientation: 'landscape' };
  var W = f.width;
  var H = f.height;
  var portrait = f.orientation === 'portrait';
  return {
    W: W, H: H, aspect: W / H,
    cx: W / 2, cy: H / 2,
    portrait: portrait,
    landscape: !portrait && W > H,
  };
}

// faRRect / faText — tiny typed builders keep scene code terse.
function faRRect(w, h, r, fill, opts) {
  var o = opts || {};
  var node = {
    type: 'rect',
    width: w,
    height: h,
    radius: r,
    fill: fill,
  };
  if (o.border) node.border = o.border;
  if (o.opacity != null) node.opacity = o.opacity;
  if (o.blur != null) node.blur = o.blur;
  if (o.positioned) node.positioned = o.positioned;
  if (o.offsetY != null) node.offsetY = o.offsetY;
  if (o.scale != null) node.scale = o.scale;
  return node;
}

function faText(text, opts) {
  var o = opts || {};
  var node = {
    type: 'text',
    text: text,
    style: o.style || {},
  };
  if (o.width != null) node.width = o.width;
  if (o.opacity != null) node.opacity = o.opacity;
  if (o.positioned) node.positioned = o.positioned;
  if (o.offsetY != null) node.offsetY = o.offsetY;
  if (o.offsetX != null) node.offsetX = o.offsetX;
  return node;
}
