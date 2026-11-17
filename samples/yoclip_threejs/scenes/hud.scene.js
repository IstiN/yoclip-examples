
var scene = {
  id: 'hud',
  duration: PROMO.duration,
  layer: 'overlay',
  pptx: false,
  timeline: { label: 'Editorial HUD', color: '#a78bfa', lane: 'Overlay' },
  render: function(frame) {
    var shot = Math.min(11, Math.floor(frame / PROMO.shotDuration));
    var local = frame - shot * PROMO.shotDuration;
    var visibility = eo3(seg(frame, 12, 32)) * (1 - eo3(seg(frame, 3570, 3600)));
    var quiet = shot === 0 || shot === 11 ? 0.48 : 0.78;
    var chapter = pad(shot + 1, 2) + ' / 12';
    var beat = local % 15;
    return stack([
      imageNode(yoclipLogoSource(), {
        width: 118, height: 38, alignment: 'topLeft', offsetX: 62, offsetY: 44,
        opacity: visibility * quiet,
      }),
      txt('YOCLIP / THREE', {
        fontSize: 13, fontWeight: 700, letterSpacing: 2.8,
        color: '#b9b9c9', alignment: 'topLeft', offsetX: 199, offsetY: 52,
        opacity: visibility * quiet,
      }),
      txt(chapter, {
        fontSize: 14, fontWeight: 700, letterSpacing: 2.2, color: '#22d3ee',
        alignment: 'topRight', offsetX: -64, offsetY: 50,
        opacity: visibility * quiet,
      }),
      txt(PROMO.chapters[shot], {
        fontSize: 13, fontWeight: 700, letterSpacing: 2.6, color: '#d5d5df',
        alignment: 'topRight', offsetX: -190, offsetY: 50,
        opacity: visibility * quiet,
      }),
      txt(timecode(frame, 30), {
        fontSize: 13, fontWeight: 600, letterSpacing: 1.8, color: '#aaaaba',
        alignment: 'bottomRight', offsetX: -64, offsetY: -48,
        opacity: visibility * quiet,
      }),
      txt('FRAME ' + pad(frame, 4), {
        fontSize: 12, fontWeight: 600, letterSpacing: 1.6, color: '#77778b',
        alignment: 'bottomLeft', offsetX: 64, offsetY: -48,
        opacity: visibility * quiet,
      }),
      progressBar({
        width: 1792, height: 3, progress: frame / 3599,
        alignment: 'bottomLeft', offsetX: 64, offsetY: -22,
        opacity: visibility * (0.58 + (beat === 0 ? 0.15 : 0)),
        trackColor: '#26ffffff', colors: ['#7c3aed', '#22d3ee'],
      }),
    ]);
  },
};
