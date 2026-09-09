// 03 — Hardware — the Studio chip-moment: the agent IS the hardware.
//
//   ·  0–14    black; one violet light point breathes in at the tile's
//              top-left corner
//   ·  14–74   the light TRACES the tile's rounded-square outline — four
//              staggered perimeter segments (a corner arc plus a full edge
//              apiece, so all four fronts run at one even speed), the color
//              walking violet → tealLight along the path; every crisp line
//              rides a thicker 0.15-opacity glow twin, and the light head
//              itself travels each drawing front
//   ·  74–110  the tile FILLS: the dark-glass rect fades in under the
//              finished outline, the mapper settles k 0.42 → 0.371
//              (easeOutExpo), a violet wash blooms behind the glass and one
//              soft teal band sweeps it top to bottom
//   ·  96–190  the MATERIALIZATION — the face writes on inside the glass:
//              chevron eye, ring eye, underscore mouth. At 150 the mouth
//              flies up and bends into the ring (bendPoints) so the face
//              reads `>o`; then the chevron folds into the F stem,
//              fPathNode writes the F, the ring swells into the a's bowl,
//              the stem traces on and the teal accent arrives — the FULL
//              Fa wordmark, composed inside the tile
//   ·  150–210 the wordmark settles; `Fa is the agent.` rises in below the
//              tile (Roboto 700, easeOutExpo) and a teal bloom pulses at
//              the a's bowl
//
// Face choreography compressed from fa_logo_morph 03_code_face (chevPoints
// draw-on, the note bend, the fold-into-the-stem handoff, the stem
// segments); all brand geometry goes through lib/brand.js, so the icon this
// beat ends on IS the film's icon — the same tile 08_lockup signs off with.

scene = {
  id: '03_hardware',
  duration: 210,
  from: 390,
  timeline: {
    label: 'Hardware',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to,
        easing);
    }

    // The `>` eye's centerline — two strokes meeting at the right vertex
    // (scene-local copy from fa_logo_morph 03_code_face; scenes share no
    // state).
    function chevPoints(cx, cy, w, h, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        if (t < 0.5) {
          var u = t / 0.5; // 0..1 along the top arm
          pts.push({ x: cx - w + 2 * w * u, y: cy - h + h * u });
        } else {
          var v = (t - 0.5) / 0.5; // 0..1 along the bottom arm
          pts.push({ x: cx + w - 2 * w * v, y: cy + h * v });
        }
      }
      return pts;
    }

    // Point-matched polyline morph.
    function morphPts(a, b, t) {
      var out = [];
      for (var i = 0; i < a.length; i++) {
        out.push({ x: lerp(a[i].x, b[i].x, t), y: lerp(a[i].y, b[i].y, t) });
      }
      return out;
    }

    // Quarter-circle arc (the tile's rounded corners).
    function arcPts(cx, cy, r, a0, a1, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return pts;
    }

    // ---- The mapper --------------------------------------------------------
    // k holds 0.42 while the light draws the outline, then settles to the
    // film's 0.371 as the glass arrives — tile center pinned at screen
    // center, like the morph film.
    var k = lerp(0.42, 0.371, tw(74, 36, 0, 1, 'easeOutExpo'));
    setMapper(k, BRAND.anchor[0], BRAND.anchor[1], 960, 540);

    var kids = [];

    // Background.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    // ---- 74–110: the glass fills, the wash, the sweep ----------------------
    var T = BRAND.tile;
    var rx = T.rx;

    var tileA = 0.96 * tw(74, 30, 0, 1, 'easeOut');
    if (tileA > 0.003) {
      var tl = brandToScreen(T.x, T.y);
      kids.push({
        type: 'rect',
        width: T.w * k, height: T.h * k,
        radius: T.rx * k,
        fill: '#17223B',
        stroke: '#2E3C5F',
        strokeWidth: Math.max(2, 5.5 * k),
        opacity: tileA,
        positioned: { left: tl.x, top: tl.y },
      });
    }

    // The spark's afterglow: a soft violet wash behind the glass while it
    // powers on, gone before the face writes.
    var washA = tw(74, 14, 0, 1, 'easeOut') *
      (1 - tw(98, 26, 0, 1, 'easeInOutCubic'));
    if (washA > 0.003) {
      var washS = 1150 * k;
      kids.push({
        type: 'circle', size: washS, fill: C.violet,
        opacity: 0.12 * washA, blur: 80,
        positioned: { left: 960 - washS / 2, top: 540 - washS / 2 },
      });
    }

    // One soft teal band sweeps the glass, top to bottom. The band is inset
    // inside the tile on both axes and its opacity is a sine envelope, so
    // it never spills past the rounded corners.
    var sweep = tw(88, 38, 0, 1, 'easeInOutCubic');
    if (sweep > 0.001 && sweep < 0.999) {
      var bandH = 64;
      var bySvg = lerp(T.y + 84, T.y + T.h - 84 - bandH, sweep);
      var bp = brandToScreen(T.x + 42, bySvg);
      kids.push({
        type: 'rect',
        width: (T.w - 84) * k, height: bandH * k,
        radius: bandH * k / 2,
        fill: C.tealLight, blur: 14,
        opacity: Math.sin(Math.PI * sweep) * 0.10,
        positioned: { left: bp.x, top: bp.y },
      });
    }

    // ---- 0–74: the light point, then the outline trace ---------------------
    var OUT_SW = 13;
    var traceFade = 1 - tw(76, 20, 0, 1, 'easeInOutCubic'); // hands off to the glass stroke
    var headFade = 1 - tw(68, 8, 0, 1, 'easeInOutCubic');   // the light dies into the line

    // The idle point: breathes in at the tile's top-left corner, then slides
    // down onto the trace's start point as the first front takes over.
    var ptIn = tw(2, 10, 0, 1, 'easeOut');
    var ptA = 0.85 * ptIn * (1 - tw(14, 5, 0, 1, 'easeInOutCubic'));
    if (ptA > 0.003) {
      var ip = brandToScreen(T.x,
        lerp(T.y, T.y + rx, tw(12, 7, 0, 1, 'easeInOutCubic')));
      var ih = 44 * (0.4 + 0.6 * ptIn);
      kids.push({
        type: 'circle', size: ih, fill: C.violet,
        opacity: 0.16 * ptA, blur: 26,
        positioned: { left: ip.x - ih / 2, top: ip.y - ih / 2 },
      });
      var ic = 13 * (0.5 + 0.5 * ptIn);
      kids.push({
        type: 'circle', size: ic, fill: '#F2F6FF',
        opacity: ptA, blur: 6,
        positioned: { left: ip.x - ic / 2, top: ip.y - ic / 2 },
      });
    }

    // Four staggered perimeter segments, clockwise from the top-left corner:
    // each is one rounded corner plus one full edge — equal lengths, so one
    // draw speed reads even. Segment i starts 11 frames after i-1, so two
    // fronts are always running and the outline closes as one continuous
    // circuit.
    var SEGS = [
      arcPts(T.x + rx, T.y + rx, rx, Math.PI, Math.PI * 1.5, 10)
        .concat([{ x: T.x + T.w - rx, y: T.y }]),
      arcPts(T.x + T.w - rx, T.y + rx, rx, Math.PI * 1.5, Math.PI * 2, 10)
        .concat([{ x: T.x + T.w, y: T.y + T.h - rx }]),
      arcPts(T.x + T.w - rx, T.y + T.h - rx, rx, 0, Math.PI * 0.5, 10)
        .concat([{ x: T.x + rx, y: T.y + T.h }]),
      arcPts(T.x + rx, T.y + T.h - rx, rx, Math.PI * 0.5, Math.PI, 10)
        .concat([{ x: T.x, y: T.y + rx }]),
    ];
    for (var sgi = 0; sgi < SEGS.length; sgi++) {
      var sprog = tw(14 + sgi * 11, 26, 0, 1, 'easeInOutCubic');
      if (sprog <= 0 || traceFade <= 0.003) continue;
      var segPts = SEGS[sgi];
      // The color walks violet → tealLight along the whole path.
      var segCol = lerpColor(C.violet, C.tealLight, (sgi + sprog) / 4);
      // Glow twin under the crisp line.
      kids.push(polylineNode(segPts, OUT_SW * 2.4, sprog, segCol,
        0.15 * traceFade));
      kids.push(polylineNode(segPts, OUT_SW, sprog, segCol, traceFade));
      // The light head rides this front while it draws.
      if (sprog < 1 && headFade > 0.003) {
        var fi = sprog * (segPts.length - 1);
        var wi = Math.floor(fi);
        var hp = wi + 1 < segPts.length
          ? { x: lerp(segPts[wi].x, segPts[wi + 1].x, fi - wi),
              y: lerp(segPts[wi].y, segPts[wi + 1].y, fi - wi) }
          : segPts[segPts.length - 1];
        var hpt = brandToScreen(hp.x, hp.y);
        var hh = 40;
        kids.push({
          type: 'circle', size: hh, fill: segCol,
          opacity: 0.20 * headFade, blur: 22,
          positioned: { left: hpt.x - hh / 2, top: hpt.y - hh / 2 },
        });
        var hc = 11;
        kids.push({
          type: 'circle', size: hc, fill: '#F2F6FF',
          opacity: 0.95 * headFade, blur: 5,
          positioned: { left: hpt.x - hc / 2, top: hpt.y - hc / 2 },
        });
      }
    }

    // ---- 96–190: the face materializes -------------------------------------
    var N = 24;
    var FACE = C.violetBright;
    var breathe = 1 + 0.10 * Math.sin((ms / 3400) * Math.PI * 2);

    // The chevron eye — the `>`, written on at its face slot; at 178 it
    // folds onto the F's stem (point-matched shrink) and hands off to the
    // F stroke writing through it.
    var chevFace = chevPoints(319, 420, 100, 108, N);
    var chevP = tw(96, 30, 0, 1, 'easeInOutCubic');
    var foldT = tw(178, 26, 0, 1, 'easeInOutCubic');
    var chevGone = tw(184, 20, 0, 1, 'easeInOutCubic');
    if (chevP > 0.001 && chevGone < 0.999) {
      var chevPts = morphPts(chevFace, chevPoints(290, 468, 30, 34, N), foldT);
      var chevCol = lerpColor(FACE, C.blue, foldT);
      var chevSw = lerp(34, 48, foldT);
      var chevA = 1 - chevGone;
      kids.push(polylineNode(chevPts, chevSw * 2.2, chevP, chevCol,
        0.15 * breathe * chevA));
      kids.push(polylineNode(chevPts, chevSw, chevP, chevCol, chevA));
    }

    // The ring eye — the `o`, written on from the top; it dims away as the
    // mouth-ring arrives to absorb it (the two coincide, so the swap is
    // invisible).
    var EYE = { x: 705, y: 420, r: 118 };
    var ringP = tw(106, 30, 0, 1, 'easeInOutCubic');
    var ringDim = tw(158, 22, 0, 1, 'easeInOutCubic');
    if (ringP > 0.001 && ringDim < 0.999) {
      var eyePts = ringPoints(EYE.x, EYE.y, EYE.r, N);
      kids.push(polylineNode(eyePts, 34 * 2.2, ringP, FACE,
        0.15 * breathe * (1 - ringDim)));
      kids.push(polylineNode(eyePts, 34, ringP, FACE, 1 - ringDim));
    }

    // The mouth: the underscore bar writes on in its brand slot, lifts, and
    // BENDS into the ring (the note bend) — from ~176 the face reads `>o`.
    // The merged ring then leaves for the a's bowl: center, radius and
    // color morph over while the stem traces on beside it. The flare is the
    // absorption pulse; the bloom (195+) rides the ring's live center so it
    // lands exactly when the bowl does.
    var mouthP = tw(120, 22, 0, 1, 'easeInOutCubic');
    var flyT = tw(150, 14, 0, 1, 'easeInOutCubic');
    var bendAt = tw(158, 26, 0, 1, 'easeInOutCubic');
    var bowlT = tw(184, 22, 0, 1, 'easeInOutCubic');
    var bowlColT = tw(184, 16, 0, 1, 'easeInOutCubic');
    var pulse = tw(176, 10, 0, 1, 'easeOut') *
      (1 - tw(184, 10, 0, 1, 'easeInOutCubic'));
    if (mouthP > 0.001) {
      var mCol = lerpColor(FACE, '#2EBD9E', bowlColT);
      var mSw = 38 * (1 + 0.10 * pulse);
      var mPts;
      if (bowlT > 0) {
        // The ring IS the bowl-in-progress: it swells/settles into place.
        mPts = ringPoints(
          lerp(EYE.x, BRAND.a.bowl.cx, bowlT),
          lerp(EYE.y, BRAND.a.bowl.cy, bowlT),
          lerp(EYE.r, BRAND.a.bowl.r, bowlT), N);
      } else {
        // Straight bar (t=0 of the bend) flying up, then bending closed.
        var bx0 = lerp(BRAND.under.x, EYE.x - EYE.r, flyT);
        var bx1 = lerp(BRAND.under.x + BRAND.under.w, EYE.x + EYE.r, flyT);
        var byy = lerp(BRAND.under.y + BRAND.under.h / 2, EYE.y, flyT);
        mPts = bendPoints(bx0, byy, bx1, EYE.x, EYE.y, EYE.r, bendAt, N);
      }
      // The bloom first (under the stroke): glow rings + a soft core.
      var bloomP = tw(198, 12, 0, 1, 'easeOut');
      if (bloomP > 0.001) {
        var bC = brandToScreen(
          lerp(EYE.x, BRAND.a.bowl.cx, bowlT),
          lerp(EYE.y, BRAND.a.bowl.cy, bowlT));
        var bR = lerp(EYE.r, BRAND.a.bowl.r, bowlT);
        kids.push(polylineNode(
          ringPoints(BRAND.a.bowl.cx, BRAND.a.bowl.cy, bR, N),
          lerp(60, 120, bloomP), 1, C.tealLight, 0.07 * (1 - bloomP)));
        kids.push(polylineNode(
          ringPoints(BRAND.a.bowl.cx, BRAND.a.bowl.cy, bR, N),
          lerp(30, 70, bloomP), 1, C.tealLight, 0.18 * (1 - bloomP)));
        var bHalo = 260 * k * (0.5 + 0.5 * bloomP);
        kids.push({
          type: 'circle', size: bHalo, fill: C.tealLight,
          opacity: 0.14 * (1 - bloomP), blur: 40,
          positioned: { left: bC.x - bHalo / 2, top: bC.y - bHalo / 2 },
        });
        var bCore = 60 * k * (1 + bloomP);
        kids.push({
          type: 'circle', size: bCore, fill: C.tealSpark,
          opacity: 0.45 * (1 - bloomP), blur: 18,
          positioned: { left: bC.x - bCore / 2, top: bC.y - bCore / 2 },
        });
      }
      kids.push(polylineNode(mPts, mSw * 2.2, mouthP, mCol,
        0.16 * breathe));
      kids.push(polylineNode(mPts, mSw, mouthP, mCol, 1));
    }

    // The F writes itself through the folded chevron: up the stem, then
    // right across the top bar — brand blue, one round-capped stroke.
    var fP = tw(181, 26, 0, 1, 'easeInOutCubic');
    if (fP > 0.001) {
      kids.push(fPathNode(fP, C.blue, 1));
    }

    // The teal accent fades in under the finished F (the brand's bar).
    var accentA = tw(182, 16, 0, 1, 'easeOut');
    if (accentA > 0.003) {
      var accentKids = tealBar(accentA);
      for (var ak = 0; ak < accentKids.length; ak++) kids.push(accentKids[ak]);
    }

    // The a's stem: gradient segments growing up out of the bowl
    // (teal → tealLight, bottom-up write-on — the morph's stem pattern).
    var stemP = tw(188, 20, 0, 1, 'easeInOutCubic');
    if (stemP > 0.001) {
      var segs = 8;
      var aStem = BRAND.a.stem;
      var segH = aStem.h / segs;
      for (var si = 0; si < segs; si++) {
        var segSp = jsr.motion.clamp(stemP * segs - si, 0, 1);
        if (segSp <= 0) continue;
        var sy0 = aStem.y + aStem.h - (si + 1) * segH;
        kids.push(trace(
          'M' + aStem.x + ',' + (sy0 + segH) + ' L' + aStem.x + ',' + sy0,
          38, aStem.x, sy0, 0, segH, segSp,
          lerpColor('#2EBD9E', '#48C7E8', si / (segs - 1))));
      }
    }

    // A faint vignette keeps the edges quiet (above the mark, below the
    // line — the message stays brightest).
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.10,
      positioned: { left: 0, top: 0 },
    });

    // ---- 150–210: the type beat --------------------------------------------
    var typeIn = tw(150, 46, 0, 1, 'easeOutExpo');
    if (typeIn > 0.003) {
      kids.push({
        type: 'text',
        text: 'Fa is the agent.',
        width: 1920,
        opacity: typeIn,
        offsetY: 30 * (1 - typeIn), // rises 30 → 0 (letterSpacing is static)
        style: {
          fontSize: 64,
          color: '#EAEAF2',
          fontFamily: 'Roboto',
          fontWeight: '700',
          letterSpacing: 3,
          textAlign: 'center',
          textShadows: [{ color: '#8C000000', blur: 26 }],
        },
        positioned: { left: 0, top: 784 }, // clear of the tile's bottom edge
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
