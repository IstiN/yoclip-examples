// Хук: s16 / micoff. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's16', from: LINES[15].start, duration: LINES[15].dur,
  accent: C.red, motif: 'micoff', line: 15,
  hilites: ["Выкинь", "нахуй", "микрофон»"], caption: 'ФИНАЛ · МА БЫЛА ПРАВА', outroTag: true,
});
