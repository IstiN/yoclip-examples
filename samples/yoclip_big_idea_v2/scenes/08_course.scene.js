// 08 — Course: a deck that teaches — with a live animation and a live video
// embedded in its own cards.
//
// Reference beat (Gamma 35–44s): a dark course deck. A tag chip and two-line
// title land first; then a LEFT code card types the scene-graph code
// line-by-line with syntax colors; a RIGHT card labeled "Animate it!" holds
// a LIVE portrait — a KayKit knight playing 'Cheer' on a podium (one flame
// node). A formula block slides up. Final beat: an "Add a video" chip
// clicks, and the code card MORPHS into a live tunnel flythrough (software
// meshes, 8 square rings flowing toward the camera) — a real embedded video
// in the deck. Holds to the end.
//
// Renderer notes: the flame knight and the software podium/tunnel are
// separate scene3d nodes stacked inside their card slots (both fill the
// tight slot; the card clips them). Mesh colors carry no alpha — the tunnel
// fades via node opacity and fakes depth with ring scale. Geneva has no
// mono variant; the code card leans on syntax colors + letterSpacing.

scene = {
  id: 'course',
  duration: 276,
  description: 'Dark course deck: tag chip + two-line title, LEFT code card types scene.render code line-by-line with syntax colors, RIGHT "Animate it!" card shows a live flame knight cheering on a mesh podium, formula "y = render(t)" slides up, then an "Add a video" chip clicks and the code card morphs into a live square-ring tunnel flythrough. Holds.',
  voicePrompts: {
    en: 'A curious lecture groove; a sparkle when the knight starts moving, a whoosh when the video embeds.',
    ru: 'Любопытный лекционный грув; искра, когда рыцарь оживает, и свист встраивания видео.',
  },
  timeline: {
    label: yoclipT('course').timeline || 'Course',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('course');
    var tag = t.tag || 'yoclip 101';
    var titleA = t.titleA || 'What is a';
    var titleB = t.titleB || 'Scene Graph?';
    var codeCaption = t.codeCaption || 'The code behind the magic — scene.render(frame)';
    var animateLabel = t.animate || 'Animate it!';
    var formula = t.formula || 'y = render(t)';
    var formulaNote = t.formulaNote || 'every property is a function of frame';
    var addVideo = t.addVideo || 'Add a video';
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 254, 14);

    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var cardBg = '#17122b';
    var cardBorder = '#2a2145';

    // -- Header: tag chip + two-line title.
    var headIn = ease(frame, 4, 22, eo3);
    var header = {
      type: 'column',
      alignment: 'topCenter',
      offsetY: 34 + (1 - headIn) * 24,
      opacity: headIn,
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
      children: [
        {
          type: 'container',
          width: 250,
          color: yoclipColorA('primary', 0x2e, '#7c3aed'),
          borderRadius: 999,
          borderColor: yoclipColorA('primaryLight', 0x66, '#a78bfa'),
          borderWidth: 1.5,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 18 },
              {
                // The REAL yoclip wordmark (dark-theme: white on violet).
                type: 'image',
                source: 'external:logo',
                fit: 'contain',
                width: 120,
                height: 76,
                margin: { top: 2 },
              },
              {
                type: 'text',
                text: ' 101',
                margin: { right: 18, left: 8 },
                style: {
                  fontSize: 22,
                  color: primaryLight,
                  fontFamily: font,
                  fontWeight: 700,
                  letterSpacing: 4,
                },
              },
            ],
          },
        },
        {
          type: 'text',
          text: titleA,
          margin: { top: 16 },
          style: {
            fontSize: portrait ? 26 : 32,
            color: muted,
            fontFamily: font,
            fontWeight: 300,
          },
        },
        {
          type: 'text',
          text: titleB,
          margin: { top: 2 },
          style: {
            fontSize: portrait ? 46 : 60,
            color: txt,
            fontFamily: font,
            fontWeight: 700,
          },
        },
      ],
    };

    // -- LEFT: code card (types line-by-line, morphs into the tunnel).
    var codeIn = ease(frame, 24, 44, eo3);
    var morph = seg(frame, 210, 232);
    var codeOp = (1 - morph);
    var tunnelOp = seg(frame, 216, 238);

    var codeLines = [
      ['scene = {', txt],
      ['  render: function(frame) {', primaryLight],
      ['    return {', muted],
      ["      type: 'scene3d',", accent],
      ['      meshes: buildWorld(frame),', primaryLight],
      ['    };', muted],
      ['  },', txt],
      ['};', txt],
    ];
    var codeKids = [];
    for (var li = 0; li < codeLines.length; li++) {
      var lineStart = 34 + li * 10;
      var lineOp = staggerItem(frame, li, 34, 10, 6);
      codeKids.push({
        type: 'text',
        text: typewriter(codeLines[li][0], frame, lineStart, 90),
        textAlign: 'left',
        opacity: lineOp,
        margin: { top: li === 0 ? 0 : 8 },
        style: {
          fontSize: portrait ? 22 : 26,
          color: codeLines[li][1],
          fontFamily: font,
          letterSpacing: 1,
        },
      });
    }
    codeKids.push({
      type: 'text',
      text: codeCaption,
      textAlign: 'left',
      opacity: ease(frame, 128, 144, eo3),
      margin: { top: 26 },
      style: {
        fontSize: portrait ? 18 : 21,
        color: muted,
        fontFamily: font,
        fontStyle: 'italic',
      },
    });

    // Tunnel flythrough (software meshes) — the "embedded video".
    var tf = Math.max(0, frame - 216);
    var ringColors = [primary, accent, primaryLight];
    var tunnelMeshes = [];
    var N = 8, gap = 3.0, depth = N * gap, speed = 0.12;
    var half = 2.0, th = 0.1, len = 4.1;
    for (var ri = 0; ri < N; ri++) {
      var z = 2 - ((ri * gap + tf * speed) % depth);
      var shrink = 1 - 0.45 * ((2 - z) / depth);
      var ringSpin = (ri % 2) * 45 + tf * 0.3;
      var bars = [
        meshXform(meshCube(len, th, th), { translate: [0, half, 0] }),
        meshXform(meshCube(len, th, th), { translate: [0, -half, 0] }),
        meshXform(meshCube(th, len, th), { translate: [half, 0, 0] }),
        meshXform(meshCube(th, len, th), { translate: [-half, 0, 0] }),
      ];
      for (var bi = 0; bi < 4; bi++) {
        tunnelMeshes.push(meshXform(bars[bi], {
          color: ringColors[ri % 3],
          scale: shrink,
          rotate: { z: ringSpin },
          translate: [0, 0, z],
        }));
      }
    }

    var codeCardW = portrait ? 880 : 780;
    var codeCardH = portrait ? 560 : 620;
    var codeCard = {
      type: 'container',
      alignment: portrait ? 'center' : 'centerLeft',
      offsetX: portrait ? 0 : 80,
      offsetY: (portrait ? -240 : 6) + (1 - codeIn) * 40,
      width: codeCardW,
      height: codeCardH,
      opacity: codeIn,
      color: cardBg,
      borderRadius: 20,
      borderColor: cardBorder,
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('accent', Math.round(0x59 * morph), '#22d3ee'), blur: 40, offsetX: 0, offsetY: 14 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // The live tunnel (post-morph).
          {
            type: 'scene3d',
            opacity: tunnelOp,
            meshes: tunnelMeshes,
            camera: { position: [0, 0, 5.8], target: [0, 0, 0], fov: 55 },
            light: { direction: [0.2, -0.3, 0.9] },
          },
          // The code listing (pre-morph).
          {
            type: 'container',
            opacity: codeOp,
            color: cardBg,
            child: {
              type: 'column',
              crossAxisAlignment: 'start',
              margin: { left: 40, top: 36, right: 40 },
              children: codeKids,
            },
          },
        ],
      },
    };

    // "Add a video" chip docked inside the code card's top-right corner;
    // clicks ~200, then fades as the tunnel takes over the card. Explicit
    // width/height — an unsized container here stretches to the frame.
    var chipIn = ease(frame, 168, 184, eo3);
    var chipOut = seg(frame, 214, 230);
    var dip = seg(frame, 200, 204) * (1 - seg(frame, 204, 210));
    var chip = {
      type: 'container',
      alignment: portrait ? 'center' : 'centerLeft',
      offsetX: (portrait ? 300 : 555),
      offsetY: (portrait ? -240 : 6) - codeCardH / 2 + 34 + (1 - chipIn) * 18,
      width: 230,
      height: 48,
      opacity: chipIn * (1 - chipOut),
      scale: 1 - 0.12 * dip,
      color: yoclipColorA('primary', 0x40, '#7c3aed'),
      borderRadius: 999,
      borderColor: yoclipColorA('primaryLight', 0x80, '#a78bfa'),
      borderWidth: 1.5,
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 20 },
          {
            type: 'path',
            path: 'M 12 4 L 12 20 M 4 12 L 20 12',
            color: primaryLight,
            strokeWidth: 3,
            width: 20,
            height: 20,
            margin: { right: 10 },
          },
          {
            type: 'text',
            text: addVideo,
            style: {
              fontSize: 22,
              color: txt,
              fontFamily: font,
              fontWeight: 600,
            },
          },
          { type: 'container', width: 22 },
          { type: 'container', height: 46 },
        ],
      },
    };

    // -- RIGHT: "Animate it!" card with the live knight portrait.
    // NOTE: the flame host asserts on dispose when its game never gets a
    // layout — an exact opacity-0 / scale-0 entrance frame starves it, so
    // the pop starts early enough to be non-zero in every captured frame
    // and both props keep a floor.
    var animIn = pop(frame, 40, 22);
    var podiumMeshes = [
      meshXform(meshCylinder(0.85, 0.28, 18), { color: '#241d3d', translate: [0, -1.12, 0] }),
      meshXform(meshCylinder(0.85, 0.05, 18), { color: accent, translate: [0, -0.96, 0] }),
    ];
    var animCam = { position: [0, 0.75, 3.4], target: [0, -0.15, 0], fov: 45 };
    var animCardW = portrait ? 880 : 660;
    var animCardH = portrait ? 560 : 620;
    var animCard = {
      type: 'container',
      alignment: portrait ? 'center' : 'centerRight',
      offsetX: portrait ? 0 : -80,
      offsetY: (portrait ? 400 : 6),
      width: animCardW,
      height: animCardH,
      opacity: Math.max(0.02, animIn.opacity),
      // Flame host asserts on dispose when its game never gets a layout —
      // a zero-scale entrance state starves it, so keep a floor.
      scale: Math.max(0.02, animIn.scale),
      color: cardBg,
      borderRadius: 20,
      borderColor: cardBorder,
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x44, '#7c3aed'), blur: 40, offsetX: 0, offsetY: 14 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          {
            type: 'scene3d',
            meshes: podiumMeshes,
            camera: animCam,
            light: { direction: [0.3, -0.7, 0.6] },
          },
          {
            type: 'scene3d',
            engine: 'flame',
            id: 'v2-course-anim',
            time: frame / 30,
            camera: animCam,
            light: { ambient: 0.75, diffuse: 1.3, position: [4, 6, 5] },
            models: [{
              modelId: 'knight',
              src: 'models/Knight.glb',
              position: [0, -0.98, 0],
              rotation: [0, Math.sin(frame * 0.02) * 16, 0],
              scale: [0.55, 0.55, 0.55],
              animation: 'Cheer',
            }],
          },
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: 24,
            text: animateLabel,
            style: {
              fontSize: 24,
              color: primaryLight,
              fontFamily: font,
              fontWeight: 700,
              letterSpacing: 3,
            },
          },
        ],
      },
    };

    // -- Formula block slides up.
    var formIn = ease(frame, 122, 142, eo3);
    var formulaBlock = {
      type: 'column',
      alignment: 'bottomCenter',
      offsetY: -52 + (1 - formIn) * 50,
      opacity: formIn,
      // Columns fill the frame height — bottom-anchored via mainAxis.
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      children: [
        {
          type: 'text',
          text: formula,
          style: {
            fontSize: portrait ? 42 : 56,
            color: txt,
            fontFamily: font,
            fontStyle: 'italic',
            fontWeight: 600,
          },
        },
        {
          type: 'text',
          text: formulaNote,
          margin: { top: 8 },
          style: {
            fontSize: portrait ? 18 : 23,
            color: muted,
            fontFamily: font,
          },
        },
      ],
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        { type: 'container', color: '#0d0a1a' },
        header,
        codeCard,
        chip,
        animCard,
        formulaBlock,
      ],
    };
  },
};
