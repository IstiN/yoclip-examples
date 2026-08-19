// 05b — Zoom: freeze the deck, dive at the kaleidoscope slot, land on blue.
//
// Choreography (150f):
//   0-8    the deck's pinned frame (scene:deck@150 — its outro fade starts
//          at 155, so 150 is the last fully-visible frame) holds fullscreen.
//   8-46   the camera dives toward the deck's first rail thumbnail — the
//          kaleidoscope slot — until that point fills the screen (scale ~11,
//          vector snapshot so it stays crisp).
//   26-44  the snapshot dissolves mid-dive: NO kaleidoscope — we land on
//          the plain light-blue world (the deck's own gradient).
//   48-60  a light prompt bar floats in at screen center.
//   58-86  the message types with a violet caret.
//   94-101 the Render button pulses; caret blinks; the bar leaves at
//          124-138 and the kaleido portal scene takes over.
//
// Renderer notes: the blue background is opaque from frame 0 and the root
// stack carries NO opacity — fading the root once let the dark background
// layer bleed through at scene cuts. scale on the snapshot is around its
// own center; offsets are thumbCenter * (S - 1) so the pan tracks the zoom.

scene = {
  id: 'zoom',
  duration: 150,
  description: 'Deck freeze (scene:deck@150) holds, the camera dives at the kaleidoscope thumbnail slot until it fills the screen, dissolving mid-zoom to the plain light-blue world; a centered prompt bar types the kaleidoscope message, Render pulses, the kaleido portal takes over.',
  voicePrompts: {
    en: 'A deep whoosh as we dive into the thumbnail, then quiet — soft keystrokes as the prompt types, a warm click on Render.',
    ru: 'Глубокий свист на нырке в превью, затем тишина — мягкие клавиши при печати, тёплый клик на «Рендер».',
  },
  timeline: {
    label: yoclipT('zoom').timeline || 'Zoom',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('zoom');
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var primary = yoclipColor('primary', '#7c3aed');
    var accent = yoclipColor('accent', '#22d3ee');

    var promptText = (t.prompts && t.prompts[0]) ||
      'A 3D neon kaleidoscope vortex with real frames';

    // ------------------------------------------------------------------
    // Camera dive onto the deck's first rail thumbnail.
    // Deck rail geometry (landscape): railX 84, thumb 170x108, 5 items,
    // gap 18, railH 612 -> first thumb center at (-791, -252) rel. center.
    // ------------------------------------------------------------------
    var zoom = eio3(seg(frame, 8, 46));
    var S = portrait ? lerp(1, 3, zoom) : lerp(1, 11, zoom);
    var OX = portrait ? 0 : 791 * (S - 1);
    var OY = portrait ? 0 : 252 * (S - 1);
    var snapOp = 1 - eo3(seg(frame, 26, 44));

    var children = [];

    // Light-blue world — the deck's own gradient, opaque from frame 0.
    children.push({
      type: 'container',
      gradient: {
        type: 'linear',
        colors: ['#d8e6f8', '#aec9ec'],
        begin: 'topCenter',
        end: 'bottomCenter',
      },
    });

    // The pinned deck frame, diving at the kaleidoscope slot.
    if (snapOp > 0.001) {
      children.push({
        type: 'image',
        source: 'scene:deck@150',
        fit: 'contain',
        alignment: 'center',
        width: 1920,
        height: 1080,
        scale: S,
        offsetX: OX,
        offsetY: OY,
        opacity: snapOp,
      });
    }

    // ------------------------------------------------------------------
    // Prompt bar — light pill at screen center.
    // ------------------------------------------------------------------
    var barIn = eio3(seg(frame, 48, 60));
    var barOut = eo3(seg(frame, 124, 138));
    var barOp = clamp(barIn - barOut, 0, 1);

    if (barOp > 0.001) {
      var pulse = 1 + 0.14 *
        (eo3(seg(frame, 94, 97)) - eo3(seg(frame, 97, 101)));

      var barW = portrait ? 860 : 880;
      var textW = 620;
      var btnW = 148;
      var spacerW = barW - 30 - textW - 3 - btnW - 14;

      children.push({
        type: 'container',
        alignment: 'center',
        offsetY: (1 - barIn) * 40,
        width: barW,
        height: 80,
        opacity: barOp,
        color: '#f2f3f8',
        borderRadius: 999,
        shadow: { color: '#331a2b4a', blur: 30, offsetX: 0, offsetY: 12 },
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 30 },
            // Shared typewriter field (same caret behaviour as 04_prompt),
            // pinned to a fixed width so the button never moves.
            {
              type: 'container',
              width: textW,
              alignment: 'centerLeft',
              child: {
                type: 'row',
                crossAxisAlignment: 'center',
                children: typewriterFieldNodes({
                  frame: frame,
                  text: promptText,
                  start: 58,
                  cps: 50,
                  font: font,
                  fontSize: 22,
                  color: '#151a28',
                  caretColor: primary,
                  caretHeight: 32,
                }),
              },
            },
            { type: 'container', width: spacerW },
            renderButtonNode({
              label: t.button || 'Render',
              font: font,
              fontSize: 18,
              width: btnW,
              height: 52,
              colors: [primary, accent],
              scale: pulse,
              sparkleSize: 16,
            }),
            { type: 'container', width: 14 },
          ],
        },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: children,
    };
  },
};
