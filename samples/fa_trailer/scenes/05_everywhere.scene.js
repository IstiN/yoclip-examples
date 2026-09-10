// 05 — Everywhere — Fa embeds directly INTO your tools and platforms.
//
// Reversing standard tool ingestion (Claude Code pulls tools into a terminal;
// Fa does the exact opposite: Fa injects ITSELF INTO the apps and platforms you use).
//
// Complete Architectural Layout:
//   · 0–40    Headline: "NOT ANOTHER TOOL YOU CALL." / "IT EMBEDS DIRECTLY INTO EVERYTHING."
//   · Top:    4 Foundation Modules (10+ Providers BYOK, A2A Fabric, Git Memory, GPU Engine)
//   · Center: Fa Core Engine with canonical Fa wordmark & smile underscore
//   · Bottom: 8 Platforms & Apps (macOS, Windows, iOS, Android, Chrome, PowerPoint, Word, Outlook)
//   · 65–150  Fa Core fires high-speed glowing Fa capsules along laser conduits into each app!
//             - Impact shockwave burst
//             - Card activates with internal energy
//             - Embedded metallic [ Fa inside ] badge illuminates
//             - Status flips from STANDALONE to "FA EMBEDDED"
//   · 150–240 Grand unification: All apps synchronized with Fa Core
//             Headline transforms: "EVERYWHERE." / "ONE AGENT. EMBEDDED INSIDE YOUR APPS."

scene = {
  id: '05_everywhere',
  duration: 240,
  from: 780,
  timeline: {
    label: 'Everywhere (Embedded)',
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

    var silverGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var gunmetalGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#C8C8D2', '#848490'],
      stops: [0.0, 1.0],
    };

    var kids = [];

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // Ambient purple & cyan backdrop haze
    var breathe = 0.5 + 0.5 * Math.sin((frame / 60) * Math.PI * 2);
    kids.push({
      type: 'circle',
      size: 1200,
      fill: '#0C1426',
      opacity: 0.75,
      blur: 160,
      positioned: { left: 960 - 600, top: 480 - 600 },
    });
    kids.push({
      type: 'circle',
      size: 650,
      fill: '#5B61F6',
      opacity: 0.12 + 0.04 * breathe,
      blur: 100,
      positioned: { left: 960 - 325, top: 440 - 325 },
    });

    // ------------------------------------------------------------------------
    // 1. Top Headlines (Dynamic Two-Phase Narrative)
    // ------------------------------------------------------------------------
    var phaseA_Fade = tw(115, 15, 0, 1, 'easeInOutCubic');
    var phaseA_Op = 1 - phaseA_Fade;
    var phaseB_Op = tw(130, 20, 0, 1, 'easeInOutCubic');

    // Phase A Titles (0–120)
    var headIn1 = tw(0, 28, 0, 1, 'easeOutExpo');
    var headIn2 = tw(8, 28, 0, 1, 'easeOutExpo');

    if (phaseA_Op > 0.01) {
      kids.push({
        type: 'text',
        text: 'NOT ANOTHER TOOL YOU CALL.',
        width: 1920,
        opacity: clamp01(headIn1 * phaseA_Op),
        offsetY: 20 * (1 - headIn1),
        style: {
          fontSize: 78,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
          letterSpacing: 2,
        },
        positioned: { left: 0, top: 42 },
      });

      kids.push({
        type: 'text',
        text: 'IT EMBEDS DIRECTLY INTO EVERYTHING YOU USE.',
        width: 1920,
        opacity: clamp01(headIn2 * phaseA_Op),
        offsetY: 15 * (1 - headIn2),
        style: {
          fontSize: 38,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: gunmetalGrad,
          letterSpacing: 2,
        },
        positioned: { left: 0, top: 128 },
      });
    }

    // Phase B Titles (130–240)
    if (phaseB_Op > 0.01) {
      kids.push({
        type: 'text',
        text: 'EVERYWHERE.',
        width: 1920,
        opacity: clamp01(phaseB_Op),
        offsetY: -12 * (1 - phaseB_Op),
        style: {
          fontSize: 92,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
          letterSpacing: 3,
        },
        positioned: { left: 0, top: 38 },
      });

      kids.push({
        type: 'text',
        text: 'ONE AGENT. EMBEDDED INSIDE YOUR APPS.',
        width: 1920,
        opacity: clamp01(phaseB_Op),
        offsetY: -8 * (1 - phaseB_Op),
        style: {
          fontSize: 40,
          fontFamily: 'Impact',
          color: '#48C7E8',
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: 0, top: 134 },
      });
    }

    // ------------------------------------------------------------------------
    // 2. Top Section: Foundation Modules Powering Fa Core
    // ------------------------------------------------------------------------
    var topModulesIn = tw(15, 25, 0, 1, 'easeOutCubic');
    var topMods = [
      { id: 'llm', title: '10+ PROVIDERS BYOK', sub: 'Claude · GPT · DeepSeek · Gemini', icon: '#5B61F6' },
      { id: 'a2a', title: 'A2A AGENT FABRIC', sub: 'Cross-Machine Mailbox & Swarms', icon: '#E056FD' },
      { id: 'mem', title: 'GIT-BACKED MEMORY', sub: 'Durable Knowledge Graph', icon: '#2EBD9E' },
      { id: 'gpu', title: 'HEADLESS GPU ENGINE', sub: 'Impeller 120 FPS Video Pipeline', icon: '#48C7E8' },
    ];

    var modW = 320;
    var modH = 74;
    var modSpacing = 42;
    var startModX = (1920 - (4 * modW + 3 * modSpacing)) / 2; // 257
    var modY = 196;

    for (var mi = 0; mi < topMods.length; mi++) {
      var mod = topMods[mi];
      var mx = startModX + mi * (modW + modSpacing);

      // Card container
      kids.push({
        type: 'rect',
        width: modW,
        height: modH,
        radius: 18,
        fill: '#0C1322',
        border: { color: '#24324F', width: 1.5 },
        opacity: clamp01(topModulesIn * 0.95),
        positioned: { left: mx, top: modY },
      });

      // Left accent pill
      kids.push({
        type: 'rect',
        width: 4,
        height: modH - 24,
        radius: 2,
        fill: mod.icon,
        opacity: clamp01(topModulesIn * 0.9),
        positioned: { left: mx + 12, top: modY + 12 },
      });

      kids.push({
        type: 'text',
        text: mod.title,
        width: modW - 36,
        opacity: clamp01(topModulesIn),
        style: {
          fontSize: 15,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          letterSpacing: 1,
        },
        positioned: { left: mx + 26, top: modY + 14 },
      });

      kids.push({
        type: 'text',
        text: mod.sub,
        width: modW - 36,
        opacity: clamp01(topModulesIn * 0.75),
        style: {
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#48C7E8',
        },
        positioned: { left: mx + 26, top: modY + 40 },
      });

      // Vertical line dropping from module down to horizontal bus rail
      var conduitStartX = mx + modW / 2;
      var conduitStartY = modY + modH;
      var busRailY = 295;
      var coreTopY = 325;

      var streamP = tw(25 + mi * 4, 25, 0, 1, 'easeOut');
      if (streamP > 0.01) {
        kids.push({
          type: 'rect',
          width: 2,
          height: (busRailY - conduitStartY) * streamP,
          fill: '#24324F',
          opacity: 0.75,
          positioned: { left: conduitStartX - 1, top: conduitStartY },
        });
      }
    }

    // Horizontal circuit bus rail connecting all modules to Fa Core
    var busRailY = 295;
    var coreTopY = 325;
    var firstModX = startModX + modW / 2;
    var lastModX = startModX + 3 * (modW + modSpacing) + modW / 2;

    kids.push({
      type: 'rect',
      width: (lastModX - firstModX) * topModulesIn,
      height: 2,
      radius: 1,
      fill: '#24324F',
      opacity: clamp01(topModulesIn * 0.8),
      positioned: { left: firstModX, top: busRailY },
    });

    // 4 feeder drops from bus rail into top hardware pins of Fa Core
    var coreTopPinsX = [900, 940, 980, 1020];
    for (var cti = 0; cti < coreTopPinsX.length; cti++) {
      var pinX = coreTopPinsX[cti];
      kids.push({
        type: 'rect',
        width: 2,
        height: coreTopY - busRailY,
        fill: '#3B4F76',
        opacity: clamp01(topModulesIn * 0.85),
        positioned: { left: pinX - 1, top: busRailY },
      });

      // Pulsing data packet flowing into core
      var packetT = ((frame * 0.06 + cti * 0.25) % 1.0);
      var pPacketY = lerp(busRailY, coreTopY, packetT);
      kids.push({
        type: 'circle',
        size: 6,
        fill: '#48C7E8',
        opacity: clamp01(0.85 * topModulesIn),
        blur: 2,
        positioned: { left: pinX - 3, top: pPacketY - 3 },
      });
    }

    // ------------------------------------------------------------------------
    // 3. CENTER: Fa Core Hardware Engine (Reusable Fa Hardware Chip)
    // ------------------------------------------------------------------------
    var coreIn = tw(20, 25, 0, 1, 'easeOutCubic');
    var coreW = 320;
    var coreH = 220;
    var coreX = 960 - coreW / 2;
    var coreY = 325;
    var faK = 0.28;

    var coreChipKids = faHardwareChip(960, coreY + 98, coreW, coreH, faK, {
      opacity: clamp01(coreIn),
      radius: 46,
    });
    for (var cki = 0; cki < coreChipKids.length; cki++) {
      kids.push(coreChipKids[cki]);
    }

    kids.push({
      type: 'text',
      text: 'FA CORE · AUTONOMOUS HARNESS',
      width: coreW,
      opacity: clamp01(coreIn * 0.9),
      style: {
        fontSize: 13,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textAlign: 'center',
      },
      positioned: { left: coreX, top: coreY + 182 },
    });

    // ------------------------------------------------------------------------
    // 4. Target Platforms & Applications (Bottom Row)
    // ------------------------------------------------------------------------
    var apps = [
      { id: 'macos', name: 'macOS', icon: 'apple', col: '#FFFFFF', at: 60 },
      { id: 'windows', name: 'Windows', icon: 'windows', col: '#00A4EF', at: 68 },
      { id: 'ios', name: 'iOS', icon: 'ios', col: '#A0C4FF', at: 76 },
      { id: 'android', name: 'Android', icon: 'android', col: '#3DDC84', at: 84 },
      { id: 'chrome', name: 'Chrome', icon: 'chrome', col: '#FBBC05', at: 92 },
      { id: 'powerpoint', name: 'PowerPoint', icon: 'powerpoint', col: '#D24726', at: 100 },
      { id: 'word', name: 'Word', icon: 'word', col: '#2B579A', at: 108 },
      { id: 'outlook', name: 'Outlook', icon: 'outlook', col: '#0078D4', at: 116 },
    ];

    var cardW = 142;
    var cardH = 126;
    var cardRadius = 26;
    var stepX = 188;
    var startCardsX = (1920 - (7 * stepX + cardW)) / 2; // 231
    var baseY = 690;

    // Conduits branching from bottom of Fa Core (x: 960, y: coreY + coreH = 545)
    var conduitHubY = 600;

    // Central trunk from Fa Core down to distribution hub
    kids.push({
      type: 'rect',
      width: 4,
      height: conduitHubY - (coreY + coreH),
      radius: 2,
      fill: '#2E3C5F',
      opacity: clamp01(coreIn),
      positioned: { left: 958, top: coreY + coreH },
    });

    // Horizontal distribution manifold
    kids.push({
      type: 'rect',
      width: 7 * stepX,
      height: 2,
      radius: 1,
      fill: '#24324F',
      opacity: clamp01(coreIn * 0.7),
      positioned: { left: startCardsX + cardW / 2, top: conduitHubY },
    });

    // ------------------------------------------------------------------------
    // 5. Injection Projectiles & Card Activation Loop
    // ------------------------------------------------------------------------
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      var targetCenterX = startCardsX + i * stepX + cardW / 2;
      var targetX = startCardsX + i * stepX;
      var launchFrame = app.at;
      var landFrame = app.at + 8;

      var cardAlpha = clamp01(tw(30 + i * 3, 16, 0, 1, 'easeOut'));
      var hasInjected = frame >= landFrame;
      var isInFlight = frame >= launchFrame && frame < landFrame;

      // Vertical feeder rail into each card
      kids.push({
        type: 'rect',
        width: 2,
        height: baseY - conduitHubY,
        fill: hasInjected ? '#48C7E8' : '#1C273C',
        opacity: hasInjected ? 0.7 : 0.35,
        positioned: { left: targetCenterX - 1, top: conduitHubY },
      });

      // Fly projectile from Fa Core down through manifold into target card
      if (isInFlight) {
        var flightEase = tw(launchFrame, 8, 0, 1, 'easeInOutQuad');
        var projX = lerp(960, targetCenterX, flightEase);
        var projY = lerp(coreY + coreH, baseY, flightEase);

        kids.push({
          type: 'circle',
          size: 42,
          fill: '#48C7E8',
          opacity: 0.85,
          blur: 16,
          positioned: { left: projX - 21, top: projY - 21 },
        });
        kids.push({
          type: 'circle',
          size: 16,
          fill: '#FFFFFF',
          opacity: 0.98,
          blur: 4,
          positioned: { left: projX - 8, top: projY - 8 },
        });
      }

      // Card post-impact reaction (bounce & shockwave)
      var bounceY = 0;
      var shockwaveT = 0;
      var flashWhite = 0;
      if (hasInjected) {
        var postFrames = frame - landFrame;
        if (postFrames < 14) {
          var bNorm = postFrames / 14;
          bounceY = -Math.sin(bNorm * Math.PI) * 16;
          shockwaveT = bNorm;
          if (postFrames <= 3) flashWhite = 1 - postFrames / 3;
        }
      }

      var currentCardY = baseY + bounceY;

      // Shockwave burst upon injection
      if (shockwaveT > 0 && shockwaveT < 1) {
        var waveSize = 130 + shockwaveT * 140;
        var waveOp = clamp01((1 - shockwaveT) * 0.85);
        kids.push({
          type: 'circle',
          size: waveSize,
          fill: '#48C7E8',
          opacity: waveOp,
          blur: 24,
          positioned: {
            left: targetCenterX - waveSize / 2,
            top: baseY + cardH / 2 - waveSize / 2,
          },
        });
      }

      // Card background & border
      var cardBg = flashWhite > 0.05 ? '#243555' : (hasInjected ? '#0F1626' : '#0B0F1C');
      var cardBorderCol = hasInjected ? '#48C7E8' : 'rgba(255, 255, 255, 0.12)';
      var cardBorderW = hasInjected ? 2.5 : 1.5;

      // Injected glow behind card
      if (hasInjected) {
        var pulseGlow = clamp01(0.22 + 0.08 * Math.sin(((frame + i * 8) / 25) * Math.PI * 2));
        kids.push({
          type: 'circle',
          size: 200,
          fill: app.col,
          opacity: pulseGlow,
          blur: 44,
          positioned: {
            left: targetCenterX - 100,
            top: currentCardY + cardH / 2 - 100,
          },
        });
      }

      // Card Squircle Container
      kids.push({
        type: 'rect',
        width: cardW,
        height: cardH,
        radius: cardRadius,
        fill: cardBg,
        opacity: cardAlpha,
        border: { color: cardBorderCol, width: cardBorderW },
        positioned: { left: targetX, top: currentCardY },
      });

      // App Icon inside card (Fixed SVGs, centered with balanced top margin)
      var iconSvgData = icons[app.icon] || icons.apple;
      kids.push({
        type: 'svg',
        svg: iconSvgData,
        width: 52,
        height: 52,
        opacity: clamp01(cardAlpha * (hasInjected ? 1.0 : 0.65)),
        positioned: {
          left: targetX + (cardW - 52) / 2,
          top: currentCardY + 16,
        },
      });

      // EMBEDDED BADGE: "Fa inside" chip (tight, balanced bottom margin, NO dead space!)
      if (hasInjected) {
        var badgeT = clamp01(Math.min(1.0, (frame - landFrame) / 5));
        var badgeW = 96;
        var badgeH = 26;
        var badgeX = targetX + (cardW - badgeW) / 2;
        var badgeY = currentCardY + 80;

        // Badge chip background
        kids.push({
          type: 'rect',
          width: badgeW,
          height: badgeH,
          radius: 13,
          fill: '#080E1C',
          border: { color: '#00F0FF', width: 1.5 },
          opacity: clamp01(0.95 * badgeT),
          positioned: { left: badgeX, top: badgeY },
        });

        // Real vector Fa brand logo (drawn, NOT text!)
        kids.push(faLogoSvgNode(badgeX + 22, badgeY + 13, 15, badgeT));

        // inside in bold monospace with comfortable spacing
        kids.push({
          type: 'text',
          text: 'inside',
          opacity: badgeT,
          style: {
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: 0.5,
          },
          positioned: { left: badgeX + 37, top: badgeY + 6 },
        });
      }

      // Subtitle below card: Name + Status
      kids.push({
        type: 'text',
        text: app.name,
        width: cardW,
        opacity: cardAlpha,
        style: {
          fontSize: 16,
          fontFamily: 'Impact',
          color: hasInjected ? '#FFFFFF' : '#8A96A8',
          letterSpacing: 1,
          textAlign: 'center',
        },
        positioned: { left: targetX, top: baseY + cardH + 12 },
      });

      if (hasInjected) {
        // Static Fa branded logo + EMBEDDED (drawn vector logo, NOT text!)
        var faStatusW = 82;
        var faStartX = targetCenterX - faStatusW / 2;
        var statusY = baseY + cardH + 34;

        // Real vector Fa brand logo (drawn, NOT text!)
        kids.push(faLogoSvgNode(faStartX + 7, statusY + 7, 12, cardAlpha));

        // EMBEDDED in clean muted silver
        kids.push({
          type: 'text',
          text: 'EMBEDDED',
          opacity: cardAlpha,
          style: {
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: '700',
            color: '#A0AFC4',
            letterSpacing: 1,
          },
          positioned: { left: faStartX + 18, top: statusY + 1 },
        });
      } else {
        kids.push({
          type: 'text',
          text: 'STANDALONE',
          width: cardW,
          opacity: clamp01(cardAlpha * 0.6),
          style: {
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: '700',
            color: '#455268',
            letterSpacing: 1,
            textAlign: 'center',
          },
          positioned: { left: targetX, top: baseY + cardH + 35 },
        });
      }
    }

    // ------------------------------------------------------------------------
    // 6. Connecting Synaptic Pulses (Frame 150–240)
    // ------------------------------------------------------------------------
    if (frame >= 150) {
      var syncPulseT = ((frame - 150) % 24) / 24;
      for (var pi2 = 0; pi2 < apps.length; pi2++) {
        var pTargetCenterX = startCardsX + pi2 * stepX + cardW / 2;
        var pX = lerp(960, pTargetCenterX, syncPulseT);
        var pY = lerp(coreY + coreH, baseY, syncPulseT);
        kids.push({
          type: 'circle',
          size: 8,
          fill: '#48C7E8',
          opacity: 0.75,
          blur: 3,
          positioned: { left: pX - 4, top: pY - 4 },
        });
      }
    }

    // Edge vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
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

