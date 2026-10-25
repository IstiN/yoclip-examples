// Хук: s13 / crown. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's13', from: LINES[12].start, duration: LINES[12].dur,
  accent: C.amber, motif: 'crown', line: 12,
  hilites: ["чемпион"], caption: 'СНОВА №1', outroTag: false,
});
