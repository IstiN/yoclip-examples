// 09 — Website: the same project becomes a light, pastel marketing site.
//
// Reference beat (Gamma 45–50s): the world flips to warm pastel. A small
// prompt pill replays the brief top-left and fades; then the site assembles
// — nav bar, hero (big headline + sub + pulsing violet CTA), a warm
// photo-ish panel with a abstract spark mark, a "trusted by" logo
// strip, 3 numbered steps, and a frosted vertical tool rail on the right
// edge. A white light-sweep band wipes across to reveal the page.
//
// Renderer notes: Geneva lacks icon glyphs — the tool rail icons and the
// figure are stroked `path` glyphs / thick-stroked silhouette strokes.
// Paths are stroked, not filled; the silhouette leans on heavy strokeWidth.

scene = {
  id: 'website',
  duration: 207,
  description: 'Pastel light world: prompt pill replays top-left and fades; the site assembles — nav (Nova + menu), hero headline + sub + pulsing violet CTA, warm gradient photo panel with a abstract spark mark, trusted-by logo strip, 3 numbered steps, frosted tool rail on the right edge; a white light-sweep wipes across at the start.',
  voicePrompts: {
    en: 'A warm sunny groove; soft pops as each section of the page lands.',
    ru: 'Тёплый солнечный грув; мягкие попсы на каждый блок страницы.',
  },
  timeline: {
    label: yoclipT('website').timeline || 'Website',
    color: '#f59e0b',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('website');
    var promptText = t.prompt || 'A light variant of the promo';
    var name = t.name || 'Nova';
    var hero = t.hero || 'Calm videos for busy teams.';
    var sub = t.sub || 'Helping high-achievers ship their story.';
    var cta = t.cta || 'Render free draft';
    var logos = t.logos || ['geneva.', 'Springfield', 'MILANO', 'London', 'Bern'];
    var steps = t.steps || ['Describe', 'Render', 'Ship'];
    var menu = t.menu || ['Product', 'Pricing', 'Blog'];
    var trusted = t.trusted || 'Trusted by calm teams everywhere';
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 185, 14);

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var ink = '#1f2937';
    var muted = '#8a7f70';
    var figure = '#4c1d95';

    // -- Prompt beat (same UI language as 04_prompt, centered): the input
    // pill types the brief with a caret, the gradient Render button sits
    // below it, the cursor glides and clicks — then the whole UI slides
    // down/out as the site sweeps in.
    var pillOp = seg(frame, 2, 10) * (1 - seg(frame, 52, 64));
    var pillSlide = seg(frame, 52, 64, eio3) * 140;
    var chipPop = pop(frame, 30, 14);
    var chipDip = seg(frame, 44, 48) * (1 - seg(frame, 48, 54));
    var chipGlow = 18 + 16 * seg(frame, 50, 58) * shimmer(frame, 22);
    var curOp = seg(frame, 30, 36) * (1 - seg(frame, 50, 58));
    var curGlide = ease(frame, 36, 46, eio3);
    var curDrift = ease(frame, 50, 58, eo3);
    var curX = lerp(330, 74, curGlide) + 64 * curDrift;
    var curY = lerp(310, 78, curGlide) + 56 * curDrift;
    var promptPill = {
      type: 'column',
      alignment: 'center',
      offsetY: pillSlide,
      opacity: pillOp,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: [
        {
          type: 'container',
          width: 640,
          height: 76,
          color: '#ffffff',
          borderRadius: 999,
          borderColor: '#eadfce',
          borderWidth: 1.5,
          shadow: { color: '#1f4c1d95', blur: 24, offsetX: 0, offsetY: 10 },
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 28 },
              sparkleNode({ size: 20, color: primary, marginRight: 12 }),
            ].concat(typewriterFieldNodes({
              frame: frame,
              text: promptText,
              start: 8,
              cps: 55,
              font: font,
              fontSize: 24,
              color: ink,
              caretColor: primary,
              caretHeight: 30,
              caretMarginLeft: 4,
            })),
          },
        },
        { type: 'container', height: 24 },
        renderButtonNode({
          label: t.button || 'Render',
          font: font,
          fontSize: 26,
          width: 260,
          height: 70,
          colors: [primaryLight, primary],
          scale: Math.max(0.001, chipPop.scale * (1 - 0.12 * chipDip)),
          opacity: chipPop.opacity,
          shadowColor: yoclipColorA('primary', 0x66, '#7c3aed'),
          shadowBlur: chipGlow,
          sparkleSize: 20,
        }),
      ],
    };
    var promptCursor = {
      type: 'path',
      path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
      color: ink,
      strokeWidth: 3,
      width: 34,
      height: 34,
      alignment: 'center',
      offsetX: curX,
      offsetY: curY + pillSlide,
      opacity: curOp,
    };

    // -- Nav bar.
    var navIn = ease(frame, 52, 68, eo3);
    var menuKids = [];
    for (var m = 0; m < menu.length; m++) {
      menuKids.push({
        type: 'text',
        text: menu[m],
        margin: { left: m === 0 ? 0 : 44 },
        style: { fontSize: 24, color: muted, fontFamily: font, fontWeight: 600 },
      });
    }
    var nav = {
      type: 'row',
      alignment: 'topCenter',
      offsetY: 48 - (1 - navIn) * 20,
      opacity: navIn,
      width: portrait ? 960 : 1520,
      mainAxisAlignment: 'spaceBetween',
      crossAxisAlignment: 'center',
      children: [
        {
          type: 'text',
          text: name,
          style: { fontSize: 34, color: primary, fontFamily: font, fontWeight: 700 },
        },
        {
          type: 'row',
          crossAxisAlignment: 'center',
          children: menuKids,
        },
      ],
    };

    // -- Hero: headline + sub + pulsing CTA (left), photo panel (right).
    var heroIn = ease(frame, 60, 78, eo3);
    var subIn = ease(frame, 68, 84, eo3);
    var ctaPop = pop(frame, 78, 18);
    var panelPop = pop(frame, 66, 26);
    var ctaGlow = 20 + 16 * shimmer(frame, 36);

    var heroCol = {
      type: 'column',
      crossAxisAlignment: 'start',
      // Columns expand to the full available height — center the content.
      mainAxisAlignment: 'center',
      width: portrait ? 880 : 840,
      children: [
        {
          type: 'text',
          text: hero,
          textAlign: 'left',
          opacity: heroIn,
          offsetY: (1 - heroIn) * 30,
          style: {
            fontSize: portrait ? 62 : 76,
            color: ink,
            fontFamily: font,
            fontWeight: 700,
            lineHeight: 1.08,
          },
        },
        {
          type: 'text',
          text: sub,
          textAlign: 'left',
          opacity: subIn,
          offsetY: (1 - subIn) * 24,
          margin: { top: 22 },
          style: { fontSize: portrait ? 26 : 30, color: muted, fontFamily: font },
        },
        {
          type: 'container',
          margin: { top: 36 },
          opacity: ctaPop.opacity,
          scale: ctaPop.scale,
          gradient: {
            colors: [primaryLight, primary],
            begin: 'centerLeft',
            end: 'centerRight',
          },
          borderRadius: 999,
          shadow: { color: yoclipColorA('primary', 0x73, '#7c3aed'), blur: ctaGlow, offsetX: 0, offsetY: 10 },
          child: {
            type: 'text',
            text: cta,
            margin: { left: 40, right: 40, top: 18, bottom: 18 },
            style: { fontSize: portrait ? 26 : 29, color: '#ffffff', fontFamily: font, fontWeight: 700 },
          },
        },
      ],
    };

    // Abstract brand mark: a six-point "spark" (three rotated rounded bars)
    // with a solid white core — deliberately NOT a figure.
    function sparkBar(rot) {
      return {
        type: 'container',
        alignment: 'center',
        width: 46,
        height: 190,
        borderRadius: 23,
        rotation: rot,
        color: figure,
      };
    }
    var figureNode = {
      type: 'stack',
      fit: 'expand',
      children: [
        sparkBar(0),
        sparkBar(60),
        sparkBar(120),
        {
          type: 'container',
          alignment: 'center',
          width: 64,
          height: 64,
          borderRadius: 999,
          color: '#ffffff',
        },
      ],
    };

    var photoPanel = {
      type: 'container',
      width: portrait ? 560 : 520,
      height: portrait ? 560 : 520,
      opacity: panelPop.opacity,
      scale: panelPop.scale,
      gradient: {
        colors: ['#f9a8d4', '#fcd34d'],
        begin: 'topLeft',
        end: 'bottomRight',
      },
      borderRadius: 36,
      shadow: { color: '#334c1d95', blur: 44, offsetX: 0, offsetY: 20 },
      clip: true,
      child: figureNode,
    };

    var heroRow = {
      type: 'row',
      alignment: 'center',
      offsetY: portrait ? -120 : -80,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: portrait
        ? [{
            type: 'column',
            crossAxisAlignment: 'center',
            children: [
              photoPanel,
              { type: 'container', height: 60 },
              heroCol,
            ],
          }]
        : [
            heroCol,
            { type: 'container', width: 90 },
            photoPanel,
          ],
    };

    // -- Trusted-by strip.
    var logosIn = ease(frame, 102, 120, eo3);
    var logoKids = [];
    for (var lg = 0; lg < logos.length; lg++) {
      logoKids.push({
        type: 'text',
        text: logos[lg],
        margin: { left: lg === 0 ? 0 : 54 },
        style: {
          fontSize: 26,
          color: '#a89c8c',
          fontFamily: font,
          fontWeight: lg % 2 === 0 ? 700 : 500,
          letterSpacing: lg % 2 === 0 ? 1 : 4,
          fontStyle: lg === 2 ? 'italic' : 'normal',
        },
      });
    }
    var logoStrip = {
      type: 'column',
      alignment: 'bottomCenter',
      offsetY: portrait ? -300 : -230,
      opacity: logosIn,
      // Columns fill the frame height — bottom-anchored via mainAxis; the
      // entrance rise is baked into the children via a shared spacer.
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      children: [
        {
          type: 'text',
          text: trusted,
          offsetY: (1 - logosIn) * 24,
          style: { fontSize: 20, color: '#b5a998', fontFamily: font, letterSpacing: 5 },
        },
        {
          type: 'row',
          margin: { top: 18 },
          offsetY: (1 - logosIn) * 24,
          // Rows expand to the column's full width — center the logos.
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          children: logoKids,
        },
      ],
    };

    // -- Numbered steps. Popped ~30f earlier so the bottom third of the
    // page never sits empty waiting for them (P2).
    var stepKids = [];
    for (var st = 0; st < steps.length; st++) {
      var stPop = pop(frame, 86 + st * 8, 16);
      stepKids.push({
        type: 'row',
        crossAxisAlignment: 'center',
        margin: { left: st === 0 ? 0 : (portrait ? 60 : 110) },
        opacity: stPop.opacity,
        offsetY: (1 - stPop.scale) * 30,
        children: [
          {
            type: 'container',
            width: 58,
            height: 58,
            borderRadius: 29,
            borderColor: primary,
            borderWidth: 2.5,
            scale: Math.max(0.001, stPop.scale),
            child: {
              type: 'stack',
              fit: 'expand',
              children: [{
                type: 'text',
                alignment: 'center',
                text: '' + (st + 1),
                style: { fontSize: 26, color: primary, fontFamily: font, fontWeight: 700 },
              }],
            },
          },
          {
            type: 'text',
            text: steps[st],
            margin: { left: 18 },
            style: { fontSize: 28, color: ink, fontFamily: font, fontWeight: 600 },
          },
        ],
      });
    }
    var stepsRow = {
      type: 'row',
      alignment: 'bottomCenter',
      offsetY: portrait ? -140 : -110,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: stepKids,
    };

    // -- Frosted tool rail on the right edge (path-drawn glyphs).
    var railIn = ease(frame, 134, 152, eo3);
    var railGlyphs = [
      'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z', // sparkle
      'M 4 4 L 28 4 L 28 28 L 4 28 Z M 8 24 L 14 16 L 19 21 L 23 15 L 28 22', // image
      'M 6 8 L 26 8 M 16 8 L 16 28', // text
      'M 4 4 L 28 4 L 28 28 L 4 28 Z M 4 14 L 28 14 M 14 14 L 14 28', // layout
    ];
    var railKids = [];
    for (var rg = 0; rg < railGlyphs.length; rg++) {
      railKids.push({
        type: 'container',
        width: 64,
        height: 64,
        margin: { top: rg === 0 ? 0 : 16 },
        color: '#f2ffffff',
        borderColor: '#e7dccb',
        borderWidth: 1.5,
        borderRadius: 18,
        shadow: { color: '#144c1d95', blur: 14, offsetX: 0, offsetY: 6 },
        child: {
          type: 'path',
          path: railGlyphs[rg],
          color: primary,
          strokeWidth: 2.6,
          width: 30,
          height: 30,
          alignment: 'center',
        },
      });
    }
    var rail = {
      type: 'column',
      alignment: 'centerRight',
      // Hug the hero card: ~95px in from the frame edge (was 40px — that
      // read as detached from the page layout). Entrance still slides in
      // from the right.
      offsetX: -95 + (1 - railIn) * 90,
      opacity: railIn,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: railKids,
    };

    // -- Light-sweep reveal: a white band wiping across at the start.
    var sweep = {
      type: 'container',
      alignment: 'center',
      offsetX: lerp(-1400, 1400, ease(frame, 48, 80, eio3)),
      width: 700,
      height: 1400,
      rotation: 18,
      opacity: 0.9 * (1 - seg(frame, 70, 86)),
      gradient: {
        type: 'linear',
        begin: 'centerLeft',
        end: 'centerRight',
        colors: ['#00ffffff', '#e6ffffff', '#00ffffff'],
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        { type: 'container', color: '#fdf6ec' },
        nav,
        heroRow,
        logoStrip,
        stepsRow,
        rail,
        promptPill,
        promptCursor,
        sweep,
      ],
    };
  },
};
