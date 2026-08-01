# yoclip_big_idea_v2

**"Yoclip: What's Your Big Idea? — v2"** — a near-shot-for-shot remake of
[Gamma: What's Your Big Idea?](https://www.youtube.com/watch?v=-CU5DdGZdC8)
(89.5 s, no voiceover) telling yoclip's story with the same beats, pacing,
energy and color language — produced entirely with yoclip. See `GOAL.md`
for the full Gamma beat sheet and scene map.

v1 (`samples/yoclip_big_idea`) stays as the "how NOT to do it" reference.

Highlights:

- **Custom intro arc**: the typewriter question backspaces away to a lone
  caret, the caret grows into an iridescent monolith in a vivid sunset
  world, the monolith lands as the "l" of a giant **real 3D yoclip logo**
  (GLB parts extruded from the brand SVG by `tools/build_logo_3d.py` —
  light-theme colors, gradient bubble, rounded strokes) assembling on the
  dunes, and the camera dives through the pulsing dot over the "i" into a
  portal vortex — sweeping neon arcs, polaroid cards with real golden
  frames spiraling into the pupil, and low-poly 3D objects flying past,
  exiting on a white flash.
- **Real GLB on GPU** (`scene3d` + `engine: 'flame'`, offscreen render
  target — exports headless): KayKit landers + planet in the space scene, a
  KayKit Knight with a **skeletal Cheer clip** animating live inside a
  course card, and a Mage flying through the finale tunnel.
- **Golden tests as content**: the product-demo scenes embed REAL golden
  frames captured by the yoclip CLI from this very project
  (`assets/goldens/`, declared via `yoclip.yaml → external_assets`) — the
  deck, the chat stats card and the floating promo window show actual
  yoclip Studio output.
- **Software 3D** (`scene3d` `meshes` path, pure CustomPaint) for the
  procedural parts: monolith dunes, kaleidoscope collage, tunnel rings —
  both pipelines compose in the same frame.
- Beat-mapped music envelope (`yoclip.yaml → audio.tracks`) — the score is
  a placeholder; see `MUSIC_PROMPT.md` for the Suno prompt (swap the file
  under the same name).

Models: [KayKit CC0](https://github.com/KayKit-Game-Assets) (Space Base +
Character Pack Adventurers, Kay Lousberg).

## Render

```bash
yoclip render -V dark_en -o big_idea_v2.mp4
```

Variants: `dark_en` (default), `dark_ru`, `light_en`, `light_ru`,
`shorts_en` (1080×1920). The CLI passes `--enable-impeller
--enable-flutter-gpu` automatically (required by the GPU scenes); Studio
preview needs the same flags/entitlements on its platform.

## Screenshot

```bash
yoclip screenshot --frame 1200 -o frame.png
```

## Test

```bash
flutter test --enable-impeller --enable-flutter-gpu test/yoclip_project_test.dart
```

## Layout

- `GOAL.md` — concept, Gamma reference beat sheet, engineering notes
- `project.js` — theme, EN/RU text dictionaries, scene layout/crossfades
- `lib/animation.js` — easing/motion helpers + low-poly mesh generators
- `assets/models/` — GLB/gltf models (KayKit), `assets/goldens/` — real
  CLI-captured golden frames embedded in the video
- `scenes/*.scene.js` — the 15 beats + full-length background
- `MUSIC_PROMPT.md` — score prompt + beat map

## Requires

js_widget_runtime ≥ 0.4.21 — the 3D host dispatcher reference-counts shared
controllers; older builds can drop GPU scenes mid-export when a scene3d
node unmounts/remounts within one frame.
