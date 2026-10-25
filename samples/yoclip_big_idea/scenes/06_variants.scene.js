// 06 — Variants: one source becomes a deliberate output matrix.
//
// A detailed project window bursts into five miniature, art-directed renders.
// The final composition is a 2×2 landscape grid plus a native 9:16 panel,
// rather than five near-identical cards fighting for one row.

scene = {
  id: 'variants',
  duration: 276,
  description: 'A project window bursts into five detailed render previews and settles into a 2x2 landscape matrix with a native 9:16 Shorts panel.',
  voicePrompts: {
    en: 'A whoosh as the frame multiplies into five variants, one per format.',
    ru: 'Свист — кадр размножается в пять вариантов, по одному на формат.',
  },
  timeline: {
    label: yoclipT('variants').timeline || 'Variants',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('variants');
    var title = t.title || 'One project. Every format.';
    var cardNames = t.cards || ['Dark · EN', 'Dark · RU', 'Light · EN', 'Light · RU', 'Shorts 9:16'];
    var command = t.command || 'yoclip render -V shorts_en';
    var portrait = yoclipIsPortrait();

    var font = yoclipFont();
    var surface = yoclipColor('surface', '#15131f');
    var deep = yoclipColor('backgroundDeep', '#07070d');
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var life = presence(frame, 8, 254, 14);

    // Quiet studio grid: visible in the empty entrance, never fights the cards.
    var children = [];
    for (var gx = -3; gx <= 3; gx++) {
      children.push({ type: 'container', alignment: 'center', offsetX: gx * 260, width: 1, height: 900, color: primaryLight, opacity: 0.035 });
    }
    for (var gy = -2; gy <= 2; gy++) {
      children.push({ type: 'container', alignment: 'center', offsetY: gy * 190, width: 1720, height: 1, color: accent, opacity: 0.035 });
    }
    children.push({
      type: 'container', alignment: 'center', width: 1050, height: 1050,
      gradient: { type: 'radial', center: 'center', radius: 0.5, colors: [yoclipColorA('primary', 0x24, '#7c3aed'), yoclipColorA('primary', 0, '#7c3aed')] },
    });

    var W = portrait ? 300 : 400;
    var H = portrait ? 169 : 225;
    var WT = portrait ? 160 : 238;
    var HT = portrait ? 284 : 423;
    var gridX = portrait ? [-180, 180, -180, 180, 0] : [-452, -20, -452, -20, 500];
    var gridY = portrait ? [-300, -300, -40, -40, 340] : [-62, -62, 202, 202, 70];

    function previewCard(i, masterMode) {
      var light = !masterMode && (i === 2 || i === 3);
      var tall = !masterMode && i === 4;
      var start = 44 + i * 8;
      var p = masterMode ? 1 : staggerItem(frame, i, 44, 8, 40);
      var e = eo3(p);
      var arc = Math.sin(clamp(p, 0, 1) * Math.PI);
      var x = masterMode ? 0 : lerp(0, gridX[i], e);
      var y = masterMode ? 40 : lerp(40, gridY[i], e) - arc * (110 + i * 12);
      var rot = masterMode ? 0 : (i - 2) * 9 * arc;
      var sc = masterMode ? 1 : Math.max(0.04, 0.28 + 0.72 * eoBack(p));
      var op = masterMode ? 1 : seg(frame, start, start + 8);
      if (!masterMode && p >= 1) y += float(frame, 3, 0.04, i * 0.8);

      var w = masterMode ? (portrait ? 540 : 640) : (tall ? WT : W);
      var h = masterMode ? (portrait ? 304 : 360) : (tall ? HT : H);
      var bg = light ? '#f4f3fa' : (masterMode ? deep : surface);
      var fg = light ? '#14121f' : txt;
      var sub = light ? '#68627c' : muted;
      var logo = light ? 'external:logo_on_light' : yoclipLogoSource();
      var line = light ? '#286d28d9' : primaryLight;
      var logoW = masterMode ? 210 : (tall ? 118 : 132);
      var logoH = Math.round(logoW * 152 / 240);

      var previewChildren = [
        {
          type: 'container', alignment: 'center', width: w, height: h,
          gradient: {
            type: 'radial', center: 'center', radius: 0.65,
            colors: [light ? '#335f46ee' : yoclipColorA('primary', 0x30, '#7c3aed'), light ? '#00f4f3fa' : yoclipColorA('primary', 0, '#7c3aed')],
          },
        },
        // Native output chrome.
        { type: 'container', alignment: 'topCenter', width: w, height: masterMode ? 48 : 38, color: light ? '#e7e4f1' : yoclipColorA('backgroundSoft', 0xe6, '#0d0d18') },
        {
          type: 'text', alignment: 'topLeft', offsetX: masterMode ? 20 : 16, offsetY: masterMode ? 15 : 11,
          text: masterMode ? 'PROJECT  /  yoclip_big_idea' : (cardNames[i] || ''),
          style: { fontSize: masterMode ? 18 : (tall ? 14 : 17), color: fg, fontFamily: font, fontWeight: 600, letterSpacing: masterMode ? 2 : 0.5 },
        },
        {
          type: 'text', alignment: 'topRight', offsetX: masterMode ? -20 : -16, offsetY: masterMode ? 16 : 12,
          text: masterMode ? 'SOURCE 01' : (tall ? '9:16' : '16:9'),
          style: { fontSize: masterMode ? 15 : 13, color: tall ? accent : sub, fontFamily: font, fontWeight: 600, letterSpacing: 1.5 },
        },
        {
          type: 'image', source: logo, fit: 'contain', width: logoW, height: logoH,
          alignment: 'center', offsetY: masterMode ? -30 : (tall ? -62 : -25),
        },
        // Tiny editorial headline and subtitle, intentionally drawn as bars.
        {
          type: 'container', alignment: 'center', offsetY: masterMode ? 83 : (tall ? 42 : 43),
          width: masterMode ? 270 : (tall ? 120 : 200), height: masterMode ? 14 : 11,
          borderRadius: 6, color: fg, opacity: 0.88,
        },
        {
          type: 'container', alignment: 'center', offsetY: masterMode ? 110 : (tall ? 68 : 67),
          width: masterMode ? 190 : (tall ? 88 : 138), height: 7,
          borderRadius: 4, color: tall ? accent : line, opacity: 0.8,
        },
      ];

      if (masterMode) {
        // Timeline tracks make the source read as a real project, not a logo tile.
        for (var tr = 0; tr < 3; tr++) {
          previewChildren.push({ type: 'container', alignment: 'bottomLeft', offsetX: 28, offsetY: -26 - tr * 20, width: 400 - tr * 62, height: 8, borderRadius: 4, color: tr === 1 ? accent : primaryLight, opacity: 0.45 + tr * 0.12 });
          previewChildren.push({ type: 'container', alignment: 'bottomRight', offsetX: -28, offsetY: -26 - tr * 20, width: 92 + tr * 24, height: 8, borderRadius: 4, color: muted, opacity: 0.28 });
        }
      } else {
        previewChildren.push({
          type: 'text', alignment: 'bottomCenter', offsetY: tall ? -22 : -14,
          text: tall ? 'NATIVE  /  1080 × 1920' : '1920 × 1080  /  30 FPS',
          style: { fontSize: tall ? 11 : 12, color: sub, fontFamily: font, fontWeight: 600, letterSpacing: tall ? 1 : 1.5 },
        });
        // Render-complete marker.
        previewChildren.push({ type: 'container', alignment: 'bottomRight', offsetX: -14, offsetY: -14, width: 7, height: 7, borderRadius: 4, color: tall ? accent : '#34d399' });
      }

      return {
        type: 'container', alignment: 'center', offsetX: x, offsetY: y,
        width: w, height: h, rotation: rot, scale: sc, opacity: op,
        color: bg, borderRadius: masterMode ? 26 : 19, clip: true,
        borderColor: tall ? yoclipColorA('accent', 0x99, '#22d3ee') : (light ? '#3314121f' : yoclipColorA('primaryLight', 0x55, '#a78bfa')),
        borderWidth: tall ? 2 : 1.5,
        shadow: { color: yoclipColorA(tall ? 'accent' : 'primary', 0x28, '#7c3aed'), blur: 34, offsetX: 0, offsetY: 14 },
        child: { type: 'stack', fit: 'expand', children: previewChildren },
      };
    }

    // Master collapses as the outputs leave the source.
    var masterPop = pop(frame, 5, 22);
    var masterOut = seg(frame, 38, 66);
    var master = previewCard(0, true);
    master.scale = Math.max(0.04, masterPop.scale * (1 - 0.72 * masterOut));
    master.opacity = masterPop.opacity * (1 - masterOut);
    master.offsetY = 40 - 34 * masterOut;
    children.push(master);
    for (var i = 0; i < 5; i++) children.push(previewCard(i, false));

    // Header hierarchy.
    children.push({
      type: 'text', alignment: 'topCenter', offsetY: portrait ? 122 : 72,
      text: typewriter(title, frame, 8, 52), opacity: seg(frame, 6, 12),
      style: { fontSize: portrait ? 44 : 56, color: txt, fontFamily: font, fontWeight: 700, letterSpacing: -0.5 },
    });
    children.push({
      type: 'text', alignment: 'topCenter', offsetY: portrait ? 180 : 140,
      text: '01 SOURCE   /   05 RENDERS', opacity: seg(frame, 12, 24),
      style: { fontSize: portrait ? 17 : 18, color: accent, fontFamily: font, fontWeight: 600, letterSpacing: 4 },
    });

    var capIn = ease(frame, 190, 210, eo3);
    children.push({
      type: 'container', alignment: 'bottomCenter', offsetY: (portrait ? -54 : -46) - (1 - capIn) * 18,
      width: portrait ? 760 : 720, height: 62, opacity: capIn,
      color: yoclipColorA('backgroundDeep', 0xd9, '#07070d'), borderRadius: 31,
      borderColor: yoclipColorA('accent', 0x66, '#22d3ee'), borderWidth: 1.5,
      child: {
        type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 24 },
          { type: 'container', width: 8, height: 8, borderRadius: 4, color: accent },
          {
            type: 'text', text: '$  ' + command, margin: { left: 14, right: 26 },
            style: { fontSize: portrait ? 21 : 24, color: primaryLight, fontFamily: font, fontWeight: 600, letterSpacing: 2 },
          },
        ],
      },
    });

    return { type: 'stack', fit: 'expand', opacity: life, children: children };
  },
};
