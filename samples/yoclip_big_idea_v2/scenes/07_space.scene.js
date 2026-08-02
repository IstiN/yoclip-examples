// 07 — Space: a dark-violet 3D world answers the prompt with a launch.
//
// Reference beat (Gamma 31–34s): glossy objects float in a surreal space —
// two landers drifting, a glowing high-segment torus, a warm spinning
// crystal asteroid (mesh cone) and floating layout frames. A frosted
// prompt field types the brief, the cursor glides to the Render button
// and clicks — and the near lander IGNITES, launching up along an eased
// curve with a light trail, exiting the frame top as the field fades away.
//
// Renderer notes: ONE flame node per 3D scene (id 'v2-space', deterministic
// time = frame/30); the glowing torus + launch trail ride the separate
// software `meshes` scene3d path (same camera, no z-buffer — the trail cone
// stays clear of the torus). Mesh colors carry no alpha, so the trail
// scales in instead of fading.

scene = {
  id: 'space',
  duration: 147,
  description: 'Cinematic space: a planet limb with a glowing atmosphere rim rises from the bottom, a small moon hangs high right, nebula washes and a rich starfield; two GLB landers drift with two tilted frosted layout frames; a frosted prompt field types "A rocket for the finale", cursor clicks Render, and lander_A launches upward on an ei3 curve with a slim gradient light trail, exiting frame top.',
  voicePrompts: {
    en: 'Deep space ambience, a UI click, then a rocket ignition roar dopplering upward.',
    ru: 'Гул космоса, клик интерфейса и рев запуска, уходящий вверх.',
  },
  timeline: {
    label: yoclipT('space').timeline || 'Space',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('space');
    var fieldText = t.field || 'A rocket for the finale';
    var buttonLabel = t.button || 'Render';
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 125, 14);

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    // -- Beats.
    var fieldIn = seg(frame, 26, 40);
    var fieldOut = seg(frame, 96, 112);
    var fieldOp = fieldIn * (1 - fieldOut);
    var typedPair = typewriterParts(fieldText, frame, 36, 30);
    var typed = typedPair[0];
    var typedRest = typedPair[1];
    var typingDone = typedRest.length === 0;
    var caretOn = frame >= 36 && (!typingDone || blink(frame, 14) === 1);

    // Cursor: appears, glides to the button, clicks (dip), fades.
    var curOp = seg(frame, 58, 64) * (1 - seg(frame, 94, 102));
    var glide = ease(frame, 64, 86, eio3);
    var curX = lerp(340, 66, glide);
    var curY = lerp(470, 408, glide);
    var dip = seg(frame, 86, 90) * (1 - seg(frame, 90, 96));
    var btnScale = 1 - 0.1 * dip;

    // -- The launch: lander_A ignites ~92 and rides an ei3 curve up.
    var launch = ease(frame, 92, 143, ei3);
    var bob = float(frame, 0.12, 0.05) * (1 - launch);
    var landerY = -0.4 + bob + launch * 8.8;
    var landerX = 0.7 - 0.5 * launch; // slight inward arc as it climbs

    // -- Meshes: launch trail only (software scene3d has no z-buffer — a
    // torus there shows concentric band artifacts and cones read as paper
    // crafts; the torus and asteroid live on the GPU flame node as GLB).
    var meshes = [];
    if (frame >= 96) {
      var launch = ease(frame, 92, 143, ei3);
      var trailLen = Math.min(3.8, 0.25 + launch * 4.2);
      // Exhaust column: two stacked meshes — light body over a darker
      // nozzle — so the trail reads metallic, not as a white blob.
      meshes.push(meshXform(meshCone(0.22, trailLen, 12), {
        color: '#e5e7eb',
        translate: [landerX, landerY - 0.38 - trailLen / 2, 0.2],
      }));
      meshes.push(meshXform(meshCylinder(0.07, trailLen * 0.85, 8), {
        color: '#6b7280',
        translate: [landerX, landerY - 0.36 - trailLen * 0.42, 0.2],
      }));
    }
    var meshCam = {
      position: [Math.sin(frame * 0.01) * 0.2, 0.7, 6.2],
      target: [0, 0.4, 0],
      fov: 50,
    };

    // -- The GPU world (ONE flame node).
    var flameNode = {
      type: 'scene3d',
      engine: 'flame',
      id: 'v2-space',
      time: frame / 30,
      camera: meshCam,
      light: { ambient: 0.7, diffuse: 1.25, position: [5, 8, 6] },
      models: [
        // (No filler props — the planet limb + moon carry the frame.)
        // Landers scaled ~1.5x and grouped toward the center-right third
        // (where the prompt field sits) — at 0.35/0.4 they drowned in the
        // empty dark field.
        {
          modelId: 'lander-far',
          src: 'models/space/lander_B.gltf',
          position: [2.3, 0.7 + float(frame, 0.15, 0.04, 2), -2.6],
          rotation: [0, 30 + Math.sin(frame * 0.03) * 10, 0],
          scale: [0.52, 0.52, 0.52],
        },
        {
          // The hero is a stylized low-poly rocket (built in-house, no cheap
          // asset) — it ignites and rides the launch curve.
          modelId: 'lander-hero',
          src: 'models/panels/rocket.glb',
          position: [landerX, landerY, 0.2],
          rotation: [0, -20 + frame * 0.25, launch * -8],
          scale: [0.7, 0.7, 0.7],
        },
      ],
    };

    // -- 2D glow layers for the launch (meshes carry no alpha).
    // World->screen approximation: camera z 7, fov 50 -> ~170 px per world
    // unit at the lander's depth; lander x0.7 ~ +120px, y mapped around the
    // camera target. Verified visually via goldens.
    var glowX = landerX * 170;
    var glowY = (0.4 - landerY) * 160;
    // Slim vertical trail that grows downward with the launch — gradient to
    // transparent, no wide blob.
    var trailGlow = {
      type: 'container',
      alignment: 'center',
      offsetX: glowX,
      offsetY: glowY + 150,
      width: 90,
      height: 200 + 500 * launch,
      opacity: 0.55 * seg(frame, 92, 100),
      gradient: {
        type: 'linear',
        begin: 'topCenter',
        end: 'bottomCenter',
        colors: ['#b37dd3fc', '#007dd3fc'],
      },
      borderRadius: 45,
      blur: 18,
    };
    // Ignition flash: half the old radius and alpha — the 260px blob
    // swallowed the rocket silhouette.
    var ignitionGlow = {
      type: 'container',
      alignment: 'center',
      offsetX: 120,
      offsetY: 150,
      width: 130,
      height: 130,
      opacity: seg(frame, 90, 97) * (1 - seg(frame, 112, 132)),
      gradient: {
        type: 'radial',
        center: 'center',
        radius: 0.5,
        colors: ['#667dd3fc', '#007dd3fc'],
      },
    };

    // -- Floating layout frames (2D, tilted via rotateY).
    function layoutFrame(offX, offY, rotY, phase) {
      var fOp = seg(frame, 12, 26) * (1 - seg(frame, 96, 112));
      return {
        type: 'container',
        alignment: 'center',
        offsetX: offX,
        offsetY: offY + float(frame, 14, 0.045, phase),
        rotateY: rotY,
        width: 280,
        height: 170,
        opacity: fOp,
        color: '#14ffffff',
        borderColor: '#2effffff',
        borderWidth: 1.5,
        borderRadius: 16,
        child: {
          type: 'column',
          crossAxisAlignment: 'start',
          children: [
            {
              type: 'container',
              width: 170,
              height: 16,
              margin: { left: 26, top: 28 },
              color: '#33ffffff',
              borderRadius: 8,
            },
            {
              type: 'container',
              width: 110,
              height: 16,
              margin: { left: 26, top: 14 },
              color: '#24ffffff',
              borderRadius: 8,
            },
            {
              type: 'container',
              width: 140,
              height: 16,
              margin: { left: 26, top: 14 },
              color: '#1affffff',
              borderRadius: 8,
            },
          ],
        },
      };
    }

    // -- Star field (far away = 2D, twinkling).
    var stars = [];
    for (var s = 0; s < 34; s++) {
      var sx = -880 + ((s * 731) % 1760);
      var sy = -500 + ((s * 389) % 960);
      var sz = 2 + (s % 3);
      stars.push({
        type: 'container',
        alignment: 'center',
        offsetX: sx,
        offsetY: sy,
        width: sz,
        height: sz,
        borderRadius: sz / 2,
        opacity: 0.25 + 0.6 * shimmer(frame + s * 9, 34 + (s % 5) * 6),
        color: '#e0f2fe',
      });
    }
    // -- Second parallax star layer: tiny dots drifting on float() at their
    // own speeds — adds depth to the otherwise empty dark field.
    var stars2 = [];
    for (var s2 = 0; s2 < 26; s2++) {
      var sx2 = -900 + ((s2 * 523) % 1800);
      var sy2 = -520 + ((s2 * 271) % 1000);
      stars2.push({
        type: 'container',
        alignment: 'center',
        offsetX: sx2 + float(frame, 26, 0.03, s2 * 1.3),
        offsetY: sy2 + float(frame, 12, 0.05, s2 * 0.7),
        width: 2,
        height: 2,
        borderRadius: 1,
        opacity: 0.18 + 0.4 * shimmer(frame + s2 * 13, 40),
        color: '#a5b4fc',
      });
    }

    // -- Prompt field + Render button (frosted glass).
    var fieldGroup = {
      type: 'column',
      alignment: 'center',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      offsetY: 310,
      opacity: fieldOp,
      children: [
        {
          type: 'container',
          width: portrait ? 620 : 660,
          height: 86,
          color: '#1fffffff',
          borderColor: '#3dffffff',
          borderWidth: 1.5,
          borderRadius: 999,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 36 },
              {
                type: 'text',
                text: typed,
                style: {
                  fontSize: portrait ? 26 : 30,
                  color: '#ffffff',
                  fontFamily: font,
                },
              },
              {
                type: 'container',
                width: 3,
                height: 36,
                opacity: caretOn ? 1 : 0,
                margin: { left: 6 },
                color: accent,
              },
              {
                // Invisible remainder: constant width, no jitter.
                type: 'text',
                text: typedRest,
                style: {
                  fontSize: portrait ? 26 : 30,
                  color: '#00000000',
                  fontFamily: font,
                },
              },
            ],
          },
        },
        { type: 'container', height: 22 },
        {
          type: 'container',
          width: 240,
          height: 66,
          scale: btnScale,
          gradient: {
            colors: [primary, primaryLight],
            begin: 'centerLeft',
            end: 'centerRight',
          },
          borderRadius: 999,
          shadow: { color: yoclipColorA('primary', 0x80, '#7c3aed'), blur: 28 + 16 * shimmer(frame, 28), offsetX: 0, offsetY: 10 },
          child: {
            type: 'stack',
            fit: 'expand',
            children: [{
              type: 'text',
              alignment: 'center',
              text: buttonLabel,
              style: {
                fontSize: 28,
                color: '#ffffff',
                fontFamily: font,
                fontWeight: 700,
              },
            }],
          },
        },
      ],
    };

    var children = [
      // Deep space: indigo falloff instead of flat violet.
      {
        type: 'container',
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#0b1030', '#050510'],
        },
      },
      // Cold nebula wash top-left, warm wash bottom-right.
      {
        type: 'container',
        alignment: 'center',
        width: 1100,
        height: 700,
        offsetX: -480,
        offsetY: -260,
        opacity: 0.5,
        gradient: { type: 'radial', colors: ['#2a3b82f6', '#003b82f6'], stops: [0, 1] },
      },
      {
        type: 'container',
        alignment: 'center',
        width: 900,
        height: 620,
        offsetX: 520,
        offsetY: 240,
        opacity: 0.4,
        gradient: { type: 'radial', colors: ['#1fec4899', '#00ec4899'], stops: [0, 1] },
      },
      // The moon: small gradient sphere with a halo, high right.
      {
        type: 'container',
        alignment: 'center',
        width: 300,
        height: 300,
        offsetX: 620,
        offsetY: -330,
        opacity: 0.7,
        gradient: { type: 'radial', colors: ['#4da5b4fc', '#00a5b4fc'], stops: [0, 1] },
      },
      {
        type: 'container',
        alignment: 'center',
        width: 96,
        height: 96,
        offsetX: 620,
        offsetY: -330,
        borderRadius: 999,
        gradient: {
          type: 'radial',
          center: 'center',
          radius: 0.75,
          colors: ['#e8f4ff', '#8fa8c8', '#3c4a66'],
          stops: [0, 0.55, 1],
        },
      },
      // Planet limb: a wide ellipse cap rising from the bottom (kept
      // ON-SCREEN — giant off-center circles get culled by the renderer).
      {
        type: 'container',
        alignment: 'center',
        width: 2400,
        height: 900,
        offsetY: 740,
        borderRadius: 999,
        gradient: {
          type: 'linear',
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: ['#16306e', '#0b1a3e', '#050814'],
          stops: [0, 0.45, 1],
        },
      },
      // Atmosphere rim: bright thin arc along the limb edge (blurred copy
      // under a crisp one).
      {
        type: 'container',
        alignment: 'center',
        width: 2400,
        height: 900,
        offsetY: 740,
        borderRadius: 999,
        borderColor: '#7dd3fc',
        borderWidth: 10,
        opacity: 0.4,
        blur: 12,
      },
      {
        type: 'container',
        alignment: 'center',
        width: 2400,
        height: 900,
        offsetY: 740,
        borderRadius: 999,
        borderColor: '#bfe8ff',
        borderWidth: 2.5,
        opacity: 0.6,
      },
    ];
    children.push({
      type: 'scene3d',
      meshes: meshes,
      camera: meshCam,
      light: { direction: [-0.3, -0.6, 0.7] },
    });
    children.push(flameNode);
    for (var st2 = 0; st2 < stars2.length; st2++) children.push(stars2[st2]);
    for (var st = 0; st < stars.length; st++) children.push(stars[st]);
    children.push(ignitionGlow);
    children.push(trailGlow);
    children.push(layoutFrame(portrait ? -300 : -600, -230, 16, 0));
    children.push(layoutFrame(portrait ? 300 : 640, -160, -14, 2.2));
    children.push(fieldGroup);
    children.push({
      type: 'path',
      path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
      color: '#e2e8f0',
      strokeWidth: 3,
      width: 34,
      height: 34,
      alignment: 'center',
      offsetX: curX,
      offsetY: curY,
      opacity: curOp,
    });

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: children,
    };
  },
};
