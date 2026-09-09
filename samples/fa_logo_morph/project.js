// Fa logo morph — one continuous shot (8s @ 30fps). The dark-glass app
// icon boots with a teal scan line, grows to hero scale — and the
// prompt `>_` turns out to be a face — the underscore is its mouth. The
// mouth lifts, purses into a dash, and curls into a note head beside the
// eye: the face reads `>o` — in Russian solfège the note is «фа» = Fa.
// The smiley blinks twice (`>o >- >o >- >o`), the eye squinting in sync,
// then the eye's two arms fold into one vertical line — the F's stem; the
// top bar winds out of it, a new line grows from its center (the accent),
// and the `o` drops into the `a`'s bowl:
// one ring flattens into the F's accent bar, the other swells into the
// `a`'s bowl — the note spells its own name. The F writes itself as one
// round-capped stroke, the `a`'s stem draws green → cyan, and the mark
// settles into the finished app icon.
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, path progress).

project = {
  lib: 'lib/brand.js',
  scenes: [
    { path: 'scenes/01_fa_morph.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/02_kaomoji.scene.js', layer: 'content', start: 240 },
    { path: 'scenes/03_code_face.scene.js', layer: 'content', start: 480 },
  ],
};
