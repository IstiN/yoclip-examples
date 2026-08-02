// 04 — Prompt: the product magic on the Gamma white world.
//
// Reference beat (Gamma 14–17s): a white pill input types the brief with a
// caret; below it a blue gradient pill button with a tiny 4-point sparkle. A
// dark cursor arrow glides in from the bottom-right (~25f eased), the button
// dips to 0.92 for the click (~6f), then glows (shadow blur shimmer). The
// whole UI slides up and out fast (ei3), done ~15f before the scene ends so
// the next scene enters clean.
//
// Renderer notes: Geneva lacks ✦/➤ glyphs — the sparkle is a 4-point star
// `path` and the cursor a stroked pointer `path`. Container styling is
// direct props only. Column centers via mainAxisAlignment.

scene = {
  id: 'prompt',
  duration: 111,
  description: 'White-world Studio UI: pill input types "A launch video for my app", cursor glides from bottom-right to the blue gradient Render button, click dip 0.92, glow shimmer, then everything slides up/out by frame 96.',
  voicePrompts: {
    en: 'Soft UI ticks as the prompt types; a clean click, then a rising whoosh.',
    ru: 'Мягкие тики интерфейса при печати; чистый клик и восходящий свист.',
  },
  timeline: {
    label: yoclipT('prompt').timeline || 'Prompt',
    color: '#2563eb',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('prompt');
    var fieldText = t.field || 'A launch video for my app';
    var buttonLabel = t.button || 'Render';
    var portrait = yoclipIsPortrait();

    // -- UI group entrance (0–14) and fast exit (82–96, ei3 slide up).
    var uiIn = ease(frame, 0, 14, eo3);
    var uiOut = ease(frame, 82, 96, ei3);
    var uiOp = uiIn * (1 - uiOut);
    var uiY = (1 - uiIn) * 40 - 700 * uiOut;

    // -- Prompt typing (~2.2 chars/frame). TYPE_START holds ~0.8s so the
    // "Describe your video..." hint is actually readable before typing
    // begins; the caret idles in the pill from the hint phase on.
    var TYPE_START = 34;
    var typedPair = typewriterParts(fieldText, frame, TYPE_START, 66);
    var typed = typedPair[0];
    var typedRest = typedPair[1];
    var hint = t.hint || 'Describe your video...';
    var showHint = typed.length === 0 && frame < TYPE_START;
    var typingDone = typed.length >= fieldText.length;
    // Caret only appears once real typing starts, then blinks when done.
    var caretOn = frame >= TYPE_START && (!typingDone || blink(frame, 14) === 1);

    // -- Cursor: appears, glides bottom-right -> button (~25f), clicks.
    // Button sits ~+59 below the column center; the tip lands on its
    // right/lower area so it never covers the label at the click.
    var curFade = seg(frame, 78, 84);
    var curOp = seg(frame, 34, 40) * (1 - curFade);
    var glide = ease(frame, 40, 65, eio3);
    // Fade-out drift: ease the cursor right-down off the button while it
    // fades, so it never dies as a half-transparent smudge on the button
    // edge.
    var drift = ease(frame, 78, 84, eo3);
    var curX = lerp(portrait ? 300 : 430, 95, glide) + 52 * drift;
    var curY = lerp(330, 80, glide) + 46 * drift;
    // Click dip: button holds 0.92 for ~6f.
    var dip = seg(frame, 65, 68) * (1 - seg(frame, 71, 77));
    var btnScale = 1 - 0.08 * dip;
    // Post-click glow: shadow blur shimmers.
    var glowIn = seg(frame, 71, 78);
    var glowBlur = 24 + glowIn * 26 * shimmer(frame, 24);

    // -- Sparkle twinkle inside the button.
    var sparkScale = 0.8 + 0.35 * shimmer(frame, 20);

    var pillW = portrait ? 620 : 780;

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        // Gamma white world.
        { type: 'container', color: '#f5f4f1' },
        // UI group: input pill + gradient button.
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          offsetY: uiY,
          opacity: uiOp,
          children: [
            {
              type: 'container',
              width: pillW,
              height: 88,
              color: '#ffffff',
              borderRadius: 999,
              borderColor: '#e5e1dc',
              borderWidth: 1.5,
              shadow: { color: '#26000000', blur: 30, offsetX: 0, offsetY: 12 },
              child: {
                type: 'row',
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 36 },
                  {
                    type: 'text',
                    text: showHint ? hint : typed,
                    style: {
                      fontSize: portrait ? 28 : 32,
                      color: showHint ? '#9aa5b1' : '#1f2937',
                      fontFamily: yoclipFont(),
                    },
                  },
                  {
                    type: 'container',
                    width: 3,
                    height: 36,
                    opacity: caretOn ? 1 : 0,
                    margin: { left: 6 },
                    color: '#2563eb',
                  },
                  {
                    // Invisible remainder: constant line width, no jitter.
                    type: 'text',
                    text: showHint ? '' : typedRest,
                    style: {
                      fontSize: portrait ? 28 : 32,
                      color: '#00000000',
                      fontFamily: yoclipFont(),
                    },
                  },
                ],
              },
            },
            { type: 'container', height: 30 },
            {
              type: 'container',
              width: 300,
              height: 78,
              scale: btnScale,
              gradient: {
                type: 'linear',
                colors: ['#60a5fa', '#2563eb'],
                begin: 'centerLeft',
                end: 'centerRight',
              },
              borderRadius: 999,
              shadow: { color: '#662563eb', blur: glowBlur, offsetX: 0, offsetY: 12 },
              child: {
                type: 'row',
                mainAxisAlignment: 'center',
                crossAxisAlignment: 'center',
                children: [
                  // 4-point star sparkle (path, not a glyph).
                  {
                    type: 'path',
                    path: 'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z',
                    color: '#ffffff',
                    strokeWidth: 2.5,
                    width: 22,
                    height: 22,
                    scale: sparkScale,
                    margin: { right: 12 },
                  },
                  {
                    type: 'text',
                    text: buttonLabel,
                    style: {
                      fontSize: portrait ? 30 : 34,
                      color: '#ffffff',
                      fontFamily: yoclipFont(),
                      fontWeight: 700,
                    },
                  },
                ],
              },
            },
          ],
        },
        // Cursor arrow (stroked pointer, dark), gliding to the button.
        {
          type: 'path',
          path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
          color: '#1f2937',
          strokeWidth: 3,
          width: 34,
          height: 34,
          alignment: 'center',
          offsetX: curX,
          offsetY: curY + uiY,
          opacity: curOp * uiIn,
        },
      ],
    };
  },
};
