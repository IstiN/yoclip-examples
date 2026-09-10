// 05 — Everywhere — connecting blocks / node graph.
//
// Mirroring Apple Mac Studio M5 (3uAIqqg8ZHo) 21.0s–22.5s:
//   ·   0–45   The headline slams in Apple-style full-bleed Impact:
//              `EVERYWHERE.` / `ONE AGENT. ANY PLATFORM.`
//   ·  35–100  The architecture node graph materializes: floating frosted-glass
//              cards for CLI, Studio, Cubes, Multi-Provider, Platforms
//   ·  60–240  Glowing violet and cyan curved Bezier splines link the blocks,
//              with bright energy pulses streaming across the wires.

scene = {
  id: '05_everywhere',
  duration: 240,
  from: 780,
  timeline: {
    label: 'Everywhere',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var silverGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var gunmetalGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#C8C8D2', '#848490'],
      stops: [0.0, 1.0],
    };

    var kids = [];

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // Ambient purple aura in center
    var breathe = 0.5 + 0.5 * Math.sin((frame / 60) * Math.PI * 2);
    kids.push({
      type: 'circle',
      size: 900,
      fill: '#5B61F6',
      opacity: 0.12 + 0.05 * breathe,
      blur: 110,
      positioned: { left: 960 - 450, top: 560 - 450 },
    });

    // ---- Headline: EVERYWHERE. / ONE AGENT. ANY PLATFORM. -------------------
    var headIn1 = tw(0, 32, 0, 1, 'easeOutExpo');
    var headIn2 = tw(8, 32, 0, 1, 'easeOutExpo');

    // Dim the headline slightly when nodes fully activate
    var nodeFocusT = tw(55, 30, 0, 1, 'easeInOutCubic');
    var headDim = lerp(1.0, 0.40, nodeFocusT);

    kids.push({
      type: 'text',
      text: 'EVERYWHERE.',
      width: 1920,
      opacity: headIn1 * headDim,
      offsetY: 25 * (1 - headIn1),
      style: {
        fontSize: 140,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        letterSpacing: 2,
        shadows: [{ color: '#8F6BFF', blur: 36, offset: { x: 0, y: 6 } }],
      },
      positioned: { left: 0, top: 35 },
    });

    kids.push({
      type: 'text',
      text: 'ONE AGENT. ANY PLATFORM.',
      width: 1920,
      opacity: headIn2 * headDim,
      offsetY: 25 * (1 - headIn2),
      style: {
        fontSize: 70,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: gunmetalGrad,
        letterSpacing: 2,
        shadows: [{ color: '#000000', blur: 24, offset: { x: 0, y: 8 } }],
      },
      positioned: { left: 0, top: 175 },
    });

    // ---- Architecture Nodes (Floating Frosted-Glass Cards) ------------------
    var nodes = [
      {
        id: 'core',
        title: 'FA CORE',
        badge: 'PURE DART',
        badgeCol: '#8F6BFF',
        sub: '100% native · streaming-first',
        stat: '10 Providers · 120 FPS Impeller',
        x: 770, y: 460, w: 380, h: 180,
        isCenter: true,
        at: 30,
      },
      {
        id: 'studio',
        title: 'STUDIO PLAYER',
        badge: 'TIMELINE',
        badgeCol: '#48C7E8',
        sub: 'multi-track · scrubbing',
        stat: 'Audio Mixdown · Hot Reload',
        x: 180, y: 340, w: 340, h: 160,
        at: 42,
      },
      {
        id: 'cubes',
        title: 'CUBES SANDBOX',
        badge: 'SECURITY',
        badgeCol: '#2EBD9E',
        sub: 'declarative container',
        stat: 'Isolated Filesystem & Tools',
        x: 180, y: 680, w: 340, h: 160,
        at: 52,
      },
      {
        id: 'provider',
        title: 'MULTI-PROVIDER',
        badge: '10 MODELS',
        badgeCol: '#8F6BFF',
        sub: 'unified tool-calling',
        stat: 'Claude 3.7 · GPT-4o · Ollama',
        x: 1400, y: 340, w: 340, h: 160,
        at: 46,
      },
      {
        id: 'platform',
        title: 'CROSS-PLATFORM',
        badge: 'ALL OS',
        badgeCol: '#48C7E8',
        sub: 'universal Flutter deployment',
        stat: 'macOS · iOS · Web · Linux · Win',
        x: 1400, y: 680, w: 340, h: 160,
        at: 58,
      },
    ];

    // Bezier connections between nodes
    var connections = [
      { from: 'studio', to: 'core', p1: { x: 520, y: 420 }, p2: { x: 770, y: 510 }, col: '#8F6BFF' },
      { from: 'cubes', to: 'core', p1: { x: 520, y: 760 }, p2: { x: 770, y: 590 }, col: '#2EBD9E' },
      { from: 'core', to: 'provider', p1: { x: 1150, y: 510 }, p2: { x: 1400, y: 420 }, col: '#8F6BFF' },
      { from: 'core', to: 'platform', p1: { x: 1150, y: 590 }, p2: { x: 1400, y: 760 }, col: '#48C7E8' },
    ];

    function bezierPt(p0, p1, p2, p3, t) {
      var u = 1 - t;
      var tt = t * t;
      var uu = u * u;
      var uuu = uu * u;
      var ttt = tt * t;
      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
      };
    }

    // ---- Render Connecting Splines & Glowing Energy Pulses ------------------
    for (var ci = 0; ci < connections.length; ci++) {
      var c = connections[ci];
      var wireIn = tw(48 + ci * 6, 24, 0, 1, 'easeOut');
      if (wireIn <= 0.01) continue;

      var startPt = c.p1;
      var endPt = c.p2;
      var midX = (startPt.x + endPt.x) / 2;
      var cp1 = { x: midX, y: startPt.y };
      var cp2 = { x: midX, y: endPt.y };

      var pathStr = 'M ' + startPt.x + ' ' + startPt.y +
                    ' C ' + cp1.x + ' ' + cp1.y +
                    ' ' + cp2.x + ' ' + cp2.y +
                    ' ' + endPt.x + ' ' + endPt.y;

      // Glow halo wire
      kids.push({
        type: 'path',
        path: pathStr,
        color: c.col,
        strokeWidth: 8,
        opacity: 0.35 * wireIn,
        blur: 6,
      });

      // Core crisp wire
      kids.push({
        type: 'path',
        path: pathStr,
        color: '#FFFFFF',
        strokeWidth: 2.5,
        opacity: 0.85 * wireIn,
      });

      // Energy pulse traveling along wire
      if (wireIn > 0.8) {
        var pulseCycle = ((frame + ci * 18) % 45) / 45;
        var pt = bezierPt(startPt, cp1, cp2, endPt, pulseCycle);

        // Pulse glow
        kids.push({
          type: 'circle',
          size: 24,
          fill: c.col,
          opacity: 0.85,
          blur: 6,
          positioned: { left: pt.x - 12, top: pt.y - 12 },
        });
        // Pulse hot core
        kids.push({
          type: 'circle',
          size: 8,
          fill: '#FFFFFF',
          opacity: 0.95,
          positioned: { left: pt.x - 4, top: pt.y - 4 },
        });
      }
    }

    // ---- Render Node Cards -------------------------------------------------
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pop = tw(n.at, 22, 0, 1, 'backOut');
      var op = tw(n.at, 14, 0, 1, 'easeOut');
      if (op <= 0.01) continue;

      var isCenter = n.isCenter;
      var cardBorder = isCenter ? '#8F6BFF' : '#2D3850';
      var cardFill = isCenter ? '#10162A' : '#0B101E';

      // Card ambient glow behind
      kids.push({
        type: 'rect',
        width: n.w,
        height: n.h,
        radius: 18,
        fill: isCenter ? '#5B61F6' : '#2D3850',
        opacity: (isCenter ? 0.32 : 0.12) * op,
        blur: isCenter ? 32 : 16,
        positioned: { left: n.x, top: n.y },
      });

      // Card solid body
      kids.push({
        type: 'rect',
        width: n.w,
        height: n.h,
        radius: 16,
        fill: cardFill,
        stroke: cardBorder,
        strokeWidth: isCenter ? 2.5 : 1.5,
        opacity: op,
        positioned: { left: n.x, top: n.y },
      });

      // Top title
      kids.push({
        type: 'text',
        text: n.title,
        opacity: op,
        style: {
          fontSize: isCenter ? 24 : 19,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          letterSpacing: 1,
        },
        positioned: { left: n.x + 22, top: n.y + 18 },
      });

      // Badge
      kids.push({
        type: 'text',
        text: '[' + n.badge + ']',
        opacity: op,
        style: {
          fontSize: 12,
          color: n.badgeCol,
          fontFamily: 'monospace',
          fontWeight: '700',
        },
        positioned: { left: n.x + n.w - 110, top: n.y + 22 },
      });

      // Subtitle
      kids.push({
        type: 'text',
        text: n.sub,
        opacity: op,
        style: {
          fontSize: isCenter ? 15 : 13,
          color: '#8A99B0',
          fontFamily: 'Roboto',
          fontWeight: '500',
        },
        positioned: { left: n.x + 22, top: n.y + (isCenter ? 64 : 54) },
      });

      // Divider line
      kids.push({
        type: 'rect',
        width: n.w - 44,
        height: 1,
        fill: '#1D273D',
        opacity: op,
        positioned: { left: n.x + 22, top: n.y + (isCenter ? 104 : 88) },
      });

      // Bottom stat line
      kids.push({
        type: 'text',
        text: n.stat,
        opacity: op,
        style: {
          fontSize: isCenter ? 15 : 13,
          color: isCenter ? '#48C7E8' : '#6A7C98',
          fontFamily: 'monospace',
          fontWeight: '600',
        },
        positioned: { left: n.x + 22, top: n.y + (isCenter ? 124 : 106) },
      });

      // Ports (socket dots on left & right edges)
      kids.push({
        type: 'circle',
        size: 10,
        fill: '#8F6BFF',
        opacity: op,
        positioned: { left: n.x - 5, top: n.y + n.h / 2 - 5 },
      });
      kids.push({
        type: 'circle',
        size: 10,
        fill: '#48C7E8',
        opacity: op,
        positioned: { left: n.x + n.w - 5, top: n.y + n.h / 2 - 5 },
      });
    }

    // Outer subtle vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
      opacity: 0.28,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
