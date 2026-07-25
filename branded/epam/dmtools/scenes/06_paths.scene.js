// 06 — PATHS: "Run it your way." Four usage-path cards stagger in — the
// four primary usage paths from the repo README.
scene = {
  id: 'paths',
  duration: 275,
  from: 1450,
  description:
    "Preheader FOUR WAYS IN, headline 'Run it your way.' — gradient on " +
    "'your way.'. Four cards stagger up: 01 CLI tools (direct calls " +
    'from the terminal), 02 Jobs + agents (reusable orchestrated ' +
    'workflows), 03 CI/CD Pipelines (GitHub Actions, Jenkins, Bitrise, ' +
    'GitLab CI, Bitbucket), 04 Agent skills (Cursor, Claude, Codex, ' +
    'Copilot), each with a gradient number and rule.',
  voicePrompts: {
    en: 'Adopt it your way. The CLI. Reusable jobs. Your CI pipelines. ' +
        'Or skills for the agents your teams already use.',
  },
  timeline: { label: 'Paths', color: '#7BA8FF', lane: 'video' },
  audio: [ { source: 'assets/audio/06.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 12, 245, 18);

    var cards = [
      { n: '01', title: 'CLI tools', desc: 'Direct tool calls and integration ops from the terminal.' },
      { n: '02', title: 'Jobs + agents', desc: 'Reusable orchestrated workflows — analysis, tests, reporting.' },
      { n: '03', title: 'CI/CD Pipelines', desc: 'GitHub Actions, Jenkins, Bitrise, GitLab CI, Bitbucket.' },
      { n: '04', title: 'Agent skills', desc: 'Project-level skills for Cursor, Claude, Codex and Copilot.' },
    ];

    var cardNodes = [];
    for (var i = 0; i < cards.length; i++) {
      (function(i) {
        var cd = cards[i];
        var start = 48 + i * 14;
        var e = enter(frame, start, 26, 60);
        cardNodes.push({
          type: 'container',
          width: 420,
          height: 310,
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
              emphasis(cd.title, 31, c('snow')),
              { type: 'container', height: 12, alignment: 'topLeft' },
              body(cd.desc, 23, c('muted')),
            ],
          },
        });
        if (i < cards.length - 1) {
          cardNodes.push({ type: 'container', width: 24, height: 1, alignment: 'topLeft' });
        }
      })(i);
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sky'), c('sea')], 900, 700, {
          alignment: 'topRight', offsetX: 300, offsetY: -280, opacity: 0.16,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 190, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('FOUR WAYS IN', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 18, alignment: 'topLeft' },
            withEnter(headline('Run it your way.', 104, true), enter(frame, 16, 24, 36)),
            { type: 'container', height: 84, alignment: 'topLeft' },
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
