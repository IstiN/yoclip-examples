// 08 — Pipeline: one yaml -> every screen.
//
// A dark UI beat: a yoclip.yaml card on the left, an arrow, then three
// format frames (16:9 / 9:16 / 1:1) popping in with live goldens inside,
// and an export chip landing last. Transparent background — the shared
// animated background layer shows through, like the other dark scenes.

scene = {
  id: 'pipeline',
  duration: 180,
  description: 'One yaml to every screen: dark surface card with yoclip.yaml lines on the left, arrow, three format frames (16:9, 9:16, 1:1) popping in with golden previews, export chip lands at the end.',
  voicePrompts: {
    en: 'A quick, satisfying assembly rhythm — three pops for the three formats, a final click on export.',
    ru: 'Быстрый собирающий ритм — три попа для трёх форматов, финальный клик на экспорте.',
  },
  timeline: {
    label: yoclipT('pipeline').timeline || 'Flow',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('pipeline');
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var primary = yoclipColor('primary', '#7c3aed');
    var accent = yoclipColor('accent', '#22d3ee');
    var surface = yoclipColor('surface', '#15131f');
    var textC = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var life = presence(frame, 4, 160, 16);

    var formats = t.formats || ['16:9', '9:16', '1:1'];
    var children = [];

    // Own backdrop from frame 0: a deep-violet wash so the polish cross-fade
    // lands on a designed surface instead of the near-black shared background
    // (the 1:22-1:24 "hole"). Transparent-center radial keeps the animated
    // background blobs glowing through at the edges.
    children.push({
      type: 'container',
      opacity: eo3(seg(frame, 0, 10)),
      gradient: {
        type: 'radial',
        colors: ['#00201a30', '#c0201a30'],
        stops: [0.55, 1],
      },
    });

    // -- Tag chip, top center. The '→' in the dictionary text is drawn as a
    // path (Geneva has no such glyph — a raw '\u2192' shows as a tofu box).
    var tagStyle = {
      fontSize: 16,
      color: muted,
      fontFamily: font,
      fontWeight: 600,
      letterSpacing: 4,
    };
    children.push({
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? -700 : -420,
      width: 460,
      height: 46,
      borderRadius: 999,
      color: surface,
      opacity: eo3(seg(frame, 0, 12)),
      child: {
        type: 'container',
        width: 460,
        height: 46,
        alignment: 'center',
        child: {
        type: 'row',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [{ type: 'container', width: 20 }].concat(
          splitOnGlyph(
            t.tag || 'one yaml \u2192 every screen',
            '\u2192',
            tagStyle,
            arrowNode({ size: 18, color: muted, margin: { left: 10, right: 10 } }),
          ),
          [{ type: 'container', width: 20 }],
        ),
        },
      },
    });

    // -- One composed flow: yaml card -> render connector -> format cards.
    // Everything lives in ONE centered flex row (no hand-tuned absolute
    // offsets), so spacing stays even and cards align on a shared axis.
    var cardIn = eio3(seg(frame, 0, 16));
    var yamlLines = [
      { t: 'project: big_idea', c: textC },
      { t: 'fps: 30', c: muted },
      { t: 'duration: 2580', c: muted },
      { t: '', c: muted },
      { t: 'scenes:', c: textC },
      { t: '  - 00_intro', c: accent },
      { t: '  - 01_portal', c: accent },
      { t: '', c: muted },
      { t: 'export: mp4', c: primary },
    ];
    var yamlBody = [];
    for (var li = 0; li < yamlLines.length; li++) {
      if (yamlLines[li].t === '') {
        yamlBody.push({ type: 'container', height: 12 });
      } else {
        yamlBody.push({
          type: 'text',
          text: yamlLines[li].t,
          textAlign: 'left',
          style: { fontSize: 20, color: yamlLines[li].c, fontFamily: font, lineHeight: 1.55 },
        });
      }
    }
    function chromeDot(color) {
      return { type: 'container', width: 13, height: 13, borderRadius: 7, color: color, margin: { left: 10 } };
    }
    var k = portrait ? 0.6 : 1.0;
    var yamlCard = {
      type: 'container',
      alignment: 'center',
      offsetX: -560,
      width: 460,
      height: 372,
      opacity: cardIn,
      scale: k,
      offsetY: (1 - cardIn) * 30,
      color: surface,
      borderRadius: 22,
      stroke: yoclipColorA('text', 40),
      strokeWidth: 1.5,
      shadow: { color: '#59000000', blur: 30, offsetX: 0, offsetY: 14 },
      clip: true,
      child: {
        // Sized topLeft wrapper: keeps the chrome at the top of the window.
        type: 'container',
        width: 460,
        height: 372,
        alignment: 'topLeft',
        child: {
          type: 'column',
          crossAxisAlignment: 'start',
          children: [
            {
              type: 'container',
              width: 460,
              height: 60,
              color: '#201c30',
              child: {
                type: 'row',
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 22 },
                  chromeDot('#ff5f57'),
                  chromeDot('#febc2e'),
                  chromeDot('#28c840'),
                  {
                    type: 'text',
                    text: t.chip || 'yoclip.yaml',
                    margin: { left: 20 },
                    style: { fontSize: 22, color: accent, fontFamily: font, fontWeight: 700 },
                  },
                ],
              },
            },
            {
              type: 'container',
              padding: { left: 36, top: 22 },
              child: { type: 'column', crossAxisAlignment: 'start', children: yamlBody },
            },
          ],
        },
      },
    };

    var connectorArrow = arrowNode({ size: 46, color: accent, strokeWidth: 3.5 });
    if (portrait) connectorArrow.rotation = 90;
    var connector = {
      type: 'container',
      alignment: 'center',
      offsetX: -280,
      width: 130,
      scale: k,
      opacity: eo3(seg(frame, 16, 26)),
      child: {
        type: 'column',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [
          connectorArrow,
          { type: 'container', height: 12 },
          {
            type: 'text',
            text: 'render',
            style: { fontSize: 18, color: muted, fontFamily: font, fontWeight: 600, letterSpacing: 3 },
          },
        ],
      },
    };

    // Format cards: a real thumbnail in a rounded frame + a label UNDER it,
    // so labels never depend on the card's aspect ratio.
    var defs = [
      { w: 400, h: 225, src: 'golden_space', x: -30, y: -40 },
      { w: 190, h: 338, src: 'golden_kaleido', x: 300, y: -40 },
      { w: 250, h: 250, src: 'golden_monolith', x: 590, y: -40 },
    ];
    var formatColumns = [];
    for (var i = 0; i < defs.length; i++) {
      var d = defs[i];
      var p = pop(frame, 34 + i * 16, 16);
      formatColumns.push({
        type: 'column',
        alignment: 'center',
        mainAxisSize: 'min',
        offsetX: d.x,
        offsetY: d.y,
        crossAxisAlignment: 'center',
        opacity: p.opacity,
        scale: k * p.scale,
        children: [
          {
            type: 'container',
            width: d.w,
            height: d.h,
            borderRadius: 22,
            clip: true,
            stroke: yoclipColorA('text', 64),
            strokeWidth: 1.5,
            shadow: { color: '#66000000', blur: 26, offsetX: 0, offsetY: 12 },
            child: {
              type: 'image',
              source: 'external:' + d.src,
              fit: 'cover',
              width: d.w,
              height: d.h,
            },
          },
          { type: 'container', height: 16 },
          {
            type: 'text',
            text: formats[i] || '',
            style: { fontSize: 20, color: muted, fontFamily: font, fontWeight: 600, letterSpacing: 3 },
          },
        ],
      });
    }
    children.push(yamlCard);
    children.push(connector);
    for (var fi = 0; fi < formatColumns.length; fi++) children.push(formatColumns[fi]);

    // -- Export chip lands last.
    var ex = pop(frame, 122, 16);
    children.push({
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? 560 : 392,
      width: 284,
      height: 68,
      borderRadius: 999,
      opacity: ex.opacity,
      scale: ex.scale,
      gradient: {
        type: 'linear',
        colors: [primary, accent],
        begin: 'centerLeft',
        end: 'centerRight',
      },
      shadow: { color: yoclipColorA('primary', 110), blur: 30, offsetX: 0, offsetY: 10 },
      child: {
        type: 'row',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        // The '\u25b8' in the dictionary text is drawn as a path (Geneva
        // lacks the glyph and would show a tofu box).
        children: splitOnGlyph(
          t.export || '\u25b8 export.mp4',
          '\u25b8',
          { fontSize: 21, color: textC, fontFamily: font, fontWeight: 700 },
          {
            type: 'path',
            path: 'M 8 4 L 20 12 L 8 20 Z',
            color: textC,
            strokeWidth: 2.5,
            width: 18,
            height: 18,
            margin: { right: 8 },
          },
        ),
      },
    });

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: children,
    };
  },
};
