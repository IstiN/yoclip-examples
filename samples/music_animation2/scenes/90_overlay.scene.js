// Оверлей на весь клип: плёнка (зерно + сканлайны из grade-картинок), виньетка,
// холодный тинт (единая цветокоррекция), ненавязчивый водяной знак yoclip.studio,
// вход из чёрного и финальное затемнение.
scene = {
  id: 'overlay',
  duration: 2429,
  from: 0,
  timeline: { label: 'Плёнка', color: '#3a3f5c', lane: 'video' },
  render: function(f) {
    var kids = [
      // зерно: 3 кадра шума, цикл каждые 3 кадра; прозрачность низкая —
      // раньше 0.85 стробили весь кадр («моргание»), теперь это едва заметная плёнка
      { type: 'image', source: 'external:grade' + (Math.floor(f / 3) % 3), fit: 'cover',
        width: W, height: H, positioned: { left: 0, top: 0 }, opacity: 0.3 },
      // виньетка
      vignette(0.9),
      // холодный тинт поверх всего (глубокие тени, синий оттенок)
      { type: 'container', width: W, height: H,
        gradient: { colors: [AA(C.blue, '10'), '#00000000', AA(C.violet, '0c')],
          stops: [0, 0.45, 1], begin: 'topCenter', end: 'bottomCenter' } },
      // водяной знак — подпись студии, едва заметная, тлеет очень медленно
      { type: 'text', text: 'yoclip.studio', textAlign: 'left',
        positioned: { left: 40, top: H - 64 },
        style: { fontFamily: F.reg, fontSize: 26, color: C.ice, letterSpacing: 5 },
        opacity: (0.12 + 0.05 * (0.5 + 0.5 * Math.sin(f * 0.01))) * seg(f, 24, 60) },
    ];
    if (f < 16) kids.push({ type: 'absolute_fill', color: '#000000', opacity: 1 - seg(f, 0, 16) });
    // финал: трек уходит в тишину с ~269.3 c (кадр клипа 2290) — с неё и гасим
    if (f > 2290) kids.push({ type: 'absolute_fill', color: '#000000', opacity: seg(f, 2290, 2456) });
    return finish({ type: 'stack', fit: 'expand', children: kids });
  },
};
