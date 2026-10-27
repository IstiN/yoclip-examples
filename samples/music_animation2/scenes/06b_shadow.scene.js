// Сцена 6b (750–930 · 3:39): «Если только бы встретил / И если хватило бы сил.»
// Его ТЕНЬ на стене — одинокая фигура, рука медленно поднимается и на «сил.»
// кулак сжимается: вспышка, глитч, дрожь. Повествование от лица парня — бессилие
// и злость, никакой «её» рядом.
scene = {
  id: 'shadow',
  duration: 180,
  from: 750,
  description: 'Тёмная стена, на неё из-за кадра падает тень ОДНОГО человека (парня): голова, плечи, рука медленно поднимается сбоку. Слева багровый неон, справа снизу — холодный отсвет телефона. На слове «сил.» кулак сжимается: вспышка на багровом, глитч-сдвиг, дрожь камеры. Медленный наезд.',
  voicePrompts: { ru: 'Если только бы встретил — и если хватило бы сил.' },
  timeline: { label: '06b · Тень', color: '#c1123f', lane: 'video' },
  render: function(f) {
    var kids = [];
    var zoom = 1.0 + 0.09 * seg(f, 0, 180);
    var punch = MT.hit(f, 1); // кик на сильных онсетах

    kids.push({ type: 'absolute_fill', color: '#040409' });
    // стена: заметный вертикальный градиент (посветлее — тень должна читаться)
    kids.push({ type: 'container', width: W, height: H,
      gradient: { colors: ['#141829', '#0b0d18'], stops: [0, 1], begin: 'topCenter', end: 'bottomCenter' } });
    // багровый неон слева (растёт ко второй строке)
    kids.push({ type: 'container', width: 760, height: H * 1.2,
      positioned: { left: -440, top: -80 },
      gradient: { type: 'radial', colors: [AA(C.red, '6e'), AA(C.redDeep, '2a'), '#00000000'],
        stops: [0, 0.5, 1], radius: 0.55 },
      opacity: 0.45 + 0.4 * seg(f, 60, 150) + 0.16 * punch, blur: 4 });
    // холодный отсвет телефона справа снизу (он в другой руке)
    kids.push(at({ type: 'container', width: 520, height: 620,
      gradient: { type: 'radial', colors: [AA(C.ice, '36'), '#00000000'],
        stops: [0, 1], radius: 0.5 }, opacity: 0.62 + 0.15 * pulse(f, 0.7) }, 880, 1560));
    // ореол ЗА фигурой — тёмный силуэт читается на светлом пятне
    kids.push(aura(740, 980, 980, C.red, 0.5));

    // ТЕНЬ: размытая фигура; рука поднимается на 20–90, кулак сжимается на 60–90
    // (пивот — плечо S: позиция руки/кулака считается по углу, без anchor)
    var S = { x: 740, y: 850 };
    var armR = 20 + 150 * eo3(seg(f, 20, 90)); // 20° = опущена, 170° = поднята
    var th = armR * Math.PI / 180;
    var dirx = Math.sin(th), diry = Math.cos(th); // 0° -> вниз, 180° -> вверх
    var fist = 1 + 0.28 * eoBack(seg(f, 60, 92)); // сжатие кулака на «сил.»
    var fig = { type: 'stack', children: [
      // голова + плечи (размыто, без лица); фигура темнее стены = контур читается
      { type: 'circle', size: 190, fill: '#04050b',
        positioned: { left: Math.round(445 + Math.sin(f * 0.009) * 8), top: 620 } },
      { type: 'container', width: 420, height: 520, borderRadius: 150,
        color: '#05060d', positioned: { left: 330, top: 780 } },
      // предплечье: центр на половине длины от плеча вдоль направления
      { type: 'container', width: 90, height: 290, borderRadius: 45,
        color: '#04050b', rotation: armR,
        positioned: { left: Math.round(S.x + dirx * 145 - 45),
          top: Math.round(S.y + diry * 145 - 145) } },
      // кулак на конце руки
      { type: 'circle', size: 74 * fist, fill: '#04050b',
        positioned: { left: Math.round(S.x + dirx * (290 + 26 * fist) - 37 * fist),
          top: Math.round(S.y + diry * (290 + 26 * fist) - 37 * fist) } },
    ], blur: 10 };
    kids.push(fig);
    // жёсткий контур-блик тени на такт (тень «дёргается» от неона)
    if (punch > 0.5) {
      kids.push({ type: 'stack', children: [
        { type: 'circle', size: 190, fill: '#00000000',
          positioned: { left: Math.round(445), top: 620 } },
      ], blur: 2, opacity: 0.25 * punch });
    }

    // пыль в луче неона
    for (var i = 0; i < 16; i++) {
      var dx = (rnd(i * 5.1) * W + Math.sin(f * 0.008 + i * 2) * 26);
      var dy = (rnd(i * 9.3) * H + f * (0.14 + rnd(i) * 0.28)) % H;
      kids.push({ type: 'circle', size: 2 + rnd(i * 11) * 3,
        fill: i % 3 ? AA(C.red, 'aa') : AA(C.ice, 'aa'),
        opacity: 0.08 + 0.2 * rnd(i + Math.floor(f / 14)),
        positioned: { left: Math.round(dx), top: Math.round(H - dy) } });
    }

    // вспышка + глитч на сжатии кулака («...хватило бы сил.»)
    var cl = flash(f, 62, 12, AA(C.red, 'ff'), 0.4);
    if (cl) kids.push(cl);
    if (f >= 62 && f < 84) {
      kids = kids.concat(glitchBars(f, C.red, 9));
    }

    // строка трека — караоке («Если только бы встретил» 219 c / «И если хватило бы сил.» 221 c)
    kids.push(sung(f, 750));

    var sh = shake(f, 2 + 3 * seg(f, 62, 92));
    var all = { type: 'stack', fit: 'expand', children: kids,
      offsetX: sh.x + glitchShift(f, 9).x, offsetY: sh.y + glitchShift(f, 9).y,
      scale: zoom };
    var out = flash(f, 164, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 20));
  },
};
