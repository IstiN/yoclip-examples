# fa_logo_morph

A single eight-second brand film on ONE persistent surface: the dark-glass
app icon boots with a teal scan line, grows to hero scale — and then the
terminal's underscore curls up into a note head: **in Russian solfège the
note is written «фа» — Fa**. The `o` blinks like the cursor it always was,
and on a blink it splits: one ring flattens into the F's accent bar, the
other swells into the `a`'s bowl. The note becomes its own name. The F
writes itself as one round-capped stroke, the `a`'s stem draws through its
bowl with the color gliding green → cyan, and everything settles into the
finished app icon.

One scene, 240 frames at 30 fps, no assets. Every element is placed through
the shared svg→screen mapper in `lib/brand.js` with the tile center pinned
for the whole run, so the icon-to-wordmark morph stays geometrically
continuous while the scale breathes:

| Beat | Frames | What happens |
|------|--------|--------------|
| 01 | 0–40 | The icon: dark-glass rounded square, `>_` prompt, underscore pulsing like a terminal cursor |
| 02 | 40–74 | Boot scan — one teal line sweeps the icon; its edge stroke lifts as the line passes |
| 05–06 | 75–110 | Hero zoom (easeOutExpo) + a soft teal cue band breathing over the glyph row |
| 07 | 108–122 | Morph: chevron arms split away and die into blue streaks |
| 08 | 122–164 | The note: the underscore bends into a ring (`o`), drifts center stage and blinks ×2 |
| 09 | 164–196 | The split: ring → F accent (flattening), ring → `a` bowl (swelling); the F writes itself |
| 11 | 192–208 | The `a`'s stem draws in micro-segments, green → cyan |
| 16–20 | 204–240 | Settle: breathing ground glow, final teal bloom, hold |

## Why it's a good engine test

- **One mapper, one anchor** — `setMapper(k, ax, ay, sx, sy)` pins the tile
  center to screen center for the whole film; only `k` animates (icon size →
  hero zoom), and every child keeps drawing through the same
  `brandToScreen`, so the icon, the morph and the wordmark share one
  composition.
- **Miter without a notch, caps without blobs** — the chevron is two
  miter-halves (`chevronHalves`): one filled `>` split along the exact
  miter edge, so the vertex has no gap and no notch (two butt-capped
  strokes meeting at a vertex always leave both). The halves share the
  miter segment vertex-for-vertex — which is also the seam the morph pulls
  apart — and the free ends get semicircular caps built along each arm's
  outward normal (`capArc`), so the terminals round like real strokes.
- **Gradient capsules** — the teal underscore tiles its gradient as square
  strips (radius 0 — any per-strip rounding reads as beads) closed by
  semicircular end caps.
- **A bar bends into a ring** — the underscore → note `o` → split is one
  continuous stroke morph (`bendPoints`): the centerline is sampled at 32
  points, each interpolating between its place on the bar and on the
  circle — the wire visibly curls. The round caps end up stacked on the
  same point, so the open-bar → closed-ring topology change is invisible.
  The same engine reversed flattens the ring into the F's accent bar.
- **Real letterforms** — the F is ONE round-capped, round-joined stroke
  path (`fPathNode`): up the stem, right across the bar — rounded
  terminals, rounded elbow, not a single seam. The `a`'s stem draws in 8
  micro-segments whose colors step green → cyan, so the letter is one
  continuous gradient instead of two flat anchors.
- **Persistent stage** — the tile never shatters or leaves: one dark-glass
  rounded rect carries the film from icon boot to finished wordmark.

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
