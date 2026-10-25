// 10 — Fly-through: a pure-vector render-space tunnel.
//
// Perspective is expressed with scale, depth opacity and outward-moving
// particles. Floating scene files and a suspended yoclip mark give the tunnel
// a subject; the final tagline takes over without any scene3d/GLB viewport
// artifacts. All geometry remains sharp at 1920×1080 and in portrait.

scene = {
  id: 'flythrough',
  duration: 216,
  description: 'A procedural neon tunnel of perspective rings, outward particles and floating scene files rushes past a suspended yoclip mark before the tagline lands.',
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
    var font = yoclipFont();
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var deep = yoclipColor('backgroundDeep', '#07070d');
    var life = presence(frame, 8, 194, 14);

    var tagIn = ease(frame, 148, 172, eo3);
    var dim = lerp(1, 0.18, seg(frame, 132, 168));
    var swayX = Math.sin(frame * 0.025) * 30;
    var swayY = Math.sin(frame * 0.019 + 1) * 20;
    var tunnel = [];

    // Star streaks accelerate out of the vanishing point.
    for (var s = 0; s < 64; s++) {
      var phase = (s * 0.61803398875 + frame * 0.0075) % 1;
      var angle = s * 2.39996;
      var radius = 34 + phase * phase * (portrait ? 690 : 980);
      var x = Math.cos(angle) * radius * 1.25 + swayX * phase;
      var y = Math.sin(angle) * radius * 0.72 + swayY * phase;
      var streak = s % 4 === 0;
      tunnel.push({
        type: 'container', alignment: 'center', offsetX: x, offsetY: y,
        width: streak ? 2 : 2 + (s % 2), height: streak ? 22 : 2 + (s % 3),
        borderRadius: 2, rotation: angle * 180 / Math.PI + 90,
        color: s % 5 === 0 ? primaryLight : accent,
        opacity: Math.sin(phase * Math.PI) * 0.72,
      });
    }

    // Rings recycle from a distant point to beyond the camera.
    for (var i = 0; i < 13; i++) {
      var p = (i / 13 + frame * 0.0058) % 1;
      var scale = 0.07 + p * p * 2.35;
      var op = Math.sin(p * Math.PI) * 0.9;
      var col = i % 3 === 0 ? accent : (i % 3 === 1 ? primary : primaryLight);
      tunnel.push({
        type: 'container', alignment: 'center',
        offsetX: swayX * p, offsetY: swayY * p,
        width: portrait ? 620 : 900, height: portrait ? 920 : 540,
        borderRadius: portrait ? 76 : 62,
        scale: scale, rotation: i * 11 + frame * (i % 2 ? 0.13 : -0.09),
        color: '#00000000', borderColor: col, borderWidth: i % 4 === 0 ? 4 : 2.5,
        opacity: op,
        shadow: { color: yoclipColorA(i % 3 === 0 ? 'accent' : 'primary', i % 4 === 0 ? 0x08 : 0, '#7c3aed'), blur: 28, offsetX: 0, offsetY: 0 },
      });
    }

    // Scene-file panels drift on four depth lanes.
    for (var n = 0; n < 4; n++) {
      var dp = (n * 0.27 + 0.18 + frame * 0.0038) % 1;
      var side = n % 2 === 0 ? -1 : 1;
      var panelScale = 0.42 + dp * 0.72;
      var px = side * (390 + dp * 390) + swayX * dp;
      var py = -245 + n * 155 + Math.sin(frame * 0.025 + n) * 24;
      var panelOp = Math.sin(dp * Math.PI) * 0.8;
      var lines = [];
      lines.push({ type: 'container', alignment: 'topCenter', width: 280, height: 34, color: '#221b31' });
      lines.push({ type: 'text', alignment: 'topLeft', offsetX: 16, offsetY: 10, text: n % 2 ? '11_cta.scene.js' : '0' + n + '_idea.scene.js', style: { fontSize: 14, color: muted, fontFamily: font, letterSpacing: 1 } });
      for (var l = 0; l < 4; l++) {
        lines.push({ type: 'container', alignment: 'centerLeft', offsetX: 20 + (l % 2) * 18, offsetY: -42 + l * 25, width: 190 - l * 19, height: 8, borderRadius: 4, color: l === 0 ? accent : (l === 1 ? primaryLight : muted), opacity: l < 2 ? 0.85 : 0.42 });
      }
      tunnel.push({
        type: 'container', alignment: 'center', offsetX: px, offsetY: py,
        width: 280, height: 164, scale: panelScale, rotation: side * (7 + dp * 5), opacity: panelOp,
        color: '#10101c', borderRadius: 18, clip: true,
        borderColor: side < 0 ? primaryLight : accent, borderWidth: 1.5,
        shadow: { color: yoclipColorA(side < 0 ? 'primary' : 'accent', 0x28, '#7c3aed'), blur: 30, offsetX: 0, offsetY: 12 },
        child: { type: 'stack', fit: 'expand', children: lines },
      });
    }

    // A still brand core anchors the rushing geometry.
    tunnel.push({
      type: 'container', alignment: 'center', offsetY: float(frame, 12, 0.045),
      width: 260, height: 158, borderRadius: 28, opacity: 1 - tagIn,
      scale: 0.92 + Math.sin(frame * 0.035) * 0.045,
      rotation: Math.sin(frame * 0.022) * 2,
      color: '#100d1c', borderColor: primaryLight, borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x44, '#7c3aed'), blur: 46, offsetX: 0, offsetY: 14 },
      child: { type: 'stack', fit: 'expand', children: [{ type: 'image', source: yoclipLogoSource(), fit: 'contain', width: 178, height: 113, alignment: 'center' }] },
    });
    tunnel.push({ type: 'text', alignment: 'topLeft', offsetX: 54, offsetY: 44, text: 'YOCLIP  /  RENDER SPACE', style: { fontSize: 17, color: muted, fontFamily: font, fontWeight: 600, letterSpacing: 4 } });
    tunnel.push({ type: 'text', alignment: 'topRight', offsetX: -54, offsetY: 44, text: '030 FPS  /  1920 × 1080', style: { fontSize: 17, color: accent, fontFamily: font, fontWeight: 600, letterSpacing: 3 } });

    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        {
          type: 'container',
          gradient: { type: 'linear', begin: 'topLeft', end: 'bottomRight', colors: ['#03050c', deep, '#0b0718'] },
        },
        {
          type: 'container', alignment: 'center', width: 1100, height: 1100, opacity: dim,
          gradient: { type: 'radial', center: 'center', radius: 0.5, colors: [yoclipColorA('accent', 0x25, '#22d3ee'), yoclipColorA('primary', 0, '#7c3aed')] },
        },
        { type: 'stack', fit: 'expand', opacity: dim, children: tunnel },
        // The idea resolves out of the tunnel.
        {
          type: 'container', alignment: 'center', offsetY: portrait ? -112 : -96,
          width: 170 * tagIn, height: 3, color: accent, opacity: tagIn,
        },
        {
          type: 'text', alignment: 'center', text: tagline, opacity: tagIn,
          scale: 0.94 + 0.06 * ease(frame, 148, 176, eo3), textAlign: 'center',
          style: {
            fontSize: portrait ? 54 : 86, color: txt, fontFamily: font, fontWeight: 700,
            letterSpacing: lerp(1, 7, ease(frame, 148, 194, eo3)),
            shadows: [{ color: yoclipColorA('primary', 0x77, '#7c3aed'), blur: 32, offsetX: 0, offsetY: 0 }],
          },
        },
        {
          type: 'text', alignment: 'center', offsetY: portrait ? 92 : 88, text: 'DESCRIBE  /  RENDER  /  SHIP', opacity: tagIn * 0.8,
          style: { fontSize: portrait ? 17 : 18, color: accent, fontFamily: font, fontWeight: 600, letterSpacing: 5 },
        },
      ],
    };
  },
};
