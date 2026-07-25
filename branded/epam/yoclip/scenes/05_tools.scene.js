// 03 — TOOLS: "Agentic platforms that accelerate value." Four product rows.
scene = {
  id: 'tools',
  duration: 230,
  pptx: false,
  description:
    "Preheader 'AI/RUN TOOLS', headline 'Agentic platforms that accelerate " +
    "value.' — gradient on 'accelerate'. Four product rows slide in from the " +
    "left with stagger: DIAL, migVisor, EPAM AI/Run Platform, EPAM Agentic " +
    "QA — number, name, one-line descriptor, hairline separators.",
  voicePrompts: {
    en: 'Agentic platforms that accelerate value: DIAL — open-source GenAI ' +
        'orchestration. migVisor — agentic data migration. The EPAM AI Run ' +
        'Platform. And EPAM Agentic QA.',
  },
  timeline: { label: 'Tools', color: '#7BA8FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 12, 200, 18);

    var tools = [
      { n: '01', name: 'DIAL', desc: 'Open-source enterprise GenAI orchestration — DIAL 3.0, just released.' },
      { n: '02', name: 'migVisor™', desc: 'Agentic migration that liberates data from legacy systems.' },
      { n: '03', name: 'EPAM AI/Run™ Platform', desc: 'Agent runtime, enterprise data integration, self-service tools.' },
      { n: '04', name: 'EPAM Agentic QA™', desc: 'Scriptless QE agents that learn and adapt in real time.' },
    ];

    var rows = [];
    for (var i = 0; i < tools.length; i++) {
      (function(i) {
        var t = tools[i];
        var start = 50 + i * 18;
        var p = eo3(seg(frame, start, start + 24));
        rows.push({
          type: 'column',
          alignment: 'topLeft',
          crossAxisAlignment: 'start',
          opacity: p,
          offsetX: lerp(-70, 0, p),
          children: [
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'baseline',
              children: [
                headline(t.n, 40, true, blh(40, 46)),
                { type: 'container', width: 34, height: 1, alignment: 'topLeft' },
                emphasis(t.name, 46, c('snow'), blh(46, 46)),
                { type: 'container', width: 30, height: 1, alignment: 'topLeft' },
                body(t.desc, 27, c('muted'), blh(27, 46)),
              ],
            },
            { type: 'container', height: 22, alignment: 'topLeft' },
            {
              type: 'container',
              width: 1500,
              height: 1.5,
              color: c('hairline'),
              alignment: 'topLeft',
            },
            { type: 'container', height: 22, alignment: 'topLeft' },
          ],
        });
      })(i);
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sea'), c('mint')], 850, 750, {
          alignment: 'topRight', offsetX: 260, offsetY: -280, opacity: 0.16,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 120, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('AI/RUN™ TOOLS', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 18, alignment: 'topLeft' },
            withEnter(
              {
                type: 'row',
                alignment: 'topLeft',
                crossAxisAlignment: 'baseline',
                children: [
                  headline('Agentic platforms that ', 84, false),
                  headline('accelerate', 84, true),
                  headline(' value.', 84, false),
                ],
              },
              enter(frame, 16, 26, 36)
            ),
          ],
        },

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 330, left: 64 },
          crossAxisAlignment: 'start',
          children: rows,
        },
      ],
    };
  },
};
