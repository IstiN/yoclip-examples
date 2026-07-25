// Promo scene 0 — cold open.
//
// A thin ring draws itself, the YoClip mark snaps in with a glow, and the
// tagline types out underneath. Sets the tone: precise, crafted, code-made.

scene = {
  id: 'intro',
  duration: 300,
  from: 0,
  // Scene plan + voiceover prompts (metadata only — not rendered, not
  // played; drives the goal → scenario → scenes plan and future TTS).
  description: 'A thin ring draws itself, the YoClip mark snaps in with a glow, and the tagline types out underneath. Cold open — precise, crafted, code-made.',
  voicePrompts: {
    en: 'your video, scene by scene',
    ru: 'ваше видео, сцена за сценой',
  },
  timeline: {
    label: yoclipT('intro').timeline || 'Intro',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('intro');
    var life = presence(frame, 12, 256, 20);
    // Portrait variants (e.g. shorts 1080x1920) get a re-composed layout:
    // bigger ring/logo using the vertical space, tagline higher up.
    var portrait = yoclipIsPortrait();

    // Ring draw 0..90, then it dissolves as the logo arrives.
    var ringP = ease(frame, 0, 90, eio3);
    var ringOpacity = (1 - seg(frame, 70, 120)) * 0.9;

    // Logo snap 70..170 with a soft glow pulse.
    var logoIn = ease(frame, 70, 170, eoBack);
    var logoScale = 0.82 + 0.18 * logoIn;
    var logoOpacity = eo3(seg(frame, 70, 150));
    var glow = 18 + 26 * shimmer(frame, 90);

    // Tagline typewriter starting at 190.
    var tag = T.tagline || 'your video, scene by scene';
    var typed = typewriter(tag, frame, 190, 34);
    var caret = frame < 286 && blink(frame, 12) === 1;

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'path',
          path: 'M 260 30 A 230 230 0 1 1 259.9 30',
          progress: ringP,
          color: yoclipTheme.colors.primaryLight,
          strokeWidth: 3,
          width: portrait ? 680 : 520,
          height: portrait ? 680 : 520,
          alignment: 'center',
          offsetY: portrait ? -260 : 0,
          opacity: ringOpacity,
        },
        {
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: portrait ? 760 : 640,
          height: portrait ? 482 : 406,
          alignment: 'center',
          offsetY: portrait ? -260 : -70,
          scale: logoScale,
          opacity: logoOpacity,
        },
        {
          type: 'container',
          alignment: 'bottomCenter',
          offsetY: portrait ? -420 : -156,
          opacity: seg(frame, 188, 210),
          child: {
            type: 'row',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'text',
                text: typed,
                style: {
                  fontSize: portrait ? 40 : yoclipSize('bodyXl', 44),
                  color: yoclipTheme.colors.text,
                  fontFamily: yoclipFont(),
                  letterSpacing: 1,
                },
              },
              {
                type: 'container',
                width: 3,
                height: 40,
                color: yoclipTheme.colors.primaryLight,
                opacity: caret ? 1 : 0,
                offsetX: 8,
              },
            ],
          },
        },
      ],
    };
  },
};
