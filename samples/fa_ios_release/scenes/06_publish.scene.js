// 06 — Publish — widget catalog + one-tap publish (192 frames, 4 bars)
//
// Mini widget cards cascade in like an iOS widget stack, then the publish
// pill fires: "Your apps. Your users. fa1.dev".

scene = {
  id: '06_publish',
  duration: 192,
  from: 1382,
  timeline: {
    label: 'Publish',
    color: '#2EBD9E',
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

    var titleIn = expoOut(clamp01((frame - 4) / 12));
    kids.push(faText('PUBLISH TO THE WIDGET CATALOG.', {
      width: F.W,
      opacity: clamp01(titleIn * 1.2),
      offsetY: 16 * (1 - titleIn),
      style: {
        fontSize: isP ? Math.round(m * 0.054) : Math.round(m * 0.038),
        fontFamily: 'Impact',
        fontWeight: '700',
        color: T.text,
        textAlign: 'center',
        letterSpacing: 2.5,
        gradient: {
          begin: 'topCenter',
          end: 'bottomCenter',
          colors: T.isLight
            ? ['#3C4043', '#0B0F19']
            : ['#FFFFFF', '#ECECEF', '#9E9EA8'],
          stops: T.isLight ? [0.0, 1.0] : [0.0, 0.45, 1.0],
        },
      },
      positioned: { left: 0, top: isP ? F.H * 0.065 : F.H * 0.08 },
    }));

    // ---- Widget catalog grid -----------------------------------------------
    var widgets = [
      { g: 'NOTES', v: '12', c: 'violet' },
      { g: 'WEATHER', v: '21°', c: 'teal' },
      { g: 'HABITS', v: '5/7', c: 'teal' },
      { g: 'WALLET', v: '$420', c: 'violet' },
      { g: 'TIMER', v: '07:32', c: 'teal' },
      { g: 'PHOTOS', v: '1.2k', c: 'violet' },
    ];
    var cols = 3;
    var rows = 2;
    var gap = isP ? F.W * 0.045 : F.W * 0.025;
    var gridW = isP ? F.W * 0.88 : Math.min(F.W * 0.72, 1200);
    var wW = (gridW - gap * (cols - 1)) / cols;
    var wH = isP ? wW * 0.92 : F.H * 0.24;
    var x0 = cx - gridW / 2;
    var y0 = isP ? F.H * 0.175 : F.H * 0.22;

    for (var i = 0; i < widgets.length; i++) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var px = x0 + col * (wW + gap);
      var py = y0 + row * (wH + gap);
      // Cascade: column-major stagger, one per beat half
      var inAt = 12 + (col * rows + row) * 10;
      var wIn = backOut(clamp01((frame - inAt) / 12));
      if (wIn <= 0.003) continue;

      var tint = widgets[i].c === 'teal' ? T.teal : T.violet;
      var live = frame > 130; // "published" state: teal ring + check

      kids.push(faRRect(wW, wH, 24, T.card, {
        opacity: wIn,
        border: { color: live ? T.teal : T.border, width: live ? 2 : 1.5 },
        offsetY: 20 * (1 - wIn),
        positioned: { left: px, top: py },
      }));
      kids.push(faRRect(14, 14, 7, tint, {
        opacity: wIn,
        positioned: { left: px + 24, top: py + 24 },
      }));
      kids.push(faText(widgets[i].g, {
        opacity: wIn * 0.85,
        style: {
          fontSize: Math.max(16, Math.round(wW * 0.09)),
          fontFamily: 'monospace',
          fontWeight: '700',
          color: T.dim,
          letterSpacing: 2,
        },
        positioned: { left: px + 50, top: py + 20 },
      }));
      kids.push(faText(widgets[i].v, {
        opacity: wIn,
        style: {
          fontSize: Math.max(30, Math.round(wW * 0.22)),
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
        },
        positioned: { left: px + 24, top: py + wH * 0.42 },
      }));

      if (live) {
        var ck = backOut(clamp01((frame - 134) / 8));
        kids.push(faRRect(34, 34, 17, T.teal, {
          opacity: clamp01(ck),
          positioned: { left: px + wW - 56, top: py + 18 },
        }));
        kids.push(checkNode(px + wW - 39, py + 35, 24,
          T.isLight ? '#FFFFFF' : '#05070D', ck, clamp01(ck)));
      }
    }

    // ---- Publishing beam: grid -> catalog transfer ---------------------------
    var beamW = gridW * 0.72;
    var beamX = cx - beamW / 2;
    var beamY = isP ? F.H * 0.545 : F.H * 0.50;
    var beamIn = clamp01((frame - 100) / 10);
    if (beamIn > 0.01) {
      var bp2 = clamp01((frame - 104) / 30);
      var bpe = bp2 * bp2 * (3 - 2 * bp2);
      kids.push(faRRect(beamW, 12, 6, T.surface2, {
        opacity: beamIn,
        border: { color: T.border, width: 1 },
        positioned: { left: beamX, top: beamY },
      }));
      if (bpe > 0.001) {
        kids.push(faRRect(Math.max(12, beamW * bpe), 12, 6, T.teal, {
          opacity: beamIn,
          positioned: { left: beamX, top: beamY },
        }));
        if (bpe < 1) {
          kids.push({ type: 'circle', size: 26, fill: T.tealBright,
            opacity: 0.85 * beamIn, blur: 9,
            positioned: { left: beamX + beamW * bpe - 13, top: beamY - 7 } });
        }
      }
      // Status line under the beam
      var live2 = frame >= 134;
      kids.push(faText(live2
        ? 'PUBLISHED — LIVE IN THE CATALOG'
        : 'PUBLISHING TO CATALOG · ' + Math.round(bpe * 100) + '%', {
        width: beamW,
        opacity: beamIn * (live2 ? 0.95 : 0.7),
        style: {
          fontSize: isP ? 24 : 22,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: live2 ? T.teal : T.dim,
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: beamX, top: beamY + 30 },
      }));
    }

    // ---- Publish pill -------------------------------------------------------
    var pIn = expoOut(clamp01((frame - 140) / 14));
    if (pIn > 0.003) {
      var pillW = isP ? F.W * 0.86 : 700;
      var pillH = 88;
      var pillX = cx - pillW / 2;
      var pillY = isP ? F.H * 0.745 : F.H * 0.71;
      var glow = 0.5 + 0.2 * Math.sin(frame * 0.5);

      kids.push(faRRect(pillW, pillH, pillH / 2, T.violet, {
        opacity: 0.25 * glow * pIn,
        blur: 34,
        positioned: { left: pillX, top: pillY },
      }));
      kids.push(faRRect(pillW, pillH, pillH / 2, T.violetDeep, {
        opacity: pIn,
        positioned: { left: pillX, top: pillY },
      }));
      kids.push({ type: 'circle', size: 14, fill: '#FFFFFF', opacity: 0.92 * pIn,
        positioned: { left: pillX + 34, top: pillY + pillH / 2 - 7 } });
      kids.push(faText('LIVE FOR ALL FA USERS', {
        opacity: pIn,
        style: {
          fontSize: isP ? 30 : 30,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: '#FFFFFF',
          letterSpacing: 3,
        },
        positioned: { left: pillX + (isP ? 62 : 70), top: pillY + 26 },
      }));
    }

    // Footnote
    var fIn = tw(158, 12, 0, 1, 'easeOut');
    kids.push(faText('YOUR APPS. YOUR USERS. SHARE VIA GITHUB.', {
      width: F.W,
      opacity: fIn * 0.75,
      style: {
        fontSize: isP ? 21 : 20,
        fontFamily: 'monospace',
        color: T.faint,
        textAlign: 'center',
        letterSpacing: 2.5,
      },
      positioned: { left: 0, top: isP ? F.H * 0.855 : F.H * 0.835 },
    }));

    // Exit dip: dissolve to the shared bg tone (leads into 07_lockup)
    var ex = clamp01((frame - 178) / 14);
    if (ex > 0.003) {
      var exa = Math.round(ex * 255).toString(16).padStart(2, '0');
      var exb = T.bg.replace('#', '').toUpperCase();
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + exa + exb });
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
