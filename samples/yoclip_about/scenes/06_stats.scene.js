// Promo scene 5 — output telemetry. One precise render profile instead of
// three generic cards: live counters, clear hierarchy, and a frame timeline.

scene = {
  id: 'stats',
  duration: 300,
  from: 0,
  timeline: {
    label: yoclipT('stats').timeline || 'Stats',
    color: yoclipTheme.colors.primary,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('stats');
    var C = yoclipTheme.colors;
    var life = presence(frame, 16, 266, 18);
    var titleIn = ease(frame, 0, 28, eo3);
    var panelIn = ease(frame, 8, 48, eo3);
    var portrait = yoclipIsPortrait();

    function alpha(hex, a) {
      var h = hex.replace('#', '');
      if (h.length === 8) h = h.slice(2);
      var s = Math.max(0, Math.min(255, Math.round(a))).toString(16);
      if (s.length < 2) s = '0' + s;
      return '#' + s + h;
    }
    function pad3(v) {
      var s = String(v);
      while (s.length < 3) s = '0' + s;
      return s;
    }

    function metric(index, label, value, suffix, sub, accent) {
      var p = ease(frame, 28 + index * 10, 64 + index * 10, eo3);
      var numeric = typeof value === 'number';
      var shown = numeric ? counter(frame, 44 + index * 10, 72, 0, value) : value;
      var bigSize = portrait ? 106 : (numeric ? (index === 2 ? 132 : 148) : 132);
      var valueChildren = [
        { type: 'text', text: String(shown),
          style: { fontSize: bigSize, color: C.text, fontFamily: yoclipFont(), fontWeight: 700,
            shadows: [{ color: alpha(accent, 0x60), blur: 30 }] } },
      ];
      if (suffix) {
        valueChildren.push({ type: 'text', text: suffix, offsetX: 12, offsetY: portrait ? -20 : -30,
          style: { fontSize: index === 2 ? 42 : 26, color: accent, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 2 } });
      }
      return {
        type: 'container', width: portrait ? 760 : 430, height: portrait ? 236 : 300,
        opacity: p, offsetY: (1 - p) * 24,
        child: {
          type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
          children: [
            { type: 'text', text: label,
              style: { fontSize: portrait ? 20 : 18, color: accent, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 4 } },
            { type: 'container', height: portrait ? 12 : 18 },
            {
              type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'end',
              children: valueChildren,
            },
            { type: 'container', height: 12 },
            { type: 'text', text: sub,
              style: { fontSize: portrait ? 25 : 23, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 1 } },
          ],
        },
      };
    }

    var metrics = [
      metric(0, T.frameRate || 'Frame rate', 60, 'FPS', '24 / 30 / 60', C.primaryLight),
      metric(1, T.output || 'Output', '4K', '', T.resolution || 'any resolution', C.accent),
      metric(2, T.control || 'Control', 100, '%', T.scriptable || 'scriptable', C.primaryLight),
    ];

    var metricGroup = portrait ? {
      type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
      alignment: 'center', offsetY: 36,
      children: [
        metrics[0], { type: 'container', width: 700, height: 1, color: alpha(C.textMuted, 0x20) },
        metrics[1], { type: 'container', width: 700, height: 1, color: alpha(C.textMuted, 0x20) }, metrics[2],
      ],
    } : {
      type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
      alignment: 'center', offsetY: -8,
      children: [
        metrics[0], { type: 'container', width: 1, height: 210, color: alpha(C.textMuted, 0x20) },
        metrics[1], { type: 'container', width: 1, height: 210, color: alpha(C.textMuted, 0x20) }, metrics[2],
      ],
    };

    var tickCount = portrait ? 32 : 48;
    var tickW = portrait ? 18 : 20;
    var gap = 6;
    var ticks = [];
    var play = ease(frame, 70, 238, eio3);
    for (var i = 0; i < tickCount; i++) {
      var on = i / (tickCount - 1) <= play;
      var h = 12 + ((i * 17) % 25);
      var col = i % 4 === 0 ? C.accent : C.primaryLight;
      ticks.push({
        type: 'container', width: tickW, height: h, borderRadius: 4,
        color: on ? col : alpha(C.textMuted, 0x22),
        opacity: on ? 0.88 : 1,
      });
    }
    var trackW = tickCount * tickW + (tickCount - 1) * gap;
    var frameNo = counter(frame, 70, 168, 0, 180);

    var panel = {
      type: 'container', width: portrait ? 900 : 1480, height: portrait ? 1120 : 560,
      borderRadius: 30,
      gradient: {
        colors: [alpha(C.surface, 0xee), alpha(C.backgroundDeep, 0xe8)],
        begin: 'topLeft', end: 'bottomRight',
      },
      borderColor: alpha(C.primaryLight, 0x30), borderWidth: 1,
      shadow: { color: alpha(C.primary, 0x40), blur: 60, offsetY: 28 },
      alignment: 'center', offsetY: portrait ? 100 : 90,
      opacity: panelIn, scale: 0.975 + 0.025 * panelIn,
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'text', text: T.profile || 'YOCLIP  /  RENDER PROFILE', alignment: 'topLeft', offsetX: 30, offsetY: 25,
            style: { fontSize: 17, color: C.textMuted, fontFamily: yoclipFont(), fontWeight: 600, letterSpacing: 3 } },
          { type: 'container', width: 10, height: 10, borderRadius: 5, color: C.accent,
            alignment: 'topRight', offsetX: -192, offsetY: 31,
            opacity: 0.55 + 0.45 * shimmer(frame, 36) },
          { type: 'text', text: T.ready || 'ENGINE READY', alignment: 'topRight', offsetX: -30, offsetY: 25,
            style: { fontSize: 16, color: C.accent, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 2 } },
          { type: 'container', width: portrait ? 840 : 1420, height: 1, color: alpha(C.textMuted, 0x20),
            alignment: 'topCenter', offsetY: 74 },
          metricGroup,
          { type: 'container', width: portrait ? 840 : 1420, height: 1, color: alpha(C.textMuted, 0x20),
            alignment: 'bottomCenter', offsetY: portrait ? -142 : -112 },
          { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: gap,
            alignment: 'bottomCenter', offsetY: portrait ? -82 : -58, children: ticks },
          { type: 'container', width: 2, height: 64, color: C.text,
            alignment: 'bottomCenter', offsetX: -trackW / 2 + trackW * play, offsetY: portrait ? -72 : -48,
            opacity: 0.72 },
          { type: 'text', text: 'FRAME  ' + pad3(frameNo), alignment: 'bottomLeft', offsetX: 30, offsetY: -24,
            style: { fontSize: 15, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 2 } },
          { type: 'text', text: 'FRAME  180', alignment: 'bottomRight', offsetX: -30, offsetY: -24,
            style: { fontSize: 15, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 2 } },
        ],
      },
    };

    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        { type: 'text', text: T.title || 'Built for real output', alignment: 'topCenter',
          offsetY: (portrait ? 110 : 88) + riseIn(frame, 28, -24), opacity: titleIn,
          style: { fontSize: portrait ? 54 : 72, color: C.text, fontFamily: yoclipFont(), fontWeight: 700 } },
        { type: 'text', text: T.caption || 'ONE TIMELINE  ·  EVERY FRAME  ·  ANY OUTPUT', alignment: 'topCenter',
          offsetY: portrait ? 188 : 178, opacity: titleIn,
          style: { fontSize: portrait ? 20 : 18, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 4 } },
        panel,
      ],
    };
  },
};
