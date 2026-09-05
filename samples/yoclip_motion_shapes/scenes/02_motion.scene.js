// Showreel 2 — the logo build.
//
// The wall recedes and dims; the YoClip brand mark (branding/yoclip_logo.svg)
// is DRAWN as vector animation: the C sweeps on as a stroke trace, the
// gradient bubble fades in, "Yo" writes itself on the bubble, the dots pop,
// then "lip" writes stroke by stroke and the gradient i-dot lands last.
//
// Geometry is lifted from the SVG and flattened into its 820x520 viewBox
// space (the source group's 0.5 scale + translates are baked in). Every
// traced path gets an AnimPath box of (pathBounds + stroke): the painter
// fits path bounds into `box - strokeWidth`, so that box size makes the
// fit exactly 1:1 and all parts compose into the real logo. Fill shapes
// (bubble, tail, dots, i-dot) are ordinary rect/polygon/circle nodes.

scene = {
  id: 'logo',
  duration: 120,
  from: 120,
  timeline: {
    label: 'The mark',
    color: '#f59e0b',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    // A piece that stamps in: backOut scale (can overshoot past 1 — that's
    // the pop), a short linear opacity window (clamped: Flutter opacity is
    // 0..1 only).
    function stamped(node, at, opts) {
      opts = opts || {};
      var p = jsr.motion.tween(ms, at, opts.dur || 300, 0, 1, 'backOut');
      // Multiplies any scale already on the node (e.g. an idle breathing
      // wave) instead of clobbering it.
      node.scale = (node.scale || 1) *
        ((opts.from || 0.3) + (1 - (opts.from || 0.3)) * p);
      node.opacity = Math.min(1, jsr.motion.tween(ms, at, 200, 0, 1, 'linear'));
      return node;
    }

    // Stroke-drawing path node. `bounds` are the path data's own bounds in
    // svg units; the box = bounds + stroke trick pins the painter's
    // fit-to-box scaling at exactly K (see file header).
    var K = 0.95, OX = 570.5, OY = 293; // logo placement on 1920x1080
    function trace(d, sw, bx, by, bw, bh, at, dur, color) {
      var sk = sw * K;
      return {
        type: 'path',
        path: d,
        color: color,
        strokeWidth: sk,
        progress: jsr.motion.tween(ms, at, dur, 0, 1, 'easeInOutCubic'),
        width: (bw + sw) * K,
        height: (bh + sw) * K,
        positioned: { left: OX + bx * K - sk / 2, top: OY + by * K - sk / 2 },
      };
    }

    var kids = buildWall(frame, 30, { scale: 0.86, dim: 0.76, dimmedOpacity: 0.8 });

    // soft glow behind the mark; rises with the C, then breathes.
    var glowP = jsr.motion.tween(ms, 0, 900, 0, 1, 'easeOutExpo');
    kids.push({
      type: 'circle',
      size: 640,
      fill: '#ffffff',
      opacity: (0.05 + 0.02 * jsr.motion.wave(ms, 3400, 1, 0)) * glowP,
      scale: 0.7 + 0.3 * glowP,
      positioned: { left: 948 - 320, top: 541 - 320 },
    });

    // -- 1. The C sweeps on (the speech-bubble ring) ------------------------
    kids.push(trace(
      'M406.3,122.15C368.88,89.19 320.69,71 270.82,71C158.36,71 65.82,163.54 ' +
      '65.82,276C65.82,388.46 158.36,481 270.82,481C320.69,481 368.88,462.81 406.3,429.85',
      40, 65.82, 71, 340.48, 410, 180, 1100, '#e8eaf2'));

    // -- 2. The gradient bubble fades/scales in (with its tail) -------------
    var bOp = jsr.motion.tween(ms, 1250, 450, 0, 1, 'easeOutExpo');
    var bP = jsr.motion.tween(ms, 1250, 450, 0, 1, 'backOut');
    kids.push({
      type: 'container',
      width: 304, height: 190, radius: 47.5,
      gradient: {
        colors: ['#8b5cf6', '#6366f1', '#3b82f6'],
        stops: [0, 0.55, 1],
        begin: 'topLeft', end: 'bottomRight',
      },
      opacity: bOp,
      scale: 0.92 + 0.08 * bP,
      positioned: { left: 701.13, top: 445.0 },
    });
    var tP = jsr.motion.tween(ms, 1400, 300, 0, 1, 'backOut');
    kids.push({
      type: 'polygon',
      points: [0, 10, 45, 65, 85, 0],
      fill: '#5f68f3',
      opacity: Math.min(1, jsr.motion.tween(ms, 1400, 200, 0, 1, 'linear')),
      scale: 0.6 + 0.4 * tP,
      positioned: { left: 889.25, top: 606.5 },
    });

    // -- 3. "Yo" writes itself on the bubble --------------------------------
    kids.push(trace(
      'M190,207.5L215,257.5L240,207.5M215,257.5L215,297.5',
      26, 190, 207.5, 50, 90, 1650, 450, '#ffffff'));
    kids.push(trace(
      'M295,222.5C312.95,222.5 327.5,237.05 327.5,255C327.5,272.95 312.95,287.5 ' +
      '295,287.5C277.05,287.5 262.5,272.95 262.5,255C262.5,237.05 277.05,222.5 295,222.5Z',
      26, 262.5, 222.5, 65, 65, 1950, 450, '#ffffff'));

    // -- 4. The bubble's two dots pop ----------------------------------------
    kids.push(stamped({
      type: 'rect', width: 33.9, height: 30.4, radius: 13,
      fill: '#ffffff',
      positioned: { left: 949.36, top: 496.78 },
    }, 2350));
    kids.push(stamped({
      type: 'rect', width: 33.9, height: 30.4, radius: 13,
      fill: '#ffffff',
      positioned: { left: 949.36, top: 548.08 },
    }, 2450));

    // -- 5. "lip" writes stroke by stroke ------------------------------------
    kids.push(trace('M485,176L485,344', 32, 485, 176, 0, 168, 2550, 380, '#e8eaf2'));
    kids.push(trace('M545,232L545,344', 32, 545, 232, 0, 112, 2850, 280, '#e8eaf2'));
    kids.push(trace('M605,232L605,344', 32, 605, 232, 0, 112, 3050, 280, '#e8eaf2'));
    kids.push(trace(
      'M669,175C704.35,175 733,203.65 733,239C733,274.35 704.35,303 669,303' +
      'C633.65,303 605,274.35 605,239C605,203.65 633.65,175 669,175Z',
      32, 605, 175, 128, 128, 3250, 450, '#e8eaf2'));

    // -- 6. The gradient i-dot lands last and breathes -----------------------
    var dotP = jsr.motion.tween(ms, 3350, 300, 0, 1, 'backOut');
    var dotBreath = 1 + 0.06 * jsr.motion.wave(ms, 2600, 1, 0.6);
    kids.push(stamped({
      type: 'circle', size: 45.6,
      fill: '#8b5cf6',
      positioned: { left: 1065.45, top: 445.0 },
      scale: dotBreath,
    }, 3350));
    kids.push(stamped({
      type: 'circle', size: 22.8,
      fill: '#ffffff',
      positioned: { left: 1076.7, top: 456.4 },
    }, 3450, { dur: 250 }));

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
