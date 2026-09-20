// broll_01 — hook_typing video slot (background layer, frames 432–170)
//
// Sits on its own "B-roll" lane under 01_hook. Today it paints the scene
// base + slot marks; when the Grok clip lands, replace the body with an
// AnimVideo node (source: 'external:hook_typing_<theme>_<v|h>') — the
// content scene above has no full-frame background, so footage shows
// through. See assets/VIDEO_PROMPTS.md.

scene = {
  id: 'broll_01_hook_typing',
  duration: 170,
  from: 432,
  timeline: {
    label: 'B-roll · hook_typing',
    color: '#2EBD9E',
    lane: 'video',
  },

  render: function(frame) {
    var T = faTheme();
    var F = faFormat();
    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    if (typeof VIDEO_SLOTS !== 'undefined' && VIDEO_SLOTS) {
      var isP = F.portrait;
      var slotW = Math.min(F.W * 0.66, 920);
      kids.push(faVideoSlot('hook_typing_' + T.name + '_' + (isP ? 'v' : 'h'), T, F, {
        chipX: isP ? F.cx - slotW / 2 : F.W * 0.06,
        chipY: isP ? F.H * 0.44 : F.H * 0.68,
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
