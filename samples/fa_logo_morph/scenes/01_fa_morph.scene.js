// The Fa brand morph — one 240-frame shot:
//
//   01  0–40    the app icon: dark-glass rounded square, `>_` inside, the
//               underscore pulsing like a terminal cursor
//   02  40–74   boot scan — one teal line sweeps the icon top to bottom,
//               its edge lifting as the line passes (no shattering: the
//               icon is the stage, it stays)
//   05  75–100  the icon grows to hero scale (the composition zooms in)
//   06  96–110  a soft teal band breathes over the glyph row — the cue
//   07  108–122 the prompt `>_` is a face: the `>` holds as the eye,
//               the underscore is its mouth
//   08  122–166 the note: three beats — the mouth lifts off its slot,
//               the tip reaches right like a hand winding up, and only
//               then the wire CURLS into a ring beside the eye: the face
//               reads `>o` (in Russian solfège the note is «фа» = Fa)
//   09  166–192 the wink: the `o` blinks and the eye squints in sync —
//               and on that blink the face breaks: the eye dies into blue
//               streaks, the rings split (one flattens into the F accent,
//               one swells into the `a` bowl) and the F's stem grows out
//               of the eye's socket (184..212)
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

    // ---- The mouth blink cycle (162..186) ----------------------------------
    // Once the note has formed, the face plays it twice: the mouth closes
    // flat into a dash and pops back open — `>o`, `>-`, `>o`, `>-`, `>o` —
    // while the eye squints in sync. A real winking smiley.
    var mouthSq = 0;
    if (frame >= 162 && frame < 186) {
      var mu = (frame - 162) % 12;
      mouthSq = mu < 6 ? mu / 6 : (12 - mu) / 6;
    }

    // ---- The chevron: the winking eye (01..09) -----------------------------
    // `>_` is a face: the chevron is the squinting eye, the underscore its
    // mouth. The eye NEVER falls apart. It holds while the mouth lifts,
    // purses and curls into an `o`, squints in sync with the mouth's blink
    // cycle — and then the two arms fold into ONE vertical line that slides
    // up into place as the F's stem.
    var foldT = tw(186, 14, 0, 1, 'easeInOutCubic');
    if (foldT <= 0.001) {
      var halves = chevronHalves(0, colors.blueBright, colors.blueDeep,
        1 - 0.16 * mouthSq);
      for (var hi = 0; hi < halves.length; hi++) kids.push(halves[hi]);
    }

    // ---- The underscore: terminal cursor until the note takes it -----------
    var cursorP = frame < 108
      ? 1 - 0.22 * (0.5 + 0.5 * jsr.motion.wave(ms, 950, 1, 0))
      : 1;
    if (frame < 122) kids.push.apply(kids, tealBar(cursorP));

    // ---- The note «фа» (122..186) ------------------------------------------
    // In Russian solfège the note is written «фа» — Fa. The mouth lifts off
    // its slot, purses into a dash `-`, and only then the wire curls into a
    // note head beside the eye — the face reads `>o`, then plays the blink
    // cycle. The handoff is seamless: the stroked bar's endpoints are inset
    // by the cap radius, so its silhouette is pixel-identical to the
    // capsule it replaces.
    var OX = BRAND.under.x + BRAND.under.w / 2;
    var UY = BRAND.under.y + BRAND.under.h / 2;
    var OR = 104;
    // The second square: equal to the eye's, 40 units of daylight between
    // them — two smiley eyes, `>` in the left one, `o` in the right one.
    var NX = 674, NY = 541;
    var oColor = '#3BC2C3';
    var CAP = BRAND.under.h / 2;
    var DASH = 104; // half-width of the `-` mouth — matches the squashed o
    var liftT    = tw(128, 8, 0, 1, 'easeInOutCubic');
    var squeezeT = tw(136, 7, 0, 1, 'easeInOutCubic');
    var bendT    = tw(143, 13, 0, 1, 'easeInOutCubic');
    if (frame >= 122 && frame < 186) {
      // Gradient capsule fades as the identical-silhouette stroke takes over.
      kids.push.apply(kids, tealBar(1 - tw(122, 5, 0, 1, 'linear')));
      // `_` lifts, purses to `-`, then curls into `o`.
      var barX0 = lerp(lerp(BRAND.under.x + CAP, OX - DASH, squeezeT),
        NX - OR, bendT);
      var barX1 = lerp(
        lerp(BRAND.under.x + BRAND.under.w - CAP, OX + DASH, squeezeT),
        NX + OR, bendT);
      var barY = lerp(lerp(UY, 644, liftT), NY, bendT);
      var bend = bendPoints(barX0, barY, barX1,
        lerp(OX, NX, bendT), lerp(644, NY, bendT), OR, bendT, 32);
      // The blink cycle: the mouth closes flat to a dash and pops open.
      if (mouthSq > 0) {
        for (var qi = 0; qi < bend.length; qi++) {
          bend[qi] = { x: bend[qi].x, y: lerp(bend[qi].y, NY, mouthSq) };
        }
      }
      kids.push(polylineNode(bend, BRAND.under.h, 1, oColor, 1));
    }

    // ---- The assembly: the eye becomes the F, the note becomes the a ----
    // (186..236). The two arms fold into ONE vertical line — the eye opens
    // into a stem — which slides up into place as the F's stem. From its
    // top the top bar winds out around a rounded elbow; from its very
    // center a new line grows out — the accent, the note's teal, the
    // underscore's legacy. Meanwhile the `o` drops and swells into the
    // `a`'s bowl: the wink becomes the word.
    var aBowlColor = '#2EBD9E';
    if (frame >= 186) {
      var f = BRAND.f;
      var scx = f.stemX + f.w / 2;
      var stop = f.top + f.w / 2;
      var sbot = f.bottom - f.w / 2;
      var smid = (stop + sbot) / 2;
      var settle = tw(198, 18, 0, 1, 'linear');
      var armBlue = lerpColor(colors.blueBright, colors.blue, settle);
      var armDeep = lerpColor(colors.blueDeep, colors.blue, settle);
      // The fold: upper arm → upper half of the stem line, lower arm → the
      // lower half. They meet at the stem's middle, caps overlapping.
      var upA = { x: BRAND.chevron.a1[0], y: BRAND.chevron.a1[1] };
      var vt = { x: BRAND.chevron.a1[2], y: BRAND.chevron.a1[3] };
      var loA = { x: BRAND.chevron.a2[2], y: BRAND.chevron.a2[3] };
      kids.push(polylineNode([
        { x: lerp(upA.x, scx, foldT), y: lerp(upA.y, stop, foldT) },
        { x: lerp(vt.x, scx, foldT), y: lerp(vt.y, smid, foldT) },
      ], f.w, 1, armBlue, 1));
      kids.push(polylineNode([
        { x: lerp(vt.x, scx, foldT), y: lerp(vt.y, smid, foldT) },
        { x: lerp(loA.x, scx, foldT), y: lerp(loA.y, sbot, foldT) },
      ], f.w, 1, armDeep, 1));
      // Top bar: winds out of the stem's top around a rounded elbow.
      var topP = tw(198, 14, 0, 1, 'easeInOutCubic');
      if (topP > 0.001) {
        kids.push(trace(
          'M' + scx + ',' + (stop + 44) +
            ' L' + scx + ',' + (stop + 22) +
            ' Q' + scx + ',' + stop + ' ' + (scx + f.w / 2) + ',' + stop +
            ' L' + (f.topX2 - f.w / 2) + ',' + stop,
          f.w, scx, stop, f.topX2 - f.stemX, 44, topP, colors.blue, 1));
      }
      // The accent: a new line growing out of the stem's center.
      var accP = tw(206, 14, 0, 1, 'easeInOutCubic');
      if (accP > 0.001) {
        var acc = f.accent;
        var accY = acc.y + acc.h / 2;
        var accX2 = acc.x + acc.w - acc.h / 2;
        kids.push(trace(
          'M' + scx + ',' + accY + ' L' + accX2 + ',' + accY,
          acc.h, scx, accY, accX2 - scx, 0, accP, oColor, 1));
      }
      // The `o` drops and swells into the `a`'s bowl.
      var bowlT = tw(196, 16, 0, 1, 'easeInOutCubic');
      var bowl = ringPoints(
        lerp(NX, BRAND.a.bowl.cx, bowlT),
        lerp(NY, BRAND.a.bowl.cy, bowlT),
        lerp(OR, BRAND.a.bowl.r, bowlT), 32);
      kids.push(polylineNode(bowl, 38, 1,
        lerpColor(oColor, aBowlColor, bowlT), 1));
    }

    // ---- Beat 11: the `a`'s stem (212..228) ---------------------------------
    // The bowl IS the note (it arrived as the ring). The stem draws down
    // from it in micro-segments whose color glides green → cyan — the `a`
    // carries the brand gradient instead of switching between its anchors.
    var stemP = tw(212, 16, 0, 1, 'easeInOutCubic');
    if (stemP > 0.001) {
      var segs = 8;
      var aStem = BRAND.a.stem;
      var segH = aStem.h / segs;
      for (var si = 0; si < segs; si++) {
        var sp = jsr.motion.clamp(stemP * segs - si, 0, 1);
        if (sp <= 0) continue;
        // Bottom-up: the stem grows out of the bowl's shoulder — green at
        // the junction, cyan at the free top end. Drawing upward keeps the
        // newborn stroke attached to the bowl.
        var sy0 = aStem.y + aStem.h - (si + 1) * segH;
        kids.push(trace(
          'M' + aStem.x + ',' + (sy0 + segH) + ' L' + aStem.x + ',' + sy0,
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
    var bloomP = tw(228, 12, 0, 1, 'easeOutExpo');
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
