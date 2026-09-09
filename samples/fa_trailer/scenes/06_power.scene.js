// 06 — Power — three feature beats: security, memory, subagents.
//
//   ·  0–70    CUBES — 'Security you can read.' over a faint wireframe cube
//              illusion: three stroked squares at 45 / -45 / 0 slowly turning
//              behind the type; the declarative-sandbox line arrives +20f
//   ·  70–140  MEMORY — over the AI-swarm placeholder (1.1 → 1.2 push):
//              'Memory built in.' / JSONL sessions · compaction · rewind
//   ·  140–210 SUBAGENTS — back on black: 'Subagents.' and the swarm echo —
//              five violet dots arcing out of the headline
//
// Every beat hard-cuts in (6-frame opacity ramp), holds, hard-cuts out.
// AI-art placeholder: external:ai_swarm (PNG start frame; becomes a video
// asset under the same key when the real clip lands).

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
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to,
        easing);
    }

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    function cutIn(at) { return tw(at, 6, 0, 1, 'easeOut'); }
    function cutOut(at) { return 1 - tw(at, 6, 0, 1, 'linear'); }

    // ---- Beat gates --------------------------------------------------------
    var b1 = cutIn(0) * cutOut(64);
    var b2 = cutIn(70) * cutOut(134);
    var b3 = cutIn(140);

    var breathe = 0.5 + 0.5 * Math.sin((ms / 2400) * Math.PI * 2);

    // One centered line — the whole beat lives on four of these.
    function line(text, fontSize, color, weight, spacing, top, glow,
      opacity, offY) {
      return {
        type: 'text',
        text: text,
        width: 1920,
        opacity: opacity,
        offsetY: offY,
        style: {
          fontSize: fontSize,
          color: color,
          fontFamily: text === text.toUpperCase() && fontSize > 100 ? 'RobotoCondensed' : 'Roboto',
          fontWeight: weight,
          letterSpacing: spacing,
          textAlign: 'center',
          textShadows: glow,
        },
        positioned: { left: 0, top: top },
      };
    }

    function bigGlow() {
      return [
        { color: '#8C000000', blur: 28 },
        {
          color: '#' + hex2(0.10 + 0.10 * breathe) + '8F6BFF',
          blur: 24 + 14 * breathe,
        },
      ];
    }

    // ---- Beat 1 — Cubes (security) -----------------------------------------
    var spin = tw(0, 70, 0, 1, 'linear'); // 16° over the beat — a slow turn
    var squares = [
      { base: 45, size: 470, o: 0.25 },
      { base: -45, size: 470, o: 0.22 },
      { base: 0, size: 470, o: 0.18 },
    ];
    var cube = [];
    for (var si = 0; si < squares.length; si++) {
      var q = squares[si];
      cube.push({
        type: 'rect',
        width: q.size,
        height: q.size,
        radius: 10,
        stroke: C.violet,
        strokeWidth: 1.5,
        opacity: q.o,
        rotation: q.base + 16 * spin,
        positioned: { left: 960 - q.size / 2, top: 540 - q.size / 2 },
      });
    }

    var sandboxIn = tw(20, 20, 0, 1, 'easeOut');
    var b1kids = cube.concat([
      line('CUBES.', 545, '#EAEAF2', '700', 0, 210, bigGlow(), 1, 0),
      line('SECURITY YOU CAN READ.', 34, C.violet, '500', 3, 720,
        [{ color: '#44000000', blur: 16 }], 1, 0),
      line('DECLARATIVE YAML SANDBOX. APPROVAL TIERS.', 28, '#9BA3B5',
        '400', 2, 776, [], sandboxIn, 10 * (1 - sandboxIn)),
    ]);

    // ---- Beat 2 — Memory (over the swarm) ----------------------------------
    var swarmZoom = lerp(1.1, 1.2, tw(70, 70, 0, 1, 'linear'));
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
        type: 'rect', width: 1920, height: 1080, fill: C.background,
        opacity: 0.5, positioned: { left: 0, top: 0 },
      },
      line('MEMORY', 430, '#EAEAF2', '700', 0, 140, bigGlow(), 1, 0),
      line('BUILT IN.', 300, '#EAEAF2', '700', 0, 620, bigGlow(), 1, 0),
      line('JSONL SESSIONS · CHECKPOINT REWIND', 24,
        C.violetBright, '400', 3, 960, [{ color: '#44000000', blur: 16 }],
        1, 0),
    ];

    // ---- Beat 3 — Subagents (the swarm echo) -------------------------------
    var b3kids = [
      line('SUBAGENTS.', 320, '#EAEAF2', '700', 0, 330, bigGlow(), 1, 0),
      line('PARALLEL. TYPED. SCHEMA-CHECKED.', 34, C.tealLight, '500', 3,
        700, [{ color: '#44000000', blur: 16 }], 1, 0),
    ];

    // Five violet dots fly outward from the headline in arcs: each dot owns
    // a launch angle and a curl — the angle advances with the flight, so the
    // straight radial becomes a curved path. A fat blurred twin gives each
    // dot its halo.
    var DOTS = [
      { a0: -2.75, curl: 0.85, reach: 430, size: 12, color: C.violetBright, at: 148 },
      { a0: -2.15, curl: -0.65, reach: 380, size: 10, color: C.violet, at: 151 },
      { a0: -1.55, curl: 0.75, reach: 440, size: 13, color: C.violet, at: 154 },
      { a0: -0.95, curl: -0.8, reach: 360, size: 9, color: C.violetBright, at: 157 },
      { a0: -0.35, curl: 0.9, reach: 410, size: 11, color: C.violet, at: 160 },
    ];
    for (var di = 0; di < DOTS.length; di++) {
      var d = DOTS[di];
      var t = tw(d.at, 48, 0, 1, 'easeOut');
      var op = tw(d.at, 14, 0, 1, 'easeOut');
      if (op <= 0) continue;
      var ang = d.a0 + d.curl * t;
      var rad = 30 + d.reach * t;
      var dx = Math.cos(ang) * rad;
      var dy = Math.sin(ang) * rad * 0.72; // fanned above the headline
      b3kids.push({
        type: 'circle',
        size: d.size * 2.6,
        fill: d.color,
        opacity: 0.18 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size * 1.3, top: 475 - d.size * 1.3 },
      });
      b3kids.push({
        type: 'circle',
        size: d.size,
        fill: d.color,
        opacity: 0.9 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size / 2, top: 475 - d.size / 2 },
      });
    }

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });
    kids.push({ type: 'stack', fit: 'expand', opacity: b1, children: b1kids });
    kids.push({ type: 'stack', fit: 'expand', opacity: b2, children: b2kids });
    kids.push({ type: 'stack', fit: 'expand', opacity: b3, children: b3kids });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
