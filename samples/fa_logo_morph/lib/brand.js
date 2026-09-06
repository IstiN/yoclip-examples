// Shared helpers for the Fa logo morph.
//
// All brand geometry lives in ONE coordinate system — the 1024x1024
// `icon_light.svg` viewBox — so every piece (tile, chevron, underscore,
// F, a) is placed through the same svg→screen mapper and the morph stays
// continuous even while the scale breathes.
//
// Design language (v3): the tile is a dark-glass app icon that stays on
// stage for the whole film — the morph happens INSIDE it, and the final
// wordmark composes the finished icon. Stroke-like shapes are built the
// way a type designer would draw them: round-capped strokes and true
// capsules, with the brand gradient tiled by square strips and closed by
// semicircular caps.

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
  // The tile the glyph lives in (01 — the app icon). It never leaves:
  // icon beats, morph and wordmark all compose inside one surface.
  tile: { x: 16, y: 16, w: 992, h: 992, rx: 224 },
  // Chevron `>_` — two strokes meeting at the right vertex.
  chevron: { sw: 48, a1: [280, 434, 492, 541], a2: [492, 541, 280, 648] },
  // Teal underscore — a gradient capsule (square strips + semicircular
  // caps); it glides up-left to become the F's accent bar.
  under: { x: 512, y: 712, w: 248, h: 38 },
  // F — stem + top bar as ONE round-capped stroke path, plus the teal
  // accent bar. The wordmark is laid out so its center matches the tile
  // center (svg 512): the film anchors the tile center for its entire run,
  // so the icon and the finished wordmark share one composition.
  f: {
    stemX: 266, topX2: 550, top: 372, bottom: 716, w: 48,
    accent: { x: 266, y: 545, w: 212, h: 38 },
  },
  // a — bowl (drawn arc) + stem, teal.
  a: { bowl: { cx: 638, cy: 640, r: 82 }, stem: { x: 739, y: 558, h: 164 } },
  // The anchor: the tile center, pinned at screen center for the whole film.
  anchor: [512, 512],
};

/// Teal gradient of the underscore/accent sampled at svg-x.
function tealField(xSvg) {
  var t = (xSvg - BRAND.under.x) / BRAND.under.w;
  return lerpColor('#2EBD9E', '#48C7E8', t);
}

// ---- The svg→screen mapper -------------------------------------------------
// Scene code sets `mapper` every frame (see the scene file): k = svg→screen
// scale, ax/ay = the svg point pinned at screen (sx, sy).
var mapper = { k: 0.371, ax: 512, ay: 512, sx: 960, sy: 540 };

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

/// A filled polygon in svg coords, flattened into the renderer's relative
/// point format (points rebased to the node's top-left).
function flatPoly(pts, fill, opacity) {
  var flat = [];
  var minX, minY;
  for (var i = 0; i < pts.length; i++) {
    var p = brandToScreen(pts[i].x, pts[i].y);
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
    fill: fill,
    opacity: opacity,
    positioned: { left: minX, top: minY },
  };
}

/// Semicircular end cap for a stroke-like bar: closes an end face whose
/// half-direction is `e` (unit vector along the edge from the center),
/// bulging along the outward normal `o`. 13 arc points — chord error under
/// 0.3 svg at brand radii, invisible on screen. Same flat color as the bar
/// end, so the union is seamless.
function capArc(cx, cy, r, e, o, fill, opacity) {
  function norm(v) {
    var l = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / l, y: v.y / l };
  }
  function adist(a, b) {
    var d = Math.abs(a - b) % (2 * Math.PI);
    return d > Math.PI ? 2 * Math.PI - d : d;
  }
  var en = norm(e), on = norm(o);
  var a0 = Math.atan2(en.y, en.x);
  var aOut = Math.atan2(on.y, on.x);
  // Sweep a half-turn from the edge direction; pick the rotation whose
  // midpoint passes through the outward normal.
  var s = adist(a0 + Math.PI / 2, aOut) < adist(a0 - Math.PI / 2, aOut) ? 1 : -1;
  var pts = [];
  for (var i = 0; i <= 12; i++) {
    var th = a0 + s * Math.PI * i / 12;
    pts.push({ x: cx + r * Math.cos(th), y: cy + r * Math.sin(th) });
  }
  return flatPoly(pts, fill, opacity);
}

/// Stroke-drawing path node (the motion_shapes `trace` contract): the box is
/// (pathBounds + stroke) so the painter's fit-to-box lands at exactly k.
function trace(d, sw, bx, by, bw, bh, progress, color, opacity) {
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
    opacity: opacity == null ? 1 : opacity,
    positioned: { left: origin.x - sk / 2, top: origin.y - sk / 2 },
  };
}

/// The mitered chevron: one filled `>` shape split along the exact miter
/// edge into an upper and a lower half. The halves share the miter segment
/// vertex-for-vertex, so the joint has no gap and no notch (two butt-capped
/// strokes meeting at the vertex always leave both). `split` translates the
/// halves apart vertically — the morph's arm separation — opening only the
/// shared seam. The free arm ends get semicircular caps (round terminals,
/// like every other stroke in the system).
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
  function shifted(pts, dy) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      out.push({ x: pts[i].x, y: pts[i].y + dy });
    }
    return out;
  }
  var upper = flatPoly(shifted([B, Mout, Min, A], -split), upperColor, 1);
  var lower = flatPoly(shifted([Mout, F2, F1, Min], split), lowerColor, 1);
  // Round terminals on the free ends: each cap bulges along the arm's
  // outward normal (perpendicular to the angled end face).
  var capU = capArc(S.x, S.y - split, half, n1, { x: -d1.x, y: -d1.y },
    upperColor, 1);
  var capL = capArc(E.x, E.y + split, half, n2, d2, lowerColor, 1);
  return [upper, capU, lower, capL];
}

/// The teal gradient bar — underscore slot (m=0) morphing to the F accent
/// slot (m=1); the scene tweens m. Square strips tile the gradient and
/// semicircular caps close the ends, so the bar reads as ONE rounded
/// capsule while keeping its brand gradient. Strip/cap colors stay pinned
/// per index (sampled on the underscore span), so nothing swims mid-morph.
/// Strips overdraw 0.8 svg — float rounding must never open a hairline.
function tealBar(m, opacity) {
  var kids = [];
  var n = 10;
  var h = BRAND.under.h;
  var r = h / 2;
  var x0 = lerp(BRAND.under.x, BRAND.f.accent.x, m);
  var x1 = x0 + lerp(BRAND.under.w, BRAND.f.accent.w, m);
  var cy = lerp(BRAND.under.y, BRAND.f.accent.y, m) + r;
  var cx0 = x0 + r, cx1 = x1 - r;
  var w0 = BRAND.under.w / n;
  var stripW = (cx1 - cx0) / n;
  for (var i = 0; i < n; i++) {
    var sx = cx0 + (i + 0.5) * stripW;
    var pt = brandToScreen(sx, cy);
    kids.push({
      type: 'rect',
      width: (stripW + 0.8) * mapper.k,
      height: h * mapper.k,
      radius: 0,
      fill: tealField(BRAND.under.x + (i + 0.5) * w0),
      opacity: opacity,
      positioned: {
        left: pt.x - (stripW + 0.8) * mapper.k / 2,
        top: pt.y - r * mapper.k,
      },
    });
  }
  kids.push(capArc(cx0, cy, r, { x: 0, y: 1 }, { x: -1, y: 0 },
    tealField(BRAND.under.x), opacity));
  kids.push(capArc(cx1, cy, r, { x: 0, y: 1 }, { x: 1, y: 0 },
    tealField(BRAND.under.x + BRAND.under.w), opacity));
  return kids;
}

/// The F stem + top bar as ONE round-capped, round-joined stroke — a real
/// letterform: rounded terminals, rounded elbow, sharp inner corner, and
/// not a single seam (flat brand blue). `progress` writes it on: up the
/// stem, then right across the top bar — the same write-on language the
/// `a` uses.
function fPathNode(progress, color, opacity) {
  var f = BRAND.f;
  var hw = f.w / 2;
  var d = 'M' + (f.stemX + hw) + ',' + (f.bottom - hw) +
    ' L' + (f.stemX + hw) + ',' + (f.top + hw) +
    ' L' + (f.topX2 - hw) + ',' + (f.top + hw);
  return trace(d, f.w, f.stemX, f.top, f.topX2 - f.stemX,
    f.bottom - f.top, progress, color, opacity);
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
