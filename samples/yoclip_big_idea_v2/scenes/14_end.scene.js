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
    var muted = '#5b5670';
    var urlColor = '#2563eb'; // link blue, readable on lavender

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

    // -- Beat 3 (60–92): hairline rule + URL.
    var urlIn = ease(frame, 60, 84, eo3);
    var ruleW = lerp(0, 240, ease(frame, 64, 92, eo3));

    // -- Beat 4 (100–120): the mic-drop meta line, then HOLD to the end.
    var metaIn = ease(frame, 100, 118, eo3);

    // ---- Landscape: flat 2D SVG ridge silhouettes (layers below) -----------
    var groundY = -1.1;

    // ---- The real 3D logo (all GLB parts), bobbing above the near dune. ----
    // Full wordmark must FIT the frame with air around it: scale 1.0 (the
    // GLB layout spans ~5.9 units), planted just above the near dune so the
    // tagline below never collides with it.
    var logoY = groundY + 0.05 + 0.06 * Math.sin(frame * 0.07);
    var logoModels = [];
    var logoSc = Math.max(0.001, logoPop.scale) * 1.0;
    var logoParts = ['arc', 'bubble', 'l', 'i', 'idot', 'p'];
    for (var pi = 0; pi < logoParts.length; pi++) {
      logoModels.push({
        modelId: logoParts[pi],
        src: 'models/logo/' + logoParts[pi] + '.glb',
        unlit: true,
        position: [0, logoY, 0],
        rotation: [0, 4 * Math.sin(frame * 0.03), 0],
        scale: [logoSc, logoSc, logoSc],
      });
    }

    // ---- Camera: gentle drift, framed wide enough that the whole wordmark
    // (incl. the arc) stays inside the frame with margin; target sits a
    // touch below the logo center so the mark floats above the tagline.
    var push = ease(frame, 0, 179, eio3);
    var camY = lerp(2.0, 1.7, push);
    var camZ = lerp(11.5, 10.2, push);
    var cam = { position: [0, camY, camZ], target: [0, 0.3, 0], fov: 50 };

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
      // Breathing radial glow behind the logo.
      {
        type: 'container',
        alignment: 'center',
        offsetY: portrait ? -300 : -120,
        width: 900,
        height: 900,
        opacity: glowOp,
        gradient: {
          type: 'radial',
          colors: [yoclipColorA('primary', 0x30, '#7c3aed'), yoclipColorA('primary', 0x00, '#7c3aed')],
          stops: [0, 1],
        },
      },
      // The real 3D logo.
      {
        type: 'scene3d',
        engine: 'flame',
        id: 'v2-end-logo',
        time: frame / 30,
        camera: cam,
        light: { ambient: 1.7, diffuse: 1.4, position: [4, 6, 6] },
        models: logoModels,
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
          fontSize: portrait ? 56 : 84,
          color: ink,
          fontFamily: font,
          fontWeight: 700,
          letterSpacing: tagSp,
        },
      },
      // Hairline accent rule.
      {
        type: 'container',
        alignment: 'center',
        offsetY: portrait ? 420 : 330,
        width: ruleW,
        height: 2,
        color: urlColor,
        opacity: urlIn,
      },
      // URL (link-styled: link blue + underline bar; the renderer's text
      // style forces TextDecoration.none, so the underline is a container).
      {
        type: 'text',
        alignment: 'center',
        offsetY: portrait ? 480 : 376,
        text: url,
        opacity: urlIn,
        style: {
          fontSize: portrait ? 30 : 34,
          color: urlColor,
          fontFamily: font,
          fontWeight: 700,
          letterSpacing: 4,
        },
      },
      {
        type: 'container',
        alignment: 'center',
        offsetY: portrait ? 514 : 408,
        width: lerp(0, 460, ease(frame, 64, 92, eo3)),
        height: 2,
        color: urlColor,
        opacity: urlIn,
      },
      // Mic drop: rendered by yoclip.
      {
        type: 'text',
        alignment: 'bottomCenter',
        offsetY: portrait ? -48 : -60,
        text: meta,
        opacity: metaIn,
        style: {
          fontSize: portrait ? 22 : 24,
          color: muted,
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
