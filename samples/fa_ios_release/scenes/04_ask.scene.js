// 04 — Ask — chat: "Can you build ANY app?" → native engine answer
// (192 frames, 4 bars)
//
// iMessage-style bubbles: user right (violet), Fa left (surface + teal).
// Answer bullets stagger in: Flutter draw engine, zero HTML, sqlite,
// Flame3D games, keychain keys.

scene = {
  id: '04_ask',
  duration: 192,
  from: 806,
  timeline: {
    label: 'Ask',
    color: '#8F6BFF',
    lane: 'video',
  },

  render: function(frame) {
    var ms = elapsedMs(frame, 30);
    var T = faTheme();
    var F = faFormat();

    function tw(at, dur, from, to, easing) {
      return jsr.motion.tween(ms, at * 1000 / 30, dur * 1000 / 30, from, to, easing);
    }

    var kids = [];
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    // Header chip: conversation id
    var hdIn = tw(4, 10, 0, 1, 'easeOut');
    kids.push(faText('FA · SECURE CHAT // END-TO-END', {
      width: F.W,
      opacity: hdIn * 0.7,
      style: {
        fontSize: isP ? 20 : 19,
        fontFamily: 'monospace',
        color: T.faint,
        textAlign: 'center',
        letterSpacing: 3,
      },
      positioned: { left: 0, top: isP ? F.H * 0.055 : F.H * 0.07 },
    }));

    var chatW = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var x0 = cx - chatW / 2;

    // ---- User bubble (right, violet) --------------------------------------
    var qIn = tw(12, 12, 0, 1, 'easeOutBack');
    var qY = isP ? F.H * 0.115 : F.H * 0.14;
    if (qIn > 0.003) {
      var qText = 'Can you build ANY app and run it natively on my iPhone?';
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn * 0.35,
        blur: 24,
        positioned: { left: x0 + chatW * 0.22 - 10, top: qY - 8 },
      }));
      kids.push(faRRect(chatW * 0.78, 118, 26, T.violetDeep, {
        opacity: qIn,
        offsetY: 16 * (1 - qIn),
        positioned: { left: x0 + chatW * 0.22, top: qY },
      }));
      kids.push(faText(qText, {
        width: chatW * 0.78 - 56,
        opacity: qIn,
        style: {
          fontSize: isP ? 27 : 28,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0,
        },
        positioned: { left: x0 + chatW * 0.22 + 28, top: qY + 26 },
      }));
    }

    // ---- Typing indicator (Fa is "thinking") -------------------------------
    if (frame >= 34 && frame < 58) {
      var tIn = tw(34, 8, 0, 1, 'easeOut');
      var dotY = isP ? F.H * 0.30 : F.H * 0.36;
      kids.push(faRRect(150, 64, 32, T.card, {
        opacity: tIn,
        border: { color: T.border, width: 1.5 },
        positioned: { left: x0, top: dotY },
      }));
      for (var d = 0; d < 3; d++) {
        var bounce = Math.max(0, Math.sin(frame * 0.5 - d * 0.9)) * 5;
        kids.push({
          type: 'circle',
          size: 12,
          color: T.teal,
          opacity: tIn * 0.85,
          positioned: { left: x0 + 30 + d * 34, top: dotY + 26 - bounce },
        });
      }
    }

    // ---- Fa answer bubble (left, surface + teal border) --------------------
    var bullets = [
      { t: 'NATIVE DRAW ENGINE — FLUTTER @ 120 FPS.', c: 'violet' },
      { t: 'ZERO HTML WRAPPERS — PURE NATIVE VIEWS.', c: 'teal' },
      { t: 'SQLITE DATABASE — ALL DATA ON-DEVICE.', c: 'teal' },
      { t: 'FLAME3D — REAL 3D GAMES, NOT WEBGL.', c: 'violet' },
      { t: 'API KEYS LIVE IN YOUR KEYCHAIN. NEVER OURS.', c: 'teal' },
    ];
    var aIn = tw(58, 14, 0, 1, 'easeOutCubic');
    var aY = isP ? F.H * 0.30 : F.H * 0.36;
    var bGap = isP ? 62 : 58;
    var aH = 130 + bullets.length * bGap;

    if (aIn > 0.003) {
      kids.push(faRRect(chatW, aH + 60, 30, T.card, {
        opacity: aIn * 0.4,
        blur: 36,
        positioned: { left: x0 - 18, top: aY - 18 },
      }));
      kids.push(faRRect(chatW, aH + 60, 30, T.card, {
        opacity: aIn,
        border: { color: T.teal, width: 1.5 },
        offsetY: 20 * (1 - aIn),
        positioned: { left: x0, top: aY },
      }));

      // Fa avatar: mini Fa mark
      kids.push(faLogoSvgNode(x0 + 52, aY + 56, 56, aIn));
      kids.push(faText('Fa — iOS AGENT', {
        opacity: aIn * 0.9,
        style: {
          fontSize: isP ? 22 : 21,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: T.teal,
          letterSpacing: 2,
        },
        positioned: { left: x0 + 96, top: aY + 34 },
      }));
      kids.push(faText('VERIFIED · RUNS ON-DEVICE', {
        opacity: aIn * 0.55,
        style: {
          fontSize: isP ? 17 : 16,
          fontFamily: 'monospace',
          color: T.dim,
          letterSpacing: 1.5,
        },
        positioned: { left: x0 + 96, top: aY + 66 },
      }));

      for (var bi = 0; bi < bullets.length; bi++) {
        var bIn = tw(72 + bi * 14, 10, 0, 1, 'easeOut');
        var by = aY + 120 + bi * bGap;
        if (bIn > 0.01 && by + 40 < aY + aH + 40) {
          var bc = bullets[bi].c === 'violet' ? T.violet : T.teal;
          kids.push(faRRect(12, 12, 6, bc, {
            opacity: bIn,
            positioned: { left: x0 + 34, top: by + 10 },
          }));
          kids.push(faText(bullets[bi].t, {
            opacity: bIn * 0.92,
            style: {
              fontSize: isP ? 23 : 22,
              fontFamily: 'monospace',
              fontWeight: '600',
              color: T.text,
              letterSpacing: 0.5,
            },
            positioned: { left: x0 + 62, top: by },
          }));
        }
      }
    }

    // ---- Bottom reassurance line -------------------------------------------
    var rIn = tw(150, 14, 0, 1, 'easeOut');
    kids.push(faText('IF IT DRAWS IN SWIFTUI — FA CAN BUILD IT.', {
      width: F.W,
      opacity: rIn * 0.8,
      style: {
        fontSize: isP ? 22 : 21,
        fontFamily: 'monospace',
        color: T.dim,
        textAlign: 'center',
        letterSpacing: 2.5,
      },
      positioned: { left: 0, top: isP ? F.H * 0.86 : F.H * 0.85 },
    }));

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
