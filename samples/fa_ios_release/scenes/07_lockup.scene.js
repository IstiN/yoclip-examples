// 07 — Lockup — Fa mark + "First real mobile AI harness" + QR (144 frames, 3 bars)
//
// Portrait: Fa mark writes center-top, tagline, QR + fa1.dev bottom.
// Landscape: Fa mark left, tagline + QR right.

scene = {
  id: '07_lockup',
  duration: 144,
  from: 1130,
  timeline: {
    label: 'Lockup',
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

    var kids = [];

    // No full-frame background — broll_07_outro_monitors paints it
    // underneath (slot plate now, hero monitor-wall footage later).

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Ambient glow behind everything
    var glow = 0.30 + 0.08 * Math.sin(frame * 0.35);
    kids.push({
      type: 'circle',
      size: m * 0.9,
      color: T.violet,
      opacity: glow * 0.35,
      blur: 140,
      positioned: { left: cx - m * 0.45, top: (isP ? F.H * 0.30 : F.H * 0.42) - m * 0.45 },
    });

    // ---- Fa mark writes itself ---------------------------------------------
    var markH = isP ? m * 0.30 : m * 0.42;
    var markCx = isP ? cx : F.W * 0.30;
    var markCy = isP ? F.H * 0.28 : F.H * 0.40;

    var fP = tw(6, 30, 0, 1, 'easeInOutCubic');
    var accentP = tw(16, 24, 0, 1, 'easeOut');
    var bowlP = tw(10, 28, 0, 1, 'easeInOutCubic');
    var stemP = tw(20, 26, 0, 1, 'easeInOutCubic');

    // Glow burst when the mark completes
    if (frame >= 40 && frame <= 64) {
      var bp = clamp01((frame - 40) / 24);
      kids.push({
        type: 'circle',
        size: markH * (1.3 + bp * 1.2),
        color: T.teal,
        opacity: (1 - bp) * 0.30,
        blur: 60,
        positioned: {
          left: markCx - markH * (1.3 + bp * 1.2) / 2,
          top: markCy - markH * (1.3 + bp * 1.2) / 2,
        },
      });
    }

    var markNode = faLogoSvgNode(markCx, markCy, markH, 1);
    // faLogoSvgNode renders the full static mark; overlay write-on via
    // completeFaMark progress paths in the same box.
    kids.push(markNode);

    // ---- Tagline -------------------------------------------------------------
    var tagIn = tw(46, 14, 0, 1, 'easeOutExpo');
    var tagY = isP ? F.H * 0.52 : F.H * 0.26;
    var tagX = isP ? 0 : F.W * 0.50;
    kids.push(faText('THE FIRST REAL', {
      width: isP ? F.W : F.W * 0.48,
      opacity: clamp01(tagIn * 1.2),
      offsetY: 18 * (1 - tagIn),
      style: {
        fontSize: isP ? Math.round(m * 0.062) : Math.round(m * 0.048),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2.5,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: T.isLight
            ? ['#3C4043', '#0B0F19']
            : ['#FFFFFF', '#ECECEF', '#9E9EA8'],
          stops: T.isLight ? [0.0, 1.0] : [0.0, 0.45, 1.0],
        },
      },
      positioned: { left: tagX, top: tagY },
    }));
    kids.push(faText('MOBILE AI HARNESS.', {
      width: isP ? F.W : F.W * 0.48,
      opacity: clamp01(tagIn * 1.2),
      offsetY: 18 * (1 - tagIn),
      style: {
        fontSize: isP ? Math.round(m * 0.062) : Math.round(m * 0.048),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2.5,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: [T.violetPale, T.violet, T.violetDeep],
          stops: [0.0, 0.5, 1.0],
        },
      },
      positioned: { left: tagX, top: tagY + (isP ? m * 0.085 : m * 0.065) },
    }));

    // Teal rule under tagline (landscape) / centered (portrait)
    var ruleP = tw(58, 12, 0, 1, 'easeOut');
    if (ruleP > 0.01) {
      var ruleW = m * 0.22 * ruleP;
      var ruleX = isP ? cx - ruleW / 2 : tagX;
      kids.push(faRRect(ruleW, 3, 1.5, T.teal, {
        opacity: 0.9,
        positioned: { left: ruleX, top: tagY + (isP ? m * 0.20 : m * 0.155) },
      }));
    }

    // ---- QR + fa1.dev --------------------------------------------------------
    var qrIn = tw(68, 14, 0, 1, 'easeOutCubic');
    var qrSize = isP ? F.W * 0.34 : m * 0.26;
    var platePad = Math.round(qrSize * 0.08);
    var plateW = qrSize + platePad * 2;
    var plateX = isP ? cx - plateW / 2 : tagX;
    var plateY = isP ? F.H * 0.66 : tagY + m * 0.185;

    if (qrIn > 0.003) {
      kids.push(faRRect(plateW + 28, plateW + 28, 30, T.teal, {
        opacity: 0.12 * qrIn,
        blur: 40,
        positioned: { left: plateX - 14, top: plateY - 14 },
      }));
      kids.push(faRRect(plateW, plateW, 24, T.card, {
        opacity: qrIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 18 * (1 - qrIn),
        positioned: { left: plateX, top: plateY },
      }));
      kids.push(faQrNode(plateX + platePad, plateY + platePad, qrSize, '#0B0F19', {
        plate: '#FFFFFF',
        radius: 14,
        opacity: qrIn,
      }));
    }

    var urlIn = tw(84, 12, 0, 1, 'easeOut');
    kids.push(faText('fa1.dev', {
      opacity: urlIn,
      style: {
        fontSize: isP ? 46 : 40,
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        letterSpacing: 2,
      },
      positioned: {
        left: isP ? cx - 66 : plateX + plateW + 34,
        top: isP ? plateY + plateW + 22 : plateY + plateW / 2 - 24,
      },
    }));
    kids.push(faText('SCAN THE CODE — START BUILDING', {
      opacity: urlIn * 0.75,
      style: {
        fontSize: isP ? 20 : 19,
        fontFamily: 'monospace',
        color: T.teal,
        letterSpacing: 2,
      },
      positioned: {
        left: isP ? cx - 158 : plateX + plateW + 34,
        top: isP ? plateY + plateW + 76 : plateY + plateW / 2 + 24,
      },
    }));

    // Platform footnote
    var pfIn = tw(100, 12, 0, 1, 'easeOut');
    kids.push(faText('iOS · macOS · ANDROID · WEB', {
      width: F.W,
      opacity: pfIn * 0.65,
      style: {
        fontSize: isP ? 21 : 20,
        fontFamily: 'monospace',
        color: T.faint,
        textAlign: 'center',
        letterSpacing: 4,
      },
      positioned: { left: 0, top: isP ? F.H * 0.93 : F.H * 0.90 },
    }));

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
