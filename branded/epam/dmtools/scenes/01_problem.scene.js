// 01 — PROBLEM: "Delivery runs on duct tape." Six disconnected tool cards,
// connectors that never connect, then "One-off scripts don't scale."
scene = {
  id: 'problem',
  duration: 371,
  from: 150,
  description:
    "Preheader THE PROBLEM, headline 'Delivery runs on duct tape.' — " +
    "gradient on 'duct tape.'. Six small tool cards (Tracker, Source, Docs, " +
    'Design, CI/CD, AI provider) stagger in along the bottom; between every ' +
    'pair a broken connector — two dashes that never meet, with a pulsing ' +
    'gap dot. Subline fades in: One-off scripts don\u2019t scale.',
  voicePrompts: {
    en: 'You already have AI. Copilots in every team. But delivery still ' +
        'runs on handoffs — and scripts nobody owns. The tools don\u2019t ' +
        'talk to each other.',
  },
  timeline: { label: 'Problem', color: '#7BA8FF', lane: 'video' },
  audio: [ { source: 'assets/audio/01.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 12, 341, 18);

    var cards = [
      { title: 'Tracker', sub: 'Jira · ADO' },
      { title: 'Source', sub: 'GitHub · GitLab' },
      { title: 'Docs', sub: 'Confluence' },
      { title: 'Design', sub: 'Figma' },
      { title: 'CI/CD', sub: 'Jenkins · Actions' },
      { title: 'AI', sub: 'LLM providers' },
    ];

    var rowChildren = [];
    for (var i = 0; i < cards.length; i++) {
      (function(i) {
        var start = 60 + i * 12;
        var e = enter(frame, start, 24, 44);
        rowChildren.push({
          type: 'container',
          width: 260,
          height: 150,
          borderRadius: 16,
          color: typeof c !== 'undefined' ? c('surface') : '#161616',
          borderColor: typeof c !== 'undefined' ? c('hairline') : '#2a2a2a',
          borderWidth: 1.5,
          alignment: 'topLeft',
          opacity: e.opacity,
          offsetY: e.offsetY,
          child: {
            type: 'column',
            alignment: 'topLeft',
            margin: { top: 28, left: 26 },
            crossAxisAlignment: 'start',
            children: [
              emphasis(cards[i].title, 30, typeof c !== 'undefined' ? c('snow') : '#FBFAFA'),
              { type: 'container', height: 10, alignment: 'topLeft' },
              body(cards[i].sub, 22, typeof c !== 'undefined' ? c('muted') : '#A0A0A0'),
            ],
          },
        });
        if (i < cards.length - 1) {
          // Broken connector: two dashes that never meet + a pulsing gap dot.
          var conn = eo3(seg(frame, start + 10, start + 30));
          var pulse = 0.35 + 0.3 * (typeof shimmer !== 'undefined' ? shimmer(frame + i * 9, 26) : 0);
          rowChildren.push({
            type: 'container',
            width: 46,
            height: 150,
            alignment: 'topLeft',
            child: {
              type: 'stack',
              children: [
                {
                  type: 'container',
                  width: 14 * conn,
                  height: 2,
                  color: typeof c !== 'undefined' ? c('muted') : '#A0A0A0',
                  opacity: 0.7,
                  alignment: 'centerLeft',
                  margin: { left: 2 },
                },
                {
                  type: 'container',
                  width: 14 * conn,
                  height: 2,
                  color: typeof c !== 'undefined' ? c('muted') : '#A0A0A0',
                  opacity: 0.7,
                  alignment: 'centerRight',
                  margin: { right: 2 },
                },
                {
                  type: 'container',
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  color: typeof c !== 'undefined' ? c('sky') : '#7BA8FF',
                  opacity: pulse * conn,
                  alignment: 'center',
                },
              ],
            },
          });
        }
      })(i);
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sky'), c('lilac')], 900, 700, {
          alignment: 'topRight', offsetX: 300, offsetY: -260, opacity: 0.16,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 150, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('THE PROBLEM', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 18, alignment: 'topLeft' },
            withEnter(headline('Delivery runs on', 96, false), enter(frame, 16, 24, 36)),
            withEnter(headline('duct tape.', 96, true), enter(frame, 26, 24, 36)),
            { type: 'container', height: 30, alignment: 'topLeft' },
            withEnter(
              body('Every system speaks its own language — and the glue is scripts nobody owns.', 30, typeof c !== 'undefined' ? c('muted') : '#A0A0A0', undefined, { offsetX: -12 }),
              enter(frame, 40, 24, 22)
            ),
            { type: 'container', height: 90, alignment: 'topLeft' },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'center',
              children: rowChildren,
            },
            { type: 'container', height: 54, alignment: 'topLeft' },
            withEnter(
              emphasis('One-off scripts don\u2019t scale.', 34, typeof c !== 'undefined' ? c('snow') : '#FBFAFA', undefined, { offsetX: -12 }),
              enter(frame, 150, 26, 22)
            ),
          ],
        },
      ],
    };
  },
};
