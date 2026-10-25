// 05 — Deck: light product card (restored original look).
//
// The original deck was a LIGHT scene: periwinkle-blue background, a dark
// navy preview card center-left with a LIGHT left-aligned caption band,
// four white feature pills on the right, and the left thumbnail rail.
//
// Renderer notes: the scene background is opaque from frame 0 and the root
// stack carries NO opacity — fading the whole scene in once let the dark
// background layer bleed through at the prompt->deck cut (a "dark frame").
// Content also does NOT fade out at the end: the zoom scene opens with a
// frozen `scene:deck@148` snapshot and must match the live final frames
// pixel-for-pixel, so everything stays at full opacity until the cut.

scene = {
  id: 'deck',
  duration: 171,
  description: 'Light product deck: periwinkle background, dark navy preview card with a light left-aligned caption band, four large white feature pills right of center, uniform thumbnail rail on the far left.',
  voicePrompts: {
    en: 'Smooth, confident product narration with subtle UI ticks for each feature pill appearing.',
    ru: 'Уверенный продуктовый голос, лёгкие тики интерфейса при появлении каждой пилюли.',
  },
  timeline: {
    label: yoclipT('deck').timeline || 'Deck',
    color: '#2563eb',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('deck');
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    // No outro fade — the zoom scene's opening `scene:deck@148` freeze must
    // match these final frames exactly (see header note).
    var outro = 1;

    // ------------------------------------------------------------------
    // Layout constants (landscape 1920x1080)
    // ------------------------------------------------------------------
    var heroW = portrait ? 560 : 640;
    var heroH = portrait ? 640 : 620;
    var capH = 140;                    // caption band height inside hero
    var heroCX = portrait ? 0 : -260;  // offsetX of hero center
    var heroCY = portrait ? -260 : 0;
    var pillW = portrait ? 560 : 640;
    var pillH = 116;
    var pillStep = 140;
    var pillCX = portrait ? 0 : 480;   // offsetX of pill centers
    var pillY0 = portrait ? 210 : -210;
    var railX = 84;
    var thumbW = 170;
    var thumbH = 108;
    var thumbGap = 18;
    var iconBox = 60;
    var textW = pillW - 18 - iconBox - 16 - 24;

    // Per-bullet accents (teal, blue, violet, amber) like the original.
    var ACCENTS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b'];
    var TINTS = ['#1f14b8a6', '#1f3b82f6', '#1f8b5cf6', '#1ff59e0b'];

    // ------------------------------------------------------------------
    // Icon paths drawn inside the icon box (Geneva has no icon glyphs)
    // ------------------------------------------------------------------
    function iconPath(type) {
      if (type === 'wand') {
        return 'M 26 8 L 31 21 L 44 26 L 31 31 L 26 44 L 21 31 L 8 26 L 21 21 Z';
      }
      if (type === 'code') {
        return 'M 16 14 L 4 26 L 16 38 M 36 14 L 48 26 L 36 38';
      }
      if (type === 'chip') {
        return 'M 14 14 L 38 14 L 38 38 L 14 38 Z M 21 21 L 31 21 L 31 31 L 21 31 Z M 26 4 L 26 14 M 26 38 L 26 48 M 4 26 L 14 26 M 38 26 L 48 26';
      }
      // cube
      return 'M 8 18 L 26 26 L 44 18 L 26 10 Z M 8 18 L 8 34 L 26 42 L 44 34 L 44 18 M 26 26 L 26 42';
    }

    var children = [];

    // ------------------------------------------------------------------
    // Light background — opaque almost immediately (4f soft-in only, so the
    // cut from the prompt scene's white world never dips to the dark layer).
    // ------------------------------------------------------------------
    children.push({
      type: 'container',
      opacity: eo3(seg(frame, 0, 4)),
      gradient: {
        type: 'linear',
        colors: ['#d8e6f8', '#aec9ec'],
        begin: 'topCenter',
        end: 'bottomCenter',
      },
    });

    // ------------------------------------------------------------------
    // Hero card — dark navy preview, LIGHT caption band, left-aligned text.
    // Outer card clips to its radius so the caption band gets rounded
    // bottom corners for free.
    // ------------------------------------------------------------------
    var heroE = eo3(seg(frame, 4, 26));
    // Live vector launch preview: no baked prompt, cursor or stock GLB
    // screenshot. The same original rocket/satellite language as 07_space
    // keeps the deck and the full-screen 3D beat visually continuous.
    var previewH = heroH - capH;
    var previewKids = [
      {
        type: 'container',
        gradient: {
          type: 'linear', begin: 'topCenter', end: 'bottomCenter',
          colors: ['#111b3d', '#080b1c'],
        },
      },
      {
        type: 'container', alignment: 'center', width: 520, height: 420,
        gradient: { type: 'radial', colors: ['#387c3aed', '#007c3aed'] },
      },
    ];
    for (var ps = 0; ps < 42; ps++) {
      previewKids.push({
        type: 'container', alignment: 'center',
        width: ps % 9 === 0 ? 3 : 2, height: ps % 9 === 0 ? 3 : 2,
        borderRadius: 999,
        offsetX: ((ps * 83) % Math.max(1, heroW - 40)) - (heroW - 40) / 2,
        offsetY: ((ps * 47) % Math.max(1, previewH - 50)) - (previewH - 50) / 2,
        color: ps % 4 === 0 ? '#a5f3fc' : '#ffffff',
        opacity: 0.35 + 0.5 * shimmer(frame + ps * 3, 38),
      });
    }
    previewKids.push(
      {
        type: 'container', alignment: 'center', offsetY: 250,
        width: 780, height: 330, borderRadius: 999,
        gradient: {
          type: 'linear', begin: 'topCenter', end: 'bottomCenter',
          colors: ['#285ca8', '#111d48', '#080a18'],
        },
        borderColor: '#a5f3fc', borderWidth: 2,
      },
      {
        type: 'container', alignment: 'center', offsetX: 36, offsetY: -10,
        width: 460, height: 150, borderRadius: 999, rotation: -14,
        borderColor: '#667c3aed', borderWidth: 2,
      },
      {
        type: 'container', alignment: 'center', offsetX: 36, offsetY: -10,
        width: 330, height: 104, borderRadius: 999, rotation: 20,
        borderColor: '#8022d3ee', borderWidth: 1.5,
      },
      {
        type: 'image', source: 'external:rocket_vector', fit: 'contain',
        alignment: 'center', offsetX: 64, offsetY: -34 + 4 * Math.sin(frame * 0.07),
        width: 156, height: 206,
      },
      {
        type: 'image', source: 'external:satellite_vector', fit: 'contain',
        alignment: 'center', offsetX: -174, offsetY: -102,
        width: 116, height: 116,
      },
      {
        type: 'container', alignment: 'center', offsetX: 212, offsetY: -142,
        width: 48, height: 48, borderRadius: 999,
        gradient: { type: 'radial', colors: ['#f0f7ff', '#7385aa', '#26314d'] },
      },
      {
        type: 'text', alignment: 'topLeft', offsetX: 20, offsetY: 18,
        text: 'LIVE RENDER  /  SCENE 003',
        style: { fontSize: 12, color: '#a5b4fc', fontFamily: font, fontWeight: 700, letterSpacing: 1.6 },
      },
      {
        type: 'text', alignment: 'bottomLeft', offsetX: 20, offsetY: -18,
        text: 'VECTOR WORLD  ·  LIVE',
        style: { fontSize: 11, color: '#c5f4ff', fontFamily: font, letterSpacing: 1.4 },
      }
    );
    var heroPreview = {
      type: 'stack', fit: 'expand', children: previewKids,
    };
    children.push({
      type: 'container',
      alignment: 'center',
      offsetX: heroCX,
      offsetY: heroCY + (1 - heroE) * 50,
      width: heroW,
      height: heroH,
      opacity: heroE * outro,
      color: '#0f1730',
      borderRadius: 28,
      clip: true,
      shadow: { color: '#331a2b4a', blur: 30, offsetX: 0, offsetY: 14 },
      child: {
        type: 'column',
        children: [
          {
            type: 'container',
            width: heroW,
            height: heroH - capH,
            clip: true,
            child: heroPreview,
          },
          {
            type: 'container',
            width: heroW,
            height: capH,
            color: '#ffffff',
            child: {
              type: 'column',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'start',
              children: [
                {
                  type: 'text',
                  text: t.heroTitle || 'YoClip sees the frame,\nnot just text',
                  width: heroW - 64,
                  textAlign: 'left',
                  margin: { left: 32 },
                  style: {
                    fontSize: 26,
                    color: '#101c33',
                    fontFamily: font,
                    fontWeight: 700,
                    lineHeight: 1.25,
                  },
                },
                { type: 'container', height: 6 },
                {
                  type: 'text',
                  text: t.heroSubtitle || 'Your code, your visuals, one render graph.',
                  width: heroW - 64,
                  textAlign: 'left',
                  margin: { left: 32 },
                  style: {
                    fontSize: 15,
                    color: '#64748f',
                    fontFamily: font,
                    lineHeight: 1.3,
                  },
                },
              ],
            },
          },
        ],
      },
    });

    // ------------------------------------------------------------------
    // Feature pills — bigger white cards, shifted left, sliding in.
    // ------------------------------------------------------------------
    var bullets = t.bullets || [
      { title: 'Zero setup', lines: ['Describe a video as text or images,', 'and get an MP4.'], icon: 'wand' },
      { title: 'Code-first', lines: ['Write scenes in JavaScript,', 'animate any property by frame.'], icon: 'code' },
      { title: 'Native encoding', lines: ['FFmpeg under the hood — 8K, 60fps,', 'MP4, GIF, WebM, image sequences.'], icon: 'chip' },
      { title: 'GPU 3D', lines: ['Import GLB models, animate', 'skeletons, particles, shaders.'], icon: 'cube' },
    ];

    for (var i = 0; i < bullets.length; i++) {
      var b = bullets[i];
      var e = eio3(staggerItem(frame, i, 10, 8, 22));
      var accent = ACCENTS[i % ACCENTS.length];
      var tint = TINTS[i % TINTS.length];
      children.push({
        type: 'container',
        alignment: 'center',
        offsetX: pillCX + (1 - e) * 90,
        offsetY: pillY0 + i * pillStep,
        width: pillW,
        height: pillH,
        opacity: e * outro,
        color: '#ffffff',
        borderRadius: 26,
        shadow: { color: '#241a2b4a', blur: 18, offsetX: 0, offsetY: 8 },
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 20 },
            {
              type: 'container',
              width: iconBox,
              height: iconBox,
              borderRadius: 999,
              color: tint,
              child: {
                type: 'path',
                path: iconPath(b.icon),
                color: accent,
                strokeWidth: 2.5,
                width: iconBox,
                height: iconBox,
              },
            },
            { type: 'container', width: 18 },
            {
              type: 'column',
              crossAxisAlignment: 'start',
              mainAxisAlignment: 'center',
              children: [
                {
                  type: 'text',
                  text: b.title,
                  width: textW,
                  textAlign: 'left',
                  style: {
                    fontSize: 24,
                    color: '#101c33',
                    fontFamily: font,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  },
                },
                { type: 'container', height: 4 },
                {
                  type: 'text',
                  text: b.lines[0] || '',
                  width: textW,
                  textAlign: 'left',
                  style: {
                    fontSize: 17,
                    color: '#64748f',
                    fontFamily: font,
                    lineHeight: 1.3,
                  },
                },
                {
                  type: 'text',
                  text: b.lines[1] || '',
                  width: textW,
                  textAlign: 'left',
                  style: {
                    fontSize: 17,
                    color: '#64748f',
                    fontFamily: font,
                    lineHeight: 1.3,
                  },
                },
              ],
            },
          ],
        },
      });
    }

    // ------------------------------------------------------------------
    // Left thumbnail rail — five uniform rectangles (the mini kaleidoscope
    // card is the same 170x108 format as the rest, not a square).
    // ------------------------------------------------------------------
    if (!portrait) {
      // Scenic, text-free previews stay legible at 170px; UI screenshots
      // become unreadable noise at thumbnail size.
      var railSrcs = ['golden_kaleido', 'golden_tunnel', 'golden_space', 'golden_monolith', 'golden_endcard'];
      var railH = railSrcs.length * thumbH + (railSrcs.length - 1) * thumbGap;
      for (var j = 0; j < railSrcs.length; j++) {
        children.push({
          type: 'container',
          alignment: 'center',
          offsetX: railX + thumbW / 2 - 960,
          offsetY: -railH / 2 + thumbH / 2 + j * (thumbH + thumbGap),
          width: thumbW,
          height: thumbH,
          opacity: eo3(staggerItem(frame, j, 2, 4, 16)) * outro,
          borderRadius: 14,
          borderColor: j === 0 ? '#cc7c3aed' : '#99ffffff',
          borderWidth: j === 0 ? 2.5 : 1.5,
          shadow: { color: '#2e1a2b4a', blur: 16, offsetX: 0, offsetY: 7 },
          clip: true,
          child: {
            type: 'image',
            source: 'external:' + railSrcs[j],
            fit: 'cover',
            width: thumbW,
            height: thumbH,
          },
        });
      }
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: children,
    };
  },
};
