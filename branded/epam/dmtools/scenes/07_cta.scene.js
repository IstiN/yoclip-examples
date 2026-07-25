// 07 — CTA: "Build your AI factory." The install one-liner types out in a
// terminal chip, the repo URL follows with the GitHub mark, and a QR card
// for the repo sits on the right. `<epam>` signs off; the fade-out overlay
// scene closes the film.
scene = {
  id: 'cta',
  duration: 295,
  from: 1920,
  description:
    "Preheader OPEN SOURCE · APACHE 2.0, headline 'Build your AI " +
    "factory.' — gradient on 'AI factory.'. A terminal chip types the " +
    'install one-liner (curl … install.sh | bash), then the repo URL ' +
    'rises with the GitHub mark. On the right a snow QR card for ' +
    'github.com/epam/dm.ai — SCAN TO STAR. The <epam> wordmark signs ' +
    'off top-left; a separate overlay fades the frame out.',
  voicePrompts: {
    en: 'DMTools. Open source, from EPAM. Scan the code. One command to ' +
        'install. And build your AI factory with us.',
  },
  timeline: { label: 'CTA', color: '#00F6FF', lane: 'video' },
  audio: [ { source: 'assets/audio/07.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 8, 267, 20);

    var glow1 = eo3(seg(frame, 0, 70));
    var glow2 = eo3(seg(frame, 24, 90));

    // The light variant swaps two-tone marks to their dark cuts.
    var tone = (typeof yoclipVariant !== 'undefined' && yoclipVariant &&
      yoclipVariant.icons === 'dark') ? '_dark' : '';

    // terminal line: $ curl -fsSL https://github.com/epam/dm.ai/releases/latest/download/install.sh | bash
    var cmd = 'curl -fsSL https://github.com/epam/dm.ai/releases/latest/download/install.sh | bash';
    var typed = clamp(Math.floor((frame - 66) * 1.1), 0, cmd.length);
    var termE = enter(frame, 52, 20, 24);

    // QR card: pops in, gentle float afterwards.
    var qrP = pop(frame, 120, 24);
    var qrFloat = frame > 150 ? float(frame, 6, 0.03, 0) : 0;

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sea'), c('mint')], 1150, 850, {
          alignment: 'bottomRight', offsetX: 240, offsetY: 280,
          opacity: 0.5 * glow1, blur: 150,
        }),
        blurGlow([c('lilac'), c('sky')], 760, 620, {
          alignment: 'topLeft', offsetX: -260, offsetY: -240,
          opacity: 0.26 * glow2, blur: 160,
        }),

        epamLogo(150, eo3(seg(frame, 6, 26))),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 240, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('OPEN SOURCE · APACHE 2.0', c('sea'), 26, { offsetX: -13 }), enter(frame, 12, 22, 26)),
            { type: 'container', height: 20, alignment: 'topLeft' },
            withEnter(headline('Build your', 128, false), enter(frame, 20, 26, 44)),
            withEnter(headline('AI factory.', 128, true), enter(frame, 32, 26, 44)),
            { type: 'container', height: 58, alignment: 'topLeft' },

            // terminal chip
            {
              type: 'container',
              width: 1300,
              borderRadius: 16,
              color: c('surface'),
              borderColor: c('hairline'),
              borderWidth: 1.5,
              alignment: 'topLeft',
              opacity: termE.opacity,
              offsetY: termE.offsetY,
              child: {
                type: 'row',
                alignment: 'topLeft',
                margin: { top: 24, left: 30, right: 30, bottom: 24 },
                crossAxisAlignment: 'center',
                children: [
                  {
                    type: 'text',
                    text: '$',
                    alignment: 'topLeft',
                    style: { fontFamily: 'Museo Sans 700', fontSize: 28, color: c('sea') },
                  },
                  { type: 'container', width: 18, height: 1, alignment: 'topLeft' },
                  {
                    type: 'text',
                    text: cmd.substring(0, typed),
                    alignment: 'topLeft',
                    style: { fontFamily: 'Museo Sans 500', fontSize: 28, color: c('snow') },
                  },
                  {
                    type: 'container',
                    width: 15, height: 32,
                    color: c('sea'),
                    opacity: typed < cmd.length ? blink(frame, 16) : 0,
                    alignment: 'topLeft',
                  },
                ],
              },
            },

            { type: 'container', height: 52, alignment: 'topLeft' },
            ruleDraw(frame, 140, 26, 140, undefined, -12),
            { type: 'container', height: 22, alignment: 'topLeft' },
            // GitHub mark + repo URL
            withEnter(
              {
                type: 'row',
                alignment: 'topLeft',
                crossAxisAlignment: 'center',
                children: [
                  {
                    type: 'image',
                    source: 'external:ic_github' + tone,
                    fit: 'contain',
                    width: 40,
                    height: 40,
                    alignment: 'center',
                  },
                  { type: 'container', width: 28, height: 1, alignment: 'topLeft' },
                  emphasis('github.com/epam/dm.ai', 44, c('snow'), undefined, { offsetX: -4 }),
                ],
              },
              enter(frame, 146, 24, 20)
            ),
          ],
        },

        // QR card, right side — scan to star the repo.
        {
          type: 'container',
          width: 320,
          height: 388,
          borderRadius: 28,
          color: '#FBFAFA',
          alignment: 'centerRight',
          margin: { right: 120 },
          scale: qrP.scale,
          opacity: qrP.opacity,
          offsetY: qrFloat,
          shadow: { color: c('sea'), blur: 50, offsetX: 0, offsetY: 10, spread: 0 },
          child: {
            type: 'column',
            alignment: 'topLeft',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', height: 26, alignment: 'topLeft' },
              {
                type: 'image',
                source: 'external:qr_dmtools',
                fit: 'contain',
                width: 268,
                height: 268,
                alignment: 'center',
              },
              { type: 'container', height: 22, alignment: 'topLeft' },
              {
                type: 'text',
                text: 'SCAN TO STAR',
                alignment: 'center',
                style: {
                  fontFamily: 'Museo Sans 900',
                  fontSize: 22,
                  color: '#060606',
                  letterSpacing: 5,
                },
              },
            ],
          },
        },
      ],
    };
  },
};
