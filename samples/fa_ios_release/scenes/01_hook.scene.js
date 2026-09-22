// 01 — Hook — "Build a native iOS app — on your iPhone?" (170 frames, 3 bars)
//
// Metallic headline slams in, a prompt card types the user's ask with a
// solid caret, the send button charges and fires into the next scene.

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
    // Story beat: he's SEARCHING, not writing to an agent yet. Google-style
    // field: gray wordmark, white input pill with the typed query, and a
    // teal SEND pill that pops in at the pill's right end once typing ends.
    var cardIn = tw(0, 16, 0, 1, 'easeOutCubic');
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

      // Search wordmark — gray, quiet, unmistakably "typing into a browser".
      kids.push(faText('Google', {
        opacity: cardIn * 0.85,
        style: {
          fontSize: isP ? 34 : 24,
          fontWeight: '600',
          color: '#9AA0A6',
          letterSpacing: 0.5,
        },
        positioned: { left: cardX + 28, top: cardY + 24 },
      }));

      // Input pill: the query types inside it; SEND docks to its right end.
      var pad = isP ? 28 : 24;
      var pillX = cardX + pad;
      var pillY = cardY + (isP ? 84 : 76);
      var pillW = cardW - pad * 2;
      var pillH = cardH - pad - (isP ? 84 : 76);

      kids.push(faRRect(pillW, pillH, 26, T.card, {
        opacity: cardIn,
        border: { color: '#DADCE0', width: 1.5 },
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
      kids.push(faText(ask.substring(0, chars) + (showCaret ? '_' : ''), {
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

      // SEND pill — pops in at the input pill's bottom-right when the ask
      // is fully typed (mirrors the app's real composer button).
      var sendIn = clamp01(tw(t1 + 6, 14, 0, 1, 'cubicBezier(0.22, 1, 0.36, 1)'));
      var sendW = isP ? 184 : 148;
      var sendH = isP ? 62 : 52;
      if (sendIn > 0.003) {
        kids.push(faRRect(sendW, sendH, sendH / 2, T.teal, {
          opacity: sendIn,
          offsetY: 12 * (1 - sendIn),
          positioned: {
            left: pillX + pillW - sendW - pad * 0.8,
            top: pillY + pillH - sendH - pad * 0.8,
          },
        }));
        kids.push(faText('SEND ->', {
          opacity: sendIn,
          style: {
            fontSize: isP ? 25 : 20,
            fontFamily: 'monospace',
            fontWeight: '700',
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: 2,
          },
          width: sendW,
          positioned: {
            left: pillX + pillW - sendW - pad * 0.8,
            top:
                pillY + pillH - sendH - pad * 0.8 + (sendH - (isP ? 25 : 20)) / 2 - 2,
          },
        }));
      }
    }

    return { type: 'stack', fit: 'expand', children: kids };
  },
};
