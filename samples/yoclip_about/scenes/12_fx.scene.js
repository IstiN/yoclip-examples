// Promo scene — FX reel. Ten effects play inside a persistent, clipped stage
// with an edit-style effect navigator. No more tiny demos floating in dead air.

scene = {
  id: 'fx',
  duration: 420,
  from: 0,
  timeline: {
    label: yoclipT('fx').timeline || 'FX',
    color: yoclipTheme.colors.accent || yoclipColor('cyan', '#22d3ee'),
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('fx');
    var C = yoclipTheme.colors || {};
    var primary = C.primary || '#7c3aed';
    var primaryLight = C.primaryLight || '#a78bfa';
    var accent = C.accent || '#22d3ee';
    var ink = C.text || '#ffffff';
    var life = presence(frame, 12, 396, 12);
    var portrait = yoclipIsPortrait();
    var TITLE = 10;
    var SLOT = 38;
    var names = T.names || [
      'vignette', 'scanlines', 'light leak', 'rings', 'starburst',
      'chromatic', 'shine', 'wave text', 'letter reveal', 'spectrum',
    ];

    function alpha(hex, a) {
      var h = hex.replace('#', '');
      if (h.length === 8) h = h.slice(2);
      var s = Math.max(0, Math.min(255, Math.round(a))).toString(16);
      if (s.length < 2) s = '0' + s;
      return '#' + s + h;
    }
    function pad2(v) { return v < 10 ? '0' + v : String(v); }
    function logo(w, h, op) {
      var k = portrait ? 1.12 : 1;
      return { type: 'image', source: yoclipLogoSource(), fit: 'contain',
        width: w * k, height: h * k, alignment: 'center', offsetY: 22,
        opacity: op == null ? 1 : op };
    }
    function micro(text, color) {
      return { type: 'text', text: text, alignment: 'bottomCenter', offsetY: -54,
        style: { fontSize: 15, color: color || C.textMuted, fontFamily: yoclipFont(), letterSpacing: 4 } };
    }

    // 0 — vignette.
    function e0(f, a) {
      return {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'container', width: 760, height: 500, alignment: 'center',
            gradient: { type: 'radial', center: 'center', radius: 0.72,
              colors: [alpha(primary, 0x38), alpha(accent, 0x14), alpha(primary, 0x00)] } },
          logo(480, 304, 1),
          { type: 'container', alignment: 'center',
            gradient: { type: 'radial', center: 'center', radius: 0.72,
              colors: [alpha(C.backgroundDeep, 0x00), alpha(C.backgroundDeep, 0x00), alpha(C.backgroundDeep, 0xe0)],
              stops: [0.0, 0.48 + 0.08 * shimmer(f, 24), 1.0] } },
          micro('EDGE  /  FALLOFF', primaryLight),
        ],
      };
    }
    // 1 — scanlines / CRT.
    function e1(f, a) {
      var children = [logo(480, 304, 1)];
      var off = (f * 3) % 14;
      for (var i = 0; i < 46; i++) {
        children.push({ type: 'container', width: portrait ? 940 : 1500, height: 2,
          color: ink, opacity: i % 3 === 0 ? 0.12 : 0.055,
          alignment: 'center', offsetY: i * 14 + off - 318 });
      }
      children.push({ type: 'container', width: portrait ? 820 : 1320, height: 3,
        color: accent, opacity: 0.34, alignment: 'center', offsetY: -220 + ((f * 11) % 440) });
      children.push(micro('SIGNAL  /  030', accent));
      return { type: 'stack', fit: 'expand', children: children };
    }
    // 2 — light leak.
    function e2(f, a) {
      var x = lerp(-980, 980, ease(f, 0, 36, eio3));
      return {
        type: 'stack', fit: 'expand',
        children: [
          logo(500, 316, 1),
          { type: 'container', width: 460, height: 760, alignment: 'center', offsetX: x, rotation: 18,
            gradient: { colors: [alpha('#ffb86b', 0x00), alpha('#ffb86b', 0x66), alpha('#ffe0ac', 0xc0), alpha('#ffb86b', 0x50), alpha('#ffb86b', 0x00)],
              stops: [0.0, 0.32, 0.5, 0.68, 1.0], begin: 'centerLeft', end: 'centerRight' } },
          micro('WARMTH  /  SWEEP', '#ffb86b'),
        ],
      };
    }
    // 3 — rings, phase-offset so the stage never empties.
    function e3(f, a) {
      var children = [logo(360, 228, 1)];
      for (var i = 0; i < 5; i++) {
        var p = ((f + i * 7) % 36) / 36;
        children.push({ type: 'container', width: 150, height: 150, borderRadius: 75,
          borderColor: i % 2 ? accent : primaryLight, borderWidth: 3,
          alignment: 'center', offsetY: 22, scale: lerp(0.45, 3.5, eo3(p)), opacity: (1 - p) * 0.82 });
      }
      children.push(micro('RADIUS  /  REPEAT', primaryLight));
      return { type: 'stack', fit: 'expand', children: children };
    }
    // 4 — starburst streaks with staggered particle lifetimes.
    function e4(f, a) {
      var children = [logo(300, 190, 1)];
      var n = 26;
      for (var i = 0; i < n; i++) {
        var p = ((f + i * 3) % 32) / 32;
        var fly = eo3(p);
        var ang = (i / n) * Math.PI * 2 + (i % 3) * 0.08;
        var r = lerp(54, portrait ? 360 : 510, fly);
        var col = i % 3 === 0 ? primaryLight : (i % 3 === 1 ? accent : ink);
        children.push({ type: 'container', width: 58, height: 4, borderRadius: 2,
          color: col, alignment: 'center', offsetY: 22 + Math.sin(ang) * r,
          offsetX: Math.cos(ang) * r, rotation: ang * 180 / Math.PI,
          opacity: (1 - p) * 0.95, scale: 0.45 + (1 - p) * 0.8 });
      }
      children.push(micro('PARTICLES  /  026', accent));
      return { type: 'stack', fit: 'expand', children: children };
    }
    // 5 — chromatic aberration.
    function e5(f, a) {
      var split = lerp(2, 22, ease(f, 0, 18, eo3)) * (0.72 + 0.28 * shimmer(f, 8));
      function ch(color, dx) {
        return { type: 'text', text: 'FX', alignment: 'center', offsetX: dx, offsetY: 16,
          style: { fontSize: portrait ? 250 : 290, color: color, fontFamily: yoclipFont(), fontWeight: 700 }, opacity: 0.74 };
      }
      return {
        type: 'stack', fit: 'expand',
        children: [
          ch('#ff3b5c', -split), ch(accent, split),
          { type: 'text', text: 'FX', alignment: 'center', offsetY: 16,
            style: { fontSize: portrait ? 250 : 290, color: ink, fontFamily: yoclipFont(), fontWeight: 700 } },
          micro('RGB  /  SPLIT', accent),
        ],
      };
    }
    // 6 — shine across a glass logo plate.
    function e6(f, a) {
      var x = lerp(-620, 620, ease(f, 0, 36, eio3));
      return {
        type: 'container', width: portrait ? 720 : 760, height: 430, alignment: 'center', offsetY: 20,
        borderRadius: 28, clip: true,
        gradient: { colors: [alpha(C.surface, 0xf0), alpha(primary, 0x20)], begin: 'topLeft', end: 'bottomRight' },
        borderColor: alpha(primaryLight, 0x38), borderWidth: 1,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            logo(540, 342, 1),
            { type: 'container', width: 130, height: 520, offsetX: x, rotation: 16, alignment: 'center',
              gradient: { colors: [alpha(ink, 0x00), alpha(ink, 0x10), alpha(ink, 0xd0), alpha(ink, 0x10), alpha(ink, 0x00)],
                stops: [0.0, 0.35, 0.5, 0.65, 1.0], begin: 'centerLeft', end: 'centerRight' } },
            micro('SPECULAR  /  PASS', primaryLight),
          ],
        },
      };
    }
    // 7 — wave text.
    function e7(f, a) {
      var word = 'yoclip';
      var children = [];
      var step = portrait ? 100 : 116;
      var startX = -(word.length - 1) * step / 2;
      for (var i = 0; i < word.length; i++) {
        children.push({ type: 'text', text: word.charAt(i), alignment: 'center',
          offsetX: startX + i * step, offsetY: Math.sin(f * 0.28 + i * 0.85) * 42,
          style: { fontSize: portrait ? 146 : 172, color: i % 2 ? accent : ink,
            fontFamily: yoclipFont(), fontWeight: 700,
            shadows: [{ color: alpha(i % 2 ? accent : primary, 0x60), blur: 24 }] } });
      }
      children.push({ type: 'path', path: 'M 40 90 C 150 10 250 170 360 90 C 470 10 570 170 660 90',
        color: alpha(primaryLight, 0x55), strokeWidth: 3, width: 700, height: 180,
        alignment: 'center', offsetY: 150 });
      children.push(micro('SINE  /  PHASE', accent));
      return { type: 'stack', fit: 'expand', children: children };
    }
    // 8 — letter reveal.
    function e8(f, a) {
      var word = T.wordEffects || 'EFFECTS';
      var children = [];
      var step = portrait ? 104 : 132;
      var startX = -(word.length - 1) * step / 2;
      for (var i = 0; i < word.length; i++) {
        var p = staggerItem(f, i, 0, 3, 13);
        children.push({ type: 'text', text: word.charAt(i), alignment: 'center',
          offsetX: startX + i * step, offsetY: 12 + (1 - eo3(p)) * 70, opacity: p,
          style: { fontSize: portrait ? 124 : 154, color: i === 0 || i === word.length - 1 ? primaryLight : ink,
            fontFamily: yoclipFont(), fontWeight: 700,
            shadows: [{ color: alpha(primary, 0x80), blur: 26 }] } });
      }
      children.push({ type: 'container', width: (word.length - 1) * step * ease(f, 2, 28, eo3), height: 3,
        borderRadius: 2, color: accent, alignment: 'center', offsetY: 126 });
      children.push(micro('STAGGER  /  003', primaryLight));
      return { type: 'stack', fit: 'expand', children: children };
    }
    // 9 — spectrum.
    function e9(f, a) {
      var children = [];
      var n = portrait ? 28 : 44;
      var bw = portrait ? 16 : 14;
      var gap = 10;
      var total = n * bw + (n - 1) * gap;
      var x0 = -total / 2 + bw / 2;
      for (var i = 0; i < n; i++) {
        var h = 36 + 210 * Math.abs(Math.sin(f * 0.20 + i * 0.53))
          + 80 * Math.abs(Math.sin(f * 0.37 + i * 1.31));
        var col = i % 4 === 0 ? accent : (i % 2 ? primaryLight : primary);
        children.push({ type: 'container', width: bw, height: h, borderRadius: 7,
          color: col, alignment: 'center', offsetX: x0 + i * (bw + gap), offsetY: 22,
          shadow: { color: alpha(col, 0x70), blur: 14 } });
      }
      children.push({ type: 'container', width: total + 30, height: 1, color: alpha(ink, 0x24), alignment: 'center', offsetY: 22 });
      children.push(micro('AUDIO  /  REACTIVE', accent));
      return { type: 'stack', fit: 'expand', children: children };
    }

    var effects = [e0, e1, e2, e3, e4, e5, e6, e7, e8, e9];
    var stageChildren = [];
    for (var g = -4; g <= 4; g++) {
      stageChildren.push({ type: 'container', width: 1, height: portrait ? 900 : 600,
        color: alpha(ink, 0x05), alignment: 'center', offsetX: g * 160 });
    }
    for (var h = -1; h <= 1; h++) {
      stageChildren.push({ type: 'container', width: portrait ? 940 : 1500, height: 1,
        color: alpha(ink, 0x05), alignment: 'center', offsetY: h * 160 });
    }

    for (var i = 0; i < effects.length; i++) {
      // Editorial cuts, not double-exposed demos: only one effect owns the
      // stage at a time. A five-frame luminance ramp softens each cut.
      var start = TITLE + i * SLOT;
      var f = frame - start;
      if (f < 0 || (i < 9 && f >= SLOT)) continue;
      var a = 0.25 + 0.75 * eo3(seg(f, 0, 5));
      stageChildren.push({
        type: 'stack', fit: 'expand', opacity: a,
        children: [
          effects[i](f, a),
          { type: 'text', text: pad2(i + 1) + '  /  ' + names[i].toUpperCase(),
            alignment: 'topLeft', offsetX: 28, offsetY: 24,
            style: { fontSize: 17, color: ink, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 3 } },
          { type: 'text', text: 'FX ENGINE', alignment: 'topRight', offsetX: -28, offsetY: 25,
            style: { fontSize: 15, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 3 } },
        ],
      });
    }

    var active = Math.max(0, Math.min(9, Math.floor((frame - TITLE) / SLOT)));
    var nav = [];
    for (var n = 0; n < 10; n++) {
      var on = n === active;
      var chip = {
        type: 'container', width: portrait ? 72 : 112, height: 42, borderRadius: 12,
        borderColor: on ? alpha(primaryLight, 0x80) : alpha(C.textMuted, 0x24), borderWidth: 1,
        opacity: ease(frame, 8 + n * 2, 28 + n * 2, eo3),
        child: { type: 'text', text: pad2(n + 1), alignment: 'center',
          style: { fontSize: 16, color: on ? '#ffffff' : C.textMuted, fontFamily: yoclipFont(), fontWeight: 700, letterSpacing: 2 } },
      };
      if (on) chip.gradient = { colors: [primary, accent], begin: 'centerLeft', end: 'centerRight' };
      else chip.color = alpha(C.surface, 0xd0);
      nav.push(chip);
    }

    var stageIn = ease(frame, 0, 24, eo3);
    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        { type: 'text', text: T.title || '10 effects, one engine', alignment: 'topCenter',
          offsetY: portrait ? 130 : 70, opacity: ease(frame, 0, 26, eo3),
          style: { fontSize: portrait ? 58 : 70, color: ink, fontFamily: yoclipFont(), fontWeight: 700 } },
        { type: 'text', text: T.caption || 'TEN LOOKS  /  ONE SCENE GRAPH  /  ZERO PLUG-INS', alignment: 'topCenter',
          offsetY: portrait ? 212 : 158, opacity: ease(frame, 0, 26, eo3),
          style: { fontSize: portrait ? 18 : 17, color: C.textMuted, fontFamily: yoclipFont(), letterSpacing: 4 } },
        { type: 'container', width: portrait ? 940 : 1500, height: portrait ? 900 : 600,
          borderRadius: 28, clip: true,
          gradient: { colors: [alpha(C.surface, 0xe8), alpha(C.backgroundDeep, 0xf2)], begin: 'topLeft', end: 'bottomRight' },
          borderColor: alpha(primaryLight, 0x34), borderWidth: 1,
          shadow: { color: alpha(primary, 0x48), blur: 60, offsetY: 28 },
          alignment: 'center', offsetY: portrait ? 40 : 82,
          opacity: stageIn, scale: 0.975 + 0.025 * stageIn,
          child: { type: 'stack', fit: 'expand', children: stageChildren } },
        { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: 10,
          alignment: 'center', offsetY: portrait ? 590 : 500, children: nav },
      ],
    };
  },
};
