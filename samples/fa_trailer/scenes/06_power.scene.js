// 06 — Power — three architectural feature beats in Apple's macro style.
//
//   ·  Beat 1 (0–70):   CUBES.      (wireframe sandbox + declarative security)
//   ·  Beat 2 (70–140): MEMORY / BUILT IN.  (over ai_swarm, full-bleed stacked caps)
//   ·  Beat 3 (140–210): SUBAGENTS. (metallic violet punch + swarm particles)
//
// Key typographic properties:
// - Heavy Impact typeface filling 85–92% of the canvas.
// - Multi-stop metallic gradients for specular depth.
// - Tight vertical rhythm matching Apple's architectural poster layouts.

scene = {
  id: '06_power',
  duration: 210,
  from: 1020,
  timeline: {
    label: 'Power',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function clamp01(v) {
      if (v <= 0) return 0;
      if (v >= 1) return 1;
      return v;
    }

    var b1 = 1 - tw(64, 6, 0, 1, 'easeIn');
    var b2 = tw(70, 6, 0, 1, 'easeOut') * (1 - tw(134, 6, 0, 1, 'easeIn'));
    var b3 = tw(140, 6, 0, 1, 'easeOut');

    var silverGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var gunmetalGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#C8C8D2', '#848490'],
      stops: [0.0, 1.0],
    };

    var purpleGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#E6C4FF', '#A368FF', '#6222D6'],
      stops: [0.0, 0.45, 1.0],
    };

    // ---- Beat 1 — CUBES. ----------------------------------------------------
    // Out-of-the-box cube variations grid (8 presets from Fa security ladder)
    var cubePresets = [
      { id: 'L1-CORE', tier: 'L1', title: 'STRICT WORKSPACE', spec: 'fs: [.] · net: none · core tools', col: '#2EBD9E' },
      { id: 'L1-FULL', tier: 'L1', title: 'ISOLATED SHELL', spec: 'fs: [.] · net: none · full CLI', col: '#2EBD9E' },
      { id: 'L2-CORE', tier: 'L2', title: 'HOST AUDITED', spec: 'fs: ro / · ws: rw · dev net', col: '#48C7E8' },
      { id: 'L2-FULL', tier: 'L2', title: 'STANDARD SANDBOX', spec: 'fs: ro / · ws: rw · npm/pub', col: '#5B61F6' },
      { id: 'L3-CORE', tier: 'L3', title: 'FULL DISK AUDITED', spec: 'fs: rw / · safe tool policy', col: '#8F6BFF' },
      { id: 'L3-FULL', tier: 'L3', title: 'UNRESTRICTED HOST', spec: 'fs: rw / · open net · root', col: '#A368FF' },
      { id: 'EPHEMERAL', tier: 'TMP', title: 'RAM SCRATCH DISK', spec: 'type: tmpfs · zero traces', col: '#E056FD' },
      { id: 'CONTAINER', tier: 'OCI', title: 'DOCKER PIPELINE', spec: 'runtime: oci · hermetic CI', col: '#00F0FF' },
    ];

    var gridIn = tw(0, 24, 0, 1, 'easeOutCubic');
    var b1kids = [];

    // Background architectural template grid (4 columns x 2 rows)
    var cW = 360;
    var cH = 96;
    var cGapX = 24;
    var cGapY = 530; // separates top row from bottom row
    var cStartX = (1920 - (4 * cW + 3 * cGapX)) / 2; // 204

    for (var ci = 0; ci < cubePresets.length; ci++) {
      var cp = cubePresets[ci];
      var colIdx = ci % 4;
      var rowIdx = Math.floor(ci / 4);
      var cX = cStartX + colIdx * (cW + cGapX);
      var cY = rowIdx === 0 ? 65 : 720; // Row 0 at 65 (ends 161), Row 1 at 720 (ends 816)

      var cardDrift = (1 - gridIn) * (rowIdx === 0 ? -25 : 25);

      // Card container
      b1kids.push({
        type: 'rect',
        width: cW,
        height: cH,
        radius: 16,
        fill: '#080D1A',
        border: { color: '#1B263C', width: 1.5 },
        opacity: clamp01(gridIn * 0.92),
        offsetY: cardDrift,
        positioned: { left: cX, top: cY },
      });

      // Accent color strip on left
      b1kids.push({
        type: 'rect',
        width: 4,
        height: cH - 28,
        radius: 2,
        fill: cp.col,
        opacity: clamp01(gridIn * 0.9),
        offsetY: cardDrift,
        positioned: { left: cX + 12, top: cY + 14 },
      });

      // Tier badge pill
      b1kids.push({
        type: 'rect',
        width: 42,
        height: 20,
        radius: 6,
        fill: '#121D32',
        border: { color: cp.col, width: 1.0 },
        opacity: clamp01(gridIn * 0.95),
        offsetY: cardDrift,
        positioned: { left: cX + 26, top: cY + 12 },
      });
      b1kids.push({
        type: 'text',
        text: cp.tier,
        width: 42,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 10,
          fontFamily: 'Impact',
          color: cp.col,
          textAlign: 'center',
          letterSpacing: 0.5,
        },
        positioned: { left: cX + 26, top: cY + 16 },
      });

      // Preset ID
      b1kids.push({
        type: 'text',
        text: cp.id,
        width: cW - 85,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 15,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          letterSpacing: 1.5,
        },
        positioned: { left: cX + 76, top: cY + 12 },
      });

      // Title
      b1kids.push({
        type: 'text',
        text: cp.title,
        width: cW - 40,
        opacity: clamp01(gridIn * 0.85),
        offsetY: cardDrift,
        style: {
          fontSize: 12,
          fontFamily: 'Impact',
          color: '#8A99B2',
          letterSpacing: 1,
        },
        positioned: { left: cX + 26, top: cY + 38 },
      });

      // Spec / Policy
      b1kids.push({
        type: 'text',
        text: cp.spec,
        width: cW - 40,
        opacity: clamp01(gridIn * 0.7),
        offsetY: cardDrift,
        style: {
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#48C7E8',
        },
        positioned: { left: cX + 26, top: cY + 62 },
      });
    }

    // Rotating wireframe isometric cubes in center
    var spin = tw(0, 70, 0, 1, 'linear');
    var squares = [
      { base: 45, size: 540, o: 0.22 },
      { base: -45, size: 540, o: 0.16 },
      { base: 0, size: 540, o: 0.12 },
    ];
    for (var si = 0; si < squares.length; si++) {
      var q = squares[si];
      b1kids.push({
        type: 'rect',
        width: q.size,
        height: q.size,
        radius: 20,
        border: { color: '#8F6BFF', width: 2 },
        opacity: q.o,
        rotation: q.base + 16 * spin,
        positioned: { left: 960 - q.size / 2, top: 430 - q.size / 2 },
      });
    }

    var sandboxIn = tw(14, 20, 0, 1, 'easeOut');
    b1kids.push({
      type: 'text',
      text: 'CUBES.',
      width: 1920,
      style: {
        fontSize: 300,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        letterSpacing: 4,
      },
      positioned: { left: 0, top: 190 },
    });

    b1kids.push({
      type: 'text',
      text: 'DECLARATIVE YAML SANDBOX. APPROVAL TIERS.',
      width: 1920,
      opacity: clamp01(sandboxIn),
      offsetY: 15 * (1 - sandboxIn),
      style: {
        fontSize: 34,
        fontFamily: 'Impact',
        color: '#A368FF',
        letterSpacing: 2,
        textAlign: 'center',
      },
      positioned: { left: 0, top: 600 },
    });

    // ---- Beat 2 — MEMORY / BUILT IN. ---------------------------------------
    var swarmZoom = lerp(1.05, 1.15, tw(70, 70, 0, 1, 'linear'));
    var b2kids = [
      {
        type: 'stack',
        fit: 'expand',
        scale: swarmZoom,
        children: [
          {
            type: 'image',
            source: 'external:ai_swarm',
            fit: 'cover',
            width: 1920,
            height: 1080,
            positioned: { left: 0, top: 0 },
          },
        ],
      },
      {
        type: 'rect',
        width: 1920,
        height: 1080,
        fill: '#070a12',
        opacity: 0.62,
        positioned: { left: 0, top: 0 },
      },
      {
        type: 'text',
        text: 'MEMORY',
        width: 1920,
        style: {
          fontSize: 480,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
        },
        positioned: { left: 0, top: 40 },
      },
      {
        type: 'text',
        text: 'BUILT IN.',
        width: 1920,
        style: {
          fontSize: 350,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: gunmetalGrad,
        },
        positioned: { left: 0, top: 540 },
      },
      {
        type: 'text',
        text: 'JSONL SESSIONS · COMPACTION · REWIND',
        width: 1920,
        style: {
          fontSize: 34,
          fontFamily: 'Impact',
          color: '#48C7E8',
          letterSpacing: 2,
          textAlign: 'center',
        },
        positioned: { left: 0, top: 970 },
      },
    ];

    // ---- Beat 3 — SUBAGENTS. ------------------------------------------------
    var b3kids = [
      {
        type: 'text',
        text: 'SUBAGENTS.',
        width: 1920,
        style: {
          fontSize: 345,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: purpleGrad,
        },
        positioned: { left: 0, top: 220 },
      },
      {
        type: 'text',
        text: 'PARALLEL · TYPED · SCHEMA-CHECKED',
        width: 1920,
        style: {
          fontSize: 42,
          fontFamily: 'Impact',
          color: '#5CE8CF',
          letterSpacing: 2,
          textAlign: 'center',
        },
        positioned: { left: 0, top: 620 },
      },
    ];

    // Swarm particles flying outward
    var DOTS = [
      { a0: -2.75, curl: 0.85, reach: 450, size: 14, color: '#C9B8FF', at: 146 },
      { a0: -2.15, curl: -0.65, reach: 400, size: 12, color: '#8F6BFF', at: 149 },
      { a0: -1.55, curl: 0.75, reach: 470, size: 16, color: '#48C7E8', at: 152 },
      { a0: -0.95, curl: -0.80, reach: 380, size: 10, color: '#C9B8FF', at: 155 },
      { a0: -0.35, curl: 0.90, reach: 430, size: 13, color: '#8F6BFF', at: 158 },
    ];
    for (var di = 0; di < DOTS.length; di++) {
      var d = DOTS[di];
      var t = tw(d.at, 48, 0, 1, 'easeOut');
      var op = tw(d.at, 12, 0, 1, 'easeOut');
      if (op <= 0) continue;
      var ang = d.a0 + d.curl * t;
      var rad = 40 + d.reach * t;
      var dx = Math.cos(ang) * rad;
      var dy = Math.sin(ang) * rad * 0.75;
      b3kids.push({
        type: 'circle',
        size: d.size * 2.8,
        fill: d.color,
        opacity: 0.22 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size * 1.4, top: 400 - d.size * 1.4 },
      });
      b3kids.push({
        type: 'circle',
        size: d.size,
        fill: d.color,
        opacity: 0.95 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size / 2, top: 400 - d.size / 2 },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'rect',
          width: 1920,
          height: 1080,
          fill: '#070a12',
          positioned: { left: 0, top: 0 },
        },
        { type: 'stack', fit: 'expand', opacity: b1, children: b1kids },
        { type: 'stack', fit: 'expand', opacity: b2, children: b2kids },
        { type: 'stack', fit: 'expand', opacity: b3, children: b3kids },
      ],
    };
  },
};
