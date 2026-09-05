// Motion & Shapes playground — a tiny project that exercises the newest
// scene features end to end:
//
//   01_shapes   — declarative shape nodes (rect / circle / line / polygon)
//                 entering through jsr.motion.tween
//   02_motion   — the jsr.motion builtins raw: tween / mapRange / clamp / wave
//   03_sequence — the sequence() helper: one call choreographs a whole build
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, shape nodes).

project = {
  lib: 'lib/animation.js',
  theme: {
    headline: {
      fontSize: 88,
      color: '#ffffff',
      fontFamily: 'Geneva',
      fontWeight: 700,
    },
    label: {
      fontSize: 30,
      color: '#a78bfa',
      fontFamily: 'Geneva',
      fontWeight: 600,
      letterSpacing: 8,
    },
  },
  scenes: [
    { path: 'scenes/01_shapes.scene.js',   layer: 'content', start: 0 },
    { path: 'scenes/02_motion.scene.js',   layer: 'content', start: 120 },
    { path: 'scenes/03_sequence.scene.js', layer: 'content', start: 240 },
  ],
};
