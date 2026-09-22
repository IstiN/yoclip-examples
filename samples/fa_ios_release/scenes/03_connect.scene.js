// 03 — Connect — BYOK: bring your own AI provider (144 frames, 3 bars)
//
// Provider chips light up one by one on the beat grid, each flips to a
// checkmark, then the status pill confirms: "FA iOS AGENT — CONNECTED".

scene = {
  id: '03_connect',
  duration: 144,
  from: 692,
  timeline: {
    label: 'Connect',
    color: '#5B61F6',
    lane: 'video',
  },

  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var T = faTheme();
    var F = faFormat();

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Title
    var titleIn = tw(4, 12, 0, 1, 'easeOutExpo');
    kids.push(faText('CONNECT YOUR AI PROVIDER.', {
      width: F.W,
      opacity: clamp01(titleIn * 1.2),
      offsetY: 18 * (1 - titleIn),
      style: {
        fontSize: isP ? Math.round(m * 0.058) : Math.round(m * 0.042),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        textAlign: 'center',
        letterSpacing: 3,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: T.isLight
            ? ['#3C4043', '#0B0F19']
            : ['#FFFFFF', '#ECECEF', '#9E9EA8'],
          stops: T.isLight ? [0.0, 1.0] : [0.0, 0.45, 1.0],
        },
      },
      positioned: { left: 0, top: isP ? F.H * 0.10 : F.H * 0.14 },
    }));
    kids.push(faText('BYOK — YOUR KEYS, YOUR KEYCHAIN. NO MIDDLEMAN.', {
      width: F.W,
      opacity: titleIn * 0.75,
      style: {
        fontSize: isP ? 21 : 20,
        fontFamily: 'monospace',
        color: T.dim,
        textAlign: 'center',
        letterSpacing: 2,
      },
      positioned: { left: 0, top: isP ? F.H * 0.165 : F.H * 0.265 },
    }));

    // ---- Provider chips ---------------------------------------------------
    // ASTRA leads (OpenAI), then the rest light up on the beat grid.
    var providers = [
      { name: 'ASTRA', tag: 'OPENAI', icon: 'astra' },
      { name: 'GPT-5.2', tag: 'OPENAI', icon: 'gpt' },
      { name: 'KIMI K3', tag: 'MOONSHOT', icon: 'kimi' },
      { name: 'CLAUDE', tag: 'ANTHROPIC', icon: 'claude' },
      { name: 'GEMINI', tag: 'GOOGLE', icon: 'gemini' },
      { name: 'GLM 5.3', tag: 'Z.AI', icon: 'glm' },
      { name: 'AIIN.BY', tag: '300+ MODELS', icon: 'aiin' },
      { name: 'OpenRouter', tag: '300+ MODELS', icon: 'openrouter' },
    ];
    var cols = isP ? 2 : 4;
    var rows = isP ? 4 : 2;
    var chipW = isP ? F.W * 0.44 : Math.min(F.W * 0.19, 300);
    var chipH = isP ? 138 : 150;
    var gap = isP ? F.W * 0.04 : F.W * 0.024;
    var vgap = isP ? 32 : 36;
    var gridW = cols * chipW + (cols - 1) * gap;
    var x0 = cx - gridW / 2;
    var y0 = isP ? F.H * 0.26 : F.H * 0.32;

    for (var i = 0; i < providers.length; i++) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var px = x0 + col * (chipW + gap);
      var py = y0 + row * (chipH + vgap);
      var inAt = 8 + i * 9;
      var pIn = tw(inAt, 12, 0, 1, 'easeOutBack');
      var lit = frame >= inAt + 13; // flips to "connected" state
      var colr = lit ? T.teal : T.violet;

      if (pIn > 0.003) {
        kids.push(faRRect(chipW, chipH, 20, T.card, {
          opacity: pIn,
          border: { color: lit ? T.teal : T.border, width: lit ? 2 : 1.5 },
          offsetY: 18 * (1 - pIn),
          positioned: { left: px, top: py },
        }));

        // Provider mark (themed monochrome vector icon)
        var iconS = 42;
        kids.push(providerIconNode(providers[i].icon, colr, iconS, {
          opacity: pIn,
          positioned: { left: px + 22, top: py + 26 },
        }));
        var nameX = px + 22 + iconS + 16;
        kids.push(faText(providers[i].name, {
          opacity: pIn,
          style: {
            fontSize: isP ? 27 : 26,
            fontFamily: 'monospace',
            fontWeight: '800',
            color: lit ? T.teal : T.text,
            letterSpacing: 1,
          },
          positioned: { left: nameX, top: py + 30 },
        }));
        kids.push(faText(providers[i].tag, {
          opacity: pIn * 0.6,
          style: {
            fontSize: isP ? 18 : 16,
            fontFamily: 'monospace',
            color: T.dim,
            letterSpacing: 1.5,
          },
          positioned: { left: nameX, top: py + 74 },
        }));

        // Status corner: spinner -> check
        var stX = px + chipW - 52;
        var stY = py + chipH - 52;
        if (!lit) {
          var ang = frame * 0.35;
          for (var a = 0; a < 8; a++) {
            var segA = ang + a * Math.PI / 4;
            kids.push({
              type: 'circle',
              size: 6,
              color: T.violet,
              opacity: clamp01(pIn * (0.25 + 0.75 * (a / 8))),
              positioned: {
                left: stX + 16 + Math.cos(segA) * 14 - 3,
                top: stY + 16 + Math.sin(segA) * 14 - 3,
              },
            });
          }
        } else {
          var ck = tw(inAt + 14, 8, 0, 1, 'easeOutBack');
          kids.push(faRRect(36, 36, 18, T.teal, {
            opacity: ck,
            positioned: { left: stX, top: stY },
          }));
          kids.push(faText('✓', {
            opacity: ck,
            style: {
              fontSize: 26, fontFamily: 'monospace', fontWeight: '800',
              color: T.isLight ? '#FFFFFF' : '#05070D',
            },
            positioned: { left: stX + 8, top: stY + 2 },
          }));
        }
      }
    }

    // ---- Status pill --------------------------------------------------------
    var stIn = tw(96, 14, 0, 1, 'easeOutExpo');
    if (stIn > 0.003) {
      var pillW = isP ? F.W * 0.86 : 760;
      var pillH = 84;
      var pillX = cx - pillW / 2;
      var pillY = isP ? F.H * 0.72 : F.H * 0.66;
      var glow = 0.5 + 0.2 * Math.sin(frame * 0.45);

      kids.push(faRRect(pillW, pillH, pillH / 2, T.teal, {
        opacity: 0.22 * glow * stIn,
        blur: 30,
        positioned: { left: pillX, top: pillY },
      }));
      kids.push(faRRect(pillW, pillH, pillH / 2, T.card, {
        opacity: stIn,
        border: { color: T.teal, width: 2 },
        positioned: { left: pillX, top: pillY },
      }));
      kids.push({
        type: 'circle',
        size: 14,
        color: T.tealBright,
        opacity: stIn,
        positioned: { left: pillX + 34, top: pillY + pillH / 2 - 7 },
      });
      kids.push(faText('FA iOS AGENT — CONNECTED', {
        opacity: stIn,
        style: {
          fontSize: isP ? 30 : 30,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.teal,
          letterSpacing: 3,
        },
        positioned: { left: pillX + (isP ? 62 : 70), top: pillY + 29 },
      }));
    }

    // Footnote
    var fnIn = tw(112, 12, 0, 1, 'easeOut');
    kids.push(faText('SWITCH PROVIDERS ANYTIME — ONE TAP, ZERO LOCK-IN.', {
      width: F.W,
      opacity: fnIn * 0.7,
      style: {
        fontSize: isP ? 20 : 19,
        fontFamily: 'monospace',
        color: T.faint,
        textAlign: 'center',
        letterSpacing: 2,
      },
      positioned: { left: 0, top: isP ? F.H * 0.85 : F.H * 0.83 },
    }));

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
