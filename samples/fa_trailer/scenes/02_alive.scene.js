// 02 — Alive — The matrix code stream + declaration: IT LIVES IN YOUR CODE.
//
// Mirroring Apple Mac Studio M5 (3uAIqqg8ZHo) 18.8s–20.8s:
//   ·   0–35   Code types out: import 'package:flutter_agent/flutter_agent.dart'
//              with blinking purple cursor |
//   ·  35–85   Matrix-speed upward cascade / stream of syntax-highlighted code;
//              smooth dynamic zoom into line 32
//   ·  85–125  Elastic brake onto line 32: `( > _ o ) // IT IS ALIVE`.
//              Surrounding lines dim to 0.22, face winks ( > _ - ) with cyan spark
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

    // 40 authentic lines of code representing the Fa / YoClip agent runtime
    var codeLines = [
      [['01  ', '#3A4456'], ['import ', '#8F6BFF'], ['"package:flutter_agent/flutter_agent.dart";', '#FFFFFF']],
      [['02  ', '#3A4456'], ['import ', '#8F6BFF'], ['"package:yoclip_core/yoclip_core.dart";', '#E2E8F0']],
      [['03  ', '#3A4456'], ['@Observable final ', '#8F6BFF'], ['class ', '#8F6BFF'], ['FaEngine ', '#B8A5FF'], ['implements ', '#8F6BFF'], ['AgentRuntime ', '#B8A5FF'], ['{', '#8090A0']],
      [['04  ', '#3A4456'], ['  final ', '#8F6BFF'], ['sandbox = ', '#E2E8F0'], ['Cubes.mount', '#48C7E8'], ['(Workspace.root);', '#E2E8F0']],
      [['05  ', '#3A4456'], ['  final ', '#8F6BFF'], ['session = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['Fa.session', '#48C7E8'], ['(name: "trailer");', '#E2E8F0']],
      [['06  ', '#3A4456'], ['  final ', '#8F6BFF'], ['memory = ', '#E2E8F0'], ['SessionMemory', '#B8A5FF'], ['(recall: "apple_cadence");', '#E2E8F0']],
      [['07  ', '#3A4456'], ['  final ', '#8F6BFF'], ['tools = [', '#E2E8F0'], ['ShellTool', '#B8A5FF'], ['(), ', '#E2E8F0'], ['AstAnalyzer', '#B8A5FF'], ['(), ', '#E2E8F0'], ['GoldenTest', '#B8A5FF'], ['()];', '#E2E8F0']],
      [['08  ', '#3A4456'], ['  await ', '#8F6BFF'], ['session.stream', '#48C7E8'], ['(task: "render --preset youtube_1080");', '#E2E8F0']],
      [['09  ', '#3A4456'], ['  final ', '#8F6BFF'], ['provider = ', '#E2E8F0'], ['MultiProvider', '#B8A5FF'], ['([Claude37Sonnet(), Gpt4o()]);', '#E2E8F0']],
      [['10  ', '#3A4456'], ['  final ', '#8F6BFF'], ['stream = ', '#E2E8F0'], ['provider.chat', '#48C7E8'], ['(prompt, tools: tools);', '#E2E8F0']],
      [['11  ', '#3A4456'], ['  await for ', '#8F6BFF'], ['(final chunk in stream) { session.emit(chunk); }', '#E2E8F0']],
      [['12  ', '#3A4456'], ['  final ', '#8F6BFF'], ['boundary = ', '#E2E8F0'], ['renderKey.currentContext.findRenderObject();', '#E2E8F0']],
      [['13  ', '#3A4456'], ['  final ', '#8F6BFF'], ['image = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['boundary.toImage', '#48C7E8'], ['(pixelRatio: 1.0);', '#E2E8F0']],
      [['14  ', '#3A4456'], ['  final ', '#8F6BFF'], ['rawRgba = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['image.toByteData', '#48C7E8'], ['(format: ImageByteFormat.rawRgba);', '#E2E8F0']],
      [['15  ', '#3A4456'], ['  encoder.appendFrame', '#48C7E8'], ['(rawRgba, pts: frame * 1000 ~/ 30);', '#E2E8F0']],
      [['16  ', '#3A4456'], ['  audio.mixdown', '#48C7E8'], ['(tracks: [soundtrack, sfx], aacBitrate: 128000);', '#E2E8F0']],
      [['17  ', '#3A4456'], ['  await ', '#8F6BFF'], ['encoder.finish', '#48C7E8'], ['(path: "output/fa_trailer.mp4");', '#E2E8F0']],
      [['18  ', '#3A4456'], ['  // 120 fps pipeline — pure Dart core, zero cloud lock-in', '#506075']],
      [['19  ', '#3A4456'], ['  final ', '#8F6BFF'], ['subagent = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['session.delegate', '#48C7E8'], ['(agent: "explore");', '#E2E8F0']],
      [['20  ', '#3A4456'], ['  subagent.observe', '#48C7E8'], ['(status: AgentStatus.alive, blink: true);', '#E2E8F0']],
      [['21  ', '#3A4456'], ['  subagent.send', '#48C7E8'], ['(task: "verify golden frames against apple refs");', '#E2E8F0']],
      [['22  ', '#3A4456'], ['  final ', '#8F6BFF'], ['diff = ', '#E2E8F0'], ['ImageDiff.compare', '#48C7E8'], ['(golden, captured, threshold: 0.01);', '#E2E8F0']],
      [['23  ', '#3A4456'], ['  expect', '#48C7E8'], ['(diff.mismatches, equals(0));  // pixel-perfect cadence', '#68788C']],
      [['24  ', '#3A4456'], ['  git.commit', '#48C7E8'], ['(scope: "fa_trailer", message: "it lives in your code");', '#E2E8F0']],
      [['25  ', '#3A4456'], ['  terminal.autofire', '#48C7E8'], ['(prompt: ">_ boot --native --impeller");', '#E2E8F0']],
      [['26  ', '#3A4456'], ['  final ', '#8F6BFF'], ['timeline = ', '#E2E8F0'], ['StudioTimeline.mount', '#48C7E8'], ['(tracks: [video, audio]);', '#E2E8F0']],
      [['27  ', '#3A4456'], ['  timeline.scrub', '#48C7E8'], ['(frame: 32, velocity: 1.0);  // playhead live', '#68788C']],
      [['28  ', '#3A4456'], ['  final ', '#8F6BFF'], ['chip = ', '#E2E8F0'], ['HardwareTile.render', '#48C7E8'], ['(silicon: "Apple Silicon");', '#E2E8F0']],
      [['29  ', '#3A4456'], ['  chip.tracePerimeter', '#48C7E8'], ['(laser: "#5B61F6", duration: 120);', '#E2E8F0']],
      [['30  ', '#3A4456'], ['  Color.clear;  // the invisible spine', '#506075']],
      [['31  ', '#3A4456'], ['  onSelect', '#48C7E8'], ['(tool: lsp);  // give it hands, not opinions', '#506075']],
      [['32  ', '#48C7E8'], ['  ', '#FFFFFF'], ['( > _ o )', '#48C7E8'], ['   */  await Fa.boot();  // IT IS ALIVE', '#8F6BFF']],
      [['33  ', '#3A4456'], ['  RobotModel.mount', '#48C7E8'], ['(cubes: [sandbox, isolated]);', '#E2E8F0']],
      [['34  ', '#3A4456'], ['  Joint', '#B8A5FF'], ['(id: "shoulderL", angle: 0, range: -180...180);', '#E2E8F0']],
      [['35  ', '#3A4456'], ['  Joint', '#B8A5FF'], ['(id: "elbowL", angle: 0, range: 0...150);', '#E2E8F0']],
      [['36  ', '#3A4456'], ['  Joint', '#B8A5FF'], ['(id: "wristL", angle: 0, range: -90...90);', '#E2E8F0']],
      [['37  ', '#3A4456'], ['  render', '#48C7E8'], ['(frame + 1);  pump();  boundary.flush();  repeat();', '#E2E8F0']],
      [['38  ', '#3A4456'], ['  export ', '#8F6BFF'], ['preset: youtube_1080;  bitrate: 12_000k;  mux: single-pass;', '#E2E8F0']],
      [['39  ', '#3A4456'], ['  // pure Dart, zero cloud lock-in', '#506075']],
      [['40  ', '#3A4456'], ['}', '#8090A0']],
    ];

    var targetIndex = 31; // Line 32 (0-indexed 31)

    // Motion timing:
    // ·  0–35  Typing phase (initial code appears)
    // · 35–85  Matrix rush (code accelerates upward)
    // · 85–125 Brake on line 32 + Wink
    // · 125–180 IT LIVES IN YOUR CODE. statement slams in

    var isTyping = frame < 35;
    var isBraked = frame >= 85;

    // Zoom motion: scale font and line height smoothly
    var zoomT = tw(35, 55, 0, 1, 'easeInOutCubic');
    var rowH = lerp(44, 56, zoomT);
    var fontSize = lerp(26, 34, zoomT);

    // Scroll motion:
    // Starts centered around lines 01–02 (y ~ 460), then rushes upward at matrix speed,
    // and brakes elastically with line 32 right at center screen (y ~ 510)
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

    // Wink timing on line 32: frames 98–116
    var winkT = 0;
    if (frame >= 98 && frame <= 116) {
      if (frame < 102) winkT = (frame - 98) / 4;
      else if (frame <= 108) winkT = 1;
      else winkT = 1 - (frame - 108) / 8;
    }

    var fadeOut = tw(158, 22, 0, 1, 'easeInOutCubic');

    // Horizontal centering
    var leftX = lerp(340, 280, zoomT);

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
      var isLine32 = (i === targetIndex);

      var lineOpacity = 1.0;
      if (isBraked) {
        var dimT = tw(85, 15, 0, 1, 'easeOut');
        lineOpacity = isLine32 ? 1.0 : lerp(0.85, 0.20, dimT);
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

        // Replace the face in line 32 with dynamic wink!
        if (isLine32 && txt === '( > _ o )') {
          if (winkT > 0.01) {
            txt = '( > _ - )';
            col = '#48C7E8';
          }
        }

        var isFaceToken = isLine32 && (txt === '( > _ o )' || txt === '( > _ - )');
        tokens.push({
          type: 'text',
          text: txt,
          style: {
            color: col,
            fontSize: isFaceToken ? fontSize + 8 : fontSize,
            fontFamily: 'monospace',
            fontWeight: (isLine32 || isFaceToken) ? '700' : '500',
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

      // Glow behind line 32 when focused
      if (isLine32 && isBraked && frame < 135) {
        renderedRows.push({
          type: 'rect',
          width: 1080,
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
