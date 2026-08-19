// Background layer: an animated canvas under every scene.
//
// A deep gradient base plus three slowly drifting color "orbs" keeps the frame
// alive without distracting from content. Orb colors come from the active
// theme; on light variants the alpha is boosted so they stay visible on white.
//
// NOTE: duration must cover the whole timeline (the end card lands ~3294f
// with the current scene chain) — when scenes are added/retimed, keep this
// ahead of the last scene's end.

scene = {
  id: 'background',
  duration: 3300,
  from: 0,
  description: 'Full-length animated gradient + drifting theme orbs under all content.',
  voicePrompts: {
    en: 'Soft ambient pad underneath everything.',
    ru: 'Мягкий эмбиент-пад под всем роликом.',
  },
  timeline: {
    label: yoclipT('background').timeline || 'Background',
    color: yoclipTheme.colors.background,
    lane: 'video',
  },
  render: function(frame) {
    var boost = yoclipIsLight() ? 1.6 : 1.0;

    function orb(x, y, key, fallback, size, alpha) {
      return {
        type: 'container',
        width: size,
        height: size,
        alignment: 'center',
        offsetX: x,
        offsetY: y,
        gradient: {
          type: 'radial',
          colors: [yoclipColorA(key, alpha * boost, fallback), yoclipColorA(key, 0, fallback)],
          stops: [0, 1],
        },
      };
    }

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        // Full-frame base gradient (no alignment -> tight expand constraints
        // stretch it to the whole frame).
        {
          type: 'container',
          gradient: {
            type: 'linear',
            begin: 'topLeft',
            end: 'bottomRight',
            colors: [
              yoclipColor('backgroundSoft', '#0d0d18'),
              yoclipColor('background', '#0a0a12'),
              yoclipColor('backgroundDeep', '#07070d'),
            ],
          },
        },
        orb(float(frame, 260, 0.016, 0) - 420, float(frame, 180, 0.013, 1.2) - 160, 'primary', '#7c3aed', 900, 0x3d),
        orb(float(frame, 220, 0.014, 2.4) + 460, float(frame, 200, 0.018, 0.4) + 120, 'accent', '#22d3ee', 760, 0x30),
        orb(float(frame, 180, 0.02, 4.1), float(frame, 160, 0.015, 2.9) + 330, 'primaryLight', '#a78bfa', 640, 0x28),
      ],
    };
  },
};
