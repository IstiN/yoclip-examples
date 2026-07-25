// 09 — FADE OUT: the closing beat. The frame eases to the canvas color
// (Night / Snow per variant) over the last 50 frames.
scene = {
  id: 'fadeout',
  duration: 50,
  from: 2130,
  description:
    'The whole frame eases to the canvas color over 50 frames — a clean ' +
    'fade to close the film after the CTA.',
  timeline: { label: 'Fade', color: '#A0A0A0', lane: 'video' },
  render: function(frame) {
    return {
      type: 'absolute_fill',
      color: c('night'),
      opacity: eo3(seg(frame, 6, 44)),
    };
  },
};
