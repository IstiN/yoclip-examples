// broll_01 — hook_typing video slot (background layer, frames 451–530)
//
// Sits on its own "B-roll" lane under 01_hook. Starts at 451 — the intro
// video (content layer, above) covers the background until its source
// ends there, so the slot is visible only for the hook scene's tail.
// When the Grok clip lands, replace the body with an AnimVideo node
// (source: 'external:hook_typing_<theme>_<v|h>') — the content scene
// above has no full-frame background, so footage shows through. See
// assets/VIDEO_PROMPTS.md.

scene = {
  id: 'broll_01_hook_typing',
  duration: 19,
  from: 451,
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
        chip: false,
        chipX: isP ? F.cx - slotW / 2 : F.W * 0.06,
        chipY: isP ? F.H * 0.44 : F.H * 0.68,
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
