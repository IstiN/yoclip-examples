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
  duration: 225,
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

      // Hardware chip pins (top and bottom, identical to Fa Core)
      var pinCols = 8;
      var pinSpacing = (T.w * k - 70) / (pinCols - 1);
      for (var pi = 0; pi < pinCols; pi++) {
        var pinX = tl.x + 35 + pi * pinSpacing;
        kids.push({
          type: 'rect', width: 14, height: 5, radius: 1, fill: '#48C7E8',
          opacity: clamp01(0.55 * tileA),
          positioned: { left: pinX - 7, top: tl.y - 5 },
        });
        kids.push({
          type: 'rect', width: 14, height: 5, radius: 1, fill: '#48C7E8',
          opacity: clamp01(0.55 * tileA),
          positioned: { left: pinX - 7, top: tl.y + T.h * k },
        });
      }

      // The chip body: deep obsidian glass with hardware border
      kids.push({
        type: 'rect',
        width: T.w * k, height: T.h * k,
        radius: T.rx * k,
        fill: '#0A0F1D',
        border: { color: '#3B4F76', width: 2.0 },
        opacity: tileA,
        positioned: { left: tl.x, top: tl.y },
      });

      // Hardware inner bezel rim
      kids.push({
        type: 'rect',
        width: T.w * k - 8, height: T.h * k - 8,
        radius: (T.rx - 4) * k,
        fill: '#0D1424',
        border: { color: '#1E2B45', width: 1.0 },
        opacity: tileA,
        positioned: { left: tl.x + 4, top: tl.y + 4 },
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

    // ---- 96–178: the face materializes inside the chip ---------------------
    var N = 24;
    var chevFace = chevPoints(319, 420, 100, 108, N);
    var chevP = tw(96, 30, 0, 1, 'easeInOutCubic');
    var foldT = tw(160, 20, 0, 1, 'easeInOutCubic');
    var FSTEM_TOP = { x: 266, y: 372 };
    var FSTEM_BOT = { x: 266, y: 724 };
    var fStemPts = [];
    for (var fsi = 0; fsi <= N; fsi++) {
      var ft = fsi / N;
      fStemPts.push({ x: 266, y: lerp(FSTEM_TOP.y, FSTEM_BOT.y, ft) });
    }
    var chevLive = morphPts(chevFace, fStemPts, foldT);
    var chevCol = lerpColor(C.violetBright, C.blue, foldT);
    var chevFade = 1 - tw(172, 12, 0, 1, 'easeIn');
    if (chevP > 0.001 && chevFade > 0.003) {
      kids.push(polylineNode(chevLive, 38 * 2.2, chevP, chevCol, 0.16 * chevFade));
      kids.push(polylineNode(chevLive, 38, chevP, chevCol, chevFade));
    }

    // Eye ring -> note ring (fades cleanly before wordmark writes)
    var EYE = { x: 705, y: 420, r: 118 };
    var eyeRingP = tw(106, 30, 0, 1, 'easeInOutCubic');
    var eyeFade = 1 - tw(156, 16, 0, 1, 'easeInOutCubic');
    if (eyeRingP > 0.001 && eyeFade > 0.003) {
      var eyePts = ringPoints(EYE.x, EYE.y, EYE.r, N);
      kids.push(polylineNode(eyePts, 38 * 2.2, eyeRingP, C.violetBright, 0.16 * eyeFade));
      kids.push(polylineNode(eyePts, 38, eyeRingP, C.violetBright, eyeFade));
    }

    // Underscore mouth bar morphing into the a's bowl (fades cleanly at 178)
    var mouthP = tw(120, 22, 0, 1, 'easeOut');
    var flyT = tw(146, 22, 0, 1, 'easeInOutCubic');
    var bendAt = tw(152, 24, 0, 1, 'easeInOutCubic');
    var bowlT = tw(168, 16, 0, 1, 'easeInOutCubic');
    var mouthFade = 1 - tw(174, 10, 0, 1, 'easeInOutCubic');
    if (mouthP > 0.001 && mouthFade > 0.003) {
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
      kids.push(polylineNode(mPts, mSw, mouthP, mCol, mouthFade));
    }

    // ---- 176–225: The canonical, bold Fa wordmark writes itself ------------
    var fP = tw(176, 26, 0, 1, 'easeInOutCubic');
    var accentP = tw(184, 20, 0, 1, 'easeOut');
    var bowlP = tw(178, 24, 0, 1, 'easeInOutCubic');
    var stemP = tw(186, 20, 0, 1, 'easeInOutCubic');
    var faMarkKids = completeFaMark(fP, accentP, bowlP, stemP, 1);
    for (var fmi = 0; fmi < faMarkKids.length; fmi++) {
      kids.push(faMarkKids[fmi]);
    }

    // ---- 176–225: "MEET" revealed above the chip as Fa is drawn ----------
    var meetIn = tw(176, 26, 0, 1, 'easeOutExpo');
    if (meetIn > 0.003) {
      kids.push({
        type: 'text',
        text: 'MEET',
        width: 1920,
        opacity: meetIn,
        offsetY: 15 * (1 - meetIn),
        style: {
          fontSize: 72,
          fontFamily: 'Impact',
          color: '#FFFFFF',
          letterSpacing: 6,
          textAlign: 'center',
          gradient: {
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
            stops: [0.0, 0.45, 1.0],
          },
        },
        positioned: { left: 0, top: 65 },
      });
    }

    // ---- 150–225: Apple-grade architectural spec callout below the chip ----
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
