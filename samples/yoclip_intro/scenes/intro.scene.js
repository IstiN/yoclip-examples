// Yoclip V2 intro scene.
// Animated brand-circle background + logo + welcome headline.

scene = {
  id: 'intro',
  duration: 90,
  from: 0,
  description: 'Soft brand-colored circles drift and pulse on black (bloom in over frames 0-24); Yoclip logo (white Clip) sits top-right; headline rises, scales and fades in at the center during frames 8-40.',
  voicePrompts: {
    en: 'Meet Yoclip — the fastest way to turn raw footage into a finished clip.',
    ru: 'Привет! Это Yoclip — быстрый способ превратить исходники в готовый клип.',
  },
  timeline: {
    label: 'Intro',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var colors = (yoclipTheme && yoclipTheme.colors) || {};
    var accent = colors.accent || '#6157f3';
    var accentBlue = colors.accentBlue || '#3c7af4';
    var accentSoft = colors.accentSoft || '#a6a6f8';

    // Prepend an alpha byte to a #rrggbb color (renderer expects #AARRGGBB).
    var withAlpha = function(hex, a) {
      var v = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16);
      while (v.length < 2) v = '0' + v;
      return '#' + v + hex.replace('#', '');
    };

    // Background circles: base position + drift amplitude/speed/phase per orb.
    var circles = [
      { size: 720, color: accent,     a: 0.34, x: -620, y: -300, ax: 26, ay: 38, sp: 0.021, ph: 0.0, ps: 0.017 },
      { size: 840, color: accentBlue, a: 0.26, x: 640,  y: 380,  ax: 30, ay: 24, sp: 0.016, ph: 2.1, ps: 0.013 },
      { size: 300, color: accent,     a: 0.42, x: 560,  y: -170, ax: 18, ay: 26, sp: 0.026, ph: 4.0, ps: 0.022 },
      { size: 190, color: accentSoft, a: 0.36, x: -470, y: 250,  ax: 22, ay: 16, sp: 0.031, ph: 1.3, ps: 0.028 },
      { size: 130, color: accentSoft, a: 0.55, x: -140, y: 380,  ax: 14, ay: 20, sp: 0.036, ph: 5.1, ps: 0.032 },
      { size: 110, color: accentBlue, a: 0.48, x: 210,  y: -330, ax: 20, ay: 14, sp: 0.040, ph: 3.2, ps: 0.036 },
    ];

    // Headline entrance: eased fade + rise + slight scale-in (frames 8-40).
    var t = Math.max(0, frame - 8);
    var p = easeOut(t, 0, 1, 32);

    // Circles bloom in over the first ~24 frames.
    var intro = easeOut(frame, 0, 1, 24);

    return {
      type: 'stack',
      fit: 'expand',
      children: circles.map(function(c, i) {
        return {
          id: 'circle_' + i,
          type: 'container',
          width: c.size,
          height: c.size,
          borderRadius: c.size / 2,
          alignment: 'center',
          gradient: {
            type: 'radial',
            radius: 0.45,
            colors: [withAlpha(c.color, c.a), withAlpha(c.color, 0)],
            stops: [0.0, 1.0],
          },
          opacity: intro,
          offsetX: c.x + Math.cos(frame * c.sp * 1.3 + c.ph) * c.ax,
          offsetY: c.y + Math.sin(frame * c.sp + c.ph) * c.ay,
          scale: 1 + 0.05 * Math.sin(frame * c.ps + c.ph),
        };
      }).concat([
        {
          id: 'intro_logo',
          type: 'image',
          source: 'external:logo_white',
          width: 240,
          height: 135,
          alignment: 'topRight',
          padding: 32,
        },
        {
          id: 'intro_text',
          type: 'text',
          text: 'Hi, this is Yoclip!',
          style: {
            fontSize: 96,
            color: '#ffffff',
            fontFamily: 'Geneva',
          },
          alignment: 'center',
          opacity: p,
          offsetY: 48 * (1 - p),
          scale: 0.92 + 0.08 * p,
        },
      ]),
    };
  },
};
