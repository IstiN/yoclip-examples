// 11 — Upload: drop your scenes, get a polished report.
//
// Reference beat (Gamma 57–63s): a dark violet 3D gallery of drifting layout
// panels; a frosted window titled "Drop your scenes" lands center with a
// dashed dropzone; a JS file chip falls from the top and LANDS in the
// dropzone with a bounce while the prompt line types; a scan line sweeps the
// window — then the window morphs into a polished white REPORT card (warm
// orange header with the report title inside, orange headline + muted note
// in the body, right tool rail) as the camera pushes in.
//
// Renderer notes: no dashed-border support — the dropzone fakes dashes with
// rows/columns of small dash containers. Rows/columns in a tight stack need
// explicit width / mainAxisAlignment positioning. Mesh colors carry no
// alpha; the header art is plain gradient + translucent bars.

scene = {
  id: 'upload',
  duration: 201,
  description: 'Dark violet gallery of drifting tilted layout panels (0.3-0.45 opacity, ±25px parallax), camera drifting forward; a frosted "Drop your scenes" window drops center with a dashed dropzone; a JS file chip (violet JS badge + accent mono-ish filename) falls and lands centered in the dropzone with an eoBack bounce while the letterspaced prompt types; a scan line sweeps + progress bar fills; the window morphs into a white report card (orange header with bright bars + white reportA title, reportB orange headline + muted note centered in the body, right icon rail) as the camera pushes in. Report header/title geometry matches 12_polish exactly so the 11 -> 12 crossfade morphs.',
  voicePrompts: {
    en: 'A soft thud as the file lands, a scanning hum, then a bright reveal.',
    ru: 'Мягкий стук приземления файла, гул сканирования и яркое раскрытие.',
  },
  timeline: {
    label: yoclipT('upload').timeline || 'Upload',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('upload');
    var title = t.title || 'Drop your scenes';
    var field = t.field || 'Read my scene files and render the takeaways';
    var reportA = t.reportA || 'Render report FY26';
    var reportB = t.reportB || '12 scenes · 2580 frames · 0 errors';
    var note = t.note || 'Every pixel accounted for — goldens match across preview, CLI and export.';
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 179, 14);

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var orange = '#ea580c';

    // Camera: slow drift forward through the gallery, then a push-in on the
    // report card.
    var drift = ease(frame, 0, 201, eio3);
    var push = ease(frame, 110, 201, eio3);
    var camScale = 1 + 0.05 * drift + 0.04 * push;
    var camY = -14 * drift - 10 * push;

    // -- Background gallery: floating 2D layout panels at tilts/depths.
    // Opacities 0.30-0.45 + brighter borders + ±25px drift — the panels
    // must read as a gallery, not as a flat dark backdrop.
    var panelSpecs = [
      [-700, -260, -9, 300, 180, 0.44, 0.0],
      [640, -300, 7, 260, 160, 0.38, 1.3],
      [-820, 180, 6, 240, 300, 0.32, 2.1],
      [760, 220, -7, 300, 200, 0.42, 0.7],
      [-380, 420, -5, 220, 140, 0.30, 1.8],
      [300, -470, 5, 200, 130, 0.36, 2.6],
    ];
    var panels = [];
    for (var pi = 0; pi < panelSpecs.length; pi++) {
      var ps = panelSpecs[pi];
      var depthScale = 1 + 0.35 * drift * (0.5 + ps[6] * 0.2);
      panels.push({
        type: 'container',
        alignment: 'center',
        offsetX: ps[0] * (portrait ? 0.55 : 1),
        offsetY: ps[1] + float(frame, 25, 0.03, ps[6]),
        width: ps[3],
        height: ps[4],
        rotation: ps[2] + float(frame, 2, 0.02, ps[6] * 2),
        scale: depthScale,
        opacity: ps[5] * (1 - 0.7 * push),
        color: yoclipColorA('primaryLight', 0x14, '#a78bfa'),
        borderRadius: 18,
        borderColor: yoclipColorA('primaryLight', 0x66, '#a78bfa'),
        borderWidth: 1.5,
      });
    }

    // -- The frosted window.
    var winIn = ease(frame, 2, 24, eo3);
    var winY = -720 * (1 - eo3(seg(frame, 2, 26)));
    var winOut = seg(frame, 100, 118);
    var winW = portrait ? 880 : 760;
    var winH = portrait ? 600 : 520;

    // Fake-dashed dropzone edges: rows/columns of dash chips.
    function dashRow(y) {
      var kids = [];
      for (var d = 0; d < 14; d++) {
        kids.push({
          type: 'container',
          width: 30,
          height: 3,
          borderRadius: 2,
          color: yoclipColorA('primaryLight', 0x73, '#a78bfa'),
          margin: { left: d === 0 ? 0 : 14 },
        });
      }
      return {
        type: 'row',
        alignment: 'center',
        offsetY: y,
        width: 602,
        mainAxisAlignment: 'center',
        children: kids,
      };
    }
    function dashCol(x) {
      var kids = [];
      for (var d = 0; d < 6; d++) {
        kids.push({
          type: 'container',
          width: 3,
          height: 26,
          borderRadius: 2,
          color: yoclipColorA('primaryLight', 0x73, '#a78bfa'),
          margin: { top: d === 0 ? 0 : 14 },
        });
      }
      return {
        type: 'column',
        alignment: 'center',
        offsetX: x,
        offsetY: -14,
        mainAxisAlignment: 'center',
        children: kids,
      };
    }

    var DZ_W = 640, DZ_H = 260, DZ_Y = -14;
    var dropzone = {
      type: 'stack',
      fit: 'expand',
      children: [
        dashRow(DZ_Y - DZ_H / 2),
        dashRow(DZ_Y + DZ_H / 2),
        dashCol(-301),
        dashCol(301),
        // Upload arrow glyph inside the dropzone (pre-landing).
        {
          type: 'path',
          path: 'M 16 30 L 16 8 M 7 17 L 16 8 L 25 17 M 6 30 L 26 30',
          color: primaryLight,
          strokeWidth: 3,
          width: 40,
          height: 40,
          alignment: 'center',
          offsetY: DZ_Y + 6,
          opacity: 1 - seg(frame, 42, 52),
        },
      ],
    };

    // File chip: falls from the top and lands in the dropzone (eoBack bounce).
    var chipFall = clamp(eoBack(seg(frame, 26, 48)), 0, 1.2);
    var chipY = lerp(-760, DZ_Y + 6, chipFall);
    var fileChip = {
      type: 'container',
      alignment: 'center',
      offsetY: chipY,
      // Explicit width — a container > row stretches to the window otherwise.
      width: 460,
      opacity: seg(frame, 26, 30) * (1 - seg(frame, 100, 112)),
      color: '#241d3d',
      borderRadius: 14,
      borderColor: yoclipColorA('primaryLight', 0x4d, '#a78bfa'),
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x59, '#7c3aed'), blur: 24, offsetX: 0, offsetY: 12 },
      child: {
        type: 'row',
        // Centered inside the fixed-width chip — otherwise the short
        // filename leaves the chip's visual mass left of the dropzone.
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 16 },
          {
            type: 'container',
            width: 44,
            height: 44,
            borderRadius: 10,
            gradient: {
              colors: [primary, primaryLight],
              begin: 'topLeft',
              end: 'bottomRight',
            },
            child: {
              type: 'stack',
              fit: 'expand',
              children: [{
                type: 'text',
                alignment: 'center',
                text: 'JS',
                style: { fontSize: 20, color: '#ffffff', fontFamily: font, fontWeight: 700 },
              }],
            },
          },
          {
            type: 'text',
            text: 'scenes/06_stats.scene.js',
            margin: { left: 14 },
            style: { fontSize: 21, color: accent, fontFamily: font, letterSpacing: 1 },
          },
          { type: 'container', width: 20 },
          { type: 'container', height: 62 },
        ],
      },
    };

    // Prompt line types below the dropzone.
    var typedField = typewriter(field, frame, 52, 55);

    // Beat 2: scan line sweeps the window + thin progress bar fills.
    var scanX = lerp(-320, 320, ease(frame, 58, 98, eio3));
    var scanOp = seg(frame, 56, 62) * (1 - seg(frame, 96, 104));
    var barW = lerp(0, 620, ease(frame, 58, 98, eo3));

    var window3 = {
      type: 'container',
      alignment: 'center',
      offsetY: winY,
      width: winW,
      height: winH,
      opacity: winIn * (1 - winOut),
      scale: 1 - 0.06 * winOut,
      color: yoclipColorA('surface', 0xe0, '#15131f'),
      borderRadius: 24,
      borderColor: yoclipColorA('primaryLight', 0x40, '#a78bfa'),
      borderWidth: 1.5,
      shadow: { color: '#6612080f', blur: 60, offsetX: 0, offsetY: 26 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // Title bar: traffic dots + title.
          {
            type: 'row',
            alignment: 'topCenter',
            offsetY: 18,
            width: winW - 56,
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 12, height: 12, borderRadius: 6, color: '#f87171' },
              { type: 'container', width: 12, height: 12, borderRadius: 6, color: '#fbbf24', margin: { left: 8 } },
              { type: 'container', width: 12, height: 12, borderRadius: 6, color: '#34d399', margin: { left: 8 } },
              {
                type: 'text',
                text: title,
                margin: { left: 18 },
                style: { fontSize: 22, color: muted, fontFamily: font, fontWeight: 600 },
              },
            ],
          },
          dropzone,
          fileChip,
          // Scan line sweep.
          {
            type: 'container',
            alignment: 'center',
            offsetX: scanX,
            offsetY: DZ_Y,
            width: 5,
            height: DZ_H + 40,
            opacity: scanOp,
            gradient: {
              type: 'linear',
              begin: 'topCenter',
              end: 'bottomCenter',
              colors: [yoclipColorA('accent', 0x00, '#22d3ee'), accent, yoclipColorA('accent', 0x00, '#22d3ee')],
            },
          },
          // Typed prompt line — technical feel via letterSpacing (no mono
          // variant in the theme fonts).
          {
            type: 'text',
            alignment: 'bottomCenter',
            offsetY: -64,
            text: typedField,
            style: { fontSize: portrait ? 22 : 24, color: '#e7e5f4', fontFamily: font, letterSpacing: 1 },
          },
          // Progress bar.
          {
            type: 'container',
            alignment: 'bottomCenter',
            offsetY: -34,
            width: 620,
            height: 5,
            borderRadius: 3,
            color: yoclipColorA('primaryLight', 0x26, '#a78bfa'),
          },
          {
            type: 'container',
            alignment: 'bottomCenter',
            offsetY: -34,
            offsetX: -(620 - barW) / 2,
            width: Math.max(2, barW),
            height: 5,
            borderRadius: 3,
            color: accent,
          },
        ],
      },
    };

    // -- Beat 3: the polished report card morphs in.
    var cardPop = pop(frame, 106, 24);
    var cardW = portrait ? 940 : 980;
    var cardH = portrait ? 700 : 640;

    // Header art bars (abstract, warm) — bright enough against #f97316.
    var bars = [];
    var barH = [56, 92, 70, 108, 84];
    for (var bi = 0; bi < 5; bi++) {
      var bh = barH[bi] * ease(frame, 118 + bi * 4, 118 + bi * 4 + 18, eo3);
      bars.push({
        type: 'container',
        width: 44,
        height: Math.max(2, bh),
        borderRadius: 10,
        color: '#99ffffff',
        margin: { left: bi === 0 ? 0 : 22 },
      });
    }

    var railGlyphs = [
      'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z', // sparkle
      'M 4 4 L 28 4 L 28 28 L 4 28 Z M 4 14 L 28 14 M 14 14 L 14 28', // layout
      'M 4 4 L 28 4 L 28 28 L 4 28 Z M 8 24 L 14 16 L 19 21 L 23 15 L 28 22', // image
    ];
    var railKids = [];
    for (var rg = 0; rg < railGlyphs.length; rg++) {
      railKids.push({
        type: 'container',
        width: 62,
        height: 62,
        margin: { top: rg === 0 ? 0 : 16 },
        color: '#f5f2ee',
        borderColor: '#e7dccb',
        borderWidth: 1.5,
        borderRadius: 18,
        child: {
          type: 'path',
          path: railGlyphs[rg],
          color: primary,
          strokeWidth: 2.6,
          width: 30,
          height: 30,
          alignment: 'center',
        },
      });
    }

    var reportCard = {
      type: 'container',
      alignment: 'center',
      width: cardW,
      height: cardH,
      opacity: cardPop.opacity,
      scale: Math.max(0.05, cardPop.scale),
      color: '#ffffff',
      borderRadius: 28,
      shadow: { color: '#5912080f', blur: 64, offsetX: 0, offsetY: 26 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // Warm orange header image area. Geometry (full-width 200/220px
          // strip, white reportA title at topCenter/offsetY 34/30px) matches
          // 12_polish's report header pixel-for-pixel, so the 11 -> 12
          // crossfade reads as a morph, not an overlay.
          {
            type: 'container',
            alignment: 'topCenter',
            width: cardW,
            height: portrait ? 200 : 220,
            gradient: {
              type: 'linear',
              begin: 'topLeft',
              end: 'bottomRight',
              colors: ['#fdba74', '#f97316'],
            },
            child: {
              type: 'row',
              alignment: 'bottomCenter',
              offsetY: -26,
              crossAxisAlignment: 'end',
              mainAxisAlignment: 'center',
              children: bars,
            },
          },
          // Report title inside the header — same slot as in 12_polish.
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: 34,
            text: reportA,
            style: { fontSize: 30, color: '#ffffff', fontFamily: font, fontWeight: 700 },
          },
          // Headline + note, centered in the body zone under the header.
          {
            type: 'column',
            alignment: 'center',
            offsetY: portrait ? 100 : 110,
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'start',
            children: [
              {
                type: 'text',
                text: reportB,
                textAlign: 'left',
                style: { fontSize: portrait ? 30 : 34, color: orange, fontFamily: font, fontWeight: 700 },
              },
              {
                type: 'text',
                text: note,
                textAlign: 'left',
                margin: { top: 20 },
                width: portrait ? 700 : 640,
                style: { fontSize: portrait ? 22 : 24, color: '#6b7280', fontFamily: font, lineHeight: 1.35 },
              },
            ],
          },
          // Right tool rail.
          {
            type: 'column',
            alignment: 'centerRight',
            offsetX: -36,
            offsetY: portrait ? 120 : 60,
            mainAxisAlignment: 'center',
            children: railKids,
          },
        ],
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      scale: camScale,
      offsetY: camY,
      children: [
        // Dark violet gallery world.
        {
          type: 'container',
          gradient: {
            type: 'linear',
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#1a1033', '#07070d'],
          },
        },
      ].concat(panels, [window3, reportCard]),
    };
  },
};
