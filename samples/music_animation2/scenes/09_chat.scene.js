// Сцена 9 (1380–1500 · 4:00): пустой чат в мессенджере. Сообщения не доставлены —
// красные восклицательные знаки. Строка: «Ты не скучаешь — а я до сих пор не забил,»
scene = {
  id: 'chat',
  duration: 120,
  from: 1380,
  description: 'Мессенджер на тёмном экране: диалог с «Мила», три серых сообщения («привет», «ты где?», «мил?»), каждое через секунду получает красный кружок с «!» — не доставлено. Внизу мелькнёт «печатает...» и пропадёт. Свет экрана — единственный в тёмной комнате.',
  voicePrompts: { ru: 'Ты не скучаешь — а я до сих пор не забил.' },
  timeline: { label: '09 · Недоставлено', color: '#7dd3fc', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#030408' });
    // тёмная комната: единственный свет — от экрана (радиальное пятно снизу)
    kids.push(at({ type: 'container', width: 1400, height: 1000,
      gradient: { type: 'radial', colors: [AA(C.ice, '2a'), '#00000000'],
        stops: [0, 1], radius: 0.5 }, opacity: 0.55 + 0.1 * pulse(f, 0.5) }, 540, 1250));
    kids.push(vignette(1));

    // шапка чата
    var header = panel(900, 120, row([
      { type: 'container', width: 76, height: 76, borderRadius: 38,
        color: '#141b30', borderColor: AA(C.ice, '44'), borderWidth: 1.5,
        child: at(svgPathNode('M 38 20 C 30 20 24 26 24 34 L 24 44 C 24 55 31 62 41 62 L 51 62 C 58 62 63 58 63 53 L 53 42 L 43 50 C 38 45 34 40 30 33 L 38 23 Z',
          76, 76, C.ice, 2.6), 38, 38) },
      column([
        cap('МИЛА', C.white, 26),
        { type: 'text', text: 'была недавно', textAlign: 'center',
          style: { fontFamily: F.reg, fontSize: 21, color: C.dim, letterSpacing: 0 } },
      ], { gap: 4 }),
      cap('ОНЛАЙН', C.dim, 18),
    ], { gap: 22, main: 'spaceBetween', cross: 'center' }),
      { color: AA('#0a0f1e', 'f0'), borderRadius: 30, padding: 20, borderColor: AA(C.ice, '2a') });
    kids.push(at(header, 540, 560));

    // сообщения: серые пузыри, по очереди получают красный «!»
    var msgs = [
      { t: 'привет', y: 700, at: 14 },
      { t: 'ты где?', y: 830, at: 42 },
      { t: 'мил?', y: 960, at: 70 },
    ];
    for (var i = 0; i < msgs.length; i++) {
      var msg = msgs[i];
      var p = eoBack(seg(f, msg.at, msg.at + 14));
      var bubble = panel(240 + msg.t.length * 14, 92,
        { type: 'text', text: msg.t, textAlign: 'center',
          style: { fontFamily: F.reg, fontSize: 30, color: C.muted, letterSpacing: 0 } },
        { color: '#131828', borderRadius: 26, padding: 18, borderColor: C.line, borderWidth: 1 });
      var bwrap = at(bubble, 700, msg.y);
      bwrap.scale = 0.7 + 0.3 * p;
      bwrap.opacity = seg(f, msg.at, msg.at + 6);
      kids.push(bwrap);
      // красный «!» не доставки
      var exF = msg.at + 24;
      var ep = eoBack(seg(f, exF, exF + 12));
      if (f >= exF) {
        kids.push(at({ type: 'container', width: 46, height: 46, borderRadius: 23,
          color: C.red, opacity: 0.92 * seg(f, exF, exF + 5),
          child: { type: 'text', text: '!', textAlign: 'center',
            style: { fontFamily: F.black, fontSize: 30, color: '#ffffff', letterSpacing: 0 } },
          scale: 0.5 + 0.5 * ep }, 920, msg.y + 34));
      }
    }
    // подпись «не доставлено»
    kids.push(atC(cap('СООБЩЕНИЯ НЕ ДОСТАВЛЕНЫ', C.red, 22), 540, 1080, 900));

    // «печатает...» мелькает и гаснет
    var typingVis = seg(f, 88, 98) * (1 - seg(f, 104, 118));
    if (typingVis > 0) {
      kids.push(at(row([
        { type: 'circle', size: 10, fill: C.ice, opacity: 0.4 + 0.6 * pulse(f, 1) },
        { type: 'circle', size: 10, fill: C.ice, opacity: 0.4 + 0.6 * pulse(f - 6, 1) },
        { type: 'circle', size: 10, fill: C.ice, opacity: 0.4 + 0.6 * pulse(f - 12, 1) },
        { type: 'text', text: 'печатает', textAlign: 'left',
          style: { fontFamily: F.reg, fontSize: 24, color: C.muted, letterSpacing: 0 } },
      ], { gap: 12 }), 620, 1140, 500));
      // при этом индикатор не доставки у последнего гаснет
    }

    // строка трека — караоке по транскрипту («Ты не скучаешь...» 240–24 c)
    kids.push(sung(f, 1380));

    var sh = shake(f, 1.8);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 104, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 24));
  },
};
