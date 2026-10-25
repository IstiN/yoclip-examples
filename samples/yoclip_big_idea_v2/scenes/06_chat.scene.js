// 06 — Chat: the agent edits the deck live, then the stats card lands.
//
// Reference beat (Gamma 23–30s): the blue deck world stays, dimmed; a chat
// panel sits bottom-right. The user bubble types a request, typing dots
// pulse, the assistant answers with a violet y-avatar, a mono-ish activity
// line fades in — then the magic: a stats card materializes center-left
// with an 8-bar accent chart whose bars ease up staggered, followed by 3
// big counters. The camera drifts slightly toward the card.
//
// Renderer notes: Geneva lacks ⚙/✖/✓ glyphs (leading symbol characters are
// stripped); container styling is direct props only; text gradients need an
// opaque solid `color` as the alpha mask. rowW must be declared BEFORE the
// input-viewport math that uses it (var hoisting gave NaN widths).

scene = {
  id: 'chat',
  duration: 216,
  description: 'Dimmed blue deck world: bottom-right white chat panel — user bubble types "make the stats pop on the drop", dots pulse, violet-avatar assistant replies, activity line fades in, then a typing indicator pulses; meanwhile an 800x620 stats card pops center-left (local ~90, eoBack) with an 8-bar accent chart easing up staggered and 3 huge counters that start ticking before the card fully lands, camera drifting toward it.',
  voicePrompts: {
    en: 'Message pops, a soft thinking hum, then a bright chord as the stats card lands.',
    ru: 'Попы сообщений, мягкий гул ожидания и яркий аккорд на карточке статистики.',
  },
  timeline: {
    label: yoclipT('chat').timeline || 'Agent',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('chat');
    var userMsg = t.user || 'make the stats pop on the drop';
    var agentMsg = t.agent || 'On it — rebuilding the stats card';
    var activity = t.activity || 'write_project_file scenes/06_stats.scene.js';
    var stat1 = t.stat1 || ['12', 'scenes rendered'];
    var stat2 = t.stat2 || ['2580', 'frames encoded'];
    var stat3 = t.stat3 || ['0', 'errors'];
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 194, 14);

    // Geneva has no ⚙/✖/✓ glyphs — strip leading symbol characters.
    activity = activity.replace(/^[^A-Za-z0-9Ѐ-ӿ]+/, '');

    var primary = yoclipColor('primary', '#7c3aed');
    var primaryLight = yoclipColor('primaryLight', '#a78bfa');
    var accent = yoclipColor('accent', '#22d3ee');
    var ink = '#1f2937';
    var mutedUi = '#64748b';

    var rowW = portrait ? 860 : 688;

    // Camera drift toward the stats card once it lands.
    var drift = seg(frame, 90, 154);
    var camScale = 1 + 0.035 * drift;
    var camX = 34 * drift;

    // -- Chat panel beats.
    var panelIn = ease(frame, 4, 22, eo3);
    var panelY = (1 - panelIn) * 50;

    // Flow: type in the INPUT -> click Render -> the typed text becomes the
    // user's blue bubble -> Yo answers.
    var inputIn = ease(frame, 6, 20, eo3);
    var typedPair = typewriterParts(userMsg, frame, 22, 30);
    var typedInput = typedPair[0];
    var inputTypingDone = typedInput.length >= userMsg.length;
    var btnPulse = seg(frame, 46, 52) * (1 - seg(frame, 52, 58));
    var inputOut = 1 - seg(frame, 56, 66);

    // Long prompts show the tail, like a real input. The visible window is
    // computed in JS (conservative 0.62 em/char): a clipped wide row inside
    // the pill still trips RenderFlex overflow in the Studio preview because
    // the Align loosens-then-clamps the inner SizedBox to the viewport.
    var inputFontSize = portrait ? 24 : 26;
    var inputViewChars = Math.floor((rowW - 150 - 34) / (inputFontSize * 0.62));
    var typedVisible = typedInput.length <= inputViewChars
      ? typedInput
      : typedInput.slice(typedInput.length - inputViewChars);

    var userPop = pop(frame, 62, 14);

    var dotsOp = seg(frame, 76, 82) * (1 - seg(frame, 96, 102));

    var agentPop = pop(frame, 100, 14);
    var typedAgent = typewriter(agentMsg, frame, 106, 60);

    var actIn = ease(frame, 112, 126, eo3);

    // The agent starts typing again after the activity line — a live
    // typing indicator fills the panel's empty bottom.
    var typingOp = seg(frame, 134, 140);

    function dot(i) {
      return {
        type: 'container',
        width: 11,
        height: 11,
        margin: { left: i === 0 ? 0 : 8 },
        opacity: Math.max(0, Math.min(1, 0.25 + 0.75 * blink(frame - i * 4, 9))),
        color: mutedUi,
        borderRadius: 6,
      };
    }

    // Typing-indicator dots: phased shimmer pulse (opacity + rise).
    function typingDot(i) {
      var pulse = shimmer(frame - i * 6, 18);
      return {
        type: 'container',
        width: 11,
        height: 11,
        margin: { left: i === 0 ? 0 : 8 },
        opacity: Math.max(0, Math.min(1, 0.25 + 0.75 * pulse)),
        offsetY: -4 * pulse,
        color: mutedUi,
        borderRadius: 6,
      };
    }

    // The Yo bubble (the real brand icon) as the assistant avatar.
    var avatar = {
      type: 'container',
      width: 46,
      height: 46,
      color: '#ffffff',
      borderRadius: 23,
      borderColor: '#e2d9fb',
      borderWidth: 1.5,
      child: {
        type: 'image',
        source: 'external:yo_bubble',
        fit: 'contain',
        width: 40,
        height: 40,
        alignment: 'center',
      },
    };

    var dotsRow = {
      type: 'row',
      crossAxisAlignment: 'center',
      width: rowW,
      opacity: dotsOp,
      children: [
        avatar,
        { type: 'container', width: 16 },
        {
          type: 'container',
          height: 52,
          color: '#eef2f7',
          borderRadius: 22,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 22 },
              dot(0), dot(1), dot(2),
              { type: 'container', width: 22 },
            ],
          },
        },
      ],
    };

    var agentRow = {
      type: 'row',
      crossAxisAlignment: 'start',
      width: rowW,
      opacity: agentPop.opacity,
      children: [
        {
          type: 'container',
          width: 46,
          height: 46,
          scale: agentPop.scale,
          color: '#ffffff',
          borderRadius: 23,
          borderColor: '#e2d9fb',
          borderWidth: 1.5,
          child: {
            type: 'image',
            source: 'external:yo_bubble',
            fit: 'contain',
            width: 40,
            height: 40,
            alignment: 'center',
          },
        },
        { type: 'container', width: 16 },
        {
          type: 'container',
          scale: agentPop.scale,
          color: '#eef2f7',
          borderRadius: 22,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 24 },
              {
                type: 'text',
                text: typedAgent,
                maxWidth: rowW - 110,
                textAlign: 'left',
                margin: { top: 13, bottom: 13 },
                style: { fontSize: portrait ? 26 : 28, color: ink, fontFamily: font },
              },
              { type: 'container', width: 24 },
              { type: 'container', height: 62 },
            ],
          },
        },
      ],
    };

    var chatPanel = {
      type: 'container',
      alignment: portrait ? 'bottomCenter' : 'bottomRight',
      offsetX: portrait ? 0 : lerp(-48, -88, seg(frame, 90, 112)),
      offsetY: -48 - panelY,
      width: portrait ? 940 : 760,
      height: portrait ? 520 : 440,
      opacity: panelIn,
      color: '#ffffff',
      borderRadius: 24,
      shadow: { color: '#3d0f2a44', blur: 46, offsetX: 0, offsetY: 20 },
      clip: true,
      child: {
        type: 'container',
        // The auto-sized content is already centered in the 760px panel,
        // leaving 36px on each side. An extra +36 pushed every row into the
        // right clip edge (most visible on the blue user bubble).
        offsetX: 0,
        // Content sits mid-panel while only the input exists, then docks
        // to the top as the conversation fills in (no sparse white box).
        offsetY: lerp(150, 40, seg(frame, 56, 100)),
        child: {
          type: 'column',
          mainAxisAlignment: 'start',
          crossAxisAlignment: 'start',
          children: [
            // The INPUT row: frosted field + mini Render button; fades out
            // once sent and hands its text to the blue user bubble.
            {
              type: 'row',
              crossAxisAlignment: 'center',
              width: rowW,
              opacity: inputIn * inputOut,
              children: [
                {
                  type: 'container',
                  width: rowW - 150,
                  height: 64,
                  color: '#f1f5fb',
                  borderColor: '#d7e3f2',
                  borderWidth: 1.5,
                  borderRadius: 999,
                  child: {
                    type: 'row',
                    crossAxisAlignment: 'center',
                    children: [
                      { type: 'container', width: 26 },
                      {
                        type: 'text',
                        text: typedVisible,
                        style: { fontSize: inputFontSize, color: ink, fontFamily: font },
                      },
                      {
                        type: 'container',
                        width: 3,
                        height: 30,
                        opacity: !inputTypingDone || blink(frame, 14) === 1 ? 1 : 0,
                        margin: { left: 4 },
                        color: accent,
                      },
                    ],
                  },
                },
                { type: 'container', width: 14 },
                {
                  type: 'container',
                  width: 136,
                  height: 56,
                  scale: 1 - 0.12 * btnPulse,
                  gradient: {
                    colors: [primary, primaryLight],
                    begin: 'centerLeft',
                    end: 'centerRight',
                  },
                  borderRadius: 999,
                  child: {
                    type: 'text',
                    alignment: 'center',
                    text: 'Render',
                    style: { fontSize: 24, color: '#ffffff', fontFamily: font, fontWeight: 700 },
                  },
                },
              ],
            },
            { type: 'container', height: 22 * inputOut },
            // User bubble (blue, right-aligned).
            {
              type: 'row',
              mainAxisAlignment: 'end',
              width: rowW,
              opacity: userPop.opacity,
              children: [{
                type: 'container',
                scale: userPop.scale,
                color: '#2563eb',
                borderRadius: 22,
                child: {
                  type: 'row',
                  crossAxisAlignment: 'center',
                  children: [
                    { type: 'container', width: 24 },
                    {
                      type: 'text',
                      text: userMsg,
                      maxWidth: rowW - 120,
                      textAlign: 'left',
                      margin: { top: 13, bottom: 13 },
                      style: { fontSize: portrait ? 26 : 28, color: '#ffffff', fontFamily: font },
                    },
                    { type: 'container', width: 24 },
                    { type: 'container', height: 62 },
                  ],
                },
              }, {
                // A real layout spacer, not a visual offset: the rounded
                // bubble and its text stay inside the clipped white card.
                type: 'container', width: 36, height: 1,
              }],
            },
            { type: 'container', height: 26 },
            frame < 78 ? dotsRow : agentRow,
            { type: 'container', height: 22 },
            // Activity line (agent tool call, mono feel via italic + muted).
            {
              type: 'row',
              width: rowW,
              opacity: actIn,
              offsetY: (1 - actIn) * 12,
              children: [
                { type: 'container', width: 62 },
                {
                  type: 'text',
                  text: activity,
                  style: {
                    fontSize: portrait ? 20 : 22,
                    color: mutedUi,
                    fontFamily: font,
                    fontStyle: 'italic',
                  },
                },
              ],
            },
            { type: 'container', height: 22 },
            // Typing indicator: the agent composes the next reply.
            {
              type: 'row',
              crossAxisAlignment: 'center',
              width: rowW,
              opacity: typingOp,
              children: [
                avatar,
                { type: 'container', width: 16 },
                {
                  type: 'container',
                  height: 52,
                  color: '#eef2f7',
                  borderRadius: 22,
                  child: {
                    type: 'row',
                    crossAxisAlignment: 'center',
                    children: [
                      { type: 'container', width: 22 },
                      typingDot(0), typingDot(1), typingDot(2),
                      { type: 'container', width: 22 },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    };

    // -- Stats card: pops center-left, bars ease up, counters count.
    // Lands early (local ~90) so the screen never hangs half-empty; the
    // counters start ~18 frames before the card is fully in (animation
    // overlap), so the viewer never reads "0 0 0" on a settled card.
    var cardPop = pop(frame, 76, 24);
    var BAR_START = 90;
    var barTargets = [0.4, 0.62, 0.5, 0.78, 0.66, 0.92, 0.8, 1.0];
    var bars = [];
    for (var i = 0; i < 8; i++) {
      var bh = barTargets[i] * (portrait ? 260 : 300) * ease(frame, BAR_START + i * 5, BAR_START + i * 5 + 22, eo3);
      bars.push({
        type: 'container',
        width: portrait ? 72 : 64,
        height: Math.max(2, bh),
        margin: { left: i === 0 ? 0 : (portrait ? 26 : 24) },
        gradient: {
          colors: [accent, primary],
          begin: 'bottomCenter',
          end: 'topCenter',
        },
        borderRadius: 12,
      });
    }

    function statNode(stat, idx) {
      var val = parseInt(stat[0], 10) || 0;
      var shown = counter(frame, 82 + idx * 6, 28, 0, val);
      return {
        type: 'column',
        crossAxisAlignment: 'center',
        margin: { left: idx === 0 ? 0 : (portrait ? 60 : 64) },
        children: [
          {
            type: 'text',
            text: '' + shown,
            style: {
              fontSize: portrait ? 64 : 76,
              color: accent, // opaque mask for the gradient
              gradient: {
                colors: [accent, primary],
                begin: 'topCenter',
                end: 'bottomCenter',
              },
              fontFamily: font,
              fontWeight: 700,
            },
          },
          {
            type: 'text',
            text: stat[1],
            margin: { top: 6 },
            style: {
              fontSize: portrait ? 22 : 25,
              color: mutedUi,
              fontFamily: font,
            },
          },
        ],
      };
    }

    var statsCard = {
      type: 'container',
      alignment: portrait ? 'center' : 'centerLeft',
      offsetX: portrait ? 0 : 90,
      offsetY: portrait ? -320 : -40,
      width: portrait ? 900 : 800,
      height: portrait ? 560 : 620,
      opacity: cardPop.opacity,
      scale: cardPop.scale,
      color: '#ffffff',
      borderRadius: 24,
      shadow: { color: '#4d0f2a44', blur: 54, offsetX: 0, offsetY: 24 },
      child: {
        type: 'column',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        children: [
          {
            type: 'row',
            crossAxisAlignment: 'end',
            mainAxisAlignment: 'center',
            children: bars,
          },
          {
            type: 'container',
            width: portrait ? 800 : 690,
            height: 3,
            margin: { top: 0 },
            color: '#e2e8f0',
          },
          { type: 'container', height: 44 },
          {
            type: 'row',
            mainAxisAlignment: 'center',
            crossAxisAlignment: 'start',
            children: [statNode(stat1, 0), statNode(stat2, 1), statNode(stat3, 2)],
          },
        ],
      },
    };

    // Keep a live scene manifest present while the user types; it
    // crossfades into stats instead of leaving a blank left half. This is
    // real vector UI, not a scaled screenshot with unreadable baked text.
    var recallW = portrait ? 900 : 800;
    var recallTitles = ['Hook & brand', 'Product deck', 'Space launch', 'Stats report'];
    var recallSubs = ['01  ·  15 sec  ·  ready', '02  ·  6 scenes  ·  ready', '03  ·  vector world  ·  ready', '04  ·  agent edit'];
    var recallRows = [];
    for (var dr = 0; dr < recallTitles.length; dr++) {
      recallRows.push({
        type: 'container', width: recallW, height: portrait ? 92 : 82,
        color: dr === 3 ? '#f4f1ff' : '#ffffff',
        child: {
          type: 'stack', fit: 'expand', children: [
            { type: 'text', alignment: 'centerLeft', offsetX: 28, text: '0' + (dr + 1), style: { fontSize: 16, color: '#8b5cf6', fontFamily: font, fontWeight: 700 } },
            { type: 'text', alignment: 'centerLeft', offsetX: 82, offsetY: -11, text: recallTitles[dr], style: { fontSize: 22, color: '#1f2937', fontFamily: font, fontWeight: 700 } },
            { type: 'text', alignment: 'centerLeft', offsetX: 82, offsetY: 18, text: recallSubs[dr], style: { fontSize: 14, color: '#64748b', fontFamily: font } },
            { type: 'text', alignment: 'centerLeft', offsetX: recallW - 142, text: dr === 3 ? (frame > 34 ? 'EDITING' : 'QUEUED') : 'READY', style: { fontSize: 13, color: dr === 3 ? '#7c3aed' : '#94a3b8', fontFamily: font, fontWeight: 700, letterSpacing: 1.2 } },
            { type: 'container', alignment: 'bottomCenter', width: recallW - 48, height: 1, color: '#e8ecf4' },
          ],
        },
      });
    }
    var deckRecall = {
      type: 'container', alignment: portrait ? 'center' : 'centerLeft',
      offsetX: portrait ? 0 : 90, offsetY: portrait ? -320 : -40,
      width: recallW, height: portrait ? 506 : 450,
      opacity: ease(frame, 0, 10, eo3) * (1 - seg(frame, 70, 88)),
      color: '#ffffff', borderRadius: 24, clip: true,
      borderColor: '#80ffffff', borderWidth: 1.5,
      shadow: { color: '#4d0f2a44', blur: 54, offsetX: 0, offsetY: 24 },
      child: {
        type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'start',
        children: [{
          type: 'container', width: recallW, height: 74, color: '#f5f7ff',
          child: {
            type: 'stack', fit: 'expand', children: [
              { type: 'text', alignment: 'centerLeft', offsetX: 24, text: 'CURRENT DECK  /  LIVE', style: { fontSize: 14, color: '#475569', fontFamily: font, fontWeight: 700, letterSpacing: 1.4 } },
              { type: 'text', alignment: 'centerLeft', offsetX: recallW - 164, text: '12 SCENES', style: { fontSize: 13, color: '#7c3aed', fontFamily: font, fontWeight: 700, letterSpacing: 1.2 } },
            ],
          },
        }].concat(recallRows),
      },
    };

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      scale: camScale,
      offsetX: camX,
      children: [
        // The blue deck world, dimmed.
        {
          type: 'container',
          gradient: {
            type: 'linear',
            begin: 'topCenter',
            end: 'bottomCenter',
            colors: ['#7db4e8', '#bcd7f0'],
          },
        },
        { type: 'absolute_fill', color: '#12325b', opacity: 0.38 },
        deckRecall,
        statsCard,
        chatPanel,
      ],
    };
  },
};
