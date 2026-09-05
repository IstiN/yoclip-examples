// Demo 2 — the jsr.motion builtins raw (js_widget_runtime 0.4.114+).
//
//   tween   — a bar race: three bars grow with DIFFERENT easing names, so the
//             difference is visible in one glance (linear vs cubic vs backOut).
//   wave    — an orbiting dot riding a sine around the caption.
//   mapRange+clamp — a frame counter that eases 0..120 onto 0..100%.
//
// All time values are ELAPSED MS — `elapsedMs(frame, fps)` is the bridge
// from the scene's frame clock.

scene = {
  id: 'motion',
  duration: 120,
  from: 120,
  timeline: {
    label: 'jsr.motion',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    // ---- tween: three bars, three easings -------------------------------
    function bar(labelText, easing, color, i) {
      var start = 200 + i * 250;
      var w = jsr.motion.tween(ms, start, 1600, 0, 620, easing);
      return {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          {
            type: 'container',
            width: 190,
            child: {
              type: 'text',
              text: labelText,
              style: { fontSize: 26, color: colors.textMuted, fontFamily: 'Geneva' },
              textAlign: 'right',
            },
          },
          { type: 'container', width: 16, height: 0 },
          { type: 'rect', width: Math.max(w, 2), height: 44, radius: 10, fill: color },
        ],
      };
    }

    // ---- wave + offset: a dot orbiting the counter ----------------------
    var phase = ms / 900; // ~0.9 s per lap
    var orbitX = jsr.motion.wave(ms, 1800, 160, 0);
    var orbitY = jsr.motion.wave(ms, 1800, 34, 0.25);

    // ---- mapRange + clamp: eased percent counter ------------------------
    var pct = Math.round(jsr.motion.mapRange(ms, 300, 2200, 0, 100, 'easeInOutCubic'));

    function spacer(h) {
      return { type: 'container', width: 0, height: h };
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        { type: 'fill', color: colors.background },
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: 'JSR.MOTION',
              style: yoclipTheme.label,
              opacity: jsr.motion.tween(ms, 0, 400, 0, 1, 'easeOutExpo'),
            },
            spacer(56),
            bar('linear', 'linear', colors.textMuted, 0),
            spacer(18),
            bar('cubic', 'easeInOutCubic', colors.primaryLight, 1),
            spacer(18),
            bar('backOut', 'backOut', colors.accent, 2),
            spacer(72),
            {
              type: 'stack',
              children: [
                {
                  type: 'text',
                  text: pct + '%',
                  style: { fontSize: 72, color: colors.text, fontFamily: 'Geneva', fontWeight: '700' },
                },
                {
                  type: 'circle',
                  size: 22,
                  fill: colors.warning,
                  offsetX: orbitX,
                  offsetY: orbitY,
                },
              ],
            },
          ],
        },
      ],
    };
  },
};
