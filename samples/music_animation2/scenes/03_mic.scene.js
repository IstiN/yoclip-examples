// Сцена 3 (120–330 · 3:18): студийный микрофон в тёмной комнате, рядом смятый лист
// с текстом. Тусклый фиолетовый свет, лёгкий параллакс. Строки: «Я не сумел
// придумать лучше... что я всё это спел.»
scene = {
  id: 'mic',
  duration: 210,
  from: 120,
  description: 'Студийный микрофон крупно в темноте: сетчатая капсула, паук-держатель, стойка. Рядом на стойке — смятый лист бумаги. Тусклый фиолетовый ключевой свет справа, холодный контровой слева, пылинки в луче. Фон и микрофон двигаются с разной скоростью (параллакс), лёгкий наезд камерой.',
  voicePrompts: { ru: 'Я не сумел придумать лучше, да и не хотел — мне просто легче от того, что я всё это спел.' },
  timeline: { label: '03 · Микрофон', color: '#8b5cf6', lane: 'video' },
  render: function(f) {
    var kids = [];
    var zoom = 1.0 + 0.10 * seg(f, 0, 210);

    // фон: глубокая темнота + фиолетовый ключ справа, холодный контровой слева
    kids.push({ type: 'absolute_fill', color: '#03040a' });
    var bg = { type: 'stack', children: [
      aura(880 + Math.sin(f * 0.01) * 18, 700, 1150, C.violet, 0.5),
      aura(120 + Math.cos(f * 0.008) * 14, 1250, 800, C.ice, 0.16),
      aura(540, 1750, 900, C.violet, 0.12),
    ] };
    var bgWrap = { type: 'container', children: [bg], scale: zoom * 1.06 };
    kids.push(bgWrap);

    // пылинки в луче
    for (var i = 0; i < 26; i++) {
      var px = (rnd(i * 3.1) * W + Math.sin(f * 0.01 + i) * 30);
      var py = (rnd(i * 7.7) * H + f * (0.12 + rnd(i) * 0.3)) % H;
      kids.push({ type: 'circle', size: 2 + rnd(i * 13.3) * 3.5,
        fill: i % 4 ? AA(C.violetL, 'aa') : AA(C.ice, 'aa'),
        opacity: 0.06 + 0.2 * rnd(i + Math.floor(f / 16)),
        positioned: { left: Math.round(px), top: Math.round(H - py) } });
    }

    // микрофон: капсула + паук + стойка (SVG), параллакс-слой
    var m = svgOpen(520, 980);
    // стойка
    m += '<line x1="260" y1="470" x2="260" y2="920" stroke="#3a415f" stroke-width="10"/>';
    m += '<path d="M150 920 L370 920 M185 890 L260 920 M335 890 L260 920" stroke="#333a58" stroke-width="9" fill="none"/>';
    // паук-держатель
    m += '<path d="M140 330 L140 360 Q140 470 260 470 Q380 470 380 360 L380 330" fill="none" stroke="#4a5272" stroke-width="7"/>';
    m += '<line x1="150" y1="300" x2="128" y2="380" stroke="#3a415f" stroke-width="6"/>';
    m += '<line x1="370" y1="300" x2="392" y2="380" stroke="#3a415f" stroke-width="6"/>';
    // корпус капсулы
    m += '<defs><linearGradient id="body" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="#121526"/><stop offset="45%" stop-color="#2a2f4c"/>' +
      '<stop offset="100%" stop-color="#0d1020"/></linearGradient>' +
      '<radialGradient id="cap" cx="0.38" cy="0.32" r="0.9">' +
      '<stop offset="0%" stop-color="#6d5bb8"/><stop offset="55%" stop-color="#3a3462"/>' +
      '<stop offset="100%" stop-color="#171a30"/></radialGradient></defs>';
    m += '<rect x="172" y="88" width="176" height="300" rx="88" fill="url(#cap)" stroke="#8b7fd0" stroke-opacity="0.55" stroke-width="3"/>';
    // сетка капсулы
    for (var gy = 112; gy < 360; gy += 17) {
      m += '<line x1="184" y1="' + gy + '" x2="336" y2="' + gy + '" stroke="#100e22" stroke-opacity="0.5" stroke-width="3.4"/>';
    }
    for (var gx = 196; gx < 340; gx += 19) {
      m += '<line x1="' + gx + '" y1="98" x2="' + gx + '" y2="376" stroke="#100e22" stroke-opacity="0.34" stroke-width="3"/>';
    }
    // блик фиолетового ключа на капсуле
    m += '<ellipse cx="222" cy="170" rx="34" ry="70" fill="#b9a8ff" fill-opacity="0.20"/>';
    // нижнее кольцо и разъём
    m += '<rect x="196" y="392" width="128" height="34" rx="12" fill="url(#body)" stroke="#4a5272" stroke-width="2.5"/>';
    m += '</svg>';
    var mic = at(svg(m, 520, 980), 490 + Math.cos(f * 0.012) * 8, 940 + Math.sin(f * 0.014) * 6);
    mic.scale = zoom;
    mic.rotation = Math.sin(f * 0.01) * 1.4;
    kids.push(mic);

    // смятый лист бумаги у стойки
    var paper = svgOpen(360, 300);
    paper += '<defs><linearGradient id="ppr" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#3d4258"/><stop offset="100%" stop-color="#23283c"/></linearGradient></defs>';
    paper += '<path d="M52 210 L30 120 L95 40 L200 22 L318 70 L338 170 L270 262 L140 278 Z" fill="url(#ppr)" stroke="#5a6180" stroke-width="2.5"/>';
    paper += '<path d="M95 40 L128 118 L30 120 M128 118 L200 22 M128 118 L210 170 L318 70 M210 170 L338 170 M210 170 L140 278" fill="none" stroke="#5a6180" stroke-opacity="0.7" stroke-width="1.8"/>';
    paper += '<path d="M150 110 L235 104 M140 140 L246 132 M152 170 L228 164" stroke="#151a2e" stroke-width="4"/>';
    paper += '</svg>';
    var pWrap = at(svg(paper, 360, 300), 830 + Math.sin(f * 0.01) * 6, 1500);
    pWrap.rotation = -8 + Math.sin(f * 0.008) * 1.5;
    pWrap.scale = zoom * 0.96;
    pWrap.opacity = 0.9;
    kids.push(pWrap);

    // холодный контровой луч слева
    kids.push({ type: 'container', width: 500, height: 1300, rotation: 16,
      positioned: { left: -190, top: 240 },
      gradient: { colors: ['#00000000', AA(C.ice, '14'), '#00000000'], stops: [0, 0.5, 1] }, blur: 8 });

    // строка трека — караоке по транскрипту («Я не сумел придумать лучше...» 198–205 c)
    kids.push(sung(f, 120));

    var sh = shake(f, 2);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 194, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 24));
  },
};
