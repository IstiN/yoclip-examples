// 05 — Build — generation montage: 4 apps building in parallel
// (240 frames, 5 bars)
//
// Cards stagger in on beats; each builds a different real app with a
// progress bar and flickering compile log lines.

scene = {
  id: '05_build',
  duration: 240,
  from: 1142,
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
      { name: 'LISTKIT', kind: 'SHOPPING LIST', tint: 'teal', ui: 'list' },
      { name: 'HYPE TYPE', kind: 'MARKETING CONTENT', tint: 'violet', ui: 'social' },
      { name: 'LINGO COACH', kind: 'LEARN ENGLISH', tint: 'teal', ui: 'lesson' },
      { name: 'VOXEL RUN', kind: '3D GAME', tint: 'violet', ui: 'game' },
    ];

    // ---- M3-ish mini helpers (screen-space, all inside the card stack) -----
    function rev(p, th) { return clamp01((p - th) * 6); }

    // Polygon nodes paint at the stack ORIGIN unless the points are rebased
    // to (0,0) with positioned carrying the min corner (see fa_kit flatPoly).
    // Alpha rides on the opacity prop exactly like flatPoly's does.
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

    // Heart glyph: two lobes + a triangle, all [tint].
    function uiHeart(gx, gy, r, tint, op) {
      return [
        { type: 'circle', size: r * 1.05, fill: tint, opacity: op,
          positioned: { left: gx - r * 1.02, top: gy - r * 0.92 } },
        { type: 'circle', size: r * 1.05, fill: tint, opacity: op,
          positioned: { left: gx - r * 0.03, top: gy - r * 0.92 } },
        uiPoly([gx - r * 0.52, gy - r * 0.28, gx + r * 0.52, gy - r * 0.28, gx, gy + r * 0.95], tint, op),
      ];
    }

    // Chat-bubble glyph.
    function uiBubble(gx, gy, r, tint, op) {
      return [
        uiBox(r * 1.9, r * 1.45, r * 0.6, tint, { pos: { left: gx - r * 0.95, top: gy - r * 0.85 }, op: op }),
        uiPoly([gx - r * 0.55, gy + r * 0.42, gx + r * 0.12, gy + r * 0.42, gx - r * 0.48, gy + r * 1.05], tint, op),
      ];
    }

    // Share glyph: three dots and two connecting strokes.
    function uiShare(gx, gy, r, tint, op) {
      var pts = [
        { x: gx - r * 0.9, y: gy }, { x: gx + r * 0.9, y: gy - r * 0.85 },
        { x: gx + r * 0.9, y: gy + r * 0.85 },
      ];
      var out = [];
      for (var si = 0; si < 3; si++) {
        out.push({ type: 'circle', size: r * 0.72, fill: tint, opacity: op,
          positioned: { left: pts[si].x - r * 0.36, top: pts[si].y - r * 0.36 } });
      }
      out.push(polylineScreen([pts[0], pts[1]], 1.6, 1, tint, op));
      out.push(polylineScreen([pts[0], pts[2]], 1.6, 1, tint, op));
      return out;
    }

    // Lightning bolt (streak) glyph.
    function uiBolt(gx, gy, r, tint, op) {
      var raw = [[13, 2], [3, 14], [11, 14], [9, 22], [21, 10], [13, 10], [15, 2]];
      var pts = [];
      for (var bi = 0; bi < raw.length; bi++) {
        pts.push(gx + (raw[bi][0] - 12) / 24 * 2 * r, gy + (raw[bi][1] - 12) / 24 * 2 * r);
      }
      return [uiPoly(pts, tint, op)];
    }

    // ---- The four app UIs ---------------------------------------------------
    // Each painter draws a real app screen fragment into the mockup box
    // (mx,my,mw,mh); groups materialise as build progress passes thresholds.
    function paintListKit(mx, my, mw, mh, tint, pct, out, baseOp) {
      var u = mw / 320;
      function grp(a, oy, nodes) {
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
      // App bar: title + counter pill.
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        grp(a0, 7 * (1 - a0), [
          uiText('Shopping List', 13.5 * u + 4, T.text, { w: '700', pos: { left: mx + 14 * u, top: my + mh * 0.055 }, op: baseOp }),
          uiBox(58 * u, 20 * u, 10 * u, T.isLight ? '#DDF3EE' : '#123B35', { pos: { left: mx + mw - 72 * u, top: my + mh * 0.042 }, op: baseOp }),
          uiText('8 left', 10 * u + 2, tint, { w: '700', align: 'center', width: 58 * u, pos: { left: mx + mw - 72 * u, top: my + mh * 0.042 + 4 * u }, op: baseOp }),
        ]);
      }
      // Task rows.
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
        grp(ra, 7 * (1 - ra), nodes);
      }
      // FAB overlapping the sheet corner.
      var fa = rev(pct, 0.85);
      if (fa > 0.01) {
        var fd = 44 * u, fx = mx + mw - fd * 0.72, fy = my + mh - fd * 0.72;
        var fnodes = [
          uiBox(fd, fd, 16 * u, tint, { pos: { left: fx, top: fy }, op: baseOp }),
          uiBox(fd * 0.52, 3.4 * u, 1.7 * u, T.isLight ? '#FFFFFF' : '#05070D', { pos: { left: fx + fd * 0.24, top: fy + fd / 2 - 1.7 * u }, op: baseOp }),
          uiBox(3.4 * u, fd * 0.52, 1.7 * u, T.isLight ? '#FFFFFF' : '#05070D', { pos: { left: fx + fd / 2 - 1.7 * u, top: fy + fd * 0.24 }, op: baseOp }),
        ];
        grp(fa, -6 * (1 - fa), fnodes);
      }
    }

    function paintHypeType(mx, my, mw, mh, tint, pct, out, baseOp) {
      var u = mw / 320;
      function grp(a, oy, nodes) {
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
      // App bar: avatar + handle.
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        grp(a0, 7 * (1 - a0), [
          uiBox(mh * 0.075, mh * 0.075, mh * 0.0375, tint, { pos: { left: mx + 14 * u, top: my + mh * 0.035 }, op: baseOp }),
          uiText('studio.noir', 11 * u + 3, T.text, { w: '700', pos: { left: mx + 14 * u + mh * 0.075 + 9 * u, top: my + mh * 0.049 }, op: baseOp }),
          uiText('2m', 9.5 * u + 2, T.faint, { pos: { left: mx + mw - 60 * u, top: my + mh * 0.052 }, op: baseOp }),
        ]);
      }
      // Hero promo card.
      var ha = rev(pct, 0.20);
      var hx = mx + 12 * u, hy = my + mh * 0.155, hw = mw - 24 * u, hh = mh * 0.52;
      if (ha > 0.01) {
        var hnodes = [
          uiBox(hw, hh, 14 * u, null, { gradient: { begin: 'topLeft', end: 'bottomRight', colors: [T.violet, T.violetDeep], stops: [0.0, 1.0] }, pos: { left: hx, top: hy }, op: baseOp }),
          uiText('SUMMER DROP', 21 * u + 4, '#FFFFFF', { w: '700', font: 'Impact', ls: 1.5, align: 'center', width: hw, pos: { left: hx, top: hy + hh * 0.24 }, op: baseOp }),
          uiText('ENDS SUNDAY - 30% OFF EVERYTHING', 8.5 * u + 2, '#FFFFFF', { w: '600', ls: 1.6, align: 'center', width: hw, pos: { left: hx, top: hy + hh * 0.47 }, op: baseOp * 0.9 }),
          uiBox(86 * u, 25 * u, 12.5 * u, T.isLight ? '#FFFFFF' : '#FFFFFF', { pos: { left: hx + hw / 2 - 43 * u, top: hy + hh * 0.64 }, op: baseOp }),
          uiText('SHOP NOW', 9 * u + 2, T.violetDeep, { w: '700', ls: 1.2, align: 'center', width: 86 * u, pos: { left: hx + hw / 2 - 43 * u, top: hy + hh * 0.64 + 6.5 * u }, op: baseOp }),
        ];
        grp(ha, 8 * (1 - ha), hnodes);
      }
      // Engagement chips.
      var ca = rev(pct, 0.62);
      if (ca > 0.01) {
        var cy2 = my + mh * 0.745, ch = mh * 0.095;
        var chips = [
          { w: 74 * u, label: '2.4k' }, { w: 64 * u, label: '156' }, { w: 78 * u, label: 'Share' },
        ];
        var cnodes = [];
        var cx2 = mx + 12 * u;
        for (var ci = 0; ci < chips.length; ci++) {
          cnodes.push(uiBox(chips[ci].w, ch, ch / 2, T.isLight ? '#F0EBFF' : '#221C3A', { pos: { left: cx2, top: cy2 }, op: baseOp }));
          cnodes.push(uiText(chips[ci].label, 9 * u + 2, T.text, { w: '600', pos: { left: cx2 + 26 * u, top: cy2 + ch * 0.28 }, op: baseOp }));
          var gx = cx2 + 14 * u, gy = cy2 + ch / 2;
          if (ci === 0) cnodes = cnodes.concat(uiHeart(gx, gy, 5.5 * u, tint, baseOp));
          if (ci === 1) cnodes = cnodes.concat(uiBubble(gx, gy, 5.5 * u, tint, baseOp));
          if (ci === 2) cnodes = cnodes.concat(uiShare(gx, gy, 5.5 * u, tint, baseOp));
          cx2 += chips[ci].w + 9 * u;
        }
        grp(ca, 7 * (1 - ca), cnodes);
      }
    }

    function paintLingoCoach(mx, my, mw, mh, tint, pct, out, baseOp) {
      var u = mw / 320;
      function grp(a, oy, nodes) {
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
      // Header: lesson + streak.
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        grp(a0, 7 * (1 - a0), [
          uiText('Lesson 12', 12.5 * u + 3, T.text, { w: '700', pos: { left: mx + 14 * u, top: my + mh * 0.04 }, op: baseOp }),
        ].concat(uiBolt(mx + mw - 52 * u, my + mh * 0.062, 7 * u, tint, baseOp)).concat([
          uiText('12', 10.5 * u + 2, tint, { w: '700', pos: { left: mx + mw - 42 * u, top: my + mh * 0.042 }, op: baseOp }),
        ]));
      }
      // XP bar.
      var xa = rev(pct, 0.16);
      if (xa > 0.01) {
        grp(xa, 6 * (1 - xa), [
          uiBox(mw - 28 * u, 5 * u, 2.5 * u, T.isLight ? '#E4E7EC' : T.card, { pos: { left: mx + 14 * u, top: my + mh * 0.115 }, op: baseOp }),
          uiBox((mw - 28 * u) * 0.65 * clamp01(pct * 1.4), 5 * u, 2.5 * u, tint, { pos: { left: mx + 14 * u, top: my + mh * 0.115 }, op: baseOp }),
        ]);
      }
      // Word card.
      var wa = rev(pct, 0.26);
      var wx = mx + 12 * u, wy = my + mh * 0.19, ww = mw - 24 * u, wh = mh * 0.27;
      if (wa > 0.01) {
        grp(wa, 8 * (1 - wa), [
          uiBox(ww, wh, 16 * u, T.isLight ? '#FFFFFF' : T.card, { border: tint, bw: 1.5, pos: { left: wx, top: wy }, op: baseOp }),
          uiText('apple', 24 * u + 5, T.text, { w: '700', align: 'center', width: ww, pos: { left: wx, top: wy + wh * 0.22 }, op: baseOp }),
          uiText('NOUN · A ROUND FRUIT', 8 * u + 2, T.dim, { w: '600', ls: 1.4, align: 'center', width: ww, pos: { left: wx, top: wy + wh * 0.62 }, op: baseOp }),
          uiBox(58 * u, 17 * u, 8.5 * u, T.isLight ? '#DDF3EE' : '#123B35', { pos: { left: wx + ww - 68 * u, top: wy - 8 * u }, op: baseOp }),
          uiText('NEW WORD', 7 * u + 1.5, tint, { w: '700', ls: 0.8, align: 'center', width: 58 * u, pos: { left: wx + ww - 68 * u, top: wy - 8 * u + 4 * u }, op: baseOp }),
        ]);
      }
      // Answer options.
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
        grp(oa, 7 * (1 - oa), onodes);
      }
      // CTA.
      var ba = rev(pct, 0.82);
      if (ba > 0.01) {
        grp(ba, 7 * (1 - ba), [
          uiBox(mw - 24 * u, mh * 0.075, 12 * u, tint, { pos: { left: mx + 12 * u, top: my + mh * 0.875 }, op: baseOp }),
          uiText('CONTINUE', 10 * u + 2, T.isLight ? '#FFFFFF' : '#05070D', { w: '700', ls: 1.2, align: 'center', width: mw - 24 * u, pos: { left: mx + 12 * u, top: my + mh * 0.875 + mh * 0.024 }, op: baseOp }),
        ]);
      }
    }

    function paintVoxelRun(mx, my, mw, mh, tint, pct, out, baseOp) {
      var u = mw / 320;
      function grp(a, oy, nodes) {
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
      // HUD: lives + combo + score.
      var a0 = rev(pct, 0.08);
      if (a0 > 0.01) {
        var hnodes = [];
        for (var hi = 0; hi < 3; hi++) {
          hnodes = hnodes.concat(uiHeart(mx + 20 * u + hi * 17 * u, my + mh * 0.055, 6 * u, tint, baseOp * (hi < 2 ? 1 : 0.30)));
        }
        hnodes.push(uiBox(30 * u, 17 * u, 8.5 * u, T.isLight ? '#F0EBFF' : '#221C3A', { pos: { left: mx + mw - 84 * u, top: my + mh * 0.018 }, op: baseOp }));
        hnodes.push(uiText('x2', 8.5 * u + 2, tint, { w: '700', align: 'center', width: 30 * u, pos: { left: mx + mw - 84 * u, top: my + mh * 0.018 + 3.5 * u }, op: baseOp }));
        hnodes.push(uiText('1250', 12 * u + 3, T.text, { w: '700', align: 'right', width: 44 * u, pos: { left: mx + mw - 14 * u - 44 * u, top: my + mh * 0.018 }, op: baseOp }));
        grp(a0, 7 * (1 - a0), hnodes);
      }
      // Scene window.
      var sa = rev(pct, 0.20);
      var sx2 = mx + 12 * u, sy2 = my + mh * 0.135, sw2 = mw - 24 * u, sh2 = mh * 0.575;
      if (sa > 0.01) {
        var scx = sx2 + sw2 / 2, scy = sy2 + sh2 * 0.60;
        var rx = sw2 * 0.36, ry = sh2 * 0.26;
        var cube = sw2 * 0.105;
        var snodes = [
          uiBox(sw2, sh2, 14 * u, T.isLight ? '#F1F2F7' : '#0B101E', { border: T.border, bw: 1, pos: { left: sx2, top: sy2 }, op: baseOp }),
          { type: 'circle', size: sw2 * 0.7, fill: T.violet, opacity: 0.16 * baseOp, blur: 44,
            positioned: { left: scx - sw2 * 0.35, top: scy - sw2 * 0.35 } },
          // isometric floor
          uiPoly([scx - rx, scy, scx, scy + ry, scx + rx, scy, scx, scy - ry],
            T.isLight ? '#E1E4EE' : '#1A2236', baseOp),
          // the voxel player: left face, right face, top face
          uiPoly([scx - cube, scy - ry * 0.72, scx, scy - ry * 0.72 + cube * 0.62, scx, scy + cube * 0.85, scx - cube, scy + cube * 0.85 - ry * 0.62],
            T.violetDeep, baseOp),
          uiPoly([scx + cube, scy - ry * 0.72, scx, scy - ry * 0.72 + cube * 0.62, scx, scy + cube * 0.85, scx + cube, scy + cube * 0.85 - ry * 0.62],
            lerpColor(T.violet, '#000000', 0.38), baseOp),
          uiPoly([scx, scy - ry * 0.72 - cube * 0.62, scx + cube, scy - ry * 0.72, scx, scy - ry * 0.72 + cube * 0.62, scx - cube, scy - ry * 0.72],
            lerpColor(T.violet, '#FFFFFF', 0.22), baseOp),
          // coin
          { type: 'circle', size: 10 * u, fill: T.teal, opacity: baseOp,
            positioned: { left: scx + sw2 * 0.22, top: scy - sh2 * 0.10 } },
          { type: 'circle', size: 4 * u, fill: '#FFFFFF', opacity: 0.8 * baseOp,
            positioned: { left: scx + sw2 * 0.22 + 3 * u, top: scy - sh2 * 0.10 + 3 * u } },
        ];
        grp(sa, 8 * (1 - sa), snodes);
      }
      // Controls: joystick + jump.
      var ca = rev(pct, 0.62);
      if (ca > 0.01) {
        var jd = 52 * u, jx = mx + 12 * u + jd * 0.25, jy = my + mh * 0.775;
        var bd = 46 * u, bx2 = mx + mw - 12 * u - bd, by2 = my + mh * 0.775;
        var cwx = jx + jd / 2 + Math.sin(frame * 0.28) * 4 * u;
        var cwy = jy + jd / 2 + Math.cos(frame * 0.22) * 3 * u;
        grp(ca, 7 * (1 - ca), [
          { type: 'circle', size: jd, fill: T.isLight ? '#FFFFFF' : T.card, stroke: T.border, strokeWidth: 2, opacity: baseOp,
            positioned: { left: jx, top: jy } },
          { type: 'circle', size: jd * 0.42, fill: tint, opacity: baseOp,
            positioned: { left: cwx - jd * 0.21, top: cwy - jd * 0.21 } },
          uiBox(bd, bd, 14 * u, tint, { pos: { left: bx2, top: by2 }, op: baseOp }),
          uiPoly([bx2 + bd / 2, by2 + bd * 0.28, bx2 + bd * 0.70, by2 + bd * 0.62, bx2 + bd * 0.30, by2 + bd * 0.62],
            T.isLight ? '#FFFFFF' : '#05070D', baseOp),
        ]);
      }
    }

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

      var nameFs = Math.max(19, Math.round(cardW * 0.052));
      var iconD = nameFs + 12;
      kids.push(uiBox(iconD, iconD, iconD * 0.30,
        T.isLight ? (apps[i].tint === 'teal' ? '#DDF3EE' : '#E9E6FB')
                  : (apps[i].tint === 'teal' ? '#123B35' : '#221C3A'),
        { pos: { left: px + 26, top: py + 18 }, op: cIn }));
      kids.push(uiText(apps[i].name.charAt(0), iconD * 0.52, tint,
        { w: '800', font: 'Impact', align: 'center', width: iconD,
          pos: { left: px + 26, top: py + 18 + iconD * 0.22 }, op: cIn }));
      kids.push(uiText(apps[i].name, nameFs, T.text,
        { w: '700', font: 'Impact', ls: 1.2,
          pos: { left: px + 26 + iconD + 12, top: py + 24 }, op: cIn }));
      kids.push(uiText(apps[i].kind, nameFs * 0.44, T.dim,
        { w: '600', ls: 1.6, align: 'right', width: cardW - 52 - iconD - 12 - 52,
          pos: { left: px + 26 + iconD + 12, top: py + 24 + nameFs + 4 }, op: cIn * 0.8 }));

      // ---- Real app UI mockup, materialising with the build progress ----
      var pct = clamp01((frame - buildStart) / 150);
      var done = pct >= 0.999;
      var mx2 = px + 24, my2 = py + iconD + 34;
      var mw2 = cardW - 48, mh2 = cardH - (iconD + 34) - 100;
      kids.push(uiBox(mw2, mh2, 18, T.isLight ? '#F4F5F9' : '#0D1220',
        { border: T.border, bw: 1, pos: { left: mx2, top: my2 }, op: cIn }));
      if (apps[i].ui === 'list') paintListKit(mx2, my2, mw2, mh2, tint, pct, kids, cIn);
      if (apps[i].ui === 'social') paintHypeType(mx2, my2, mw2, mh2, tint, pct, kids, cIn);
      if (apps[i].ui === 'lesson') paintLingoCoach(mx2, my2, mw2, mh2, tint, pct, kids, cIn);
      if (apps[i].ui === 'game') paintVoxelRun(mx2, my2, mw2, mh2, tint, pct, kids, cIn);

      // Build sheen: two light bands sweeping the mockup while it compiles.
      if (!done && pct > 0.02 && pct < 0.995) {
        var bands = [];
        for (var bi2 = 0; bi2 < 2; bi2++) {
          var bxp = ((frame * (5 + bi2 * 2) + bi2 * 90) % (mw2 + 130)) - 65;
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
        var cbx = mx2 + mw2 - 22;
        var cby = my2 + 2;
        kids.push({ type: 'circle', size: 44, fill: tint, opacity: 0.92 * cIn,
          positioned: { left: cbx - 22, top: cby - 22 } });
        kids.push(checkNode(cbx, cby, 26, T.isLight ? '#FFFFFF' : '#05070D', bp, cIn));
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
