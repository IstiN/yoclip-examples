// Fa iOS release — 8 shots, 46.8s @ 30fps, beat-locked to the shared
// 150 BPM music (48-frame bars). One codebase renders 4 deliverables via
// variants: dark/light × horizontal/vertical.
//
// Reuses the Fa Brand Kit (single source of truth — edit brand only there):
//   brand/fa/fa_kit.js     — Fa mark geometry, trace/polyline primitives
//   brand/fa/fa_icons.js   — official vector icons (ios, apple, chrome...)
//   brand/fa/fa_theme.js   — dark/light palettes, format + node builders
// Project-local lib:
//   lib/qr.js              — App Store QR matrix + vector QR renderer
//   brand/fa/fa_splash.js  — the trailer-opening brand splash (white beat)
//   lib/provider_icons.js  — monochrome vector marks for AI providers
//   lib/video_slots.js     — visible placeholders for AI-generated person clips

project = {
  lib: [
    '../../brand/fa/fa_kit.js',
    '../../brand/fa/fa_icons.js',
    '../../brand/fa/fa_theme.js',
    '../../brand/fa/fa_splash.js',
    'lib/qr.js',
    'lib/provider_icons.js',
    'lib/video_slots.js',
  ],
  scenes: [
    { path: 'scenes/00_intro.scene.js', layer: 'content', start: 0 },
    // B-roll layer (rendered first): video-insert slots / future footage.
    // broll_01 starts at 451 — until then the intro video (content layer)
    // still covers the background while its audio plays out.
    { path: 'scenes/broll_01_hook_typing.scene.js', layer: 'background', start: 451 },
    { path: 'scenes/broll_02_qr_scan.scene.js', layer: 'background', start: 470 },
    { path: 'scenes/broll_05_build_montage.scene.js', layer: 'background', start: 1142 },
    { path: 'scenes/broll_07_outro_monitors.scene.js', layer: 'background', start: 2366 },
    // Content layer
    { path: 'scenes/01_hook.scene.js', layer: 'content', start: 300 },
    { path: 'scenes/02_download.scene.js', layer: 'content', start: 470 },
    { path: 'scenes/02b_brand.scene.js', layer: 'content', start: 662 },
    { path: 'scenes/03_connect.scene.js', layer: 'content', start: 782 },
    // 03 extended to 168 frames (782..950) - 04 starts after it
    // 04 stretched to 444 (x2 pacing + card read tail) on 2026-09-23
    { path: 'scenes/04_ask.scene.js', layer: 'content', start: 950 },
    // 05 rebuilt as 3 prompt->app beats (852) on 2026-09-24
    { path: 'scenes/05_build.scene.js', layer: 'content', start: 1394 },
    // catalog publish pulled for now — the film re-peaks with the splash
    // and the store card right before the lockup (2026-09-24)
    { path: 'scenes/05b_splash.scene.js', layer: 'content', start: 2246 },
    { path: 'scenes/05c_download.scene.js', layer: 'content', start: 2366 },
    { path: 'scenes/07_lockup.scene.js', layer: 'content', start: 2558 },
  ],
};
