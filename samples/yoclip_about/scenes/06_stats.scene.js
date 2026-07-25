// Promo scene 5 — animated stats. Data-driven counters tick up to prove the
// engine is built for real output, not toy demos.

scene = {
  id: 'stats',
  duration: 300,
  from: 0,
  timeline: {
    label: yoclipT('stats').timeline || 'Stats',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('stats');
    var life = presence(frame, 16, 252, 18);
    var titleIn = ease(frame, 0, 28, eo3);
    // Portrait variants re-compose: the three stat cards stack vertically in
    // the tall 1080x1920 frame instead of sitting side by side.
    var portrait = yoclipIsPortrait();

    function stat(index, target, suffix, label, accent) {
      var p = pop(frame, 34 + index * 16, 28);
      var value = counter(frame, 60 + index * 16, 90, 0, target);
      return {
        type: 'container',
        width: portrait ? 640 : 460,
        height: 380,
        borderRadius: 32,
        gradient: {
          colors: [yoclipTheme.colors.surface, yoclipTheme.colors.surface],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        borderColor: accent,
        borderWidth: 1.5,
        shadow: { color: accent, blur: 40, offsetY: 22 },
        scale: p.scale,
        opacity: p.opacity,
        child: {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'row',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'end',
              children: [
                {
                  type: 'text',
                  text: '' + value,
                  style: {
                    fontSize: yoclipSize('display', 132),
                    color: yoclipTheme.colors.text,
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                    shadows: [{ color: accent, blur: 34 }],
                  },
                },
                {
                  type: 'text',
                  text: suffix,
                  style: {
                    fontSize: yoclipSize('lg', 56),
                    color: accent,
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                  offsetY: -24,
                  offsetX: 8,
                },
              ],
            },
            {
              type: 'text',
              text: label,
              style: {
                fontSize: yoclipSize('captionLg', 30),
                color: yoclipTheme.colors.textMuted,
                fontFamily: yoclipFont(),
                letterSpacing: 1,
              },
              offsetY: 12,
            },
          ],
        },
      };
    }

    function statText(index, big, label, accent) {
      var p = pop(frame, 34 + index * 16, 28);
      return {
        type: 'container',
        width: portrait ? 640 : 460,
        height: 380,
        borderRadius: 32,
        gradient: {
          colors: [yoclipTheme.colors.surface, yoclipTheme.colors.surface],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        borderColor: accent,
        borderWidth: 1.5,
        shadow: { color: accent, blur: 40, offsetY: 22 },
        scale: p.scale,
        opacity: p.opacity,
        child: {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: big,
              style: {
                fontSize: yoclipSize('md', 52),
                color: yoclipTheme.colors.text,
                fontFamily: yoclipFont(),
                fontWeight: 700,
                shadows: [{ color: accent, blur: 30 }],
              },
            },
            {
              type: 'text',
              text: label,
              style: {
                fontSize: yoclipSize('captionLg', 30),
                color: yoclipTheme.colors.textMuted,
                fontFamily: yoclipFont(),
                letterSpacing: 1,
              },
              offsetY: 18,
            },
          ],
        },
      };
    }

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'text',
          text: T.title || 'Built for real output',
          style: {
            fontSize: portrait ? 52 : yoclipSize('h5', 72),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: 96 + riseIn(frame, 28, -24),
          opacity: titleIn,
        },
        {
          type: portrait ? 'column' : 'row',
          mainAxisAlignment: 'spaceEvenly',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: portrait ? 60 : 70,
          children: [
            stat(0, 60, '', 'fps · 24 / 30 / 60', yoclipTheme.colors.primaryLight),
            statText(1, 'FHD · 2K · 4K', T.resolution || 'any resolution', yoclipTheme.colors.accent),
            stat(2, 100, '%', T.scriptable || 'scriptable', yoclipTheme.colors.primary),
          ],
        },
      ],
    };
  },
};
