// 02 — Alive — Floating Glassmorphic Code Panels with Curved Monitor Studio.
//
// Exactly matching the target vision (clip_1789114393082.png):
//   · High-end luxury developer studio with curved ultrawide monitor in background
//   · Two floating frosted glassmorphic HUD panels with code hovering in 3D
//   · Left panel: "SUPERPOWERS" — parallel dispatch, workers, and witty companion code
//   · Right panel: "FA CORE: IT IS ALIVE" — boot, living face, Impeller GPU 120 FPS
//   · Smooth floating physics (ambient bobbing & parallax drift)
//   · Animated neon HUD pointer cursor gliding between panels
//   · Living face winks `( > _ - )` with smile `_` and specular cyan/white star flare
//   · Statement slams in: `IT LIVES IN YOUR CODE.` in metallic Impact typography.

scene = {
  id: '02_alive',
  duration: 180,
  from: 210,
  timeline: {
    label: 'Alive (Floating Code Panels)',
    color: '#00F0FF',
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
      colors: ['#FFFFFF', '#ECECEF', '#C2C2CC', '#8A8A96'],
      stops: [0.0, 0.42, 0.72, 1.0],
    };

    var kids = [];

    // ------------------------------------------------------------------------
    // 1. Studio Background: Curved Ultrawide Monitor in Luxury Developer Setup
    // ------------------------------------------------------------------------
    var camT = tw(0, 180, 0, 1, 'linear');
    var bgScale = lerp(1.06, 1.0, camT);
    var bgOffY = lerp(-15, 0, camT);

    kids.push({
      type: 'image',
      source: 'external:studio_desk',
      width: 1920,
      height: 1080,
      fit: 'cover',
      scale: bgScale,
      offsetY: bgOffY,
      positioned: { left: 0, top: 0 },
    });

    // Dark moody vignette & atmospheric tint over studio desk
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: '#050915',
      opacity: 0.52,
      positioned: { left: 0, top: 0 },
    });

    // Deep volumetric indigo ambient light
    kids.push({
      type: 'circle',
      size: 1400,
      fill: '#0C1322',
      opacity: 0.55,
      blur: 140,
      positioned: { left: 960 - 700, top: 540 - 700 },
    });

    // Anamorphic horizontal cyan streak from monitor & lamp
    var flarePulse = 0.88 + 0.12 * Math.sin((frame / 22) * Math.PI * 2);
    kids.push({
      type: 'rect',
      width: 760,
      height: 28,
      radius: 14,
      fill: '#5B61F6',
      opacity: 0.24 * flarePulse,
      blur: 38,
      positioned: { left: 960 - 380, top: 520 },
    });
    kids.push({
      type: 'rect',
      width: 340,
      height: 12,
      radius: 6,
      fill: '#48C7E8',
      opacity: 0.48 * flarePulse,
      blur: 16,
      positioned: { left: 960 - 170, top: 528 },
    });

    // ------------------------------------------------------------------------
    // 2. Motion & Floating Physics
    // ------------------------------------------------------------------------
    var enterT = tw(0, 36, 0, 1, 'easeOutCubic');
    var fadeOut = tw(158, 22, 0, 1, 'easeInOutCubic');

    // Subtle 3D floating hover (ambient floating)
    var bob1 = Math.sin(frame * 0.055) * 5.0;
    var bob2 = Math.cos(frame * 0.048) * 6.0;

    // Wink timing on Hero Block: frames 98–118
    var winkT = 0;
    if (frame >= 98 && frame <= 118) {
      if (frame < 103) winkT = (frame - 98) / 5;
      else if (frame <= 110) winkT = 1;
      else winkT = 1 - (frame - 110) / 8;
    }

    // Title slam dimming
    var titleDim = tw(125, 20, 0, 1, 'easeOut');
    var panelsOp = (1.0 - titleDim * 0.75) * (1 - fadeOut) * enterT;

    // ------------------------------------------------------------------------
    // Helper: Code Line Builder
    // ------------------------------------------------------------------------
    function buildCodeColumn(lines) {
      var rowWidgets = [];
      for (var li = 0; li < lines.length; li++) {
        var tokens = lines[li];
        var tokenWidgets = [];
        for (var ti = 0; ti < tokens.length; ti++) {
          var txt = tokens[ti][0];
          var col = tokens[ti][1];

          // Dynamic eye resolution on hero face
          if (txt === 'eyeRight') {
            txt = winkT > 0.01 ? '-' : 'o';
            col = '#48C7E8';
          }

          var isFace = (
            txt === '    ( ' || txt === '>' || txt === ' _ ' ||
            txt === 'o' || txt === '-' || txt === ' )'
          );

          tokenWidgets.push({
            type: 'text',
            text: txt,
            style: {
              color: col,
              fontSize: isFace ? 23 : 16,
              fontFamily: 'monospace',
              fontWeight: isFace ? '800' : '500',
            },
          });
        }
        rowWidgets.push({
          type: 'row',
          children: tokenWidgets,
        });
      }
      return {
        type: 'column',
        children: rowWidgets,
      };
    }

    // ------------------------------------------------------------------------
    // 3. LEFT PANEL: "SUPERPOWERS" (Frosted Glass HUD Card)
    // ------------------------------------------------------------------------
    var leftPanelW = 820;
    var leftPanelH = 520;
    var leftPanelX = 80;
    var leftPanelY = 110 + bob1 + (1 - enterT) * 45;

    var leftCodeLines = [
      [
        ['// Autonomous Orchestrator: hermetic dispatch', '#2EBD9E'],
      ],
      [
        ['final ', '#E056FD'],
        ['job = ', '#FFFFFF'],
        ['await fa.', '#FFFFFF'],
        ['dispatch', '#5B61F6'],
        ['({', '#FFFFFF'],
      ],
      [
        ['  goal: ', '#8A99B2'],
        ['"Build 120 FPS pipeline, verify zero regressions"', '#48C7E8'],
        [',', '#FFFFFF'],
      ],
      [
        ['  workers: [', '#FFFFFF'],
        ['Coder', '#5B61F6'],
        [', ', '#FFFFFF'],
        ['Reviewer', '#E056FD'],
        [', ', '#FFFFFF'],
        ['Tester', '#2EBD9E'],
        ['],', '#FFFFFF'],
      ],
      [
        ['  cube: ', '#8A99B2'],
        ['CubePresets.', '#5B61F6'],
        ['l2Full', '#48C7E8'],
        [',  ', '#FFFFFF'],
        ['// isolated sandbox', '#8A99B2'],
      ],
      [
        ['  security: ', '#8A99B2'],
        ['Tier.threeProtected', '#E056FD'],
        [',', '#FFFFFF'],
      ],
      [
        ['});', '#FFFFFF'],
      ],
      [
        ['', '#FFFFFF'],
      ],
      [
        ['// Living companion: watches your back', '#2EBD9E'],
      ],
      [
        ['if ', '#E056FD'],
        ['(user.', '#FFFFFF'],
        ['isTired', '#48C7E8'],
        [') {', '#FFFFFF'],
      ],
      [
        ['  coffee.', '#FFFFFF'],
        ['brew', '#5B61F6'],
        ['();', '#FFFFFF'],
      ],
      [
        ['  terminal.', '#FFFFFF'],
        ['takeOver', '#5B61F6'],
        ['();', '#FFFFFF'],
      ],
      [
        ['  agent.', '#FFFFFF'],
        ['whisper', '#48C7E8'],
        ['(', '#FFFFFF'],
        ['"Go to sleep, I will ship."', '#2EBD9E'],
        [');', '#FFFFFF'],
      ],
      [
        ['}', '#FFFFFF'],
      ],
    ];

    // Left Panel: Soft Ambient Shadow Glow
    kids.push({
      type: 'rect',
      width: leftPanelW,
      height: leftPanelH,
      radius: 20,
      fill: '#5B61F6',
      opacity: 0.16 * panelsOp,
      blur: 36,
      positioned: { left: leftPanelX, top: leftPanelY + 12 },
    });

    // Left Panel: Frosted Glass Surface + Luminous Border
    kids.push({
      type: 'rect',
      width: leftPanelW,
      height: leftPanelH,
      radius: 20,
      fill: '#0A1020',
      opacity: 0.88 * panelsOp,
      border: { color: '#3A4868', width: 1.5 },
      positioned: { left: leftPanelX, top: leftPanelY },
    });

    // Left Panel Content
    kids.push({
      type: 'container',
      width: leftPanelW,
      height: leftPanelH,
      opacity: panelsOp,
      padding: { left: 28, top: 20, right: 28, bottom: 24 },
      positioned: { left: leftPanelX, top: leftPanelY },
      child: {
        type: 'column',
        children: [
          // Header Bar
          {
            type: 'row',
            children: [
              // Window dots
              {
                type: 'row',
                children: [
                  { type: 'circle', size: 11, fill: '#FF5F56', opacity: 0.85 },
                  { type: 'container', width: 6 },
                  { type: 'circle', size: 11, fill: '#FFBD2E', opacity: 0.85 },
                  { type: 'container', width: 6 },
                  { type: 'circle', size: 11, fill: '#27C93F', opacity: 0.85 },
                ],
              },
              { type: 'container', width: 18 },
              // Title
              {
                type: 'text',
                text: 'SUPERPOWERS',
                style: {
                  fontSize: 16,
                  color: '#FFFFFF',
                  fontFamily: 'Impact',
                  fontWeight: '700',
                  letterSpacing: 2.0,
                  gradient: silverGrad,
                },
              },
              { type: 'container', width: 16 },
              // Badge Pill
              {
                type: 'container',
                decoration: {
                  color: 'rgba(91, 97, 246, 0.22)',
                  borderRadius: 12,
                  borderColor: 'rgba(110, 116, 255, 0.5)',
                  borderWidth: 1,
                },
                padding: { left: 10, top: 3, right: 10, bottom: 3 },
                child: {
                  type: 'text',
                  text: 'HERMETIC AST · PARALLEL DISPATCH · A2A',
                  style: {
                    fontSize: 10,
                    color: '#8F94FF',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    letterSpacing: 0.8,
                  },
                },
              },
            ],
          },
          // Divider
          {
            type: 'rect',
            width: leftPanelW - 56,
            height: 1,
            fill: '#243048',
            opacity: 0.6,
            margin: { top: 14, bottom: 16 },
          },
          // Code body
          buildCodeColumn(leftCodeLines),
        ],
      },
    });

    // ------------------------------------------------------------------------
    // 4. RIGHT PANEL: "FA CORE: IT IS ALIVE" (Frosted Glass Hero Card)
    // ------------------------------------------------------------------------
    var rightPanelW = 880;
    var rightPanelH = 520;
    var rightPanelX = 950;
    var rightPanelY = 135 + bob2 + (1 - enterT) * 55;

    var rightCodeLines = [
      [
        ['#include ', '#E056FD'],
        ['"package:flutter_agent/flutter_agent.dart"', '#48C7E8'],
      ],
      [
        ['using namespace ', '#E056FD'],
        ['fa;', '#FFFFFF'],
      ],
      [
        ['int ', '#5B61F6'],
        ['main', '#FFFFFF'],
        ['() ', '#5B61F6'],
        ['async {', '#FFFFFF'],
      ],
      [
        ['    final ', '#E056FD'],
        ['livingAgent = ', '#FFFFFF'],
        ['await ', '#E056FD'],
        ['Fa.boot();', '#48C7E8'],
      ],
      // LIVING FACE TOKEN: winks with smile `_`
      [
        ['    ( ', '#FFFFFF'],
        ['>', '#5B61F6'],
        [' _ ', '#2EBD9E'],
        ['eyeRight', '#48C7E8'],
        [' )', '#FFFFFF'],
        ['  // IT IS ALIVE: watching your back', '#2EBD9E'],
      ],
      [
        ['    livingAgent.', '#FFFFFF'],
        ['wink', '#48C7E8'],
        ['(eye: Eye.right);  ', '#FFFFFF'],
        ['// emotions built in', '#2EBD9E'],
      ],
      [
        ['', '#FFFFFF'],
      ],
      [
        ['    // Impeller GPU headless engine · 120 FPS', '#2EBD9E'],
      ],
      [
        ['    final ', '#E056FD'],
        ['engine = ', '#FFFFFF'],
        ['HeadlessRenderer.', '#5B61F6'],
        ['gpu(metal: true);', '#48C7E8'],
      ],
      [
        ['    await engine.', '#FFFFFF'],
        ['renderVideo', '#5B61F6'],
        ['(fps: 120, codec: "h264");', '#FFFFFF'],
      ],
      [
        ['    expect(fps.avg, greaterThan(119.8));', '#48C7E8'],
      ],
      [
        ['    // 100% offline fallback when cloud goes down', '#2EBD9E'],
      ],
      [
        ['    return ', '#E056FD'],
        ['Fa.runLocally(gpu: "Metal/Impeller");', '#48C7E8'],
      ],
      [
        ['}', '#FFFFFF'],
      ],
    ];

    // Right Panel: Soft Ambient Shadow Glow
    kids.push({
      type: 'rect',
      width: rightPanelW,
      height: rightPanelH,
      radius: 20,
      fill: '#00F0FF',
      opacity: 0.18 * panelsOp,
      blur: 40,
      positioned: { left: rightPanelX, top: rightPanelY + 12 },
    });

    // Right Panel: Frosted Glass Surface + Luminous Border
    kids.push({
      type: 'rect',
      width: rightPanelW,
      height: rightPanelH,
      radius: 20,
      fill: '#080E1C',
      opacity: 0.90 * panelsOp,
      border: { color: '#00D4E8', width: 1.5 },
      positioned: { left: rightPanelX, top: rightPanelY },
    });

    // Right Panel Content
    kids.push({
      type: 'container',
      width: rightPanelW,
      height: rightPanelH,
      opacity: panelsOp,
      padding: { left: 28, top: 20, right: 28, bottom: 24 },
      positioned: { left: rightPanelX, top: rightPanelY },
      child: {
        type: 'column',
        children: [
          // Header Bar
          {
            type: 'row',
            children: [
              // Status Live Pulse
              {
                type: 'circle',
                size: 9,
                fill: '#2EBD9E',
                opacity: 0.95,
              },
              { type: 'container', width: 8 },
              {
                type: 'text',
                text: 'LIVE HARNESS',
                style: {
                  fontSize: 11,
                  color: '#2EBD9E',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  letterSpacing: 1.2,
                },
              },
              { type: 'container', width: 18 },
              // Title
              {
                type: 'text',
                text: 'FA CORE · RUNTIME',
                style: {
                  fontSize: 16,
                  color: '#FFFFFF',
                  fontFamily: 'Impact',
                  fontWeight: '700',
                  letterSpacing: 2.0,
                  gradient: silverGrad,
                },
              },
              { type: 'container', width: 16 },
              // Badge Pill
              {
                type: 'container',
                decoration: {
                  color: 'rgba(46, 189, 158, 0.18)',
                  borderRadius: 12,
                  borderColor: 'rgba(46, 189, 158, 0.5)',
                  borderWidth: 1,
                },
                padding: { left: 10, top: 3, right: 10, bottom: 3 },
                child: {
                  type: 'text',
                  text: '100% OFFLINE · ZERO HALLUCINATIONS',
                  style: {
                    fontSize: 10,
                    color: '#2EBD9E',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    letterSpacing: 0.8,
                  },
                },
              },
            ],
          },
          // Divider
          {
            type: 'rect',
            width: rightPanelW - 56,
            height: 1,
            fill: '#183848',
            opacity: 0.6,
            margin: { top: 14, bottom: 16 },
          },
          // Code body
          buildCodeColumn(rightCodeLines),
        ],
      },
    });

    // ------------------------------------------------------------------------
    // 5. Specular Star Spark on Winking Eye '-'
    // ------------------------------------------------------------------------
    if (winkT > 0.05) {
      // Right eye '-' glyph position inside Right Panel:
      var sparkX = rightPanelX + 172;
      var sparkY = rightPanelY + 192;

      kids.push({
        type: 'circle',
        size: 28,
        fill: '#FFFFFF',
        opacity: 0.95 * winkT * panelsOp,
        blur: 4,
        positioned: { left: sparkX - 14, top: sparkY - 14 },
      });
      kids.push({
        type: 'circle',
        size: 54,
        fill: '#48C7E8',
        opacity: 0.72 * winkT * panelsOp,
        blur: 14,
        positioned: { left: sparkX - 27, top: sparkY - 27 },
      });
    }

    // ------------------------------------------------------------------------
    // 6. Floating Neon HUD Cursor (Gliding Between Panels)
    // ------------------------------------------------------------------------
    var cursorGlide = tw(30, 60, 0, 1, 'easeInOutCubic');
    var cursorX = lerp(leftPanelX + 420, rightPanelX + 220, cursorGlide);
    var cursorY = lerp(leftPanelY + 380, rightPanelY + 220, cursorGlide);

    // Glowing cyan pointer dot with light aura
    kids.push({
      type: 'circle',
      size: 32,
      fill: '#00F0FF',
      opacity: 0.25 * panelsOp,
      blur: 16,
      positioned: { left: cursorX - 16, top: cursorY - 16 },
    });
    kids.push({
      type: 'circle',
      size: 8,
      fill: '#FFFFFF',
      opacity: 0.95 * panelsOp,
      positioned: { left: cursorX - 4, top: cursorY - 4 },
    });

    // ------------------------------------------------------------------------
    // 7. Statement Slams In: IT LIVES IN YOUR CODE.
    // ------------------------------------------------------------------------
    var typeIn = tw(125, 25, 0, 1, 'easeOutExpo');
    var typeOffY = 40 * (1 - typeIn);

    if (typeIn > 0.01) {
      kids.push({
        type: 'text',
        text: 'IT LIVES IN YOUR CODE.',
        width: 1920,
        opacity: typeIn * (1 - fadeOut),
        offsetY: typeOffY,
        style: {
          fontSize: 124,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          letterSpacing: 2,
          textAlign: 'center',
          gradient: silverGrad,
        },
        positioned: { left: 0, top: 460 },
      });
    }

    // Cinematic edge vignette
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: '#000000',
      opacity: 0.22,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
