// Сцена 7 (930–1230 · 3:45): ПРИПЕВ. Динамичный глитч-монтаж: каждый такт — жёсткая
// смена кадра (виджет экранного времени <-> телефон «Нет ответа»), RGB-сплит,
// глитч-полосы, панч камеры на резах. Строки: «Но ты не считаешь... / Не отвечаешь...»
scene = {
  id: 'chorus',
  duration: 300,
  from: 930,
  description: 'Припев — быстрый монтаж на такт: кадры виджета «14 дней» и телефона «Нет ответа» чередуются резкими резами с глитч-полосами, RGB-рассинхроном и панчем зума. Текст припева крупно поверх, ключевые слова с красным свечением.',
  voicePrompts: { ru: 'Но ты не считаешь, сколько дней я тебе не звонил. Не отвечаешь ни по одной из своих двух мобил.' },
  timeline: { label: '07 · Припев (глитч)', color: '#8b5cf6', lane: 'video' },
  render: function(f) {
    var kids = [];
    var k = Math.floor(f / BAR);
    var variant = ((k % 2) + 2) % 2;
    var accents = [C.ice, C.violet, C.red, C.blue];
    var acc = accents[((k % 4) + 4) % 4];
    var since = f - k * BAR;
    var punch = 1 + 0.09 * Math.exp(-3 * since / BEAT);

    kids.push({ type: 'absolute_fill', color: '#04050c' });
    kids.push(aura(540, 800, 1500, acc, 0.3));

    if (variant === 0) kids.push(miniWidget(f, acc));
    else kids.push(miniPhone(f, acc));

    // глитч-полосы и рваные цветные плашки на бит
    kids = kids.concat(glitchBars(f, acc, 7));
    if (glitchOn(f, 7)) {
      kids.push({ type: 'container', width: W, height: 200,
        positioned: { left: Math.round(noise1(f * 2, 3) * 60), top: Math.round(400 + rnd(f) * 900) },
        color: AA(rnd(f * 3) > 0.5 ? C.red : C.ice, '20'), blur: 2 });
    }

    // текст припева — караоке по транскрипту (припев 4: «Но ты не считаешь...» 225–235 c)
    kids.push(sung(f, 930));

    var sh = shake(f, 7);
    var all = { type: 'stack', fit: 'expand', children: kids,
      offsetX: sh.x + glitchShift(f, 7).x, offsetY: sh.y + glitchShift(f, 7).y,
      scale: punch };
    // редкий инверт-строб на резах
    if (since < 2 && k > 0 && k % 3 === 0) {
      all.children.push({ type: 'absolute_fill', color: AA(acc, 'cc'), opacity: 0.35 });
    }
    var out = flash(f, 284, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 12));
  },
};

// компактный виджет «Экраное время»
function miniWidget(f, acc) {
  var bars = [];
  var acts = [70, 58, 66, 44, 52, 30, 20, 10, 4, 0];
  for (var i = 0; i < acts.length; i++) {
    bars.push({ type: 'container', width: 40,
      height: Math.max(5, 200 * (acts[i] / 70) * eoBack(seg(f, 8 + i * 4, 12 + i * 4))),
      borderRadius: 7, color: acts[i] < 12 ? AA(C.red, 'cc') : AA(acc, 'd0') });
  }
  var card = panel(780, 500, column([
    row([ cap('ЭКРАНОЕ ВРЕМЯ', acc, 22),
      { type: 'text', text: '14 дней', textAlign: 'right',
        style: { fontFamily: F.black, fontSize: 44, color: C.white, letterSpacing: -1 } } ],
      { main: 'spaceBetween', cross: 'center' }),
    { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'end', spacing: 12,
      children: bars },
    cap('ДНЕЙ БЕЗ ЗВОНКОВ', C.muted, 20),
  ], { gap: 22, cross: 'stretch' }), { color: AA('#0a1124', 'ee'), borderColor: AA(acc, '44'),
    borderRadius: 40, padding: 40 });
  var wrap = at(card, 540, 640);
  wrap.rotation = Math.sin(f * 0.02) * 1.5 + glitchShift(f, 3).x * 0.2;
  return wrap;
}

// компактный телефон «Нет ответа»
function miniPhone(f, acc) {
  var screen = { type: 'stack', children: [
    { type: 'container', width: 340, height: 620,
      gradient: { type: 'radial', colors: ['#0d1830', '#050810'], stops: [0, 1], radius: 0.9 } },
    atC(cap('МИЛА', C.muted, 24), 178, 170, 340),
    atC(glowText('Нет ответа', 40, C.white, acc, 16), 178, 226, 340),
    at(spinner(64, acc, f, { speed: 10 }), 178, 340),
    at({ type: 'container', width: 84, height: 84, borderRadius: 42,
      color: AA(C.red, 'dd'),
      child: at(svgPathNode('M 42 22 C 37 22 33 26 33 31 L 33 37 C 33 45 38 50 46 50 L 52 50 C 56 50 59 47 59 44 L 50 37 L 43 42 C 40 39 37 35 34 30 L 39 24 Z',
        84, 84, '#ffffff', 3.4), 42, 42) }, 178, 500),
  ] };
  var ph = at(phoneShell(372, 664, screen, { radius: 54 }), 540, 660);
  ph.rotation = Math.sin(f * 0.03) * 2 + glitchShift(f, 5).y * 0.3;
  return ph;
}
