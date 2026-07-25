// Project-wide layout for REDEFINE — the EPAM AI/Run promo film (v2).
//
// Palette lives in yoclip.yaml -> theme.colors; brand helpers in
// lib/brand.js read it with hex fallbacks. Timeline is declared here with
// explicit starts/durations (small overlaps = crossfades on black).
//
// v2 structure: case-driven story — hype gap -> AI 360 -> PostNL ->
// Baker Hughes -> tools -> talent -> analyst -> CTA (~69s @ 30fps).

project = {
  lib: ['lib/animation.js', 'lib/brand.js'],
  scenes: [
    // Content scenes — 20 frame overlaps crossfade on the Night canvas.
    { path: 'scenes/00_cover.scene.js',     layer: 'content', start: 0,    duration: 170 },
    { path: 'scenes/01_hype_gap.scene.js',  layer: 'content', start: 150,  duration: 280 },
    { path: 'scenes/02_framework.scene.js', layer: 'content', start: 410,  duration: 250 },
    { path: 'scenes/03_postnl.scene.js',    layer: 'content', start: 640,  duration: 430 },
    { path: 'scenes/04_baker.scene.js',     layer: 'content', start: 1050, duration: 310 },
    { path: 'scenes/05_tools.scene.js',     layer: 'content', start: 1340, duration: 230 },
    { path: 'scenes/06_talent.scene.js',    layer: 'content', start: 1550, duration: 200 },
    { path: 'scenes/07_quote.scene.js',     layer: 'content', start: 1730, duration: 170 },
    { path: 'scenes/08_cta.scene.js',       layer: 'content', start: 1880, duration: 190 },

    // Persistent quiet `<epam>` wordmark across the middle scenes.
    { path: 'scenes/09_logo_overlay.scene.js', layer: 'overlay', start: 160, duration: 1700 },
  ],
};
