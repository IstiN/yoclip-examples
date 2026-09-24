// 04 — Ask — the real Fa app chat, on a phone
// (444 frames — the ask chat breathes: x2 pacing + read tail)
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
  duration: 444,
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
    var gC = isP ? F.H * 0.46 : F.H * 0.47;   // greeting centre ("в центре")
    var gW = chatW * (isP ? 0.80 : 0.62);
    var gH = isP ? 182 : 162;
    var gx = cx - gW / 2;
    var qSlot = gC + gH / 2 + 34;             // user bubble lands under it
    var barY = isP ? F.H * 0.885 : F.H * 0.875; // input bar top
    var barH = isP ? 96 : 88;
    var kbH = Math.round(Math.min(F.W * 0.52, F.H * 0.30)); // keyboard mock
    var tFs = isP ? 40 : 36;  // input text size (shared with the bubble morph)
    var barH2 = Math.round(tFs * 2 + 64);       // the grown 2-line bar
    var bFs2 = isP ? 30 : 28;                   // landed bubble text size
    var barX = x0;
    var sendD = isP ? 72 : 64;
    var sendX = x0 + chatW - sendD - 14;
    var barLift = barY + barH + 12 + kbH - F.H; // park the bar on the keys
    var kbBar = smooth((frame - 112) / 28) * (1 - smooth((frame - 248) / 24));
    var barYNow = barY - barLift * kbBar; // bar rides up onto the keyboard

    var bullets = [
      { t: 'NATIVE DRAW ENGINE — FLUTTER @ 120 FPS.', c: 'violet' },
      { t: 'ZERO HTML WRAPPERS — PURE NATIVE VIEWS.', c: 'teal' },
      { t: 'SQLITE DATABASE — ALL DATA ON-DEVICE.', c: 'teal' },
      { t: 'FLAME3D — REAL 3D GAMES, NOT WEBGL.', c: 'violet' },
      { t: 'API KEYS LIVE IN YOUR KEYCHAIN. NEVER OURS.', c: 'teal' },
    ];
    var bGap = isP ? 58 : 54;
    var cardH = 84 + bullets.length * bGap + 56;
    var cardTop = barY - 28 - cardH;          // just above the input bar
    var cardDrop = ((F.H - 76) - (barY - 28))
      * smooth((frame - 300) / 24); // settles down as the bar dissolves

    // The card pushes the two earlier messages up as it arrives.
    var push = (isP ? 36 : 262) * smooth((frame - 240) / 56);
    var threadLift = Math.min(kbH + 8, F.H * 0.22) * kbBar; // scroll, capped

    // ---- Camera: greeting -> input bar -> follow the send -> card ---------
    var tCard = smooth((frame - 264) / 36) * (1 - smooth((frame - 420) / 24));
    var camS = 1 + 0.04 * tCard;   // one camera beat: the card rise
    var camX = 0;
    var camY = (cardTop + 200 - F.H / 2) * 0.10 * tCard;

    // ---- 1. Greeting card in the centre ------------------------------------
    var gIn = tw(64, 40, 0, 1, 'easeOut');
    var gTop = gC - gH / 2 - push - threadLift; // keyboard lift + card push
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
      // prompt mark ">_ Fa" (terminal style), Fa moved here from the input
      var gx = cx - gW / 2 + 44;
      kids.push(faText('>_', {
        opacity: gIn,
        style: {
          fontSize: isP ? 42 : 38,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.teal,
          textAlign: 'left',
          letterSpacing: 2,
        },
        positioned: { left: gx, top: gTop + (isP ? 24 : 20) },
      }));
      kids.push(faText('Fa', {
        opacity: gIn,
        style: {
          fontSize: isP ? 42 : 38,
          fontFamily: 'sans-serif',
          fontWeight: '800',
          color: T.violet,
          textAlign: 'left',
          letterSpacing: 0,
        },
        positioned: { left: gx + (isP ? 64 : 58), top: gTop + (isP ? 24 : 20) },
      }));
      kids.push(faText('HEY — I\'M FA.', {
        width: gW - 88,
        opacity: gIn * 0.95,
        style: {
          fontSize: isP ? 29 : 27,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.teal,
          textAlign: 'left',
          letterSpacing: 2,
        },
        positioned: { left: gx, top: gTop + (isP ? 82 : 72) },
      }));
      kids.push(faText('ASK ME TO BUILD ANYTHING.', {
        width: gW - 88,
        opacity: gIn * 0.9,
        style: {
          fontSize: isP ? 24 : 22,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: T.text,
          textAlign: 'left',
          letterSpacing: 1,
        },
        positioned: { left: gx, top: gTop + (isP ? 126 : 112) },
      }));
    }

    // ---- 3. User bubble — launches out of the bar, lands under greeting ----
    var sendT = clamp01((frame - 214) / 34);
    var qIn = backOut(sendT);
    // world-landed bubble takes over once the morph settles
    var landIn = tw(248, 12, 0, 1, 'easeOut');
    if (landIn > 0.003) {
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: landIn * 0.35,
        blur: 24,
        positioned: { left: x0 + chatW * 0.22 - 10,
          top: qSlot - push - threadLift - 8 },
      }));
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: landIn,
        positioned: { left: x0 + chatW * 0.22, top: qSlot - push - threadLift },
      }));
      kids.push(faText(qText, {
        width: chatW * 0.78 - 56,
        opacity: landIn,
        style: {
          fontSize: bFs2,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0,
          textAlign: 'left',
        },
        positioned: { left: x0 + chatW * 0.22 + 28,
          top: qSlot - push - threadLift + 26 },
      }));
    }
    if (qIn > 0.003 && landIn < 0.997) {
      var landY = qSlot - push - threadLift;
      // The message IS the input field: start from the raised bar rect
      // and morph position+size into the chat bubble.
      var fromX = barX, fromW = chatW;
      var fromY = barY - (kbH + 8) - (barH2 - barH);
      var fromH = barH2;
      var toX = x0 + chatW * 0.22, toW = chatW * 0.78;
      var toH = 118;
      var mx = fromX + (toX - fromX) * qIn;
      var my = fromY + (landY - fromY) * qIn;
      var mw = fromW + (toW - fromW) * qIn;
      var mh = fromH + (toH - fromH) * qIn;
      var mr = fromH / 2 + (26 - fromH / 2) * qIn;
      fixed.push(faRRect(mw, mh, mr, T.violetDeep, {
        opacity: qIn * 0.35,
        blur: 24,
        positioned: { left: mx - 10, top: my - 8 },
      }));
      fixed.push(faRRect(mw, mh, mr, T.violetDeep, {
        opacity: qIn,
        positioned: { left: mx, top: my },
      }));
      fixed.push(faText(qText, {
        width: mw - 56,
        opacity: qIn,
        style: {
          fontSize: tFs + (bFs2 - tFs) * qIn,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0,
          textAlign: 'left',
        },
        positioned: {
          left: barX + 104 + (toX + 28 - barX - 104) * qIn,
          top: fromY + 24 + (26 - 24) * qIn + (my - fromY),
        },
      }));
    }
    var dIn = tw(264, 16, 0, 1, 'easeOut');
    if (dIn > 0.01) {
      kids.push(faText('DELIVERED · ON-DEVICE', {
        opacity: dIn * 0.5,
        style: {
          fontSize: isP ? 15 : 14,
          fontFamily: 'monospace',
          color: T.faint,
          letterSpacing: 2,
        },
        positioned: { left: x0 + chatW * 0.22 + 28,
          top: qSlot - push - threadLift + 142 },
      }));
    }

    // ---- 4. Fa capabilities card — rises, pushing the thread up ------------
    var aIn = tw(260, 40, 0, 1, 'easeOut');
    if (aIn > 0.003) {
      var cardRise = (barY - cardTop) * (1 - aIn) + cardDrop;
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
        var bIn = tw(292 + bi * 14, 18, 0, 1, 'easeOut');
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
    var barIn = tw(112, 24, 0, 1, 'easeOut')
      * (1 - smooth((frame - 300) / 24)); // gone once the card is shown
    var typedN = frame < 212 ? Math.min(qText.length,
      Math.floor((frame - 116) / 1.7)) : 0;
    var typing = frame >= 116 && frame < 212;
    var cursor = typing && Math.floor(frame / 5) % 2 === 0 ? '_' : '';
    var shown = typing ? qText.slice(0, typedN) + cursor : '';

    var press = frame >= 212 && frame < 228
      ? Math.sin(clamp01((frame - 212) / 16) * Math.PI) : 0;
    var pressD = 1 - 0.22 * press;

    var tMaxW = chatW - sendD - 130;
    // Input grows to TWO lines when the sentence no longer fits one
    // (real iOS behaviour). The bar keeps its bottom edge and grows up.
    var cpl = Math.max(8, Math.floor(tMaxW / (tFs * 0.60)));
    var twoLine = shown.length > cpl;
    var barTop = barYNow;
    var barHNow = twoLine ? barH2 : barH;
    if (twoLine) barTop = barYNow - (barH2 - barH); // bottom edge stays put
    var barCY = barTop + barHNow / 2;
    fixed.push(faRRect(chatW, barHNow, barH / 2, T.card, {
      opacity: barIn,
      border: { color: press > 0 ? T.violet : T.border,
        width: press > 0 ? 2 : 1.5 },
      scale: press > 0 ? 1 - 0.02 * press : 1,
      positioned: { left: barX, top: barTop },
    }));
    // "+" attachment button (iOS style) instead of the Fa logo
    fixed.push(faRRect(56, 56, 28, T.dim, {
      opacity: barIn * 0.35,
      positioned: { left: barX + 30, top: barCY - 28 },
    }));
    fixed.push(faRRect(26, 5, 2.5, T.text, {
      opacity: barIn * 0.8,
      positioned: { left: barX + 45, top: barCY - 2.5 },
    }));
    fixed.push(faRRect(5, 26, 2.5, T.text, {
      opacity: barIn * 0.8,
      positioned: { left: barX + 55.5, top: barCY - 13 },
    }));
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
        var tX = barX + 106 - Math.max(0, tW - tMaxW);
        txStyle.textAlign = 'left';
        fixed.push(faText(shown, { opacity: barIn, style: txStyle,
          width: tMaxW,
          positioned: { left: tX, top: barCY - tFs * 0.60 } }));
      } else {
        txStyle.textAlign = 'left';
        var cut = shown.lastIndexOf(' ', cpl); // wrap at a word boundary
        if (cut < 0) cut = cpl;
        var l1 = shown.slice(0, cut);
        var l2 = shown.slice(cut > 0 ? cut + 1 : cpl);
        fixed.push(faText(l1, { opacity: barIn, style: txStyle,
          positioned: { left: barX + 104,
            top: barTop + 24 } }));
        fixed.push(faText(l2, { opacity: barIn, style: txStyle,
          positioned: { left: barX + 104,
            top: barTop + 24 + tFs * 1.55 } }));
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
          textAlign: 'left',
        },
        width: tMaxW,
        positioned: { left: barX + 104, top: barCY - tFs * 0.60 },
      }));
    }

    // send button: violet disc + up-arrow triangle, presses in
    var sendS = pressD;
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
    if (frame >= 212 && frame < 244) {
      var fr = (frame - 212) / 18;
      fixed.push({
        type: 'circle',
        size: sendD + 90 * fr,
        fill: '#00000000',
        border: { color: T.violet, width: 3 },
        opacity: (1 - fr) * 0.9,
        positioned: { left: acx - (sendD + 60 * fr) / 2,
          top: acy - (sendD + 90 * fr) / 2 },
      });
    }

    // ---- Mobile keyboard mock (rises under the bar, keys light up) --------
    if (frame >= 108 && frame < 280) {
      var kbAmt = smooth((frame - 108) / 28) * (1 - smooth((frame - 248) / 24));
      var kbY = F.H - kbH + (1 - kbAmt) * (kbH + 40);
      var kbNodes = faKeyboard({
        x: 0, y: kbY, w: F.W, h: kbH, opacity: 1,
        pressed: qText.slice(0, typedN),
        frame: frame,
        pressedAt: typedN > 0 ? 116 + (typedN - 1) * 1.7 : 0,
      });
      for (var kni = 0; kni < kbNodes.length; kni++) fixed.push(kbNodes[kni]);
    }

    // ---- Handoff arrival from 03_connect ------------------------------------
    // The teal dot lands at the centre of the greeting card
    // (KEEP IN SYNC with 03_connect: cx, gC) and pulses until the greeting
    // materialises around it.
    if (frame < 64) {
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
    var ex = clamp01((frame - 420) / 24);
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
