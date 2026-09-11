// 01b — Prompt: The Creator's Directive.
//
// Narrative beat: Following the Fa mark awakening in 01_dark, the creator
// inputs the ultimate agent specification on a giant tactical command terminal.
// Mechanical keystrokes clatter as the vision is typed out line by line,
// capability chips illuminate, and a heavy [↵ DISPATCH] click triggers
// the full system boot in 02_alive ("FA IS ALIVE").

scene = {
  id: '01b_prompt',
  duration: 150, // 5.0 seconds at 30 fps
  description: 'Tactical command screen: creator types the ultimate agent prompt with mechanical keystrokes, capability badges illuminate, and [↵ DISPATCH] triggers the live system boot.',

  timeline: {
    label: 'Prompt',
    color: '#5B61F6',
    lane: 'video',
  },

  render: function(frame) {
    var jsr = globalThis.jsr;
    var ms = elapsedMs(frame, 30);
    var clamp01 = function(v) { return Math.max(0, Math.min(1, v)); };
    var lerp = function(a, b, t) { return a + (b - a) * t; };

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    // Brand Colors
    var C_VIOLET = '#5B61F6';
    var C_VIOLET_LIGHT = '#8F6BFF';
    var C_TEAL = '#2EBD9E';
    var C_TEAL_DARK = '#1E826C';
    var C_WHITE = '#FFFFFF';
    var C_SILVER = '#A0AFC4';
    var C_MUTED = '#4A5B7A';
    var C_BG_CARD = '#080E1C';
    var C_BORDER = '#1E2D4A';

    // Camera / Terminal Entrance & Exit
    var enterT = tw(0, 24, 0, 1, 'easeOutCubic');
    var exitT = tw(136, 14, 0, 1, 'easeInOutExpo');

    var termScale = lerp(0.95, 1.0, enterT) * (1 + 0.06 * exitT);
    var termOpacity = clamp01(enterT * (1 - 0.15 * exitT));
    var termY = lerp(30, 0, enterT) - 20 * exitT;

    var kids = [];

    // ---- Background Atmosphere ----------------------------------------------
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: '#050814',
      positioned: { left: 0, top: 0 },
    });

    // Ambient radial glows in Fa brand colors
    var glowPulse = 1 + 0.05 * Math.sin(frame * 0.08);
    kids.push({
      type: 'rect',
      width: 1100,
      height: 600,
      radius: 300,
      fill: '#151C38',
      opacity: 0.35 * glowPulse * termOpacity,
      positioned: { left: (1920 - 1100) / 2, top: 220 },
    });

    // Subtle background grid lines
    var gridAlpha = 0.08 * termOpacity;
    for (var gx = 160; gx < 1920; gx += 160) {
      kids.push({
        type: 'rect',
        width: 1,
        height: 1080,
        fill: '#5B61F6',
        opacity: gridAlpha,
        positioned: { left: gx, top: 0 },
      });
    }
    for (var gy = 90; gy < 1080; gy += 90) {
      kids.push({
        type: 'rect',
        width: 1920,
        height: 1,
        fill: '#2EBD9E',
        opacity: gridAlpha * 0.6,
        positioned: { left: 0, top: gy },
      });
    }

    // ---- Terminal Window Container -----------------------------------------
    var boxW = 1440;
    var boxH = 680;
    var boxX = (1920 - boxW) / 2;
    var boxY = 200 + termY;

    // Outer glow aura around terminal
    kids.push({
      type: 'rect',
      width: boxW + 40,
      height: boxH + 40,
      radius: 28,
      fill: '#5B61F6',
      opacity: 0.12 * termOpacity,
      positioned: { left: boxX - 20, top: boxY - 20 },
    });

    // Frosted glass obsidian panel
    kids.push({
      type: 'rect',
      width: boxW,
      height: boxH,
      radius: 20,
      fill: C_BG_CARD,
      border: { color: C_BORDER, width: 1.5 },
      opacity: termOpacity,
      positioned: { left: boxX, top: boxY },
    });

    // Decorative corner brackets (HUD aesthetic)
    var bracketLen = 28;
    var bracketThick = 3;
    // Top-left
    kids.push({
      type: 'rect', width: bracketLen, height: bracketThick, radius: 1,
      fill: C_VIOLET, opacity: 0.85 * termOpacity,
      positioned: { left: boxX + 8, top: boxY + 8 },
    });
    kids.push({
      type: 'rect', width: bracketThick, height: bracketLen, radius: 1,
      fill: C_VIOLET, opacity: 0.85 * termOpacity,
      positioned: { left: boxX + 8, top: boxY + 8 },
    });
    // Top-right
    kids.push({
      type: 'rect', width: bracketLen, height: bracketThick, radius: 1,
      fill: C_TEAL, opacity: 0.85 * termOpacity,
      positioned: { left: boxX + boxW - 8 - bracketLen, top: boxY + 8 },
    });
    kids.push({
      type: 'rect', width: bracketThick, height: bracketLen, radius: 1,
      fill: C_TEAL, opacity: 0.85 * termOpacity,
      positioned: { left: boxX + boxW - 11, top: boxY + 8 },
    });

    // ---- Terminal Top Header Bar -------------------------------------------
    var headerH = 56;
    kids.push({
      type: 'rect',
      width: boxW,
      height: headerH,
      radius: 0,
      fill: '#0D152A',
      opacity: termOpacity,
      positioned: { left: boxX, top: boxY },
    });
    kids.push({
      type: 'rect',
      width: boxW,
      height: 1,
      fill: '#1E2D4A',
      opacity: termOpacity,
      positioned: { left: boxX, top: boxY + headerH },
    });

    // Traffic light dots
    kids.push({ type: 'rect', width: 12, height: 12, radius: 6, fill: '#FF5F56', opacity: termOpacity, positioned: { left: boxX + 24, top: boxY + 22 } });
    kids.push({ type: 'rect', width: 12, height: 12, radius: 6, fill: '#FFBD2E', opacity: termOpacity, positioned: { left: boxX + 44, top: boxY + 22 } });
    kids.push({ type: 'rect', width: 12, height: 12, radius: 6, fill: '#27C93F', opacity: termOpacity, positioned: { left: boxX + 64, top: boxY + 22 } });

    // Center header text
    kids.push({
      type: 'text',
      text: 'FA ARCHITECT // SYSTEM DIRECTIVE INTAKE',
      opacity: termOpacity * 0.9,
      style: {
        fontSize: 14,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: C_SILVER,
        letterSpacing: 2,
      },
      positioned: { left: boxX + 104, top: boxY + 21 },
    });

    // Right status badge
    kids.push({
      type: 'rect',
      width: 240,
      height: 28,
      radius: 14,
      fill: '#101C36',
      border: { color: '#2EBD9E', width: 1 },
      opacity: termOpacity * 0.9,
      positioned: { left: boxX + boxW - 264, top: boxY + 14 },
    });
    // Status live dot
    kids.push({
      type: 'rect',
      width: 8,
      height: 8,
      radius: 4,
      fill: C_TEAL,
      opacity: termOpacity,
      positioned: { left: boxX + boxW - 246, top: boxY + 24 },
    });
    kids.push({
      type: 'text',
      text: 'HARNESS ENGINE: LIVE',
      opacity: termOpacity,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: C_TEAL,
        letterSpacing: 1,
      },
      positioned: { left: boxX + boxW - 230, top: boxY + 21 },
    });

    // ---- Prompt Typing Body ------------------------------------------------
    // Prompt specification lines
    var lines = [
      {
        text: 'Build the ultimate coding harness.',
        color: C_WHITE,
        fontSize: 32,
        fontFamily: 'Impact',
        fontWeight: '700',
        letterSpacing: 1.5,
        startF: 16,
        endF: 36,
      },
      {
        text: '> Benchmark Copilot, Codex, OpenCode & Kimi CLI.',
        color: C_VIOLET_LIGHT,
        fontSize: 22,
        fontFamily: 'monospace',
        fontWeight: '700',
        letterSpacing: 0.5,
        startF: 38,
        endF: 58,
      },
      {
        text: '> Take Pi & Oh My Pi as the core architecture.',
        color: '#C4B5FD',
        fontSize: 22,
        fontFamily: 'monospace',
        fontWeight: '700',
        letterSpacing: 0.5,
        startF: 60,
        endF: 78,
      },
      {
        text: '> Native Dart & Flutter engine -- deploy on macOS, Linux, Windows, iOS & Android.',
        color: '#ECECEF',
        fontSize: 22,
        fontFamily: 'monospace',
        fontWeight: '700',
        letterSpacing: 0.5,
        startF: 80,
        endF: 104,
      },
      {
        text: '> Persistent git-backed memory + dynamic JS extension ecosystem.',
        color: C_TEAL,
        fontSize: 22,
        fontFamily: 'monospace',
        fontWeight: '700',
        letterSpacing: 0.5,
        startF: 106,
        endF: 126,
      },
    ];

    var contentX = boxX + 48;
    var lineStartY = boxY + 95;
    var lineSpacings = [0, 56, 104, 152, 200];

    // Caret blink state
    var caretBlink = (Math.floor(frame / 6) % 2 === 0);

    for (var i = 0; i < lines.length; i++) {
      var item = lines[i];
      var yPos = lineStartY + lineSpacings[i];

      if (frame >= item.startF) {
        var charProgress = clamp01((frame - item.startF) / (item.endF - item.startF));
        var numChars = Math.round(charProgress * item.text.length);
        var visibleText = item.text.substring(0, numChars);

        kids.push({
          type: 'text',
          text: visibleText,
          opacity: termOpacity,
          style: {
            fontSize: item.fontSize,
            fontFamily: item.fontFamily,
            fontWeight: item.fontWeight,
            color: item.color,
            letterSpacing: item.letterSpacing,
          },
          positioned: { left: contentX, top: yPos },
        });

        // If this is currently the active line being typed, display caret
        var isCurrentLine = (frame >= item.startF && (i === lines.length - 1 || frame < lines[i + 1].startF));
        if (isCurrentLine && caretBlink && frame < 135) {
          // Estimate caret X offset
          var charWidthApprox = item.fontSize * (item.fontFamily === 'Impact' ? 0.55 : 0.62);
          var caretX = contentX + numChars * charWidthApprox + 4;
          kids.push({
            type: 'rect',
            width: item.fontFamily === 'Impact' ? 12 : 10,
            height: item.fontSize,
            radius: 2,
            fill: C_TEAL,
            opacity: termOpacity * 0.9,
            positioned: { left: caretX, top: yPos + (item.fontFamily === 'Impact' ? 4 : 2) },
          });
        }
      }
    }

    // ---- Bottom Capability Chips (Illuminating Staggered) -------------------
    var chips = [
      { label: 'DART & FLUTTER NATIVE', color: C_VIOLET, showF: 88 },
      { label: 'GIT MEMORY STORE', color: C_TEAL, showF: 104 },
      { label: 'DYNAMIC JS PLUGINS', color: C_VIOLET_LIGHT, showF: 118 },
      { label: 'IOS / ANDROID / DESKTOP', color: C_TEAL, showF: 128 },
    ];

    var chipStartX = contentX;
    var chipY = boxY + boxH - 100;
    var chipW = 216;
    var chipGap = 16;

    for (var ci = 0; ci < chips.length; ci++) {
      var chip = chips[ci];
      var chipProg = tw(chip.showF, 12, 0, 1, 'easeOutBack');
      if (chipProg > 0.01) {
        var cx = chipStartX + ci * (chipW + chipGap);
        kids.push({
          type: 'rect',
          width: chipW,
          height: 36,
          radius: 18,
          fill: '#0E172E',
          border: { color: chip.color, width: 1.2 },
          opacity: clamp01(chipProg * termOpacity),
          offsetY: 8 * (1 - chipProg),
          positioned: { left: cx, top: chipY },
        });
        // Indicator dot inside chip
        kids.push({
          type: 'rect',
          width: 7,
          height: 7,
          radius: 3.5,
          fill: chip.color,
          opacity: clamp01(chipProg * termOpacity),
          offsetY: 8 * (1 - chipProg),
          positioned: { left: cx + 16, top: chipY + 14.5 },
        });
        kids.push({
          type: 'text',
          text: chip.label,
          opacity: clamp01(chipProg * termOpacity),
          offsetY: 8 * (1 - chipProg),
          style: {
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: '700',
            color: C_WHITE,
            letterSpacing: 0.5,
          },
          positioned: { left: cx + 30, top: chipY + 11 },
        });
      }
    }

    // ---- Dispatch Button with Enter Click Dip ------------------------------
    var btnIn = tw(115, 16, 0, 1, 'easeOutExpo');
    if (btnIn > 0.01) {
      var btnW = 220;
      var btnH = 50;
      var btnX = boxX + boxW - btnW - 48;
      var btnY = boxY + boxH - btnH - 42;

      // Enter click dip at frame 135: button compresses to 0.92 for 6 frames
      var isClicked = frame >= 135;
      var dipT = 0;
      if (frame >= 135 && frame <= 145) {
        dipT = Math.sin((frame - 135) / 10 * Math.PI);
      }
      var curBtnScale = 1 - 0.08 * dipT;
      var btnGlowA = isClicked ? 0.35 + 0.15 * Math.sin(frame * 0.5) : 0.15;

      // Glow behind button
      kids.push({
        type: 'rect',
        width: (btnW + 20) * curBtnScale,
        height: (btnH + 20) * curBtnScale,
        radius: 26,
        fill: C_TEAL,
        opacity: btnGlowA * termOpacity,
        positioned: { left: btnX - 10, top: btnY - 10 },
      });

      // Button body
      kids.push({
        type: 'rect',
        width: btnW * curBtnScale,
        height: btnH * curBtnScale,
        radius: 25,
        fill: isClicked ? '#2EBD9E' : '#5B61F6',
        gradient: isClicked ? {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: ['#2EBD9E', '#5CE8CF'],
        } : {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: ['#5B61F6', '#2EBD9E'],
        },
        opacity: termOpacity,
        positioned: { left: btnX + (btnW * (1 - curBtnScale)) / 2, top: btnY + (btnH * (1 - curBtnScale)) / 2 },
      });

      // Button text
      kids.push({
        type: 'text',
        text: isClicked ? 'EXECUTING...' : 'DISPATCH [ENTER]',
        opacity: termOpacity,
        style: {
          fontSize: 14,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: C_WHITE,
          letterSpacing: 1.2,
        },
        positioned: { left: btnX + (isClicked ? 52 : 36), top: btnY + 17 },
      });

      // Shockwave ring on click
      if (frame >= 135) {
        var shockProgress = (frame - 135) / 15;
        var shockR = 30 + shockProgress * 220;
        var shockAlpha = (1 - shockProgress) * 0.6;
        kids.push({
          type: 'rect',
          width: shockR * 2,
          height: shockR * 2,
          radius: shockR,
          fill: '#00000000',
          border: { color: C_TEAL, width: 2.5 },
          opacity: clamp01(shockAlpha),
          positioned: { left: btnX + btnW / 2 - shockR, top: btnY + btnH / 2 - shockR },
        });
      }
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
