// music_animation — вертикальный неоновый лирик-клип (сегмент трека 1:40+).
// 16 строк = 16 сцен, границы и слова — по forced alignment (lib/timing.js).
project = {
  lib: ['lib/kit.js', 'lib/timing.js', 'lib/hook.js'],
  scenes: [
    { path: 'scenes/00_bg.scene.js', layer: 'background', start: 0 },
    { path: 'scenes/01_frequency.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/02_mirror.scene.js', layer: 'content', start: 39 },
    { path: 'scenes/03_diagnosis.scene.js', layer: 'content', start: 129 },
    { path: 'scenes/04_demo.scene.js', layer: 'content', start: 224 },
    { path: 'scenes/05_camera.scene.js', layer: 'content', start: 312 },
    { path: 'scenes/06_mic.scene.js', layer: 'content', start: 416 },
    { path: 'scenes/07_tee.scene.js', layer: 'content', start: 507 },
    { path: 'scenes/08_daw.scene.js', layer: 'content', start: 597 },
    { path: 'scenes/09_champion.scene.js', layer: 'content', start: 688 },
    { path: 'scenes/10_iphone.scene.js', layer: 'content', start: 806 },
    { path: 'scenes/11_concert.scene.js', layer: 'content', start: 896 },
    { path: 'scenes/12_mama.scene.js', layer: 'content', start: 990 },
    { path: 'scenes/13_champion2.scene.js', layer: 'content', start: 1080 },
    { path: 'scenes/14_iphone2.scene.js', layer: 'content', start: 1176 },
    { path: 'scenes/15_concert2.scene.js', layer: 'content', start: 1272 },
    { path: 'scenes/16_mama2.scene.js', layer: 'content', start: 1362 },
    { path: 'scenes/90_overlay.scene.js', layer: 'overlay', start: 0 },
  ],
};
