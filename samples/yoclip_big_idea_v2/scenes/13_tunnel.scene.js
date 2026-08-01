// 13 — Tunnel: the flythrough into the finale.
//
// Reference beat (Gamma 74–77s): a dive through a tunnel of glowing square
// rings with a spiral light ribbon winding through. The rings are 4 thin
// meshCube bars each, spaced along -Z; the camera dolly is faked by moving
// the rings +Z with modulo wraparound, shrinking the far ones. Accent
// (cyan) rings run thicker so they hold up next to the violet ones.
// Around frame 80 the 3D layer dims to 0.38 while the tagline fades in
// with expanding letter-spacing. The last stretch accelerates ~20%.
//
// Renderer notes: 3D fills its tight stack slot — motion comes from
// per-frame meshes/camera. Mesh colors carry no alpha, so depth fade is
// faked with scale.

scene = {
  id: 'tunnel',
  duration: 132,
  description: '3D setpiece: a tunnel of 10 square rings (4 meshCube bars each, primary/accent/primaryLight — accent rings thicker for parity) flows toward the camera with modulo wraparound and per-ring z-rotation, a spiral ribbon of small accent cubes winds through on a helix, camera sways gently; at frame ~80 the 3D dims to 0.38 and the tagline fades in with letterSpacing expanding 2→14 and a primary glow; the final stretch speeds up 20%.',
  voicePrompts: {
    en: 'A deep whoosh diving down the tunnel; the music opens up for the tagline.',
    ru: 'Глубокий свист погружения в туннель; музыка раскрывается под теглайн.',
  },
  timeline: {
    label: yoclipT('tunnel').timeline || 'Fly-through',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('tunnel');
    var tagline = t.tagline || 'Your big idea. In code.';
    var portrait = yoclipIsPortrait();
    var life = presence(frame, 6, 116, 10);

    var font = yoclipFont();
    var txt = yoclipColor('text', '#ffffff');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var ringColors = [primary, accent, primaryLight];

    // -- Tagline beat: dim the 3D layer as the text lands (~80). 0.38 keeps
    // the tunnel glowing behind the tagline instead of muddying out.
    var tagIn = ease(frame, 80, 100, eo3);
    var dim = lerp(1, 0.38, seg(frame, 70, 96));
    var letterSp = lerp(2, 14, ease(frame, 80, 118, eo3));
    var tagScale = 0.94 + 0.06 * ease(frame, 80, 104, eo3);

    // -- Final acceleration: rings flow ~20% faster into the cut.
    var speedUp = 1 + 0.2 * seg(frame, 108, 130);
    var tf = frame * speedUp;

    // -- Tunnel rings: 4 bars per square ring, flowing +Z with wraparound.
    var N = 10;
    var gap = 3.2;
    var depth = N * gap; // 32
    var speed = 0.14;
    var half = 2.8;

    var meshes = [];
    for (var i = 0; i < N; i++) {
      var z = 2 - ((i * gap + tf * speed) % depth);
      var col = ringColors[i % 3];
      // Accent (cyan) rings run thicker: at equal weight they read dim next
      // to the dominant violet rings.
      var th = col === accent ? 0.2 : 0.12;
      var len = 2 * half + th;
      // Depth fade is faked with scale (mesh colors carry no alpha).
      var shrink = 1 - 0.45 * ((2 - z) / depth);
      var ringSpin = (i % 2) * 45 + tf * 0.3;
      var bars = [
        meshXform(meshCube(len, th, th), { translate: [0, half, 0] }),
        meshXform(meshCube(len, th, th), { translate: [0, -half, 0] }),
        meshXform(meshCube(th, len, th), { translate: [half, 0, 0] }),
        meshXform(meshCube(th, len, th), { translate: [-half, 0, 0] }),
      ];
      for (var b = 0; b < 4; b++) {
        meshes.push(meshXform(bars[b], {
          color: col,
          scale: shrink,
          rotate: { z: ringSpin },
          translate: [0, 0, z],
        }));
      }
    }

    // -- Spiral light ribbon: small accent cubes along a helix winding
    // through the tunnel, flowing with the same wraparound.
    var RIB = 22;
    for (var k = 0; k < RIB; k++) {
      var rz = 2 - ((k * 1.5 + tf * speed) % depth);
      var ang = k * 0.62 + tf * 0.05;
      var rr = 1.7;
      var rShrink = 1 - 0.45 * ((2 - rz) / depth);
      meshes.push(meshXform(meshCube(0.16, 0.16, 0.16), {
        color: accent,
        scale: Math.max(0.05, rShrink),
        translate: [Math.cos(ang) * rr * rShrink, Math.sin(ang) * rr * rShrink, rz],
      }));
    }

    // -- Camera sway (shared by the tunnel meshes).
    var camera = {
      position: [Math.sin(frame * 0.02) * 0.35, Math.sin(frame * 0.017 + 1) * 0.25, 6.2],
      target: [0, 0, 0],
      fov: 55,
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Deep space base.
        {
          type: 'container',
          color: yoclipColor('backgroundDeep', '#07070d'),
        },
        // Radial accent bloom behind the 3D viewport.
        {
          type: 'container',
          alignment: 'center',
          width: 1000,
          height: 1000,
          opacity: dim,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.5,
            colors: [yoclipColorA('accent', 0x22, '#22d3ee'), yoclipColorA('accent', 0x00, '#22d3ee')],
          },
        },
        // The procedural 3D tunnel (rings + spiral ribbon).
        {
          type: 'scene3d',
          opacity: dim,
          meshes: meshes,
          camera: camera,
          light: { direction: [0.2, -0.3, 0.9] },
        },
        // Tagline lands ~80 and fades back out (114–126) so it doesn't
        // ghost through the end card's white settle.
        {
          type: 'text',
          alignment: 'center',
          text: tagline,
          opacity: tagIn * (1 - seg(frame, 114, 126)),
          scale: tagScale,
          style: {
            fontSize: portrait ? 58 : 96,
            color: txt,
            fontFamily: font,
            fontWeight: 700,
            letterSpacing: letterSp,
            shadows: [{ color: yoclipColorA('primary', 0x99, '#7c3aed'), blur: 34, offsetX: 0, offsetY: 0 }],
          },
        },
      ],
    };
  },
};
