// 04 — ARCHITECTURE: "From ticket to pull request." The AI-teammate flow
// (after the "DMT AI Teammate — Architecture v2" diagram) lights up step by
// step: ticket -> bridge -> per-run GitHub Actions runner (DMTools CLI ->
// preJSAction context -> LLM reasoning -> postJSAction publish) -> PR, with
// a human approving in the loop.
scene = {
  id: 'architecture',
  duration: 390,
  from: 860,
  description:
    "Preheader AI TEAMMATE · PER RUN, headline 'From ticket to pull " +
    "request.' — gradient on 'pull request.'. The flow builds left to " +
    'right: 1 Ticket (ADO/Jira state change), 2 Bridge (webhook -> ' +
    'workflow_dispatch), then the CICD Container Runner frame with four ' +
    'inner steps lighting up in turn — 3 DMTools CLI (installed per run), ' +
    '4 Context (preJSAction calls CLI tools), 5 Reasoning (Copilot CLI / ' +
    'Codex), 6 Publish (postJSAction, git) — an arrow draws to the Pull ' +
    'Request card, and a dashed Human-in-the-loop bar rises below: review ' +
    'and approve.',
  voicePrompts: {
    en: 'Here\u2019s what that buys you. A ticket changes state — and a ' +
        'factory wakes up. Clean runner. Fresh tools. Full context. The ' +
        'model reasons. A pull request waits for a human. Nothing to ' +
        'deploy. Nothing to babysit.',
  },
  timeline: { label: 'Architecture', color: '#00F6FF', lane: 'video' },
  audio: [ { source: 'assets/audio/04.mp3', start: 55, volume: 1.0 } ],
  render: function(frame) {
    if (typeof presence === 'undefined' || typeof c === 'undefined' || typeof eo3 === 'undefined') return { type: 'container' };
    var master = presence(frame, 12, 380, 20);

    // ---- geometry -------------------------------------------------------
    var top = 430;               // diagram block top (runner top)
    var runnerW = 620, runnerH = 396;
    var cardW = 300, cardH = 170;
    var gap = 90;                // arrow gaps
    var x0 = 64;                 // left margin
    var xTicket = x0;
    var xBridge = xTicket + cardW + gap;
    var xRunner = xBridge + cardW + gap;
    var xPR = xRunner + runnerW + gap;
    var cardY = top + (runnerH - cardH) / 2;
    var arrowY = top + runnerH / 2;

    // ---- helpers --------------------------------------------------------
    // Horizontal connector with arrowhead, drawn with progress.
    function arrow(x, y, start, dur) {
      var p = eo3(seg(frame, start, start + dur));
      return {
        type: 'path',
        path: 'M 0 9 L 90 9 M 76 0 L 90 9 L 76 18',
        width: 90, height: 18,
        progress: p,
        color: c('sea'),
        strokeWidth: 3.5,
        alignment: 'topLeft',
        offsetX: x,
        offsetY: y - 9,
      };
    }

    // Number badge; active = gradient fill + dark digit. Pending badges
    // fade in only a few frames before they activate, so no lonely digit
    // floats on the canvas ahead of its card.
    function badge(n, x, y, activeAt) {
      var t = eo3(seg(frame, activeAt, activeAt + 14));
      var pre = seg(frame, activeAt - 6, activeAt);
      var active = t >= 1;
      var b = {
        type: 'container',
        width: 44, height: 44, borderRadius: 22,
        alignment: 'topLeft',
        offsetX: x, offsetY: y,
        scale: 0.6 + 0.4 * t,
        opacity: 0.25 * pre + 0.75 * t,
        child: {
          type: 'text',
          text: '' + n,
          alignment: 'center',
          style: {
            fontFamily: 'Museo Sans 700',
            fontSize: 22,
            color: active ? c('night') : c('muted'),
          },
        },
      };
      if (active) {
        b.gradient = { colors: [c('mint'), c('sea')], begin: 'topLeft', end: 'bottomRight' };
      } else {
        b.color = c('surface');
        b.borderColor = c('hairline');
        b.borderWidth = 1.5;
      }
      return b;
    }

    // Side card (ticket / bridge / PR).
    function sideCard(x, title, sub, activeAt, opts) {
      opts = opts || {};
      var e = enter(frame, activeAt, 20, 26);
      return {
        type: 'container',
        width: cardW, height: cardH,
        borderRadius: 18,
        color: c('surface'),
        borderColor: opts.done ? c('sea') : c('hairline'),
        borderWidth: opts.done ? 2 : 1.5,
        alignment: 'topLeft',
        offsetX: x, offsetY: cardY,
        opacity: e.opacity,
        child: {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 34, left: 76 },
          crossAxisAlignment: 'start',
          children: [
            emphasis(title, 32, c('snow')),
            { type: 'container', height: 12, alignment: 'topLeft' },
            body(sub, 22, c('muted')),
          ],
        },
      };
    }

    // ---- runner inner steps --------------------------------------------
    var steps = [
      { n: 3, title: 'DMTools CLI', sub: 'installed per run — nothing to deploy', at: 158 },
      { n: 4, title: 'Context', sub: 'preJSAction — jira_* · ado_* · confluence_* · file_*', at: 192 },
      { n: 5, title: 'Reasoning', sub: 'Copilot CLI · Codex — LLM inference', at: 226 },
      { n: 6, title: 'Publish', sub: 'postJSAction — branch, push, PR, ticket update', at: 260 },
    ];

    var runnerChildren = [];
    for (var i = 0; i < steps.length; i++) {
      (function(i) {
        var s = steps[i];
        var t = eo3(seg(frame, s.at, s.at + 16));
        var rowY = 96 + i * 76;
        // badge
        runnerChildren.push(badge(s.n, 30, rowY, s.at));
        // texts — hidden until the step activates (no gray pending block)
        runnerChildren.push({
          type: 'column',
          alignment: 'topLeft',
          offsetX: 94, offsetY: rowY - 6,
          crossAxisAlignment: 'start',
          opacity: t,
          children: [
            emphasis(s.title, 28, c('snow')),
            { type: 'container', height: 6, alignment: 'topLeft' },
            body(s.sub, 21, c('muted')),
          ],
        });
      })(i);
    }

    var runnerFrame = eo3(seg(frame, 132, 156));

    // ---- human in the loop ---------------------------------------------
    var humT = eo3(seg(frame, 318, 340));
    var humY = top + runnerH + 56;
    var human = {
      type: 'container',
      width: xPR + cardW - xTicket,
      height: 84,
      borderRadius: 16,
      color: c('surface'),
      borderColor: c('lilac'),
      borderWidth: 1.5,
      alignment: 'topLeft',
      offsetX: xTicket,
      offsetY: humY,
      opacity: humT,
      child: {
        type: 'row',
        alignment: 'center',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [
          {
            type: 'container',
            width: 12, height: 12, borderRadius: 6,
            color: c('lilac'),
            opacity: 0.4 + 0.6 * (typeof shimmer !== 'undefined' ? shimmer(frame, 30) : 0),
            alignment: 'center',
          },
          { type: 'container', width: 18, height: 1, alignment: 'center' },
          emphasis('Human in the loop', 28, c('snow'), undefined, { alignment: 'center' }),
          { type: 'container', width: 26, height: 1, alignment: 'center' },
          body('— reviews the story, approves the pull request.', 26, c('muted'), undefined, { alignment: 'center' }),
        ],
      },
    };

    // dashed connectors: ticket bottom -> bar, bar -> PR bottom
    function vDash(x, y1, y2) {
      var segs = [];
      var h = 14, g = 8;
      for (var y = y1; y + h <= y2; y += h + g) {
        segs.push({
          type: 'container',
          width: 2, height: h,
          color: c('lilac'),
          opacity: 0.7 * humT,
          alignment: 'topLeft',
          offsetX: x, offsetY: y,
        });
      }
      return segs;
    }
    var dashes = vDash(xTicket + cardW / 2, cardY + cardH + 8, humY - 6)
      .concat(vDash(xPR + cardW / 2, cardY + cardH + 8, humY - 6));

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('sea'), c('lilac')], 1100, 800, {
          alignment: 'centerRight', offsetX: 380, offsetY: 220, opacity: 0.16, blur: 170,
        }),

        // header
        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 104, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('AI TEAMMATE · PER RUN', c('sea'), 26), enter(frame, 6, 18, 24)),
            { type: 'container', height: 14, alignment: 'topLeft' },
            {
              type: 'row',
              alignment: 'topLeft',
              crossAxisAlignment: 'end',
              children: [
                withEnter(headline('From ticket to', 84, false, blh(84, 84)), enter(frame, 14, 22, 32)),
                { type: 'container', width: 22, height: 1, alignment: 'topLeft' },
                withEnter(headline('pull request.', 84, true, blh(84, 84)), enter(frame, 22, 22, 32)),
              ],
            },
          ],
        },

        // 1 — ticket
        sideCard(xTicket, 'Ticket', 'ADO · Jira\nstate change', 50),
        badge(1, xTicket + 18, cardY + cardH / 2 - 22, 50),
        arrow(xTicket + cardW + 4, arrowY, 74, 14),

        // 2 — bridge
        sideCard(xBridge, 'Bridge', 'fires\nworkflow_dispatch', 92),
        badge(2, xBridge + 18, cardY + cardH / 2 - 22, 92),
        arrow(xBridge + cardW + 4, arrowY, 116, 14),

        // runner frame
        {
          type: 'container',
          width: runnerW, height: runnerH,
          borderRadius: 22,
          color: c('surface'),
          borderColor: c('sky'),
          borderWidth: 2,
          alignment: 'topLeft',
          offsetX: xRunner, offsetY: top,
          opacity: runnerFrame,
        },
        // runner title, inside the frame
        {
          type: 'text',
          text: 'CICD Container Runner',
          alignment: 'topLeft',
          offsetX: xRunner + 30,
          offsetY: top + 26,
          opacity: runnerFrame,
          style: {
            fontFamily: 'Museo Sans 900',
            fontSize: 22,
            color: c('sky'),
            letterSpacing: 3,
          },
        },
        // runner inner steps
        // runner inner steps — a stack, so offsets are absolute inside it
        {
          type: 'stack',
          alignment: 'topLeft',
          offsetX: xRunner, offsetY: top,
          children: runnerChildren,
        },

        arrow(xRunner + runnerW + 4, arrowY, 288, 14),

        // 7 — pull request
        sideCard(xPR, 'Pull Request', 'code + docs\nready for review', 306, { done: frame >= 322 }),
        badge(7, xPR + 18, cardY + cardH / 2 - 22, 306),

        // human in the loop
        human,
        { type: 'stack', children: dashes },
      ],
    };
  },
};
