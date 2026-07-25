// Promo scene — export. Resolution, frame-rate and quality chips pop in to
// show the real export knobs (720/1080/4K/custom, 24/30/60 fps, Low/Med/High),
// with the encoding queue taking jobs one at a time.

scene = {
  id: 'export',
  duration: 270,
  from: 0,
  timeline: {
    label: yoclipT('export').timeline || 'Export',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('export');
    var life = presence(frame, 14, 226, 16);
    var titleIn = ease(frame, 0, 26, eo3);
    // Portrait variants (e.g. shorts 1080x1920) re-compose: the three chips
    // stack vertically as wider cards instead of a side-by-side row.
    var portrait = yoclipIsPortrait();

    // The fps chip counts up 0 -> 60 once its card has popped in, so the "60"
    // reads as a live number instead of a static label.
    var fpsBig = String(Math.round(lerp(0, 60, ease(frame, 80, 190, eo3))));

    function chip(index, big, small, accent) {
      var p = pop(frame, 30 + index * 18, 30);
      return {
        type: 'container',
        width: portrait ? 720 : 420,
        height: portrait ? 300 : 320,
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
                fontSize: yoclipSize('h4', 76),
                color: yoclipTheme.colors.text,
                fontFamily: yoclipFont(),
                fontWeight: 700,
                shadows: [{ color: accent, blur: 26 }],
              },
            },
            {
              type: 'text',
              text: small,
              style: {
                fontSize: yoclipSize('label', 26),
                color: yoclipTheme.colors.textMuted,
                fontFamily: yoclipFont(),
              },
              offsetY: 10,
            },
            {
              type: 'container',
              width: 56,
              height: 56,
              borderRadius: 28,
              color: accent,
              alignment: 'center',
              offsetY: 26,
              child: {
                type: 'stack',
                fit: 'expand',
                children: [
                  {
                    type: 'path',
                    path: 'M 8 22 L 17 31 L 33 10',
                    color: yoclipTheme.colors.background,
                    strokeWidth: 4,
                    width: 30,
                    height: 30,
                    alignment: 'center',
                  },
                ],
              },
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
          text: T.title || 'Export your way',
          style: {
            fontSize: yoclipSize('h5', 72),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: (portrait ? 150 : 110) + riseIn(frame, 26, -24),
          opacity: titleIn,
        },
        {
          type: 'text',
          text: T.sub || 'resolution · frame rate · quality — then queue the rest',
          style: {
            fontSize: yoclipSize('caption', 28),
            color: yoclipTheme.colors.textMuted,
            fontFamily: yoclipFont(),
          },
          alignment: 'topCenter',
          offsetY: portrait ? 246 : 196,
          opacity: titleIn,
        },
        portrait ? {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 140,
          children: [
            chip(0, '4K', T.resolutions || '720 · 1080 · 4K · custom', yoclipTheme.colors.primaryLight),
            { type: 'container', width: 1, height: 44 },
            chip(1, fpsBig, '24 / 30 / 60 fps', yoclipTheme.colors.accent),
            { type: 'container', width: 1, height: 44 },
            chip(2, T.high || 'High', T.quality || 'Low · Medium · High', yoclipTheme.colors.primary),
          ],
        } : {
          type: 'row',
          mainAxisAlignment: 'spaceEvenly',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 80,
          children: [
            chip(0, '4K', T.resolutions || '720 · 1080 · 4K · custom', yoclipTheme.colors.primaryLight),
            chip(1, fpsBig, '24 / 30 / 60 fps', yoclipTheme.colors.accent),
            chip(2, T.high || 'High', T.quality || 'Low · Medium · High', yoclipTheme.colors.primary),
          ],
        },
      ],
    };
  },
};
