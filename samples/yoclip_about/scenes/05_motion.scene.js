// Promo scene 4 — 3D motion. A glass card spins in perspective to prove the
// rotateY / perspective transform, with a slow secondary card for depth.

scene = {
  id: 'motion',
  duration: 300,
  from: 0,
  timeline: {
    label: yoclipT('motion').timeline || '3D motion',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('motion');
    var life = presence(frame, 16, 252, 18);
    var titleIn = ease(frame, 0, 28, eo3);
    // Portrait variants (e.g. shorts 1080x1920) get a re-composed layout:
    // smaller title to fit the narrow frame, cards spread vertically using
    // the extra height, caption pushed further down.
    var portrait = yoclipIsPortrait();

    var spin1 = ease(frame, 30, 270, eio3) * 360;
    var spin2 = ease(frame, 40, 280, eio3) * -360;
    var breathe = 1 + 0.04 * Math.sin(frame * 0.08);

    // The glass card wears a saturated violet→cyan gradient on dark themes;
    // on light ones it turns into a white glass card with a violet rim so the
    // 3D edges stay readable against a white background and the dark-ink logo
    // keeps full contrast.
    var light = yoclipIsLight();
    var cardGradient = light ? [yoclipColor('paper', '#f8f6ff'), yoclipColor('paperAlt', '#e9f7fb')] : [yoclipColorA('primary', 0xcc), yoclipColorA('cyan', 0x99)];
    var cardBorder = light ? yoclipColorA('primary', 0x4d) : yoclipColorA('white', 0x66);
    var cardShadow = light
      ? { color: yoclipColorA('primary', 0x40), blur: 50, offsetY: 20 }
      : { color: yoclipTheme.colors.primaryLight, blur: 60, offsetY: 24 };

    function glassCard(rotY, rotX, scale, w, h, y) {
      return {
        type: 'container',
        width: w,
        height: h,
        borderRadius: 36,
        gradient: {
          colors: cardGradient,
          begin: 'topLeft',
          end: 'bottomRight',
        },
        borderColor: cardBorder,
        borderWidth: 1.5,
        shadow: cardShadow,
        rotateY: rotY,
        rotateX: rotX,
        scale: scale,
        alignment: 'center',
        offsetY: y,
        child: {
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: w * 0.6,
          height: h * 0.6,
          alignment: 'center',
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
          text: T.title || 'Motion that feels alive',
          style: {
            fontSize: portrait ? 56 : yoclipSize('h5', 72),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: (portrait ? 280 : 96) + riseIn(frame, 28, -24),
          opacity: titleIn,
        },
        {
          type: 'text',
          text: 'rotateX · rotateY · perspective',
          style: {
            fontSize: yoclipSize('captionLg', 30),
            color: yoclipTheme.colors.textMuted,
            fontFamily: yoclipFont(),
            letterSpacing: 2,
          },
          alignment: 'bottomCenter',
          offsetY: portrait ? -300 : -120,
          opacity: titleIn,
        },
        glassCard(spin2, 12, 0.62 * breathe, 460, 300, portrait ? -220 : 40),
        glassCard(spin1, 0, breathe, 560, 360, portrait ? 120 : -10),
      ],
    };
  },
};
