// Promo scene 3 — the hero: "your timeline is code".
//
// Left: a code editor where a scene module types itself in, line by line, with
// light syntax coloring. Right: a live preview panel that lights up as the code
// completes. A pulsing connector sells the cause-and-effect.

scene = {
  id: 'code',
  duration: 360,
  from: 0,
  timeline: {
    label: yoclipT('code').timeline || 'Code',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('code');
    // Portrait variants (shorts 1080x1920) re-compose: the editor and
    // preview cards stack vertically instead of side by side.
    var portrait = yoclipIsPortrait();
    var life = presence(frame, 16, 312, 18);
    var titleIn = ease(frame, 0, 28, eo3);
    // Soft entrance for the window panels so they don't just pop in.
    var cardIn = ease(frame, 8, 44, eo3);
    var cardRise = (1 - cardIn) * 28;

    // Editor palette follows the theme: a dark IDE card on dark backgrounds,
    // a white card with darker syntax inks on light ones. Dark values match
    // the original hardcoded look pixel-for-pixel.
    var light = yoclipIsLight();
    var K = light
      ? { comment: yoclipColor('lineSoft', '#8b879e'), text: yoclipColor('panelDeep', '#1c1a2b'), kw: yoclipColor('violetMid', '#6d28d9'), type: yoclipColor('accentDeep', '#0891b2'), str: yoclipColor('goodDeep', '#15803d'),
          bg: yoclipColor('white', '#ffffff'), border: yoclipColor('paperLine', '#d9d5ea'), shadow: yoclipColorA('ink', 0x33) }
      : { comment: yoclipColor('line', '#6b6b76'), text: yoclipColor('white', '#ffffff'), kw: yoclipColor('lavender', '#a78bfa'), type: yoclipColor('cyan', '#22d3ee'), str: yoclipColor('good', '#7ee787'),
          bg: yoclipColor('codeBg', '#0c0c12'), border: yoclipColor('panel', '#2a2a36'), shadow: yoclipColorA('ink', 0x80) };

    // Indent is a structural level, not leading spaces — Geneva is not
    // monospaced, so space-based indents made the brackets drift. Rendering
    // indent via offsetX keeps every brace / bracket aligned.
    var codeLines = [
      { t: '// scene.render(frame)', c: K.comment, indent: 0 },
      { t: 'return {', c: K.text, indent: 0 },
      { t: "type: 'stack',", c: K.kw, indent: 1 },
      { t: 'children: [', c: K.text, indent: 1 },
      { t: '{', c: K.text, indent: 2 },
      { t: "type: 'image',", c: K.type, indent: 3 },
      { t: 'source: logo', c: K.str, indent: 3 },
      { t: '},', c: K.text, indent: 2 },
      { t: '{', c: K.text, indent: 2 },
      { t: "type: 'text',", c: K.type, indent: 3 },
      { t: "text: 'Hello'", c: K.str, indent: 3 },
      { t: '}', c: K.text, indent: 2 },
      { t: ']', c: K.text, indent: 1 },
      { t: '};', c: K.text, indent: 0 },
    ];

    function dot(color) {
      return {
        type: 'container',
        width: 18,
        height: 18,
        borderRadius: 9,
        color: color,
      };
    }

    var codeChildren = [];
    for (var i = 0; i < codeLines.length; i++) {
      var p = staggerItem(frame, i, 12, 7, 10);
      codeChildren.push({
        type: 'text',
        text: codeLines[i].t,
        style: {
          fontSize: yoclipSize('label', 26),
          color: codeLines[i].c,
          fontFamily: yoclipFont(),
          lineHeight: 1.32,
        },
        textAlign: 'left',
        opacity: eo3(p),
        offsetX: codeLines[i].indent * 28 + (1 - eo3(p)) * -24,
      });
    }

    var codeDone = seg(frame, 12 + codeLines.length * 7, 12 + codeLines.length * 7 + 16);
    var connector = 0.4 + 0.6 * shimmer(frame, 40);

    var previewOn = ease(frame, 120, 158, eo3);
    var logoPop = pop(frame, 135, 26);
    var helloIn = ease(frame, 158, 188, eo3);
    var scrub = seg(frame, 135, 360);

    // A small stroked play triangle (Geneva-independent).
    function playTriangle(color, size) {
      return {
        type: 'path',
        path: 'M 10 6 L 10 34 L 34 20 Z',
        color: color,
        strokeWidth: 4,
        width: size,
        height: size,
      };
    }

    var editorHeader = {
      type: 'container',
      height: 88,
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 40 },
          dot(yoclipColor('macRed', '#ff5f57')),
          { type: 'container', width: 12 },
          dot(yoclipColor('macYellow', '#febc2e')),
          { type: 'container', width: 12 },
          dot(yoclipColor('macGreen', '#28c840')),
          {
            type: 'text',
            text: 'scene.js',
            style: { fontSize: yoclipSize('labelSm', 24), color: yoclipTheme.colors.textMuted, fontFamily: yoclipFont() },
            offsetX: 22,
          },
        ],
      },
    };

    var previewHeader = {
      type: 'container',
      height: 88,
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 40 },
          {
            type: 'container',
            width: 16,
            height: 16,
            borderRadius: 8,
            color: yoclipColor('bad', '#ff3b5c'),
            opacity: 0.5 + 0.5 * shimmer(frame, 30),
          },
          {
            type: 'text',
            text: T.preview || 'Preview',
            style: {
              fontSize: yoclipSize('labelSm', 24),
              color: yoclipTheme.colors.textMuted,
              fontFamily: yoclipFont(),
              fontWeight: 600,
            },
            offsetX: 22,
          },
        ],
      },
    };

    var editorBody = {
      type: 'container',
      offsetX: 44,
      offsetY: 20,
      child: {
        type: 'column',
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'start',
        children: codeChildren,
      },
    };

    var previewBody = {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: 300,
          height: 190,
          alignment: 'center',
          offsetY: -70,
          scale: logoPop.scale,
          opacity: logoPop.opacity * previewOn,
        },
        {
          type: 'text',
          text: 'Hello',
          style: {
            fontSize: yoclipSize('xl', 64),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
            shadows: [{ color: yoclipTheme.colors.primaryLight, blur: 26 }],
          },
          alignment: 'center',
          offsetY: 90 + (1 - helloIn) * 20,
          opacity: helloIn * previewOn,
        },
        {
          type: 'container',
          width: 560,
          height: 8,
          borderRadius: 4,
          color: yoclipTheme.colors.surface,
          alignment: 'bottomCenter',
          offsetY: -48,
          child: {
            type: 'container',
            width: 560 * scrub,
            height: 8,
            borderRadius: 4,
            gradient: {
              colors: [yoclipTheme.colors.primary, yoclipTheme.colors.accent],
              begin: 'centerLeft',
              end: 'centerRight',
            },
            alignment: 'centerLeft',
          },
        },
      ],
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'text',
          text: T.title || 'Your timeline is code',
          style: {
            fontSize: portrait ? 50 : yoclipSize('h5', 72),
            color: yoclipTheme.colors.text,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
          alignment: 'topCenter',
          offsetY: 72 + riseIn(frame, 28, -24),
          opacity: titleIn,
        },
        {
          type: 'container',
          offsetY: portrait ? 60 : 168,
          child: {
            type: portrait ? 'column' : 'row',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: [
            // Code editor card.
            {
              type: 'container',
              width: 880,
              height: 740,
              borderRadius: 26,
              color: K.bg,
              borderColor: K.border,
              borderWidth: 1.5,
              shadow: { color: K.shadow, blur: 50, offsetY: 26 },
              clip: true,
              opacity: cardIn,
              offsetY: cardRise,
              child: {
                type: 'column',
                crossAxisAlignment: 'stretch',
                children: [
                  editorHeader,
                  { type: 'container', height: 648, child: editorBody },
                ],
              },
            },
            // Connector.
            { type: 'container', width: portrait ? 0 : 24, height: portrait ? 24 : 0 },
            {
              type: 'container',
              opacity: connector * codeDone,
              rotation: portrait ? 90 : 0,
              child: playTriangle(yoclipTheme.colors.primaryLight, 56),
            },
            { type: 'container', width: portrait ? 0 : 24, height: portrait ? 24 : 0 },
            // Preview card.
            {
              type: 'container',
              width: portrait ? 880 : 720,
              height: 740,
              borderRadius: 26,
              color: yoclipTheme.colors.surface,
              borderColor: K.border,
              borderWidth: 1.5,
              shadow: { color: yoclipColorA('primary', 0x80), blur: 46, offsetY: 26 },
              clip: true,
              opacity: cardIn,
              offsetY: cardRise,
              child: {
                type: 'column',
                crossAxisAlignment: 'stretch',
                children: [
                  previewHeader,
                  { type: 'container', height: 648, child: previewBody },
                ],
              },
            },
          ],
          },
        },
      ],
    };
  },
};
