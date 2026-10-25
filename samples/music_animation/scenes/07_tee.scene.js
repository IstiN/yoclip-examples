// 07 · «Пол-ляма на футболку» — парящий оверсайз, купюры в слоу-мо,
// кислотный ценник 500 000 ₽ и счётчик потраченного.
scene = {
  id: 's7',
  duration: 90,
  from: 507,
  timeline: { label: '500 000 ₽', color: '#b6ff2e', lane: 'video' },
  render: function(f) {
    var back = [], front = [];
    var floatY = Math.sin(f * 0.045) * 18;

    // Купюры на орбите: половина за футболкой, половина перед ней.
    for (var i = 0; i < 8; i++) {
      var ang = f * 0.009 + i * Math.PI * 2 / 8;
      var bx = 540 + Math.cos(ang) * 400;
      var by = 1060 + Math.sin(ang) * 420;
      var depth = (Math.sin(ang) + 1) / 2; // 0 зад .. 1 перед
      var bill = { type: 'container', width: 200, height: 96, borderRadius: 12,
        color: '#0d1a10', borderColor: C.acid, borderWidth: 2,
        opacity: 0.45 + 0.5 * depth, scale: 0.65 + 0.4 * depth,
        rotation: Math.sin(ang * 2 + i) * 22,
        shadow: { color: '#55b6ff2e', blur: 24 },
        child: { type: 'row', mainAxisAlignment: 'center', spacing: 14, children: [
          T('500', 40, C.acid),
          { type: 'circle', size: 34, fill: 'none', stroke: C.acid, strokeWidth: 2 },
        ] } };
      (Math.sin(ang) < 0 ? back : front).push(at(bill, bx, by));
    }

    // Оверсайз-футболка: тёмная ткань, фиолетово-кислотный контровой свет.
    var teePath = 'M225 70 L300 40 Q345 95 390 40 L465 70 L635 185 L555 300 L500 260 L500 620 Q345 655 190 620 L190 260 L135 300 L55 185 Z';
    var t = svgOpen(690, 720);
    t += '<defs><linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1a1e30"/><stop offset="60%" stop-color="#0c0f1c"/>' +
      '<stop offset="100%" stop-color="#131a12"/></linearGradient></defs>';
    t += '<path d="' + teePath + '" transform="translate(-8 0)" fill="none" stroke="#8b5cf6" stroke-opacity="0.5" stroke-width="5"/>';
    t += '<path d="' + teePath + '" transform="translate(8 0)" fill="none" stroke="#b6ff2e" stroke-opacity="0.45" stroke-width="5"/>';
    t += '<path d="' + teePath + '" fill="url(#cloth)" stroke="#dfe6ff" stroke-opacity="0.65" stroke-width="2.5" stroke-linejoin="round"/>';
    t += '<path d="M300 40 Q345 115 390 40" fill="none" stroke="#dfe6ff" stroke-opacity="0.5" stroke-width="3"/>';
    t += '<path d="M235 270 Q260 430 235 590 M455 270 Q430 430 455 590 M320 290 Q345 380 330 470" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="10" stroke-linecap="round"/>';
    t += '</svg>';
    var tee = at(svg(t, 690, 720), 540, 1010 + floatY);
    tee.rotation = Math.sin(f * 0.03) * 3;

    // Ценник на нитке.
    var tag = { type: 'container', width: 380, height: 150, borderRadius: 18,
      color: '#101a08', borderColor: C.acid, borderWidth: 2.5, rotation: 12,
      shadow: { color: '#77b6ff2e', blur: 44 },
      child: { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: 4, children: [
        glowText('500 000 ₽', 56, C.acid, C.acid, 18),
        cap('ЦЕНА · БЕЗ НДС', '#7a9c4a', 20),
      ] } };
    var tagWrap = at(tag, 800, 1260 + floatY);

    // Счётчик потраченного.
    var spent = Math.round(500000 * eoExpo(seg(f, 10, 80)) / 500) * 500;
    var counter = fullW({ type: 'column', crossAxisAlignment: 'center', spacing: 12, children: [
      cap('СЧЁТ ЗА ГАРДЕРОБ', C.muted, 26),
      glowText('−' + String(spent).replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + ' ₽', 78, C.white, C.acid, 22),
    ] }, 1610);

    var main = { type: 'stack', fit: 'expand', children:
      back.concat([tee, tagWrap], front, [counter]) };
    var all = [sceneIn(f, main)];
    all.push(lyric(f, [
      [ { t: 'Для' }, { t: 'меня' }, { t: 'стало' }, { t: 'нормальным' } ],
      [ { t: 'слить' }, { t: 'пол-ляма', c: C.acid, g: C.acid, s: 84 }, { t: 'на' }, { t: 'футболку' } ],
    ], { line: 6, size: 58 }));
    all = all.concat(glitchBars(f, C.acid, 7));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
