// 05b — Zoom Gallery: dark "prompt → result" continuation after Deck.
//
// The left rail shows four result previews. A dark prompt UI types each
// request, then the matching result zooms from its thumbnail into a large
// preview, holds, and zooms back — cycling through kaleidoscope and chat
// results before handing off to the kaleidoscope scene.

scene = {
  id: 'zoom',
  duration: 300,
  description: 'Dark prompt-to-result zoom gallery: left thumbnail rail, dark prompt UI typing each request, and the matching result zooming from thumbnail to large preview and back.',
  voicePrompts: {
    en: 'Soft interface ticks for each prompt, a rising whoosh as the result zooms in, a gentle pullback whoosh as it returns to the rail.',
    ru: 'Тихие тики интерфейса при каждом промпте, восходящий свист при zoom-in результата, мягкий откат при возврате в ленту.',
  },
  timeline: {
    label: yoclipT('zoom').timeline || 'Zoom',
    color: '#2563eb',
    lane: 'video',
  },
  render: function(frame) {
    var t = yoclipT('zoom');
    var prompts = t.prompts || [
      'A 3D neon kaleidoscope vortex with real frames',
      'An AI agent that rebuilds the stats card on request',
    ];
    var resultSrcs = t.resultSrcs || ['golden_kaleido', 'golden_chat'];
    var thumbSrcs = t.thumbSrcs || ['golden_kaleido', 'golden_chat', 'golden_space', 'golden_website'];
    var portrait = yoclipIsPortrait();
    var font = yoclipFont();
    var life = presence(frame, 8, 280, 14);

    // ------------------------------------------------------------------
    // Layout constants
    // ------------------------------------------------------------------
    var thumbW = portrait ? 140 : 170;
    var thumbH = portrait ? 90 : 108;
    var thumbGap = 18;
    var railX = portrait ? 84 : 84;
    var railY = portrait ? 0 : -10;
    var targetW = portrait ? 520 : 960;
    var targetH = portrait ? 292 : 540;
    var cycle0Start = 30;
    var cycle1Start = 150;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    function cycleState(localFrame) {
      if (localFrame < 0) return { phase: 'before', p: 0 };
      if (localFrame < 30) return { phase: 'prompt', p: localFrame / 30 };
      if (localFrame < 60) return { phase: 'zoomIn', p: (localFrame - 30) / 30 };
      if (localFrame < 90) return { phase: 'hold', p: (localFrame - 60) / 30 };
      if (localFrame < 120) return { phase: 'zoomOut', p: (localFrame - 90) / 30 };
      return { phase: 'after', p: 1 };
    }

    function thumbCenter(index) {
      var railH = 4 * thumbH + 3 * thumbGap;
      var topY = -railH / 2;
      var cy = topY + thumbH / 2 + index * (thumbH + thumbGap);
      return { x: railX + thumbW / 2 - 960, y: railY + cy - 540 };
    }

    // ------------------------------------------------------------------
    // Background — deep kaleidoscope wash, no white flash.
    // ------------------------------------------------------------------
    var bgLayers = [];
    bgLayers.push({ type: 'container', color: '#0a0618' });
    var NEB = [
      { x: -520, y: -280, w: 980, h: 760, c: '#7c3aed', o: 0.22 },
      { x: 600, y: -180, w: 860, h: 660, c: '#ec4899', o: 0.14 },
      { x: 60, y: 420, w: 1080, h: 640, c: '#22d3ee', o: 0.12 },
      { x: -420, y: 330, w: 800, h: 600, c: '#8b5cf6', o: 0.18 },
    ];
    for (var ni = 0; ni < NEB.length; ni++) {
      var n = NEB[ni];
      var ah = Math.round(n.o * 255).toString(16);
      if (ah.length < 2) ah = '0' + ah;
      var c0 = '#' + ah + n.c.slice(1);
      var c1 = '#' + '00' + n.c.slice(1);
      bgLayers.push({
        type: 'container',
        alignment: 'center',
        width: n.w,
        height: n.h,
        offsetX: n.x + 18 * Math.sin(frame * 0.008 + ni),
        offsetY: n.y + 12 * Math.cos(frame * 0.006 + ni),
        gradient: { type: 'radial', colors: [c0, c1], stops: [0, 1] },
      });
    }
    for (var si = 0; si < 80; si++) {
      var sx = ((si * 137.5) % 1860) - 930;
      var sy = ((si * 89.3) % 1020) - 510;
      var tw = 0.25 + 0.75 * ((Math.sin(frame * 0.25 + si * 7) + 1) / 2);
      bgLayers.push({
        type: 'container',
        alignment: 'center',
        width: 2 + (si % 3),
        height: 2 + (si % 3),
        borderRadius: 999,
        offsetX: sx,
        offsetY: sy,
        opacity: tw * 0.8,
        color: '#ffffff',
      });
    }

    // ------------------------------------------------------------------
    // Left rail: four result thumbnails.
    // ------------------------------------------------------------------
    var railThumbs = [];
    for (var i = 0; i < thumbSrcs.length; i++) {
      var te = eo3(staggerItem(frame, i, 0, 6, 18));
      var tc = thumbCenter(i);
      var active0 = (i === 0) && cycleState(frame - cycle0Start).phase !== 'before' && cycleState(frame - cycle0Start).phase !== 'after';
      var active1 = (i === 1) && cycleState(frame - cycle1Start).phase !== 'before' && cycleState(frame - cycle1Start).phase !== 'after';
      var active = active0 || active1;
      railThumbs.push({
        type: 'container',
        alignment: 'center',
        offsetX: tc.x,
        offsetY: tc.y,
        width: thumbW + (active ? 4 : 0),
        height: thumbH + (active ? 4 : 0),
        opacity: te,
        scale: active ? 1.04 : 1.0,
        color: active ? '#7c3aed' : '#ffffff',
        borderRadius: 14,
        shadow: active ? { color: '#667c3aed', blur: 24, offsetX: 0, offsetY: 8 } : { color: '#330f2a44', blur: 18, offsetX: 0, offsetY: 8 },
        clip: true,
        child: {
          type: 'image',
          source: 'external:' + thumbSrcs[i],
          fit: 'cover',
          width: thumbW + (active ? 4 : 0),
          height: thumbH + (active ? 4 : 0),
        },
      });
    }

    // ------------------------------------------------------------------
    // Prompt UI — dark pill + gradient Render button.
    // ------------------------------------------------------------------
    function promptUI(text, localFrame, hint) {
      var st = cycleState(localFrame);
      var op = 0;
      if (st.phase === 'before') op = 0;
      else if (st.phase === 'prompt') op = st.p;
      else if (st.phase === 'zoomIn') op = 1 - st.p;
      else op = 0;
      if (op <= 0) return null;

      var TYPE_START = 0;
      var typedPair = typewriterParts(text, localFrame, TYPE_START, 60);
      var typed = typedPair[0];
      var typingDone = typed.length >= text.length;
      var caretOn = localFrame >= TYPE_START && (!typingDone || blink(localFrame, 14) === 1);

      var pillW = portrait ? 520 : 780;
      var textW = portrait ? 460 : 720;
      return {
        type: 'column',
        alignment: 'center',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        opacity: op,
        offsetY: -20,
        children: [
          {
            type: 'container',
            width: pillW,
            height: 84,
            color: '#15131f',
            borderRadius: 999,
            borderColor: '#2a2438',
            borderWidth: 1.5,
            shadow: { color: '#40000000', blur: 30, offsetX: 0, offsetY: 12 },
            child: {
              type: 'row',
              crossAxisAlignment: 'center',
              children: [
                { type: 'container', width: 30 },
                {
                  type: 'text',
                  text: typed,
                  width: textW,
                  style: {
                    fontSize: portrait ? 26 : 30,
                    color: '#e5e3f0',
                    fontFamily: font,
                  },
                },
                {
                  type: 'container',
                  width: 3,
                  height: 32,
                  opacity: caretOn ? 1 : 0,
                  margin: { left: 6 },
                  color: '#a78bfa',
                },
              ],
            },
          },
          { type: 'container', height: 24 },
          {
            type: 'container',
            width: 240,
            height: 68,
            gradient: {
              type: 'linear',
              colors: ['#60a5fa', '#2563eb'],
              begin: 'centerLeft',
              end: 'centerRight',
            },
            borderRadius: 999,
            shadow: { color: '#662563eb', blur: 24, offsetX: 0, offsetY: 10 },
            child: {
              type: 'row',
              mainAxisAlignment: 'center',
              crossAxisAlignment: 'center',
              children: [
                {
                  type: 'path',
                  path: 'M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z',
                  color: '#ffffff',
                  strokeWidth: 2.5,
                  width: 20,
                  height: 20,
                  margin: { right: 10 },
                },
                {
                  type: 'text',
                  text: 'Render',
                  style: {
                    fontSize: 28,
                    color: '#ffffff',
                    fontFamily: font,
                    fontWeight: 700,
                  },
                },
              ],
            },
          },
        ],
      };
    }

    // ------------------------------------------------------------------
    // Zooming result: from thumbnail to main preview and back.
    // ------------------------------------------------------------------
    function zoomResult(src, thumbIndex, localFrame) {
      var st = cycleState(localFrame);
      if (st.phase === 'before' || st.phase === 'after') return null;
      var p = st.p;
      var eased = eio3(p);
      var tc = thumbCenter(thumbIndex);
      var w = lerp(thumbW, targetW, eased);
      var h = lerp(thumbH, targetH, eased);
      var op = 1.0;
      if (st.phase === 'zoomIn') op = 1;
      else if (st.phase === 'zoomOut') op = 1 - 0.25 * st.p;
      return {
        type: 'container',
        alignment: 'center',
        offsetX: lerp(tc.x, 0, eased),
        offsetY: lerp(tc.y, 0, eased),
        width: w,
        height: h,
        opacity: op,
        borderRadius: lerp(14, 0, eased),
        shadow: { color: '#4d0f2a44', blur: lerp(18, 60, eased), offsetX: 0, offsetY: lerp(8, 28, eased) },
        clip: true,
        child: {
          type: 'image',
          source: 'external:' + src,
          fit: 'cover',
          width: targetW,
          height: targetH,
        },
      };
    }

    // ------------------------------------------------------------------
    // Compose
    // ------------------------------------------------------------------
    var children = bgLayers.concat(railThumbs);

    var p0 = promptUI(prompts[0], frame - cycle0Start, 'Describe your video...');
    if (p0) children.push(p0);
    var z0 = zoomResult(resultSrcs[0], 0, frame - cycle0Start);
    if (z0) children.push(z0);

    var p1 = promptUI(prompts[1], frame - cycle1Start, 'Describe your video...');
    if (p1) children.push(p1);
    var z1 = zoomResult(resultSrcs[1], 1, frame - cycle1Start);
    if (z1) children.push(z1);

    return {
      type: 'stack',
      fit: 'expand',
      opacity: life,
      children: children,
    };
  },
};
