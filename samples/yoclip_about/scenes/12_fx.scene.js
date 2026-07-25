// Promo scene — FX reel. Ten bite-sized visual effects, one after another, all
// built from the same primitive node types every user scene has. Sells that the
// engine ships real motion-design tricks (inspired by the Remotion effects
// catalog) without any per-effect code: vignette, scanlines, light leak, rings,
// starburst, chromatic aberration, shine, wave text, letter reveal, spectrum.

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
    var primary = C.primary || yoclipColor('primary', '#7c3aed');
    var primaryLight = C.primaryLight || yoclipColor('lavender', '#a78bfa');
    var accent = C.accent || yoclipColor('cyan', '#22d3ee');
    var text = C.text || yoclipColor('white', '#ffffff');
    var life = presence(frame, 12, 384, 12);
    // Portrait variants (e.g. shorts 1080x1920) re-compose: full-width
    // overlays shrink to the narrower frame, effect stage scales up to use
    // the vertical room, and the title/labels tuck into the tall canvas.
    var portrait = yoclipIsPortrait();

    var TITLE = 46;
    var SLOT = 34; // frames per effect
    var names = T.names || [
      'vignette', 'scanlines', 'light leak', 'rings', 'starburst',
      'chromatic', 'shine', 'wave text', 'letter reveal', 'spectrum',
    ];

    function logo(w, h, op) {
      var k = portrait ? 1.3 : 1;
      return {
        type: 'image', source: yoclipLogoSource(), fit: 'contain',
        width: w * k, height: h * k, alignment: 'center', opacity: op == null ? 1 : op,
      };
    }
    function label(name) {
      return {
        type: 'text', text: name, alignment: 'bottomCenter', offsetY: portrait ? -260 : -150,
        style: { fontSize: yoclipSize('captionLg', 30), color: primaryLight, fontFamily: yoclipFont(), fontWeight: 600, letterSpacing: 6 },
      };
    }
    function win(i, node) {
      var s = TITLE + i * SLOT;
      var f = frame - s;
      var a = presence(f, 6, 22, 6);
      if (a <= 0) return null;
      return {
        type: 'stack', fit: 'expand', opacity: a,
        children: [ node(f, a), label(names[i]) ],
      };
    }

    // 0 — vignette: logo under a radial dark-edge overlay that breathes.
    function e0(f, a) {
      var breathe = 0.55 + 0.15 * shimmer(f, 24);
      return {
        type: 'stack', fit: 'expand',
        children: [
          logo(360, 230, 1),
          {
            type: 'container', alignment: 'center',
            gradient: {
              type: 'radial', center: 'center', radius: 0.72,
              colors: [yoclipColorA('ink', 0x00), yoclipColorA('ink', 0x00), (C.background || yoclipColor('midnight', '#0a0a12')) + 'CC'],
              stops: [0.0, breathe, 1.0],
            },
          },
        ],
      };
    }
    // 1 — scanlines / CRT over the logo, slowly scrolling.
    function e1(f, a) {
      var lines = [];
      var off = (f * 3) % 14;
      var count = portrait ? 140 : 70;
      for (var i = 0; i < count; i++) {
        lines.push({
          type: 'container', width: portrait ? 1080 : 1920, height: 3,
          color: yoclipColor('white', '#ffffff'), opacity: 0.05,
          offsetY: i * 14 + off - 40,
        });
      }
      return {
        type: 'stack', fit: 'expand',
        children: [
          logo(360, 230, 1),
          { type: 'stack', fit: 'expand', children: lines },
        ],
      };
    }
    // 2 — light leak: warm gradient band sweeping across.
    function e2(f, a) {
      var x = lerp(-900, 900, ease(f, 2, 30, eio3));
      return {
        type: 'stack', fit: 'expand',
        children: [
          logo(360, 230, 1),
          {
            type: 'container', width: 720, height: portrait ? 1920 : 1080, alignment: 'center',
            offsetX: x, rotation: 18,
            gradient: {
              colors: [yoclipColorA('ink', 0x00), yoclipColor('warnSoft', '#ffb86b66'), yoclipColor('warnTint', '#ffd9a0aa'), yoclipColor('warnSoft', '#ffb86b66'), yoclipColorA('ink', 0x00)],
              stops: [0.0, 0.35, 0.5, 0.65, 1.0],
              begin: 'centerLeft', end: 'centerRight',
            },
          },
        ],
      };
    }
    // 3 — rings: concentric ripples from the logo center.
    function e3(f, a) {
      var rings = [ logo(300, 190, 1) ];
      for (var i = 0; i < 4; i++) {
        var p = seg(f, i * 6, 30);
        var sc = lerp(0.3, 3.4, eo3(p));
        var op = (1 - p) * 0.7;
        rings.push({
          type: 'container', width: 240, height: 240, borderRadius: 120,
          borderColor: i % 2 ? accent : primaryLight, borderWidth: 3,
          alignment: 'center', scale: sc, opacity: op,
        });
      }
      return { type: 'stack', fit: 'expand', children: rings };
    }
    // 4 — starburst: particles flying out from center.
    function e4(f, a) {
      var parts = [ logo(260, 166, 1) ];
      var n = 18;
      var fly = ease(f, 2, 30, eo3);
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * 6.28318 + (i % 3) * 0.2;
        var r = lerp(0, 460, fly);
        var pal = i % 3 === 0 ? primaryLight : (i % 3 === 1 ? accent : text);
        parts.push({
          type: 'container', width: 12, height: 12, borderRadius: 6,
          color: pal, alignment: 'center',
          offsetX: Math.cos(ang) * r,
          offsetY: Math.sin(ang) * r,
          opacity: 1 - fly,
          scale: 1.5 - 0.7 * fly,
        });
      }
      return { type: 'stack', fit: 'expand', children: parts };
    }
    // 5 — chromatic aberration: RGB-split headline.
    function e5(f, a) {
      var split = lerp(0, 16, ease(f, 2, 16, eo3)) * (0.6 + 0.4 * shimmer(f, 8));
      function ch(color, dx) {
        return {
          type: 'text', text: 'FX', alignment: 'center', offsetX: dx,
          style: { fontSize: yoclipSize('hero', 220), color: color, fontFamily: yoclipFont(), fontWeight: 700 },
          opacity: 0.72,
        };
      }
      return {
        type: 'stack', fit: 'expand',
        children: [
          ch(yoclipColor('bad', '#ff3b5c'), -split),
          ch(accent, split),
          { type: 'text', text: 'FX', alignment: 'center',
            style: { fontSize: yoclipSize('hero', 220), color: text, fontFamily: yoclipFont(), fontWeight: 700 } },
        ],
      };
    }
    // 6 — shine: bright band clipped to the logo, sweeping across.
    function e6(f, a) {
      var x = lerp(portrait ? -680 : -520, portrait ? 680 : 520, ease(f, 2, 30, eio3));
      return {
        type: 'container', width: portrait ? 600 : 460, height: portrait ? 378 : 290, alignment: 'center', clip: true,
        child: {
          type: 'stack', fit: 'expand',
          children: [
            logo(460, 290, 1),
            {
              type: 'container', width: 120, height: portrait ? 420 : 320, offsetX: x, rotation: 16,
              gradient: {
                colors: [yoclipColorA('ink', 0x00), yoclipColorA('white', 0x00), yoclipColor('cream', '#ffffffcc'), yoclipColorA('white', 0x00), yoclipColorA('ink', 0x00)],
                stops: [0.0, 0.4, 0.5, 0.6, 1.0],
                begin: 'centerLeft', end: 'centerRight',
              },
            },
          ],
        },
      };
    }
    // 7 — wave text: letters ride a sine.
    function e7(f, a) {
      var word = 'yoclip';
      var letters = [];
      var step = 78;
      var startX = -(word.length - 1) * step / 2;
      for (var i = 0; i < word.length; i++) {
        var y = Math.sin(f * 0.32 + i * 0.85) * 26;
        letters.push({
          type: 'text', text: word.charAt(i), alignment: 'center',
          offsetX: startX + i * step, offsetY: y,
          style: { fontSize: yoclipSize('title', 120), color: i % 2 ? accent : text, fontFamily: yoclipFont(), fontWeight: 700 },
        });
      }
      return { type: 'stack', fit: 'expand', children: letters };
    }
    // 8 — letter reveal: staggered rise + opacity.
    function e8(f, a) {
      var word = 'EFFECTS';
      var letters = [];
      var step = 96;
      var startX = -(word.length - 1) * step / 2;
      for (var i = 0; i < word.length; i++) {
        var p = staggerItem(f, i, 2, 5, 14);
        letters.push({
          type: 'text', text: word.charAt(i), alignment: 'center',
          offsetX: startX + i * step, offsetY: (1 - eo3(p)) * 40,
          opacity: p,
          style: {
            fontSize: yoclipSize('titleSm', 110), color: text, fontFamily: yoclipFont(), fontWeight: 700,
            shadows: [{ color: primary, blur: 24 }],
          },
        });
      }
      return { type: 'stack', fit: 'expand', children: letters };
    }
    // 9 — spectrum: fake audio-reactive equalizer bars.
    function e9(f, a) {
      var bars = [];
      var n = 26;
      var bw = 16;
      var gap = 14;
      var total = n * (bw + gap);
      var x0 = -total / 2;
      for (var i = 0; i < n; i++) {
        var h = 30 + 150 * Math.abs(Math.sin(f * 0.22 + i * 0.62))
          + 60 * Math.abs(Math.sin(f * 0.41 + i * 1.7));
        var col = i % 3 === 0 ? primaryLight : (i % 3 === 1 ? accent : primary);
        bars.push({
          type: 'container', width: bw, height: h, borderRadius: 8,
          color: col, alignment: 'bottomCenter',
          offsetX: x0 + i * (bw + gap), offsetY: -40,
          shadow: { color: col, blur: 16 },
        });
      }
      return { type: 'stack', fit: 'expand', children: bars };
    }

    var effects = [e0, e1, e2, e3, e4, e5, e6, e7, e8, e9];
    var children = [
      {
        type: 'text', text: '10 effects, one engine',
        alignment: 'topCenter', offsetY: portrait ? 180 : 70,
        opacity: ease(frame, 0, 26, eo3),
        style: { fontSize: portrait ? 58 : yoclipSize('h5', 72), color: text, fontFamily: yoclipFont(), fontWeight: 700 },
      },
    ];
    for (var i = 0; i < effects.length; i++) {
      var node = win(i, effects[i]);
      if (node) children.push(node);
    }

    return { type: 'stack', fit: 'expand', opacity: life, children: children };
  },
};
