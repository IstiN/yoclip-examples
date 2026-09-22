// 01 — Hook — "Build a native iOS app — on your iPhone?" (170 frames, 3 bars)
//
// Metallic headline slams in, a prompt card types the user's ask with a
// solid caret, the send button charges and fires into the next scene.

scene = {
  id: '01_hook',
  duration: 170,
  from: 330,
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
    var cardIn = tw(40, 16, 0, 1, 'easeOutCubic');
    var cardW = isP ? F.W * 0.86 : F.W * 0.38;
    var cardH = isP ? m * 0.40 : m * 0.40;
    var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.55;
    var cardY = isP ? F.H * 0.49 : F.H * 0.24;

    if (cardIn > 0.003) {
      kids.push(faRRect(cardW + 36, cardH + 36, 28, T.violet, {
        opacity: 0.12 * cardIn,
        blur: 40,
        positioned: { left: cardX - 18, top: cardY - 18 },
      }));
      kids.push(faRRect(cardW, cardH, 22, T.card, {
        opacity: cardIn,
        border: { color: T.border, width: 1.5 },
        offsetY: 20 * (1 - cardIn),
        positioned: { left: cardX, top: cardY },
      }));

      // Header row: prompt glyph + label. Dot centered on the text's cap
      // center (Robo caps sit ~15px below a 26px text box top).
      kids.push(faRRect(14, 14, 7, T.teal, {
        opacity: cardIn,
        positioned: { left: cardX + 28, top: cardY + 30 },
      }));
      kids.push(faText('PROMPT // FA iOS AGENT', {
        opacity: cardIn * 0.9,
        style: {
          fontSize: isP ? 26 : 22,
          fontFamily: 'monospace',
          fontWeight: '700',
          color: T.teal,
          letterSpacing: 2,
        },
        positioned: { left: cardX + 52, top: cardY + (isP ? 23 : 25) },
      }));

      // Typed line — portrait wraps inside the card at a readable size
      var ask = 'how to build a real app compiled natively directly on my iphone';
      var t0 = 52, t1 = 132;
      var prog = clamp01((frame - t0) / (t1 - t0));
      var chars = Math.round(prog * ask.length);
      var typing = frame >= t0 && frame <= t1 + 2;
      var showCaret = frame >= t0 && (typing || Math.floor(frame / 6) % 2 === 0) && frame < 158;
      var fs = isP ? 46 : 30;
      kids.push(faText(ask.substring(0, chars) + (showCaret ? '_' : ''), {
        width: isP ? cardW - 64 : undefined,
        opacity: cardIn,
        style: {
          fontSize: fs,
          fontFamily: 'monospace',
          fontWeight: '600',
          color: T.text,
          textAlign: 'left',
          letterSpacing: 0,
        },
        positioned: { left: cardX + 28, top: cardY + cardH * (isP ? 0.34 : 0.40) },
      }));
    }

    // ---- Send button charges and fires ----------------------------------
    var btnIn = tw(136, 12, 0, 1, 'easeOutBack');
    if (btnIn > 0.003) {
      var bw = isP ? 400 : 320;
      var bh = isP ? 96 : 74;
      var bx = isP ? cx - bw / 2 : cardX + cardW - bw - 6;
      var by = isP ? cardY + cardH + 46 : cardY + cardH + 44;
      var pulse = frame >= 150 ? 1 + 0.05 * Math.sin((frame - 150) * 0.6) : 1;

      kids.push(faRRect(bw, bh, bh / 2, T.teal, {
        opacity: 0.35 * btnIn,
        blur: 26,
        scale: pulse,
        positioned: { left: bx, top: by },
      }));
      kids.push(faRRect(bw, bh, bh / 2, T.teal, {
        opacity: btnIn,
        scale: pulse,
        positioned: { left: bx, top: by },
      }));
      kids.push(faText('SEND  ->', {
        width: bw,
        opacity: btnIn,
        style: {
          fontSize: isP ? 32 : 26,
          fontFamily: 'monospace',
          fontWeight: '800',
          color: T.isLight ? '#FFFFFF' : '#05070D',
          textAlign: 'center',
          letterSpacing: 2,
        },
        positioned: { left: bx, top: by + (isP ? 30 : 22) },
      }));
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
