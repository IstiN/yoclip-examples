// fa_splash.js — the Fa trailer opening beat as a reusable brand splash.
//
// Extracted from fa_trailer scenes/01_dark.scene.js: the squircle tile
// emerging with a perimeter specular rim trace, the terminal `>_` prompt
// waking into the living face `( > _ o )`, the wink, and the slow push-in.
// Theme-aware: `light: true` swaps the obsidian tile for a white-glass one
// so the beat can play on a white background (app-release cut, intro
// splash, anywhere the brand needs a clean reveal).
//
// faSplashKids(frame, opts) -> kids[]
//   opts.cx, opts.cy — screen center of the tile (default F.cx, F.cy)
//   opts.size        — tile edge in screen px (default min(F.W, F.H) * 0.52)
//   opts.light       — white-glass variant (default: T.isLight)
//   opts.opacity     — master fade multiplier (default 1)
//   opts.ms          — elapsed ms   (default elapsedMs(frame, 30))
//   opts.bg          — include the full-frame background fill (default false)
// Beats are tuned for a 120-frame scene at 30fps.
// Requires fa_kit.js + fa_theme.js. Brand-locked: edit the animation only
// here, scenes just call it.

function faSplashKids(frame, opts) {
  var o = opts || {};
  var T = faTheme();
  var F = faFormat();
  var ms = o.ms != null ? o.ms : elapsedMs(frame, 30);
  var master = o.opacity != null ? o.opacity : 1;
  if (master <= 0.003) return [];

  var cx = o.cx != null ? o.cx : F.cx;
  var cy = o.cy != null ? o.cy : F.cy;
  var size = o.size != null ? o.size : Math.min(F.W, F.H) * 0.52;
  var light = o.light != null ? o.light : !!T.isLight;

  function tw(at, dur, from, to, easing) {
    return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
  }

  var kids = [];

  if (o.bg) {
    kids.push({
      type: 'rect', width: F.W, height: F.H,
      fill: light ? '#FFFFFF' : '#05070D',
      positioned: { left: 0, top: 0 },
    });
  }

  // Slow cinematic push-in: the tile grows ~6% across the whole beat.
  var k = (size / BRAND.tile.w) * (0.94 + 0.06 * tw(0, 120, 0, 1, 'easeInOut'));

  // The mapper is global kit state — set ours, restore the caller's after.
  var prev = {
    k: mapper.k, ax: mapper.ax, ay: mapper.ay, sx: mapper.sx, sy: mapper.sy,
  };
  setMapper(k, 512, 512, cx, cy);

  // ---- 4-30: anamorphic streak flare across the center -------------------
  var flareP = tw(4, 26, 0, 1, 'easeInOut');
  if (flareP > 0.001 && flareP < 0.999) {
    var flareAlpha = Math.sin(flareP * Math.PI);
    var flareW = lerp(size * 0.4, F.W, flareP);
    kids.push({
      type: 'rect',
      width: flareW,
      height: 3,
      fill: '#2EBD9E',
      opacity: 0.65 * flareAlpha * master,
      blur: 4,
      positioned: { left: cx - flareW / 2, top: cy - 1.5 },
    });
    kids.push({
      type: 'rect',
      width: flareW * 0.7,
      height: 18,
      fill: '#5B61F6',
      opacity: 0.25 * flareAlpha * master,
      blur: 16,
      positioned: { left: cx - (flareW * 0.7) / 2, top: cy - 9 },
    });
  }

  // ---- 8-30: the squircle tile -------------------------------------------
  var tileIn = tw(8, 22, 0, 1, 'easeOut');
  if (tileIn > 0.003) {
    var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
    var twW = BRAND.tile.w * k;
    var twH = BRAND.tile.h * k;

    // Ambient radial backlight behind the tile.
    var glowA = light ? 0.14 : 0.24;
    var backGlow = tw(20, 50, glowA * 0.5, glowA, 'easeInOut') *
      (1 + 0.04 * jsr.motion.wave(ms, 2400, 1, 0));
    kids.push({
      type: 'circle',
      size: 580 * k,
      fill: '#5B61F6',
      opacity: backGlow * tileIn * master,
      blur: 70,
      positioned: { left: cx - (580 * k) / 2, top: cy - (580 * k) / 2 },
    });

    // Tile body: white glass on light, obsidian on dark.
    kids.push({
      type: 'rect',
      width: twW,
      height: twH,
      radius: BRAND.tile.rx * k,
      fill: light ? '#F4F6FB' : '#0C1322',
      stroke: light ? '#DCE2EE' : '#24324F',
      strokeWidth: Math.max(2, 5 * k),
      opacity: tileIn * master,
      positioned: { left: tl.x, top: tl.y },
    });

    // Specular surface sweep.
    var sheenP = tw(34, 40, 0, 1, 'easeInOut');
    if (sheenP > 0.001 && sheenP < 0.999) {
      var sheenW = 180 * k;
      var sheenX = lerp(BRAND.tile.x - sheenW, BRAND.tile.x + BRAND.tile.w + sheenW, sheenP);
      var sheenPt = brandToScreen(sheenX, 512);
      kids.push({
        type: 'rect',
        width: sheenW,
        height: twH,
        fill: light ? '#5B61F6' : '#FFFFFF',
        opacity: 0.14 * Math.sin(sheenP * Math.PI) * master,
        rotation: -25,
        positioned: { left: sheenPt.x - sheenW / 2, top: tl.y },
      });
    }
  }

  // ---- 16-50: perimeter specular rim trace --------------------------------
  var rimIn = tw(16, 34, 0, 1, 'easeInOut');
  var rimFade = 1 - tw(50, 16, 0, 1, 'easeOut');
  if (rimIn > 0.001 && rimFade > 0.003) {
    var Tr = BRAND.tile;
    var rx = Tr.rx;
    var N_ARC = 8;
    var SEGS = [
      arcPts(Tr.x + rx, Tr.y + rx, rx, Math.PI, 1.5 * Math.PI, N_ARC)
        .concat([{ x: Tr.x + Tr.w - rx, y: Tr.y }]),
      arcPts(Tr.x + Tr.w - rx, Tr.y + rx, rx, 1.5 * Math.PI, 2 * Math.PI, N_ARC)
        .concat([{ x: Tr.x + Tr.w, y: Tr.y + Tr.h - rx }]),
      arcPts(Tr.x + Tr.w - rx, Tr.y + Tr.h - rx, rx, 0, 0.5 * Math.PI, N_ARC)
        .concat([{ x: Tr.x + rx, y: Tr.y + Tr.h }]),
      arcPts(Tr.x + rx, Tr.y + Tr.h - rx, rx, 0.5 * Math.PI, Math.PI, N_ARC)
        .concat([{ x: Tr.x, y: Tr.y + rx }]),
    ];
    for (var si = 0; si < SEGS.length; si++) {
      var sprog = jsr.motion.clamp(rimIn * 4 - si, 0, 1);
      if (sprog <= 0) continue;
      var segCol = lerpColor('#5B61F6', '#2EBD9E', (si + sprog) / 4);
      kids.push(polylineNode(SEGS[si], 4, sprog, segCol, 0.85 * rimFade * master));
      kids.push(polylineNode(SEGS[si], 10, sprog, segCol, 0.25 * rimFade * master));
    }
  }

  // ---- 28-56: the terminal prompt `>_`, fading as the face wakes ----------
  var promptIn = tw(28, 22, 0, 1, 'easeOut');
  var promptFade = 1 - tw(56, 16, 0, 1, 'easeInOut');
  if (promptIn > 0.001 && promptFade > 0.003) {
    var pAlpha = promptIn * promptFade * master;
    var cursorPulse = 0.75 + 0.25 * Math.sin(frame * 0.4);
    var chHalves = chevronHalves(0, '#5B61F6', '#6E74FF', 0, 0);
    for (var chi = 0; chi < chHalves.length; chi++) {
      chHalves[chi].opacity = pAlpha;
      kids.push(chHalves[chi]);
    }
    var tb = tealBar(pAlpha * cursorPulse);
    for (var tbi = 0; tbi < tb.length; tbi++) kids.push(tb[tbi]);
  }

  // ---- 55+: the living face `( > _ o )` -----------------------------------
  var faceIn = tw(55, 20, 0, 1, 'easeInOut');
  if (faceIn > 0.001) {
    var eyeY = 430;
    var eyeL_cx = 310;
    var eyeR_cx = 714;
    var eyeR = 82;
    var pL = brandToScreen(eyeL_cx, eyeY);
    var pR = brandToScreen(eyeR_cx, eyeY);
    var pMouth = brandToScreen(512, 655);

    // Cyan/blue iris aura.
    var irisGlow = 0.24 * faceIn * (1 + 0.05 * jsr.motion.wave(ms, 2000, 1, 0));
    kids.push({
      type: 'circle',
      size: 240 * k,
      fill: '#5B61F6',
      opacity: irisGlow * master,
      blur: 32,
      positioned: { left: pL.x - (240 * k) / 2, top: pL.y - (240 * k) / 2 },
    });
    kids.push({
      type: 'circle',
      size: 240 * k,
      fill: '#2EBD9E',
      opacity: irisGlow * master,
      blur: 32,
      positioned: { left: pR.x - (240 * k) / 2, top: pR.y - (240 * k) / 2 },
    });

    // Left eye: chevron `>` in brand blue.
    var chPts = chevPoints(eyeL_cx, eyeY, 86, 92, 24);
    kids.push(polylineNode(chPts, 40, faceIn, '#5B61F6', faceIn * master));

    // Right eye: ring `o` winks into `-` (frames 76-94).
    var winkT = 0;
    if (frame >= 76 && frame <= 94) {
      if (frame < 80) winkT = (frame - 76) / 4;
      else if (frame <= 86) winkT = 1;
      else winkT = 1 - (frame - 86) / 8;
    }

    if (winkT > 0.01) {
      var dashW = lerp(eyeR * 2, 160, winkT);
      var dashH = lerp(40, 30, winkT);
      kids.push({
        type: 'rect',
        width: dashW * k,
        height: dashH * k,
        radius: (dashH / 2) * k,
        fill: '#8F6BFF',
        opacity: faceIn * master,
        positioned: { left: pR.x - (dashW * k) / 2, top: pR.y - (dashH * k) / 2 },
      });
      if (winkT > 0.7) {
        kids.push({
          type: 'circle',
          size: 18 * k,
          fill: '#FFFFFF',
          opacity: 0.95 * winkT * master,
          blur: 4,
          positioned: { left: pR.x + (dashW * k) / 2 - 9 * k, top: pR.y - 9 * k },
        });
      }
    } else {
      var eyeRPts = ringPoints(eyeR_cx, eyeY, eyeR, 24);
      kids.push(polylineNode(eyeRPts, 40, faceIn, '#2EBD9E', faceIn * master));
    }

    // ---- Smile `_`: the terminal underscore, pulsing with the wink --------
    var mouthIn = tw(62, 18, 0, 1, 'easeOut');
    if (mouthIn > 0.001) {
      var mouthPulse = 1 + 0.06 * (winkT > 0.5 ? 1 : 0);
      var mouthW = 230 * mouthPulse;
      var mouthH = 34;
      kids.push({
        type: 'circle',
        size: 200 * k,
        fill: '#2EBD9E',
        opacity: 0.20 * mouthIn * faceIn * master,
        blur: 24,
        positioned: { left: pMouth.x - (200 * k) / 2, top: pMouth.y - (200 * k) / 2 },
      });
      kids.push({
        type: 'rect',
        width: mouthW * k,
        height: mouthH * k,
        radius: (mouthH / 2) * k,
        fill: '#2EBD9E',
        opacity: mouthIn * faceIn * master,
        positioned: { left: pMouth.x - (mouthW * k) / 2, top: pMouth.y - (mouthH * k) / 2 },
      });
    }
  }

  setMapper(prev.k, prev.ax, prev.ay, prev.sx, prev.sy);
  return kids;
}
