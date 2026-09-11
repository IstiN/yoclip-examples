// Fa trailer — nine shots synchronized to background music (150 BPM, 48 frames/bar).
//
// Every scene cut lands on an exact musical downbeat:
//   01 dark       0-218     (218 frames, ~4.5 bars) black, the `fa` cursor, the code wall, face winks
//   01b prompt    218-362   (144 frames, 3.0 bars)  tactical command directive intake, enter click
//   02 alive      362-554   (192 frames, 4.0 bars)  music drop, cyber-terminal code awakens
//   03 hardware   554-746   (192 frames, 4.0 bars)  studio orbit, light traces the hardware chip
//   04 core       746-938   (192 frames, 4.0 bars)  type-on-black Apple spec slams (1 bar per spec beat)
//   05 everywhere 938-1178  (240 frames, 5.0 bars)  massive synth drop: one agent harness, every device
//   06 power      1178-1370 (192 frames, 4.0 bars)  snare hit: cubes security, durable memory, plugins
//   07 work       1370-1514 (144 frames, 3.0 bars)  fast montage: Studio timeline autofire
//   08 lockup     1514-1706 (192 frames, 4.0 bars)  final impact: hardware tile + Fa mark + fa1.dev
//
// Total: 1706 frames @ 30fps (56.87s), perfectly locked to 150 BPM downbeats.

project = {
  lib: ['lib/brand.js', 'lib/icons.js'],
  scenes: [
    { path: 'scenes/01_dark.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/01b_prompt.scene.js', layer: 'content', start: 218 },
    { path: 'scenes/02_alive.scene.js', layer: 'content', start: 362 },
    { path: 'scenes/03_hardware.scene.js', layer: 'content', start: 554 },
    { path: 'scenes/04_core.scene.js', layer: 'content', start: 746 },
    { path: 'scenes/05_everywhere.scene.js', layer: 'content', start: 938 },
    { path: 'scenes/06_power.scene.js', layer: 'content', start: 1178 },
    { path: 'scenes/07_work.scene.js', layer: 'content', start: 1370 },
    { path: 'scenes/08_lockup.scene.js', layer: 'content', start: 1514 },
  ],
};
