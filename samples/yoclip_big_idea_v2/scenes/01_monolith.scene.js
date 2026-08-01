// 01 — Monolith → yoclip wordmark: the caret becomes a monument, the
// monument becomes the "l".
//
// Beat 1 (0–26f): the black caret bar from the hook elongates on off-white
// while the background crossfades into a VIVID sunset world — saturated
// indigo→violet→hot-pink→orange sky, glowing low sun, lavender dunes,
// twinkling stars. Beat 2 (40–140f): the camera dollies back, the
// iridescent column shrinks onto the "l" slot of a giant 3D "yoclip"
// wordmark while the remaining letters (y o c i p) rise from the dunes as
// chunky extruded pixel letters, staggered with a back ease; the dot over
// the "i" drops in and stays static. Beat 3 (146–180f): the camera flies
// into the "i" dot — it grows into a glowing portal (handed off to
// 02_kaleido, which continues the dive).
//
// Morph rule: GLB models have no opacity, so a "crossfade" would paint TWO
// models at once (ghosting). Every handoff is therefore strictly
// SEQUENTIAL — the old part scales to zero, then the new one pops in with
// a back ease; at 30fps the 3–4f gap reads as a morph, never as a double.
//
// Renderer notes: software scene3d has no z-buffer — all letters sit on a
// single z≈0 plane and never intersect. Meshes are single-color, so the
// column's iridescence is three stacked boxes (violet → magenta → cyan).
// Stars/sun are 2D containers painted behind the scene3d layer.

scene = {
  id: 'monolith',
  duration: 180,
  description: 'The hook caret grows into an iridescent column in a vivid sunset world; the column lands as the "l" of a giant 3D yoclip wordmark (letters rise from the dunes), then the camera dives into the static white dot over the "i".',
  voicePrompts: {
    en: 'A deep cinematic swell as the caret grows; playful plucks as each letter lands; a rising whoosh into the i-dot.',
    ru: 'Глубокий кинематографичный подъём; игривые плёки на каждую букву; нарастающий свист в точку над i.',
  },
  timeline: {
    label: yoclipT('monolith').timeline || 'Monolith',
    color: '#ec4899',
    lane: 'video',
  },
  render: function(frame) {
    var portrait = yoclipIsPortrait();

    // ---- Beat timings -----------------------------------------------------
    var grow = ease(frame, 2, 20, eo3);       // caret bar elongation
    var worldIn = ease(frame, 6, 22, eo3);    // off-white overlay fade-out
    var monoIn = ease(frame, 10, 26, eo3);    // 3D column scale-up
    var barOp = 1 - seg(frame, 16, 24);       // bar → 3D column handoff
    var morph = ease(frame, 30, 48, eio3);    // column → letter "l" slot
    // Column color → ink: short 8f window so the murky mid-lerp
    // (cyan→ink passes through dirty dark-teal) flashes for only ~2–3f.
    var inkT = ease(frame, 26, 34, eio3);

    // ---- Wordmark: the REAL yoclip logo in 3D -------------------------------
    // GLB parts extruded from branding/yoclip_logo.svg by
    // tools/build_logo_3d.py (dark-theme colors: white letters, gradient
    // bubble + i-dot). Anchors below come from the script's layout output.
    function hexLerp(a, b, t) {
      var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
      var r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t);
      var g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t);
      var bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
    }
    var groundY = -1.1;           // dune top level
    var LIFT = 0.12;              // flush geometry gets overpainted by the ground
    var logoY = groundY + 0.02;   // logo baseline planted on the dunes
    var L_X = 0.94;               // l-stem anchor (build_logo_3d layout)
    var DOT_X = 1.58;             // i-dot anchor (build_logo_3d layout)
    var DOT_Y = logoY + 3.28;     //   in scene coords (baseline-relative)
    var LOGO_CX = 0.0;            // visual center of the assembled wordmark —
                                  // measured from renders: the baked GLB
                                  // layout centers the mark at world x=0.

    // ---- Meshes ------------------------------------------------------------
    var meshes = [];
    // (No dune meshes — the landscape is flat 2D SVG ridges behind the 3D
    // content, see the ridge layers below. Only the column is software-3D.)

    // Skyscraper: six tapered segments that grow out of the ground and paint
    // themselves with the brand bubble gradient (violet at the base, blue at
    // the top). During the morph (30–48f) it slides onto the l-stem slot AND
    // reshapes into the stem's EXACT bounding box (from build_logo_3d.py
    // layout: stem bottom = 1.4, top = 3.5373, width = 0.342 in logo space,
    // x center = 0.9434) scaled by the swap settle (1.15) — so at frame 50
    // the column and the gradient GLB "l" occupy the same pixels and the
    // single-frame swap is invisible. The column never shrinks away: it IS
    // the "l".
    var L_BOT = 1.4;              // l-stem bottom in logo space (layout)
    var L_TOP = 3.5373;           // l-stem top in logo space (layout)
    var L_W = 0.342;              // l-stem width in logo space (layout)
    var SETTLE = 1.15;            // lgrad entry scale (matches glSc below)
    var colAlive = frame < 50 ? 1 : 0;
    var vs = Math.max(0.001, monoIn * lerp(1, (L_TOP - L_BOT) * SETTLE / 3.3, morph) * colAlive);
    var monoX = lerp(0, L_X, morph);
    // Base lifts from the dune to the stem bottom (scaled by the settle) so
    // the silhouette lands exactly where the GLB "l" starts.
    var baseY = lerp(groundY + LIFT, logoY + L_BOT * SETTLE, morph);
    var CARET = '#141414';
    var SEG_COLORS = ['#8b5cf6', '#7c5ef6', '#6366f1', '#5274f5', '#4582f6', '#3b82f6'];
    var SEG_W = [0.95, 0.93, 0.91, 0.89, 0.87, 0.85];
    var SEG_H = [0.7, 0.6, 0.55, 0.5, 0.5, 0.45];
    var cumH = 0;
    for (var si2 = 0; si2 < 12; si2++) {
      // 12 sub-segments (each source segment split in two with a lerped
      // color + width) — the gradient steps are twice as fine, so no hard
      // seams read. Tapered while solo, uniform stem width at the slot.
      var src = si2 >> 1;
      var nxt = Math.min(5, src + 1);
      var frac = (si2 % 2) * 0.5;
      var w12 = lerp(SEG_W[src], SEG_W[nxt], frac);
      var h12 = SEG_H[src] / 2;
      var wsi = Math.max(0.001, monoIn * lerp(w12, L_W * SETTLE, morph) * colAlive);
      meshes.push(meshXform(meshCube(w12, h12 * 1.1, 0.5), {
        color: hexLerp(CARET, hexLerp(SEG_COLORS[src], SEG_COLORS[nxt], frac), inkT),
        scale: [wsi / w12, vs, wsi / w12],
        translate: [monoX, baseY + (cumH + h12 / 2) * vs, 0],
      }));
      cumH += h12;
    }

    // ---- Logo assembly: the "l" is ONE continuous element ------------------
    // The column, the gradient "l" and the white "l" are the SAME object at
    // the SAME slot. Every handoff is a same-place, full-scale, single-frame
    // swap (plus a small settle bump), so on video it reads as one element
    // transforming — never two models at once, never a gap, never anything
    // flying in from the side:
    // 1) 30–48f  the column slides onto the l-stem slot.
    // 2) 50f     column → gradient "l" (swap + settle bump 50–58f).
    // 3) 66–77f  the Yo bubble swells as a blob pinned to that "l".
    // 4) 77f     the blob detaches — in the same instant the "l" turns WHITE
    //    in place (identical geometry, identical scale: a pure recolor with
    //    a pulse 77–89f, as if the color drained into the blob).
    // 5) 77–104f the blob slides left into its slot, liquid squash & stretch.
    // 6) 100–136f arc/i/p slide out of the "l"; the dot drops 128–142f.
    var logoModels = [];
    var PART_CX = { arc: -1.72, bubble: -1.06, l: 0.94, i: 1.58, idot: 1.58, p: 2.9 };

    // The gradient "l" (skyscraper colors): full scale from frame 50, with a
    // small landing settle so the swap reads as a morph, not a cut.
    var glSc = (frame >= 50 && frame < 77)
      ? 1 + 0.15 * (1 - eo3(seg(frame, 50, 58)))
      : 0;
    if (glSc > 0) {
      logoModels.push({
        modelId: 'lgrad',
        src: 'models/logo/lgrad.glb',
        unlit: true,
        position: [0, logoY, 0],
        scale: [glSc, glSc, glSc],
      });
    }

    // The DRIP: a droplet of color gathers ON THE TIP of the "l" stem,
    // swells there (~30% of the beat), then detaches and flies left into
    // the icon slot, growing to the full Yo bubble with liquid squash &
    // stretch. The pin is scale-aware: the bubble's center sits at
    // (1.0604 left, 2.2816 up) of its origin (build_logo_3d layout), so to
    // keep it exactly on the stem tip (x = L_X, y = 3.3) at ANY scale the
    // position compensates by the scaled offset. Mid-flight the blob also
    // bulges toward the camera (z) — no coplanar z-fighting with the stem.
    var drip = seg(frame, 66, 104);
    if (drip > 0) {
      var de = eio3(seg(drip, 0.3, 1));         // travel phase (starts at 30%)
      var dsc = lerp(0.05, 1, eio3(seg(drip, 0, 0.75)));
      var squash = Math.sin(de * Math.PI);      // mid-flight bulge
      // Pinned phase: world center = stem top (2.46) + half the scaled
      // bubble height - 0.15 overlap, so the droplet's bottom always dips
      // INTO the stem tip — attached at any scale. (Bubble center sits at
      // 1.0604 left / 2.2816 up of its origin, extents y 2.5114 — layout.)
      logoModels.push({
        modelId: 'bubble',
        src: 'models/logo/bubble.glb',
        unlit: true,
        position: [
          lerp(L_X + 1.0604 * dsc, 0, de),
          lerp(2.31 - 1.0256 * dsc, logoY, de),
          0.3 * squash,
        ],
        rotation: [0, 0, lerp(-8, 0, de)],
        scale: [dsc * (1 + 0.14 * squash), dsc * (1 - 0.11 * squash), dsc],
      });
    }

    function logoPart(id, start) {
      var p = seg(frame, start, start + 16);
      if (p <= 0) return;
      var e = eo3(p);
      var sc = Math.max(0.001, eoBack(p));
      var rise = (1 - e) * -0.5;
      var emergeX = (1 - e) * (L_X - PART_CX[id]);
      logoModels.push({
        modelId: id,
        src: 'models/logo/' + id + '.glb',
        unlit: true,
        position: [emergeX, logoY + rise, 0],
        scale: [sc, sc, sc],
      });
    }
    logoPart('arc', 100);  // slides out of the "l" once the blob has landed
    // The WHITE l: the same "l" recolored in place at frame 77 — the moment
    // the blob detaches. Identical geometry, identical slot, full scale; a
    // sine pulse sells the recolor as energy released into the blob.
    var wlSc = frame >= 77
      ? 1 + 0.1 * Math.sin(seg(frame, 77, 89) * Math.PI)
      : 0;
    if (wlSc > 0) {
      logoModels.push({
        modelId: 'l',
        src: 'models/logo/l.glb',
        unlit: true,
        position: [0, logoY, 0],
        scale: [wlSc, wlSc, wlSc],
      });
    }
    logoPart('i', 110);
    logoPart('p', 120);
    // The "i" dot: drops in from above after the letters land, bounces once
    // on the stem and stays STATIC (no pulsing) — its HDR-white center is
    // the portal the camera later dives into.
    var idotP = seg(frame, 128, 142);
    if (idotP > 0) {
      var drop = 1 - eo3(idotP);
      logoModels.push({
        modelId: 'idot',
        src: 'models/logo/idot.glb',
        unlit: true,
        position: [0, logoY + drop * 2.2, 0],
        scale: [1, 1, 1],
      });
    }

    // ---- Camera ------------------------------------------------------------
    // Frames the wordmark's visual center (LOGO_CX), not the world origin —
    // otherwise the assembled logo reads shifted right of screen center.
    var pull = ease(frame, 10, 120, eio3);
    var camX = lerp(0, LOGO_CX, pull);
    var camY = lerp(1.6, 2.2, pull);
    var camZ = lerp(5.5, 10.5, pull);
    var tgtX = lerp(0, LOGO_CX, pull), tgtY = lerp(0.6, 0.4, pull), tgtZ = 0;
    // Dive into the i-dot. The fly finishes early enough (172f) that the dot
    // is screen-centered before the portal glow fades in at ~172f — painting
    // the glow at screen center while the dot is still off to a side reads
    // as two separate objects.
    var fly = ease(frame, 146, 172, eio3);
    camX = lerp(camX, DOT_X, fly);
    camY = lerp(camY, DOT_Y, fly);
    camZ = lerp(camZ, 2.3, fly);
    tgtX = lerp(tgtX, DOT_X, fly);
    tgtY = lerp(tgtY, DOT_Y, fly);

    // ---- 2D sky, sun, stars -------------------------------------------------
    var layers = [
      // Vivid sunset sky: deep indigo → violet → hot pink → orange horizon;
      // below the horizon the gradient continues in dune lavender so the
      // ground's front edge never exposes a foreign-colored band.
      {
        type: 'container',
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#1e1b4b', '#7c3aed', '#ec4899', '#fb923c', '#f2defe', '#f2defe'],
          stops: [0.0, 0.42, 0.62, 0.72, 0.75, 1.0],
        },
      },
      // Low glowing sun over the horizon (core + halo + hot horizon band).
      {
        type: 'container',
        alignment: 'center',
        width: 1500,
        height: 620,
        offsetX: -380,
        offsetY: 260,
        opacity: worldIn,
        gradient: {
          type: 'radial',
          colors: ['#59fb923c', '#00fb923c'],
          stops: [0, 1],
        },
      },
      {
        type: 'container',
        alignment: 'center',
        width: 1000,
        height: 1000,
        offsetX: -380,
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
        offsetX: -380,
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
      {
        type: 'scene3d',
        meshes: meshes,
        camera: { position: [camX, camY, camZ], target: [tgtX, tgtY, tgtZ], fov: 50 },
        light: { direction: [-0.35, -0.6, 0.7] },
      },
      // The real logo in 3D (GLB parts) — GPU flame layer over the dunes.
      {
        type: 'scene3d',
        engine: 'flame',
        id: 'v2-logo',
        time: frame / 30,
        camera: { position: [camX, camY, camZ], target: [tgtX, tgtY, tgtZ], fov: 50 },
        light: { ambient: 1.7, diffuse: 1.4, position: [4, 6, 6] },
        models: logoModels,
      },
    ];

    // Twinkling stars in the upper sky band.
    for (var i = 0; i < 26; i++) {
      var sx = ((i * 137.5) % 1760) - 880;
      var sy = -(((i * 89.3) % 420) + 30);
      var tw = blink(frame + i * 7, 12 + (i % 5) * 4);
      layers.push({
        type: 'container',
        width: 2 + (i % 3),
        height: 2 + (i % 3),
        borderRadius: 999,
        alignment: 'center',
        offsetX: sx,
        offsetY: sy,
        opacity: (0.35 + 0.65 * tw) * worldIn,
        color: '#ffffff',
      });
    }

    // Off-white overlay crossfading out (the seamless white-world exit).
    layers.push({ type: 'container', color: '#f5f4f1', opacity: 1 - worldIn });

    // The caret bar: elongates to the column's on-screen footprint, then
    // dissolves into the 3D column.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: lerp(7, 170, grow),
      height: lerp(110, 690, grow),
      offsetY: lerp(0, -20, grow),
      opacity: barOp,
      color: '#141414',
    });

    // Beat 3: the i-dot glows into a portal (02_kaleido continues the dive).
    // The glow starts only after the fly has fully centered the dot (172f) —
    // an earlier start paints the white circle next to the dot instead of
    // on it.
    var glow = ease(frame, 172, 178, eo3);
    if (glow > 0) {
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 2 * lerp(30, 520, ease(frame, 172, 179, eio3)),
        height: 2 * lerp(30, 520, ease(frame, 172, 179, eio3)),
        opacity: glow,
        gradient: {
          type: 'radial',
          colors: ['#cc8b5cf6', '#008b5cf6'],
          stops: [0, 1],
        },
      });
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 2 * lerp(10, 170, ease(frame, 174, 179, eio3)),
        height: 2 * lerp(10, 170, ease(frame, 174, 179, eio3)),
        borderRadius: 999,
        opacity: glow,
        color: '#ffffff',
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      // No fade-out: the dive continues straight into 02_kaleido.
      children: layers,
    };
  },
};
