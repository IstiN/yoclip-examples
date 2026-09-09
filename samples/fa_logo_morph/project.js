// Fa logo morph — three 8s shots @ 30fps. Shot 1: a dense wall of code
// runs and brakes; the line `(0_0)` hides in it, winks `(0_-)` twice,
// and the camera dives 5.2x into it while it warms to glowing violet.
// Shot 2: the kaomoji stage — the face squints, its cursor blinks, and
// other smileys gather around it. Shot 3: the close-up face turns
// vector — rings pinch into chevrons, the mouth bar bends into the note
// ring `>o` (in Russian solfège the note is «фа» = Fa), then the whole
// face breaks into the brand: the chevron becomes the F's stem, the ring
// swells into the `a`'s bowl, the dash becomes the teal accent, and the
// finished Fa icon blooms.
//
// Requires js_widget_runtime 0.4.115+ (jsr.ease, jsr.motion, path progress).

project = {
  lib: 'lib/brand.js',
  scenes: [
    { path: 'scenes/01_code_find.scene.js', layer: 'content', start: 0 },
    { path: 'scenes/02_kaomoji.scene.js', layer: 'content', start: 240 },
    { path: 'scenes/03_code_face.scene.js', layer: 'content', start: 480 },
  ],
};
