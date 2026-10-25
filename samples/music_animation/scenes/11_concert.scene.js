// Хук: s11 / concert. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's11', from: LINES[10].start, duration: LINES[10].dur,
  accent: C.violet, motif: 'concert', line: 10,
  hilites: ["Москвы", "Samsung"], caption: 'LIVE · MOSCOW → SAMSUNG', outroTag: false,
});
