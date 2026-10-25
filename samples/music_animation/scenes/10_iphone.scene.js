// Хук: s10 / iphone. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's10', from: LINES[9].start, duration: LINES[9].dur,
  accent: C.cyan, motif: 'iphone', line: 9,
  hilites: ["iPhone"], caption: 'SHOT ON IPHONE', outroTag: false,
});
