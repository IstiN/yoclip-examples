// 01 — Dark — Cinematic Apple-grade hardware teaser opening.
//
//   ·   0–35   Deep void: an anamorphic cyan laser streak glides across
//   ·  20–80   Obsidian squircle tile emerges with perimeter specular rim trace
//   ·  50–100  The terminal prompt `>_` glows inside the dark glass, underscore pulsing
//   ·  95–140  Awakening: prompt morphs into living vector eyes `( 0_0 )`
//   · 140–165  The Apple WINK: `( 0_0 )` -> `( 0_- )` -> `( 0_0 )` with specular spark
//   · 165–210  Charge & push-in (scale 1.0 -> 1.08), building tension for the beat drop

scene = {
  id: '01_dark',
  duration: 210,
  from: 0,
  timeline: {
    label: 'Dark',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    // Cinematic zoom push-in across the scene: lands at exactly 0.42 at frame 210
    var tileScale = lerp(0.38, 0.42, tw(0, 210, 0, 1, 'easeInOutCubic'));
    setMapper(tileScale, 512, 512, 960, 540);

    var kids = [];

    // Pure deep black background
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // ---- 0–45: Anamorphic horizontal streak flare ---------------------------
    var flareP = tw(5, 36, 0, 1, 'easeInOutCubic');
    if (flareP > 0.001 && flareP < 0.999) {
      var flareAlpha = Math.sin(flareP * Math.PI);
      var flareW = lerp(200, 1920, flareP);
      kids.push({
        type: 'rect',
        width: flareW,
        height: 3,
        fill: '#48C7E8',
        opacity: 0.65 * flareAlpha,
        blur: 4,
        positioned: { left: 960 - flareW / 2, top: 539 },
      });
      kids.push({
        type: 'rect',
        width: flareW * 0.7,
        height: 18,
        fill: '#5B61F6',
        opacity: 0.25 * flareAlpha,
        blur: 16,
        positioned: { left: 960 - (flareW * 0.7) / 2, top: 531 },
      });
    }

    // ---- 15–90: The obsidian squircle hardware tile ------------------------
    var tileIn = tw(15, 35, 0, 1, 'easeOut');
    if (tileIn > 0.003) {
      var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
      var tw_w = BRAND.tile.w * tileScale;
      var tw_h = BRAND.tile.h * tileScale;
      var tw_rx = BRAND.tile.rx * tileScale;

      // Ambient radial backlight behind the tile
      var backGlow = tw(30, 60, 0.10, 0.24, 'easeInOutCubic') *
        (1 + 0.04 * jsr.motion.wave(ms, 2400, 1, 0));
      kids.push({
        type: 'circle',
        size: 580 * tileScale / 0.38,
        fill: '#5B61F6',
        opacity: backGlow * tileIn,
        blur: 70,
        positioned: { left: 960 - (580 * tileScale / 0.38) / 2, top: 540 - (580 * tileScale / 0.38) / 2 },
      });

      // The obsidian body
      kids.push({
        type: 'rect',
        width: tw_w,
        height: tw_h,
        radius: tw_rx,
        fill: '#0C1322',
        stroke: '#24324F',
        strokeWidth: Math.max(2, 5 * tileScale),
        opacity: tileIn,
        positioned: { left: tl.x, top: tl.y },
      });

      // Specular surface sweep (iridescent sheen)
      var sheenP = tw(60, 45, 0, 1, 'easeInOutCubic');
      if (sheenP > 0.001 && sheenP < 0.999) {
        var sheenW = 180 * tileScale;
        var sheenX = lerp(BRAND.tile.x - sheenW, BRAND.tile.x + BRAND.tile.w + sheenW, sheenP);
        var sheenPt = brandToScreen(sheenX, 512);
        kids.push({
          type: 'rect',
          width: sheenW,
          height: tw_h,
          fill: '#48C7E8',
          opacity: 0.16 * Math.sin(sheenP * Math.PI),
          rotation: -25,
          positioned: { left: sheenPt.x - sheenW / 2, top: tl.y },
        });
      }
    }

    // ---- 25–85: Perimeter specular rim trace --------------------------------
    var rimIn = tw(25, 45, 0, 1, 'easeInOutCubic');
    var rimFade = 1 - tw(80, 20, 0, 1, 'easeOut');
    if (rimIn > 0.001 && rimFade > 0.003) {
      var T = BRAND.tile;
      var rx = T.rx;
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
      for (var si = 0; si < SEGS.length; si++) {
        var sprog = jsr.motion.clamp(rimIn * 4 - si, 0, 1);
        if (sprog <= 0) continue;
        var segCol = lerpColor('#5B61F6', '#2EBD9E', (si + sprog) / 4);
        kids.push(polylineNode(SEGS[si], 4, sprog, segCol, 0.85 * rimFade));
        kids.push(polylineNode(SEGS[si], 10, sprog, segCol, 0.25 * rimFade));
      }
    }

    // ---- 45–105: The terminal prompt `>_` ------------------------------------
    // Chevron `>` on left, underscore `_` on right
    var promptIn = tw(45, 25, 0, 1, 'easeOut');
    var promptFade = 1 - tw(95, 20, 0, 1, 'easeInOutCubic');
    if (promptIn > 0.001 && promptFade > 0.003) {
      var pAlpha = promptIn * promptFade;
      // Pulse the underscore like a terminal cursor
      var cursorPulse = 0.75 + 0.25 * Math.sin(frame * 0.4);

      // Chevron > in brand blue
      var chHalves = chevronHalves(0, '#5B61F6', '#6E74FF', 0, 0);
      for (var chi = 0; chi < chHalves.length; chi++) {
        var ch = chHalves[chi];
        ch.opacity = pAlpha;
        kids.push(ch);
      }

      // Underscore _ in brand teal
      var tb = tealBar(pAlpha * cursorPulse);
      for (var tbi = 0; tbi < tb.length; tbi++) kids.push(tb[tbi]);
    }

    // ---- 95–210: Living Vector Face `( > _ o )` with smile ----------------
    var faceIn = tw(95, 25, 0, 1, 'easeInOutCubic');
    if (faceIn > 0.001) {
      // Eyes at y=430: Left chevron `>` at x=310, Right ring `o` at x=714
      // Wide breathing room: distance between eyes = 404px
      // Smile underscore `_` centered at (512, 655), width 240px
      var eyeY = 430;
      var eyeL_cx = 310;
      var eyeR_cx = 714;
      var eyeR = 82;
      var pL = brandToScreen(eyeL_cx, eyeY);
      var pR = brandToScreen(eyeR_cx, eyeY);
      var pMouth = brandToScreen(512, 655);

      // Cyan/blue iris aura
      var irisGlow = 0.24 * faceIn * (1 + 0.05 * jsr.motion.wave(ms, 2000, 1, 0));
      kids.push({
        type: 'circle',
        size: 240 * tileScale,
        fill: '#5B61F6',
        opacity: irisGlow,
        blur: 32,
        positioned: { left: pL.x - (240 * tileScale) / 2, top: pL.y - (240 * tileScale) / 2 },
      });
      kids.push({
        type: 'circle',
        size: 240 * tileScale,
        fill: '#2EBD9E',
        opacity: irisGlow,
        blur: 32,
        positioned: { left: pR.x - (240 * tileScale) / 2, top: pR.y - (240 * tileScale) / 2 },
      });

      // Left eye: chevron > in brand blue with ample breathing room
      var chPts = chevPoints(eyeL_cx, eyeY, 86, 92, 24);
      kids.push(polylineNode(chPts, 40, faceIn, '#5B61F6', faceIn));

      // Right eye: ring `o` winks into `-` between frame 144 and 160
      var winkT = 0;
      if (frame >= 144 && frame <= 162) {
        if (frame < 148) winkT = (frame - 144) / 4;
        else if (frame <= 154) winkT = 1;
        else winkT = 1 - (frame - 154) / 8;
      }

      if (winkT > 0.01) {
        // Flat horizontal dash capsule
        var dashW = lerp(eyeR * 2, 160, winkT);
        var dashH = lerp(40, 30, winkT);
        kids.push({
          type: 'rect',
          width: dashW * tileScale,
          height: dashH * tileScale,
          radius: (dashH / 2) * tileScale,
          fill: '#48C7E8',
          opacity: faceIn,
          positioned: {
            left: pR.x - (dashW * tileScale) / 2,
            top: pR.y - (dashH * tileScale) / 2,
          },
        });
        if (winkT > 0.7) {
          kids.push({
            type: 'circle',
            size: 18 * tileScale,
            fill: '#FFFFFF',
            opacity: 0.95 * winkT,
            blur: 4,
            positioned: { left: pR.x + (dashW * tileScale) / 2 - 9 * tileScale, top: pR.y - 9 * tileScale },
          });
        }
      } else {
        // Open ring
        var eyeRPts = ringPoints(eyeR_cx, eyeY, eyeR, 24);
        kids.push(polylineNode(eyeRPts, 40, faceIn, '#2EBD9E', faceIn));
      }

      // ---- Smile `_`: the iconic terminal underscore smiling ---------------
      var mouthIn = tw(102, 22, 0, 1, 'easeOut');
      if (mouthIn > 0.001) {
        var mouthPulse = 1 + 0.06 * (winkT > 0.5 ? 1 : 0);
        var mouthW = 230 * mouthPulse;
        var mouthH = 34;
        // Soft smile backlight
        kids.push({
          type: 'circle',
          size: 200 * tileScale,
          fill: '#48C7E8',
          opacity: 0.20 * mouthIn * faceIn,
          blur: 24,
          positioned: { left: pMouth.x - (200 * tileScale) / 2, top: pMouth.y - (200 * tileScale) / 2 },
        });
        // Underscore smile capsule
        kids.push({
          type: 'rect',
          width: mouthW * tileScale,
          height: mouthH * tileScale,
          radius: (mouthH / 2) * tileScale,
          fill: '#48C7E8',
          opacity: mouthIn * faceIn,
          positioned: {
            left: pMouth.x - (mouthW * tileScale) / 2,
            top: pMouth.y - (mouthH * tileScale) / 2,
          },
        });
      }
    }

    // Subtle edge vignette
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#000000',
      opacity: 0.28,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
