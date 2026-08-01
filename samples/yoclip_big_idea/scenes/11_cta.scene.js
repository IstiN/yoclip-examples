// 11 — CTA: the end card.
//
// Reference beat (Gamma 78–83s): calm and premium after the flythrough. A
// brand flash settles; the tagline rises in with an overshoot; the logo
// pops above it under a breathing radial primary glow; the URL fades in
// over a hairline accent rule; finally the mic-drop meta line fades in at
// the very bottom: this video was rendered by yoclip. Everything HOLDS to
// the end — no fade-out.
//
// Renderer notes: container styling must be direct props; the hairline rule
// is a thin container whose width eases 0 -> 240.

scene = {
  id: 'cta',
  duration: 300,
  description: 'End card in four beats: brand flash settles, tagline "Describe it. Render it." rises with eoBack, the yoclip logo pops above under a breathing radial glow, the URL fades in over a hairline accent rule (width 0→240), and the meta line "Rendered by yoclip." fades in at the bottom. Holds to the end.',
  voicePrompts: {
    en: 'The music resolves. Quiet confidence: describe it, render it.',
    ru: 'Музыка разрешается. Спокойная уверенность: опиши — отрендерь.',
  },
  timeline: {
    label: yoclipT('cta').timeline || 'CTA',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('cta');
    var tagline = t.tagline || 'Describe it. Render it.';
    var url = t.url || 'yoclip.dev';
    var meta = t.meta || 'Rendered by yoclip.';
    var portrait = yoclipIsPortrait();

    // Fade in only — the end card holds to the last frame.
    var life = fadeIn(frame, 20);

    var font = yoclipFont();
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    // -- Beat 0 (0–10): brand flash from the flythrough settles fast — a
    // clean radial violet flash, no muddy mid-state.
    var flashOp = 1 - seg(frame, 0, 10);

    // -- Beat 1 (10–60): tagline rises with an overshoot.
    var tagPop = pop(frame, 10, 34);
    var tagY = (1 - eo3(seg(frame, 10, 44))) * 70;

    // -- Beat 2 (64–140): logo pops above, glow breathes.
    var logoPop = pop(frame, 64, 30);
    var glowOp = logoPop.opacity * (0.55 + 0.3 * shimmer(frame, 90));

    // -- Beat 3 (146–220): URL + hairline rule.
    var urlIn = ease(frame, 146, 172, eo3);
    var ruleW = lerp(0, 240, ease(frame, 168, 196, eo3));

    // -- Beat 4 (222–300): the mic-drop meta line, full textMuted strength.
    var metaIn = ease(frame, 222, 238, eo3);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Breathing radial glow behind the logo.
        {
          type: 'container',
          alignment: 'center',
          offsetY: portrait ? -480 : -250,
          width: 820,
          height: 820,
          opacity: glowOp,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.5,
            colors: [yoclipColorA('primary', 0x3d, '#7c3aed'), yoclipColorA('primary', 0x00, '#7c3aed')],
          },
        },
        // Logo pops above the tagline. Size (not node `scale`) animates, so
        // it grows in place at its final spot and never drifts through the
        // headline.
        {
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: (portrait ? 680 : 520) * Math.max(0.05, logoPop.scale),
          height: (portrait ? 431 : 330) * Math.max(0.05, logoPop.scale),
          alignment: 'center',
          offsetY: portrait ? -480 : -250,
          opacity: logoPop.opacity,
        },
        // Tagline.
        {
          type: 'text',
          alignment: 'center',
          offsetY: (portrait ? -60 : -10) + tagY,
          text: tagline,
          scale: Math.max(0.05, tagPop.scale),
          opacity: tagPop.opacity,
          style: {
            fontSize: portrait ? 62 : 110,
            color: txt,
            fontFamily: font,
            fontWeight: 700,
            shadows: [{ color: yoclipColorA('primary', 0x66, '#7c3aed'), blur: 28, offsetX: 0, offsetY: 0 }],
          },
        },
        // Hairline accent rule.
        {
          type: 'container',
          alignment: 'center',
          offsetY: portrait ? 100 : 118,
          width: ruleW,
          height: 3,
          color: accent,
          opacity: urlIn,
        },
        // URL.
        {
          type: 'text',
          alignment: 'center',
          offsetY: portrait ? 160 : 166,
          text: url,
          opacity: urlIn,
          style: {
            fontSize: portrait ? 30 : 34,
            color: accent,
            fontFamily: font,
            fontWeight: 600,
            letterSpacing: 10,
          },
        },
        // Mic drop: rendered by yoclip.
        {
          type: 'text',
          alignment: 'bottomCenter',
          offsetY: portrait ? -48 : -64,
          text: meta,
          opacity: metaIn,
          style: {
            fontSize: portrait ? 22 : 24,
            color: muted,
            fontFamily: font,
            letterSpacing: 6,
          },
        },
        // Settling brand flash (topmost): radial violet -> transparent.
        {
          type: 'container',
          opacity: flashOp,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.9,
            colors: [primaryLight, yoclipColorA('primaryLight', 0x00, '#a78bfa')],
          },
        },
      ],
    };
  },
};
