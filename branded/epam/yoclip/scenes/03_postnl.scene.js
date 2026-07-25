// 03 — POSTNL: the central client story, in three acts.
// All facts from epam.com/services/client-work (PostNL AI-native SDLC case).
scene = {
  id: 'postnl',
  duration: 430,
  slides: [250, 410],
  description:
    "Act 1: 'CLIENT STORY — POSTNL'. Giant gradient PostNL wordmark; caption " +
    "'Dutch mail & eCommerce — millions of letters and parcels, delivered " +
    "daily.' Act 2 — the punch: 'Work that took 1 week' (muted) collapses " +
    "into a giant gradient '40 minutes' count-up, then a second counter " +
    "'20+ types of AI agents deployed across teams.' Act 3: 'THE AI-NATIVE " +
    "SDLC' — four stages light up in sequence (Business analysis -> Testing " +
    "-> Coding -> Defect management) joined by a sea line, then the Sander " +
    "Lukaart quote fades in.",
  voicePrompts: {
    en: 'PostNL — millions of parcels, every day. Work that took more than ' +
        'a week, done by AI agents in forty minutes. Over twenty types of ' +
        'AI agents, across the whole software lifecycle. The speed exceeded ' +
        'our expectations.',
  },
  timeline: { label: 'PostNL', color: '#00F6FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 10, 400, 20);

    // Act windows. NOTE: presence(frame, fadeIn, hold, fadeOut) always starts
    // its fade-in at frame 0 — for later acts use manual seg() windows.
    var a1 = presence(frame, 6, 100, 18);
    var a2 = eo3(seg(frame, 96, 116)) * (1 - eo3(seg(frame, 268, 290)));
    var a3 = eo3(seg(frame, 262, 290));

    // ---- Act 1: context -------------------------------------------------
    var act1 = [
      blurGlow([c('sea'), c('sky')], 1000, 800, {
        alignment: 'bottomRight', offsetX: 180, offsetY: 220, opacity: 0.25 * a1,
      }),
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 150, left: 64 },
        crossAxisAlignment: 'start',
        opacity: a1,
        children: [
          withEnter(preheader('CLIENT STORY · POSTNL', c('sea'), 26), enter(frame, 8, 20, 26)),
          { type: 'container', height: 30, alignment: 'topLeft' },
          withEnter(headline('Millions of parcels.', 150, false), enter(frame, 20, 28, 50)),
          withEnter(headline('Every single day.', 150, true), enter(frame, 34, 28, 50)),
          { type: 'container', height: 40, alignment: 'topLeft' },
          withEnter(
            body('The Dutch postal and eCommerce network runs on software.\nEPAM made its software delivery AI-native.',
              30, c('muted')),
            enter(frame, 56, 24, 26)
          ),
        ],
      },
    ];

    // ---- Act 2: the punch -----------------------------------------------
    var n40 = counter(frame, 140, 45, 0, 40);
    var n20 = counter(frame, 220, 40, 0, 20);

    var act2 = [
      blurGlow([c('mint'), c('sea')], 900, 750, {
        alignment: 'topRight', offsetX: 240, offsetY: -260, opacity: 0.2 * a2,
      }),
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 150, left: 64 },
        crossAxisAlignment: 'start',
        opacity: a2,
        children: [
          withEnter(body('Work that typically took', 34, c('muted')), enter(frame, 104, 20, 24)),
          { type: 'container', height: 10, alignment: 'topLeft' },
          withEnter(headline('more than a week…', 88, false), enter(frame, 108, 22, 30)),
          { type: 'container', height: 44, alignment: 'topLeft' },
          withEnter(
            {
              type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
              children: [
                headline(n40 + '', 220, true, blh(220, 220)),
                { type: 'container', width: 30, height: 1, alignment: 'topLeft' },
                headline('minutes.', 96, false, blh(96, 220)),
              ],
            },
            enter(frame, 132, 26, 46)
          ),
          { type: 'container', height: 18, alignment: 'topLeft' },
          withEnter(
            // Tuck the subtext under the stat row: the baseline-aligned row
            // above reserves a 220px*1.2 line box, leaving dead space below
            // the digits — pull the line up into it.
            body('— accomplished by AI agents on the EPAM AI/Run™ platform.', 30, c('snow'), undefined, { offsetY: -52 }),
            enter(frame, 160, 22, 26)
          ),
          { type: 'container', height: 64, alignment: 'topLeft' },
          withEnter(
            {
              type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
              children: [
                headline(n20 + '+', 110, true, blh(110, 110)),
                { type: 'container', width: 28, height: 1, alignment: 'topLeft' },
                {
                  // Baseline row aligns the label with the digits' baseline;
                  // offsetY lifts the two-line block so it sits centered
                  // against the number instead of hanging off its baseline.
                  type: 'column', alignment: 'topLeft', crossAxisAlignment: 'start', offsetY: -45,
                  children: [
                    emphasis('types of AI agents', 34, c('snow')),
                    { type: 'container', height: 6, alignment: 'topLeft' },
                    body('deployed across teams and business units', 26, c('muted')),
                  ],
                },
              ],
            },
            enter(frame, 205, 26, 40)
          ),
        ],
      },
    ];

    // ---- Act 3: the AI-native SDLC + quote -------------------------------
    var stages = ['Business\nanalysis', 'Testing', 'Coding', 'Defect\nmanagement'];
    var stageNodes = [];
    for (var i = 0; i < stages.length; i++) {
      (function(i) {
        var s = eo3(seg(frame, 290 + i * 14, 310 + i * 14));
        stageNodes.push({
          type: 'container',
          width: 360,
          height: 180,
          borderRadius: 16,
          color: c('surface'),
          borderColor: c('hairline'),
          borderWidth: 1.5,
          alignment: 'topLeft',
          opacity: s,
          offsetY: lerp(40, 0, s),
          child: {
            type: 'column',
            alignment: 'topLeft',
            margin: { top: 26, left: 28 },
            crossAxisAlignment: 'start',
            children: [
              headline('0' + (i + 1), 32, true),
              { type: 'container', height: 16, alignment: 'topLeft' },
              {
                type: 'text',
                text: stages[i],
                alignment: 'topLeft',
                textAlign: 'left',
                style: {
                  fontFamily: 'Museo Sans 500',
                  fontSize: 30,
                  color: c('snow'),
                  lineHeight: 1.15,
                },
              },
            ],
          },
        });
        if (i < stages.length - 1) {
          var arrowT = eo3(seg(frame, 300 + i * 14, 318 + i * 14));
          // Sea hairline connector — Museo Sans has no '→' glyph (renders tofu).
          stageNodes.push({
            type: 'container',
            width: 74,
            height: 180,
            alignment: 'topLeft',
            opacity: arrowT,
            child: {
              type: 'container',
              width: 42,
              height: 2,
              color: c('sea'),
              alignment: 'center',
            },
          });
        }
      })(i);
    }

    var act3 = [
      {
        type: 'column',
        alignment: 'topLeft',
        margin: { top: 120, left: 64 },
        crossAxisAlignment: 'start',
        opacity: a3,
        children: [
          preheader('THE AI-NATIVE SDLC · RUN BY AGENTS', c('sea'), 26),
          { type: 'container', height: 44, alignment: 'topLeft' },
          {
            type: 'row', alignment: 'topLeft', crossAxisAlignment: 'start',
            children: stageNodes,
          },
          { type: 'container', height: 80, alignment: 'topLeft' },
          withEnter(
            {
              type: 'text',
              text: '\u201CAI agents transformed our approach to software delivery.\nThe speed exceeded our expectations.\u201D',
              alignment: 'topLeft',
              textAlign: 'left',
              style: {
                fontFamily: 'Museo Sans 300',
                fontSize: 48,
                color: c('snow'),
                lineHeight: 1.3,
              },
            },
            enter(frame, 350, 26, 36)
          ),
          { type: 'container', height: 30, alignment: 'topLeft' },
          withEnter(
            preheader('— SANDER LUKAART · IT MANAGER, POSTNL', c('muted'), 24),
            enter(frame, 372, 22, 22)
          ),
        ],
      },
    ];

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: act1.concat(act2).concat(act3).concat([
        // Official PostNL wordmark — persistent across the whole story.
        {
          type: 'image',
          source: 'external:postnl_logo',
          fit: 'contain',
          width: 300,
          height: 297,
          alignment: 'bottomRight',
          margin: { right: 80, bottom: 90 },
          opacity: eo3(seg(frame, 40, 64)),
        },
      ]),
    };
  },
};
