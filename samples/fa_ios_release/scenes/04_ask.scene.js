// 04 — Ask — the real Fa app chat, on a phone
// (192 frames, 4 bars)
//
// Looks like the actual app screen: Fa nav bar, thread, "Ask anything…"
// input bar with a send button. Messages EMERGE FROM THE BOTTOM (like a
// real chat) and the older ones slide up when a new one arrives. Beats:
// Fa arrives (handoff dot from 03 lands into the typing dots) -> greeting
// bubble slides up -> the question TYPES into the input bar while the
// camera leans in -> send button press (scale dip + flash) and the bubble
// flies up into the thread, camera follows -> thinking dots -> Fa throws
// out the capabilities card from below, rows stagger in as the thread
// scrolls up. The background and nav are FIXED chrome outside the camera
// wrapper, so a camera move never exposes a black band.
//
// KEEP IN SYNC with 03_connect: the teal dot lands at the centre of the
// typing dots (x0 + 64, aY + 32), chatW must match 03's chatW4.

scene = {
  id: '04_ask',
  duration: 192,
  from: 950,
  timeline: {
    label: 'Ask',
    color: '#8F6BFF',
    lane: 'video',
  },

  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var T = faTheme();
    var F = faFormat();

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function smooth(x) {
      var t = clamp01(x);
      return t * t * (3 - 2 * t);
    }

    var kids = [];      // world (moves with the camera)
    var chrome = [];    // fixed UI (nav bar) - drawn above the camera layer

    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    var chatW = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var x0 = cx - chatW / 2;

    var qText = 'Can you build ANY app and run it natively on my iPhone?';
    var aY = isP ? F.H * 0.30 : F.H * 0.36;   // thread reply anchor / dots
    var qY = isP ? F.H * 0.115 : F.H * 0.14;  // user bubble anchor
    var barY = isP ? F.H * 0.885 : F.H * 0.875; // input bar top
    var barH = isP ? 96 : 88;

    // The thread scrolls up as the card arrives from below (real chat) and
    // dims slightly as it passes under the fixed nav bar.
    var shiftP = smooth((frame - 136) / 26);
    var threadShift = (isP ? 170 : 120) * shiftP;
    var threadFade = 1 - 0.55 * shiftP;

    // ---- Camera: leans where the action is --------------------------------
    var tDots = smooth(frame / 12) * (1 - smooth((frame - 34) / 16));
    var tBar = smooth((frame - 62) / 16) * (1 - smooth((frame - 96) / 16));
    var tCard = smooth((frame - 132) / 18) * (1 - smooth((frame - 166) / 12));
    var camS = 1 + 0.07 * tDots + 0.11 * tBar + 0.045 * tCard;
    var camX = 0;
    var camY = -(aY - F.H / 2) * 0.30 * tDots
      - (barY - F.H / 2) * 0.40 * tBar
      + (aY + 200 - F.H / 2) * 0.16 * tCard;

    // ---- Greeting bubble (Fa) — big, centred, rises from the bottom -------
    var gIn = tw(48, 20, 0, 1, 'easeOut');
    var gW = chatW * (isP ? 0.80 : 0.62);
    var gH = isP ? 128 : 116;
    var gx = cx - gW / 2;
    var gY = (isP ? F.H * 0.335 : F.H * 0.36) - threadShift;
    if (gIn > 0.003) {
      var gRise = (barY - gY) * (1 - gIn);
      kids.push(faRRect(gW, gH, 28, T.card, {
        opacity: gIn * threadFade,
        border: { color: T.teal, width: 1.5 },
        offsetY: gRise,
        positioned: { left: gx, top: gY },
      }));
      kids.push(faText('HEY — I\'M FA.', {
        width: gW - 48,
        opacity: gIn * 0.95 * threadFade,
        offsetY: gRise,
        style: {
          fontSize: isP ? 30 : 28,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.teal,
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: gx + 24, top: gY + (isP ? 26 : 22) },
      }));
      kids.push(faText('ASK ME TO BUILD ANYTHING.', {
        width: gW - 48,
        opacity: gIn * 0.9 * threadFade,
        offsetY: gRise,
        style: {
          fontSize: isP ? 25 : 23,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: T.text,
          textAlign: 'center',
          letterSpacing: 1,
        },
        positioned: { left: gx + 24, top: gY + (isP ? 72 : 64) },
      }));
    }

    // ---- User bubble (right, violet) — launched from the input bar --------
    var sendT = clamp01((frame - 98) / 18);
    var qIn = backOut(sendT);
    if (qIn > 0.003) {
      var landY = qY - threadShift;             // target scrolls up too
      var flyY = (barY - 40) + (landY - (barY - 40)) * qIn;
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn * 0.35 * threadFade,
        blur: 24,
        positioned: { left: x0 + chatW * 0.22 - 10, top: flyY - 8 },
      }));
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn * threadFade,
        positioned: { left: x0 + chatW * 0.22, top: flyY },
      }));
      kids.push(faText(qText, {
        width: chatW * 0.78 - 56,
        opacity: qIn * threadFade,
        style: {
          fontSize: isP ? 27 : 28,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0,
        },
        positioned: { left: x0 + chatW * 0.22 + 28, top: flyY + 26 },
      }));
      var dIn = tw(120, 8, 0, 1, 'easeOut');
      kids.push(faText('DELIVERED · ON-DEVICE', {
        opacity: dIn * 0.5 * threadFade,
        style: {
          fontSize: isP ? 15 : 14,
          fontFamily: 'monospace',
          color: T.faint,
          letterSpacing: 2,
        },
        positioned: { left: x0 + chatW * 0.22 + 8, top: qY - threadShift + 126 },
      }));
    }

    // ---- Thinking dots (Fa is "typing") — the handoff dot lands here ------
    var dotsAlive = (frame >= 34 && frame < 56) || (frame >= 116 && frame < 134);
    var dotsIn = (frame < 56 ? tw(34, 8, 0, 1, 'easeOut')
      : tw(116, 8, 0, 1, 'easeOut')) * (frame < 56 ? 1 - tw(50, 6, 0, 1, 'easeIn') : 1 - tw(128, 6, 0, 1, 'easeIn'));
    if (dotsAlive && dotsIn > 0.01) {
      kids.push(faRRect(150, 64, 32, T.card, {
        opacity: dotsIn,
        border: { color: T.border, width: 1.5 },
        positioned: { left: x0, top: aY },
      }));
      for (var d = 0; d < 3; d++) {
        var bounce = Math.max(0, Math.sin(frame * 0.5 - d * 0.9)) * 5;
        kids.push({
          type: 'circle',
          size: 12,
          fill: T.teal,
          opacity: dotsIn * 0.85,
          positioned: { left: x0 + 30 + d * 34, top: aY + 26 - bounce },
        });
      }
    }

    // ---- Fa capabilities card (left, teal border) — slides up from below --
    var bullets = [
      { t: 'NATIVE DRAW ENGINE — FLUTTER @ 120 FPS.', c: 'violet' },
      { t: 'ZERO HTML WRAPPERS — PURE NATIVE VIEWS.', c: 'teal' },
      { t: 'SQLITE DATABASE — ALL DATA ON-DEVICE.', c: 'teal' },
      { t: 'FLAME3D — REAL 3D GAMES, NOT WEBGL.', c: 'violet' },
      { t: 'API KEYS LIVE IN YOUR KEYCHAIN. NEVER OURS.', c: 'teal' },
    ];
    var aIn = tw(130, 18, 0, 1, 'easeOut');
    var bGap = isP ? 62 : 58;
    var aH = 90 + bullets.length * bGap;

    if (aIn > 0.003) {
      var cardRise = (barY - aY) * (1 - aIn) * 0.9; // emerges from the bottom
      kids.push(faRRect(chatW, aH + 60, 30, T.card, {
        opacity: aIn * 0.4,
        blur: 36,
        offsetY: cardRise,
        positioned: { left: x0 - 18, top: aY - 18 },
      }));
      kids.push(faRRect(chatW, aH + 60, 30, T.card, {
        opacity: aIn,
        border: { color: T.teal, width: 1.5 },
        offsetY: cardRise,
        positioned: { left: x0, top: aY },
      }));

      kids.push(faLogoSvgNode(x0 + 52, aY + 56 + cardRise, 56, aIn));
      kids.push(faText('Fa — iOS AGENT', {
        opacity: aIn * 0.9,
        offsetY: cardRise,
        style: {
          fontSize: isP ? 22 : 21,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: T.teal,
          letterSpacing: 2,
        },
        positioned: { left: x0 + 96, top: aY + 34 },
      }));
      kids.push(faText('VERIFIED · RUNS ON-DEVICE', {
        opacity: aIn * 0.55,
        offsetY: cardRise,
        style: {
          fontSize: isP ? 17 : 16,
          fontFamily: 'monospace',
          color: T.dim,
          letterSpacing: 1.5,
        },
        positioned: { left: x0 + 96, top: aY + 66 },
      }));

      for (var bi = 0; bi < bullets.length; bi++) {
        var bIn = tw(142 + bi * 10, 10, 0, 1, 'easeOut');
        var by = aY + 120 + bi * bGap + cardRise;
        if (bIn > 0.01 && by + 40 < aY + aH + 40 + cardRise) {
          var bc = bullets[bi].c === 'violet' ? T.violet : T.teal;
          kids.push(faRRect(12, 12, 6, bc, {
            opacity: bIn,
            positioned: { left: x0 + 34, top: by + 10 },
          }));
          kids.push(faText(bullets[bi].t, {
            opacity: bIn * 0.92,
            style: {
              fontSize: isP ? 23 : 22,
              fontFamily: 'monospace',
              fontWeight: '600',
              color: T.text,
              letterSpacing: 0.5,
            },
            positioned: { left: x0 + 62, top: by },
          }));
        }
      }
    }

    // ---- Input bar (like the app: "Ask anything…" + send) ------------------
    var barIn = tw(46, 10, 0, 1, 'easeOut');
    var typedN = frame < 96 ? Math.min(qText.length,
      Math.floor((frame - 62) / 1.6)) : 0;
    var typing = frame >= 62 && frame < 96;
    var cursor = typing && Math.floor(frame / 5) % 2 === 0 ? '_' : '';
    var shown = typing ? qText.slice(0, typedN) + cursor : '';

    var press = frame >= 96 && frame < 104
      ? Math.sin(clamp01((frame - 96) / 8) * Math.PI) : 0;

    var barX = x0;
    var sendD = isP ? 72 : 64;
    var sendX = x0 + chatW - sendD - 14;

    kids.push(faRRect(chatW, barH, barH / 2, T.card, {
      opacity: barIn,
      border: { color: press > 0 ? T.violet : T.border,
        width: press > 0 ? 2 : 1.5 },
      scale: press > 0 ? 1 - 0.012 * press : 1,
      positioned: { left: barX, top: barY },
    }));
    kids.push(faLogoSvgNode(barX + 44, barY + barH / 2, 40, barIn));
    var tFs = isP ? 26 : 25;
    var tMaxW = chatW - sendD - 130;
    var tW = shown.length * tFs * 0.60;
    var tX = barX + 78 - Math.max(0, tW - tMaxW);
    if (shown.length > 0) {
      kids.push(faText(shown, {
        opacity: barIn,
        style: {
          fontSize: tFs,
          fontFamily: 'monospace',
          fontWeight: '500',
          color: T.text,
          letterSpacing: 0,
        },
        positioned: { left: tX, top: barY + barH / 2 - tFs * 0.60 },
      }));
    } else {
      kids.push(faText('Ask anything…', {
        opacity: barIn * 0.45,
        style: {
          fontSize: tFs,
          fontFamily: 'monospace',
          fontWeight: '500',
          color: T.dim,
          letterSpacing: 0,
        },
        positioned: { left: barX + 78, top: barY + barH / 2 - tFs * 0.60 },
      }));
    }

    // send button: violet disc + up-arrow triangle, presses in
    var sendS = 1 - 0.14 * press;
    kids.push({
      type: 'container',
      width: sendD,
      height: sendD,
      radius: sendD / 2,
      opacity: barIn,
      scale: sendS,
      gradient: { begin: 'topLeft', end: 'bottomRight',
        colors: [T.violet, T.violetDeep], stops: [0.0, 1.0] },
      shadows: [{ color: T.violet, opacity: 0.35 + 0.25 * press, blur: 18,
        offset: { x: 0, y: 4 } }],
      positioned: { left: sendX, top: barY + barH / 2 - sendD / 2 },
    });
    var acx = sendX + sendD / 2, acy = barY + barH / 2;
    var apts = [{ x: acx, y: acy - 13 }, { x: acx + 10, y: acy + 5 },
      { x: acx - 10, y: acy + 5 }];
    kids.push(polylineScreen(apts, 7, 1, '#FFFFFF', barIn));
    if (frame >= 98 && frame < 112) {
      var fr = (frame - 98) / 14;
      kids.push({
        type: 'circle',
        size: sendD + 60 * fr,
        fill: '#00000000',
        border: { color: T.violet, width: 3 },
        opacity: (1 - fr) * 0.7,
        positioned: { left: acx - (sendD + 60 * fr) / 2,
          top: acy - (sendD + 60 * fr) / 2 },
      });
    }

    // ---- Bottom reassurance line -------------------------------------------
    var rIn = tw(168, 14, 0, 1, 'easeOut');
    kids.push(faText('IF IT DRAWS IN SWIFTUI — FA CAN BUILD IT.', {
      width: F.W,
      opacity: rIn * 0.8,
      style: {
        fontSize: isP ? 22 : 21,
        fontFamily: 'monospace',
        color: T.dim,
        textAlign: 'center',
        letterSpacing: 2.5,
      },
      positioned: { left: 0, top: isP ? F.H * 0.795 : F.H * 0.79 },
    }));

    // ---- Handoff arrival from 03_connect ------------------------------------
    // The teal dot that flew out of 03's CONNECTED pill lands at the centre of
    // the typing dots (KEEP IN SYNC with 03_connect: x0 + 64, aY + 32) and
    // pulses until the typing bubble materialises around it at frame 34.
    if (frame < 34) {
      var hx = x0 + 64;
      var hy = aY + 32;
      var pulse = 0.5 + 0.5 * Math.sin(frame * 0.42);
      kids.push({ type: 'circle', size: 40 + 14 * pulse, fill: T.teal,
        opacity: 0.16 + 0.10 * pulse, blur: 16,
        positioned: { left: hx - (40 + 14 * pulse) / 2, top: hy - (40 + 14 * pulse) / 2 } });
      kids.push({ type: 'circle', size: 16, fill: T.tealBright, opacity: 0.95,
        positioned: { left: hx - 8, top: hy - 8 } });
      var rip = clamp01(frame / 12);
      if (rip > 0 && rip < 1) {
        kids.push({ type: 'circle', size: 16 + 70 * rip, fill: T.teal,
          opacity: (1 - rip) * 0.35,
          positioned: { left: hx - (16 + 70 * rip) / 2, top: hy - (16 + 70 * rip) / 2 } });
      }
    }

    // ---- Fixed chrome: nav bar (never moves with the camera) ----------------
    var navIn = tw(2, 10, 0, 1, 'easeOut');
    var navY = isP ? F.H * 0.035 : F.H * 0.045;
    chrome.push(faRRect(chatW + 60, isP ? 108 : 96, 30, T.bg, {
      opacity: navIn * 0.96,
      positioned: { left: x0 - 30, top: navY - 22 },
    }));
    chrome.push(faLogoSvgNode(x0 + 30, navY + 26, 44, navIn));
    chrome.push(faText('Fa', {
      opacity: navIn,
      style: {
        fontSize: isP ? 34 : 31,
        fontWeight: '800',
        color: T.text,
        letterSpacing: 0.5,
      },
      positioned: { left: x0 + 64, top: navY },
    }));
    chrome.push(faText('ONLINE · ON-DEVICE', {
      opacity: navIn * 0.75,
      style: {
        fontSize: isP ? 16 : 15,
        fontFamily: 'monospace',
        color: T.teal,
        letterSpacing: 2,
      },
      positioned: { left: x0 + 118, top: navY + 12 },
    }));
    chrome.push(faText('SECURE // E2E', {
      opacity: navIn * 0.5,
      style: {
        fontSize: isP ? 15 : 14,
        fontFamily: 'monospace',
        color: T.faint,
        letterSpacing: 2,
      },
      positioned: { left: x0 + chatW - 210, top: navY + 13 },
    }));

    // ---- Exit dip: dissolve to the shared bg tone (leads into 05_build) -----
    var exKids = [];
    var ex = clamp01((frame - 180) / 12);
    if (ex > 0.003) {
      var exa = Math.round(ex * 255).toString(16).padStart(2, '0');
      var exb = T.bg.replace('#', '').toUpperCase();
      exKids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + exa + exb });
    }

    return { type: 'stack', fit: 'expand', children: [
      faRRect(F.W, F.H, 0, T.bg),               // fixed bg — no black band
      { type: 'stack', fit: 'expand', scale: camS,
        offsetX: camX, offsetY: camY, children: kids },
      { type: 'stack', fit: 'expand', children: chrome },
      { type: 'stack', fit: 'expand', children: exKids },
    ] };
  },
};
