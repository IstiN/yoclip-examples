// broll_02 — download_qr_scan video slot (background layer, 170–362)
//
// Hands-scanning-QR b-roll under 02_download. See assets/VIDEO_PROMPTS.md
// and lib/video_slots.js.

scene = {
  id: 'broll_02_qr_scan',
  duration: 192,
  from: 602,
  timeline: {
    label: 'B-roll · qr_scan',
    color: '#2EBD9E',
    lane: 'video',
  },

  render: function(frame) {
    var T = faTheme();
    var F = faFormat();
    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    if (typeof VIDEO_SLOTS !== 'undefined' && VIDEO_SLOTS) {
      kids.push(faVideoSlot('download_qr_scan_' + T.name + '_' +
        (F.portrait ? 'v' : 'h'), T, F, {
        chipY: F.portrait ? F.H * 0.925 : F.H * 0.87,
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
