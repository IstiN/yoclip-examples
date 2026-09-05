// Showreel 2 — the logo build.
//
// The wall recedes and dims; the Motion-Canvas-style mark assembles in the
// clearing: rounded bars and the green dot stamp in with backOut overshoot,
// then the white asterisk (three rotated rounded rects) lands last and
// twists into place — the hero moment. All pieces are shape nodes placed
// absolutely via stack `positioned`, choreographed with raw jsr.motion.

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
    function stamped(node, delay, opts) {
      opts = opts || {};
      var p = jsr.motion.tween(ms, delay * 33.3, opts.dur || 460, 0, 1, 'backOut');
      node.scale = 0.4 + 0.6 * p;
      node.opacity = Math.min(1, jsr.motion.tween(ms, delay * 33.3, 240, 0, 1, 'linear'));
      node.positioned = {
        left: 960 - (node._w || 0) / 2,
        top: 540 - (node._h || 0) / 2,
      };
      return node;
    }

    // Glow disc behind the mark.
    var glowP = jsr.motion.tween(ms, 0, 900, 0, 1, 'easeOutExpo');

    // Collect children imperatively — Array.concat does NOT flatten a
    // nested array (the asterisk bars) more than one level, and the
    // compiler silently drops non-map children.
    var kids = buildWall(frame, 30, { scale: 0.86, dim: 0.72, dimmedOpacity: 0.8 });

    // soft glow
    kids.push({
      type: 'circle',
      size: 620,
      fill: '#ffffff',
      opacity: 0.07 * glowP,
      scale: 0.7 + 0.3 * glowP,
      positioned: { left: 960 - 310, top: 540 - 310 },
    });

    // red bar (left)
    kids.push(stamped({
      type: 'rect', width: 84, height: 220, radius: 42,
      fill: '#e85d6a', _w: 84, _h: 220,
      offsetX: -150,
    }, 8));

    // yellow "1": stem + flag
    kids.push(stamped({
      type: 'rect', width: 96, height: 300, radius: 48,
      fill: '#f2b134', _w: 96, _h: 300,
      offsetX: -20,
    }, 14));
    kids.push(stamped({
      type: 'rect', width: 96, height: 96, radius: 48,
      fill: '#f2b134', rotation: -0.6, _w: 96, _h: 96,
      offsetX: -80, offsetY: -175,
    }, 20));

    // blue bar (right)
    kids.push(stamped({
      type: 'rect', width: 84, height: 240, radius: 42,
      fill: '#4f9df7', _w: 84, _h: 240,
      offsetX: 120, offsetY: 10,
    }, 26));

    // green dot
    kids.push(stamped({
      type: 'circle', size: 62,
      fill: '#7fc95f', _w: 62, _h: 62,
      offsetX: 196, offsetY: -140,
    }, 32));

    // white asterisk: three rounded bars at 0/60/120 degrees, landing last
    // with a twist.
    var twist = jsr.motion.tween(ms, 39 * 33.3, 620, -0.7, 0, 'easeOutExpo');
    var p = jsr.motion.tween(ms, 39 * 33.3, 560, 0, 1, 'backOut');
    for (var k = 0; k < 3; k++) {
      kids.push({
        type: 'rect',
        width: 430,
        height: 92,
        radius: 46,
        fill: '#f4f5f9',
        rotation: k * (Math.PI / 3) + twist, // rotateZ takes radians
        scale: 0.5 + 0.5 * p,
        opacity: Math.min(1, jsr.motion.tween(ms, 39 * 33.3 + k * 60, 240, 0, 1, 'linear')),
        positioned: { left: 960 - 215, top: 540 - 46 },
      });
    }

    // caption pill
    var capO = Math.min(1, jsr.motion.tween(ms, 66 * 33.3, 420, 0, 1, 'easeOutExpo'));
    var capY = jsr.motion.tween(ms, 66 * 33.3, 420, 24, 0, 'easeOutExpo');
    kids.push({
      type: 'container',
      width: 470,
      height: 66,
      radius: 33,
      color: colors.surface,
      opacity: capO,
      offsetY: capY + 250,
      positioned: { left: 960 - 235, top: 540 },
      child: {
        type: 'align',
        alignment: 'center',
        child: {
          type: 'text',
          text: 'SHAPES \u00b7 MOTION \u00b7 SEQUENCE',
          style: { fontSize: 24, color: '#e8eaf2', fontFamily: 'Geneva', fontWeight: '700', letterSpacing: 4 },
        },
      },
    });

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
