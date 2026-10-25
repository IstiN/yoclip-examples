// 04 · «Помню, показывал свой рэп, и ты меня оценивал» — телефон в темноте.
// Плеер с демо на паузе, почти плоская волна, 0 прослушиваний и «прочитано».
scene = {
  id: 's4',
  duration: 88,
  from: 224,
  timeline: { label: 'Демо (плеер)', color: '#fbbf24', lane: 'video' },
  render: function(f) {
    var kids = [];

    // Обложка: градиентный квадрат с мёртвой волной.
    var art = { type: 'container', width: 440, height: 440, borderRadius: 24,
      gradient: { colors: ['#2b2150', '#12101f'], begin: 'topLeft', end: 'bottomRight' },
      borderColor: '#3a3160', borderWidth: 1.5,
      shadow: { color: '#558b5cf6', blur: 50 },
      child: { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center', spacing: 30, children: [
        waveRow(36, 6, 120, function(i) { return 0.06 + rnd(i * 2.7) * 0.16 + (i === 17 ? 0.12 : 0); }, '#6d6399', 6),
        cap('DEMO · 2019', C.violetL, 34),
        cap('НИКТО НЕ СЛУШАЛ', C.dim, 22),
      ] } };

    var phone = panel(680, 1250, {
      type: 'column', crossAxisAlignment: 'center', mainAxisAlignment: 'spaceEvenly',
      children: [
        { type: 'container', width: 180, height: 34, borderRadius: 17, color: '#000000' },
        T('3:07', 40, C.muted, { style: { fontFamily: F.bold } }),
        art,
        { type: 'column', crossAxisAlignment: 'center', spacing: 10, children: [
          T('мой_рэп_final(7).mp3', 36, C.white),
          cap('0 ПРОСЛУШИВАНИЙ', C.dim, 24),
        ] },
        { type: 'column', crossAxisAlignment: 'center', spacing: 12, children: [
          { type: 'row', children: [
            { type: 'rect', width: 28, height: 6, fill: C.amber, radius: 3 },
            { type: 'rect', width: 532, height: 6, fill: '#232a45', radius: 3 },
          ] },
          { type: 'row', mainAxisAlignment: 'spaceBetween', width: 560, children: [
            T('0:12', 24, C.amber, { style: { fontFamily: F.bold } }),
            T('3:47', 24, C.dim, { style: { fontFamily: F.bold } }),
          ] },
        ] },
        { type: 'row', mainAxisAlignment: 'center', spacing: 70, children: [
          T('«', 54, C.muted),
          { type: 'container', width: 110, height: 110, borderRadius: 55,
            borderColor: C.amber, borderWidth: 2.5, color: '#12fbbf24',
            shadow: { color: '#44fbbf24', blur: 30 },
            child: { type: 'polygon', points: [42, 30, 42, 80, 82, 55], fill: C.amber,
              alignment: 'center' } },
          T('»', 54, C.muted),
        ] },
        { type: 'column', crossAxisAlignment: 'end', spacing: 12, width: 560, children: [
          { type: 'container', padding: 24, borderRadius: 26, color: '#1a2138',
            child: T('ну как тебе? только честно', 30, C.white, { style: { fontFamily: F.reg } }) },
          cap('ПРОЧИТАНО · ОТВЕТА НЕТ', C.amber, 22),
        ] },
      ],
    }, { padding: 26, borderRadius: 70, color: '#0a0d18' });

    // Медленный наезд на телефон.
    var wrap = at(phone, 540, 1080);
    wrap.scale = 0.98 + 0.09 * seg(f, 0, 190);
    kids.push(wrap);

    // Тёплая пыль вокруг экрана.
    for (var i = 0; i < 10; i++) {
      kids.push({ type: 'circle', size: 3 + rnd(i) * 5, fill: C.amber,
        opacity: 0.10 + 0.2 * rnd(i + Math.floor(f / 10)),
        positioned: { left: Math.round(60 + rnd(i * 7.1) * 960),
          top: Math.round((rnd(i * 3.3) * 1500 + 400 - f * 0.6) % 1500 + 200) } });
    }

    var all = [sceneIn(f, { type: 'stack', fit: 'expand', children: kids })];
    all.push(lyric(f, [
      [ { t: 'Помню,' }, { t: 'показывал' }, { t: 'свой', c: C.amber }, { t: 'рэп,', c: C.amber, g: C.amber } ],
      [ { t: 'и' }, { t: 'ты' }, { t: 'меня' }, { t: 'оценивал' } ],
    ], { line: 3, size: 60 }));
    all = all.concat(glitchBars(f, C.amber, 4));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
