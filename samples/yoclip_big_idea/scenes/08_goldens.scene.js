// 08 — Goldens: a flyover across the golden-test canvas.
//
// Six golden frames captured from this very project lie on a huge canvas;
// the camera opens on the full board, then visits each card — the way a
// reviewer scrubs through `yoclip screenshot` goldens — and lands back on
// the overview with the score. Every card is an `external:` image rendered
// by the CLI itself: the video literally shows its own test fixtures.

scene = {
  id: 'goldens',
  duration: 216,
  description: 'Golden-test canvas: 6 rendered frames on a board, camera flies card to card.',
  voicePrompts: {
    en: 'Measured, confident groove; a soft whoosh on every camera hop.',
    ru: 'Размеренный уверенный грув; мягкий свист на каждом перелёте камеры.',
  },
  timeline: {
    label: yoclipT('goldens').timeline || 'Goldens',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('goldens');
    var title = t.title || 'Every pixel is tested.';
    var subtitle = t.subtitle || 'golden tests · yoclip render --update-goldens';
    var passed = t.passed || '6/6 passed';
    var labels = t.cards || ['a', 'b', 'c', 'd', 'e', 'f'];
    var srcs = ['golden_hollywood', 'golden_banner', 'golden_rally', 'golden_code', 'golden_helmet', 'golden_cta'];

    var life = presence(frame, 10, 192, 14);
    var portrait = yoclipIsPortrait();
    var accent = yoclipColor('accent', '#22d3ee');

    // Card centers on the virtual canvas (px, canvas center = 0,0).
    var GX = 1180, GY = 800;
    var spots = [
      [-GX, -GY], [0, -GY], [GX, -GY],
      [-GX, GY], [0, GY], [GX, GY],
    ];
    var overviewScale = portrait ? 0.32 : 0.5;
    var visitScale = portrait ? 0.85 : 1.25;

    // Camera path: overview hold, 6 visits, back to overview.
    var OV_END = 22, VISIT = 26, OUT_START = OV_END + 6 * VISIT; // 178
    var focusX = 0, focusY = 0, camScale = overviewScale;
    var arrives = []; // arrival frame per card (for the pop + check)
    var k;
    if (frame < OV_END) {
      camScale = lerp(overviewScale * 0.86, overviewScale, ease(frame, 0, OV_END, eio3));
    } else if (frame < OUT_START) {
      var vi = Math.min(5, Math.floor((frame - OV_END) / VISIT));
      var t0 = OV_END + vi * VISIT;
      var prev = vi === 0 ? [0, 0] : spots[vi - 1];
      var prevScale = vi === 0 ? overviewScale : visitScale;
      var hop = ease(frame, t0, t0 + 15, eio3);
      focusX = lerp(prev[0], spots[vi][0], hop);
      focusY = lerp(prev[1], spots[vi][1], hop);
      camScale = lerp(prevScale, visitScale, hop);
      for (k = 0; k <= vi; k++) arrives.push(OV_END + k * VISIT + 15);
    } else {
      var back = ease(frame, OUT_START, OUT_START + 18, eio3);
      focusX = lerp(spots[5][0], 0, back);
      focusY = lerp(spots[5][1], 0, back);
      camScale = lerp(visitScale, overviewScale, back);
      for (k = 0; k < 6; k++) arrives.push(OV_END + k * VISIT + 15);
    }

    function card(i) {
      var arrive = arrives.length > i ? arrives[i] : 9999;
      var checkIn = ease(frame, arrive, arrive + 8, eoBack);
      var popIn = ease(frame, arrive - 15, arrive - 3, eoBack);
      return {
        type: 'container',
        alignment: 'center',
        offsetX: spots[i][0],
        offsetY: spots[i][1],
        width: 980,
        height: 700,
        color: yoclipColor('surface', '#15131f'),
        borderRadius: 26,
        borderColor: yoclipColorA('accent', 0x30 + Math.round(0x70 * checkIn), '#22d3ee'),
        borderWidth: 2,
        shadow: [{ color: '#88000000', blur: 40, offsetY: 18 }],
        clip: true,
        scale: 0.96 + 0.04 * Math.max(0, popIn),
        child: {
          type: 'column',
          children: [
            {
              type: 'container',
              width: 948,
              height: 533,
              margin: { top: 16 },
              borderRadius: 14,
              clip: true,
              child: {
                type: 'image',
                source: 'external:' + srcs[i],
                fit: 'cover',
                width: 948,
                height: 533,
              },
            },
            {
              type: 'row',
              crossAxisAlignment: 'center',
              margin: { left: 26, top: 18 },
              children: [
                {
                  type: 'container',
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  color: yoclipColorA('accent', 0x26, '#22d3ee'),
                  scale: Math.max(0.001, checkIn),
                  child: {
                    type: 'path',
                    alignment: 'center',
                    viewBox: { width: 34, height: 34 },
                    paths: 'M 9 17 L 14 23 L 25 11',
                    color: accent,
                    strokeWidth: 3.4,
                    progress: checkIn,
                  },
                },
                {
                  type: 'text',
                  margin: { left: 14 },
                  text: labels[i],
                  style: {
                    fontSize: 30,
                    color: yoclipColor('textMuted', '#a1a1aa'),
                    fontFamily: yoclipFont(),
                    fontWeight: 600,
                    letterSpacing: 2,
                  },
                },
              ],
            },
            {
              type: 'text',
              margin: { left: 26, top: 10 },
              text: 'yoclip screenshot --frame ' + labels[i].split('f')[1],
              style: {
                fontSize: 24,
                color: yoclipColorA('textMuted', 0x99, '#a1a1aa'),
                fontFamily: yoclipFont(),
              },
            },
          ],
        },
      };
    }

    var cards = [];
    for (var ci = 0; ci < 6; ci++) cards.push(card(ci));

    // Title + score land with the return to overview.
    var titleIn = ease(frame, OUT_START + 16, OUT_START + 30, eo3);
    var endUi = {
      type: 'column',
      alignment: 'center',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      opacity: titleIn,
      children: [
        {
          type: 'container',
          color: yoclipColorA('backgroundDeep', 0xd9, '#07070d'),
          borderRadius: 24,
          borderColor: yoclipColorA('primary', 0x66, '#7c3aed'),
          borderWidth: 1.5,
          child: {
            type: 'column',
            crossAxisAlignment: 'center',
            margin: { left: 56, right: 56, top: 30, bottom: 30 },
            children: [
              {
                type: 'text',
                text: title,
                style: {
                  fontSize: portrait ? 52 : 72,
                  color: yoclipColor('text', '#ffffff'),
                  fontFamily: yoclipFont(),
                  fontWeight: 700,
                },
              },
              {
                type: 'text',
                margin: { top: 14 },
                text: subtitle,
                style: {
                  fontSize: 28,
                  color: yoclipColor('textMuted', '#a1a1aa'),
                  fontFamily: yoclipFont(),
                  letterSpacing: 3,
                },
              },
            ],
          },
        },
        {
          type: 'container',
          margin: { top: 22 },
          color: '#14532d',
          borderRadius: 999,
          child: {
            type: 'text',
            margin: { left: 26, right: 26, top: 10, bottom: 10 },
            text: passed,
            style: {
              fontSize: 30,
              color: '#4ade80',
              fontFamily: yoclipFont(),
              fontWeight: 700,
              letterSpacing: 4,
            },
          },
        },
      ],
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Studio-table backdrop: deep base + subtle grid dots.
        {
          type: 'container',
          color: yoclipColor('backgroundDeep', '#07070d'),
        },
        {
          type: 'container',
          alignment: 'center',
          opacity: 0.5,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.8,
            colors: [yoclipColorA('primary', 0x18, '#7c3aed'), yoclipColorA('primary', 0x00, '#7c3aed')],
          },
        },
        // The canvas itself. NOTE: translate applies BEFORE scale in the
        // node wrapper, so the focus offset stays in unscaled canvas units.
        {
          type: 'stack',
          alignment: 'center',
          offsetX: -focusX,
          offsetY: -focusY,
          scale: camScale,
          children: cards,
        },
        endUi,
      ],
    };
  },
};
