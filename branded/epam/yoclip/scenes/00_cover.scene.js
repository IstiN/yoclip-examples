// 00 — COVER: `<epam>` sign-in, blur bloom, the Redefine headline.
scene = {
  id: 'cover',
  duration: 170,
  from: 0,
  description:
    "Black canvas. A cyan blur glow blooms bottom-right. The <epam> wordmark " +
    "fades in top-left. Preheader 'AI/RUN TRANSFORM', then the airy headline " +
    "'Redefine your enterprise.' rises in — 'Redefine' in the brand gradient. " +
    "A sea rule draws under it, subline fades in.",
  voicePrompts: {
    en: 'EPAM AI Run Transform. Redefine your enterprise — AI-native transformation, engineered.',
  },
  timeline: { label: 'Cover', color: '#00F6FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 10, 140, 20);

    // Signature blur glows blooming in.
    var glow1 = eo3(seg(frame, 0, 70));
    var glow2 = eo3(seg(frame, 30, 100));

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        // Blur treatment — two glows, used sparingly.
        blurGlow([c('sea'), c('sky')], 1100, 850, {
          alignment: 'bottomRight', offsetX: 220, offsetY: 260,
          opacity: 0.5 * glow1, blur: 150,
        }),
        blurGlow([c('lilac'), c('sea')], 700, 600, {
          alignment: 'topLeft', offsetX: -240, offsetY: -220,
          opacity: 0.28 * glow2, blur: 160,
        }),

        epamLogo(170, eo3(seg(frame, 8, 30))),

        // Headline block, center-left.
        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 300, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('AI/RUN™ TRANSFORM', c('sea'), 28, { offsetX: -13 }), enter(frame, 20, 25, 30)),
            { type: 'container', height: 26, alignment: 'topLeft' },
            withEnter(headline('Redefine', 150, true, undefined, { offsetX: -15 }), enter(frame, 35, 28, 50)),
            withEnter(headline('your enterprise.', 150, false), enter(frame, 47, 28, 50)),
            { type: 'container', height: 34, alignment: 'topLeft' },
            ruleDraw(frame, 75, 30, 140, undefined, -15),
            { type: 'container', height: 24, alignment: 'topLeft' },
            withEnter(
              body('AI-native transformation for the enterprise.', 32, c('snow'), undefined, { offsetX: -15 }),
              enter(frame, 88, 25, 24)
            ),
          ],
        },
      ],
    };
  },
};
