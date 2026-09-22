// 01 — Hook — "Build a native iOS app — on your iPhone?" (170 frames, 3 bars)
//
// Metallic headline slams in, a prompt card types the user's ask with a
// solid caret, the send button charges and fires into the next scene.

// Hook camera: zoom into the typing area of the search card while the ask
// types, shift focus to the magnifier button for the click, pull back out.
// No camera node exists in the runtime — this returns transform props for
// a full-frame wrapper stack (pan the focus point to frame center is
// offset = C - F; the scale then magnifies about it). KEEP IN SYNC with
// scenes/00_intro.scene.js: both layers apply the same transform so the
// video background zooms in lockstep — a whole-scene camera move.
function hookCamera(frame, F) {
  var isP = F.portrait;
  var pad = isP ? 28 : 24;
  var m = Math.min(F.W, F.H);
  var cardW = isP ? F.W * 0.86 : F.W * 0.38;
  var cardH = m * 0.40;
  var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.55;
  var cardY = isP ? F.H * 0.49 : F.H * 0.24;
  var pillX = cardX + pad;
  var pillY = cardY + pad;
  var pillW = cardW - pad * 2;
  var pillH = cardH - pad * 2;
  var btnD = isP ? 64 : 54;
  var btnX = pillX + pillW - btnD - pad * 0.8;
  var btnY = pillY + pillH - btnD - pad * 0.8;

  function tw(at, dur, from, to) {
    return jsr.motion.tween(frame * 1000 / 30, at * 1000 / 30, dur * 1000 / 30, from, to, 'easeInOut');
  }

  var zoomA = tw(12, 22, 0, 1); // into the typing area
  var shiftP = tw(92, 16, 0, 1); // pill -> button
  var outP = tw(130, 18, 0, 1); // pull back out
  if ((zoomA === 0 && shiftP === 0) || outP === 1) return null;

  // Whole-scene zoom reads as a camera push-in, so portrait can take more
  // than a card-slide could; the pan stays partial there (the card is 86%
  // of the frame width) while horizontal pans fully onto the button.
  var zoomAmt = isP ? 0.22 : 0.30;
  var extraAmt = isP ? 0.10 : 0.12;
  var panAmt = isP ? 0.45 : 1.0;

  var ccx = F.cx;
  var ccy = F.cy;
  var fcx = pillX + pillW / 2; // typing-area focus point
  var fcy = pillY + pillH * 0.35;
  var bcxp = btnX + btnD / 2; // button focus point
  var bcyp = btnY + btnD / 2;
  var tx = fcx + (bcxp - fcx) * panAmt;
  var ty = fcy + (bcyp - fcy) * panAmt;

  var camS = 1 + zoomAmt * zoomA;
  var vx = ccx + (fcx - ccx) * zoomA;
  var vy = ccy + (fcy - ccy) * zoomA;
  if (shiftP > 0) {
    camS += extraAmt * shiftP;
    vx = fcx + (tx - fcx) * shiftP;
    vy = fcy + (ty - fcy) * shiftP;
  }
  if (outP > 0) {
    camS = 1 + (zoomAmt + extraAmt) * (1 - outP);
    vx = tx + (ccx - tx) * outP;
    vy = ty + (ccy - ty) * outP;
  }
  return { scale: camS, offsetX: ccx - vx, offsetY: ccy - vy };
}

scene = {
  id: '01_hook',
  duration: 170,
  from: 300,
  timeline: {
    label: 'Hook',
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

    // Frosted scrim over the intro video tail (360–451 the hook renders
    // above the live footage; readable text needs the video knocked back).
    // sigma blurs the footage behind, tint darkens it. Fades in with the
    // headline. After 451 the same scrim softens the broll slot plate.
    var scrimIn = clamp01(tw(0, 12, 0, 1, 'easeOutExpo'));
    kids.push({
      type: 'backdropBlur',
      sigma: isP ? 26 : 20,
      color: T.background,
      tintOpacity: (T.isLight ? 0.45 : 0.62) * scrimIn,
      width: F.W,
      height: F.H,
    });

    // No full-frame background here — the broll_01_hook_typing scene on
    // the layer below paints it (today the slot plate, tomorrow the video).

    var cx = F.cx;
    var isP = F.portrait;
    var m = Math.min(F.W, F.H);

    // ---- Headline: metallic Impact ---------------------------------------
    // Portrait: centered stacked block. Landscape: left column (card sits
    // on the right) so the two never overlap.
    var h1In = tw(8, 14, 0, 1, 'easeOutExpo');
    var h2In = tw(22, 14, 0, 1, 'easeOutExpo');
    var headSize = isP ? Math.round(m * 0.082) : Math.round(m * 0.052);
    var headY = isP ? F.H * 0.28 : F.H * 0.24;
    var headLeft = isP ? 0 : F.W * 0.06;
    var headW = isP ? F.W : F.W * 0.42;

    kids.push(faText('BUILD A NATIVE iOS APP.', {
      width: headW,
      opacity: clamp01(h1In * 1.2),
      offsetY: 26 * (1 - h1In),
      style: {
        fontSize: headSize,
        fontFamily: 'Impact',
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2,
      },
      positioned: { left: headLeft, top: headY },
    }));

    kids.push(faText('ON YOUR iPHONE.', {
      width: headW,
      opacity: clamp01(h2In * 1.2),
      offsetY: 26 * (1 - h2In),
      style: {
        fontSize: headSize,
        fontFamily: 'Impact',
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: isP ? 'center' : 'left',
        letterSpacing: 2,
      },
      positioned: { left: headLeft, top: headY + headSize * 1.15 },
    }));

    // Thin teal rule under the headline. Impact's line box is ~1.32em and
    // its ink starts ~0.3em below the line top, so the rule must clear
    // headSize*1.15 (line 2 top) + headSize*1.32 (line box) + air.
    var ruleP = tw(34, 12, 0, 1, 'easeOut');
    if (ruleP > 0.01) {
      var ruleW = m * 0.28 * ruleP;
      var ruleX = isP ? cx - m * 0.14 * ruleP : headLeft;
      kids.push(faRRect(ruleW, 3, 1.5, T.teal, {
        opacity: 0.9,
        positioned: { left: ruleX, top: headY + headSize * 2.47 + 22 },
      }));
    }

    // ---- Prompt card with typing ask ------------------------------------
    // Story beat: he's SEARCHING. The ask types inside a bordered input
    // pill. A "camera" (a full-frame transform wrapper — scale + pan)
    // zooms into the typing area while he types, shifts focus to the teal
    // magnifier button, the button presses (dip + ripple = simulated
    // click), and the camera pulls back out.
    var cardIn = tw(0, 16, 0, 1, 'easeOutCubic');
    var cardW = isP ? F.W * 0.86 : F.W * 0.38;
    var cardH = isP ? m * 0.40 : m * 0.40;
    var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.55;
    var cardY = isP ? F.H * 0.49 : F.H * 0.24;
    var pad = isP ? 28 : 24;
    var pillX = cardX + pad;
    var pillY = cardY + pad;
    var pillW = cardW - pad * 2;
    var pillH = cardH - pad * 2;
    var btnD = isP ? 64 : 54;
    var btnX = pillX + pillW - btnD - pad * 0.8;
    var btnY = pillY + pillH - btnD - pad * 0.8;
    var cardKids = [];

    if (cardIn > 0.003) {
      cardKids.push(faRRect(cardW + 36, cardH + 36, 28, T.violet, {
        opacity: 0.12 * cardIn,
        blur: 40,
        positioned: { left: cardX - 18, top: cardY - 18 },
      }));
      cardKids.push(faRRect(cardW, cardH, 22, T.card, {
        opacity: cardIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 20 * (1 - cardIn),
        positioned: { left: cardX, top: cardY },
      }));

      cardKids.push(faRRect(pillW, pillH, 26, T.card, {
        opacity: cardIn,
        border: { color: T.border, width: 1.5 },
        positioned: { left: pillX, top: pillY },
      }));

      // Typed line — wraps inside the pill at a readable size.
      var ask = 'how to build a real app compiled natively directly on my iphone';
      var t0 = 0, t1 = 80;
      var prog = clamp01((frame - t0) / (t1 - t0));
      var chars = Math.round(prog * ask.length);
      var typing = frame >= t0 && frame <= t1 + 2;
      var showCaret = frame >= t0 && (typing || Math.floor(frame / 6) % 2 === 0) && frame < 106;
      var fs = isP ? 44 : 28;
      cardKids.push(faText(ask.substring(0, chars) + (showCaret ? '_' : ''), {
        width: pillW - pad * 2,
        opacity: cardIn,
        style: {
          fontSize: fs,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: T.text,
          textAlign: 'left',
          letterSpacing: 0,
        },
        positioned: { left: pillX + pad, top: pillY + pad * 0.9 },
      }));

      // Search button — teal circle + white SVG magnifier.
      var magPop = clamp01((frame - (t1 + 4)) / 18);
      var magIn = magPop * (1 + 0.22 * Math.sin(magPop * Math.PI));
      // Click press: smooth half-sine dip 1 -> 0.88 -> 1 over 12 frames.
      var clickAt = t1 + 32;
      var pressT = clamp01((frame - clickAt) / 12);
      var press = 1 - 0.12 * Math.sin(pressT * Math.PI);
      // The press ignites the white flood (below): the button sinks and
      // melts away as the pour starts.
      var btnGone = clamp01((frame - (clickAt + 12)) / 8);
      var magOpacity = clamp01(magPop * 2.2) * (1 - btnGone);
      var btnScale = magIn * press * (1 - 0.25 * btnGone);

      if (magOpacity > 0.003) {
        cardKids.push(faRRect(btnD, btnD, btnD / 2, T.teal, {
          opacity: magOpacity,
          scale: btnScale,
          positioned: { left: btnX, top: btnY },
        }));

        // SVG magnifier: ring (two arcs) + 45° handle, round caps.
        var bcx = btnX + btnD / 2;
        var bcy = btnY + btnD / 2;
        var r = isP ? 11.5 : 10;
        var sw = isP ? 4.6 : 4;
        var ox = bcx - 1.5;
        var oy = bcy - 2;
        var dg = r * 0.7071;
        var hx1 = ox + dg;
        var hy1 = oy + dg;
        var hl = isP ? 9 : 8;
        cardKids.push({
          type: 'path',
          path:
              'M ' + (ox + r) + ' ' + oy +
              ' A ' + r + ' ' + r + ' 0 1 1 ' + (ox - r) + ' ' + oy +
              ' A ' + r + ' ' + r + ' 0 1 1 ' + (ox + r) + ' ' + oy,
          color: '#FFFFFF',
          strokeWidth: sw,
          progress: 1,
          width: r * 2 + sw * 2,
          height: r * 2 + sw * 2,
          opacity: magOpacity,
          positioned: { left: ox - r - sw, top: oy - r - sw },
        });
        cardKids.push({
          type: 'path',
          path:
              'M ' + hx1 + ' ' + hy1 +
              ' L ' + (hx1 + hl * 0.7071) + ' ' + (hy1 + hl * 0.7071),
          color: '#FFFFFF',
          strokeWidth: sw,
          progress: 1,
          width: hl + sw * 2,
          height: hl + sw * 2,
          opacity: magOpacity,
          positioned: { left: hx1 - sw, top: hy1 - sw },
        });

        // Ripple ring right after the press.
        var rippleP = clamp01((frame - (clickAt + 4)) / 16);
        if (rippleP > 0.001 && rippleP < 1) {
          var rr = btnD / 2 + 30 * rippleP;
          var rw = rr * 2;
          cardKids.push({
            type: 'path',
            path:
                'M ' + (bcx + rr) + ' ' + bcy +
                ' A ' + rr + ' ' + rr + ' 0 1 1 ' + (bcx - rr) + ' ' + bcy +
                ' A ' + rr + ' ' + rr + ' 0 1 1 ' + (bcx + rr) + ' ' + bcy,
            color: T.teal,
            strokeWidth: 5 * (1 - rippleP) + 1,
            progress: 1,
            width: rw + 12,
            height: rw + 12,
            opacity: 0.55 * (1 - rippleP),
            positioned: { left: bcx - rr - 6, top: bcy - rr - 6 },
          });
        }
      }

      // Card kids join the scene; the whole-scene camera below wraps them.
      for (var ci = 0; ci < cardKids.length; ci++) kids.push(cardKids[ci]);
    }

    // ---- White flood -----------------------------------------------------
    // The click ignites a white fill that pours out of the button and
    // covers the whole frame (scene-space, so it grows with the camera
    // pull-out): a clean hand-off to the next screen. 02_download opens
    // white and dissolves out over its first beat.
    var floodP = tw(126, 26, 0, 1, 'easeInOut');
    if (floodP > 0.001) {
      var floodX = btnX + btnD / 2;
      var floodY = btnY + btnD / 2;
      // 3x the larger side: covers every corner even mid-pull-out (zoom
      // up to ~1.42), centered off-frame at the button.
      var maxD = Math.max(F.W, F.H) * 3;
      var D = btnD * 0.6 + (maxD - btnD * 0.6) * floodP;
      kids.push({
        type: 'circle',
        size: D,
        fill: '#FFFFFF',
        positioned: { left: floodX - D / 2, top: floodY - D / 2 },
      });
    }

    // Whole-scene camera: everything above (scrim, headlines, card) zooms
    // together, and 00_intro's video tail applies the same transform on
    // the layer below — so the background zooms in lockstep and the move
    // reads as one camera push, not a sliding card.
    var cam = hookCamera(frame, F);
    var root = { type: 'stack', fit: 'expand', children: kids };
    if (cam) {
      root = {
        type: 'stack',
        fit: 'expand',
        scale: cam.scale,
        offsetX: cam.offsetX,
        offsetY: cam.offsetY,
        children: [root],
      };
    }
    return root;
  },
};
