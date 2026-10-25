// 05b — Zoom: dive out of the deck into a fully composed render workspace.
// The old version dissolved to an empty blue field for several seconds.
// A live vector orbit preview, prompt inspector and scene queue now carry
// the beat and provide a visual handoff to 02_kaleido.

scene = {
  id: 'zoom',
  duration: 150,
  description: 'Deck snapshot dives into the first thumbnail, then resolves into a premium render workspace: live neon-orbit preview, typed prompt inspector, format controls and a four-scene queue; an expanding portal hands off to the kaleidoscope.',
  voicePrompts: {
    en: 'A deep whoosh into the thumbnail, precise interface ticks, then a warm render click.',
    ru: 'Глубокий свист в превью, точные интерфейсные тики и тёплый клик рендера.',
  },
  timeline: { label: yoclipT('zoom').timeline || 'Zoom', color: '#7c3aed', lane: 'video' },
  render: function(frame) {
    var t = yoclipT('zoom');
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var promptText = (t.prompts && t.prompts[0]) || 'A 3D neon kaleidoscope vortex with real frames';

    // Deck dive (kept pixel-compatible with 05_deck's rail geometry).
    var zoom = eio3(seg(frame, 8, 46));
    var S = portrait ? lerp(1, 3, zoom) : lerp(1, 11, zoom);
    var OX = portrait ? 0 : 791 * (S - 1);
    var OY = portrait ? 0 : 252 * (S - 1);
    var snapOp = 1 - eo3(seg(frame, 26, 44));
    var children = [{
      type: 'container',
      gradient: { type: 'linear', colors: ['#d8e6f8', '#aec9ec'], begin: 'topCenter', end: 'bottomCenter' },
    }];
    if (snapOp > 0.001) {
      children.push({
        type: 'image', source: 'scene:deck@150', fit: 'contain', alignment: 'center',
        width: 1920, height: 1080, scale: S, offsetX: OX, offsetY: OY, opacity: snapOp,
      });
    }

    var workIn = eio3(seg(frame, 30, 48));
    var workOut = eo3(seg(frame, 126, 142));
    var workOp = workIn * (1 - workOut);
    var workspace = [];

    // Header / render status.
    workspace.push({
      type: 'row', alignment: 'topCenter', offsetY: 58, width: portrait ? 920 : 1720,
      mainAxisAlignment: 'spaceBetween', crossAxisAlignment: 'center', children: [
        {
          type: 'row', crossAxisAlignment: 'center', children: [
            { type: 'container', width: 38, height: 38, borderRadius: 12, color: primary },
            {
              type: 'text', text: 'RENDER WORKSPACE  /  SCENE 02', margin: { left: 18 },
              style: { fontSize: 20, color: '#273a5c', fontFamily: font, fontWeight: 700, letterSpacing: 2.4 },
            },
          ],
        },
        {
          type: 'row', crossAxisAlignment: 'center', children: [
            { type: 'container', width: 10, height: 10, borderRadius: 999, color: '#10b981' },
            {
              type: 'text', text: 'READY TO RENDER', margin: { left: 10 },
              style: { fontSize: 17, color: '#527065', fontFamily: font, fontWeight: 700, letterSpacing: 2 },
            },
          ],
        },
      ],
    });

    // Live vector orbit preview — no baked UI and no stock raster art.
    var previewW = portrait ? 920 : 940;
    var previewH = portrait ? 620 : 560;
    var previewKids = [
      {
        type: 'container',
        gradient: { type: 'linear', colors: ['#171338', '#070714'], begin: 'topLeft', end: 'bottomRight' },
      },
      {
        type: 'container', alignment: 'center', width: 660, height: 500,
        gradient: { type: 'radial', colors: ['#527c3aed', '#137c3aed', '#007c3aed'], stops: [0, 0.55, 1] },
      },
    ];
    for (var star = 0; star < 34; star++) {
      previewKids.push({
        type: 'container', alignment: 'center',
        offsetX: -420 + ((star * 173) % 840), offsetY: -240 + ((star * 97) % 480),
        width: star % 7 === 0 ? 4 : 2, height: star % 7 === 0 ? 4 : 2,
        borderRadius: 999, color: star % 3 ? '#ffffff' : '#a5f3fc',
        opacity: 0.3 + 0.6 * shimmer(frame + star * 5, 32),
      });
    }
    var rings = [
      [660, 220, -12, '#bfa78bfa', 5],
      [520, 174, 16, '#b422d3ee', 4],
      [380, 126, -24, '#a3ec4899', 4],
    ];
    for (var r = 0; r < rings.length; r++) {
      var rs = rings[r];
      previewKids.push({
        type: 'container', alignment: 'center', width: rs[0], height: rs[1],
        rotation: rs[2] + Math.sin(frame * 0.025 + r) * 4,
        borderRadius: 999, borderColor: rs[3], borderWidth: rs[4],
        shadow: { color: rs[3], blur: 18, offsetX: 0, offsetY: 0 },
      });
    }
    previewKids.push({
      type: 'container', alignment: 'center', width: 150, height: 150, borderRadius: 999,
      color: '#020208', borderColor: '#fde68a', borderWidth: 5,
      shadow: { color: '#99fbbf24', blur: 30, offsetX: 0, offsetY: 0 },
    });
    previewKids.push({
      type: 'container', alignment: 'center', width: 205, height: 54, borderRadius: 999,
      offsetY: 168, color: '#c914142c', borderColor: '#4067e8f9', borderWidth: 1,
      child: {
        type: 'text', alignment: 'center', text: 'LIVE VECTOR PREVIEW',
        style: { fontSize: 15, color: '#cffafe', fontFamily: font, fontWeight: 700, letterSpacing: 2 },
      },
    });
    previewKids.push({
      type: 'container', alignment: 'bottomLeft', offsetX: 26, offsetY: -24,
      width: 190, height: 48, borderRadius: 999, color: '#d9ffffff',
      child: {
        type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center', children: [
          { type: 'path', path: 'M 8 4 L 20 12 L 8 20 Z', color: primary, strokeWidth: 2.5, width: 24, height: 24 },
          { type: 'text', text: t.previewChip || 'Preview · 8s', margin: { left: 8 }, style: { fontSize: 17, color: '#273a5c', fontFamily: font, fontWeight: 700 } },
        ],
      },
    });
    workspace.push({
      type: 'container', alignment: portrait ? 'center' : 'centerLeft',
      offsetX: portrait ? 0 : 100, offsetY: portrait ? -220 : -46,
      width: previewW, height: previewH, borderRadius: 28, clip: true,
      shadow: { color: '#401a2b4a', blur: 38, offsetX: 0, offsetY: 18 },
      child: { type: 'stack', fit: 'expand', children: previewKids },
    });

    // Prompt inspector.
    var typed = typewriter(promptText, frame, 56, 42);
    var pulse = 1 + 0.1 * (eo3(seg(frame, 96, 99)) - eo3(seg(frame, 99, 103)));
    function settingRow(label, value, yy, color) {
      return {
        type: 'row', alignment: 'topLeft', offsetX: 32, offsetY: yy,
        width: portrait ? 500 : 516, mainAxisAlignment: 'spaceBetween', children: [
          { type: 'text', text: label, style: { fontSize: 18, color: '#7c8aa5', fontFamily: font, fontWeight: 600, letterSpacing: 1.4 } },
          { type: 'text', text: value, style: { fontSize: 19, color: color || '#263653', fontFamily: font, fontWeight: 700 } },
        ],
      };
    }
    var panelChildren = [
      {
        type: 'text', alignment: 'topLeft', offsetX: 32, offsetY: 30, text: 'PROMPT',
        style: { fontSize: 17, color: primary, fontFamily: font, fontWeight: 700, letterSpacing: 3 },
      },
      {
        type: 'text', alignment: 'topLeft', offsetX: 32, offsetY: 82,
        width: portrait ? 500 : 516, height: 124, text: typed, textAlign: 'left',
        style: { fontSize: portrait ? 24 : 27, color: '#172554', fontFamily: font, fontWeight: 600, lineHeight: 1.3 },
      },
      {
        type: 'container', alignment: 'topLeft', offsetX: 32, offsetY: 74 + Math.min(2, Math.ceil(typed.length / 28)) * 35,
        width: 4, height: 30, color: primary, opacity: blink(frame, 14),
      },
      { type: 'container', alignment: 'topCenter', offsetY: 224, width: portrait ? 500 : 516, height: 1, color: '#dce5f2' },
      settingRow('FORMAT', '16:9  /  1920 × 1080', 250),
      settingRow('DURATION', '8 SEC  /  30 FPS', 294),
      settingRow('STYLE', 'NEON ORBIT', 338, primary),
      {
        type: 'container', alignment: 'bottomCenter', offsetY: -32,
        width: 320, height: 68, scale: pulse,
        child: renderButtonNode({
          label: t.button || 'Render', font: font, fontSize: 25, width: 320, height: 68,
          colors: [primary, '#6366f1'], sparkleSize: 21,
          shadowColor: '#667c3aed', shadowBlur: 26, shadowOffsetY: 10,
        }),
      },
    ];
    if (!portrait) {
      workspace.push({
        type: 'container', alignment: 'centerRight', offsetX: -100, offsetY: -46,
        width: 580, height: 560, color: '#f4ffffff', borderRadius: 28,
        borderColor: '#d9ffffff', borderWidth: 1.5,
        shadow: { color: '#301a2b4a', blur: 34, offsetX: 0, offsetY: 18 },
        child: { type: 'stack', fit: 'expand', children: panelChildren },
      });
    }

    // Scene queue fills the lower frame with real narrative structure.
    var queueLabels = [['01', 'HOOK'], ['02', 'ORBIT'], ['03', 'LOGO'], ['04', 'OUTRO']];
    var queueKids = [];
    for (var q = 0; q < queueLabels.length; q++) {
      var active = q === 1;
      queueKids.push({
        type: 'container', width: portrait ? 205 : 340, height: 76,
        margin: { left: q === 0 ? 0 : 16 }, borderRadius: 16,
        color: active ? '#e8dcfb' : '#f2ffffff',
        borderColor: active ? '#a78bfa' : '#d9ffffff', borderWidth: 1.5,
        child: {
          type: 'row', crossAxisAlignment: 'center', children: [
            {
              type: 'container', width: 44, height: 44, margin: { left: 16 }, borderRadius: 12,
              color: active ? primary : '#d7e3f1',
              child: { type: 'text', alignment: 'center', text: queueLabels[q][0], style: { fontSize: 17, color: active ? '#ffffff' : '#62718c', fontFamily: font, fontWeight: 700 } },
            },
            { type: 'text', text: queueLabels[q][1], margin: { left: 16 }, style: { fontSize: 18, color: active ? primary : '#62718c', fontFamily: font, fontWeight: 700, letterSpacing: 1.5 } },
          ],
        },
      });
    }
    workspace.push({
      type: 'container', alignment: 'bottomCenter', offsetY: portrait ? -48 : -62,
      width: portrait ? 940 : 1500, height: 112, borderRadius: 24,
      color: '#b8ffffff', borderColor: '#d9ffffff', borderWidth: 1.5,
      shadow: { color: '#241a2b4a', blur: 26, offsetX: 0, offsetY: 12 },
      child: {
        type: 'stack', fit: 'expand', children: [
          { type: 'container', alignment: 'topLeft', offsetX: 24, offsetY: 12, width: portrait ? 892 : 1452, height: 3, color: '#d6e1ef' },
          { type: 'container', alignment: 'topLeft', offsetX: 24, offsetY: 12, width: (portrait ? 892 : 1452) * 0.42, height: 3, color: primary },
          { type: 'row', alignment: 'bottomCenter', offsetY: -12, mainAxisAlignment: 'center', children: queueKids },
        ],
      },
    });

    children.push({
      type: 'stack', fit: 'expand', opacity: workOp,
      scale: 0.96 + 0.04 * workIn + 0.05 * workOut,
      offsetY: 28 * (1 - workIn), children: workspace,
    });

    // Dark portal handoff instead of a hard blue-to-space cut.
    children.push({ type: 'container', color: '#0a0618', opacity: seg(frame, 132, 150) });
    var portal = seg(frame, 124, 146);
    if (portal > 0) {
      children.push({
        type: 'container', alignment: 'center', width: 300, height: 300,
        borderRadius: 999, borderColor: accent, borderWidth: 10,
        scale: 0.4 + 5 * eio3(portal), opacity: portal * (1 - seg(frame, 145, 150)),
        shadow: { color: '#9922d3ee', blur: 28, offsetX: 0, offsetY: 0 },
      });
    }
    return { type: 'stack', fit: 'expand', children: children };
  },
};
