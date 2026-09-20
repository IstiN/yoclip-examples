// broll_05 — build_montage video slot (background layer, 698–938)
//
// Person-at-desk coding montage behind the 05_build app cards (render it
// dim — opacity ~0.35 — once the real clip lands). Marks only, no chip:
// the card grid covers most of the frame. See assets/VIDEO_PROMPTS.md.

scene = {
  id: 'broll_05_build_montage',
  duration: 240,
  from: 698,
  timeline: {
    label: 'B-roll · build_montage',
    color: '#5B61F6',
    lane: 'video',
  },

  render: function(frame) {
    var T = faTheme();
    var F = faFormat();
    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    if (typeof VIDEO_SLOTS !== 'undefined' && VIDEO_SLOTS) {
      kids.push(faVideoSlot('build_montage_' + T.name + '_' +
        (F.portrait ? 'v' : 'h'), T, F, {
        chip: false,
        opacity: 0.85,
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
