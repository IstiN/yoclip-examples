// 01b — Prompt: The Creator's Directive.
//
// Narrative beat: Following the Fa mark awakening in 01_dark, the creator
// inputs the ultimate agent specification on a giant tactical command terminal.
// Mechanical keystrokes clatter as the vision is typed out line by line,
// capability chips illuminate, and a heavy [ENTER] click triggers
// the full system boot in 02_alive ("FA IS ALIVE").

scene = {
  id: '01b_prompt',
  duration: 150, // 5.0 seconds at 30 fps
  description: 'Tactical command screen: creator types the ultimate agent prompt with mechanical keystrokes, capability badges illuminate, and [ENTER] triggers the live system boot.',

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

    // ---- Strict Fa Brand Palette (Pure Obsidian Hardware + Royal Violet + Emerald Teal) ----
    var C_VIOLET = '#5B61F6';
    var C_VIOLET_LIGHT = '#8F6BFF';
    var C_VIOLET_PALE = '#C4B5FD';
    var C_TEAL = '#2EBD9E';
    var C_WHITE = '#FFFFFF';
    var C_TITANIUM = '#ECECEF';
    var C_SILVER = '#A0AFC4';
    var C_MUTED = '#606B82';

    // Obsidian Slate Hardware Surfaces (NO blue tint)
    var C_BG_WORLD = '#05070D';
    var C_BG_CARD = '#0B0F19';
    var C_BG_HEADER = '#101522';
    var C_BG_PILL = '#141A29';
    var C_BORDER = '#1E2638';

    // Camera / Terminal Entrance & Exit
    var enterT = tw(0, 16, 0, 1, 'easeOutCubic');
    var exitT = tw(136, 14, 0, 1, 'easeInOutExpo');

    var termScale = lerp(0.97, 1.0, enterT) * (1 + 0.05 * exitT);
    var termOpacity = clamp01(enterT * (1 - 0.15 * exitT));

    // Fixed vertical position during typing so text never twitches or bobs
    var boxW = 1440;
    var boxH = 680;
    var boxX = (1920 - boxW) / 2;
    var boxY = 200 - 15 * exitT;

    var kids = [];

    // ---- Background Atmosphere ----------------------------------------------
    kids.push({
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: C_BG_WORLD,
      positioned: { left: 0, top: 0 },
    });

    // Ambient radial glow behind the terminal
    var glowPulse = 1 + 0.04 * Math.sin(frame * 0.08);
    kids.push({
      type: 'rect',
      width: 1200,
      height: 640,
      radius: 320,
      fill: '#131A2B',
      opacity: 0.30 * glowPulse * termOpacity,
      positioned: { left: (1920 - 1200) / 2, top: 220 },
    });

    // Subtle tactical background grid lines
    var gridAlpha = 0.04 * termOpacity;
    for (var gx = 160; gx < 1920; gx += 160) {
      kids.push({
        type: 'rect',
        width: 1,
        height: 1080,
        fill: C_VIOLET,
        opacity: gridAlpha,
        positioned: { left: gx, top: 0 },
      });
    }
    for (var gy = 90; gy < 1080; gy += 90) {
      kids.push({
        type: 'rect',
        width: 1920,
        height: 1,
        fill: C_TEAL,
        opacity: gridAlpha,
        positioned: { left: 0, top: gy },
      });
    }

    // ---- Terminal Window Container -----------------------------------------
    // Outer glow aura around terminal
    kids.push({
      type: 'rect',
      width: boxW + 40,
      height: boxH + 40,
      radius: 26,
      fill: C_VIOLET,
      opacity: 0.08 * termOpacity,
      positioned: { left: boxX - 20, top: boxY - 20 },
    });

    // Frosted obsidian terminal panel
    kids.push({
      type: 'rect',
      width: boxW,
      height: boxH,
      radius: 18,
      fill: C_BG_CARD,
      border: { color: C_BORDER, width: 1.5 },
      opacity: termOpacity,
      positioned: { left: boxX, top: boxY },
    });

    // Decorative corner brackets (HUD tactical aesthetic)
    var bracketLen = 28;
    var bracketThick = 2.5;
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
      positioned: { left: boxX + boxW - 10.5, top: boxY + 8 },
    });

    // ---- Terminal Top Header Bar -------------------------------------------
    var headerH = 56;
    kids.push({
      type: 'rect',
      width: boxW,
      height: headerH,
      radius: 0,
      fill: C_BG_HEADER,
      opacity: termOpacity,
      positioned: { left: boxX, top: boxY },
    });
    kids.push({
      type: 'rect',
      width: boxW,
      height: 1,
      fill: C_BORDER,
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
        fontSize: 13,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: C_SILVER,
      },
      positioned: { left: boxX + 104, top: boxY + 22 },
    });

    // Right status badge (Kimi CLI K3 model intake)
    var badgeW = 160;
    var badgeX = boxX + boxW - badgeW - 24;
    kids.push({
      type: 'rect',
      width: badgeW,
      height: 28,
      radius: 14,
      fill: C_BG_PILL,
      border: { color: C_TEAL, width: 1 },
      opacity: termOpacity * 0.9,
      positioned: { left: badgeX, top: boxY + 14 },
    });
    // Status live dot
    kids.push({
      type: 'rect',
      width: 8,
      height: 8,
      radius: 4,
      fill: C_TEAL,
      opacity: termOpacity,
      positioned: { left: badgeX + 16, top: boxY + 24 },
    });
    kids.push({
      type: 'text',
      text: 'KIMI CLI: K3',
      opacity: termOpacity,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: C_TEAL,
      },
      positioned: { left: badgeX + 32, top: boxY + 21 },
    });

    // ---- Prompt Typing Body ------------------------------------------------
    // All lines use monospace with zero letter spacing to completely prevent kerning twitching.
    var lines = [
      {
        prefix: '> ',
        text: 'Build the ultimate coding harness.',
        color: C_WHITE,
        fontSize: 26,
        fontWeight: '800',
        startF: 14,
        endF: 34,
      },
      {
        prefix: '> ',
        text: 'Benchmark Copilot, Codex, OpenCode & Kimi CLI.',
        color: C_VIOLET_LIGHT,
        fontSize: 21,
        fontWeight: '700',
        startF: 36,
        endF: 56,
      },
      {
        prefix: '> ',
        text: 'Take Pi & Oh My Pi as the core architecture.',
        color: C_VIOLET_PALE,
        fontSize: 21,
        fontWeight: '700',
        startF: 58,
        endF: 76,
      },
      {
        prefix: '> ',
        text: 'Native Dart & Flutter engine -- macOS, Linux, Windows, iOS, Android & Web.',
        color: C_TITANIUM,
        fontSize: 21,
        fontWeight: '700',
        startF: 78,
        endF: 102,
      },
      {
        prefix: '> ',
        text: 'Persistent git-backed memory + dynamic JS extension ecosystem.',
        color: C_TEAL,
        fontSize: 21,
        fontWeight: '700',
        startF: 104,
        endF: 124,
      },
    ];

    var contentX = boxX + 48;
    var lineStartY = boxY + 95;
    var lineSpacings = [0, 54, 102, 150, 198];

    // Caret blink state (blinks every 6 frames, stops at enter click frame 135)
    var caretBlink = (Math.floor(frame / 6) % 2 === 0);

    for (var i = 0; i < lines.length; i++) {
      var item = lines[i];
      var yPos = lineStartY + lineSpacings[i];

      if (frame >= item.startF) {
        var charProgress = clamp01((frame - item.startF) / (item.endF - item.startF));
        var numChars = Math.round(charProgress * item.text.length);
        var visibleText = item.prefix + item.text.substring(0, numChars);

        var isCurrentLine = (frame >= item.startF && (i === lines.length - 1 || frame < lines[i + 1].startF));
        var showCaret = isCurrentLine && caretBlink && frame < 135;

        // Render line and attached caret as a row so caret is strictly locked to text end
        var rowChildren = [
          {
            type: 'text',
            text: visibleText,
            opacity: termOpacity,
            style: {
              fontSize: item.fontSize,
              fontFamily: 'monospace',
              fontWeight: item.fontWeight,
              color: item.color,
            },
          },
        ];

        if (showCaret) {
          rowChildren.push({
            type: 'container',
            width: 9,
            height: item.fontSize * 1.15,
            color: C_TEAL,
            margin: { left: 4 },
          });
        }

        kids.push({
          type: 'row',
          crossAxisAlignment: 'center',
          opacity: termOpacity,
          positioned: { left: contentX, top: yPos },
          children: rowChildren,
        });
      }
    }

    // ---- Bottom Capability Chips (Illuminating Staggered) -------------------
    var chips = [
      { label: 'DART & FLUTTER NATIVE', color: C_VIOLET, showF: 86 },
      { label: 'GIT MEMORY STORE', color: C_TEAL, showF: 100 },
      { label: 'DYNAMIC JS PLUGINS', color: C_VIOLET_LIGHT, showF: 114 },
      { label: 'ALL PLATFORMS + WEB', color: C_TEAL, showF: 124 },
    ];

    var chipStartX = contentX;
    var chipY = boxY + boxH - 96;
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
          fill: C_BG_PILL,
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
          },
          positioned: { left: cx + 30, top: chipY + 11 },
        });
      }
    }

    // ---- Dispatch Button with Enter Click Dip ------------------------------
    var btnIn = tw(115, 14, 0, 1, 'easeOutExpo');
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
        fill: isClicked ? C_TEAL : C_VIOLET,
        gradient: isClicked ? {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: ['#2EBD9E', '#5CE8CF'],
        } : {
          begin: 'centerLeft',
          end: 'centerRight',
          colors: [C_VIOLET, C_TEAL],
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
          border: { color: C_TEAL, width: 2 },
          opacity: shockAlpha * termOpacity,
          positioned: {
            left: btnX + btnW / 2 - shockR,
            top: btnY + btnH / 2 - shockR,
          },
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
