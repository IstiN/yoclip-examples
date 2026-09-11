// 01b — Prompt: The Creator's Directive.
//
// Narrative beat: Following the Fa mark awakening in 01_dark, the creator
// inputs the ultimate agent specification on a tactical command terminal.
// In high-tech cyber-HUD environment (cohesive with 02_alive), the directive
// is typed out with crisp modern typography (no retro '>'), live specification
// matrix modules illuminate, and a heavy [ENTER] click triggers the live system boot.

scene = {
  id: '01b_prompt',
  duration: 150, // 5.0 seconds at 30 fps
  description: 'Cyber-tactical directive intake screen: creator inputs the ultimate agent prompt, architecture modules illuminate, and [ENTER] triggers the live system boot into 02_alive.',

  timeline: {
    label: 'Prompt',
    color: '#5B61F6',
    lane: 'video',
  },

  render: function(frame) {
    var jsr = globalThis.jsr;
    var ms = elapsedMs(frame, 30);
    var clamp01 = function(v) { return Math.max(0, Math.min(1, v)); };
    var lerp = function(a, b, t) { return a + (b - a) * t; };

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    // ---- Strict Fa Brand Palette (Pure Obsidian Hardware + Royal Violet + Emerald Teal) ----
    var C_VIOLET = '#5B61F6';
    var C_VIOLET_LIGHT = '#8F6BFF';
    var C_VIOLET_PALE = '#C4B5FD';
    var C_TEAL = '#2EBD9E';
    var C_WHITE = '#FFFFFF';
    var C_TITANIUM = '#ECECEF';
    var C_SILVER = '#A0AFC4';
    var C_MUTED = '#606B82';
    var C_DIM = '#7A8CB6';
    var C_BORDER_GLOW = '#3B4F76';

    // Obsidian Slate Hardware Surfaces (NO blue tint)
    var C_BG_WORLD = '#050811';
    var C_BG_CARD = '#0B0F19';
    var C_BG_HEADER = '#101522';
    var C_BG_PILL = '#141A29';
    var C_BORDER = '#1E2638';

    // Camera / Terminal Entrance & Exit
    var enterT = tw(0, 16, 0, 1, 'easeOutCubic');
    var exitT = tw(136, 14, 0, 1, 'easeInOutExpo');

    var termOpacity = clamp01(enterT * (1 - 0.15 * exitT));

    var kids = [];

    // Helper: Window Frame SVG with 4 Distinctive Glowing Corner Brackets
    function renderWindowSvg(w, h, stroke, showBeam, beamOp) {
      beamOp = (beamOp !== undefined) ? beamOp : 0.28;
      var rad = 14;
      var arm = 48; // long glowing bracket arms
      var svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">';
      svg += '<defs>';
      svg += '  <linearGradient id="bgGrad_' + w + '_' + h + '" x1="0" y1="0" x2="0" y2="1">';
      svg += '    <stop offset="0%" stop-color="#0A0F1D" stop-opacity="0.94" />';
      svg += '    <stop offset="50%" stop-color="#0D1424" stop-opacity="0.97" />';
      svg += '    <stop offset="100%" stop-color="#060912" stop-opacity="0.99" />';
      svg += '  </linearGradient>';
      if (showBeam) {
        svg += '  <radialGradient id="beam_' + w + '_' + h + '" cx="82%" cy="14%" r="65%">';
        svg += '    <stop offset="0%" stop-color="#8F6BFF" stop-opacity="' + beamOp + '" />';
        svg += '    <stop offset="35%" stop-color="#2EBD9E" stop-opacity="' + (beamOp * 0.45) + '" />';
        svg += '    <stop offset="100%" stop-color="#000000" stop-opacity="0" />';
        svg += '  </radialGradient>';
      }
      svg += '</defs>';

      // Translucent Window Body
      svg += '<rect x="4" y="4" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="' + rad + '" fill="url(#bgGrad_' + w + '_' + h + ')" />';
      if (showBeam) {
        svg += '<rect x="4" y="4" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="' + rad + '" fill="url(#beam_' + w + '_' + h + ')" />';
      }

      // Fa Structural Hardware Border Frame
      svg += '<rect x="4" y="4" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="' + rad + '" fill="none" stroke="' + C_BORDER_GLOW + '" stroke-opacity="0.45" stroke-width="1.5" />';

      // 4 Distinctive Thick Glowing Corner Brackets with Extended Arms
      // Top-Left
      svg += '<path d="M 4,' + arm + ' L 4,' + (rad + 4) + ' Q 4,4 ' + (rad + 4) + ',4 L ' + arm + ',4" fill="none" stroke="' + stroke + '" stroke-width="5" stroke-linecap="round" />';
      // Top-Right
      svg += '<path d="M ' + (w - arm) + ',4 L ' + (w - 4 - rad) + ',4 Q ' + (w - 4) + ',4 ' + (w - 4) + ',' + (rad + 4) + ' L ' + (w - 4) + ',' + arm + '" fill="none" stroke="' + stroke + '" stroke-width="5" stroke-linecap="round" />';
      // Bottom-Left
      svg += '<path d="M 4,' + (h - arm) + ' L 4,' + (h - 4 - rad) + ' Q 4,' + (h - 4) + ' ' + (rad + 4) + ',' + (h - 4) + ' L ' + arm + ',' + (h - 4) + '" fill="none" stroke="' + stroke + '" stroke-width="5" stroke-linecap="round" />';
      // Bottom-Right
      svg += '<path d="M ' + (w - arm) + ',' + (h - 4) + ' L ' + (w - 4 - rad) + ',' + (h - 4) + ' Q ' + (w - 4) + ',' + (h - 4) + ' ' + (w - 4) + ',' + (h - 4 - rad) + ' L ' + (w - 4) + ',' + (h - arm) + '" fill="none" stroke="' + stroke + '" stroke-width="5" stroke-linecap="round" />';

      svg += '</svg>';
      return svg;
    }

    // ------------------------------------------------------------------------
    // 1. Cyber CRT Background & Scanline Ambience (Cohesive with 02_alive)
    // ------------------------------------------------------------------------
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: C_BG_WORLD,
      positioned: { left: 0, top: 0 },
    });

    // Deep Fa Royal Violet Ambience
    kids.push({
      type: 'circle',
      size: 1400,
      color: '#1E1242',
      blur: 240,
      opacity: 0.35 * termOpacity,
      positioned: { left: 260, top: -160 },
    });

    // Fa Emerald Teal Phosphor Bloom on Top-Right
    kids.push({
      type: 'circle',
      size: 900,
      color: '#0F3832',
      blur: 200,
      opacity: 0.28 * termOpacity,
      positioned: { left: 1100, top: 40 },
    });

    // CRT Scanlines across the screen
    var scanlinesSvg = '<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">';
    for (var sy = 0; sy < 1080; sy += 5) {
      scanlinesSvg += '<line x1="0" y1="' + sy + '" x2="1920" y2="' + sy + '" stroke="#5B61F6" stroke-width="0.8" stroke-opacity="0.04" />';
    }
    scanlinesSvg += '</svg>';

    kids.push({
      type: 'svg',
      data: scanlinesSvg,
      width: 1920,
      height: 1080,
      positioned: { left: 0, top: 0 },
    });

    // CRT Screen Bezel Frame
    kids.push({
      type: 'rect',
      width: 1888,
      height: 1048,
      fill: 'none',
      border: { color: C_BORDER_GLOW, width: 1.5 },
      radius: 12,
      opacity: 0.45 * termOpacity,
      positioned: { left: 16, top: 16 },
    });

    // ------------------------------------------------------------------------
    // 2. Top Header Bar (Cohesive with 02_alive)
    // ------------------------------------------------------------------------
    var topAlpha = clamp01(tw(0, 15, 0, 1, 'easeOut'));
    kids.push({
      type: 'text',
      text: 'FA AUTONOMOUS AGENT ORCHESTRATOR V.2.5  [DIRECTIVE_INTAKE.EXE]',
      style: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_VIOLET_LIGHT,
        letterSpacing: 2.2,
      },
      opacity: topAlpha,
      positioned: { left: 48, top: 38 },
    });

    kids.push({
      type: 'text',
      text: 'IP: 127.0.0.1   PROTOCOL: A2A-RPC   ROUTER: HERMETIC   DIRECTIVE: INTAKE   STATUS: ACTIVE   MODEL: KIMI_K3',
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        fontFamily: 'monospace',
        color: C_DIM,
        letterSpacing: 1.6,
      },
      opacity: topAlpha * 0.85,
      positioned: { left: 48, top: 68 },
    });

    // Thin horizontal divider below header
    kids.push({
      type: 'rect',
      width: 1824,
      height: 1,
      fill: C_VIOLET,
      opacity: topAlpha * 0.35,
      positioned: { left: 48, top: 96 },
    });

    // ------------------------------------------------------------------------
    // 3. Left Sidebar: "V.2.5 TOOL SET" & Vertical Tactical Dock
    // ------------------------------------------------------------------------
    var leftAlpha = clamp01(tw(5, 20, 0, 1, 'easeOut'));
    var leftSlide = tw(5, 20, -30, 0, 'easeOut');
    var dockX = 110 + leftSlide;

    kids.push({
      type: 'text',
      text: 'V.2.5 TOOL SET',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_TEAL,
        letterSpacing: 1.8,
      },
      opacity: leftAlpha,
      positioned: { left: dockX, top: 124 },
    });

    // Vertical Rounded Dock Container
    kids.push({
      type: 'rect',
      width: 64,
      height: 680,
      fill: '#0A0F1D',
      border: { color: C_BORDER_GLOW, width: 1.5 },
      radius: 12,
      opacity: leftAlpha * 0.9,
      positioned: { left: dockX, top: 152 },
    });

    var toolIcons = [
      { label: '>_', name: 'TERMINAL', isActive: true },
      { label: '{ }', name: 'AST' },
      { label: 'Fa', name: 'CORE', isFa: true },
      { label: 'MEM', name: 'STORE' },
      { label: 'GPU', name: 'IMPELLER' },
      { label: 'A2A', name: 'MESH' },
      { label: 'BOX', name: 'CUBE' },
      { label: 'SEC', name: 'ARMOR' },
    ];

    for (var ti = 0; ti < toolIcons.length; ti++) {
      var iconY = 168 + ti * 78;
      var isHighlighted = toolIcons[ti].isActive;

      kids.push({
        type: 'rect',
        width: 46,
        height: 56,
        fill: isHighlighted ? 'rgba(46, 189, 158, 0.22)' : 'rgba(13, 20, 36, 0.65)',
        border: {
          color: isHighlighted ? C_TEAL : C_BORDER_GLOW,
          width: isHighlighted ? 1.5 : 1,
        },
        radius: 8,
        opacity: leftAlpha,
        positioned: { left: dockX + 9, top: iconY },
      });

      kids.push({
        type: 'text',
        text: toolIcons[ti].label,
        style: {
          fontSize: 13,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: isHighlighted ? C_TEAL : '#7A8CB6',
        },
        opacity: leftAlpha,
        positioned: { left: dockX + 17, top: iconY + 10 },
      });

      kids.push({
        type: 'text',
        text: toolIcons[ti].name,
        style: {
          fontSize: 7.5,
          fontWeight: 'normal',
          fontFamily: 'monospace',
          color: isHighlighted ? C_TEAL : '#4E6088',
          letterSpacing: 0.5,
        },
        opacity: leftAlpha * 0.9,
        positioned: { left: dockX + 14, top: iconY + 36 },
      });
    }

    // ------------------------------------------------------------------------
    // 4. Right Sidebar: "INPUT ROUTING" & Telemetry Ladder
    // ------------------------------------------------------------------------
    var rightAlpha = clamp01(tw(8, 20, 0, 1, 'easeOut'));
    var rightSlide = tw(8, 20, 30, 0, 'easeOut');
    var routX = 1440 + rightSlide;
    var ladderX = 1640 + rightSlide;

    kids.push({
      type: 'text',
      text: 'INPUT ROUTING',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_TEAL,
        letterSpacing: 1.8,
      },
      opacity: rightAlpha,
      positioned: { left: routX, top: 124 },
    });

    var channels = [
      { name: 'LOCAL AST', active: true },
      { name: 'K3 REASONING', active: true },
      { name: 'DIRECTIVE INTAKE', active: true },
      { name: 'SAT - J198', active: true },
      { name: 'NETWORK A', active: false },
      { name: 'NETWORK B', active: false },
    ];

    for (var ci = 0; ci < channels.length; ci++) {
      var chY = 152 + ci * 24;
      var ch = channels[ci];
      kids.push({
        type: 'text',
        text: ch.name,
        style: {
          fontSize: 11,
          fontWeight: ch.active ? 'bold' : 'normal',
          fontFamily: 'monospace',
          color: ch.active ? C_TEAL : '#4E6088',
          letterSpacing: 1.2,
        },
        opacity: rightAlpha * (ch.active ? 1.0 : 0.6),
        positioned: { left: routX, top: chY },
      });
    }

    // Telemetry Ladder Scale
    var ladderTopY = 152;
    var ladderStep = 17;
    kids.push({
      type: 'rect',
      width: 1.5,
      height: 680,
      fill: '#3B4F76',
      opacity: rightAlpha * 0.45,
      positioned: { left: ladderX, top: ladderTopY },
    });

    for (var step = 1; step <= 41; step++) {
      var barY = ladderTopY + (step - 1) * ladderStep;
      // Pulse activity with keystrokes / frame
      var isSignal = (step >= 12 && step <= 36 && ((step + Math.floor(frame / 3)) % 4 !== 0));
      var barW = isSignal ? 16 + (step % 5) * 4 : 8;
      var barColor = (step >= 20 && step <= 32) ? C_TEAL : C_VIOLET;

      kids.push({
        type: 'rect',
        width: barW,
        height: 1.5,
        fill: isSignal ? barColor : '#3B4F76',
        opacity: rightAlpha * (isSignal ? 0.95 : 0.35),
        positioned: { left: ladderX + 6, top: barY },
      });

      if (step % 5 === 0 || step === 1 || step === 41) {
        kids.push({
          type: 'text',
          text: (step < 10 ? '0' : '') + step,
          style: {
            fontSize: 8.5,
            fontWeight: 'normal',
            fontFamily: 'monospace',
            color: isSignal ? C_TEAL : '#4E6088',
          },
          opacity: rightAlpha * 0.75,
          positioned: { left: ladderX - 22, top: barY - 5 },
        });
      }
    }

    kids.push({
      type: 'text',
      text: 'DIRECTIVE: PARSED',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_TEAL,
        letterSpacing: 1.4,
      },
      opacity: rightAlpha,
      positioned: { left: routX, top: 820 },
    });

    // ------------------------------------------------------------------------
    // 5. Center Window: DIRECTIVE INTAKE COMMAND TERMINAL
    // ------------------------------------------------------------------------
    var winW = 1180;
    var winH = 700;
    var winX = 224;
    var winY = 142;

    // Outer glow aura
    kids.push({
      type: 'circle',
      size: 900,
      color: '#1E1242',
      blur: 160,
      opacity: 0.35 * termOpacity,
      positioned: { left: winX + (winW - 900) / 2, top: winY + (winH - 900) / 2 },
    });

    // Glassmorphic Hardware Card with Glowing Emerald & Violet Corner Brackets
    kids.push({
      type: 'svg',
      data: renderWindowSvg(winW, winH, C_TEAL, true, 0.24),
      width: winW,
      height: winH,
      opacity: termOpacity,
      positioned: { left: winX, top: winY },
    });

    // Window Header Bar
    kids.push({
      type: 'circle',
      size: 10,
      color: C_TEAL,
      opacity: termOpacity,
      positioned: { left: winX + 40, top: winY + 28 },
    });

    kids.push({
      type: 'text',
      text: 'DIRECTIVE INTAKE // AGENT SPECIFICATION ARCHITECT',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_VIOLET_LIGHT,
        letterSpacing: 1.8,
      },
      opacity: termOpacity,
      positioned: { left: winX + 60, top: winY + 26 },
    });

    // Right Model Pill
    var modelPillW = 190;
    var modelPillX = winX + winW - modelPillW - 36;
    kids.push({
      type: 'rect',
      width: modelPillW,
      height: 28,
      radius: 14,
      fill: C_BG_PILL,
      border: { color: C_TEAL, width: 1 },
      opacity: termOpacity * 0.9,
      positioned: { left: modelPillX, top: winY + 18 },
    });
    kids.push({
      type: 'circle',
      size: 7,
      color: C_TEAL,
      opacity: termOpacity,
      positioned: { left: modelPillX + 14, top: winY + 28.5 },
    });
    kids.push({
      type: 'text',
      text: 'KIMI CLI: K3 [LIVE]',
      opacity: termOpacity,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: C_TEAL,
      },
      positioned: { left: modelPillX + 28, top: winY + 25 },
    });

    // Inner Horizontal Divider below window title
    kids.push({
      type: 'rect',
      width: winW - 72,
      height: 1,
      fill: C_VIOLET,
      opacity: termOpacity * 0.35,
      positioned: { left: winX + 36, top: winY + 54 },
    });

    // ------------------------------------------------------------------------
    // 6. Directive Content Body (NO '>', Modern High-End Layout)
    // ------------------------------------------------------------------------
    var contentLeft = winX + 44;

    // Directive Category Tag
    kids.push({
      type: 'rect',
      width: 172,
      height: 22,
      radius: 4,
      fill: 'rgba(46, 189, 158, 0.12)',
      border: { color: 'rgba(46, 189, 158, 0.35)', width: 1 },
      opacity: termOpacity,
      positioned: { left: contentLeft, top: winY + 74 },
    });
    kids.push({
      type: 'text',
      text: '✦ CORE DIRECTIVE GOAL',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: C_TEAL,
        letterSpacing: 1.2,
      },
      opacity: termOpacity,
      positioned: { left: contentLeft + 12, top: winY + 79 },
    });

    // Main Prompt Directive (Line 0)
    var promptItem = {
      text: 'Build the ultimate coding harness.',
      startF: 14,
      endF: 34,
      color: C_WHITE,
      fontSize: 27,
      fontWeight: '800',
    };

    var caretBlink = (Math.floor(frame / 6) % 2 === 0);

    if (frame >= promptItem.startF) {
      var pProg = clamp01((frame - promptItem.startF) / (promptItem.endF - promptItem.startF));
      var pChars = Math.round(pProg * promptItem.text.length);
      var pText = promptItem.text.substring(0, pChars);

      var isLine0Active = (frame >= promptItem.startF && frame < 36);
      var isLine0Typing = (frame >= promptItem.startF && frame <= promptItem.endF + 2);
      var showLine0Caret = isLine0Active && (isLine0Typing || caretBlink);

      kids.push({
        type: 'text',
        text: pText + (showLine0Caret ? '█' : ''),
        opacity: termOpacity,
        style: {
          fontSize: promptItem.fontSize,
          fontFamily: 'monospace',
          fontWeight: promptItem.fontWeight,
          color: promptItem.color,
          letterSpacing: 0,
        },
        positioned: { left: contentLeft, top: winY + 108 },
      });
    }

    // Thin glowing accent line under headline prompt
    var sepProg = tw(32, 10, 0, 1, 'easeOut');
    if (sepProg > 0.01) {
      kids.push({
        type: 'rect',
        width: (winW - 88) * sepProg,
        height: 1,
        fill: C_BORDER_GLOW,
        opacity: termOpacity * 0.45 * sepProg,
        positioned: { left: contentLeft, top: winY + 154 },
      });
    }

    // Requirements Section Subtitle
    var subProg = tw(34, 8, 0, 1, 'easeOut');
    if (subProg > 0.01) {
      kids.push({
        type: 'text',
        text: 'SYSTEM ARCHITECTURE SPECIFICATIONS // VERIFIED TARGETS',
        style: {
          fontSize: 11,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: C_DIM,
          letterSpacing: 1.4,
        },
        opacity: termOpacity * 0.8 * subProg,
        positioned: { left: contentLeft, top: winY + 168 },
      });
    }

    // Specifications Lines (1..4) — Modern Line Index '01', '02', '03', '04' (NO '>')
    var specLines = [
      {
        tag: '01',
        text: 'Benchmark Copilot, Codex, OpenCode & Kimi CLI.',
        color: C_VIOLET_LIGHT,
        fontSize: 18.5,
        fontWeight: '700',
        startF: 36,
        endF: 56,
      },
      {
        tag: '02',
        text: 'Take Pi & Oh My Pi as the core architecture.',
        color: C_VIOLET_PALE,
        fontSize: 18.5,
        fontWeight: '700',
        startF: 58,
        endF: 76,
      },
      {
        tag: '03',
        text: 'Native Dart & Flutter engine -- macOS, Linux, Windows, iOS, Android & Web.',
        color: C_TITANIUM,
        fontSize: 18.5,
        fontWeight: '700',
        startF: 78,
        endF: 102,
      },
      {
        tag: '04',
        text: 'Persistent git-backed memory + dynamic JS extension ecosystem.',
        color: C_TEAL,
        fontSize: 18.5,
        fontWeight: '700',
        startF: 104,
        endF: 124,
      },
    ];

    var specStartY = winY + 200;
    var specLineH = 46;

    for (var si = 0; si < specLines.length; si++) {
      var sItem = specLines[si];
      var sy = specStartY + si * specLineH;

      if (frame >= sItem.startF) {
        var sProg = clamp01((frame - sItem.startF) / (sItem.endF - sItem.startF));
        var sChars = Math.round(sProg * sItem.text.length);
        var sText = sItem.text.substring(0, sChars);

        var isCurrentSpec = (frame >= sItem.startF && (si === specLines.length - 1 || frame < specLines[si + 1].startF));
        var isSpecTyping = (frame >= sItem.startF && frame <= sItem.endF + 2);
        var showSpecCaret = isCurrentSpec && (isSpecTyping || caretBlink) && frame < 135;

        // Active line glowing left vertical indicator notch
        if (isCurrentSpec && frame < 135) {
          kids.push({
            type: 'rect',
            width: 3,
            height: 24,
            radius: 1.5,
            fill: C_TEAL,
            opacity: termOpacity * 0.9,
            positioned: { left: contentLeft - 12, top: sy - 1 },
          });
        }

        // Clean structured line: "01  Text..."
        var fullLineText = sItem.tag + '  ' + sText + (showSpecCaret ? '█' : '');

        kids.push({
          type: 'text',
          text: fullLineText,
          opacity: termOpacity,
          style: {
            fontSize: sItem.fontSize,
            fontFamily: 'monospace',
            fontWeight: sItem.fontWeight,
            color: sItem.color,
            letterSpacing: 0,
          },
          positioned: { left: contentLeft, top: sy },
        });
      }
    }

    // ------------------------------------------------------------------------
    // 7. Live Architecture Synthesis Matrix (Eliminates the empty void!)
    // ------------------------------------------------------------------------
    var matrixHeaderProg = tw(80, 10, 0, 1, 'easeOut');
    if (matrixHeaderProg > 0.01) {
      kids.push({
        type: 'text',
        text: 'LIVE RESOLVED MODULES // COGNITIVE BLUEPRINT MATRIX',
        style: {
          fontSize: 10.5,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: C_DIM,
          letterSpacing: 1.4,
        },
        opacity: termOpacity * 0.8 * matrixHeaderProg,
        positioned: { left: contentLeft, top: winY + 412 },
      });
    }

    var cards = [
      {
        icon: '⚡',
        title: 'DART & FLUTTER CORE',
        subtitle: '120 FPS NATIVE ENGINE',
        color: C_VIOLET,
        showF: 86,
      },
      {
        icon: '💾',
        title: 'GIT-BACKED MEMORY',
        subtitle: 'DURABLE ATOMIC STORE',
        color: C_TEAL,
        showF: 100,
      },
      {
        icon: '🧩',
        title: 'DYNAMIC JS PLUGINS',
        subtitle: 'QUICKJS FFI RUNTIME',
        color: C_VIOLET_LIGHT,
        showF: 114,
      },
      {
        icon: '🌐',
        title: 'ALL 6 PLATFORMS + WEB',
        subtitle: 'HERMETIC CODEBASE',
        color: C_TEAL,
        showF: 124,
      },
    ];

    var cardW = 254;
    var cardH = 68;
    var cardGap = 24;
    var cardY = winY + 436;

    for (var cdi = 0; cdi < cards.length; cdi++) {
      var cData = cards[cdi];
      var cdProg = tw(cData.showF, 12, 0, 1, 'easeOutBack');
      if (cdProg > 0.01) {
        var cardX = contentLeft + cdi * (cardW + cardGap);

        // Glassmorphic Card Container
        kids.push({
          type: 'rect',
          width: cardW,
          height: cardH,
          radius: 10,
          fill: C_BG_PILL,
          border: { color: cData.color, width: 1.2 },
          opacity: clamp01(cdProg * termOpacity),
          offsetY: 10 * (1 - cdProg),
          positioned: { left: cardX, top: cardY },
        });

        // Corner bracket on card (mini HUD aesthetic)
        kids.push({
          type: 'rect',
          width: 8,
          height: 8,
          radius: 4,
          fill: cData.color,
          opacity: clamp01(cdProg * termOpacity),
          offsetY: 10 * (1 - cdProg),
          positioned: { left: cardX + 16, top: cardY + 18 },
        });

        // Title
        kids.push({
          type: 'text',
          text: cData.title,
          style: {
            fontSize: 11.5,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: C_WHITE,
            letterSpacing: 0.8,
          },
          opacity: clamp01(cdProg * termOpacity),
          offsetY: 10 * (1 - cdProg),
          positioned: { left: cardX + 32, top: cardY + 15 },
        });

        // Subtitle
        kids.push({
          type: 'text',
          text: cData.subtitle,
          style: {
            fontSize: 9.5,
            fontWeight: 'normal',
            fontFamily: 'monospace',
            color: cData.color,
            letterSpacing: 0.6,
          },
          opacity: clamp01(cdProg * termOpacity * 0.9),
          offsetY: 10 * (1 - cdProg),
          positioned: { left: cardX + 32, top: cardY + 38 },
        });
      }
    }

    // ------------------------------------------------------------------------
    // 8. Bottom Action Bar: Status & Dispatch [ENTER] Button
    // ------------------------------------------------------------------------
    var bottomBarY = winY + winH - 74;

    // Divider line above bottom action bar
    kids.push({
      type: 'rect',
      width: winW - 72,
      height: 1,
      fill: C_BORDER_GLOW,
      opacity: termOpacity * 0.35,
      positioned: { left: winX + 36, top: bottomBarY },
    });

    // Left status readout
    var isDispatched = frame >= 135;
    kids.push({
      type: 'circle',
      size: 9,
      color: isDispatched ? '#5CE8CF' : C_TEAL,
      opacity: termOpacity,
      positioned: { left: contentLeft, top: bottomBarY + 26 },
    });

    kids.push({
      type: 'text',
      text: isDispatched ? 'SYSTEM STATUS: DISPATCHED // INITIALIZING FA CORE AGENT ENGINE' : (frame >= 124 ? 'STATUS: ALL DIRECTIVES VERIFIED // READY FOR EXECUTION' : 'STATUS: INTAKE PARSING IN PROGRESS...'),
      style: {
        fontSize: 11.5,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isDispatched ? '#5CE8CF' : (frame >= 124 ? C_TEAL : C_DIM),
        letterSpacing: 1.2,
      },
      opacity: termOpacity,
      positioned: { left: contentLeft + 18, top: bottomBarY + 23 },
    });

    // Dispatch Button with Enter Click Dip
    var btnIn = tw(115, 14, 0, 1, 'easeOutExpo');
    if (btnIn > 0.01) {
      var btnW = 220;
      var btnH = 46;
      var btnX = winX + winW - btnW - 36;
      var btnY = bottomBarY + 14;

      var dipT = 0;
      if (frame >= 135 && frame <= 145) {
        dipT = Math.sin((frame - 135) / 10 * Math.PI);
      }
      var curBtnScale = 1 - 0.08 * dipT;
      var btnGlowA = isDispatched ? 0.45 + 0.15 * Math.sin(frame * 0.5) : 0.20;

      // Glow behind button
      kids.push({
        type: 'rect',
        width: (btnW + 20) * curBtnScale,
        height: (btnH + 20) * curBtnScale,
        radius: 25,
        fill: isDispatched ? C_TEAL : C_VIOLET,
        opacity: btnGlowA * termOpacity,
        positioned: { left: btnX - 10, top: btnY - 10 },
      });

      // Button body
      kids.push({
        type: 'rect',
        width: btnW * curBtnScale,
        height: btnH * curBtnScale,
        radius: 23,
        fill: isDispatched ? C_TEAL : C_VIOLET,
        gradient: isDispatched ? {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: ['#2EBD9E', '#5CE8CF'],
        } : {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: [C_VIOLET, C_TEAL],
        },
        opacity: termOpacity,
        positioned: { left: btnX + (btnW * (1 - curBtnScale)) / 2, top: btnY + (btnH * (1 - curBtnScale)) / 2 },
      });

      // Button text
      kids.push({
        type: 'text',
        text: isDispatched ? 'BOOTING...' : 'DISPATCH [ENTER]',
        opacity: termOpacity,
        style: {
          fontSize: 13,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: C_WHITE,
          letterSpacing: 1.0,
        },
        positioned: { left: btnX + (isDispatched ? 62 : 36), top: btnY + 15 },
      });

      // Shockwave ring on click
      if (frame >= 135) {
        var shockProgress = (frame - 135) / 15;
        var shockR = 25 + shockProgress * 240;
        var shockAlpha = (1 - shockProgress) * 0.7;
        kids.push({
          type: 'rect',
          width: shockR * 2,
          height: shockR * 2,
          radius: shockR,
          fill: '#00000000',
          border: { color: C_TEAL, width: 2.5 },
          opacity: shockAlpha * termOpacity,
          positioned: {
            left: btnX + btnW / 2 - shockR,
            top: btnY + btnH / 2 - shockR,
          },
        });
      }
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
