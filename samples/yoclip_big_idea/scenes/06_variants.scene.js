// 06 — Variants: one project, every format.
//
// Reference beat (Gamma 42–57s): the master project bursts into per-variant
// outputs. A single large "master" frame card (mini logo + project label)
// sits center; on the beat it collapses and five variant cards fly out with
// a staggered overshoot to a fanned arc, then settle into a neat row — the
// Shorts card is a tall 9:16, light cards use the light palette. The title
// types above; a mono command chip rises at the end.
//
// Renderer notes: container styling must be direct props (a `decoration`
// map is silently dropped); padded chips are container > text(+margin);
// children of the root fit:'expand' stack all carry `alignment`.

scene = {
  id: 'variants',
  duration: 276,
  description: 'A large master frame card bursts into 5 variant cards (Dark/Light EN/RU + tall Shorts 9:16) that fly to a fanned arc with staggerItem + eoBack, settle into a grid row under a typed title, and a mono render-command chip rises at the bottom.',
  voicePrompts: {
    en: 'A whoosh as the frame multiplies into five variants, one per format.',
    ru: 'Свист — кадр размножается в пять вариантов, по одному на формат.',
  },
  timeline: {
    label: yoclipT('variants').timeline || 'Variants',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('variants');
    var title = t.title || 'One project. Every format.';
    var cardNames = t.cards || ['Dark · EN', 'Dark · RU', 'Light · EN', 'Light · RU', 'Shorts 9:16'];
    var command = t.command || 'yoclip render -V shorts_en';
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 254, 14);

    var font = yoclipFont();
    var surface = yoclipColor('surface', '#15131f');
    var txt = yoclipColor('text', '#ffffff');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    // -- Beats.
    var BURST = 48;    // master collapses, cards fly out
    var SETTLE = 118;  // arc -> grid row

    // -- Master card: pops in, then collapses into the burst.
    var masterPop = pop(frame, 6, 22);
    var masterOut = seg(frame, BURST - 6, BURST + 12);
    var masterOp = masterPop.opacity * (1 - masterOut);
    var masterScale = Math.max(0.05, masterPop.scale * (1 - 0.65 * masterOut));

    var master = {
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? 60 : 40,
      width: portrait ? 480 : 560,
      height: portrait ? 270 : 315,
      scale: masterScale,
      opacity: masterOp,
      color: surface,
      borderRadius: 24,
      borderColor: yoclipColorA('primaryLight', 0x4d, '#a78bfa'),
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x55, '#7c3aed'), blur: 50, offsetX: 0, offsetY: 22 },
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          {
            type: 'image',
            source: yoclipLogoSource(),
            fit: 'contain',
            width: 200,
            height: 127,
            alignment: 'center',
            offsetY: -30,
          },
          {
            type: 'text',
            alignment: 'center',
            offsetY: 92,
            text: 'yoclip_big_idea',
            style: {
              fontSize: 30,
              color: yoclipColor('textMuted', '#a1a1aa'),
              fontFamily: font,
              letterSpacing: 4,
            },
          },
        ],
      },
    };

    // -- Variant cards: burst to a fanned arc, then settle into a row.
    var W = 260, H = 146, WT = 150, HT = 267; // 16:9 cards + 9:16 shorts
    var gridX = portrait
      ? [-170, 170, -170, 170, 0]
      : [-521, -233, 55, 343, 576];
    var gridY = portrait
      ? [-110, -110, 140, 140, 418]
      : [120, 120, 120, 120, 120];

    function variantCard(i) {
      var light = (i === 2 || i === 3);
      var tall = (i === 4);
      var p1 = staggerItem(frame, i, BURST, 9, 22);      // burst
      var e1 = eo3(p1);
      var m = ease(frame, SETTLE + i * 3, SETTLE + i * 3 + 26, eio3); // settle

      // Fan arc: spacing must exceed the rotated card footprint (260w x 146h
      // at 14deg ~ 293px, tall card ~ 270px) so faces never overlap mid-deal.
      var arcX = (i - 2) * (portrait ? 190 : 300);
      var arcY = (portrait ? -110 : -90) + Math.abs(i - 2) * (portrait ? 100 : 50);
      var arcRot = (i - 2) * 7;

      var x = lerp(lerp(0, arcX, e1), gridX[i], m);
      var y = lerp(lerp(40, arcY, e1), gridY[i], m);
      var rot = lerp(lerp(0, arcRot, e1), 0, m);
      var sc = Math.max(0.05, (0.35 + 0.65 * eoBack(p1)));
      var op = seg(frame, BURST + i * 9, BURST + i * 9 + 8);

      var bg = light ? '#f4f3fa' : surface;
      var fg = light ? '#14121f' : txt;
      var border = light ? '#3314121f' : yoclipColorA('primaryLight', 0x3a, '#a78bfa');
      var logo = light ? 'external:logo_on_light' : yoclipLogoSource();

      return {
        type: 'container',
        alignment: 'center',
        offsetX: x,
        offsetY: y,
        width: tall ? WT : W,
        height: tall ? HT : H,
        scale: sc,
        rotation: rot,
        opacity: op,
        color: bg,
        borderRadius: 16,
        borderColor: tall ? yoclipColorA('accent', 0x73, '#22d3ee') : border,
        borderWidth: tall ? 2 : 1.5,
        shadow: { color: yoclipColorA('primary', 0x33, '#7c3aed'), blur: 26, offsetX: 0, offsetY: 12 },
        child: {
          type: 'stack',
          fit: 'expand',
          children: [
            {
              type: 'image',
              source: logo,
              fit: 'contain',
              width: tall ? 84 : 96,
              height: tall ? 53 : 61,
              alignment: 'center',
              offsetY: tall ? -62 : -22,
            },
            {
              type: 'text',
              alignment: 'center',
              offsetY: tall ? 58 : 34,
              text: cardNames[i] || '',
              style: {
                fontSize: tall ? 21 : 24,
                color: fg,
                fontFamily: font,
                fontWeight: 600,
                letterSpacing: 1,
              },
            },
          ],
        },
      };
    }

    var cards = [];
    for (var i = 0; i < 5; i++) cards.push(variantCard(i));

    // -- Title types above the row.
    var typedTitle = typewriter(title, frame, 10, 45);
    var titleNode = {
      type: 'text',
      alignment: 'topCenter',
      offsetY: portrait ? 200 : 108,
      text: typedTitle,
      opacity: seg(frame, 8, 14),
      style: {
        fontSize: portrait ? 48 : 58,
        color: txt,
        fontFamily: font,
        fontWeight: 700,
      },
    };

    // -- Command chip rises at the end (early enough to fill the space
    // below the settled grid).
    var capIn = ease(frame, 196, 214, eo3);
    var chip = {
      type: 'container',
      alignment: 'bottomCenter',
      offsetY: (portrait ? -46 : -64) - (1 - capIn) * 18,
      opacity: capIn,
      color: yoclipColorA('backgroundDeep', 0xb3, '#07070d'),
      borderRadius: 999,
      borderColor: yoclipColorA('accent', 0x66, '#22d3ee'),
      borderWidth: 1.5,
      child: {
        type: 'text',
        text: '$ ' + command,
        margin: { left: 30, right: 30, top: 13, bottom: 13 },
        style: {
          fontSize: portrait ? 24 : 27,
          color: primaryLight,
          fontFamily: font,
          fontWeight: 600,
          letterSpacing: 3,
        },
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [master].concat(cards, [titleNode, chip]),
    };
  },
};
