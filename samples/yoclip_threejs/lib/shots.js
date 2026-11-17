// Editorial scenes for the 120-second YoClip / THREE film.
// All positions are 1920x1080 design pixels; all motion is local-frame pure.

// Root overlays use explicit Stack coordinates. Alignment remains useful
// INSIDE cards, but mixing it with offsets on a full-frame flex/stack child
// lets the child's main-axis sizing change the intended anchor.
function rootPlace(node) {
  if (!node || !node.alignment) return node;
  var a = node.alignment;
  var x = node.offsetX || 0;
  var y = node.offsetY || 0;
  var p = {};
  var keepAlignment = false;
  if (a === 'topLeft') { p.left = x; p.top = y; }
  else if (a === 'topRight') { p.right = -x; p.top = y; }
  else if (a === 'bottomLeft') { p.left = x; p.bottom = -y; }
  else if (a === 'bottomRight') { p.right = -x; p.bottom = -y; }
  else if (a === 'topCenter') {
    p.left = 0; p.right = 0; p.top = y; keepAlignment = true;
  } else if (a === 'bottomCenter') {
    p.left = 0; p.right = 0; p.bottom = -y; keepAlignment = true;
  } else if (a === 'center') {
    p.left = 0; p.right = 0; p.top = 0; p.bottom = 0; keepAlignment = true;
  } else {
    return node;
  }
  var placed = {};
  for (var key in node) {
    if (key !== 'alignment' && key !== 'offsetX' && key !== 'offsetY') {
      placed[key] = node[key];
    }
  }
  if (keepAlignment) placed.alignment = a;
  placed.positioned = p;
  return placed;
}
function shotRoot(frame, children) {
  return stack(children.map(rootPlace), { opacity: sceneLife(frame, 300) });
}
function shotTitle(lines, o) {
  o = o || {};
  var children = [];
  if (o.kicker) {
    children.push(txt(o.kicker, {
      fontSize: o.kickerSize || 15, color: o.accent || '#22d3ee',
      fontWeight: 700, letterSpacing: 3.2, margin: { bottom: 20 },
    }));
  }
  for (var i = 0; i < lines.length; i++) {
    children.push(txt(lines[i], {
      fontSize: o.fontSize || 68, color: o.color || '#ffffff',
      fontWeight: o.fontWeight || 700, letterSpacing: o.letterSpacing === undefined ? -1.8 : o.letterSpacing,
      lineHeight: 1.03, shadows: [{ color: '#b3000000', blur: 18, offsetX: 0, offsetY: 5 }],
    }));
  }
  if (o.subtitle) {
    children.push(txt(o.subtitle, {
      fontSize: o.subtitleSize || 23, color: o.subtitleColor || '#b7b7c8',
      lineHeight: 1.35, margin: { top: 24 },
    }));
  }
  return column(children, {
    crossAxisAlignment: o.align || 'start', width: o.width,
    alignment: o.alignment || 'topLeft', offsetX: o.x === undefined ? 110 : o.x,
    offsetY: o.y === undefined ? 170 : o.y, opacity: o.opacity,
  });
}
function shotEnter(frame, start) {
  var t = eo3(seg(frame, start || 0, (start || 0) + 28));
  return { opacity: t, offsetY: 28 * (1 - t) };
}
function miniLabel(text, color, o) {
  return decorate(txt(text, {
    fontSize: 13, color: color || '#8f8fa3', fontWeight: 600, letterSpacing: 2.4,
  }), o || {});
}
function dotGrid(width, height, color) {
  var dots = [];
  for (var y = 0; y < 5; y++) {
    var line = [];
    for (var x = 0; x < 12; x++) {
      line.push(box({ width: 3, height: 3, borderRadius: 2, color: color || '#28ffffff', margin: { right: 28 } }));
    }
    dots.push(row(line, { margin: { bottom: 28 } }));
  }
  return column(dots, { width: width, height: height, opacity: 0.65 });
}
function featureRow(number, title, body, frame, index) {
  var enter = eo3(seg(frame, 35 + index * 12, 65 + index * 12));
  return row([
    txt(number, { fontSize: 15, color: '#22d3ee', fontWeight: 700, letterSpacing: 1.8 }),
    column([
      txt(title, { fontSize: 23, color: '#ffffff', fontWeight: 700 }),
      txt(body, { fontSize: 17, color: '#a1a1aa', lineHeight: 1.3, margin: { top: 8 } }),
    ], { margin: { left: 22 }, crossAxisAlignment: 'start' }),
  ], { crossAxisAlignment: 'start', opacity: enter, offsetY: 18 * (1 - enter) });
}

// 00 — Hook ------------------------------------------------------------------
function renderIntro(frame) {
  var logoIn = eo3(seg(frame, 0, 35));
  var titleIn = eo3(seg(frame, 18, 62));
  var lineIn = eo3(seg(frame, 55, 95));
  return shotRoot(frame, [
    pill('CODE-FIRST VIDEO / THREE.JS EDITION', {
      alignment: 'topRight', offsetX: -110, offsetY: 156, dot: true,
      opacity: logoIn,
    }),
    column([
      txt('THE FUTURE OF VIDEO', {
        fontSize: 76, color: '#ffffff', fontWeight: 700, letterSpacing: -1.8,
        textAlign: 'center', shadows: [{ color: '#d0000000', blur: 22, offsetY: 6 }],
      }),
      txt('IS PROGRAMMABLE', {
        fontSize: 84, color: '#ffffff', fontWeight: 700, letterSpacing: -2.1,
        textAlign: 'center', margin: { top: 2 },
        shadows: [{ color: '#907c3aed', blur: 32, offsetY: 4 }],
      }),
    ], {
      crossAxisAlignment: 'center', alignment: 'topCenter', offsetY: 680 + 34 * (1 - titleIn),
      opacity: titleIn,
    }),
    row([
      txt('JAVASCRIPT IN.', { fontSize: 20, color: '#a78bfa', fontWeight: 700, letterSpacing: 2.4 }),
      txt('  NATIVE VIDEO OUT.', { fontSize: 20, color: '#22d3ee', fontWeight: 700, letterSpacing: 2.4 }),
    ], {
      mainAxisAlignment: 'center', alignment: 'topCenter', offsetY: 910,
      opacity: lineIn,
    }),
    box({
      width: 460 * lineIn, height: 2, alignment: 'topCenter', offsetY: 884,
      gradient: { type: 'linear', colors: ['#007c3aed', '#7c3aed', '#22d3ee', '#0022d3ee'], begin: 'centerLeft', end: 'centerRight' },
    }),
  ]);
}

// 01 — Author ----------------------------------------------------------------
function renderAuthor(frame) {
  var enter = eo3(seg(frame, 5, 45));
  var lines = [
    { text: "export function scene({ frame }) {", color: '#c9b8ff' },
    { text: "  return {", color: '#ffffff' },
    { text: "    type: 'three_scene',", color: '#22d3ee', indent: 1 },
    { text: "    source: 'three/world.js',", color: '#a9e7ff', indent: 1 },
    { text: "    frame: frame,", color: '#ffffff', indent: 1 },
    { text: "    width: 1920, height: 1080,", color: '#ffffff', indent: 1 },
    { text: "  };", color: '#ffffff' },
    { text: "}", color: '#c9b8ff' },
  ];
  return shotRoot(frame, [
    shotTitle(['WRITE THE SCENE.', 'OWN EVERY FRAME.'], {
      kicker: '01 / AUTHOR', x: 100, y: 220, width: 710, fontSize: 66,
      subtitle: 'No timeline spaghetti. No opaque plugins.\nJust a scene graph, a frame number, and your idea.',
      opacity: enter, y: 220 + 28 * (1 - enter),
    }),
    column([
      featureRow('01', 'Declarative by default', 'Scenes are plain JavaScript modules.', frame, 0),
      featureRow('02', 'Deterministic by design', 'Seek to any frame. Get the same pixels.', frame, 1),
      featureRow('03', 'Native all the way down', 'Flutter renders. Your GPU does the work.', frame, 2),
    ], { alignment: 'bottomLeft', offsetX: 112, offsetY: -115, spacing: 26, opacity: enter }),
    codeEditorNode({
      title: 'scenes / world.scene.js', lines: lines, frame: frame, start: 24,
      width: 850, height: 650, alignment: 'topRight', offsetX: -100 - 30 * (1 - enter),
      offsetY: 210, opacity: enter, scale: 0.96 + enter * 0.04,
      codeFontSize: 22, lineDelay: 7, lineGap: 12,
    }),
    pill('HOT RELOAD', { alignment: 'bottomRight', offsetX: -120, offsetY: -116, accent: '#34d399', dot: true, opacity: enter }),
  ]);
}

// 02 — Generate --------------------------------------------------------------
function flowCard(index, title, subtitle, body, frame, x, accent) {
  var enter = eo3(seg(frame, 20 + index * 18, 58 + index * 18));
  return glass({
    width: 500, height: 390, alignment: 'topLeft', offsetX: x, offsetY: 405 + 32 * (1 - enter),
    opacity: enter, borderColor: alphaColor(accent, 0.36),
    child: column([
      row([
        txt('0' + (index + 1), { fontSize: 15, color: accent, fontWeight: 700, letterSpacing: 2 }),
        pill(index === 0 ? 'PROMPT' : index === 1 ? 'BUILD' : 'SHIP', { height: 34, fontSize: 11, accent: accent }),
      ], { mainAxisAlignment: 'spaceBetween' }),
      txt(title, { fontSize: 36, color: '#ffffff', fontWeight: 700, margin: { top: 40 } }),
      txt(subtitle, { fontSize: 19, color: accent, fontWeight: 600, margin: { top: 10 } }),
      txt(body, { fontSize: 20, color: '#b7b7c8', lineHeight: 1.35, margin: { top: 28 } }),
      box({ width: 290, height: 3, borderRadius: 2, color: accent, margin: { top: 34 }, opacity: 0.55 }),
    ], { crossAxisAlignment: 'start', margin: { left: 34, right: 34, top: 30 } }),
  });
}
function renderGenerate(frame) {
  var titleIn = eo3(seg(frame, 0, 35));
  return shotRoot(frame, [
    shotTitle(['PROMPT / SCENES / PREMIERE'], {
      kicker: '02 / GENERATE', alignment: 'topCenter', x: 0, y: 170,
      fontSize: 66, align: 'center', subtitle: 'Describe the film. Keep the source. Direct every revision.',
      opacity: titleIn,
    }),
    flowCard(0, 'Describe', 'Natural language / intent', '"A cinematic product launch.\nTwelve shots. Real 3D.\nCut on the beat."', frame, 110, '#a78bfa'),
    flowCard(1, 'Compose', 'Intent / living source', 'Reusable scenes. Shared themes.\nCamera moves. Audio cues.\nReviewable, editable code.', frame, 710, '#22d3ee'),
    flowCard(2, 'Render', 'Source / native pixels', 'Preview with hot reload.\nVerify golden frames.\nExport MP4 when it sings.', frame, 1310, '#34d399'),
    arrowIcon({ size: 42, alignment: 'topLeft', offsetX: 634, offsetY: 575, opacity: eo3(seg(frame, 55, 90)) }),
    arrowIcon({ size: 42, alignment: 'topLeft', offsetX: 1234, offsetY: 575, opacity: eo3(seg(frame, 75, 110)) }),
  ]);
}

// 03 — Real-time -------------------------------------------------------------
function renderRealtime(frame) {
  var enter = eo3(seg(frame, 0, 38));
  return shotRoot(frame, [
    pill('UPSTREAM THREE r186', { alignment: 'topCenter', offsetY: 145, dot: true, opacity: enter }),
    column([
      txt('THIS IS NOT A MOCKUP.', {
        fontSize: 76, color: '#ffffff', fontWeight: 700, letterSpacing: -2,
        textAlign: 'center', shadows: [{ color: '#e0000000', blur: 24, offsetY: 6 }],
      }),
      txt('Real geometry. Real light. Real GPU.', {
        fontSize: 25, color: '#c5c5d4', textAlign: 'center', margin: { top: 20 },
      }),
    ], {
      crossAxisAlignment: 'center', alignment: 'topCenter', offsetY: 755 + 25 * (1 - enter), opacity: enter,
    }),
    row([
      pill('PBR MATERIALS', { accent: '#a78bfa', opacity: enter }),
      pill('INSTANCING', { accent: '#22d3ee', opacity: enter }),
      pill('FLUTTER GPU', { accent: '#34d399', opacity: enter }),
    ], { mainAxisAlignment: 'center', spacing: 16, alignment: 'topCenter', offsetY: 920, opacity: enter }),
    miniLabel('RENDERED LIVE — NOT A VIDEO INSERT', '#8d8da2', {
      alignment: 'bottomCenter', offsetY: -160,
    }),
  ]);
}

// 04 — Direct ----------------------------------------------------------------
function keyframeRow(label, value, frame, index) {
  var p = eo3(seg(frame, 25 + index * 10, 90 + index * 10));
  return column([
    row([
      txt(label, { fontSize: 15, color: '#b7b7c8', fontWeight: 600 }),
      txt(value, { fontSize: 15, color: '#22d3ee', fontWeight: 700 }),
    ], { mainAxisAlignment: 'spaceBetween' }),
    box({
      width: 620, height: 34, margin: { top: 10 },
      child: stack([
        box({ width: 620, height: 2, color: '#35ffffff', positioned: { left: 0, top: 16 } }),
        box({ width: 620 * p, height: 2, color: '#7c3aed', positioned: { left: 0, top: 16 } }),
        box({ width: 12, height: 12, rotation: 45, color: '#22d3ee', positioned: { left: 6 + 600 * p, top: 11 } }),
      ]),
    }),
  ], { crossAxisAlignment: 'start', margin: { bottom: 22 } });
}
function renderDirect(frame) {
  var enter = eo3(seg(frame, 0, 38));
  var lines = [
    { text: 'camera.position.set(', color: '#c9b8ff' },
    { text: '  orbit(frame, 4.2),', color: '#22d3ee', indent: 1 },
    { text: '  breathe(frame, 1.6),', color: '#22d3ee', indent: 1 },
    { text: '  dolly(frame, 11.5)', color: '#22d3ee', indent: 1 },
    { text: ');', color: '#c9b8ff' },
    { text: 'camera.lookAt(0, 0, 0);', color: '#ffffff' },
  ];
  return shotRoot(frame, [
    shotTitle(['DIRECT', 'WITH CODE.'], {
      kicker: '04 / CAMERA', x: 960, y: 190, fontSize: 74,
      subtitle: 'Dolly. Orbit. Breathe.\nEvery move is an expression of frame.',
      opacity: enter,
    }),
    codeEditorNode({
      title: 'three / camera.js', lines: lines, frame: frame, start: 20,
      width: 760, height: 440, alignment: 'topLeft', offsetX: 100, offsetY: 260,
      opacity: enter, codeFontSize: 22, lineGap: 12,
    }),
    glass({
      width: 760, height: 390, alignment: 'topRight', offsetX: -100, offsetY: 510,
      opacity: enter, child: column([
        miniLabel('CAMERA / KEYFRAME TRACKS'),
        box({ height: 28 }),
        keyframeRow('POSITION X', '+4.80', frame, 0),
        keyframeRow('POSITION Y', '+1.60', frame, 1),
        keyframeRow('FIELD OF VIEW', '43.0°', frame, 2),
      ], { margin: { left: 40, right: 40, top: 30 }, crossAxisAlignment: 'start' }),
    }),
    pill('EXACT FRAME. EXACT CAMERA.', { alignment: 'bottomLeft', offsetX: 110, offsetY: -130, dot: true, opacity: enter }),
  ]);
}

// 05 — Edit ------------------------------------------------------------------
function waveform(width, frame, color) {
  var bars = [];
  for (var i = 0; i < 92; i++) {
    var h = 8 + (Math.sin(i * 1.73) * 0.5 + 0.5) * 38 + (i % 7) * 3;
    bars.push(box({ width: 4, height: h, borderRadius: 2, color: color, margin: { right: Math.max(1, (width - 368) / 92 - 4) }, opacity: 0.45 + (i % 5) * 0.1 }));
  }
  return row(bars, { crossAxisAlignment: 'center', width: width, height: 74 });
}
function timelineLane(label, width, clips, frame, lane) {
  return row([
    txt(label, { width: 120, fontSize: 13, color: '#8d8da2', fontWeight: 700, letterSpacing: 1.5 }),
    box({
      width: width, height: 64, color: '#321b1b2d', borderRadius: 8,
      child: stack(clips),
    }),
  ], { crossAxisAlignment: 'center', margin: { top: lane === 0 ? 12 : 10 } });
}
function renderEdit(frame) {
  var enter = eo3(seg(frame, 0, 35));
  var playhead = 160 + (frame / 299) * 1240;
  var clipsV = [
    box({ width: 420, height: 48, borderRadius: 6, color: '#8c5bd6', alignment: 'centerLeft', offsetX: 14, child: txt('  INTRO / THREE', { fontSize: 13, fontWeight: 700 }) }),
    box({ width: 350, height: 48, borderRadius: 6, color: '#376e91', alignment: 'centerLeft', offsetX: 444, child: txt('  CAMERA PASS', { fontSize: 13, fontWeight: 700 }) }),
    box({ width: 420, height: 48, borderRadius: 6, color: '#5b438f', alignment: 'centerLeft', offsetX: 804, child: txt('  LIGHT + PARTICLES', { fontSize: 13, fontWeight: 700 }) }),
  ];
  var clipsFx = [
    box({ width: 330, height: 48, borderRadius: 6, color: '#285a63', alignment: 'centerLeft', offsetX: 120, child: txt('  TRANSFORM', { fontSize: 13, fontWeight: 700 }) }),
    box({ width: 510, height: 48, borderRadius: 6, color: '#285a63', alignment: 'centerLeft', offsetX: 620, child: txt('  GPU SHOWREEL', { fontSize: 13, fontWeight: 700 }) }),
  ];
  return shotRoot(frame, [
    shotTitle(['CUT ON THE BEAT.'], {
      kicker: '05 / EDIT', x: 110, y: 130, fontSize: 64,
      subtitle: 'Every scene, every layer, every cue — one shared clock.', opacity: enter,
    }),
    pill('30 FPS  /  120 SECONDS', { alignment: 'topRight', offsetX: -110, offsetY: 158, accent: '#22d3ee', opacity: enter }),
    glass({
      width: 1660, height: 440, alignment: 'topCenter', offsetY: 400 + 25 * (1 - enter), opacity: enter,
      child: stack([
        column([
          windowBar('yoclip_threejs / timeline', 1660, { titleColor: '#b7b7c8' }),
          row([
            txt('00:00', { fontSize: 12, color: '#77778b' }),
            txt('00:30', { fontSize: 12, color: '#77778b', margin: { left: 300 } }),
            txt('01:00', { fontSize: 12, color: '#77778b', margin: { left: 300 } }),
            txt('01:30', { fontSize: 12, color: '#77778b', margin: { left: 300 } }),
            txt('02:00', { fontSize: 12, color: '#77778b', margin: { left: 300 } }),
          ], { margin: { left: 150, top: 16 } }),
          timelineLane('VIDEO 1', 1400, clipsV, frame, 0),
          timelineLane('VIDEO 2', 1400, clipsFx, frame, 1),
          timelineLane('AUDIO 1', 1400, [waveform(1360, frame, '#22d3ee')], frame, 2),
        ], { crossAxisAlignment: 'start' }),
        box({
          width: 2, height: 250, color: '#ff5f8f',
          positioned: { left: playhead, top: 118 },
        }),
        box({
          width: 14, height: 14, rotation: 45, color: '#ff5f8f',
          positioned: { left: playhead - 6, top: 112 },
        }),
      ]),
    }),
  ]);
}

// 06 — Formats ---------------------------------------------------------------
function formatCard(ratio, resolution, label, w, h, frame, index, x) {
  var enter = eo3(seg(frame, 20 + index * 14, 58 + index * 14));
  return glass({
    width: 500, height: 490, alignment: 'topLeft', offsetX: x, offsetY: 390 + 30 * (1 - enter), opacity: enter,
    child: column([
      miniLabel(label, index === 0 ? '#a78bfa' : index === 1 ? '#22d3ee' : '#34d399'),
      box({
        width: w, height: h, borderColor: '#a1a1aa', borderWidth: 2, borderRadius: 10,
        color: '#241b1b2d', margin: { top: 42 },
        child: stack([
          box({ width: w * 0.7, height: 2, color: '#667c3aed', alignment: 'center', rotation: index === 1 ? 32 : -18 }),
          txt('Y', { fontSize: Math.min(w, h) * 0.34, color: '#ffffff', fontWeight: 700, alignment: 'center', opacity: 0.9 }),
        ]),
      }),
      txt(ratio, { fontSize: 40, color: '#ffffff', fontWeight: 700, margin: { top: 30 }, textAlign: 'center' }),
      txt(resolution, { fontSize: 17, color: '#a1a1aa', margin: { top: 8 }, textAlign: 'center' }),
    ], { crossAxisAlignment: 'center', margin: { left: 30, right: 30, top: 28 } }),
  });
}
function renderFormats(frame) {
  return shotRoot(frame, [
    shotTitle(['EVERY PIXEL. EVERY FORMAT.'], {
      kicker: '06 / DELIVERY', alignment: 'topCenter', y: 145, fontSize: 64, align: 'center',
      subtitle: 'One composition. Every screen. No afterthought exports.',
    }),
    formatCard('16:9', '1920 × 1080  /  4K READY', 'LANDSCAPE', 330, 186, frame, 0, 110),
    formatCard('9:16', '1080 × 1920  /  SHORTS', 'PORTRAIT', 150, 267, frame, 1, 710),
    formatCard('1:1', '1080 × 1080  /  SOCIAL', 'SQUARE', 235, 235, frame, 2, 1310),
  ]);
}

// 07 — Verify ----------------------------------------------------------------
function verifyCheck(label, detail, frame, index) {
  var enter = eo3(seg(frame, 30 + index * 13, 55 + index * 13));
  return row([
    box({ width: 38, height: 38, borderRadius: 19, color: '#2034d399', child: checkIcon({ size: 25, alignment: 'center' }) }),
    column([
      txt(label, { fontSize: 21, color: '#ffffff', fontWeight: 700 }),
      txt(detail, { fontSize: 15, color: '#8d8da2', margin: { top: 6 } }),
    ], { margin: { left: 18 }, crossAxisAlignment: 'start' }),
  ], { opacity: enter, offsetY: 14 * (1 - enter), margin: { bottom: 28 } });
}
function renderVerify(frame) {
  var enter = eo3(seg(frame, 0, 35));
  return shotRoot(frame, [
    shotTitle(['GOLDEN FRAMES.', 'NOT GOLDEN HOPES.'], {
      kicker: '07 / VERIFY', x: 110, y: 145, fontSize: 62,
      subtitle: 'If a frame matters, capture it. If it changes, review it.', opacity: enter,
    }),
    glass({
      width: 960, height: 480, alignment: 'topLeft', offsetX: 110, offsetY: 475,
      opacity: enter, child: stack([
        box({ width: 960, height: 480, gradient: { type: 'radial', colors: ['#5a341b78', '#05050c00'], center: 'center', radius: 0.8 } }),
        dotGrid(380, 180, '#30a78bfa'),
        cornerBrackets(900, 420, '#22d3ee', eo3(seg(frame, 20, 95))),
        txt('FRAME 01800', { fontSize: 14, color: '#22d3ee', fontWeight: 700, letterSpacing: 2.2, alignment: 'topLeft', offsetX: 34, offsetY: 28 }),
        txt('1920 × 1080', { fontSize: 14, color: '#a1a1aa', alignment: 'topRight', offsetX: -34, offsetY: 28 }),
        txt('Y', { fontSize: 190, color: '#ffffff', fontWeight: 700, alignment: 'center', opacity: 0.75 }),
        pill('GOLDEN / APPROVED', { alignment: 'bottomRight', offsetX: -28, offsetY: -26, accent: '#34d399', dot: true }),
      ]),
    }),
    column([
      verifyCheck('Scene integrity', 'No missing assets or JS errors', frame, 0),
      verifyCheck('Pixel comparison', '0.000% unexpected difference', frame, 1),
      verifyCheck('Arbitrary seek', 'Same frame. Same pixels. Every run.', frame, 2),
      verifyCheck('Export readiness', 'All 3,600 frames accounted for', frame, 3),
    ], { alignment: 'topRight', offsetX: -120, offsetY: 480, opacity: enter }),
  ]);
}

// 08 — Export ----------------------------------------------------------------
function renderExport(frame) {
  var enter = eo3(seg(frame, 0, 35));
  var progress = seg(frame, 35, 245);
  var percent = Math.round(progress * 100);
  var current = Math.min(3600, Math.round(progress * 3600));
  return shotRoot(frame, [
    shotTitle(['ONE ENGINE. NATIVE SPEED.'], {
      kicker: '08 / EXPORT', alignment: 'topCenter', y: 145, fontSize: 64, align: 'center',
      subtitle: 'The scene you preview is the scene you ship.',
    }),
    glass({
      width: 1380, height: 520, alignment: 'topCenter', offsetY: 390 + 26 * (1 - enter), opacity: enter,
      child: column([
        row([
          box({ width: 82, height: 82, borderRadius: 20, color: '#337c3aed', child: playIcon({ size: 50, alignment: 'center' }) }),
          column([
            txt('yoclip_threejs_120s.mp4', { fontSize: 29, color: '#ffffff', fontWeight: 700 }),
            txt('H.264  /  AAC  /  1920 × 1080  /  30 FPS', { fontSize: 15, color: '#8d8da2', letterSpacing: 1.4, margin: { top: 10 } }),
          ], { margin: { left: 24 }, crossAxisAlignment: 'start' }),
          txt(percent + '%', { fontSize: 54, color: '#22d3ee', fontWeight: 700, margin: { left: 300 } }),
        ], { crossAxisAlignment: 'center' }),
        progressBar({ width: 1250, height: 10, progress: progress }),
        row([
          tinyMetric('FRAMES', pad(current, 4) + ' / 3600', { valueSize: 28 }),
          tinyMetric('PIPELINE', 'JS / GPU', { valueSize: 28, valueColor: '#a78bfa' }),
          tinyMetric('AUDIO', '48 KHZ / AAC', { valueSize: 28, valueColor: '#34d399' }),
          tinyMetric('STATUS', percent >= 100 ? 'COMPLETE' : 'RENDERING', { valueSize: 28, valueColor: '#22d3ee' }),
        ], { mainAxisAlignment: 'spaceBetween', margin: { top: 48 } }),
        row([
          box({ width: 8, height: 8, borderRadius: 4, color: percent >= 100 ? '#34d399' : '#22d3ee' }),
          txt(percent >= 100 ? '  Render complete. Every frame verified.' : '  Native encoder is writing the final master…', {
            fontSize: 18, color: '#b7b7c8', margin: { left: 8 },
          }),
        ], { margin: { top: 42 } }),
      ], { margin: { left: 64, right: 64, top: 58 }, crossAxisAlignment: 'stretch' }),
    }),
  ]);
}

// 09 — GPU showreel ----------------------------------------------------------
function renderShowreel(frame) {
  var part = Math.min(3, Math.floor(frame / 75));
  var local = frame - part * 75;
  var names = ['GEOMETRY', 'LIGHT', 'PARTICLES', 'INSTANCING'];
  var descriptions = [
    'Parametric surfaces. Clean topology.',
    'PBR materials. Animated colored lights.',
    'A deterministic field of 900 points.',
    '96 clips. One draw batch.',
  ];
  var enter = eo3(seg(local, 0, 16));
  var segments = [];
  for (var i = 0; i < 4; i++) {
    segments.push(box({
      width: 350, height: 4, borderRadius: 2,
      color: i < part ? '#7c3aed' : i === part ? '#22d3ee' : '#30ffffff',
      margin: { right: i === 3 ? 0 : 24 },
    }));
  }
  return shotRoot(frame, [
    miniLabel('09 / FROM JS TO GPU', '#22d3ee', {
      alignment: 'topLeft', offsetX: 110, offsetY: 122,
    }),
    column([
      txt(names[part], {
        fontSize: 88, color: '#ffffff', fontWeight: 700, letterSpacing: -2.4,
        shadows: [{ color: '#d0000000', blur: 24, offsetY: 5 }],
      }),
      txt(descriptions[part], { fontSize: 23, color: '#b7b7c8', margin: { top: 18 } }),
    ], {
      crossAxisAlignment: 'start', alignment: 'topLeft', offsetX: 110, offsetY: 175 + 22 * (1 - enter), opacity: enter,
    }),
    txt('0' + (part + 1), {
      fontSize: 142, color: '#24ffffff', fontWeight: 700, alignment: 'topRight', offsetX: -110, offsetY: 140,
    }),
    row(segments, { alignment: 'bottomCenter', offsetY: -110 }),
    txt('96 INSTANCED CLIPS  /  900 PARTICLES  /  60 TARGET FPS', {
      fontSize: 13, color: '#8d8da2', fontWeight: 700, letterSpacing: 2.2,
      alignment: 'bottomCenter', offsetY: -72,
    }),
  ]);
}

// 10 — Repository ------------------------------------------------------------
function repoLine(depth, name, color, frame, index) {
  var enter = eo3(seg(frame, 18 + index * 4, 35 + index * 4));
  return row([
    txt(depth === 0 ? '▾' : '·', { fontSize: 18, color: '#66667a', width: 24 }),
    txt(name, { fontSize: 19, color: color || '#b7b7c8', fontWeight: depth === 0 ? 700 : 500 }),
  ], { margin: { left: depth * 26, top: 12 }, opacity: enter });
}
function renderRepository(frame) {
  var enter = eo3(seg(frame, 0, 38));
  return shotRoot(frame, [
    shotTitle(['YOUR NEXT VIDEO', 'IS ALREADY IN YOUR REPO.'], {
      kicker: '10 / OWN THE SOURCE', x: 860, y: 190, width: 930, fontSize: 60,
      subtitle: 'Review it. Diff it. Version it. Generate the next cut.\nThe project is the master — not a locked project file.',
      opacity: enter,
    }),
    glass({
      width: 650, height: 650, alignment: 'topLeft', offsetX: 110, offsetY: 210,
      opacity: enter, child: column([
        windowBar('yoclip_threejs', 650),
        column([
          repoLine(0, 'yoclip.yaml', '#22d3ee', frame, 0),
          repoLine(0, 'project.js', '#a78bfa', frame, 1),
          repoLine(0, 'scenes/', '#ffffff', frame, 2),
          repoLine(1, '00_intro.scene.js', null, frame, 3),
          repoLine(1, '01_author.scene.js', null, frame, 4),
          repoLine(1, '…', null, frame, 5),
          repoLine(0, 'three/', '#ffffff', frame, 6),
          repoLine(1, 'world.js', '#a9e7ff', frame, 7),
          repoLine(0, 'assets/', '#ffffff', frame, 8),
          repoLine(1, 'audio/  images/', null, frame, 9),
          repoLine(0, 'renders/', '#34d399', frame, 10),
        ], { margin: { left: 30, top: 14 }, crossAxisAlignment: 'start' }),
      ], { crossAxisAlignment: 'start' }),
    }),
    glass({
      width: 860, height: 260, alignment: 'bottomRight', offsetX: -110, offsetY: -125,
      opacity: enter, child: column([
        txt('$ yoclip preview', { fontSize: 25, color: '#a9e7ff', fontWeight: 600 }),
        txt('$ yoclip screenshot --at 60s', { fontSize: 25, color: '#c9b8ff', fontWeight: 600, margin: { top: 22 } }),
        txt('$ yoclip render --output film.mp4', { fontSize: 25, color: '#ffffff', fontWeight: 600, margin: { top: 22 } }),
        txt('✓ 120 seconds. Fully reproducible.', { fontSize: 18, color: '#34d399', margin: { top: 28 } }),
      ], { margin: { left: 38, top: 34 }, crossAxisAlignment: 'start' }),
    }),
  ]);
}

// 11 — Outro -----------------------------------------------------------------
function renderOutro(frame) {
  var enter = eo3(seg(frame, 0, 48));
  var urlIn = eo3(seg(frame, 45, 90));
  return shotRoot(frame, [
    txt('DESCRIBE IT. RENDER IT.', {
      fontSize: 74, color: '#ffffff', fontWeight: 700, letterSpacing: -2,
      alignment: 'topCenter', offsetY: 490 + 30 * (1 - enter), opacity: enter,
      textAlign: 'center', shadows: [{ color: '#e0000000', blur: 26, offsetY: 6 }],
    }),
    txt('CODE-FIRST VIDEO. NATIVE THREE.JS. YOUR GPU.', {
      fontSize: 18, color: '#b7b7c8', fontWeight: 700, letterSpacing: 3.4,
      alignment: 'topCenter', offsetY: 610, opacity: enter,
    }),
    glass({
      width: 520, height: 86, borderRadius: 43, alignment: 'topCenter', offsetY: 735,
      opacity: urlIn, borderColor: '#7022d3ee',
      child: row([
        txt(PROMO.url, { fontSize: 30, color: '#ffffff', fontWeight: 700, letterSpacing: 0.6 }),
        arrowIcon({ size: 30, color: '#22d3ee', margin: { left: 22 } }),
      ], { mainAxisAlignment: 'center' }),
    }),
    txt('WRITE THE SCENE.  OWN EVERY FRAME.', {
      fontSize: 13, color: '#8d8da2', fontWeight: 700, letterSpacing: 3,
      alignment: 'bottomCenter', offsetY: -105, opacity: urlIn,
    }),
  ]);
}
