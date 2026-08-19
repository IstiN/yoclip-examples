// 10 — Carousel: the pastel site explodes into an Instagram grid.
//
// Reference beat (Gamma 51–57s, compressed): the Nova site from 09 sits
// center on the same pastel world; a "Turn into Shorts" pill pops, the cursor
// clicks it, and the site EXPLODES into 6 square social posts that scatter
// outward with staggerItem + eoBack, then settle into a 3x2 grid on a
// sky-blue world. One post zooms center, a "Share on social" pill clicks,
// the likes counter ticks up — then we pull back to the full grid and a
// follow caption chip rises.
//
// Renderer notes: Geneva lacks heart/comment glyphs — the footer icons are
// stroked `path` glyphs. Rows inside a tight stack need an explicit width.
// The bg swap pastel -> sky is a crossfade layer, not a cut.

scene = {
  id: 'carousel',
  duration: 201,
  description: 'Pastel Nova hero sits center; "Turn into Shorts" pill pops and the cursor clicks it; the site explodes into 6 square Instagram-style posts (header/handle, spark|step|quote content, heart/comment/share footer) that scatter then settle into a 3x2 grid on a sky-blue world; one post zooms center, "Share on social" pill clicks, likes counter ticks up; pull back to the grid + follow caption chip.',
  voicePrompts: {
    en: 'A bright pop as the page bursts into posts; upbeat social sparkle.',
    ru: 'Яркий поп — страница разлетается на посты; бодрый социальный блеск.',
  },
  timeline: {
    label: yoclipT('carousel').timeline || 'Carousel',
    color: '#ec4899',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('carousel');
    var turn = t.turn || 'Turn into Shorts';
    var share = t.share || 'Share on social';
    var handle = t.handle || 'nova';
    var follow = t.follow || 'Follow us for more renders';
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 179, 14);

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var ink = '#1f2937';
    var muted = '#8a7f70';
    var figure = '#4c1d95';
    var blue = '#2563eb';

    // -- Beat timing.
    var BURST = 26;   // site explodes into posts
    var ZOOM0 = 74;   // one post zooms center
    var BACK0 = 132;  // pull back to the grid

    // -- Beat 1: the simplified Nova hero from 09, center.
    var heroPop = pop(frame, 2, 18);
    var heroOut = seg(frame, BURST, BURST + 14);
    var hero = {
      type: 'container',
      alignment: 'center',
      width: portrait ? 760 : 860,
      height: portrait ? 560 : 500,
      opacity: heroPop.opacity * (1 - heroOut),
      scale: Math.max(0.05, heroPop.scale * (1 + 0.3 * heroOut)),
      color: '#ffffff',
      borderRadius: 32,
      shadow: { color: '#2e4c1d95', blur: 44, offsetX: 0, offsetY: 18 },
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          {
            type: 'text',
            alignment: 'topCenter',
            offsetY: 54,
            text: 'Nova',
            style: { fontSize: 30, color: primary, fontFamily: font, fontWeight: 700 },
          },
          {
            type: 'text',
            alignment: 'center',
            offsetY: -40,
            text: 'Calm videos\nfor busy teams.',
            style: {
              fontSize: portrait ? 46 : 54,
              color: ink,
              fontFamily: font,
              fontWeight: 700,
              lineHeight: 1.12,
            },
          },
          {
            type: 'container',
            alignment: 'center',
            offsetY: 150,
            gradient: {
              colors: [primaryLight, primary],
              begin: 'centerLeft',
              end: 'centerRight',
            },
            borderRadius: 999,
            shadow: { color: yoclipColorA('primary', 0x59, '#7c3aed'), blur: 22, offsetX: 0, offsetY: 10 },
            child: {
              type: 'text',
              text: 'Render free draft',
              margin: { left: 34, right: 34, top: 15, bottom: 15 },
              style: { fontSize: 26, color: '#ffffff', fontFamily: font, fontWeight: 700 },
            },
          },
        ],
      },
    };

    // "Turn into Shorts" pill: pops over the hero, cursor clicks it.
    var chipPop = pop(frame, 8, 14);
    var chipDip = seg(frame, 22, 25) * (1 - seg(frame, 26, 31));
    var chipOp = chipPop.opacity * (1 - seg(frame, 32, 42));
    var turnChip = {
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? -360 : -310,
      // Explicit width — a container > row stretches to the frame otherwise.
      width: portrait ? 340 : 380,
      opacity: chipOp,
      scale: Math.max(0.05, chipPop.scale * (1 - 0.1 * chipDip)),
      color: '#ffffff',
      borderRadius: 999,
      borderColor: '#eadfce',
      borderWidth: 1.5,
      shadow: { color: '#2e4c1d95', blur: 20, offsetX: 0, offsetY: 8 },
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 24 },
          {
            type: 'path',
            path: 'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z',
            color: primary,
            strokeWidth: 2.5,
            width: 20,
            height: 20,
            margin: { right: 12 },
          },
          {
            type: 'text',
            text: turn,
            style: { fontSize: 26, color: ink, fontFamily: font, fontWeight: 600 },
          },
          { type: 'container', width: 26 },
          { type: 'container', height: 58 },
        ],
      },
    };

    // -- Beat 2: 6 square posts scatter out, then settle into a 3x2 grid.
    var CARD = portrait ? 300 : 330;
    // Grid sits ~34px higher so the follow caption chip never collides
    // with the bottom row's footers.
    var gridX = portrait ? [-170, 170, -170, 170, -170, 170]
                       : [-360, 0, 360, -360, 0, 360];
    var gridY = portrait ? [-390, -390, -40, -40, 310, 310]
                       : [-214, -214, -214, 146, 146, 146];
    var likesBase = [128, 86, 214, 97, 168, 142];
    var ZOOMED = 4; // bottom-center card zooms

    var zoom = ease(frame, ZOOM0, ZOOM0 + 20, eio3) * (1 - ease(frame, BACK0, BACK0 + 20, eio3));

    // Mini abstract spark mark (from 09, shrunk): three rotated rounded
    // bars + white core — no figures.
    function sparkContent() {
      function sparkBar(rot) {
        return {
          type: 'container',
          alignment: 'center',
          width: 12,
          height: 52,
          borderRadius: 6,
          rotation: rot,
          color: figure,
        };
      }
      return {
        type: 'container',
        width: 286,
        height: 196,
        borderRadius: 18,
        gradient: {
          colors: ['#f9a8d4', '#fcd34d'],
          begin: 'topLeft',
          end: 'bottomRight',
        },
        child: {
          type: 'stack',
          fit: 'expand',
          children: [
            sparkBar(0),
            sparkBar(60),
            sparkBar(120),
            {
              type: 'container',
              alignment: 'center',
              width: 18,
              height: 18,
              borderRadius: 999,
              color: '#ffffff',
            },
          ],
        },
      };
    }

    function stepContent(num, label) {
      return {
        type: 'container',
        width: 286,
        height: 196,
        borderRadius: 18,
        color: '#f3ece1',
        child: {
          type: 'stack',
          fit: 'expand',
          children: [
            {
              type: 'text',
              alignment: 'center',
              offsetY: -28,
              text: num,
              style: { fontSize: 64, color: primary, fontFamily: font, fontWeight: 700 },
            },
            {
              type: 'text',
              alignment: 'center',
              offsetY: 48,
              text: label,
              style: { fontSize: 24, color: muted, fontFamily: font, fontWeight: 600 },
            },
          ],
        },
      };
    }

    function quoteContent(q) {
      return {
        type: 'container',
        width: 286,
        height: 196,
        borderRadius: 18,
        color: '#f6efe4',
        padding: 24,
        child: {
          type: 'stack',
          fit: 'expand',
          children: [{
            type: 'text',
            alignment: 'center',
            text: q,
            style: {
              fontSize: 27,
              color: ink,
              fontFamily: font,
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.25,
            },
          }],
        },
      };
    }

    var contents = [
      sparkContent(),
      stepContent('01', 'Describe'),
      quoteContent('One breath\nreset.'),
      stepContent('02', 'Render'),
      sparkContent(),
      quoteContent('Calm teams\nship calm videos.'),
    ];

    function postCard(i) {
      var col = i % 3;
      var row = Math.floor(i / 3);
      // Fly out to a wide scatter, then settle into the grid slot.
      var p1 = staggerItem(frame, i, BURST, 4, 18);
      var e1 = eoBack(p1);
      var m = ease(frame, 46 + i * 2, 46 + i * 2 + 22, eio3);
      var scatX = (col - 1) * (portrait ? 300 : 560);
      var scatY = (row - 0.5) * (portrait ? 520 : 460);
      var scatRot = (i - 2.5) * 8;
      var gx = lerp(lerp(0, scatX, clamp(e1, 0, 1.2)), gridX[i], m);
      var gy = lerp(lerp(40, scatY, clamp(e1, 0, 1.2)), gridY[i], m);
      var rot = lerp(lerp(0, scatRot, clamp(e1, 0, 1)), 0, m);
      var sc = Math.max(0.05, 0.3 + 0.7 * clamp(e1, 0, 1.15));
      var op = seg(frame, BURST + i * 4, BURST + i * 4 + 8);

      // Beat 3: the zoomed card travels to center and grows; the rest dim.
      if (i === ZOOMED) {
        gx = lerp(gx, 0, zoom);
        gy = lerp(gy, portrait ? -40 : -10, zoom);
        sc = sc * lerp(1, portrait ? 1.35 : 1.55, zoom);
      } else {
        // Focus dim on the non-zoomed cards — keeps the grid readable
        // (0.35 floor, not washed-out 0.2 smudges).
        op = op * (1 - 0.65 * zoom);
      }

      var likes = i === ZOOMED
        ? counter(frame, 122, 28, likesBase[i], likesBase[i] + 45)
        : likesBase[i];

      return {
        type: 'container',
        alignment: 'center',
        offsetX: gx,
        offsetY: gy,
        width: CARD,
        height: CARD,
        scale: sc,
        rotation: rot,
        opacity: op,
        color: '#ffffff',
        borderRadius: 20,
        shadow: { color: '#33325b7a', blur: 24, offsetX: 0, offsetY: 10 },
        child: {
          type: 'stack',
          fit: 'expand',
          children: [
            // Header: avatar + handle + dots.
            {
              type: 'row',
              alignment: 'topCenter',
              offsetY: 16,
              width: 286,
              mainAxisAlignment: 'spaceBetween',
              crossAxisAlignment: 'center',
              children: [
                {
                  type: 'row',
                  crossAxisAlignment: 'center',
                  children: [
                    {
                      type: 'container',
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      gradient: {
                        colors: [primary, primaryLight],
                        begin: 'topLeft',
                        end: 'bottomRight',
                      },
                    },
                    {
                      type: 'text',
                      text: handle,
                      margin: { left: 12 },
                      style: { fontSize: 23, color: ink, fontFamily: font, fontWeight: 700 },
                    },
                  ],
                },
                {
                  type: 'row',
                  crossAxisAlignment: 'center',
                  children: [
                    { type: 'container', width: 5, height: 5, borderRadius: 3, color: muted },
                    { type: 'container', width: 5, height: 5, borderRadius: 3, color: muted, margin: { left: 5 } },
                    { type: 'container', width: 5, height: 5, borderRadius: 3, color: muted, margin: { left: 5 } },
                  ],
                },
              ],
            },
            // Content area — wrapped in a scale container so the zoomed
            // card's content grows with the card (same zoom factor)
            // instead of staying a fixed 286x196 island.
            {
              type: 'container',
              alignment: 'center',
              offsetY: 4,
              scale: i === ZOOMED ? lerp(1, portrait ? 1.35 : 1.55, zoom) : 1,
              child: contents[i],
            },
            // Footer: heart + count, comment, share.
            {
              type: 'row',
              alignment: 'bottomCenter',
              offsetY: -14,
              width: 286,
              crossAxisAlignment: 'center',
              children: [
                {
                  type: 'path',
                  path: 'M 12 21 C 3 14 1 6 6.5 3.5 C 9.5 2 12 4.5 12 7 C 12 4.5 14.5 2 17.5 3.5 C 23 6 21 14 12 21 Z',
                  color: '#e11d48',
                  strokeWidth: 2.2,
                  width: 24,
                  height: 24,
                },
                {
                  type: 'text',
                  text: '' + likes,
                  margin: { left: 8 },
                  style: { fontSize: 21, color: muted, fontFamily: font, fontWeight: 600 },
                },
                {
                  type: 'path',
                  path: 'M 12 2 A 10 10 0 1 1 11.9 2',
                  color: muted,
                  strokeWidth: 2.2,
                  width: 24,
                  height: 24,
                  margin: { left: 22 },
                },
                {
                  type: 'path',
                  path: 'M 5 19 L 19 5 M 11 5 L 19 5 L 19 13',
                  color: muted,
                  strokeWidth: 2.2,
                  width: 24,
                  height: 24,
                  margin: { left: 22 },
                },
              ],
            },
          ],
        },
      };
    }

    var cards = [];
    for (var i = 0; i < 6; i++) {
      if (i !== ZOOMED) cards.push(postCard(i));
    }
    cards.push(postCard(ZOOMED)); // zoomed card renders on top

    // -- Beat 3: blue share pill under the zoomed post; cursor clicks it.
    var sharePop = pop(frame, 96, 14);
    var shareDip = seg(frame, 116, 119) * (1 - seg(frame, 120, 125));
    var shareOp = sharePop.opacity * (1 - seg(frame, BACK0 - 4, BACK0 + 10));
    var sharePill = {
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? 420 : 330,
      width: portrait ? 320 : 360,
      opacity: shareOp,
      scale: Math.max(0.05, sharePop.scale * (1 - 0.08 * shareDip)),
      gradient: {
        colors: ['#60a5fa', blue],
        begin: 'centerLeft',
        end: 'centerRight',
      },
      borderRadius: 999,
      shadow: { color: '#662563eb', blur: 26, offsetX: 0, offsetY: 10 },
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: 28 },
          {
            type: 'path',
            path: 'M 5 19 L 19 5 M 11 5 L 19 5 L 19 13',
            color: '#ffffff',
            strokeWidth: 2.6,
            width: 20,
            height: 20,
            margin: { right: 12 },
          },
          {
            type: 'text',
            text: share,
            style: { fontSize: 27, color: '#ffffff', fontFamily: font, fontWeight: 700 },
          },
          { type: 'container', width: 30 },
          { type: 'container', height: 62 },
        ],
      },
    };

    // -- Beat 4: follow caption chip rises under the restored grid.
    // Sits low enough to clear the (raised) bottom row's footers.
    var capPop = pop(frame, 158, 16);
    var followChip = {
      type: 'container',
      alignment: 'bottomCenter',
      offsetY: portrait ? -54 : -46,
      opacity: capPop.opacity,
      scale: Math.max(0.05, capPop.scale),
      color: '#1f2937',
      borderRadius: 999,
      shadow: { color: '#40325b7a', blur: 22, offsetX: 0, offsetY: 10 },
      child: {
        type: 'text',
        text: follow,
        margin: { left: 32, right: 32, top: 15, bottom: 15 },
        style: { fontSize: 25, color: '#ffffff', fontFamily: font, fontWeight: 600 },
      },
    };

    // -- Cursor: clicks the turn chip (beat 1), then the share pill (beat 3).
    var curOp1 = seg(frame, 10, 15) * (1 - seg(frame, 38, 45));
    var glide1 = ease(frame, 15, 24, eio3);
    var curOp3 = seg(frame, 98, 103) * (1 - seg(frame, 126, 132));
    var glide3 = ease(frame, 103, 116, eio3);
    var curX, curY, curOp;
    if (frame < 96) {
      curX = lerp(520, 60, glide1);
      curY = lerp(330, -296, glide1);
      curOp = curOp1;
    } else {
      curX = lerp(430, 130, glide3);
      curY = lerp(390, portrait ? 432 : 342, glide3);
      curOp = curOp3;
    }
    var cursor = {
      type: 'path',
      path: 'M 6 2 L 6 30 L 12 24 L 17 34 L 21 32 L 16 23 L 25 23 Z',
      color: '#1f2937',
      strokeWidth: 3,
      width: 34,
      height: 34,
      alignment: 'center',
      offsetX: curX,
      offsetY: curY,
      opacity: curOp,
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        // Same pastel world as 09 — the transition reads as a transform.
        { type: 'container', color: '#fdf6ec' },
        // Sky-blue world fades in as the posts land.
        {
          type: 'container',
          opacity: seg(frame, 30, 54),
          gradient: {
            type: 'linear',
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#bcd7f0', '#8fb8dd'],
          },
        },
        hero,
        turnChip,
      ].concat(cards, [sharePill, followChip, cursor]),
    };
  },
};
