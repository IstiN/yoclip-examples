// 07 — Stats: proof in numbers, then the pipeline pyramid.
//
// Reference beat (Gamma count-up + pyramid): three stat cards pop in
// staggered, their numerals counting up from zero; then three bullet-like
// bars rise at the bottom and stretch into a 3-tier pyramid (Describe /
// Render / Ship), built base-first, tiers graded primary -> accent.
//
// Renderer notes: container styling must be direct props; padded chips are
// container > text(+margin); root fit:'expand' children all carry
// `alignment` unless they should stretch full-frame.

scene = {
  id: 'stats',
  duration: 216,
  description: 'Three stat cards pop staggered and count up (4 packages, 15 creative patterns, 5 variants from 1 source); then three bars rise and widen into a 3-tier primary-to-accent pyramid labelled Describe / Render / Ship, built base-first.',
  voicePrompts: {
    en: 'Numbers tick up, then the pipeline stacks into a pyramid.',
    ru: 'Цифры набирают значения, затем пайплайн складывается в пирамиду.',
  },
  timeline: {
    label: yoclipT('stats').timeline || 'Numbers',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('stats');
    var items = t.items || [['4', 'packages'], ['15', 'creative patterns'], ['5', 'variants · 1 source']];
    var tiers = t.pyramid || ['Describe', 'Render', 'Ship'];
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 194, 14);

    var font = yoclipFont();
    var surface = yoclipColor('surface', '#15131f');
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var cardAccents = [primaryLight, accent, primary];

    // -- Stat cards: pop staggered, numerals count up.
    function statCard(i) {
      var p = pop(frame, 18 + i * 16, 22);
      var target = parseInt(items[i][0], 10) || 0;
      var value = counter(frame, 30 + i * 16, 70, 0, target);
      var col = cardAccents[i];
      return {
        type: 'container',
        width: portrait ? 560 : 380,
        height: portrait ? 230 : 250,
        // Entrance floor: never smaller/dimmer than 0.6 scale / 0.3 opacity
        // so the label stays readable through the pop (hidden before it).
        scale: 0.6 + 0.4 * p.scale,
        opacity: p.opacity === 0 ? 0 : 0.3 + 0.7 * p.opacity,
        color: surface,
        borderRadius: 28,
        borderColor: yoclipColorA(i === 1 ? 'accent' : (i === 0 ? 'primaryLight' : 'primary'), 0x59, '#a78bfa'),
        borderWidth: 1.5,
        shadow: { color: yoclipColorA(i === 1 ? 'accent' : 'primary', 0x40, '#7c3aed'), blur: 38, offsetX: 0, offsetY: 18 },
        child: {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: [
            {
              type: 'text',
              text: '' + value,
              style: {
                fontSize: portrait ? 104 : 116,
                color: col,
                fontFamily: font,
                fontWeight: 700,
                shadows: [{ color: col, blur: 30, offsetX: 0, offsetY: 0 }],
              },
            },
            {
              type: 'text',
              text: items[i][1],
              offsetY: 6,
              style: {
                fontSize: portrait ? 26 : 28,
                color: muted,
                fontFamily: font,
                letterSpacing: 2,
              },
            },
          ],
        },
      };
    }

    var cardsRow = portrait
      ? {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: -180,
          children: [
            statCard(0), { type: 'container', height: 24 },
            statCard(1), { type: 'container', height: 24 },
            statCard(2),
          ],
        }
      : {
          type: 'row',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: -60,
          children: [
            statCard(0), { type: 'container', width: 40 },
            statCard(1), { type: 'container', width: 40 },
            statCard(2),
          ],
        };

    // -- Pyramid: three bars rise (base first) and widen into tiers.
    var tierW = portrait ? [300, 440, 580] : [380, 560, 740];
    var tierColors = [
      [primary, primaryLight],
      [primaryLight, accent],
      [primary, accent],
    ];

    function tier(i) {
      // i = 0 top ... 2 bottom; the base rises first.
      var p = staggerItem(frame, 2 - i, 108, 12, 22);
      var w = lerp(150, tierW[i], eoBack(p) > 0 ? Math.min(1, eoBack(p)) : 0);
      // Fill and label share the same window — a tier never renders as a
      // dark empty bar.
      var fill = eo3(p);
      return {
        type: 'container',
        width: w,
        height: portrait ? 56 : 62,
        opacity: fill,
        offsetY: (1 - eo3(p)) * 26,
        gradient: {
          colors: tierColors[i],
          begin: 'centerLeft',
          end: 'centerRight',
        },
        borderRadius: 14,
        shadow: { color: yoclipColorA('primary', 0x40, '#7c3aed'), blur: 22, offsetX: 0, offsetY: 10 },
        child: {
          type: 'stack',
          fit: 'expand',
          children: [{
            type: 'text',
            alignment: 'center',
            text: tiers[i],
            opacity: fill,
            style: {
              fontSize: portrait ? 24 : 27,
              color: '#ffffff',
              fontFamily: font,
              fontWeight: 700,
              letterSpacing: 5,
            },
          }],
        },
      };
    }

    var pyramid = {
      type: 'column',
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      offsetY: portrait ? -300 : -160,
      children: [
        tier(0), { type: 'container', height: 12 },
        tier(1), { type: 'container', height: 12 },
        tier(2),
      ],
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [cardsRow, pyramid],
    };
  },
};
