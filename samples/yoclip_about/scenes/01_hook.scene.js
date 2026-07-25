// Promo scene 1 — the hook. Kinetic typewriter headline.

scene = {
  id: 'hook',
  duration: 270,
  from: 0,
  // Scene plan + voiceover prompts (metadata only — not rendered, not
  // played; drives the goal → scenario → scenes plan and future TTS).
  description: 'Kinetic typewriter headline: "What if your timeline was code?" types in with a blinking caret, then the sub line rises in.',
  voicePrompts: {
    en: 'What if your timeline was code?',
    ru: 'Что если ваш таймлайн — это код?',
  },
  timeline: {
    label: yoclipT('hook').timeline || 'Hook',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('hook');
    var life = presence(frame, 14, 224, 18);
    // Portrait variants (e.g. shorts 1080x1920) shrink the headline so it
    // clears the narrower frame and use the extra vertical room to spread
    // the kicker and sub line away from the headline.
    var portrait = yoclipIsPortrait();

    var labelIn = ease(frame, 0, 24, eo3);

    var line1 = T.line1 || 'What if your timeline';
    var line2 = T.line2 || 'was code?';
    var t1 = typewriter(line1, frame, 26, 46);
    var line1Done = t1.length >= line1.length;
    var t2 = line1Done ? typewriter(line2, frame, 26 + 24, 52) : '';
    var caretOn = blink(frame, 12) === 1;
    var caretLine1 = !line1Done && frame >= 26;

    var subIn = ease(frame, 150, 176, eo3);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          children: [
            {
              type: 'text',
              text: T.kicker || 'T H E   I D E A',
              style: {
                fontSize: yoclipSize('label', 26),
                color: yoclipTheme.colors.primaryLight,
                fontFamily: yoclipFont(),
                fontWeight: 600,
                letterSpacing: 8,
              },
              opacity: labelIn,
              offsetY: (portrait ? -170 : -70) + riseIn(frame, 24, -18),
            },
            {
              type: 'row',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'end',
              children: [
                {
                  type: 'text',
                  text: t1,
                  style: {
                    fontSize: portrait ? 64 : yoclipSize('h2', 84),
                    color: yoclipTheme.colors.text,
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                },
                {
                  type: 'container',
                  width: 4,
                  height: portrait ? 48 : 64,
                  color: yoclipTheme.colors.primaryLight,
                  opacity: caretLine1 && caretOn ? 1 : 0,
                  offsetX: 10,
                  offsetY: portrait ? -14 : -20,
                },
              ],
            },
            {
              type: 'row',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'end',
              offsetY: 12,
              children: [
                {
                  type: 'text',
                  text: t2,
                  style: {
                    fontSize: portrait ? 64 : yoclipSize('h2', 84),
                    color: yoclipTheme.colors.primaryLight,
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                    shadows: [{ color: yoclipColorA('primary', 0x80), blur: 28 }],
                  },
                },
                {
                  type: 'container',
                  width: 4,
                  height: portrait ? 48 : 64,
                  color: yoclipTheme.colors.primaryLight,
                  opacity: line1Done && caretOn ? 1 : 0,
                  offsetX: 10,
                  offsetY: portrait ? -14 : -20,
                },
              ],
            },
            {
              type: 'text',
              text: T.sub || 'yoclip turns scripts into pixels.',
              style: {
                fontSize: yoclipSize('body', 36),
                color: yoclipTheme.colors.textMuted,
                fontFamily: yoclipFont(),
              },
              offsetY: portrait ? 190 : 70,
              opacity: subIn,
            },
          ],
        },
      ],
    };
  },
};
