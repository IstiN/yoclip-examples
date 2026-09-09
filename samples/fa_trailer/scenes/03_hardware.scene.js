// 03 — Hardware — the chip-moment beat, hero = the agent.
//
// Direct 1:1 remake of Apple's M5 MAX / M5 ULTRA chip reveal:
//   ·  0–14:    black; a single violet light point breathes in at corner
//   ·  14–74:   outline trace: 4 staggered perimeter segments along the tile
//   ·  74–110:  dark-glass tile fills with specular sweep and settles in center
//   ·  96–190:  the materialization: chevron eye + ring eye -> >o -> F stem + a bowl
//   ·  150–210: Apple-grade architectural spec callout below the chip:
//               "OUR MOST POWERFUL" / "AGENT." in metallic silver & purple
//
// Background: #070a12, mapper centered at (960, 420).

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
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function chevPoints(cx, cy, w, h, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        if (t <= 0.5) {
          var u = t / 0.5;
          pts.push({ x: cx - w * u, y: cy - h * (1 - u) });
        } else {
          var v = (t - 0.5) / 0.5;
          pts.push({ x: cx + w - 2 * w * v, y: cy + h * v });
        }
      }
      return pts;
    }

    function morphPts(a, b, t) {
      var out = [];
      for (var i = 0; i < a.length; i++) {
        out.push({ x: lerp(a[i].x, b[i].x, t), y: lerp(a[i].y, b[i].y, t) });
      }
      return out;
    }

    function arcPts(cx, cy, r, a0, a1, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return pts;
    }

    // Settled scale slightly larger (k = 0.44) so the chip has genuine presence
    var k = lerp(0.50, 0.44, tw(74, 36, 0, 1, 'easeOutExpo'));
    setMapper(k, BRAND.anchor[0], BRAND.anchor[1], 960, 420);

    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    // ---- 74–110: the dark glass tile with iridescent glow -------------------
    var T = BRAND.tile;
    var rx = T.rx;

    var tileA = 0.98 * tw(74, 30, 0, 1, 'easeOut');
    if (tileA > 0.003) {
      var tl = brandToScreen(T.x, T.y);
      // Soft ambient shadow/bloom behind the chip
      kids.push({
        type: 'rect',
        width: T.w * k + 40, height: T.h * k + 40,
        radius: (T.rx + 20) * k,
        fill: '#8F6BFF',
        opacity: 0.18 * tileA,
        blur: 48,
        positioned: { left: tl.x - 20, top: tl.y - 20 },
      });
      // The chip body: deep obsidian glass
      kids.push({
        type: 'rect',
        width: T.w * k, height: T.h * k,
        radius: T.rx * k,
        fill: '#0C1322',
        stroke: '#2E3C5F',
        strokeWidth: Math.max(2, 6 * k),
        opacity: tileA,
        positioned: { left: tl.x, top: tl.y },
      });

      // Specular sweep across the chip surface
      var swP = tw(88, 38, 0, 1, 'easeInOutCubic');
      if (swP > 0.001 && swP < 0.999) {
        var swW = 160 * k;
        var swX = lerp(T.x - swW, T.x + T.w + swW, swP);
        var swPt = brandToScreen(swX, T.y + T.h / 2);
        var sweepA = 0.14 * Math.sin(swP * Math.PI);
        kids.push({
          type: 'rect',
          width: swW, height: T.h * k,
          fill: '#48C7E8',
          opacity: sweepA,
          rotation: -20,
          positioned: { left: swPt.x - swW / 2, top: tl.y },
        });
      }
    }

    // ---- 14–74: the perimeter outline trace --------------------------------
    var OUT_SW = 3.5;
    var traceFade = 1 - tw(76, 20, 0, 1, 'easeOut');
    var headFade = 1 - tw(70, 10, 0, 1, 'easeOut');
    var N_ARC = 8;

    var SEGS = [
      arcPts(T.x + rx, T.y + rx, rx, Math.PI, 1.5 * Math.PI, N_ARC)
        .concat([{ x: T.x + T.w - rx, y: T.y }]),
      arcPts(T.x + T.w - rx, T.y + rx, rx, 1.5 * Math.PI, 2 * Math.PI, N_ARC)
        .concat([{ x: T.x + T.w, y: T.y + T.h - rx }]),
      arcPts(T.x + T.w - rx, T.y + T.h - rx, rx, 0, 0.5 * Math.PI, N_ARC)
        .concat([{ x: T.x + rx, y: T.y + T.h }]),
      arcPts(T.x + rx, T.y + T.h - rx, rx, 0.5 * Math.PI, Math.PI, N_ARC)
        .concat([{ x: T.x, y: T.y + rx }]),
    ];
    for (var sgi = 0; sgi < SEGS.length; sgi++) {
      var sprog = tw(14 + sgi * 11, 26, 0, 1, 'easeInOutCubic');
      if (sprog <= 0 || traceFade <= 0.003) continue;
      var segPts = SEGS[sgi];
      var segCol = lerpColor(C.violet, C.tealLight, (sgi + sprog) / 4);
      kids.push(polylineNode(segPts, OUT_SW * 2.4, sprog, segCol, 0.15 * traceFade));
      kids.push(polylineNode(segPts, OUT_SW, sprog, segCol, traceFade));
      if (sprog < 1 && headFade > 0.003) {
        var fi = sprog * (segPts.length - 1);
        var wi = Math.floor(fi);
        var hp = wi + 1 < segPts.length
          ? { x: lerp(segPts[wi].x, segPts[wi + 1].x, fi - wi), y: lerp(segPts[wi].y, segPts[wi + 1].y, fi - wi) }
          : segPts[segPts.length - 1];
        var hpt = brandToScreen(hp.x, hp.y);
        kids.push({
          type: 'circle', size: 40, fill: segCol,
          opacity: 0.20 * headFade, blur: 22,
          positioned: { left: hpt.x - 20, top: hpt.y - 20 },
        });
        kids.push({
          type: 'circle', size: 11, fill: '#F2F6FF',
          opacity: 0.95 * headFade, blur: 5,
          positioned: { left: hpt.x - 5.5, top: hpt.y - 5.5 },
        });
      }
    }

    // ---- 96–190: the face materializes inside the chip ---------------------
    var N = 24;
    var chevFace = chevPoints(319, 420, 100, 108, N);
    var chevP = tw(96, 30, 0, 1, 'easeInOutCubic');
    var foldT = tw(178, 26, 0, 1, 'easeInOutCubic');
    var FSTEM_TOP = { x: 266, y: 372 };
    var FSTEM_BOT = { x: 266, y: 716 };
    var fStemPts = [];
    for (var fsi = 0; fsi <= N; fsi++) {
      var ft = fsi / N;
      fStemPts.push({ x: 266, y: lerp(FSTEM_TOP.y, FSTEM_BOT.y, ft) });
    }
    var chevLive = morphPts(chevFace, fStemPts, foldT);
    var chevCol = lerpColor(C.violetBright, C.blue, foldT);
    var chevFade = 1 - tw(190, 14, 0, 1, 'easeIn');
    if (chevP > 0.001 && chevFade > 0.003) {
      kids.push(polylineNode(chevLive, 38 * 2.2, chevP, chevCol, 0.16 * chevFade));
      kids.push(polylineNode(chevLive, 38, chevP, chevCol, chevFade));
    }

    // Eye ring -> note ring
    var EYE = { x: 705, y: 420, r: 118 };
    var eyeRingP = tw(106, 30, 0, 1, 'easeInOutCubic');
    var eyeFade = 1 - tw(168, 16, 0, 1, 'easeInOutCubic');
    if (eyeRingP > 0.001 && eyeFade > 0.003) {
      var eyePts = ringPoints(EYE.x, EYE.y, EYE.r, N);
      kids.push(polylineNode(eyePts, 38 * 2.2, eyeRingP, C.violetBright, 0.16 * eyeFade));
      kids.push(polylineNode(eyePts, 38, eyeRingP, C.violetBright, eyeFade));
    }

    // Underscore mouth bar morphing into the a's bowl
    var mouthP = tw(120, 22, 0, 1, 'easeOut');
    var flyT = tw(150, 26, 0, 1, 'easeInOutCubic');
    var bendAt = tw(156, 30, 0, 1, 'easeInOutCubic');
    var bowlT = tw(184, 22, 0, 1, 'easeInOutCubic');
    if (mouthP > 0.001) {
      var mCol = lerpColor(C.violetBright, '#2EBD9E', bowlT);
      var mSw = 38;
      var mPts;
      if (bendAt >= 0.999) {
        mPts = ringPoints(
          lerp(EYE.x, BRAND.a.bowl.cx, bowlT),
          lerp(EYE.y, BRAND.a.bowl.cy, bowlT),
          lerp(EYE.r, BRAND.a.bowl.r, bowlT), N);
      } else {
        var bx0 = lerp(BRAND.under.x, EYE.x - EYE.r, flyT);
        var bx1 = lerp(BRAND.under.x + BRAND.under.w, EYE.x + EYE.r, flyT);
        var byy = lerp(BRAND.under.y + BRAND.under.h / 2, EYE.y, flyT);
        mPts = bendPoints(bx0, byy, bx1, EYE.x, EYE.y, EYE.r, bendAt, N);
      }
      kids.push(polylineNode(mPts, mSw * 2.2, mouthP, mCol, 0.16));
      kids.push(polylineNode(mPts, mSw, mouthP, mCol, 1));
    }

    // F stroke
    var fP = tw(181, 26, 0, 1, 'easeInOutCubic');
    if (fP > 0.001) {
      kids.push(fPathNode(fP, C.blue, 1));
    }

    // F middle teal accent bar
    var accentP = tw(188, 22, 0, 1, 'easeOut');
    if (accentP > 0.001) {
      var accentKids = fAccentBar(accentP, 1);
      for (var ak = 0; ak < accentKids.length; ak++) kids.push(accentKids[ak]);
    }

    // a stem
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

    // ---- 150–210: Apple-grade architectural spec callout below the chip ----
    var typeIn = tw(150, 42, 0, 1, 'easeOutExpo');
    if (typeIn > 0.003) {
      kids.push({
        type: 'text',
        text: 'OUR MOST POWERFUL',
        width: 1920,
        opacity: typeIn,
        offsetY: 20 * (1 - typeIn),
        style: {
          fontSize: 38,
          color: '#B0B4C4',
          fontFamily: 'Impact',
          letterSpacing: 4,
          textAlign: 'center',
          textShadows: [{ color: '#44000000', blur: 16 }],
        },
        positioned: { left: 0, top: 690 },
      });

      kids.push({
        type: 'text',
        text: 'AGENT.',
        width: 1920,
        opacity: typeIn,
        offsetY: 15 * (1 - typeIn),
        style: {
          fontSize: 160,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          textAlign: 'center',
          gradient: {
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#FFFFFF', '#D0A8FF', '#8F6BFF'],
            stops: [0.0, 0.5, 1.0],
          },
          textShadows: [{ color: '#668F6BFF', blur: 48 }],
        },
        positioned: { left: 0, top: 745 },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
