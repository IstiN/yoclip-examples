// 01 — HYPE GAP: "From Hype to Impact." The ambition-vs-reality gap, then
// the disruptor punch. All figures from EPAM's "From Hype to Impact" AI
// research (7,300 enterprises surveyed with Censuswide, 2025).
scene = {
  id: 'hype_gap',
  duration: 280,
  slides: [121, 245],
  description:
    "Act A: preheader 'FROM HYPE TO IMPACT — EPAM AI RESEARCH 2025', headline " +
    "'Everyone is investing in AI. Few are capturing the value.' (gradient on " +
    "'capturing'). Two horizontal bars draw out: 49% 'consider themselves " +
    "advanced in AI' (muted bar) vs 26% 'have AI use cases live in production' " +
    "(sea gradient bar) — the ambition gap made visual. Act B crossfades in: " +
    "three count-up stats — 5% true disruptors, 53% of disruptors' expected " +
    "2025 profits from AI (giant gradient), +14% YoY AI spending growth — " +
    "with the source footnote.",
  voicePrompts: {
    en: 'From hype to impact. Forty-nine percent of enterprises call ' +
        'themselves advanced in AI — only twenty-six percent run real use ' +
        'cases. The five percent who break through attribute fifty-three ' +
        'percent of expected profits to AI.',
  },
  timeline: { label: 'Hype gap', color: '#00FFF0', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 10, 250, 18);

    // Act crossfade: A holds 10→130, B rises 120→280.
    var actA = presence(frame, 8, 118, 22);
    var actB = eo3(seg(frame, 120, 148));

    // ---- Act A: the gap bars -------------------------------------------
    var n49 = counter(frame, 60, 45, 0, 49);
    var n26 = counter(frame, 78, 45, 0, 26);
    var barMax = 1150;
    var bar49 = barMax * eo3(seg(frame, 60, 105));
    var bar26 = barMax * (26 / 49) * eo3(seg(frame, 80, 125));

    var actANodes = [
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 130, left: 64 },
        crossAxisAlignment: 'start',
        opacity: actA,
        children: [
          withEnter(preheader('FROM HYPE TO IMPACT · EPAM AI RESEARCH 2025', c('sea'), 26), enter(frame, 10, 20, 26)),
          { type: 'container', height: 20, alignment: 'topLeft' },
          withEnter(headline('Everyone is investing in AI.', 96, false), enter(frame, 20, 26, 40)),
          withEnter(
            {
              type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
              children: [
                headline('Few are ', 96, false),
                headline('capturing', 96, true),
                headline(' the value.', 96, false),
              ],
            },
            enter(frame, 32, 26, 40)
          ),
        ],
      },
      // Bar 1 — the claim.
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 470, left: 64 },
        crossAxisAlignment: 'start',
        opacity: actA,
        children: [
          {
            type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
            children: [
              emphasis(n49 + '%', 56, c('snow'), blh(56, 56)),
              { type: 'container', width: 26, height: 1, alignment: 'topLeft' },
              emphasis('of enterprises consider themselves advanced in AI', 28, c('muted'), blh(28, 56)),
            ],
          },
          { type: 'container', height: 16, alignment: 'topLeft' },
          {
            type: 'container',
            width: Math.max(1, bar49),
            height: 52,
            borderRadius: 10,
            alignment: 'topLeft',
            color: c('surface'),
            borderColor: c('hairline'),
            borderWidth: 1.5,
          },
        ],
      },
      // Bar 2 — the reality.
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 660, left: 64 },
        crossAxisAlignment: 'start',
        opacity: actA,
        children: [
          {
            type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
            children: [
              emphasis(n26 + '%', 56, c('sea'), blh(56, 56)),
              { type: 'container', width: 26, height: 1, alignment: 'topLeft' },
              emphasis('have AI use cases live in production', 28, c('muted'), blh(28, 56)),
            ],
          },
          { type: 'container', height: 16, alignment: 'topLeft' },
          {
            type: 'container',
            width: Math.max(1, bar26),
            height: 52,
            borderRadius: 10,
            alignment: 'topLeft',
            gradient: { colors: [c('sea'), c('sky')], begin: 'centerLeft', end: 'centerRight' },
          },
        ],
      },
      withEnter(
        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 880, left: 64 },
          crossAxisAlignment: 'start',
          opacity: actA,
          children: [
            body('The gap between ambition and impact is where value is lost.', 28, c('snow')),
          ],
        },
        enter(frame, 96, 22, 20)
      ),
    ];

    // ---- Act B: the disruptor punch -------------------------------------
    var n5 = counter(frame, 175, 40, 0, 5);
    var n53 = counter(frame, 195, 50, 0, 53);
    var n14 = counter(frame, 215, 40, 0, 14);

    function punchStat(value, caption, e, big) {
      return {
        type: 'column',
        alignment: 'topLeft',
        crossAxisAlignment: 'start',
        opacity: e.opacity,
        offsetY: e.offsetY,
        children: [
          headline(value, big ? 200 : 96, big),
          { type: 'container', height: 14, alignment: 'topLeft' },
          body(caption, 26, c('muted')),
        ],
      };
    }

    var actBNodes = [
      blurGlow([c('mint'), c('lilac')], 950, 800, {
        alignment: 'bottomRight', offsetX: 200, offsetY: 240, opacity: 0.22 * actB,
      }),
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 150, left: 64 },
        crossAxisAlignment: 'start',
        opacity: actB,
        children: [
          preheader('THE ONES WHO BREAK THROUGH', c('sea'), 26),
          { type: 'container', height: 22, alignment: 'topLeft' },
          punchStat(n53 + '%',
            'of disruptors\u2019 expected 2025 profits attributed to AI',
            enter(frame, 150, 26, 50), true),
          { type: 'container', height: 70, alignment: 'topLeft' },
          {
            type: 'row', alignment: 'topLeft', crossAxisAlignment: 'start',
            children: [
              punchStat(n5 + '%',
                'of enterprises are true AI disruptors',
                enter(frame, 175, 24, 40), false),
              { type: 'container', width: 130, height: 1, alignment: 'topLeft' },
              punchStat('+' + n14 + '%',
                'planned YoY growth in enterprise AI spending',
                enter(frame, 195, 24, 40), false),
            ],
          },
          { type: 'container', height: 90, alignment: 'topLeft' },
          withEnter(
            body('Source: EPAM \u201CFrom Hype to Impact\u201D — 7,300 enterprises surveyed with Censuswide.',
              22, c('muted')),
            enter(frame, 235, 20, 12)
          ),
        ],
      },
    ];

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: actANodes.concat(actBNodes),
    };
  },
};
