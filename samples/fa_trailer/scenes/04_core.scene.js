// 04 — Core — four type-on-black spec beats, FULL-BLEED STACKED CAPS.
//
// Mirrors the Mac Studio film's s06 grammar ("AN AI / POWERHOUSE"): each
// beat is two stacked UPPERCASE lines, each line sized so it nearly spans
// the frame edge-to-edge, tight leading (line 2 almost touches line 1),
// white on near-black, dead still during the hold. No sub-lines — the
// words are the whole shot, the way Apple plays it.
//
//   ·  b1  0–45    AN AGENT / POWERHOUSE      (mirror of "AN AI / POWERHOUSE")
//   ·  b2  45–90   PURE DART. / PURE POWER.
//   ·  b3  90–135  10 PROVIDERS. / ONE LOOP.  (line 2 violet, "TRAIN" accent)
//   ·  b4  135–180 BORN TO RUN / YOUR TASKS.
//
// Each beat SLAMS in (scale 1.15 → 1.0 + opacity 0 → 1, 8 frames
// easeOutExpo), holds dead still, then cuts out fast (6 frames easeIn).
// fontSize per line ≈ 1840 / (0.62 × chars) so Roboto caps fill ~1840px.

scene = {
  id: '04_core',
  duration: 180,
  from: 600,
  timeline: {
    label: 'Core',
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

    // ---- The four beats ----------------------------------------------------
    // Each line gets its own size — Apple stacks lines of DIFFERENT heights
    // so both span the full width ("AN AI" towers over "POWERHOUSE").
    var BEATS = [
      { lines: ['AN AGENT', 'POWERHOUSE'] },
      { lines: ['PURE DART.', 'PURE POWER.'] },
      { lines: ['10 PROVIDERS.', 'ONE LOOP.'], accent: 1 },
      { lines: ['BORN TO RUN', 'YOUR TASKS.'] },
    ];

    var BEAT_LEN = 45;   // frames per beat
    var IN = 8;          // slam-in length
    var OUT = 6;         // fast cut-out length
    var FILL = 1800;     // target rendered width per line
    var LEAD = 0.92;     // line 2 top = line 1 top + fs1 * LEAD (tight)

    // Only the active beat is on stage; joins are hard cuts through black.
    var bi = Math.min(BEATS.length - 1, Math.floor(frame / BEAT_LEN));
    var beat = BEATS[bi];
    var b0 = bi * BEAT_LEN;

    // Per-line size + vertical centering of the whole block.
    // Space-aware width units: a space is ~half a condensed cap glyph.
    var sizes = beat.lines.map(function(s) {
      var units = 0;
      for (var i = 0; i < s.length; i++) {
        units += s[i] === ' ' ? 0.28 : 0.56;
      }
      return Math.round(FILL / units);
    });
    var blockH = sizes[0] * LEAD + sizes[1];
    var top1 = Math.round((1080 - blockH) / 2);

    // ---- Clocks ------------------------------------------------------------
    var slam = tw(b0, IN, 0, 1, 'easeOutExpo');
    var exitT = tw(b0 + BEAT_LEN - OUT, OUT, 0, 1, 'easeIn');
    var beatScale = lerp(1.15, 1.0, slam);
    var beatOp = slam * (1 - exitT);

    // ---- The stacked caps --------------------------------------------------
    function capsLine(text, fontSize, top, isAccent) {
      return {
        type: 'text',
        text: text,
        width: 1920,
        opacity: beatOp,
        style: {
          fontSize: fontSize,
          color: isAccent ? C.violetBright : '#EAEAF2',
          fontFamily: 'RobotoCondensed',
          fontWeight: '700',
          letterSpacing: 0,
          textAlign: 'center',
          textShadows: [{ color: '#2E8F6BFF', blur: 46 }],
        },
        positioned: { left: 0, top: top },
      };
    }

    var beatGroup = {
      type: 'stack',
      fit: 'expand',
      scale: beatScale,
      children: [
        capsLine(beat.lines[0], sizes[0], top1, false),
        capsLine(beat.lines[1], sizes[1],
          Math.round(top1 + sizes[0] * LEAD), beat.accent === 1),
      ],
    };

    // ---- The light sweep ---------------------------------------------------
    // A thin violet band tipped -20° crossing the caps while the slam
    // settles; gone before the hold, leaving the beat dead still.
    var swP = tw(b0, 26, 0, 1, 'easeInOutCubic');
    var sweepOp = 0.09 *
      tw(b0, 6, 0, 1, 'easeOut') *
      (1 - tw(b0 + 20, 6, 0, 1, 'easeInOutCubic'));
    var sweep = {
      type: 'rect',
      width: 210,
      height: 340,
      radius: 60,
      fill: C.violetBright,
      opacity: sweepOp,
      rotation: -20,
      positioned: { left: lerp(-280, 2080, swP), top: 340 },
    };

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    kids.push(beatGroup);
    kids.push(sweep);

    // A faint vignette keeps the corners quiet — pure type needs the falloff.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.3,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
