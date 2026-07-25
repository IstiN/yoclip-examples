// 08 — LOGO OVERLAY: the quiet `<epam>` wordmark, top-left, across the
// middle scenes (content layer start 160, duration 1470 in project.js).
scene = {
  id: 'logo_overlay',
  duration: 1740,
  from: 160,
  description:
    'A small <epam> wordmark sits top-left at low opacity for the whole ' +
    'middle of the film; fades in over 20 frames and out over the last 20.',
  timeline: { label: 'Logo', color: '#A0A0A0', lane: 'video' },
  render: function(frame) {
    return {
      type: 'stack', fit: 'expand',
      opacity: presence(frame, 20, 1700, 20),
      children: [
        epamLogo(120, 0.55),
      ],
    };
  },
};
