// 05 — CODE: "Jobs and agents in plain JavaScript." A code window types a
// JS action that reads context via real CLI tools (verified against
// `dmtools list`), then hands it to Copilot through cli_execute_command.
scene = {
  id: 'code',
  duration: 300,
  from: 1230,
  description:
    "Preheader JOBS & AGENTS, headline 'Jobs and agents in plain " +
    "JavaScript.' — gradient on 'JavaScript.'. A dark editor window with " +
    'traffic lights types out a job: jira_get_ticket, ' +
    'confluence_content_by_title, github_list_prs, file_write, then ' +
    'cli_execute_command running copilot — keywords in lilac, strings in ' +
    'mint, a block cursor blinks at the end.',
  voicePrompts: {
    en: 'And it\u2019s just JavaScript. Read the ticket. Pull the page. ' +
        'Ask the model. Ship the result. Your engineers already speak ' +
        'this language.',
  },
  timeline: { label: 'Code', color: '#00FFF0', lane: 'video' },
  audio: [ { source: 'assets/audio/05.mp3', start: 45, volume: 1.0 } ],
  render: function(frame) {
    var master = presence(frame, 12, 300, 18);

    // (text, colorKey) segments per line, typed char by char.
    // Tool names verified against `dmtools list` (dmtools-ai-docs).
    var lines = [
      [{ t: '// jobs/teammate.js — context, then Copilot', k: 'muted' }],
      [{ t: 'const', k: 'lilac' }, { t: ' ticket = ', k: 'snow' }, { t: 'jira_get_ticket', k: 'sea' }, { t: '(', k: 'snow' }, { t: "'PROJ-123'", k: 'mint' }, { t: ');', k: 'snow' }],
      [{ t: 'const', k: 'lilac' }, { t: ' page = ', k: 'snow' }, { t: 'confluence_content_by_title', k: 'sea' }, { t: '(', k: 'snow' }, { t: "'Architecture'", k: 'mint' }, { t: ');', k: 'snow' }],
      [{ t: 'const', k: 'lilac' }, { t: ' prs = ', k: 'snow' }, { t: 'github_list_prs', k: 'sea' }, { t: '(', k: 'snow' }, { t: "'epam', 'dm.ai'", k: 'mint' }, { t: ');', k: 'snow' }],
      [{ t: 'file_write', k: 'sea' }, { t: '(', k: 'snow' }, { t: "'output/context.md'", k: 'mint' }, { t: ', ticket.summary);', k: 'snow' }],
      [{ t: 'cli_execute_command', k: 'sea' }, { t: '(', k: 'snow' }, { t: "'copilot -p \"review output/context.md\"'", k: 'mint' }, { t: ');', k: 'snow' }],
    ];

    // Flatten to a typed character budget: line starts stagger by typing speed.
    var cps = 1.4;             // chars per frame (~42 chars/sec)
    var lineNodes = [];
    var budgetStart = 30;
    var offset = 0;
    for (var li = 0; li < lines.length; li++) {
      var segs = lines[li];
      var lineLen = 0;
      for (var si = 0; si < segs.length; si++) lineLen += segs[si].t.length;
      var shown = clamp(Math.floor((frame - (budgetStart + offset)) * cps), 0, lineLen);
      offset += lineLen / cps + 6;   // pause between lines

      var remain = shown;
      var segNodes = [];
      for (var sj = 0; sj < segs.length; sj++) {
        var txt = segs[sj].t;
        var take = clamp(remain, 0, txt.length);
        remain -= take;
        if (take > 0) {
          segNodes.push({
            type: 'text',
            text: txt.substring(0, take),
            alignment: 'topLeft',
            style: {
              fontFamily: 'Museo Sans 500',
              fontSize: 30,
              color: c(segs[sj].k),
            },
          });
        }
      }
      // blinking cursor at the typing point of the active line
      if (shown < lineLen && shown > 0) {
        segNodes.push({
          type: 'container',
          width: 16, height: 34,
          color: c('sea'),
          opacity: blink(frame, 16),
          alignment: 'topLeft',
        });
      }
      lineNodes.push({
        type: 'row',
        alignment: 'topLeft',
        crossAxisAlignment: 'center',
        children: segNodes.length ? segNodes : [{ type: 'container', width: 1, height: 40, alignment: 'topLeft' }],
      });
      lineNodes.push({ type: 'container', height: 18, alignment: 'topLeft' });
    }

    var winE = enter(frame, 30, 24, 40);

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        blurGlow([c('mint'), c('sky')], 1000, 760, {
          alignment: 'bottomLeft', offsetX: -280, offsetY: 320, opacity: 0.18,
        }),

        {
          type: 'column',
          alignment: 'topLeft',
          margin: { top: 130, left: 64 },
          crossAxisAlignment: 'start',
          children: [
            withEnter(preheader('JOBS & AGENTS', c('sea'), 26), enter(frame, 6, 18, 24)),
            { type: 'container', height: 16, alignment: 'topLeft' },
            withEnter(headline('Jobs and agents,', 88, false), enter(frame, 12, 22, 32)),
            withEnter(headline('in plain JavaScript.', 88, true), enter(frame, 22, 22, 32)),
          ],
        },

        // editor window
        {
          type: 'container',
          width: 1240,
          height: 520,
          borderRadius: 20,
          color: c('surface'),
          borderColor: c('hairline'),
          borderWidth: 1.5,
          alignment: 'topLeft',
          offsetX: 340,
          offsetY: 450,
          opacity: winE.opacity,
          child: {
            type: 'column',
            alignment: 'topLeft',
            crossAxisAlignment: 'start',
            children: [
              // title bar
              {
                type: 'row',
                alignment: 'topLeft',
                margin: { top: 26, left: 30 },
                crossAxisAlignment: 'center',
                children: [
                  { type: 'container', width: 16, height: 16, borderRadius: 8, color: c('hairline'), alignment: 'topLeft' },
                  { type: 'container', width: 12, height: 1, alignment: 'topLeft' },
                  { type: 'container', width: 16, height: 16, borderRadius: 8, color: c('hairline'), alignment: 'topLeft' },
                  { type: 'container', width: 12, height: 1, alignment: 'topLeft' },
                  { type: 'container', width: 16, height: 16, borderRadius: 8, color: c('hairline'), alignment: 'topLeft' },
                  { type: 'container', width: 30, height: 1, alignment: 'topLeft' },
                  body('teammate.js — dmtools job', 22, c('muted')),
                ],
              },
              { type: 'container', height: 34, alignment: 'topLeft' },
              {
                type: 'column',
                alignment: 'topLeft',
                margin: { left: 44 },
                crossAxisAlignment: 'start',
                children: lineNodes,
              },
            ],
          },
        },
      ],
    };
  },
};
