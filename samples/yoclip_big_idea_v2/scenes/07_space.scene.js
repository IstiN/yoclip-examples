// 07 — Space: a bespoke vector launch system, not a stock asset showcase.
//
// The old close-up torus / asteroid / KayKit landers mixed faceted and chibi
// assets. This scene uses original gradient SVG geometry, orbital vector
// rings and a live launch trail. Every visible frame therefore renders in
// both headless review and MP4 export; no flame/Impeller placeholder.

scene = {
  id: 'space',
  duration: 165,
  description: 'Cinematic indigo space with a planet limb, parallax stars, a bespoke metallic rocket and satellite, luminous orbital rings, a live scene-code panel, prompt entry and an eased rocket launch with a slim cyan-violet exhaust trail.',
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
    var codeLines = t.code || ["scene('hero', () => {", "  glb('astronaut.glb')", '    .spin(24)', '    .float();', '})'];
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 143, 14);
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    // ---- Launch choreography ------------------------------------------------
    var launch = ease(frame, 92, 145, ei3);
    var hover = float(frame, 10, 0.055) * (1 - launch);
    var rocketIn = pop(frame, 8, 22);
    var rocketX = (portrait ? 120 : 220) - 100 * launch;
    var rocketY = (portrait ? -180 : -70) + (1 - rocketIn.opacity) * 140 + hover - 1120 * launch;
    var rocketScale = (portrait ? 0.76 : 1) * Math.max(0.001, rocketIn.scale);
    var rocketOp = rocketIn.opacity * (1 - seg(frame, 140, 150));
    var trailH = 100 + 620 * launch;
    var trailOp = seg(frame, 88, 97) * (1 - seg(frame, 134, 146));
    var ignition = seg(frame, 88, 94) * (1 - seg(frame, 103, 116));

    // ---- UI beats -----------------------------------------------------------
    // Frames 30–40 are a clean golden window: the code panel and hero are
    // fully visible, but the prompt UI has not entered yet.
    var fieldOp = seg(frame, 46, 58) * (1 - seg(frame, 100, 114));
    var curOp = seg(frame, 62, 68) * (1 - seg(frame, 94, 103));
    var glide = ease(frame, 68, 86, eio3);
    var curX = lerp(340, 66, glide) + 54 * ease(frame, 94, 103, eo3);
    var curY = lerp(470, 408, glide) + 44 * ease(frame, 94, 103, eo3);
    var dip = seg(frame, 86, 90) * (1 - seg(frame, 90, 96));
    var btnScale = 1 - 0.1 * dip;

    var children = [
      {
        type: 'container',
        gradient: {
          type: 'linear', begin: 'topCenter', end: 'bottomCenter',
          colors: ['#11143b', '#09091d', '#04050d'],
        },
      },
      {
        type: 'container', alignment: 'center', width: 1120, height: 760,
        offsetX: -500, offsetY: -260, opacity: 0.62,
        gradient: { type: 'radial', colors: ['#385b21b6', '#005b21b6'] },
      },
      {
        type: 'container', alignment: 'center', width: 980, height: 700,
        offsetX: 500, offsetY: 190, opacity: 0.45,
        gradient: { type: 'radial', colors: ['#2e0891b2', '#000891b2'] },
      },
    ];

    // Two independent parallax star layers.
    for (var s = 0; s < 94; s++) {
      var far = s >= 42;
      var sx = -920 + ((s * (far ? 523 : 731)) % 1840);
      var sy = -510 + ((s * (far ? 271 : 389)) % 990);
      var size = far ? 2 : 2 + (s % 3);
      children.push({
        type: 'container', alignment: 'center',
        offsetX: sx + (far ? float(frame, 24, 0.018, s) : 0),
        offsetY: sy + (far ? float(frame, 10, 0.026, s * 0.7) : 0),
        width: size, height: size, borderRadius: 999,
        opacity: far ? 0.16 + 0.28 * shimmer(frame + s * 7, 42) : 0.28 + 0.62 * shimmer(frame + s * 9, 34 + (s % 5) * 6),
        color: far ? '#a5b4fc' : '#e0f2fe',
      });
    }

    // Moon and its restrained halo.
    children.push({
      type: 'container', alignment: 'center', width: 280, height: 280,
      offsetX: portrait ? 310 : 700, offsetY: portrait ? -560 : -350, opacity: 0.65,
      gradient: { type: 'radial', colors: ['#42a5b4fc', '#00a5b4fc'] },
    });
    children.push({
      type: 'container', alignment: 'center', width: 92, height: 92,
      offsetX: portrait ? 310 : 700, offsetY: portrait ? -560 : -350, borderRadius: 999,
      gradient: { type: 'radial', radius: 0.72, colors: ['#f0f7ff', '#93a9cb', '#35415e'], stops: [0, 0.58, 1] },
      shadow: { color: '#5267e8f9', blur: 24, offsetX: 0, offsetY: 0 },
    });

    // Planet limb and atmosphere: a broad layered landscape anchors the
    // lower half instead of leaving a dead dark field.
    children.push({
      type: 'container', alignment: 'center', width: 2400, height: 900, offsetY: 740,
      borderRadius: 999,
      gradient: {
        type: 'linear', begin: 'topCenter', end: 'bottomCenter',
        colors: ['#1b3c78', '#101e49', '#070918'], stops: [0, 0.42, 1],
      },
    });
    children.push({
      type: 'container', alignment: 'center', width: 2400, height: 900, offsetY: 740,
      borderRadius: 999, borderColor: '#67e8f9', borderWidth: 12, opacity: 0.28, blur: 14,
    });
    children.push({
      type: 'container', alignment: 'center', width: 2400, height: 900, offsetY: 740,
      borderRadius: 999, borderColor: '#c5f4ff', borderWidth: 2.5, opacity: 0.65,
    });
    // Fine latitude lines make the limb feel vast rather than a flat cap.
    for (var lat = 0; lat < 3; lat++) {
      children.push({
        type: 'container', alignment: 'center', width: 1900 - lat * 210, height: 560 - lat * 90,
        offsetY: 850 + lat * 78, borderRadius: 999,
        borderColor: lat === 1 ? '#1f67e8f9' : '#1aa5b4fc', borderWidth: 2,
      });
    }

    // ---- Orbital hero -------------------------------------------------------
    var orbitOp = ease(frame, 3, 20, eo3) * (1 - seg(frame, 112, 136));
    var orbitCX = portrait ? 120 : 220;
    var orbitCY = portrait ? -180 : -60;
    children.push({
      type: 'container', alignment: 'center', offsetX: orbitCX, offsetY: orbitCY,
      width: portrait ? 440 : 590, height: portrait ? 440 : 590, opacity: 0.65 * orbitOp,
      gradient: { type: 'radial', colors: ['#3d7c3aed', '#147c3aed', '#007c3aed'], stops: [0, 0.55, 1] },
    });
    var orbitSpecs = [
      [590, 190, -12, '#8fa78bfa', 2.4],
      [470, 142, 18, '#8067e8f9', 2.0],
      [350, 112, -28, '#59ec4899', 1.6],
    ];
    for (var o = 0; o < orbitSpecs.length; o++) {
      var os = orbitSpecs[o];
      children.push({
        type: 'container', alignment: 'center', offsetX: orbitCX, offsetY: orbitCY,
        width: os[0] * (portrait ? 0.72 : 1), height: os[1] * (portrait ? 0.72 : 1),
        rotation: os[2] + Math.sin(frame * 0.015 + o) * 3,
        borderRadius: 999, borderColor: os[3], borderWidth: os[4], opacity: orbitOp,
        shadow: { color: os[3], blur: 14, offsetX: 0, offsetY: 0 },
      });
    }
    // Bright satellites travelling along the main ellipse.
    for (var od = 0; od < 4; od++) {
      var oa = frame * 0.018 + od * Math.PI * 0.5;
      children.push({
        type: 'container', alignment: 'center',
        offsetX: orbitCX + Math.cos(oa) * (portrait ? 210 : 292),
        offsetY: orbitCY + Math.sin(oa) * (portrait ? 66 : 92),
        width: od === 0 ? 13 : 8, height: od === 0 ? 13 : 8, borderRadius: 999,
        color: od % 2 ? primaryLight : accent, opacity: orbitOp,
        shadow: { color: od % 2 ? '#a78bfa' : '#22d3ee', blur: 18, offsetX: 0, offsetY: 0 },
      });
    }

    // Original vector satellite, gently floating in the far-right third.
    children.push({
      type: 'image', source: 'external:satellite_vector', fit: 'contain',
      alignment: 'center', width: portrait ? 220 : 300, height: portrait ? 134 : 183,
      offsetX: portrait ? 270 : 610,
      offsetY: (portrait ? -430 : -190) + float(frame, 18, 0.04, 1.4),
      rotation: -8 + Math.sin(frame * 0.025) * 5,
      opacity: ease(frame, 14, 30, eo3) * (1 - seg(frame, 104, 126)),
    });

    // Launch glow and exhaust sit behind the rocket. Their narrow silhouette
    // preserves the vehicle shape; there is no large white radial blob.
    children.push({
      type: 'container', alignment: 'center', offsetX: rocketX,
      offsetY: rocketY + 142, width: 132, height: 132, opacity: 0.65 * ignition,
      gradient: { type: 'radial', colors: ['#8f67e8f9', '#0067e8f9'] },
    });
    children.push({
      type: 'container', alignment: 'center', offsetX: rocketX,
      offsetY: rocketY + 138 + trailH / 2, width: 86, height: trailH,
      borderRadius: 48, opacity: 0.68 * trailOp, blur: 12,
      gradient: {
        type: 'linear', begin: 'topCenter', end: 'bottomCenter',
        colors: ['#e0f2fe', '#8f22d3ee', '#537c3aed', '#007c3aed'], stops: [0, 0.18, 0.65, 1],
      },
    });
    children.push({
      type: 'container', alignment: 'center', offsetX: rocketX,
      offsetY: rocketY + 132 + trailH * 0.38, width: 24, height: trailH * 0.76,
      borderRadius: 16, opacity: 0.9 * trailOp,
      gradient: {
        type: 'linear', begin: 'topCenter', end: 'bottomCenter',
        colors: ['#ffffff', '#bfa5f3fc', '#0022d3ee'],
      },
    });
    children.push({
      type: 'image', source: 'external:rocket_vector', fit: 'contain',
      alignment: 'center', width: 190, height: 285,
      offsetX: rocketX, offsetY: rocketY, rotation: -5 - 9 * launch,
      scale: rocketScale, opacity: rocketOp,
      shadow: { color: '#5967e8f9', blur: 28, offsetX: 0, offsetY: 12 },
    });

    // ---- Live code card: useful content in the left third ------------------
    var codeOp = ease(frame, 10, 28, eo3) * (1 - seg(frame, 98, 114));
    var codeKids = [];
    for (var ci = 0; ci < codeLines.length; ci++) {
      codeKids.push({
        type: 'text', text: typewriter(codeLines[ci], frame, 14 + ci * 5, 100),
        textAlign: 'left', width: portrait ? 360 : 400,
        margin: { top: ci === 0 ? 0 : 10 },
        style: {
          fontSize: portrait ? 18 : 20, fontFamily: font, letterSpacing: 0.8,
          color: ci === 0 ? '#ffffff' : (ci === codeLines.length - 1 ? '#cbd5e1' : (ci % 2 ? '#a5f3fc' : '#c4b5fd')),
        },
      });
    }
    if (!portrait) {
      children.push({
        type: 'container', alignment: 'centerLeft', offsetX: 92, offsetY: -72,
        width: 464, height: 326, opacity: codeOp,
        color: '#c910142c', borderRadius: 24,
        borderColor: '#4667e8f9', borderWidth: 1.4,
        shadow: { color: '#33000000', blur: 34, offsetX: 0, offsetY: 18 },
        child: {
          type: 'stack', fit: 'expand', children: [
            {
              type: 'row', alignment: 'topLeft', offsetX: 26, offsetY: 22,
              crossAxisAlignment: 'center', children: [
                { type: 'container', width: 9, height: 9, borderRadius: 999, color: accent },
                {
                  type: 'text', text: (t.tag || '3D IN ONE LINE').toUpperCase(), margin: { left: 12 },
                  style: { fontSize: 17, color: '#c4b5fd', fontFamily: font, fontWeight: 700, letterSpacing: 3 },
                },
              ],
            },
            {
              type: 'column', alignment: 'topLeft', offsetX: 28, offsetY: 72,
              width: 400, crossAxisAlignment: 'start', children: codeKids,
            },
            {
              type: 'row', alignment: 'bottomLeft', offsetX: 28, offsetY: -22,
              crossAxisAlignment: 'center', children: [
                { type: 'container', width: 8, height: 8, borderRadius: 999, color: '#34d399' },
                {
                  type: 'text', text: 'LIVE VIEWPORT  ·  FRAME ' + ('00' + frame).slice(-3), margin: { left: 10 },
                  style: { fontSize: 15, color: '#94a3b8', fontFamily: font, letterSpacing: 1.4 },
                },
              ],
            },
          ],
        },
      });
    }

    // ---- Prompt + Render ----------------------------------------------------
    children.push({
      type: 'column', alignment: 'center', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
      offsetY: portrait ? 420 : 318, opacity: fieldOp,
      children: [
        {
          type: 'container', width: portrait ? 620 : 680, height: 86,
          color: '#1fffffff', borderColor: '#4dffffff', borderWidth: 1.5, borderRadius: 999,
          shadow: { color: '#29000000', blur: 28, offsetX: 0, offsetY: 12 },
          child: {
            type: 'row', crossAxisAlignment: 'center',
            children: [{ type: 'container', width: 34 }].concat(typewriterFieldNodes({
              frame: frame, text: fieldText, start: 54, cps: 32, font: font,
              fontSize: portrait ? 25 : 29, color: '#ffffff', caretColor: accent, caretHeight: 36,
            })),
          },
        },
        { type: 'container', height: 20 },
        renderButtonNode({
          label: buttonLabel, font: font, fontSize: 27, width: 230, height: 66,
          colors: [primary, primaryLight], scale: btnScale, sparkleSize: 20,
          shadowColor: '#807c3aed', shadowBlur: 28 + 12 * shimmer(frame, 28), shadowOffsetY: 10,
        }),
      ],
    });
    children.push({
      type: 'path', path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
      color: '#e2e8f0', strokeWidth: 3, width: 34, height: 34,
      alignment: 'center', offsetX: curX, offsetY: curY, opacity: curOp,
    });

    return { type: 'stack', fit: 'expand', opacity: life, children: children };
  },
};
