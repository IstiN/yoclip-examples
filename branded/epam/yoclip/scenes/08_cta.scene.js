// 06 — CTA: "Let's build your AI-powered future." + GET IN TOUCH + sign-off.
scene = {
  id: 'cta',
  duration: 150,
  description:
    "Two blur glows bloom (sea bottom-left, lilac top-right). Big <epam> " +
    "wordmark top-left. Headline 'Let's build your AI-powered future.' with " +
    "gradient on 'AI-powered future.'. A sea-outlined GET IN TOUCH pill and " +
    "the AI services URL fade in below.",
  voicePrompts: {
    en: "Let's build your AI-powered future. Get in touch — epam dot com.",
  },
  timeline: { label: 'CTA', color: '#00FFF0', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 14, 118, 18);
    var glow1 = eo3(seg(frame, 0, 60));
    var glow2 = eo3(seg(frame, 20, 80));

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sea'), c('mint')], 1000, 800, {
          alignment: 'bottomLeft', offsetX: -220, offsetY: 260,
          opacity: 0.32 * glow1, blur: 150,
        }),
        blurGlow([c('lilac'), c('sky')], 900, 700, {
          alignment: 'topRight', offsetX: 200, offsetY: -240,
          opacity: 0.3 * glow2, blur: 160,
        }),

        epamLogo(240, eo3(seg(frame, 6, 26))),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 250, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(headline("Let\u2019s build your", 130, false), enter(frame, 20, 26, 44)),
            withEnter(headline('AI-powered future.', 130, true), enter(frame, 32, 26, 44)),
            { type: 'container', height: 48, alignment: 'topLeft' },
            // GET IN TOUCH pill — thin Sea outline (brandbook p57).
            withEnter(
              {
                type: 'container',
                width: 300,
                height: 64,
                borderRadius: 32,
                borderColor: c('sea'),
                borderWidth: 2,
                alignment: 'topLeft',
                child: {
                  type: 'text',
                  text: 'GET IN TOUCH',
                  alignment: 'center',
                  style: {
                    fontFamily: 'Museo Sans 900',
                    fontSize: 24,
                    color: c('sea'),
                    letterSpacing: 4,
                  },
                },
              },
              enter(frame, 60, 24, 30)
            ),
            { type: 'container', height: 26, alignment: 'topLeft' },
            withEnter(
              body('epam.com/services/artificial-intelligence', 26, c('muted')),
              enter(frame, 72, 22, 20)
            ),
          ],
        },
      ],
    };
  },
};
