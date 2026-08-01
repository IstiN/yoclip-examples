// 00 — Hook: a lone caret blinks on the Gamma white world, types the
// question in black, holds it, then ERASES it back to the lone caret.
//
// Reference beat (Gamma 0–4s): off-white paper, black bold type. The caret
// blinks alone for ~1s, the typewriter runs (~1.1 chars/frame) with the
// caret riding the end of the text, the full question holds ~1s, then a
// fast backspace sweep (~2.5 chars/frame) wipes it — the remaining lone
// caret is what morphs into the monolith in the next scene, so it must sit
// dead center when the text is gone. Ends on a hard cut.
//
// Renderer notes: the off-white world is a hardcoded #f5f4f1 full-frame
// container (Gamma fidelity, NOT the dark theme background) and the stack
// keeps opacity 1 from frame 0 — a fade-in would reveal the dark
// background layer behind it on the very first frames. Geneva has no glyph
// issues here since the caret is a plain container bar.

scene = {
  id: 'hook',
  duration: 150,
  description: 'White-world typewriter hook: lone caret blinks, "What\'s your next video?" types in black, holds, then erases back to the lone centered caret. Hard cut at the end.',
  voicePrompts: {
    en: 'Quiet room tone, a keystroke-click per character, faster clicks on the backspace sweep.',
    ru: 'Тихая комната, клик клавиши на символ, частые клики на стирании.',
  },
  timeline: {
    label: yoclipT('hook').timeline || 'Hook',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('hook');
    var question = t.question || "What's your next video?";

    var TYPE_START = 30;  // ~1s of lone blinking caret
    var TYPE_END = 63;    // typing done (~1.1 chars/frame)
    var ERASE_START = 95; // ~1s hold of the full question
    var ERASE_END = 112;  // ~2.5 chars/frame backspace sweep

    var typed;
    if (frame < ERASE_START) {
      typed = typewriter(question, frame, TYPE_START, 33);
    } else {
      var left = Math.round(question.length * (1 - seg(frame, ERASE_START, ERASE_END)));
      typed = question.substring(0, Math.max(0, left));
    }
    var busy = (frame >= TYPE_START && frame < TYPE_END) ||
               (frame >= ERASE_START && frame < ERASE_END);
    // Caret: blinks only while idle-holding the typed question. Solid during
    // the opening frames (no dark/empty flash on frame 0), while typing and
    // erasing, and after the erase completes — the lone caret must stay
    // visible up to the hard cut, otherwise the scene flickers a fully
    // empty white frame.
    var caretOn = (frame < 8 || busy || frame >= ERASE_END) ? 1 : blink(frame, 16);
    // Subtle zoom settle across the typing window.
    var zoom = 1.15 - 0.15 * ease(frame, TYPE_START - 6, TYPE_START + 30, eio3);

    var portrait = yoclipIsPortrait();
    var fs = portrait ? 56 : 92;

    return {
      type: 'stack',
      fit: 'expand',
      // Opacity 1 from frame 0: the dark background layer must never show
      // through on the opening frames.
      children: [
        // Gamma white world (intentionally NOT the theme dark background).
        { type: 'container', color: '#f5f4f1' },
        {
          type: 'row',
          alignment: 'center',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          scale: zoom,
          children: [
            {
              type: 'text',
              text: typed,
              style: {
                fontSize: fs,
                color: '#141414',
                fontFamily: yoclipFont(),
                fontWeight: 700,
              },
            },
            {
              type: 'container',
              width: portrait ? 5 : 7,
              height: Math.round(fs * 1.08),
              opacity: caretOn,
              margin: { left: 10 },
              color: '#141414',
            },
          ],
        },
      ],
    };
  },
};
