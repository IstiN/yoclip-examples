// The Fa brand morph — one 240-frame shot:
//
//   01  0–40    the app tile: white rounded square, `>_` inside, soft halo
//   02  40–78   glitch dissolve — the tile shreds into horizontal slices
//               flying right, blue/teal streaks tagging the glyph bands
//   05  75–100  the bare prompt re-centers and grows (streak residue fades)
//   06  92–108  glow pulse around the chevron
//   07  108–150 morph: chevron arms split away, the F stem + top bar stamp
//               in, the teal underscore glides up-left into the F accent
//   11  150–192 the `a` writes itself — arc trace for the bowl, stem trace
//   16  192–240 settle: breathing mark, ground glow, final teal bloom
//
// Everything is placed through the shared svg→screen mapper (lib/brand.js),
// so scale/anchor animation never breaks continuity between the pieces.

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

    // ---- The mapper: which svg point sits at screen center, and how big --
    // Icon phase: the glyph center rides the icon center at icon scale.
    // Frame 75: the bare prompt grows (easeOutExpo). Frame 108: the
    // WORDMARK center takes over as the anchor and the scale settles.
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
    var ax = 520 + (634 - 520) * anchorT;
    var ay = 592 + (547 - 592) * anchorT;
    setMapper(k, ax, ay, 960, 540);

    var kids = [];

    // ---- Backdrop ---------------------------------------------------------
    // A faint cool wash keeps the dark field from feeling flat.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#0a0f1c',
      opacity: 0.55, positioned: { left: 0, top: 0 },
    });

    // ---- The halo ----------------------------------------------------------
    // White halo behind the tile, teal glow behind the wordmark later.
    var haloWhiteP = Math.min(1, tw(0, 300, 0.6, 1, 'linear')) *
        (1 - tw(108, 40, 0, 1, 'easeInOutCubic'));
    var haloTealP = tw(108, 50, 0, 1, 'easeOutExpo');
    if (haloWhiteP > 0.01) {
      var hw = 540 * k;
      kids.push({
        type: 'circle', size: hw,
        fill: '#ffffff',
        opacity: 0.05 * haloWhiteP,
        positioned: { left: 960 - hw / 2, top: 540 - hw / 2 },
      });
    }
    if (haloTealP > 0.01) {
      var hc = brandToScreen(577, 547);
      var htw = 760 * k * (0.8 + 0.2 * haloTealP);
      kids.push({
        type: 'circle', size: htw,
        fill: '#48C7E8',
        opacity: 0.05 * haloTealP *
            (0.8 + 0.2 * jsr.motion.wave(ms, 3600, 1, 0)),
        positioned: { left: hc.x - htw / 2, top: hc.y - htw / 2 },
      });
    }

    // ---- Beat 01: the tile (0..78) -----------------------------------------
    var dissolveT = tw(40, 30, 0, 1, 'easeInOutCubic');
    var tileLife = 1 - dissolveT;
    if (dissolveT <= 0.001) {
      // The whole tile — one rounded rect with its subtle edge stroke.
      var tl = brandToScreen(16, 16);
      kids.push({
        type: 'rect',
        width: 992 * k, height: 992 * k, radius: 224 * k,
        fill: colors.iconLight,
        stroke: colors.iconEdge, strokeWidth: Math.max(2.5, 10 * k),
        opacity: 1,
        positioned: { left: tl.x, top: tl.y },
      });
    } else if (tileLife > 0.01) {
      // The tile shreds from the right edge: each slice keeps its left edge
      // and thins away with a rightward throw. Bright to the last moment —
      // each slice fades only by its own p (no global dim on top).
      var bands = 12;
      var bandH = 992 / bands;
      for (var i = 0; i < bands; i++) {
        var at = 40 + prand(i) * 16;
        var p = jsr.motion.tween(ms, at * 1000 / 30, 26 * 1000 / 30, 0, 1, 'easeInCubic');
        if (p >= 1) continue;
        var ySvg = 16 + i * bandH;
        var pt = brandToScreen(16, ySvg);
        var wSvg = 992 * (1 - p);
        kids.push({
          type: 'rect',
          width: Math.max(wSvg * k, 2),
          height: Math.max(bandH * k - 2, 2),
          radius: 10 * k,
          fill: colors.iconLight,
          opacity: 1 - p * 0.45,
          positioned: { left: pt.x, top: pt.y + 1 },
        });
      }
      // The tile's leading edge streaks while it shreds, in white, blue and
      // teal — the glyph bands and underscore band tag their own colors.
      for (var s = 0; s < 5; s++) {
        var st = streak(s, 80 + prand(s + 40) * 860, 1010,
          120 + prand(s + 80) * 260, 8 + prand(s + 120) * 10,
          colors.iconLight, frame, 30, 42 + s * 3, 30);
        if (st != null) kids.push(st);
      }
      for (var g = 0; g < 4; g++) {
        var gy = 434 + g * 54;
        var gs = streak(g + 30, gy, 460 + g * 40,
          140 + prand(g + 60) * 180, 10 + prand(g + 90) * 8,
          g % 2 == 0 ? colors.blue : colors.teal, frame, 30, 46 + g * 4, 28);
        if (gs != null) kids.push(gs);
      }
      for (var u = 0; u < 2; u++) {
        var us = streak(u + 50, 718 + u * 26, 500 + u * 80, 120, 12,
          colors.tealLight, frame, 30, 52 + u * 6, 26);
        if (us != null) kids.push(us);
      }
    }

    // ---- The chevron (01..07): two butt-capped polygon arms, blue split ---
    // Top arm keeps the lighter stop, bottom arm blends toward #3566FF —
    // flat fills per arm, the eye reads the pair as the gradient. During
    // the morph the arms drift apart (the centerlines themselves shift) and
    // die into blue streaks.
    var armLife = 1 - tw(108, 14, 0, 1, 'easeInCubic');
    if (armLife > 0.01) {
      var spread = tw(108, 16, 0, 30, 'easeInCubic');
      var halves = chevronHalves(spread, colors.blue, '#3D6BF8');
      halves[0].opacity = armLife;
      kids.push(halves[0]);
      halves[1].opacity = armLife;
      kids.push(halves[1]);
      if (frame >= 106) {
        for (var b = 0; b < 3; b++) {
          var bs = streak(b, 470 + b * 60, 500, 200 + prand(b + 7) * 160, 12,
            b % 2 == 0 ? colors.blue : colors.blueDeep, frame, 30, 106 + b * 2, 26);
          if (bs != null) kids.push(bs);
        }
      }
    }

    // ---- The underscore → F accent (continuous through the whole film) -----
    var tealM = Math.min(1, tw(110, 30, 0, 1, 'easeInOutCubic'));
    kids.push.apply(kids, tealBar(tealM, 1));

    // ---- Beat 07: the F materializes (108..150) -----------------------------
    // Stem and top bar draw from ONE aligned y-band gradient (see
    // pushFRect): the corner they share has the exact same band color on
    // both pieces — no seam, no color break.
    var stemP = tw(118, 14, 0, 1, 'backOut');
    if (stemP > 0.01) {
      var fStem = BRAND.f.stem;
      pushFRect(kids, fStem.x, fStem.w, fStem.y,
        fStem.y + fStem.h * stemP, Math.min(1, tw(118, 5, 0, 1, 'linear')));
    }
    var topP = tw(128, 12, 0, 1, 'backOut');
    if (topP > 0.01) {
      var fTop = BRAND.f.top;
      pushFRect(kids, fTop.x, fTop.w * topP, fTop.y, fTop.y + fTop.h,
        Math.min(1, tw(128, 5, 0, 1, 'linear')));
    }

    // ---- Beat 11: the `a` writes itself (150..192) --------------------------
    var bowlP = tw(152, 26, 0, 1, 'easeInOutCubic');
    if (bowlP > 0.01) {
      var bowl = BRAND.a.bowl;
      var d = 'M' + bowl.cx + ',' + (bowl.cy - bowl.r) +
        ' A' + bowl.r + ',' + bowl.r + ' 0 1 1 ' + bowl.cx + ',' + (bowl.cy + bowl.r) +
        ' A' + bowl.r + ',' + bowl.r + ' 0 1 1 ' + bowl.cx + ',' + (bowl.cy - bowl.r);
      kids.push(trace(d, 38, bowl.cx - bowl.r, bowl.cy - bowl.r,
        bowl.r * 2, bowl.r * 2, bowlP, '#2EBD9E'));
    }
    var aStemP = tw(170, 14, 0, 1, 'easeInOutCubic');
    if (aStemP > 0.01) {
      var aStem = BRAND.a.stem;
      kids.push(trace(
        'M' + aStem.x + ',' + aStem.y + ' L' + aStem.x + ',' + (aStem.y + aStem.h),
        38, aStem.x, aStem.y, 0, aStem.h, aStemP, '#48C7E8'));
    }
    if (frame >= 150 && frame < 162) {
      for (var t = 0; t < 3; t++) {
        var ts = streak(t, 600 + t * 40, 830, 140 + prand(t + 21) * 120, 10,
          '#48C7E8', frame, 30, 150 + t * 2, 22);
        if (ts != null) kids.push(ts);
      }
    }

    // ---- Beat 16: settle + the final bloom (192..240) ------------------------
    var settleP = tw(196, 30, 0, 1, 'easeOutExpo');
    if (settleP > 0.01) {
      // Ground glow: a flat teal bar under the baseline, breathing wide,
      // centered on the finished wordmark.
      var gb = brandToScreen(724, 742);
      var gw = (560 + 30 * jsr.motion.wave(ms, 2800, 1, 0)) * k;
      kids.push({
        type: 'rect',
        width: gw, height: 10 * k,
        radius: 5 * k,
        fill: '#48C7E8',
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
      var fb = brandToScreen(760, 700);
      kids.push({
        type: 'circle',
        size: 90 * k * (1 + 0.25 * (1 - bloomP)),
        fill: '#eafffb',
        opacity: 0.6 * bloomP * (1 - bloomP),
        positioned: { left: fb.x - 45 * k, top: fb.y - 45 * k },
      });
      kids.push({
        type: 'rect',
        width: 900 * k * bloomP, height: 3,
        radius: 1.5,
        fill: '#bffaf1',
        opacity: 0.5 * (1 - bloomP * 0.55),
        positioned: { left: fb.x - 450 * k * bloomP, top: fb.y + 42 * k },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
