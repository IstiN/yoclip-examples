// 05 — Build — generation montage: 4 apps building in parallel
// (240 frames, 5 bars)
//
// Cards stagger in on beats; each builds a different real app with a
// progress bar and flickering compile log lines.

scene = {
  id: '05_build',
  duration: 240,
  from: 698,
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
    kids.push(faRRect(F.W, F.H, 0, T.bg));

    var isP = F.portrait;
    var m = Math.min(F.W, F.H);
    var cx = F.cx;

    var titleIn = tw(4, 12, 0, 1, 'easeOutExpo');
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
        log: ['swiftui list + coredata', 'widget: quick add'] },
      { name: 'HYPE TYPE', kind: 'MARKETING CONTENT', tint: 'violet',
        log: ['llm prompt pipeline', 'share sheet export'] },
      { name: 'LINGO COACH', kind: 'LEARN ENGLISH', tint: 'teal',
        log: ['tts + spaced repetition', 'on-device ml kit'] },
      { name: 'VOXEL RUN', kind: '3D GAME', tint: 'violet',
        log: ['metal renderer 60fps', 'haptic gamepad'] },
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
      var cIn = tw(inAt, 12, 0, 1, 'easeOutCubic');
      if (cIn <= 0.003) continue;

      var tint = apps[i].tint === 'teal' ? T.teal : T.violet;
      var fs = Math.max(18, Math.round(cardW * 0.075));

      kids.push(faRRect(cardW, cardH, 24, T.card, {
        opacity: cIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 22 * (1 - cIn),
        positioned: { left: px, top: py },
      }));
      kids.push(faRRect(cardW, 8, 4, tint, {
        opacity: 0.9 * cIn,
        positioned: { left: px, top: py },
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

      // Compile log lines (flicker while building)
      var buildStart = inAt + 10;
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
            color: tint,
            opacity: (1 - bp) * 0.35 * cIn,
            blur: 6,
            positioned: {
              left: px + cardW - 80 - (90 + bp * 90) / 2,
              top: py + 20 - (90 + bp * 90) / 2 + 30,
            },
          });
        }
        kids.push(faText('✓', {
          opacity: cIn,
          style: {
            fontSize: 40, fontFamily: 'monospace', fontWeight: '800', color: tint,
          },
          positioned: { left: px + cardW - 72, top: py + 22 },
        }));
      }
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
