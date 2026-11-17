// Shared deterministic animation and scene-graph primitives for WRITE THE LIGHT.
// No wall clock, browser DOM, random state or platform APIs are used:
// render(frame) is pure and arbitrary seeks match sequential export.

// ---- Motion -----------------------------------------------------------------

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * clamp(t, 0, 1); }
function seg(frame, start, end) {
  if (end <= start) return frame >= end ? 1 : 0;
  return clamp((frame - start) / (end - start), 0, 1);
}
function ei3(t) { return t * t * t; }
function eo3(t) { var u = 1 - clamp(t, 0, 1); return 1 - u * u * u; }
function eio3(t) {
  t = clamp(t, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function eo4(t) { var u = 1 - clamp(t, 0, 1); return 1 - u * u * u * u; }
function eoExpo(t) { t = clamp(t, 0, 1); return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function eoBack(t) {
  var c1 = 1.70158;
  var c3 = c1 + 1;
  t = clamp(t, 0, 1);
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function ease(frame, start, end, fn) { return fn(seg(frame, start, end)); }
function presence(frame, fadeInFrames, holdFrames, fadeOutFrames) {
  var a = eo3(seg(frame, 0, fadeInFrames));
  var b = seg(frame, fadeInFrames + holdFrames, fadeInFrames + holdFrames + fadeOutFrames);
  return a * (1 - b);
}
function sceneLife(frame, duration) { return presence(frame, 12, duration - 36, 24); }
function fadeIn(frame, duration) { return eo3(seg(frame, 0, duration)); }
function fadeOut(frame, end, duration) { return 1 - eo3(seg(frame, end - duration, end)); }
function riseIn(frame, duration, from) { return from * (1 - eo3(seg(frame, 0, duration))); }
function pop(frame, start, duration) {
  var t = seg(frame, start, start + duration);
  return { scale: eoBack(t), opacity: eo3(t) };
}
function staggerItem(frame, index, start, delay, duration) {
  return seg(frame, start + index * delay, start + index * delay + duration);
}
function shimmer(frame, period) {
  var p = period || 60;
  var x = (frame % p) / p;
  return 1 - Math.abs(x * 2 - 1);
}
function float(frame, amplitude, speed, phase) {
  return Math.sin(frame * (speed || 0.05) + (phase || 0)) * amplitude;
}
function blink(frame, period) { return Math.floor(frame / period) % 2 === 0 ? 1 : 0; }
function counter(frame, start, duration, from, to) {
  return Math.round(lerp(from, to, eo3(seg(frame, start, start + duration))));
}
function typewriter(text, frame, start, cps) {
  var count = Math.floor((frame - start) * (cps || 42) / 30);
  return text.slice(0, clamp(count, 0, text.length));
}
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
function pad(value, width) {
  var s = String(value);
  while (s.length < width) s = '0' + s;
  return s;
}
function timecode(frame, fps) {
  var f = Math.max(0, Math.floor(frame));
  var rate = fps || 30;
  var ff = f % rate;
  var seconds = Math.floor(f / rate);
  var ss = seconds % 60;
  var mm = Math.floor(seconds / 60) % 60;
  var hh = Math.floor(seconds / 3600);
  return pad(hh, 2) + ':' + pad(mm, 2) + ':' + pad(ss, 2) + ':' + pad(ff, 2);
}

// ---- Theme + node decorators -------------------------------------------------

function yoclipColor(key, fallback) {
  var theme = typeof yoclipTheme !== 'undefined' && yoclipTheme ? yoclipTheme : {};
  return (theme.colors && theme.colors[key]) || fallback;
}
function yoclipFont() {
  var theme = typeof yoclipTheme !== 'undefined' && yoclipTheme ? yoclipTheme : {};
  return (theme.font && theme.font.family) || 'Source Sans 3';
}
function yoclipLogoSource() { return 'external:logo'; }
function alphaColor(hex, opacity) {
  var h = (hex || '#000000').replace('#', '');
  if (h.length === 8) h = h.slice(2);
  var a = Math.round(clamp(opacity, 0, 1) * 255).toString(16);
  if (a.length < 2) a = '0' + a;
  return '#' + a + h;
}
function decorate(node, o) {
  o = o || {};
  var keys = [
    'alignment', 'offsetX', 'offsetY', 'opacity', 'scale', 'rotation',
    'rotateX', 'rotateY', 'width', 'height', 'margin', 'padding', 'blur',
    'positioned', 'fit', 'textAlign', 'clip', 'mainAxisSize',
  ];
  for (var i = 0; i < keys.length; i++) {
    if (o[keys[i]] !== undefined) node[keys[i]] = o[keys[i]];
  }
  return node;
}
function txt(value, o) {
  o = o || {};
  var family = yoclipFont();
  if (!o.font && (o.fontWeight || 400) >= 600 && family === 'Source Sans 3') {
    family = 'Source Sans 3 Bold';
  }
  var style = {
    fontSize: o.fontSize || 32,
    color: o.color || yoclipColor('text', '#ffffff'),
    fontFamily: o.font || family,
  };
  var styleKeys = ['fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'shadows'];
  for (var i = 0; i < styleKeys.length; i++) {
    if (o[styleKeys[i]] !== undefined) style[styleKeys[i]] = o[styleKeys[i]];
  }
  return decorate({ type: 'text', text: value, style: style }, o);
}
function box(o) {
  o = o || {};
  var node = { type: 'container' };
  var keys = [
    'color', 'gradient', 'borderRadius', 'borderColor', 'borderWidth',
    'shadow', 'child', 'stroke', 'strokeWidth',
  ];
  for (var i = 0; i < keys.length; i++) {
    if (o[keys[i]] !== undefined) node[keys[i]] = o[keys[i]];
  }
  return decorate(node, o);
}
function stack(children, o) {
  o = o || {};
  var node = { type: 'stack', fit: o.fit || 'expand', children: children };
  return decorate(node, o);
}
function row(children, o) {
  o = o || {};
  var node = {
    type: 'row',
    mainAxisAlignment: o.mainAxisAlignment || 'start',
    crossAxisAlignment: o.crossAxisAlignment || 'center',
    children: children,
  };
  if (o.spacing !== undefined) node.spacing = o.spacing;
  return decorate(node, o);
}
function column(children, o) {
  o = o || {};
  var node = {
    type: 'column',
    mainAxisAlignment: o.mainAxisAlignment || 'start',
    crossAxisAlignment: o.crossAxisAlignment || 'start',
    children: children,
  };
  if (o.spacing !== undefined) node.spacing = o.spacing;
  return decorate(node, o);
}
function spacer(width, height) { return box({ width: width, height: height }); }
function pathNode(path, o) {
  o = o || {};
  var node = {
    type: 'path',
    path: path,
    color: o.color || yoclipColor('text', '#ffffff'),
    strokeWidth: o.strokeWidth === undefined ? 2 : o.strokeWidth,
    width: o.width || 24,
    height: o.height || 24,
  };
  if (o.progress !== undefined) node.progress = o.progress;
  return decorate(node, o);
}
function imageNode(source, o) {
  o = o || {};
  return decorate({ type: 'image', source: source, fit: o.fit || 'contain' }, o);
}

// ---- Editorial components ----------------------------------------------------

function glass(o) {
  o = o || {};
  var surface = yoclipColor('surface', '#10101c');
  var deep = yoclipColor('backgroundDeep', '#030308');
  var node = {
    gradient: {
      type: 'linear',
      colors: [alphaColor(surface, o.fillOpacity === undefined ? 0.96 : o.fillOpacity), alphaColor(deep, 0.93)],
      begin: 'topLeft',
      end: 'bottomRight',
    },
    borderRadius: o.borderRadius === undefined ? 22 : o.borderRadius,
    borderColor: o.borderColor || alphaColor(yoclipColor('primaryLight', '#a78bfa'), 0.22),
    borderWidth: o.borderWidth === undefined ? 1 : o.borderWidth,
    shadow: o.shadow || { color: '#52000000', blur: 38, offsetX: 0, offsetY: 18 },
  };
  for (var k in o) {
    if (k !== 'fillOpacity') node[k] = o[k];
  }
  return box(node);
}
function pill(label, o) {
  o = o || {};
  var accent = o.accent || yoclipColor('primaryLight', '#a78bfa');
  return box({
    width: o.width,
    height: o.height || 44,
    padding: o.padding || { left: 18, right: 18 },
    color: o.color || alphaColor(accent, 0.10),
    borderRadius: 999,
    borderColor: o.borderColor || alphaColor(accent, 0.34),
    borderWidth: 1,
    alignment: o.alignment,
    offsetX: o.offsetX,
    offsetY: o.offsetY,
    opacity: o.opacity,
    scale: o.scale,
    child: row([
      o.dot ? box({ width: 7, height: 7, borderRadius: 4, color: accent, margin: { right: 10 } }) : spacer(0, 0),
      txt(label, {
        fontSize: o.fontSize || 15,
        color: o.textColor || accent,
        fontWeight: 700,
        letterSpacing: o.letterSpacing === undefined ? 2.2 : o.letterSpacing,
      }),
    ], { mainAxisAlignment: 'center', crossAxisAlignment: 'center', mainAxisSize: 'min' }),
  });
}
function arrowIcon(o) {
  o = o || {};
  return pathNode('M 3 12 L 21 12 M 14 5 L 21 12 L 14 19', {
    width: o.size || 24, height: o.size || 24,
    color: o.color || yoclipColor('accent', '#22d3ee'),
    strokeWidth: o.strokeWidth || 2.2,
    margin: o.margin, alignment: o.alignment, opacity: o.opacity,
    offsetX: o.offsetX, offsetY: o.offsetY,
  });
}
function checkIcon(o) {
  o = o || {};
  return pathNode('M 5 13 L 11 19 L 22 6', {
    width: o.size || 24, height: o.size || 24,
    color: o.color || yoclipColor('good', '#34d399'),
    strokeWidth: o.strokeWidth || 3,
    alignment: o.alignment, opacity: o.opacity, scale: o.scale,
  });
}
function playIcon(o) {
  o = o || {};
  return pathNode('M 8 4 L 21 12 L 8 20 Z', {
    width: o.size || 24, height: o.size || 24,
    color: o.color || '#ffffff', strokeWidth: o.strokeWidth || 2,
    alignment: o.alignment, opacity: o.opacity,
  });
}
function chromeDot(color, left) {
  return box({ width: 11, height: 11, borderRadius: 6, color: color, margin: { left: left || 0 } });
}
function windowBar(title, width, o) {
  o = o || {};
  return box({
    width: width,
    height: o.height || 58,
    color: o.color || '#661b1b2d',
    child: row([
      spacer(22, 0),
      chromeDot('#ff5f57'), chromeDot('#febc2e', 9), chromeDot('#28c840', 9),
      txt(title, {
        fontSize: o.fontSize || 17,
        color: o.titleColor || yoclipColor('textMuted', '#a1a1aa'),
        fontWeight: 600,
        letterSpacing: 0.7,
        margin: { left: 20 },
      }),
    ], { crossAxisAlignment: 'center' }),
  });
}
function progressBar(o) {
  var width = o.width;
  var height = o.height || 6;
  var p = clamp(o.progress, 0, 1);
  return box({
    width: width, height: height, borderRadius: height / 2,
    color: o.trackColor || alphaColor(yoclipColor('textMuted', '#a1a1aa'), 0.16),
    alignment: o.alignment, offsetX: o.offsetX, offsetY: o.offsetY, opacity: o.opacity,
    child: stack([
      box({
        width: width, height: height, borderRadius: height / 2, color: '#00000000',
      }),
      box({
        width: width * p, height: height, borderRadius: height / 2,
        gradient: {
          type: 'linear', colors: o.colors || [yoclipColor('primary', '#7c3aed'), yoclipColor('accent', '#22d3ee')],
          begin: 'centerLeft', end: 'centerRight',
        },
        alignment: 'centerLeft',
      }),
    ], { fit: 'expand' }),
  });
}
function cornerBrackets(width, height, color, progress) {
  var p = progress === undefined ? 1 : progress;
  var d = 'M 0 42 L 0 0 L 42 0 M ' + (width - 42) + ' 0 L ' + width + ' 0 L ' + width + ' 42 M ' + width + ' ' + (height - 42) + ' L ' + width + ' ' + height + ' L ' + (width - 42) + ' ' + height + ' M 42 ' + height + ' L 0 ' + height + ' L 0 ' + (height - 42);
  return pathNode(d, { width: width, height: height, color: color, strokeWidth: 2, progress: p });
}
function codeEditorNode(o) {
  var lines = o.lines || [];
  var body = [];
  var fs = o.codeFontSize || 22;
  var lineDelay = o.lineDelay === undefined ? 8 : o.lineDelay;
  var start = o.start || 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lineStart = start + i * lineDelay;
    var visible = o.type === false ? line.text : typewriter(line.text, o.frame, lineStart, o.cps || 96);
    var lineOpacity = eo3(seg(o.frame, lineStart, lineStart + 5));
    body.push(row([
      txt(pad(i + 1, 2), {
        width: 38, fontSize: fs - 3, color: '#66667a', textAlign: 'right',
      }),
      txt(visible.replace(/^\s+/, ''), {
        fontSize: fs,
        color: line.color || yoclipColor('text', '#ffffff'),
        letterSpacing: 0.3,
        lineHeight: 1.3,
        margin: { left: 20 + (line.indent || 0) * 25 },
        opacity: lineOpacity,
      }),
    ], {
      crossAxisAlignment: 'center',
      margin: { top: i === 0 ? 0 : (o.lineGap || 10) },
      opacity: lineOpacity,
    }));
  }
  return glass({
    width: o.width, height: o.height, clip: true,
    alignment: o.alignment, offsetX: o.offsetX, offsetY: o.offsetY,
    opacity: o.opacity, scale: o.scale, fillOpacity: o.fillOpacity === undefined ? 0.96 : o.fillOpacity,
    borderColor: o.borderColor,
    child: column([
      windowBar(o.title || 'scene.js', o.width, { titleColor: o.titleColor }),
      box({
        width: o.width, height: o.height - 58,
        alignment: 'topLeft', padding: { left: 22, top: o.bodyTop || 22 },
        child: column(body, { crossAxisAlignment: 'start' }),
      }),
    ], { crossAxisAlignment: 'stretch' }),
  });
}
function tinyMetric(label, value, o) {
  o = o || {};
  return column([
    txt(label, { fontSize: o.labelSize || 13, color: o.color || yoclipColor('textMuted', '#a1a1aa'), fontWeight: 700, letterSpacing: 2.2 }),
    txt(value, { fontSize: o.valueSize || 30, color: o.valueColor || yoclipColor('text', '#ffffff'), fontWeight: 700, margin: { top: 7 } }),
  ], { crossAxisAlignment: o.crossAxisAlignment || 'start', opacity: o.opacity });
}
