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
      size: 1500,
      fill: '#0C1322',
      opacity: 0.65,
      blur: 160,
      positioned: { left: 960 - 750, top: 540 - 750 },
    });
    kids.push({
      type: 'circle',
      size: 800,
      fill: '#5B61F6',
      opacity: 0.12,
      blur: 120,
      positioned: { left: 960 - 400, top: 540 - 400 },
    });

    // ------------------------------------------------------------------------
    // 2. Camera & Focal Motion (Camera pans, Focal Plane shifts)
    // ------------------------------------------------------------------------
    // Phase 1 (0–35):   Camera drifts near left blocks (z ~ 320 in focus)
    // Phase 2 (35–85):  Camera sweeps right and rack-focuses onto Hero Block (z = 500)
    // Phase 3 (85–125): Locked onto Hero Block, focal plane locked at z = 500
    // Phase 4 (125–180): Statement slams in, subtle dolly push

    var panT = tw(25, 60, 0, 1, 'easeInOutCubic');
    var camX = lerp(-140, 0, panT);
    var camY = lerp(-30, 0, panT);
    var camZoom = lerp(1.08, 1.0, panT);

    // Current camera focal plane (distance in Z that is 100% sharp)
    // Dynamic rack focus: shifts from 320 to 500 as camera pans!
    var currentFocalZ = lerp(320, 500, tw(20, 65, 0, 1, 'easeInOutCubic'));

    // ------------------------------------------------------------------------
    // 3. Central Anamorphic Light Bloom (Harmonized with Scene 01)
    // ------------------------------------------------------------------------
    var flareX = 1020 + camX * 0.4;
    var flareY = 640 + camY * 0.4;
    var flarePulse = 0.85 + 0.15 * Math.sin((frame / 20) * Math.PI * 2);

    // Wide horizontal neon orchid glow streak
    kids.push({
      type: 'rect',
      width: 700,
      height: 36,
      radius: 18,
      fill: '#E056FD',
      opacity: 0.28 * flarePulse,
      blur: 46,
      positioned: { left: flareX - 350, top: flareY - 18 },
    });

    // Mid brand-blue & cyan glow streak
    kids.push({
      type: 'rect',
      width: 460,
      height: 22,
      radius: 11,
      fill: '#5B61F6',
      opacity: 0.42 * flarePulse,
      blur: 24,
      positioned: { left: flareX - 230, top: flareY - 11 },
    });

    // Hot specular cyan core
    kids.push({
      type: 'rect',
      width: 160,
      height: 8,
      radius: 4,
      fill: '#48C7E8',
      opacity: 0.85 * flarePulse,
      blur: 8,
      positioned: { left: flareX - 80, top: flareY - 4 },
    });

    // ------------------------------------------------------------------------
    // 4. Code Blocks (Dense Code Galaxy Filling the Screen)
    // ------------------------------------------------------------------------
    var blocks = [
      // === BLOCK 1: CENTER-RIGHT HERO BLOCK (In Sharp Focus) ===
      {
        id: 'hero',
        x: 1040, y: 430, z: 500,
        isHero: true,
        lines: [
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
          // LIVING FACE TOKEN: Split into exact canonical brand colors from Scene 01!
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
            ['}', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 2: TOP-RIGHT: 10+ PROVIDERS BYOK ===
      {
        id: 'providers_byok',
        x: 1220, y: 65, z: 680,
        lines: [
          [
            ['// 10+ LLM PROVIDERS · ZERO LOCK-IN · BYOK', '#2EBD9E'],
          ],
          [
            ['const ', '#E056FD'],
            ['providers = [', '#FFFFFF'],
          ],
          [
            ['    Anthropic.', '#FFFFFF'],
            ['claude_3_5_sonnet', '#5B61F6'],
            ['({ cache: true }),', '#48C7E8'],
          ],
          [
            ['    OpenAI.', '#FFFFFF'],
            ['gpt_4o', '#5B61F6'],
            ['({ jsonSchema: true }),', '#48C7E8'],
          ],
          [
            ['    DeepSeek.', '#FFFFFF'],
            ['r1_reasoning', '#5B61F6'],
            ['({ localFallback: true }),', '#48C7E8'],
          ],
          [
            ['    Google.', '#FFFFFF'],
            ['gemini_2_0_flash', '#5B61F6'],
            ['({ multimodal: true }),', '#48C7E8'],
          ],
          [
            ['    Ollama.', '#FFFFFF'],
            ['local', '#2EBD9E'],
            ['("llama3.3:70b"), ', '#48C7E8'],
            ['// 100% offline', '#2EBD9E'],
          ],
          [
            ['    Groq.', '#FFFFFF'],
            ['ultraFast', '#E056FD'],
            ['("500 tok/s"), Mistral, Bedrock', '#FFFFFF'],
          ],
          [
            ['];', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 3: TOP-CENTER BLOCK (Cubes Sandbox & Security) ===
      {
        id: 'top_center',
        x: 620, y: 60, z: 740,
        lines: [
          [
            ['class ', '#E056FD'],
            ['CubesSecurity ', '#5B61F6'],
            ['extends ', '#E056FD'],
            ['SandboxPolicy {', '#FFFFFF'],
          ],
          [
            ['    Tier get ', '#E056FD'],
            ['approvalLevel => ', '#FFFFFF'],
            ['Tier.threeProtected;', '#48C7E8'],
          ],
          [
            ['    bool get ', '#E056FD'],
            ['networkIsolated => ', '#FFFFFF'],
            ['true;', '#2EBD9E'],
          ],
          [
            ['    void ', '#5B61F6'],
            ['verifyExecution', '#FFFFFF'],
            ['(Token vault) => vault.', '#FFFFFF'],
            ['assertSanitized', '#5B61F6'],
            ['();', '#FFFFFF'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 4: TOP-LEFT BLOCK (Fa Autonomous Engine & AST) ===
      {
        id: 'top_left',
        x: 80, y: 70, z: 820,
        lines: [
          [
            ['import ', '#E056FD'],
            ['"package:analyzer/dart/ast/ast.dart";', '#48C7E8'],
          ],
          [
            ['final ', '#E056FD'],
            ['astWorker = ', '#FFFFFF'],
            ['AstRewriter.', '#5B61F6'],
            ['atomic(path);', '#48C7E8'],
          ],
          [
            ['await astWorker.', '#FFFFFF'],
            ['refactorWorkspace', '#5B61F6'],
            ['(diagnostics: true);', '#FFFFFF'],
          ],
          [
            ['// surgical hashline patches, zero hallucinations', '#2EBD9E'],
          ],
        ],
      },

      // === BLOCK 5: MID-LEFT BLOCK (Witty Developer Companion) ===
      {
        id: 'mid_left',
        x: 100, y: 260, z: 420,
        lines: [
          [
            ['if ', '#E056FD'],
            ['(user.isTired) {', '#FFFFFF'],
          ],
          [
            ['    coffee.', '#FFFFFF'],
            ['brew', '#48C7E8'],
            ['();  terminal.', '#FFFFFF'],
            ['takeOver', '#5B61F6'],
            ['();', '#FFFFFF'],
          ],
          [
            ['    agent.', '#FFFFFF'],
            ['whisper', '#48C7E8'],
            ['("Go to sleep, I will ship.");', '#FFFFFF'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
          [
            ['// pure Dart core, zero Node.js drama', '#2EBD9E'],
          ],
          [
            ['final ', '#E056FD'],
            ['hands = [', '#FFFFFF'],
            ['ShellTool', '#5B61F6'],
            ['(), ', '#FFFFFF'],
            ['AstRewrite', '#48C7E8'],
            ['(), ', '#FFFFFF'],
            ['LspSymbol', '#5B61F6'],
            ['()];', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 5B: LEFT-CENTER BRIDGE (Git & Atomic Commits) ===
      {
        id: 'left_bridge',
        x: 110, y: 460, z: 360,
        lines: [
          [
            ['// Git-backed atomic memory & union merge', '#2EBD9E'],
          ],
          [
            ['await ', '#E056FD'],
            ['git.stage', '#5B61F6'],
            ['(["lib/**", "memory/**"]);', '#48C7E8'],
          ],
          [
            ['await ', '#E056FD'],
            ['git.commit', '#5B61F6'],
            ['("feat: autonomous video pipeline");', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 5C: MID-CENTER A2A PROTOCOL ===
      {
        id: 'mid_center',
        x: 600, y: 310, z: 580,
        lines: [
          [
            ['// A2A Protocol: Cross-Machine Agent Fabric', '#2EBD9E'],
          ],
          [
            ['final ', '#E056FD'],
            ['fabric = ', '#FFFFFF'],
            ['A2AGateway.', '#5B61F6'],
            ['mesh(cluster: "apple-silicon");', '#48C7E8'],
          ],
          [
            ['await fabric.', '#FFFFFF'],
            ['broadcast', '#5B61F6'],
            ['(SubagentTask("render_gpu"));', '#FFFFFF'],
          ],
          [
            ['peer.onReply((res) => print("Delivered in 4ms"));', '#2EBD9E'],
          ],
        ],
      },

      // === BLOCK 5D: MID-RIGHT CONTEXT PRUNING ===
      {
        id: 'mid_right',
        x: 1420, y: 310, z: 560,
        lines: [
          [
            ['// Intelligent Context Pruning & Checkpoints', '#2EBD9E'],
          ],
          [
            ['final ', '#E056FD'],
            ['ctx = ', '#FFFFFF'],
            ['AgentContext.', '#5B61F6'],
            ['checkpoint("research");', '#48C7E8'],
          ],
          [
            ['await ctx.', '#FFFFFF'],
            ['rewind', '#5B61F6'],
            ['(keepReport: true);', '#FFFFFF'],
          ],
          [
            ['expect(tokens.active, lessThan(6000));', '#48C7E8'],
          ],
        ],
      },

      // === BLOCK 6: LOWER-LEFT FOREGROUND BLOCK (Near camera: z = 280) ===
      {
        id: 'lower_left',
        x: 90, y: 640, z: 280,
        lines: [
          [
            ['class ', '#E056FD'],
            ['FaSuperpowers ', '#5B61F6'],
            ['implements ', '#E056FD'],
            ['Companion {', '#FFFFFF'],
          ],
          [
            ['    bool get ', '#E056FD'],
            ['hasHands => ', '#FFFFFF'],
            ['true;', '#2EBD9E'],
          ],
          [
            ['    void ', '#5B61F6'],
            ['gitPushForce', '#FFFFFF'],
            ['() => ', '#FFFFFF'],
            ['throw ', '#E056FD'],
            ['NeverDoThat();', '#E056FD'],
          ],
          [
            ['    final ', '#E056FD'],
            ['memory = ', '#FFFFFF'],
            ['GitBackedBrain.', '#5B61F6'],
            ['load(path: "./memory");', '#48C7E8'],
          ],
          [
            ['}', '#FFFFFF'],
          ],
        ],
      },

      // === BLOCK 7: CENTER-BOTTOM BLOCK (Sitting in the flare) ===
      {
        id: 'center_bottom',
        x: 620, y: 650, z: 580,
        lines: [
          [
            ['#include ', '#E056FD'],
            ['<yoclip/timeline.h>', '#48C7E8'],
          ],
          [
            ['void ', '#5B61F6'],
            ['compilePptx', '#FFFFFF'],
            ['() => ', '#5B61F6'],
            ['YoClip.toPptx(editable: true);', '#48C7E8'],
          ],
          [
            ['final ', '#E056FD'],
            ['platforms = [', '#FFFFFF'],
            ['MacOS, Windows, iOS, Android', '#48C7E8'],
            ['];', '#FFFFFF'],
          ],
          [
            ['// 100% offline fallback when cloud goes down', '#2EBD9E'],
          ],
          [
            ['return ', '#E056FD'],
            ['Fa.runLocally(gpu: "Metal/Impeller");', '#48C7E8'],
          ],
        ],
      },

      // === BLOCK 8: BOTTOM-RIGHT BLOCK (Impeller GPU 120fps engine) ===
      {
        id: 'bottom_right',
        x: 1360, y: 640, z: 460,
        lines: [
          [
            ['// Impeller GPU headless renderer', '#2EBD9E'],
          ],
          [
            ['final ', '#E056FD'],
            ['engine = ', '#FFFFFF'],
            ['HeadlessRenderer.', '#5B61F6'],
            ['gpu(metal: true);', '#48C7E8'],
          ],
          [
            ['await engine.', '#FFFFFF'],
            ['renderVideo', '#5B61F6'],
            ['(fps: 120, codec: "h264");', '#FFFFFF'],
          ],
          [
            ['expect(fps.avg, greaterThan(119.8));', '#48C7E8'],
          ],
        ],
      },

      // === BLOCK 9: DEEP BACKGROUND BLOCK 1 (Swarm & A2A protocol) ===
      {
        id: 'bg_left',
        x: 440, y: 390, z: 1200,
        lines: [
          [
            ['Swarm.spawn', '#5B61F6'],
            ['(count: 32, protocol: a2a);', '#FFFFFF'],
          ],
          [
            ['subagents.broadcast("divide, conquer, deliver");', '#3D4F72'],
          ],
          [
            ['await session.delegate("explore", "find bug in 2s");', '#3D4F72'],
          ],
          [
            ['expect(allTests, equals(allPass));', '#3D4F72'],
          ],
        ],
      },

      // === BLOCK 10: DEEP BACKGROUND BLOCK 2 (Far right haze) ===
      {
        id: 'bg_right',
        x: 1540, y: 390, z: 1350,
        lines: [
          [
            ['terminal.autofire(">_ flutter run --impeller");', '#3D4F72'],
          ],
          [
            ['fps.measure(); // 120 fps butter', '#2EBD9E'],
          ],
          [
            ['void commit() => git.commit("refactor with Fa");', '#3D4F72'],
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
      // Subtle optical depth: text stays readable while feeling deep and layered
      var blurSigma = 0;
      if (distFromFocus > 40) {
        blurSigma = Math.min(5.5, (distFromFocus - 40) * 0.011);
      }
      if (b.isHero && frame >= 85) {
        blurSigma = 0; // Hero is pinned razor sharp after camera docks
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

          // Dynamic eye resolution on hero face
          if (txt === 'eyeRight') {
            txt = winkT > 0.01 ? '-' : 'o';
            col = '#48C7E8';
          }

          var isFaceToken = b.isHero && (
            txt === '    ( ' || txt === '>' || txt === ' _ ' ||
            txt === 'o' || txt === '-' || txt === ' )'
          );

          tokenWidgets.push({
            type: 'text',
            text: txt,
            style: {
              color: col,
              fontSize: isFaceToken ? 30 : 21,
              fontFamily: 'monospace',
              fontWeight: (b.isHero || isFaceToken) ? '800' : '500',
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
