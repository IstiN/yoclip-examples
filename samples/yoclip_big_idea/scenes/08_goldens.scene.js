// 08 — Goldens: a living QA contact sheet.
//
// Six real golden frames remain visible while a scan and a drawn check travel
// through the board. Replacing the broken fly-camera with a fixed editorial
// grid removes dead frames and makes the testing story legible at a glance.

scene = {
  id: 'goldens',
  duration: 216,
  description: 'Six real golden-test frames assemble into a 3x2 contact sheet; a cyan scan and drawn check verify each card, ending on the complete board and score.',
  voicePrompts: {
    en: 'Measured, confident groove; a soft confirmation tick for every verified frame.',
    ru: 'Размеренный уверенный грув; мягкий тик подтверждения для каждого кадра.',
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
    var portrait = yoclipIsPortrait();

    var font = yoclipFont();
    var accent = yoclipColor('accent', '#22d3ee');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var deep = yoclipColor('backgroundDeep', '#07070d');
    var surface = yoclipColor('surface', '#15131f');
    var green = '#4ade80';
    var life = presence(frame, 9, 193, 14);

    var cardW = portrait ? 460 : 500;
    var cardH = portrait ? 318 : 330;
    var imageW = cardW - 32;
    var imageH = Math.round(imageW * 9 / 16);
    var xs = portrait ? [-250, 250, -250, 250, -250, 250] : [-560, 0, 560, -560, 0, 560];
    var ys = portrait ? [-300, -300, 80, 80, 460, 460] : [-64, -64, -64, 286, 286, 286];

    function card(i) {
      var start = 6 + i * 17;
      var p = ease(frame, start, start + 22, eo3);
      var check = ease(frame, start + 21, start + 31, eoBack);
      var scan = seg(frame, start + 4, start + 24);
      var scanOp = seg(frame, start + 3, start + 7) * (1 - seg(frame, start + 22, start + 28));
      var done = frame >= start + 29;
      var kids = [
        {
          type: 'image', source: 'external:' + srcs[i], fit: 'cover',
          width: imageW, height: imageH, alignment: 'topCenter', offsetY: 14,
        },
        // Image number tab.
        {
          type: 'container', alignment: 'topLeft', offsetX: 26, offsetY: 26,
          width: 46, height: 30, borderRadius: 8, color: yoclipColorA('backgroundDeep', 0xd9, '#07070d'),
          child: { type: 'stack', fit: 'expand', children: [{ type: 'text', alignment: 'center', text: '0' + (i + 1), style: { fontSize: 14, color: txt, fontFamily: font, fontWeight: 700, letterSpacing: 2 } }] },
        },
        // Scanner is clipped to the image rather than sweeping the whole frame.
        {
          type: 'container', alignment: 'topCenter', offsetY: 14, width: imageW, height: imageH,
          clip: true, opacity: scanOp, color: yoclipColorA('accent', 0x10, '#22d3ee'),
          child: {
            type: 'stack', fit: 'expand', children: [{
              type: 'container', alignment: 'center', offsetX: -imageW / 2 + imageW * scan,
              width: 3, height: imageH, color: accent,
              shadow: { color: yoclipColorA('accent', 0x66, '#22d3ee'), blur: 18, offsetX: 0, offsetY: 0 },
            }],
          },
        },
        // Success badge and drawn check.
        {
          type: 'container', alignment: 'topRight', offsetX: -25, offsetY: 25,
          width: 40, height: 40, borderRadius: 20, color: '#14532d',
          scale: Math.max(0.001, check), opacity: check,
          borderColor: '#664ade80', borderWidth: 1.5,
          child: {
            type: 'stack', fit: 'expand', children: [{
              type: 'path', alignment: 'center', width: 26, height: 26,
              path: 'M 5 13 L 11 19 L 22 7', color: green, strokeWidth: 3.2, progress: check,
            }],
          },
        },
        {
          type: 'text', alignment: 'bottomLeft', offsetX: 18, offsetY: -18,
          text: labels[i],
          style: { fontSize: portrait ? 17 : 18, color: done ? txt : muted, fontFamily: font, fontWeight: 600, letterSpacing: 0.5 },
        },
        {
          type: 'container', alignment: 'bottomRight', offsetX: -18, offsetY: -22,
          width: 8, height: 8, borderRadius: 4, color: done ? green : muted, opacity: done ? 1 : 0.4,
        },
      ];
      return {
        type: 'container', alignment: 'center', offsetX: xs[i], offsetY: ys[i] + (1 - p) * 54,
        width: cardW, height: cardH, opacity: p, scale: 0.9 + 0.1 * p,
        color: surface, borderRadius: 20, clip: true,
        borderColor: done ? '#704ade80' : yoclipColorA('accent', 0x55, '#22d3ee'), borderWidth: 1.5,
        shadow: { color: yoclipColorA(done ? 'accent' : 'primary', 0x22, '#7c3aed'), blur: 30, offsetX: 0, offsetY: 14 },
        child: { type: 'stack', fit: 'expand', children: kids },
      };
    }

    var verified = 0;
    for (var v = 0; v < 6; v++) if (frame >= 6 + v * 17 + 29) verified++;
    var allDone = verified === 6;
    var children = [
      { type: 'container', color: deep },
      {
        type: 'container', alignment: 'center', width: 1200, height: 1000,
        gradient: { type: 'radial', center: 'center', radius: 0.55, colors: [yoclipColorA('primary', 0x20, '#7c3aed'), yoclipColorA('primary', 0, '#7c3aed')] },
      },
      {
        type: 'text', alignment: 'topLeft', offsetX: 64, offsetY: portrait ? 132 : 28,
        text: 'QA  /  GOLDEN FRAMES',
        style: { fontSize: 16, color: accent, fontFamily: font, fontWeight: 600, letterSpacing: 5 },
      },
      {
        type: 'text', alignment: 'topLeft', offsetX: 62, offsetY: portrait ? 174 : 60,
        text: title, opacity: ease(frame, 0, 16, eo3),
        style: { fontSize: portrait ? 46 : 56, color: txt, fontFamily: font, fontWeight: 700 },
      },
      {
        type: 'text', alignment: 'topLeft', offsetX: 64, offsetY: portrait ? 238 : 128,
        text: subtitle, opacity: seg(frame, 6, 18),
        style: { fontSize: portrait ? 20 : 21, color: muted, fontFamily: font, letterSpacing: 1.5 },
      },
      {
        type: 'container', alignment: 'topRight', offsetX: -64, offsetY: portrait ? 282 : 58,
        width: 320, height: 56, borderRadius: 28,
        color: allDone ? '#14532d' : surface,
        borderColor: allDone ? '#664ade80' : yoclipColorA('primaryLight', 0x44, '#a78bfa'), borderWidth: 1.5,
        child: {
          type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center', children: [
            { type: 'container', width: 20 },
            { type: 'container', width: 9, height: 9, borderRadius: 5, color: allDone ? green : accent },
            {
              type: 'text', margin: { left: 12, right: 22 },
              text: allDone ? passed : 'CHECKING  0' + verified + ' / 06',
              style: { fontSize: 20, color: allDone ? green : txt, fontFamily: font, fontWeight: 700, letterSpacing: 2 },
            },
          ],
        },
      },
    ];
    for (var i = 0; i < 6; i++) children.push(card(i));

    // Board progress rule; fixed height avoids free-stack stretch artifacts.
    children.push({ type: 'container', alignment: 'bottomLeft', offsetX: 120, offsetY: -28, width: 1680, height: 2, color: yoclipColorA('textMuted', 0x22, '#a1a1aa') });
    children.push({ type: 'container', alignment: 'bottomLeft', offsetX: 120, offsetY: -28, width: 1680 * ease(frame, 6, 135, eo3), height: 2, color: accent });

    return { type: 'stack', fit: 'expand', opacity: life, children: children };
  },
};
