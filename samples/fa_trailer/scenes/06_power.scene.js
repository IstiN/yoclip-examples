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
    var spin = tw(0, 70, 0, 1, 'linear');
    var squares = [
      { base: 45, size: 520, o: 0.22 },
      { base: -45, size: 520, o: 0.18 },
      { base: 0, size: 520, o: 0.15 },
    ];
    var cube = [];
    for (var si = 0; si < squares.length; si++) {
      var q = squares[si];
      cube.push({
        type: 'rect',
        width: q.size,
        height: q.size,
        radius: 12,
        stroke: '#8F6BFF',
        strokeWidth: 2,
        opacity: q.o,
        rotation: q.base + 16 * spin,
        positioned: { left: 960 - q.size / 2, top: 480 - q.size / 2 },
      });
    }

    var sandboxIn = tw(18, 18, 0, 1, 'easeOut');
    var b1kids = cube.concat([
      {
        type: 'text',
        text: 'CUBES.',
        width: 1920,
        style: {
          fontSize: 540,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
          textShadows: [{ color: '#448F6BFF', blur: 64 }],
        },
        positioned: { left: 0, top: 160 },
      },
      {
        type: 'text',
        text: 'DECLARATIVE YAML SANDBOX. APPROVAL TIERS.',
        width: 1920,
        opacity: sandboxIn,
        offsetY: 15 * (1 - sandboxIn),
        style: {
          fontSize: 40,
          fontFamily: 'Impact',
          color: '#C9B8FF',
          letterSpacing: 2,
          textAlign: 'center',
          textShadows: [{ color: '#44000000', blur: 16 }],
        },
        positioned: { left: 0, top: 780 },
      },
    ]);

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
          textShadows: [{ color: '#448F6BFF', blur: 48 }],
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
          textShadows: [{ color: '#22000000', blur: 24 }],
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
          textShadows: [{ color: '#44000000', blur: 16 }],
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
          textShadows: [{ color: '#888F6BFF', blur: 64 }],
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
          textShadows: [{ color: '#44000000', blur: 16 }],
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
