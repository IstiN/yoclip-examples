// Сцена 10 (1500–1890 · 4:04): «Я до сих пор не забил!» — кульминация. ЦЕЛЬНОЕ
// 3D-сердце из тёмного стекла (без контуров): на каждом ударе баса (сильный онсет)
// от него откалывается кусочек — мгновенная трещина, летящий осколок, вспышка и
// глитч-сдвиг. Текст почти на весь экран с шейком.
scene = {
  id: 'heart',
  duration: 390,
  from: 1500,
  description: 'Крупное сердце из тёмного красного стекла бьётся в такт (масштаб-панч на бит, блик сверху-слева). На каждом сильном онсете трека от сердца откалывается кусочек: трещина появляется мгновенно, осколок улетает с вращением, кадр вспыхивает и глитчит. К финалу сердце всё в трещинах и тускнеет. Текст «Я до сих пор не забил!» огромный с дрожью.',
  voicePrompts: { ru: 'Я до сих пор не забил!' },
  timeline: { label: '10 · Не забил', color: '#ff2d55', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#050408' });
    kids.push(aura(540, 820, 1500, C.red, 0.4));
    kids.push(aura(140, 1500, 700, C.redDeep, 0.25));

    // искры/угли вокруг
    for (var i = 0; i < 20; i++) {
      var ex = rnd(i * 7.3) * W;
      var ey = (rnd(i * 3.9) * 1400 + 1500 - f * (0.6 + rnd(i) * 1.1)) % 1500;
      kids.push({ type: 'circle', size: 2.5 + rnd(i * 2) * 3.5,
        fill: rnd(i * 5) > 0.5 ? C.red : AA(C.red, 'aa'),
        opacity: 0.15 + 0.45 * rnd(i + Math.floor(f / 12)),
        positioned: { left: Math.round(ex), top: Math.round(ey) } });
    }

    // --- сердце: тёмное стекло, цельное, бьётся в такт -------------------------
    var hw = 640, hh = 580;
    var heartD = 'M 320 520 C 60 340 20 190 60 100 C 95 25 200 5 265 70 L 320 125 L 375 70 C 440 5 545 25 580 100 C 620 190 580 340 320 520 Z';
    var beatScale = 1 + 0.07 * pulse(f, 1) + 0.06 * MT.hit(f, 1);
    var heart = at({ type: 'svg', data: svgOpen(640, 580) +
      '<defs>' +
      '<radialGradient id="glass" cx="0.38" cy="0.26" r="1.05">' +
      '<stop offset="0%" stop-color="#a1246"/>' +
      '<stop offset="38%" stop-color="#5c0a28"/>' +
      '<stop offset="72%" stop-color="#2c0516"/>' +
      '<stop offset="100%" stop-color="#140209"/></radialGradient>' +
      '<radialGradient id="hl" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0%" stop-color="#ffdce6" stop-opacity="0.55"/>' +
      '<stop offset="100%" stop-color="#ffdce6" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="core" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0%" stop-color="#ff2d55" stop-opacity="0.5"/>' +
      '<stop offset="100%" stop-color="#ff2d55" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<path d="' + heartD + '" fill="url(#glass)"/>' +
      // внутреннее красное свечение (пульсирует на бит)
      '<path d="' + heartD + '" fill="url(#core)" opacity="' +
      (0.55 + 0.45 * pulse(f, 1)).toFixed(3) + '"/>' +
      // блик стекла сверху-слева
      '<ellipse cx="215" cy="170" rx="100" ry="62" fill="url(#hl)" transform="rotate(-26 215 170)"/>' +
      '<ellipse cx="250" cy="105" rx="30" ry="16" fill="#ffffff" fill-opacity="0.5" transform="rotate(-26 250 105)"/>' +
      '</svg>', width: hw, height: hh }, 540, 830);
    heart.scale = beatScale;
    // глитч-сдвиг сердца (после откалывания — сильнее)
    var burst = 0;
    for (var b = 0; b < HITS.length; b++) {
      var age0 = f - HITS[b];
      if (age0 >= 0 && age0 < 10) burst = Math.max(burst, 1 - age0 / 10);
    }
    var gs = glitchShift(f, 10);
    heart.offsetX = gs.x * (1.4 + 2.2 * burst);
    kids.push(heart);

    // --- разрушение: на каждом кике трещина (мгновенно) + летящий осколок ------
    // Трещины/осколки — через svg() (тот же 1:1 пайплайн, что и само сердце):
    // голые path-узлы рендерер рисует с непредсказуемым масштабом.
    for (var c = 0; c < HITS.length; c++) {
      var ev = HITS[c];
      if (f < ev) continue;
      var cd = CRACKS[c % CRACKS.length];
      var crackSvg = svgOpen(640, 580) +
        '<path d="' + cd + '" fill="none" stroke="#08030a" stroke-opacity="0.95" ' +
        'stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path d="' + cd + '" fill="none" stroke="#ffd7e0" stroke-opacity="0.4" ' +
        'stroke-width="1.8" stroke-linejoin="round"/>' + '</svg>';
      kids.push(at(svg(crackSvg, 640, 580), 540, 830));
      // осколок летит от точки скола
      var age = f - ev;
      if (age < 110) {
        var sp = SHARDS[c % SHARDS.length];
        var px2 = sp.x0 + sp.vx * age;
        var py2 = sp.y0 + sp.vy * age + 0.006 * age * age; // гравитация
        var shardSvg = svgOpen(90, 90) +
          '<path d="' + sp.d + '" fill="#7a1130" fill-opacity="0.93" ' +
          'stroke="#ffb3c6" stroke-opacity="0.5" stroke-width="2"/>' + '</svg>';
        var shard = at(svg(shardSvg, 90, 90),
          Math.round(540 - 320 + px2), Math.round(830 - 290 + py2));
        shard.rotation = sp.r0 + age * 3.1;
        shard.opacity = 1 - seg(age, 30, 110);
        shard.scale = 1 - 0.3 * seg(age, 0, 110);
        kids.push(shard);
      }
      var fl = flash(f, ev, 9, C.red, 0.34);
      if (fl) kids.push(fl);
    }
    // к финалу сердце тускнеет
    var dim = 1 - 0.35 * seg(f, 260, 370);
    kids.push({ type: 'container', width: W, height: H,
      color: '#050408', opacity: (1 - dim) * 0.75 });

    // караоке-страховка (строки с «забил» показывает арт-текст ниже — скипаем их).
    kids.push(sung(f, 1500, function(L) { return L.text.indexOf('забил') >= 0; }));

    // ТЕКСТ КУЛЬМИНАЦИИ — почти на весь экран, с шейком; вход по вокалу:
    // «Я до сих пор не забил,» (4:04 = локальный 0) и «.» (4:06 = локальный 60).
    var bigShake = shake(f, 5);
    var t1 = { type: 'container', opacity: seg(f, 0, 10),
      scale: 0.8 + 0.2 * eoBack(seg(f, 0, 30)),
      child: glowText('Я ДО СИХ ПОР', SZ.lyricBig, C.white, C.red, 30) };
    var t1w = atC(t1, 540 + bigShake.x * 2, 1350 + bigShake.y * 2, 1080);
    kids.push(t1w);
    var t2 = { type: 'container', opacity: seg(f, 48, 58),
      scale: 0.75 + 0.25 * eoBack(seg(f, 48, 88)),
      child: glowText('НЕ ЗАБИЛ!', SZ.huge, '#ffffff', C.red, 42) };
    var t2w = atC(t2, 540 + bigShake.x * 3, 1530 + bigShake.y * 3, 1080);
    kids.push(t2w);
    // повторный панч на «!» — на строке «Я до сих пор не забил.» (локальный 60)
    if (f > 60 && f < 100) {
      var pk = 1 + 0.25 * Math.exp(-3 * (f - 60) / 14);
      kids.push(atC({ type: 'container', opacity: 0.9,
        child: glowText('НЕ ЗАБИЛ!', SZ.huge * pk, '#ffffff', C.red, 46) },
        540, 1530, 1080));
    }

    var sh = shake(f, 3);
    var all = { type: 'stack', fit: 'expand', children: kids,
      offsetX: sh.x + glitchShift(f, 10).x, offsetY: sh.y + glitchShift(f, 10).y };
    var out = flash(f, 374, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 16));
  },
};

// Сильные онсеты трека внутри сцены (кадры локальные: кадр трека - 7320)
// и формы трещин/осколков к ним.
var HITS = [23, 171, 190, 217, 245, 338];
var CRACKS = [
  'M 300 120 L 320 200 L 292 268 L 330 330 L 312 402',
  'M 180 170 L 220 240 L 196 310 L 238 372',
  'M 430 150 L 402 226 L 444 292 L 416 366 L 446 420',
  'M 320 125 L 355 205 L 318 285 L 360 360',
  'M 120 240 L 185 300 L 150 380 L 215 430',
  'M 500 220 L 455 290 L 495 350 L 450 405',
];
var SHARDS = [
  { d: 'M 8 10 L 42 2 L 50 34 L 24 46 Z', x0: 320, y0: 200, vx: 2.6, vy: -2.2, r0: 12 },
  { d: 'M 6 14 L 38 6 L 44 36 L 18 44 Z', x0: 190, y0: 250, vx: -3.1, vy: -1.6, r0: -20 },
  { d: 'M 10 8 L 44 12 L 40 42 L 12 38 Z', x0: 440, y0: 190, vx: 3.4, vy: -1.9, r0: 30 },
  { d: 'M 8 12 L 40 4 L 48 30 L 26 46 Z', x0: 350, y0: 210, vx: -2.4, vy: -2.6, r0: -8 },
  { d: 'M 6 10 L 36 8 L 42 38 L 16 42 Z', x0: 130, y0: 300, vx: -3.6, vy: -1.2, r0: 22 },
  { d: 'M 10 6 L 42 10 L 38 40 L 14 36 Z', x0: 490, y0: 240, vx: 3.0, vy: -2.4, r0: -26 },
];
