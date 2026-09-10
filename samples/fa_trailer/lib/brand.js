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

/// Clamps value strictly to [0.0, 1.0].
function clamp01(v) {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  return v;
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
  // The `>` is inscribed in an invisible square: with the vertex at 478 its
  // full visual bbox (caps + miter tip) is a 246.6 x 246.6 square. The `o`
  // is inscribed in an equal square beside it — the smiley's two eyes.
  chevron: { sw: 48, a1: [280, 434, 478, 541], a2: [478, 541, 280, 648] },
  // Teal underscore — a gradient capsule (square strips + semicircular
  // caps); it glides up-left to become the F's accent bar.
  under: { x: 512, y: 712, w: 248, h: 48 },
  // F — bold, thick, muscular letterform with smooth rounded elbow and
  // caps. Both F and a share the baseline at 724 and x-height at 556.
  f: {
    stemX: 258, topX2: 556, top: 366, bottom: 724, w: 70,
    accent: { x: 258, y: 554, w: 224, h: 56 },
  },
  // a — thick bagel/donut bowl ("бублик" with inner hole) + flush vertical stem.
  a: { bowl: { cx: 640, cy: 640, r: 84 }, stem: { x: 724, y: 556, h: 168 } },
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
function chevronHalves(split, upperColor, lowerColor, pinch, tipRound) {
  var half = BRAND.chevron.sw / 2;
  var S = { x: BRAND.chevron.a1[0], y: BRAND.chevron.a1[1] };
  // The wink: the right tip simply SLIDES LEFT — every piece stays rigid
  // (no bending, no squash), so the miter and the caps keep their perfect
  // seams. The `>` narrows the way an eye narrows for a blink.
  var V = {
    x: BRAND.chevron.a1[2] - (pinch == null ? 0 : pinch),
    y: BRAND.chevron.a1[3],
  };
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
  // The pinch steepens the arms, so the sharp miter grows into a spike
  // that would poke past the round caps of the fold's strokes at the
  // handoff. So the tip's corner at Mout is rounded with a true FILLET:
  // an arc tangent to BOTH outer edges (center on the centerline at
  // Mout - rho/sin(A), tangent points rho/tan(A) back down each edge).
  // Tangency means zero silhouette kinks at any round amount; rho=0 is
  // the untouched sharp miter (the fillet degenerates into Mout) and
  // rho=half is the full round cap centered at V — the exact silhouette
  // the fold's strokes pick up. The cut is driven by `tipRound`, NOT by
  // the slide: the eye narrows with a SHARP tip and only rounds once the
  // narrowing is done (the caller owns the clock). The two halves still
  // tile the shape and share the horizontal centerline seam, so the color
  // boundary stays level through the tip.
  var tipPts = null; // extra tip points (the arc), or null for the sharp tip
  if (pinch != null && pinch > 0.01) {
    var rFar = Math.hypot(Mout.x - V.x, Mout.y - V.y);
    var sFar = Math.sqrt(Math.max(0, rFar * rFar - half * half));
    var sinA = half / rFar;
    var tanA = half / sFar;
    var tr = (tipRound == null) ? Math.min(1, pinch / half) : tipRound;
    var rho = half * Math.max(0, Math.min(1, tr));
    var C = { x: Mout.x - rho / sinA, y: V.y };
    var t1 = Mout.x - d1.x * (rho / tanA), t1y = Mout.y - d1.y * (rho / tanA);
    var T1 = { x: t1, y: t1y };
    var t2 = Mout.x + d2.x * (rho / tanA), t2y = Mout.y + d2.y * (rho / tanA);
    var T2 = { x: t2, y: t2y };
    // Half-sweep of the fillet arc around C: the angle from C to the
    // tangent point T1 (NOT the reverse vector — that off-by-180° turns
    // the 123° fillet into a 237° two-thirds circle, i.e. the ball).
    var phi = Math.abs(Math.atan2(T1.y - C.y, T1.x - C.x));
    var NA = 16;
    var arcU = [], arcL = [];
    // Coincident points poison Impeller's tessellator (a run of 9 equal
    // points renders as a round blob in Studio). Keep only points that
    // actually move; near round=0 the whole arc collapses to Mout and the
    // halves degrade to the exact sharp polygons.
    function keep(run, last, p) {
      if (last[0] == null ||
        Math.hypot(p.x - last[0].x, p.y - last[0].y) > 0.5) {
        run.push(p);
        last[0] = p;
      }
    }
    var lastU = [null], lastL = [null];
    for (var ai = 0; ai <= NA; ai++) {
      var th = -phi + (phi - (-phi)) * ai / NA;
      var px = C.x + rho * Math.cos(th), py = C.y + rho * Math.sin(th);
      // The seam splits the fillet: the upper half owns -phi..0, the
      // lower half 0..+phi; both share the centerline point at th=0.
      if (th <= 0) keep(arcU, lastU, { x: px, y: py });
      if (th >= 0) keep(arcL, lastL, { x: px, y: py });
    }
    if (arcU.length >= 2 && arcL.length >= 2) {
      tipPts = { arcU: arcU, arcL: arcL };
    }
  }
  function shifted(pts, dy) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      out.push({ x: pts[i].x, y: pts[i].y + dy });
    }
    return out;
  }
  // Each half is emitted as TWO fat polygons, never as one long thin
  // convex wedge: Impeller's tessellator inflates a 190-unit sliver
  // (the quad B..Mout..Min..A tapers to ~15 degrees) into round blobs in
  // the live Studio at any zoom. Splitting along the Mout-A / Mout-F1
  // diagonals (sharp tip) or along the B-seam / T2-F2 diagonals (fillet)
  // keeps every piece wide; the shared internal diagonals are invisible —
  // the painter's same-color hairline re-stroke covers the AA seam.
  // arcU runs T1 -> the centerline point; arcL runs the centerline -> T2.
  // The seam (centerline -> Min) is horizontal, so the upper/lower color
  // split stays level through the tip.
  var upPieces = [];
  var loPieces = [];
  if (tipPts == null) {
    upPieces = [[B, Mout, A], [Mout, Min, A]];
    loPieces = [[Mout, F2, F1], [Mout, F1, Min]];
  } else {
    // The rounding tip splits into the CAP SEGMENT (just the arc, closed
    // by its own short chord — fat) and the ARM (a wide pentagon whose
    // chord edge the segment exactly covers). NB: the segment must NOT
    // be merged with the far corner B — that union is a long thin
    // crescent, which Impeller inflates into a round blob.
    if (tipPts.arcU.length >= 3) upPieces.push(tipPts.arcU);
    upPieces.push([
      B,
      tipPts.arcU[0],
      tipPts.arcU[tipPts.arcU.length - 1],
      Min,
      A,
    ]);
    if (tipPts.arcL.length >= 3) loPieces.push(tipPts.arcL);
    loPieces.push([
      tipPts.arcL[tipPts.arcL.length - 1],
      F2,
      F1,
      Min,
      tipPts.arcL[0],
    ]);
  }
  var pieces = [];
  for (var ui = 0; ui < upPieces.length; ui++) {
    pieces.push(flatPoly(shifted(upPieces[ui], -split), upperColor, 1));
  }
  for (var li = 0; li < loPieces.length; li++) {
    pieces.push(flatPoly(shifted(loPieces[li], split), lowerColor, 1));
  }
  // Round terminals on the free ends: each cap bulges along the arm's
  // outward normal (perpendicular to the angled end face).
  var su = { x: S.x, y: S.y - split };
  var se = { x: E.x, y: E.y + split };
  var capU = capArc(su.x, su.y, half, n1, { x: -d1.x, y: -d1.y },
    upperColor, 1);
  var capL = capArc(se.x, se.y, half, n2, d2, lowerColor, 1);
  return pieces.concat([capU, capL]);
}

/// The teal gradient capsule — the underscore in its icon slot. Square
/// strips tile the gradient; semicircular caps close the ends. It hands
/// off to a flat stroked path when it starts to bend (see bendPath) — the
/// silhouette is identical, so the swap is invisible.
function tealBar(opacity) {
  var kids = [];
  var n = 10;
  var h = BRAND.under.h;
  var r = h / 2;
  var cx0 = BRAND.under.x + r, cx1 = BRAND.under.x + BRAND.under.w - r;
  var cy = BRAND.under.y + r;
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

// ---- The bend: a stroke that curls from a bar into a ring ------------------
// The note beat's engine. The centerline is sampled at n points; each point
// interpolates between its place on a straight bar and its place on a
// circle. The bar's ends meet at the circle's TOP (the wire bends through
// the left side, sags to the bottom, and comes back up the right), so the
// round caps end up stacked on the same point — the topology change from
// open bar to closed ring is invisible. The path node strokes the polyline
// with round caps and joins, flat color.

function morphPts(a, b, t) {
  var out = [];
  var len = Math.max(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var pa = a[Math.min(i, a.length - 1)];
    var pb = b[Math.min(i, b.length - 1)];
    out.push({ x: lerp(pa.x, pb.x, t), y: lerp(pa.y, pb.y, t) });
  }
  return out;
}

function arcPts(cx, cy, r, a0, a1, n) {
  var pts = [];
  for (var i = 0; i <= n; i++) {
    var th = a0 + (a1 - a0) * i / n;
    pts.push({ x: cx + r * Math.cos(th), y: cy + r * Math.sin(th) });
  }
  return pts;
}

function chevPoints(cx, cy, w, h, n) {
  var pts = [];
  var halfN = Math.floor(n / 2);
  for (var i = 0; i <= halfN; i++) {
    var t = i / halfN;
    pts.push({
      x: lerp(cx - w, cx + w, t),
      y: lerp(cy - h, cy, t),
    });
  }
  for (var j = 1; j <= halfN; j++) {
    var t2 = j / halfN;
    pts.push({
      x: lerp(cx + w, cx - w, t2),
      y: lerp(cy, cy + h, t2),
    });
  }
  return pts;
}

function ringPoint(cx, cy, r, s) {
  var th = -Math.PI / 2 - 2 * Math.PI * s;
  return { x: cx + r * Math.cos(th), y: cy + r * Math.sin(th) };
}

function boundsOf(pts) {
  var minX, minY, maxX, maxY;
  for (var i = 0; i < pts.length; i++) {
    if (minX == null || pts[i].x < minX) minX = pts[i].x;
    if (minY == null || pts[i].y < minY) minY = pts[i].y;
    if (maxX == null || pts[i].x > maxX) maxX = pts[i].x;
    if (maxY == null || pts[i].y > maxY) maxY = pts[i].y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function polylineNode(pts, sw, progress, color, opacity) {
  var b = boundsOf(pts);
  var d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
  for (var i = 1; i < pts.length; i++) {
    d += ' L' + pts[i].x.toFixed(2) + ',' + pts[i].y.toFixed(2);
  }
  return trace(d, sw, b.x, b.y, b.w, b.h, progress, color, opacity);
}

/// Interpolated bar→ring centerline, t: 0 = straight bar, 1 = closed ring.
function bendPoints(bx0, by, bx1, cx, cy, r, t, n) {
  var pts = [];
  for (var i = 0; i <= n; i++) {
    var s = i / n;
    var rp = ringPoint(cx, cy, r, s);
    pts.push({
      x: lerp(bx0 + s * (bx1 - bx0), rp.x, t),
      y: lerp(by, rp.y, t),
    });
  }
  return pts;
}

/// A closed ring centerline (t=1 of the bend, anywhere, any radius).
function ringPoints(cx, cy, r, n) {
  var pts = [];
  for (var i = 0; i <= n; i++) {
    pts.push(ringPoint(cx, cy, r, i / n));
  }
  return pts;
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

/// The F's middle accent crossbar (capsule from x: 266, y: 545, w: 212, h: 44).
/// Gradient from teal '#2EBD9E' to cyan '#48C7E8', with rounded caps.
function fAccentBar(progress, opacity) {
  var kids = [];
  var fa = BRAND.f.accent;
  var p = jsr.motion.clamp(progress, 0, 1);
  if (p <= 0.001) return kids;
  var curW = fa.w * p;
  var h = fa.h;
  var r = h / 2;
  var pt = brandToScreen(fa.x, fa.y);
  kids.push({
    type: 'rect',
    width: curW * mapper.k,
    height: h * mapper.k,
    radius: r * mapper.k,
    fill: '#2EBD9E',
    opacity: opacity == null ? 1 : opacity,
    positioned: {
      left: pt.x,
      top: pt.y - r * mapper.k,
    },
  });
  return kids;
}

/// The complete, canonical Fa wordmark:
/// 1. F stem + top bar (brand blue, bold strokeWidth 70)
/// 2. F middle teal accent bar (height 56)
/// 3. a circular donut bowl (brand teal, strokeWidth 60, radius 84 with clean center hole)
/// 4. a vertical stem (brand teal/cyan, strokeWidth 60, flush with bowl tangent)
function completeFaMark(fProgress, accentProgress, bowlProgress, stemProgress, opacity) {
  var kids = [];
  var op = opacity == null ? 1 : opacity;
  if (fProgress > 0.001) {
    kids.push(fPathNode(fProgress, '#5B61F6', op));
  }
  if (accentProgress > 0.001) {
    var acc = fAccentBar(accentProgress, op);
    for (var i = 0; i < acc.length; i++) kids.push(acc[i]);
  }
  if (bowlProgress > 0.001) {
    kids.push(polylineNode(
      ringPoints(BRAND.a.bowl.cx, BRAND.a.bowl.cy, BRAND.a.bowl.r, 28),
      60, bowlProgress, '#2EBD9E', op));
  }
  if (stemProgress > 0.001) {
    var aStem = BRAND.a.stem;
    var d = 'M' + aStem.x + ',' + (aStem.y + aStem.h) + ' L' + aStem.x + ',' + aStem.y;
    kids.push(trace(
      d, 60, aStem.x, aStem.y, 0, aStem.h, stemProgress, '#2EBD9E', op));
  }
  return kids;
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
