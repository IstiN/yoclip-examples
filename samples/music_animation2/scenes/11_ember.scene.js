// Сцена 11 (1860–2429 · 4:16 → финал): экран гаснет. Только тлеющий красный огонёк
// в центре, вокруг — последние искры. Полное затемнение к последнему кадру.
scene = {
  id: 'ember',
  duration: 539,
  from: 1860,
  description: 'Почти чёрный экран: маленький красный уголёк пульсирует всё медленнее и гаснет, вокруг поднимаются последние искры. Строка «Я до сих пор не забил!..» проявляется и медленно тает. Полное затемнение к последнему кадру.',
  voicePrompts: { ru: 'Я до сих пор не забил.' },
  timeline: { label: '11 · Уголёк', color: '#c1123f', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#020306' });
    kids.push(aura(540, 960, 500, C.redDeep, 0.3));

    // уголёк: пульс замедляется (растягиваем фазу по мере сцены)
    var slowF = f * lerp(1.0, 0.45, seg(f, 0, 480));
    var life = 1 - 0.75 * seg(f, 240, 510);
    var emberR = 26 + 10 * pulse(slowF, 1) * life;
    kids.push(at({ type: 'circle', size: emberR * 5, fill: '#00000000',
      gradient: { type: 'radial', colors: [AA(C.red, '55'), '#00000000'],
        stops: [0, 1], radius: 0.5 }, opacity: life }, 540, 960));
    kids.push(at({ type: 'circle', size: emberR, fill: C.red, opacity: life,
      shadow: { color: AA(C.red, 'cc'), blur: 50 } }, 540, 960));
    kids.push(at({ type: 'circle', size: emberR * 0.45, fill: '#ffd0d8',
      opacity: life * 0.9 }, 540, 960 - emberR * 0.1));

    // последние искры
    for (var i = 0; i < 9; i++) {
      var sxp = 540 + noise1(f * 0.02 + i * 9, i) * 160;
      var syp = (900 - ((f * (0.5 + rnd(i) * 0.9) + rnd(i * 7) * 800) % 900));
      kids.push({ type: 'circle', size: 2 + rnd(i * 3) * 2.5, fill: C.red,
        opacity: life * (0.1 + 0.4 * rnd(i + Math.floor(f / 18))),
        positioned: { left: Math.round(sxp), top: Math.round(syp) } });
    }

    // строка-финал — караоке по транскрипту («Я до сих пор не забил.» 4:06;
    // строка целиком поётся в сцене 10 — здесь остаётся только угасание)
    kids.push(sung(f, 1860));
    // маленькая подпись-точка
    kids.push(atC(cap('КОНЕЦ СВЯЗИ', C.dim, 20), 540, 1510, 600));

    // финальное затемнение
    var out = flash(f, 450, 82, '#000000', 1);
    if (out) kids.push(out);

    var all = { type: 'stack', fit: 'expand', children: kids };
    return finish(sceneIn(f, all, 30));
  },
};
