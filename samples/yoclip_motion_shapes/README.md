# yoclip_motion_shapes

A showreel-style playground modeled on the Motion Canvas anniversary
thumbnail: a mosaic wall of video-card tiles washing from steel blue to
muted red, and the mark assembling over it from rounded bars. **Three
scenes, twelve seconds, no assets** — everything on screen is shape nodes
and text, every motion runs through `jsr.motion`:

| Scene | Feature | What it shows |
|-------|---------|---------------|
| `01_shapes` (`wall`) | Shape nodes + shared component | `buildWall()` from `lib/animation.js`: 7×5 tiles, center-out ripple entrance (backOut pops), wave drift, per-column color journey driven by `mapRange` |
| `02_motion` (`logo`) | `jsr.motion` + absolute layout | The wall recedes and dims; rounded bars stamp in with backOut overshoot; the white asterisk (three rotated rounded bars) twists into place. Stack `positioned: {left, top}` |
| `03_sequence` (`finale`) | `sequence()` helper | The whole finale — headline stamp, underline sweep, end dot, chip — choreographed in ONE steps array; rising particle loop |

Requires **js_widget_runtime 0.4.115+** — the runtime ships `jsr.ease` /
`jsr.motion` to every scene, so no easing math is hand-rolled anywhere.

## Run

```bash
# Render the whole film
dart run ../../../packages/yoclip_cli/bin/yoclip.dart render -o motion_shapes.mp4

# Or open it in Studio
dart run ../../../packages/yoclip_cli/bin/yoclip.dart preview
```

## Test

```bash
flutter test

# Dump every probed frame as PNG for a visual golden check
YOCLIP_CAPTURE_DIR=/tmp/mc_frames flutter test
```

The test loads the scenes through `loadYoclipProjectScenes` (the house
loader: project.js lib + anchors + theme), compiles entrance / hold / late
frames into real widgets and fails on any graph or widget error. With
`YOCLIP_CAPTURE_DIR` it also saves 1920×1080 PNGs of each probe (Geneva
loaded via FontLoader, so text is real).

## Notes for authors

- All `jsr.motion` time values are **elapsed milliseconds**;
  `elapsedMs(frame, fps)` (from `lib/animation.js`) is the bridge from the
  scene's frame clock.
- `sequence(frame, fps, steps)` keeps thinking in **frames** and converts
  internally; see the doc comment in `lib/animation.js` for the step shape.
- Stack children accept `positioned: {left, top, right, bottom}` (the jsr
  contract, mirrored by the yoclip compiler).
- `backOut` / `elastic` overshoot past 1 — clamp anything you feed to
  `opacity`; `scale` and `width` can keep the snap.
- `Array.concat` does **not** flatten nested arrays more than one level —
  collect generated node groups (like the asterisk bars) with `push`, or
  the compiler silently drops the nested list.
