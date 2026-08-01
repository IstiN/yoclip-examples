// 02 — Brand: the logo pops in center-stage, then shrinks and docks left
// while the promise line builds around it.
//
// Reference beat (Gamma 9–14s): the brand moment. The wordmark enters with a
// back-eased pop on a soft brand glow, settles to dock size as the verb
// types in, the words array cycles one at a time in accent color with a
// slight rise per swap, then the full line types out with a caret and the
// muted tail lands on a second line. Ends holding the complete line.
//
// Renderer notes (verified by probes): rows ignore `alignment` (RenderFlex
// expands to the full tight frame), so centering goes through
// mainAxisAlignment; container styling must be direct props
// (color/gradient/border*/shadow) — a `decoration` map is silently dropped.

scene = {
  id: 'logo',
  duration: 156,
  slides: [126],
  description: 'Brand beat: logo pops in on a glow, docks left, words cycle (promos / doc videos / shorts / product demos), then the full line types out with a caret and the muted tail "from code." lands below.',
  voicePrompts: {
    en: 'A confident brand sting; one soft keystroke per cycled word.',
    ru: 'Уверенный бренд-акцент; мягкий клик на каждое слово.',
  },
  timeline: {
    label: yoclipT('logo').timeline || 'Brand',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('logo');
    var verb = t.verb || 'Render';
    var words = t.words || ['promos', 'doc videos', 'shorts', 'product demos'];
    var tail = t.tail || 'from code.';
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 134, 14);

    // -- Logo entrance: back-eased pop + soft glow, then shrink to dock size.
    var logoPop = pop(frame, 4, 26);
    var dock = ease(frame, 44, 68, eio3);
    var logoScale = logoPop.scale * (1.55 - 0.55 * dock);
    var glowOp = logoPop.opacity * (0.55 + 0.25 * shimmer(frame, 70)) * (1 - 0.55 * dock);

    // -- Verb types in only once the logo has (almost) finished docking: the
    // logo's pop scale overflows its layout box while >1, so an earlier start
    // let the verb touch the glyph ("yoclipRen"). The gap is fully open (≥24px)
    // before the first character lands.
    var typedVerb = typewriter(verb, frame, 62, 45);
    var gapW = 30 * seg(frame, 46, 58);

    // -- Cycling words: one at a time, slight rise per swap.
    var CYCLE_START = 72;
    var CYCLE_DUR = 12;
    var TYPE_START = CYCLE_START + words.length * CYCLE_DUR; // 120
    var wi = Math.min(words.length - 1, Math.max(0, Math.floor((frame - CYCLE_START) / CYCLE_DUR)));
    var wf = frame - (CYCLE_START + wi * CYCLE_DUR); // word-local frame
    var cycling = frame >= CYCLE_START && frame < TYPE_START;
    // Fast fade-in (5f) with a 0.3 opacity floor so a fresh word is never
    // illegibly dim; the fade-out stays at the end of the 12f slot.
    var cycleOp = (0.3 + 0.7 * eo3(seg(wf, 0, 5))) * (1 - eo3(seg(wf, CYCLE_DUR - 4, CYCLE_DUR)));

    // -- Full line types after the cycling stops; caret rides the end.
    var fullWords = words.join(' / ');
    var typedWords = typewriter(fullWords, frame, TYPE_START, 105);
    var tailIn = eo3(seg(frame, TYPE_START + 16, TYPE_START + 26));
    var caretOn = frame >= TYPE_START ? blink(frame, 16) : 0;

    var wordText = frame >= TYPE_START
      ? ' ' + typedWords
      : (cycling ? ' ' + words[wi] : '');
    var wordOp = frame >= TYPE_START ? 1 : (cycling ? cycleOp : 0);
    var wordRise = cycling ? riseIn(wf, 7, 14) : 0;

    var fs = portrait ? 34 : 62;
    var tailFs = portrait ? 28 : 36;
    var logoW = portrait ? 110 : 150;
    var logoH = Math.round(logoW * 152 / 240);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Soft brand glow behind the hero logo.
        {
          type: 'container',
          alignment: 'center',
          width: portrait ? 700 : 900,
          height: portrait ? 700 : 900,
          opacity: glowOp,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.5,
            colors: [yoclipColorA('primary', 0x55, '#7c3aed'), yoclipColorA('primary', 0x00, '#7c3aed')],
          },
        },
        // Full-frame column: the promise line, then the muted tail.
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'row',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'center',
              children: [
                {
                  type: 'image',
                  source: yoclipLogoSource(),
                  fit: 'contain',
                  width: logoW,
                  height: logoH,
                  scale: logoScale,
                  opacity: logoPop.opacity,
                },
                { type: 'container', width: gapW },
                {
                  type: 'text',
                  text: typedVerb,
                  style: {
                    fontSize: fs,
                    color: yoclipColor('text', '#ffffff'),
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                },
                {
                  type: 'text',
                  text: wordText,
                  offsetY: wordRise,
                  opacity: wordOp,
                  style: {
                    fontSize: fs,
                    color: yoclipColor('accent', '#22d3ee'),
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                },
                {
                  type: 'container',
                  width: portrait ? 4 : 6,
                  height: Math.round(fs * 1.05),
                  opacity: caretOn,
                  margin: { left: 10 },
                  color: yoclipColor('accent', '#22d3ee'),
                },
              ],
            },
            {
              type: 'text',
              text: tailIn > 0 ? tail : '',
              opacity: tailIn,
              margin: { top: 14 },
              style: {
                fontSize: tailFs,
                color: yoclipColor('textMuted', '#a1a1aa'),
                fontFamily: yoclipFont(),
                fontWeight: 600,
              },
            },
          ],
        },
      ],
    };
  },
};
