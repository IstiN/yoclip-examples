// 01 — Worlds: three graphic impossibilities, cut like a title sequence.
//
// The original low-poly dioramas read as tech demos and were vulnerable to
// scene3d viewport artifacts. This is an intentionally 2.5D editorial montage:
// a monolith over layered dunes, a luminous portal with floating layouts,
// then a prism vortex around the wordmark. Everything is procedural vector
// and type, so every frame stays crisp and export-safe.

scene = {
  id: 'worlds',
  duration: 186,
  description: 'Three surreal vector worlds: monolith dunes, a neon portal of floating layouts, and a prism vortex around the yoclip mark.',
  voicePrompts: {
    en: 'Music lifts: wide cinematic synths, three hard cuts on downbeats.',
    ru: 'Подъём музыки: широкие синты, три жёстких среза на долях.',
  },
  timeline: {
    label: yoclipT('worlds').timeline || 'Worlds',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('worlds');
    var captions = t.captions || ['any world', 'any style', 'any story'];
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var surface = yoclipColor('surface', '#15131f');
    var font = yoclipFont();
    var portrait = yoclipIsPortrait();

    var SLOT = 62;
    var idx = Math.min(2, Math.floor(frame / SLOT));
    var f = frame - idx * SLOT;
    var enter = ease(f, 0, 12, eo3);

    function stars(count, local, seed) {
      var out = [];
      for (var i = 0; i < count; i++) {
        var x = ((i * 197 + seed * 83) % 1730) - 865;
        var y = ((i * 89 + seed * 47) % 720) - 410;
        var s = 1 + (i % 3);
        out.push({
          type: 'container',
          alignment: 'center',
          offsetX: x + Math.sin(local * 0.018 + i) * 5,
          offsetY: y,
          width: s,
          height: s,
          borderRadius: s / 2,
          color: i % 5 === 0 ? accent : txt,
          opacity: 0.18 + 0.48 * shimmer(local + i * 7, 54),
        });
      }
      return out;
    }

    function glow(key, fallback, size, alpha) {
      return {
        type: 'container',
        alignment: 'center',
        width: size,
        height: size,
        gradient: {
          type: 'radial',
          center: 'center',
          radius: 0.5,
          colors: [yoclipColorA(key, alpha, fallback), yoclipColorA(key, 0, fallback)],
        },
      };
    }

    function glassCard(x, y, rot, local, kind) {
      var p = ease(local, 7 + kind * 4, 25 + kind * 4, eoBack);
      var kids = [];
      if (kind === 0) {
        kids.push({
          type: 'image',
          source: yoclipLogoSource(),
          fit: 'contain',
          width: 176,
          height: 111,
          alignment: 'center',
        });
      } else if (kind === 1) {
        kids.push({ type: 'text', alignment: 'center', text: 'Aa', style: { fontSize: 82, color: txt, fontFamily: font, fontWeight: 700 } });
        kids.push({ type: 'container', alignment: 'center', offsetY: 58, width: 160, height: 3, color: accent });
      } else {
        for (var j = 0; j < 4; j++) {
          kids.push({
            type: 'container',
            alignment: 'center',
            offsetX: j % 2 ? 26 : -20,
            offsetY: -52 + j * 34,
            width: 190 - j * 18,
            height: 12,
            borderRadius: 6,
            color: j === 0 ? primaryLight : yoclipColorA('textMuted', 0x55, '#a1a1aa'),
          });
        }
      }
      return {
        type: 'container',
        alignment: 'center',
        offsetX: x,
        offsetY: y + float(local, 10, 0.055, kind),
        rotation: rot,
        scale: Math.max(0.01, p),
        opacity: seg(local, 5 + kind * 4, 12 + kind * 4),
        width: portrait ? 250 : 310,
        height: 190,
        color: yoclipColorA('backgroundSoft', 0xd9, '#0d0d18'),
        borderRadius: 24,
        borderColor: yoclipColorA(kind === 1 ? 'accent' : 'primaryLight', 0x77, '#a78bfa'),
        borderWidth: 1.5,
        shadow: { color: yoclipColorA('primary', 0x28, '#7c3aed'), blur: 46, offsetX: 0, offsetY: 16 },
        child: { type: 'stack', fit: 'expand', children: kids },
      };
    }

    var layers = [];
    if (idx === 0) {
      // A — monolith over a violet desert.
      layers.push({
        type: 'container',
        gradient: { type: 'linear', begin: 'topCenter', end: 'bottomCenter', colors: ['#080813', '#211335', '#713e75'] },
      });
      layers = layers.concat(stars(34, f, 1));
      layers.push(glow('primaryLight', '#a78bfa', 860, 0x48));
      // Long translucent aurora ribbons.
      for (var a = 0; a < 3; a++) {
        layers.push({
          type: 'container',
          alignment: 'center',
          offsetX: -180 + a * 170 + float(f, 35, 0.025, a),
          offsetY: -310 + a * 76,
          rotation: -13 + a * 5,
          width: 1380,
          height: 100,
          borderRadius: 50,
          opacity: 0.42 - a * 0.08,
          gradient: {
            type: 'linear', begin: 'centerLeft', end: 'centerRight',
            colors: [yoclipColorA('accent', 0, '#22d3ee'), yoclipColorA(a === 1 ? 'primaryLight' : 'accent', 0x88, '#22d3ee'), yoclipColorA('primary', 0, '#7c3aed')],
          },
        });
      }
      // Dunes: three silhouettes create real foreground/midground depth.
      layers.push({
        type: 'svg', alignment: 'bottomCenter', width: 1920, height: 410, viewBox: '0 0 1920 410',
        path: 'M 0 270 C 260 110 540 150 790 260 C 1120 400 1430 90 1920 180 L 1920 410 L 0 410 Z',
        color: '#2b2140',
      });
      layers.push({
        type: 'svg', alignment: 'bottomCenter', width: 1920, height: 330, offsetY: -2, viewBox: '0 0 1920 330',
        path: 'M 0 190 C 300 30 650 280 980 145 C 1290 20 1570 110 1920 220 L 1920 330 L 0 330 Z',
        color: '#151426',
      });
      var monoIn = ease(f, 2, 22, eo3);
      layers.push({
        type: 'stack', fit: 'expand', alignment: 'center', offsetY: 36 - 26 * (1 - monoIn), scale: 0.92 + 0.08 * monoIn,
        children: [
          { type: 'container', alignment: 'center', offsetY: 248, width: 250, height: 18, borderRadius: 9, color: '#05050b', opacity: 0.55 },
          { type: 'svg', alignment: 'center', width: 360, height: 520, viewBox: '0 0 360 520', path: 'M 120 40 L 240 20 L 240 500 L 120 460 Z', color: primary },
          { type: 'svg', alignment: 'center', width: 360, height: 520, viewBox: '0 0 360 520', path: 'M 240 20 L 310 70 L 310 480 L 240 500 Z', color: '#321c5d' },
          { type: 'svg', alignment: 'center', width: 360, height: 520, viewBox: '0 0 360 520', path: 'M 120 40 L 190 0 L 310 70 L 240 20 Z', color: primaryLight },
          { type: 'container', alignment: 'center', offsetX: -52, offsetY: -14, width: 5, height: 330, color: yoclipColorA('primaryLight', 0x66, '#a78bfa') },
        ],
      });
      layers.push({
        type: 'svg', alignment: 'bottomCenter', width: 1920, height: 220, viewBox: '0 0 1920 220',
        path: 'M 0 120 C 390 10 760 190 1120 105 C 1440 30 1710 85 1920 140 L 1920 220 L 0 220 Z',
        color: '#090b14',
      });
    } else if (idx === 1) {
      // B — a portal and a constellation of design surfaces.
      layers.push({
        type: 'container',
        gradient: { type: 'linear', begin: 'topLeft', end: 'bottomRight', colors: ['#020c15', '#092d3c', '#17132e'] },
      });
      layers = layers.concat(stars(28, f, 2));
      layers.push(glow('accent', '#22d3ee', 1050, 0x3d));
      // Perspective floor grid.
      for (var g = 0; g < 6; g++) {
        layers.push({ type: 'container', alignment: 'center', offsetY: 250 + g * 55, width: 1500 + g * 180, height: 1, color: accent, opacity: 0.11 });
      }
      for (var r = 0; r < 8; r++) {
        var rp = (r + 1) / 8;
        layers.push({
          type: 'container', alignment: 'center', offsetY: -24,
          width: 610, height: 610, borderRadius: 305,
          scale: 0.32 + rp * 0.92 + Math.sin(f * 0.035 + r) * 0.012,
          rotation: (r % 2 ? -1 : 1) * f * 0.22 + r * 7,
          borderColor: r % 3 === 0 ? accent : (r % 3 === 1 ? primaryLight : primary),
          borderWidth: r === 7 ? 5 : 2.5,
          color: '#00000000', opacity: 0.2 + rp * 0.65,
          shadow: { color: yoclipColorA(r % 2 ? 'primary' : 'accent', r === 7 ? 0x44 : 0, '#7c3aed'), blur: 30, offsetX: 0, offsetY: 0 },
        });
      }
      layers.push({ type: 'container', alignment: 'center', offsetY: -24, width: 130, height: 130, borderRadius: 65, color: '#d9fbff', opacity: 0.9, shadow: { color: accent, blur: 60, offsetX: 0, offsetY: 0 } });
      layers.push(glassCard(portrait ? -280 : -570, -175, -8, f, 0));
      layers.push(glassCard(portrait ? 270 : 565, -70, 7, f, 1));
      layers.push(glassCard(portrait ? -245 : -480, 245, 5, f, 2));
    } else {
      // C — a prismatic story vortex; the brand is the still center.
      layers.push({
        type: 'container',
        gradient: { type: 'linear', begin: 'topCenter', end: 'bottomCenter', colors: ['#100717', '#25113a', '#061d27'] },
      });
      layers = layers.concat(stars(30, f, 3));
      layers.push(glow('primary', '#7c3aed', 1080, 0x50));
      for (var s = 0; s < 14; s++) {
        var ang = (s / 14) * Math.PI * 2 + f * 0.018;
        var rad = 290 + (s % 3) * 105;
        var shardIn = ease(f, 2 + (s % 5) * 2, 20 + (s % 5) * 2, eoBack);
        layers.push({
          type: 'svg', alignment: 'center',
          offsetX: Math.cos(ang) * rad,
          offsetY: Math.sin(ang) * rad * 0.66,
          width: 118, height: 205, viewBox: '0 0 118 205',
          path: 'M 59 0 L 118 205 L 0 205 Z',
          color: s % 3 === 0 ? accent : (s % 3 === 1 ? primary : primaryLight),
          opacity: (0.28 + (s % 4) * 0.14) * shardIn,
          rotation: ang * 180 / Math.PI + 90 + f * (s % 2 ? 0.8 : -0.55),
          scale: Math.max(0.01, shardIn * (0.65 + (s % 3) * 0.18)),
        });
      }
      // Orbiting narrative cards.
      var storyWords = ['PROMPT', 'RENDER', 'SHIP'];
      for (var n = 0; n < 3; n++) {
        var na = n * Math.PI * 2 / 3 - f * 0.012;
        layers.push({
          type: 'container', alignment: 'center',
          offsetX: Math.cos(na) * 550,
          offsetY: Math.sin(na) * 285,
          width: 218, height: 72, borderRadius: 18,
          color: yoclipColorA('backgroundDeep', 0xd9, '#07070d'),
          borderColor: n === 1 ? accent : primaryLight, borderWidth: 1.5,
          rotation: Math.sin(na) * 7,
          child: { type: 'stack', fit: 'expand', children: [{ type: 'text', alignment: 'center', text: '0' + (n + 1) + '  /  ' + storyWords[n], style: { fontSize: 19, color: txt, fontFamily: font, fontWeight: 600, letterSpacing: 3 } }] },
        });
      }
      var markIn = pop(f, 4, 22);
      layers.push({
        type: 'container', alignment: 'center', width: 440, height: 250,
        scale: Math.max(0.02, markIn.scale), opacity: markIn.opacity,
        rotation: Math.sin(f * 0.035) * 2,
        color: yoclipColorA('backgroundDeep', 0xe6, '#07070d'), borderRadius: 34,
        borderColor: yoclipColorA('primaryLight', 0x99, '#a78bfa'), borderWidth: 2,
        shadow: { color: yoclipColorA('primary', 0x22, '#7c3aed'), blur: 60, offsetX: 0, offsetY: 16 },
        child: { type: 'stack', fit: 'expand', children: [{ type: 'image', source: yoclipLogoSource(), fit: 'contain', width: 280, height: 177, alignment: 'center' }] },
      });
    }

    // Shared editorial HUD: chapter, caption and three hard-cut progress ticks.
    var capIn = ease(f, 3, 15, eo3);
    layers.push({ type: 'text', alignment: 'topLeft', offsetX: 64, offsetY: 52, text: '0' + (idx + 1) + '  /  03', style: { fontSize: 21, color: accent, fontFamily: font, fontWeight: 600, letterSpacing: 5 } });
    layers.push({ type: 'text', alignment: 'topRight', offsetX: -64, offsetY: 54, text: 'YOCLIP  /  WORLDS', style: { fontSize: 18, color: muted, fontFamily: font, fontWeight: 600, letterSpacing: 5 } });
    layers.push({
      type: 'text', alignment: 'bottomLeft', offsetX: 64 + (1 - capIn) * 28, offsetY: portrait ? -82 : -64,
      text: captions[idx], opacity: capIn,
      style: { fontSize: portrait ? 48 : 68, color: txt, fontFamily: font, fontWeight: 700, letterSpacing: 1, shadows: [{ color: '#99000000', blur: 20, offsetX: 0, offsetY: 5 }] },
    });
    layers.push({ type: 'text', alignment: 'bottomRight', offsetX: -42, offsetY: 6, text: '0' + (idx + 1), opacity: 0.1, style: { fontSize: 190, color: txt, fontFamily: font, fontWeight: 700 } });
    for (var q = 0; q < 3; q++) {
      layers.push({ type: 'container', alignment: 'bottomCenter', offsetX: (q - 1) * 186, offsetY: -24, width: 164, height: 3, color: q === idx ? accent : yoclipColorA('textMuted', 0x44, '#a1a1aa') });
    }

    var life = idx === 0 ? presence(frame, 7, 9999, 0) : 1;
    return {
      type: 'stack', fit: 'expand', opacity: life * fadeOut(frame, 186, 8),
      children: [{ type: 'stack', fit: 'expand', opacity: enter, scale: 0.975 + 0.025 * enter, children: layers }],
    };
  },
};
