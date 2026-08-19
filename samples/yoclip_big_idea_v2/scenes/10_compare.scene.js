// 10 — Compare: code-review your cut.
//
// A dark glass review panel: commit hash up top, two version cards side by
// side (v1 dimmed, v2 bright with a green stroke), red "-3" and green "+12"
// badges popping on the cards, and a stats row at the bottom. Everything
// is absolutely positioned inside the panel from its top-left corner so
// bounds stay explicit.

scene = {
  id: 'compare',
  duration: 150,
  description: 'Dark review panel: commit chip a3f9c1d, v1/v2 golden cards side by side with an arrow between, red -3 badge on v1 and green +12 on v2 popping in, stats row "+12 -3 scenes" at the bottom.',
  voicePrompts: {
    en: 'A crisp diff-review beat: two soft pops as the change badges land.',
    ru: 'Чёткий бит код-ревью: два мягких попа, когда бейджи изменений встают на место.',
  },
  timeline: {
    label: yoclipT('compare').timeline || 'Diff',
    color: '#22c55e',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('compare');
    var font = yoclipFont();
    var portrait = yoclipIsPortrait();
    var life = presence(frame, 10, 116, 14);

    var panelW = portrait ? 940 : 1480;
    var panelH = 640;
    var cardW = portrait ? 400 : 660;
    var cardH = portrait ? 400 : 440;
    var gap = panelW - 48 * 2 - cardW * 2;

    // -- Motion.
    var panelIn = eo3(seg(frame, 0, 12));
    var v1In = eio3(seg(frame, 8, 28));
    var v2In = eio3(seg(frame, 12, 32));
    var redPop = pop(frame, 34, 12);
    var greenPop = pop(frame, 42, 12);
    var statsIn = eo3(seg(frame, 50, 62));

    var green = '#22c55e';
    var red = '#ef4444';
    var muted = '#8a93b2';

    function versionCard(src, x, inE, fromX) {
      return {
        type: 'container',
        alignment: 'topLeft',
        offsetX: x + (1 - inE) * fromX,
        offsetY: 104,
        width: cardW,
        height: cardH,
        opacity: inE,
        borderRadius: 18,
        clip: true,
        color: '#0d1020',
        child: {
          type: 'image',
          source: 'external:' + src,
          fit: 'cover',
          width: cardW,
          height: cardH,
        },
      };
    }

    function labelChip(text, x, y) {
      return {
        type: 'container',
        alignment: 'topLeft',
        offsetX: x,
        offsetY: y,
        width: 64,
        height: 36,
        borderRadius: 10,
        color: '#d90a0e1a',
        child: {
          type: 'text',
          text: text,
          margin: { left: 16, top: 7 },
          style: { fontSize: 18, color: '#ffffff', fontFamily: font, fontWeight: 700 },
        },
      };
    }

    function badge(text, x, y, color, p) {
      return {
        type: 'container',
        alignment: 'topLeft',
        offsetX: x,
        offsetY: y,
        height: 40,
        borderRadius: 999,
        color: color,
        opacity: p.opacity,
        scale: Math.max(0.05, p.scale),
        child: {
          type: 'text',
          text: text,
          margin: { left: 18, right: 18, top: 8 },
          style: { fontSize: 19, color: '#ffffff', fontFamily: font, fontWeight: 700 },
        },
      };
    }

    var panel = {
      type: 'container',
      alignment: 'center',
      width: panelW,
      height: panelH,
      opacity: panelIn,
      color: '#12141f',
      borderRadius: 28,
      stroke: '#26ffffff',
      strokeWidth: 1,
      shadow: { color: '#59000000', blur: 40, offsetX: 0, offsetY: 18 },
      child: {
        type: 'stack',
        fit: 'expand',
        children: [
          // Header: commit chip + "code-review" label.
          {
            type: 'container',
            alignment: 'topLeft',
            offsetX: 48,
            offsetY: 36,
            height: 40,
            borderRadius: 999,
            color: yoclipColorA('primary', 0x26, '#7c3aed'),
            stroke: yoclipColorA('primary', 0x59, '#7c3aed'),
            strokeWidth: 1,
            child: {
              type: 'row',
              crossAxisAlignment: 'center',
              children: [
                { type: 'container', width: 18 },
                {
                  type: 'container',
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  color: yoclipColor('primaryLight', '#a78bfa'),
                },
                {
                  type: 'text',
                  text: t.commit || 'a3f9c1d',
                  margin: { left: 10, right: 18 },
                  style: { fontSize: 19, color: '#d9d2f2', fontFamily: font, fontWeight: 600 },
                },
              ],
            },
          },
          {
            type: 'text',
            alignment: 'topRight',
            offsetX: -48,
            offsetY: 44,
            text: t.tag || 'code-review your cut',
            style: { fontSize: 19, color: muted, fontFamily: font, fontStyle: 'italic' },
          },
          // Version cards.
          versionCard('golden_space', 48, v1In, -60),
          versionCard('golden_kaleido', 48 + cardW + gap, v2In, 60),
          // Arrow between the cards.
          {
            type: 'path',
            path: 'M 0 12 L 40 12 M 28 2 L 40 12 L 28 22',
            color: '#ffffff',
            strokeWidth: 3,
            width: 40,
            height: 24,
            alignment: 'topLeft',
            offsetX: 48 + cardW + gap / 2 - 20,
            offsetY: 104 + cardH / 2 - 12,
            opacity: eo3(seg(frame, 26, 36)),
          },
          // Labels + badges.
          labelChip(t.before || 'v1', 72, 128),
          labelChip(t.after || 'v2', 48 + cardW + gap + 24, 128),
          badge('\u22123', 72, 104 + cardH - 56, red, redPop),
          badge('+12', 48 + cardW + gap + 24, 104 + cardH - 56, green, greenPop),
          // Stats row.
          {
            type: 'row',
            alignment: 'topLeft',
            offsetX: 48,
            offsetY: panelH - 62,
            crossAxisAlignment: 'center',
            opacity: statsIn,
            children: [
              {
                type: 'text',
                text: '+12',
                style: { fontSize: 24, color: green, fontFamily: font, fontWeight: 700 },
              },
              { type: 'container', width: 14 },
              {
                type: 'text',
                text: '\u22123',
                style: { fontSize: 24, color: red, fontFamily: font, fontWeight: 700 },
              },
              { type: 'container', width: 14 },
              {
                type: 'text',
                text: 'scenes \u00b7 pixel-tested',
                style: { fontSize: 22, color: muted, fontFamily: font },
              },
            ],
          },
        ],
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [panel],
    };
  },
};
