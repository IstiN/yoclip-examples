// Fa logo morph — one continuous shot (8s @ 30fps) retelling the brand
// storyboard: the terminal-app tile glitches apart into horizontal streaks,
// the bare `>_` prompt re-centers, its chevron splits and re-forms as the
// F of the Fa wordmark (the teal underscore glides in to become the F's
// accent bar), the `a` writes itself, and the mark settles into its glow.
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, path progress).

project = {
  lib: 'lib/brand.js',
  scenes: [
    { path: 'scenes/01_fa_morph.scene.js', layer: 'content', start: 0 },
  ],
};
