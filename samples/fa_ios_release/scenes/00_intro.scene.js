// 00 — Intro — Grok-generated hook video (432 frames = 9 bars @ 150 BPM)
//
// Full-bleed AnimVideo layer. The source clip is 768x1168 portrait at
// 24fps; `fit: cover` crops it to each variant's canvas (portrait
// variants are nearly lossless, landscape crops top/bottom).
// Its audio rides the mix as a separate track (assets/audio/intro_audio.mp3,
// start 0); background music starts right after the intro ends (432).

scene = {
  id: '00_intro',
  duration: 432,
  from: 0,
  timeline: {
    label: 'Intro · Video',
    color: '#6E74FF',
    lane: 'video',
  },

  render: function(frame) {
    var F = faFormat();
    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'video',
          source: 'external:intro_video',
          fit: 'cover',
          width: F.W,
          height: F.H,
        },
      ],
    };
  },
};
