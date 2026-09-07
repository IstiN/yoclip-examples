// The Fa brand morph — one 240-frame shot:
//
//   01  0–40    the app icon: dark-glass rounded square, `>_` inside, the
//               underscore pulsing like a terminal cursor
//   02  40–74   boot scan — one teal line sweeps the icon top to bottom,
//               its edge lifting as the line passes (no shattering: the
//               icon is the stage, it stays)
//   05  75–100  the icon grows to hero scale (the composition zooms in)
//   06  96–110  a soft teal band breathes over the glyph row — the cue
//   07  108–122 morph: chevron arms split away and die into blue streaks
//   08  122–166 the note: three beats — the underscore lifts off its
//               slot, the tip reaches right like a hand winding up, and
//               only then the wire CURLS into a ring — the note head `o`
//               (in Russian solfège the note is written «фа» = Fa)
//   09  166–192 the `o` blinks like the cursor it always was, and on the
//               blink splits: one ring glides up-left and flattens into
//               the F's accent bar, the other swells into the `a`'s bowl;
//               the F writes itself as one round-capped stroke (184..212)
//   11  206–222 the `a`'s stem draws through the bowl in micro-segments,
//               its color gliding green → cyan (one continuous gradient)
//   16  218–240 settle: ground glow, final teal bloom — the finished icon
//
// Everything is placed through the shared svg→screen mapper (lib/brand.js)
// with the tile center pinned for the whole run, so the icon, the morph and
// the wordmark share one composition.

scene = {
  id: 'fa_morph',
  duration: 240,
  from: 0,
  timeline: {
    label: 'Icon → Fa',
    color: '#48C7E8',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    // ---- The mapper: the tile center is pinned at screen center for the
    // whole film; only the scale breathes — icon size, hero zoom, hold.
    var kIcon = 0.371;
    var kGlyph = 0.62;
    var kHero = 0.86;
    var growT = tw(75, 24, 0, 1, 'easeOutExpo');
    var anchorT = tw(108, 34, 0, 1, 'easeInOutCubic');
    var k = kIcon + (kGlyph - kIcon) * growT;
    k = k + (kHero - k) * anchorT;
    var breathe = 1 + 0.006 * jsr.motion.wave(ms, 3400, 1, 0.4);
    k *= breathe;
    // Icon-phase settle: the tile lands at frame 0 with a soft exhale.
    if (frame < 16) k *= tw(0, 16, 1.03, 1, 'easeOutCubic');
    setMapper(k, BRAND.anchor[0], BRAND.anchor[1], 960, 540);

    var kids = [];

    // ---- Backdrop ---------------------------------------------------------
    // A faint cool wash keeps the dark field from feeling flat.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#0a0f1c',
      opacity: 0.55, positioned: { left: 0, top: 0 },
    });

    // ---- Beat 01/02: the tile — dark glass, on stage the whole film -------
    // The icon never shatters. Deep navy fill, hairline cool stroke; the
    // stroke lifts where the boot-scan line crosses it.
    var scanT = tw(40, 34, 0, 1, 'easeInOutCubic');
    var scanning = scanT > 0.001 && scanT < 0.999;
    var scanY = BRAND.tile.x + scanT * BRAND.tile.w;
    var edgeLift = scanning
      ? Math.exp(-Math.pow(scanY - 512, 2) / (2 * 90 * 90))
      : 0;
    var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
    kids.push({
      type: 'rect',
      width: BRAND.tile.w * k, height: BRAND.tile.h * k,
      radius: BRAND.tile.rx * k,
      fill: '#17223B',
      stroke: lerpColor('#2E3C5F', '#3E5C86', edgeLift),
      strokeWidth: Math.max(2, 5.5 * k),
      opacity: 1,
      positioned: { left: tl.x, top: tl.y },
    });

    // The boot scan — one teal line sweeping the icon, glow band trailing.
    if (scanning) {
      var linePt = brandToScreen(512, scanY);
      var lw = BRAND.tile.w * k;
      kids.push({
        type: 'rect', width: lw, height: 18 * k, radius: 9 * k,
        fill: colors.tealLight, opacity: 0.13,
        positioned: { left: linePt.x - lw / 2, top: linePt.y - 9 * k },
      });
      kids.push({
        type: 'rect', width: lw, height: Math.max(2, 2.5 * k), radius: 1,
        fill: colors.tealSpark, opacity: 0.6,
        positioned: {
          left: linePt.x - lw / 2,
          top: linePt.y - Math.max(1, 1.25 * k),
        },
      });
    }

    // ---- Beat 06: the cue — a soft band breathing over the glyph row ------
    var pulseP = tw(96, 14, 0, 1, 'easeOutCubic');
    if (pulseP > 0.001 && pulseP < 0.999) {
      var vpt = brandToScreen(512, 560);
      var pw = BRAND.tile.w * k * (0.7 + 0.3 * pulseP);
      kids.push({
        type: 'rect', width: pw, height: 120 * k, radius: 60 * k,
        fill: colors.tealLight, opacity: 0.07 * (1 - pulseP),
        positioned: { left: vpt.x - pw / 2, top: vpt.y - 60 * k },
      });
    }

    // ---- The chevron (01..07): mitered halves, blue split, round ends -----
    // Top arm keeps the lighter stop, bottom arm blends deeper — flat fills
    // per arm, the eye reads the pair as the gradient. During the morph the
    // arms drift apart (the centerlines themselves shift) and die into
    // blue streaks.
    var armLife = 1 - tw(108, 14, 0, 1, 'easeInCubic');
    if (armLife > 0.01) {
      var spread = tw(108, 16, 0, 30, 'easeInCubic');
      var halves = chevronHalves(spread, colors.blueBright, colors.blueDeep);
      for (var hi = 0; hi < halves.length; hi++) {
        halves[hi].opacity = armLife;
        kids.push(halves[hi]);
      }
      if (frame >= 106) {
        for (var b = 0; b < 3; b++) {
          var bs = streak(b, 470 + b * 60, 500, 200 + prand(b + 7) * 160, 12,
            b % 2 == 0 ? colors.blue : colors.blueDeep, frame, 30, 106 + b * 2, 26);
          if (bs != null) kids.push(bs);
        }
      }
    }

    // ---- The underscore: terminal cursor until the note takes it -----------
    var cursorP = frame < 108
      ? 1 - 0.22 * (0.5 + 0.5 * jsr.motion.wave(ms, 950, 1, 0))
      : 1;
    if (frame < 122) kids.push.apply(kids, tealBar(cursorP));

    // ---- The note «фа» (122..180) ------------------------------------------
    // In Russian solfège the note is written «фа» — Fa. Three beats: the
    // underscore lifts off its slot, the tip reaches right like a hand
    // winding up, and only then the wire curls into a note head — an `o` —
    // that blinks like the cursor it always was. On the blink it splits.
    var OX = BRAND.under.x + BRAND.under.w / 2;
    var UY = BRAND.under.y + BRAND.under.h / 2;
    var OR = 52;
    // Center stage, where the blink happens.
    var NX = 512, NY = 555;
    var oColor = '#3BC2C3';
    var liftT  = tw(128, 12, 0, 1, 'easeInOutCubic');
    var reachT = tw(140, 10, 0, 1, 'easeInOutCubic');
    var bendT  = tw(150, 16, 0, 1, 'easeInOutCubic');
    if (frame >= 122 && frame < 180) {
      // Gradient capsule fades as the identical-silhouette stroke takes over.
      kids.push.apply(kids, tealBar(1 - tw(122, 5, 0, 1, 'linear')));
      var blink = frame < 166 ? 1
        : (Math.floor((frame - 166) / 6) % 2 == 0 ? 1 : 0.06);
      // The bar's own geometry glides: up off the slot, then the tip
      // reaches right, and through the bend both ends fold in onto the
      // ring's span while the target circle drifts up to center stage.
      var barX0 = lerp(BRAND.under.x + OR, NX - OR, bendT);
      var barX1 = lerp(
        lerp(BRAND.under.x + BRAND.under.w - OR, 838, reachT),
        NX + OR, bendT);
      var barY = lerp(lerp(UY, 644, liftT), NY, bendT);
      var bend = bendPoints(barX0, barY, barX1,
        lerp(OX, NX, bendT), lerp(644, NY, bendT), OR, bendT, 32);
      kids.push(polylineNode(bend, BRAND.under.h, 1, oColor, blink));
    }

    // ---- The split: the note spells «Fa» (180..206) -------------------------
    // On a blink the `o` divides. One ring glides up-left, flattening into
    // the F's accent bar; the other glides up-right and swells into the
    // `a`'s bowl. The note becomes its own name.
    var aBowlColor = '#2EBD9E';
    if (frame >= 180) {
      var splitT = tw(180, 26, 0, 1, 'easeInOutCubic');
      var acc = BRAND.f.accent;
      var bendA = bendPoints(
        acc.x + acc.h / 2, acc.y + acc.h / 2,
        acc.x + acc.w - acc.h / 2,
        lerp(NX, acc.x + acc.w / 2, splitT),
        lerp(NY, acc.y + acc.h / 2, splitT),
        OR, 1 - splitT, 32);
      kids.push(polylineNode(bendA, acc.h, 1, oColor, 1));
      var bendB = ringPoints(
        lerp(NX, BRAND.a.bowl.cx, splitT),
        lerp(NY, BRAND.a.bowl.cy, splitT),
        lerp(OR, BRAND.a.bowl.r, splitT), 32);
      kids.push(polylineNode(bendB, 38, 1,
        lerpColor(oColor, aBowlColor, splitT), 1));
      if (frame < 192) {
        for (var t2 = 0; t2 < 3; t2++) {
          var ts = streak(t2, 560 + t2 * 40, 540, 140 + prand(t2 + 21) * 120, 10,
            colors.tealLight, frame, 30, 180 + t2 * 2, 22);
          if (ts != null) kids.push(ts);
        }
      }
    }

    // ---- Beat 07: the F writes itself (184..212) ---------------------------
    // One round-capped stroke: up the stem, right across the top bar. The
    // elbow rounds like a drawn letterform — no seams anywhere.
    var fP = tw(184, 28, 0, 1, 'easeInOutCubic');
    if (fP > 0.001) {
      kids.push(fPathNode(fP, colors.blue,
        Math.min(1, tw(184, 5, 0, 1, 'linear'))));
    }

    // ---- Beat 11: the `a`'s stem (206..222) ---------------------------------
    // The bowl IS the note (it arrived as the ring). The stem draws down
    // from it in micro-segments whose color glides green → cyan — the `a`
    // carries the brand gradient instead of switching between its anchors.
    var stemP = tw(206, 16, 0, 1, 'easeInOutCubic');
    if (stemP > 0.001) {
      var segs = 8;
      var aStem = BRAND.a.stem;
      var segH = aStem.h / segs;
      for (var si = 0; si < segs; si++) {
        var sp = jsr.motion.clamp(stemP * segs - si, 0, 1);
        if (sp <= 0) continue;
        var sy0 = aStem.y + si * segH - (si > 0 ? 2 : 0);
        kids.push(trace(
          'M' + aStem.x + ',' + sy0 + ' L' + aStem.x + ',' + (aStem.y + (si + 1) * segH),
          38, aStem.x, sy0, 0, segH, sp,
          lerpColor(aBowlColor, colors.tealLight, si / (segs - 1))));
      }
    }

    // ---- Beat 16: settle + the final bloom (218..240) ------------------------
    var settleP = tw(218, 22, 0, 1, 'easeOutExpo');
    if (settleP > 0.01) {
      // Ground glow: a flat teal bar under the baseline, breathing wide,
      // centered on the finished wordmark.
      var gb = brandToScreen(522, 742);
      var gw = (560 + 30 * jsr.motion.wave(ms, 2800, 1, 0)) * k;
      kids.push({
        type: 'rect',
        width: gw, height: 10 * k,
        radius: 5 * k,
        fill: colors.tealLight,
        opacity: 0.22 * settleP,
        positioned: { left: gb.x - gw / 2, top: gb.y },
      });
      kids.push({
        type: 'rect',
        width: gw * 0.55, height: 18 * k,
        radius: 9 * k,
        fill: '#bffaf1',
        opacity: 0.10 * settleP,
        positioned: { left: gb.x - gw * 0.275, top: gb.y - 4 * k },
      });
    }
    var bloomP = tw(224, 16, 0, 1, 'easeOutExpo');
    if (bloomP > 0.01 && bloomP < 1) {
      var fb = brandToScreen(638, 700);
      kids.push({
        type: 'circle',
        size: 90 * k * (1 + 0.25 * (1 - bloomP)),
        fill: '#7FE9DC',
        opacity: 0.6 * bloomP * (1 - bloomP),
        positioned: { left: fb.x - 45 * k, top: fb.y - 45 * k },
      });
      // A short shine sweeping under the mark — same width class as the
      // ground glow, so it never reads as an edge-to-edge stray hairline.
      kids.push({
        type: 'rect',
        width: 420 * k * bloomP, height: 3,
        radius: 1.5,
        fill: '#bffaf1',
        opacity: 0.5 * (1 - bloomP * 0.55),
        positioned: { left: fb.x - 210 * k * bloomP, top: fb.y + 42 * k },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
