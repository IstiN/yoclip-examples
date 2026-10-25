// Хук: s15 / concert. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's15', from: LINES[14].start, duration: LINES[14].dur,
  accent: C.violet, motif: 'concert', line: 14,
  hilites: ["Москвы", "Samsung"], caption: 'LIVE · MOSCOW', outroTag: false,
});
