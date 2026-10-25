// 02 — Kaleido: the dive through the i-dot portal into a galaxy orbit.
//
// Beat 1 (0–10f): continues 01_monolith's camera dive — the glowing portal
// ring expands past the frame edges and dissolves fast. Beat 2 (14–150f):
// a REAL 3D orbit world. Three ELECTRIC rings — jagged polyline arcs that
// re-jitter every 3 frames, shimmer per segment and carry a bright
// traveling discharge — lie tilted in the XZ plane (software scene3d,
// per-frame meshes). Ten hologram panels (GLB ice-screens with glowing UI
// holograms, tools/build_panels_3d.py) ride ONE carousel: fixed slots on a
// single tilted oval, the whole carousel rotating slowly — so panels never
// intersect. Panels billboard toward the camera (flame engine, GPU depth).
// Beat 3 (150–180f): the core flashes white — a seamless handoff to
// 03_generate.
//
// Renderer notes: the lightning rings are per-frame mesh segments, so they
// live in a SOFTWARE scene3d layer; panels are GLB, so they live in a
// FLAME scene3d layer — both layers share the SAME camera object (as in
// 01_monolith). GLB models have no opacity — cards pop in via scale only.

scene = {
  id: 'kaleido',
  duration: 180,
  description: 'Portal dive into deep space: twinkling starfield + nebula, comet trails and sparkle dust, and a Gargantua-style black hole at the center (2D composite: void, photon ring, accretion band with Doppler beaming, lensed arcs); white-flash exit to the generate beat.',
  voicePrompts: {
    en: 'A swirling riser into a playful kaleidoscope groove; whooshes as objects pass; a bright flash at the exit.',
    ru: 'Закручивающийся райзер в игривый калейдоскоп-грув; свисты пролетающих объектов; яркая вспышка на выходе.',
  },
  timeline: {
    label: yoclipT('kaleido').timeline || 'Kaleido',
    color: '#d4a017',
    lane: 'video',
  },
  render: function(frame) {
    var portrait = yoclipIsPortrait();
    var k = portrait ? 0.56 : 1.0;   // global coordinate scale for portrait

    // Elements fade in right behind the dissolving portal ring.
    var worldIn = 0.35 + 0.65 * ease(frame, 0, 9, eo3);

    function ga(hex, a) {
      var ah = Math.round(a * 255).toString(16);
      if (ah.length < 2) ah = '0' + ah;
      return '#' + ah + hex.slice(1);
    }
    function frac(x) { return x - Math.floor(x); }

    var layers = [];

    // ---- Sky: the HDRI star sphere renders IN 3D (see the flame layer
    // below); 2D keeps only the deep-space base and a faint color haze to
    // tint it on-brand.
    layers.push({ type: 'container', color: '#0a0618' });
    var NEB = [
      { x: -520, y: -280, w: 980, h: 760, c: '#7c3aed', o: 0.30, ph: 0.0 },
      { x: 600, y: -180, w: 860, h: 660, c: '#ec4899', o: 0.18, ph: 1.7 },
      { x: 60, y: 420, w: 1080, h: 640, c: '#22d3ee', o: 0.14, ph: 3.1 },
      { x: -420, y: 330, w: 800, h: 600, c: '#8b5cf6', o: 0.22, ph: 4.4 },
    ];
    for (var ni = 0; ni < NEB.length; ni++) {
      var n = NEB[ni];
      layers.push({
        type: 'container',
        alignment: 'center',
        width: n.w * k,
        height: n.h * k,
        borderRadius: 999,
        offsetX: n.x * k + 18 * Math.sin(frame * 0.008 + n.ph),
        offsetY: n.y * k + 12 * Math.cos(frame * 0.006 + n.ph),
        opacity: worldIn,
        gradient: { type: 'radial', colors: [ga(n.c, n.o), ga(n.c, 0)], stops: [0, 1] },
      });
    }

    // ---- Starfield: twinkling dots + a few glowing beacon stars -----------
    var STAR_C = ['#ffffff', '#a5f3fc', '#fbcfe8', '#fde68a', '#ffffff', '#ffffff'];
    for (var si = 0; si < 150; si++) {
      var sx = ((si * 137.5) % 1860) - 930;
      var sy = ((si * 89.3) % 1020) - 510;
      var big = si % 11 === 0;
      var tw = blink(frame + si * 7, 14 + (si % 5) * 5);
      layers.push({
        type: 'container',
        alignment: 'center',
        width: (big ? 5 : 2 + (si % 3)) * k,
        height: (big ? 5 : 2 + (si % 3)) * k,
        borderRadius: 999,
        offsetX: sx * k,
        offsetY: sy * k,
        opacity: (big ? 0.55 + 0.45 * tw : 0.25 + 0.75 * tw) * worldIn,
        color: STAR_C[si % STAR_C.length],
      });
    }
    for (var bi2 = 0; bi2 < 7; bi2++) {
      var bx = ((bi2 * 311.7) % 1600) - 800;
      var by = ((bi2 * 197.3) % 860) - 430;
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 56 * k,
        height: 56 * k,
        offsetX: bx * k,
        offsetY: by * k,
        opacity: (0.5 + 0.4 * blink(frame + bi2 * 13, 26)) * worldIn,
        gradient: {
          type: 'radial',
          colors: [ga(STAR_C[bi2 % STAR_C.length], 0.8), ga(STAR_C[bi2 % STAR_C.length], 0)],
          stops: [0, 1],
        },
      });
    }

    // Galaxy halo behind the 3D world.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: 760 * k,
      height: 760 * k,
      borderRadius: 999,
      opacity: worldIn,
      gradient: { type: 'radial', colors: [ga('#8b5cf6', 0.30), ga('#8b5cf6', 0)], stops: [0, 1] },
    });

    // ---- Shared camera: the viewer stands INSIDE the ring of TVs -----------
    // ("I stand in the center, TVs surround me") — slightly above the core,
    // looking outward-down at the far side of the ring; the carousel's own
    // rotation cycles panels through the view. Near-side panels pass behind
    // the camera, so every visible panel shows its FRONT.
    var cam = {
      position: [0.15 * Math.sin(frame * 0.008), 5.0 * k, 7.6 * k],
      target: [0, -0.3, 0],
      fov: 50,
    };

    function hexLerp(a, b, t) {
      var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
      var r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t);
      var g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t);
      var bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
    }

    // ---- Flowing orbit rings (2D paths — smooth, anti-aliased) ---------------
    // Chunky 3D box segments read as broken dashes; a stroked path is a
    // clean luminous line. Each ring is a wavy ELLIPSE (ry = rx * tilt) with
    // 2–3 slow sine waves whose phase drifts — the line flows like the
    // reference. Glow = a wide, dim, blurred copy underneath.
    var TILT = 0.55;
    var RINGS = [
      { rx: 760, c: '#a78bfa', seed: 3, wob: 3, amp: 0.030, sp: -0.014 },
      { rx: 620, c: '#22d3ee', seed: 11, wob: 2, amp: 0.034, sp: 0.019 },
      { rx: 380, c: '#ec4899', seed: 27, wob: 3, amp: 0.040, sp: -0.024 },
      { rx: 240, c: '#fbbf24', seed: 41, wob: 2, amp: 0.046, sp: 0.030 },
    ];
    function ringPath(cx, cy, rx, ry, phase, wob, amp, steps) {
      var pts = [];
      for (var q = 0; q <= steps; q++) {
        var th = (q / steps) * 2 * Math.PI;
        var w = 1 + amp * Math.sin(wob * th + phase);
        pts.push((q === 0 ? 'M ' : 'L ') +
          (cx + rx * w * Math.cos(th)).toFixed(1) + ' ' +
          (cy + ry * w * Math.sin(th)).toFixed(1));
      }
      return pts.join(' ');
    }
    // Rings BEHIND the panels (the flame layer comes after).
    for (var ri = 0; ri < RINGS.length; ri++) {
      var R = RINGS[ri];
      var ph = frame * R.sp * 30 + R.seed;
      // Sparkle dust along the ring — slow shimmer pulse, no hard blinking
      // (the on/off blink read as jitter; comets removed per review —
      // the head+trail dots moved like tadpoles).
      for (var di = 0; di < 12; di++) {
        var da = frac(Math.sin(di * 91.7 + R.seed * 13.1) * 9182.17) * Math.PI * 2;
        var dw = 1 + R.amp * Math.sin(R.wob * da + ph);
        var dsz = 1.5 + 2 * (0.5 + 0.5 * Math.sin(frame * 0.4 + di * 1.7 + R.seed));
        layers.push({
          type: 'container',
          alignment: 'center',
          width: dsz * k,
          height: dsz * k,
          borderRadius: 999,
          offsetX: R.rx * dw * Math.cos(da) * k,
          offsetY: (R.rx * TILT * dw * Math.sin(da) - 20) * k,
          opacity: worldIn * (0.25 + 0.55 * shimmer(frame + di * 9, 46)),
          color: '#ffffff',
        });
      }
    }

    // ---- GARGANTUA core: a black hole as a 2D composite ----------------------
    // (No GLSL here — the Schwarzschild look is approximated by layered
    // vector parts.) Layered elliptical bands, a true black horizon and a
    // hot front rim create the lensed silhouette without stroked path
    // segments (which read as spokes when normalized independently).
    var CY = -30 * k;                  // void center offset from screen center
    var VOID_R = 118 * k;
    var DISK_RX = 430 * k, DISK_RY = 118 * k;

    function cap01(x) { return Math.max(0, Math.min(1, x)); }
    var swirl = frame * 0.02;
    function diskBand(rx, ry, bw, color, op, blur_, dy) {
      var layer = {
        type: 'container', alignment: 'center',
        width: 2 * rx * k, height: 2 * ry * k,
        offsetY: CY + (dy || 0) * k,
        borderRadius: 999, borderColor: color, borderWidth: bw * k,
        opacity: cap01(worldIn * op),
      };
      if (blur_) layer.blur = blur_;
      return layer;
    }
    // Broad atmospheric bands: nested, blurred ellipses make a continuous
    // accretion disk rather than a bundle of radial line segments.
    layers.push(diskBand(460, 128, 30, '#b35c14', 0.26, 20, 0));
    layers.push(diskBand(420, 112, 34, '#ff9d3c', 0.42, 13, 0));
    layers.push(diskBand(372, 96, 19, '#ffd27a', 0.72, 7, 0));
    layers.push(diskBand(308, 80, 7, '#fff3d6', 0.96, 2, 0));
    layers.push({
      type: 'container', alignment: 'center',
      width: 790 * k, height: 34 * k, offsetY: CY,
      borderRadius: 999, opacity: cap01(worldIn * 0.84), blur: 3,
      gradient: {
        type: 'linear', begin: 'centerLeft', end: 'centerRight',
        colors: ['#00ff9d3c', '#ccff9d3c', '#fff7e6', '#b3ffd27a', '#00ff9d3c'],
        stops: [0, 0.22, 0.47, 0.75, 1],
      },
    });
    // Receding-side shadow and the tall relativistic halo.
    layers.push({
      type: 'container', alignment: 'center',
      width: 620 * k, height: 400 * k,
      offsetX: -Math.cos(swirl) * DISK_RX * 0.48,
      offsetY: CY - Math.sin(swirl) * DISK_RY * 0.42,
      opacity: cap01(worldIn * 0.52), blur: 44, color: '#050208', borderRadius: 999,
    });
    layers.push({
      type: 'container', alignment: 'center',
      width: 3.28 * VOID_R, height: 3.28 * VOID_R, offsetY: CY,
      borderRadius: 999, borderColor: '#80ffd27a', borderWidth: 5 * k,
      opacity: cap01(worldIn * 0.52), blur: 7,
    });
    // Doppler glow sits behind the horizon so the void always stays black.
    layers.push({
      type: 'container', alignment: 'center',
      width: 420 * k, height: 420 * k, borderRadius: 999,
      offsetX: Math.cos(swirl) * DISK_RX * 0.62,
      offsetY: CY + Math.sin(swirl) * DISK_RY * 0.62,
      opacity: cap01(worldIn * 0.52),
      gradient: { type: 'radial', colors: ['#b3fff3e0', '#00ffd27a'] },
    });
    // Pure black event horizon, then the razor-thin photon sphere.
    layers.push({
      type: 'container', alignment: 'center',
      width: 2 * VOID_R, height: 2 * VOID_R, offsetY: CY,
      borderRadius: 999, opacity: worldIn, color: '#000000',
    });
    layers.push({
      type: 'container', alignment: 'center',
      width: 2.12 * VOID_R, height: 2.12 * VOID_R, offsetY: CY,
      borderRadius: 999, borderColor: '#ffe9b8', borderWidth: 11 * k,
      opacity: cap01(worldIn * 0.72), blur: 8,
    });
    layers.push({
      type: 'container', alignment: 'center',
      width: 2.10 * VOID_R, height: 2.10 * VOID_R, offsetY: CY,
      borderRadius: 999, borderColor: '#fff3d6', borderWidth: 3 * k,
      opacity: worldIn,
    });
    // Hot front rim crossing the lower horizon; transparent ends and a
    // slim white core keep it photographic rather than cartoonish.
    layers.push({
      type: 'container', alignment: 'center',
      width: 680 * k, height: 64 * k, offsetY: CY + 68 * k,
      borderRadius: 999, opacity: cap01(worldIn * 0.68),
      gradient: { type: 'radial', colors: ['#a6ffd27a', '#00ffd27a'] },
    });
    layers.push({
      type: 'container', alignment: 'center',
      width: 650 * k, height: 20 * k, offsetY: CY + 72 * k,
      borderRadius: 999, opacity: cap01(worldIn * 0.96), blur: 2,
      gradient: {
        type: 'linear', begin: 'centerLeft', end: 'centerRight',
        colors: ['#00ff9d3c', '#d9ff9d3c', '#fff7e6', '#ccffd27a', '#00ff9d3c'],
        stops: [0, 0.24, 0.46, 0.74, 1],
      },
    });
    // Small hot grains travel with the disk and add scale to the glow.
    for (var dg = 0; dg < 22; dg++) {
      var da2 = dg * 2.399 + frame * 0.006;
      var dr = 300 + (dg % 5) * 31;
      layers.push({
        type: 'container', alignment: 'center',
        width: (2 + dg % 3) * k, height: (2 + dg % 3) * k,
        borderRadius: 999,
        offsetX: Math.cos(da2) * dr * k,
        offsetY: CY + Math.sin(da2) * dr * 0.27 * k,
        color: dg % 4 === 0 ? '#ffffff' : '#ffd27a',
        opacity: cap01(worldIn * (0.3 + 0.65 * shimmer(frame + dg * 5, 30))),
      });
    }

    // Beat 1: the portal ring handed off from 01_monolith expands past the
    // frame and dissolves (fast — a slow dissolve reads as a feeble ring).
    var ringOut = seg(frame, 0, 8);
    if (ringOut < 1) {
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 340,
        height: 340,
        borderRadius: 999,
        scale: 1 + 8 * eio3(ringOut),
        opacity: 1 - ringOut,
        borderColor: '#8b5cf6',
        borderWidth: 14,
      });
      layers.push({
        type: 'container',
        color: '#ffffff',
        opacity: 0.65 * (1 - seg(frame, 0, 8)),
      });
    }

    // Beat 3: white flash — the core blows out to a seamless white handoff.
    var flash = ease(frame, 150, 172, eio3);
    if (flash > 0) {
      layers.push({
        type: 'container',
        alignment: 'center',
        width: Math.max(1, lerp(60, 2800, flash)),
        height: Math.max(1, lerp(60, 2800, flash)),
        borderRadius: 999,
        color: '#ffffff',
      });
    }
    layers.push({ type: 'container', color: '#ffffff', opacity: seg(frame, 170, 177) });

    return {
      type: 'stack',
      fit: 'expand',
      // Slow push-in across the orbit beat; no fades at either end (the
      // portal ring handles the entrance, the white flash the exit).
      scale: lerp(1.0, 1.08, ease(frame, 20, 148, eio3)),
      children: layers,
    };
  },
};
