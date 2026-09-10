// 05 — Everywhere — connecting blocks / node graph.
//
// Mirroring Apple Mac Studio M5 (3uAIqqg8ZHo) 21.0s–22.5s:
//   ·   0–45   The headline slams in Apple-style full-bleed Impact:
//              `EVERYWHERE.` / `ONE AGENT. ANY PLATFORM.`
//   ·  35–100  The architecture node graph materializes with platforms and apps:
//              macOS, Windows, iOS & Android, Chrome & Extension,
//              PowerPoint, Word, Outlook, Studio
//   ·  60–240  Glowing curved Bezier splines link all apps & platforms to FA CORE,
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
      size: 960,
      fill: '#5B61F6',
      opacity: 0.12 + 0.05 * breathe,
      blur: 120,
      positioned: { left: 960 - 480, top: 560 - 480 },
    });

    // ---- Headline: EVERYWHERE. / ONE AGENT. ANY PLATFORM. -------------------
    var headIn1 = tw(0, 32, 0, 1, 'easeOutExpo');
    var headIn2 = tw(8, 32, 0, 1, 'easeOutExpo');

    // Dim the headline slightly when nodes fully activate
    var nodeFocusT = tw(55, 30, 0, 1, 'easeInOutCubic');
    var headDim = lerp(1.0, 0.35, nodeFocusT);

    kids.push({
      type: 'text',
      text: 'EVERYWHERE.',
      width: 1920,
      opacity: headIn1 * headDim,
      offsetY: 25 * (1 - headIn1),
      style: {
        fontSize: 130,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        letterSpacing: 2,
        shadows: [{ color: '#8F6BFF', blur: 36, offset: { x: 0, y: 6 } }],
      },
      positioned: { left: 0, top: 30 },
    });

    kids.push({
      type: 'text',
      text: 'ONE AGENT. ANY PLATFORM.',
      width: 1920,
      opacity: headIn2 * headDim,
      offsetY: 25 * (1 - headIn2),
      style: {
        fontSize: 64,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: gunmetalGrad,
        letterSpacing: 2,
        shadows: [{ color: '#000000', blur: 24, offset: { x: 0, y: 8 } }],
      },
      positioned: { left: 0, top: 165 },
    });

    // ---- Architecture Nodes: Platforms, Browsers, Office Suites ------------
    var centerNode = {
      id: 'core',
      title: 'FA ENGINE',
      badge: 'PURE DART',
      badgeCol: '#8F6BFF',
      sub: '100% native · zero cloud lock-in',
      stat: 'Impeller GPU · 120 FPS Runtime',
      x: 770, y: 440, w: 380, h: 200,
      at: 28,
    };

    var satelliteNodes = [
      // Left Zone: Operating Systems
      {
        id: 'macos',
        title: 'macOS',
        iconLetter: '',
        iconBg: '#3A4456',
        sub: 'Native Menu Bar & CLI',
        stat: 'Apple Silicon Metal',
        x: 120, y: 310, w: 270, h: 120,
        wireCol: '#FFFFFF',
        at: 36,
      },
      {
        id: 'windows',
        title: 'Windows',
        iconLetter: '⊞',
        iconBg: '#0078D7',
        sub: 'WinUI & System Tray',
        stat: 'DirectX / Desktop Host',
        x: 120, y: 460, w: 270, h: 120,
        wireCol: '#00A4EF',
        at: 44,
      },
      {
        id: 'mobile',
        title: 'iOS & Android',
        iconLetter: '📱',
        iconBg: '#3DDC84',
        sub: 'Touch UI & Background Sync',
        stat: 'ARM64 Mobile Native',
        x: 120, y: 610, w: 270, h: 120,
        wireCol: '#3DDC84',
        at: 52,
      },
      {
        id: 'cli',
        title: 'CLI & Linux',
        iconLetter: '>',
        iconBg: '#2EBD9E',
        sub: 'Headless Server Daemon',
        stat: 'Autonomous Terminal Swarm',
        x: 120, y: 760, w: 270, h: 120,
        wireCol: '#2EBD9E',
        at: 60,
      },

      // Top Zone: Browsers & Web
      {
        id: 'chrome',
        title: 'Chrome Extension',
        iconLetter: '🧩',
        iconBg: '#FBBC05',
        sub: 'Side Panel & Web Page DOM',
        stat: 'Manifest V3 Native',
        x: 460, y: 260, w: 270, h: 115,
        wireCol: '#FBBC05',
        at: 40,
      },
      {
        id: 'web',
        title: 'Web Canvas',
        iconLetter: '🌐',
        iconBg: '#48C7E8',
        sub: 'WasmGC + Impeller Skia',
        stat: 'Universal Browser Engine',
        x: 1190, y: 260, w: 270, h: 115,
        wireCol: '#48C7E8',
        at: 48,
      },

      // Right Zone: Office Suites & Studio
      {
        id: 'powerpoint',
        title: 'PowerPoint',
        iconLetter: 'P',
        iconBg: '#D24726',
        sub: 'Editable Text & PPTX Export',
        stat: 'Automated Slide Decks',
        x: 1530, y: 310, w: 270, h: 120,
        wireCol: '#D24726',
        at: 42,
      },
      {
        id: 'word',
        title: 'Word',
        iconLetter: 'W',
        iconBg: '#2B579A',
        sub: 'DOCX Specs & Technical Docs',
        stat: 'Structured Markdown Sync',
        x: 1530, y: 460, w: 270, h: 120,
        wireCol: '#2B579A',
        at: 50,
      },
      {
        id: 'outlook',
        title: 'Outlook',
        iconLetter: 'O',
        iconBg: '#0078D4',
        sub: 'Actionable Email & Calendar',
        stat: 'Task Triaging & Invites',
        x: 1530, y: 610, w: 270, h: 120,
        wireCol: '#0078D4',
        at: 58,
      },
      {
        id: 'studio',
        title: 'YoClip Studio',
        iconLetter: '🎬',
        iconBg: '#8F6BFF',
        sub: 'Multi-Track Video Timeline',
        stat: 'Code-First Media Engine',
        x: 1530, y: 760, w: 270, h: 120,
        wireCol: '#8F6BFF',
        at: 64,
      },
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
    for (var ci = 0; ci < satelliteNodes.length; ci++) {
      var sn = satelliteNodes[ci];
      var wireIn = tw(sn.at + 8, 22, 0, 1, 'easeOut');
      if (wireIn <= 0.01) continue;

      var snCenterX = sn.x + (sn.x < 770 ? sn.w : 0);
      var snCenterY = sn.y + sn.h / 2;

      // Connect to closest edge of center node
      var cnCenterX = 770 + (sn.x < 770 ? 0 : centerNode.w);
      var cnCenterY = 440 + (sn.y < 440 ? 40 : (sn.y > 640 ? 160 : 100));

      if (sn.y < 350) {
        // Top nodes connect to top edge
        snCenterX = sn.x + sn.w / 2;
        snCenterY = sn.y + sn.h;
        cnCenterX = 770 + (sn.x < 960 ? 80 : 300);
        cnCenterY = 440;
      }

      var startPt = { x: snCenterX, y: snCenterY };
      var endPt = { x: cnCenterX, y: cnCenterY };
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
        color: sn.wireCol,
        strokeWidth: 6,
        opacity: 0.32 * wireIn,
        blur: 5,
      });

      // Core crisp wire
      kids.push({
        type: 'path',
        path: pathStr,
        color: '#FFFFFF',
        strokeWidth: 1.8,
        opacity: 0.80 * wireIn,
      });

      // Energy pulse traveling along wire
      if (wireIn > 0.8) {
        var pulseCycle = ((frame + ci * 14) % 40) / 40;
        var pt = bezierPt(startPt, cp1, cp2, endPt, pulseCycle);

        kids.push({
          type: 'circle',
          size: 20,
          fill: sn.wireCol,
          opacity: 0.85,
          blur: 5,
          positioned: { left: pt.x - 10, top: pt.y - 10 },
        });
        kids.push({
          type: 'circle',
          size: 6,
          fill: '#FFFFFF',
          opacity: 0.95,
          positioned: { left: pt.x - 3, top: pt.y - 3 },
        });
      }
    }

    // ---- Render Center Hero Node (FA ENGINE) -------------------------------
    var cPop = tw(centerNode.at, 22, 0, 1, 'backOut');
    var cOp = tw(centerNode.at, 14, 0, 1, 'easeOut');
    if (cOp > 0.01) {
      // Glow behind
      kids.push({
        type: 'rect',
        width: centerNode.w,
        height: centerNode.h,
        radius: 20,
        fill: '#5B61F6',
        opacity: 0.35 * cOp,
        blur: 32,
        positioned: { left: centerNode.x, top: centerNode.y },
      });
      // Card body
      kids.push({
        type: 'rect',
        width: centerNode.w,
        height: centerNode.h,
        radius: 18,
        fill: '#10162A',
        stroke: '#8F6BFF',
        strokeWidth: 2.5,
        opacity: cOp,
        positioned: { left: centerNode.x, top: centerNode.y },
      });
      // Title
      kids.push({
        type: 'text',
        text: centerNode.title,
        opacity: cOp,
        style: {
          fontSize: 26,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          letterSpacing: 1,
        },
        positioned: { left: centerNode.x + 24, top: centerNode.y + 22 },
      });
      // Badge
      kids.push({
        type: 'text',
        text: '[' + centerNode.badge + ']',
        opacity: cOp,
        style: {
          fontSize: 13,
          color: '#8F6BFF',
          fontFamily: 'monospace',
          fontWeight: '700',
        },
        positioned: { left: centerNode.x + centerNode.w - 120, top: centerNode.y + 26 },
      });
      // Subtitle
      kids.push({
        type: 'text',
        text: centerNode.sub,
        opacity: cOp,
        style: {
          fontSize: 15,
          color: '#A0B0C8',
          fontFamily: 'Roboto',
          fontWeight: '500',
        },
        positioned: { left: centerNode.x + 24, top: centerNode.y + 76 },
      });
      // Divider
      kids.push({
        type: 'rect',
        width: centerNode.w - 48,
        height: 1,
        fill: '#24324F',
        opacity: cOp,
        positioned: { left: centerNode.x + 24, top: centerNode.y + 118 },
      });
      // Stat
      kids.push({
        type: 'text',
        text: centerNode.stat,
        opacity: cOp,
        style: {
          fontSize: 15,
          color: '#48C7E8',
          fontFamily: 'monospace',
          fontWeight: '600',
        },
        positioned: { left: centerNode.x + 24, top: centerNode.y + 142 },
      });
      // Sockets
      kids.push({
        type: 'circle',
        size: 12,
        fill: '#8F6BFF',
        opacity: cOp,
        positioned: { left: centerNode.x - 6, top: centerNode.y + centerNode.h / 2 - 6 },
      });
      kids.push({
        type: 'circle',
        size: 12,
        fill: '#48C7E8',
        opacity: cOp,
        positioned: { left: centerNode.x + centerNode.w - 6, top: centerNode.y + centerNode.h / 2 - 6 },
      });
    }

    // ---- Render Satellite Cards (with Real App Icons & Logos) --------------
    for (var i = 0; i < satelliteNodes.length; i++) {
      var n = satelliteNodes[i];
      var pop = tw(n.at, 20, 0, 1, 'backOut');
      var op = tw(n.at, 12, 0, 1, 'easeOut');
      if (op <= 0.01) continue;

      // Card ambient glow behind
      kids.push({
        type: 'rect',
        width: n.w,
        height: n.h,
        radius: 14,
        fill: n.wireCol,
        opacity: 0.12 * op,
        blur: 16,
        positioned: { left: n.x, top: n.y },
      });

      // Card solid body
      kids.push({
        type: 'rect',
        width: n.w,
        height: n.h,
        radius: 14,
        fill: '#0C1220',
        stroke: '#24324F',
        strokeWidth: 1.5,
        opacity: op,
        positioned: { left: n.x, top: n.y },
      });

      // App Icon Badge (Color Square with Letter or Icon)
      kids.push({
        type: 'rect',
        width: 34,
        height: 34,
        radius: 8,
        fill: n.iconBg,
        opacity: op,
        positioned: { left: n.x + 16, top: n.y + 14 },
      });
      kids.push({
        type: 'text',
        text: n.iconLetter,
        opacity: op,
        style: {
          fontSize: 18,
          color: '#FFFFFF',
          fontFamily: 'Roboto',
          fontWeight: '700',
          textAlign: 'center',
        },
        positioned: { left: n.x + 16, top: n.y + 20, width: 34 },
      });

      // App / Platform Title
      kids.push({
        type: 'text',
        text: n.title,
        opacity: op,
        style: {
          fontSize: 17,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        positioned: { left: n.x + 60, top: n.y + 20 },
      });

      // Subtitle
      kids.push({
        type: 'text',
        text: n.sub,
        opacity: op,
        style: {
          fontSize: 12,
          color: '#8A99B0',
          fontFamily: 'Roboto',
          fontWeight: '500',
        },
        positioned: { left: n.x + 16, top: n.y + 58 },
      });

      // Bottom stat line
      kids.push({
        type: 'text',
        text: n.stat,
        opacity: op,
        style: {
          fontSize: 11,
          color: n.wireCol,
          fontFamily: 'monospace',
          fontWeight: '600',
        },
        positioned: { left: n.x + 16, top: n.y + 84 },
      });

      // Socket dot
      var portOnLeft = (n.x > 770);
      kids.push({
        type: 'circle',
        size: 9,
        fill: n.wireCol,
        opacity: op,
        positioned: { left: portOnLeft ? n.x - 4 : n.x + n.w - 5, top: n.y + n.h / 2 - 4 },
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
