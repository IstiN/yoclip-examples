// 04 — BAKER HUGHES: second client story. Two acts: proof stats, then the
// value quote. Facts from epam.com client work (GenAI digital assistants).
scene = {
  id: 'baker_hughes',
  duration: 310,
  // Capture the value quote (fully visible by frame 262). Frame 0 was black
  // because the scene had not faded in yet; drag the marker in Studio to
  // retime, or edit this `slides:` array.
  slides: [260],
  description:
    "Act 1: 'CLIENT STORY — BAKER HUGHES'. Headline 'AI, working in the " +
    "oilfield.' (gradient on 'in the oilfield.'). Three proof stat cards " +
    "stagger in: 8 weeks to a fully functional prototype, 200+ pages of " +
    "technical documents processed, 85% answer accuracy. Act 2: giant " +
    "gradient '10,000 hours' — expert time freed every year — then the " +
    "Sebastiano Barbarino quote: 'millions of dollars of customer value.'",
  voicePrompts: {
    en: 'Baker Hughes. Eight weeks to a working prototype. Eighty-five ' +
        'percent accuracy. Ten thousand hours of expert time, freed every ' +
        'year — and millions of dollars of customer value.',
  },
  timeline: { label: 'Baker Hughes', color: '#B896FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 10, 280, 20);

    var a1 = presence(frame, 6, 158, 20);
    var a2 = eo3(seg(frame, 152, 180));

    // ---- Act 1: proof stat cards -----------------------------------------
    var stats = [
      { v: '8', u: 'weeks', cap: 'to a fully functional GenAI prototype' },
      { v: '200', u: '+ pages', cap: 'of technical documents processed' },
      { v: '85', u: '%', cap: 'accuracy on field-support answers' },
    ];
    var cardNodes = [];
    for (var i = 0; i < stats.length; i++) {
      (function(i) {
        var st = stats[i];
        var start = 70 + i * 16;
        var e = enter(frame, start, 26, 60);
        var n = counter(frame, start + 10, 40, 0, parseInt(st.v, 10));
        cardNodes.push({
          type: 'container',
          width: 405,
          height: 320,
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
            margin: { top: 34, left: 32 },
            crossAxisAlignment: 'start',
            children: [
              {
                type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
                children: [
                  headline(n + '', 96, true, blh(96, 96)),
                  { type: 'container', width: 12, height: 1, alignment: 'topLeft' },
                  emphasis(st.u, 40, c('snow'), blh(40, 96)),
                ],
              },
              { type: 'container', height: 18, alignment: 'topLeft' },
              ruleDraw(frame, start + 16, 20, 70),
              { type: 'container', height: 20, alignment: 'topLeft' },
              body(st.cap, 25, c('muted')),
            ],
          },
        });
        if (i < stats.length - 1) {
          cardNodes.push({ type: 'container', width: 28, height: 1, alignment: 'topLeft' });
        }
      })(i);
    }

    var act1 = [
      blurGlow([c('lilac'), c('sky')], 900, 720, {
        alignment: 'bottomLeft', offsetX: -240, offsetY: 280, opacity: 0.18 * a1,
      }),
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 120, left: 64 },
        crossAxisAlignment: 'start',
        opacity: a1,
        children: [
          withEnter(preheader('CLIENT STORY · BAKER HUGHES', c('sea'), 26), enter(frame, 8, 20, 26)),
          { type: 'container', height: 20, alignment: 'topLeft' },
          withEnter(
            {
              type: 'row', alignment: 'topLeft', crossAxisAlignment: 'end',
              children: [
                headline('AI, working ', 92, false),
                headline('in the oilfield.', 92, true),
              ],
            },
            enter(frame, 18, 26, 40)
          ),
          { type: 'container', height: 22, alignment: 'topLeft' },
          withEnter(
            body('Two GenAI digital assistants — for production engineers and field crews —\nbuilt with EPAM and AWS.',
              28, c('muted')),
            enter(frame, 40, 22, 26)
          ),
          { type: 'container', height: 64, alignment: 'topLeft' },
          {
            type: 'row', alignment: 'topLeft', crossAxisAlignment: 'start',
            children: cardNodes,
          },
        ],
      },
    ];

    // ---- Act 2: the value quote ------------------------------------------
    var n10k = counter(frame, 200, 50, 0, 10000);
    var n10kText = n10k >= 10000 ? '10,000' : ('' + n10k).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    var act2 = [
      blurGlow([c('mint'), c('sea')], 950, 780, {
        alignment: 'topRight', offsetX: 220, offsetY: -260, opacity: 0.2 * a2,
      }),
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 170, left: 64 },
        crossAxisAlignment: 'start',
        opacity: a2,
        children: [
          withEnter(
            {
              type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
              children: [
                headline(n10kText, 190, true, blh(190, 190)),
                { type: 'container', width: 34, height: 1, alignment: 'topLeft' },
                headline('hours', 92, false, blh(92, 190)),
              ],
            },
            enter(frame, 168, 28, 50)
          ),
          { type: 'container', height: 16, alignment: 'topLeft' },
          withEnter(
            body('of expert time freed every year — routine field-support\nquestions, answered by AI.',
              30, c('snow')),
            enter(frame, 195, 24, 28)
          ),
          { type: 'container', height: 80, alignment: 'topLeft' },
          withEnter(
            {
              type: 'text',
              text: '\u201CWe are generating millions of dollars of customer value\nacross conventional and unconventional wells.\u201D',
              alignment: 'topLeft',
              textAlign: 'left',
              style: {
                fontFamily: 'Museo Sans 300',
                fontSize: 46,
                color: c('snow'),
                lineHeight: 1.3,
              },
            },
            enter(frame, 240, 26, 36)
          ),
          { type: 'container', height: 28, alignment: 'topLeft' },
          withEnter(
            preheader('— SEBASTIANO BARBARINO · LEUCIPA DIRECTOR OF PRODUCT & ENGINEERING, BAKER HUGHES',
              c('muted'), 22),
            enter(frame, 262, 22, 20)
          ),
        ],
      },
    ];

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: act1.concat(act2).concat([
        // Official Baker Hughes wordmark (white on dark, green symbol) —
        // persistent across the whole story.
        {
          type: 'image',
          source: 'external:baker_logo',
          fit: 'contain',
          width: 300,
          height: 50.5,
          alignment: 'bottomRight',
          margin: { right: 80, bottom: 100 },
          opacity: eo3(seg(frame, 40, 64)),
        },
      ]),
    };
  },
};
