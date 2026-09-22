// 02b — Brand splash: the Fa trailer opening beat on a white background.
//
//   ·   4-30   anamorphic streak crosses the white
//   ·   8-30   white-glass squircle tile pops in, violet halo breathing
//   ·  16-50   perimeter rim traces around (violet -> teal)
//   ·  28-56   terminal `>_` prompt pulses, then dissolves
//   ·  55-94   the living face `( > _ o )` wakes — smile, wink, spark
//   · 106-120  everything melts into white — hands off to 03 (which opens
//              with its own white dissolve, same handoff language as hook->02)
//
// The animation itself lives in the brand kit: brand/fa/fa_splash.js
// (faSplashKids) — single source of truth shared with the trailer.

scene = {
  id: '02b_splash',
  duration: 120,
  from: 662,
  timeline: {
    label: 'Splash',
    color: '#5B61F6',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var F = faFormat();

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var kids = [];

    // Pure white brand plate — the splash plays on white in every variant.
    kids.push({
      type: 'rect', width: F.W, height: F.H, fill: '#FFFFFF',
      positioned: { left: 0, top: 0 },
    });

    kids = kids.concat(faSplashKids(frame, { light: true }));

    // Tail: melt the whole composition into white for the seamless cut.
    // Shapes paint `fill` (not `color`); alpha is baked into the 8-digit
    // hex (#AARRGGBB) — the `opacity` wrap proved unreliable here.
    var out = tw(106, 14, 0, 1, 'easeIn');
    if (out > 0.003) {
      var a = Math.round(out * 255).toString(16).padStart(2, '0');
      kids.push({
        type: 'rect', width: F.W, height: F.H,
        fill: '#' + a + 'FFFFFF',
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
