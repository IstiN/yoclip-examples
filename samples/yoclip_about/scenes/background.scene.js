// Background layer: an animated canvas under every scene.
//
// A gradient base plus three slowly drifting color "orbs" gives the whole
// promo a premium, living theme without distracting from content. Orb colors
// come from the active theme; on light backgrounds they deepen (the theme's
// primary/accent/primaryLight are darker there) and their opacity is boosted
// so they stay visible on white. The orbs move on gentle sine paths so the
// frame is never fully static.

scene = {
  id: 'background',
  duration: 4000,
  from: 0,
  timeline: {
    label: yoclipT('background').timeline || 'Background',
    color: yoclipTheme.colors.background,
    lane: 'video',
  },
  render: function(frame) {
    var orbA = {
      x: float(frame, 220, 0.018, 0),
      y: float(frame, 160, 0.014, 1.2),
    };
    var orbB = {
      x: float(frame, 200, 0.015, 2.4),
      y: float(frame, 180, 0.02, 0.4),
    };
    var orbC = {
      x: float(frame, 160, 0.022, 4.1),
      y: float(frame, 140, 0.017, 2.9),
    };

    // A soft orb on a LINEAR gradient (the look we liked) but with a multi-stop
    // alpha falloff instead of a single color->transparent jump. The extra
    // intermediate stops are what remove the visible banding / pixelated edge
    // while keeping the original big, diagonal "cloud" shape.
    function orb(x, y, hex, size, opacity) {
      return {
        type: 'container',
        width: size,
        height: size,
        borderRadius: size / 2,
        gradient: {
          colors: [hex + 'FF', hex + 'B0', hex + '55', yoclipColorA('ink', 0x00)],
          stops: [0.0, 0.30, 0.65, 1.0],
          begin: 'center',
          end: 'bottomRight',
        },
        shadow: { color: hex + '99', blur: 70 },
        opacity: opacity,
        offsetX: x,
        offsetY: y,
        alignment: 'center',
      };
    }

    // On light backgrounds the orbs need ~2x opacity to read; on dark ones the
    // original subtle values stay pixel-identical to before theme-awareness.
    var boost = yoclipIsLight() ? 1.9 : 1.0;

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'container',
          gradient: {
            colors: [yoclipTheme.colors.background, yoclipTheme.colors.backgroundSoft, yoclipTheme.colors.backgroundDeep],
            begin: 'topLeft',
            end: 'bottomRight',
          },
        },
        orb(orbA.x - 360, orbA.y - 120, yoclipColor('primary', '#7c3aed'), 900, 0.22 * boost),
        orb(orbB.x + 420, orbB.y + 60, yoclipColor('accent', '#22d3ee'), 820, 0.14 * boost),
        orb(orbC.x + 40, orbC.y + 360, yoclipColor('primaryLight', '#a78bfa'), 760, 0.12 * boost),
      ],
    };
  },
};
