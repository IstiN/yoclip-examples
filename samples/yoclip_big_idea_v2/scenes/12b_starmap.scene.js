// 12b — Star map: the yoclip feature set as a precise orbital system.
// Crisp vector nodes, elliptical tracks and a calm brand hub replace the
// old blur-heavy point cloud and its normalization-broken path spokes.

scene = {
  id: 'starmap',
  duration: 150,
  slides: [73],
  description: 'A premium orbital system map: the yoclip hub at center, eight crisp feature nodes on luminous elliptical tracks, subtle connectors and traveling render pulses; staggered entrances and a slow drift.',
  voicePrompts: {
    en: 'A calm cosmic pad with soft chimes as the system assembles.',
    ru: 'Спокойный космический пад и мягкие перезвоны по мере сборки системы.',
  },
  timeline: {
    label: yoclipT('starmap').timeline || 'Star map',
    color: '#fbbf24',
    lane: 'video',
  },
  render: function(frame) {
    var portrait = yoclipIsPortrait();
    var k = portrait ? 0.60 : 1.0;
    var font = yoclipFont();
    var outro = fadeOut(frame, 140, 10);
    var worldIn = ease(frame, 0, 18, eo3);

    function cap01(x) { return Math.max(0, Math.min(1, x)); }
    function ga(hex, a) {
      var ah = Math.round(a * 255).toString(16);
      if (ah.length < 2) ah = '0' + ah;
      return '#' + ah + hex.slice(1);
    }

    var layers = [
      {
        type: 'container',
        gradient: {
          type: 'linear', begin: 'topCenter', end: 'bottomCenter',
          colors: ['#0d0a20', '#05060f'],
        },
      },
      {
        type: 'container', alignment: 'center', offsetY: -20 * k,
        width: 700 * k, height: 700 * k, borderRadius: 999,
        opacity: 0.65 * worldIn, blur: 36,
        gradient: { type: 'radial', colors: ['#407c3aed', '#007c3aed'] },
      },
      {
        type: 'container', alignment: 'center', offsetY: 90 * k,
        width: 980 * k, height: 360 * k, borderRadius: 999,
        opacity: 0.32 * worldIn, blur: 50,
        gradient: { type: 'radial', colors: ['#3322d3ee', '#0022d3ee'] },
      },
    ];

    // Deterministic star field: tiny crisp points, not large blurred comets.
    for (var s = 0; s < 100; s++) {
      var sx = ((s * 149.3) % 1840) - 920;
      var sy = ((s * 83.7) % 1000) - 500;
      var ss = s % 13 === 0 ? 3 : 2;
      layers.push({
        type: 'container', alignment: 'center',
        width: ss * k, height: ss * k, borderRadius: 999,
        offsetX: sx * k, offsetY: sy * k,
        color: s % 5 === 0 ? '#7dd3fc' : '#ffffff',
        opacity: (0.18 + 0.52 * shimmer(frame + s * 5, 44)) * worldIn,
      });
    }

    layers.push({
      type: 'text', alignment: 'topCenter', offsetY: 44 * k,
      text: 'YOCLIP  /  FEATURE CONSTELLATION', opacity: worldIn,
      style: { fontSize: 14 * k, color: '#7dd3fc', fontFamily: font, fontWeight: 700, letterSpacing: 4 * k },
    });

    // Elliptical tracks establish a deliberate, readable geometry.
    var tracks = [
      { w: 1320, h: 680, c: '#337c3aed', bw: 1.4, r: -7 },
      { w: 1000, h: 500, c: '#4022d3ee', bw: 1.2, r: 10 },
      { w: 590, h: 290, c: '#38a78bfa', bw: 1.2, r: -12 },
    ];
    for (var tr = 0; tr < tracks.length; tr++) {
      layers.push({
        type: 'container', alignment: 'center', offsetY: -20 * k,
        width: tracks[tr].w * k, height: tracks[tr].h * k,
        rotation: tracks[tr].r, borderRadius: 999,
        borderColor: tracks[tr].c, borderWidth: tracks[tr].bw,
        opacity: worldIn,
      });
    }

    var labels = ['Scenes', '3D GPU', 'Golden tests', 'Audio', 'Studio', 'CLI', 'Timeline', 'Themes'];
    var colors = ['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#ec4899', '#7dd3fc', '#f97316', '#c4b5fd'];
    var rx = 610 * k, ry = 292 * k;
    var drift = frame * 0.0015;
    for (var i = 0; i < labels.length; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 4 + drift;
      var x = Math.cos(a) * rx;
      var y = Math.sin(a) * ry - 20 * k;
      var nodeIn = ease(frame, 12 + i * 4, 30 + i * 4, eoBack);
      var nodeW = (labels[i].length * 10 + 72) * k;

      // Four restrained spokes connect the system without a radial web.
      if (i % 2 === 0) {
        var dist = Math.sqrt(x * x + y * y);
        var start = 116 * k;
        layers.push({
          type: 'container', alignment: 'center',
          width: Math.max(1, dist - start - nodeW * 0.42), height: 1.2,
          borderRadius: 999, rotation: Math.atan2(y, x) * 180 / Math.PI,
          offsetX: Math.cos(a) * (start + (dist - start) * 0.5),
          offsetY: Math.sin(a) * (start + (dist - start) * 0.5),
          color: '#38a78bfa', opacity: cap01(nodeIn) * 0.65,
        });
      }

      layers.push({
        type: 'container', alignment: 'center', offsetX: x, offsetY: y,
        width: nodeW, height: 64 * k,
        scale: Math.max(0.001, nodeIn), opacity: cap01(nodeIn),
        color: '#ed11172d', borderRadius: 999,
        borderColor: ga(colors[i], 0.65), borderWidth: 1.5,
        shadow: { color: ga(colors[i], 0.30), blur: 20, offsetX: 0, offsetY: 8 },
        child: {
          type: 'row', crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 18 * k },
            { type: 'container', width: 10 * k, height: 10 * k, borderRadius: 999, color: colors[i] },
            { type: 'container', width: 12 * k },
            { type: 'text', text: labels[i], style: { fontSize: 19 * k, color: '#f3f0ff', fontFamily: font, fontWeight: 600, letterSpacing: 0.6 * k } },
          ],
        },
      });
    }

    // Traveling pulses make the map feel like a live render graph.
    for (var p = 0; p < 3; p++) {
      var pa = frame * 0.010 + p * Math.PI * 2 / 3;
      layers.push({
        type: 'container', alignment: 'center',
        width: 10 * k, height: 10 * k, borderRadius: 999,
        offsetX: Math.cos(pa) * 655 * k,
        offsetY: Math.sin(pa) * 335 * k - 20 * k,
        color: colors[p * 2], opacity: worldIn,
        shadow: { color: ga(colors[p * 2], 0.8), blur: 16, offsetX: 0, offsetY: 0 },
      });
    }

    // The brand hub lands first and remains the visual anchor.
    var hub = pop(frame, 0, 20);
    layers.push({
      type: 'container', alignment: 'center', offsetY: -20 * k,
      width: 320 * k, height: 132 * k,
      scale: Math.max(0.001, hub.scale), opacity: hub.opacity,
      color: '#f6f4ff', borderRadius: 30 * k,
      borderColor: '#99ffffff', borderWidth: 1.5,
      shadow: { color: '#807c3aed', blur: 44, offsetX: 0, offsetY: 18 },
      child: {
        type: 'row', crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 32 * k },
          { type: 'image', source: 'external:yo_bubble', fit: 'contain', width: 70 * k, height: 70 * k },
          { type: 'container', width: 16 * k },
          { type: 'text', text: 'yoclip', style: { fontSize: 38 * k, color: '#20143d', fontFamily: font, fontWeight: 700, letterSpacing: -1 * k } },
        ],
      },
    });
    layers.push({
      type: 'text', alignment: 'center', offsetY: 74 * k,
      text: 'ONE RENDER GRAPH', opacity: worldIn,
      style: { fontSize: 13 * k, color: '#a9a0cc', fontFamily: font, fontWeight: 700, letterSpacing: 3 * k },
    });
    layers.push({
      type: 'text', alignment: 'bottomCenter', offsetY: -48 * k,
      text: yoclipT('starmap').caption || 'Every feature, one constellation.',
      opacity: ease(frame, 42, 68, eo3),
      style: { fontSize: 24 * k, color: '#c2bade', fontFamily: font, letterSpacing: 3 * k },
    });

    return { type: 'stack', fit: 'expand', opacity: outro, children: layers };
  },
};
