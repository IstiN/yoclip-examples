// 09 — Export: one command, real files out.
//
// Reference beat (Gamma share/export): a terminal window types the render
// command (~2.5 ch/f, block caret), a progress bar fills with a live %
// counter, then four output chips pop staggered — each with a path-drawn
// check. Everything holds under a soft breathing primary glow.
//
// Renderer notes: container styling must be direct props; padded chips are
// container > row children with margin on the text; checks are `path` nodes
// (Geneva has no ✓ glyph).

scene = {
  id: 'export',
  duration: 216,
  description: 'Terminal window types "yoclip render -V dark_en -o big_idea.mp4" with a block caret, a rendering progress bar fills with a % counter, then 4 output chips (MP4 · H.264 / 30 fps / 1920×1080 / EN + RU) pop with path-drawn checks; the terminal holds with a breathing primary glow.',
  voicePrompts: {
    en: 'Keystrokes, a rising render hum, four soft confirmation ticks.',
    ru: 'Стук клавиш, нарастающий гул рендера, четыре мягких подтверждения.',
  },
  timeline: {
    label: yoclipT('export').timeline || 'Export',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('export');
    var command = t.command || 'yoclip render -V dark_en -o big_idea.mp4';
    var chipTexts = t.chips || ['MP4 · H.264', '30 fps', '1920×1080', 'EN + RU'];
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 194, 14);

    var font = yoclipFont();
    var surface = yoclipColor('surface', '#15131f');
    var deep = yoclipColor('backgroundDeep', '#07070d');
    var txt = yoclipColor('text', '#ffffff');
    var muted = yoclipColor('textMuted', '#a1a1aa');
    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');

    // -- Beats.
    var TYPE_START = 18;                 // command typing (~2.5 ch/f = 75 cps)
    var typed = typewriter(command, frame, TYPE_START, 75);
    var typingDone = TYPE_START + Math.ceil(command.length / 2.5);
    var PROG_START = typingDone + 40;    // progress bar fill
    var PROG_DUR = 76;
    // Bar fill and % counter share the same eased progress.
    var prog = ease(frame, PROG_START, PROG_START + PROG_DUR, eo3);
    var pct = counter(frame, PROG_START, PROG_DUR, 0, 100);
    var CHIPS_START = PROG_START + PROG_DUR + 8;
    var lineIn = ease(frame, typingDone + 26, typingDone + 36, eo3);
    var glowPulse = seg(frame, CHIPS_START + 36, CHIPS_START + 48);

    // -- Terminal window.
    var cardIn = ease(frame, 4, 26, eo3);
    var termW = portrait ? 960 : 1120;
    var barW = termW - 96;

    function dot(color) {
      return { type: 'container', width: 16, height: 16, color: color, borderRadius: 8 };
    }

    var caretOp = blink(frame, 8) * (1 - seg(frame, typingDone + 22, typingDone + 28));

    var terminal = {
      type: 'container',
      alignment: 'center',
      offsetY: portrait ? -220 : -80,
      width: termW,
      height: portrait ? 620 : 560,
      opacity: cardIn,
      offsetX: 0,
      color: deep,
      borderRadius: 24,
      borderColor: yoclipColorA('primaryLight', 0x33, '#a78bfa'),
      borderWidth: 1.5,
      shadow: { color: yoclipColorA('primary', 0x55, '#7c3aed'), blur: 46 + 24 * shimmer(frame, 60) * glowPulse, offsetX: 0, offsetY: 22 },
      clip: true,
      child: {
        type: 'column',
        crossAxisAlignment: 'start',
        children: [
          // Chrome: mac dots.
          {
            type: 'container',
            height: 64,
            color: yoclipColorA('surface', 0x99, '#15131f'),
            child: {
              type: 'row',
              crossAxisAlignment: 'center',
              children: [
                { type: 'container', width: 28 },
                dot(yoclipColor('macRed', '#ff5f57')),
                { type: 'container', width: 10 },
                dot(yoclipColor('macYellow', '#febc2e')),
                { type: 'container', width: 10 },
                dot(yoclipColor('macGreen', '#28c840')),
                {
                  type: 'text',
                  text: 'yoclip — zsh',
                  offsetX: 22,
                  style: { fontSize: 22, color: muted, fontFamily: font, letterSpacing: 2 },
                },
              ],
            },
          },
          // Command line.
          {
            type: 'container',
            offsetX: 44,
            offsetY: 46,
            child: {
              type: 'row',
              crossAxisAlignment: 'center',
              children: [
                {
                  type: 'text',
                  text: '$ ',
                  style: { fontSize: portrait ? 26 : 30, color: accent, fontFamily: font, fontWeight: 700 },
                },
                {
                  type: 'text',
                  text: typed,
                  style: { fontSize: portrait ? 26 : 30, color: txt, fontFamily: font },
                },
                {
                  type: 'container',
                  width: 16,
                  height: portrait ? 30 : 34,
                  margin: { left: 4 },
                  color: accent,
                  opacity: caretOp,
                },
              ],
            },
          },
          // Rendering label + progress bar + %.
          {
            type: 'container',
            offsetX: 44,
            offsetY: 104,
            opacity: lineIn,
            child: {
              type: 'column',
              crossAxisAlignment: 'start',
              children: [
                {
                  type: 'text',
                  text: 'rendering big_idea.mp4',
                  style: { fontSize: portrait ? 22 : 24, color: muted, fontFamily: font, fontStyle: 'italic' },
                },
                { type: 'container', height: 20 },
                {
                  type: 'row',
                  crossAxisAlignment: 'center',
                  children: [
                    {
                      type: 'container',
                      width: barW - 110,
                      height: 22,
                      color: surface,
                      borderRadius: 11,
                      clip: true,
                      // A container `child` is stretched to fill, so the fill
                      // lives in an expand stack aligned left — its width
                      // actually tracks `prog`.
                      child: {
                        type: 'stack',
                        fit: 'expand',
                        children: [{
                          type: 'container',
                          alignment: 'centerLeft',
                          width: Math.max(4, (barW - 110) * prog),
                          height: 22,
                          borderRadius: 11,
                          gradient: {
                            colors: [primary, accent],
                            begin: 'centerLeft',
                            end: 'centerRight',
                          },
                        }],
                      },
                    },
                    {
                      type: 'text',
                      text: pct + '%',
                      margin: { left: 24 },
                      style: { fontSize: portrait ? 24 : 26, color: accent, fontFamily: font, fontWeight: 700 },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    };

    // -- Output chips with path-drawn checks.
    function chip(i) {
      var p = staggerItem(frame, i, CHIPS_START, 9, 12);
      var sc = Math.max(0.05, 0.6 + 0.4 * eoBack(p));
      return {
        type: 'container',
        scale: sc,
        // Opacity floor once the entrance starts: the chip container is
        // visible from its first frame (hidden entirely before it).
        opacity: p === 0 ? 0 : 0.3 + 0.7 * eo3(p),
        color: surface,
        borderRadius: 999,
        borderColor: yoclipColorA('primaryLight', 0x40, '#a78bfa'),
        borderWidth: 1.5,
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: [
            { type: 'container', width: 22 },
            {
              type: 'path',
              path: 'M 5 14 L 12 21 L 25 7',
              progress: eo3(p),
              color: accent,
              strokeWidth: 4,
              width: 30,
              height: 28,
            },
            {
              type: 'text',
              text: chipTexts[i],
              margin: { left: 14, right: 24, top: 14, bottom: 14 },
              style: { fontSize: portrait ? 23 : 25, color: txt, fontFamily: font, fontWeight: 600 },
            },
          ],
        },
      };
    }

    var chips = portrait
      ? {
          type: 'column',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 420,
          children: [
            chip(0), { type: 'container', height: 18 },
            chip(1), { type: 'container', height: 18 },
            chip(2), { type: 'container', height: 18 },
            chip(3),
          ],
        }
      : {
          type: 'row',
          mainAxisAlignment: 'center',
          crossAxisAlignment: 'center',
          alignment: 'center',
          offsetY: 330,
          children: [
            chip(0), { type: 'container', width: 22 },
            chip(1), { type: 'container', width: 22 },
            chip(2), { type: 'container', width: 22 },
            chip(3),
          ],
        };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [terminal, chips],
    };
  },
};
