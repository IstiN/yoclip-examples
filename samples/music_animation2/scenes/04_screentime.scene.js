// Сцена 4 (330–450 · 3:25): виджет iOS «Экранное время». Столбики активности
// обрываются, счётчик «дней без звонков» растёт. Строка припева: «Ты не считаешь,
// сколько дней я тебе не звонил,»
scene = {
  id: 'screentime',
  duration: 120,
  from: 330,
  description: 'Карточка «Экраное время» на тёмно-синем фоне: 14 столбиков активности — первые дни высокие, последние обрываются в ноль; большой счётчик «Дней без звонков» накручивается 0→14 на словах трека. Столбики встают по одному с pop-анимацией, карточка дышит на бите.',
  voicePrompts: { ru: 'Ты не считаешь, сколько дней я тебе не звонил.' },
  timeline: { label: '04 · Экраное время', color: '#7dd3fc', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#04060f' });
    kids.push(aura(760, 420, 1000, C.ice, 0.34));
    kids.push(aura(220, 1500, 900, C.blue, 0.22));

    // сетка интерфейса
    for (var gy = 0; gy < 5; gy++) {
      kids.push({ type: 'container', width: 860, height: 1.5,
        positioned: { left: 110, top: 330 + gy * 210 }, color: AA(C.ice, '10') });
    }

    var days = 14;
    var counterT = seg(f, 50, 110);
    var shownDays = Math.round(counterT * days);
    var acts = [62, 55, 70, 48, 58, 40, 52, 34, 26, 14, 8, 4, 2, 0]; // активность тает

    // карточка виджета
    var bars = [];
    for (var i = 0; i < days; i++) {
      var st = 8 + i * 4;
      var p = eoBack(seg(f, st, st + 14));
      var last = i === days - 1;
      bars.push({ type: 'container', width: 40,
        height: Math.max(6, 190 * (acts[i] / 70) * p),
        borderRadius: 8,
        color: last ? AA(C.red, 'cc') : (acts[i] < 16 ? AA(C.dim, 'aa') : AA(C.ice, 'd0')) });
    }
    var chart = { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'end',
      spacing: 14, children: bars };

    var card = panel(860, 700, { type: 'column', crossAxisAlignment: 'start', spacing: 20,
      children: [
        row([ cap('ЭКРАНОЕ ВРЕМЯ', C.ice, 24),
          { type: 'container', width: 14, height: 14, borderRadius: 7,
            color: C.ice, opacity: 0.4 + 0.6 * pulse(f, 1) } ], { gap: 14 }),
        { type: 'text', text: shownDays + ' ' + plural(shownDays), textAlign: 'left',
          style: { fontFamily: F.black, fontSize: 96, color: C.white, letterSpacing: -2 } },
        cap('ДНЕЙ БЕЗ ЗВОНКОВ', C.muted, 22),
        chart,
        row([ cap('СЕН', C.dim, 20), { type: 'container', width: 560, height: 1.5, color: C.line },
          cap('ОКТ', C.dim, 20) ], { gap: 16 }),
      ] }, { color: AA('#0a1124', 'f2'), borderColor: AA(C.ice, '3a'),
        borderRadius: 44, padding: 44 });
    var cardWrap = at(card, 540, 850);
    cardWrap.scale = (0.96 + 0.05 * seg(f, 0, 40)) * (1 + 0.012 * pulse(f, 1));
    cardWrap.rotation = Math.sin(f * 0.008) * 0.8;
    kids.push(cardWrap);

    // пропущенный значок на УГЛУ карточки (iOS-стиль) — раньше висел на y=1620
    // и накладывался на строку караоке под карточкой
    kids.push(at({ type: 'container', width: 120, height: 120, borderRadius: 60,
      color: AA(C.red, 'e6'), borderColor: '#ffffff', borderWidth: 3,
      shadow: { color: '#88ff2d55', blur: 40 },
      child: { type: 'text', text: '14', textAlign: 'center',
        style: { fontFamily: F.black, fontSize: 56, color: '#ffffff', letterSpacing: -1 } },
      scale: 0.5 + 0.5 * eoBack(seg(f, 96, 112)),
      opacity: seg(f, 96, 102) }, 940, 520));

    // строка трека — караоке по транскрипту (припев: «Ты не считаешь...» 205–209 c)
    kids.push(sung(f, 330));

    var sh = shake(f, 2);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 106, 14, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 22));
  },
};

function plural(n) {
  var m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'день';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'дня';
  return 'дней';
}
