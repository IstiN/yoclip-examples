// Showreel 1 — the thumbnail wall.
//
// Modeled on the Motion Canvas anniversary showreel cover: a mosaic of
// video-card tiles, steel blue on the left washing to muted red on the
// right, tiles landing in a center-out ripple while the surface drifts.
// Everything on screen is shape nodes + text; motion is jsr.motion +
// the shared buildWall() component from lib/animation.js.

scene = {
  id: 'wall',
  duration: 120,
  from: 0,
  timeline: {
    label: 'The wall',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    // Caption chip fades up late, bottom-left — like a montage title card.
    var capO = jsr.motion.tween(ms, 2400, 500, 0, 1, 'easeOutExpo');
    var capY = jsr.motion.tween(ms, 2400, 500, 26, 0, 'easeOutExpo');

    return {
      type: 'stack',
      fit: 'expand',
      children: buildWall(frame, 30, {}).concat([
        {
          type: 'container',
          width: 560,
          height: 74,
          radius: 37,
          color: '#0a0a12',
          opacity: capO,
          offsetY: capY,
          positioned: { left: 96, top: 930 },
          padding: { left: 30, right: 30 },
          child: {
            type: 'align',
            alignment: 'center',
            child: {
              type: 'text',
              text: 'ONE WALL OF IDEAS',
              style: { fontSize: 26, color: '#e8eaf2', fontFamily: 'Geneva', fontWeight: '700', letterSpacing: 6 },
            },
          },
        },
        {
          type: 'text',
          text: 'motion & shapes',
          style: { fontSize: 22, color: colors.textMuted, fontFamily: 'Geneva' },
          opacity: capO,
          offsetY: capY,
          positioned: { left: 100, top: 1014 },
        },
      ]),
    };
  },
};
