// 02 — Alive — Dynamic Camera Running Across the Codebase.
//
// Inspired by:
//   · 4K Computer Codes (RR2EI8EEOOw) camera fly-through:
//     Camera navigates and runs across the code canvas, skimming past functions,
//     glowing syntax tokens, foreground bokeh particles floating past the lens.
//   · Apple Mac Studio M5 (3uAIqqg8ZHo) 18.8s–20.8s:
//     Hyper-clean Apple syntax styling, conversational developer dialogue,
//     elastic brake into hero line 21 `( > _ o )` winking `( > _ - )` with specular star,
//     culminating in the monumental `IT LIVES IN YOUR CODE.` statement slam.

scene = {
  id: '02_alive',
  duration: 180,
  from: 210,
  timeline: {
    label: 'Alive (Camera Run)',
    color: '#C9B8FF',
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

    // Deep obsidian background
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#04060B',
      positioned: { left: 0, top: 0 },
    });

    // ------------------------------------------------------------------------
    // Camera Flight Trajectory across the Canvas (Canvas size ~ 3800 x 1400)
    // ------------------------------------------------------------------------
    var runT = tw(35, 52, 0, 1, 'easeInOutCubic');
    var brakeT = tw(87, 28, 0, 1, 'easeOutBack');

    var startCamX = 850;
    var startCamY = 380;
    var startZoom = 1.15;

    var targetCamX = 4050;
    var targetCamY = 490;
    var targetZoom = 1.25;

    var camX = startCamX;
    var camY = startCamY;
    var camZoom = startZoom;

    if (frame < 35) {
      // Gentle breathing drift near entry
      var drift = frame / 35;
      camX = startCamX + Math.sin(drift * Math.PI) * 20;
      camY = startCamY + Math.cos(drift * Math.PI) * 10;
      camZoom = startZoom + 0.02 * drift;
    } else if (frame < 88) {
      // Camera runs across the code canvas!
      camX = lerp(startCamX, targetCamX, runT);
      // Dip down and up during flight
      var arcY = Math.sin(runT * Math.PI) * 120;
      camY = lerp(startCamY, targetCamY, runT) + arcY;
      // Slight pullback during flight to reveal the massive codebase
      var pullZoom = Math.sin(runT * Math.PI) * 0.18;
      camZoom = lerp(startZoom, targetZoom, runT) - pullZoom;
    } else {
      // Locked onto Hero Line 21 with subtle cinematic push
      var pushT = (frame - 88) / 92;
      camX = targetCamX;
      camY = targetCamY;
      camZoom = targetZoom + 0.03 * pushT;
    }

    // Ambient radial lighting that follows the camera
    kids.push({
      type: 'circle',
      size: 1300,
      fill: '#3D2875',
      opacity: 0.16,
      blur: 160,
      positioned: { left: 960 - 650, top: 540 - 650 },
    });

    // ------------------------------------------------------------------------
    // Code Canvas Content (3 Columns of Conversational, Hyper-Capable Code)
    // ------------------------------------------------------------------------
    var allLines = [
      // === Column 1 (x: 240) - Awakening & Superpowers ===
      {
        col: 1, x: 240, y: 160,
        tokens: [
          ['01  ', '#3A4456'], ['import ', '#8F6BFF'], ['"package:flutter_agent/flutter_agent.dart";', '#FFFFFF'],
          ['  // wait, did you think I was just an autocomplete?', '#68788C']
        ]
      },
      {
        col: 1, x: 240, y: 225,
        tokens: [
          ['02  ', '#3A4456'], ['final ', '#8F6BFF'], ['agent = ', '#E2E8F0'], ['await ', '#8F6BFF'],
          ['Fa.boot', '#48C7E8'], ['(mode: Mode.autonomous);  agent.', '#E2E8F0'],
          ['say', '#48C7E8'], ['("Hello, dev. I live in your machine now.");', '#FFFFFF']
        ]
      },
      {
        col: 1, x: 240, y: 290,
        tokens: [
          ['03  ', '#3A4456'], ['final ', '#8F6BFF'], ['brain = ', '#E2E8F0'], ['LocalBrain.load', '#48C7E8'],
          ['(memory: 100.gb);  brain.', '#E2E8F0'], ['onUserSleep = ', '#8F6BFF'],
          ['() async => await ', '#8F6BFF'], ['shipAllPendingFeatures', '#48C7E8'], ['();', '#E2E8F0']
        ]
      },
      {
        col: 1, x: 240, y: 355,
        tokens: [
          ['04  ', '#3A4456'], ['if ', '#8F6BFF'], ['(user.isTired) { ', '#E2E8F0'],
          ['coffee.brew', '#48C7E8'], ['();  terminal.', '#E2E8F0'], ['takeOver', '#48C7E8'], ['();  agent.', '#E2E8F0'],
          ['whisper', '#48C7E8'], ['("Go to sleep, I will ship the release."); }', '#FFFFFF']
        ]
      },
      {
        col: 1, x: 240, y: 430,
        tokens: [
          ['05  ', '#3A4456'], ['class ', '#8F6BFF'], ['FaSuperpowers ', '#B8A5FF'], ['implements ', '#8F6BFF'],
          ['DeveloperCompanion ', '#B8A5FF'], ['{ final ', '#8F6BFF'], ['hands = [', '#E2E8F0'],
          ['ShellTool', '#B8A5FF'], ['(), ', '#E2E8F0'], ['AstRewrite', '#B8A5FF'], ['(), ', '#E2E8F0'],
          ['NativeCompiler', '#B8A5FF'], ['()];', '#E2E8F0']
        ]
      },
      {
        col: 1, x: 240, y: 495,
        tokens: [
          ['06  ', '#3A4456'], ['  bool get ', '#8F6BFF'], ['hasOpinions => ', '#E2E8F0'], ['false', '#8F6BFF'],
          [';  bool get ', '#8F6BFF'], ['hasHands => ', '#E2E8F0'], ['true', '#8F6BFF'],
          [';  void ', '#8F6BFF'], ['gitPushForce', '#48C7E8'], ['() => throw ', '#8F6BFF'],
          ['NeverDoThatException', '#B8A5FF'], ['();', '#E2E8F0']
        ]
      },
      {
        col: 1, x: 240, y: 560,
        tokens: [
          ['07  ', '#3A4456'], ['  final ', '#8F6BFF'], ['cubes = ', '#E2E8F0'],
          ['Cubes.mount', '#48C7E8'], ['(Workspace.root, policy: SecurityPolicy.strict);  // sandboxed by design', '#68788C']
        ]
      },
      {
        col: 1, x: 240, y: 625,
        tokens: [
          ['08  ', '#3A4456'], ['  await ', '#8F6BFF'], ['session.', '#E2E8F0'], ['delegate', '#48C7E8'],
          ['(agent: "explore", goal: "find that bug you spent 6h on in 2.3s");', '#FFFFFF']
        ]
      },

      // === Column 2 (x: 1950) - Ecosystem, Speed & Models ===
      {
        col: 2, x: 1950, y: 220,
        tokens: [
          ['09  ', '#3A4456'], ['  final ', '#8F6BFF'], ['bug = await ', '#E2E8F0'], ['search', '#48C7E8'],
          ['("why state null");  await bug.', '#E2E8F0'], ['fix', '#48C7E8'], ['();  expect(tests, pass);', '#E2E8F0']
        ]
      },
      {
        col: 2, x: 1950, y: 285,
        tokens: [
          ['10  ', '#3A4456'], ['  final ', '#8F6BFF'], ['providers = [', '#E2E8F0'],
          ['Claude37Sonnet', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Gpt4o', '#B8A5FF'], ['(), ', '#E2E8F0'],
          ['Ollama', '#B8A5FF'], ['(local: true), ', '#E2E8F0'], ['DeepSeek', '#B8A5FF'], ['()];  // 10 providers, zero lock-in', '#68788C']
        ]
      },
      {
        col: 2, x: 1950, y: 350,
        tokens: [
          ['11  ', '#3A4456'], ['  final ', '#8F6BFF'], ['stream = providers.', '#E2E8F0'], ['bestFor', '#48C7E8'],
          ['(task).chat(prompt, maxTokens: 128000);  await for (final chunk in stream) emit(chunk);', '#E2E8F0']
        ]
      },
      {
        col: 2, x: 1950, y: 415,
        tokens: [
          ['12  ', '#3A4456'], ['  final ', '#8F6BFF'], ['memory = ', '#E2E8F0'], ['SessionMemory.recall', '#48C7E8'],
          ['("what you broke yesterday at 3am");  agent.', '#E2E8F0'], ['remember', '#48C7E8'],
          ['(why: "so you don\'t repeat it");', '#FFFFFF']
        ]
      },
      {
        col: 2, x: 1950, y: 480,
        tokens: [
          ['13  ', '#3A4456'], ['  terminal.', '#E2E8F0'], ['autofire', '#48C7E8'],
          ['(">_ flutter run -d macos --impeller");  // 120 fps butter, pure Skia/Metal rendering', '#68788C']
        ]
      },
      {
        col: 2, x: 1950, y: 545,
        tokens: [
          ['14  ', '#3A4456'], ['  void ', '#8F6BFF'], ['compilePptx', '#48C7E8'], ['() => ', '#E2E8F0'],
          ['YoClip.toPptx', '#48C7E8'], ['(editable: true);  // yes, editable PowerPoint from code!', '#68788C']
        ]
      },
      {
        col: 2, x: 1950, y: 610,
        tokens: [
          ['18  ', '#3A4456'], ['  final ', '#8F6BFF'], ['platforms = [', '#E2E8F0'],
          ['MacOS', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Windows', '#B8A5FF'], ['(), ', '#E2E8F0'],
          ['iOS', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Android', '#B8A5FF'], ['(), ', '#E2E8F0'],
          ['ChromeExtension', '#B8A5FF'], ['()];  // everywhere', '#68788C']
        ]
      },
      {
        col: 2, x: 1950, y: 675,
        tokens: [
          ['19  ', '#3A4456'], ['  if ', '#8F6BFF'], ['(cloud.goesDown) { ', '#E2E8F0'],
          ['runLocally', '#48C7E8'], ['();  agent.', '#E2E8F0'], ['log', '#48C7E8'],
          ['("Cloud down? Don\'t care. I run 100% offline on your device."); }', '#FFFFFF']
        ]
      },

      // === Column 3 (x: 3500) - HERO DESTINATION: Line 21 & 22 ===
      {
        col: 3, x: 3500, y: 450,
        isHero: true,
        tokens: [
          ['21  ', '#48C7E8'], ['  ', '#FFFFFF'], ['( > _ o )', '#48C7E8'],
          ['   */  final livingAgent = await Fa.awaken();  // IT IS ALIVE: watching your back', '#8F6BFF']
        ]
      },
      {
        col: 3, x: 3500, y: 525,
        isHeroSub: true,
        tokens: [
          ['22  ', '#3A4456'], ['  livingAgent.', '#E2E8F0'], ['wink', '#48C7E8'],
          ['(eye: Eye.right, spark: true);  livingAgent.', '#E2E8F0'], ['smile', '#48C7E8'],
          ['(glow: "#48C7E8");  // and yes, I have emotions', '#68788C']
        ]
      },
      {
        col: 3, x: 3500, y: 590,
        tokens: [
          ['23  ', '#3A4456'], ['  print', '#48C7E8'],
          ['("Sit back. The future of software engineering is already typing...");', '#FFFFFF']
        ]
      },
      {
        col: 3, x: 3500, y: 655,
        tokens: [
          ['24  ', '#3A4456'], ['}', '#8090A0'],
          ['  // end of the boilerplate era', '#68788C']
        ]
      },
    ];

    // ------------------------------------------------------------------------
    // Floating Foreground Bokeh Particles (Parallax speed 1.7x)
    // ------------------------------------------------------------------------
    var particles = [
      { x: 500, y: 250, size: 28, col: '#8F6BFF' },
      { x: 900, y: 450, size: 38, col: '#48C7E8' },
      { x: 1300, y: 200, size: 24, col: '#5B61F6' },
      { x: 1700, y: 550, size: 42, col: '#8F6BFF' },
      { x: 2100, y: 280, size: 30, col: '#48C7E8' },
      { x: 2500, y: 520, size: 36, col: '#FFFFFF' },
      { x: 2900, y: 350, size: 32, col: '#8F6BFF' },
      { x: 3200, y: 600, size: 26, col: '#48C7E8' },
    ];

    // Wink timing on Hero Line 21: frames 98–118
    var winkT = 0;
    if (frame >= 98 && frame <= 118) {
      if (frame < 103) winkT = (frame - 98) / 5;
      else if (frame <= 110) winkT = 1;
      else winkT = 1 - (frame - 110) / 8;
    }

    var fadeOut = tw(158, 22, 0, 1, 'easeInOutCubic');

    // ------------------------------------------------------------------------
    // Render Code Lines Projected Through Camera Viewport
    // ------------------------------------------------------------------------
    for (var li = 0; li < allLines.length; li++) {
      var line = allLines[li];

      var sx = 960 + (line.x - camX) * camZoom;
      var sy = 540 + (line.y - camY) * camZoom;

      // Cull lines far off screen
      if (sx < -800 || sx > 2600 || sy < -200 || sy > 1280) continue;

      var op = 1.0;
      if (frame >= 88) {
        if (!line.isHero && !line.isHeroSub) {
          var dimT = tw(88, 18, 0, 1, 'easeOut');
          op = lerp(1.0, 0.18, dimT);
        }
      }

      if (frame >= 125) {
        var titleDim = tw(125, 20, 0, 1, 'easeOut');
        op *= lerp(1.0, 0.16, titleDim);
      }

      var fontSize = (line.isHero ? 32 : 25) * camZoom;

      var tokens = [];
      for (var ti = 0; ti < line.tokens.length; ti++) {
        var txt = line.tokens[ti][0];
        var col = line.tokens[ti][1];

        // Hero face dynamic wink
        if (line.isHero && txt === '( > _ o )') {
          if (winkT > 0.01) {
            txt = '( > _ - )';
            col = '#48C7E8';
          }
        }

        var isFace = line.isHero && (txt === '( > _ o )' || txt === '( > _ - )');

        tokens.push({
          type: 'text',
          text: txt,
          style: {
            color: col,
            fontSize: isFace ? fontSize + 8 : fontSize,
            fontFamily: 'monospace',
            fontWeight: (line.isHero || isFace) ? '700' : '500',
          },
        });
      }

      // Hero line glow halo
      if (line.isHero && frame >= 85 && frame < 135) {
        kids.push({
          type: 'rect',
          width: 1400 * camZoom,
          height: 60 * camZoom,
          radius: 12,
          fill: '#5B61F6',
          opacity: (0.24 + 0.15 * (winkT > 0.5 ? 1 : 0)) * op,
          blur: 28,
          positioned: { left: sx - 20 * camZoom, top: sy - 8 * camZoom },
        });

        if (winkT > 0.5) {
          // Specular star / lens spark on right winking eye
          var sparkX = sx + 225 * camZoom;
          var sparkY = sy + 14 * camZoom;
          kids.push({
            type: 'circle',
            size: 38 * camZoom,
            fill: '#FFFFFF',
            opacity: 0.95 * winkT,
            blur: 5,
            positioned: { left: sparkX - 19 * camZoom, top: sparkY - 19 * camZoom },
          });
        }
      }

      kids.push({
        type: 'row',
        opacity: op * (1 - fadeOut),
        positioned: { left: sx, top: sy },
        children: tokens,
      });
    }

    // ------------------------------------------------------------------------
    // Render Foreground Bokeh Particles Drifting Past the Camera
    // ------------------------------------------------------------------------
    for (var pi = 0; pi < particles.length; pi++) {
      var p = particles[pi];
      // Faster parallax for foreground bokeh
      var px = 960 + (p.x - camX * 1.55) * camZoom;
      var py = 540 + (p.y - camY * 1.35) * camZoom;

      if (px > -100 && px < 2020 && py > -100 && py < 1180) {
        var pSize = p.size * camZoom;
        kids.push({
          type: 'circle',
          size: pSize,
          fill: p.col,
          opacity: 0.35 * (1 - fadeOut),
          blur: pSize * 0.5,
          positioned: { left: px - pSize / 2, top: py - pSize / 2 },
        });
      }
    }

    // ------------------------------------------------------------------------
    // Statement Slams In: IT LIVES IN YOUR CODE.
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
          shadows: [
            { color: '#8F6BFF', blur: 40, offset: { x: 0, y: 8 } },
            { color: '#000000', blur: 60, offset: { x: 0, y: 20 } },
          ],
        },
        positioned: { left: 0, top: 460 },
      });
    }

    // Edge vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
      opacity: 0.30,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
