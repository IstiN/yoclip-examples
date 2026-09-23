// 04 — Ask — the real Fa app chat, on a phone
// (192 frames, 4 bars)
//
// Ordered choreography, one thing at a time:
//   1. Fa's greeting card materialises in the CENTRE (the handoff dot from
//      03 lands right into it) and holds.
//   2. The input bar rises from the bottom; the camera leans to it and the
//      user types the question.
//   3. Send button press -> the bubble launches out of the bar and lands
//      UNDER the greeting.
//   4. The capabilities card rises from the bar area, pushing both earlier
//      messages up, and settles just above the input bar; rows stagger in.
//
// Background + nav bar are fixed chrome outside the camera wrapper, so
// camera moves never expose a black band.
//
// KEEP IN SYNC with 03_connect: the teal dot lands at the centre of the
// greeting card (cx, gC) — 03 computes the same point.

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
    var fixed = [];     // fixed UI (input bar + keyboard) — crisp, no zoom
    var chrome = [];    // fixed UI (nav bar) - drawn above the camera layer

    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var cx = F.cx;

    var chatW = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var x0 = cx - chatW / 2;

    var qText = 'Can you build ANY app and run it natively on my iPhone?';

    // Layout slots
    var gC = isP ? F.H * 0.42 : F.H * 0.44;   // greeting centre ("в центре")
    var gW = chatW * (isP ? 0.80 : 0.62);
    var gH = isP ? 128 : 116;
    var gx = cx - gW / 2;
    var qSlot = gC + gH / 2 + 34;             // user bubble lands under it
    var barY = isP ? F.H * 0.885 : F.H * 0.875; // input bar top
    var barH = isP ? 96 : 88;
    var kbH = Math.round(Math.min(F.W * 0.52, F.H * 0.30)); // keyboard mock
    var kbBar = smooth((frame - 56) / 14) * (1 - smooth((frame - 108) / 14));
    var barYNow = barY - (kbH + 8) * kbBar; // bar rides up on the keyboard

    var bullets = [
      { t: 'NATIVE DRAW ENGINE — FLUTTER @ 120 FPS.', c: 'violet' },
      { t: 'ZERO HTML WRAPPERS — PURE NATIVE VIEWS.', c: 'teal' },
      { t: 'SQLITE DATABASE — ALL DATA ON-DEVICE.', c: 'teal' },
      { t: 'FLAME3D — REAL 3D GAMES, NOT WEBGL.', c: 'violet' },
      { t: 'API KEYS LIVE IN YOUR KEYCHAIN. NEVER OURS.', c: 'teal' },
    ];
    var bGap = isP ? 62 : 58;
    var cardH = 90 + bullets.length * bGap + 60;
    var cardTop = barY - 36 - cardH;          // just above the input bar

    // The card pushes the two earlier messages up as it arrives.
    var push = (isP ? 120 : 262) * smooth((frame - 128) / 22);

    // ---- Camera: greeting -> input bar -> follow the send -> card ---------
    var tGreet = smooth(frame / 12) * (1 - smooth((frame - 36) / 16));
    var tBar = smooth((frame - 58) / 14) * (1 - smooth((frame - 96) / 14));
    var tCard = smooth((frame - 132) / 18) * (1 - smooth((frame - 170) / 10));
    var camS = 1 + 0.08 * tGreet + 0.035 * tBar + 0.04 * tCard;
    var camX = 0;
    var camY = -(gC - F.H / 2) * 0.34 * tGreet
      - (barY - (kbH + 8) - F.H / 2) * 0.30 * tBar
      + (cardTop + 200 - F.H / 2) * 0.10 * tCard;

    // ---- 1. Greeting card in the centre ------------------------------------
    var gIn = tw(32, 20, 0, 1, 'easeOut');
    var gTop = gC - gH / 2 - push; // the card pushes the greeting up
    if (gIn > 0.003) {
      kids.push({
        type: 'container',
        width: gW,
        height: gH,
        radius: 28,
        color: T.card,
        opacity: gIn,
        border: { color: T.teal, width: 1.5 },
        shadows: [{ color: T.teal, opacity: 0.18, blur: 34,
          offset: { x: 0, y: 10 } }],
        positioned: { left: cx - gW / 2, top: gTop },
      });
      kids.push(faText('HEY — I\'M FA.', {
        width: gW - 48,
        opacity: gIn * 0.95,
        style: {
          fontSize: isP ? 30 : 28,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.teal,
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: cx - (gW - 48) / 2, top: gTop + (isP ? 26 : 22) },
      }));
      kids.push(faText('ASK ME TO BUILD ANYTHING.', {
        width: gW - 48,
        opacity: gIn * 0.9,
        style: {
          fontSize: isP ? 25 : 23,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: T.text,
          textAlign: 'center',
          letterSpacing: 1,
        },
        positioned: { left: cx - (gW - 48) / 2, top: gTop + (isP ? 72 : 64) },
      }));
    }

    // ---- 3. User bubble — launches out of the bar, lands under greeting ----
    var sendT = clamp01((frame - 108) / 18);
    var qIn = backOut(sendT);
    if (qIn > 0.003) {
      var landY = qSlot - push;
      var flyFrom = barY - (kbH + 8) - 40; // the raised input bar
      var flyY = flyFrom + (landY - flyFrom) * qIn;
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn * 0.35,
        blur: 24,
        positioned: { left: x0 + chatW * 0.22 - 10, top: flyY - 8 },
      }));
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn,
        positioned: { left: x0 + chatW * 0.22, top: flyY },
      }));
      kids.push(faText(qText, {
        width: chatW * 0.78 - 56,
        opacity: qIn,
        style: {
          fontSize: isP ? 27 : 28,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0,
        },
        positioned: { left: x0 + chatW * 0.22 + 28, top: flyY + 26 },
      }));
      var dIn = tw(132, 8, 0, 1, 'easeOut');
      kids.push(faText('DELIVERED · ON-DEVICE', {
        opacity: dIn * 0.5,
        style: {
          fontSize: isP ? 15 : 14,
          fontFamily: 'monospace',
          color: T.faint,
          letterSpacing: 2,
        },
        positioned: { left: x0 + chatW * 0.22 + 8, top: qSlot - push + 126 },
      }));
    }

    // ---- 4. Fa capabilities card — rises, pushing the thread up ------------
    var aIn = tw(130, 20, 0, 1, 'easeOut');
    if (aIn > 0.003) {
      var cardRise = (barY - cardTop) * (1 - aIn); // emerges from the bar
      kids.push(faRRect(chatW, cardH, 30, T.card, {
        opacity: aIn * 0.4,
        blur: 36,
        offsetY: cardRise,
        positioned: { left: x0 - 18, top: cardTop - 18 },
      }));
      kids.push(faRRect(chatW, cardH, 30, T.card, {
        opacity: aIn,
        border: { color: T.teal, width: 1.5 },
        offsetY: cardRise,
        positioned: { left: x0, top: cardTop },
      }));

      kids.push(faLogoSvgNode(x0 + 52, cardTop + 56 + cardRise, 56, aIn));
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
        positioned: { left: x0 + 96, top: cardTop + 34 },
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
        positioned: { left: x0 + 96, top: cardTop + 66 },
      }));

      for (var bi = 0; bi < bullets.length; bi++) {
        var bIn = tw(146 + bi * 7, 9, 0, 1, 'easeOut');
        var by = cardTop + 120 + bi * bGap + cardRise;
        if (bIn > 0.01) {
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

    // ---- 2. Input bar (like the app: "Ask anything…" + send) ---------------
    var barIn = tw(56, 12, 0, 1, 'easeOut');
    var typedN = frame < 106 ? Math.min(qText.length,
      Math.floor((frame - 58) / 0.85)) : 0;
    var typing = frame >= 58 && frame < 106;
    var cursor = typing && Math.floor(frame / 5) % 2 === 0 ? '_' : '';
    var shown = typing ? qText.slice(0, typedN) + cursor : '';

    var press = frame >= 106 && frame < 114
      ? Math.sin(clamp01((frame - 106) / 8) * Math.PI) : 0;

    var barX = x0;
    var sendD = isP ? 72 : 64;
    var sendX = x0 + chatW - sendD - 14;

    var tFs = isP ? 34 : 32; // big, readable input — wraps honestly
    var tMaxW = chatW - sendD - 130;
    // Input grows to TWO lines when the sentence no longer fits one
    // (real iOS behaviour). The bar keeps its bottom edge and grows up.
    var cpl = Math.max(8, Math.floor(tMaxW / (tFs * 0.60)));
    var twoLine = shown.length > cpl;
    var barTop = barYNow;
    var barHNow = barH;
    if (twoLine) {
      barHNow = Math.round(tFs * 2 + 52);
      barTop = barYNow - (barHNow - barH); // bottom edge stays put
    }
    var barCY = barTop + barHNow / 2;
    fixed.push(faRRect(chatW, barHNow, barH / 2, T.card, {
      opacity: barIn,
      border: { color: press > 0 ? T.violet : T.border,
        width: press > 0 ? 2 : 1.5 },
      scale: press > 0 ? 1 - 0.012 * press : 1,
      positioned: { left: barX, top: barTop },
    }));
    fixed.push(faLogoSvgNode(barX + 44, barCY, 40, barIn));
    if (shown.length > 0) {
      var txStyle = {
        fontSize: tFs,
        fontFamily: 'monospace',
        fontWeight: '500',
        color: T.text,
        letterSpacing: 0,
      };
      if (!twoLine) {
        var tW = shown.length * tFs * 0.60;
        var tX = barX + 78 - Math.max(0, tW - tMaxW);
        fixed.push(faText(shown, { opacity: barIn, style: txStyle,
          positioned: { left: tX, top: barCY - tFs * 0.60 } }));
      } else {
        txStyle.textAlign = 'left';
        var cut = shown.lastIndexOf(' ', cpl); // wrap at a word boundary
        if (cut < 0) cut = cpl;
        var l1 = shown.slice(0, cut);
        var l2 = shown.slice(cut > 0 ? cut + 1 : cpl);
        fixed.push(faText(l1, { opacity: barIn, style: txStyle,
          positioned: { left: barX + 78,
            top: barTop + 18 } }));
        fixed.push(faText(l2, { opacity: barIn, style: txStyle,
          positioned: { left: barX + 78,
            top: barTop + 18 + tFs * 1.5 } }));
      }
    } else {
      fixed.push(faText('Ask anything…', {
        opacity: barIn * 0.45,
        style: {
          fontSize: tFs,
          fontFamily: 'monospace',
          fontWeight: '500',
          color: T.dim,
          letterSpacing: 0,
        },
        positioned: { left: barX + 78, top: barCY - tFs * 0.60 },
      }));
    }

    // send button: violet disc + up-arrow triangle, presses in
    var sendS = 1 - 0.14 * press;
    fixed.push({
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
      positioned: { left: sendX, top: barCY - sendD / 2 },
    });
    var acx = sendX + sendD / 2, acy = barCY;
    var apts = [{ x: acx, y: acy - 13 }, { x: acx + 10, y: acy + 5 },
      { x: acx - 10, y: acy + 5 }];
    fixed.push(polylineScreen(apts, 7, 1, '#FFFFFF', barIn));
    if (frame >= 108 && frame < 122) {
      var fr = (frame - 108) / 14;
      fixed.push({
        type: 'circle',
        size: sendD + 60 * fr,
        fill: '#00000000',
        border: { color: T.violet, width: 3 },
        opacity: (1 - fr) * 0.7,
        positioned: { left: acx - (sendD + 60 * fr) / 2,
          top: acy - (sendD + 60 * fr) / 2 },
      });
    }

    // ---- Mobile keyboard mock (rises under the bar, keys light up) --------
    if (frame >= 54 && frame < 124) {
      var kbAmt = smooth((frame - 54) / 14) * (1 - smooth((frame - 108) / 14));
      var kbY = F.H - kbH + (1 - kbAmt) * (kbH + 40);
      var kbNodes = faKeyboard({
        x: 0, y: kbY, w: F.W, h: kbH, opacity: 1,
        pressed: qText.slice(0, typedN),
      });
      for (var kni = 0; kni < kbNodes.length; kni++) fixed.push(kbNodes[kni]);
    }

    // ---- Handoff arrival from 03_connect ------------------------------------
    // The teal dot lands at the centre of the greeting card
    // (KEEP IN SYNC with 03_connect: cx, gC) and pulses until the greeting
    // materialises around it.
    if (frame < 32) {
      var pulse = 0.5 + 0.5 * Math.sin(frame * 0.42);
      kids.push({ type: 'circle', size: 40 + 14 * pulse, fill: T.teal,
        opacity: 0.16 + 0.10 * pulse, blur: 16,
        positioned: { left: cx - (40 + 14 * pulse) / 2, top: gC - (40 + 14 * pulse) / 2 } });
      kids.push({ type: 'circle', size: 16, fill: T.tealBright, opacity: 0.95,
        positioned: { left: cx - 8, top: gC - 8 } });
      var rip = clamp01(frame / 12);
      if (rip > 0 && rip < 1) {
        kids.push({ type: 'circle', size: 16 + 70 * rip, fill: T.teal,
          opacity: (1 - rip) * 0.35,
          positioned: { left: cx - (16 + 70 * rip) / 2, top: gC - (16 + 70 * rip) / 2 } });
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
      { type: 'stack', fit: 'expand', children: fixed },
      { type: 'stack', fit: 'expand', children: chrome },
      { type: 'stack', fit: 'expand', children: exKids },
    ] };
  },
};
