// 05 — Everywhere — one harness, every device.
//
//   ·  0–40    the corridor push (1 → 1.12 linear) and the headline rises in
//              Apple-style full-bleed Impact: `ONE HARNESS.` / `EVERY DEVICE.`
//   ·  40–100  the platform grid materializes: 8 chips popping in 6 frames
//              apart (scale 0.8 → 1 backOut + fade), 3x3 layout
//   ·  150–210 the Chrome chip takes one breath and the browser sub-line
//              writes in under the grid
//   ·  210–240 hold: the glow breathes — nothing else moves
//
// AI-art placeholder: external:ai_corridor

scene = {
  id: '05_everywhere',
  duration: 240,
  from: 780,
  timeline: {
    label: 'Everywhere',
    color: '#48C7E8',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    var zoom = lerp(1.0, 1.12, tw(0, 240, 0, 1, 'linear'));
    var breathe = 0.5 + 0.5 * Math.sin((ms / 2600) * Math.PI * 2);

    var headIn1 = tw(0, 36, 0, 1, 'easeOutExpo');
    var headIn2 = tw(6, 36, 0, 1, 'easeOutExpo');
    var subIn = tw(150, 30, 0, 1, 'easeOut');

    var art = {
      type: 'stack',
      fit: 'expand',
      scale: zoom,
      children: [
        {
          type: 'image',
          source: 'external:ai_corridor',
          fit: 'cover',
          width: 1920,
          height: 1080,
          positioned: { left: 0, top: 0 },
        },
      ],
    };

    var scrims = [
      {
        type: 'rect', width: 1920, height: 1080, fill: '#070a12',
        opacity: 0.55, positioned: { left: 0, top: 0 },
      },
    ];

    // ---- The headline in Impact with metallic gradients --------------------
    var silverGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#9E9EA8'],
      stops: [0.0, 0.45, 1.0],
    };

    var gunmetalGrad = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#C8C8D2', '#848490'],
      stops: [0.0, 1.0],
    };

    var head1 = {
      type: 'text',
      text: 'ONE HARNESS.',
      width: 1920,
      opacity: headIn1,
      offsetY: 30 * (1 - headIn1),
      style: {
        fontSize: 205,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: silverGrad,
        textShadows: [{ color: '#448F6BFF', blur: 48 }],
      },
      positioned: { left: 0, top: 25 },
    };

    var head2 = {
      type: 'text',
      text: 'EVERY DEVICE.',
      width: 1920,
      opacity: headIn2,
      offsetY: 30 * (1 - headIn2),
      style: {
        fontSize: 205,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
        gradient: gunmetalGrad,
        textShadows: [{ color: '#22000000', blur: 24 }],
      },
      positioned: { left: 0, top: 230 },
    };

    // ---- The platform grid --------------------------------------------------
    var LABELS = ['iOS', 'Android', 'macOS', 'Windows', 'Linux', 'Web', 'CLI', 'Chrome'];
    var CHIP_W = 380, CHIP_H = 100, GAP_X = 40, GAP_Y = 28;
    var GRID_LEFT = (1920 - (3 * CHIP_W + 2 * GAP_X)) / 2; // 350
    var GRID_TOP = 490;

    var chips = [];
    for (var i = 0; i < LABELS.length; i++) {
      var col = i % 3;
      var row = Math.floor(i / 3);
      var left = GRID_LEFT + col * (CHIP_W + GAP_X);
      var top = GRID_TOP + row * (CHIP_H + GAP_Y);

      var at = 40 + i * 6;
      var pop = tw(at, 22, 0, 1, 'backOut');
      var op = tw(at, 12, 0, 1, 'easeOut');
      if (op <= 0) continue;

      var isChrome = i === 7;
      var scale = pop;
      var chipStroke = '#2E3C5F';
      var chipFill = '#111A2E';

      if (isChrome) {
        var cp = tw(150, 60, 0, 1, 'easeInOutCubic');
        if (cp > 0 && cp < 1) {
          scale *= 1 + 0.05 * Math.sin(cp * Math.PI * 2);
          chipStroke = lerpColor('#2E3C5F', '#48C7E8', Math.sin(cp * Math.PI));
        }
      }

      var card = {
        type: 'stack',
        width: CHIP_W,
        height: CHIP_H,
        scale: scale,
        opacity: op,
        children: [
          {
            type: 'rect',
            width: CHIP_W, height: CHIP_H, radius: 16,
            fill: chipFill,
            stroke: chipStroke,
            strokeWidth: isChrome ? 2.5 : 1.5,
            opacity: 0.90,
            positioned: { left: 0, top: 0 },
          },
          {
            type: 'text',
            text: LABELS[i],
            width: CHIP_W,
            style: {
              fontSize: 38,
              fontFamily: 'Impact',
              color: isChrome ? '#5CE8CF' : '#EAEAF2',
              textAlign: 'center',
              textShadows: [{ color: '#33000000', blur: 12 }],
            },
            positioned: { left: 0, top: 26 },
          },
        ],
        positioned: { left: left, top: top },
      };
      chips.push(card);
    }

    var subLine = {
      type: 'text',
      text: '34 BROWSER TOOLS. ONE AGENT.',
      width: 1920,
      opacity: subIn,
      offsetY: 15 * (1 - subIn),
      style: {
        fontSize: 38,
        fontFamily: 'Impact',
        color: '#48C7E8',
        letterSpacing: 3,
        textAlign: 'center',
        textShadows: [{ color: '#55000000', blur: 16 }],
      },
      positioned: { left: 0, top: 920 },
    };

    var kids = [art].concat(scrims);
    kids.push(head1);
    kids.push(head2);
    kids = kids.concat(chips);
    kids.push(subLine);

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
