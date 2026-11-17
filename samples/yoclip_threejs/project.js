// Native THREE background + twelve editorial chapters + persistent HUD.
// Shared libraries are evaluated by YoClip before every scene module.
project = {
  lib: ['lib/promo.js', 'lib/animation.js', 'lib/shots.js'],
  scenes: [
    { path: 'scenes/background.scene.js', layer: 'background', start: 0 },
    { path: 'scenes/00_intro.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/01_author.scene.js', layer: 'content', start: 300 },
    { path: 'scenes/02_generate.scene.js', layer: 'content', start: 600 },
    { path: 'scenes/03_realtime.scene.js', layer: 'content', start: 900 },
    { path: 'scenes/04_direct.scene.js', layer: 'content', start: 1200 },
    { path: 'scenes/05_edit.scene.js', layer: 'content', start: 1500 },
    { path: 'scenes/06_formats.scene.js', layer: 'content', start: 1800 },
    { path: 'scenes/07_verify.scene.js', layer: 'content', start: 2100 },
    { path: 'scenes/08_export.scene.js', layer: 'content', start: 2400 },
    { path: 'scenes/09_showreel.scene.js', layer: 'content', start: 2700 },
    { path: 'scenes/10_repository.scene.js', layer: 'content', start: 3000 },
    { path: 'scenes/11_outro.scene.js', layer: 'content', start: 3300 },
    { path: 'scenes/hud.scene.js', layer: 'overlay', start: 0 },
  ],
};
