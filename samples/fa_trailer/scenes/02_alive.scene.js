// 02 — Alive — 3D Floating Code Galaxy with Depth of Field & Anamorphic Bloom.
//
// Exactly matching the reference image (clip_1789029739563.png / RR2EI8EEOOw):
//   · Rich midnight-navy backdrop with atmospheric indigo volumetric fog
//   · Multiple floating code blocks at varying Z-depths filling the screen
//   · Authentic optical depth-of-field blur (near/far blocks heavily defocused)
//   · Vibrant cyberpunk syntax palette: Hot Magenta (#FF2A85), Electric Cyan (#00F0FF),
//     Mint Green (#22EE99), Crisp White (#FFFFFF), Lilac (#A855F7)
//   · Horizontal anamorphic light bloom with white/cyan/magenta core flare
//   · Camera glides across the code field, focal plane shifts onto hero block
//   · Hero block locks in razor-sharp focus: `( > _ o ) // IT IS ALIVE`
//   · Winks `( > _ - )` with smile `_` and specular star flare
//   · Statement slams in: `IT LIVES IN YOUR CODE.` in metallic Impact typography.

scene = {
  id: '02_alive',
  duration: 180,
  from: 210,
  timeline: {
    label: 'Alive (Code Galaxy)',
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
    // 1. Midnight Navy Background & Atmospheric Fog (Matches Reference)
    // ------------------------------------------------------------------------
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#050915',
      positioned: { left: 0, top: 0 },
    });

    // Deep volumetric indigo ambient light
    kids.push({
      type: 'circle',
      size: 1400,
      fill: '#0E1C38',
      opacity: 0.45,
      blur: 160,
      positioned: { left: 960 - 700, top: 540 - 700 },
    });

    // ------------------------------------------------------------------------
    // 2. Camera & Focal Motion (Camera pans, Focal Plane shifts)
    // ------------------------------------------------------------------------
    // Phase 1 (0–45):   Camera drifts near left blocks (z ~ 400 in focus)
    // Phase 2 (45–90):  Camera sweeps right and centers on Hero Block (z = 500)
    // Phase 3 (90–125): Locked onto Hero Block, focal plane locked at z = 500
    // Phase 4 (125–180): Statement slams in, subtle dolly push

    var panT = tw(35, 55, 0, 1, 'easeInOutCubic');
    var camX = lerp(-140, 0, panT);
    var camY = lerp(-30, 0, panT);
    var camZoom = lerp(1.08, 1.0, panT);

    // Current camera focal plane (distance in Z that is 100% sharp)
    var currentFocalZ = lerp(400, 500, panT);

    // ------------------------------------------------------------------------
    // 3. Central Anamorphic Light Bloom (The Hot Flare in Reference)
    // ------------------------------------------------------------------------
    var flareX = 1020 + camX * 0.4;
    var flareY = 640 + camY * 0.4;
    var flarePulse = 0.85 + 0.15 * Math.sin((frame / 20) * Math.PI * 2);

    // Wide horizontal magenta glow streak
    kids.push({
      type: 'rect',
      width: 700,
      height: 40,
      radius: 20,
      fill: '#FF2A85',
      opacity: 0.32 * flarePulse,
      blur: 50,
      positioned: { left: flareX - 350, top: flareY - 20 },
    });

    // Mid cyan glow streak
    kids.push({
      type: 'rect',
      width: 440,
      height: 24,
      radius: 12,
      fill: '#00F0FF',
      opacity: 0.48 * flarePulse,
      blur: 28,
      positioned: { left: flareX - 220, top: flareY - 12 },
    });

    // Hot specular white core
    kids.push({
      type: 'rect',
      width: 140,
      height: 10,
      radius: 5,
      fill: '#FFFFFF',
      opacity: 0.80 * flarePulse,
      blur: 10,
      positioned: { left: flareX - 70, top: flareY - 5 },
    });

    // ------------------------------------------------------------------------
    // 4. Code Blocks (Structured Exactly like the Reference Image)
    // ------------------------------------------------------------------------
    var blocks = [
      // === BLOCK 1: CENTER-RIGHT HERO BLOCK (In Sharp Focus) ===
      {
        id: 'hero',
        x: 1050, y: 440, z: 500,
        isHero: true,
        lines: [
          [
            ['#include ', '#FF2A85'],
            ['"package:flutter_agent/flutter_agent.dart"', '#00F0FF'],
          ],
          [
            ['using namespace ', '#FF2A85'],
            ['fa;', '#FFFFFF'],
          ],
          [
            ['int ', '#00F0FF'],
            ['main', '#FFFFFF'],
            ['() ', '#00F0FF'],
            ['async {', '#FFFFFF'],
          ],
          [
            ['    final ', '#FF2A85'],
            ['livingAgent = ', '#FFFFFF'],
            ['await ', '#FF2A85'],
            ['Fa.boot();', '#00F0FF'],
          ],
          [
            ['    ( > _ o )', '#00F0FF'],
            ['  // IT IS ALIVE: watching your back', '#22EE99'],
          ],
          [
            ['    livingAgent.', '#FFFFFF'],
            ['wink', '#00F0FF'],
            ['(eye: Eye.right);  ', '#FFFFFF'],
            ['// emotions built in', '#22EE99'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 2: TOP-CENTER BLOCK (Func definition / medium blur) ===
      {
        id: 'top_center',
        x: 740, y: 70, z: 750,
        lines: [
          [
            ['printf', '#FF2A85'],
            ['("Inside autonomousLoop()\\n");', '#FFFFFF'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
          [
            ['void ', '#00F0FF'],
            ['func2', '#FFFFFF'],
            ['() {', '#00F0FF'],
          ],
          [
            ['    class ', '#FF2A85'],
            ['CubesSecurity ', '#00F0FF'],
            ['{ int ', '#00F0FF'],
            ['id; };', '#FFFFFF'],
          ],
          [
            ['    printf', '#FF2A85'],
            ['("Cubes sandbox: 100% isolated\\n");', '#FFFFFF'],
          ],
          [
            ['    return;', '#FF2A85'],
          ],
        ],
      },

      // === BLOCK 3: TOP-RIGHT BLOCK (Streaming & Operators) ===
      {
        id: 'top_right',
        x: 1220, y: 90, z: 980,
        lines: [
          [
            ['using namespace ', '#FF2A85'],
            ['std;', '#FFFFFF'],
          ],
          [
            ['int ', '#00F0FF'],
            ['main() {', '#FFFFFF'],
          ],
          [
            ['    int ', '#00F0FF'],
            ['a = 10, b = 120;', '#FFFFFF'],
          ],
          [
            ['    // INCREMENT', '#22EE99'],
          ],
          [
            ['    stream << ', '#00F0FF'],
            ['"Value of models: 10 providers" ', '#FFFFFF'],
            ['<< endl;', '#00F0FF'],
          ],
          [
            ['    stream << ', '#00F0FF'],
            ['"120 fps Impeller Metal butter" ', '#FFFFFF'],
            ['<< endl;', '#00F0FF'],
          ],
        ],
      },

      // === BLOCK 4: FAR-LEFT BLOCK (Witty Developer Companion) ===
      {
        id: 'far_left',
        x: 120, y: 190, z: 420,
        lines: [
          [
            ['if ', '#FF2A85'],
            ['(user.isTired) {', '#FFFFFF'],
          ],
          [
            ['    coffee.', '#FFFFFF'],
            ['brew', '#00F0FF'],
            ['();  terminal.', '#FFFFFF'],
            ['takeOver', '#00F0FF'],
            ['();', '#FFFFFF'],
          ],
          [
            ['    agent.', '#FFFFFF'],
            ['whisper', '#00F0FF'],
            ['("Go to sleep, I will ship.");', '#FFFFFF'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
          [
            ['// pure Dart core, zero Node.js drama', '#22EE99'],
          ],
          [
            ['final ', '#FF2A85'],
            ['hands = [', '#FFFFFF'],
            ['ShellTool', '#00F0FF'],
            ['(), ', '#FFFFFF'],
            ['AstRewrite', '#00F0FF'],
            ['()];', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 5: LOWER-LEFT BLOCK (Foreground defocussed) ===
      {
        id: 'lower_left',
        x: 100, y: 640, z: 280,
        lines: [
          [
            ['class ', '#FF2A85'],
            ['FaSuperpowers ', '#00F0FF'],
            ['implements ', '#FF2A85'],
            ['Companion {', '#FFFFFF'],
          ],
          [
            ['    bool get ', '#FF2A85'],
            ['hasHands => ', '#FFFFFF'],
            ['true;', '#00F0FF'],
          ],
          [
            ['    void ', '#FF2A85'],
            ['gitPushForce', '#00F0FF'],
            ['() => ', '#FFFFFF'],
            ['throw ', '#FF2A85'],
            ['NeverDoThat();', '#00F0FF'],
          ],
          [
            ['    final ', '#FF2A85'],
            ['memory = ', '#FFFFFF'],
            ['LocalBrain.', '#00F0FF'],
            ['load(100.gb);', '#FFFFFF'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 6: CENTER-BOTTOM BLOCK (Sitting in the cyan/magenta flare) ===
      {
        id: 'center_bottom',
        x: 620, y: 660, z: 580,
        lines: [
          [
            ['#include ', '#FF2A85'],
            ['<yoclip/timeline.h>', '#00F0FF'],
          ],
          [
            ['void ', '#00F0FF'],
            ['compilePptx', '#FFFFFF'],
            ['() => ', '#00F0FF'],
            ['YoClip.toPptx(editable: true);', '#FFFFFF'],
          ],
          [
            ['final ', '#FF2A85'],
            ['platforms = [', '#FFFFFF'],
            ['MacOS, Windows, iOS, Android', '#00F0FF'],
            ['];', '#FFFFFF'],
          ],
          [
            ['// 100% offline fallback when cloud goes down', '#22EE99'],
          ],
          [
            ['return ', '#FF2A85'],
            ['Fa.runLocally();', '#00F0FF'],
          ],
        ],
      },

      // === BLOCK 7: DEEP BACKGROUND BLOCK 1 (Heavy blur / hazy code) ===
      {
        id: 'bg_left',
        x: 480, y: 380, z: 1250,
        lines: [
          [
            ['Swarm.spawn', '#00F0FF'],
            ['(count: 32, protocol: a2a);', '#FFFFFF'],
          ],
          [
            ['subagents.broadcast("divide, conquer, deliver");', '#4F6B9E'],
          ],
          [
            ['await session.delegate("explore", "find bug in 2s");', '#4F6B9E'],
          ],
          [
            ['expect(allTests, equals(allPass));', '#4F6B9E'],
          ],
        ],
      },

      // === BLOCK 8: DEEP BACKGROUND BLOCK 2 (Far right haze) ===
      {
        id: 'bg_right',
        x: 1480, y: 490, z: 1450,
        lines: [
          [
            ['terminal.autofire(">_ flutter run --impeller");', '#4F6B9E'],
          ],
          [
            ['fps.measure(); // 120 fps butter', '#22EE99'],
          ],
          [
            ['void commit() => git.commit("refactor with Fa");', '#4F6B9E'],
          ],
        ],
      },
    ];

    // Wink timing on Hero Block: frames 98–118
    var winkT = 0;
    if (frame >= 98 && frame <= 118) {
      if (frame < 103) winkT = (frame - 98) / 5;
      else if (frame <= 110) winkT = 1;
      else winkT = 1 - (frame - 110) / 8;
    }

    var fadeOut = tw(158, 22, 0, 1, 'easeInOutCubic');

    // ------------------------------------------------------------------------
    // 5. Render Code Blocks with Optical Depth of Field (Blur + Opacity)
    // ------------------------------------------------------------------------
    // Sort blocks descending by Z so deep blocks render behind
    var sortedBlocks = blocks.slice();
    sortedBlocks.sort(function(a, b) { return b.z - a.z; });

    for (var bi = 0; bi < sortedBlocks.length; bi++) {
      var b = sortedBlocks[bi];

      // Calculate optical distance from current focal plane
      var distFromFocus = Math.abs(b.z - currentFocalZ);

      // Depth of field blur sigma:
      // When at focal plane: blur = 0 (crystal sharp!).
      // When far away: blur up to 8–12px.
      var blurSigma = 0;
      if (distFromFocus > 30) {
        blurSigma = (distFromFocus - 30) * 0.016;
      }
      if (b.isHero && frame >= 85) {
        blurSigma = 0; // Hero is always pinned razor sharp after camera docks
      }

      // Parallax position
      var px = 960 + (b.x - 960 + camX) * camZoom;
      var py = 540 + (b.y - 540 + camY) * camZoom;

      // Opacity based on distance and focus
      var blockOp = 1.0;
      if (b.z > 1000) {
        blockOp = Math.max(0.25, 1.0 - (b.z - 1000) / 900);
      }
      if (!b.isHero && frame >= 90) {
        // Subtle dim of background when hero locks in
        var dockDim = tw(90, 20, 0, 1, 'easeOut');
        blockOp *= lerp(1.0, 0.45, dockDim);
      }

      if (frame >= 125) {
        // Everything dims slightly for title slam
        var titleDim = tw(125, 20, 0, 1, 'easeOut');
        blockOp *= lerp(1.0, 0.20, titleDim);
      }

      var rowWidgets = [];
      for (var li = 0; li < b.lines.length; li++) {
        var lineTokens = b.lines[li];
        var tokenWidgets = [];

        for (var ti = 0; ti < lineTokens.length; ti++) {
          var txt = lineTokens[ti][0];
          var col = lineTokens[ti][1];

          // Dynamic wink on hero face!
          if (b.isHero && txt === '    ( > _ o )') {
            if (winkT > 0.01) {
              txt = '    ( > _ - )';
              col = '#00F0FF';
            }
          }

          var isFaceToken = b.isHero && (txt === '    ( > _ o )' || txt === '    ( > _ - )');

          tokenWidgets.push({
            type: 'text',
            text: txt,
            style: {
              color: col,
              fontSize: isFaceToken ? 29 : 22,
              fontFamily: 'monospace',
              fontWeight: (b.isHero || isFaceToken) ? '700' : '500',
              shadows: blurSigma > 0.5 ? [] : [
                { color: col, blur: 6, offset: { x: 0, y: 0 } },
              ],
            },
          });
        }

        rowWidgets.push({
          type: 'row',
          children: tokenWidgets,
        });
      }

      var colWidget = {
        type: 'column',
        children: rowWidgets,
      };

      // Wrap in blurred container if out of focus!
      var containerProps = {
        type: 'container',
        opacity: blockOp * (1 - fadeOut),
        positioned: { left: px, top: py },
        child: colWidget,
      };

      if (blurSigma > 0.6) {
        containerProps.blur = Math.min(10, blurSigma);
      }

      kids.push(containerProps);

      // Hero glow halo & Specular star spark on eye
      if (b.isHero && frame >= 85 && frame < 135) {
        kids.push({
          type: 'rect',
          width: 620,
          height: 180,
          radius: 16,
          fill: '#00F0FF',
          opacity: (0.12 + 0.08 * (winkT > 0.5 ? 1 : 0)) * blockOp,
          blur: 32,
          positioned: { left: px - 20, top: py + 70 },
        });

        if (winkT > 0.5) {
          // Specular star / spark on right winking eye
          var sparkX = px + 158;
          var sparkY = py + 115;
          kids.push({
            type: 'circle',
            size: 34,
            fill: '#FFFFFF',
            opacity: 0.95 * winkT,
            blur: 5,
            positioned: { left: sparkX - 17, top: sparkY - 17 },
          });
          kids.push({
            type: 'circle',
            size: 60,
            fill: '#00F0FF',
            opacity: 0.75 * winkT,
            blur: 16,
            positioned: { left: sparkX - 30, top: sparkY - 30 },
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // 6. Floating Optical Bokeh Spheres (Floating in Front of Camera)
    // ------------------------------------------------------------------------
    var bokehDots = [
      { x: 300, y: 220, size: 28, col: '#FF2A85', op: 0.35 },
      { x: 880, y: 440, size: 44, col: '#00F0FF', op: 0.30 },
      { x: 1400, y: 280, size: 36, col: '#A855F7', op: 0.28 },
      { x: 1600, y: 720, size: 50, col: '#00F0FF', op: 0.25 },
      { x: 420, y: 800, size: 32, col: '#FF2A85', op: 0.32 },
    ];

    for (var bi = 0; bi < bokehDots.length; bi++) {
      var bk = bokehDots[bi];
      var bkX = bk.x + camX * 1.4;
      var bkY = bk.y + camY * 1.4;
      kids.push({
        type: 'circle',
        size: bk.size,
        fill: bk.col,
        opacity: bk.op * (1 - fadeOut),
        blur: bk.size * 0.45,
        positioned: { left: bkX - bk.size / 2, top: bkY - bk.size / 2 },
      });
    }

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
          shadows: [
            { color: '#00F0FF', blur: 40, offset: { x: 0, y: 8 } },
            { color: '#000000', blur: 60, offset: { x: 0, y: 20 } },
          ],
        },
        positioned: { left: 0, top: 460 },
      });
    }

    // Cinematic edge vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
      opacity: 0.26,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
