// 03 — Connect — BYOK: bring your own AI provider (144 frames, 3 bars)
//
// Provider chips light up one by one on the beat grid, each flips to a
// checkmark, then the status pill confirms: "FA iOS AGENT — CONNECTED".

scene = {
  id: '03_connect',
  duration: 144,
  from: 782,
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

    // Handoff from 02b_splash: that scene melts into white on its tail;
    // we open on the same white and dissolve out. Shapes paint `fill` with
    // alpha baked into the 8-digit hex (#AARRGGBB) — opacity wrap is
    // unreliable on shapes.
    var handoff = clamp01(tw(0, 14, 1, 0, 'easeOut'));
    if (handoff > 0.003) {
      var ha = Math.round(handoff * 255).toString(16).padStart(2, '0');
      kids.push({
        type: 'rect',
        width: F.W,
        height: F.H,
        fill: '#' + ha + 'FFFFFF',
      });
    }
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Title
    var titleIn = expoOut(clamp01((frame - 4) / 12));
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
      var pIn = backOut(clamp01((frame - inAt) / 12));
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
              fill: T.violet,
              opacity: clamp01(pIn * (0.25 + 0.75 * (a / 8))),
              positioned: {
                left: stX + 16 + Math.cos(segA) * 14 - 3,
                top: stY + 16 + Math.sin(segA) * 14 - 3,
              },
            });
          }
        } else {
          var ck = backOut(clamp01((frame - inAt - 14) / 8));
          kids.push(faRRect(36, 36, 18, T.teal, {
            opacity: clamp01(ck),
            positioned: { left: stX, top: stY },
          }));
          kids.push(checkNode(stX + 18, stY + 18, 30,
            T.isLight ? '#FFFFFF' : '#05070D', ck, clamp01(ck)));
        }
      }
    }

    // ---- Mesh hairlines: connectors draw on once both endpoints are lit ----
    var meshIn = [];
    for (var mi = 0; mi < providers.length; mi++) {
      var mrow = Math.floor(mi / cols);
      var mcol = mi % cols;
      // Horizontal neighbour.
      if (mcol < cols - 1) {
        meshIn.push({ a: mi, b: mi + 1, h: true });
      }
      // Vertical neighbour.
      if (mrow < rows - 1) {
        meshIn.push({ a: mi, b: mi + cols, h: false });
      }
    }
    for (var si2 = 0; si2 < meshIn.length; si2++) {
      var seg = meshIn[si2];
      var litA = frame >= 8 + seg.a * 9 + 13;
      var litB = frame >= 8 + seg.b * 9 + 13;
      if (!litA || !litB) continue;
      var segP = clamp01((frame - (8 + seg.b * 9 + 13)) / 10);
      var pa = {
        x: x0 + (seg.a % cols) * (chipW + gap) + (seg.h ? chipW : chipW / 2),
        y: y0 + Math.floor(seg.a / cols) * (chipH + vgap) + (seg.h ? chipH / 2 : chipH),
      };
      var pb = {
        x: x0 + (seg.b % cols) * (chipW + gap) + (seg.h ? 0 : chipW / 2),
        y: y0 + Math.floor(seg.b / cols) * (chipH + vgap) + (seg.h ? chipH / 2 : 0),
      };
      kids.push(polylineScreen([pa, pb], 2, segP, T.teal, 0.22 * segP));
    }

    // ---- Status pill --------------------------------------------------------
    // Tail: the pill fades into the handoff dot that flies to 04 (below).
    var pillOut = 1 - clamp01((frame - 122) / 8);
    var stIn = tw(96, 14, 0, 1, 'easeOut') * pillOut;
    var pillW = isP ? F.W * 0.86 : 760;
    var pillH = 84;
    var pillX = cx - pillW / 2;
    var pillY = isP ? F.H * 0.72 : F.H * 0.66;
    if (stIn > 0.003) {
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
        fill: T.tealBright,
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
      opacity: fnIn * 0.7 * pillOut,
      style: {
        fontSize: isP ? 20 : 19,
        fontFamily: 'monospace',
        color: T.faint,
        textAlign: 'center',
        letterSpacing: 2,
      },
      positioned: { left: 0, top: isP ? F.H * 0.85 : F.H * 0.83 },
    }));

    // ---- Handoff to 04_ask --------------------------------------------------
    // The CONNECTED pill collapses into its pulse dot, which flies to 04's
    // typing-indicator spot and becomes the cursor Fa "types" with.
    // KEEP IN SYNC with 04_ask: landing = centre of the typing dots.
    var chatW4 = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var landX = cx - chatW4 / 2 + 64;
    var landY = (isP ? F.H * 0.30 : F.H * 0.36) + 32;

    // Content veil: dips the whole scene to the shared bg tone under the dot.
    var veil = clamp01((frame - 130) / 12);
    if (veil > 0.003) {
      var va = Math.round(veil * 255).toString(16).padStart(2, '0');
      var vb = T.bg.replace('#', '').toUpperCase();
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + va + vb });
    }

    // The pill's pulse dot lifts out and swooshes (right-bowed arc) to 04's
    // typing spot, glowing so it reads against the dipping background.
    var flyT = clamp01((frame - 124) / 20);
    if (flyT > 0) {
      var e = flyT * flyT * (3 - 2 * flyT); // smoothstep
      var sx2 = pillX + 41;
      var sy2 = pillY + pillH / 2;
      var q1x = sx2 + (landX - sx2) * 0.5 + Math.min(240, F.W * 0.16); // bow right
      var q1y = sy2 + (landY - sy2) * 0.5;
      function bez(a, q, b, t) {
        var u = 1 - t;
        return u * u * a + 2 * u * t * q + t * t * b;
      }
      var dr = 7 + 11 * e;
      // trail
      for (var ti = 1; ti <= 3; ti++) {
        var tt = Math.max(0, e - ti * 0.055);
        if (tt <= 0) break;
        var tx2 = bez(sx2, q1x, landX, tt);
        var ty2 = bez(sy2, q1y, landY, tt);
        var tr = dr * (1 - ti * 0.22);
        kids.push({ type: 'circle', size: tr * 2, fill: T.teal,
          opacity: 0.30 - ti * 0.07,
          positioned: { left: tx2 - tr, top: ty2 - tr } });
      }
      // glow + core
      kids.push({ type: 'circle', size: dr * 3.4, fill: T.teal,
        opacity: 0.30, blur: 22,
        positioned: { left: bez(sx2, q1x, landX, e) - dr * 1.7,
          top: bez(sy2, q1y, landY, e) - dr * 1.7 } });
      kids.push({ type: 'circle', size: dr * 2, fill: T.tealBright,
        opacity: flyT < 1 ? 1 : 1,
        positioned: { left: bez(sx2, q1x, landX, e) - dr,
          top: bez(sy2, q1y, landY, e) - dr } });
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
