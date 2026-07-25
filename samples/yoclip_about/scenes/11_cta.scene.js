// Promo scene 10 — the finale / call to action.
//
// Big logo, glowing wordmark, a breathing Download button and the URL. Holds to
// the very end so the video lands on the brand and an action.

scene = {
  id: 'cta',
  duration: 480,
  from: 0,
  // Scene plan + voiceover prompts (metadata only — not rendered, not
  // played; drives the goal → scenario → scenes plan and future TTS).
  description: 'Finale: big logo and glowing wordmark, a breathing Download button and the URL. Holds to the very end so the video lands on the brand.',
  voicePrompts: {
    en: 'YoClip — your video, scene by scene. Download it today.',
    ru: 'YoClip — ваше видео, сцена за сценой. Скачайте сегодня.',
  },
  timeline: {
    label: yoclipT('cta').timeline || 'CTA',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('cta');
    var life = fadeIn(frame, 20);
    // Portrait variants re-compose: logo uses the upper third, sparkles stay
    // inside the narrower frame, button/URL ride the lower third.
    var portrait = yoclipIsPortrait();

    var logoPop = pop(frame, 10, 34);
    var glow = 24 + 30 * shimmer(frame, 80);
    var wordIn = ease(frame, 60, 110, eo3);
    var subIn = ease(frame, 120, 160, eo3);
    var btnIn = pop(frame, 150, 30);
    var breathe = 1 + 0.03 * Math.sin(frame * 0.1);
    var urlIn = ease(frame, 200, 240, eo3);

    // A few slow-rising sparkles behind the logo.
    function sparkle(x, y, phase, size) {
      return {
        type: 'container',
        width: size,
        height: size,
        borderRadius: size / 2,
        color: yoclipColor('white', '#ffffff'),
        opacity: 0.25 + 0.35 * shimmer(frame + phase * 60, 70),
        alignment: 'center',
        offsetX: portrait ? x * 0.6 : x,
        offsetY: y + float(frame, 40, 0.03, phase),
      };
    }

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        sparkle(-520, -180, 0.0, 8),
        sparkle(560, -120, 1.3, 6),
        sparkle(-440, 220, 2.1, 5),
        sparkle(600, 240, 0.7, 7),
        sparkle(120, -320, 1.9, 5),
        {
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: portrait ? 760 : 640,
          height: portrait ? 482 : 406,
          alignment: 'center',
          offsetY: portrait ? -420 : -90,
          scale: logoPop.scale,
          opacity: logoPop.opacity,
        },
        {
          type: 'text',
          text: T.tagline || 'video, scene by scene',
          style: {
            fontSize: yoclipSize('bodyLg', 38),
            color: yoclipTheme.colors.textMuted,
            fontFamily: yoclipFont(),
          },
          alignment: 'center',
          offsetY: portrait ? -60 : 180,
          opacity: subIn,
        },
        {
          type: 'container',
          width: 520,
          borderRadius: 40,
          gradient: {
            colors: [yoclipTheme.colors.primaryLight, yoclipTheme.colors.primary, yoclipColor('violetDeep', '#5b21b6')],
            begin: 'topLeft',
            end: 'bottomRight',
          },
          shadow: { color: yoclipColorA('primary', 0xb3), blur: 44 + 20 * shimmer(frame, 60) },
          alignment: 'center',
          offsetY: portrait ? 220 : 310,
          scale: (0.92 + 0.08 * btnIn.scale) * breathe,
          opacity: btnIn.opacity,
          child: {
            type: 'row',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'path',
                path: 'M 8 10 L 18 20 L 28 10',
                color: yoclipColor('white', '#ffffff'),
                strokeWidth: 4,
                width: 36,
                height: 28,
              },
              {
                type: 'text',
                text: T.download || 'Download YoClip',
                style: {
                  fontSize: yoclipSize('bodySm', 34),
                  color: yoclipColor('white', '#ffffff'),
                  fontFamily: yoclipFont(),
                  fontWeight: 700,
                },
                offsetX: 18,
              },
            ],
            padding: 26,
          },
        },
        {
          type: 'text',
          text: 'y o c l i p . s t u d i o',
          style: {
            fontSize: yoclipSize('label', 26),
            color: yoclipTheme.colors.primaryLight,
            fontFamily: yoclipFont(),
            fontWeight: 600,
            letterSpacing: 6,
          },
          alignment: 'center',
          offsetY: portrait ? 360 : 420,
          opacity: urlIn,
        },
      ],
    };
  },
};
