// 14 — Badge: audio-reactive by default.
//
// A dark beat: a glowing gradient badge pops in center (play glyph inside a
// dark core), pulsing gently, while a row of equalizer bars dances below —
// bars animate by a deterministic sine hash, no audio needed. Transparent
// background: the shared animated background layer shows through.

scene = {
  id: 'badge',
  duration: 135,
  description: 'Audio-reactive badge: tag chip on top, glowing gradient circle badge with a play glyph pulsing center, a row of dancing equalizer bars below.',
  voicePrompts: {
    en: 'The music takes the lead here — everything on screen breathes with the beat.',
    ru: 'Здесь солирует музыка — всё на экране дышит в такт биту.',
  },
  timeline: {
    label: yoclipT('badge').timeline || 'Beat',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('badge');
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var primary = yoclipColor('primary', '#7c3aed');
    var accent = yoclipColor('accent', '#22d3ee');
    var surface = yoclipColor('surface', '#15131f');
    var bg = yoclipColor('background', '#0a0a12');
    var textC = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var life = presence(frame, 8, 107, 16);

    var children = [];

    // -- Tag chip, top.
    children.push({
      type: 'container',
      alignment: 'center',
      offsetY: -320,
      height: 46,
      borderRadius: 999,
      color: surface,
      opacity: eo3(seg(frame, 2, 14)),
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 20 },
          {
            type: 'text',
            text: t.tag || 'audio-reactive by default',
            style: {
              fontSize: 16,
              color: muted,
              fontFamily: font,
              fontWeight: 600,
              letterSpacing: 4,
            },
          },
          { type: 'container', width: 20 },
        ],
      },
    });

    // -- Badge: gradient ring, dark core, play glyph. Pops in, then breathes.
    var bp = pop(frame, 12, 22);
    var breathe = 1 + 0.06 * shimmer(frame, 22) * seg(frame, 36, 44);
    children.push({
      type: 'container',
      alignment: 'center',
      offsetY: -60,
      width: 200,
      height: 200,
      borderRadius: 999,
      opacity: bp.opacity,
      scale: bp.scale * breathe,
      gradient: {
        type: 'linear',
        colors: [primary, accent],
        begin: 'topLeft',
        end: 'bottomRight',
      },
      shadow: { color: yoclipColorA('primary', 130), blur: 44, offsetX: 0, offsetY: 10 },
      child: {
        type: 'container',
        alignment: 'center',
        width: 156,
        height: 156,
        borderRadius: 999,
        color: bg,
        child: {
          type: 'path',
          path: 'M 20 12 L 50 32 L 20 52 Z',
          color: textC,
          width: 64,
          height: 64,
          offsetX: 4,
        },
      },
    });

    // -- Equalizer bars dancing along the bottom.
    var bars = portrait ? 16 : 24;
    var stepX = 35;
    var baseY = portrait ? 320 : 300;
    for (var i = 0; i < bars; i++) {
      // Center-out stagger: both sides rise together — a plain left-to-right
      // sweep reads lopsided next to the centered badge for ~1.5s.
      var ci = Math.round(Math.abs(i - (bars - 1) / 2) * 2);
      var rise = eo3(staggerItem(frame, ci, 20, 1.2, 12));
      var wave = Math.abs(Math.sin(frame * 0.16 + i * 0.75));
      var h = Math.round((30 + 92 * wave) * rise);
      if (h < 1) continue;
      children.push({
        type: 'container',
        alignment: 'center',
        offsetX: (i - (bars - 1) / 2) * stepX,
        offsetY: baseY - h / 2,
        width: 14,
        height: h,
        borderRadius: 7,
        color: i % 2 === 0 ? primary : accent,
        opacity: 0.9,
      });
    }

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: children,
    };
  },
};
