// Fa trailer — eight shots, 52s @ 30fps (1560 frames), 1920x1080.
//
//   01 dark      0-210     black, the `fa` cursor, the code wall, the face winks
//   02 alive     210-390   dive into the face, it warms violet: "It lives in
//                          your code."
//   03 hardware  390-600   the Studio beat: light traces the tile, orbit, the
//                          face materializes — the chip moment is the agent
//   04 core      600-780   type-on-black spec beats: Pure Dart / Streaming-
//                          first / 10 providers / native tool calling
//   05 everywhere 780-1020 "One agent harness, every device." — the platform
//                          grid over the AI corridor placeholder
//   06 power     1020-1230 Cubes (security), memory built in, subagents —
//                          over the AI swarm placeholder
//   07 work      1230-1380 fast montage: the AI desk placeholder + the
//                          terminal autofire rows
//   08 lockup    1380-1560 tile + Fa + fa1.dev — macOS · iOS · Web · Chrome
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, path progress).

project = {
  lib: 'lib/brand.js',
  scenes: [
    { path: 'scenes/01_dark.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/02_alive.scene.js', layer: 'content', start: 210 },
    { path: 'scenes/03_hardware.scene.js', layer: 'content', start: 390 },
    { path: 'scenes/04_core.scene.js', layer: 'content', start: 600 },
    { path: 'scenes/05_everywhere.scene.js', layer: 'content', start: 780 },
    { path: 'scenes/06_power.scene.js', layer: 'content', start: 1020 },
    { path: 'scenes/07_work.scene.js', layer: 'content', start: 1230 },
    { path: 'scenes/08_lockup.scene.js', layer: 'content', start: 1380 },
  ],
};
