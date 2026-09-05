// Demo 1 — shape nodes (js_widget_runtime 0.4.115).
//
// rect / circle / line / polygon in a 2x2 grid. Every card fades and pops in
// through jsr.motion.tween (opacity + scale + offsetY), staggered left to
// right, so one scene exercises shapes AND motion together.

scene = {
  id: 'shapes',
  duration: 120,
  from: 0,
  timeline: {
    label: 'Shapes',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    // Card entrance: opacity + scale + offsetY off one tween window,
    // staggered 10 frames (333 ms) per card.
    function cardIn(i) {
      var start = i * 333;
      return {
        opacity: jsr.motion.tween(ms, start, 450, 0, 1, 'easeOutExpo'),
        scale: jsr.motion.tween(ms, start, 450, 0.7, 1, 'easeOutExpo'),
        offsetY: jsr.motion.tween(ms, start, 450, 40, 0, 'easeOutExpo'),
      };
    }

    function spacer(h) {
      return { type: 'container', width: 0, height: h };
    }

    function shapeCard(label, shape, i) {
      var fx = cardIn(i);
      return {
        type: 'container',
        width: 560,
        height: 360,
        borderRadius: 28,
        color: colors.surface,
        opacity: fx.opacity,
        scale: fx.scale,
        offsetY: fx.offsetY,
        child: {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            shape,
            spacer(20),
            {
              type: 'text',
              text: label,
              style: { fontSize: 28, color: colors.textMuted, fontFamily: 'Geneva' },
            },
          ],
        },
      };
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
              text: 'SHAPE NODES',
              style: yoclipTheme.label,
              opacity: jsr.motion.tween(ms, 0, 400, 0, 1, 'easeOutExpo'),
              offsetY: jsr.motion.tween(ms, 0, 400, 20, 0, 'easeOutExpo'),
            },
            spacer(48),
            {
              type: 'row',
              children: [
                shapeCard('rect', {
                  type: 'rect',
                  width: 260,
                  height: 130,
                  radius: 22,
                  fill: colors.primary,
                  stroke: '#ffffff',
                  strokeWidth: 3,
                }, 0),
                spacer(28),
                shapeCard('circle', {
                  type: 'circle',
                  size: 130,
                  fill: colors.accent,
                }, 1),
              ],
            },
            spacer(28),
            {
              type: 'row',
              children: [
                shapeCard('line', {
                  type: 'line',
                  x1: 0,
                  y1: 90,
                  x2: 260,
                  y2: 10,
                  stroke: colors.warning,
                  strokeWidth: 6,
                }, 2),
                spacer(28),
                shapeCard('polygon', {
                  type: 'polygon',
                  points: [120, 0, 240, 88, 194, 226, 46, 226, 0, 88],
                  fill: colors.danger,
                  opacity: 0.92,
                }, 3),
              ],
            },
          ],
        },
      ],
    };
  },
};
