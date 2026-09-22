// 05 — Build — generation montage: 4 apps building in parallel
// (240 frames, 5 bars)
//
// Cards stagger in on beats; each builds a different real app with a
// progress bar and flickering compile log lines.

scene = {
  id: '05_build',
  duration: 240,
  from: 1118,
  timeline: {
    label: 'Build',
    color: '#5B61F6',
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

    // No full-frame background — broll_05_build_montage paints it
    // underneath (slot plate now, dim coding-montage video later).

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    var titleIn = expoOut(clamp01((frame - 4) / 12));
    kids.push(faText('WATCH FA BUILD.', {
      width: F.W,
      opacity: clamp01(titleIn * 1.2),
      offsetY: 16 * (1 - titleIn),
      style: {
        fontSize: isP ? Math.round(m * 0.056) : Math.round(m * 0.040),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        textAlign: 'center',
        letterSpacing: 3,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: T.isLight
            ? ['#3C4043', '#0B0F19']
            : ['#FFFFFF', '#ECECEF', '#9E9EA8'],
          stops: T.isLight ? [0.0, 1.0] : [0.0, 0.45, 1.0],
        },
      },
      positioned: { left: 0, top: isP ? F.H * 0.055 : F.H * 0.075 },
    }));

    var apps = [
      { name: 'LISTKIT', kind: 'SHOPPING LIST', tint: 'teal',
        log: ['flutter listview + sqlite', 'widget: quick add'] },
      { name: 'HYPE TYPE', kind: 'MARKETING CONTENT', tint: 'violet',
        log: ['llm prompt pipeline', 'share card export'] },
      { name: 'LINGO COACH', kind: 'LEARN ENGLISH', tint: 'teal',
        log: ['tts + spaced repetition', 'on-device llm'] },
      { name: 'VOXEL RUN', kind: '3D GAME', tint: 'violet',
        log: ['flame3d renderer 60fps', 'haptic gamepad'] },
    ];

    // Grid geometry
    var cols = isP ? 2 : 4;
    var rows = isP ? 2 : 1;
    var gap = isP ? F.W * 0.04 : F.W * 0.02;
    var gridW = isP ? F.W * 0.90 : F.W * 0.90;
    var cardW = (gridW - gap * (cols - 1)) / cols;
    var cardH = isP ? (F.H * 0.72 - gap) / 2 : F.H * 0.52;
    var x0 = cx - gridW / 2;
    var y0 = isP ? F.H * 0.15 : F.H * 0.24;

    for (var i = 0; i < apps.length; i++) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var px = x0 + col * (cardW + gap);
      var py = y0 + row * (cardH + gap);
      var inAt = 12 + i * 14;
      var buildStart = inAt + 10;
      var cIn = tw(inAt, 12, 0, 1, 'easeOut');
      if (cIn <= 0.003) continue;

      var tint = apps[i].tint === 'teal' ? T.teal : T.violet;
      var fs = Math.max(18, Math.round(cardW * 0.075));

      kids.push(faRRect(cardW, cardH, 24, T.card, {
        opacity: cIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 22 * (1 - cIn),
        positioned: { left: px, top: py },
      }));
      kids.push(faRRect(cardW - 48, 8, 4, tint, {
        opacity: 0.9 * cIn,
        positioned: { left: px + 24, top: py },
      }));

      kids.push(faText(apps[i].name, {
        opacity: cIn,
        style: {
          fontSize: fs + 6,
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
          letterSpacing: 1.5,
        },
        positioned: { left: px + 28, top: py + 26 },
      }));
      kids.push(faText(apps[i].kind, {
        opacity: cIn * 0.6,
        style: {
          fontSize: Math.max(14, fs - 8),
          fontFamily: 'monospace',
          color: T.dim,
          letterSpacing: 2,
        },
        positioned: { left: px + 28, top: py + 26 + fs + 14 },
      }));

      // Mini app-UI skeleton — the app "taking shape" while it builds
      var skX = px + 28;
      var skY = py + cardH * 0.215;
      var skW = cardW - 56;
      var skH = cardH * 0.20;
      kids.push(faRRect(skW, skH, 14, T.surface2, {
        opacity: 0.5 * cIn,
        border: { color: T.border, width: 1 },
        positioned: { left: skX, top: skY },
      }));
      // toolbar: traffic dot + title hairline
      kids.push(faRRect(12, 12, 6, tint, { opacity: 0.5 * cIn,
        positioned: { left: skX + 16, top: skY + 14 } }));
      kids.push(faRRect(skW * 0.30, 8, 4, T.dim, { opacity: 0.35 * cIn,
        positioned: { left: skX + 38, top: skY + 16 } }));
      // content rows shimmer in with the build
      var skRows = [0.82, 0.58, 0.70];
      for (var ski = 0; ski < skRows.length; ski++) {
        var skIn = clamp01((frame - buildStart - 6 - ski * 10) / 8);
        if (skIn <= 0.01) continue;
        var skShim = done ? 0.5 : (0.32 + 0.25 * prand(frame + i * 11 + ski * 29));
        kids.push(faRRect(skW * skRows[ski] * skIn, skH * 0.16,
          skH * 0.08, T.dim, {
          opacity: skShim * cIn * skIn,
          positioned: { left: skX + 16, top: skY + 36 + ski * (skH * 0.20) },
        }));
      }

      // Compile log lines (flicker while building)
      var pct = clamp01((frame - buildStart) / 150);
      var done = pct >= 0.999;
      for (var li = 0; li < apps[i].log.length; li++) {
        var lIn = frame >= buildStart + li * 22 ? 1 : 0;
        if (lIn > 0) {
          var flick = done ? 1 : (0.55 + 0.45 * prand(frame + i * 7 + li * 13));
          kids.push(faText('> ' + apps[i].log[li], {
            opacity: cIn * flick * 0.8,
            style: {
              fontSize: Math.max(14, fs - 10),
              fontFamily: 'monospace',
              color: T.teal,
            },
            positioned: { left: px + 28, top: py + cardH * 0.46 + li * (fs - 2) },
          }));
        }
      }

      // Progress bar
      var barW = cardW - 56;
      var barY = py + cardH - 62;
      kids.push(faRRect(barW, 14, 7, T.surface2, {
        opacity: cIn,
        border: { color: T.border, width: 1 },
        positioned: { left: px + 28, top: barY },
      }));
      if (pct > 0.001) {
        kids.push(faRRect(Math.max(14, barW * pct), 14, 7, tint, {
          opacity: cIn,
          positioned: { left: px + 28, top: barY },
        }));
      }

      // Percent / DONE label
      var label = done ? 'DONE — INSTALLED' : Math.round(pct * 100) + '%';
      kids.push(faText(label, {
        opacity: cIn * 0.9,
        style: {
          fontSize: Math.max(15, fs - 8),
          fontFamily: 'monospace',
          fontWeight: '700',
          color: done ? tint : T.dim,
          letterSpacing: 1.5,
        },
        positioned: { left: px + 28, top: barY - 34 },
      }));

      // Done burst ring
      if (done) {
        var bp = clamp01((frame - buildStart - 150) / 20);
        if (bp > 0 && bp < 1) {
          kids.push({
            type: 'circle',
            size: 90 + bp * 90,
            fill: tint,
            opacity: (1 - bp) * 0.35 * cIn,
            blur: 6,
            positioned: {
              left: px + cardW - 80 - (90 + bp * 90) / 2,
              top: py + 20 - (90 + bp * 90) / 2 + 30,
            },
          });
        }
        var cbx = px + cardW - 52;
        var cby = py + 42;
        kids.push({ type: 'circle', size: 44, fill: tint, opacity: 0.16 * cIn,
          positioned: { left: cbx - 22, top: cby - 22 } });
        kids.push(checkNode(cbx, cby, 28, tint, bp, cIn));
      }
    }

    // Exit dip: dissolve to the shared bg tone (leads into 06_publish)
    var ex = clamp01((frame - 226) / 14);
    if (ex > 0.003) {
      var exa = Math.round(ex * 255).toString(16).padStart(2, '0');
      var exb = T.bg.replace('#', '').toUpperCase();
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + exa + exb });
    }

    // Footer ticker
    var fIn = tw(180, 14, 0, 1, 'easeOut');
    kids.push(faText('FOUR APPS. ONE PROMPT EACH. ZERO LAPTOPS.', {
      width: F.W,
      opacity: fIn * 0.8,
      style: {
        fontSize: isP ? 22 : 21,
        fontFamily: 'monospace',
        color: T.dim,
        textAlign: 'center',
        letterSpacing: 2.5,
      },
      positioned: { left: 0, top: isP ? F.H * 0.925 : F.H * 0.86 },
    }));

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
