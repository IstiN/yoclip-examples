# yoclip_motion_shapes

A tiny playground project that exercises the newest yoclip scene features
end to end — **three scenes, twelve seconds, no assets**:

| Scene | Feature | What it shows |
|-------|---------|---------------|
| `01_shapes` | Shape nodes (jsr 0.4.115) | `rect` / `circle` / `line` / `polygon` in a 2×2 grid, each card popping in via `jsr.motion.tween` |
| `02_motion` | `jsr.motion` builtins (jsr 0.4.114) | A bar race with three visible easing curves (`linear` vs `easeInOutCubic` vs `backOut`), a `wave`-driven orbiting dot, and a `mapRange` percent counter |
| `03_sequence` | `sequence()` helper (`lib/animation.js`) | One call choreographs the whole build: title, three staggered stat cards, footer — every timing lives in a single steps array |

Requires **js_widget_runtime 0.4.115+** — the runtime ships `jsr.ease` /
`jsr.motion` to every scene, so no easing math is hand-rolled anywhere here.

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
```

The test loads every scene through the QuickJS runtime, compiles it with
`YoclipWidgetRenderer` at entrance / hold / late frames, and fails on any
graph or widget error — the fastest way to verify runtime + shapes + motion
stay compatible after an upgrade.

## Notes for authors

- All `jsr.motion` time values are **elapsed milliseconds**;
  `elapsedMs(frame, fps)` (from `lib/animation.js`) is the bridge from the
  scene's frame clock.
- `sequence(frame, fps, steps)` keeps thinking in **frames** and converts
  internally; see the doc comment in `lib/animation.js` for the step shape.
- Shape props are pinned in the skill (`skills/yoclip/SKILL.md` → node
  types): `rect` stroke draws inside, `line` takes `x1/y1/x2/y2`,
  `polygon.points` is a flat `[x, y, x, y, …]` array.
