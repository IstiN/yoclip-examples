// Фон на весь клип: глубокая темнота, две медленные ауры (акцент меняется от
// сцены к сцене), пыль, дыхание на бит. Единая «цветокоррекция» всех сцен.
scene = {
  id: 'bg',
  duration: 2429,
  from: 0,
  timeline: { label: 'Фон', color: '#12172e', lane: 'video' },
  render: function(f) {
    var a = sceneAccent(f);
    var breathe = pulse(f, 1);
    var kick = MT.hit(f, 1); // вспышка-кик на сильных онсетах трека (scenes/music_timing.js)
    var kids = [
      { type: 'absolute_fill', color: C.bg },
      // аура 1 — акцент сцены, медленно дрейфует, подскакивает на ударах.
      // Градиент гаснет к 0.85 радиуса: прозрачный запас до края bitmap'а,
      // иначе рендер рисует мусорную линию по кромке контейнера.
      { type: 'container', width: 1500, height: 1500,
        positioned: { left: Math.round(-540 + Math.sin(f * 0.004) * 90),
          top: Math.round(-500 + Math.cos(f * 0.005) * 70) },
        gradient: { type: 'radial', colors: [AA(a, '38'), AA(a, '12'), '#00000000', '#00000000'],
          stops: [0, 0.42, 0.85, 1], radius: 0.5 },
        opacity: 0.6 + 0.2 * breathe + 0.22 * kick },
      // фиолетовая глубина снизу справа (прозрачный запас до края — см. выше)
      { type: 'container', width: 1600, height: 1600,
        positioned: { left: Math.round(-150 + Math.cos(f * 0.003) * 110),
          top: Math.round(820 + Math.sin(f * 0.004) * 90) },
        gradient: { type: 'radial', colors: [AA(C.violet, '26'), AA(C.blue, '0e'), '#00000000', '#00000000'],
          stops: [0, 0.45, 0.85, 1], radius: 0.5 }, opacity: 0.8 },
      // холодная дымка у нижней кромки (свет «города»)
      { type: 'container', width: W, height: 420, positioned: { left: 0, top: 1500 },
        gradient: { colors: ['#00000000', AA(C.ice, '10')], stops: [0, 1] } },
    ];
    // пыль: медленный дрейф вверх + мерцание
    for (var i = 0; i < 30; i++) {
      var x = rnd(i * 3.1) * W;
      var y = (rnd(i * 7.7) * H + f * (0.07 + rnd(i) * 0.22)) % H;
      var s = 2 + rnd(i * 13.3) * 3.5;
      kids.push({ type: 'circle', size: s, fill: i % 4 ? '#ffffff' : a,
        opacity: 0.05 + 0.16 * rnd(i + Math.floor(f / 16)),
        positioned: { left: Math.round(x), top: Math.round(H - y) } });
    }
    return finish({ type: 'stack', fit: 'expand', children: kids });
  },
};
