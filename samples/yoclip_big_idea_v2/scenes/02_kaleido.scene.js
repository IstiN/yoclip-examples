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
    var worldIn = ease(frame, 2, 14, eo3);

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
    // vector parts.) Order matters: disk glow → back-half disk → lensed arcs
    // → the void → photon ring → bright front-half disk with Doppler
    // beaming (one side much hotter) → boost glow. Everything breathes:
    // the brightness pattern swirls, radii jitter (turbulence). All paths
    // live in a full-frame 1920x1080 box (the path widget clips to its own
    // bounds), coordinates are screen-space.
    var CY = -30 * k;                  // void center offset from screen center
    var VOID_R = 118 * k;
    var DISK_RX = 430 * k, DISK_RY = 118 * k;

    function arcPath(cx, cy, rx, ry, a0, a1, steps) {
      var pts = [];
      for (var q = 0; q <= steps; q++) {
        var th = a0 + (a1 - a0) * (q / steps);
        pts.push((q === 0 ? 'M ' : 'L ') +
          (cx + rx * Math.cos(th)).toFixed(1) + ' ' +
          (cy + ry * Math.sin(th)).toFixed(1));
      }
      return pts.join(' ');
    }
    function gcol(t) {           // disk temperature: white → gold → orange → amber
      if (t < 0.35) return hexLerp('#fff7e6', '#ffd27a', t / 0.35);
      if (t < 0.7) return hexLerp('#ffd27a', '#ff9d3c', (t - 0.35) / 0.35);
      return hexLerp('#ff9d3c', '#7a3a08', (t - 0.7) / 0.3);
    }
    function cap01(x) { return Math.max(0, Math.min(1, x)); }
    function pathLayer(path, color, width_, opacity, blur_) {
      var layer = {
        type: 'container',
        width: 1920,
        height: 1080,
        opacity: opacity,
        child: {
          type: 'path',
          path: path,
          progress: 1,
          color: color,
          strokeWidth: width_,
          width: 1920,
          height: 1080,
          alignment: 'center',
        },
      };
      if (blur_) layer.blur = blur_;
      return layer;
    }

    var SEGS = 28;
    var swirl = frame * 0.02;            // slow drift of the bright side
    // Pass 0: the accretion band — 3 thick blurred ellipse rings (a real
    // glowing band, not strands), a dark mask dimming the far side, and a
    // hot fireball on the approaching side (Doppler beaming).
    var BANDS = [
      { rx: 300, ry: 82, bw: 9, c: '#fff3d6', o: 0.95 },
      { rx: 380, ry: 100, bw: 30, c: '#ffd27a', o: 0.55 },
      { rx: 415, ry: 110, bw: 22, c: '#ff9d3c', o: 0.5 },
      { rx: 450, ry: 122, bw: 14, c: '#b35c14', o: 0.45 },
    ];
    for (var bd = 0; bd < BANDS.length; bd++) {
      var B = BANDS[bd];
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 2 * B.rx * k,
        height: 2 * B.ry * k,
        offsetY: CY,
        borderRadius: 999,
        borderColor: B.c,
        borderWidth: B.bw * k,
        opacity: cap01(worldIn * B.o),
        blur: 10,
      });
    }
    // Dim-side mask: a soft black blob swallowing the receding half.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: 620 * k,
      height: 400 * k,
      offsetX: -Math.cos(swirl) * DISK_RX * 0.5,
      offsetY: CY - Math.sin(swirl) * DISK_RY * 0.5,
      opacity: cap01(worldIn * 0.55),
      blur: 40,
      color: '#050208',
    });

    // Pass 1: crisp BACK half (behind the void).
    for (var b2 = 0; b2 < SEGS / 2; b2++) {
      var bt0 = Math.PI + (b2 / (SEGS / 2)) * Math.PI;
      var bt1 = Math.PI + ((b2 + 1) / (SEGS / 2)) * Math.PI;
      var btm = (bt0 + bt1) / 2;
      var bb = 0.35 + 0.65 * Math.cos(btm - swirl);
      layers.push(pathLayer(
        arcPath(960, 540 + CY, DISK_RX, DISK_RY, bt0, bt1, 4),
        gcol(b2 / (SEGS / 2)), 5 * k, cap01(worldIn * Math.max(0, bb) * 0.7)));
    }
    // Lensed arcs: the disk's far side bent over and under the horizon.
    for (var la = 0; la < 2; la++) {
      var flip = la === 0 ? -1 : 1;
      layers.push(pathLayer(
        arcPath(960, 540 + CY + flip * VOID_R * 0.96, VOID_R * 1.55, VOID_R * 0.45, Math.PI * 1.06, Math.PI * 1.94, 24),
        '#ffe9c0', 6 * k, cap01(worldIn * (0.7 + 0.15 * Math.sin(frame * 0.2 + la * 2))), 4));
    }
    // The void: pure black horizon.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: 2 * VOID_R,
      height: 2 * VOID_R,
      offsetY: CY,
      borderRadius: 999,
      opacity: worldIn,
      color: '#000000',
    });
    // Photon ring: crisp white-gold circle hugging the horizon + glow.
    layers.push(pathLayer(
      arcPath(960, 540 + CY, VOID_R * 1.05, VOID_R * 1.05, 0, 2 * Math.PI, 64),
      '#ffe9b8', 10 * k, cap01(worldIn * 0.9), 5));
    layers.push(pathLayer(
      arcPath(960, 540 + CY, VOID_R * 1.05, VOID_R * 1.05, 0, 2 * Math.PI, 64),
      '#fff3d6', 3 * k, cap01(worldIn)));
    // Pass 2: crisp FRONT half with Doppler beaming (the swirl side burns).
    for (var f = 0; f < SEGS / 2; f++) {
      var ft0 = (f / (SEGS / 2)) * Math.PI;
      var ft1 = ((f + 1) / (SEGS / 2)) * Math.PI;
      var ftm = (ft0 + ft1) / 2;
      var fb = 0.35 + 0.65 * Math.cos(ftm - swirl) + 0.1 * Math.sin(frame * 0.33 + f * 2.1);
      layers.push(pathLayer(
        arcPath(960, 540 + CY, DISK_RX * (1 + 0.05 * Math.sin(f * 2.3 + frame * 0.1)), DISK_RY, ft0, ft1, 4),
        gcol(f / (SEGS / 2)), 6 * k, cap01(worldIn * Math.max(0, fb) * 1.0)));
    }
    // Doppler boost: a soft white fireball on the approaching side.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: 300 * k,
      height: 300 * k,
      width: 420 * k,
      height: 420 * k,
      offsetX: Math.cos(swirl) * DISK_RX * 0.62,
      offsetY: CY + Math.sin(swirl) * DISK_RY * 0.62,
      opacity: cap01(worldIn * 0.6),
      gradient: { type: 'radial', colors: ['#b3fff3e0', '#00ffd27a'], stops: [0, 1] },
    });

    // Beat 1: the portal ring handed off from 01_monolith expands past the
    // frame and dissolves (fast — a slow dissolve reads as a feeble ring).
    var ringOut = seg(frame, 0, 10);
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
        opacity: 0.85 * (1 - seg(frame, 0, 10)),
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
