// Project-wide layout for DMTOOLS — the EPAM open-source promo film.
//
// Palette lives in yoclip.yaml -> theme.colors; brand helpers in
// lib/brand.js read it with hex fallbacks. Timeline is declared here with
// explicit starts/durations (small overlaps = crossfades on the canvas).
//
// Structure: cover -> the fragmentation problem -> DMTools as the
// orchestration layer -> the numbers -> the AI-teammate architecture ->
// jobs in plain JavaScript -> four usage paths -> CTA with QR ->
// epilogue -> fade out (~93.5s @ 30fps).

project = {
  lib: ['lib/animation.js', 'lib/brand.js'],
  scenes: [
    // Full-length canvas fill so the light variant gets its Snow background
    // (config.background stays Night for the dark cut).
    { path: 'scenes/background.scene.js',   layer: 'background', start: 0, duration: 2803 },

    // Content scenes — 20 frame overlaps crossfade on the canvas.
    // Each voice-over has at least 1s of lead-in and finishes at least 20
    // frames before the next crossfade so speech never lands on a cut.
    { path: 'scenes/00_cover.scene.js',         layer: 'content', start: 0,    duration: 284 },
    { path: 'scenes/01_problem.scene.js',       layer: 'content', start: 264,  duration: 371 },
    { path: 'scenes/02_layer.scene.js',         layer: 'content', start: 615,  duration: 366 },
    { path: 'scenes/03_numbers.scene.js',       layer: 'content', start: 961,  duration: 382 },
    { path: 'scenes/04_architecture.scene.js',  layer: 'content', start: 1323, duration: 420 },
    { path: 'scenes/05_code.scene.js',          layer: 'content', start: 1723, duration: 330 },
    { path: 'scenes/06_paths.scene.js',         layer: 'content', start: 2033, duration: 275 },
    { path: 'scenes/07_cta.scene.js',           layer: 'content', start: 2288, duration: 295 },
    { path: 'scenes/10_epilogue.scene.js',      layer: 'content', start: 2563, duration: 210 },

    // Persistent quiet `<epam>` wordmark across the middle scenes.
    { path: 'scenes/08_logo_overlay.scene.js', layer: 'overlay', start: 264, duration: 2319 },

    // Closing fade to the canvas color.
    { path: 'scenes/09_fadeout.scene.js',      layer: 'overlay', start: 2753, duration: 50 },
  ],
};
