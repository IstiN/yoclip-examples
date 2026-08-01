// 12c — Globe: renders lighting up all over the planet.
//
// Adapted from the "global radio" reference: one big 3D-looking globe with
// glowing station dots. All 2D fake-3D — a shaded sphere disc + latitude
// rings + dots on a rotating sphere, with the BACK dots painted before the
// disc and the FRONT dots after it (fake occlusion, no renderer projection
// needed). Random dots fire expanding pulse rings — new renders coming
// online worldwide.
//
// Renderer notes: dot math is plain sphere geometry rotated around Y;
// "behind" is just z < 0 after rotation. Clamp opacities to [0,1].

scene = {
  id: 'globe',
  duration: 150,
  description: 'Planet hero: a big shaded globe with latitude rings, glowing render-dots co-rotating on its surface (back dots occluded by the disc, front dots bright), expanding pulse rings as new renders light up worldwide; caption lands. Holds.',
  voicePrompts: {
    en: 'A warm global pulse; soft pings as new dots light up.',
    ru: 'Тёплый глобальный пульс; мягкие пинги — загораются новые точки.',
  },
  timeline: {
    label: yoclipT('globe').timeline || 'Globe',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var portrait = yoclipIsPortrait();
    var k = portrait ? 0.62 : 1.0;
    var font = yoclipFont();

    function cap01(x) { return Math.max(0, Math.min(1, x)); }
    function ga(hex, a) {
      var ah = Math.round(a * 255).toString(16);
      if (ah.length < 2) ah = '0' + ah;
      return '#' + ah + hex.slice(1);
    }

    var worldIn = ease(frame, 0, 24, eo3);
    var labelIn = ease(frame, 60, 88, eo3);

    var CX = 960, CY = 520;
    var R = 330 * k;
    var rot = frame * 0.012;               // globe spin, rad

    // ---- Dots on the sphere ---------------------------------------------------
    var DOT_C = ['#22d3ee', '#fbbf24', '#a78bfa', '#34d399', '#ec4899', '#ffffff'];
    var ND = 26;
    var frontDots = [];
    var backDots = [];
    for (var i = 0; i < ND; i++) {
      var lat = (-62 + (i * 41) % 124) / 57.2958;
      var lon = i * 2.39996 + rot;
      var z = Math.cos(lat) * Math.sin(lon);
      var d = {
        x: CX + R * Math.cos(lat) * Math.cos(lon),
        y: CY + R * Math.sin(lat) * 0.96,
        z: z,
        c: DOT_C[i % DOT_C.length],
        i: i,
      };
      (z < 0 ? backDots : frontDots).push(d);
    }

    function dotLayer(d, front) {
      var tw = 0.7 + 0.3 * blink(frame + d.i * 9, 20 + (d.i % 4) * 6);
      var sz = (front ? 9 : 6) * k;
      return {
        type: 'container',
        alignment: 'center',
        width: sz * 3,
        height: sz * 3,
        offsetX: d.x - 960,
        offsetY: d.y - 540,
        opacity: cap01(worldIn * tw * (front ? 1 : 0.35)),
        gradient: { type: 'radial', colors: [ga(d.c, 0.9), ga(d.c, 0)], stops: [0, 1] },
      };
    }

    var layers = [
      // Deep space backdrop.
      {
        type: 'container',
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#0b1226', '#04060f'],
        },
      },
      // Atmosphere halo.
      {
        type: 'container',
        alignment: 'center',
        width: R * 2.6,
        height: R * 2.6,
        offsetY: CY - 540,
        opacity: cap01(worldIn * 0.6),
        gradient: { type: 'radial', colors: [ga('#3b82f6', 0.22), ga('#3b82f6', 0)], stops: [0.55, 1] },
      },
    ];

    // Back dots (behind the disc).
    for (var b = 0; b < backDots.length; b++) layers.push(dotLayer(backDots[b], false));

    // The sphere disc: ocean gradient + a terminator shadow for volume.
    layers.push({
      type: 'container',
      alignment: 'center',
      width: 2 * R,
      height: 2 * R,
      offsetY: CY - 540,
      borderRadius: 999,
      opacity: cap01(worldIn * 0.96),
      gradient: {
        type: 'radial',
        center: 'center',
        radius: 0.72,
        colors: ['#1e50c8', '#102a6e', '#081536'],
        stops: [0, 0.62, 1],
      },
    });
    // Latitude rings (thin ellipses = the sphere's tilt).
    for (var lr = -2; lr <= 2; lr++) {
      var latY = CY + lr * R * 0.36;
      var latR = R * Math.sqrt(Math.max(0.05, 1 - (lr * 0.36) * (lr * 0.36)));
      layers.push({
        type: 'container',
        alignment: 'center',
        width: 2 * latR,
        height: 2 * latR * 0.22,
        offsetY: latY - 540,
        borderRadius: 999,
        borderColor: '#3d6fd8',
        borderWidth: 1,
        opacity: cap01(worldIn * 0.22),
      });
    }

    // Front dots.
    for (var f = 0; f < frontDots.length; f++) layers.push(dotLayer(frontDots[f], true));

    // Pulse rings: new renders lighting up (cycles through front dots).
    for (var pr = 0; pr < 3; pr++) {
      var cyc = 42;
      var ct = (frame + pr * 14) % cyc;
      var dot = frontDots[(Math.floor((frame + pr * 14) / cyc) * 7 + pr * 3) % Math.max(1, frontDots.length)];
      if (dot) {
        layers.push({
          type: 'container',
          alignment: 'center',
          width: (10 + 90 * seg(ct, 0, cyc)) * k,
          height: (10 + 90 * seg(ct, 0, cyc)) * k,
          borderRadius: 999,
          borderColor: '#7dd3fc',
          borderWidth: 2,
          offsetX: dot.x - 960,
          offsetY: dot.y - 540,
          opacity: cap01((1 - seg(ct, 0, cyc)) * 0.7 * worldIn),
        });
      }
    }

    // Platform chips: staggered pops floating around the globe.
    var CHIPS = ['CLI', 'macOS', 'Linux', 'Windows', 'iOS', 'Android', 'Web'];
    for (var ch = 0; ch < CHIPS.length; ch++) {
      var ang = -Math.PI * 0.82 + ch * (Math.PI * 1.64 / (CHIPS.length - 1));
      var chipIn = ease(frame, 30 + ch * 8, 44 + ch * 8, eoBack);
      var chipX = Math.cos(ang) * (R + 150 * k);
      var chipY = Math.sin(ang) * (R + 150 * k) * 0.82 + 12 * Math.sin(frame * 0.05 + ch * 1.3);
      layers.push({
        type: 'container',
        alignment: 'center',
        offsetX: chipX,
        offsetY: chipY + (CY - 540),
        scale: Math.max(0.001, chipIn),
        padding: 10,
        color: '#1a2138',
        borderColor: '#3d5a9e',
        borderWidth: 1,
        borderRadius: 999,
        shadow: { color: '#59000000', blur: 18, offsetX: 0, offsetY: 6 },
        child: {
          type: 'text',
          text: CHIPS[ch],
          style: { fontSize: 18 * k, color: '#c9d8ff', fontFamily: font, fontWeight: 600 },
        },
      });
    }

    // Caption.
    layers.push({
      type: 'text',
      alignment: 'bottomCenter',
      offsetY: -54 * k,
      text: yoclipT('globe').caption || 'Rendered everywhere.',
      opacity: cap01(labelIn),
      style: {
        fontSize: 24 * k,
        color: '#93a7d8',
        fontFamily: font,
        letterSpacing: 6,
      },
    });

    return {
      type: 'stack',
      fit: 'expand',
      opacity: fadeOut(frame, 138, 12),
      children: layers,
    };
  },
};
