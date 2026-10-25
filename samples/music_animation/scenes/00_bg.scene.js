// Фон на весь клип: глубокий космос, две цветные ауры (акцент меняется от сцены
// к сцене), пыль и дыхание на бите.
scene = {
  id: 'bg',
  duration: 1520,
  from: 0,
  timeline: { label: 'Background', color: '#12172e', lane: 'video' },
  render: function(f) {
    var accents = [C.violet, C.ice, C.red, C.amber, C.cyan, C.acid, C.acid, C.red,
      C.amber, C.cyan, C.violet, C.red, C.amber, C.cyan, C.violet, C.red];
    var idx = 0;
    for (var si = 0; si < SCENE_STARTS.length; si++) if (f >= SCENE_STARTS[si]) idx = si;
    var a = accents[idx];
    var breathe = pulse(f);
    var kids = [
      { type: 'absolute_fill', color: C.bg },
      // аура 1 — акцент сцены, сверху слева
      { type: 'container', width: 1500, height: 1500,
        positioned: { left: -560 + Math.sin(f * 0.004) * 90, top: -520 + Math.cos(f * 0.005) * 70 },
        gradient: { type: 'radial', colors: [AA(a,'40'), AA(a,'14'), '#00000000'], stops: [0, 0.45, 1], radius: 0.5 },
        opacity: 0.75 + 0.25 * breathe },
      // аура 2 — фиолетовая глубина снизу справа
      { type: 'container', width: 1600, height: 1600,
        positioned: { left: -160 + Math.cos(f * 0.003) * 110, top: 800 + Math.sin(f * 0.004) * 90 },
        gradient: { type: 'radial', colors: [AA(C.violet,'2e'), AA(C.cyan,'10'), '#00000000'], stops: [0, 0.5, 1], radius: 0.5 },
        opacity: 0.8 },
    ];
    // пыль: медленный параллакс + мерцание
    for (var i = 0; i < 34; i++) {
      var x = rnd(i * 3.1) * W;
      var y = (rnd(i * 7.7) * H + f * (0.08 + rnd(i) * 0.25)) % H;
      var s = 2 + rnd(i * 13.3) * 4;
      kids.push({ type: 'circle', size: s, fill: i % 4 ? '#ffffff' : a,
        opacity: 0.08 + 0.22 * rnd(i + Math.floor(f / 14)),
        positioned: { left: Math.round(x), top: Math.round(H - y) } });
    }
    return finish({ type: 'stack', fit: 'expand', children: kids });
  },
};
