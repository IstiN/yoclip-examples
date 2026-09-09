// 01 — Dark — the film opens on nothing.
//
//   ·  0–20    pure black: a blinking terminal cursor and a dim violet `fa`
//   ·  20–100  the wall of code fades in, sprints upward, then brakes —
//              one row among it is `( 0_0 )`, styled exactly like the rest
//   ·  95–130  focus pull: the wall dims to 0.55 and blurs to 2.2 while the
//              face warms from wall gray to violetBright, glow rising with it
//   ·  130–160 the WINK: `( 0_0 )` → `( 0_- )` for 8 frames, then back
//   ·  160–210 hold: breathing glow, a slow 1 → 1.12 push about the face
//
// Wall choreography adapted from fa_logo_morph 01_code_find (the brake is a
// cubicBezier — there is no 'easeOutCubic' easing string); the glow is the
// 02_kaomoji two-layer textShadow (8-digit #AARRGGBB, alpha byte FIRST).

scene = {
  id: '01_dark',
  duration: 210,
  from: 0,
  timeline: {
    label: 'Dark',
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

    // ---- The wall's choreography ------------------------------------------
    // The wall sprints upward, then brakes onto the face line: the group
    // offset eases to the value that parks the face row at screen center
    // (the anchor of every later zoom).
    var ROW_H = 52;
    var FONT = 38;
    var FACE_I = 13;                    // the face's row index in the wall
    var FACE_STOP = 540 - ROW_H / 2 - 4; // its top when parked at center
    var sStop = FACE_STOP - FACE_I * ROW_H;
    var sStart = sStop + 430;            // it enters from below
    var brake = jsr.ease.cubicBezier(0.22, 1, 0.36, 1);
    var s = lerp(sStart, sStop, tw(20, 80, 0, 1, brake));

    // ---- Clocks ------------------------------------------------------------
    var wallIn = tw(20, 30, 0, 1, 'easeOut');           // fade in 20–50
    var warmT = tw(95, 35, 0, 1, 'easeInOutCubic');     // face warms 95–130
    var pullT = tw(95, 35, 0, 1, 'easeInOutCubic');     // focus pull 95–130
    var wallOpacity = wallIn * (1 - 0.45 * pullT);      // dims to 0.55
    var wallBlur = 2.2 * pullT;                         // blurs to 2.2
    var zoom = tw(160, 50, 1, 1.12, 'easeInOutCubic');  // slow push 160–210

    // ---- The code wall -----------------------------------------------------
    // Fifty rows of plausible agent code. Two alternating grays with a faint
    // violet tint every 4th row — texture, never syntax candy; nothing about
    // the face line stands out yet.
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
      if (i === FACE_I) continue; // the face line takes its slot
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

    // ---- The face line -----------------------------------------------------
    // Hidden in plain sight: identical style to the wall until the warm-up
    // and the wink give it away.
    var winking = frame >= 138 && frame < 146; // the wink: 8 frames, then back
    var faceText = winking ? '( 0_- )' : '( 0_0 )';

    var breathe = 1 + 0.09 * Math.sin((ms / 3400) * Math.PI * 2);
    var glowA = warmT * (0.92 + 0.08 * breathe) + 0.14 * winkPulse(136);
    var glow = [
      { color: '#' + hex2(0.38 * glowA) + '8F6BFF', blur: 42 * breathe },
      { color: '#' + hex2(0.20 * glowA) + '8F6BFF', blur: 105 * breathe },
    ];
    var faceColor = lerpColor('#333947', C.violetBright, warmT);

    // Full-width + centered: the kaomoji parks at x=960 exactly, in any
    // font, so the zoom's center anchor keeps it pinned mid-screen.
    var faceLine = {
      type: 'text',
      text: faceText,
      width: 1920,
      opacity: wallIn,
      style: {
        fontSize: FONT,
        color: faceColor,
        fontFamily: 'monospace',
        letterSpacing: 0.5,
        textAlign: 'center',
        textShadows: glow,
      },
      positioned: { left: 0, top: FACE_I * ROW_H },
    };

    // ---- The opening: pure black, a cursor, a dim violet `fa` --------------
    var faIn = tw(0, 6, 0, 1, 'easeOut');
    var faOut = tw(20, 22, 0, 1, 'easeInOutCubic'); // gone as the wall arrives
    var faOpacity = 0.55 * faIn * (1 - faOut);
    var faKids = [];
    if (faOpacity > 0.003) {
      faKids.push({
        type: 'text',
        text: 'fa',
        width: 1920,
        style: {
          fontSize: 64,
          color: C.violet,
          fontFamily: 'monospace',
          letterSpacing: 2,
          textAlign: 'center',
        },
        opacity: faOpacity,
        positioned: { left: 0, top: 502 },
      });
      // Terminal block cursor, square-wave blink, parked right of the word
      // (monospace advance at 64px is ~0.6em, so `fa` ends near x=1000).
      if ((frame % 22) < 12) {
        faKids.push({
          type: 'rect',
          width: 26,
          height: 44,
          radius: 3,
          fill: C.violet,
          opacity: faOpacity,
          positioned: { left: 1008, top: 512 },
        });
      }
    }

    // ---- Compose -----------------------------------------------------------
    var kids = [];

    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: C.background,
      positioned: { left: 0, top: 0 },
    });

    // The zoom wrapper scales everything about the screen center, where the
    // face parks; inside it, the wall carries the focus pull while the face
    // line stays sharp.
    kids.push({
      type: 'stack',
      fit: 'expand',
      scale: zoom,
      offsetY: s,
      children: [
        {
          type: 'stack',
          fit: 'expand',
          blur: wallBlur,
          opacity: wallOpacity,
          children: rows,
        },
        faceLine,
      ],
    });

    for (var f = 0; f < faKids.length; f++) kids.push(faKids[f]);

    // A faint vignette keeps the corners quiet.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.22,
      positioned: { left: 0, top: 0 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
