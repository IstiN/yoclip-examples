// Shared helpers for the Fa logo morph.
//
// All brand geometry lives in ONE coordinate system — the 1024x1024
// `icon_light.svg` viewBox — so every piece (tile, chevron, underscore,
// F, a) is placed through the same svg→screen mapper and the morph stays
// continuous even while scale and anchor animate.

/// Scene-local elapsed milliseconds — the unit jsr.motion speaks natively.
function elapsedMs(frame, fps) {
  return frame * 1000 / fps;
}

/// Deterministic pseudo-random in [0,1) — stable across renders.
function prand(i) {
  var x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/// Linear interpolation between two numbers.
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/// Linear '#rrggbb' interpolation.
function lerpColor(a, b, t) {
  t = jsr.motion.clamp(t, 0, 1);
  function hex(c) {
    return [
      parseInt(c.slice(1, 3), 16),
      parseInt(c.slice(3, 5), 16),
      parseInt(c.slice(5, 7), 16),
    ];
  }
  var ca = hex(a);
  var cb = hex(b);
  function h(v) {
    return Math.round(v).toString(16).padStart(2, '0');
  }
  return '#' + h(ca[0] + (cb[0] - ca[0]) * t) +
    h(ca[1] + (cb[1] - ca[1]) * t) +
    h(ca[2] + (cb[2] - ca[2]) * t);
}

// ---- Brand geometry (icon_light.svg units) --------------------------------

var BRAND = {
  // The tile the glyph lives in (01 — the app icon).
  tile: { x: 0, y: 0, w: 1024, h: 1024, rx: 224, edge: 32 },
  // Chevron `>_` — two strokes meeting at the right vertex.
  chevron: { sw: 48, a1: [280, 434, 492, 541], a2: [492, 541, 280, 648] },
  // Teal underscore — a gradient bar (sampled by vertical strips).
  under: { x: 512, y: 712, w: 248, h: 38 },
  // F — stem + top bar (blue), accent bar (teal, the underscore's target).
  f: {
    stem: { x: 388, y: 372, w: 48, h: 344 },
    top: { x: 388, y: 372, w: 284, h: 48 },
    accent: { x: 388, y: 545, w: 212, h: 38 },
  },
  // a — bowl (drawn arc) + stem, teal.
  a: { bowl: { cx: 760, cy: 640, r: 82 }, stem: { x: 861, y: 558, h: 164 } },
  // Anchor points: the glyph's own center, and the finished wordmark's.
  glyphCenter: [520, 592],
  wordmarkCenter: [634, 547],
};

/// Teal gradient of the underscore/accent sampled at svg-x.
function tealField(xSvg) {
  var t = (xSvg - BRAND.under.x) / BRAND.under.w;
  return lerpColor('#2EBD9E', '#48C7E8', t);
}

/// The underscore (or the F accent it becomes) as gradient strips.
/// `m` 0 = underscore slot, 1 = F-accent slot (scene tweens it); positions
/// lerp between the two slots. Gradient samples stay pinned per slot index,
/// so the bar reads as one continuous teal gradient through the morph.
function tealBar(m, opacity) {
  var strips = [];
  var n = 6;
  var w0 = BRAND.under.w / n;
  var w1 = BRAND.f.accent.w / n;
  for (var i = 0; i < n; i++) {
    var w = w0 + (w1 - w0) * m;
    var y = BRAND.under.y + (BRAND.f.accent.y - BRAND.under.y) * m;
    var x = lerp(BRAND.under.x, BRAND.f.accent.x, m) + i * w;
    var pt = brandToScreen(x + w / 2, y + BRAND.under.h / 2);
    strips.push({
      type: 'rect',
      // +0.8 svg of overlap kills the hairline seams between strips.
      width: (w + 0.8) * mapper.k,
      height: BRAND.under.h * mapper.k,
      // Square strips tile into ONE solid gradient bar — per-strip rounding
      // leaves corner notches at every seam (read as beads).
      radius: 0,
      fill: tealField(BRAND.under.x + (i + 0.5) * w0),
      opacity: opacity,
      positioned: {
        left: pt.x - (w + 0.8) * mapper.k / 2,
        top: pt.y - (BRAND.under.h / 2) * mapper.k,
      },
    });
  }
  return strips;
}

// ---- The svg→screen mapper -------------------------------------------------
// Scene code sets `mapper` every frame (see the scene file): k = svg→screen
// scale, ax/ay = the svg point pinned at screen (sx, sy).
var mapper = { k: 0.371, ax: 520, ay: 592, sx: 960, sy: 540 };

function setMapper(k, ax, ay, sx, sy) {
  mapper.k = k;
  mapper.ax = ax;
  mapper.ay = ay;
  mapper.sx = sx;
  mapper.sy = sy;
}

function brandToScreen(x, y) {
  return {
    x: mapper.sx + (x - mapper.ax) * mapper.k,
    y: mapper.sy + (y - mapper.ay) * mapper.k,
  };
}

/// Stroke-drawing path node (the motion_shapes `trace` contract): the box is
/// (pathBounds + stroke) so the painter's fit-to-box lands at exactly k.
function trace(d, sw, bx, by, bw, bh, progress, color) {
  var sk = sw * mapper.k;
  var origin = brandToScreen(bx, by);
  return {
    type: 'path',
    path: d,
    color: color,
    strokeWidth: sk,
    progress: progress,
    width: (bw + sw) * mapper.k,
    height: (bh + sw) * mapper.k,
    positioned: { left: origin.x - sk / 2, top: origin.y - sk / 2 },
  };
}

/// The mitered chevron: one filled `>` shape split along the exact miter
/// edge into an upper and a lower half. The halves share the miter segment
/// vertex-for-vertex, so the joint has no gap and no notch (two butt-capped
/// strokes meeting at the vertex always leave both). `split` translates the
/// halves apart vertically — the morph's arm separation — opening only the
/// shared seam.
function chevronHalves(split, upperColor, lowerColor) {
  var half = BRAND.chevron.sw / 2;
  var S = { x: BRAND.chevron.a1[0], y: BRAND.chevron.a1[1] };
  var V = { x: BRAND.chevron.a1[2], y: BRAND.chevron.a1[3] };
  var E = { x: BRAND.chevron.a2[2], y: BRAND.chevron.a2[3] };
  function unit(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, l = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / l, y: dy / l };
  }
  function perp(d) { return { x: -d.y, y: d.x }; }
  function off(p, n, s) { return { x: p.x + n.x * s, y: p.y + n.y * s }; }
  function isect(p, v, q, w) {
    var t = ((q.x - p.x) * w.y - (q.y - p.y) * w.x) /
      (v.x * w.y - v.y * w.x);
    return { x: p.x + v.x * t, y: p.y + v.y * t };
  }
  var d1 = unit(S, V), d2 = unit(V, E), n1 = perp(d1), n2 = perp(d2);
  // End-face corners of the two strokes.
  var B = off(S, n1, -half), A = off(S, n1, half);       // A1 start
  var D = off(V, n1, -half), C = off(V, n1, half);       // A1 end @vertex
  var E1 = off(V, n2, -half), E2 = off(V, n2, half);     // A2 start @vertex
  var F2 = off(E, n2, -half), F1 = off(E, n2, half);     // A2 end
  // Miter points: outer = A1 upper edge x A2 lower edge; inner = the other
  // pair. (n2 points up-left, so A2's lower edge passes through E1.)
  var Mout = isect(D, d1, E1, d2);
  var Min = isect(C, d1, E2, d2);
  function poly(pts, color, dy) {
    var flat = [];
    var minX, minY;
    for (var i = 0; i < pts.length; i++) {
      var p = brandToScreen(pts[i].x, pts[i].y + dy);
      if (minX == null || p.x < minX) minX = p.x;
      if (minY == null || p.y < minY) minY = p.y;
      flat.push(p.x, p.y);
    }
    for (var j = 0; j < flat.length; j += 2) {
      flat[j] -= minX;
      flat[j + 1] -= minY;
    }
    return {
      type: 'polygon',
      points: flat,
      fill: color,
      opacity: 1,
      positioned: { left: minX, top: minY },
    };
  }
  return [
    poly([B, Mout, Min, A], upperColor, -split),
    poly([Mout, F2, F1, Min], lowerColor, split),
  ];
}

// ---- The F: one vertical gradient, cut into aligned y-bands ---------------
// Stem and top bar sample the SAME band table, so wherever the pieces touch
// (the corner) the colors match exactly — no seam, no color break. Bands are
// fine enough (12 over the stem) that adjacent bands differ imperceptibly.
var F_GRAD = { y0: 372, y1: 716, top: '#6C74FF', bottom: '#4353F2', bands: 12 };

function fBandColor(bi) {
  return lerpColor(F_GRAD.top, F_GRAD.bottom, (bi + 0.5) / F_GRAD.bands);
}

/// Draws the x/w column of the F gradient between svg y0..y1. Pieces overlap
/// the shared band colors; each band overdraws 0.75 svg downward so float
/// rounding never opens a hairline between bands.
function pushFRect(kids, x, w, y0, y1, opacity) {
  var bh = (F_GRAD.y1 - F_GRAD.y0) / F_GRAD.bands;
  var b0 = Math.max(0, Math.floor((y0 - F_GRAD.y0) / bh));
  var b1 = Math.min(F_GRAD.bands, Math.ceil((y1 - F_GRAD.y0) / bh));
  for (var bi = b0; bi < b1; bi++) {
    var by0 = F_GRAD.y0 + bi * bh;
    var cy0 = Math.max(by0, y0);
    var cy1 = Math.min(by0 + bh, y1);
    if (cy1 - cy0 < 0.01) continue;
    var h = cy1 - cy0 + (bi < b1 - 1 ? 0.75 : 0);
    var pt = brandToScreen(x + w / 2, (cy0 + cy1) / 2);
    kids.push({
      type: 'rect',
      width: w * mapper.k,
      height: h * mapper.k,
      radius: 0,
      fill: fBandColor(bi),
      opacity: opacity,
      positioned: {
        left: pt.x - (w / 2) * mapper.k,
        top: pt.y - (h / 2) * mapper.k,
      },
    });
  }
}

/// A horizontal streak: thin rounded rect flying right from svg point
/// (x, y), `len` svg-units long at peak.
function streak(i, ySvg, xSvg, lenSvg, thick, color, frame, fps, at, dur, dir) {
  var ms = elapsedMs(frame, fps);
  var p = jsr.motion.tween(ms, at * 1000 / fps, dur * 1000 / fps, 0, 1, 'easeOutCubic');
  if (p <= 0 || p >= 1) return null;
  var d = dir == null ? 1 : dir;
  var pt = brandToScreen(xSvg, ySvg);
  var len = lenSvg * mapper.k * (0.35 + 0.65 * p);
  return {
    type: 'rect',
    width: len,
    height: thick,
    radius: thick / 2,
    fill: color,
    opacity: (1 - p) * 0.9,
    positioned: { left: pt.x + d * p * 240, top: pt.y - thick / 2 },
  };
}
