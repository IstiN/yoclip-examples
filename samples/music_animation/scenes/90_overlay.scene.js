// Финишный оверлей на весь клип: плёнка (зерно + сканлайны + виньетка),
// водяной знак, вход из чёрного и финальное затемнение.
scene = {
  id: 'overlay',
  duration: 1520,
  from: 0,
  timeline: { label: 'Grade', color: '#3a3f5c', lane: 'video' },
  render: function(f) {
    var kids = [
      { type: 'image', source: 'external:grade' + (f % 3), fit: 'cover',
        width: W, height: H, positioned: { left: 0, top: 0 } },
      { type: 'container', width: W, positioned: { left: 0, top: 1812 }, alignment: 'center',
        opacity: 0.4,
        child: cap('СДЕЛАНО КОДОМ · YOCLIP', C.muted, 20) },
    ];
    if (f < 14) kids.push({ type: 'absolute_fill', color: '#000000', opacity: 1 - seg(f, 0, 14) });
    if (f > 1470) kids.push({ type: 'absolute_fill', color: '#000000', opacity: seg(f, 1470, 1516) });
    return finish({ type: 'stack', fit: 'expand', children: kids });
  },
};
