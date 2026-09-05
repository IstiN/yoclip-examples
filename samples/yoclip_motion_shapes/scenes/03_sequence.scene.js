// Showreel 3 — the finale.
//
// The red-washed wall holds; the mark dissolves and big kinetic type takes
// over: "MADE WITH CODE" stamps in, an underline sweeps beneath it (backOut
// overshoot — width may exceed briefly, that's the snap), a dot pops at its
// end, particles drift up, and the yoclip chip lands last. The whole beat
// structure lives in ONE sequence() call — timings read like a score.

scene = {
  id: 'finale',
  duration: 120,
  from: 240,
  timeline: {
    label: 'Finale',
    color: '#ef4444',
    lane: 'video',
  },
  render: function(frame) {
    var fps = 30;
    var colors = yoclipTheme.colors;
    var ms = elapsedMs(frame, fps);

    // The score: every beat of the finale in one place.
    var [textScale, textO, lineW, dotP, chipY, chipO] = sequence(frame, fps, [
      { at: 0,  dur: 22, from: 0.6, to: 1, easing: 'backOut' },     // type stamp
      { at: 0,  dur: 14, from: 0,   to: 1 },                        // type fade
      { at: 18, dur: 20, from: 0,   to: 560, easing: 'backOut' },   // underline sweep
      { at: 34, dur: 12, from: 0,   to: 1, easing: 'backOut' },     // end dot
      { at: 62, dur: 20, from: 40,  to: 0, easing: 'easeOutExpo' }, // chip rise
      { at: 62, dur: 16, from: 0,   to: 1 },                        // chip fade
    ]);

    // Rising particles — modulo loop, fading out as they climb.
    function particle(i) {
      var speed = 2.4 + (i % 3) * 0.7;
      var span = 560;
      var h = ((frame * speed + i * 97) % span);
      var x = 240 + i * 290 + jsr.motion.wave(ms, 5200 + i * 400, 22, i * 0.35);
      return {
        type: 'circle',
        size: 8 + (i % 3) * 5,
        fill: i % 2 ? colors.accent : '#f2989f',
        opacity: 0.5 * (1 - h / span),
        positioned: { left: x, top: 780 - h },
      };
    }

    var particles = [];
    for (var i = 0; i < 6; i++) {
      particles.push(particle(i));
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: buildWall(frame, fps, { scale: 0.86, dim: 0.75, dimmedOpacity: 0.8 }).concat([
        ...particles,

        // Headline — oversized, tight, dead center.
        {
          type: 'text',
          text: 'MADE WITH CODE',
          style: { fontSize: 118, color: '#f4f5f9', fontFamily: 'Geneva', fontWeight: '700', letterSpacing: 2 },
          scale: textScale,
          opacity: textO,
          positioned: { left: 0, right: 0, top: 400 },
          textAlign: 'center',
        },

        // Underline sweeping beneath the headline; backOut overshoot is
        // fine here — width isn't clamped.
        {
          type: 'rect',
          width: Math.max(lineW, 0),
          height: 14,
          radius: 7,
          fill: colors.primary,
          positioned: { left: 960 - Math.max(lineW, 0) / 2, top: 620 },
        },

        // Dot at the end of the underline.
        {
          type: 'circle',
          size: 34,
          fill: colors.accent,
          scale: dotP,
          opacity: Math.min(dotP, 1),
          positioned: { left: 960 + Math.max(lineW, 0) / 2 - 40, top: 610 },
        },

        // yoclip chip, last beat.
        {
          type: 'container',
          width: 380,
          height: 66,
          radius: 33,
          color: colors.surface,
          opacity: chipO,
          offsetY: chipY,
          positioned: { left: 960 - 190, top: 730 },
          child: {
            type: 'align',
            alignment: 'center',
            child: {
              type: 'text',
              text: 'yoclip · code-first video',
              style: { fontSize: 24, color: '#e8eaf2', fontFamily: 'Geneva', fontWeight: '600' },
            },
          },
        },
      ]),
    };
  },
};
