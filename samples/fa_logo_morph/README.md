# fa_logo_morph

A single eight-second brand film: the `>_` app icon shreds away, the bare
prompt re-centers and grows, then writes itself into the **Fa** wordmark —
F stamps in, the teal underscore glides up into the F accent, the `a` draws
its bowl and stem, everything settles with a breathing ground glow and a
final teal bloom.

One scene, 240 frames at 30 fps, no assets. Every element is placed through
the shared svg→screen mapper in `lib/brand.js`, so the icon-to-wordmark morph
stays geometrically continuous while scale and anchor animate:

| Beat | Frames | What happens |
|------|--------|--------------|
| 01 | 0–40 | The tile: white rounded square, `>_` prompt, soft white halo |
| 02–04 | 40–78 | Glitch dissolve — the tile shreds into horizontal slices flying right; white/blue/teal streaks tag the bands |
| 05–06 | 75–108 | The bare prompt re-centers and grows (easeOutExpo), glow pulse |
| 07–10 | 108–150 | Morph: chevron arms split and die, the F stem + top bar stamp in, the underscore glides into the F accent |
| 11–15 | 150–192 | The `a` writes itself — arc trace for the bowl, stem trace |
| 16–20 | 192–240 | Settle: breathing ground glow, final teal bloom, hold |

## Why it's a good engine test

- **One mapper, many anchors** — `setMapper(k, ax, ay, sx, sy)` pins any svg
  point to any screen point; the scene retargets it mid-film (icon center →
  wordmark center) while every child keeps drawing through the same
  `brandToScreen`.
- **Stroke geometry without round caps** — the chevron is two filled
  `polygon` arms (`armPolygon`), because the path node strokes with round
  caps and blobs the shared vertex.
- **Gradient bars from flat strips** — `tealBar()` tiles the underscore's
  teal→cyan gradient as square strips; per-strip rounding reads as beads.
- **Real letterforms** — the `a` bowl is a path-arc drawn through the
  `progress` contract, not an image.

## Run

```bash
# Render the whole film
dart run ../../../packages/yoclip_cli/bin/yoclip.dart render -o fa_morph.mp4

# Or open it in Studio
dart run ../../../packages/yoclip_cli/bin/yoclip.dart preview
```

## Test

```bash
flutter test

# Dump one PNG per storyboard beat for the visual golden check
YOCLIP_CAPTURE_DIR=/tmp/fa_frames flutter test
```

The test loads the scene through `loadYoclipProjectScenes` (project.js lib +
anchors + yoclipTheme), probes one frame per beat (10, 60, 84, 100, 130, 165,
205, 236) and fails on any graph or widget error. With `YOCLIP_CAPTURE_DIR`
it also saves 1920×1080 PNGs next to the probe name.
