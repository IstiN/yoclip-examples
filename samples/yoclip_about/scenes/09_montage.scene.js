// Promo scene 8 — a procedural triptych. Three live art directions share one
// canvas while the focus travels draw → breathe → spin.

scene = {
  id: 'montage',
  duration: 240,
  from: 0,
  timeline: {
    label: yoclipT('montage').timeline || 'Montage',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('montage');
    var C = yoclipTheme.colors;
    var life = presence(frame, 12, 214, 14);
    var titleIn = ease(frame, 0, 24, eo3);
    var portrait = yoclipIsPortrait();
    var labels = T.labels || ['draw', 'breathe', 'spin'];
    var active = Math.min(2, Math.floor(frame / 72));

    function alpha(hex, a) {
      var h = hex.replace('#', '');
      if (h.length === 8) h = h.slice(2);
      var s = Math.max(0, Math.min(255, Math.round(a))).toString(16);
      if (s.length < 2) s = '0' + s;
      return '#' + s + h;
    }

    function drawing() {
      var children = [];
      for (var i = -2; i <= 2; i++) {
        children.push({ type: 'container', width: 1, height: 280, color: alpha(C.textMuted, 0x14), alignment: 'center', offsetX: i * 56 });
        children.push({ type: 'container', width: 280, height: 1, color: alpha(C.textMuted, 0x14), alignment: 'center', offsetY: i * 56 });
      }
      var d = 'M 150 20 L 182 116 L 284 116 L 202 174 L 232 274 L 150 216 L 68 274 L 98 174 L 16 116 L 118 116 Z';
      var p = ease(frame, 12, 92, eio3);
      children.push({ type: 'path', path: d, progress: p, color: alpha(C.accent, 0x22), strokeWidth: 18, width: 300, height: 300, alignment: 'center' });
      children.push({ type: 'path', path: d, progress: p, color: C.accent, strokeWidth: 5, width: 300, height: 300, alignment: 'center' });
      children.push({ type: 'container', width: 18, height: 18, borderRadius: 9, color: C.primaryLight,
        alignment: 'center', scale: 0.7 + 0.3 * shimmer(frame, 40),
        shadow: { color: C.primaryLight, blur: 22 } });
      return { type: 'container', width: 340, height: 340, child: { type: 'stack', fit: 'expand', children: children } };
    }

    function breathing() {
      var b = 1 + 0.09 * Math.sin(frame * 0.095);
      return {
        type: 'container', width: 340, height: 340,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            { type: 'container', width: 300, height: 300, borderRadius: 150,
              borderColor: alpha(C.primaryLight, 0x24), borderWidth: 2, alignment: 'center', scale: 0.86 + 0.12 * b },
            { type: 'container', width: 236, height: 236, borderRadius: 118,
              borderColor: alpha(C.accent, 0x38), borderWidth: 2, alignment: 'center', scale: 1.08 - 0.08 * b },
            { type: 'container', width: 190, height: 190, borderRadius: 95, alignment: 'center', scale: b,
              gradient: { type: 'radial', center: 'topLeft', radius: 0.9,
                colors: [C.primaryLight, C.primary, alpha(C.accent, 0xd0)], stops: [0.0, 0.52, 1.0] },
              shadow: { color: alpha(C.primaryLight, 0x90), blur: 48, offsetY: 14 } },
            { type: 'container', width: 58, height: 58, borderRadius: 29, color: alpha(C.text, 0x20),
              alignment: 'center', offsetX: -34, offsetY: -38, scale: b },
            { type: 'text', text: 'inhale  /  exhale', alignment: 'bottomCenter', offsetY: -8,
              style: { fontSize: 13, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 3 } },
          ],
        },
      };
    }

    function spinning() {
      var r = ease(frame, 8, 232, eio3) * 720;
      return {
        type: 'container', width: 340, height: 340,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            { type: 'container', width: 310, height: 190, borderRadius: 95,
              borderColor: alpha(C.primaryLight, 0x28), borderWidth: 2, alignment: 'center', rotation: -14 },
            { type: 'container', width: 232, height: 148, borderRadius: 24,
              gradient: { colors: [C.accent, C.primary], begin: 'topLeft', end: 'bottomRight' },
              alignment: 'center', offsetX: 38, offsetY: 12, rotateY: -r * 0.65, opacity: 0.32 },
            { type: 'container', width: 246, height: 158, borderRadius: 24,
              gradient: { colors: [alpha(C.surface, 0xff), alpha(C.primary, 0x70)], begin: 'topLeft', end: 'bottomRight' },
              borderColor: alpha(C.primaryLight, 0x70), borderWidth: 1.5,
              shadow: { color: alpha(C.primaryLight, 0x70), blur: 34, offsetY: 20 },
              alignment: 'center', rotateY: r, rotateX: 6,
              child: { type: 'image', source: yoclipLogoSource(), fit: 'contain', width: 190, height: 120, alignment: 'center' } },
            { type: 'text', text: '360°  /  PERSPECTIVE', alignment: 'bottomCenter', offsetY: -8,
              style: { fontSize: 13, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 3 } },
          ],
        },
      };
    }

    function panel(index, label, accent, art) {
      var p = ease(frame, 14 + index * 9, 48 + index * 9, eo3);
      var on = index === active;
      var progress = seg(frame, index * 72, index * 72 + 64);
      return {
        type: 'container', width: portrait ? 880 : 460, height: portrait ? 360 : 520,
        borderRadius: 26,
        gradient: { colors: [alpha(C.surface, 0xf2), alpha(C.backgroundDeep, 0xe8)], begin: 'topLeft', end: 'bottomRight' },
        borderColor: alpha(accent, on ? 0x88 : 0x28), borderWidth: on ? 1.5 : 1,
        shadow: { color: alpha(accent, on ? 0x48 : 0x10), blur: on ? 42 : 22, offsetY: 20 },
        clip: true, opacity: p * (on ? 1 : 0.68), scale: (on ? 1 : 0.978) * (0.97 + 0.03 * p),
        offsetY: (1 - p) * 30,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            { type: 'container', width: 9, height: 9, borderRadius: 5, color: accent,
              alignment: 'topLeft', offsetX: 26, offsetY: 29, opacity: on ? 1 : 0.45 },
            { type: 'text', text: label.toUpperCase(), alignment: 'topLeft', offsetX: 48, offsetY: 21,
              style: { fontSize: 18, color: on ? C.text : C.textMuted, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 4 } },
            { type: 'text', text: '0' + (index + 1), alignment: 'topRight', offsetX: -26, offsetY: 22,
              style: { fontSize: 17, color: alpha(C.textMuted, 0xa0), fontFamily: yoclipFont(), letterSpacing: 2 } },
            { type: 'container', alignment: 'center', offsetY: 14, scale: portrait ? 0.76 : 1, child: art },
            { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
              alignment: 'bottomCenter', offsetY: -25,
              children: [
                { type: 'container', width: (portrait ? 800 : 400) * progress, height: 3, borderRadius: 2, color: accent },
                { type: 'container', width: (portrait ? 800 : 400) * (1 - progress), height: 3, borderRadius: 2, color: alpha(C.textMuted, 0x20) },
              ] },
          ],
        },
      };
    }

    var panels = [
      panel(0, labels[0], C.accent, drawing()),
      panel(1, labels[1], C.primaryLight, breathing()),
      panel(2, labels[2], C.primary, spinning()),
    ];

    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        { type: 'text', text: T.title || 'Anything you can code', alignment: 'topCenter',
          offsetY: (portrait ? 126 : 88) + riseIn(frame, 24, -24), opacity: titleIn,
          style: { fontSize: portrait ? 58 : 72, color: C.text, fontFamily: yoclipFont(), fontWeight: 700 } },
        { type: 'text', text: T.caption || 'THREE PRIMITIVES  ·  INFINITE DIRECTIONS', alignment: 'topCenter',
          offsetY: portrait ? 208 : 178, opacity: titleIn,
          style: { fontSize: portrait ? 20 : 18, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 4 } },
        { type: portrait ? 'column' : 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
          alignment: 'center', offsetY: portrait ? 120 : 82, spacing: portrait ? 20 : 22, children: panels },
      ],
    };
  },
};
