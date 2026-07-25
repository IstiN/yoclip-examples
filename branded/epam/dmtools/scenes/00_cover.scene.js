// 00 — COVER: `<epam>` sign-in, blur bloom, the DMTools wordmark.
scene = {
  id: 'cover',
  duration: 284,
  from: 0,
  description:
    'Canvas. A cyan blur glow blooms bottom-right, a lilac one top-left. ' +
    'The <epam> wordmark fades in top-left. Preheader EPAM OPEN SOURCE, ' +
    'then the airy headline "DMTools" rises in — painted in the brand ' +
    'gradient. A sea rule draws under it, subline "Enterprise AI-factory ' +
    'orchestrator." fades in, then a quiet chip row: Apache 2.0 · Java 17+ · ' +
    'github.com/epam/dm.ai.',
  voicePrompts: {
    en: 'Every enterprise wants an AI factory. Few know where to start. ' +
        'This is DMTools — from EPAM.',
  },
  timeline: { label: 'Cover', color: '#00F6FF', lane: 'video' },
  audio: [ { source: 'assets/audio/00.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    if (typeof presence === 'undefined') return { type: 'container' };
    var master = presence(frame, 10, 254, 20);

    // Signature blur glows blooming in.
    var glow1 = eo3(seg(frame, 0, 70));
    var glow2 = eo3(seg(frame, 30, 100));

    function chip(text, enterStart) {
      var e = enter(frame, enterStart, 20, 16);
      return {
        type: 'container',
        borderRadius: 22,
        borderColor: typeof c !== 'undefined' ? c('hairline') : '#2a2a2a',
        borderWidth: 1.5,
        color: typeof c !== 'undefined' ? c('surface') : '#161616',
        padding: 0,
        opacity: e.opacity,
        offsetY: e.offsetY,
        alignment: 'topLeft',
        child: {
          type: 'text',
          text: text,
          alignment: 'topLeft',
          margin: { top: 10, left: 22, right: 22, bottom: 10 },
          style: {
            fontFamily: 'Museo Sans 500',
            fontSize: 22,
            color: typeof c !== 'undefined' ? c('muted') : '#A0A0A0',
            letterSpacing: 1,
          },
        },
      };
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
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
          margin: { top: 290, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('EPAM OPEN SOURCE', c('sea'), 28, { offsetX: -13 }), enter(frame, 20, 25, 30)),
            { type: 'container', height: 22, alignment: 'topLeft' },
            withEnter(headline('DMTools', 190, true, undefined, { offsetX: -18 }), enter(frame, 35, 28, 50)),
            { type: 'container', height: 30, alignment: 'topLeft' },
            ruleDraw(frame, 70, 30, 140, undefined, -18),
            { type: 'container', height: 26, alignment: 'topLeft' },
            withEnter(
              body('Enterprise AI-factory orchestrator.', 40, c('snow'), undefined, { offsetX: -18 }),
              enter(frame, 84, 25, 24)
            ),
            { type: 'container', height: 44, alignment: 'topLeft' },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'center',
              children: [
                chip('Apache 2.0', 100),
                { type: 'container', width: 16, height: 1, alignment: 'topLeft' },
                chip('Java 17+', 108),
                { type: 'container', width: 16, height: 1, alignment: 'topLeft' },
                chip('github.com/epam/dm.ai', 116),
              ],
            },
          ],
        },
      ],
    };
  },
};
