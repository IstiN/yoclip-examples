// 05c — Download — App Store card + QR → fa1.dev (192 frames, 4 bars)
//
// Portrait: App Store card top, QR card below.
// Landscape: App Store card left, QR card right.
// A scan line sweeps the QR on the last bar.

scene = {
  id: '05c_download',
  duration: 192,
  from: 2366,
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
    var titleIn = expoOut(clamp01((frame - 4) / 12));
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
    var cardIn = tw(10, 16, 0, 1, 'easeOut');
    var cardW = isP ? F.W * 0.88 : F.W * 0.40;
    var cardH = isP ? F.H * 0.30 : F.H * 0.50;
    var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.055;
    var cardY = isP ? F.H * 0.145 : F.H * 0.22;

    if (cardIn > 0.003) {
      var pad = isP ? 40 : 36;

      // Card + soft teal glow.
      kids.push(faRRect(cardW + 40, cardH + 40, 36, T.teal, {
        opacity: 0.10 * cardIn,
        blur: 44,
        positioned: { left: cardX - 20, top: cardY - 20 },
      }));
      kids.push(faRRect(cardW, cardH, 28, T.card, {
        opacity: cardIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 24 * (1 - cardIn),
        positioned: { left: cardX, top: cardY },
      }));

      var ix = cardX + pad;
      var iy = cardY + pad;
      var iconS = isP ? 128 : 104;
      var contentW = cardW - pad * 2;

      // App icon: branded squircle with the Fa mark.
      kids.push(faRRect(iconS, iconS, iconS * 0.24, T.surface2, {
        opacity: cardIn,
        border: { color: T.violet, width: 2 },
        positioned: { left: ix, top: iy },
      }));
      kids.push(faLogoSvgNode(ix + iconS / 2, iy + iconS / 2, iconS * 0.62, cardIn));

      // GET button (App Store style) — right-aligned, with microcopy.
      var getW = 132;
      var getH = 56;
      var getX = cardX + cardW - pad - getW;
      kids.push(faRRect(getW, getH, getH / 2, T.teal, {
        opacity: cardIn,
        positioned: { left: getX, top: iy + 4 },
      }));
      kids.push(faText('GET', {
        width: getW,
        opacity: cardIn,
        style: {
          fontSize: 30, fontFamily: 'Impact', fontWeight: '700',
          color: '#FFFFFF', letterSpacing: 2, textAlign: 'center',
        },
        positioned: { left: getX, top: iy + 4 + 6 },
      }));
      kids.push(faText('In-App Purchases', {
        width: getW + 60,
        opacity: 0.7 * cardIn,
        style: {
          fontSize: 15, fontFamily: 'monospace',
          color: T.dim, textAlign: 'center',
        },
        positioned: { left: getX - 30, top: iy + 4 + getH + 8 },
      }));

      // Title + subtitle sit between icon and GET.
      var tx = ix + iconS + 28;
      kids.push(faText('Fa — AI Agent', {
        opacity: cardIn,
        style: {
          fontSize: isP ? 42 : 34,
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
          letterSpacing: 0.5,
        },
        positioned: { left: tx, top: iy + 2 },
      }));
      kids.push(faText('Build native apps on-device.', {
        opacity: 0.75 * cardIn,
        style: {
          fontSize: isP ? 22 : 19,
          fontFamily: 'monospace',
          color: T.dim,
        },
        positioned: { left: tx, top: iy + (isP ? 62 : 50) },
      }));

      // ---- Ratings strip: the iconic 3-column App Store row. ------------
      var div1Y = iy + iconS + 26;
      kids.push(faRRect(contentW, 1.5, 0.75, T.border, {
        opacity: 0.8 * cardIn,
        positioned: { left: ix, top: div1Y },
      }));

      var rY = div1Y + 24;
      var colW = contentW / 3;
      var ratingIn = tw(30, 12, 0, 1, 'easeOut');
      if (ratingIn > 0.01) {
        // Column 1: 4.9 + five stars (4 lit, 1 dim).
        kids.push(faText('4.9', {
          width: colW,
          opacity: ratingIn,
          style: {
            fontSize: isP ? 40 : 34, fontFamily: 'Impact', fontWeight: '700',
            color: T.text, textAlign: 'center',
          },
          positioned: { left: ix, top: rY },
        }));
        for (var si = 0; si < 5; si++) {
          kids.push({
            type: 'circle',
            size: isP ? 13 : 11,
            fill: si < 4 ? T.teal : T.border,
            positioned: {
              left: ix + colW / 2 - (isP ? 42 : 36) + si * (isP ? 18 : 15),
              top: rY + (isP ? 52 : 44),
            },
          });
        }
        kids.push(faText('RATINGS', {
          width: colW,
          opacity: 0.7 * ratingIn,
          style: {
            fontSize: 16, fontFamily: 'monospace',
            color: T.dim, textAlign: 'center', letterSpacing: 2,
          },
          positioned: { left: ix, top: rY + (isP ? 74 : 62) },
        }));

        // Column 2: age.
        kids.push(faText('9+', {
          width: colW,
          opacity: ratingIn,
          style: {
            fontSize: isP ? 40 : 34, fontFamily: 'Impact', fontWeight: '700',
            color: T.text, textAlign: 'center',
          },
          positioned: { left: ix + colW, top: rY },
        }));
        kids.push(faText('AGE', {
          width: colW,
          opacity: 0.7 * ratingIn,
          style: {
            fontSize: 16, fontFamily: 'monospace',
            color: T.dim, textAlign: 'center', letterSpacing: 2,
          },
          positioned: { left: ix + colW, top: rY + (isP ? 74 : 62) },
        }));

        // Column 3: chart rank.
        kids.push(faText('#1', {
          width: colW,
          opacity: ratingIn,
          style: {
            fontSize: isP ? 40 : 34, fontFamily: 'Impact', fontWeight: '700',
            color: T.text, textAlign: 'center',
          },
          positioned: { left: ix + colW * 2, top: rY },
        }));
        kids.push(faText('DEV TOOLS', {
          width: colW,
          opacity: 0.7 * ratingIn,
          style: {
            fontSize: 16, fontFamily: 'monospace',
            color: T.dim, textAlign: 'center', letterSpacing: 2,
          },
          positioned: { left: ix + colW * 2, top: rY + (isP ? 74 : 62) },
        }));

        // Column separators.
        kids.push(faRRect(1.5, (isP ? 96 : 80), 0.75, T.border, {
          opacity: 0.7 * ratingIn,
          positioned: { left: ix + colW, top: rY + 4 },
        }));
        kids.push(faRRect(1.5, (isP ? 96 : 80), 0.75, T.border, {
          opacity: 0.7 * ratingIn,
          positioned: { left: ix + colW * 2, top: rY + 4 },
        }));
      }

      // ---- Price row. ----------------------------------------------------
      var div2Y = rY + (isP ? 108 : 90);
      kids.push(faRRect(contentW, 1.5, 0.75, T.border, {
        opacity: 0.8 * cardIn,
        positioned: { left: ix, top: div2Y },
      }));
      var prY = div2Y + 22;
      kids.push(faRRect(200, 52, 26, T.violetDeep, {
        opacity: 0.95 * cardIn,
        positioned: { left: ix, top: prY },
      }));
      kids.push(faText('USD 11.99', {
        width: 200,
        opacity: cardIn,
        style: {
          fontSize: 26, fontFamily: 'monospace', fontWeight: '800',
          color: '#FFFFFF', letterSpacing: 0.5, textAlign: 'center',
        },
        positioned: { left: ix, top: prY + 8 },
      }));
      var tfW = isP ? 360 : 330;
      kids.push(faRRect(tfW, 52, 26, '#1A2EBD9E', {
        opacity: 0.9 * cardIn,
        border: { color: T.teal, width: 1.5 },
        positioned: { left: ix + 216, top: prY },
      }));
      kids.push(faText('TESTFLIGHT — FREE BETA', {
        width: tfW,
        opacity: cardIn,
        style: {
          fontSize: 22, fontFamily: 'monospace', fontWeight: '700',
          color: T.teal, letterSpacing: 0.5, textAlign: 'center',
        },
        positioned: { left: ix + 216, top: prY + 10 },
      }));

      // ---- Feature rows: ring + dot checkmarks. --------------------------
      var feats = [
        'NATIVE COMPILE — NO HTML WRAPPER',
        'WIDGETS, APPS & GAMES ON-DEVICE',
        'YOUR KEYS STAY IN THE KEYCHAIN',
      ];
      var featY0 = prY + 76;
      for (var fi = 0; fi < feats.length; fi++) {
        var fIn = tw(34 + fi * 6, 10, 0, 1, 'easeOut');
        var fy = featY0 + fi * (isP ? 50 : 44);
        if (fIn > 0.01 && fy < cardY + cardH - 30) {
          var dot = fi === 1 ? T.violet : T.teal;
          kids.push({
            type: 'circle',
            size: 24,
            stroke: dot,
            strokeWidth: 2,
            opacity: fIn,
            positioned: { left: ix + 2, top: fy + 6 },
          });
          kids.push({
            type: 'circle',
            size: 10,
            fill: dot,
            opacity: fIn,
            positioned: { left: ix + 9, top: fy + 13 },
          });
          kids.push(faText(feats[fi], {
            opacity: fIn * 0.85,
            style: {
              fontSize: isP ? 22 : 19,
              fontFamily: 'monospace',
              color: T.dim,
              letterSpacing: 1,
            },
            positioned: { left: ix + 42, top: fy },
          }));
        }
      }
    }

    // ---- QR card ----------------------------------------------------------
    var qrIn = tw(52, 16, 0, 1, 'easeOut');
    var qrSize = isP ? F.W * 0.52 : m * 0.40;
    var platePad = Math.round(qrSize * 0.09);
    var plateW = qrSize + platePad * 2;
    var plateH = plateW + 140;
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

      // Footer: hairline divider, then the full link centered (the QR
      // matrix itself encodes https://fa1.dev), caption under it.
      var qrBot = plateY + platePad + qrSize;
      var pcx2 = plateX + plateW / 2;
      kids.push(faRRect(qrSize, 1.5, 0.75, T.border, {
        opacity: 0.7 * qrIn,
        positioned: { left: pcx2 - qrSize / 2, top: qrBot + 20 },
      }));
      kids.push(faText('https://fa1.dev', {
        width: plateW - platePad * 2,
        opacity: qrIn,
        style: {
          fontSize: isP ? 34 : 30,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.text,
          letterSpacing: 1,
          textAlign: 'center',
        },
        positioned: { left: plateX + platePad, top: qrBot + 44 },
      }));
      kids.push(faText('SCAN · INSTALL · BUILD', {
        width: plateW - platePad * 2,
        opacity: qrIn * 0.85,
        style: {
          fontSize: isP ? 19 : 17,
          fontFamily: 'monospace',
          color: T.teal,
          letterSpacing: 3,
          textAlign: 'center',
        },
        positioned: { left: plateX + platePad, top: qrBot + 98 },
      }));
    }

    // White hand-off from the hook: the hook ends fully white (its flood
    // pours out of the search button), so open on the same white and
    // dissolve out over the first beat while the content fades in.
    // Shapes paint `fill` (not `color`); alpha is baked into the 8-digit
    // hex (#AARRGGBB) — the `opacity` wrap proved unreliable here.
    var handoff = clamp01(tw(0, 14, 1, 0, 'easeOut'));
    if (handoff > 0.003) {
      // Same color the 01 click flood poured (white in light, ink in dark).
      var floodBase = T.isLight ? 'FFFFFF' : T.bg.replace('#', '').toUpperCase();
      var a = Math.round(handoff * 255).toString(16).padStart(2, '0');
      kids.push({
        type: 'rect',
        width: F.W,
        height: F.H,
        fill: '#' + a + floodBase,
      });
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
