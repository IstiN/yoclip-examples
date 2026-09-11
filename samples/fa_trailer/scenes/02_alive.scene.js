// 02 — Alive — Tactical Cyber-Terminal Orchestrator.
//
// Exactly matching the iconic sci-fi cyberterminal reference (clip_1789120714258.png):
//   · CRT cyberterminal monitor environment with subtle raster scanlines and phosphor glow
//   · Top header: `FA AUTONOMOUS AGENT ORCHESTRATOR V.2.5` + network routing subline
//   · Left sidebar: `V.2.5 TOOL SET` with tactical vertical dock containing glowing tool icons
//   · Right sidebar: `INPUT ROUTING` + 1..41 graduated ladder meter with animated phosphor levels
//   · Center: Cascading staggered cyber HUD windows with thick glowing cyan corner brackets
//   · Back window: `AGENT_DISPATCH.AST` hardware entity declaration
//   · Front active window: `FA_CORE_RUNTIME` with our beloved code:
//       - `fa.dispatch({ workers: [Coder, Reviewer, Tester], cube: CubePresets.l2Full })`
//       - `if (user.isTired) { coffee.brew(); terminal.takeOver(); agent.whisper("Go to sleep, I will ship."); }`
//       - `final agent = await Fa.boot();`
//       - `( > _ - )` living companion wink with smile `_` and specular star burst!
//   · Finale: Metallic Impact typography slams in: `IT LIVES IN YOUR CODE.`

scene = {
  id: '02_alive',
  duration: 192,
  from: 362,
  timeline: {
    label: 'Alive (Cyber-Terminal)',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function clamp01(v) {
      return Math.min(Math.max(v, 0), 1);
    }

    var kids = [];

    // ------------------------------------------------------------------------
    // Helper: Make Tactical Cyber Window SVG with Fa Branded Corner Brackets
    // ------------------------------------------------------------------------
    function makeCyberWindowSvg(w, h, cornerArm, r, strokeColor, showBeam, beamOpacity) {
      var arm = cornerArm || 120;
      var rad = r || 16;
      var stroke = strokeColor || '#2EBD9E';
      var beamOp = beamOpacity || 0.35;

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
      svg += '<rect x="4" y="4" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="' + rad + '" fill="none" stroke="#3B4F76" stroke-opacity="0.45" stroke-width="1.5" />';

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
    // 1. Cyber CRT Background & Scanline Ambience (Fa Branded Tones)
    // ------------------------------------------------------------------------
    // Pitch midnight cyber background
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: '#050811',
      positioned: { left: 0, top: 0 },
    });

    // Deep Fa Royal Violet Ambience in Center
    kids.push({
      type: 'circle',
      size: 1400,
      color: '#1E1242',
      blur: 240,
      opacity: 0.35,
      positioned: { left: 260, top: -160 },
    });

    // Fa Emerald Teal Phosphor Bloom on Top-Right
    kids.push({
      type: 'circle',
      size: 900,
      color: '#0F3832',
      blur: 200,
      opacity: 0.28,
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

    // CRT Screen Bezel / Border Frame in Fa Hardware Trim
    kids.push({
      type: 'rect',
      width: 1888,
      height: 1048,
      fill: 'none',
      border: {
        color: '#3B4F76',
        width: 1.5,
      },
      radius: 12,
      opacity: 0.45,
      positioned: { left: 16, top: 16 },
    });

    // ------------------------------------------------------------------------
    // 2. Top Header Bar (Fa Branded Colors)
    // ------------------------------------------------------------------------
    var topAlpha = clamp01(tw(0, 15, 0, 1, 'easeOut'));
    kids.push({
      type: 'text',
      text: 'FA AUTONOMOUS AGENT ORCHESTRATOR V.2.5  [FA_CORE.RUN]',
      style: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#8F6BFF',
        letterSpacing: 2.2,
      },
      opacity: topAlpha,
      positioned: { left: 48, top: 38 },
    });

    kids.push({
      type: 'text',
      text: 'IP: 127.0.0.1   PROTOCOL: A2A-RPC   ROUTER: HERMETIC   SERVICE: COMPANION   INTERRUPT: READY   QUERY: LIVE',
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        fontFamily: 'monospace',
        color: '#7A8CB6',
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
      fill: '#5B61F6',
      opacity: topAlpha * 0.35,
      positioned: { left: 48, top: 96 },
    });

    // ------------------------------------------------------------------------
    // 3. Left Sidebar: "V.2.5 TOOL SET" & Vertical Tactical Dock (Fa Branded)
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
        color: '#2EBD9E',
        letterSpacing: 1.8,
      },
      opacity: leftAlpha,
      positioned: { left: dockX, top: 124 },
    });

    // Vertical Rounded Dock Container
    kids.push({
      type: 'rect',
      width: 64,
      height: 640,
      fill: '#0A0F1D',
      border: {
        color: '#3B4F76',
        width: 1.5,
      },
      radius: 12,
      opacity: leftAlpha * 0.9,
      positioned: { left: dockX, top: 152 },
    });

    // Tactical Tool Icons inside Dock
    var toolIcons = [
      { label: '>_', name: 'TERMINAL' },
      { label: '{ }', name: 'AST' },
      { label: 'Fa', name: 'CORE', isFa: true },
      { label: 'MEM', name: 'STORE' },
      { label: 'GPU', name: 'IMPELLER' },
      { label: 'A2A', name: 'MESH' },
      { label: 'BOX', name: 'CUBE' },
      { label: 'SEC', name: 'ARMOR' },
    ];

    for (var ti = 0; ti < toolIcons.length; ti++) {
      var iconY = 168 + ti * 74;
      var isHighlighted = (ti === 0 || ti === 2 || ti === 4);

      // Icon button frame
      kids.push({
        type: 'rect',
        width: 46,
        height: 54,
        fill: isHighlighted ? 'rgba(91, 97, 246, 0.22)' : 'rgba(13, 20, 36, 0.65)',
        border: {
          color: isHighlighted ? '#8F6BFF' : '#1E2B45',
          width: 1.2,
        },
        radius: 6,
        opacity: leftAlpha,
        positioned: { left: dockX + 9, top: iconY },
      });

      if (toolIcons[ti].isFa) {
        // Embed official Fa brand mark inside the CORE button!
        kids.push(faLogoSvgNode(dockX + 32, iconY + 18, 18, leftAlpha));
      } else {
        // Icon symbol
        kids.push({
          type: 'text',
          text: toolIcons[ti].label,
          style: {
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: isHighlighted ? '#FFFFFF' : '#7A8CB6',
            letterSpacing: 1.0,
          },
          opacity: leftAlpha,
          positioned: { left: dockX + 16, top: iconY + 12 },
        });
      }

      // Icon tiny sub-label
      kids.push({
        type: 'text',
        text: toolIcons[ti].name,
        style: {
          fontSize: 7.5,
          fontWeight: 'normal',
          fontFamily: 'monospace',
          color: isHighlighted ? '#2EBD9E' : '#4E6088',
          letterSpacing: 0.5,
        },
        opacity: leftAlpha * 0.9,
        positioned: { left: dockX + 14, top: iconY + 34 },
      });
    }

    // ------------------------------------------------------------------------
    // 4. Right Sidebar: "INPUT ROUTING" & Graduated 1..41 Ladder Meter (Fa Branded)
    // ------------------------------------------------------------------------
    var rightAlpha = clamp01(tw(8, 20, 0, 1, 'easeOut'));
    var rightSlide = tw(8, 20, 30, 0, 'easeOut');
    var routX = 1440 + rightSlide;
    var ladderX = 1640 + rightSlide;

    // Routing Header
    kids.push({
      type: 'text',
      text: 'INPUT ROUTING',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#2EBD9E',
        letterSpacing: 1.8,
      },
      opacity: rightAlpha,
      positioned: { left: routX, top: 124 },
    });

    // Routing Channels List
    var channels = [
      { name: 'LOCAL AST', active: true },
      { name: 'LOCAL 2', active: false },
      { name: 'SAT - AL42', active: false },
      { name: 'SAT - J198', active: true },
      { name: 'NETWORK A', active: true },
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
          color: ch.active ? '#2EBD9E' : '#4E6088',
          letterSpacing: 1.2,
        },
        opacity: rightAlpha * (ch.active ? 1.0 : 0.6),
        positioned: { left: routX, top: chY },
      });
    }

    // Graduated Ladder Scale (1 to 41) exactly matching screenshot!
    var ladderTopY = 152;
    var ladderStep = 17; // 41 steps = ~700px height

    // Vertical spine rail line
    kids.push({
      type: 'rect',
      width: 2,
      height: 41 * ladderStep,
      fill: '#5B61F6',
      opacity: rightAlpha * 0.5,
      positioned: { left: ladderX, top: ladderTopY },
    });

    // Ladder ticks and numbers
    for (var step = 1; step <= 41; step++) {
      var tickY = ladderTopY + (step - 1) * ladderStep;
      // Animate dynamic audio level bars pulsing with the frame
      var pulseFreq = (step * 0.35 + frame * 0.18);
      var barLen = Math.floor(6 + Math.abs(Math.sin(pulseFreq)) * (step > 15 && step < 32 ? 42 : 18));
      var isLit = (step >= 12 && step <= 36);

      // Number label (1..41)
      kids.push({
        type: 'text',
        text: (step < 10 ? '0' : '') + step,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          color: isLit ? '#2EBD9E' : '#2A3C5E',
          letterSpacing: 0.5,
        },
        opacity: rightAlpha * (isLit ? 0.95 : 0.5),
        positioned: { left: ladderX - 22, top: tickY - 2 },
      });

      // Horizontal Fa teal/violet level bar
      kids.push({
        type: 'rect',
        width: barLen,
        height: 2,
        fill: isLit ? '#2EBD9E' : '#5B61F6',
        opacity: rightAlpha * (isLit ? 0.9 : 0.4),
        positioned: { left: ladderX + 6, top: tickY + 3 },
      });
    }

    // Bottom Strength Label
    kids.push({
      type: 'text',
      text: 'STRENGTH : 98.4%',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#2EBD9E',
        letterSpacing: 1.5,
      },
      opacity: rightAlpha,
      positioned: { left: routX, top: ladderTopY + 41 * ladderStep + 16 },
    });

    // ------------------------------------------------------------------------
    // 5. Center Stage: Cascading Tactical Cyber Windows
    // ------------------------------------------------------------------------
    // Depth camera dolly / floating drift
    var camT = tw(0, 180, 0, 1, 'linear');
    var camScale = lerp(0.97, 1.02, camT);

    // --- WINDOW 1 (Behind, shifted top-left) ---
    var w1Alpha = Math.min(Math.max(tw(10, 25, 0, 0.82, 'easeOut'), 0), 0.82);
    var w1Scale = tw(10, 25, 0.92, 1.0, 'easeOut') * camScale;
    var w1W = 660;
    var w1H = 640;
    var w1X = 440;
    var w1Y = 140;

    // Window 1 SVG Background + Corner Brackets in Fa Violet
    kids.push({
      type: 'svg',
      data: makeCyberWindowSvg(w1W, w1H, 120, 16, '#5B61F6', false, 0),
      width: w1W,
      height: w1H,
      scale: w1Scale,
      opacity: w1Alpha,
      positioned: { left: w1X, top: w1Y },
    });

    // Window 1 Header Tab
    kids.push({
      type: 'text',
      text: 'KEY_GEN_REG [Process] // AGENT_DISPATCH',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#7A8CB6',
        letterSpacing: 1.4,
      },
      opacity: w1Alpha * 0.8,
      positioned: { left: w1X + 44, top: w1Y + 28 },
    });

    // Window 1 VHDL Background Code
    var w1Lines = [
      'USE IEEE.STD_LOGIC_1164.ALL;',
      'USE IEEE.STD_LOGIC_ARITH.ALL;',
      '------------------------------------------------',
      'ENTITY AGENT_DISPATCH_KEY IS',
      'PORT (',
      '    DISPATCH_SEL : IN  STD_LOGIC;',
      '    CHIP_EN      : IN  STD_LOGIC;',
      '    ADDR         : IN  STD_LOGIC_VECTOR(7 DOWNTO 0);',
      '    CODER_CHAN   : OUT STD_LOGIC_VECTOR(6 DOWNTO 0);',
      '    REVIEW_CHAN  : OUT STD_LOGIC_VECTOR(6 DOWNTO 0);',
      '    TEST_CHAN    : OUT STD_LOGIC_VECTOR(6 DOWNTO 0);',
      '    CUBE_SANDBOX : IN  STD_LOGIC_VECTOR(7 DOWNTO 0)',
      ');',
      'END AGENT_DISPATCH_KEY;',
    ];

    for (var li = 0; li < w1Lines.length; li++) {
      kids.push({
        type: 'text',
        text: w1Lines[li],
        style: {
          fontSize: 11.5,
          fontFamily: 'monospace',
          color: '#3B4F76',
          letterSpacing: 1.1,
        },
        opacity: w1Alpha * 0.7,
        positioned: { left: w1X + 44, top: w1Y + 68 + li * 22 },
      });
    }

    // --- WINDOW 2 (Front Active, shifted down-right) ---
    // Matches screenshot foreground active window with Fa branded teal corner brackets & violet beam
    var w2Alpha = clamp01(tw(18, 30, 0, 1, 'easeOut'));
    var w2Scale = tw(18, 30, 0.94, 1.0, 'easeOut') * camScale;
    var w2W = 680;
    var w2H = 700;
    var w2X = 530;
    var w2Y = 210;

    // Window 2 SVG with Prominent Glowing Fa Teal Corner Brackets & Fa Violet Beam
    kids.push({
      type: 'svg',
      data: makeCyberWindowSvg(w2W, w2H, 160, 18, '#2EBD9E', true, 0.48),
      width: w2W,
      height: w2H,
      scale: w2Scale,
      opacity: w2Alpha,
      positioned: { left: w2X, top: w2Y },
    });

    // Window 2 Header: Status dot + Title
    kids.push({
      type: 'circle',
      size: 10,
      color: '#2EBD9E',
      opacity: w2Alpha,
      positioned: { left: w2X + 44, top: w2Y + 30 },
    });

    kids.push({
      type: 'text',
      text: 'ENTITY FA_CORE // FA_CORE.EXE [ACTIVE]',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#8F6BFF',
        letterSpacing: 1.8,
      },
      opacity: w2Alpha,
      positioned: { left: w2X + 64, top: w2Y + 28 },
    });

    // Window 2 Inner Divider
    kids.push({
      type: 'rect',
      width: w2W - 88,
      height: 1,
      fill: '#5B61F6',
      opacity: w2Alpha * 0.35,
      positioned: { left: w2X + 44, top: w2Y + 54 },
    });

    // Window 2 Active Code Lines with Fa Branded Syntax Coloring
    var codeLines = [
      { text: 'USE IEEE.STD_LOGIC_1164.ALL;  -- HERMETIC AST DISPATCH', color: '#7A8CB6' },
      { text: '------------------------------------------------------------------', color: '#3B4F76' },
      { text: 'final job = await fa.dispatch({', color: '#8F6BFF', bold: true },
      { text: '  goal: "Build 120 FPS pipeline, verify zero regressions",', color: '#2EBD9E' },
      { text: '  workers: [ Coder, Reviewer, Tester ],', color: '#2EBD9E' },
      { text: '  cube: CubePresets.l2Full, // isolated sandbox', color: '#A092ED' },
      { text: '  security: Tier.threeProtected,', color: '#7A8CB6' },
      { text: '});', color: '#8F6BFF', bold: true },
      { text: '', color: '#000000' },
      { text: '// Living companion: watches your back', color: '#7A8CB6' },
      { text: 'if (user.isTired) {', color: '#8F6BFF', bold: true },
      { text: '  coffee.brew();', color: '#2EBD9E' },
      { text: '  terminal.takeOver();', color: '#2EBD9E' },
      { text: '  agent.whisper("Go to sleep, I will ship.");', color: '#D0C4FF' },
      { text: '}', color: '#8F6BFF', bold: true },
      { text: '', color: '#000000' },
      { text: '// FA CORE RUNTIME: IT IS ALIVE', color: '#2EBD9E', bold: true },
      { text: 'final livingAgent = await Fa.boot();', color: '#8F6BFF' },
    ];

    var codeTopY = w2Y + 68;
    var lineH = 24;

    for (var cli = 0; cli < codeLines.length; cli++) {
      if (!codeLines[cli].text) continue;
      // Staggered typing reveal
      var lineAlpha = clamp01(tw(20 + cli * 2.2, 8, 0, 1, 'easeOut'));
      kids.push({
        type: 'text',
        text: codeLines[cli].text,
        style: {
          fontSize: 12.5,
          fontWeight: codeLines[cli].bold ? 'bold' : 'normal',
          fontFamily: 'monospace',
          color: codeLines[cli].color,
          letterSpacing: 1.0,
        },
        opacity: w2Alpha * lineAlpha,
        positioned: { left: w2X + 36, top: codeTopY + cli * lineH },
      });
    }

    // ------------------------------------------------------------------------
    // 6. Living Kaomoji Wink `( > _ - )` with Smile `_` & Specular Flare
    // ------------------------------------------------------------------------
    var winkY = codeTopY + 18 * lineH;
    var winkAlpha = clamp01(tw(55, 12, 0, 1, 'easeOut'));

    // Is eye winking?
    var isWinking = frame >= 85;

    // Face components
    kids.push({
      type: 'text',
      text: '( > ',
      style: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#FFFFFF',
        letterSpacing: 1.5,
      },
      opacity: w2Alpha * winkAlpha,
      positioned: { left: w2X + 36, top: winkY },
    });

    // Canonical Fa brand smile `_` in Teal '#2EBD9E'
    kids.push({
      type: 'rect',
      width: 14,
      height: 4.5,
      fill: '#2EBD9E',
      radius: 2.2,
      opacity: w2Alpha * winkAlpha,
      positioned: { left: w2X + 80, top: winkY + 14 },
    });

    // Right eye (winking into `-` at frame 85 in Fa violet '#8F6BFF')
    kids.push({
      type: 'text',
      text: (isWinking ? ' - ' : ' o ') + ')',
      style: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isWinking ? '#8F6BFF' : '#FFFFFF',
        letterSpacing: 1.5,
      },
      opacity: w2Alpha * winkAlpha,
      positioned: { left: w2X + 98, top: winkY },
    });

    // Label: `// IT IS ALIVE: watching your back`
    kids.push({
      type: 'text',
      text: '// IT IS ALIVE: watching your back',
      style: {
        fontSize: 12.5,
        fontWeight: 'normal',
        fontFamily: 'monospace',
        color: '#2EBD9E',
        letterSpacing: 1.1,
      },
      opacity: w2Alpha * winkAlpha * 0.9,
      positioned: { left: w2X + 154, top: winkY + 2 },
    });

    // Next line: `livingAgent.wink(eye: Eye.right); // emotions built in`
    var callY = winkY + 26;
    kids.push({
      type: 'text',
      text: 'livingAgent.wink(eye: Eye.right); // emotions built in',
      style: {
        fontSize: 12.5,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: '#8F6BFF',
        letterSpacing: 1.1,
      },
      opacity: w2Alpha * clamp01(tw(65, 12, 0, 1, 'easeOut')),
      positioned: { left: w2X + 36, top: callY },
    });

    // Next line: `return Fa.runLocally(gpu: "Metal/Impeller", fps: 120);`
    var gpuY = callY + 24;
    kids.push({
      type: 'text',
      text: 'return Fa.runLocally(gpu: "Metal/Impeller", fps: 120);',
      style: {
        fontSize: 12.5,
        fontWeight: 'normal',
        fontFamily: 'monospace',
        color: '#2EBD9E',
        letterSpacing: 1.1,
      },
      opacity: w2Alpha * clamp01(tw(72, 12, 0, 1, 'easeOut')),
      positioned: { left: w2X + 36, top: gpuY },
    });

    // Specular Star Burst on eye when winking (frame 85..120)
    if (frame >= 85 && frame <= 125) {
      var flareT = tw(85, 30, 0, 1, 'easeOut');
      var flareScale = Math.sin(flareT * Math.PI) * 1.4;
      var flareOp = Math.sin(flareT * Math.PI);
      if (flareScale > 0.05) {
        kids.push({
          type: 'circle',
          size: 40 * flareScale,
          color: '#8F6BFF',
          blur: 14,
          opacity: flareOp * 0.9,
          positioned: { left: w2X + 104 - 20 * flareScale, top: winkY + 8 - 20 * flareScale },
        });
        kids.push({
          type: 'circle',
          size: 14 * flareScale,
          color: '#FFFFFF',
          opacity: flareOp,
          positioned: { left: w2X + 104 - 7 * flareScale, top: winkY + 8 - 7 * flareScale },
        });
      }
    }

    // ------------------------------------------------------------------------
    // 7. Tactical Scanning Cursor / Gliding Pointer (Fa Branded)
    // ------------------------------------------------------------------------
    var curT = tw(30, 90, 0, 1, 'easeInOut');
    var curX = lerp(w2X + 60, w2X + 280, curT);
    var curY = lerp(codeTopY + 40, callY + 10, curT);
    var curBlink = Math.sin(frame * 0.45) > -0.2 ? 1 : 0;

    // Glowing Neon Cursor Dot in Fa Violet & Teal
    kids.push({
      type: 'circle',
      size: 12,
      color: '#8F6BFF',
      blur: 8,
      opacity: w2Alpha * curBlink * 0.85,
      positioned: { left: curX - 6, top: curY - 6 },
    });
    kids.push({
      type: 'circle',
      size: 4,
      color: '#2EBD9E',
      opacity: w2Alpha * curBlink,
      positioned: { left: curX - 2, top: curY - 2 },
    });

    // ------------------------------------------------------------------------
    // 8. Finale: Statement Slams In: "IT LIVES IN YOUR CODE."
    // ------------------------------------------------------------------------
    var slamAt = 125;
    if (frame >= slamAt) {
      var slamProgress = tw(slamAt, 16, 0, 1, 'easeOut');
      var slamScale = lerp(1.5, 1.0, slamProgress);
      var slamAlpha = clamp01(slamProgress * 1.5);

      // Dark solid backing scrim for crisp readability
      kids.push({
        type: 'rect',
        width: 1920,
        height: 260,
        fill: '#040711',
        opacity: slamAlpha * 0.98,
        positioned: { left: 0, top: 410 },
      });

      // Fa Violet & Teal accent framing lines
      kids.push({
        type: 'rect',
        width: 1920,
        height: 2,
        fill: '#8F6BFF',
        opacity: slamAlpha * 0.9,
        positioned: { left: 0, top: 410 },
      });
      kids.push({
        type: 'rect',
        width: 1920,
        height: 2,
        fill: '#2EBD9E',
        opacity: slamAlpha * 0.9,
        positioned: { left: 0, top: 670 },
      });

      // Metallic Titanium Gradient for Slam Title
      var silverGrad = {
        type: 'linear',
        begin: 'topCenter',
        end: 'bottomCenter',
        colors: ['#FFFFFF', '#ECECEF', '#C2C2CC', '#8A8A96'],
        stops: [0.0, 0.42, 0.72, 1.0],
      };

      kids.push({
        type: 'text',
        text: 'IT LIVES IN YOUR CODE.',
        width: 1920,
        textAlign: 'center',
        style: {
          fontSize: 92,
          fontWeight: 'bold',
          fontFamily: 'Impact',
          letterSpacing: 2.5,
          gradient: silverGrad,
        },
        scale: slamScale,
        opacity: slamAlpha,
        positioned: { left: 0, top: 460 },
      });

      // Sub-kicker in Fa Teal '#2EBD9E'
      var subAlpha = clamp01(tw(slamAt + 14, 18, 0, 1, 'easeOut'));
      kids.push({
        type: 'text',
        text: 'AUTONOMOUS  ·  OFFLINE FIRST  ·  A2A AGENT FABRIC',
        width: 1920,
        textAlign: 'center',
        style: {
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: '#2EBD9E',
          letterSpacing: 4.5,
        },
        opacity: subAlpha,
        positioned: { left: 0, top: 585 },
      });
    }

    return {
      type: 'stack',
      children: kids,
    };
  },
};
