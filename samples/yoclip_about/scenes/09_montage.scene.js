// Promo scene 8 — montage. Three totally different looks cut quickly inside one
// frame to prove range: a drawing, a living gradient, a 3D spin. Pace, pace.

scene = {
  id: 'montage',
  duration: 240,
  from: 0,
  timeline: {
    label: yoclipT('montage').timeline || 'Montage',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('montage');
    var life = presence(frame, 12, 202, 14);
    var titleIn = ease(frame, 0, 24, eo3);
    // Portrait variants (e.g. shorts 1080x1920): narrower panel that uses the
    // vertical room, title a bit smaller and higher up.
    var portrait = yoclipIsPortrait();

    var beat = 64;
    var active = Math.min(2, Math.floor(frame / beat));
    var local = frame - active * beat;
    var miniOpacity = presence(local, 8, 40, 12);
    var miniScale = 0.96 + 0.04 * ease(local, 0, beat, eo3);

    var labels = T.labels || ['draw', 'breathe', 'spin'];

    function starPath() {
      return {
        type: 'path',
        path: 'M 300 60 L 360 240 L 540 240 L 390 350 L 450 540 L 300 430 L 150 540 L 210 350 L 60 240 L 240 240 Z',
        progress: ease(local, 0, 56, eio3),
        color: yoclipTheme.colors.accent,
        strokeWidth: 12,
        width: 600,
        height: 600,
      };
    }

    function breathe() {
      var s = 0.7 + 0.3 * ease(local, 0, beat, eio3);
      return {
        type: 'container',
        width: 360,
        height: 360,
        borderRadius: 180,
        gradient: {
          colors: [yoclipTheme.colors.primary, yoclipTheme.colors.accent, yoclipTheme.colors.primaryLight],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        shadow: { color: yoclipTheme.colors.primaryLight, blur: 80 },
        scale: s,
      };
    }

    function spinCard() {
      return {
        type: 'image',
        source: yoclipLogoSource(),
        fit: 'contain',
        width: 520,
        height: 330,
        rotateY: ease(local, 0, beat, eio3) * 360,
      };
    }

    var minis = [starPath(), breathe(), spinCard()];

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'text',
          text: T.title || 'Anything you can code',
          style: {
            fontSize: portrait ? 60 : yoclipSize('h5', 72),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: (portrait ? 170 : 96) + riseIn(frame, 24, -24),
          opacity: titleIn,
        },
        {
          type: 'container',
          width: portrait ? 880 : 980,
          height: portrait ? 820 : 620,
          borderRadius: 32,
          color: yoclipTheme.colors.surface,
          borderColor: yoclipColor('panel', '#2a2a36'),
          borderWidth: 1.5,
          shadow: { color: yoclipColorA('ink', 0x80), blur: 50, offsetY: 26 },
          clip: true,
          alignment: 'center',
          offsetY: 40,
          child: {
            type: 'stack',
            fit: 'expand',
            children: [
              {
                type: 'container',
                alignment: 'center',
                opacity: miniOpacity,
                scale: miniScale,
                child: minis[active],
              },
              {
                type: 'text',
                text: labels[active],
                style: {
                  fontSize: yoclipSize('caption', 28),
                  color: yoclipTheme.colors.textMuted,
                  fontFamily: yoclipFont(),
                  letterSpacing: 6,
                },
                alignment: 'bottomCenter',
                offsetY: -34,
              },
            ],
          },
        },
      ],
    };
  },
};
