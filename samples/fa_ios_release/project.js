// Fa iOS release — 7 shots, 42.5s @ 30fps, beat-locked to the shared
// 150 BPM music (48-frame bars). One codebase renders 4 deliverables via
// variants: dark/light × horizontal/vertical.
//
// Reuses the Fa Brand Kit (single source of truth — edit brand only there):
//   brand/fa/fa_kit.js     — Fa mark geometry, trace/polyline primitives
//   brand/fa/fa_icons.js   — official vector icons (ios, apple, chrome...)
//   brand/fa/fa_theme.js   — dark/light palettes, format + node builders
// Project-local lib:
//   lib/qr.js              — fa1.dev QR matrix + vector QR renderer
//   lib/provider_icons.js  — monochrome vector marks for AI providers
//   lib/video_slots.js     — visible placeholders for AI-generated person clips

project = {
  lib: [
    '../../brand/fa/fa_kit.js',
    '../../brand/fa/fa_icons.js',
    '../../brand/fa/fa_theme.js',
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
    { path: 'scenes/broll_02_qr_scan.scene.js', layer: 'background', start: 530 },
    { path: 'scenes/broll_05_build_montage.scene.js', layer: 'background', start: 1058 },
    { path: 'scenes/broll_07_outro_monitors.scene.js', layer: 'background', start: 1490 },
    // Content layer
    { path: 'scenes/01_hook.scene.js', layer: 'content', start: 360 },
    { path: 'scenes/02_download.scene.js', layer: 'content', start: 530 },
    { path: 'scenes/03_connect.scene.js', layer: 'content', start: 722 },
    { path: 'scenes/04_ask.scene.js', layer: 'content', start: 866 },
    { path: 'scenes/05_build.scene.js', layer: 'content', start: 1058 },
    { path: 'scenes/06_publish.scene.js', layer: 'content', start: 1298 },
    { path: 'scenes/07_lockup.scene.js', layer: 'content', start: 1490 },
  ],
};
