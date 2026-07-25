// EPAM 2023 dark-mode brand helpers, built on the animation.js globals.
// Loaded after lib/animation.js via project.js -> lib.

// Theme color with the brandbook hex as fallback (headless-safe).
function c(key) {
  var fallbacks = {
    night: '#060606', surface: '#161616', hairline: '#2a2a2a',
    snow: '#FBFAFA', muted: '#A0A0A0', sea: '#00F6FF',
    mint: '#00FFF0', lilac: '#B896FF', sky: '#7BA8FF',
  };
  return (typeof yoclipTheme !== 'undefined' && yoclipTheme.colors &&
    yoclipTheme.colors[key]) || fallbacks[key];
}

// The brand text gradient (dark mode, brandbook p62): Mint -> Sea -> Lilac.
function brandTextGradient() {
  return {
    colors: [c('mint'), c('sea'), c('lilac')],
    begin: 'centerLeft', end: 'centerRight',
  };
}

// Official `<epam>` wordmark — epam_logo_light.svg from epam.com, filled
// white, rasterized at 2400px with alpha (source SVG kept next to it).
// Aspect ratio 59:22 ≈ 2.68. `width` is the on-screen width in px.
function epamLogo(width, opacity, margin) {
  return {
    type: 'image',
    source: 'external:epam_logo',
    fit: 'contain',
    width: width,
    height: width / 2.6818,
    alignment: 'topLeft',
    margin: margin || { top: 52, left: 64 },
    opacity: opacity == null ? 1 : opacity,
  };
}

// Soft out-of-focus color glow — the brand's signature blur treatment
// (brandbook p52-57). Place inside a stack; melts into the black canvas.
// The radial gradient ends in full transparency so the container edge
// never shows.
function blurGlow(colors, w, h, opts) {
  opts = opts || {};
  var cols = colors.slice();
  cols.push('#00000000');
  var stops = [];
  for (var i = 0; i < cols.length; i++) stops.push(i / (cols.length - 1));
  return {
    type: 'container',
    width: w,
    height: h,
    alignment: opts.alignment || 'center',
    offsetX: opts.offsetX || 0,
    offsetY: opts.offsetY || 0,
    blur: opts.blur == null ? 130 : opts.blur,
    opacity: opts.opacity == null ? 0.5 : opts.opacity,
    gradient: { type: 'radial', colors: cols, stops: stops, radius: 0.5 },
  };
}

// 900 uppercase letter-spaced preheader label.
function preheader(text, color, fontSize, options) {
  var size = fontSize || 26;
  var out = {
    type: 'text',
    text: text,
    alignment: 'topLeft',
    offsetX: -size * 0.08,
    style: {
      fontFamily: 'Museo Sans 900',
      fontSize: size,
      color: color || c('sea'),
      letterSpacing: 6,
    },
  };
  if (options) {
    for (var k in options) {
      if (k === 'offsetX') out[k] = out[k] + options[k];
      else out[k] = options[k];
    }
  }
  return out;
}

// Museo Sans renders here so that a text's baseline sits at a fixed
// fraction of its line-box height from the bottom (empirically), not at a
// fixed offset from the font metrics. In a bottom-aligned mixed-size row,
// every text must therefore share the SAME line-box height. The easiest way
// is to set the biggest text's lineHeight to 1.2 (its natural box) and scale
// every smaller text up to that same box: lineHeight = 1.2 * rowMax / fs.
function blh(fs, rowMax) { return 1.2 * rowMax / fs; }

// Body text — Museo Sans 300. Left-aligned (brand rule), including wrapped
// and multi-line copies — textAlign defaults to center in the renderer.
function body(text, fontSize, color, lineHeight, options) {
  var out = {
    type: 'text',
    text: text,
    alignment: 'topLeft',
    textAlign: 'left',
    style: {
      fontFamily: 'Museo Sans 300',
      fontSize: fontSize || 30,
      color: color || c('muted'),
      lineHeight: lineHeight || 1.35,
    },
  };
  if (options) {
    for (var k in options) {
      if (k === 'style') { for (var sk in options[k]) out.style[sk] = options[k][sk]; }
      else out[k] = options[k];
    }
  }
  return out;
}

// Headline line — Museo Sans 100, airy. `gradient: true` paints the glyphs
// with the brand text gradient (reserve for ONE keyword/phrase per headline).
// Pass lineHeight = blh(fontSize) inside bottom-aligned mixed-size rows.
function headline(text, fontSize, gradient, lineHeight, options) {
  var style = {
    fontFamily: 'Museo Sans 100',
    fontSize: fontSize || 130,
    color: c('snow'),
    lineHeight: lineHeight || 1.04,
  };
  if (gradient) style.gradient = brandTextGradient();
  // Trim the font's left side-bearing so headlines visually start at the
  // intended left edge (used across almost every scene).
  var out = {
    type: 'text',
    text: text,
    alignment: 'topLeft',
    textAlign: 'left',
    style: style,
    offsetX: -(fontSize || 130) * 0.09,
  };
  if (options) {
    for (var k in options) {
      if (k === 'offsetX') out[k] = out[k] + options[k];
      else if (k === 'style') { for (var sk in options[k]) out.style[sk] = options[k][sk]; }
      else out[k] = options[k];
    }
  }
  return out;
}

// Emphasis text — Museo Sans 500.
function emphasis(text, fontSize, color, lineHeight, options) {
  var size = fontSize || 30;
  var out = {
    type: 'text',
    text: text,
    alignment: 'topLeft',
    offsetX: -size * 0.08,
    style: {
      fontFamily: 'Museo Sans 500',
      fontSize: size,
      color: color || c('snow'),
      lineHeight: lineHeight || 1.25,
    },
  };
  if (options) {
    for (var k in options) {
      if (k === 'offsetX') out[k] = out[k] + options[k];
      else if (k === 'style') { for (var sk in options[k]) out.style[sk] = options[k][sk]; }
      else out[k] = options[k];
    }
  }
  return out;
}

// A thin hairline rule that draws horizontally (width animates 0 -> w).
function ruleDraw(frame, start, dur, w, color, offsetX) {
  var t = eo3(seg(frame, start, start + dur));
  return {
    type: 'container',
    width: Math.max(1, lerp(0, w, t)),
    height: 3,
    alignment: 'topLeft',
    offsetX: offsetX || 0,
    color: color || c('sea'),
  };
}

// Fade + rise entrance pair for a node: returns { opacity, offsetY }.
function enter(frame, start, dur, rise) {
  var t = eo3(seg(frame, start, start + dur));
  return { opacity: t, offsetY: lerp(rise || 40, 0, t) };
}

// Apply an {opacity, offsetY} entrance to a node (shallow copy).
function withEnter(node, e) {
  var out = {};
  for (var k in node) out[k] = node[k];
  out.opacity = (node.opacity == null ? 1 : node.opacity) * e.opacity;
  out.offsetY = (node.offsetY || 0) + e.offsetY;
  return out;
}
