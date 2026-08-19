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
    var hint = t.hint || 'Describe your video...';

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
                ].concat(typewriterFieldNodes({
                  frame: frame,
                  text: fieldText,
                  start: TYPE_START,
                  cps: 66,
                  hint: hint,
                  font: yoclipFont(),
                  fontSize: portrait ? 28 : 32,
                  color: '#1f2937',
                  caretColor: '#2563eb',
                  caretHeight: 36,
                })),
              },
            },
            { type: 'container', height: 30 },
            renderButtonNode({
              label: buttonLabel,
              font: yoclipFont(),
              fontSize: portrait ? 30 : 34,
              width: 300,
              height: 78,
              colors: ['#60a5fa', '#2563eb'],
              scale: btnScale,
              shadowColor: '#662563eb',
              shadowBlur: glowBlur,
              shadowOffsetY: 12,
              sparkleSize: 22,
              sparkleScale: sparkScale,
            }),
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
