// 04 — Agent chat with the signature self-heal trick.
//
// Reference beat (Gamma 21–30s): a chat panel where the user asks, the agent
// answers — plus yoclip's own twist: the edit breaks a scene, an error pill
// pops and shakes, a spinner sweeps, and the pill morphs to green as the
// agent fixes its own mistake. The green fix lands around frame ~200.
//
// Renderer notes: container styling must be direct props (a `decoration`
// map is silently dropped); rows inside a column expand to the column's
// width, so message rows carry an explicit width for the right-aligned
// bubble and to stay clear of the panel's clipped edge.

scene = {
  id: 'chat',
  duration: 276,
  description: 'Right-docked chat panel: user bubble types a request, typing dots pulse, agent bubble replies, an activity line fades in, then a red error pill pops and shakes, a spinner sweeps, and it crossfades to a green "all errors resolved" pill around frame 200.',
  voicePrompts: {
    en: 'Message pops, a soft error buzz, then a satisfying resolved chime.',
    ru: 'Попы сообщений, мягкий сигнал ошибки и победный сигнал исправления.',
  },
  timeline: {
    label: yoclipT('chat').timeline || 'Agent',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('chat');
    var userMsg = t.user || 'make the logo pop on the drop';
    var agentMsg = t.agent || 'On it — updating 11_cta.scene.js';
    var activity = t.activity || '⚙ write_project_file scenes/11_cta.scene.js';
    var broken = t.broken || '✖ 1 scene error';
    var fixed = t.fixed || '✓ All scene errors resolved.';
    var portrait = yoclipIsPortrait();

    var life = presence(frame, 8, 252, 16);

    // Geneva has no ⚙/✖/✓ glyphs (they render as tofu) — strip leading
    // symbol characters; the pill colors carry the status semantics.
    function stripSymbol(s) { return s.replace(/^[^A-Za-z0-9Ѐ-ӿ]+/, ''); }
    activity = stripSymbol(activity);
    broken = stripSymbol(broken);
    fixed = stripSymbol(fixed);

    // -- Panel entrance.
    var panelIn = ease(frame, 0, 22, eo3);
    var panelY = (1 - panelIn) * 44;

    // -- User bubble: pops, then types.
    var userPop = pop(frame, 12, 16);
    var typedUser = typewriter(userMsg, frame, 18, 60);

    // -- Typing indicator: three dots, staggered pulse (52..86).
    var dotsOp = seg(frame, 50, 56) * (1 - seg(frame, 80, 86));

    // -- Agent bubble: pops after the dots, then types.
    var agentPop = pop(frame, 84, 16);
    var typedAgent = typewriter(agentMsg, frame, 90, 60);

    // -- Activity line.
    var actIn = ease(frame, 138, 152, eo3);

    // -- Error pill: pop + decaying shake, then crossfade to green (~200).
    var errPop = pop(frame, 164, 18);
    var shake = (frame >= 166 && frame < 198)
      ? Math.sin((frame - 166) * 0.85) * 5 * (1 - seg(frame, 166, 198))
      : 0;
    var redOp = errPop.opacity * (1 - seg(frame, 200, 212));
    var greenPop = pop(frame, 202, 16);

    // -- Spinner arc sweeping while the agent self-heals.
    var spinOp = seg(frame, 190, 196) * (1 - seg(frame, 200, 208));
    var spinProg = frame >= 190 ? ((frame - 190) % 24) / 24 : 0;

    var font = yoclipFont();
    var rowW = portrait ? 880 : 820;
    var avatarDeco = {
      gradient: {
        colors: [yoclipColor('primary', '#7c3aed'), yoclipColor('primaryLight', '#a78bfa')],
        begin: 'topLeft',
        end: 'bottomRight',
      },
      borderRadius: 23,
    };
    var avatarChild = {
      type: 'stack',
      fit: 'expand',
      children: [{
        type: 'text',
        alignment: 'center',
        text: 'y',
        style: { fontSize: 26, color: '#ffffff', fontFamily: font, fontWeight: 700 },
      }],
    };

    function dot(i) {
      return {
        type: 'container',
        width: 11,
        height: 11,
        margin: { left: i === 0 ? 0 : 8 },
        opacity: 0.25 + 0.75 * blink(frame - i * 4, 9),
        color: yoclipColor('textMuted', '#a1a1aa'),
        borderRadius: 6,
      };
    }

    var dotsRow = {
      type: 'row',
      crossAxisAlignment: 'center',
      width: rowW,
      opacity: dotsOp,
      children: [
        {
          type: 'container',
          width: 46,
          height: 46,
          gradient: avatarDeco.gradient,
          borderRadius: 23,
          child: avatarChild,
        },
        { type: 'container', width: 16 },
        {
          type: 'container',
          height: 52,
          color: yoclipColor('surface', '#15131f'),
          borderRadius: 22,
          borderColor: yoclipColorA('primaryLight', 0x33, '#a78bfa'),
          borderWidth: 1,
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
          gradient: avatarDeco.gradient,
          borderRadius: 23,
          child: avatarChild,
        },
        { type: 'container', width: 16 },
        {
          type: 'container',
          scale: agentPop.scale,
          color: yoclipColor('surface', '#15131f'),
          borderRadius: 22,
          borderColor: yoclipColorA('primaryLight', 0x33, '#a78bfa'),
          borderWidth: 1,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 24 },
              {
                type: 'text',
                text: typedAgent,
                style: { fontSize: portrait ? 28 : 30, color: yoclipColor('text', '#ffffff'), fontFamily: font },
              },
              { type: 'container', width: 24 },
              { type: 'container', height: 64 },
            ],
          },
        },
      ],
    };

    function pill(text, fg, bg, border, op, scl, leading) {
      var kids = [{ type: 'container', width: 24 }];
      if (leading) {
        kids.push(leading);
        kids.push({ type: 'container', width: 12 });
      }
      kids.push({
        type: 'text',
        text: text,
        style: { fontSize: portrait ? 24 : 27, color: fg, fontFamily: font, fontWeight: 600 },
      });
      kids.push({ type: 'container', width: 24 });
      kids.push({ type: 'container', height: 52 });
      return {
        type: 'container',
        opacity: op,
        scale: scl,
        color: bg,
        borderRadius: 999,
        borderColor: border,
        borderWidth: 1.5,
        child: {
          type: 'row',
          crossAxisAlignment: 'center',
          children: kids,
        },
      };
    }

    // Spinner arc sweeping inside the red pill (inline, left of the text)
    // while the agent self-heals.
    var spinnerArc = {
      type: 'path',
      path: 'M 18 3 A 15 15 0 1 1 3 18',
      progress: spinProg,
      color: '#f87171',
      strokeWidth: 3.5,
      width: 28,
      height: 28,
      rotation: spin(frame, 14),
      opacity: spinOp,
    };

    var chatRows = [
      // User bubble (right-aligned, accent-tinted).
      {
        type: 'row',
        mainAxisAlignment: 'end',
        width: rowW,
        opacity: userPop.opacity,
        children: [{
          type: 'container',
          scale: userPop.scale,
          color: yoclipColorA('accent', 0x26, '#22d3ee'),
          borderRadius: 22,
          borderColor: yoclipColorA('accent', 0x59, '#22d3ee'),
          borderWidth: 1,
          child: {
            type: 'row',
            crossAxisAlignment: 'center',
            children: [
              { type: 'container', width: 24 },
              {
                type: 'text',
                text: typedUser,
                style: { fontSize: portrait ? 28 : 30, color: yoclipColor('text', '#ffffff'), fontFamily: font },
              },
              { type: 'container', width: 24 },
              { type: 'container', height: 64 },
            ],
          },
        }],
      },
      { type: 'container', height: 26 },
      frame < 84 ? dotsRow : agentRow,
      { type: 'container', height: 22 },
      // Activity line (agent tool call).
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
              fontSize: portrait ? 22 : 24,
              color: yoclipColor('textMuted', '#a1a1aa'),
              fontFamily: font,
              fontStyle: 'italic',
            },
          },
        ],
      },
      { type: 'container', height: 18 },
      // Status: red error pill (spinner inline) -> green fix.
      {
        type: 'row',
        crossAxisAlignment: 'center',
        width: rowW,
        offsetX: shake,
        children: [
          { type: 'container', width: 62 },
          {
            type: 'stack',
            fit: 'loose',
            children: [
              pill(broken, '#f87171', '#3f1d24', '#66f87171', redOp, errPop.scale, spinnerArc),
              pill(fixed, '#34d399', '#0f2a1e', '#6634d399', greenPop.opacity, greenPop.scale),
            ],
          },
        ],
      },
    ];

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: [
        {
          type: 'container',
          alignment: portrait ? 'center' : 'centerRight',
          // Landscape: hug the chat content (~276px + padding) instead of a
          // tall mostly-empty panel, and shift further left so the frame
          // isn't right-weighted.
          offsetX: portrait ? 0 : -150,
          offsetY: panelY,
          width: portrait ? 960 : 900,
          height: portrait ? 1000 : 360,
          opacity: panelIn,
          color: yoclipColorA('backgroundSoft', 0xd9, '#0d0d18'),
          borderRadius: 30,
          borderColor: yoclipColorA('primaryLight', 0x3a, '#a78bfa'),
          borderWidth: 1.5,
          shadow: { color: yoclipColorA('primary', 0x55, '#7c3aed'), blur: 50, offsetX: 0, offsetY: 24 },
          clip: true,
          child: {
            type: 'container',
            offsetX: 40,
            offsetY: 42,
            child: {
              type: 'column',
              // Top-anchored like a real chat feed (portrait keeps the
              // centered column in its taller panel).
              mainAxisAlignment: portrait ? 'center' : 'start',
              crossAxisAlignment: 'start',
              children: chatRows,
            },
          },
        },
      ],
    };
  },
};
