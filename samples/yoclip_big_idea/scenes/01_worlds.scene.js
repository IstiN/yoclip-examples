// 01 — Worlds: a hard-cut 3D montage of "what you can render".
//
// Reference beat (Gamma 4–9s): surreal cinematic 3D worlds flash by — proof
// of limitless styles. Two 3D pipelines share the stage: the software
// `meshes` path (procedural, export-safe) and the `flame` GPU path (real
// GLB with textures + skeletal animation). Three worlds, 62 frames each:
//   A "any world": a Hollywood-style hill with giant voxel YOCLIP letters
//      rising on beats
//   B "any style": a low-poly plane towing a waving YOCLIP banner
//   C "any story": three KayKit adventurers at a rally — Cheer skeletal
//      loops, a YOCLIP placard and confetti

scene = {
  id: 'worlds',
  duration: 186,
  description: '3D montage: Hollywood YOCLIP sign → flying banner → rally with placard.',
  voicePrompts: {
    en: 'Music lifts: wide cinematic synths, three hard cuts on downbeats.',
    ru: 'Подъём музыки: широкие синты, три жёстких среза на долях.',
  },
  timeline: {
    label: yoclipT('worlds').timeline || 'Worlds',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('worlds');
    var captions = t.captions || ['any world', 'any style', 'any story'];
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    var SLOT = 62;
    var idx = Math.min(2, Math.floor(frame / SLOT));
    var f = frame - idx * SLOT; // world-local frame

    var skyA, skyB, skyC;
    var meshNode = null;
    var glbNode = null;

    if (idx === 0) {
      // ---- A: Hollywood hill + rising YOCLIP letters ----------------------
      var pm = [];
      // Hill: a wide green mound with a rocky base and two pines.
      pm.push(meshXform(meshCone(3.4, 1.5, 22), { color: '#3f8a44', translate: [0, -0.75, 0] }));
      pm.push(meshXform(meshCylinder(3.4, 0.35, 22), { color: '#2c5c30', translate: [0, -1.55, 0] }));
      for (var p = 0; p < 2; p++) {
        var px = p === 0 ? -2.5 : 2.4;
        pm.push(meshXform(meshCylinder(0.07, 0.4, 6), { color: '#5d4a36', translate: [px, 0.55, -0.4] }));
        pm.push(meshXform(meshCone(0.5, 1.2, 8), { color: '#276b32', translate: [px, 1.3, -0.4] }));
      }
      // Letters rise one by one on the crest.
      var word = 'YOCLIP';
      var v = 0.17, letterW = 6 * v;
      var wordW = voxelWordWidth(word, v);
      for (var li = 0; li < word.length; li++) {
        var start = 6 + li * 6;
        var up = ease(f, start, start + 14, eoBack);
        if (up <= 0) continue;
        var col = li === 0 ? accent : '#ffffff';
        pm.push(meshXform(voxelLetterMesh(word.charAt(li), v, 0.1, col), {
          scale: Math.max(0.001, up),
          rotate: { x: -6 },
          translate: [-wordW / 2 + li * letterW + 0.5 * v, 0.62 - (1 - up) * 0.5, 0.85],
        }));
      }
      meshNode = {
        type: 'scene3d',
        meshes: pm,
        camera: {
          position: [0, 1.45, 6.4 - 0.6 * ease(f, 0, 62, eio3)],
          target: [0, 0.85, 0],
          fov: 50,
        },
        light: { direction: [-0.25, -0.55, 0.75] },
      };
      skyA = '#3d2a5d';
      skyB = '#c2567a';
      skyC = '#ffb27a';
    } else if (idx === 1) {
      // ---- B: low-poly plane towing the YOCLIP banner ---------------------
      var bm = [];
      var planeX = 3.2 - f * 0.1;
      var planeY = 1.75 + Math.sin(f * 0.06) * 0.18;
      var bank = Math.sin(f * 0.05) * 7;
      // Fuselage + nose + wings + tail + spinning prop.
      bm.push(meshXform(meshCube(1.1, 0.3, 0.3), { color: primary, rotate: { z: bank }, translate: [planeX, planeY, 0] }));
      bm.push(meshXform(meshCone(0.16, 0.35, 8), { color: accent, rotate: { z: -90 + bank }, translate: [planeX - 0.7, planeY, 0] }));
      bm.push(meshXform(meshCube(0.5, 0.06, 1.7), { color: primaryLight, rotate: { z: bank }, translate: [planeX + 0.05, planeY + 0.12, 0] }));
      bm.push(meshXform(meshCube(0.22, 0.34, 0.06), { color: primaryLight, rotate: { z: bank }, translate: [planeX + 0.55, planeY + 0.28, 0] }));
      bm.push(meshXform(meshCube(0.26, 0.05, 0.6), { color: primaryLight, rotate: { z: bank }, translate: [planeX + 0.55, planeY + 0.1, 0] }));
      var propA = f * 37 % 360;
      bm.push(meshXform(meshCube(0.04, 0.55, 0.05), { color: '#e9d5ff', rotate: { x: propA, z: bank }, translate: [planeX - 0.92, planeY, 0] }));
      bm.push(meshXform(meshCube(0.04, 0.05, 0.55), { color: '#e9d5ff', rotate: { x: propA, z: bank }, translate: [planeX - 0.92, planeY, 0] }));
      // Tow rope.
      bm.push(meshXform(meshCylinder(0.015, 0.9, 6), { color: '#cbd5e1', rotate: { z: 90 }, translate: [planeX + 1.0, planeY - 0.1, 0] }));
      // Banner letters trailing with a fabric wave.
      var bword = 'YOCLIP';
      var bv = 0.085;
      for (var bi = 0; bi < bword.length; bi++) {
        var wave = Math.sin(f * 0.16 + bi * 0.85);
        bm.push(meshXform(voxelLetterMesh(bword.charAt(bi), bv, 0.05, bi % 2 ? accent : '#ffffff'), {
          rotate: { z: wave * 9 },
          translate: [planeX + 1.25 + bi * 0.45, planeY - 0.28 + wave * 0.1, 0],
        }));
      }
      // Drifting clouds.
      for (var c = 0; c < 4; c++) {
        var ca = (f * 0.22 + c * 95) * Math.PI / 180;
        bm.push(meshXform(meshCube(1.2, 0.16, 0.6), {
          color: '#e8ecf4',
          translate: [Math.cos(ca) * 3.6, 2.4 + (c % 2) * 0.5, Math.sin(ca) * 3.0 - 0.5],
        }));
      }
      meshNode = {
        type: 'scene3d',
        meshes: bm,
        camera: {
          position: [0.3 + Math.sin(f * 0.01) * 0.3, 1.55, 6.6],
          target: [0.5, 1.3, 0],
          fov: 50,
        },
        light: { direction: [-0.3, -0.7, 0.65] },
      };
      skyA = '#3a7bd5';
      skyB = '#15304f';
      skyC = null;
    } else {
      // ---- C: rally — cheering adventurers + YOCLIP placard ---------------
      var cm = [];
      cm.push(meshXform(meshCube(10, 0.16, 7), { color: '#3f8a44', translate: [0, -0.08, 0] }));
      cm.push(meshXform(meshCube(10, 0.05, 1.0), { color: '#8a6f52', translate: [0, 0.02, 0.6] }));
      for (var tr = 0; tr < 4; tr++) {
        var tx = -3.6 + tr * 2.4;
        cm.push(meshXform(meshCylinder(0.08, 0.45, 6), { color: '#5d4a36', translate: [tx, 0.22, -2.4] }));
        cm.push(meshXform(meshCone(0.55, 1.5, 8), { color: '#276b32', translate: [tx, 1.3, -2.4] }));
      }
      // Placard: sticks + board + voxel letters, rising at the start.
      var posterUp = ease(f, 4, 18, eoBack);
      var posterY = 0.55 + posterUp * 0.85;
      var pv = 0.085, pword = 'YOCLIP', pwordW = voxelWordWidth(pword, pv);
      cm.push(meshXform(meshCylinder(0.035, 1.6, 6), { color: '#5d4a36', translate: [-pwordW / 2 - 0.25, posterY - 0.35, -0.2] }));
      cm.push(meshXform(meshCylinder(0.035, 1.6, 6), { color: '#5d4a36', translate: [pwordW / 2 + 0.25, posterY - 0.35, -0.2] }));
      cm.push(meshXform(meshCube(pwordW + 0.8, 1.0, 0.08), { color: '#f4f1ea', translate: [0, posterY + 0.15, -0.2] }));
      for (var qi = 0; qi < pword.length; qi++) {
        cm.push(meshXform(voxelLetterMesh(pword.charAt(qi), pv, 0.06, primary), {
          scale: Math.max(0.001, posterUp),
          translate: [-pwordW / 2 + qi * 6 * pv + 0.5 * pv, posterY + 0.52, -0.13],
        }));
      }
      // Confetti after the poster lands.
      var confCols = [primary, accent, primaryLight, '#f472b6', '#fbbf24'];
      for (var ci = 0; ci < 26; ci++) {
        var cyc2 = ((f * 0.025 + ci * 0.377) % 1.3) / 1.3;
        if (cyc2 < 0.12) continue;
        cm.push(meshXform(meshCube(0.07, 0.07, 0.02), {
          color: confCols[ci % 5],
          rotate: { x: f * (2 + ci % 3), y: f * 3 },
          translate: [-3 + (ci * 0.61 % 6), 2.8 - cyc2 * 2.6, -0.5 + (ci * 0.43 % 1.6)],
        }));
      }
      // Contact shadows under the party.
      for (var sh = 0; sh < 3; sh++) {
        cm.push(meshXform(meshCylinder(0.4, 0.015, 12), {
          color: '#2c5c30', translate: [-1.3 + sh * 1.3, 0.045, 0.5],
        }));
      }
      meshNode = {
        type: 'scene3d',
        meshes: cm,
        camera: {
          position: [0.2 + Math.sin(f * 0.01) * 0.3, 1.35, 6.3 - 0.5 * ease(f, 0, 62, eio3)],
          target: [0.2, 1.0, 0],
          fov: 50,
        },
        light: { direction: [0.25, -0.65, 0.7] },
      };
      // The cheering party (GPU GLB, skeletal Cheer loops).
      glbNode = {
        type: 'scene3d',
        engine: 'flame',
        id: 'worlds-party',
        time: f / 30,
        camera: {
          position: [0.2 + Math.sin(f * 0.01) * 0.3, 1.35, 6.3 - 0.5 * ease(f, 0, 62, eio3)],
          target: [0.2, 1.0, 0],
          fov: 50,
        },
        light: { ambient: 0.65, diffuse: 1.2, position: [4, 7, 5] },
        models: [
          { modelId: 'knight', src: 'models/Knight.glb', position: [-1.3, 0.02, 0.5], rotation: [0, 12, 0], scale: [0.5, 0.5, 0.5], animation: 'Cheer' },
          { modelId: 'mage', src: 'models/Mage.glb', position: [0, 0.02, 0.4], rotation: [0, -8, 0], scale: [0.5, 0.5, 0.5], animation: 'Cheer' },
          { modelId: 'rogue', src: 'models/Rogue.glb', position: [1.3, 0.02, 0.5], rotation: [0, -20, 0], scale: [0.5, 0.5, 0.5], animation: 'Cheer' },
        ],
      };
      skyA = '#1c3a63';
      skyB = '#0a1428';
      skyC = null;
    }

    // Caption chip (cycles per world).
    var capEase = ease(f, 4, 16, eo3);
    var capIn = 0.25 + 0.75 * capEase;
    var caption = {
      type: 'container',
      alignment: 'bottomCenter',
      offsetY: -64 - 14 * (1 - capEase),
      opacity: capIn,
      color: yoclipColorA('backgroundDeep', 0xb0, '#07070d'),
      borderRadius: 999,
      borderColor: yoclipColorA('accent', 0x66, '#22d3ee'),
      borderWidth: 1.5,
      child: {
        type: 'text',
        text: captions[idx],
        margin: { left: 28, right: 28, top: 12, bottom: 12 },
        style: {
          fontSize: 30,
          color: yoclipColor('text', '#ffffff'),
          fontFamily: yoclipFont(),
          fontWeight: 600,
          letterSpacing: 6,
        },
      },
    };

    var life = idx === 0 ? presence(frame, 8, 9999, 0) : 1;
    var outro = fadeOut(frame, 186, 8);

    var sky = skyC == null
      ? { type: 'linear', begin: 'topCenter', end: 'bottomCenter', colors: [skyA, skyB] }
      : { type: 'linear', begin: 'topCenter', end: 'bottomCenter', colors: [skyA, skyB, skyC] };
    var layers = [{ type: 'container', gradient: sky }];
    if (meshNode) layers.push(meshNode);
    if (glbNode) layers.push(glbNode);
    layers.push(caption);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life * outro,
      children: layers,
    };
  },
};
