// 05 — Everywhere — one harness, every device.
//
//   ·  0–40    the corridor push (1 → 1.12 linear over the whole scene) and
//              the headline rises in on easeOutExpo: `One agent harness,` /
//              `every device.` (staggered 8f, subtle violet glow)
//   ·  40–100  the platform grid materializes: 8 chips popping in 6 frames
//              apart (scale 0.8 → 1 backOut + fade), 3x3 with the last cell
//              deliberately empty
//   ·  150–210 the Chrome chip takes one breath (1 → 1.06 → 1, stroke warms
//              teal) and the browser sub-line writes in under the grid
//   ·  210–240 hold: the glow breathes — nothing else moves
//
// AI-art placeholder: external:ai_corridor (PNG start frame; becomes a
// video asset under the same key when the real clip lands).

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
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to,
        easing);
    }

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    // ---- Clocks ------------------------------------------------------------
    var zoom = lerp(1.0, 1.12, tw(0, 240, 0, 1, 'linear'));
    var breathe = 0.5 + 0.5 * Math.sin((ms / 2600) * Math.PI * 2);

    var headIn1 = tw(0, 40, 0, 1, 'easeOutExpo');    // line 1: 0–40
    var headIn2 = tw(8, 40, 0, 1, 'easeOutExpo');    // line 2: 8–48
    var subIn = tw(150, 30, 0, 1, 'easeOut');        // sub-line 150–180

    // ---- Background: the corridor, pushed and darkened ---------------------
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

    var dim = {
      type: 'rect',
      width: 1920,
      height: 1080,
      fill: C.background,
      opacity: 0.55,
      positioned: { left: 0, top: 0 },
    };

    // A faint vignette keeps the corners quiet (flat wash + soft edge falloff).
    var vignette = [
      {
        type: 'rect', width: 1920, height: 1080, fill: '#06070B',
        opacity: 0.18, positioned: { left: 0, top: 0 },
      },
      {
        type: 'rect', width: 320, height: 1080, fill: '#06070B',
        opacity: 0.5, blur: 90, positioned: { left: -160, top: 0 },
      },
      {
        type: 'rect', width: 320, height: 1080, fill: '#06070B',
        opacity: 0.5, blur: 90, positioned: { left: 1920 - 160, top: 0 },
      },
      {
        type: 'rect', width: 1920, height: 260, fill: '#06070B',
        opacity: 0.5, blur: 90, positioned: { left: 0, top: -130 },
      },
      {
        type: 'rect', width: 1920, height: 260, fill: '#06070B',
        opacity: 0.5, blur: 90, positioned: { left: 0, top: 1080 - 130 },
      },
    ];

    // ---- The headline (upper third) — stacked caps, Apple style ------------
    function headline(text, top, p) {
      return {
        type: 'text',
        text: text,
        width: 1920,
        opacity: p,
        offsetY: 40 * (1 - p),
        style: {
          fontSize: 280,
          color: '#EAEAF2',
          fontFamily: 'RobotoCondensed',
          fontWeight: '700',
          letterSpacing: 0,
          textAlign: 'center',
          textShadows: [
            { color: '#8C000000', blur: 26 },
            {
              color: '#' + hex2(0.10 + 0.10 * breathe) + '8F6BFF',
              blur: 22 + 14 * breathe,
            },
          ],
        },
        positioned: { left: 0, top: top },
      };
    }

    var head1 = headline('ONE HARNESS', 46, headIn1);
    var head2 = headline('EVERY DEVICE.', 304, headIn2);
    head2.style.fontSize = 250;

    // ---- The platform grid --------------------------------------------------
    var LABELS = ['iOS', 'Android', 'macOS', 'Windows', 'Linux', 'Web',
      'CLI', 'Chrome'];
    var CHIP_W = 380, CHIP_H = 110, GAP_X = 40, GAP_Y = 36;
    var GRID_LEFT = (1920 - (3 * CHIP_W + 2 * GAP_X)) / 2; // 350
    var GRID_TOP = 470;

    // The Chrome chip's one breath: 0 → 1 → 0 across 150–210, then it keeps
    // the hold alive with a gentle half-breath.
    var chromeBreath = frame >= 150
      ? (1 - Math.cos(((frame - 150) / 60) * Math.PI * 2)) / 2
      : 0;

    var chips = [];
    for (var i = 0; i < LABELS.length; i++) {
      var col = i % 3;
      var row = Math.floor(i / 3);
      var left = GRID_LEFT + col * (CHIP_W + GAP_X);
      var top = GRID_TOP + row * (CHIP_H + GAP_Y);
      var isChrome = i === LABELS.length - 1;
      var popAt = 40 + i * 6;
      var pop = tw(popAt, 18, 0, 1, 'backOut');
      var op = tw(popAt, 10, 0, 1, 'easeOut');
      if (op <= 0) continue; // not born yet
      var sc = lerp(0.8, 1, pop);
      if (isChrome) sc *= 1 + 0.06 * chromeBreath;
      var stroke = isChrome
        ? lerpColor('#2E3C5F', '#48C7E8', 0.45 * chromeBreath)
        : '#2E3C5F';
      var label = {
        type: 'text',
        text: LABELS[i],
        width: CHIP_W,
        style: {
          fontSize: 40,
          color: C.violetBright,
          fontFamily: 'Roboto',
          fontWeight: '500',
          letterSpacing: 1,
          textAlign: 'center',
        },
        positioned: { left: 0, top: 31 },
      };
      if (isChrome && chromeBreath > 0.02) {
        label.style.textShadows = [
          { color: '#' + hex2(0.45 * chromeBreath) + '48C7E8', blur: 18 },
        ];
      }
      chips.push({
        type: 'stack',
        width: CHIP_W,
        height: CHIP_H,
        scale: sc,
        opacity: op,
        positioned: { left: left, top: top },
        children: [
          {
            type: 'rect',
            width: CHIP_W,
            height: CHIP_H,
            radius: 20,
            fill: '#17223B',
            opacity: 0.82,
            stroke: stroke,
            strokeWidth: 1.5,
            positioned: { left: 0, top: 0 },
          },
          label,
        ],
      });
    }

    // ---- The browser sub-line ----------------------------------------------
    var subLine = {
      type: 'text',
      text: '34 browser tools. One agent.',
      width: 1920,
      opacity: subIn,
      offsetY: 14 * (1 - subIn),
      style: {
        fontSize: 36,
        color: C.tealLight,
        fontFamily: 'Roboto',
        fontWeight: '400',
        letterSpacing: 1.5,
        textAlign: 'center',
        textShadows: [{ color: '#66000000', blur: 18 }],
      },
      positioned: { left: 0, top: 908 },
    };

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });
    kids.push(art);
    kids.push(dim);
    for (var v = 0; v < vignette.length; v++) kids.push(vignette[v]);
    kids.push(head1);
    kids.push(head2);
    for (var ci = 0; ci < chips.length; ci++) kids.push(chips[ci]);
    kids.push(subLine);

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
