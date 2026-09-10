// 02 — Alive — The matrix code stream + declaration: IT LIVES IN YOUR CODE.
//
// Mirroring Apple Mac Studio M5 (3uAIqqg8ZHo) 18.8s–20.8s:
//   ·   0–35   Code types out: conversational, witty developer dialogue explaining Fa
//              with blinking purple cursor |
//   ·  35–85   Matrix-speed upward cascade of witty, hyper-capable Fa architecture code;
//              camera zooms into line 21
//   ·  85–125  Elastic brake onto line 21: `( > _ o ) // IT IS ALIVE: watching your back`.
//              Surrounding lines dim, face winks ( > _ - ) with glowing cyan spark
//   · 125–180  Massive metallic statement slams in: `IT LIVES IN YOUR CODE.`
//              held firmly before smooth fade to black for the hardware chip drop.

scene = {
  id: '02_alive',
  duration: 180,
  from: 210,
  timeline: {
    label: 'Alive',
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

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // 24 dense, witty, conversational lines of code explaining Fa's real superpowers
    var codeLines = [
      [['01  ', '#3A4456'], ['import ', '#8F6BFF'], ['"package:flutter_agent/flutter_agent.dart";', '#FFFFFF'], ['  // wait, did you think I was just an autocomplete?', '#68788C']],
      [['02  ', '#3A4456'], ['final ', '#8F6BFF'], ['agent = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['Fa.boot', '#48C7E8'], ['(mode: Mode.autonomous);  agent.', '#E2E8F0'], ['say', '#48C7E8'], ['("Hello, dev. I live in your machine now.");', '#FFFFFF']],
      [['03  ', '#3A4456'], ['final ', '#8F6BFF'], ['brain = ', '#E2E8F0'], ['LocalBrain.load', '#48C7E8'], ['(memory: 100.gb);  brain.', '#E2E8F0'], ['onUserSleep = ', '#8F6BFF'], ['() ', '#E2E8F0'], ['async => await ', '#8F6BFF'], ['shipAllPendingFeatures', '#48C7E8'], ['();', '#E2E8F0']],
      [['04  ', '#3A4456'], ['if ', '#8F6BFF'], ['(user.isTired) { ', '#E2E8F0'], ['coffee.brew', '#48C7E8'], ['();  terminal.', '#E2E8F0'], ['takeOver', '#48C7E8'], ['();  agent.', '#E2E8F0'], ['whisper', '#48C7E8'], ['("Go to bed, I will handle the release."); }', '#FFFFFF']],
      [['05  ', '#3A4456'], ['class ', '#8F6BFF'], ['FaSuperpowers ', '#B8A5FF'], ['implements ', '#8F6BFF'], ['DeveloperCompanion ', '#B8A5FF'], ['{ ', '#8090A0'], ['final ', '#8F6BFF'], ['hands = [', '#E2E8F0'], ['ShellTool', '#B8A5FF'], ['(), ', '#E2E8F0'], ['AstRewrite', '#B8A5FF'], ['(), ', '#E2E8F0'], ['NativeCompiler', '#B8A5FF'], ['()];', '#E2E8F0']],
      [['06  ', '#3A4456'], ['  bool get ', '#8F6BFF'], ['hasOpinions => ', '#E2E8F0'], ['false', '#8F6BFF'], [';  bool get ', '#8F6BFF'], ['hasHands => ', '#E2E8F0'], ['true', '#8F6BFF'], [';  void ', '#8F6BFF'], ['gitPushForce', '#48C7E8'], ['() => throw ', '#8F6BFF'], ['NeverDoThatException', '#B8A5FF'], ['();', '#E2E8F0']],
      [['07  ', '#3A4456'], ['  final ', '#8F6BFF'], ['cubes = ', '#E2E8F0'], ['Cubes.mount', '#48C7E8'], ['(Workspace.root, policy: SecurityPolicy.strict);  // isolated sandbox: safe by design', '#68788C']],
      [['08  ', '#3A4456'], ['  await ', '#8F6BFF'], ['session.', '#E2E8F0'], ['delegate', '#48C7E8'], ['(agent: "explore", goal: "find that bug you spent 6 hours looking for in 2.3 seconds");', '#FFFFFF']],
      [['09  ', '#3A4456'], ['  final ', '#8F6BFF'], ['bug = await ', '#E2E8F0'], ['search', '#48C7E8'], ['(query: "why is state null");  await bug.', '#E2E8F0'], ['fix', '#48C7E8'], ['();  expect(tests.run(), equals(allPass));', '#E2E8F0']],
      [['10  ', '#3A4456'], ['  final ', '#8F6BFF'], ['providers = [', '#E2E8F0'], ['Claude37Sonnet', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Gpt4o', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Ollama', '#B8A5FF'], ['(local: true), ', '#E2E8F0'], ['DeepSeek', '#B8A5FF'], ['()];  // 10 providers, zero lock-in', '#68788C']],
      [['11  ', '#3A4456'], ['  final ', '#8F6BFF'], ['stream = providers.', '#E2E8F0'], ['bestFor', '#48C7E8'], ['(task).chat(prompt, maxTokens: 128000);  await for (final chunk in stream) emit(chunk);', '#E2E8F0']],
      [['12  ', '#3A4456'], ['  final ', '#8F6BFF'], ['memory = ', '#E2E8F0'], ['SessionMemory.recall', '#48C7E8'], ['("what you broke yesterday at 3am");  agent.', '#E2E8F0'], ['remember', '#48C7E8'], ['(why: "so you don\'t repeat it");', '#FFFFFF']],
      [['13  ', '#3A4456'], ['  terminal.', '#E2E8F0'], ['autofire', '#48C7E8'], ['(">_ flutter run -d macos --impeller");  fps.', '#E2E8F0'], ['measure', '#48C7E8'], ['();  // 120 fps butter, pure Skia/Metal rendering', '#68788C']],
      [['14  ', '#3A4456'], ['  void ', '#8F6BFF'], ['exportVideo', '#48C7E8'], ['() => ', '#E2E8F0'], ['YoClip.render', '#48C7E8'], ['(preset: youtube_1080);  void ', '#E2E8F0'], ['compilePptx', '#48C7E8'], ['() => YoClip.toPptx(editable: true);', '#E2E8F0']],
      [['15  ', '#3A4456'], ['  final ', '#8F6BFF'], ['subagents = ', '#E2E8F0'], ['Swarm.spawn', '#48C7E8'], ['(count: 32, protocol: Protocol.a2a);  subagents.', '#E2E8F0'], ['broadcast', '#48C7E8'], ['("divide, conquer, deliver");', '#FFFFFF']],
      [['16  ', '#3A4456'], ['  await ', '#8F6BFF'], ['git.commit', '#48C7E8'], ['(scope: "ai", message: "refactor: replace 10,000 lines of boilerplate with 12 lines of Fa");', '#FFFFFF']],
      [['17  ', '#3A4456'], ['  while ', '#8F6BFF'], ['(project.hasDreams) { ', '#E2E8F0'], ['brainstorm', '#48C7E8'], ['();  ', '#E2E8F0'], ['scaffold', '#48C7E8'], ['();  ', '#E2E8F0'], ['test', '#48C7E8'], ['();  // autonomous loop never gets tired', '#68788C']],
      [['18  ', '#3A4456'], ['  final ', '#8F6BFF'], ['platforms = [', '#E2E8F0'], ['MacOS', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Windows', '#B8A5FF'], ['(), ', '#E2E8F0'], ['iOS', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Android', '#B8A5FF'], ['(), ', '#E2E8F0'], ['Web', '#B8A5FF'], ['(), ', '#E2E8F0'], ['ChromeExtension', '#B8A5FF'], ['()];  // everywhere', '#68788C']],
      [['19  ', '#3A4456'], ['  if ', '#8F6BFF'], ['(cloud.goesDown) { ', '#E2E8F0'], ['runLocally', '#48C7E8'], ['();  agent.', '#E2E8F0'], ['log', '#48C7E8'], ['("Cloud down? Don\'t care. I run 100% offline on your device."); }', '#FFFFFF']],
      [['20  ', '#3A4456'], ['  final ', '#8F6BFF'], ['confidence = 1.0;  final latency = 12.ms;  final dependencies = 0;  // pure Dart core, zero Node drama', '#68788C']],
      [['21  ', '#48C7E8'], ['  ', '#FFFFFF'], ['( > _ o )', '#48C7E8'], ['   */  final livingAgent = await Fa.awaken();  // IT IS ALIVE: watching your back', '#8F6BFF']],
      [['22  ', '#3A4456'], ['  livingAgent.', '#E2E8F0'], ['wink', '#48C7E8'], ['(eye: Eye.right, spark: true);  livingAgent.', '#E2E8F0'], ['smile', '#48C7E8'], ['(glow: "#48C7E8");  // and yes, I have emotions', '#68788C']],
      [['23  ', '#3A4456'], ['  print', '#48C7E8'], ['("Sit back. The future of software engineering is already typing...");', '#FFFFFF']],
      [['24  ', '#3A4456'], ['}', '#8090A0'], ['  // end of the boilerplate era', '#68788C']],
    ];

    var targetIndex = 20; // Line 21 (0-indexed 20)

    // Motion timing:
    // ·  0–35  Typing phase (lines 01–02 type out with blinking purple cursor)
    // · 35–85  Matrix rush (code accelerates upward)
    // · 85–125 Brake on line 21 + Wink
    // · 125–180 IT LIVES IN YOUR CODE. statement slams in

    var isTyping = frame < 35;
    var isBraked = frame >= 85;

    // Zoom motion: scale font and line height smoothly
    var zoomT = tw(35, 55, 0, 1, 'easeInOutCubic');
    var rowH = lerp(46, 58, zoomT);
    var fontSize = lerp(25, 33, zoomT);

    // Scroll motion:
    var rushT = tw(35, 50, 0, 1, 'easeOutExpo');
    var targetY = 510;
    var initialScrollY = -460;
    var restScrollY = targetIndex * rowH - targetY;
    var curScrollY = 0;
    if (frame < 35) {
      curScrollY = initialScrollY;
    } else if (frame < 85) {
      curScrollY = lerp(initialScrollY, restScrollY, rushT);
    } else {
      curScrollY = restScrollY;
    }

    // Wink timing on line 21: frames 98–116
    var winkT = 0;
    if (frame >= 98 && frame <= 116) {
      if (frame < 102) winkT = (frame - 98) / 4;
      else if (frame <= 108) winkT = 1;
      else winkT = 1 - (frame - 108) / 8;
    }

    var fadeOut = tw(158, 22, 0, 1, 'easeInOutCubic');

    // Horizontal centering
    var leftX = lerp(180, 140, zoomT);

    var renderedRows = [];
    var visibleStart = Math.max(0, Math.floor((curScrollY - 200) / rowH));
    var visibleEnd = Math.min(codeLines.length, Math.ceil((curScrollY + 1280) / rowH));

    if (isTyping) {
      visibleStart = 0;
      visibleEnd = Math.min(3, codeLines.length);
    }

    for (var i = visibleStart; i < visibleEnd; i++) {
      var line = codeLines[i];
      var yPos = i * rowH - curScrollY;
      var isLine21 = (i === targetIndex);

      var lineOpacity = 1.0;
      if (isBraked) {
        var dimT = tw(85, 15, 0, 1, 'easeOut');
        lineOpacity = isLine21 ? 1.0 : lerp(0.85, 0.20, dimT);
      } else if (isTyping && i > 0) {
        var typeStep = tw(i * 12, 10, 0, 1, 'linear');
        lineOpacity = typeStep;
      }

      if (frame >= 125) {
        var titleDim = tw(125, 20, 0, 1, 'easeOut');
        lineOpacity *= lerp(1.0, 0.16, titleDim);
      }

      var tokens = [];
      for (var ti = 0; ti < line.length; ti++) {
        var txt = line[ti][0];
        var col = line[ti][1];

        // Dynamic wink on line 21 face!
        if (isLine21 && txt === '( > _ o )') {
          if (winkT > 0.01) {
            txt = '( > _ - )';
            col = '#48C7E8';
          }
        }

        var isFaceToken = isLine21 && (txt === '( > _ o )' || txt === '( > _ - )');
        tokens.push({
          type: 'text',
          text: txt,
          style: {
            color: col,
            fontSize: isFaceToken ? fontSize + 8 : fontSize,
            fontFamily: 'monospace',
            fontWeight: (isLine21 || isFaceToken) ? '700' : '500',
          },
        });
      }

      // Add blinking cursor on typing line
      if (isTyping && i === 1 && (frame % 16 < 8)) {
        tokens.push({
          type: 'text',
          text: ' |',
          style: {
            color: '#8F6BFF',
            fontSize: fontSize,
            fontFamily: 'monospace',
            fontWeight: '700',
          },
        });
      }

      // Glow behind line 21 when focused
      if (isLine21 && isBraked && frame < 135) {
        renderedRows.push({
          type: 'rect',
          width: 1400,
          height: rowH + 12,
          radius: 8,
          fill: '#5B61F6',
          opacity: 0.18 + 0.12 * (winkT > 0.5 ? 1 : 0),
          blur: 24,
          positioned: { left: leftX - 20, top: yPos - 6 },
        });
        if (winkT > 0.6) {
          // Specular spark on wink!
          renderedRows.push({
            type: 'circle',
            size: 32,
            fill: '#FFFFFF',
            opacity: 0.95 * winkT,
            blur: 6,
            positioned: { left: leftX + 180, top: yPos + 6 },
          });
        }
      }

      renderedRows.push({
        type: 'row',
        opacity: lineOpacity * (1 - fadeOut),
        positioned: { left: leftX, top: yPos },
        children: tokens,
      });
    }

    kids.push({
      type: 'stack',
      fit: 'expand',
      children: renderedRows,
    });

    // ---- Phase 4: Statement Slams In: IT LIVES IN YOUR CODE. --------------
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

    // Subtle edge vignette
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
