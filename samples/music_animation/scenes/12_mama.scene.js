// Хук: s12 / micoff. Текст и тайминги — LINES (transcript + alignment).
scene = hookScene({
  id: 's12', from: LINES[11].start, duration: LINES[11].dur,
  accent: C.red, motif: 'micoff', line: 11,
  hilites: ["Выкинь", "нахуй", "микрофон»"], caption: 'МА ГОВОРИЛА', outroTag: false,
});
