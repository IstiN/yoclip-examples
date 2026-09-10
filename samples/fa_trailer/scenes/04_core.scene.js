// 04 — Core — four type-on-black spec beats in Apple's authentic full-bleed style.
//
// Direct 1:1 remake of Apple's typographic grammar from the Mac Studio film:
//   ·  Beat 1 (0–45):   AN AGENT / POWERHOUSE      (mirrors "AN AI / POWERHOUSE")
//   ·  Beat 2 (45–90):  PURE DART. / PURE POWER.   (mirrors "THE NEW")
//   ·  Beat 3 (90–135): 10 PROVIDERS. / ONE LOOP.  (line 2 in metallic violet, mirrors "TRAIN" / "EDIT")
//   ·  Beat 4 (135–180): NATIVE TOOLS. / ZERO LOCK-IN. (mirrors "NEURAL ACCELERATORS")
//
// Key typographic properties:
// - Heavy, punchy Impact letterforms spanning edge-to-edge (1830px rendered width).
// - Multi-stop vertical metallic gradients (silver specular highlights to gunmetal shadows).
// - Edge-to-edge scale: lines fill ~90% of frame height (980px of 1080px).
// - Sub-pixel tight leading: lines nearly touch with 20–30px gap.
// - Slam-in: scale 1.12 -> 1.0 + opacity 0 -> 1 in 7 frames easeOutExpo, dead still hold, hard cut out.

scene = {
  id: '04_core',
  duration: 165,
  from: 615,
  timeline: {
    label: 'Core',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var C = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var BEATS = [
      {
        line1: 'AN AGENT',
        fs1: 480,
        top1: 35,
        line2: 'POWERHOUSE',
        fs2: 345,
        top2: 545,
        accent: false,
      },
      {
        line1: 'PURE DART.',
        fs1: 420,
        top1: 45,
        line2: 'PURE POWER.',
        fs2: 370,
        top2: 535,
        accent: false,
      },
      {
        line1: '10 PROVIDERS.',
        fs1: 275,
        top1: 130,
        line2: 'ONE LOOP.',
        fs2: 440,
        top2: 460,
        accent: true,
      },
      {
        line1: 'NATIVE TOOLS.',
        fs1: 345,
        top1: 80,
        line2: 'ZERO LOCK-IN.',
        fs2: 345,
        top2: 520,
        accent: false,
      },
    ];

    var BEAT_LEN = 41.25;
    var IN = 6;
    var OUT = 4;

    var bi = Math.min(BEATS.length - 1, Math.floor(frame / BEAT_LEN));
    var beat = BEATS[bi];
    var b0 = bi * BEAT_LEN;

    var slam = tw(b0, IN, 0, 1, 'easeOutExpo');
    var exitT = tw(b0 + BEAT_LEN - OUT, OUT, 0, 1, 'easeIn');
    var beatScale = lerp(1.10, 1.0, slam);
    var beatOp = slam * (1 - exitT);

    // Multi-stop metallic silver gradient for top line
    var gradTop = {
      begin: 'topCenter',
      end: 'bottomCenter',
      colors: ['#FFFFFF', '#ECECEF', '#A4A4AF'],
      stops: [0.0, 0.45, 1.0],
    };

    // Darker gunmetal silver or metallic violet for bottom line
    var gradBottom = beat.accent
      ? {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#D6A8FF', '#9E64FF', '#6B2BE8'],
          stops: [0.0, 0.5, 1.0],
        }
      : {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#C0C0C8', '#8E8E98'],
          stops: [0.0, 1.0],
        };

    function titleLine(text, fontSize, top, gradient, isAccent) {
      return {
        type: 'text',
        text: text,
        width: 1920,
        opacity: beatOp,
        style: {
          fontSize: fontSize,
          color: '#FFFFFF',
          fontFamily: 'Impact',
          fontWeight: '700',
          letterSpacing: 0,
          textAlign: 'center',
          gradient: gradient,
        },
        positioned: { left: 0, top: top },
      };
    }

    var beatGroup = {
      type: 'stack',
      fit: 'expand',
      scale: beatScale,
      children: [
        titleLine(beat.line1, beat.fs1, beat.top1, gradTop, false),
        titleLine(beat.line2, beat.fs2, beat.top2, gradBottom, beat.accent),
      ],
    };

    // Faint diagonal specular flare passing across text during slam
    var swP = tw(b0, 22, 0, 1, 'easeInOutCubic');
    var sweepOp = 0.08 * tw(b0, 5, 0, 1, 'easeOut') * (1 - tw(b0 + 17, 5, 0, 1, 'easeIn'));
    var sweep = {
      type: 'rect',
      width: 280,
      height: 480,
      radius: 80,
      fill: '#FFFFFF',
      opacity: sweepOp,
      rotation: -25,
      positioned: { left: lerp(-350, 2150, swP), top: 280 },
    };

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'rect',
          width: 1920,
          height: 1080,
          fill: '#000000',
          positioned: { left: 0, top: 0 },
        },
        beatGroup,
        sweep,
      ],
    };
  },
};
