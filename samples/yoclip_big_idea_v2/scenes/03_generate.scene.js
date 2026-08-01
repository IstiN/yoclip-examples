// 03 — Generate: the brand sentence builds on the Gamma white world.
//
// Reference beat (Gamma 10–14s): back on off-white. CENTER-SPLIT
// composition: [logo + "Render"] pinned LEFT of screen center, the words
// cycle RIGHT of it (promos / doc videos / shorts / product demos — each
// its own ~12f window with a rise-in and a fast full-range fade; the last
// word holds), then the muted tail lands below. Nothing re-centers per
// frame, so nothing drifts. No full-line retype — reading the same line
// typed twice read as a glitch.
//
// Renderer notes: this scene always lives on the hardcoded #f5f4f1 white
// world, so it pins the on-light logo asset (yoclipLogoSource() would hand
// the dark-variant white logo on default variants — invisible on white).
// 'centerLeft' pins the row's LEFT edge to the screen's left edge (the row
// is full-width), so offsets are absolute from the left, not from center.

scene = {
  id: 'generate',
  duration: 165,
  description: 'White-world brand beat, center-split: logo + "Render" pinned left of screen center, words cycle right of it (promos / doc videos / shorts / product demos, last one holds), tail "from code." lands below. Holds.',
  voicePrompts: {
    en: 'A confident brand sting; one soft keystroke per cycled word.',
    ru: 'Уверенный бренд-акцент; мягкий клик на каждое слово.',
  },
  timeline: {
    label: yoclipT('generate').timeline || 'Brand',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('generate');
    var verb = t.verb || 'Render';
    var words = t.words || ['promos', 'doc videos', 'shorts', 'product demos'];
    var tail = t.tail || 'from code.';
    var portrait = yoclipIsPortrait();

    var ink = '#141414';          // white-world black
    var muted = '#64748b';        // muted blue-grey
    // Cycling words: accent cyan washes out on white — primary reads better.
    var cycle = yoclipColor('primary', '#7c3aed');

    // -- Logo: back-eased pop, then shrink to dock size.
    var logoPop = pop(frame, 4, 22);
    var dock = ease(frame, 30, 52, eio3);
    var logoScale = logoPop.scale * (1.5 - 0.5 * dock);

    // -- Verb types in once the logo has nearly docked; the caret rides it
    // while typing and blinks until the words start.
    var typedVerb = typewriter(verb, frame, 46, 45);
    var verbDone = typedVerb.length >= verb.length;
    var gapW = 28 * seg(frame, 40, 52);

    // -- Cycling words: one at a time, slight rise per swap. The fade runs
    // fast and full-range (0 -> 1 -> 0) so the word never lingers at a
    // muddy 40-60% lavender on the white world. The LAST word holds.
    var CYCLE_START = 58;
    var CYCLE_DUR = 12;
    var HOLD_START = CYCLE_START + words.length * CYCLE_DUR; // 106
    var wi = Math.min(words.length - 1, Math.max(0, Math.floor((frame - CYCLE_START) / CYCLE_DUR)));
    var wf = frame - (CYCLE_START + wi * CYCLE_DUR); // word-local frame
    var cycling = frame >= CYCLE_START && frame < HOLD_START;
    var cycleOp = eo3(seg(wf, 0, 3)) * (1 - eo3(seg(wf, CYCLE_DUR - 6, CYCLE_DUR)));
    var wordText = frame >= CYCLE_START ? words[wi] : '';
    var wordOp = cycling ? cycleOp : (frame >= HOLD_START ? 1 : 0);
    var wordRise = cycling ? riseIn(wf, 7, 14) : 0;

    var caretOn = (frame >= 46 && !verbDone) ||
      (verbDone && frame < CYCLE_START && blink(frame, 16) === 1);

    // -- Tail lands below once the last word has settled.
    var tailIn = eo3(seg(frame, HOLD_START + 12, HOLD_START + 24));

    var fs = portrait ? 34 : 58;
    var tailFs = portrait ? 26 : 34;
    var logoW = portrait ? 130 : 180;
    var logoH = Math.round(logoW * 520 / 820);

    // Center-split geometry: the [logo + verb] group's right edge sits
    // gapC px left of screen center; the cycling word's left edge sits
    // gapC px right of it and grows rightward. Both are pinned by fixed
    // offsets — no per-frame re-centering, no drift.
    var halfW = portrait ? 540 : 960;
    var verbW = Math.ceil(verb.length * fs * 0.55);
    var groupW = logoW + 28 + verbW;
    var gapC = portrait ? 14 : 24;
    var leftX = halfW - gapC - groupW;
    var rightX = halfW + gapC;
    var tailY = Math.round(fs * 0.5 + 16 + tailFs * 0.5);

    return {
      type: 'stack',
      fit: 'expand',
      // No entrance fade: the kaleido white flash hands off seamlessly —
      // fading in here would reveal the dark background layer mid-flash.
      opacity: fadeOut(frame, 155, 10),
      children: [
        // Gamma white world.
        { type: 'container', color: '#f5f4f1' },
        // Left of center: logo + verb + caret.
        {
          type: 'row',
          alignment: 'centerLeft',
          offsetX: leftX,
          crossAxisAlignment: 'center',
          children: [
            {
              // White world pins the on-light logo (see header note).
              type: 'image',
              source: 'external:logo_on_light',
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
                color: ink,
                fontFamily: yoclipFont(),
                fontWeight: 700,
              },
            },
            {
              type: 'container',
              width: portrait ? 4 : 5,
              height: Math.round(fs * 1.05),
              opacity: caretOn ? 1 : 0,
              margin: { left: 8 },
              color: muted,
            },
          ],
        },
        // Right of center: the cycling word, pinned by its left edge.
        {
          type: 'text',
          alignment: 'centerLeft',
          offsetX: rightX,
          offsetY: wordRise,
          text: wordText,
          opacity: wordOp,
          style: {
            fontSize: fs,
            color: cycle,
            fontFamily: yoclipFont(),
            fontWeight: 700,
          },
        },
        // Muted tail below center.
        {
          type: 'text',
          alignment: 'center',
          offsetY: tailY,
          text: tailIn > 0 ? tail : '',
          opacity: tailIn,
          style: {
            fontSize: tailFs,
            color: muted,
            fontFamily: yoclipFont(),
            fontWeight: 600,
          },
        },
      ],
    };
  },
};
