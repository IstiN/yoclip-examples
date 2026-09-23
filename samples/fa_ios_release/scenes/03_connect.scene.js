// 03 — Connect — BYOK: bring your own AI provider (144 frames, 3 bars)
//
// Mirrors the real onboarding list — all 11 providers from the flutter_agent
// catalog (aiin, openrouter, chatgpt, copilot, anthropic, google, kimi,
// openai, codemie, minimax, dial) as full-width rows with brand-coloured
// icon tiles, bold names and auth-method subtitles.
//
// The camera travels the list: it pushes in, drifts down past the providers
// (each row connects — chevron -> spinner -> teal check — as the camera
// passes it), then whips back up, settles centred on AIIN and TAPS it
// (ripple rings). AIIN connects last, the status pill confirms
// "FA iOS AGENT — CONNECTED", and the handoff dot flies to 04.

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

    // Handoff from 02b_splash: melt from white (shapes take #AARRGGBB).
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

    // ---- Title (screen space) ---------------------------------------------
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

    // ---- Provider rows (content space — the camera moves over this) -------
    var providers = [
      { name: 'AIIN', sub: 'aiin.by — key auto-registered', icon: 'aiin-text', tile: 'aiin' },
      { name: 'OpenRouter', sub: 'OAuth or API key — 300+ models', icon: 'openrouter', tile: 'light' },
      { name: 'ChatGPT', sub: 'Account sign-in via OAuth', icon: 'astra', tile: 'dark' },
      { name: 'GitHub Copilot', sub: 'Account sign-in via device flow', icon: 'copilot', tile: 'ink' },
      { name: 'Claude', sub: 'Anthropic API key', icon: 'claude', tile: 'cream' },
      { name: 'Gemini', sub: 'Google AI Studio key', icon: 'gemini', tile: 'grad' },
      { name: 'Kimi K3', sub: 'Moonshot API key', icon: 'kimi', tile: 'ink' },
      { name: 'OpenAI', sub: 'API key — platform.openai.com', icon: 'astra', tile: 'green' },
      { name: 'CodeMie', sub: 'Enterprise SSO', icon: 'codemie-text', tile: 'codemie' },
      { name: 'MiniMax', sub: 'API key — MiniMax platform', icon: 'minimax-text', tile: 'minimax' },
      { name: 'DIAL', sub: 'AI gateway — DIAL platform', icon: 'dial-text', tile: 'dial' },
    ];
    var N = providers.length;

    var rowH = isP ? 120 : 68;
    var rowGap = isP ? 16 : 9;
    var step = rowH + rowGap;
    var iconD = isP ? 72 : 40;
    var nameFs = isP ? 26 : 17;
    var subFs = isP ? 17.5 : 12;
    var listY = isP ? F.H * 0.19 : F.H * 0.27; // below the BYOK subtitle
    var colW, colGap, colLX, colRX;
    if (isP) {
      colW = F.W * 0.74; // must survive the 1.32x camera zoom inside frame
      colLX = cx - colW / 2;
    } else {
      colGap = 24;
      colW = (F.W * 0.86 - colGap) / 2;
      colLX = cx - colW - colGap / 2;
      colRX = cx + colGap / 2;
    }

    function rowPos(i) {
      if (isP) return { x: colLX, y: listY + i * step };
      return i < 6
        ? { x: colLX, y: listY + i * step }
        : { x: colRX, y: listY + (i - 6) * step };
    }
    function rowCenter(i) {
      var p = rowPos(i);
      return { x: p.x + colW / 2, y: p.y + rowH / 2 };
    }

    var TAP = 106;
    function lightAt(i) {
      return i === 0 ? TAP : Math.round(26 + (i - 1) * 5.4);
    }

    var listKids = [];
    for (var i = 0; i < N; i++) {
      var pr = providers[i];
      var inAt = 6 + i * 4;
      var rowIn = expoOut(clamp01((frame - inAt) / 10));
      if (rowIn <= 0.01) continue;
      var la = lightAt(i);
      var lit = frame >= la;
      var connecting = !lit && frame >= la - 12;
      var selected = i === 0 && lit;
      var rp = rowPos(i);

      listKids.push(faRRect(colW, rowH, 18,
        selected ? (T.isLight ? '#FFFFFF' : '#121A2E') : T.card, {
        opacity: rowIn,
        border: { color: selected ? T.violet : T.border, width: selected ? 2.5 : 1.5 },
        positioned: { left: rp.x, top: rp.y },
      }));

      // Icon tile: brand-coloured squircle + monochrome glyph.
      var tileX = rp.x + 16;
      var tileY = rp.y + (rowH - iconD) / 2;
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
      } else if (pr.tile === 'green') {
        tile.color = '#10A37F';
      } else if (pr.tile === 'codemie') {
        tile.color = '#5B5BD6';
      } else if (pr.tile === 'minimax') {
        tile.color = '#C93C3C';
      } else if (pr.tile === 'dial') {
        tile.color = '#2E3A4E';
      } else {
        tile.color = '#1C2030';
      }
      listKids.push(tile);
      if (pr.icon.indexOf('-text') > 0) {
        var letters = pr.icon.split('-')[0] === 'aiin' ? 'AI'
          : pr.icon.split('-')[0].charAt(0).toUpperCase();
        listKids.push(faText(letters, {
          width: iconD,
          opacity: rowIn,
          style: {
            fontSize: Math.round(iconD * (letters.length > 1 ? 0.40 : 0.46)),
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
        listKids.push(providerIconNode(pr.icon, glyphCol, iconD * 0.52, {
          opacity: rowIn,
          positioned: {
            left: tileX + iconD * 0.24,
            top: tileY + iconD * 0.24,
          },
        }));
      }

      // Name + auth subtitle (the app's row typography, large).
      var nameX = tileX + iconD + 18;
      listKids.push(faText(pr.name, {
        opacity: rowIn,
        style: {
          fontSize: nameFs,
          fontWeight: '700',
          color: T.text,
          letterSpacing: 0.2,
        },
        positioned: { left: nameX, top: rp.y + rowH * (isP ? 0.17 : 0.14) },
      }));
      listKids.push(faText(pr.sub, {
        opacity: rowIn * 0.85,
        style: {
          fontSize: subFs,
          fontWeight: '500',
          color: T.dim,
          letterSpacing: 0.2,
        },
        positioned: { left: nameX, top: rp.y + rowH * (isP ? 0.56 : 0.54) },
      }));

      // Right rail: chevron -> spinner -> teal check.
      var rx = rp.x + colW - (isP ? 34 : 30);
      var ryC = rp.y + rowH / 2;
      if (lit) {
        var ck = backOut(clamp01((frame - la) / 8));
        listKids.push(faRRect(isP ? 40 : 32, isP ? 40 : 32, isP ? 20 : 16, T.teal, {
          opacity: clamp01(ck) * rowIn,
          positioned: { left: rx - (isP ? 20 : 16), top: ryC - (isP ? 20 : 16) },
        }));
        listKids.push(checkNode(rx, ryC, isP ? 26 : 20,
          T.isLight ? '#FFFFFF' : '#05070D', ck, clamp01(ck) * rowIn));
      } else if (connecting) {
        var ang = frame * 0.45;
        for (var a = 0; a < 8; a++) {
          var segA = ang + a * Math.PI / 4;
          listKids.push({
            type: 'circle',
            size: 6,
            fill: T.violet,
            opacity: clamp01(rowIn * (0.25 + 0.75 * (a / 8))),
            positioned: {
              left: rx + Math.cos(segA) * 11 - 3,
              top: ryC + Math.sin(segA) * 11 - 3,
            },
          });
        }
      } else {
        listKids.push(polylineScreen(
          [{ x: rx - 4, y: ryC - 8 }, { x: rx + 4, y: ryC }, { x: rx - 4, y: ryC + 8 }],
          2.5, 1, T.faint, 0.8 * rowIn));
      }

      // Tap flash on AIIN when the camera presses it.
      if (selected) {
        var flash = 1 - clamp01((frame - TAP) / 12);
        if (flash > 0.003) {
          listKids.push(faRRect(colW, rowH, 18, '#FFFFFF', {
            opacity: flash * 0.22,
            positioned: { left: rp.x, top: rp.y },
          }));
        }
      }
    }

    // ---- Camera journey -----------------------------------------------------
    // Push in -> drift down past the providers -> whip back up and settle
    // centred on AIIN (the tap target). Focus/scale piecewise, smoothstep.
    function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
    var p1 = smooth((frame - 8) / 14);
    var p2 = smooth((frame - 22) / (isP ? 56 : 44));
    var p3 = smooth((frame - (isP ? 78 : 66)) / 24);

    var sIn = isP ? 1.32 : 1.22;
    var sEnd = isP ? 1.12 : 1.0; // landscape settles back to the neutral frame
    var s = 1 + (sIn - 1) * p1;
    s = s + (sEnd - sIn) * p3;

    var fA, fB, fC;
    if (isP) {
      fA = rowCenter(1);
      fB = rowCenter(9);
      fC = rowCenter(0);
    } else {
      // landscape: scan the left column, step to the right one, pull back out
      fA = { x: colLX + colW / 2, y: rowCenter(2).y };
      fB = { x: colRX + colW / 2, y: rowCenter(2).y };
      fC = { x: cx, y: F.H / 2 }; // neutral full frame for the tap
    }
    var fx = cx + (fA.x - cx) * p1;
    fx = fx + (fB.x - fA.x) * p2;
    fx = fx + (fC.x - fB.x) * p3;
    var fy = F.H / 2 + (fA.y - F.H / 2) * p1;
    fy = fy + (fB.y - fA.y) * p2;
    fy = fy + (fC.y - fB.y) * p3;

    var camX = -(fx - cx);
    var camY = -(fy - F.H / 2);

    kids.push({
      type: 'stack',
      fit: 'expand',
      scale: s,
      offsetX: camX,
      offsetY: camY,
      children: listKids,
    });

    // ---- Tap ripple on AIIN (screen centre — the camera framed it there) ---
    if (frame >= TAP) {
      var tp = clamp01((frame - TAP) / 20);
      // AIIN's on-screen position at the settled camera (pre-scale offsets)
      var aiinC = rowCenter(0);
      var tapX = (aiinC.x + camX - cx) * s + cx;
      var tapY = (aiinC.y + camY - F.H / 2) * s + F.H / 2;
      var ringPts = [];
      for (var ra = 0; ra < 24; ra++) {
        var an = ra / 24 * Math.PI * 2;
        ringPts.push({ x: tapX + Math.cos(an) * (30 + tp * 190),
          y: tapY + Math.sin(an) * (30 + tp * 190) });
      }
      kids.push(polylineScreen(ringPts, 3, 1, T.violet, (1 - tp) * 0.55));
      var ring2 = [];
      for (var rb = 0; rb < 24; rb++) {
        var an2 = rb / 24 * Math.PI * 2;
        ring2.push({ x: tapX + Math.cos(an2) * (16 + tp * 120),
          y: tapY + Math.sin(an2) * (16 + tp * 120) });
      }
      kids.push(polylineScreen(ring2, 2.5, 1, T.teal, (1 - tp) * 0.4));
    }

    // ---- Status pill --------------------------------------------------------
    // Tail: the pill fades into the handoff dot that flies to 04 (below).
    var pillOut = 1 - clamp01((frame - 122) / 8);
    var stIn = tw(112, 10, 0, 1, 'easeOut') * pillOut;
    var pillW = isP ? F.W * 0.86 : 760;
    var pillH = 84;
    var pillX = cx - pillW / 2;
    var pillY = isP ? F.H * 0.30 : F.H * 0.705; // portrait: the free band above AIIN
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
    if (!isP) {
      var fnIn = tw(112, 12, 0, 1, 'easeOut');
      kids.push(faText('SWITCH PROVIDERS ANYTIME — ONE TAP, ZERO LOCK-IN.', {
        width: F.W,
        opacity: fnIn * 0.7 * pillOut,
        style: {
          fontSize: 19,
          fontFamily: 'monospace',
          color: T.faint,
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: 0, top: F.H * 0.83 },
      }));
    }

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
