// The Fa brand morph — one 240-frame shot:
//
//   01  0–40    the app icon: dark-glass rounded square, `>_` inside, the
//               underscore pulsing like a terminal cursor
//   02  40–74   boot scan — one teal line sweeps the icon top to bottom,
//               its edge lifting as the line passes (no shattering: the
//               icon is the stage, it stays)
//   05  75–100  the icon grows to hero scale (the composition zooms in)
//   06  96–110  a soft teal band breathes over the glyph row — the cue
//   07  108–150 morph: chevron arms split away, the F writes itself as one
//               round-capped stroke (stem up, bar right), the teal
//               underscore glides up-left into the F accent
//   11  150–192 the `a` writes itself — arc trace for the bowl, stem trace
//   16  192–240 settle: ground glow, final teal bloom — the finished icon
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

    // ---- The underscore → F accent (continuous through the whole film) -----
    // It pulses like a terminal cursor until the morph takes it.
    var tealM = Math.min(1, tw(110, 30, 0, 1, 'easeInOutCubic'));
    var cursorP = frame < 110
      ? 1 - 0.22 * (0.5 + 0.5 * jsr.motion.wave(ms, 950, 1, 0))
      : 1;
    kids.push.apply(kids, tealBar(tealM, cursorP));

    // ---- Beat 07: the F writes itself (118..144) ---------------------------
    // One round-capped stroke: up the stem, right across the top bar. The
    // elbow rounds like a drawn letterform — no seams anywhere.
    var fP = tw(118, 26, 0, 1, 'easeInOutCubic');
    if (fP > 0.001) {
      kids.push(fPathNode(fP, colors.blue,
        Math.min(1, tw(118, 5, 0, 1, 'linear'))));
    }

    // ---- Beat 11: the `a` writes itself (150..192) --------------------------
    var bowlP = tw(152, 26, 0, 1, 'easeInOutCubic');
    if (bowlP > 0.01) {
      var bowl = BRAND.a.bowl;
      var d = 'M' + bowl.cx + ',' + (bowl.cy - bowl.r) +
        ' A' + bowl.r + ',' + bowl.r + ' 0 1 1 ' + bowl.cx + ',' + (bowl.cy + bowl.r) +
        ' A' + bowl.r + ',' + bowl.r + ' 0 1 1 ' + bowl.cx + ',' + (bowl.cy - bowl.r);
      kids.push(trace(d, 38, bowl.cx - bowl.r, bowl.cy - bowl.r,
        bowl.r * 2, bowl.r * 2, bowlP, colors.teal));
    }
    var aStemP = tw(170, 14, 0, 1, 'easeInOutCubic');
    if (aStemP > 0.01) {
      var aStem = BRAND.a.stem;
      kids.push(trace(
        'M' + aStem.x + ',' + aStem.y + ' L' + aStem.x + ',' + (aStem.y + aStem.h),
        38, aStem.x, aStem.y, 0, aStem.h, aStemP, colors.tealLight));
    }
    if (frame >= 150 && frame < 162) {
      for (var t = 0; t < 3; t++) {
        var ts = streak(t, 600 + t * 40, 780, 140 + prand(t + 21) * 120, 10,
          colors.tealLight, frame, 30, 150 + t * 2, 22);
        if (ts != null) kids.push(ts);
      }
    }

    // ---- Beat 16: settle + the final bloom (192..240) ------------------------
    var settleP = tw(196, 30, 0, 1, 'easeOutExpo');
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
    var bloomP = tw(216, 24, 0, 1, 'easeOutExpo');
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
