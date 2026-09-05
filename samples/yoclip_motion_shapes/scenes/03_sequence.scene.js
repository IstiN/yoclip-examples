// Demo 3 — the sequence() helper (lib/animation.js, this sample's lib).
//
// Motion-Canvas style: ONE call sequences the whole build. Steps are frames
// on the scene clock; under the hood each one is a jsr.motion.tween. The
// destructure keeps the choreography readable — every stage is a named
// local, every timing lives in one place instead of being scattered across
// the render body.
//
//   title  — slides up and fades in from frame 0
//   bar1-3 — staggered card entrances from frames 15/30/45
//   footer — drops in late, at frame 70

scene = {
  id: 'sequence',
  duration: 120,
  from: 240,
  timeline: {
    label: 'sequence()',
    color: '#f59e0b',
    lane: 'video',
  },
  render: function(frame) {
    var fps = 30;
    var colors = yoclipTheme.colors;

    var [titleY, titleO, bar1, bar2, bar3, footerY, footerO] = sequence(frame, fps, [
      // title: offset + opacity legs of the same window
      { at: 0,  dur: 22, from: 36, to: 0, easing: 'easeOutExpo' },
      { at: 0,  dur: 22, from: 0,  to: 1, easing: 'easeOutExpo' },
      // three stat cards, staggered
      { at: 15, dur: 24, from: 0,  to: 1, easing: 'backOut' },
      { at: 30, dur: 24, from: 0,  to: 1, easing: 'backOut' },
      { at: 45, dur: 24, from: 0,  to: 1, easing: 'backOut' },
      // footer joins last: offset + opacity
      { at: 70, dur: 20, from: 24, to: 0, easing: 'easeOutExpo' },
      { at: 70, dur: 20, from: 0,  to: 1, easing: 'easeOutExpo' },
    ]);

    function statCard(labelText, valueText, progress, i) {
      return {
        type: 'container',
        width: 380,
        height: 240,
        borderRadius: 26,
        color: colors.surface,
        // backOut overshoots past 1 — that's the pop; but Flutter opacity
        // only accepts [0,1], so clamp it and let scale keep the overshoot.
        opacity: Math.min(progress, 1),
        scale: 0.8 + 0.2 * progress,
        offsetY: (1 - progress) * 30,
        child: {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: valueText,
              style: { fontSize: 64, color: [colors.primaryLight, colors.accent, colors.warning][i], fontFamily: 'Geneva', fontWeight: '700' },
            },
            { type: 'container', width: 0, height: 10 },
            {
              type: 'text',
              text: labelText,
              style: { fontSize: 26, color: colors.textMuted, fontFamily: 'Geneva' },
            },
          ],
        },
      };
    }

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
              text: 'ONE CALL, WHOLE BUILD',
              style: yoclipTheme.headline,
              opacity: titleO,
              offsetY: titleY,
            },
            spacer(56),
            {
              type: 'row',
              children: [
                statCard('scenes', '3', bar1, 0),
                spacer(24),
                statCard('helpers', '2', bar2, 1),
                spacer(24),
                statCard('tweens', '7', bar3, 2),
              ],
            },
            spacer(48),
            {
              type: 'text',
              text: 'sequence(frame, fps, steps) — frames in, eased values out',
              style: { fontSize: 28, color: colors.textMuted, fontFamily: 'Geneva' },
              opacity: footerO,
              offsetY: footerY,
            },
          ],
        },
      ],
    };
  },
};
