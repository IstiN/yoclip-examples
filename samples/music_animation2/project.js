// music_animation2 — вертикальный тёмный лирик-клип (TikTok/Reels).
// Клип = финал трека с 3:14 ровно со строки «И дальше всё в том же духе...»
// (194.0 c, трек обрезан media_trim) до конца: 12 сцен строго по строчкам,
// караоке-текст по покусочному транскрипту (пословно, снап к 8-м долям 97 BPM).
// Хронометраж: 2429 кадров = 80.97 c; аудио assets/audio/track_clip.mp3, start 0.
project = {
  // music_timing.js — единый источник музыкального тайминга (BPM, удары, секции,
  // транскрипт); kit.js — палитра/примитивы; timing.js — границы сцен.
  lib: ['scenes/music_timing.js', 'lib/kit.js', 'lib/timing.js'],
  theme: {
    colors: {
      background: '#05060d', panel: '#0b0e1c', panelLine: '#1d2438',
      text: '#f4f6ff', textMuted: '#8b93b8', textDim: '#4a5272',
      ice: '#7dd3fc', blue: '#3b82f6',
      violet: '#8b5cf6', violetLight: '#c4b5fd',
      red: '#ff2d55', redDeep: '#c1123f',
    },
    font: { family: 'SS3 Black' },
    sizes: { lyric: 56, lyricBig: 110, huge: 150, cap: 26 },
  },
  scenes: [
    { path: 'scenes/00_bg.scene.js', layer: 'background', start: 0, duration: 2429 },
    { path: 'scenes/01_phone.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/02_puddle.scene.js', layer: 'content', start: 60 },
    { path: 'scenes/03_mic.scene.js', layer: 'content', start: 120 },
    { path: 'scenes/04_screentime.scene.js', layer: 'content', start: 330 },
    { path: 'scenes/05_phones.scene.js', layer: 'content', start: 450 },
    { path: 'scenes/06_silhouette.scene.js', layer: 'content', start: 630 },
    { path: 'scenes/06b_shadow.scene.js', layer: 'content', start: 750 },
    { path: 'scenes/07_chorus.scene.js', layer: 'content', start: 930 },
    { path: 'scenes/08_glass.scene.js', layer: 'content', start: 1230 },
    { path: 'scenes/09_chat.scene.js', layer: 'content', start: 1380 },
    { path: 'scenes/10_heart.scene.js', layer: 'content', start: 1500 },
    { path: 'scenes/11_ember.scene.js', layer: 'content', start: 1860 },
    { path: 'scenes/90_overlay.scene.js', layer: 'overlay', start: 0, duration: 2429 },
  ],
};
