// Fa logo morph — one continuous shot (8s @ 30fps) retelling the brand
// storyboard on ONE persistent surface: the dark-glass app icon boots with
// a teal scan line, grows to hero scale, and its `>_` prompt morphs into
// the Fa wordmark inside it — the chevron arms split and re-form as the F
// (one round-capped stroke), the teal underscore glides in to become the
// F's accent bar, the `a` writes itself, and the mark settles into its
// glow. The film ends on the finished app icon.
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, path progress).

project = {
  lib: 'lib/brand.js',
  scenes: [
    { path: 'scenes/01_fa_morph.scene.js', layer: 'content', start: 0 },
  ],
};
