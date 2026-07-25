// 02 — FRAMEWORK: "It's engineered." AI 360 — four pillar cards stagger in.
scene = {
  id: 'framework',
  duration: 250,
  description:
    "Preheader 'AI/RUN BLUEPRINTS', headline 'Success doesn't happen by " +
    "chance. It's engineered.' — gradient on 'engineered.'. Four dark pillar " +
    "cards stagger up: 01 Define AI Strategy, 02 Build AI Foundations, " +
    "03 Drive Adoption at Scale, 04 Industrialize AI Managed Services, each " +
    "with a gradient number and a sea underline draw.",
  voicePrompts: {
    en: "Success doesn't happen by chance — it's engineered. The EPAM AI 360 " +
        'framework: define your AI strategy, build AI foundations, drive ' +
        'adoption at scale, industrialize AI managed services.',
  },
  timeline: { label: 'AI 360', color: '#B896FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 12, 220, 18);

    var cards = [
      { n: '01', title: 'Define AI Strategy', desc: 'Align AI initiatives with business goals.' },
      { n: '02', title: 'Build AI Foundations', desc: 'Data, platforms and governance that scale.' },
      { n: '03', title: 'Drive Adoption at Scale', desc: 'New ways of working, embedded in the org.' },
      { n: '04', title: 'Industrialize AI Services', desc: 'Run AI as a managed capability.' },
    ];

    var cardNodes = [];
    for (var i = 0; i < cards.length; i++) {
      (function(i) {
        var cd = cards[i];
        var start = 55 + i * 14;
        var e = enter(frame, start, 26, 60);
        cardNodes.push({
          type: 'container',
          width: 405,
          height: 300,
          borderRadius: 18,
          color: c('surface'),
          borderColor: c('hairline'),
          borderWidth: 1.5,
          alignment: 'topLeft',
          opacity: e.opacity,
          offsetY: e.offsetY,
          child: {
            type: 'column',
            alignment: 'topLeft',
            margin: { top: 30, left: 30 },
            crossAxisAlignment: 'start',
            children: [
              headline(cd.n, 58, true),
              { type: 'container', height: 14, alignment: 'topLeft' },
              ruleDraw(frame, start + 14, 20, 70),
              { type: 'container', height: 22, alignment: 'topLeft' },
              emphasis(cd.title, 30, c('snow')),
              { type: 'container', height: 12, alignment: 'topLeft' },
              body(cd.desc, 23, c('muted')),
            ],
          },
        });
        if (i < cards.length - 1) {
          cardNodes.push({ type: 'container', width: 28, height: 1, alignment: 'topLeft' });
        }
      })(i);
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('lilac'), c('sky')], 900, 700, {
          alignment: 'bottomLeft', offsetX: -260, offsetY: 300, opacity: 0.18,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 120, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('AI/RUN™ BLUEPRINTS', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 18, alignment: 'topLeft' },
            withEnter(headline("Success doesn\u2019t happen by chance.", 92, false), enter(frame, 16, 24, 36)),
            withEnter(headline("It\u2019s engineered.", 92, true), enter(frame, 26, 24, 36)),
            { type: 'container', height: 64, alignment: 'topLeft' },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'start',
              children: cardNodes,
            },
          ],
        },
      ],
    };
  },
};
