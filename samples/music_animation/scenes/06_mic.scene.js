// 06 · «Никакого meet and greet'а, никакого „сфоткаться“» — студийный микрофон.
// Красный/зелёный контровой свет, тряска камеры на бите, штамп ОТКЛОНЕНО.
scene = {
  id: 's6',
  duration: 91,
  from: 416,
  timeline: { label: 'Микрофон', color: '#b6ff2e', lane: 'video' },
  render: function(f) {
    var beat = pulse(f);
    var sh = shake(f, 2 + 9 * beat);
    var kids = [];

    // Ударные волны от микрофона на каждом бите.
    for (var b = 0; b < 3; b++) {
      var age = ((f % BEAT) + BEAT) % BEAT / BEAT + b;
      var p = age - Math.floor(age / 1) * 0; // 0..1 текущая + старые
      var prog = (age / 3);
      if (prog > 1) continue;
      kids.push(at({ type: 'circle', size: 300 + prog * 900,
        stroke: C.acid, strokeWidth: 2, opacity: 0.30 * (1 - prog) }, 540, 860));
    }

    // Микрофон: корпус, сетка, шокмаунт, стойка. Свечение — слоёными штрихами.
    var m = svgOpen(520, 900);
    function rim(dx, color, op) {
      return '<g transform="translate(' + dx + ' 0)" fill="none" stroke="' + color + '" stroke-opacity="' + op + '" stroke-width="5">' +
        '<rect x="180" y="60" width="160" height="330" rx="80"/>' +
        '<path d="M140 300 L140 330 Q140 440 260 440 Q380 440 380 330 L380 300"/>' +
        '<line x1="260" y1="440" x2="260" y2="560"/></g>';
    }
    m += rim(-10, '#ff2d55', 0.55);
    m += rim(10, '#b6ff2e', 0.55);
    m += '<rect x="180" y="60" width="160" height="330" rx="80" fill="#10131f" stroke="#e8ecff" stroke-opacity="0.85" stroke-width="3"/>';
    for (var y = 92; y < 350; y += 18) {
      m += '<line x1="196" y1="' + y + '" x2="324" y2="' + y + '" stroke="#39415f" stroke-width="4"/>';
    }
    for (var x = 208; x < 330; x += 20) {
      m += '<line x1="' + x + '" y1="76" x2="' + x + '" y2="374" stroke="#2a3150" stroke-width="3"/>';
    }
    // световая реакция сетки на бит
    m += '<rect x="196" y="80" width="128" height="290" rx="64" fill="#b6ff2e" fill-opacity="' + (0.04 + 0.10 * beat) + '"/>';
    m += '<path d="M140 300 L140 330 Q140 440 260 440 Q380 440 380 330 L380 300" fill="none" stroke="#e8ecff" stroke-opacity="0.8" stroke-width="4"/>';
    m += '<line x1="260" y1="440" x2="260" y2="600" stroke="#e8ecff" stroke-opacity="0.8" stroke-width="5"/>';
    m += '<path d="M120 640 L400 640 M160 600 L120 640 M360 600 L400 640" stroke="#e8ecff" stroke-opacity="0.7" stroke-width="5" fill="none"/>';
    m += '<line x1="260" y1="600" x2="260" y2="640" stroke="#e8ecff" stroke-opacity="0.7" stroke-width="5"/>';
    m += '<ellipse cx="260" cy="680" rx="150" ry="18" fill="#b6ff2e" fill-opacity="' + (0.05 + 0.12 * beat) + '"/>';
    m += '</svg>';
    var mic = at(svg(m, 520, 900), 540, 1010);
    mic.rotation = Math.sin(f * 0.05) * 1.5;
    kids.push(mic);

    // Красный штамп влетает на «сфоткаться».
    var stampIn = eo3(seg(f, 52, 68));
    if (f > 52) {
      var stamp = { type: 'container', width: 780, height: 180, alignment: 'center',
        borderColor: C.red, borderWidth: 7, borderRadius: 14, color: '#14ff2d55',
        shadow: { color: '#88ff2d55', blur: 50 }, rotation: -12,
        scale: 2.4 - 1.4 * stampIn, opacity: seg(f, 52, 56),
        child: glowText('ОТКЛОНЕНО', 76, C.red, C.red, 20) };
      kids.push(at(stamp, 540, 1470));
    }
    kids.push(fullW(cap('NO FAKE LOVE · NO PHOTOS · NO FEATURES', C.acid, 26), 1640));

    var main = { type: 'stack', fit: 'expand', children: kids };
    main.offsetX = sh.x; main.offsetY = sh.y;
    var all = [sceneIn(f, main)];
    all.push(lyric(f, [
      [ { t: 'Никакого', c: C.acid, g: C.acid }, { t: 'meet' }, { t: 'and' }, { t: 'greet\'а,' } ],
      [ { t: 'никакого', c: C.acid, g: C.acid }, { t: '«сфоткаться»' } ],
    ], { line: 5, size: 60, rgb: function(fr) { return glitchOn(fr, 6); } }));
    all = all.concat(glitchBars(f, C.acid, 6));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
