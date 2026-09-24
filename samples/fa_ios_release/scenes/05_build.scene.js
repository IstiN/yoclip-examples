// 05 — Build — three prompts, three apps (852 frames)
//
// The montage became a story, one beat per app:
//   1. photo chip + "I want my shopping list app"  -> LISTKIT (shopping list)
//   2. "and now improve my english"               -> LINGO COACH (tutor)
//   3. "make me a 2048 game"                      -> TWENTY48 (puzzle)
//
// Each beat (260 frames): the input bar parks on the rising keyboard, the
// prompt types itself with per-key presses, send fires, the bar dissolves,
// a violet dot flies to the centre and blooms into the app card; the UI
// materialises group by group under a compile sheen, holds DONE — INSTALLED,
// then hands off to the next prompt. Ends on the ticker.
//
// KEEP IN SYNC with project.js (start: 1394 overrides from below).

scene = {
  id: '05_build',
  duration: 852,
  from: 1394,
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

    function smooth(x) {
      var t = clamp01(x);
      return t * t * (3 - 2 * t);
    }

    var kids = [];

    // No full-frame background — broll_05_build_montage paints it underneath.

    var isP = F.portrait;
    var cx = F.cx;

    var chatW = isP ? F.W * 0.88 : Math.min(F.W * 0.62, 1150);
    var x0 = cx - chatW / 2;

    var tintOf = function(name) { return name === 'violet' ? T.violet : T.teal; };

    var beats = [
      { prompt: 'I want my shopping list app', chip: true,
        name: 'LISTKIT', kind: 'SHOPPING LIST', tint: 'teal', ui: 'list',
        build: '4.2S', veil: 'teal' },
      { prompt: 'and now improve my english', chip: false,
        name: 'LINGO COACH', kind: 'ENGLISH TUTOR', tint: 'violet', ui: 'lesson',
        build: '3.8S', veil: 'violet' },
      { prompt: 'make me a 2048 game', chip: false,
        name: 'TWENTY48', kind: 'PUZZLE GAME', tint: 'teal', ui: 'g2048',
        build: '5.1S', veil: 'teal' },
    ];

    var BEAT_LEN = 260;
    var CPS = 2.2;          // frames per typed character
    var TYPE_START = 14;    // beat-local
    var EXIT_AT = 236;      // beat-local card hand-off

    // Beat timing derivation
    function beatTiming(b) {
      var typeEnd = TYPE_START + Math.ceil(b.prompt.length * CPS);
      var sendAt = typeEnd + 14;
      return {
        typeEnd: typeEnd,
        sendAt: sendAt,
        doneAt: sendAt + 100,   // card in 16 + build 66 + settle
      };
    }
    var bases = [12, 12 + BEAT_LEN, 12 + BEAT_LEN * 2];

    // ---- Shared mini helpers (screen-space) --------------------------------
    function rev(p, th) { return clamp01((p - th) * 6); }

    function bake(hex, op) {
      if (op == null || op >= 0.995) return hex;
      var a = Math.round(clamp01(op) * 255).toString(16).padStart(2, '0');
      return '#' + a + hex.replace('#', '').toUpperCase();
    }

    function uiPoly(pts, fill, op) {
      var flat = [], minX = Infinity, minY = Infinity;
      for (var i = 0; i + 1 < pts.length; i += 2) {
        if (pts[i] < minX) minX = pts[i];
        if (pts[i + 1] < minY) minY = pts[i + 1];
      }
      for (var j = 0; j + 1 < pts.length; j += 2) {
        flat.push(pts[j] - minX, pts[j + 1] - minY);
      }
      return {
        type: 'polygon',
        points: flat,
        fill: bake(fill, op),
        opacity: op == null ? 1 : op,
        positioned: { left: minX, top: minY },
      };
    }

    function uiBox(w, h, r, bg, o) {
      o = o || {};
      var n = { type: 'container', width: w, height: h, radius: r, color: bg };
      if (o.border) { n.borderColor = o.border; n.borderWidth = o.bw || 1.5; }
      if (o.gradient) n.gradient = o.gradient;
      if (o.pos) n.positioned = o.pos;
      if (o.op != null) n.opacity = o.op;
      if (o.oy != null) n.offsetY = o.oy;
      return n;
    }

    function uiText(t, fs, color, o) {
      o = o || {};
      var st = {
        fontSize: Math.round(fs * 10) / 10,
        color: color,
        fontWeight: o.w || '400',
        textAlign: o.align || 'left',
      };
      if (o.ls != null) st.letterSpacing = o.ls;
      if (o.font) st.fontFamily = o.font;
      var n = { type: 'text', text: t, style: st };
      if (o.op != null) n.opacity = o.op;
      if (o.pos) n.positioned = o.pos;
      if (o.width != null) n.width = o.width;
      if (o.oy != null) n.offsetY = o.oy;
      return n;
    }

    function grpWrap(out, a, oy, nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        if (a < 1) {
          if (nd.opacity != null) nd.opacity *= a;
          else nd.opacity = a;
          if (nd.type !== 'polygon') {
            nd.offsetY = (nd.offsetY || 0) + oy;
          }
        }
        out.push(nd);
      }
    }

    // Photo attachment chip ("or upload a photo").
    function chipNode(x, y, w, h, op, badge) {
      var nodes = [
        uiBox(w, h, Math.min(14, h / 2), null, {
          gradient: { begin: 'topLeft', end: 'bottomRight',
            colors: T.isLight ? ['#BFE4DC', '#8FD8C6'] : ['#164A41', '#0E2F2A'],
            stops: [0.0, 1.0] },
          pos: { left: x, top: y }, op: op,
        }),
        { type: 'circle', size: h * 0.24, fill: '#FFE9A8', opacity: op,
          positioned: { left: x + w * 0.14, top: y + h * 0.18 } },
        uiPoly([x + w * 0.06, y + h * 0.92, x + w * 0.40, y + h * 0.42,
                x + w * 0.60, y + h * 0.68, x + w * 0.72, y + h * 0.56,
                x + w * 0.95, y + h * 0.92],
          T.isLight ? '#2E8C77' : '#3FBFA0', op),
      ];
      if (badge) {
        var bd = 26;
        nodes.push({ type: 'circle', size: bd, fill: T.isLight ? '#0B0F19' : '#FFFFFF',
          opacity: op * 0.9, positioned: { left: x + w - bd * 0.4, top: y - bd * 0.4 } });
        nodes.push(faRRect(bd * 0.5, 2.4, 1.2, T.isLight ? '#FFFFFF' : '#0B0F19', {
          opacity: op * 0.9,
          positioned: { left: x + w - bd * 0.4 + bd * 0.25, top: y - bd * 0.4 + bd / 2 - 1.2 },
        }));
        nodes.push(faRRect(2.4, bd * 0.5, 1.2, T.isLight ? '#FFFFFF' : '#0B0F19', {
          opacity: op * 0.9,
          positioned: { left: x + w - bd * 0.4 + bd / 2 - 1.2, top: y - bd * 0.4 + bd * 0.25 },
        }));
      }
      return nodes;
    }

    // ---- App UI painters ----------------------------------------------------
    function paintListKit(mx, my, mw, mh, tint, pct, out, baseOp, frame) {
      var u = mw / 320;
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        grpWrap(out, a0, 7 * (1 - a0), [
          uiText('Shopping List', 13.5 * u + 4, T.text, { w: '700', pos: { left: mx + 14 * u, top: my + mh * 0.055 }, op: baseOp }),
          uiBox(58 * u, 20 * u, 10 * u, T.isLight ? '#DDF3EE' : '#123B35', { pos: { left: mx + mw - 72 * u, top: my + mh * 0.042 }, op: baseOp }),
          uiText('8 left', 10 * u + 2, tint, { w: '700', align: 'center', width: 58 * u, pos: { left: mx + mw - 72 * u, top: my + mh * 0.042 + 4 * u }, op: baseOp }),
        ]);
      }
      var items = [
        { n: 'Oat milk', s: '2 pcs · aisle 3', p: '2.49', done: true },
        { n: 'Rye bread', s: '1 loaf · bakery', p: '1.79', done: true },
        { n: 'Eggs ×12', s: 'free range', p: '3.29', done: false },
        { n: 'Blueberries', s: '150 g · fresh', p: '4.50', done: false },
      ];
      var rowX = mx + 12 * u, rowW = mw - 24 * u, rh = mh * 0.155;
      for (var ri = 0; ri < items.length; ri++) {
        var ra = rev(pct, 0.20 + ri * 0.11);
        if (ra <= 0.01) continue;
        var ry = my + mh * (0.185 + ri * 0.187);
        var it = items[ri];
        var nodes = [
          uiBox(rowW, rh, 12 * u, T.isLight ? '#FFFFFF' : T.card, { border: T.border, bw: 1, pos: { left: rowX, top: ry }, op: baseOp }),
          it.done
            ? uiBox(rh * 0.46, rh * 0.46, rh * 0.23, tint, { pos: { left: rowX + 13 * u, top: ry + rh * 0.27 }, op: baseOp })
            : uiBox(rh * 0.46, rh * 0.46, rh * 0.23, null, { border: T.border, bw: 1.5, pos: { left: rowX + 13 * u, top: ry + rh * 0.27 }, op: baseOp }),
          uiText(it.n, 11.5 * u + 3, it.done ? T.dim : T.text, { w: '600', pos: { left: rowX + 13 * u + rh * 0.46 + 12 * u, top: ry + rh * 0.16 }, op: baseOp }),
          uiText(it.s, 9 * u + 2, T.faint, { pos: { left: rowX + 13 * u + rh * 0.46 + 12 * u, top: ry + rh * 0.58 }, op: baseOp }),
          uiText('$' + it.p, 10 * u + 2, T.dim, { w: '600', align: 'right', width: 52 * u, pos: { left: rowX + rowW - 64 * u, top: ry + rh * 0.36 }, op: baseOp }),
        ];
        if (it.done) {
          nodes.push(checkNode(rowX + 13 * u + rh * 0.23, ry + rh * 0.5, rh * 0.30,
            T.isLight ? '#FFFFFF' : '#05070D', 1, baseOp));
        }
        grpWrap(out, ra, 7 * (1 - ra), nodes);
      }
      var fa = rev(pct, 0.85);
      if (fa > 0.01) {
        var fd = 44 * u, fx = mx + mw - fd * 0.72, fy = my + mh - fd * 0.72;
        grpWrap(out, fa, -6 * (1 - fa), [
          uiBox(fd, fd, 16 * u, tint, { pos: { left: fx, top: fy }, op: baseOp }),
          uiBox(fd * 0.52, 3.4 * u, 1.7 * u, T.isLight ? '#FFFFFF' : '#05070D', { pos: { left: fx + fd * 0.24, top: fy + fd / 2 - 1.7 * u }, op: baseOp }),
          uiBox(3.4 * u, fd * 0.52, 1.7 * u, T.isLight ? '#FFFFFF' : '#05070D', { pos: { left: fx + fd / 2 - 1.7 * u, top: fy + fd * 0.24 }, op: baseOp }),
        ]);
      }
    }

    function paintLingoCoach(mx, my, mw, mh, tint, pct, out, baseOp) {
      var u = mw / 320;
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        var head = [
          uiText('Lesson 12', 12.5 * u + 3, T.text, { w: '700', pos: { left: mx + 14 * u, top: my + mh * 0.04 }, op: baseOp }),
        ];
        // streak bolt
        var raw = [[13, 2], [3, 14], [11, 14], [9, 22], [21, 10], [13, 10], [15, 2]];
        var pts = [];
        for (var bi = 0; bi < raw.length; bi++) {
          pts.push(mx + mw - 52 * u + (raw[bi][0] - 12) / 24 * 2 * 7 * u,
                   my + mh * 0.062 + (raw[bi][1] - 12) / 24 * 2 * 7 * u);
        }
        head.push(uiPoly(pts, tint, baseOp));
        head.push(uiText('12', 10.5 * u + 2, tint, { w: '700', pos: { left: mx + mw - 42 * u, top: my + mh * 0.042 }, op: baseOp }));
        grpWrap(out, a0, 7 * (1 - a0), head);
      }
      var xa = rev(pct, 0.16);
      if (xa > 0.01) {
        grpWrap(out, xa, 6 * (1 - xa), [
          uiBox(mw - 28 * u, 5 * u, 2.5 * u, T.isLight ? '#E4E7EC' : T.card, { pos: { left: mx + 14 * u, top: my + mh * 0.115 }, op: baseOp }),
          uiBox((mw - 28 * u) * 0.65 * clamp01(pct * 1.4), 5 * u, 2.5 * u, tint, { pos: { left: mx + 14 * u, top: my + mh * 0.115 }, op: baseOp }),
        ]);
      }
      var wa = rev(pct, 0.26);
      var wx = mx + 12 * u, wy = my + mh * 0.19, ww = mw - 24 * u, wh = mh * 0.27;
      if (wa > 0.01) {
        grpWrap(out, wa, 8 * (1 - wa), [
          uiBox(ww, wh, 16 * u, T.isLight ? '#FFFFFF' : T.card, { border: tint, bw: 1.5, pos: { left: wx, top: wy }, op: baseOp }),
          uiText('apple', 24 * u + 5, T.text, { w: '700', align: 'center', width: ww, pos: { left: wx, top: wy + wh * 0.22 }, op: baseOp }),
          uiText('NOUN · A ROUND FRUIT', 8 * u + 2, T.dim, { w: '600', ls: 1.4, align: 'center', width: ww, pos: { left: wx, top: wy + wh * 0.62 }, op: baseOp }),
          uiBox(58 * u, 17 * u, 8.5 * u, T.isLight ? '#DDF3EE' : '#123B35', { pos: { left: wx + ww - 68 * u, top: wy - 8 * u }, op: baseOp }),
          uiText('NEW WORD', 7 * u + 1.5, tint, { w: '700', ls: 0.8, align: 'center', width: 58 * u, pos: { left: wx + ww - 68 * u, top: wy - 8 * u + 4 * u }, op: baseOp }),
        ]);
      }
      var opts = [
        { t: 'яблоко', ok: true }, { t: 'окно', ok: false }, { t: 'машина', ok: false },
      ];
      for (var oi = 0; oi < opts.length; oi++) {
        var oa = rev(pct, 0.42 + oi * 0.10);
        if (oa <= 0.01) continue;
        var oy2 = my + mh * (0.50 + oi * 0.115);
        var oh = mh * 0.092;
        var onodes = [opts[oi].ok
          ? uiBox(mw - 24 * u, oh, 12 * u, tint, { pos: { left: mx + 12 * u, top: oy2 }, op: baseOp })
          : uiBox(mw - 24 * u, oh, 12 * u, T.isLight ? '#FFFFFF' : T.card, { border: T.border, bw: 1.5, pos: { left: mx + 12 * u, top: oy2 }, op: baseOp })];
        onodes.push(uiText(opts[oi].t, 11 * u + 3, opts[oi].ok ? (T.isLight ? '#FFFFFF' : '#05070D') : T.dim,
          { w: opts[oi].ok ? '700' : '500', pos: { left: mx + 26 * u, top: oy2 + oh * 0.26 }, op: baseOp }));
        if (opts[oi].ok) {
          onodes.push(checkNode(mx + mw - 12 * u - 24 * u, oy2 + oh / 2, 15 * u,
            T.isLight ? '#FFFFFF' : '#05070D', 1, baseOp));
        }
        grpWrap(out, oa, 7 * (1 - oa), onodes);
      }
      var ba = rev(pct, 0.82);
      if (ba > 0.01) {
        grpWrap(out, ba, 7 * (1 - ba), [
          uiBox(mw - 24 * u, mh * 0.075, 12 * u, tint, { pos: { left: mx + 12 * u, top: my + mh * 0.875 }, op: baseOp }),
          uiText('CONTINUE', 10 * u + 2, T.isLight ? '#FFFFFF' : '#05070D', { w: '700', ls: 1.2, align: 'center', width: mw - 24 * u, pos: { left: mx + 12 * u, top: my + mh * 0.875 + mh * 0.024 }, op: baseOp }),
        ]);
      }
    }

    function paint2048(mx, my, mw, mh, tint, pct, out, baseOp, frame) {
      var u = mw / 320;
      var a0 = rev(pct, 0.06);
      if (a0 > 0.01) {
        grpWrap(out, a0, 7 * (1 - a0), [
          uiText('2048', 24 * u + 4, tint, { w: '800', font: 'Impact', ls: 1, pos: { left: mx + 14 * u, top: my + mh * 0.02 }, op: baseOp }),
          uiBox(96 * u, 26 * u, 8 * u, T.isLight ? '#F0EBFF' : '#221C3A', { pos: { left: mx + mw - 110 * u, top: my + mh * 0.03 }, op: baseOp }),
          uiText('SCORE 12 316', 8.5 * u + 2, tint, { w: '700', ls: 0.5, align: 'center', width: 96 * u, pos: { left: mx + mw - 110 * u, top: my + mh * 0.03 + 8 * u }, op: baseOp }),
        ]);
      }
      var gap = 9 * u;
      var boardMaxW = mw - 24 * u;
      var cell = Math.min((boardMaxW - 3 * gap) / 4, (mh * 0.66 - 3 * gap) / 4);
      var bw2 = 4 * cell + 3 * gap;             // board is square-ish, centred
      var bh2 = bw2;
      var gx0 = mx + (mw - bw2) / 2, gy0 = my + mh * 0.135;
      var ga = rev(pct, 0.14);
      if (ga > 0.01) {
        // the board stays dark in both themes — the classic tiles pop on it
        var gnodes = [uiBox(bw2 + 2 * gap, bh2 + 2 * gap, 14 * u, '#221D18', { pos: { left: gx0 - gap, top: gy0 - gap }, op: baseOp })];
        for (var gi = 0; gi < 16; gi++) {
          var gr2 = Math.floor(gi / 4), gc2 = gi % 4;
          gnodes.push(uiBox(cell, cell, 9 * u, '#3A332C', {
            pos: { left: gx0 + gc2 * (cell + gap), top: gy0 + gr2 * (cell + gap) }, op: baseOp }));
        }
        grpWrap(out, ga, 8 * (1 - ga), gnodes);
      }
      var tiles = [
        { v: '2', r: 0, c: 0 }, { v: '4', r: 0, c: 1 }, { v: '8', r: 0, c: 2 }, { v: '16', r: 0, c: 3 },
        { v: '64', r: 1, c: 0 }, { v: '128', r: 1, c: 2 }, { v: '256', r: 2, c: 1 }, { v: '1024', r: 3, c: 3 },
      ];
      var pal2048 = {
        '2': ['#EEE4DA', '#776E65'], '4': ['#EDE0C8', '#776E65'], '8': ['#F2B179', '#FFFFFF'],
        '16': ['#F59563', '#FFFFFF'], '64': ['#F65E3B', '#FFFFFF'], '128': ['#EDCF72', '#FFFFFF'],
        '256': ['#EDCC61', '#FFFFFF'], '1024': ['#EDC850', '#FFFFFF'],
      };
      for (var ti = 0; ti < tiles.length; ti++) {
        var ta = rev(pct, 0.22 + ti * 0.07);
        if (ta <= 0.01) continue;
        var tl = tiles[ti];
        var pal = pal2048[tl.v];
        var tx2 = gx0 + tl.c * (cell + gap), ty2 = gy0 + tl.r * (cell + gap);
        var tfs2 = tl.v.length > 2 ? cell * 0.28 : cell * 0.40;
        var pulse = (pct > 0.9 && ti === 5) ? 1 + 0.025 * Math.sin(frame * 0.5) : 1;
        grpWrap(out, ta, 6 * (1 - ta), [
          uiBox(cell * pulse, cell * pulse, 8 * u, pal[0], {
            pos: { left: tx2 + (cell - cell * pulse) / 2, top: ty2 + (cell - cell * pulse) / 2 }, op: baseOp }),
          uiText(tl.v, tfs2, pal[1], { w: '800', align: 'center', width: cell,
            pos: { left: tx2, top: ty2 + cell / 2 - tfs2 * 0.62 }, op: baseOp }),
        ]);
      }
      var ma = rev(pct, 0.80);
      if (ma > 0.01) {
        grpWrap(out, ma, 6 * (1 - ma), [
          uiBox(150 * u, 26 * u, 13 * u, tint, { pos: { left: mx + mw / 2 - 75 * u, top: gy0 + bh2 + gap + 8 }, op: baseOp }),
          uiText('MERGE! +16 PTS', 9 * u + 2, T.isLight ? '#FFFFFF' : '#05070D', { w: '700', ls: 1, align: 'center', width: 150 * u, pos: { left: mx + mw / 2 - 75 * u, top: gy0 + bh2 + gap + 8 + 8 * u }, op: baseOp }),
          uiText('SWIPE TO MERGE TILES', 8 * u + 2, T.faint, { w: '600', ls: 1.6, align: 'center', width: mw - 24 * u, pos: { left: mx + 12 * u, top: my + mh * 0.945 }, op: baseOp }),
        ]);
      }
    }

    function paintApp(ui, mx, my, mw, mh, tint, pct, out, baseOp, frame) {
      if (ui === 'list') paintListKit(mx, my, mw, mh, tint, pct, out, baseOp, frame);
      if (ui === 'lesson') paintLingoCoach(mx, my, mw, mh, tint, pct, out, baseOp);
      if (ui === 'g2048') paint2048(mx, my, mw, mh, tint, pct, out, baseOp, frame);
    }

    // ---- Kicker (whole scene) ----------------------------------------------
    var kickIn = expoOut(clamp01((frame - 2) / 12));
    var promptN = frame < bases[1] ? 1 : (frame < bases[2] ? 2 : 3);
    kids.push(faText('WATCH FA BUILD.', {
      width: F.W,
      opacity: clamp01(kickIn * 1.2),
      offsetY: 14 * (1 - kickIn),
      style: {
        fontSize: isP ? 44 : 34,
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
      positioned: { left: 0, top: isP ? F.H * 0.040 : F.H * 0.062 },
    }));
    if (frame >= bases[0]) {
      kids.push(faText('PROMPT ' + promptN + ' / 3', {
        width: chatW,
        opacity: kickIn * 0.55,
        style: {
          fontSize: isP ? 20 : 18,
          fontFamily: 'monospace',
          color: T.faint,
          textAlign: 'right',
          letterSpacing: 2.5,
        },
        positioned: { left: x0, top: (isP ? F.H * 0.040 : F.H * 0.062) + (isP ? 62 : 48) },
      }));
    }

    // ---- Input bar / keyboard geometry (shared with 04_ask) -----------------
    var barY = isP ? F.H * 0.885 : F.H * 0.875;
    var barH = isP ? 96 : 88;
    var kbH = Math.round(Math.min(F.W * 0.52, F.H * 0.30));
    var tFs = isP ? 36 : 32;
    var barX = x0;
    var sendD = isP ? 72 : 64;
    var sendX = x0 + chatW - sendD - 14;

    // Result card geometry (beat-independent)
    var cardW = isP ? F.W * 0.84 : F.H * 0.66 * 0.78;
    var cardH = isP ? F.H * 0.56 : F.H * 0.66;
    var cardX = cx - cardW / 2;
    var cardTop = isP ? F.H * 0.185 : F.H * 0.225;
    var cardCX = cx;
    var cardCY = cardTop + cardH / 2;
    var pillY = isP ? F.H * 0.095 : F.H * 0.115;
    var statY = isP ? F.H * 0.150 : F.H * 0.185;
    var pillFs = isP ? 24 : 22;

    // ---- Beats --------------------------------------------------------------
    for (var bi2 = 0; bi2 < beats.length; bi2++) {
      var base = bases[bi2];
      if (frame < base || frame >= base + BEAT_LEN) continue;
      var t = frame - base;
      var B = beats[bi2];
      var tm = beatTiming(B);
      var tint = tintOf(B.tint);

      // bar + keyboard ride: park the bar on the keys while typing
      var kbIn = smooth(t / 14);
      var kbOut = smooth((t - (tm.sendAt + 6)) / 22);
      var kbAmt = kbIn * (1 - kbOut);
      var barLift = barY + barH + 12 + kbH - F.H;
      var barYNow = barY - barLift * kbAmt;

      var typedN = t < tm.typeEnd
        ? Math.min(B.prompt.length, Math.floor((t - TYPE_START) / CPS))
        : (t < tm.sendAt ? B.prompt.length : 0);
      var typing = t >= TYPE_START && t < tm.typeEnd;
      var cursor = typing && Math.floor(frame / 5) % 2 === 0 ? '_' : '';
      var shown = typing ? B.prompt.slice(0, typedN) + cursor
        : (t < tm.sendAt ? B.prompt : '');

      // send press
      var press = t >= tm.sendAt && t < tm.sendAt + 14
        ? Math.sin(clamp01((t - tm.sendAt) / 14) * Math.PI) : 0;
      var pressD = 1 - 0.22 * press;

      // bar dissolve + pill appear
      var barOut = smooth((t - (tm.sendAt + 8)) / 20);
      var pillIn = tw(tm.sendAt + 10, 14, 0, 1, 'easeOut');
      var beatAlpha = 1 - smooth((t - EXIT_AT) / 20);   // hand-off fade

      var chipW = 64, chipH = 46;
      var textX = B.chip ? barX + 88 + chipW + 18 : barX + 106;
      var tMaxW = chatW - (textX - barX) - sendD - 30;

      // ---- Input bar ----
      var barIn = kbIn * (1 - barOut);
      if (barIn > 0.005) {
        var barCY = barYNow + barH / 2;
        kids.push(faRRect(chatW, barH, barH / 2, T.card, {
          opacity: barIn,
          border: { color: press > 0 ? tint : T.border, width: press > 0 ? 2 : 1.5 },
          scale: press > 0 ? 1 - 0.02 * press : 1,
          positioned: { left: barX, top: barYNow },
        }));
        if (!B.chip) {
          // "+" attachment button
          kids.push(faRRect(56, 56, 28, T.dim, {
            opacity: barIn * 0.35, positioned: { left: barX + 30, top: barCY - 28 } }));
          kids.push(faRRect(26, 5, 2.5, T.text, {
            opacity: barIn * 0.8, positioned: { left: barX + 45, top: barCY - 2.5 } }));
          kids.push(faRRect(5, 26, 2.5, T.text, {
            opacity: barIn * 0.8, positioned: { left: barX + 55.5, top: barCY - 13 } }));
        }
        if (B.chip) {
          var chipIn = backOut(clamp01((t - 8) / 12));
          if (chipIn > 0.01) {
            var chs = 0.6 + 0.4 * chipIn;
            var chNodes = chipNode(0, 0, chipW * chs, chipH * chs, barIn * chipIn, true);
            for (var ci3 = 0; ci3 < chNodes.length; ci3++) {
              var cn3 = chNodes[ci3];
              cn3.positioned.left += barX + 88;
              cn3.positioned.top += barCY - chipH / 2;
              kids.push(cn3);
            }
          }
        }
        if (shown.length > 0) {
          kids.push(faText(shown, {
            opacity: barIn, width: tMaxW,
            style: {
              fontSize: tFs, fontFamily: 'monospace', fontWeight: '500',
              color: T.text, letterSpacing: 0, textAlign: 'left',
            },
            positioned: { left: textX, top: barCY - tFs * 0.60 },
          }));
        } else {
          kids.push(faText(B.chip ? 'Add a caption…' : 'Ask anything…', {
            opacity: barIn * 0.45, width: tMaxW,
            style: {
              fontSize: tFs, fontFamily: 'monospace', fontWeight: '500',
              color: T.dim, letterSpacing: 0, textAlign: 'left',
            },
            positioned: { left: textX, top: barCY - tFs * 0.60 },
          }));
        }

        // send button
        kids.push({
          type: 'container', width: sendD, height: sendD, radius: sendD / 2,
          opacity: barIn, scale: pressD,
          gradient: { begin: 'topLeft', end: 'bottomRight',
            colors: [T.violet, T.violetDeep], stops: [0.0, 1.0] },
          shadows: [{ color: T.violet, opacity: 0.35 + 0.25 * press, blur: 18,
            offset: { x: 0, y: 4 } }],
          positioned: { left: sendX, top: barCY - sendD / 2 },
        });
        var acx = sendX + sendD / 2, acy = barCY;
        kids.push(polylineScreen([{ x: acx, y: acy - 13 }, { x: acx + 10, y: acy + 5 },
          { x: acx - 10, y: acy + 5 }], 7, 1, '#FFFFFF', barIn));
        if (press > 0) {
          var fr = (t - tm.sendAt) / 14;
          kids.push({
            type: 'circle', size: sendD + 90 * fr, fill: '#00000000',
            border: { color: T.violet, width: 3 }, opacity: (1 - fr) * 0.9,
            positioned: { left: acx - (sendD + 60 * fr) / 2, top: acy - (sendD + 90 * fr) / 2 },
          });
        }
      }

      // ---- Keyboard ----
      if (kbAmt > 0.005) {
        var kbY = F.H - kbH + (1 - kbAmt) * (kbH + 40);
        var kbNodes = faKeyboard({
          x: 0, y: kbY, w: F.W, h: kbH, opacity: 1,
          pressed: B.prompt.slice(0, typedN),
          frame: frame,
          pressedAt: typedN > 0 ? base + TYPE_START + (typedN - 1) * CPS : 0,
        });
        for (var kni = 0; kni < kbNodes.length; kni++) kids.push(kbNodes[kni]);
      }

      // ---- Sent pill (the prompt stays visible while Fa builds) ----
      if (pillIn > 0.01 && beatAlpha > 0.01) {
        var pillText = B.prompt;
        var mChipW = 40, mChipH = 28;
        var pillW = 28 + (B.chip ? mChipW + 14 : 0) +
          pillText.length * pillFs * 0.60 + 28;
        var pillX = cx - pillW / 2;
        var pn = {
          opacity: pillIn * beatAlpha,
          border: { color: tint, width: 1.5 },
          positioned: { left: pillX, top: pillY },
        };
        kids.push(faRRect(pillW, isP ? 68 : 60, (isP ? 68 : 60) / 2, T.card, pn));
        var innerX = pillX + 28;
        if (B.chip) {
          var mch = chipNode(innerX, pillY + ((isP ? 68 : 60) - mChipH) / 2, mChipW, mChipH,
            pillIn * beatAlpha, false);
          for (var mi = 0; mi < mch.length; mi++) kids.push(mch[mi]);
          innerX += mChipW + 14;
        }
        kids.push(faText(pillText, {
          opacity: pillIn * 0.85 * beatAlpha,
          style: {
            fontSize: pillFs, fontFamily: 'monospace', fontWeight: '500',
            color: T.text, letterSpacing: 0, textAlign: 'left',
          },
          positioned: { left: innerX, top: pillY + (isP ? 21 : 17) },
        }));
      }

      // ---- Status line above the card ----
      if (t >= tm.sendAt + 8 && beatAlpha > 0.01) {
        var done = t >= tm.doneAt;
        var dots = done ? '' : '...'.slice(0, 1 + Math.floor(frame / 10) % 3);
        var sLabel = done
          ? B.name + ' — INSTALLED IN ' + B.build
          : 'FA IS BUILDING ' + B.name + dots;
        kids.push(faText(sLabel, {
          width: F.W,
          opacity: (done ? 0.95 : 0.65) * beatAlpha,
          style: {
            fontSize: isP ? 24 : 21,
            fontFamily: 'monospace',
            fontWeight: '700',
            color: done ? tint : T.dim,
            textAlign: 'center',
            letterSpacing: 2,
          },
          positioned: { left: 0, top: statY },
        }));
        if (done) {
          var dbp = clamp01((t - tm.doneAt) / 14);
          var dcx = cx + (sLabel.length * (isP ? 24 : 21) * 0.62) / 2 + 40;
          kids.push({ type: 'circle', size: 34, fill: tint, opacity: beatAlpha * 0.95,
            positioned: { left: dcx - 17, top: statY + 2 } });
          kids.push(checkNode(dcx, statY + 19, 20, T.isLight ? '#FFFFFF' : '#05070D', dbp, beatAlpha));
        }
      }

      // ---- The violet dot flies from send to the centre, blooms into card ----
      var dotP = smooth((t - (tm.sendAt + 4)) / 14);
      if (dotP > 0.001 && dotP < 0.999) {
        var fromX2 = sendX + sendD / 2;
        var fromY2 = barY - barLift + barH / 2;   // parked bar centre
        var dx = fromX2 + (cardCX - fromX2) * dotP;
        var dy = fromY2 + (cardCY - fromY2) * dotP - Math.sin(dotP * Math.PI) * 60;
        var dSize = 16 + 10 * Math.sin(dotP * Math.PI);
        kids.push({ type: 'circle', size: dSize + 26, fill: T.violet, opacity: 0.18,
          blur: 18, positioned: { left: dx - (dSize + 26) / 2, top: dy - (dSize + 26) / 2 } });
        kids.push({ type: 'circle', size: dSize, fill: T.violetBright, opacity: 0.95,
          positioned: { left: dx - dSize / 2, top: dy - dSize / 2 } });
      }
      if (t >= tm.sendAt + 16 && t < tm.sendAt + 30) {
        var brp = (t - tm.sendAt - 16) / 14;
        kids.push({
          type: 'circle', size: 40 + brp * 130, fill: '#00000000',
          border: { color: T.violet, width: 3 }, opacity: (1 - brp) * 0.8,
          positioned: { left: cardCX - (40 + brp * 130) / 2, top: cardCY - (40 + brp * 130) / 2 },
        });
      }

      // ---- App card ----
      var cIn = backOut(clamp01((t - (tm.sendAt + 16)) / 16));
      if (cIn > 0.005 && beatAlpha > 0.01) {
        var pct = clamp01((t - (tm.sendAt + 34)) / 66);
        var done2 = pct >= 0.999;
        var cOp = cIn * beatAlpha;
        var cScale = 0.55 + 0.45 * cIn;
        kids.push(faRRect(cardW, cardH, 34, T.card, {
          opacity: cOp * 0.4, blur: 36, scale: cScale,
          positioned: { left: cardX - 18, top: cardTop - 18 },
        }));
        kids.push(faRRect(cardW, cardH, 34, T.card, {
          opacity: cOp, scale: cScale,
          border: { color: tint, width: 1.5 },
          positioned: { left: cardX, top: cardTop },
        }));
        var mx2 = cardX + 24, my2 = cardTop + 30;
        var mw2 = cardW - 48, mh2 = cardH - 116;
        kids.push(uiBox(mw2, mh2, 18, T.isLight ? '#F4F5F9' : '#0D1220', {
          border: T.border, bw: 1, pos: { left: mx2, top: my2 }, op: cOp }));
        paintApp(B.ui, mx2, my2, mw2, mh2, tint, pct, kids, cOp, frame);

        // compile sheen while building
        if (!done2 && pct > 0.02 && pct < 0.995) {
          var bands = [];
          for (var bi3 = 0; bi3 < 2; bi3++) {
            var bxp = ((frame * (5 + bi3 * 2) + bi3 * 90) % (mw2 + 130)) - 65;
            bands.push({
              type: 'container', width: 46, height: mh2 - 8, radius: 23,
              gradient: { begin: 'centerLeft', end: 'centerRight',
                colors: ['#00FFFFFF', '#12FFFFFF', '#00FFFFFF'], stops: [0.0, 0.5, 1.0] },
              positioned: { left: mx2 + 4 + bxp, top: my2 + 4 },
            });
          }
          kids.push({
            type: 'clipRRect', radius: 18,
            positioned: { left: mx2, top: my2, width: mw2, height: mh2 },
            child: { type: 'stack', children: bands },
          });
        }

        // progress bar along the card bottom
        var pbW = cardW - 48;
        kids.push(faRRect(pbW, 10, 5, T.surface2, {
          opacity: cOp, border: { color: T.border, width: 1 },
          positioned: { left: cardX + 24, top: cardTop + cardH - 40 },
        }));
        if (pct > 0.001) {
          kids.push(faRRect(Math.max(10, pbW * pct), 10, 5, tint, {
            opacity: cOp,
            positioned: { left: cardX + 24, top: cardTop + cardH - 40 },
          }));
        }

        // done burst
        if (done2) {
          var bp2 = clamp01((t - tm.doneAt) / 16);
          if (bp2 > 0 && bp2 < 1) {
            kids.push({
              type: 'circle', size: 120 + bp2 * 140, fill: tint,
              opacity: (1 - bp2) * 0.30 * cOp, blur: 10,
              positioned: { left: cardCX - (120 + bp2 * 140) / 2,
                top: cardCY - (120 + bp2 * 140) / 2 },
            });
          }
        }

        // under-card line
        var ucIn = tw(tm.doneAt, 14, 0, 1, 'easeOut');
        if (ucIn > 0.01) {
          kids.push(faText('RUNNING NATIVE ON THIS IPHONE — 120 FPS', {
            width: F.W,
            opacity: ucIn * 0.5 * beatAlpha,
            style: {
              fontSize: isP ? 20 : 17,
              fontFamily: 'monospace',
              color: T.faint,
              textAlign: 'center',
              letterSpacing: 2,
            },
            positioned: { left: 0, top: cardTop + cardH + 28 },
          }));
        }
      }

      // ---- Hand-off veil ----
      if (t >= EXIT_AT && t < EXIT_AT + 22) {
        var vOp = 0.09 * Math.sin(Math.PI * (t - EXIT_AT) / 22);
        kids.push({ type: 'rect', width: F.W, height: F.H, fill: bake(tint, vOp) });
      }
    }

    // ---- Outro ticker -------------------------------------------------------
    var oIn = tw(800, 18, 0, 1, 'easeOut');
    if (oIn > 0.01) {
      kids.push(faText('THREE PROMPTS. THREE APPS.', {
        width: F.W,
        opacity: oIn,
        offsetY: 16 * (1 - oIn),
        style: {
          fontSize: isP ? 58 : 44,
          fontFamily: 'Impact',
          fontWeight: '700',
          color: T.text,
          textAlign: 'center',
          letterSpacing: 3,
          gradient: {
            begin: 'topCenter', end: 'bottomCenter',
            colors: T.isLight ? ['#3C4043', '#0B0F19'] : ['#FFFFFF', '#ECECEF', '#9E9EA8'],
            stops: T.isLight ? [0.0, 1.0] : [0.0, 0.45, 1.0],
          },
        },
        positioned: { left: 0, top: isP ? F.H * 0.42 : F.H * 0.40 },
      }));
      kids.push(faText('ZERO LAPTOPS.', {
        width: F.W,
        opacity: tw(812, 18, 0, 1, 'easeOut'),
        style: {
          fontSize: isP ? 30 : 24,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: T.teal,
          textAlign: 'center',
          letterSpacing: 4,
        },
        positioned: { left: 0, top: (isP ? F.H * 0.42 : F.H * 0.40) + (isP ? 92 : 72) },
      }));
    }

    // ---- Exit dip into 06_publish -------------------------------------------
    var ex = clamp01((frame - 836) / 16);
    if (ex > 0.003) {
      var exa = Math.round(ex * 255).toString(16).padStart(2, '0');
      var exb = T.bg.replace('#', '').toUpperCase();
      kids.push({ type: 'rect', width: F.W, height: F.H, fill: '#' + exa + exb });
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
