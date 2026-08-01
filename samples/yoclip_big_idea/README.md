# yoclip_big_idea

**"Yoclip: What's Your Big Idea?"** — a cinematic ~86 s about-video for
yoclip, made entirely with yoclip. Modeled shot-by-shot on
[Gamma: What's Your Big Idea?](https://www.youtube.com/watch?v=-CU5DdGZdC8)
(typewriter hook → 3D montage → product magic → 3D fly-through → end card).
See `GOAL.md` for the full reference breakdown and scene plan.

Highlights:

- **Real GLB on GPU** (`scene3d` + `engine: 'flame'`, offscreen render
  target — exports headless): a KayKit city block with original textures on
  the floating island, three KayKit adventurers with **skeletal walk
  cycles** (`Walking_A`) on the meadow, and the Khronos DamagedHelmet.glb
  tumbling through the finale tunnel.
- **Software 3D** (`scene3d` `meshes` path, pure CustomPaint) for the
  procedural parts: island, clouds, meadow, origami-bird vortex, tunnel
  rings — both pipelines compose in the same frame.
- Beat-mapped music envelope (`yoclip.yaml → audio.tracks`) — the score is a
  placeholder; see `MUSIC_PROMPT.md` for the Suno prompt (swap the file
  under the same name).

Models: [KayKit CC0](https://github.com/KayKit-Game-Assets) (City Builder
Bits + Character Pack Adventurers, Kay Lousberg) and the Khronos
DamagedHelmet sample (CC-BY 4.0).

## Render

```bash
yoclip render -V dark_en -o big_idea.mp4
```

Variants: `dark_en` (default), `dark_ru`, `light_en`, `light_ru`,
`shorts_en` (1080×1920). The CLI passes `--enable-impeller
--enable-flutter-gpu` automatically (required by the GPU scenes); Studio
preview needs the same flags/entitlements on its platform.

## Screenshot

```bash
yoclip screenshot --frame 2140 -o frame.png
```

## Test

```bash
flutter test --enable-impeller --enable-flutter-gpu test/yoclip_project_test.dart
```

## Layout

- `GOAL.md` — concept, Gamma reference beat sheet, milestones
- `project.js` — theme, EN/RU text dictionaries, scene layout/crossfades
- `lib/animation.js` — easing/motion/typewriter helpers + low-poly mesh
  generators (`meshCube/meshCylinder/meshCone/meshTorus/meshXform`)
- `assets/models/` — GLB models (KayKit characters, Khronos helmet),
  `assets/models/city/` — KayKit City Builder gltf+bin+atlas
- `scenes/*.scene.js` — the 12 beats + full-length background
- `MUSIC_PROMPT.md` — score prompt + beat map
