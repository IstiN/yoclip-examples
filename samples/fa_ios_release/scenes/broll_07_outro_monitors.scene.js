// broll_07 — outro_monitors video slot (background layer, 1490–1634)
//
// Hero man-at-monitor-wall shot behind the 07_lockup end card (reference:
// storyboard page 23 — keep subject right of center / lower half so the
// lockup keeps its negative space). See assets/VIDEO_PROMPTS.md.

scene = {
  id: 'broll_07_outro_monitors',
  duration: 192,
  from: 1574,
  timeline: {
    label: 'B-roll · outro_monitors',
    color: '#8F6BFF',
    lane: 'video',
  },

  render: function(frame) {
    var T = faTheme();
    var F = faFormat();
    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    if (typeof VIDEO_SLOTS !== 'undefined' && VIDEO_SLOTS) {
      kids.push(faVideoSlot('outro_monitors_' + T.name + '_' +
        (F.portrait ? 'v' : 'h'), T, F, {
        chip: false,
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
