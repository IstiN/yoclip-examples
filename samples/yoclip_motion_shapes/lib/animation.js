// Shared helper lib for the motion & shapes showreel.
//
// Declared via project.js `lib` so every scene can use it. Two layers:
//
//   1. Thin wrappers over the runtime's jsr.motion builtins
//      (js_widget_runtime 0.4.114+) — sequence() keeps choreography in
//      frames, elapsedMs() bridges the frame clock to the ms the builtins
//      speak natively.
//   2. buildWall() — the thumbnail-wall component shared by the "wall"
//      and "logo" scenes. One place decides tile geometry, the color
//      journey and entrance ripple; scenes only pick scale/dim.

/// Scene-local elapsed milliseconds — the unit jsr.motion speaks natively.
function elapsedMs(frame, fps) {
  return frame * 1000 / fps;
}

/// Run a chain of tweened steps against the frame clock.
///
/// `steps` is a list of `{ at, dur, from, to, easing?, apply? }` where
/// `at`/`dur` are FRAMES on the current scene's clock and `easing` is the
/// string name of a jsr.ease entry (or a normalized easing function).
/// Returns the eased values in step order; when a step declares `apply(v)`,
/// it is called with the eased value as well.
function sequence(frame, fps, steps) {
  var ms = elapsedMs(frame, fps);
  var out = [];
  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    var v = jsr.motion.tween(
      ms,
      s.at * 1000 / fps,
      s.dur * 1000 / fps,
      s.from,
      s.to,
      s.easing,
    );
    out.push(v);
    if (s.apply) s.apply(v);
  }
  return out;
}

/// Linear RGB interpolation between two '#rrggbb' colors.
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
  var r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  var g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  var bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  function h(v) {
    return v.toString(16).padStart(2, '0');
  }
  // parseColor in the renderer only understands #hex / names — no rgb().
  return '#' + h(r) + h(g) + h(bl);
}

// ---- The thumbnail wall ----------------------------------------------------
// A 7x4 grid of video-card tiles like the Motion Canvas showreel cover:
// colors drift from steel blue on the left to muted red on the right while
// the whole wall slowly washes red, tiles ripple in center-out and the
// surface breathes with a slow wave drift.

var WALL = {
  cols: 7,
  rows: 5,
  tileW: 300,
  tileH: 186,
  gap: 16,
};

var TILE_LABELS = [
  'MERGE SORT', 'BUBBLE SORT', 'RAY TRACING', 'COMPILATION', 'KRUSKAL',
  'REFLECTIONS', 'GROUP RESPAWN', 'SELECTION SORT', 'DAY 1 → DAY 30',
];

/// Tile color: column position sets the base blue→red mix, the scene clock
/// slowly washes everything toward red.
function tileColor(frame, col) {
  var base = col / (WALL.cols - 1) * 0.55;
  var wash = jsr.motion.mapRange(frame, 0, 110, 0, 0.35, 'easeInOutCubic');
  return lerpColor('#2b4a8f', '#a03448', base + wash);
}

function tileAccent(frame, col) {
  var base = col / (WALL.cols - 1) * 0.5;
  var wash = jsr.motion.mapRange(frame, 0, 110, 0, 0.3, 'easeInOutCubic');
  return lerpColor('#a8c8ff', '#ffa3ab', base + wash);
}

/// Small deterministic "thumbnail" content per tile — mini charts, play
/// buttons, orbit rings and mono labels, all from shape nodes.
function tileContent(v, accent, label) {
  function spacer(w, h) {
    return { type: 'container', width: w, height: h };
  }
  switch (v % 5) {
    case 0: // mini bar chart
      return {
        type: 'row',
        crossAxisAlignment: 'end',
        children: [
          { type: 'rect', width: 28, height: 56, radius: 7, fill: accent, opacity: 0.7 },
          spacer(10, 0),
          { type: 'rect', width: 28, height: 104, radius: 7, fill: accent, opacity: 0.85 },
          spacer(10, 0),
          { type: 'rect', width: 28, height: 76, radius: 7, fill: accent },
        ],
      };
    case 1: // play button + label
      return {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'polygon', points: [0, 0, 38, 22, 0, 44], fill: accent },
          spacer(12, 0),
          {
            type: 'expanded',
            child: {
              type: 'text',
              text: label,
              style: { fontSize: 18, color: '#e8eaf2', fontFamily: 'Geneva', fontWeight: '700' },
            },
          },
        ],
      };
    case 2: // big mono label, two lines
      return {
        type: 'column',
        crossAxisAlignment: 'start',
        children: [
          { type: 'text', text: label.split(' ')[0], style: { fontSize: 30, color: '#f4f5f9', fontFamily: 'Geneva', fontWeight: '700' } },
          { type: 'text', text: label.split(' ').slice(1).join(' ') || ' ', style: { fontSize: 30, color: accent, fontFamily: 'Geneva', fontWeight: '700' } },
        ],
      };
    case 3: // orbit ring + dot
      return {
        type: 'stack',
        children: [
          { type: 'circle', size: 110, fill: '#00000000', stroke: accent, strokeWidth: 3 },
          { type: 'circle', size: 22, fill: accent, offsetX: 40, offsetY: -6 },
        ],
      };
    default: // progress line
      return {
        type: 'column',
        crossAxisAlignment: 'start',
        children: [
          { type: 'text', text: label, style: { fontSize: 18, color: '#e8eaf2', fontFamily: 'Geneva' } },
          spacer(0, 12),
          { type: 'rect', width: 190, height: 10, radius: 5, fill: accent, opacity: 0.35 },
          { type: 'rect', width: 122, height: 10, radius: 5, fill: accent },
        ],
      };
  }
}

/// The wall, as a list of absolutely-positioned tile nodes for a
/// `stack fit: 'expand'`. `opts`:
///   scale — uniform scale applied around the wall center (camera feel)
///   dim   — 0..1 dark veil over the tiles (for logo backdrops)
///   dimmedOpacity — per-tile opacity before the veil (default 1)
function buildWall(frame, fps, opts) {
  opts = opts || {};
  var scale = opts.scale == null ? 1 : opts.scale;
  var dim = opts.dim == null ? 0 : opts.dim;
  var tileOpacity = opts.dimmedOpacity == null ? 1 : opts.dimmedOpacity;

  var ms = elapsedMs(frame, fps);
  var pitchX = WALL.tileW + WALL.gap;
  var pitchY = WALL.tileH + WALL.gap;
  var wallW = WALL.cols * pitchX - WALL.gap;
  var wallH = WALL.rows * pitchY - WALL.gap;
  var x0 = (1920 - wallW) / 2;
  var y0 = (1080 - wallH) / 2;
  var cx = 1920 / 2;
  var cy = 1080 / 2;

  // Shared slow drift — the whole surface breathes.
  var dx = jsr.motion.wave(ms, 9000, 18, 0);
  var dy = jsr.motion.wave(ms, 7300, 12, 0.2);

  var tiles = [];
  for (var j = 0; j < WALL.rows; j++) {
    for (var i = 0; i < WALL.cols; i++) {
      var idx = j * WALL.cols + i;
      // Center-out ripple: inner tiles land first.
      var ring = Math.max(Math.abs(i - (WALL.cols - 1) / 2), Math.abs(j - (WALL.rows - 1) / 2));
      var delay = (3.7 - ring) * 110;

      var k = scale;
      var bx = x0 + i * pitchX;
      var by = y0 + j * pitchY;
      var px = cx + (bx - cx) * k + dx;
      var py = cy + (by - cy) * k + dy;

      var pop = jsr.motion.tween(ms, delay, 460, 0, 1, 'backOut');
      var fade = jsr.motion.tween(ms, delay, 240, 0, 1, 'linear');

      tiles.push({
        type: 'container',
        width: WALL.tileW * k,
        height: WALL.tileH * k,
        radius: 18,
        color: tileColor(frame, i),
        opacity: Math.min(fade, tileOpacity),
        scale: 0.55 + 0.45 * pop,
        positioned: { left: px, top: py },
        padding: 18,
        child: {
          type: 'column',
          crossAxisAlignment: 'start',
          mainAxisAlignment: 'center',
          children: [tileContent(idx, tileAccent(frame, i), TILE_LABELS[idx % TILE_LABELS.length])],
        },
      });
    }
  }

  if (dim > 0) {
    tiles.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: '#0a0a12',
      opacity: dim,
      positioned: { left: 0, top: 0 },
    });
  }
  return tiles;
}
