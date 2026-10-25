// Хук: s9 / crown. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's9', from: LINES[8].start, duration: LINES[8].dur,
  accent: C.amber, motif: 'crown', line: 8,
  hilites: ["Милионы", "чемпион"], caption: 'ПЕРВЫЙ ЧЕМПИОН', outroTag: false,
});
