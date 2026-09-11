// 06 — Power — three architectural feature beats in Apple's macro style.
//
//   ·  Beat 1 (0–70):   CUBES.      (wireframe sandbox + declarative security)
//   ·  Beat 2 (70–140): MEMORY / BUILT IN.  (over ai_swarm, full-bleed stacked caps)
//   ·  Beat 3 (140–210): SUBAGENTS. (metallic violet punch + swarm particles)
//
// Key typographic properties:
// - Heavy Impact typeface filling 85–92% of the canvas.
// - Multi-stop metallic gradients for specular depth.
// - Tight vertical rhythm matching Apple's architectural poster layouts.

scene = {
  id: '06_power',
  duration: 210,
  from: 1020,
  timeline: {
    label: 'Power',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function clamp01(v) {
      if (v <= 0) return 0;
      if (v >= 1) return 1;
      return v;
    }

    var b1 = 1 - tw(64, 6, 0, 1, 'easeIn');
    var b2 = tw(70, 6, 0, 1, 'easeOut') * (1 - tw(134, 6, 0, 1, 'easeIn'));
    var b3 = tw(140, 6, 0, 1, 'easeOut');

    var silverGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var gunmetalGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#C8C8D2', '#848490'],
      stops: [0.0, 1.0],
    };

    var purpleGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#E6C4FF', '#A368FF', '#6222D6'],
      stops: [0.0, 0.45, 1.0],
    };

    // ---- Beat 1 — CUBES. ----------------------------------------------------
    // Out-of-the-box cube variations grid (8 presets from Fa security ladder)
    var cubePresets = [
      {
        id: 'L1-CORE', tier: 'L1 SANDBOX', col: '#2EBD9E',
        role: 'STRICT WORKSPACE ISOLATION',
        fs: 'fs: [.] (workspace only)',
        fsNote: 'No host reading · /Users blocked',
        net: 'net: none (air-gapped offline)',
        netNote: '0 outbound sockets permitted',
        tools: 'Core read, write & edit tools',
        policyNote: 'Arbitrary shell execution blocked',
        summary: 'Safe for untrusted PR reviews & unknown repos',
      },
      {
        id: 'L1-FULL', tier: 'L1 SANDBOX', col: '#2EBD9E',
        role: 'ISOLATED CLI WORKSPACE',
        fs: 'fs: [.] (workspace only)',
        fsNote: 'Scripts locked inside project dir',
        net: 'net: none (air-gapped offline)',
        netNote: '0 external connections allowed',
        tools: 'Full bash, local scripts & build',
        policyNote: 'Shell execution strictly sandboxed',
        summary: 'Fast local refactoring & offline test suites',
      },
      {
        id: 'L2-CORE', tier: 'L2 AUDITED', col: '#5B61F6',
        role: 'AUDITED DEVELOPER RUNTIME',
        fs: 'fs: ro / · rw [.] (project)',
        fsNote: 'Host root read-only · project rw',
        net: 'net: dev domain allowlist',
        netNote: 'git, pub, npm registry whitelisted',
        tools: 'Compilers, linters & LSP servers',
        policyNote: 'Protected system files unmodifiable',
        summary: 'Standard daily workflow with package downloads & LSP',
      },
      {
        id: 'L2-FULL', tier: 'L2 AUDITED', col: '#8F6BFF',
        role: 'STANDARD AGENT ENVIRONMENT',
        fs: 'fs: ro / · rw [.] (project)',
        fsNote: 'Read-only root · safe project edits',
        net: 'net: dev net & package managers',
        netNote: 'Full dependency fetching enabled',
        tools: 'Full bash, build toolchains & test',
        policyNote: 'Destructive commands gated by policy',
        summary: 'Comprehensive compilation & full build pipelines',
      },
      {
        id: 'L3-CORE', tier: 'L3 POWER', col: '#A092ED',
        role: 'SYSTEM-WIDE AUDITED ACCESS',
        fs: 'fs: rw / (full disk audited)',
        fsNote: 'Read-write across host directories',
        net: 'net: full open network',
        netNote: 'HTTP/HTTPS, SSH & custom ports',
        tools: 'OS diagnostics, CLI & multi-repo',
        policyNote: 'Destructive actions prompt confirmation',
        summary: 'Cross-repo orchestration & multi-project refactoring',
      },
      {
        id: 'L3-FULL', tier: 'L3 POWER', col: '#A368FF',
        role: 'UNRESTRICTED AUTONOMOUS ROOT',
        fs: 'fs: rw / (unrestricted root)',
        fsNote: 'Complete host machine access',
        net: 'net: open internet & daemon ports',
        netNote: 'Unrestricted socket & network binding',
        tools: 'Unrestricted headless tool suite',
        policyNote: 'Zero approval prompts · Dark factory',
        summary: 'Autonomous background agents & dark factory CI',
      },
      {
        id: 'EPHEMERAL', tier: 'TMP RAM', col: '#C084FC',
        role: 'RAM SCRATCHPAD DISK',
        fs: 'fs: tmpfs (pure RAM mount)',
        fsNote: 'In-memory workspace · 0 disk writes',
        net: 'net: isolated dev access',
        netNote: 'Package fetching into RAM cache',
        tools: 'Volatile sandboxed build & run',
        policyNote: 'Auto-wiped on process termination',
        summary: 'Zero-trace security testing & disposable tasks',
      },
      {
        id: 'CONTAINER', tier: 'OCI DOCKER', col: '#2EBD9E',
        role: 'HERMETIC DOCKER PIPELINE',
        fs: 'fs: disposable OCI rootfs',
        fsNote: 'Isolated container volume mount',
        net: 'net: virtual bridge network',
        netNote: 'Sandboxed virtual container bridge',
        tools: 'Docker / Podman container daemon',
        policyNote: 'Reproducible hermetic environment',
        summary: 'Production container builds, cloud CI & air-tight runs',
      },
    ];

    var gridIn = tw(0, 24, 0, 1, 'easeOutCubic');
    var b1kids = [];

    // Header: CUBES. + Subtitle
    b1kids.push({
      type: 'text',
      text: 'CUBES.',
      width: 1920,
      opacity: clamp01(gridIn),
      style: {
        fontSize: 72,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        letterSpacing: 6,
      },
      positioned: { left: 0, top: 26 },
    });

    b1kids.push({
      type: 'text',
      text: 'DECLARATIVE YAML SANDBOX · 8 VERIFIED APPROVAL TIERS',
      width: 1920,
      opacity: clamp01(gridIn * 0.9),
      style: {
        fontSize: 17,
        fontFamily: 'Impact',
        color: '#A368FF',
        letterSpacing: 2,
        textAlign: 'center',
      },
      positioned: { left: 0, top: 104 },
    });

    // 4 Columns x 2 Rows Grid of 390x390 Cube Squares
    var cW = 390;
    var cH = 390;
    var cGapX = 26;
    var cGapY = 32;
    var cStartX = (1920 - (4 * cW + 3 * cGapX)) / 2; // 141

    for (var ci = 0; ci < cubePresets.length; ci++) {
      var cp = cubePresets[ci];
      var colIdx = ci % 4;
      var rowIdx = Math.floor(ci / 4);
      var cX = cStartX + colIdx * (cW + cGapX);
      var cY = rowIdx === 0 ? 150 : 572;

      var cardDrift = (1 - gridIn) * (rowIdx === 0 ? -30 : 30);

      // Cube Square Container
      b1kids.push({
        type: 'rect',
        width: cW,
        height: cH,
        radius: 20,
        fill: '#080E1B',
        border: { color: cp.col, width: 1.5 },
        opacity: clamp01(gridIn * 0.95),
        offsetY: cardDrift,
        positioned: { left: cX, top: cY },
      });

      // Accent color strip on left edge
      b1kids.push({
        type: 'rect',
        width: 4,
        height: cH - 32,
        radius: 2,
        fill: cp.col,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        positioned: { left: cX + 12, top: cY + 16 },
      });

      // Tier badge pill
      b1kids.push({
        type: 'rect',
        width: 86,
        height: 22,
        radius: 11,
        fill: '#121F38',
        border: { color: cp.col, width: 1.0 },
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        positioned: { left: cX + 24, top: cY + 18 },
      });
      b1kids.push({
        type: 'text',
        text: cp.tier,
        width: 86,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 10,
          fontFamily: 'Impact',
          color: cp.col,
          textAlign: 'center',
          letterSpacing: 0.8,
        },
        positioned: { left: cX + 24, top: cY + 22 },
      });

      // Preset ID
      b1kids.push({
        type: 'text',
        text: cp.id,
        width: cW - 130,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 22,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          letterSpacing: 1.5,
        },
        positioned: { left: cX + 118, top: cY + 16 },
      });

      // Role subtitle
      b1kids.push({
        type: 'text',
        text: cp.role,
        width: cW - 48,
        opacity: clamp01(gridIn * 0.9),
        offsetY: cardDrift,
        style: {
          fontSize: 12,
          fontFamily: 'Impact',
          color: cp.col,
          letterSpacing: 1,
        },
        positioned: { left: cX + 24, top: cY + 48 },
      });

      // Divider line
      b1kids.push({
        type: 'rect',
        width: cW - 48,
        height: 1,
        fill: '#1E2D4A',
        opacity: clamp01(gridIn * 0.8),
        offsetY: cardDrift,
        positioned: { left: cX + 24, top: cY + 72 },
      });

      // Policy Line 1: FILESYSTEM
      b1kids.push({
        type: 'text',
        text: 'FILESYSTEM POLICY',
        opacity: clamp01(gridIn * 0.7),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: '#6A7D9A',
          letterSpacing: 0.8,
        },
        positioned: { left: cX + 24, top: cY + 84 },
      });
      b1kids.push({
        type: 'text',
        text: cp.fs,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: '#FFFFFF',
        },
        positioned: { left: cX + 24, top: cY + 98 },
      });
      b1kids.push({
        type: 'text',
        text: cp.fsNote,
        opacity: clamp01(gridIn * 0.75),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          color: '#8899B0',
        },
        positioned: { left: cX + 24, top: cY + 114 },
      });

      // Policy Line 2: NETWORK
      b1kids.push({
        type: 'text',
        text: 'NETWORK ACCESS',
        opacity: clamp01(gridIn * 0.7),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: '#6A7D9A',
          letterSpacing: 0.8,
        },
        positioned: { left: cX + 24, top: cY + 138 },
      });
      b1kids.push({
        type: 'text',
        text: cp.net,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: '#FFFFFF',
        },
        positioned: { left: cX + 24, top: cY + 152 },
      });
      b1kids.push({
        type: 'text',
        text: cp.netNote,
        opacity: clamp01(gridIn * 0.75),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          color: '#8899B0',
        },
        positioned: { left: cX + 24, top: cY + 168 },
      });

      // Policy Line 3: SHELL & TOOLS
      b1kids.push({
        type: 'text',
        text: 'EXECUTION & TOOLS',
        opacity: clamp01(gridIn * 0.7),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: '#6A7D9A',
          letterSpacing: 0.8,
        },
        positioned: { left: cX + 24, top: cY + 192 },
      });
      b1kids.push({
        type: 'text',
        text: cp.tools,
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: '#FFFFFF',
        },
        positioned: { left: cX + 24, top: cY + 206 },
      });
      b1kids.push({
        type: 'text',
        text: cp.policyNote,
        opacity: clamp01(gridIn * 0.75),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          color: '#8899B0',
        },
        positioned: { left: cX + 24, top: cY + 222 },
      });

      // Policy Box 4: PRIMARY USE CASE
      b1kids.push({
        type: 'rect',
        width: cW - 48,
        height: 112,
        radius: 12,
        fill: '#050912',
        border: { color: '#1B2942', width: 1.0 },
        opacity: clamp01(gridIn * 0.9),
        offsetY: cardDrift,
        positioned: { left: cX + 24, top: cY + 252 },
      });
      b1kids.push({
        type: 'text',
        text: 'PRIMARY USE CASE',
        opacity: clamp01(gridIn),
        offsetY: cardDrift,
        style: {
          fontSize: 9,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: cp.col,
          letterSpacing: 1,
        },
        positioned: { left: cX + 36, top: cY + 264 },
      });
      b1kids.push({
        type: 'text',
        text: cp.summary,
        width: cW - 72,
        opacity: clamp01(gridIn * 0.95),
        offsetY: cardDrift,
        style: {
          fontSize: 12,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: '#E0E8F5',
        },
        positioned: { left: cX + 36, top: cY + 286 },
      });
    }

    // ---- Beat 2 — MEMORY / BUILT IN. ---------------------------------------
    var swarmZoom = lerp(1.05, 1.15, tw(70, 70, 0, 1, 'linear'));
    var b2kids = [
      {
        type: 'stack',
        fit: 'expand',
        scale: swarmZoom,
        children: [
          {
            type: 'image',
            source: 'external:ai_swarm',
            fit: 'cover',
            width: 1920,
            height: 1080,
            positioned: { left: 0, top: 0 },
          },
        ],
      },
      {
        type: 'rect',
        width: 1920,
        height: 1080,
        fill: '#070a12',
        opacity: 0.62,
        positioned: { left: 0, top: 0 },
      },
      {
        type: 'text',
        text: 'MEMORY',
        width: 1920,
        style: {
          fontSize: 480,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
        },
        positioned: { left: 0, top: 40 },
      },
      {
        type: 'text',
        text: 'BUILT IN.',
        width: 1920,
        style: {
          fontSize: 350,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: gunmetalGrad,
        },
        positioned: { left: 0, top: 540 },
      },
      {
        type: 'text',
        text: 'JSONL SESSIONS · COMPACTION · REWIND',
        width: 1920,
        style: {
          fontSize: 34,
          fontFamily: 'Impact',
          color: '#2EBD9E',
          letterSpacing: 2,
          textAlign: 'center',
        },
        positioned: { left: 0, top: 970 },
      },
    ];

    // ---- Beat 3 — SUBAGENTS. ------------------------------------------------
    var b3kids = [
      {
        type: 'text',
        text: 'SUBAGENTS.',
        width: 1920,
        style: {
          fontSize: 345,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: purpleGrad,
        },
        positioned: { left: 0, top: 220 },
      },
      {
        type: 'text',
        text: 'PARALLEL · TYPED · SCHEMA-CHECKED',
        width: 1920,
        style: {
          fontSize: 42,
          fontFamily: 'Impact',
          color: '#2EBD9E',
          letterSpacing: 2,
          textAlign: 'center',
        },
        positioned: { left: 0, top: 620 },
      },
    ];

    // Swarm particles flying outward
    var DOTS = [
      { a0: -2.75, curl: 0.85, reach: 450, size: 14, color: '#C9B8FF', at: 146 },
      { a0: -2.15, curl: -0.65, reach: 400, size: 12, color: '#8F6BFF', at: 149 },
      { a0: -1.55, curl: 0.75, reach: 470, size: 16, color: '#2EBD9E', at: 152 },
      { a0: -0.95, curl: -0.80, reach: 380, size: 10, color: '#C9B8FF', at: 155 },
      { a0: -0.35, curl: 0.90, reach: 430, size: 13, color: '#8F6BFF', at: 158 },
    ];
    for (var di = 0; di < DOTS.length; di++) {
      var d = DOTS[di];
      var t = tw(d.at, 48, 0, 1, 'easeOut');
      var op = tw(d.at, 12, 0, 1, 'easeOut');
      if (op <= 0) continue;
      var ang = d.a0 + d.curl * t;
      var rad = 40 + d.reach * t;
      var dx = Math.cos(ang) * rad;
      var dy = Math.sin(ang) * rad * 0.75;
      b3kids.push({
        type: 'circle',
        size: d.size * 2.8,
        fill: d.color,
        opacity: 0.22 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size * 1.4, top: 400 - d.size * 1.4 },
      });
      b3kids.push({
        type: 'circle',
        size: d.size,
        fill: d.color,
        opacity: 0.95 * op,
        offsetX: dx,
        offsetY: dy,
        positioned: { left: 960 - d.size / 2, top: 400 - d.size / 2 },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'rect',
          width: 1920,
          height: 1080,
          fill: '#070a12',
          positioned: { left: 0, top: 0 },
        },
        { type: 'stack', fit: 'expand', opacity: b1, children: b1kids },
        { type: 'stack', fit: 'expand', opacity: b2, children: b2kids },
        { type: 'stack', fit: 'expand', opacity: b3, children: b3kids },
      ],
    };
  },
};
