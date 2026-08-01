// 00 — Hook: a lone caret types the question.
//
// Reference beat (Gamma 0–4s): tight crop on the typing, then the camera
// pulls back to reveal the whole line. Here: the text layer starts scaled
// 2.4x (cropped by the frame edges) and eases back to 1.0 while the
// typewriter runs; the caret blinks before typing starts and rides the end
// of the text after.

scene = {
  id: 'hook',
  duration: 126,
  slides: [125],
  description: 'Typewriter hook: "What\'s your next video?" — zoom-out reveal on dark.',
  voicePrompts: {
    en: 'Quiet room tone, a single keystroke-click per character.',
    ru: 'Тихая комната, один клик клавиши на символ.',
  },
  timeline: {
    label: yoclipT('hook').timeline || 'Hook',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('hook');
    var question = t.question || "What's your next video?";

    var typed = typewriter(question, frame, 14, 26);
    var done = typed.length >= question.length;
    // Caret blinks until typing starts, solid while typing, blinks after.
    var caretOn = frame < 14 ? blink(frame, 16) : (done ? blink(frame, 16) : 1);
    // Camera pull-back: 2.4 -> 1.0 across the typing window.
    var zoom = 2.4 - 1.4 * ease(frame, 6, 104, eio3);

    var life = presence(frame, 6, 108, 12);
    var portrait = yoclipIsPortrait();

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'row',
          alignment: 'center',
          mainAxisAlignment: 'center',
          scale: zoom,
          children: [
            {
              type: 'text',
              text: typed,
              style: {
                fontSize: portrait ? 64 : 96,
                color: yoclipColor('text', '#ffffff'),
                fontFamily: yoclipFont(),
                fontWeight: 700,
              },
            },
            {
              type: 'container',
              width: portrait ? 5 : 8,
              height: portrait ? 72 : 108,
              opacity: caretOn,
              margin: { left: 10 },
              color: yoclipColor('accent', '#22d3ee'),
            },
          ],
        },
      ],
    };
  },
};
