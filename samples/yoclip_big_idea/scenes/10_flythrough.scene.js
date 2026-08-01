// 10 — Fly-through: the tunnel drop into the finale.
//
// Reference beat (Gamma 73–78s): a dive through a tunnel of glowing square
// rings with the helmet (yoclip's 3D mascot probe) tumbling at the center.
// The rings are 4 thin meshCube bars each, spaced along -Z; the camera
// dolly is faked by moving the rings +Z with modulo wraparound, shrinking
// the far ones. Around frame 150 the tagline fades in with expanding
// letter-spacing while the 3D layer dims behind it.
//
// Renderer notes: 3D fills its tight stack slot (width/height/
// alignment ignored) — motion comes from per-frame meshes/camera. Mesh
// colors carry no alpha, so depth fade is faked with scale. Flat Lambert
// shading: brightness is mesh color x light direction, so the helmet gets
// a near-white tint and a light pointing at the camera.

scene = {
  id: 'flythrough',
  duration: 216,
  description: '3D setpiece: a tunnel of ~10 square rings (4 meshCube bars each, primary/accent/primaryLight) flows toward the camera with modulo wraparound, the GLB helmet tumbles on axis at the center tinted near-white lavender, camera sways gently around the axis; at frame ~150 the tagline fades in with expanding letter-spacing as the 3D layer dims to 0.25.',
  voicePrompts: {
    en: 'A deep whoosh diving down the tunnel; the music opens up for the tagline.',
    ru: 'Глубокий свист погружения в туннель; музыка раскрывается под теглайн.',
  },
  timeline: {
    label: yoclipT('flythrough').timeline || 'Fly-through',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('flythrough');
    var tagline = t.tagline || 'Your big idea. In code.';
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 194, 14);

    var font = yoclipFont();
    var txt = yoclipColor('text', '#ffffff');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var ringColors = [primary, accent, primaryLight];

    // -- Tagline beat: dim the 3D layer early enough that the text owns the
    // frame when it reaches full opacity (172).
    var tagIn = ease(frame, 150, 172, eo3);
    var dim = lerp(1, 0.25, seg(frame, 135, 168));
    var letterSp = lerp(2, 14, ease(frame, 150, 195, eo3));
    var tagScale = 0.94 + 0.06 * ease(frame, 150, 176, eo3);

    // -- Tunnel rings: 4 bars per square ring, flowing +Z with wraparound.
    var N = 10;
    var gap = 3.2;
    var depth = N * gap; // 32
    var speed = 0.14;
    var half = 2.8, th = 0.12, len = 5.72;

    var meshes = [];
    for (var i = 0; i < N; i++) {
      var z = 2 - ((i * gap + frame * speed) % depth);
      var col = ringColors[i % 3];
      // Depth fade is faked with scale (mesh colors carry no alpha).
      var shrink = 1 - 0.45 * ((2 - z) / depth);
      var ringSpin = (i % 2) * 45 + frame * 0.3;
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

    // -- Helmet: the REAL Khronos DamagedHelmet.glb (textured, GPU) tumbling
    // on the tunnel axis — the mesh rings stay procedural around it.
    var camera = {
      position: [Math.sin(frame * 0.02) * 0.35, Math.sin(frame * 0.017 + 1) * 0.25, 6.2],
      target: [0, 0, 0],
      fov: 55,
    };

    var helmetNode = {
      type: 'scene3d',
      engine: 'flame',
      id: 'flythrough-helmet',
      opacity: dim,
      time: frame / 30,
      camera: camera,
      light: { ambient: 1.0, diffuse: 1.7, position: [3, 5, 6] },
      models: [{
        modelId: 'helmet',
        src: 'models/DamagedHelmet.glb',
        position: [0, -0.7, 0.5],
        rotation: [18 + frame * 0.35, frame * 0.5, frame * 0.12],
        scale: [0.85, 0.85, 0.85],
      }],
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
        // Bloom feel behind the 3D viewport (direct props — `decoration`
        // is silently dropped).
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
        // The procedural 3D tunnel rings.
        {
          type: 'scene3d',
          opacity: dim,
          meshes: meshes,
          camera: camera,
          light: { direction: [0.2, -0.3, 0.9] },
        },
        // The real GLB helmet (GPU, textured).
        helmetNode,
        // Tagline lands ~150 and holds to the end.
        {
          type: 'text',
          alignment: 'center',
          text: tagline,
          opacity: tagIn,
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
