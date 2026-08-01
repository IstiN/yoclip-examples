// 12b — Star map: the yoclip feature set as a glowing constellation.
//
// Adapted from the "citation star map" reference: a full-screen hero of
// glowing jewel nodes spread on an ellipsoid, faint gold edges to the
// nearest neighbours, slow auto-rotate, and a fly-in entrance. Feature
// hubs (Render / Scenes / Studio / Golden tests / CLI) are the biggest
// stars and get labels. All 2D: fake-3D via manual Y-rotation + weak
// perspective (no renderer projection needed), so nodes can be soft
// radial-gradient glows instead of cubes.
//
// Renderer notes: edges are one-point path widgets; depth dimming is just
// per-node opacity/scale from the rotated z. Clamp opacities to [0,1].

scene = {
  id: 'starmap',
  duration: 150,
  description: 'Constellation hero: ~40 glowing jewel nodes on an ellipsoid web (faint gold edges to nearest neighbours) auto-rotate in fake-3D; the 5 biggest hubs are labeled Render / Scenes / Studio / Golden tests / CLI; fly-in zoom entrance, holds.',
  voicePrompts: {
    en: 'A calm cosmic pad with soft chimes as the constellation rotates.',
    ru: 'Спокойный космический пад, мягкие перезвоны — созвездие вращается.',
  },
  timeline: {
    label: yoclipT('starmap').timeline || 'Star map',
    color: '#fbbf24',
    lane: 'video',
  },
  render: function(frame) {
    var portrait = yoclipIsPortrait();
    var k = portrait ? 0.6 : 1.0;
    var font = yoclipFont();

    function cap01(x) { return Math.max(0, Math.min(1, x)); }
    function ga(hex, a) {
      var ah = Math.round(a * 255).toString(16);
      if (ah.length < 2) ah = '0' + ah;
      return '#' + ah + hex.slice(1);
    }

    var flyIn = ease(frame, 0, 40, eo3);          // entrance zoom + fade
    var labelIn = ease(frame, 60, 90, eo3);

    // ---- Nodes on an ellipsoid (golden-angle spread) -------------------------
    var JEWEL = ['#22d3ee', '#a78bfa', '#ec4899', '#fbbf24', '#34d399', '#7dd3fc'];
    var NN = 42;
    var RX = 660 * k, RY = 340 * k, RZ = 460 * k;
    var rot = frame * 0.008 + (1 - flyIn) * 0.8;   // slow autoRotate
    var zoom = lerp(0.55, 1.0, flyIn);

    var pts = [];
    for (var i = 0; i < NN; i++) {
      var yy = 1 - 2 * (i + 0.5) / NN;
      var rr = Math.sqrt(Math.max(0, 1 - yy * yy));
      var th = i * 2.39996 + rot;
      var x3 = RX * rr * Math.cos(th);
      var z3 = RZ * rr * Math.sin(th);
      var y3 = RY * yy;
      var sc = zoom / (1 + z3 * 0.0011);           // weak perspective
      pts.push({
        x: 960 + x3 * sc,
        y: 540 + y3 * sc,
        z: z3,
        sc: sc,
        deg: 0.5 + 0.5 * ((i * 73) % 10) / 10,     // pseudo degree size
        c: JEWEL[i % JEWEL.length],
      });
    }

    var layers = [
      // Deep space.
      {
        type: 'container',
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#0d0a1e', '#05030c'],
        },
      },
      {
        type: 'container',
        alignment: 'center',
        width: 1200 * k,
        height: 800 * k,
        offsetY: -100 * k,
        opacity: 0.5,
        gradient: { type: 'radial', colors: [ga('#7c3aed', 0.14), ga('#7c3aed', 0)], stops: [0, 1] },
      },
    ];

    // ---- Faint gold edges (to the 2 nearest neighbours, each pair once) ------
    for (var e = 0; e < NN; e++) {
      var d1 = 1e18, d2 = 1e18, i1 = -1, i2 = -1;
      for (var o = 0; o < NN; o++) {
        if (o === e) continue;
        var dx = pts[e].x - pts[o].x, dy = pts[e].y - pts[o].y;
        var dd = dx * dx + dy * dy;
        if (dd < d1) { d2 = d1; i2 = i1; d1 = dd; i1 = o; }
        else if (dd < d2) { d2 = dd; i2 = o; }
      }
      var links = e % 3 === 0 ? [i1, i2] : [i1];
      for (var l = 0; l < links.length; l++) {
        var b = links[l];
        if (b < 0 || b < e) continue;
        var depth = (pts[e].sc + pts[b].sc) * 0.5;
        layers.push({
          type: 'container',
          width: 1920,
          height: 1080,
          opacity: cap01(flyIn * 0.4 * depth),
          child: {
            type: 'path',
            path: 'M ' + pts[e].x.toFixed(1) + ' ' + pts[e].y.toFixed(1) +
                  ' L ' + pts[b].x.toFixed(1) + ' ' + pts[b].y.toFixed(1),
            progress: 1,
            color: '#b3862e',
            strokeWidth: 1.5,
            width: 1920,
            height: 1080,
            alignment: 'center',
          },
        });
      }
    }

    // ---- Nodes: soft glow + hot core ------------------------------------------
    for (var n = 0; n < NN; n++) {
      var p = pts[n];
      var tw = 0.82 + 0.18 * Math.sin(frame * 0.06 + n * 1.7);
      var size = (10 + 26 * p.deg) * p.sc * k;
      layers.push({
        type: 'container',
        alignment: 'center',
        width: size * 3,
        height: size * 3,
        offsetX: p.x - 960,
        offsetY: p.y - 540,
        opacity: cap01(flyIn * tw * p.sc),
        gradient: { type: 'radial', colors: [ga(p.c, 0.85), ga(p.c, 0)], stops: [0, 1] },
      });
      layers.push({
        type: 'container',
        alignment: 'center',
        width: Math.max(2, size * 0.32),
        height: Math.max(2, size * 0.32),
        borderRadius: 999,
        offsetX: p.x - 960,
        offsetY: p.y - 540,
        opacity: cap01(flyIn * tw),
        color: '#ffffff',
      });
    }

    // ---- Feature hub labels ----------------------------------------------------
    var HUBS = [
      { i: 3, label: 'Render' },
      { i: 7, label: '3D GPU' },
      { i: 9, label: 'Scenes' },
      { i: 12, label: 'Audio' },
      { i: 15, label: 'Studio' },
      { i: 18, label: 'Timeline' },
      { i: 22, label: 'Golden tests' },
      { i: 25, label: 'Variants' },
      { i: 28, label: 'Shorts' },
      { i: 31, label: 'CLI' },
      { i: 34, label: 'Effects' },
      { i: 38, label: 'Locales' },
      { i: 41, label: 'Themes' },
    ];
    for (var h = 0; h < HUBS.length; h++) {
      var hp = pts[HUBS[h].i];
      layers.push({
        type: 'text',
        alignment: 'center',
        offsetX: hp.x - 960 + 16,
        offsetY: hp.y - 540 - 26,
        text: HUBS[h].label,
        opacity: cap01(labelIn * hp.sc),
        style: {
          fontSize: 20 * k,
          color: '#e8e4f8',
          fontFamily: font,
          fontWeight: 600,
          letterSpacing: 2,
        },
      });
    }

    // Caption chip.
    layers.push({
      type: 'text',
      alignment: 'bottomCenter',
      offsetY: -54 * k,
      text: yoclipT('starmap').caption || 'Every feature, one constellation.',
      opacity: cap01(labelIn),
      style: {
        fontSize: 24 * k,
        color: '#9d94c4',
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
