// Scene 3 — the code wall finds the face, the face becomes the icon.
//
//   00  0–84    the glitch flight: the camera bugs its way down a wall of
//               code — smooth glide broken by three stutter bursts (jump
//               cuts, tear bars, rows flashing as they are «read») — and
//               HARD STOPS on the row that is not code
//   01  84–120  the face lives inline in the code: ( 0_0 ) with a sharp
//               underscore mouth — square corners, no rounding: this is a
//               terminal, not a sticker
//   02  120–146 the pinch: ( >|< ) — the eyes screw shut, the mouth stands
//               up as a sharp vertical bar
//   03  146–172 the note: ( > o ) — the right eye pops open as the ring
//   04  172–196 the dash: ( > - ) — the ring collapses flat; the face is
//               now the `>_` prompt again
//   05  196–240 the bloom: the dash lifts, the ring comes back, and the
//               whole face dissolves INTO the finished Fa icon — the `>`
//               writes itself as the F, the ring swells into the `a`'s
//               bowl, the dash glides up-left into the teal accent, the
//               parens drift away and the tile materializes behind
//
// Everything terminal is monospace; everything brand reuses lib/brand.js
// (fPathNode, tealBar, ringPoints, trace) so the icon at the end IS the
// film's icon, not a lookalike.

scene = {
  id: 'code_face',
  duration: 240,
  from: 0,
  timeline: {
    label: 'Code → face → Fa',
    color: '#9B79FF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var kids = [];
    var VIOLET = '#9B79FF';
    var VIOLET_DIM = '#7C4DFF';
    var MONO = 'monospace';
    var colors = yoclipTheme.colors;

    // Backdrop under everything.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 1,
      positioned: { left: 0, top: 0 },
    });

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }
    function glow(a, blur) {
      return [
        { color: '#' + hex2(0.38 * a) + '7C4DFF', blur: blur },
        { color: '#' + hex2(0.20 * a) + '7C4DFF', blur: blur * 2.4 },
      ];
    }

    // The icon mapper: the tile center pinned at screen center, like the
    // morph film — so the brand pieces land where the film puts them.
    var kIcon = 0.55;
    setMapper(kIcon, BRAND.anchor[0], BRAND.anchor[1], 960, 540);

    // ---- The wall ---------------------------------------------------------
    var rows = [
      '27  final take = takes.first',
      '28  const stage = stage()',
      '29  if (busy) return null',
      '30  onSelect(take.frame)',
      '31  onSelect(next)',
      '32  */section: morph',
      '33  RobotMode: focus',
      '34  await agent.run(goal)',
      '35  export function scene()',
      '36  render(frame) { return }',
      '37  // the face lives here',
      '38  compile(scene) → video',
    ];
    var ROW_H = 300;
    var wallDim = 1 - 0.78 * jsr.motion.tween(ms, 6600, 1400, 0, 1, 'easeInOutCubic');
    var wallSink = 46 * jsr.motion.tween(ms, 6600, 1600, 0, 1, 'easeInOutCubic');

    // The bloom clock drives the tile, the ring flight and the icon draw-on.
    var bloomT = jsr.motion.tween(ms, 6533, 1466, 0, 1, 'easeInOutCubic');
    var blooming = bloomT > 0.001;

    // Camera: one eased glide, plus three stutter bursts of snapped jumps.
    var glide = jsr.motion.tween(ms, 0, 2800, 0, 1, 'easeInOutCubic');
    var camY = lerp(-2450, 0, glide);
    function inBurst(a, b) { return frame >= a && frame <= b; }
    var bursting = inBurst(12, 20) || inBurst(38, 46) || inBurst(62, 70);
    var jx = 0, jy = 0;
    if (bursting) {
      var seed = Math.floor(frame / 2);
      jx = (prand(seed * 7.3 + 1.7) * 2 - 1) * 64;
      jy = (prand(seed * 3.1 + 9.2) * 2 - 1) * 44;
    }
    // The stop: a one-frame overshoot, then stillness. The camera LANDS.
    var stopJolt = frame === 83 ? 16 : (frame === 84 ? -5 : 0);

    for (var i = 0; i < rows.length; i++) {
      var ry = 40 + i * ROW_H + camY + jy + stopJolt - wallSink;
      if (ry < -280 || ry > 1120) continue;
      // Rows flash as the stutter passes over them — the machine reading.
      var near = Math.abs(ry - 540) < 190;
      var flash = bursting && near ? 0.55 : 0;
      kids.push({
        type: 'text',
        text: rows[i],
        style: {
          fontSize: 168,
          color: lerpColor('#20222B', '#4A4E66', flash),
          fontWeight: '400',
          fontFamily: MONO,
        },
        opacity: wallDim,
        positioned: { left: 90 + (i % 3) * 46 + jx, top: ry },
      });
    }

    // Tear bars — only while the camera bugs out.
    if (bursting) {
      for (var b = 0; b < 4; b++) {
        var bs = Math.floor(frame / 2) * 11.7 + b * 5.3;
        var by = prand(bs) * 1040 - 20 + jy;
        kids.push({
          type: 'rect', width: 1920, height: 2 + prand(bs + 3.1) * 5,
          radius: 0, fill: b % 2 ? '#8F6BFF' : '#DDE2FF',
          opacity: 0.22 + prand(bs + 6.7) * 0.3,
          positioned: { left: (prand(bs + 9.4) * 2 - 1) * 26, top: by },
        });
      }
    }
    // The landing flash.
    if (frame >= 83 && frame <= 87) {
      kids.push({
        type: 'rect', width: 1920, height: 1080, radius: 0,
        fill: '#8F6BFF',
        opacity: 0.16 * (1 - (frame - 83) / 4),
        positioned: { left: 0, top: 0 },
      });
    }
    // The tile materializes FIRST — every piece (face, accent, ring) must
    // sit on top of it, never under it.
    if (bloomT > 0.001) {
      var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
      kids.push({
        type: 'rect',
        width: BRAND.tile.w * kIcon, height: BRAND.tile.h * kIcon,
        radius: BRAND.tile.rx * kIcon,
        fill: '#17223B',
        stroke: '#2E3C5F',
        strokeWidth: Math.max(2, 5.5 * kIcon),
        opacity: bloomT * 0.96,
        positioned: { left: tl.x, top: tl.y },
      });
    }

    // ---- The face — ALL VECTOR --------------------------------------------
    // No font glyphs: the parentheses are stroked arcs, the eyes are a real
    // ring and a real chevron (the brand's own centerline), the mouth is a
    // sharp filled bar. Every beat is a continuous transformation —
    // point-matched polyline morphs, not glyph swaps.
    //
    // Beat clock. 84: (0_0)  120: (>|<)  146: (>o)  172: (>-)  196: bloom.
    var faceOn = jsr.motion.tween(ms, 2700, 220, 0, 1, 'easeOutCubic');
    var bPinch = frame >= 120 && frame < 146;
    var bNote = frame >= 146 && frame < 172;
    var bDash = frame >= 172 && frame < 196;

    var breathe = 1 + 0.08 * Math.sin((ms / 3400) * Math.PI * 2);
    var faceGlow = glow(faceOn * breathe * wallDim + (1 - wallDim) * 0.1, 46);

    // Sample a stroked arc for the parentheses.
    function arcPoints(cx, cy, r, a0, a1, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return pts;
    }
    // The chevron eye's centerline: two segments meeting at the vertex.
    function chevPoints(cx, cy, w, h, n) {
      // Top-left arm -> vertex at (cx+w, cy) -> bottom-left arm. A `>`
      // with the vertex at mid-height (w negative mirrors it into `<`).
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
    function ringPts(cx, cy, r, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
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

    // ---- Parentheses: stroked arcs, drifting apart + fading in the bloom --
    var parensP = jsr.motion.tween(ms, 6600, 800, 0, 1, 'easeInOutCubic');
    if (parensP < 0.999) {
      var pr = 300, pbulge = 120;
      var pOp = faceOn * (1 - parensP);
      var psw = 34;
      kids.push(polylineNode(
        arcPoints(512 - 360 - 210 * parensP, 430 + 70 * parensP, pr,
          Math.PI * 0.62, Math.PI * 1.38, 16),
        psw, 1, VIOLET, pOp));
      kids.push(polylineNode(
        arcPoints(512 + 360 + 210 * parensP, 430 + 70 * parensP, pr,
          Math.PI * -0.38, Math.PI * 0.38, 16),
        psw, 1, VIOLET, pOp));
    }

    // ---- Eyes -------------------------------------------------------------
    // Left slot hosts the ring (0) that morphs into the chevron (>); the
    // chevron then flies to the brand chevron's exact centerline in the
    // bloom — the eye literally becomes the film's `>`.
    var N = 24;
    var lcx = 319, lcy = 420, eyeR = 118, eyeW = 100, eyeH = 108;
    var ringL = ringPts(lcx, lcy, eyeR, N);
    var chevL = chevPoints(lcx, lcy, eyeW, eyeH, N);
    // Morph clock: rings hold, then pinch into chevrons over 120..130.
    var pinchT = jsr.motion.tween(ms, 4000, 340, 0, 1, 'easeInOutCubic');
    var leftPts = morphPts(ringL, chevL, pinchT);
    // The bloom flight: the eye chevron → the brand chevron centerline.
    var brandChev = chevPoints(
      (BRAND.chevron.a1[0] + BRAND.chevron.a2[0]) / 2 + 20,
      BRAND.chevron.a1[3],
      (BRAND.chevron.a2[0] - BRAND.chevron.a1[0]) / 2 - 24,
      (BRAND.chevron.a1[3] - BRAND.chevron.a1[1]) / 2 - 24, N);
    var leftFlight = jsr.motion.tween(ms, 6800, 900, 0, 1, 'easeInOutCubic');
    var leftGone = jsr.motion.tween(ms, 7000, 800, 0, 1, 'easeInOutCubic');
    if (leftGone < 0.999) {
      var lpts = morphPts(leftPts, brandChev, leftFlight);
      kids.push(polylineNode(lpts, lerp(34, 48, leftFlight), 1,
        lerpColor(VIOLET, colors.blueBright, leftFlight),
        faceOn * wallDim + (1 - wallDim) * (1 - leftGone)));
    }

    // Right slot: the ring (0) → the pinched < → the NOTE ring (146: pops
    // open by bending the standing bar) → the dash squash → the bowl.
    var rcx = 705, rcy = 420;
    if (bPinch || (!bNote && !bDash && !blooming)) {
      // The pinched eye: the chevron mirrored. Before the pinch: the ring.
      var ringR = ringPts(rcx, rcy, eyeR, N);
      var chevR = chevPoints(rcx, rcy, -eyeW, eyeH, N);
      var rPts = morphPts(ringR, chevR, pinchT);
      kids.push(polylineNode(rPts, 34, 1, VIOLET,
        faceOn * wallDim + (1 - wallDim)));
    }

    // ---- The mouth --------------------------------------------------------
    // A sharp filled bar (square corners — a terminal, not a sticker).
    // Its life: ___ bar → standing | (pinch) → the bar FLIES to the right
    // slot and bends into the ring (the note!) → squashes to the dash →
    // the bloom drops it into the underscore slot, then up-left into the
    // teal accent.
    var mouth = null; // {x, y, w, h} in svg units, y = center
    if (bPinch) {
      mouth = { x: 512, y: 420, w: 40, h: 330, vis: 1 };
    } else if (bDash) {
      mouth = { x: 640, y: 470, w: 260, h: 36, vis: 1 };
    } else if (!bNote && !blooming) {
      var blinked = frame >= 108 && frame <= 111;
      mouth = { x: 512, y: 645, w: 430, h: 36, vis: blinked ? 0.12 : 1 };
    }
    if (blooming) {
      // Phase A: drop into the underscore slot; phase B: glide to the accent.
      var aT = jsr.motion.clamp(bloomT * 2, 0, 1);
      var bT = jsr.motion.clamp(bloomT * 2 - 1, 0, 1);
      var eA = aT * aT * (3 - 2 * aT);
      var eB = bT * bT * (3 - 2 * bT);
      var ux = BRAND.under.x + BRAND.under.w / 2;
      var uy = BRAND.under.y + BRAND.under.h / 2;
      var ax = BRAND.f.accent.x + BRAND.f.accent.w / 2;
      var ay = BRAND.f.accent.y + BRAND.f.accent.h / 2;
      var mx = lerp(lerp(640, ux, eA), ax, eB);
      var my = lerp(lerp(470, uy, eA), ay, eB);
      mouth = {
        x: mx, y: my,
        w: lerp(lerp(260, BRAND.under.w, eA), BRAND.f.accent.w, eB),
        h: lerp(lerp(36, BRAND.under.h, eA), BRAND.f.accent.h, eB),
        rot: 0,
        // Fade the violet out exactly while the teal accent fades in.
        vis: bloomT > 0.7 ? Math.max(0, 1 - (bloomT - 0.7) / 0.22) : 1,
      };
    }
    if (mouth && mouth.vis > 0.001) {
      // mouth = svg units — map through the same mapper as the strokes.
      var mScreenX = 960 + (mouth.x - 512) * kIcon;
      var mScreenY = 540 + (mouth.y - 512) * kIcon;
      kids.push({
        type: 'rect', width: mouth.w * kIcon, height: mouth.h * kIcon,
        radius: 0,
        fill: VIOLET,
        opacity: faceOn * mouth.vis,
        positioned: {
          left: mScreenX - mouth.w * kIcon / 2,
          top: mScreenY - mouth.h * kIcon / 2,
        },
      });
    }

    // ---- The NOTE: the standing bar flies right and bends into the ring ---
    // bendPoints gives the bar→ring centerline for free; the flight is a
    // lerp of the bar's anchor while the bend opens.
    if (bNote) {
      var bendAt = bNote
        ? jsr.motion.tween(ms - (146 * 1000 / 30), 0, 300, 0, 1, 'easeOutCubic')
        : 1;
      var flyX = lerp(512, rcx, jsr.motion.tween(ms - (146 * 1000 / 30), 0, 200, 0, 1, 'easeOutCubic'));
      var flyY = lerp(420, rcy, jsr.motion.tween(ms - (146 * 1000 / 30), 0, 200, 0, 1, 'easeOutCubic'));
      var noteR = eyeR * 0.82;
      var bar0 = flyX - 130, bar1 = flyX + 130;
      var notePts = bendPoints(bar0, flyY, bar1, flyX, flyY, noteR, bendAt, N);
      kids.push(polylineNode(notePts, 34, 1, VIOLET,
        faceOn * wallDim + (1 - wallDim)));
    }

    // ---- The bloom: ring → the note slot → the a's bowl -------------------
    if (blooming) {
      var ringHome = morphPts(
        ringPts(rcx, rcy, eyeR * 0.82, N),
        ringPts(BRAND.a.bowl.cx, BRAND.a.bowl.cy, BRAND.a.bowl.r, N),
        jsr.motion.tween(ms, 6800, 800, 0, 1, 'easeInOutCubic'));
      kids.push(polylineNode(ringHome, lerp(34, 38,
        jsr.motion.tween(ms, 6800, 800, 0, 1, 'easeInOutCubic')), 1,
        lerpColor(VIOLET, '#2EBD9E',
          jsr.motion.tween(ms, 6800, 800, 0, 1, 'easeInOutCubic')),
        wallDim + (1 - wallDim)));
      // The `a`'s stem grows out of the arrived bowl.
      var stemP = jsr.motion.tween(ms, 7300, 800, 0, 1, 'easeInOutCubic');
      if (stemP > 0.001) {
        var segs = 8;
        var aStem = BRAND.a.stem;
        var segH = aStem.h / segs;
        for (var si = 0; si < segs; si++) {
          var sp = jsr.motion.clamp(stemP * segs - si, 0, 1);
          if (sp <= 0) continue;
          var sy0 = aStem.y + aStem.h - (si + 1) * segH;
          kids.push(trace(
            'M' + aStem.x + ',' + (sy0 + segH) + ' L' + aStem.x + ',' + sy0,
            38, aStem.x, sy0, 0, segH, sp,
            lerpColor('#2EBD9E', '#48C7E8', si / (segs - 1))));
        }
      }
      // The F writes itself under the arrived chevron-eye.
      var fP = jsr.motion.tween(ms, 7100, 900, 0, 1, 'easeInOutCubic');
      if (fP > 0.001) {
        kids.push(fPathNode(fP, '#6E74FF', 1));
      }
      // The teal accent cross-fades under the arrived dash.
      if (bloomT > 0.75) {
        var accentKids = tealBar((bloomT - 0.75) / 0.25);
        for (var ak = 0; ak < accentKids.length; ak++) kids.push(accentKids[ak]);
      }
      // The ground glow breathes under the finished mark.
      if (bloomT > 0.8) {
        var gb = brandToScreen(522, 742);
        kids.push({
          type: 'rect',
          width: 560 * kIcon * (1 + 0.05 * jsr.motion.wave(ms, 2800, 1, 0)),
          height: 10 * kIcon,
          radius: 5 * kIcon,
          fill: '#2EBD9E',
          opacity: 0.35 * ((bloomT - 0.8) / 0.2),
          positioned: { left: gb.x - 280 * kIcon, top: gb.y },
        });
      }
    }

    // ---- The bloom: F + a -------------------------------------------------
    if (blooming) {
      // The F writes itself where the > is fading.
      var fP = jsr.motion.tween(ms, 6900, 900, 0, 1, 'easeInOutCubic');
      if (fP > 0.001) {
        kids.push(fPathNode(fP, '#6E74FF', 1));
      }
      // The `a`'s stem grows out of the arriving bowl.
      var stemP = jsr.motion.tween(ms, 7300, 800, 0, 1, 'easeInOutCubic');
      if (stemP > 0.001) {
        var segs = 8;
        var aStem = BRAND.a.stem;
        var segH = aStem.h / segs;
        for (var si = 0; si < segs; si++) {
          var sp = jsr.motion.clamp(stemP * segs - si, 0, 1);
          if (sp <= 0) continue;
          var sy0 = aStem.y + aStem.h - (si + 1) * segH;
          kids.push(trace(
            'M' + aStem.x + ',' + (sy0 + segH) + ' L' + aStem.x + ',' + sy0,
            38, aStem.x, sy0, 0, segH, sp,
            lerpColor('#2EBD9E', '#48C7E8', si / (segs - 1))));
        }
      }
      // The ground glow breathes under the finished mark.
      if (bloomT > 0.8) {
        var gb = brandToScreen(522, 742);
        kids.push({
          type: 'rect',
          width: 560 * kIcon * (1 + 0.05 * jsr.motion.wave(ms, 2800, 1, 0)),
          height: 10 * kIcon,
          radius: 5 * kIcon,
          fill: '#2EBD9E',
          opacity: 0.35 * ((bloomT - 0.8) / 0.2),
          positioned: { left: gb.x - 280 * kIcon, top: gb.y },
        });
      }
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
