// 02 — LAYER: "One orchestration layer." A DMTools hub draws in on the
// right; first the AI harnesses (Claude Code, Copilot, Codex, Antigravity,
// Codemie, OpenCode, Kiro) dock onto it as an inner ring, then spokes
// connect the hub to eight enterprise integration chips, one by one.
scene = {
  id: 'layer',
  duration: 366,
  from: 400,
  description:
    "Preheader THE ANSWER, headline 'One orchestration layer.' — gradient " +
    "on 'layer.'. On the right a glowing DMTools hub pops in; an inner " +
    'ring of AI-harness chips (Claude Code, Copilot, Codex, Antigravity, ' +
    'Codemie, OpenCode, Kiro, with their marks) docks on short lilac spokes, ' +
    'then sea spokes draw out to eight integration chips on the outer ellipse ' +
    '(GitHub, Jira, Azure DevOps, GitLab, Confluence, Figma, Teams, TestRail).',
  voicePrompts: {
    en: 'DMTools is the layer between them. One CLI — and any agent you ' +
        'run: Claude Code, Copilot, Codex, Antigravity, Codemie, OpenCode, ' +
        'Kiro — can reach every system in the company.',
  },
  timeline: { label: 'Layer', color: '#00FFF0', lane: 'video' },
  audio: [ { source: 'assets/audio/02.mp3', start: 30, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 12, 336, 18);

    // Diagram geometry — hub center relative to frame center.
    var hx = 470, hy = 60, hubR = 118;
    var rx = 372, ry = 282;
    // Inner harness ring — between the hub rim and the outer chips,
    // on angles that miss every outer spoke.
    var hrx = 245, hry = 195;

    // The light variant swaps two-tone marks to their dark cuts.
    var tone = (typeof yoclipVariant !== 'undefined' && yoclipVariant &&
      yoclipVariant.icons === 'dark') ? '_dark' : '';

    var harnesses = [
      { label: 'Claude Code', icon: 'ic_claude', fixed: true, angle: 25 },
      { label: 'Codemie', icon: 'ic_codemie', angle: 67.5 },
      { label: 'Copilot', icon: 'ic_copilot', angle: 115 },
      { label: 'OpenCode', icon: 'ic_opencode', angle: 157.5 },
      { label: 'Codex', icon: 'ic_openai', angle: 205 },
      { label: 'Antigravity', icon: 'ic_antigravity', angle: 295 },
      { label: 'Kiro', icon: 'ic_kiro', angle: 337.5 },
    ];

    var chips = [
      { label: 'GitHub', angle: -90 },
      { label: 'Jira', angle: -45 },
      { label: 'Azure DevOps', angle: 0 },
      { label: 'GitLab', angle: 45 },
      { label: 'Confluence', angle: 90 },
      { label: 'Figma', angle: 135 },
      { label: 'Teams', angle: 180 },
      { label: 'TestRail', angle: 225 },
    ];

    // Straight connector as a stroked path inside its own bounding box.
    function spoke(x1, y1, x2, y2, progress, color, width) {
      var w = Math.max(Math.abs(x2 - x1), 2);
      var h = Math.max(Math.abs(y2 - y1), 2);
      var d = 'M ' + (x2 >= x1 ? 0 : w) + ' ' + (y2 >= y1 ? 0 : h) +
              ' L ' + (x2 >= x1 ? w : 0) + ' ' + (y2 >= y1 ? h : 0);
      return {
        type: 'path',
        path: d,
        width: w,
        height: h,
        progress: progress,
        color: color,
        strokeWidth: width || 3,
        alignment: 'center',
        offsetX: (x1 + x2) / 2,
        offsetY: (y1 + y2) / 2,
      };
    }

    // Hex color lerp — chips materialize FROM the spoke color into their
    // resting palette, so they read as "condensing out of the line"
    // instead of floating in from behind it.
    function lerpColor(a, b, t) {
      var ai = parseInt(a.substring(1), 16);
      var bi = parseInt(b.substring(1), 16);
      function h(x) {
        var s = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return s.length < 2 ? '0' + s : s;
      }
      return '#' +
        h(((ai >> 16) & 255) + (((bi >> 16) & 255) - ((ai >> 16) & 255)) * t) +
        h(((ai >> 8) & 255) + (((bi >> 8) & 255) - ((ai >> 8) & 255)) * t) +
        h((ai & 255) + ((bi & 255) - (ai & 255)) * t);
    }

    var diagram = [];

    // Inner ring: AI harnesses dock first, on short lilac spokes. Their
    // chips are collected separately and drawn LAST (after the hub), so
    // the outer sea spokes never cross them — the chip fill is opaque.
    var harnessChips = [];
    for (var j = 0; j < harnesses.length; j++) {
      (function(j) {
        var hh = harnesses[j];
        var a = hh.angle * Math.PI / 180;
        var cx = hx + hrx * Math.cos(a);
        var cy = hy + hry * Math.sin(a);
        var sx = hx + hubR * Math.cos(a);
        var sy = hy + hubR * Math.sin(a);
        var lineStart = 40 + j * 8;
        var lp = eo3(seg(frame, lineStart, lineStart + 14));
        diagram.push(spoke(sx, sy, cx, cy, lp, c('lilac'), 2.5));
        // Chip condenses out of the spoke: scales up from the line's end,
        // border cools from the spoke's lilac to the resting sky.
        var p = eo3(seg(frame, lineStart + 8, lineStart + 24));
        harnessChips.push({
          type: 'container',
          width: 176,
          height: 56,
          borderRadius: 28,
          color: c('surface'),
          borderColor: lerpColor(c('lilac'), c('sky'), p),
          borderWidth: 1.5 + 1.5 * (1 - p),
          alignment: 'center',
          offsetX: cx,
          offsetY: cy,
          opacity: p,
          scale: 0.55 + 0.45 * p,
          child: {
            type: 'row',
            alignment: 'center',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'center',
            children: [
              {
                type: 'image',
                source: 'external:' + hh.icon + (hh.fixed ? '' : tone),
                fit: 'contain',
                width: 22,
                height: 22,
                alignment: 'center',
              },
              { type: 'container', width: 10, height: 1, alignment: 'center' },
              {
                type: 'text',
                text: hh.label,
                alignment: 'center',
                style: {
                  fontFamily: 'Museo Sans 500',
                  fontSize: 20,
                  color: c('snow'),
                },
              },
            ],
          },
        });
      })(j);
    }

    // Outer ring: integration chips on sea spokes, staggered.
    for (var i = 0; i < chips.length; i++) {
      (function(i) {
        var a = chips[i].angle * Math.PI / 180;
        var cx = hx + rx * Math.cos(a);
        var cy = hy + ry * Math.sin(a);
        // Start on the hub rim, pointing at the chip.
        var sx = hx + hubR * Math.cos(a);
        var sy = hy + hubR * Math.sin(a);
        var lineStart = 112 + i * 10;
        var lp = eo3(seg(frame, lineStart, lineStart + 16));
        diagram.push(spoke(sx, sy, cx, cy, lp, c('sea')));
        // Chip condenses out of the spoke: scales up from the line's end,
        // border cools from the spoke's sea to the resting hairline.
        var p = eo3(seg(frame, lineStart + 10, lineStart + 28));
        diagram.push({
          type: 'container',
          width: chips[i].label.length > 9 ? 230 : 190,
          height: 64,
          borderRadius: 32,
          color: c('surface'),
          borderColor: lerpColor(c('sea'), c('hairline'), p),
          borderWidth: 1.5 + 1.5 * (1 - p),
          alignment: 'center',
          offsetX: cx,
          offsetY: cy,
          opacity: p,
          scale: 0.55 + 0.45 * p,
          child: {
            type: 'text',
            text: chips[i].label,
            alignment: 'center',
            style: {
              fontFamily: 'Museo Sans 500',
              fontSize: 26,
              color: c('snow'),
            },
          },
        });
      })(i);
    }

    // Hub on top of the spoke ends.
    var hubPop = pop(frame, 28, 22);
    diagram.push({
      type: 'container',
      width: 236,
      height: 236,
      borderRadius: 118,
      gradient: {
        colors: [c('mint'), c('sea'), c('lilac')],
        begin: 'topLeft', end: 'bottomRight',
      },
      alignment: 'center',
      offsetX: hx,
      offsetY: hy,
      scale: hubPop.scale,
      opacity: hubPop.opacity,
      shadow: { color: c('sea'), blur: 60, offsetX: 0, offsetY: 0, spread: 0 },
      child: {
        type: 'container',
        width: 224,
        height: 224,
        borderRadius: 112,
        color: c('night'),
        alignment: 'center',
        child: {
          type: 'text',
          text: 'DMTools',
          alignment: 'center',
          style: {
            fontFamily: 'Museo Sans 700',
            fontSize: 34,
            color: c('snow'),
          },
        },
      },
    });

    // Harness chips on top of the hub so icons on the right side of the
    // ring stay readable instead of being hidden behind the hub.
    for (var k = 0; k < harnessChips.length; k++) {
      diagram.push(harnessChips[k]);
    }

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('mint'), c('sea')], 1000, 800, {
          alignment: 'centerRight', offsetX: 320, offsetY: 60, opacity: 0.22, blur: 170,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 190, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('THE ANSWER', c('sea'), 26), enter(frame, 8, 20, 26)),
            { type: 'container', height: 18, alignment: 'topLeft' },
            withEnter(headline('One orchestration', 96, false), enter(frame, 16, 24, 36)),
            withEnter(headline('layer.', 96, true), enter(frame, 26, 24, 36)),
            { type: 'container', height: 34, alignment: 'topLeft' },
            withEnter(
              body('Between your AI agents and your enterprise systems —', 30, c('muted'), undefined, { offsetX: -12 }),
              enter(frame, 44, 24, 22)
            ),
            withEnter(
              body('one CLI, every integration they need.', 30, c('muted'), undefined, { offsetX: -12 }),
              enter(frame, 52, 24, 22)
            ),
            { type: 'container', height: 46, alignment: 'topLeft' },
            withEnter(
              emphasis('One CLI for the whole toolchain.', 30, c('snow'), undefined, { offsetX: -12 }),
              enter(frame, 190, 26, 20)
            ),
          ],
        },

        { type: 'stack', children: diagram },
      ],
    };
  },
};
