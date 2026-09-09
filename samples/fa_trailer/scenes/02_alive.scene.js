// 02 — Alive — The declaration: IT LIVES IN YOUR CODE.
//
//   ·   0–30   Cinematic zoom on the obsidian tile with living eyes (0_0)
//   ·  30–90   The statement slams in: `IT LIVES IN YOUR CODE.` (Impact, metallic gradient)
//   ·  90–120  The second wink: right eye winks with cyan spark
//   · 140–180  Smooth fade into darkness before the hardware drop

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

    // Seamless camera transition from 01_dark:
    // Frame 0 matches 01_dark frame 210 EXACTLY (sy: 540, tileScale: 0.42).
    // Over frames 0–44 it smoothly glides up to (960, 360) and scales to 0.38
    // to give room for the title rising below it.
    var glideT = tw(0, 44, 0, 1, 'easeInOutCubic');
    var sy = lerp(540, 360, glideT);
    var tileScale = lerp(0.42, 0.38, glideT);
    setMapper(tileScale, 512, 512, 960, sy);

    // Typography motion
    var typeIn = tw(18, 42, 0, 1, 'easeOutExpo');
    var typeOffY = 40 * (1 - typeIn);
    var fadeT = tw(145, 35, 0, 1, 'easeInOutCubic');

    var kids = [];

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // ---- Apple-grade Running Code Stream on the Background -----------------
    // High-speed, syntax-highlighted agent code streaming upward behind the
    // tile and typography, exactly like Apple's developer runtime cadence.
    var codeLines = [
      [['01  ', '#3A4456'], ['import ', '#8F6BFF'], ['"package:flutter_agent/flutter_agent.dart";', '#E2E8F0']],
      [['02  ', '#3A4456'], ['@Observable final ', '#8F6BFF'], ['class ', '#8F6BFF'], ['FaEngine ', '#B8A5FF'], ['{', '#8090A0']],
      [['03  ', '#3A4456'], ['  final ', '#8F6BFF'], ['sandbox = ', '#E2E8F0'], ['Cubes.mount', '#48C7E8'], ['(Workspace.root);', '#E2E8F0']],
      [['04  ', '#3A4456'], ['  final ', '#8F6BFF'], ['session = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['Fa.session', '#48C7E8'], ['(name: "trailer");', '#E2E8F0']],
      [['05  ', '#3A4456'], ['  final ', '#8F6BFF'], ['memory = ', '#E2E8F0'], ['SessionMemory', '#B8A5FF'], ['(recall: "apple_cadence");', '#E2E8F0']],
      [['06  ', '#3A4456'], ['  final ', '#8F6BFF'], ['tools = [', '#E2E8F0'], ['ShellTool', '#B8A5FF'], ['(), ', '#E2E8F0'], ['AstAnalyzer', '#B8A5FF'], ['()];', '#E2E8F0']],
      [['07  ', '#3A4456'], ['  await ', '#8F6BFF'], ['session.stream', '#48C7E8'], ['(task: "render --preset youtube_1080");', '#E2E8F0']],
      [['08  ', '#3A4456'], ['  final ', '#8F6BFF'], ['provider = ', '#E2E8F0'], ['MultiProvider', '#B8A5FF'], ['([Claude37Sonnet(), Gpt4o()]);', '#E2E8F0']],
      [['09  ', '#3A4456'], ['  final ', '#8F6BFF'], ['frame = ', '#E2E8F0'], ['renderer.pump', '#48C7E8'], ['(frame: 40, fps: 30);', '#E2E8F0']],
      [['10  ', '#3A4456'], ['  boundary.toImage', '#48C7E8'], ['(pixelRatio: 1.0);  // 120 fps pipeline', '#68788C']],
      [['11  ', '#3A4456'], ['  audio.mixdown', '#48C7E8'], ['(tracks: [soundtrack, sfx], aacBitrate: 128000);', '#E2E8F0']],
      [['12  ', '#3A4456'], ['  // it is alive: pure Dart core, 10 providers, session memory', '#506075']],
      [['13  ', '#3A4456'], ['  final ', '#8F6BFF'], ['subagent = ', '#E2E8F0'], ['await ', '#8F6BFF'], ['session.delegate', '#48C7E8'], ['(agent: "explore");', '#E2E8F0']],
      [['14  ', '#3A4456'], ['  subagent.observe', '#48C7E8'], ['(status: AgentStatus.alive, blink: true);', '#E2E8F0']],
      [['15  ', '#3A4456'], ['  git.commit', '#48C7E8'], ['(scope: "fa_trailer", message: "it lives in your code");', '#E2E8F0']],
      [['16  ', '#3A4456'], ['  storage.write', '#48C7E8'], ['(path: "output/trailer.mp4", bytes: encoded);', '#E2E8F0']],
    ];

    var ROW_H = 46;
    var totalH = ROW_H * codeLines.length;
    var scrollY = frame * 14;

    var codeRows = [];
    for (var ri = 0; ri < 28; ri++) {
      var lData = codeLines[ri % codeLines.length];
      var rowY = (ri * ROW_H - (scrollY % totalH));
      if (rowY < -ROW_H) rowY += totalH * 2;
      
      var tokens = [];
      for (var ti = 0; ti < lData.length; ti++) {
        tokens.push({
          type: 'text',
          text: lData[ti][0],
          style: {
            color: lData[ti][1],
            fontSize: 25,
            fontFamily: 'monospace',
            fontWeight: '500',
          },
        });
      }
      codeRows.push({
        type: 'row',
        positioned: { left: 140, top: rowY },
        children: tokens,
      });
    }

    // Code stream layer (subtle opacity 0.26, soft blur 1.5)
    kids.push({
      type: 'stack',
      fit: 'expand',
      opacity: 0.26 * (1 - fadeT),
      blur: 1.5,
      children: codeRows,
    });

    // Soft dark radial mask behind the hero tile to ensure maximum contrast
    kids.push({
      type: 'circle',
      size: 960,
      fill: '#05070D',
      opacity: 0.72,
      blur: 85,
      positioned: { left: 960 - 480, top: sy - 480 },
    });

    // ---- The Obsidian Tile at (960, sy) ------------------------------------
    var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
    var tw_w = BRAND.tile.w * tileScale;
    var tw_h = BRAND.tile.h * tileScale;
    var tw_rx = BRAND.tile.rx * tileScale;

    // Ambient purple/blue backlight
    kids.push({
      type: 'circle',
      size: 540 * tileScale / 0.38,
      fill: '#5B61F6',
      opacity: 0.18 * (1 - fadeT),
      blur: 64,
      positioned: { left: 960 - (540 * tileScale / 0.38) / 2, top: sy - (540 * tileScale / 0.38) / 2 },
    });

    // Tile body
    kids.push({
      type: 'rect',
      width: tw_w,
      height: tw_h,
      radius: tw_rx,
      fill: '#0C1322',
      stroke: '#24324F',
      strokeWidth: Math.max(2, 5 * tileScale),
      opacity: 1 - fadeT * 0.4,
      positioned: { left: tl.x, top: tl.y },
    });

    // ---- Living Vector Face `( > _ o )` with smile -------------------------
    var eyeY = 430;
    var eyeR_cx = 675, eyeR = 76;
    var pL = brandToScreen(345, eyeY);
    var pR = brandToScreen(eyeR_cx, eyeY);
    var pMouth = brandToScreen(512, 635);

    // Cyan/blue iris glow
    kids.push({
      type: 'circle',
      size: 200 * tileScale,
      fill: '#5B61F6',
      opacity: 0.22,
      blur: 24,
      positioned: { left: pL.x - (200 * tileScale) / 2, top: pL.y - (200 * tileScale) / 2 },
    });
    kids.push({
      type: 'circle',
      size: 200 * tileScale,
      fill: '#2EBD9E',
      opacity: 0.22,
      blur: 24,
      positioned: { left: pR.x - (200 * tileScale) / 2, top: pR.y - (200 * tileScale) / 2 },
    });

    // Left eye: chevron > in brand blue
    var chPts = chevPoints(345, eyeY, 80, 88, 24);
    kids.push(polylineNode(chPts, 38, 1, '#5B61F6', 1));

    // Right eye: wink at frame 90–108
    var winkT = 0;
    if (frame >= 90 && frame <= 108) {
      if (frame < 94) winkT = (frame - 90) / 4;
      else if (frame <= 100) winkT = 1;
      else winkT = 1 - (frame - 100) / 8;
    }

    if (winkT > 0.01) {
      var dashW = lerp(eyeR * 2, 140, winkT);
      var dashH = lerp(38, 28, winkT);
      kids.push({
        type: 'rect',
        width: dashW * tileScale,
        height: dashH * tileScale,
        radius: (dashH / 2) * tileScale,
        fill: '#48C7E8',
        positioned: {
          left: pR.x - (dashW * tileScale) / 2,
          top: pR.y - (dashH * tileScale) / 2,
        },
      });
      if (winkT > 0.7) {
        kids.push({
          type: 'circle',
          size: 16 * tileScale,
          fill: '#FFFFFF',
          opacity: 0.95 * winkT,
          blur: 4,
          positioned: { left: pR.x + (dashW * tileScale) / 2 - 8 * tileScale, top: pR.y - 8 * tileScale },
        });
      }
    } else {
      var eyeRPtsOpen = ringPoints(eyeR_cx, eyeY, eyeR, 24);
      kids.push(polylineNode(eyeRPtsOpen, 38, 1, '#2EBD9E', 1));
    }

    // Smile `_`: the iconic terminal underscore smiling
    var mouthPulse = 1 + 0.08 * (winkT > 0.5 ? 1 : 0);
    var mouthW = 180 * mouthPulse;
    var mouthH = 34;
    kids.push({
      type: 'circle',
      size: 160 * tileScale,
      fill: '#48C7E8',
      opacity: 0.18,
      blur: 20,
      positioned: { left: pMouth.x - (160 * tileScale) / 2, top: pMouth.y - (160 * tileScale) / 2 },
    });
    kids.push({
      type: 'rect',
      width: mouthW * tileScale,
      height: mouthH * tileScale,
      radius: (mouthH / 2) * tileScale,
      fill: '#48C7E8',
      positioned: {
        left: pMouth.x - (mouthW * tileScale) / 2,
        top: pMouth.y - (mouthH * tileScale) / 2,
      },
    });

    // ---- The Type Beat: IT LIVES IN YOUR CODE. ------------------------------
    kids.push({
      type: 'text',
      text: 'IT LIVES IN YOUR CODE.',
      width: 1920,
      opacity: typeIn * (1 - fadeT),
      offsetY: typeOffY,
      style: {
        fontSize: 120,
        color: '#FFFFFF',
        fontFamily: 'Impact',
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
        gradient: silverGrad,
        textShadows: [
          { color: '#8C000000', blur: 30 },
          { color: '#448F6BFF', blur: 48 },
        ],
      },
      positioned: { left: 0, top: 720 },
    });

    // Fade to black overlay towards end of scene
    if (fadeT > 0.003) {
      kids.push({
        type: 'rect', width: 1920, height: 1080, fill: '#05070D',
        opacity: fadeT,
        positioned: { left: 0, top: 0 },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
