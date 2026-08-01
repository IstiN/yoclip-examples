// 05 — Code in, video out. Dark-violet demo beat.
//
// Reference beat (Gamma 30–42s): the "dark space" demo. Left: an editor
// window (dots + filename tab) where a yoclip scene file types in line by
// line with light syntax coloring. Right: a live preview panel that starts
// as an empty bordered placeholder and, as the code completes, a real 3D
// rocket (scene3d software meshes: cone nose + cylinder body + cube fins)
// scales in on a soft glow and slowly rotates. Caption chip closes the beat.
//
// Renderer notes: container styling must be direct props (a `decoration`
// map is silently dropped); `scene3d` is a JWR built-in, so it ignores
// width/height/alignment and simply fills its tight stack slot.

scene = {
  id: 'code',
  duration: 246,
  description: 'Split demo: editor window types a rocket scene file line by line (syntax colors), the preview panel lights up with a rotating 3D rocket built from scene3d meshes, caption chip "Code in. Video out." lands.',
  voicePrompts: {
    en: 'Steady keystrokes; a low riser as the rocket ignites in the preview.',
    ru: 'Ровный стук клавиш; нарастающий ризер при появлении ракеты.',
  },
  timeline: {
    label: yoclipT('code').timeline || 'Code',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('code');
    var filename = t.filename || 'scenes/rocket.scene.js';
    var caption = t.caption || 'Code in. Video out.';
    var previewLabel = t.preview || 'preview';
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 224, 14);

    var kw = yoclipColor('primaryLight', '#a78bfa');
    var str = yoclipColor('accent', '#22d3ee');
    var com = yoclipColor('textMuted', '#a1a1aa');
    var txt = yoclipColor('text', '#ffffff');

    // -- Code lines: comment muted, keywords primaryLight, strings accent.
    var codeLines = [
      { t: '// rocket.scene.js — a 3D hero in 12 lines', c: com, indent: 0 },
      { t: 'scene = {', c: kw, indent: 0 },
      { t: "id: 'rocket',", c: str, indent: 1 },
      { t: 'duration: 150,', c: txt, indent: 1 },
      { t: 'render: function(frame) {', c: kw, indent: 1 },
      { t: 'return {', c: txt, indent: 2 },
      { t: "type: 'scene3d',", c: str, indent: 2 },
      { t: 'meshes: [nose, body, fins],', c: txt, indent: 2 },
      { t: 'camera: { fov: 55 },', c: txt, indent: 2 },
      { t: '};', c: txt, indent: 1 },
      { t: '},', c: kw, indent: 0 },
      { t: '};', c: kw, indent: 0 },
    ];

    var LINE_START = 18;
    var LINE_DELAY = 11;
    var codeChildren = [];
    for (var i = 0; i < codeLines.length; i++) {
      var ls = LINE_START + i * LINE_DELAY;
      codeChildren.push({
        type: 'text',
        text: typewriter(codeLines[i].t, frame, ls, 90),
        style: {
          fontSize: portrait ? 26 : 28,
          color: codeLines[i].c,
          fontFamily: yoclipFont(),
          lineHeight: 1.42,
        },
        textAlign: 'left',
        opacity: seg(frame, ls, ls + 2),
        offsetX: codeLines[i].indent * 28,
      });
    }
    var codeDoneAt = LINE_START + codeLines.length * LINE_DELAY + 14; // ~164

    // -- Panels entrance.
    var cardIn = ease(frame, 4, 34, eo3);

    // -- Rocket: fades/scales in as the code completes, then slowly rotates.
    var rocketIn = ease(frame, codeDoneAt - 8, codeDoneAt + 26, eo3);
    var rocketScale = 0.65 + 0.35 * eoBack(seg(frame, codeDoneAt - 8, codeDoneAt + 22));
    var yaw = Math.max(0, frame - codeDoneAt + 22) * 0.9;
    var bob = float(frame, 0.12, 0.05);
    var accent = yoclipColor('accent', '#22d3ee');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');

    var meshes = [
      meshXform(meshCone(0.38, 0.8, 12), { color: accent, rotate: { y: yaw }, translate: [0, 1.15 + bob, 0] }),
      meshXform(meshCylinder(0.38, 1.5, 14), { color: primaryLight, rotate: { y: yaw }, translate: [0, bob, 0] }),
      meshXform(meshCone(0.2, 0.5, 10), { color: accent, rotate: { z: 180 }, translate: [0, -1.0 + bob, 0] }),
    ];
    for (var k = 0; k < 3; k++) {
      var a = (yaw + k * 120) * Math.PI / 180;
      meshes.push(meshXform(meshCube(0.5, 0.6, 0.12), {
        color: primary,
        rotate: { y: yaw + k * 120 },
        translate: [Math.cos(a) * 0.5, -0.55 + bob, Math.sin(a) * 0.5],
      }));
    }

    function dot(color) {
      return { type: 'container', width: 16, height: 16, color: color, borderRadius: 8 };
    }

    var editorW = portrait ? 940 : 900;
    var editorH = portrait ? 720 : 860;
    var previewW = portrait ? 940 : 780;
    var previewH = portrait ? 700 : 860;

    var editor = {
      type: 'container',
      alignment: portrait ? 'topCenter' : 'centerLeft',
      offsetX: portrait ? 0 : 72,
      offsetY: portrait ? 130 : 0,
      width: editorW,
      height: editorH,
      opacity: cardIn,
      color: yoclipColor('backgroundDeep', '#07070d'),
      borderRadius: 26,
      borderColor: yoclipColorA('primaryLight', 0x33, '#a78bfa'),
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x44, '#7c3aed'), blur: 46, offsetX: 0, offsetY: 24 },
      clip: true,
      child: {
        type: 'column',
        crossAxisAlignment: 'start',
        children: [
          // Chrome: dots + filename tab.
          {
            type: 'container',
            height: 76,
            color: yoclipColorA('surface', 0x99, '#15131f'),
            child: {
              type: 'row',
              crossAxisAlignment: 'center',
              children: [
                { type: 'container', width: 32 },
                dot(yoclipColor('macRed', '#ff5f57')),
                { type: 'container', width: 10 },
                dot(yoclipColor('macYellow', '#febc2e')),
                { type: 'container', width: 10 },
                dot(yoclipColor('macGreen', '#28c840')),
                {
                  type: 'text',
                  text: filename,
                  offsetX: 24,
                  style: {
                    fontSize: 24,
                    color: yoclipColor('textMuted', '#a1a1aa'),
                    fontFamily: yoclipFont(),
                  },
                },
              ],
            },
          },
          {
            type: 'container',
            offsetX: 40,
            offsetY: 34,
            child: {
              type: 'column',
              crossAxisAlignment: 'start',
              children: codeChildren,
            },
          },
        ],
      },
    };

    var preview = {
      type: 'container',
      alignment: portrait ? 'bottomCenter' : 'centerRight',
      offsetX: portrait ? 0 : -72,
      offsetY: portrait ? -150 : 0,
      width: previewW,
      height: previewH,
      opacity: cardIn,
      color: yoclipColor('surface', '#15131f'),
      borderRadius: 26,
      borderColor: rocketIn > 0.5
        ? yoclipColorA('accent', 0x66, '#22d3ee')
        : yoclipColorA('textMuted', 0x55, '#a1a1aa'),
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('accent', 0x40, '#22d3ee'), blur: 44, offsetX: 0, offsetY: 22 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // Empty-state label: a slow "compiling" pulse while the code types,
          // fully faded out BEFORE the rocket starts entering (rocketIn ramps
          // from codeDoneAt-8) so it never sits on top of the 3D mesh.
          {
            type: 'text',
            alignment: 'center',
            text: previewLabel,
            opacity: (1 - seg(frame, codeDoneAt - 30, codeDoneAt - 10)) * (0.45 + 0.25 * shimmer(frame, 70)),
            style: {
              fontSize: 28,
              color: yoclipColor('textMuted', '#a1a1aa'),
              fontFamily: yoclipFont(),
              letterSpacing: 6,
            },
          },
          // Soft glow behind the rocket. Long shimmer period (150f) + small
          // amplitude: brightness drifts slowly and never pumps frame-to-frame.
          {
            type: 'container',
            alignment: 'center',
            width: 460,
            height: 460,
            opacity: rocketIn * (0.45 + 0.12 * shimmer(frame, 150)),
            gradient: {
              type: 'radial',
              center: 'center',
              radius: 0.5,
              colors: [yoclipColorA('accent', 0x59, '#22d3ee'), yoclipColorA('accent', 0x00, '#22d3ee')],
            },
          },
          // The 3D rocket fills the preview's tight stack slot.
          {
            type: 'scene3d',
            opacity: rocketIn,
            scale: rocketScale,
            meshes: meshes,
            camera: { position: [0, 0.6, 5], target: [0, 0.4, 0], fov: 55 },
            light: { direction: [-0.4, -0.8, -0.6] },
          },
        ],
      },
    };

    // -- Caption chip.
    var capIn = ease(frame, 208, 226, eo3);
    var captionChip = {
      type: 'container',
      alignment: 'bottomCenter',
      offsetY: (portrait ? -36 : -52) - (1 - capIn) * 16,
      opacity: capIn,
      color: yoclipColorA('backgroundDeep', 0xb3, '#07070d'),
      borderRadius: 999,
      borderColor: yoclipColorA('accent', 0x66, '#22d3ee'),
      borderWidth: 1.5,
      child: {
        type: 'text',
        text: caption,
        padding: 12,
        margin: { left: 18, right: 18 },
        style: {
          fontSize: portrait ? 24 : 26,
          color: yoclipColor('primaryLight', '#a78bfa'),
          fontFamily: yoclipFont(),
          fontWeight: 600,
          letterSpacing: 8,
        },
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Dark-violet stage dim over the shared background.
        {
          type: 'absolute_fill',
          color: yoclipColor('backgroundDeep', '#07070d'),
          opacity: 0.55,
        },
        editor,
        preview,
        captionChip,
      ],
    };
  },
};
