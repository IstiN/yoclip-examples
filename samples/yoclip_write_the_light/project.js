// One continuous music film, one persistent THREE world, one shared master map.
// Every visual decision is a pure function of the composition frame.
project = {
  lib: ['lib/timeline.js', 'lib/word_timings.js', 'lib/animation.js', 'lib/film.js'],
  scenes: [
    { path: 'scenes/background.scene.js', layer: 'background', start: 0 },
    { path: 'scenes/film.scene.js', layer: 'content', start: 0 },
  ],
};
