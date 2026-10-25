// Promo scene 2 — "compose in scenes".
// A modular bento canvas: five distinct primitives, one coherent scene graph.

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
    var C = yoclipTheme.colors;
    var life = presence(frame, 16, 296, 18);
    var portrait = yoclipIsPortrait();
    var light = yoclipIsLight();
    var titleIn = ease(frame, 0, 28, eo3);

    function alpha(hex, a) {
      var h = hex.replace('#', '');
      if (h.length === 8) h = h.slice(2);
      var s = Math.max(0, Math.min(255, Math.round(a))).toString(16);
      if (s.length < 2) s = '0' + s;
      return '#' + s + h;
    }

    function moduleCard(index, label, accent, w, h, preview) {
      var p = eo3(seg(frame, 24 + index * 11, 58 + index * 11));
      return {
        type: 'container', width: w, height: h,
        borderRadius: 24,
        gradient: {
          colors: [alpha(C.surface, 0xf5), alpha(C.backgroundSoft, 0xed)],
          begin: 'topLeft', end: 'bottomRight',
        },
        borderColor: alpha(accent, 0x48), borderWidth: 1,
        shadow: { color: alpha(C.primary, 0x30), blur: 34, offsetY: 18 },
        clip: true, opacity: p,
        scale: 0.965 + 0.035 * p,
        offsetY: (1 - p) * 34,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            { type: 'text', text: label, alignment: 'topLeft', offsetX: 26, offsetY: 23,
              style: { fontSize: 19, color: C.text, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 2 } },
            { type: 'text', text: '0' + (index + 1), alignment: 'topRight', offsetX: -24, offsetY: 25,
              style: { fontSize: 16, color: alpha(C.textMuted, 0xb0), fontFamily: yoclipFont(), letterSpacing: 2 } },
            { type: 'container', width: 46, height: 3, borderRadius: 2, color: accent,
              alignment: 'topLeft', offsetX: 26, offsetY: 61 },
            { type: 'container', width: w - 52, height: 1, color: alpha(C.textMuted, 0x18),
              alignment: 'topCenter', offsetY: 72 },
            { type: 'container', alignment: 'center', offsetY: portrait ? 36 : 30,
              scale: portrait ? 0.60 : 1, child: preview },
          ],
        },
      };
    }

    var textPreview = {
      type: 'container', width: 340, height: 340,
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'container', width: 280, height: 1, color: alpha(C.primaryLight, 0x30), alignment: 'center', offsetY: 70 },
          { type: 'container', width: 1, height: 250, color: alpha(C.textMuted, 0x18), alignment: 'center', offsetX: -112 },
          { type: 'text', text: 'Aa', alignment: 'center', offsetY: -12,
            style: { fontSize: 176, color: C.text, fontFamily: yoclipFont(), fontWeight: 700,
              shadows: [{ color: alpha(C.primaryLight, 0x80), blur: 34 }] } },
          { type: 'text', text: 'GENEVA  /  700', alignment: 'bottomCenter', offsetY: -12,
            style: { fontSize: 16, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 4 } },
        ],
      },
    };

    var bezier = 'M 20 120 C 90 10 225 165 320 42';
    var pathPreview = {
      type: 'container', width: 340, height: 160,
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'path', path: bezier, progress: ease(frame, 52, 142, eio3),
            color: alpha(C.accent, 0x20), strokeWidth: 16, width: 340, height: 160, alignment: 'center' },
          { type: 'path', path: bezier, progress: ease(frame, 52, 142, eio3),
            color: C.accent, strokeWidth: 5, width: 340, height: 160, alignment: 'center' },
          { type: 'text', text: 'PATH  /  0.42', alignment: 'bottomCenter', offsetY: -2,
            style: { fontSize: 14, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 3 } },
        ],
      },
    };

    var spin = ease(frame, 40, 300, eio3) * 360;
    var cubePreview = {
      type: 'container', width: 310, height: 170,
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'container', width: 226, height: 116, borderRadius: 58,
            borderColor: alpha(C.primaryLight, 0x24), borderWidth: 1,
            alignment: 'center', rotation: -12 },
          { type: 'container', width: 116, height: 116, borderRadius: 24,
            gradient: { colors: [C.primary, C.accent], begin: 'topLeft', end: 'bottomRight' },
            alignment: 'center', offsetX: 42, offsetY: 10, rotateY: -spin * 0.7,
            opacity: 0.34 },
          { type: 'container', width: 116, height: 116, borderRadius: 24,
            gradient: { colors: [C.primaryLight, C.primary, C.accent], begin: 'topLeft', end: 'bottomRight' },
            borderColor: alpha(C.text, 0x48), borderWidth: 1,
            shadow: { color: alpha(C.primaryLight, 0x70), blur: 28, offsetY: 14 },
            alignment: 'center', offsetX: -18, rotateY: spin, rotateX: 8 },
        ],
      },
    };

    var imagePreview = {
      type: 'container', width: 410, height: 150,
      borderRadius: 16,
      gradient: { colors: [alpha(C.primary, 0x30), alpha(C.accent, 0x16)], begin: 'topLeft', end: 'bottomRight' },
      borderColor: alpha(C.primaryLight, 0x30), borderWidth: 1,
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'path', path: 'M 10 36 L 10 10 L 36 10 M 374 10 L 400 10 L 400 36 M 10 114 L 10 140 L 36 140 M 374 140 L 400 140 L 400 114',
            color: alpha(C.accent, 0x80), strokeWidth: 2, width: 410, height: 150 },
          { type: 'image', source: yoclipLogoSource(), fit: 'contain', width: 205, height: 130,
            alignment: 'center', scale: 0.92 + 0.08 * shimmer(frame, 80) },
          { type: 'text', text: 'SVG  ·  LIVE ASSET', alignment: 'bottomCenter', offsetY: -9,
            style: { fontSize: 12, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 3 } },
        ],
      },
    };

    function codeLine(text, color, indent) {
      return { type: 'text', text: text, textAlign: 'left', offsetX: indent * 22,
        style: { fontSize: 20, color: color, fontFamily: yoclipFont(), lineHeight: 1.34 } };
    }
    var codePreview = {
      type: 'container', width: 440, height: 160,
      child: {
        type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'start',
        children: [
          codeLine('scene = {', C.text, 0),
          codeLine("type: 'stack',", C.primaryLight, 1),
          codeLine('duration: 330,', C.accent, 1),
          codeLine('render(frame) { … }', light ? C.primary : '#7ee787', 1),
          codeLine('};', C.text, 0),
        ],
      },
    };

    var cards = portrait ? [
      moduleCard(0, T.cardText || 'Text', C.primaryLight, 760, 250, textPreview),
      moduleCard(1, T.cardPaths || 'Paths', C.accent, 760, 250, pathPreview),
      moduleCard(2, T.card3d || '3D', C.primaryLight, 760, 250, cubePreview),
      moduleCard(3, T.cardImages || 'Images', C.primary, 760, 250, imagePreview),
      moduleCard(4, T.cardCode || 'Code', C.accent, 760, 250, codePreview),
    ] : [
      moduleCard(0, T.cardText || 'Text', C.primaryLight, 430, 532, textPreview),
      moduleCard(1, T.cardPaths || 'Paths', C.accent, 400, 254, pathPreview),
      moduleCard(2, T.card3d || '3D', C.primaryLight, 400, 254, cubePreview),
      moduleCard(3, T.cardImages || 'Images', C.primary, 540, 254, imagePreview),
      moduleCard(4, T.cardCode || 'Code', C.accent, 540, 254, codePreview),
    ];

    var group;
    if (portrait) {
      group = { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
        alignment: 'center', offsetY: 150, spacing: 16, children: cards };
    } else {
      group = {
        type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
        alignment: 'center', offsetY: 100, spacing: 24,
        children: [
          cards[0],
          { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: 24, children: [cards[1], cards[2]] },
          { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: 24, children: [cards[3], cards[4]] },
        ],
      };
    }

    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        { type: 'text', text: T.title || 'Compose in scenes', alignment: 'topCenter',
          offsetY: (portrait ? 86 : 88) + riseIn(frame, 28, -24), opacity: titleIn,
          style: { fontSize: portrait ? 54 : 76, color: C.text, fontFamily: yoclipFont(), fontWeight: 700 } },
        { type: 'text', text: T.sub || 'each scene is a tiny program', alignment: 'topCenter',
          offsetY: portrait ? 164 : 182, opacity: titleIn,
          style: { fontSize: portrait ? 28 : 30, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 1 } },
        group,
      ],
    };
  },
};
