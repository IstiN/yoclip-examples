// 05 — QUOTE: analyst recognition card with a blur-glow corner.
scene = {
  id: 'quote',
  duration: 170,
  description:
    "A dark recognition card floats in, sea blur glow bleeding from its " +
    "top-right corner (brandbook p57 application). Giant gradient quote " +
    "mark, the analyst quote in airy 300 italic, attribution in tracked " +
    "900 caps below.",
  voicePrompts: {
    en: 'Analysts recognize EPAM for best-in-class platform engineering and ' +
        'above-par AI and data governance.',
  },
  timeline: { label: 'Proof', color: '#00F6FF', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 12, 140, 18);
    var cardIn = enter(frame, 6, 30, 50);

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        // Glow bleeding from the card's top-right corner.
        blurGlow([c('sea'), c('sky')], 700, 560, {
          alignment: 'center', offsetX: 480, offsetY: -220,
          opacity: 0.3 * cardIn.opacity, blur: 140,
        }),

        {
          type: 'container',
          width: 1240,
          height: 560,
          borderRadius: 24,
          color: c('surface'),
          borderColor: c('hairline'),
          borderWidth: 1.5,
          alignment: 'center',
          opacity: cardIn.opacity,
          offsetY: cardIn.offsetY,
          child: {
            type: 'column',
            alignment: 'topLeft',
            margin: { top: 90, left: 72 },
            crossAxisAlignment: 'start',
            children: [
              withEnter(
                {
                  type: 'text',
                  text: '\u201CEPAM demonstrates best-in-class platform\nengineering capabilities and above-par\nAI and data governance.\u201D',
                  alignment: 'topLeft',
                  textAlign: 'left',
                  style: {
                    fontFamily: 'Museo Sans 300',
                    fontSize: 44,
                    color: c('snow'),
                    lineHeight: 1.35,
                  },
                },
                enter(frame, 24, 26, 36)
              ),
              { type: 'container', height: 40, alignment: 'topLeft' },
              withEnter(preheader('— INDUSTRY ANALYST · 2025', c('muted'), 24), enter(frame, 48, 22, 24)),
            ],
          },
        },
      ],
    };
  },
};
