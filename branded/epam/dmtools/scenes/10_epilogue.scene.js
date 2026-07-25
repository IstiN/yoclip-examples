// 10 — EPILOGUE: centered EPAM wordmark and a typed sign-off line.
scene = {
  id: 'epilogue',
  duration: 210,
  from: 0,
  description:
    "A quiet closing beat: the EPAM wordmark appears large and centered, " +
    'then the phrase \u201cAccelerating AI-Native Transformation for the ' +
    'Enterprise\u201d types out beneath it. Soft blur glows pulse in the ' +
    'background; a thin brand rule draws under the text.',
  timeline: { label: 'Epilogue', color: '#B896FF', lane: 'video' },
  render: function(frame) {
    if (typeof presence === 'undefined' || typeof c === 'undefined') return { type: 'container' };

    var master = presence(frame, 10, 170, 30);
    var glow = eo3(seg(frame, 0, 90));

    // Variant-aware EPAM wordmark.
    var logoSource = (typeof yoclipVariant !== 'undefined' && yoclipVariant && yoclipVariant.logo)
      ? yoclipVariant.logo
      : 'external:epam_logo';

    var logoPop = pop(frame, 16, 34);

    // Typing the two-line sign-off.
    var line1 = 'Accelerating AI-Native Transformation';
    var line2 = 'for the Enterprise';
    var typed1 = typeText(line1, Math.max(0, frame - 70), 1.4);
    var typed2 = typeText(line2, Math.max(0, frame - 116), 1.4);
    var cursor1 = frame >= 70 && typed1.length < line1.length ? blink(frame, 14) : 0;
    var cursor2 = frame >= 116 && typed2.length < line2.length ? blink(frame, 14) : 0;

    function typedLine(text, typed, cursor, delay) {
      var e = enter(frame, delay, 22, 18);
      return {
        type: 'container',
        width: 1920,
        alignment: 'center',
        opacity: e.opacity,
        offsetY: e.offsetY,
        child: {
          type: 'row',
          alignment: 'center',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: typed,
              alignment: 'center',
              textAlign: 'center',
              style: {
                fontFamily: 'Museo Sans 100',
                fontSize: 54,
                color: c('snow'),
                letterSpacing: 0.5,
              },
            },
            {
              type: 'container',
              width: 4,
              height: 54,
              color: c('sea'),
              opacity: cursor,
              alignment: 'center',
              margin: { left: 4 },
            },
          ],
        },
      };
    }

    return {
      type: 'stack',
      fit: 'expand',
      opacity: master,
      children: [
        blurGlow([c('lilac'), c('sky')], 900, 700, {
          alignment: 'topLeft', offsetX: -320, offsetY: -280,
          opacity: 0.18 * glow, blur: 160,
        }),
        blurGlow([c('sea'), c('mint')], 1000, 800, {
          alignment: 'bottomRight', offsetX: 260, offsetY: 260,
          opacity: 0.22 * glow, blur: 150,
        }),

        {
          type: 'container',
          width: 1920,
          height: 1080,
          alignment: 'center',
          child: {
            type: 'column',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'image',
                source: logoSource,
                fit: 'contain',
                width: 640,
                height: 640 / 2.6818,
                alignment: 'center',
                opacity: logoPop.opacity,
                scale: logoPop.scale,
              },
              { type: 'container', height: 48, alignment: 'center' },
              typedLine(line1, typed1, cursor1, 60),
              { type: 'container', height: 14, alignment: 'center' },
              typedLine(line2, typed2, cursor2, 106),
              { type: 'container', height: 36, alignment: 'center' },
              {
                type: 'container',
                width: 1920,
                alignment: 'center',
                child: ruleDraw(frame, 154, 28, 420, c('sea')),
              },
            ],
          },
        },
      ],
    };
  },
};
