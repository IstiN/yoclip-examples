// Сцена 5 (450–630 · 3:29): два смартфона экранами вверх на тёмном столе. На обоих —
// «Нет ответа» и крутится индикатор. Строка: «Не отвечаешь ни в одной из своих
// двух мобил»
scene = {
  id: 'phones',
  duration: 180,
  from: 450,
  description: 'Два телефона лежат рядом на тёмном столе, экраны светятся холодным синим: аватар «Мила», статус «Нет ответа», вращающиеся спиннеры вызова. Экраны чуть мерцают, свет отражается на столе. Он звонит — она не берёт (повествование от лица парня).',
  voicePrompts: { ru: 'Не отвечаешь ни по одной из своих двух мобил.' },
  timeline: { label: '05 · Две мобилы', color: '#7dd3fc', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#030409' });
    kids.push(aura(540, 260, 1300, C.ice, 0.26));
    kids.push(aura(880, 1650, 800, C.blue, 0.14));

    // стол: горизонтальный градиент + отражения экранов
    kids.push({ type: 'container', width: W, height: 700,
      positioned: { left: 0, top: 1220 },
      gradient: { colors: ['#00000000', '#0a0f1f', '#05070f'], stops: [0, 0.35, 1] } });
    kids.push({ type: 'container', width: 420, height: 300, borderRadius: 999,
      positioned: { left: 110, top: 1400 }, color: AA(C.ice, '0e'), blur: 24,
      opacity: 0.5 + 0.2 * pulse(f, 0.6) });
    kids.push({ type: 'container', width: 420, height: 300, borderRadius: 999,
      positioned: { left: 550, top: 1400 }, color: AA(C.ice, '0e'), blur: 24,
      opacity: 0.5 + 0.2 * pulse(f, 0.6) });

    // два телефона
    var ph1 = callPhone(f, 'МИЛА', 0);
    var ph2 = callPhone(f, 'ДОМ', 1);
    var w1 = at(ph1, 330, 900); w1.rotation = -4.5;
    var w2 = at(ph2, 750, 900); w2.rotation = 4;
    w1.scale = 0.9 + 0.1 * seg(f, 0, 50);
    w2.scale = 0.9 + 0.1 * seg(f, 0, 50);
    kids.push(w1); kids.push(w2);

    // строка трека — караоке по транскрипту («Не отвечаешь...» 209–215 c)
    kids.push(sung(f, 450));

    var sh = shake(f, 1.6);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 164, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 26));
  },
};

// телефон с экраном исходящего вызова «Нет ответа»
function callPhone(f, name, idx) {
  var flicker = 0.9 + 0.1 * noise1(f * 0.35, idx * 7 + 2);
  var screen = { type: 'stack', children: [
    { type: 'container', width: 384, height: 904,
      gradient: { type: 'radial', colors: ['#0d1830', '#070d1c', '#050810'],
        stops: [0, 0.55, 1], radius: 0.9 }, opacity: flicker },
    statusBar(384, f),
    at({ type: 'container', width: 132, height: 132, borderRadius: 66,
      color: '#141b30', borderColor: AA(C.ice, '55'), borderWidth: 2,
      child: at(svgPathNode('M 66 34 C 52 34 42 44 42 58 L 42 74 C 42 92 54 104 72 104 L 88 104 C 100 104 108 96 108 86 L 92 70 L 74 82 C 66 74 60 66 54 56 L 66 40 Z',
        132, 132, C.ice, 4), 66, 66) }, 192, 260),
    atC(cap(name, C.muted, 26), 200, 350, 384),
    atC(glowText('Нет ответа', 44, C.white, C.ice, 18), 200, 408, 384),
    atC({ type: 'text', text: 'вызов завершён', textAlign: 'center',
      style: { fontFamily: F.reg, fontSize: 24, color: C.dim, letterSpacing: 0 } }, 200, 466, 384),
    at(spinner(74, C.ice, f + idx * 40, { speed: 8 }), 200, 600),
    // красная трубка снизу
    at({ type: 'container', width: 96, height: 96, borderRadius: 48,
      color: AA(C.red, 'dd'), opacity: 0.9,
      child: at(svgPathNode('M 48 26 C 42 26 38 30 38 35 L 38 42 C 38 52 44 58 54 58 L 60 58 C 65 58 68 55 68 51 L 58 43 L 50 49 C 46 45 43 41 40 35 L 46 28 Z',
        96, 96, '#ffffff', 4), 48, 48) }, 200, 780),
  ] };
  return phoneShell(416, 936, screen, { radius: 62 });
}
