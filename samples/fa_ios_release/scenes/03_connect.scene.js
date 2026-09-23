// 03 — Connect — BYOK: bring your own AI provider (144 frames, 3 bars)
//
// Carousel concept: the big "CHOOSE HOW FA THINKS." headline sits dead
// centre with the BYOK line under it, then all 11 provider tiles from the
// flutter_agent catalog (aiin, openrouter, chatgpt, copilot, anthropic,
// google, kimi, openai, codemie, minimax, dial) fly in along a semicircular
// arc from the top - and as they arrive they PUSH the headline down and
// out. The tiles form a carousel ring that makes one full elegant turn;
// each tile connects (teal check badge) as it passes the top of the ring.
// The turn ends exactly where it started - with AIIN at the top: the camera
// settles on it, ripple rings tap it, AIIN pops with the violet selected
// border, the status pill confirms "FA iOS AGENT - CONNECTED", and the
// handoff dot flies to 04.

scene = {
  id: '03_connect',
  duration: 168,
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
    function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }

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

    // ---- Carousel geometry --------------------------------------------------
    var providers = [
      { name: 'AIIN', sub: 'aiin.by — key auto-registered', icon: 'aiin-text', tile: 'none' },
      { name: 'OpenRouter', sub: 'OAuth or API key — 300+ models', icon: 'openrouter-site', tile: 'or' },
      { name: 'ChatGPT', sub: 'Account sign-in via OAuth', icon: 'openai', tile: 'dark' },
      { name: 'GitHub Copilot', sub: 'Account sign-in via device flow', icon: 'copilot', tile: 'ink' },
      { name: 'Claude', sub: 'Anthropic API key', icon: 'claude', tile: 'cream' },
      { name: 'Gemini', sub: 'Google AI Studio key', icon: 'gemini', tile: 'grad' },
      { name: 'Kimi K3', sub: 'Moonshot API key', icon: 'kimi', tile: 'ink' },
      { name: 'OpenAI', sub: 'API key — platform.openai.com', icon: 'openai', tile: 'green' },
      { name: 'CodeMie', sub: 'Enterprise SSO', icon: 'codemie', tile: 'ink' },
      { name: 'MiniMax', sub: 'API key — MiniMax platform', icon: 'minimax', tile: 'minimax' },
      { name: 'DIAL', sub: 'AI gateway — DIAL platform', icon: 'dial', tile: 'ink' },
    ];
    var N = providers.length;
    var STEP = 360 / N;

    // Right-shifted ring: the centre sits past the right edge, so only the
    // left arc is on screen - 3-4 large tiles at a time. The FRONT point
    // (leftmost, closest to frame centre) is the connect/tap stage.
    var R = isP ? F.H * 0.46 : F.H * 0.78; // landscape: right side off-screen
    var ccy = isP ? F.H * 0.42 : F.H * 0.42;
    var ccx = (isP ? F.W * 0.25 : F.W * 0.22) + R; // centre off-screen right
    var tileD = isP ? 200 : 190;

    function tileAngle(i) { return (180 - i * STEP) * Math.PI / 180; }
    function slotPos(i, ringDeg) {
      var a = tileAngle(i) + ringDeg * Math.PI / 180;
      return { x: ccx + R * Math.cos(a), y: ccy + R * Math.sin(a) };
    }

    // Timing: tiles fly in staggered, ring spins 40-78 (one full turn),
    // AIIN is tapped at 100. Tile i (i>=1) crosses the ring top mid-spin.
    var TAP = 100;
    function lightAt(i) {
      return i === 0 ? TAP : Math.round(40 + 60 * i * STEP / 360);
    }

    var ringDeg = 360 * smooth((frame - 40) / 60); // slow, stately turn

    // ---- Headline: big, centred, pushed down by the incoming tiles ---------
    var titleIn = expoOut(clamp01((frame - 4) / 12));
    var push = smooth((frame - 26) / 24); // tiles land on the ring -> text sinks
    var pushed = (1 - smooth((frame - 100) / 10)) * // gone after the tap
      (1 - smooth((frame - 50) / 12) * 0.75); // ...and mostly once sunk
    var hFs = (isP ? m * 0.088 : m * 0.070) * (1 - push * 0.42);
    var hTop = (isP ? F.H * 0.352 : F.H * 0.30) +
      push * (isP ? F.H * 0.428 : F.H * 0.57); // landscape: clear under the ring
    var hOp = clamp01(titleIn * 1.15) * (0.9 + 0.1 * (1 - push)) * pushed;
    if (hOp > 0.004) {
      var hStyle = {
        fontSize: Math.round(hFs),
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
      };
      if (isP) {
        kids.push(faText('CHOOSE HOW', {
          width: F.W, opacity: hOp,
          style: hStyle,
          positioned: { left: 0, top: hTop },
        }));
        kids.push(faText('FA THINKS.', {
          width: F.W, opacity: hOp,
          style: hStyle,
          positioned: { left: 0, top: hTop + hFs * 1.04 },
        }));
        kids.push(faText('BYOK — YOUR KEYS, YOUR KEYCHAIN. NO MIDDLEMAN.', {
          width: F.W, opacity: hOp * 0.75,
          style: {
            fontSize: 21,
            fontFamily: 'monospace',
            color: T.dim,
            textAlign: 'center',
            letterSpacing: 2,
          },
          positioned: { left: 0, top: hTop + hFs * 2.24 + 18 },
        }));
      } else {
        kids.push(faText('CHOOSE HOW FA THINKS.', {
          width: F.W, opacity: hOp,
          style: hStyle,
          positioned: { left: 0, top: hTop },
        }));
        kids.push(faText('BYOK — YOUR KEYS, YOUR KEYCHAIN. NO MIDDLEMAN.', {
          width: F.W, opacity: hOp * 0.75,
          style: {
            fontSize: 20,
            fontFamily: 'monospace',
            color: T.dim,
            textAlign: 'center',
            letterSpacing: 2,
          },
          positioned: { left: 0, top: hTop + hFs * 1.3 + 16 },
        }));
      }
    }

    // ---- Carousel ring (content space inside the settle camera) -------------
    var recede = 1 - 0.62 * smooth((frame - TAP) / 8); // non-AIIN tiles dim after the tap

    var listKids = [];

    // Focus caption: a static text block right of the front slot that snaps
    // to whichever tile currently owns the front point of the ring.
    var bestI = 0;
    var bestD = 1e9;
    for (var fi = 0; fi < N; fi++) {
      var fd = ((ringDeg - fi * STEP) % 360 + 360) % 360;
      if (fd > 180) fd = 360 - fd;
      if (fd < bestD) { bestD = fd; bestI = fi; }
    }
    // Faint guide circle fades in as the carousel forms.
    var guideIn = tw(36, 12, 0, 1, 'easeOut');
    if (guideIn > 0.01) {
      var guide = [];
      for (var g = 0; g < 56; g++) {
        var ga = g / 56 * Math.PI * 2;
        guide.push({ x: cx + Math.cos(ga) * R, y: ccy + Math.sin(ga) * R });
      }
      listKids.push(polylineScreen(guide, 2, 1, T.faint, 0.16 * guideIn));
    }

    for (var i = 0; i < N; i++) {
      var pr = providers[i];
      var inAt = 12 + i * 2.2;
      var fly = expoOut(clamp01((frame - inAt) / 14));
      if (fly <= 0.01) continue;

      // Semicircular fly-in: sweep down from above along the ring while the
      // radius shrinks, plus a playful per-tile spin that settles at 0.
      var arcOff = -(1 - fly) * 70 * Math.PI / 180;
      var rr = R * (1 + (1 - fly) * 1.15);
      var a = tileAngle(i) + ringDeg * Math.PI / 180 + arcOff;
      var tx = ccx + rr * Math.cos(a);
      var ty = ccy + rr * Math.sin(a);
      var spin = (1 - fly) * -(150 + i * 6);

      var la = lightAt(i);
      var lit = frame >= la;
      var selected = i === 0 && lit;
      var op = (i === 0 ? 1 : recede) * clamp01(fly * 1.4);

      var pop = 1;
      if (selected) pop = 1 + 0.30 * backOut(clamp01((frame - TAP) / 10));
      else if (lit) pop = 1 + 0.10 * backOut(clamp01((frame - la) / 8));

      var half = tileD * pop / 2;

      // Tile: brand-coloured squircle + monochrome glyph.
      var tile = { type: 'container', width: tileD * pop, height: tileD * pop,
        radius: tileD * 0.28, opacity: op, rotation: spin,
        positioned: { left: tx - half, top: ty - half } };
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
      } else if (pr.tile === 'or') {
        tile.color = '#0A0F14';
      } else {
        tile.color = '#1C2030';
      }
      if (selected) {
        tile.border = { color: T.violet, width: 3 };
      } else if (lit) {
        tile.border = { color: T.teal, width: 2 };
      } else {
        tile.border = { color: T.border, width: 1.5 };
      }
      if (selected) {
        tile.shadows = [{ color: T.violet, opacity: 0.45, blur: 34,
          offset: { x: 0, y: 6 } }];
      }
      if (pr.tile !== 'none') listKids.push(tile);

      if (pr.icon === 'aiin-text') {
        // aiin.by wordmark, bare like on their homepage: 'AIIN' + '.BY'
        // on one baseline; 'AI' part follows the theme (white / ink)
        var aiInk = T.isLight ? '#16181D' : '#FFFFFF';
        var wmFs = tileD * pop * 0.34;
        var wmBy = tileD * pop * 0.17;
        var wmW = 1.96 * wmFs + 0.18 * wmFs + 1.62 * wmBy;
        listKids.push(faText('AIIN', {
          width: wmFs * 2.4,
          opacity: op,
          rotation: spin,
          style: {
            fontSize: Math.round(wmFs),
            fontWeight: '800',
            color: aiInk,
            textAlign: 'left',
            letterSpacing: 0.5,
            gradient: { begin: 'centerLeft', end: 'centerRight',
              colors: [aiInk, '#8B7CF7'], stops: [0.3, 0.8] },
          },
          positioned: { left: tx - wmW / 2, top: ty - wmFs * 0.60 },
        }));
        listKids.push(faText('.BY', {
          width: wmBy * 2.2,
          opacity: op,
          rotation: spin,
          style: {
            fontSize: Math.round(wmBy),
            fontWeight: '700',
            color: '#9AA3AF',
            textAlign: 'left',
            letterSpacing: 1,
          },
          positioned: { left: tx - wmW / 2 + 2.14 * wmFs,
            top: ty - wmFs * 0.60 + 0.72 * (wmFs - wmBy) },
        }));
      } else if (pr.icon.indexOf('-text') > 0) {
        var letters = pr.icon.split('-')[0].charAt(0).toUpperCase();
        listKids.push(faText(letters, {
          width: tileD * pop,
          opacity: op,
          rotation: spin,
          style: {
            fontSize: Math.round(tileD * pop * (letters.length > 1 ? 0.40 : 0.46)),
            fontWeight: '800',
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: 0.5,
          },
          positioned: { left: tx - half, top: ty - half + tileD * pop * 0.26 },
        }));
      } else {
        var glyphCol = pr.tile === 'cream' ? '#D97757'
          : (pr.tile === 'light' ? T.teal : '#FFFFFF');
        listKids.push(providerIconNode(pr.icon, glyphCol, tileD * pop * 0.52, {
          opacity: op,
          rotation: spin,
          positioned: {
            left: tx - tileD * pop * 0.26,
            top: ty - tileD * pop * 0.26,
          },
        }));
      }

      // Connection: teal check badge pinned to the tile's corner.
      if (lit) {
        var ck = backOut(clamp01((frame - la) / 8));
        var bd = tileD * 0.42;
        var bx = tx + tileD * pop / 2 - bd * 0.72;
        var by = ty + tileD * pop / 2 - bd * 0.72;
        listKids.push(faRRect(bd, bd, bd / 2, T.teal, {
          opacity: clamp01(ck) * op,
          positioned: { left: bx, top: by },
        }));
        listKids.push(checkNode(bx + bd / 2, by + bd / 2, bd * 0.62,
          T.isLight ? '#FFFFFF' : '#05070D', ck, clamp01(ck) * op));
      }
    }

    // ---- Settle camera: after the tap, ease onto the AIIN tile --------------
    var setT = smooth((frame - 100) / 12);
    var camS = 1 + 0.10 * setT;
    var aiin = slotPos(0, ringDeg);
    var camX = -(aiin.x - cx) * setT;
    var camY = -(aiin.y - F.H / 2) * setT;

    kids.push({
      type: 'stack',
      fit: 'expand',
      scale: camS,
      offsetX: camX,
      offsetY: camY,
      children: listKids,
    });

    // ---- Focus caption (static screen-space text, right of the arc) --------
    // The text never moves - it just snaps to whichever tile owns the front
    // point, brightening as that tile aligns.
    // anchored to the focused tile's on-screen right edge - static during the
    // browse (the front tile barely moves), gliding along at the settle zoom
    var fpC = slotPos(bestI, ringDeg);
    var fsx = (fpC.x + camX - cx) * camS + cx;
    var fsy = (fpC.y + camY - F.H / 2) * camS + F.H / 2;
    var heroPop = (bestI === 0 && frame >= TAP)
      ? 1 + 0.30 * backOut(clamp01((frame - TAP) / 10)) : 1;
    var txtL = fsx + tileD * heroPop * camS / 2 + 44;
    var txtTop = fsy - (isP ? 84 : 74);
    var focusIn = tw(20, 12, 0, 1, 'easeOut');
    var focusA = focusIn * (0.55 + 0.45 * Math.max(0, 1 - bestD / (STEP * 0.6)));
    focusA *= 1 - smooth((frame - 104) / 12); // gone once the tap settles in
    if (focusA > 0.01) {
      var fp = providers[bestI];
      kids.push(faText(fp.name, {
        opacity: focusA,
        style: {
          fontSize: isP ? 64 : 52,
          fontWeight: '800',
          color: T.text,
          textAlign: 'left',
          letterSpacing: 0.5,
        },
        positioned: { left: txtL, top: txtTop },
      }));
      kids.push(faText(fp.sub, {
        opacity: focusA * 0.8,
        style: {
          fontSize: isP ? 24 : 21,
          fontWeight: '500',
          fontFamily: 'monospace',
          color: T.dim,
          textAlign: 'left',
          letterSpacing: 1,
        },
        positioned: { left: txtL, top: txtTop + (isP ? 82 : 68) },
      }));
      kids.push(faText((bestI + 1) + ' / ' + N, {
        opacity: focusA * 0.55,
        style: {
          fontSize: isP ? 18 : 16,
          fontFamily: 'monospace',
          color: T.faint,
          textAlign: 'left',
          letterSpacing: 2,
        },
        positioned: { left: txtL, top: txtTop + (isP ? 124 : 104) },
      }));
    }

    // ---- Tap ripple on AIIN (screen space, tracks the settled camera) -------
    if (frame >= TAP) {
      var tp = clamp01((frame - TAP) / 20);
      var tapX = (aiin.x + camX - cx) * camS + cx;
      var tapY = (aiin.y + camY - F.H / 2) * camS + F.H / 2;
      var ringPts = [];
      for (var ra = 0; ra < 24; ra++) {
        var an = ra / 24 * Math.PI * 2;
        ringPts.push({ x: tapX + Math.cos(an) * (26 + tp * 170),
          y: tapY + Math.sin(an) * (26 + tp * 170) });
      }
      kids.push(polylineScreen(ringPts, 3, 1, T.violet, (1 - tp) * 0.55));
      var ring2 = [];
      for (var rb = 0; rb < 24; rb++) {
        var an2 = rb / 24 * Math.PI * 2;
        ring2.push({ x: tapX + Math.cos(an2) * (14 + tp * 110),
          y: tapY + Math.sin(an2) * (14 + tp * 110) });
      }
      kids.push(polylineScreen(ring2, 2.5, 1, T.teal, (1 - tp) * 0.4));
    }

    // ---- Status pill --------------------------------------------------------
    // Tail: the pill fades into the handoff dot that flies to 04 (below).
    var pillOut = 1 - clamp01((frame - 148) / 8);
    var stIn = tw(118, 12, 0, 1, 'easeOut') * pillOut;
    var pillW = isP ? F.W * 0.86 : 760;
    var pillH = 84;
    var pillX = cx - pillW / 2;
    var pillY = isP ? F.H * 0.62 : F.H * 0.705; // right under the centred AIIN tile
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

    // ---- Handoff to 04_ask --------------------------------------------------
    // The CONNECTED pill collapses into its pulse dot, which flies to 04's
    // typing-indicator spot and becomes the cursor Fa "types" with.
    // KEEP IN SYNC with 04_ask: landing = centre of the typing dots.
    var chatW4 = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var landX = cx - chatW4 / 2 + 64;
    var landY = (isP ? F.H * 0.30 : F.H * 0.36) + 32;

    // Content veil: dips the whole scene to the shared bg tone under the dot.
    var veil = clamp01((frame - 140) / 16);
    if (veil > 0.003) {
      var va = Math.round(veil * 255).toString(16).padStart(2, '0');
      var vb = T.bg.replace('#', '').toUpperCase();
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + va + vb });
    }

    // The pill's pulse dot lifts out and swooshes (right-bowed arc) to 04's
    // typing spot, glowing so it reads against the dipping background.
    var flyT = clamp01((frame - 152) / 16);
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
