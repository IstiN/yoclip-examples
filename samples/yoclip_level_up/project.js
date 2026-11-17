// LEVEL UP — one deterministic boss-fight world, driven by the 140 BPM master.
project = {
  lib: ['lib/audio_features.js', 'lib/timeline.js', 'lib/animation.js', 'lib/film.js'],
  scenes: [
    { path: 'scenes/background.scene.js', layer: 'background', start: 0 },
    { path: 'scenes/film.scene.js', layer: 'content', start: 0 },
  ],
};
