// 02 — Alive — the dive, and the sentence.
//
//   ·  0–30   the zoom continues 1.12 → 1.6 (easeInOutCubic) about the face
//   ·  30–90  the type-beat fades in under the face: `It lives in your code.`
//             (Roboto 700, 96px, rises 40px on easeOutExpo — letterSpacing
//             is not animatable, so the tracking-in is carried by the rise)
//   ·  90–120 the second wink: `( 0_0 )` → `( 0_- )` for 8 frames, then back
//   ·  120–180 everything but the face fades to black: a fullscreen
//             #070a12 rect ramps 0 → 1 from 150 (the type fades with it),
//             the face glow keeps breathing in the dark
//
// Self-contained duplicate of the 01_dark wall/face (scenes must not share
// state); the wall arrives already parked, dimmed to 0.55 and blurred 2.2 —
// exactly where 01_dark left it.

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
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to,
        easing);
    }

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    // Soft trapezoid pulse around a wink starting at frame `start`.
    function winkPulse(start) {
      var t = frame - start;
      if (t < 0 || t > 16) return 0;
      return t < 4 ? t / 4 : (t > 12 ? (16 - t) / 4 : 1);
    }

    // ---- The wall (parked where 01_dark left it) ---------------------------
    var ROW_H = 52;
    var FONT = 38;
    var FACE_I = 13;
    var FACE_STOP = 540 - ROW_H / 2 - 4;
    var sStop = FACE_STOP - FACE_I * ROW_H; // group offset: face at center

    // ---- Clocks ------------------------------------------------------------
    var zoom = lerp(1.12, 1.6, tw(0, 30, 0, 1, 'easeInOutCubic'));
    var typeIn = tw(34, 44, 0, 1, 'easeOutExpo');       // type beat 34–78
    var typeOffY = 40 * (1 - typeIn);                   // rises 40 → 0
    var fadeT = tw(150, 30, 0, 1, 'easeInOutCubic');    // to black 150–180

    // ---- The code wall -----------------------------------------------------
    var POOL = [
      '07  final agent = agents.where((a) => a.alive).first;  // the keeper — always the keeper',
      '08  if (busy) return null;   // do not interrupt a run; a run remembers being interrupted',
      '09  await provider.stream(prompt);  chunks: 512;  backoff: 2x;  timeout: 30s  // fine',
      '10  tools.register(search, shell, browser);  // give it hands, not opinions',
      '11  final stage = stage();  resize(1920, 1080);  fit: cover;  background: #070a12;  grain: off',
      '12  */section: harness   // ---- begin the run loop ----   steps: plan, act, observe, repeat',
      '13  AgentMode: focus;  attention: narrow;  drift: 0.0;  blink: occasionally  // it is alive',
      '14  render(frame + 1);  pump();  boundary.toImage(pixelRatio: 1);  flush();  repeat();  seek(0)',
      '15  memory.append(note);  recall(query);  decay: slow;  // it remembers what you forget',
      '16  export preset: shorts_1080;  fps: 30;  bitrate: 8_000k;  audio: aac 128k;  mux: single-pass',
      '17  providers: openai, anthropic, gemini, ollama;  // swap the brain, keep the spine',
      '18  storage.readBytes(path);  cache.warm(asset);  eviction: lru;  ttl: 30s;  hits: 99.2%',
      '19  scene.evaluate(frame);  graph.compile();  paint();  // 120 fps at 1080p — not bad at all',
      '20  interp(frame, [0, 30], [0, 1]);  easing: easeInOutCubic;  clamp: true;  // smooth in, smooth out',
      '21  spring(config: wobbly);  damping: 0.8;  mass: 1.0;  v0: 0;  // settle, do not bounce',
      '22  // TODO: teach it to sleep   // soon   // okay, fine — it never sleeps, it watches',
      '23  subagent.spawn(goal: explore);  depth: 1;  budget: 40k;  // it delegates when tired',
      '24  mux(audio: aac, video: h264);  sync: drift < 1ms  // tight — tighter than tight',
      '25  boundary.toImage(pixelRatio: 1);  rawRgba;  append();  // frame by frame by frame by frame',
      '26  seek(frame: 128);  play();  loop: false;  scrubbing: on;  markers: 3;  beats: 4/4',
      '27  yoclip render --output trailer.mp4   // the whole point of all of this, really',
      '28  commit: the wall is alive   // it winked back and nobody was ready for it',
    ];

    var rows = [];
    for (var i = -12; i <= 37; i++) {
      if (i === FACE_I) continue;
      var pi = ((i % POOL.length) + POOL.length) % POOL.length;
      rows.push({
        type: 'text',
        text: POOL[pi],
        style: {
          fontSize: FONT,
          color: pi % 4 === 3 ? '#37324C' : (i % 2 === 0 ? '#2A303E' : '#323848'),
          fontFamily: 'monospace',
          letterSpacing: 0.5,
        },
        positioned: {
          left: -24 + ((i * 53) % 70),
          top: i * ROW_H,
        },
      });
    }

    // ---- The face ----------------------------------------------------------
    var winking = frame >= 98 && frame < 106; // the second wink
    var faceText = winking ? '( 0_- )' : '( 0_0 )';

    var breathe = 1 + 0.09 * Math.sin((ms / 3400) * Math.PI * 2);
    var glowA = 0.92 + 0.08 * breathe + 0.14 * winkPulse(96);
    var glow = [
      { color: '#' + hex2(0.38 * glowA) + '8F6BFF', blur: 42 * breathe },
      { color: '#' + hex2(0.20 * glowA) + '8F6BFF', blur: 105 * breathe },
    ];

    var faceLine = {
      type: 'text',
      text: faceText,
      width: 1920,
      style: {
        fontSize: FONT,
        color: C.violetBright,
        fontFamily: 'monospace',
        letterSpacing: 0.5,
        textAlign: 'center',
        textShadows: glow,
      },
      positioned: { left: 0, top: FACE_I * ROW_H },
    };

    // ---- The type beat -----------------------------------------------------
    var typeLine = {
      type: 'text',
      text: 'It lives in your code.',
      width: 1920,
      opacity: typeIn * (1 - fadeT), // it fades to black with everything else
      offsetY: typeOffY,
      style: {
        fontSize: 96,
        color: '#EAEAF2',
        fontFamily: 'Roboto',
        fontWeight: '700',
        letterSpacing: 3,
        textAlign: 'center',
        textShadows: [{ color: '#8C000000', blur: 26 }],
      },
      positioned: { left: 0, top: 784 }, // centered at ~78% height (y≈842)
    };

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    // The zoomed wall, still defocused and dim from the focus pull.
    kids.push({
      type: 'stack',
      fit: 'expand',
      scale: zoom,
      offsetY: sStop,
      blur: 2.2,
      opacity: 0.55,
      children: rows,
    });

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.18,
      positioned: { left: 0, top: 0 },
    });

    // The fade to black: covers the wall, NOT the face (the face wrap sits
    // on top); the type fades itself out in step.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      opacity: fadeT,
      positioned: { left: 0, top: 0 },
    });

    kids.push(typeLine);

    // The face rides the same zoom in its own wrap, above the fade.
    kids.push({
      type: 'stack',
      fit: 'expand',
      scale: zoom,
      offsetY: sStop,
      children: [faceLine],
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
