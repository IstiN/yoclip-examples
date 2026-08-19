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
      offsetY: -340,
      height: 46,
      borderRadius: 999,
      color: surface,
      opacity: eo3(seg(frame, 0, 12)),
      child: {
        type: 'row',
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
    });

    // -- yoclip.yaml card, left.
    var cardIn = eio3(seg(frame, 0, 16));
    var yamlLines = ['scenes:', '  - 00_intro', '  - 01_portal', 'export: mp4'];
    var yamlChildren = [
      {
        type: 'text',
        text: t.chip || 'yoclip.yaml',
        textAlign: 'left',
        width: 320,
        style: { fontSize: 22, color: accent, fontFamily: font, fontWeight: 700 },
      },
      { type: 'container', height: 14 },
    ];
    for (var li = 0; li < yamlLines.length; li++) {
      yamlChildren.push({
        type: 'text',
        text: yamlLines[li],
        textAlign: 'left',
        width: 320,
        style: { fontSize: 17, color: muted, fontFamily: font, lineHeight: 1.6 },
      });
    }
    children.push({
      type: 'container',
      alignment: 'center',
      offsetX: portrait ? 0 : -540,
      offsetY: (portrait ? -260 : 0) + (1 - cardIn) * 30,
      width: 400,
      height: 300,
      opacity: cardIn,
      color: surface,
      borderRadius: 20,
      stroke: yoclipColorA('text', 26),
      strokeWidth: 1,
      shadow: { color: '#59000000', blur: 26, offsetX: 0, offsetY: 12 },
      child: {
        type: 'column',
        crossAxisAlignment: 'start',
        mainAxisAlignment: 'center',
        children: [
          { type: 'container', height: 0, width: 36 },
          {
            type: 'container',
            margin: { left: 36 },
            child: {
              type: 'column',
              crossAxisAlignment: 'start',
              children: yamlChildren,
            },
          },
        ],
      },
    });

    // -- Arrow between the card and the formats (path — Geneva lacks '->').
    // Wrap props go on the path node itself: a wrapping row would keep
    // MainAxisSize.max and break the center+offset anchoring.
    var bigArrow = arrowNode({ size: 56, color: muted, strokeWidth: 3.5 });
    bigArrow.alignment = 'center';
    bigArrow.offsetX = portrait ? 0 : -305;
    bigArrow.offsetY = portrait ? -70 : 0;
    bigArrow.opacity = eo3(seg(frame, 16, 26));
    children.push(bigArrow);

    // -- Three format frames with live goldens.
    var defs = [
      { w: 330, h: 186, src: 'golden_space', x: portrait ? -160 : -20, y: portrait ? 130 : -20 },
      { w: 186, h: 330, src: 'golden_chat', x: portrait ? 160 : 260, y: portrait ? 130 : -20 },
      { w: 230, h: 230, src: 'golden_kaleido', x: portrait ? 0 : 510, y: portrait ? 430 : -20 },
    ];
    for (var i = 0; i < defs.length; i++) {
      var d = defs[i];
      var p = pop(frame, 34 + i * 16, 16);
      children.push({
        type: 'container',
        alignment: 'center',
        offsetX: d.x,
        offsetY: d.y,
        width: d.w,
        height: d.h,
        opacity: p.opacity,
        scale: p.scale,
        borderRadius: 22,
        clip: true,
        stroke: yoclipColorA('text', 56),
        strokeWidth: 1.5,
        shadow: { color: '#66000000', blur: 24, offsetX: 0, offsetY: 10 },
        child: {
          type: 'image',
          source: 'external:' + d.src,
          fit: 'cover',
          width: d.w,
          height: d.h,
        },
      });
      children.push({
        type: 'text',
        alignment: 'center',
        offsetX: d.x,
        offsetY: d.y + d.h / 2 + 30,
        text: formats[i] || '',
        opacity: eo3(seg(frame, 44 + i * 16, 54 + i * 16)),
        style: { fontSize: 18, color: muted, fontFamily: font, fontWeight: 600, letterSpacing: 2 },
      });
    }

    // -- Export chip lands last.
    var ex = pop(frame, 122, 16);
    children.push({
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? 560 : 336,
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
