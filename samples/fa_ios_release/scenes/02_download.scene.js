// 02 — Download — App Store card + QR → fa1.dev (192 frames, 4 bars)
//
// Portrait: App Store card top, QR card below.
// Landscape: App Store card left, QR card right.
// A scan line sweeps the QR on the last bar.

scene = {
  id: '02_download',
  duration: 192,
  from: 170,
  timeline: {
    label: 'Download',
    color: '#2EBD9E',
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

    // No full-frame background — broll_02_qr_scan paints it underneath.

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Section title
    var titleIn = tw(4, 12, 0, 1, 'easeOutExpo');
    kids.push(faText('GET FA. ANYWHERE YOU ARE.', {
      width: F.W,
      opacity: clamp01(titleIn * 1.2),
      offsetY: 18 * (1 - titleIn),
      style: {
        fontSize: isP ? Math.round(m * 0.058) : Math.round(m * 0.040),
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
      positioned: { left: 0, top: isP ? F.H * 0.065 : F.H * 0.075 },
    }));

    // ---- App Store card --------------------------------------------------
    var cardIn = tw(10, 16, 0, 1, 'easeOutCubic');
    var cardW = isP ? F.W * 0.88 : F.W * 0.40;
    var cardH = isP ? F.H * 0.34 : F.H * 0.62;
    var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.055;
    var cardY = isP ? F.H * 0.145 : F.H * 0.22;

    if (cardIn > 0.003) {
      kids.push(faRRect(cardW, cardH, 30, T.card, {
        opacity: cardIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 24 * (1 - cardIn),
        positioned: { left: cardX, top: cardY },
      }));

      var iconS = isP ? cardW * 0.20 : cardH * 0.30;
      var iconX = cardX + (isP ? 34 : 40);
      var iconY = cardY + (isP ? 34 : 40);

      // App icon: branded squircle with Fa mark (static logo SVG node)
      kids.push(faRRect(iconS, iconS, iconS * 0.24, T.surface2, {
        opacity: cardIn,
        border: { color: T.violet, width: 2 },
        positioned: { left: iconX, top: iconY },
      }));
      var markH = iconS * 0.62;
      var markNode = faLogoSvgNode(iconX + iconS / 2, iconY + iconS / 2, markH, cardIn);
      kids.push(markNode);

      // Title block
      var tx = iconX + iconS + 26;
      kids.push(faText('Fa — AI Agent', {
        opacity: cardIn,
        style: {
          fontSize: isP ? 40 : 34,
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
          letterSpacing: 0.5,
        },
        positioned: { left: tx, top: iconY + (isP ? 6 : 2) },
      }));
      kids.push(faText('Productivity · 9+ · Uladzimir Klyshevich', {
        opacity: cardIn * 0.75,
        style: {
          fontSize: isP ? 21 : 18,
          fontFamily: 'monospace',
          color: T.dim,
        },
        positioned: { left: tx, top: iconY + (isP ? 58 : 48) },
      }));

      // Price + TestFlight pills
      var pillY = iconY + iconS + (isP ? 26 : 24);
      kids.push(faRRect(190, 44, 22, T.violetDeep, {
        opacity: 0.95 * cardIn,
        positioned: { left: tx, top: pillY },
      }));
      kids.push(faText('USD 11.99', {
        opacity: cardIn,
        style: {
          fontSize: 22, fontFamily: 'monospace', fontWeight: '800',
          color: '#FFFFFF', letterSpacing: 1,
        },
        positioned: { left: tx + 34, top: pillY + 10 },
      }));
      kids.push(faRRect(330, 44, 22, T.teal, {
        opacity: 0.18 * cardIn,
        border: { color: T.teal, width: 1.5 },
        positioned: { left: tx + 206, top: pillY },
      }));
      kids.push(faText('TESTFLIGHT 1.0.0 — FREE BETA', {
        opacity: cardIn,
        style: {
          fontSize: 19, fontFamily: 'monospace', fontWeight: '700',
          color: T.teal, letterSpacing: 1,
        },
        positioned: { left: tx + 226, top: pillY + 11 },
      }));

      // GET button (App Store style)
      var getW = isP ? 150 : 140;
      var getX = cardX + cardW - getW - (isP ? 34 : 40);
      kids.push(faRRect(getW, 58, 29, T.surface2, {
        opacity: cardIn,
        border: { color: T.teal, width: 2 },
        positioned: { left: getX, top: iconY },
      }));
      kids.push(faText('GET', {
        opacity: cardIn,
        style: {
          fontSize: 26, fontFamily: 'Impact', fontWeight: '700',
          color: T.teal, letterSpacing: 2,
        },
        positioned: { left: getX + (isP ? 42 : 40), top: iconY + 12 },
      }));

      // Feature rows
      var feats = [
        'NATIVE COMPILE — NO HTML WRAPPER',
        'WIDGETS, APPS & GAMES ON-DEVICE',
        'YOUR KEYS STAY IN THE KEYCHAIN',
      ];
      var featY0 = pillY + 78;
      for (var fi = 0; fi < feats.length; fi++) {
        var fIn = tw(28 + fi * 6, 10, 0, 1, 'easeOut');
        if (fIn > 0.01 && featY0 + fi * 46 < cardY + cardH - 20) {
          kids.push(faRRect(10, 10, 5, fi === 1 ? T.violet : T.teal, {
            opacity: fIn,
            positioned: { left: tx, top: featY0 + fi * 46 + 8 },
          }));
          kids.push(faText(feats[fi], {
            opacity: fIn * 0.85,
            style: {
              fontSize: isP ? 22 : 19,
              fontFamily: 'monospace',
              color: T.dim,
              letterSpacing: 1,
            },
            positioned: { left: tx + 26, top: featY0 + fi * 46 },
          }));
        }
      }
    }

    // ---- QR card ----------------------------------------------------------
    var qrIn = tw(52, 16, 0, 1, 'easeOutCubic');
    var qrSize = isP ? F.W * 0.52 : m * 0.40;
    var platePad = Math.round(qrSize * 0.09);
    var plateW = qrSize + platePad * 2;
    var plateH = plateW + 96;
    var plateX = isP ? cx - plateW / 2 : F.W * 0.60;
    var plateY = isP ? F.H * 0.52 : F.H * 0.24;

    if (qrIn > 0.003) {
      kids.push(faRRect(plateW + 32, plateH + 32, 34, T.teal, {
        opacity: 0.10 * qrIn,
        blur: 44,
        positioned: { left: plateX - 16, top: plateY - 16 },
      }));
      kids.push(faRRect(plateW, plateH, 28, T.card, {
        opacity: qrIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 24 * (1 - qrIn),
        positioned: { left: plateX, top: plateY },
      }));

      kids.push(faQrNode(plateX + platePad, plateY + platePad, qrSize, '#0B0F19', {
        plate: '#FFFFFF',
        radius: 16,
        opacity: qrIn,
      }));

      // Scan line sweep across the QR (last bar of the scene)
      var scanT = tw(120, 60, 0, 1, 'easeInOut');
      if (scanT > 0.001 && scanT < 0.999) {
        var sy = plateY + platePad + qrSize * scanT;
        kids.push(faRRect(qrSize, 4, 2, T.teal, {
          opacity: 0.9 * qrIn,
          blur: 4,
          positioned: { left: plateX + platePad, top: sy },
        }));
      }

      kids.push(faText('fa1.dev', {
        opacity: qrIn,
        style: {
          fontSize: isP ? 40 : 36,
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
          letterSpacing: 2,
        },
        positioned: { left: plateX + platePad + 2, top: plateY + plateH - 66 },
      }));
      kids.push(faText('SCAN · INSTALL · BUILD', {
        opacity: qrIn * 0.8,
        style: {
          fontSize: isP ? 20 : 18,
          fontFamily: 'monospace',
          color: T.teal,
          letterSpacing: 2,
        },
        positioned: { left: plateX + platePad + 2, top: plateY + plateH - 24 },
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
