// The agent's face — a terminal kaomoji living inside a wall of dark code:
//
//   ·  the wall: huge, barely-lit rows of code drift up behind everything
//      (line numbers + fragments, the way an editor looks when you are not
//      supposed to be reading it)
//   ·  the face: `( 0_0 )` — glowing violet glyphs, the underscore mouth is
//      a terminal cursor blinking thin-bar ↔ solid-block
//   ·  the squint: every few seconds the eyes pinch shut `( > < )` — the
//      same wink DNA as the morph film's `>o` beat
//
// Pure text nodes; the glow is textShadows so preview and export agree.
// Palette: violet on near-black, deliberately far from the morph's
// blue/teal so the two scenes read as night and day of the same agent.

scene = {
  id: 'kaomoji',
  duration: 240,
  from: 0,
  timeline: {
    label: 'Agent face',
    color: '#8F6BFF',
    lane: 'video',
  },
  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var kids = [];

    function hex2(a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
      var s = v.toString(16);
      return (s.length < 2 ? '0' : '') + s;
    }

    // ---- The wall of code -------------------------------------------------
    // Six oversized rows, staggered so they bleed off both edges. The whole
    // wall climbs slowly — the agent reads faster than you do.
    var rows = [
      { x: -120, text: '28  const stage = stage()' },
      { x: 210, text: '29  if (busy) return null' },
      { x: -60, text: '30  onSelect(take.frame)' },
      { x: 150, text: '31  onSelect(next)' },
      { x: -30, text: '32  */section: morph' },
      { x: 90, text: '33  RobotMode: focus' },
      { x: -140, text: '34  await agent.run(goal)' },
    ];
    var drift = frame * 0.55;
    for (var i = 0; i < rows.length; i++) {
      kids.push({
        type: 'text',
        text: rows[i].text,
        style: {
          fontSize: 250,
          color: '#1E1F26',
          fontWeight: '300',
          letterSpacing: 4,
        },
        opacity: 0.95,
        positioned: { left: rows[i].x, top: -180 + i * 330 - drift },
      });
    }

    // A faint vignette keeps the corners from competing with the face.
    kids.push({
      type: 'rect', width: 1920, height: 1080, fill: '#06070B',
      opacity: 0.28,
      positioned: { left: 0, top: 0 },
    });

    // ---- Entrance ---------------------------------------------------------
    var appear = jsr.motion.tween(ms, 0, 650, 0, 1, 'easeOutCubic');

    // ---- Glow plumbing ----------------------------------------------------
    // Two-layer shadow: a tight halo plus a wide bloom, both breathing.
    var breathe = 1 + 0.09 * Math.sin((ms / 3400) * Math.PI * 2);
    function glow(a) {
      // 8-digit hex parses as #AARRGGBB — alpha byte FIRST.
      return [
        { color: '#' + hex2(0.38 * a * breathe) + '7C4DFF', blur: 42 * breathe },
        { color: '#' + hex2(0.20 * a * breathe) + '7C4DFF', blur: 105 * breathe },
      ];
    }
    var faceShadows = glow(appear);

    // ---- The squint clock -------------------------------------------------
    // A short pinch: eyes swap 0 → > < at full squint, back to 0. 26 frames.
    function squintP(start) {
      var t = frame - start;
      if (t < 0 || t > 26) return 0;
      return t < 8 ? t / 8 : (t > 18 ? (26 - t) / 8 : 1);
    }
    var squint = Math.max(squintP(92), squintP(190));
    var shut = squint > 0.5;
    var leftEye = shut ? '>' : '0';
    var rightEye = shut ? '<' : '0';

    // ---- The face ---------------------------------------------------------
    var faceStyle = {
      fontSize: 440,
      color: '#9B79FF',
      fontWeight: '400',
    };
    kids.push({
      type: 'text', text: '(', style: Object.assign({}, faceStyle, {
        shadows: faceShadows,
      }),
      opacity: appear,
      positioned: { left: 385, top: 205 },
    });
    kids.push({
      type: 'text', text: ')', style: Object.assign({}, faceStyle, {
        shadows: faceShadows,
      }),
      opacity: appear,
      positioned: { left: 1400, top: 205 },
    });

    var eyeStyle = {
      fontSize: 330,
      color: '#A88BFF',
      fontWeight: '400',
    };
    kids.push({
      type: 'text', text: leftEye, style: Object.assign({}, eyeStyle, {
        shadows: glow(appear * (0.85 + 0.15 * squint)),
      }),
      opacity: appear,
      positioned: { left: 705, top: 300 },
    });
    kids.push({
      type: 'text', text: rightEye, style: Object.assign({}, eyeStyle, {
        shadows: glow(appear * (0.85 + 0.15 * squint)),
      }),
      opacity: appear,
      positioned: { left: 1105, top: 300 },
    });

    // ---- The mouth: a terminal cursor -------------------------------------
    // Square wave, 0.8s period: thin bar ↔ solid block. The block phase is
    // the wink of the mouth — the reference beat of the kaomoji.
    var block = (frame % 48) < 24;
    var mh = block ? 112 : 16;
    var mw = block ? 152 : 178;
    // Soft halo under the mouth (rects carry no shadows of their own).
    kids.push({
      type: 'rect', width: mw * 2.6, height: Math.max(140, mh * 2.4),
      radius: 80, fill: '#7C4DFF',
      opacity: 0.09 * appear * breathe,
      positioned: { left: 960 - mw * 1.3, top: 705 - Math.max(70, mh * 1.2) },
    });
    kids.push({
      type: 'rect', width: mw, height: mh, radius: block ? 10 : 8,
      fill: '#9B79FF',
      opacity: appear,
      positioned: { left: 960 - mw / 2, top: 705 - mh / 2 },
    });

    return {
      type: 'stack',
      fit: 'expand',
      children: kids,
    };
  },
};
