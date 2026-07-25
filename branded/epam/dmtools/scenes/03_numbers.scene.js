// 03 — NUMBERS: "320+ CLI tools. 20+ integrations." Count-up stats and the
// top-integration bars. Figures are from the repo's generated per-
// integration tool reference (dmtools-ai-docs/references); totals are
// rounded on purpose — the list keeps growing.
scene = {
  id: 'numbers',
  duration: 382,
  from: 630,
  description:
    "Preheader THE TOOLBOX, headline '320+ CLI tools.' — the 320 counts up " +
    "in the brand gradient — second line '20+ integrations.' Below, ten " +
    'bars grow to scale: Jira 69, ADO 38, GitHub 35, Teams 31, GitLab 30, ' +
    'Bitrise 23, Figma 22, Confluence 19, TestRail 17, Jenkins 5, each ' +
    'with its count snapping in.',
  voicePrompts: {
    en: 'Three hundred twenty tools. Twenty-plus integrations. Jira, ' +
        'Azure DevOps, GitHub, Figma, Teams, Bitrise, Jenkins. Wired. ' +
        'Documented. Ready.',
  },
  timeline: { label: 'Numbers', color: '#B896FF', lane: 'video' },
  audio: [ { source: 'assets/audio/03.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 12, 352, 18);

    var bars = [
      { label: 'Jira', count: 69 },
      { label: 'Azure DevOps', count: 38 },
      { label: 'GitHub', count: 35 },
      { label: 'Teams', count: 31 },
      { label: 'GitLab', count: 30 },
      { label: 'Bitrise', count: 23 },
      { label: 'Figma', count: 22 },
      { label: 'Confluence', count: 19 },
      { label: 'TestRail', count: 17 },
      { label: 'Jenkins', count: 5 },
    ];
    var maxCount = 69;
    var barMaxW = 1050;

    var barChildren = [];
    for (var i = 0; i < bars.length; i++) {
      (function(i) {
        var b = bars[i];
        var start = 70 + i * 10;
        var t = eo3(seg(frame, start, start + 34));
        var w = Math.max(2, lerp(0, barMaxW * b.count / maxCount, t));
        var shown = Math.round(lerp(0, b.count, t));
        barChildren.push({
          type: 'row',
          alignment: 'topLeft',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: b.label,
              alignment: 'topLeft',
              width: 240,
              textAlign: 'left',
              opacity: eo3(seg(frame, start - 4, start + 10)),
              style: {
                fontFamily: 'Museo Sans 500',
                fontSize: 25,
                color: c('snow'),
              },
            },
            {
              type: 'container',
              width: w,
              height: 30,
              borderRadius: 8,
              gradient: {
                colors: [c('mint'), c('sea'), c('lilac')],
                begin: 'centerLeft', end: 'centerRight',
              },
              alignment: 'topLeft',
              // hidden until this bar's turn — otherwise the 2px minimum
              // width shows as a stray vertical strip before the value
              opacity: eo3(seg(frame, start, start + 4)),
            },
            { type: 'container', width: 20, height: 1, alignment: 'topLeft' },
            {
              type: 'text',
              text: '' + shown,
              alignment: 'topLeft',
              opacity: t,
              style: {
                fontFamily: 'Museo Sans 700',
                fontSize: 25,
                color: c('sea'),
              },
            },
          ],
        });
        barChildren.push({ type: 'container', height: 16, alignment: 'topLeft' });
      })(i);
    }

    // The big count-up: "320+" gradient, "CLI tools." plain.
    var toolsCount = Math.round(counter(frame, 24, 50, 0, 320));
    var integrationsCount = Math.round(counter(frame, 40, 50, 0, 20));

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('lilac'), c('sky')], 1000, 800, {
          alignment: 'bottomRight', offsetX: 260, offsetY: 300, opacity: 0.18,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 120, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('THE TOOLBOX', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 14, alignment: 'topLeft' },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'end',
              children: [
                headline('' + toolsCount + '+', 110, true, blh(110, 110), { offsetX: -12 }),
                { type: 'container', width: 24, height: 1, alignment: 'topLeft' },
                headline('CLI tools.', 110, false, blh(110, 110)),
              ],
            },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'end',
              children: [
                headline('' + integrationsCount + '+', 110, true, blh(110, 110), { offsetX: -12 }),
                { type: 'container', width: 24, height: 1, alignment: 'topLeft' },
                headline('integrations.', 110, false, blh(110, 110)),
              ],
            },
            { type: 'container', height: 44, alignment: 'topLeft' },
            {
              type: 'column',
              alignment: 'topLeft',
              crossAxisAlignment: 'start',
              children: barChildren,
            },
          ],
        },
      ],
    };
  },
};
