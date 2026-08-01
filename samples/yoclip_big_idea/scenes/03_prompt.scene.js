// 03 — Prompt: the product magic. A minimal Studio-like UI: a pill input
// types the brief, a cursor glides to the gradient Render button, clicks,
// and the UI gives way to three generated scene cards that pan upward.
//
// Reference beat (Gamma 14–21s): prompt in, deck out.
//
// Renderer notes: container styling must be direct props (a `decoration`
// map is silently dropped); columns as expand-stack children fill the frame,
// so vertical centering goes through mainAxisAlignment.

scene = {
  id: 'prompt',
  duration: 216,
  description: 'Studio UI: prompt pill types "A launch teaser for my app", cursor glides to the Render button, click dip, UI slides away, 3 scene cards materialize staggered and slowly pan up like a generated deck.',
  voicePrompts: {
    en: 'Soft UI ticks as the prompt types; a clean click, then a whoosh as the cards arrive.',
    ru: 'Мягкие тики интерфейса при печати; чистый клик и свист появления карточек.',
  },
  timeline: {
    label: yoclipT('prompt').timeline || 'Prompt',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('prompt');
    var fieldText = t.field || 'A launch teaser for my app';
    var buttonLabel = t.button || 'Render';
    var cards = t.cards || [
      ['00_hook', 'cursor types the question'],
      ['01_worlds', 'a 3D montage of styles'],
      ['11_cta', 'logo end card, beat-synced'],
    ];
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 194, 14);

    // -- UI group: in 0..24, out 100..118 (slides up + scales away).
    var uiIn = ease(frame, 0, 24, eo3);
    var uiOut = ease(frame, 100, 118, ei3);
    var uiOp = uiIn * (1 - uiOut);
    var uiScale = 1.02 - 0.08 * uiIn - 0.06 * uiOut;
    var uiY = (1 - uiIn) * 30 - 70 * uiOut;

    // -- Prompt typing (~2.2 chars/frame).
    var typed = typewriter(fieldText, frame, 16, 66);
    var typingDone = typed.length >= fieldText.length;
    var caretOn = frame >= 16 && (!typingDone || blink(frame, 14) === 1);

    // -- Cursor arrow: appears, glides to the button, clicks, vanishes.
    // Ends on the button's right/lower area so the tip never covers the
    // "Render" label at the click.
    var curOp = seg(frame, 56, 64) * (1 - seg(frame, 96, 104));
    var glide = ease(frame, 64, 92, eio3);
    var curX = lerp(320, 108, glide);
    var curY = lerp(-70, 62, glide);
    var dip = seg(frame, 92, 96) * (1 - seg(frame, 96, 102));
    var btnScale = 1 - 0.08 * dip;

    // -- Cards: staggered materialize, then a slow upward pan. First card
    // starts at 128 — the prompt UI is fully gone by 118, leaving a 10f
    // clean gap so cards never overlap the pill/button.
    var pan = frame > 152 ? (frame - 152) * 0.8 : 0;
    var cardW = portrait ? 760 : 980;
    var cardChildren = [];
    for (var i = 0; i < cards.length; i++) {
      var p = staggerItem(frame, i, 128, 13, 18);
      var pe = eo3(p);
      var ps = 0.9 + 0.1 * eoBack(p);
      cardChildren.push({
        type: 'container',
        width: cardW,
        height: 150,
        opacity: pe,
        scale: ps,
        offsetY: (1 - pe) * 46,
        margin: { top: i === 0 ? 0 : 24 },
        color: yoclipColor('surface', '#15131f'),
        borderRadius: 26,
        borderColor: yoclipColorA('primaryLight', 0x44, '#a78bfa'),
        borderWidth: 1.5,
        shadow: { color: yoclipColorA('primary', 0x55, '#7c3aed'), blur: 34, offsetX: 0, offsetY: 16 },
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 30 },
            {
              type: 'container',
              width: 52,
              height: 52,
              gradient: {
                colors: [yoclipColor('primary', '#7c3aed'), yoclipColor('accent', '#22d3ee')],
                begin: 'topLeft',
                end: 'bottomRight',
              },
              borderRadius: 14,
              child: {
                type: 'stack',
                fit: 'expand',
                children: [{
                  type: 'text',
                  alignment: 'center',
                  // Chip mirrors the card title's own number prefix
                  // (00_hook -> 00, 11_cta -> 11), not a sequential index.
                  text: cards[i][0].split('_')[0],
                  style: {
                    fontSize: 24,
                    color: '#ffffff',
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                }],
              },
            },
            { type: 'container', width: 26 },
            {
              type: 'column',
              crossAxisAlignment: 'start',
              children: [
                {
                  type: 'text',
                  text: cards[i][0],
                  style: {
                    fontSize: portrait ? 36 : 42,
                    color: yoclipColor('text', '#ffffff'),
                    fontFamily: yoclipFont(),
                    fontWeight: 700,
                  },
                },
                {
                  type: 'text',
                  text: cards[i][1],
                  style: {
                    fontSize: portrait ? 24 : 27,
                    color: yoclipColor('textMuted', '#a1a1aa'),
                    fontFamily: yoclipFont(),
                  },
                },
              ],
            },
          ],
        },
      });
    }

    var pillW = portrait ? 560 : 780;

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Studio UI group: input pill + gradient button.
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          offsetY: uiY - 40,
          opacity: uiOp,
          scale: uiScale,
          children: [
            {
              type: 'container',
              width: pillW,
              height: 88,
              color: yoclipColor('surface', '#15131f'),
              borderRadius: 999,
              borderColor: yoclipColorA('primaryLight', 0x66, '#a78bfa'),
              borderWidth: 1.5,
              shadow: { color: yoclipColorA('primary', 0x44, '#7c3aed'), blur: 30, offsetX: 0, offsetY: 12 },
              child: {
                type: 'row',
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 36 },
                  {
                    type: 'text',
                    text: typed,
                    style: {
                      fontSize: portrait ? 28 : 32,
                      color: yoclipColor('text', '#ffffff'),
                      fontFamily: yoclipFont(),
                    },
                  },
                  {
                    type: 'container',
                    width: 3,
                    height: 36,
                    opacity: caretOn ? 1 : 0,
                    margin: { left: 6 },
                    color: yoclipColor('accent', '#22d3ee'),
                  },
                ],
              },
            },
            { type: 'container', height: 30 },
            {
              type: 'container',
              width: 280,
              height: 78,
              scale: btnScale,
              gradient: {
                colors: [yoclipColor('primary', '#7c3aed'), yoclipColor('accent', '#22d3ee')],
                begin: 'centerLeft',
                end: 'centerRight',
              },
              borderRadius: 999,
              shadow: { color: yoclipColorA('primary', 0x80, '#7c3aed'), blur: 32, offsetX: 0, offsetY: 14 },
              child: {
                type: 'row',
                mainAxisAlignment: 'center',
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 44 },
                  {
                    type: 'text',
                    text: buttonLabel,
                    style: {
                      fontSize: portrait ? 30 : 34,
                      color: '#ffffff',
                      fontFamily: yoclipFont(),
                      fontWeight: 700,
                    },
                  },
                  { type: 'container', width: 44 },
                ],
              },
            },
          ],
        },
        // Cursor arrow (stroked pointer), gliding to the button.
        {
          type: 'path',
          path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
          color: yoclipColor('text', '#ffffff'),
          strokeWidth: 3,
          width: 34,
          height: 34,
          alignment: 'center',
          offsetX: curX,
          offsetY: curY - 40 + uiY,
          opacity: curOp,
        },
        // Generated scene cards, slowly panning upward.
        {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          offsetY: 60 - pan,
          children: cardChildren,
        },
      ],
    };
  },
};
