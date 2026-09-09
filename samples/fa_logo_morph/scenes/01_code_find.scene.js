// The find — one 240-frame shot that opens the film:
//
//   ·  0–104   a dense wall of code runs upward and brakes — one line
//              among it is `(0_0)`, styled exactly like the rest: you
//              cannot tell it apart until it moves
//   ·  106–128 the line WINKS: `(0_0)` → `(0_-)` → back, twice — the
//              wall is not code, it is alive
//   ·  136–206 the camera dives in: a continuous zoom onto the line
//              (5.2x, center-anchored) while the kaomoji warms from the
//              wall's dim gray to glowing violet and the wall falls out
//              of focus behind it (blur + dim = a focus pull)
//   ·  206–240 settle: a slow push to 5.75x, the face breathing glow —
//              the cut point into the kaomoji stage
//
// Everything is text nodes; the zoom is one `scale` wrap on a full-screen
// stack (Transform.scale about the screen center, where the face parks),
// so preview and export agree frame for frame.

scene = {
  id: 'code_find',
  duration: 240,
  from: 0,
  timeline: {
    label: 'Find the face',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var colors = yoclipTheme.colors;

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to,
        easing);
    }

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    // ---- The wall's choreography ------------------------------------------
    // The wall sprints upward, then brakes onto the face line: the whole
    // group's offset eases from its start to the value that parks the face
    // row exactly at screen center (the zoom's anchor).
    var ROW_H = 50;
    var FONT = 34;
    var FACE_I = 13; // the face's row index in the wall
    var FACE_STOP = 540 - ROW_H / 2; // its top when parked at center
    var sStop = FACE_STOP - FACE_I * ROW_H;
    var sStart = sStop + 430; // it enters from below
    var s = lerp(sStart, sStop, tw(0, 104, 0, 1, 'easeOutCubic'));

    // ---- The code wall -----------------------------------------------------
    // Fifty rows of plausible agent code. Two alternating grays; nothing
    // about the face line stands out yet.
    var POOL = [
      '28  final take = takes.first;   if (take.ok) keep(take);  // the keeper',
      '29  if (busy) return null;               // do not interrupt a run',
      '30  onSelect(take.frame);  timeline.mark(beat, tag: \'ok\');  sync()',
      '31  await agent.run(goal);  // the long way round, every single time',
      '32  const stage = stage();  resize(1920, 1080); fit: cover',
      '33  */section: morph  // ---- begin the shape work ----',  // wip
      '34  RobotMode: focus;  attention: narrow;  drift: 0.0',
      '35  render(frame + 1);  pump();  boundary.toImage(pixelRatio: 1);  flush()',
      '36  timeline.mark(beat);  label: \'note\';  color: teal',
      '37  export preset: shorts_1080;  fps: 30;  bitrate: 8_000k',
      '38  storage.readBytes(path);  cache.warm(asset);  eviction: lru',
      '39  scene.evaluate(frame);  graph.compile();  paint()',
      '40  interp(frame, [0, 30], [0, 1]);  easing: easeInOutCubic',
      '41  spring(config: wobbly);  damping: 0.8;  mass: 1.0;  v0: 0',
      '42  // TODO: hot reload the scene on save  // soon',
      '43  mux(audio: aac, video: h264);  sync: drift < 1ms  // tight',
      '44  boundary.toImage(pixelRatio: 1);  rawRgba;  append()',
      '45  seek(frame: 128);  play();  loop: false;  scrubbing: on',
      '46  opacity: interpolate(frame, [0, 30], [0, 1]);  // fade the old',
      '47  yoclip render --output video.mp4  // the whole point of all this',
      '48  watch(scenes/*.js);  reload(onSave: true);  debounce: 80ms',
      '49  commit: the wall is alive  // it winked back',
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
          // Every 4th row carries a faint violet tint — texture, not
          // syntax highlighting; it must never outshine the face.
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
    // Hidden in plain sight: identical style to the wall until the winks
    // and the zoom give it away.
    var wink1 = frame >= 106 && frame < 114;
    var wink2 = frame >= 120 && frame < 128;
    var faceText = '( 0_0 )';
    if (wink1 || wink2) faceText = '( 0_- )';

    // The color reveal rides the zoom: wall gray → glowing violet.
    var warmT = tw(146, 40, 0, 1, 'easeInOutCubic');
    var faceColor = lerpColor('#333947', '#C9B8FF', warmT);

    // Two-layer glow (tight halo + wide bloom), fading in with the color
    // and breathing once it is on. 8-digit hex = #AARRGGBB.
    var breathe = 1 + 0.09 * Math.sin((ms / 3400) * Math.PI * 2);
    var glowA = warmT * (0.92 + 0.08 * breathe);
    var glow = [
      { color: '#' + hex2(0.38 * glowA) + '8F6BFF', blur: 42 * breathe },
      { color: '#' + hex2(0.20 * glowA) + '8F6BFF', blur: 105 * breathe },
    ];

    // Full-width + centered: the kaomoji parks at x=960 exactly, in any
    // font, so the zoom's center anchor keeps it pinned mid-screen.
    var faceLine = {
      type: 'text',
      text: faceText,
      width: 1920,
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

    // ---- The dive ----------------------------------------------------------
    // One continuous zoom about the screen center, where the face parks.
    var zoom = tw(136, 70, 1, 5.2, 'easeInOutCubic');
    if (frame >= 206) zoom = lerp(5.2, 5.75, tw(206, 34, 0, 1, 'easeOutCubic'));

    // The focus pull: the wall falls out of focus and dims as the face
    // warms up, so the eye has nowhere else to go.
    var pullT = tw(160, 46, 0, 1, 'easeInOutCubic');
    var wallBlur = 1.6 * pullT;
    var wallOpacity = 1 - 0.45 * pullT;

    var kids = [];

    // Backdrop.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#070a12',
      positioned: { left: 0, top: 0 },
    });

    // The zoom wrapper scales everything about the screen center; inside
    // it, the wall gets the focus pull and the face line stays sharp.
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
