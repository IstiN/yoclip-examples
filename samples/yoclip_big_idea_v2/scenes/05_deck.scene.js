// 05 — Deck: the generated deck assembles on a sky-blue world.
//
// Reference beat (Gamma 18–22s): after the prompt click, the sky opens and
// the generated deck flies in piece by piece — a hero card (golden frame +
// title), a left thumbnail nav, and feature bullets on the right. Cards fly
// in from the left with an eoBack stagger; once assembled the whole deck
// pans slowly upward until the scene hands off.
//
// Renderer notes: container styling is direct props only (`decoration` is
// silently dropped); Geneva lacks icon glyphs so bullet icons are stroked
// `path` glyphs inside white chips. All positioned children of the root
// fit:'expand' stack carry `alignment`.

scene = {
  id: 'deck',
  duration: 171,
  description: 'Sky-blue world: hero card (golden_space image + title/subtitle) flies in from the left, 4 thumbnail cards slide into a left nav staggered, 3 bullet rows rise on the right, then the assembled deck pans slowly upward.',
  voicePrompts: {
    en: 'Bright airy plucks as each card lands; a soft rising pad under the pan.',
    ru: 'Светлые переборы на каждую карточку; мягкий восходящий пэд под панораму.',
  },
  timeline: {
    label: yoclipT('deck').timeline || 'Deck',
    color: '#2563eb',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('deck');
    var title = t.title || 'yoclip golden tests';
    var subtitle = t.subtitle || 'Every frame is a test fixture';
    var bullets = t.bullets || [
      ['Zero setup', 'describe a video in JS, get an MP4'],
      ['Code-first', 'git-diffable scenes, real reviews'],
      ['GPU 3D', 'GLB with textures and skeletal clips'],
    ];
    // Textless goldens only: golden_hook has baked-in caption text that
    // reads as noise at thumbnail size.
    var thumbSrcs = ['golden_endcard', 'golden_monolith', 'golden_kaleido', 'golden_tunnel'];
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 149, 14);

    // Sky-world ink colors (Gamma fidelity — hardcoded sky/UI hexes).
    var navy = '#0f2a44';
    var navySoft = '#41617f';
    var chipBlue = '#2563eb';

    // Slow upward pan once the deck has assembled.
    var pan = frame > 118 ? (frame - 118) * 0.55 : 0;

    // -- Hero card: flies in from the left with a back-eased overshoot.
    var he = ease(frame, 8, 34, eoBack);
    var heroOp = seg(frame, 8, 20);
    var heroX = lerp(portrait ? 0 : -880, portrait ? 0 : -180, he);
    var heroY = (portrait ? -270 : -10) - pan;
    var heroW = portrait ? 560 : 620;
    // Golden frames are 1920x1080 — the image box keeps the 16:9 ratio so
    // fit:'cover' shows the whole frame instead of cropping.
    var heroImgH = Math.round(heroW * 9 / 16);
    // Card height = image + text block; the old 740px card left ~200px of
    // empty navy at the bottom.
    var heroH = heroImgH + (portrait ? 150 : 158);

    var hero = {
      type: 'container',
      alignment: 'center',
      offsetX: heroX,
      offsetY: heroY,
      width: heroW,
      height: heroH,
      opacity: heroOp,
      color: '#16324f',
      borderRadius: 24,
      shadow: { color: '#590f2a44', blur: 50, offsetX: 0, offsetY: 24 },
      clip: true,
      child: {
        type: 'column',
        crossAxisAlignment: 'start',
        children: [
          {
            type: 'image',
            source: 'external:golden_space',
            fit: 'cover',
            width: heroW,
            height: heroImgH,
          },
          {
            // Footer: the text block is vertically centered in its band so
            // the title never hugs the card edge.
            type: 'container',
            height: heroH - heroImgH,
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'start',
            margin: { left: 36, right: 36 },
            child: {
              type: 'column',
              crossAxisAlignment: 'start',
              children: [
                {
                  type: 'text',
                  text: title,
                  textAlign: 'left',
                  style: {
                    fontSize: portrait ? 34 : 42,
                    color: '#ffffff',
                    fontFamily: font,
                    fontWeight: 700,
                  },
                },
                {
                  type: 'text',
                  text: subtitle,
                  textAlign: 'left',
                  margin: { top: 12 },
                  style: {
                    fontSize: portrait ? 22 : 26,
                    color: '#bcd7f0',
                    fontFamily: font,
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // -- Left thumbnail nav: 4 mini cards sliding in staggered.
    var thumbs = [];
    for (var i = 0; i < 4; i++) {
      var te = eoBack(staggerItem(frame, i, 30, 8, 20));
      var tOp = seg(frame, 30 + i * 8, 38 + i * 8);
      thumbs.push({
        type: 'container',
        width: portrait ? 140 : 170,
        height: portrait ? 90 : 108,
        margin: { top: i === 0 ? 0 : 18 },
        opacity: tOp,
        offsetX: (1 - te) * -320,
        color: '#ffffff',
        borderRadius: 14,
        borderColor: '#dfffff',
        borderWidth: 1.5,
        shadow: { color: '#330f2a44', blur: 18, offsetX: 0, offsetY: 8 },
        clip: true,
        child: {
          type: 'image',
          source: 'external:' + thumbSrcs[i],
          fit: 'cover',
          width: portrait ? 140 : 170,
          height: portrait ? 90 : 108,
        },
      });
    }
    // NOTE: columns expand to the full frame height even with `alignment`
    // set, so vertical placement goes through mainAxisAlignment.
    var thumbNav = {
      type: 'column',
      alignment: portrait ? 'center' : 'centerLeft',
      offsetX: portrait ? -330 : 84,
      offsetY: (portrait ? -270 : -10) - pan,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: thumbs,
    };

    // -- Bullet rows: icon chip circle + bold title + muted desc, rising.
    var glyphPaths = [
      'M 8 17 L 15 24 L 26 9',                              // check
      'M 12 8 L 5 16 L 12 24 M 20 8 L 27 16 L 20 24',      // code
      'M 16 4 L 27 10.5 L 27 21.5 L 16 28 L 5 21.5 L 5 10.5 Z M 5 10.5 L 16 17 L 27 10.5 M 16 17 L 16 28', // cube
    ];
    var bulletRows = [];
    for (var b = 0; b < bullets.length; b++) {
      var be = eo3(staggerItem(frame, b, 62, 12, 22));
      bulletRows.push({
        type: 'container',
        width: portrait ? 620 : 560,
        margin: { top: b === 0 ? 0 : 22 },
        opacity: be,
        offsetY: (1 - be) * 60,
        color: '#f2ffffff',
        borderRadius: 18,
        shadow: { color: '#260f2a44', blur: 22, offsetX: 0, offsetY: 10 },
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 22 },
            {
              type: 'container',
              width: 56,
              height: 56,
              color: '#ffffff',
              borderRadius: 28,
              borderColor: '#dce9f5',
              borderWidth: 1.5,
              child: {
                type: 'path',
                path: glyphPaths[b % glyphPaths.length],
                color: chipBlue,
                strokeWidth: 3,
                width: 32,
                height: 32,
                alignment: 'center',
              },
            },
            { type: 'container', width: 22 },
            {
              type: 'column',
              crossAxisAlignment: 'start',
              children: [
                {
                  type: 'text',
                  text: bullets[b][0],
                  textAlign: 'left',
                  style: {
                    fontSize: portrait ? 26 : 30,
                    color: navy,
                    fontFamily: font,
                    fontWeight: 700,
                  },
                },
                {
                  type: 'text',
                  text: bullets[b][1],
                  textAlign: 'left',
                  margin: { top: 4, bottom: 20 },
                  style: {
                    fontSize: portrait ? 20 : 23,
                    color: navySoft,
                    fontFamily: font,
                  },
                },
              ],
            },
            { type: 'container', height: 84 },
          ],
        },
      });
    }
    var bulletCol = {
      type: 'column',
      alignment: portrait ? 'center' : 'centerRight',
      offsetX: portrait ? 0 : -120,
      offsetY: (portrait ? 330 : -10) - pan,
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      children: bulletRows,
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Sky-blue world (Gamma fidelity).
        {
          type: 'container',
          gradient: {
            type: 'linear',
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#7db4e8', '#bcd7f0'],
          },
        },
        // Soft sun glow upper-right.
        {
          type: 'container',
          alignment: 'topRight',
          width: 700,
          height: 700,
          gradient: {
            type: 'radial',
            center: 'center',
            radius: 0.5,
            colors: ['#59ffffff', '#00ffffff'],
          },
        },
        thumbNav,
        hero,
        bulletCol,
      ],
    };
  },
};
