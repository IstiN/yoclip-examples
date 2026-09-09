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

    // ---- The face ---------------------------------------------------------
    // Beat clock. 84: (0_0)  120: (>|<)  146: (>o)  172: (>-)  196: bloom.
    var faceOn = jsr.motion.tween(ms, 2700, 220, 0, 1, 'easeOutCubic');
    var bPinch = frame >= 120 && frame < 146;
    var bNote = frame >= 146 && frame < 172;
    var bDash = frame >= 172 && frame < 196;


    var breathe = 1 + 0.08 * Math.sin((ms / 3400) * Math.PI * 2);
    var fStyle = {
      fontSize: 300,
      color: VIOLET,
      fontWeight: '400',
      fontFamily: MONO,
    };
    var faceGlow = glow(faceOn * breathe * wallDim + (1 - wallDim) * 0.1, 46);
    var eyeGlow = glow(faceOn * (0.85 + 0.15 * breathe) * wallDim, 40);

    // Parentheses drift apart and fade as the icon takes over.
    var parensP = jsr.motion.tween(ms, 6600, 800, 0, 1, 'easeInOutCubic');
    if (parensP < 0.999) {
      kids.push({
        type: 'text', text: '(', style: Object.assign({}, fStyle, {
          shadows: faceGlow,
        }),
        opacity: faceOn * (1 - parensP),
        positioned: {
          left: 385 - 130 * parensP,
          top: 262 + 60 * parensP,
        },
      });
      kids.push({
        type: 'text', text: ')', style: Object.assign({}, fStyle, {
          shadows: faceGlow,
        }),
        opacity: faceOn * (1 - parensP),
        positioned: {
          left: 1400 + 130 * parensP,
          top: 262 + 60 * parensP,
        },
      });
    }

    var eyeStyle = {
      fontSize: 250,
      color: VIOLET,
      fontWeight: '400',
      fontFamily: MONO,
    };
    var LX = 728, RX = 1112, EY = 330;

    // Left eye: 0 → > (pinch) → stays > through the solo, fades with the F.
    var leftGlyph = bPinch || bNote || bDash ? '>' : '0';
    var leftFade = blooming ? 1 - jsr.motion.tween(ms, 7000, 700, 0, 1, 'easeInOutCubic') : 1;
    if (leftFade > 0.001) {
      kids.push({
        type: 'text', text: leftGlyph, style: Object.assign({}, eyeStyle, {
          shadows: eyeGlow,
        }),
        opacity: faceOn * leftFade * (bPinch ? 1 : 1),
        positioned: { left: LX, top: EY },
      });
    }

    // Right eye: 0 → < (pinch) → the ring (note) → gone (dash) → the bowl.
    if (bPinch) {
      kids.push({
        type: 'text', text: '<', style: Object.assign({}, eyeStyle, {
          shadows: eyeGlow,
        }),
        opacity: faceOn,
        positioned: { left: RX, top: EY },
      });
    } else if (!bNote && !bDash) {
      kids.push({
        type: 'text', text: '0', style: Object.assign({}, eyeStyle, {
          shadows: eyeGlow,
        }),
        opacity: faceOn * leftFade,
        positioned: { left: RX, top: EY },
      });
    }

    // The ring: pops open at the note, collapses at the dash, returns and
    // flies to the `a`'s bowl in the bloom. A real stroke, not a glyph —
    // it has to BECOME the bowl.
    var ringShow = bNote || blooming;
    if (ringShow) {
      // The ring lives in SVG space (polylineNode traces through the
      // mapper): it starts as the right-eye slot blown up to svg scale,
      // then flies home into the `a`'s bowl.
      var svgCx = 512 + (1180 - 960) / kIcon;
      var svgCy = 512 + (470 - 540) / kIcon;
      var svgR = 92 / kIcon;
      if (blooming) {
        svgCx = lerp(svgCx, BRAND.a.bowl.cx, bloomT);
        svgCy = lerp(svgCy, BRAND.a.bowl.cy, bloomT);
        svgR = lerp(svgR, BRAND.a.bowl.r, bloomT);
      }
      var pts = [];
      var n = 28;
      for (var p = 0; p <= n; p++) {
        var ang = (p / n) * Math.PI * 2;
        pts.push({ x: svgCx + svgR * Math.cos(ang), y: svgCy + svgR * Math.sin(ang) });
      }
      kids.push(polylineNode(pts, lerp(30 / kIcon, 38, bloomT), 1,
        lerpColor(VIOLET, '#2EBD9E', bloomT), faceOn * wallDim + (1 - wallDim)));
    }

    // The mouth: sharp square-corner pieces, always — no rounding anywhere.
    // (0_0): the ___ bar. (>|<): the vertical bar. (>-): the dash. Bloom:
    // the dash glides up-left into the teal accent.
    var mouthDash = bDash || blooming;
    var mouthW = bPinch ? 22 : (mouthDash ? 190 : 235);
    var mouthH = bPinch ? 96 : 20;
    var mouthGone = bNote; // in the note beat the ring IS the mouth
    var mCx = 960, mCy = 690;
    if (bPinch) { mCx = 960; mCy = 452; }
    if (bDash) { mCx = 1040; mCy = 505; }
    // One cursor blink of the ___ mouth while the face holds (0_0).
    var mouthBlink = !bPinch && !mouthDash && frame >= 108 && frame <= 111;
    if (blooming) {
      mCx = lerp(1040, (BRAND.f.accent.x + BRAND.f.accent.w / 2) * kIcon + 960 - 512 * kIcon, bloomT);
      mCy = lerp(505, BRAND.f.accent.y * kIcon + 540 - 512 * kIcon, bloomT);
      mouthW = lerp(190, BRAND.f.accent.w * kIcon, bloomT);
      mouthH = lerp(20, BRAND.f.accent.h * kIcon, bloomT);
    }
    // The accent's ghost: as the dash arrives, the teal bar takes over.
    if (bloomT > 0.55) {
      var accentKids = tealBar((bloomT - 0.55) / 0.45);
      for (var ak = 0; ak < accentKids.length; ak++) kids.push(accentKids[ak]);
    }
    if (bloomT <= 1 && !mouthGone) {
      var dashFade = bloomT > 0.55 ? 1 - (bloomT - 0.55) / 0.45 : 1;
      kids.push({
        type: 'rect', width: mouthW, height: mouthH, radius: 0,
        fill: VIOLET,
        opacity: faceOn * dashFade * (mouthBlink ? 0.12 : 1),
        positioned: { left: mCx - mouthW / 2, top: mCy - mouthH / 2 },
      });
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
