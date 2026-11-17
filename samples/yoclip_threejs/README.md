# YoClip × Three.js — From Prompt to Premiere

A 120-second, twelve-chapter YoClip promo with a native Three.js world rendered by Flutter GPU. The 3D background, editorial scenes, HUD, and audio are exported through the standard YoClip headless pipeline.

There is no browser, DOM, WebGL context, HTML harness, or pre-rendered 3D movie. `three/world.js` builds a real `THREE.Scene`; the pinned `js_widget_runtime` backend evaluates it and executes its draw calls with Flutter GPU.

## Contents

- **3,600 frames at 30 fps**, 1920×1080, with a mixed MP3 soundtrack.
- **Twelve 10-second chapters:** Programmable, Author, Generate, Real-time, Direct, Edit, Formats, Verify, Export, GPU Showreel, Repository, Render.
- A deterministic Three.js r186 world: extruded YoClip brand mark, animated node graphs, torus knot, instanced timeline clips, format cards, review frames, tunnel, stars, and particles.
- Native perspective cameras, scene fog, ACES tone mapping, standard/basic materials, additive line work, and animated lights.
- Ordinary YoClip JavaScript scenes for all editorial typography and the persistent HUD.
- Frame-pure animation: arbitrary screenshot seeks and sequential MP4 export evaluate the same `frame` / `fps` inputs.

## Art direction

- **Source Sans 3** is bundled in Regular and Bold; the project does not depend on platform font lookup.
- **3D is used intentionally.** It carries Intro, Real-time, Direct, GPU Showreel, and Outro. Interface-led chapters keep a quiet stage so typography and product UI remain the hero.
- **Editorial restraint:** near-black negative space, dense opaque glass panels, violet/cyan accents, fine rules, and small technical labels rather than full-screen visual noise.
- **Review at delivery size:** `test/yoclip_review_frames_test.dart` captures exact 1920×1080 chapter frames and fails on layout overflows or JavaScript errors.

## Project layout

```text
yoclip.yaml                  # 120-second composition, theme, logo, audio
project.js                   # project.lib + ordered/layered scene layout
lib/
  promo.js                   # Shared 12-chapter editorial contract
  animation.js               # Easing and scene helpers
  shots.js                   # Editorial scene builders
scenes/
  background.scene.js        # Mounts the persistent THREE world
  00_intro.scene.js … 11_outro.scene.js
  hud.scene.js               # Persistent typography/progress overlay
three/
  world.js                   # Actual THREE.Scene and deterministic renderer
test/
  yoclip_project_test.dart   # Offline project and all-scene graph checks
  three_smoke_test.dart      # Real Flutter-GPU capture smoke test
  yoclip_review_frames_test.dart
  yoclip_render_test.dart
```

The Three.js module and Flutter-GPU backend come from the repository's pinned `flutter_js_widget_runtime` dependency. Three.js is MIT-licensed.

## Run

From this directory, using the repository checkout:

```bash
# Verify project loading and all 12 editorial scene graphs without a GPU.
flutter test test/yoclip_project_test.dart

# Capture one composed frame through the standard YoClip CLI.
dart run ../../../packages/yoclip_cli/bin/yoclip.dart \
  screenshot -C . --frame 150 -o build/three_at_5s.png

# Render the complete 120-second movie.
dart run ../../../packages/yoclip_cli/bin/yoclip.dart \
  render -C . -o build/yoclip_threejs.mp4

# Short draft while iterating.
dart run ../../../packages/yoclip_cli/bin/yoclip.dart \
  render -C . --duration 30 -o build/three_draft.mp4
```

The CLI enables Impeller and Flutter GPU automatically on macOS. Direct test equivalents:

```bash
flutter test --enable-impeller --enable-flutter-gpu test/three_smoke_test.dart

YOCLIP_SCENE=00_intro YOCLIP_FRAME=150 YOCLIP_OUTPUT=build/review_intro.png \
  flutter test --enable-impeller --enable-flutter-gpu \
  test/yoclip_review_frames_test.dart

YOCLIP_OUTPUT=build/yoclip_threejs.mp4 \
  flutter test --enable-impeller --enable-flutter-gpu \
  test/yoclip_render_test.dart
```

## Headless export

Preview uses the live Flutter-GPU surface. For headless export, YoClip captures the native Three.js surface, removes the GPU texture from the Flutter repaint boundary, captures the ordinary Flutter scenes and HUD with transparency, and composites the RGBA layers on the CPU. This avoids a Flutter test-binding readback deadlock while preserving the exact Three.js frame and normal YoClip layout.

QuickJS workers are disposed in a real-async zone after capture so Flutter tests finish without pending fake-async timers.

## Editing

Animation is a pure function of the composition frame in `three/world.js`:

```js
function handleEvent(action, payload) {
  if (action !== 'yoclip.frame') return;
  renderFrame(payload.frame || 0, payload.fps || 30, payload.params || {});
  jsr.render({ type: 'three', canvasId: 'main', width: W, height: H });
}
```

Change editorial scenes independently in `scenes/*.scene.js` and `lib/shots.js`. Shared JavaScript is declared once in `project.js`; scene modules do not need a non-standard `load()` helper. JavaScript changes require no Dart rebuild.
