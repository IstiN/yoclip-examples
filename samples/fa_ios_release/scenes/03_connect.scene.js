// 03 — Connect — BYOK: bring your own AI provider (144 frames, 3 bars)
//
// Mirrors the real onboarding list: full-width provider rows (icon tile +
// name + auth subtitle + chevron) slide in one by one, each row connects
// on the beat grid (chevron -> spinner -> teal check), then the status
// pill confirms: "FA iOS AGENT — CONNECTED".

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
    kids.push(faText('CHOOSE HOW FA THINKS.', {
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
      positioned: { left: 0, top: isP ? F.H * 0.165 : F.H * 0.235 },
    }));

    // ---- Provider rows — mirrors the real onboarding list -------------------
    var providers = [
      { name: 'AIIN', sub: 'aiin.by — key auto-registered', icon: 'aiin', tile: 'aiin' },
      { name: 'OpenRouter', sub: 'OAuth or API key — 300+ models', icon: 'openrouter', tile: 'light' },
      { name: 'ChatGPT', sub: 'Account sign-in via OAuth', icon: 'astra', tile: 'dark' },
      { name: 'Claude', sub: 'API key — lives in your keychain', icon: 'claude', tile: 'cream' },
      { name: 'Gemini', sub: 'Google AI Studio key', icon: 'gemini', tile: 'grad' },
      { name: 'Kimi K3', sub: 'Moonshot API key', icon: 'kimi', tile: 'ink' },
    ];
    var rowW = isP ? F.W * 0.86 : 760;
    var rowH = isP ? 96 : 62;
    var rowGap = isP ? 14 : 9;
    var rowX = cx - rowW / 2;
    var listY = isP ? F.H * 0.225 : F.H * 0.27;
    var iconD = isP ? 58 : 40;

    for (var i = 0; i < providers.length; i++) {
      var pr = providers[i];
      var inAt = 8 + i * 7;
      var rowIn = expoOut(clamp01((frame - inAt) / 10));
      if (rowIn <= 0.01) continue;
      var lightAt = 26 + i * 12;
      var lit = frame >= lightAt;
      var connecting = !lit && frame >= lightAt - 13;
      var selected = i === 0 && lit; // AIIN is the active provider
      var ry2 = listY + i * (rowH + rowGap);

      kids.push(faRRect(rowW, rowH, 18,
        selected ? (T.isLight ? '#FFFFFF' : '#121A2E') : T.card, {
        opacity: rowIn,
        border: { color: selected ? T.violet : T.border, width: selected ? 2 : 1.5 },
        offsetY: 16 * (1 - rowIn),
        positioned: { left: rowX, top: ry2 },
      }));

      // Icon tile: brand-coloured squircle + monochrome glyph.
      var tileX = rowX + 16;
      var tileY = ry2 + (rowH - iconD) / 2;
      var tile = { type: 'container', width: iconD, height: iconD,
        radius: iconD * 0.28, opacity: rowIn,
        positioned: { left: tileX, top: tileY } };
      if (pr.tile === 'aiin') {
        tile.gradient = { begin: 'topLeft', end: 'bottomRight',
          colors: [T.violet, T.violetDeep], stops: [0.0, 1.0] };
      } else if (pr.tile === 'light') {
        tile.color = T.isLight ? '#F2F4F9' : '#E9EDF5';
      } else if (pr.tile === 'dark') {
        tile.color = '#202124';
      } else if (pr.tile === 'cream') {
        tile.color = '#F0EDE6';
      } else if (pr.tile === 'grad') {
        tile.gradient = { begin: 'topLeft', end: 'bottomRight',
          colors: ['#4E7DF6', '#9B72F2'], stops: [0.0, 1.0] };
      } else {
        tile.color = '#1C2030';
      }
      kids.push(tile);
      if (pr.icon === 'aiin') {
        kids.push(faText('AI', {
          width: iconD,
          opacity: rowIn,
          style: {
            fontSize: Math.round(iconD * 0.40),
            fontWeight: '800',
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: 0.5,
          },
          positioned: { left: tileX, top: tileY + iconD * 0.26 },
        }));
      } else {
        var glyphCol = pr.tile === 'cream' ? '#D97757'
          : (pr.tile === 'light' ? T.teal : '#FFFFFF');
        kids.push(providerIconNode(pr.icon, glyphCol, iconD * 0.52, {
          opacity: rowIn,
          positioned: {
            left: tileX + iconD * 0.24,
            top: tileY + iconD * 0.24,
          },
        }));
      }

      // Name + auth subtitle (the app's row typography).
      var nameX2 = tileX + iconD + 16;
      kids.push(faText(pr.name, {
        opacity: rowIn,
        style: {
          fontSize: isP ? 19 : 15.5,
          fontWeight: '700',
          color: T.text,
          letterSpacing: 0.2,
        },
        positioned: { left: nameX2, top: ry2 + rowH * (isP ? 0.17 : 0.14) },
      }));
      kids.push(faText(pr.sub, {
        opacity: rowIn * 0.85,
        style: {
          fontSize: isP ? 13.5 : 11.5,
          fontWeight: '500',
          color: T.dim,
          letterSpacing: 0.2,
        },
        positioned: { left: nameX2, top: ry2 + rowH * (isP ? 0.55 : 0.54) },
      }));

      // Right rail: chevron -> spinner -> teal check.
      var rx2 = rowX + rowW - 34;
      var ryC = ry2 + rowH / 2;
      if (lit) {
        var ck = backOut(clamp01((frame - lightAt) / 8));
        kids.push(faRRect(34, 34, 17, T.teal, {
          opacity: clamp01(ck) * rowIn,
          positioned: { left: rx2 - 17, top: ryC - 17 },
        }));
        kids.push(checkNode(rx2, ryC, 22,
          T.isLight ? '#FFFFFF' : '#05070D', ck, clamp01(ck) * rowIn));
      } else if (connecting) {
        var ang = frame * 0.45;
        for (var a = 0; a < 8; a++) {
          var segA = ang + a * Math.PI / 4;
          kids.push({
            type: 'circle',
            size: 6,
            fill: T.violet,
            opacity: clamp01(rowIn * (0.25 + 0.75 * (a / 8))),
            positioned: {
              left: rx2 + Math.cos(segA) * 11 - 3,
              top: ryC + Math.sin(segA) * 11 - 3,
            },
          });
        }
      } else {
        kids.push(polylineScreen(
          [{ x: rx2 - 4, y: ryC - 8 }, { x: rx2 + 4, y: ryC }, { x: rx2 - 4, y: ryC + 8 }],
          2.5, 1, T.faint, 0.8 * rowIn));
      }
    }

    // ---- Status pill --------------------------------------------------------
    // Tail: the pill fades into the handoff dot that flies to 04 (below).
    var pillOut = 1 - clamp01((frame - 122) / 8);
    var stIn = tw(104, 12, 0, 1, 'easeOut') * pillOut;
    var pillW = isP ? F.W * 0.86 : 760;
    var pillH = 84;
    var pillX = cx - pillW / 2;
    var pillY = isP ? F.H * 0.72 : F.H * 0.705;
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
