// 00 — Intro — Grok-generated hook video (451 frames ≈ 15.04s)
//
// Full-bleed AnimVideo layer. The source clip is 768x1168 portrait at
// 24fps; `fit: cover` crops it to each variant's canvas (portrait
// variants are nearly lossless, landscape crops top/bottom).
// `speed: 0.8` (= 24/30) plays the clip at NATIVE tempo: picture and its
// soundtrack both run to the source end at comp frame 451, keeping A/V in
// sync in the export mixdown (which plays the extracted wav 1:1). From
// frame 360 (12s) the next scene renders above this one; the intro's last
// seconds of audio play on underneath it. Background music is a quiet bed
// from frame 0 (see yoclip.yaml envelope).

scene = {
  id: '00_intro',
  duration: 451,
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
          speed: 0.8,
          width: F.W,
          height: F.H,
        },
      ],
    };
  },
};
