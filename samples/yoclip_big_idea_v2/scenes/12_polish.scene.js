// 12 — Polish: improve the writing, chart it, share it.
//
// Reference beat (Gamma 64–73s): the report-card world stays (white cards on
// warm off-white). The body paragraph sits selected under a blue tint; an
// "Improve writing" chip pops and the text MORPHS — the old line blurs out
// while the new one rises word-by-word in success teal. Then an analytics
// card with stat bullets gets a floating chart menu; the cursor picks
// "Pyramid" and a 3-tier pyramid draws on tier by tier. Finally a big blue
// "Share" pill pops center-bottom, the cursor glides over and clicks, the
// world dims and the button stays lit into the transition.
//
// Renderer notes: per-word stagger = one text node per word (staggerItem +
// rise). Text morph uses opacity + `blur` (applies to any node). Rows in a
// tight stack need explicit width.

scene = {
  id: 'polish',
  duration: 276,
  description: 'White report card on #f5f2ee (geometry matched to 11_upload for a morphing crossfade): the before-paragraph sits under a blue selection tint, an "Improve writing" chip pops, the text morphs (old blurs out, new rises word-by-word in teal) and a "Before -> After" legend lands at the bottom; the report slides left, an analytics card pops right with 3 stat bullets + a floating chart menu (Circle/Bar/Pyramid/Funnel), cursor picks Pyramid, bullets fade out fully and a real 3-tier pyramid (primary/primaryLight/accent tiers in one triangular silhouette) draws tier by tier with labels; a big blue Share pill pops bottom-center, cursor clicks, the world dims to 0.28, button stays lit.',
  voicePrompts: {
    en: 'A soft chime as the words rewrite themselves; a satisfying click on share.',
    ru: 'Мягкий перезвон, когда слова переписываются сами; сочный клик по шару.',
  },
  timeline: {
    label: yoclipT('polish').timeline || 'Polish',
    color: '#2563eb',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('polish');
    var improve = t.improve || 'Improve writing';
    var before = t.before || 'The render completes quickly and the output is good.';
    var after = t.after || 'Seconds in. Pixels out. Perfect.';
    var pyramid = t.pyramid || ['Describe', 'Render', 'Ship'];
    var shareLabel = t.share || 'Share';
    var up = yoclipT('upload');
    var reportA = up.reportA || 'Render report FY26';
    var reportB = up.reportB || '12 scenes · 2580 frames · 0 errors';
    var chat = yoclipT('chat');
    var stat1 = chat.stat1 || ['12', 'scenes rendered'];
    var stat2 = chat.stat2 || ['2580', 'frames encoded'];
    var stat3 = chat.stat3 || ['0', 'errors'];
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 254, 14);

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var ink = '#1f2937';
    var mutedUi = '#6b7280';
    var teal = '#0d9488';
    var blue = '#2563eb';

    // -- Beat timing.
    var MORPH = 44;   // text morph starts
    var SPLIT = 72;   // report slides left, analytics pops right
    var PICK = 124;   // cursor clicks "Pyramid"
    var SHARE = 156;  // share pill pops
    var DIM = 208;    // world dims, button stays lit
    var legendOp = seg(frame, MORPH + 24, MORPH + 34);

    // -- The report card (continuity from 11, simplified).
    // Geometry matches 11_upload's report card pixel-for-pixel (same card
    // size, same 220px orange header, same reportA title slot) so the
    // 11 -> 12 crossfade reads as a morph, not an overlay.
    var shift = ease(frame, SPLIT, SPLIT + 20, eio3);
    var repX = lerp(0, portrait ? 0 : -400, shift);
    var repY = lerp(0, portrait ? -330 : 0, shift);
    var repScale = lerp(1, 0.92, shift);
    var repW = portrait ? 940 : 980;
    var repH = portrait ? 700 : 640;

    // Text morph: before blurs/fades out, after rises word-by-word.
    var beforeOp = 1 - seg(frame, MORPH, MORPH + 14);
    var beforeBlur = 6 * seg(frame, MORPH, MORPH + 14);
    var afterWords = after.split(' ');
    var wordKids = [];
    for (var w = 0; w < afterWords.length; w++) {
      var wp = staggerItem(frame, w, MORPH + 8, 5, 10);
      wordKids.push({
        type: 'text',
        text: afterWords[w] + (w < afterWords.length - 1 ? ' ' : ''),
        opacity: wp,
        offsetY: (1 - eo3(wp)) * 18,
        style: { fontSize: portrait ? 26 : 28, color: teal, fontFamily: font, fontWeight: 600 },
      });
    }

    // Selection tint behind the paragraph.
    var selPop = ease(frame, 6, 16, eo3);
    var selOp = selPop * (1 - seg(frame, MORPH, MORPH + 12));

    var bodyBlock = {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'container',
          alignment: 'center',
          width: portrait ? 700 : 760,
          height: 96,
          borderRadius: 10,
          color: '#332563eb',
          opacity: selOp,
        },
        {
          type: 'text',
          alignment: 'center',
          width: portrait ? 680 : 740,
          text: before,
          opacity: beforeOp,
          blur: beforeBlur,
          style: { fontSize: portrait ? 26 : 28, color: mutedUi, fontFamily: font, lineHeight: 1.4 },
        },
        {
          type: 'row',
          alignment: 'center',
          width: portrait ? 680 : 740,
          mainAxisAlignment: 'center',
          children: wordKids,
        },
      ],
    };

    // "Improve writing" chip pops above the paragraph. Fade-out runs to 0
    // in 10 frames and the chip drifts up as it dies — no translucent
    // "ghost" left hanging over the headline.
    var chipPop = pop(frame, 20, 14);
    var chipFade = seg(frame, MORPH + 14, MORPH + 24);
    var chipOp2 = chipPop.opacity * (1 - chipFade);
    var improveChip = {
      type: 'container',
      alignment: 'center',
      offsetY: -96 - 28 * chipFade,
      // Explicit width — a container > row stretches to the card otherwise.
      width: 320,
      opacity: chipOp2,
      scale: Math.max(0.05, chipPop.scale),
      color: ink,
      borderRadius: 999,
      shadow: { color: '#331f2937', blur: 20, offsetX: 0, offsetY: 8 },
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 22 },
          {
            type: 'path',
            path: 'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z',
            color: '#fcd34d',
            strokeWidth: 2.5,
            width: 18,
            height: 18,
            margin: { right: 10 },
          },
          {
            type: 'text',
            text: improve,
            style: { fontSize: 23, color: '#ffffff', fontFamily: font, fontWeight: 600 },
          },
          { type: 'container', width: 24 },
          { type: 'container', height: 50 },
        ],
      },
    };

    var reportCard = {
      type: 'container',
      alignment: 'center',
      offsetX: repX,
      offsetY: repY,
      width: repW,
      height: repH,
      scale: repScale,
      opacity: fadeIn(frame, 12),
      color: '#ffffff',
      borderRadius: 28,
      shadow: { color: '#2e4c1d95', blur: 48, offsetX: 0, offsetY: 20 },
      clip: true,
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // Orange header strip — identical geometry to 11_upload's
          // report header (topCenter, full width, 200/220px) for the morph.
          {
            type: 'container',
            alignment: 'topCenter',
            width: repW,
            height: portrait ? 200 : 220,
            gradient: {
              type: 'linear',
              begin: 'topLeft',
              end: 'bottomRight',
              colors: ['#fdba74', '#f97316'],
            },
          },
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: 34,
            text: reportA,
            style: { fontSize: 30, color: '#ffffff', fontFamily: font, fontWeight: 700 },
          },
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: portrait ? 224 : 248,
            text: reportB,
            style: { fontSize: portrait ? 28 : 32, color: '#ea580c', fontFamily: font, fontWeight: 700 },
          },
          {
            type: 'container',
            alignment: 'center',
            offsetY: 90,
            child: bodyBlock,
          },
          {
            type: 'container',
            alignment: 'center',
            offsetY: 30,
            child: improveChip,
          },
          // "Before -> After" mini-legend fills the empty lower half once
          // the morph has landed.
          {
            type: 'row',
            alignment: 'bottomCenter',
            offsetY: -48,
            width: 340,
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            opacity: legendOp,
            children: [
              {
                type: 'text',
                text: 'Before',
                style: { fontSize: 22, color: mutedUi, fontFamily: font, fontWeight: 600 },
              },
              {
                type: 'path',
                path: 'M 2 12 L 20 12 M 13 5 L 20 12 L 13 19',
                color: mutedUi,
                strokeWidth: 2.5,
                width: 24,
                height: 24,
                margin: { left: 14, right: 14 },
              },
              {
                type: 'text',
                text: 'After',
                style: { fontSize: 22, color: teal, fontFamily: font, fontWeight: 700 },
              },
            ],
          },
        ],
      },
    };

    // -- Beat 2: analytics card + floating chart menu + pyramid.
    var anaPop = pop(frame, SPLIT + 8, 20);
    var anaX = portrait ? 0 : 430;
    var anaY = portrait ? 380 : 0;
    var anaW = portrait ? 880 : 560;
    var anaH = portrait ? 560 : 560;

    var bullets = [stat1, stat2, stat3];
    var bulletKids = [];
    var bulletFade = 1 - seg(frame, PICK + 8, PICK + 20);
    for (var b = 0; b < 3; b++) {
      var bIn = staggerItem(frame, b, SPLIT + 18, 8, 12);
      bulletKids.push({
        type: 'row',
        crossAxisAlignment: 'center',
        margin: { top: b === 0 ? 0 : 26 },
        opacity: bIn * bulletFade,
        offsetY: (1 - eo3(bIn)) * 16,
        children: [
          {
            type: 'container',
            width: 14,
            height: 14,
            borderRadius: 7,
            color: accent,
          },
          {
            type: 'text',
            text: bullets[b][0] + ' — ' + bullets[b][1],
            margin: { left: 16 },
            style: { fontSize: portrait ? 26 : 27, color: ink, fontFamily: font, fontWeight: 600 },
          },
        ],
      });
    }

    // 3-tier pyramid draws on tier by tier (bottom -> top). Real tiers,
    // not pills: decreasing widths form one triangular silhouette, each
    // tier its own shade (primary -> primaryLight -> accent), square-ish
    // corners. Tiers pop in via scale (path nodes are stroke-only, so a
    // filled trapezoid is not available).
    var tierSpecs = [
      [0, 460, PICK + 8],   // Describe (bottom)
      [1, 330, PICK + 18],  // Render
      [2, 200, PICK + 28],  // Ship (top)
    ];
    var tierColors = [primary, primaryLight, accent];
    var tierKids = [];
    // Children render top tier first; draw order bottom -> top via delays.
    for (var ti = tierSpecs.length - 1; ti >= 0; ti--) {
      var spec = tierSpecs[ti];
      var tSc = Math.max(0.05, ease(frame, spec[2], spec[2] + 16, eoBack));
      var tOp = seg(frame, spec[2], spec[2] + 8);
      tierKids.push({
        type: 'container',
        width: spec[1],
        height: 96,
        margin: { top: ti === tierSpecs.length - 1 ? 0 : 6 },
        opacity: tOp,
        scale: tSc,
        color: tierColors[spec[0]],
        borderRadius: 6,
        child: {
          type: 'stack',
          fit: 'expand',
          children: [{
            type: 'text',
            alignment: 'center',
            text: pyramid[spec[0]] || '',
            style: {
              fontSize: 25,
              color: spec[0] === 2 ? '#164e63' : '#ffffff',
              fontFamily: font,
              fontWeight: 700,
            },
          }],
        },
      });
    }

    var analyticsCard = {
      type: 'container',
      alignment: 'center',
      offsetX: anaX,
      offsetY: anaY,
      width: anaW,
      height: anaH,
      opacity: anaPop.opacity,
      scale: Math.max(0.05, anaPop.scale),
      color: '#ffffff',
      borderRadius: 24,
      shadow: { color: '#2e4c1d95', blur: 44, offsetX: 0, offsetY: 18 },
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: 34,
            text: 'Engagement',
            style: { fontSize: 22, color: mutedUi, fontFamily: font, fontWeight: 600, letterSpacing: 4 },
          },
          {
            type: 'column',
            alignment: 'center',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'start',
            children: bulletKids,
          },
          {
            type: 'column',
            alignment: 'center',
            offsetY: 30,
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: tierKids,
          },
        ],
      },
    };

    // Floating chart menu above the analytics card.
    var menuPop = pop(frame, SPLIT + 26, 16);
    var menuOut = seg(frame, PICK + 24, PICK + 38);
    var menuItems = ['Circle stats', 'Bar stats', 'Pyramid', 'Funnel'];
    var menuKids = [];
    for (var mi = 0; mi < menuItems.length; mi++) {
      var picked = mi === 2 && frame >= PICK;
      menuKids.push({
        type: 'container',
        margin: { left: mi === 0 ? 0 : 10 },
        color: picked ? primary : '#f5f2ee',
        borderRadius: 999,
        borderColor: picked ? primary : '#e5e1dc',
        borderWidth: 1.5,
        child: {
          type: 'text',
          text: menuItems[mi],
          margin: { left: 18, right: 18, top: 10, bottom: 10 },
          style: {
            fontSize: 21,
            color: picked ? '#ffffff' : mutedUi,
            fontFamily: font,
            fontWeight: 600,
          },
        },
      });
    }
    var chartMenu = {
      type: 'container',
      alignment: 'center',
      offsetX: anaX,
      offsetY: anaY - anaH / 2 - 44,
      // Explicit width — a container > row stretches to the frame otherwise.
      width: 640,
      opacity: menuPop.opacity * (1 - menuOut),
      scale: Math.max(0.05, menuPop.scale),
      color: '#ffffff',
      borderRadius: 999,
      borderColor: '#e5e1dc',
      borderWidth: 1.5,
      shadow: { color: '#264c1d95', blur: 24, offsetX: 0, offsetY: 10 },
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [{ type: 'container', width: 14 }]
          .concat(menuKids, [{ type: 'container', width: 14 }, { type: 'container', height: 56 }]),
      },
    };

    // -- Beat 3: big blue Share pill; cursor glides, dips; world dims.
    var sharePop = pop(frame, SHARE, 16);
    var shareDip = seg(frame, 196, 200) * (1 - seg(frame, 200, 207));
    var shareGlow = 24 + 30 * seg(frame, 202, 210) * shimmer(frame, 22);
    var sharePill = {
      type: 'container',
      alignment: 'bottomCenter',
      offsetY: portrait ? -56 : -64,
      width: portrait ? 380 : 420,
      height: 92,
      opacity: sharePop.opacity,
      scale: Math.max(0.05, sharePop.scale * (1 - 0.08 * shareDip)),
      gradient: {
        type: 'linear',
        colors: ['#60a5fa', blue],
        begin: 'centerLeft',
        end: 'centerRight',
      },
      borderRadius: 999,
      shadow: { color: '#662563eb', blur: shareGlow, offsetX: 0, offsetY: 12 },
      child: {
        type: 'row',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [
          {
            type: 'path',
            path: 'M 5 19 L 19 5 M 11 5 L 19 5 L 19 13',
            color: '#ffffff',
            strokeWidth: 3,
            width: 24,
            height: 24,
            margin: { right: 14 },
          },
          {
            type: 'text',
            text: shareLabel,
            style: { fontSize: portrait ? 32 : 36, color: '#ffffff', fontFamily: font, fontWeight: 700 },
          },
        ],
      },
    };

    // Cursor: picks "Pyramid" in the menu, then clicks the Share pill.
    var curOp2 = seg(frame, 104, 110) * (1 - seg(frame, PICK + 14, PICK + 22));
    var glide2 = ease(frame, 110, PICK, eio3);
    var curOp3 = seg(frame, 176, 182) * (1 - seg(frame, 214, 222));
    var glide3 = ease(frame, 182, 196, eio3);
    var menuChipX = anaX + 96; // "Pyramid" chip center (3rd of 4)
    var curX, curY, curOp;
    if (frame < 170) {
      curX = lerp(anaX + 420, menuChipX, glide2);
      curY = lerp(anaY + 300, anaY - anaH / 2 - 36, glide2);
      curOp = curOp2;
    } else {
      curX = lerp(menuChipX + 300, 140, glide3);
      curY = lerp(anaY - anaH / 2 - 36, (portrait ? 540 - 56 : 540 - 64) - 6, glide3);
      curOp = curOp3;
    }
    var cursor = {
      type: 'path',
      path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
      color: ink,
      strokeWidth: 3,
      width: 34,
      height: 34,
      alignment: 'center',
      offsetX: curX,
      offsetY: curY,
      opacity: curOp,
    };

    // World dim behind the lit button — light enough that the white cards
    // stay white, not muddy grey.
    var dimOp = 0.28 * ease(frame, DIM, DIM + 16, eo3);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        { type: 'container', color: '#f5f2ee' },
        reportCard,
        analyticsCard,
        chartMenu,
        { type: 'absolute_fill', color: '#1f2937', opacity: dimOp },
        sharePill,
        cursor,
      ],
    };
  },
};
