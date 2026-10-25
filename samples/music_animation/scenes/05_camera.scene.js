// 05 · «А что сейчас? Ты пишешь мне и фотку мою просишь» — фронталка в темноте.
// Размытый силуэт, ловящий фокус квадрат, входящее сообщение и вспышка на «фотку».
scene = {
  id: 's5',
  duration: 104,
  from: 312,
  timeline: { label: 'Фронталка', color: '#22d3ee', lane: 'video' },
  render: function(f) {
    var FLASH = 89; // «фотку» по alignment: 13.20с -> кадр 84 + вход
    var sh = shake(f, f > FLASH ? Math.max(0, 12 - (f - FLASH)) : 0);
    var kids = [];

    kids.push(at({ type: 'image', source: 'external:silhouette', width: 820, height: 1025,
      blur: 15, opacity: 0.95, scale: 1.02 + 0.06 * seg(f, 0, 190) }, 540, 1120));

    // Рамки видоискателя.
    var vf = svgOpen(1000, 1440);
    var corners = [[30, 30, 1, 1], [970, 30, -1, 1], [30, 1410, 1, -1], [970, 1410, -1, -1]];
    for (var i = 0; i < 4; i++) {
      var c = corners[i];
      vf += '<path d="M' + (c[0] + c[2] * 90) + ' ' + c[1] + ' L' + c[0] + ' ' + c[1] + ' L' + c[0] + ' ' + (c[1] + c[3] * 90) +
        '" stroke="#ffffff" stroke-opacity="0.55" stroke-width="4" fill="none" stroke-linecap="round"/>';
    }
    vf += '</svg>';
    kids.push(at(svg(vf, 1000, 1440), 540, 1100));

    // Фокус «охотится», после вспышки — зелёный и зафиксирован.
    var locked = f > FLASH + 6;
    var focusScale = locked ? 1 : 1.15 + Math.sin(f * 0.35) * 0.12;
    kids.push(at({ type: 'container', width: 250, height: 250,
      borderColor: locked ? C.green : C.amber, borderWidth: 3,
      opacity: locked ? 0.95 : 0.45 + 0.3 * Math.sin(f * 0.5), scale: focusScale,
    }, 540, 790));
    if (locked) kids.push(fullW(cap('AF · ЗАФИКСИРОВАНО', C.green, 24), 960));

    // Верхняя строка камеры.
    kids.push(fullW({ type: 'row', mainAxisAlignment: 'center', spacing: 26, children: [
      cap('ФРОНТАЛЬНАЯ КАМЕРА', C.muted, 26),
      { type: 'container', padding: { left: 16, right: 16, top: 6, bottom: 6 }, borderRadius: 10,
        borderColor: C.stroke, borderWidth: 1.5, child: T('1x', 26, C.white) },
      { type: 'circle', size: 12, fill: C.red, opacity: f % 20 < 12 ? 1 : 0.25 },
    ] }, 560));

    // Входящее сообщение — «ты пишешь мне».
    var dmIn = eoBack(seg(f, 44, 68));
    var dm = panel(920, 170, { type: 'row', crossAxisAlignment: 'center', spacing: 26, children: [
      { type: 'container', width: 86, height: 86, borderRadius: 43,
        gradient: { colors: ['#8b5cf6', '#22d3ee'] },
        child: T('?', 46, C.white, { alignment: 'center' }) },
      { type: 'column', crossAxisAlignment: 'start', spacing: 8, children: [
        cap('НЕИЗВЕСТНЫЙ · СЕЙЧАС', C.cyan, 22),
        T('привет! а можно с тобой фото?', 34, C.white),
      ] },
    ] }, { padding: 26, borderColor: '#1e4a5a' });
    var dmWrap = at(dm, 540, 1460 + (1 - dmIn) * 260);
    dmWrap.opacity = seg(f, 44, 54);
    kids.push(dmWrap);

    // Затвор снизу.
    kids.push(at({ type: 'container', width: 130, height: 130, borderRadius: 65,
      borderColor: C.white, borderWidth: 5, opacity: 0.85,
      child: { type: 'circle', size: 92, fill: f > FLASH - 4 && f < FLASH + 4 ? C.white : '#22ffffff', alignment: 'center' },
    }, 540, 1660));
    if (f > FLASH + 8) kids.push(fullW(cap('СОХРАНЕНО · IMG_2041.HEIC', C.cyan, 26), 1740));

    var main = { type: 'stack', fit: 'expand', children: kids };
    main.offsetX = sh.x; main.offsetY = sh.y;
    var all = [sceneIn(f, main)];

    all.push(lyric(f, [
      [ { t: 'А' }, { t: 'что' }, { t: 'сейчас?' }, { t: 'Ты' }, { t: 'пишешь' }, { t: 'мне' } ],
      [ { t: 'и' }, { t: 'фотку', c: C.cyan, g: C.cyan }, { t: 'мою' }, { t: 'просишь' } ],
    ], { line: 4, size: 58, rgb: function(fr) { return fr > FLASH - 3 && fr < FLASH + 14; } }));

    pushIf(all, flash(f, FLASH, 10, '#ffffff', 0.95));
    all = all.concat(glitchBars(f, C.cyan, 5));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
