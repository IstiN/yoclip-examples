// 08 — Lockup — the film resolves into the finished mark.
//
//   ·  0–20    black: a violet light point grows at the tile's future center
//   ·  20–60   the Fa tile materializes about that point — dark glass,
//              scaling 0.94 → 1.0 on easeOutExpo (the brand mapper pins the
//              tile center at (960, 500) for the whole scene, so the scale
//              breathes about the anchor exactly like the morph film)
//   ·  20–80   the wordmark writes itself EXACTLY like the brand: the F as
//              one round-capped stroke in blue (fPathNode), the a's bowl as
//              the brand ring in teal (ringPoints → polylineNode), the stem
//              as teal→tealLight gradient segments growing out of the bowl
//              (the morph's stem pattern), the teal accent bar fading in
//   ·  80–120  the lockup below the tile: `Fa` fades up, the tagline rides
//              in at +120px
//   ·  120–160 `fa1.dev — macOS · iOS · Web · Chrome` at +200px; the thin
//              teal ground glow bar breathes under the mark (the morph's
//              settle wave)
//   ·  160–180 the final bloom: a soft pulse at the a's bowl, everything
//              brightens 8% and eases back down — hold on the lockup
//
// Every brand piece goes through lib/brand.js (setMapper, brandToScreen,
// fPathNode, ringPoints/polylineNode, trace, tealBar) so this icon IS the
// film's icon, not a lookalike.

scene = {
  id: '08_lockup',
  duration: 180,
  from: 1380,
  timeline: {
    label: 'Lockup',
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

    // ---- The mapper: tile center pinned at (960, 390) ----------------------
    // The materialize beat scales k (0.94 → 1.0 of 0.44) about
    // the anchor, so tile and wordmark breathe as one surface.
    var tileT = tw(20, 40, 0, 1, 'easeOutExpo');      // 20–60
    var k = 0.44 * lerp(0.94, 1.0, tileT);
    setMapper(k, BRAND.anchor[0], BRAND.anchor[1], 960, 390);

    var kids = [];

    // Background.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    // ---- 0–20: the light point --------------------------------------------
    // A violet spark grows at the point the tile will materialize around,
    // then sinks into it as the glass arrives.
    var ptIn = tw(0, 20, 0, 1, 'easeOut');
    var ptOut = tw(20, 12, 0, 1, 'easeInOutCubic');
    var ptA = 0.8 * ptIn * (1 - ptOut);
    if (ptA > 0.003) {
      var haloS = Math.max(2, 46 * (0.35 + 0.65 * ptIn));
      kids.push({
        type: 'circle', size: haloS, fill: C.violet,
        opacity: 0.14 * ptIn * (1 - ptOut),
        blur: 26,
        positioned: { left: 960 - haloS / 2, top: 390 - haloS / 2 },
      });
      var coreS = Math.max(1, 14 * ptIn);
      kids.push({
        type: 'circle', size: coreS, fill: C.violet,
        opacity: ptA,
        blur: 8,
        positioned: { left: 960 - coreS / 2, top: 390 - coreS / 2 },
      });
    }

    // The spark's afterglow: a soft violet wash behind the glass while it
    // settles, gone once the mark starts writing.
    var glowT = tw(18, 18, 0, 1, 'easeOut') *
      (1 - tw(56, 28, 0, 1, 'easeInOutCubic'));
    if (glowT > 0.003) {
      var washS = 520;
      kids.push({
        type: 'circle', size: washS, fill: C.violet,
        opacity: 0.14 * glowT,
        blur: 80,
        positioned: { left: 960 - washS / 2, top: 390 - washS / 2 },
      });
    }

    // ---- 20–60: the tile materializes --------------------------------------
    var tileA = 0.96 * tw(20, 26, 0, 1, 'easeOut');
    if (tileA > 0.003) {
      var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
      kids.push({
        type: 'rect',
        width: BRAND.tile.w * k, height: BRAND.tile.h * k,
        radius: BRAND.tile.rx * k,
        fill: '#17223B',
        stroke: '#2E3C5F',
        strokeWidth: Math.max(2, 5.5 * k),
        opacity: tileA,
        positioned: { left: tl.x, top: tl.y },
      });
    }

    // ---- 20–80: the wordmark writes itself: complete, canonical Fa --------
    var fP = tw(26, 32, 0, 1, 'easeInOutCubic');
    var accentP = tw(44, 22, 0, 1, 'easeOut');
    var bowlP = tw(38, 30, 0, 1, 'easeInOutCubic');
    var stemP = tw(56, 24, 0, 1, 'easeInOutCubic');
    var faMarkKids = completeFaMark(fP, accentP, bowlP, stemP, 1);
    for (var fmi = 0; fmi < faMarkKids.length; fmi++) {
      kids.push(faMarkKids[fmi]);
    }

    // ---- 120–160: the ground glow ------------------------------------------
    // A thin teal bar breathing under the finished mark (the morph's settle
    // wave), arriving with the availability line.
    var gIn = tw(114, 18, 0, 1, 'easeOut');
    if (gIn > 0.003) {
      var gb = brandToScreen(522, 742);
      var gw = 560 * k * (1 + 0.05 * jsr.motion.wave(ms, 2800, 1, 0));
      kids.push({
        type: 'rect',
        width: gw, height: 8 * k, radius: 4,
        fill: C.tealLight,
        opacity: 0.22 * gIn,
        positioned: { left: gb.x - gw / 2, top: gb.y },
      });
    }

    // ---- 80–160: the lockup below the tile ---------------------------------
    var FA_TOP = 615;
    var faIn = tw(80, 26, 0, 1, 'easeOutExpo');
    var tagIn = tw(92, 26, 0, 1, 'easeOutExpo');
    var avIn = tw(120, 26, 0, 1, 'easeOutExpo');

    var silverGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    kids.push({
      type: 'text', text: 'FA', width: 1920,
      opacity: faIn,
      offsetY: 26 * (1 - faIn),
      style: {
        fontSize: 210,
        color: '#FFFFFF',
        fontFamily: 'Impact',
        fontWeight: '700',
        letterSpacing: 8,
        textAlign: 'center',
        gradient: silverGrad,
        textShadows: [{ color: '#448F6BFF', blur: 48 }],
      },
      positioned: { left: 0, top: FA_TOP },
    });

    kids.push({
      type: 'text', text: 'ONE AGENT HARNESS. EVERY DEVICE.', width: 1920,
      opacity: tagIn,
      offsetY: 18 * (1 - tagIn),
      style: {
        fontSize: 38,
        color: '#C0C0C8',
        fontFamily: 'Impact',
        fontWeight: '700',
        letterSpacing: 4,
        textAlign: 'center',
        textShadows: [{ color: '#33000000', blur: 16 }],
      },
      positioned: { left: 0, top: FA_TOP + 230 },
    });

    kids.push({
      type: 'text', text: 'fa1.dev — macOS · Windows · iOS · Web · Chrome', width: 1920,
      opacity: avIn,
      offsetY: 14 * (1 - avIn),
      style: {
        fontSize: 32,
        color: C.tealLight,
        fontFamily: 'monospace',
        letterSpacing: 2,
        textAlign: 'center',
      },
      positioned: { left: 0, top: FA_TOP + 290 },
    });

    // ---- 160–180: the final bloom ------------------------------------------
    // A soft pulse at the a's bowl (the ring flares with it), everything
    // brightens 8% and eases back down. Hold on the lockup.
    var pulse = tw(160, 8, 0, 1, 'easeOut') * tw(168, 12, 1, 0, 'easeInOutCubic');
    if (pulse > 0.003) {
      var bp = brandToScreen(BRAND.a.bowl.cx, BRAND.a.bowl.cy);
      var bHalo = 132 * (1 + 0.5 * pulse);
      kids.push({
        type: 'circle', size: bHalo, fill: C.tealLight,
        opacity: 0.30 * pulse,
        blur: 70,
        positioned: { left: bp.x - bHalo / 2, top: bp.y - bHalo / 2 },
      });
      var bCore = 54 * (1 + 0.35 * pulse);
      kids.push({
        type: 'circle', size: bCore, fill: C.tealSpark,
        opacity: 0.55 * pulse,
        blur: 34,
        positioned: { left: bp.x - bCore / 2, top: bp.y - bCore / 2 },
      });
      kids.push(polylineNode(
        ringPoints(BRAND.a.bowl.cx, BRAND.a.bowl.cy, BRAND.a.bowl.r, 24),
        38, 1, C.tealSpark, 0.6 * pulse));
    }

    // A faint vignette keeps the corners quiet.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.20,
      positioned: { left: 0, top: 0 },
    });

    // The 8% lift rides on top of everything, then eases away.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#E9F1FF',
      opacity: 0.08 * pulse,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
