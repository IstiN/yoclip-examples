// 05 — Everywhere — Fa embeds directly INTO your tools and platforms.
//
// Reversing standard tool ingestion (Claude Code pulls tools in;
// Fa does the exact opposite: Fa injects ITSELF INTO the apps you use).
//
// Visual architecture:
//   · 0–40    Headline: "NOT ANOTHER TOOL YOU CALL." / "IT EMBEDS INTO EVERYTHING."
//   · 30–65   The Rail draws across, 8 standalone app squircles appear (macOS, Windows, iOS, Android, Chrome, PowerPoint, Word, Outlook)
//   · 65–150  Fa Core fires high-speed glowing Fa capsules along the rail!
//             Each capsule flies and DOCKS into an app card:
//             - Impact shockwave ring
//             - Card leaps up and ignites with internal energy
//             - An embedded cyan "Fa inside" badge illuminates inside the card
//             - Tag flips from STANDALONE to "FA EMBEDDED"
//   · 150–240 Grand unification: All apps glow with synchronized Fa energy
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
      size: 1100,
      fill: '#3D2275',
      opacity: 0.16 + 0.04 * breathe,
      blur: 160,
      positioned: { left: 960 - 550, top: 520 - 550 },
    });

    // ------------------------------------------------------------------------
    // 1. Top Headlines (Dynamic Two-Phase Narrative)
    // ------------------------------------------------------------------------
    // Phase A (0–120): Premise ("NOT ANOTHER TOOL YOU CALL / IT EMBEDS DIRECTLY INTO EVERYTHING")
    // Phase B (130–240): Conclusion ("EVERYWHERE. / ONE AGENT. EMBEDDED INSIDE YOUR APPS.")
    var phaseA_Fade = tw(115, 15, 0, 1, 'easeInOutCubic');
    var phaseA_Op = 1 - phaseA_Fade;
    var phaseB_Op = tw(130, 20, 0, 1, 'easeInOutCubic');

    // Phase A Titles
    var headIn1 = tw(0, 28, 0, 1, 'easeOutExpo');
    var headIn2 = tw(8, 28, 0, 1, 'easeOutExpo');

    if (phaseA_Op > 0.01) {
      kids.push({
        type: 'text',
        text: 'NOT ANOTHER TOOL YOU CALL.',
        width: 1920,
        opacity: headIn1 * phaseA_Op,
        offsetY: 20 * (1 - headIn1),
        style: {
          fontSize: 88,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
          letterSpacing: 2,
          shadows: [{ color: '#8F6BFF', blur: 30, offset: { x: 0, y: 6 } }],
        },
        positioned: { left: 0, top: 75 },
      });

      kids.push({
        type: 'text',
        text: 'IT EMBEDS DIRECTLY INTO EVERYTHING YOU USE.',
        width: 1920,
        opacity: headIn2 * phaseA_Op,
        offsetY: 15 * (1 - headIn2),
        style: {
          fontSize: 46,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: gunmetalGrad,
          letterSpacing: 2,
          shadows: [{ color: '#000000', blur: 20, offset: { x: 0, y: 6 } }],
        },
        positioned: { left: 0, top: 178 },
      });
    }

    // Phase B Titles
    if (phaseB_Op > 0.01) {
      kids.push({
        type: 'text',
        text: 'EVERYWHERE.',
        width: 1920,
        opacity: phaseB_Op,
        offsetY: -15 * (1 - phaseB_Op),
        style: {
          fontSize: 124,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          textAlign: 'center',
          gradient: silverGrad,
          letterSpacing: 3,
          shadows: [
            { color: '#00F0FF', blur: 40, offset: { x: 0, y: 8 } },
            { color: '#8F6BFF', blur: 80, offset: { x: 0, y: 16 } },
          ],
        },
        positioned: { left: 0, top: 55 },
      });

      kids.push({
        type: 'text',
        text: 'ONE AGENT. EMBEDDED INSIDE YOUR APPS.',
        width: 1920,
        opacity: phaseB_Op,
        offsetY: -10 * (1 - phaseB_Op),
        style: {
          fontSize: 48,
          fontFamily: 'Impact',
          color: '#00F0FF',
          textAlign: 'center',
          letterSpacing: 2,
          shadows: [{ color: '#00F0FF', blur: 24, offset: { x: 0, y: 4 } }],
        },
        positioned: { left: 0, top: 188 },
      });
    }

    // ------------------------------------------------------------------------
    // 2. Horizontal Injection Rail / Conveyor Beam
    // ------------------------------------------------------------------------
    var railIn = tw(25, 30, 0, 1, 'easeOutExpo');
    var railY = 540;
    var railStartX = 140;
    var railEndX = 1860;

    // Background track
    kids.push({
      type: 'rect',
      width: (railEndX - railStartX) * railIn,
      height: 4,
      radius: 2,
      fill: '#151D30',
      positioned: { left: railStartX, top: railY - 2 },
    });

    // Glowing energy spine
    kids.push({
      type: 'rect',
      width: (railEndX - railStartX) * railIn,
      height: 2,
      radius: 1,
      fill: '#48C7E8',
      opacity: 0.35 + 0.15 * breathe,
      blur: 4,
      positioned: { left: railStartX, top: railY - 1 },
    });

    // ------------------------------------------------------------------------
    // 3. Fa Core Emitter (Left Dock)
    // ------------------------------------------------------------------------
    var coreIn = tw(30, 25, 0, 1, 'easeOutBack');
    var coreX = 120;
    var coreW = 160;
    var coreH = 160;
    var coreY = railY - coreH / 2;

    // Glow aura behind Fa Core
    kids.push({
      type: 'circle',
      size: 280,
      fill: '#8F6BFF',
      opacity: 0.24 * coreIn,
      blur: 50,
      positioned: { left: coreX + coreW / 2 - 140, top: coreY + coreH / 2 - 140 },
    });

    // Fa Core Squircle Card
    kids.push({
      type: 'rect',
      width: coreW,
      height: coreH,
      radius: 38,
      fill: '#101428',
      opacity: coreIn,
      border: { color: '#8F6BFF', width: 2.5 },
      positioned: { left: coreX, top: coreY },
    });

    // Inner Fa Face / Chip
    var winkCore = 0;
    if (frame >= 58 && frame <= 72) {
      winkCore = frame < 63 ? (frame - 58) / 5 : (1 - (frame - 66) / 6);
    }
    var coreEyeRight = winkCore > 0.5 ? '-' : 'o';

    kids.push({
      type: 'text',
      text: '> _ ' + coreEyeRight,
      width: coreW,
      opacity: coreIn,
      style: {
        fontSize: 36,
        fontFamily: 'monospace',
        fontWeight: '800',
        color: '#00F0FF',
        textAlign: 'center',
        shadows: [{ color: '#00F0FF', blur: 14, offset: { x: 0, y: 0 } }],
      },
      positioned: { left: coreX, top: coreY + 48 },
    });

    kids.push({
      type: 'text',
      text: 'FA CORE',
      width: coreW,
      opacity: coreIn * 0.95,
      style: {
        fontSize: 15,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textAlign: 'center',
      },
      positioned: { left: coreX, top: coreY + 102 },
    });

    kids.push({
      type: 'text',
      text: 'SOURCE',
      width: coreW,
      opacity: coreIn * 0.65,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: '#8F6BFF',
        letterSpacing: 1,
        textAlign: 'center',
      },
      positioned: { left: coreX, top: coreY + 124 },
    });

    // ------------------------------------------------------------------------
    // 4. Target Application Cards (Separated!)
    // ------------------------------------------------------------------------
    var apps = [
      { id: 'macos', name: 'macOS', icon: 'apple', col: '#FFFFFF', at: 65 },
      { id: 'windows', name: 'Windows', icon: 'windows', col: '#00A4EF', at: 73 },
      { id: 'ios', name: 'iOS', icon: 'ios', col: '#A0C4FF', at: 81 },
      { id: 'android', name: 'Android', icon: 'android', col: '#3DDC84', at: 89 },
      { id: 'chrome', name: 'Chrome', icon: 'chrome', col: '#FBBC05', at: 97 },
      { id: 'powerpoint', name: 'PowerPoint', icon: 'powerpoint', col: '#D24726', at: 105 },
      { id: 'word', name: 'Word', icon: 'word', col: '#2B579A', at: 113 },
      { id: 'outlook', name: 'Outlook', icon: 'outlook', col: '#0078D4', at: 121 },
    ];

    // Card dimensions & spacing
    var cardW = 145;
    var cardH = 145;
    var cardRadius = 34;
    var startCardsX = 360;
    var stepX = 188; // 360 + 7 * 188 = 1676, perfectly centered!

    // ------------------------------------------------------------------------
    // 5. Injection Projectiles & Card Activation Loop
    // ------------------------------------------------------------------------
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      var targetX = startCardsX + i * stepX;
      var targetCenterY = railY;
      var launchFrame = app.at;
      var landFrame = app.at + 8;

      // Card entrance animation (neutral state)
      var cardEnterT = tw(30 + i * 3, 18, 0, 1, 'easeOutBack');
      var cardAlpha = cardEnterT;

      var hasInjected = frame >= landFrame;
      var isInFlight = frame >= launchFrame && frame < landFrame;

      // Fly projectile from Fa Core (coreX + coreW) to target card
      if (isInFlight) {
        var flightEase = tw(launchFrame, 8, 0, 1, 'easeInOutQuad');
        var projX = lerp(coreX + coreW, targetX + cardW / 2, flightEase);
        var projY = railY - Math.sin(flightEase * Math.PI) * 20;

        kids.push({
          type: 'circle',
          size: 46,
          fill: '#00F0FF',
          opacity: 0.85,
          blur: 16,
          positioned: { left: projX - 23, top: projY - 23 },
        });
        kids.push({
          type: 'circle',
          size: 18,
          fill: '#FFFFFF',
          opacity: 0.98,
          blur: 4,
          positioned: { left: projX - 9, top: projY - 9 },
        });

        kids.push({
          type: 'rect',
          width: 60,
          height: 4,
          radius: 2,
          fill: '#00F0FF',
          opacity: 0.70,
          blur: 5,
          positioned: { left: projX - 60, top: projY - 2 },
        });
      }

      // Post-landing card reaction (bounce & shockwave)
      var bounceY = 0;
      var shockwaveT = 0;
      var flashWhite = 0;
      if (hasInjected) {
        var postFrames = frame - landFrame;
        if (postFrames < 14) {
          var bNorm = postFrames / 14;
          bounceY = -Math.sin(bNorm * Math.PI) * 18;
          shockwaveT = bNorm;
          if (postFrames <= 3) flashWhite = 1 - postFrames / 3;
        }
      }

      var currentCardY = railY - cardH / 2 + bounceY;

      // Render shockwave burst ring upon injection
      if (shockwaveT > 0 && shockwaveT < 1) {
        var waveSize = 130 + shockwaveT * 150;
        var waveOp = (1 - shockwaveT) * 0.85;
        kids.push({
          type: 'circle',
          size: waveSize,
          fill: '#00F0FF',
          opacity: waveOp,
          blur: 24,
          positioned: {
            left: targetX + cardW / 2 - waveSize / 2,
            top: railY - waveSize / 2,
          },
        });
      }

      // Card background & border styling
      var cardBg = flashWhite > 0.05 ? '#2A3C60' : (hasInjected ? '#10172A' : '#0B0F1C');
      var cardBorderCol = hasInjected ? '#00F0FF' : 'rgba(255, 255, 255, 0.12)';
      var cardBorderW = hasInjected ? 2.5 : 1.5;

      // Injected glow behind card
      if (hasInjected) {
        var pulseGlow = 0.24 + 0.08 * Math.sin(((frame + i * 8) / 25) * Math.PI * 2);
        kids.push({
          type: 'circle',
          size: 220,
          fill: app.col,
          opacity: pulseGlow,
          blur: 44,
          positioned: {
            left: targetX + cardW / 2 - 110,
            top: currentCardY + cardH / 2 - 110,
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

      // App Icon inside card (Official SVG)
      var iconSvgData = icons[app.icon] || icons.apple;
      kids.push({
        type: 'svg',
        svg: iconSvgData,
        width: 64,
        height: 64,
        opacity: cardAlpha * (hasInjected ? 1.0 : 0.65),
        positioned: {
          left: targetX + (cardW - 64) / 2,
          top: currentCardY + 26,
        },
      });

      // EMBEDDED BADGE: "Fa inside" chip inside the card (lights up once injected!)
      if (hasInjected) {
        var badgeT = Math.min(1.0, (frame - landFrame) / 5);
        kids.push({
          type: 'rect',
          width: 58,
          height: 22,
          radius: 11,
          fill: '#00F0FF',
          opacity: 0.95 * badgeT,
          positioned: {
            left: targetX + (cardW - 58) / 2,
            top: currentCardY + cardH - 30,
          },
        });
        kids.push({
          type: 'text',
          text: 'Fa inside',
          width: 58,
          opacity: badgeT,
          style: {
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: '900',
            color: '#05070D',
            textAlign: 'center',
          },
          positioned: {
            left: targetX + (cardW - 58) / 2,
            top: currentCardY + cardH - 26,
          },
        });
      }

      // Subtitle below card: Name + Status
      kids.push({
        type: 'text',
        text: app.name,
        width: cardW,
        opacity: cardAlpha,
        style: {
          fontSize: 17,
          fontFamily: 'Impact',
          color: hasInjected ? '#FFFFFF' : '#8A96A8',
          letterSpacing: 1,
          textAlign: 'center',
        },
        positioned: { left: targetX, top: railY + cardH / 2 + 18 },
      });

      var statusTxt = hasInjected ? 'FA EMBEDDED' : 'STANDALONE';
      var statusCol = hasInjected ? '#00F0FF' : '#455268';
      kids.push({
        type: 'text',
        text: statusTxt,
        width: cardW,
        opacity: cardAlpha * (hasInjected ? 1.0 : 0.6),
        style: {
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: statusCol,
          letterSpacing: 1,
          textAlign: 'center',
          shadows: hasInjected ? [{ color: '#00F0FF', blur: 8, offset: { x: 0, y: 0 } }] : [],
        },
        positioned: { left: targetX, top: railY + cardH / 2 + 42 },
      });
    }

    // ------------------------------------------------------------------------
    // 6. Connecting High-Speed Synaptic Pulses (Frame 150–240)
    // ------------------------------------------------------------------------
    if (frame >= 150) {
      var syncPulseT = ((frame - 150) % 30) / 30;
      var pulseHeadX = lerp(coreX + coreW, railEndX, syncPulseT);
      kids.push({
        type: 'circle',
        size: 30,
        fill: '#00F0FF',
        opacity: 0.75,
        blur: 10,
        positioned: { left: pulseHeadX - 15, top: railY - 15 },
      });
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
