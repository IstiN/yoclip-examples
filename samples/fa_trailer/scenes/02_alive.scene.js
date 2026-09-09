// 02 — Alive — The declaration: IT LIVES IN YOUR CODE.
//
//   ·   0–30   Cinematic zoom on the obsidian tile with living eyes (0_0)
//   ·  30–90   The statement slams in: `IT LIVES IN YOUR CODE.` (Impact, metallic gradient)
//   ·  90–120  The second wink: right eye winks with cyan spark
//   · 140–180  Smooth fade into darkness before the hardware drop

scene = {
  id: '02_alive',
  duration: 180,
  from: 210,
  timeline: {
    label: 'Alive',
    color: '#C9B8FF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var silverGrad = {
      type: 'linear',
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#C2C2CC', '#8A8A96'],
      stops: [0.0, 0.42, 0.72, 1.0],
    };

    // Zoom and position of the tile
    var zoom = lerp(1.0, 1.14, tw(0, 180, 0, 1, 'easeInOutCubic'));
    var tileScale = 0.38 * zoom;
    setMapper(tileScale, 512, 512, 960, 360);

    // Typography motion
    var typeIn = tw(24, 38, 0, 1, 'easeOutExpo');
    var typeOffY = 32 * (1 - typeIn);
    var fadeT = tw(145, 35, 0, 1, 'easeInOutCubic');

    var kids = [];

    // Deep void
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#05070D',
      positioned: { left: 0, top: 0 },
    });

    // ---- The Obsidian Tile at (960, 360) -----------------------------------
    var tl = brandToScreen(BRAND.tile.x, BRAND.tile.y);
    var tw_w = BRAND.tile.w * tileScale;
    var tw_h = BRAND.tile.h * tileScale;
    var tw_rx = BRAND.tile.rx * tileScale;

    // Ambient purple/blue backlight
    kids.push({
      type: 'circle',
      size: 520 * zoom,
      fill: '#5B61F6',
      opacity: 0.18 * (1 - fadeT),
      blur: 64,
      positioned: { left: 960 - (520 * zoom) / 2, top: 360 - (520 * zoom) / 2 },
    });

    // Tile body
    kids.push({
      type: 'rect',
      width: tw_w,
      height: tw_h,
      radius: tw_rx,
      fill: '#0C1322',
      stroke: '#24324F',
      strokeWidth: Math.max(2, 5 * tileScale),
      opacity: 1 - fadeT * 0.4,
      positioned: { left: tl.x, top: tl.y },
    });

    // ---- Living Vector Face `>o` -------------------------------------------
    var eyeR_cx = 675, eyeR_cy = 512, eyeR = 76;
    var pL = brandToScreen(345, 512);
    var pR = brandToScreen(eyeR_cx, eyeR_cy);

    // Cyan/blue iris glow
    kids.push({
      type: 'circle',
      size: 200 * tileScale,
      fill: '#5B61F6',
      opacity: 0.22,
      blur: 24,
      positioned: { left: pL.x - (200 * tileScale) / 2, top: pL.y - (200 * tileScale) / 2 },
    });
    kids.push({
      type: 'circle',
      size: 200 * tileScale,
      fill: '#2EBD9E',
      opacity: 0.22,
      blur: 24,
      positioned: { left: pR.x - (200 * tileScale) / 2, top: pR.y - (200 * tileScale) / 2 },
    });

    // Left eye: chevron > in brand blue
    var chPts = chevPoints(345, 512, 85, 95, 24);
    kids.push(polylineNode(chPts, 38, 1, '#5B61F6', 1));

    // Right eye: wink at frame 90–108
    var winkT = 0;
    if (frame >= 90 && frame <= 108) {
      if (frame < 94) winkT = (frame - 90) / 4;
      else if (frame <= 100) winkT = 1;
      else winkT = 1 - (frame - 100) / 8;
    }

    if (winkT > 0.01) {
      var dashW = lerp(eyeR * 2, 140, winkT);
      var dashH = lerp(38, 28, winkT);
      kids.push({
        type: 'rect',
        width: dashW * tileScale,
        height: dashH * tileScale,
        radius: (dashH / 2) * tileScale,
        fill: '#48C7E8',
        positioned: {
          left: pR.x - (dashW * tileScale) / 2,
          top: pR.y - (dashH * tileScale) / 2,
        },
      });
      if (winkT > 0.7) {
        kids.push({
          type: 'circle',
          size: 16 * tileScale,
          fill: '#FFFFFF',
          opacity: 0.95 * winkT,
          blur: 4,
          positioned: { left: pR.x + (dashW * tileScale) / 2 - 8 * tileScale, top: pR.y - 8 * tileScale },
        });
      }
    } else {
      var eyeRPtsOpen = ringPoints(eyeR_cx, eyeR_cy, eyeR, 24);
      kids.push(polylineNode(eyeRPtsOpen, 38, 1, '#2EBD9E', 1));
    }

    // ---- The Type Beat: IT LIVES IN YOUR CODE. ------------------------------
    kids.push({
      type: 'text',
      text: 'IT LIVES IN YOUR CODE.',
      width: 1920,
      opacity: typeIn * (1 - fadeT),
      offsetY: typeOffY,
      style: {
        fontSize: 120,
        color: '#FFFFFF',
        fontFamily: 'Impact',
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
        gradient: silverGrad,
        textShadows: [
          { color: '#8C000000', blur: 30 },
          { color: '#448F6BFF', blur: 48 },
        ],
      },
      positioned: { left: 0, top: 720 },
    });

    // Fade to black overlay towards end of scene
    if (fadeT > 0.003) {
      kids.push({
        type: 'rect', width: 1920, height: 1080, fill: '#05070D',
        opacity: fadeT,
        positioned: { left: 0, top: 0 },
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
