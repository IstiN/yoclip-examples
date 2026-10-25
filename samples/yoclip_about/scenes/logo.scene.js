// Overlay layer: a small YoClip watermark pinned to the top-right for the
// whole video. Kept at a steady low opacity so it never flickers; the big logo
// moments (intro, CTA) sit in the center and do not clash with it.

scene = {
  id: 'logo',
  duration: 4170,
  from: 0,
  timeline: {
    label: yoclipT('logo').timeline || 'Logo',
    color: yoclipColor('white', '#ffffff'),
    lane: 'video',
  },
  render: function(frame) {
    // Hide the corner watermark as the finale (CTA, global frame 3678)
    // takes over — the big centered logo owns the brand there.
    var fadeOut = frame < 3678 ? 1 : 1 - ease(frame, 3678, 3708, eo3);
    return {
      type: 'image',
      source: yoclipLogoSource(),
      width: 240,
      height: 152,
      alignment: 'topRight',
      padding: 44,
      opacity: 0.5 * fadeOut,
    };
  },
};
