// Promo scene 2 — "compose in scenes".
//
// Five cards pop in one after another, each a tiny live preview of a building
// block: text, paths, 3D, images, code. Communicates the core metaphor fast.

scene = {
  id: 'scenes',
  duration: 330,
  from: 0,
  timeline: {
    label: yoclipT('scenes').timeline || 'Scenes',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('scenes');
    var life = presence(frame, 16, 282, 18);
    // Portrait variants re-compose: the five cards form a vertical column
    // instead of a row, with slightly smaller cards to fit 1080px wide.
    var portrait = yoclipIsPortrait();

    var titleIn = ease(frame, 0, 28, eo3);

    function card(index, label, accent, preview) {
      var p = pop(frame, 30 + index * 14, 28);
      return {
        type: 'container',
        width: portrait ? 340 : 292,
        height: portrait ? 300 : 360,
        borderRadius: 28,
        gradient: {
          colors: [yoclipTheme.colors.surface, yoclipTheme.colors.surface],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        borderColor: accent,
        borderWidth: 1.5,
        shadow: { color: accent, blur: 34, offsetY: 18 },
        clip: true,
        scale: p.scale,
        opacity: p.opacity,
        child: {
          type: 'stack',
          fit: 'expand',
          children: [
            {
              type: 'container',
              height: 8,
              color: accent,
              alignment: 'topCenter',
            },
            {
              type: 'container',
              alignment: 'center',
              offsetY: -24,
              child: preview,
            },
            {
              type: 'text',
              text: label,
              style: {
                fontSize: yoclipSize('captionLg', 30),
                color: yoclipTheme.colors.text,
                fontFamily: yoclipFont(),
                fontWeight: 600,
              },
              alignment: 'bottomCenter',
              offsetY: -44,
            },
          ],
        },
      };
    }

    var cards = [
      card(0, T.cardText || 'Text', yoclipTheme.colors.primaryLight, {
        type: 'text',
        text: 'Aa',
        style: {
          fontSize: yoclipSize('title', 120),
          color: yoclipTheme.colors.text,
          fontFamily: yoclipFont(),
          fontWeight: 700,
          shadows: [{ color: yoclipTheme.colors.primaryLight, blur: 30 }],
        },
      }),
      card(1, T.cardPaths || 'Paths', yoclipTheme.colors.accent, {
        type: 'path',
        path: 'M 30 150 C 90 20 170 280 250 120',
        progress: ease(frame, 60, 160, eio3),
        color: yoclipTheme.colors.accent,
        strokeWidth: 14,
        width: portrait ? 260 : 280,
        height: portrait ? 260 : 280,
      }),
      card(2, T.card3d || '3D', yoclipTheme.colors.primaryLight, {
        type: 'container',
        width: 150,
        height: 150,
        borderRadius: 24,
        gradient: {
          colors: [yoclipTheme.colors.primary, yoclipTheme.colors.accent],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        rotateY: spin(frame, 1.2),
      }),
      card(3, T.cardImages || 'Images', yoclipTheme.colors.primary, {
        type: 'image',
        source: yoclipLogoSource(),
        fit: 'contain',
        width: 200,
        height: 128,
      }),
      card(4, T.cardCode || 'Code', yoclipTheme.colors.accent, {
        type: 'text',
        text: '{ }',
        style: {
          fontSize: yoclipSize('h1', 96),
          color: yoclipTheme.colors.accent,
          fontFamily: yoclipFont(),
          fontWeight: 700,
        },
      }),
    ];

    // Portrait: five cards stacked vertically with spacers between them;
    // landscape keeps the original centered row.
    var spacer = { type: 'container', height: 24 };
    var cardGroup = portrait
      ? {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 100,
          children: [
            cards[0], spacer, cards[1], spacer, cards[2],
            spacer, cards[3], spacer, cards[4],
          ],
        }
      : {
          type: 'row',
          mainAxisAlignment: 'spaceEvenly',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 90,
          children: cards,
        };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'text',
          text: T.title || 'Compose in scenes',
          style: {
            fontSize: portrait ? 52 : yoclipSize('h3', 78),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: (portrait ? 50 : 96) + riseIn(frame, 28, -24),
          opacity: titleIn,
        },
        {
          type: 'text',
          text: T.sub || 'each scene is a tiny program',
          style: {
            fontSize: yoclipSize('captionXl', 32),
            color: yoclipTheme.colors.textMuted,
            fontFamily: yoclipFont(),
          },
          alignment: 'topCenter',
          offsetY: portrait ? 130 : 190,
          opacity: titleIn,
        },
        cardGroup,
      ],
    };
  },
};
