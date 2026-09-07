# fa_logo_morph

A single eight-second brand film on ONE persistent surface: the dark-glass
app icon boots with a teal scan line, grows to hero scale — and then the
terminal's underscore curls up into a note head: **in Russian solfège the
note is written «фа» — Fa**. The bar lifts off its slot, the tip
reaches right like a hand winding up, and only then the wire curls into
an `o` that blinks like the cursor it always was — and on the blink it
splits: one ring flattens into the F's accent bar, the
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
| 07 | 108–128 | The face holds: `>` eye + `_` mouth |
| 08 | 128–162 | The note: the mouth lifts, purses into a dash, and curls into a ring beside the eye — `>o` |
| 09 | 162–174 | ONE wink: `>o` → `>-` → `>o`; the eye narrows in sync |
| 10 | 174–228 | The assembly: the two arms fold into ONE vertical line — the stem; the top bar winds out of it, a new line grows from its center (the accent), the `o` drops into the `a`'s bowl |
| 11 | 212–228 | The `a`'s stem draws bottom-up in micro-segments, green at the junction → cyan at the free end |
| 16–20 | 218–240 | Settle: breathing ground glow, final teal bloom, hold |

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
  semicircular end caps. Its handoff to the stroked bar is seamless by
  construction: the stroke endpoints are inset by the cap radius, so the
  two silhouettes match to the pixel.
- **Two equal squares — the smiley's eyes** — the `>` and the `o` are
  inscribed in two invisible squares of the same size (246.6 svg units),
  64 units of daylight between them, like a smiley's `o o`. For that the
  chevron's vertex sits at 478: with the caps and the miter tip its
  visual bbox is a perfect square, and the `o`'s outer circle (r 104 +
  stroke 38 = 123.3) is inscribed in the matching square beside it. The
  squares are never drawn — they are the grid the face snaps to.
- **A face that winks, then becomes the letter** — the prompt `>_` stays
  a face: the chevron holds as the eye while the mouth lifts, purses
  into a dash and curls into an `o` beside it (`>o`). Then ONE wink —
  the ring squashes flat to a dash and pops open (a 12-frame close/open
  triangle wave on the ring's y), the eye narrowing in sync —
  `chevronHalves` takes a `pinch`: the right tip slides left over rigid
  geometry (a vertical squash once left seams on the miter). One wink,
  not two: the face twitches once, then the fold begins. Then the two arms fold into one vertical line (two
  polylines lerping onto the halves of the stem line, meeting
  cap-to-cap) that lands as the F's stem. Nothing shatters: the eye is
  the letter.
- **A bar bends into a ring** — the mouth → note `o` → split is one
  continuous stroke morph (`bendPoints`) with classic anticipation: the
  bar first lifts off its slot, then the tip reaches right like a hand
  winding up, and only then the centerline — sampled at 32 points, each
  interpolating between its place on the bar and on the circle — visibly
  curls. The round caps end up stacked on the same point, so the
  open-bar → closed-ring topology change is invisible. The same engine
  reversed flattens the ring into the F's accent bar.
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
