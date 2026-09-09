// 07 — Work — the fast montage: one image, two directions.
//
//   ·  0–75    the AI desk placeholder, Ken-Burns 1.08 → 1.18 (linear) with
//              a slow upward drift; violet tint 0.06 on top; three terminal
//              autofire rows type on staggered (the text is sliced per
//              frame), monospace 30px teal with a two-layer glow
//   ·  75–78   hard cut to black — the film breathes for 3 frames
//   ·  78–150  the SAME desk runs BACKWARDS (1.18 → 1.08, drift rewound)
//              under a darker scrim while three captions slam in every 15
//              frames — scale 1.2 → 1.0 pops, Roboto 700 44px, centered
//   ·  140–150 fade to #070a12 — out on black

scene = {
  id: '07_work',
  duration: 150,
  from: 1230,
  timeline: {
    label: 'Work',
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

    // ---- The two halves ----------------------------------------------------
    // First half: push in. Three black frames. Second half: the rewind.
    var FLIP = 75;                    // the hard cut
    var BACK = 78;                    // the desk returns, running backwards
    var firstHalf = frame < FLIP;
    var showDesk = firstHalf || frame >= BACK;

    var kb1 = tw(0, FLIP, 0, 1, 'linear');   // push in 0–75
    var kb2 = tw(BACK, 70, 0, 1, 'linear');  // rewind 78–148
    var deskScale = firstHalf
      ? lerp(1.08, 1.18, kb1)
      : lerp(1.18, 1.08, kb2);
    var deskDrift = firstHalf
      ? lerp(0, -26, kb1)
      : lerp(-26, 0, kb2);

    var desk = {
      type: 'image',
      source: 'external:ai_desk',
      fit: 'cover',
      width: 1920,
      height: 1080,
    };

    // ---- The terminal autofire rows ----------------------------------------
    // Typing = slicing the string per frame; a `_` rides the last typed
    // character until the row completes. The rows sit lower-left, the way a
    // real run log does, on a soft dark band so they read over the photo.
    var ROWS = [
      { text: 'fa run --goal "ship the release"', at: 6, dur: 34 },
      { text: '▸ 12 tests passed', at: 30, dur: 14 },
      { text: '▸ rewound 1 checkpoint', at: 44, dur: 16 },
    ];

    var termRows = [];
    for (var i = 0; i < ROWS.length; i++) {
      var r = ROWS[i];
      var t = tw(r.at, r.dur, 0, 1, 'linear');
      if (t <= 0) continue;
      var n = Math.floor(t * (r.text.length + 0.0001));
      var shown = r.text.slice(0, n);
      if (t < 1) shown += '_';
      termRows.push({
        type: 'text',
        text: shown,
        style: {
          fontSize: 30,
          color: C.tealLight,
          fontFamily: 'monospace',
          letterSpacing: 1,
          textShadows: [
            { color: '#' + hex2(0.55) + '48C7E8', blur: 14 },
            { color: '#' + hex2(0.25) + '48C7E8', blur: 38 },
          ],
        },
        positioned: { left: 130, top: 776 + i * 62 },
      });
    }

    // ---- The caption slams (second half) ------------------------------------
    var CAPS = ['tests green', 'refactored', 'shipped'];
    var capKids = [];
    if (!firstHalf) {
      for (var k = 0; k < CAPS.length; k++) {
        var t0 = 84 + k * 15;
        if (frame < t0) continue;
        var pop = tw(t0, 8, 0, 1, 'easeOutExpo');
        capKids.push({
          type: 'text',
          text: CAPS[k],
          width: 1920,
          opacity: tw(t0, 4, 0, 1, 'easeOut'),
          scale: lerp(1.2, 1.0, pop),
          style: {
            fontSize: 44,
            color: '#EAEAF2',
            fontFamily: 'Roboto',
            fontWeight: '700',
            letterSpacing: 2,
            textAlign: 'center',
          },
          positioned: { left: 0, top: 462 + k * 78 },
        });
      }
    }

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    if (showDesk) {
      // The Ken-Burns wrap: the image scales about screen center while the
      // whole group drifts — push in forward, rewind backward.
      kids.push({
        type: 'stack',
        fit: 'expand',
        scale: deskScale,
        offsetY: deskDrift,
        children: [desk],
      });

      // The violet tint — the film's light on the placeholder footage.
      kids.push({
        type: 'rect', width: 1920, height: 1080, fill: C.violet,
        opacity: 0.06,
        positioned: { left: 0, top: 0 },
      });
    }

    // First half: the dark band + the autofire rows.
    if (firstHalf && termRows.length > 0) {
      kids.push({
        type: 'rect', width: 700, height: 218, radius: 12,
        fill: C.background, opacity: 0.45,
        positioned: { left: 96, top: 748 },
      });
      for (var tr = 0; tr < termRows.length; tr++) kids.push(termRows[tr]);
    }

    // Second half: a heavier scrim so the captions own the frame.
    if (!firstHalf) {
      kids.push({
        type: 'rect', width: 1920, height: 1080, fill: C.background,
        opacity: 0.5 * tw(BACK, 8, 0, 1, 'easeOut'),
        positioned: { left: 0, top: 0 },
      });
      for (var ck = 0; ck < capKids.length; ck++) kids.push(capKids[ck]);
    }

    // Out on black: the last 10 frames go to #070a12.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      opacity: tw(140, 10, 0, 1, 'easeInOutCubic'),
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
