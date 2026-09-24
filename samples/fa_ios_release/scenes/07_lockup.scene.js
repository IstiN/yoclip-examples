// 07 — Lockup — Fa mark + "First real mobile AI harness" + QR (144 frames, 3 bars)
//
// The closing brand beat: white plate (like the 02b/05b splash — one brand
// language at both ends of the film), Fa mark writes itself, tagline, QR.
// Portrait: mark center-top, tagline, QR + fa1.dev bottom.
// Landscape: Fa mark left, tagline + QR right.

scene = {
  id: '07_lockup',
  duration: 144,
  from: 1574,
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

    // White brand plate — the lockup closes the film on the splash's white.
    kids.push({
      type: 'rect', width: F.W, height: F.H, fill: '#FFFFFF',
      positioned: { left: 0, top: 0 },
    });

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Enter veil: the elements arrive over white (the download's dark exit
    // cuts straight to the plate — same dark->white grammar as the splash).
    var veilIn = 1 - clamp01(frame / 14);
    if (veilIn > 0.003) {
      var va = Math.round(veilIn * 255).toString(16).padStart(2, '0');
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + va + 'FFFFFF' });
    }

    // Ambient glow behind everything
    var glow = 0.14 + 0.04 * Math.sin(frame * 0.35);
    kids.push({
      type: 'circle',
      size: m * 0.9,
      fill: T.violet,
      opacity: glow * 0.55,
      blur: 140,
      positioned: { left: cx - m * 0.45, top: (isP ? F.H * 0.265 : F.H * 0.40) - m * 0.45 },
    });

    // ---- Fa mark writes itself ---------------------------------------------
    var markH = isP ? m * 0.34 : m * 0.42;
    var markCx = isP ? cx : F.W * 0.30;
    var markCy = isP ? F.H * 0.265 : F.H * 0.40;

    var fP = tw(6, 30, 0, 1, 'easeInOut');
    var accentP = tw(16, 24, 0, 1, 'easeOut');
    var bowlP = tw(10, 28, 0, 1, 'easeInOut');
    var stemP = tw(20, 26, 0, 1, 'easeInOut');

    // Glow burst when the mark completes
    if (frame >= 40 && frame <= 64) {
      var bp = clamp01((frame - 40) / 24);
      kids.push({
        type: 'circle',
        size: markH * (1.3 + bp * 1.2),
        fill: T.teal,
        opacity: (1 - bp) * 0.22,
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
    var tagIn = expoOut(clamp01((frame - 46) / 14));
    var tagY = isP ? F.H * 0.465 : F.H * 0.26;
    var tagX = isP ? 0 : F.W * 0.50;
    kids.push(faText('THE FIRST REAL', {
      width: isP ? F.W : F.W * 0.48,
      opacity: clamp01(tagIn * 1.2),
      offsetY: 18 * (1 - tagIn),
      style: {
        fontSize: isP ? Math.round(m * 0.062) : Math.round(m * 0.048),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: '#0B0F19',
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2.5,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#3C4043', '#0B0F19'],
          stops: [0.0, 1.0],
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
        color: T.violetDeep,
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2.5,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: [T.violet, T.violetDeep],
          stops: [0.0, 1.0],
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
    var qrIn = tw(68, 14, 0, 1, 'easeOut');
    var qrSize = isP ? F.W * 0.34 : m * 0.26;
    var platePad = Math.round(qrSize * 0.08);
    var plateW = qrSize + platePad * 2;
    var plateX = isP ? cx - plateW / 2 : tagX;
    var plateY = isP ? F.H * 0.615 : tagY + m * 0.185;

    if (qrIn > 0.003) {
      kids.push(faRRect(plateW + 28, plateW + 28, 30, T.teal, {
        opacity: 0.16 * qrIn,
        blur: 40,
        positioned: { left: plateX - 14, top: plateY - 14 },
      }));
      kids.push(faRRect(plateW, plateW, 24, '#FFFFFF', {
        opacity: qrIn,
        border: { color: '#DFE2E9', width: 1.5 },
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
      width: isP ? F.W : null,
      opacity: urlIn,
      style: {
        fontSize: isP ? 46 : 40,
        fontFamily: 'Impact',
        fontWeight: '700',
        color: '#0B0F19',
        textAlign: isP ? 'center' : null,
        letterSpacing: 2,
      },
      positioned: {
        left: isP ? 0 : plateX + plateW + 34,
        top: isP ? plateY + plateW + 16 : plateY + plateW / 2 - 24,
      },
    }));
    kids.push(faText('SCAN THE CODE — START BUILDING', {
      width: isP ? F.W : null,
      opacity: urlIn * 0.75,
      style: {
        fontSize: isP ? 20 : 19,
        fontFamily: 'monospace',
        color: T.teal,
        textAlign: isP ? 'center' : null,
        letterSpacing: 2,
      },
      positioned: {
        left: isP ? 0 : plateX + plateW + 34,
        top: isP ? plateY + plateW + 72 : plateY + plateW / 2 + 24,
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
        color: '#9E9EA8',
        textAlign: 'center',
        letterSpacing: 4,
      },
      positioned: { left: 0, top: isP ? F.H * 0.94 : F.H * 0.90 },
    }));

    // Final settle: a barely-there continuous push-in, so the lockup breathes
    // instead of sitting frozen (portrait mark/tagline/QR shift upward with it).
    var settleP = clamp01(frame / 144);
    var settle = 1 + 0.014 * settleP * settleP;
    var root = { type: 'stack', fit: 'expand', children: kids };
    if (settle !== 1) {
      root = {
        type: 'stack',
        fit: 'expand',
        scale: settle,
        offsetX: (F.W - F.W * settle) / 2,
        offsetY: (F.H - F.H * settle) / 2 + (isP ? -12 * settleP : -7 * settleP),
        children: [root],
      };
    }

    return root;
  },
};
