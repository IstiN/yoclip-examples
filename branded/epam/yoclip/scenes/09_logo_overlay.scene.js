// 07 — OVERLAY: quiet persistent `<epam>` wordmark across the middle scenes.
scene = {
  id: 'logo_overlay',
  duration: 1700,
  description:
    "Small white <epam> wordmark, top-left, fading in after the cover and " +
    "out before the CTA (which carries its own large sign-off).",
  timeline: { label: 'Logo', color: '#A0A0A0', lane: 'overlay' },
  render: function(frame) {
    return {
      type: 'stack', fit: 'expand',
      children: [
        epamLogo(110, presence(frame, 15, 1640, 45) * 0.9),
      ],
    };
  },
};
