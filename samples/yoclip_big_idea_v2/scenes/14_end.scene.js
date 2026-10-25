// 14 — End: the end card — layered sunset world + the REAL 3D logo.
//
// Reference beat (Gamma 78–83s): calm and premium after the flythrough. A
// white flash settles from the tunnel into the VIVID sunset world (the
// same one the intro built, bookending the video): three parallax dune
// layers sway at different depths, the actual GLB yoclip logo stands on
// the near dune with a gentle bob, and the camera pushes in slowly.
// Tagline eases in with letter-spacing tightening, a hairline rule draws,
// yoclip.studio fades in, then the mic-drop meta line. HOLDS to the end.
//
// Renderer notes: software scene3d (dunes) has no z-buffer — layers stay
// in separate z planes and sway on sine so they never intersect. The GLB
// logo parts load via the declarative `models:` flame config (same
// pipeline as 01_monolith). Ink text sits over the light dune field,
// cyan URL over both.

scene = {
  id: 'end',
  duration: 180,
  description: 'Layered end card: white flash settles into the vivid sunset world; three parallax dune layers sway, the real 3D yoclip logo stands on the near dune bobbing gently; tagline "Describe it. Render it." tightens in, hairline rule + yoclip.studio fade in, meta line at the bottom. Holds to the end.',
  voicePrompts: {
    en: 'The music resolves. Quiet confidence: describe it, render it.',
    ru: 'Музыка разрешается. Спокойная уверенность: опиши — отрендерь.',
  },
  timeline: {
    label: yoclipT('end').timeline || 'End',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('end');
    var tagline = t.tagline || 'Describe it. Render it.';
    var url = t.url || 'https://yoclip.studio';
    var meta = t.meta || 'Rendered by yoclip.';
    var portrait = yoclipIsPortrait();

    // Fade in only — the end card holds to the last frame.
    var life = fadeIn(frame, 14);

    var font = yoclipFont();
    var ink = '#14121f';

    // -- Beat 0 (0–6): SHORT white settle from the tunnel. A long flash +
    // slow world fade read as "just a white scene" — keep it snappy.
    var flashOp = 1 - seg(frame, 0, 6);

    // -- Beat 1 (0–16): the world snaps in; the logo pops almost immediately
    // (a brand scene must show the BRAND within the first half second).
    var worldIn = ease(frame, 0, 14, eo3);
    var logoPop = pop(frame, 16, 22);
    var glowOp = logoPop.opacity * (0.5 + 0.28 * shimmer(frame, 60));

    // -- Beat 2 (26–56): tagline tightens in under the logo.
    var tagIn = ease(frame, 26, 50, eio3);
    var tagSp = lerp(12, 2, tagIn);
    var tagY = (1 - eo3(seg(frame, 26, 56))) * 50;

    // -- Beat 3 (60–92): the URL chip.
    var urlIn = ease(frame, 60, 84, eo3);

    // -- Beat 4 (100–120): the mic-drop meta line, then HOLD to the end.
    var metaIn = ease(frame, 100, 118, eo3);

    // ---- Bespoke vector brand lockup ---------------------------------------
    // The GPU logo was both small and vulnerable to Impeller placeholders.
    // The original brand SVG is crisp at any size and gives the finale a
    // dominant, perfectly legible mark in every render environment.
    var push = ease(frame, 0, 179, eio3);
    var logoW = portrait ? 760 : 1080;
    var logoH = Math.round(logoW * 520 / 820);
    var logoY = (portrait ? -300 : -200) + 6 * Math.sin(frame * 0.07);
    var logoSc = Math.max(0.001, logoPop.scale) * (1 + 0.025 * push);

    var layers = [
      // Vivid sunset sky (same language as 01_monolith).
      {
        type: 'container',
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#1e1b4b', '#7c3aed', '#ec4899', '#fb923c', '#f2defe', '#f2defe'],
          stops: [0.0, 0.42, 0.62, 0.72, 0.75, 1.0],
        },
        opacity: worldIn,
      },
      // Sun glow low over the horizon.
      {
        type: 'container',
        alignment: 'center',
        width: 1000,
        height: 1000,
        borderRadius: 999,
        offsetX: 420,
        offsetY: 240,
        opacity: worldIn,
        gradient: {
          type: 'radial',
          colors: ['#f2fde68a', '#00fde68a'],
          stops: [0, 1],
        },
      },
      {
        type: 'container',
        alignment: 'center',
        width: 170,
        height: 170,
        borderRadius: 999,
        offsetX: 420,
        offsetY: 240,
        opacity: worldIn,
        color: '#fef3c7',
      },
      // Flat 2D ridge silhouettes (flat-design landscape like the refs) —
      // each layer sways on its own sine for parallax.
      {
        type: 'image',
        source: 'external:ridge_far',
        fit: 'cover',
        width: 1920,
        height: 1080,
        scale: 1.5625,
        alignment: 'center',
        offsetX: 14 * Math.sin(frame * 0.010 + 0.4),
        opacity: worldIn,
      },
      {
        type: 'image',
        source: 'external:ridge_mid',
        fit: 'cover',
        width: 1920,
        height: 1080,
        scale: 1.5625,
        alignment: 'center',
        offsetX: 20 * Math.sin(frame * 0.014 + 2.1),
        opacity: worldIn,
      },
      {
        type: 'image',
        source: 'external:ridge_near',
        fit: 'cover',
        width: 1920,
        height: 1080,
        scale: 1.5625,
        alignment: 'center',
        offsetX: 28 * Math.sin(frame * 0.018 + 3.9),
        opacity: worldIn,
      },
      // A soft light halo separates the dark-ink mark from the sunset.
      {
        type: 'container', alignment: 'center',
        offsetY: portrait ? -300 : -180,
        width: portrait ? 900 : 1260, height: portrait ? 700 : 780,
        borderRadius: 999, opacity: glowOp,
        gradient: {
          type: 'radial',
          colors: ['#b3fff7ed', '#59f2defe', '#00f2defe'],
          stops: [0, 0.58, 1],
        },
      },
      {
        type: 'image', source: 'external:logo_on_light', fit: 'contain',
        alignment: 'center', width: logoW, height: logoH,
        offsetY: logoY, scale: logoSc, opacity: logoPop.opacity,
      },
      // Tagline over the dune field (ink on light lavender) — dropped 50px
      // so the enlarged logo above never overlaps it.
      {
        type: 'text',
        alignment: 'center',
        offsetY: (portrait ? 340 : 260) + tagY,
        text: tagline,
        opacity: tagIn,
        style: {
          fontSize: portrait ? 56 : 80,
          color: ink,
          fontFamily: font,
          fontWeight: 700,
          letterSpacing: tagSp,
        },
      },
      // URL on a dark glass chip — plain blue/gray text drowned in the
      // purple dune field; the chip keeps it readable on any ridge color.
      {
        type: 'container',
        alignment: 'center',
        offsetY: portrait ? 452 : 368,
        opacity: urlIn,
        // Explicit width — a container > row stretches to the frame.
        width: portrait ? 480 : 460,
        height: 66,
        color: '#c014121f',
        borderRadius: 999,
        borderColor: '#40ffffff',
        borderWidth: 1.5,
        shadow: { color: '#4014121f', blur: 26, offsetX: 0, offsetY: 10 },
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 30 },
            {
              type: 'path',
              path: 'M 10 14 A 5.6 5.6 0 1 1 14 10 M 14 4 L 14 10 L 20 10',
              color: '#22d3ee',
              strokeWidth: 2.4,
              width: 24,
              height: 24,
              margin: { right: 12 },
            },
            {
              type: 'text',
              text: url,
              style: {
                fontSize: portrait ? 28 : 30,
                color: '#ffffff',
                fontFamily: font,
                fontWeight: 700,
                letterSpacing: 2,
              },
            },
            { type: 'container', width: 32 },
            { type: 'container', height: 64 },
          ],
        },
      },
      // Mic drop: rendered by yoclip. Light lavender — the old muted gray
      // was invisible on the purple dune.
      {
        type: 'text',
        alignment: 'bottomCenter',
        offsetY: portrait ? -48 : -60,
        text: meta,
        opacity: metaIn,
        style: {
          fontSize: portrait ? 22 : 24,
          color: '#d9d2f2',
          fontFamily: font,
          letterSpacing: 6,
        },
      },
      // Settling flash (topmost): plain white, gone by frame 12.
      {
        type: 'absolute_fill',
        color: '#ffffff',
        opacity: flashOp,
      },
    ];

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: layers,
    };
  },
};
