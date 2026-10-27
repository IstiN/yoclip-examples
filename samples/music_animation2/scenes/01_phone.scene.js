// Сцена 1 (0–60 · 3:14): тёмный экран смартфона. Всплывает стек «Пропущенные
// вызовы ОТ ОН» (заказчик: повествование от лица парня — он не может дозвониться
// ЕЙ, она не берёт трубку), красное «Не беспокоить». Медленный зум. Строка:
// «И дальше всё в том же духе...» — поёт с 0-го кадра (194.0 c трека).
scene = {
  id: 'phone',
  duration: 60,
  from: 0,
  description: 'Тёмный локскрин телефона: часы 23:47, пилюля «Не беспокоить», стек уведомлений о пропущенных вызовах ОТ ОН (12 за вечер — он не может дозвониться, она не берёт трубку). Медленный зум в экран, дыхание подсветки на бите.',
  voicePrompts: { ru: 'И дальше всё в том же духе... До конца не слушай:' },
  timeline: { label: '01 · Пропущенный вызов', color: '#7dd3fc', lane: 'video' },
  render: function(f) {
    var zoom = 1.0 + 0.10 * seg(f, 0, 60); // медленный зум
    var kids = [];

    // экран блокировки (внутренний экран 544x1124)
    var lock = { type: 'stack', children: [
      statusBar(544, f),
      // часы и дата
      atC({ type: 'text', text: '23:47', textAlign: 'center',
        style: { fontFamily: F.reg, fontSize: 100, color: C.white, letterSpacing: 2 } }, 272, 216, 544),
      atC(cap('СРЕДА, 28 ОКТЯБРЯ', C.muted, 21), 272, 330, 544),
      // пилюля «Не беспокоить»
      at({ type: 'container', width: 352, height: 68,
        scale: 0.7 + 0.3 * eoBack(seg(f, 12, 30)),
        child: panel(352, 68, row([
          moonIcon(32),
          cap('НЕ БЕСПОКОИТЬ', C.ice, 21),
        ], { gap: 14 }), { color: AA(C.red, '2e'), borderColor: AA(C.red, '77'),
          borderRadius: 34, padding: 16 }) }, 272, 424),
      // уведомления о пропущенных: он звонил ей много раз — она не берёт трубку
      notifCall(f, 6, 'ОН', 'Пропущенные вызовы (12)', 'мобильный · последний 23:45', 12, 1),
      notifCall(f, 20, 'ОН', 'Пропущенный вызов', 'мобильный · 23:41', 1, 2),
      notifCall(f, 34, 'ОН', 'Ещё 10 пропущенных', 'мобильный · с 22:30', null, 3),
      // домашняя полоска
      at({ type: 'container', width: 130, height: 5, borderRadius: 3, color: C.dim }, 272, 1080),
    ] };

    var ph = phoneShell(560, 1140, lock, { radius: 68 });
    var phWrap = at(ph, 540, 930);
    phWrap.scale = zoom;
    phWrap.rotation = Math.sin(f * 0.006) * 1.2;
    kids.push(phWrap);

    // блик, идущий по стеклу каждые ~4 такта
    var sweepT = ((f - 200) % (BAR * 4)) / 300;
    if (sweepT > 0 && sweepT < 1) {
      kids.push(at({ type: 'container', width: 220, height: 1400, rotation: 14,
        gradient: { colors: ['#00000000', '#ffffff', '#00000000'], stops: [0, 0.5, 1] },
        opacity: 0.05 + 0.05 * Math.sin(sweepT * Math.PI) }, 200 + sweepT * 900, 900));
    }

    // строка трека — караоке по транскрипту («И дальше...» поёт с 0-го кадра)
    kids.push(sung(f, 0));

    var sh = shake(f, 2.5);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 52, 8, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 26));
  },
};

// полумесяц — иконка «не беспокоить»
function moonIcon(size) {
  var r = size / 2;
  var d = 'M ' + (r + r * 0.55) + ' ' + (r - r * 0.72) +
    ' A ' + (r * 0.78) + ' ' + (r * 0.78) + ' 0 1 1 ' + (r + r * 0.28) + ' ' + (r + r * 0.8) +
    ' A ' + (r * 0.92) + ' ' + (r * 0.92) + ' 0 0 0 ' + (r + r * 0.55) + ' ' + (r - r * 0.72) + ' Z';
  return { type: 'container', width: size, height: size,
    child: svgPathNode(d, size, size, C.ice, 2.6) };
}

// карточка уведомления о пропущенном вызове; idx — слот на экране (1..n)
function notifCall(f, startF, name, title, sub, badge, idx) {
  var p = eoBack(seg(f, startF, startF + 16));
  var yEnd = 500 + (idx - 1) * 176;
  var dy = (1 - eo3(seg(f, startF, startF + 18))) * (-660);
  var icon = at({ type: 'container', width: 64, height: 64, borderRadius: 16,
    color: AA(C.red, '33'), borderColor: AA(C.red, '88'), borderWidth: 1.5,
    child: at(svgPathNode('M 32 12 C 26 12 22 16 22 22 L 22 30 C 22 42 30 50 42 50 L 48 50 C 54 50 58 46 58 40 L 50 34 L 40 40 C 36 36 32 32 28 26 L 34 16 Z',
      64, 64, C.red, 3), 32, 32) }, 46, 46);
  var cardKids = [
    { type: 'column', crossAxisAlignment: 'start', spacing: 7, children: [
      cap(name, C.muted, 19),
      { type: 'text', text: title, textAlign: 'left',
        style: { fontFamily: F.bold, fontSize: 25, color: C.white, letterSpacing: -0.5 } },
      { type: 'text', text: sub, textAlign: 'left',
        style: { fontFamily: F.reg, fontSize: 20, color: C.muted, letterSpacing: 0 } },
    ] },
    icon,
  ];
  if (badge != null) cardKids.push(at({ type: 'container', width: 30, height: 30, borderRadius: 15,
    color: C.red, opacity: seg(f, startF + 20, startF + 26),
    child: { type: 'text', text: String(badge), textAlign: 'center',
      style: { fontFamily: F.bold, fontSize: 19, color: '#ffffff', letterSpacing: 0 } } }, 60, 32));
  var card = panel(492, 156, { type: 'stack', children: cardKids },
    { borderRadius: 34, padding: 20, color: AA('#0d1326', 'ee'),
      borderColor: AA(C.ice, '2e') });
  return { type: 'container', width: 492, height: 156,
    positioned: { left: Math.round((544 - 492) / 2), top: yEnd },
    opacity: seg(f, startF, startF + 6), scale: 0.92 + 0.08 * p,
    child: card, offsetY: dy };
}
