# Animation helpers

Motion is computed frame-by-frame inside `render(frame)`. The runtime provides a small set of easing and timing helpers; you can also write your own.

## Penner easings

Built-ins available in every scene:

```js
easeInOut(t, b, c, d)
easeOut(t, b, c, d)
easeIn(t, b, c, d)
linear(t, b, c, d)
```

- `t` — current time (frame)
- `b` — beginning value
- `c` — change in value
- `d` — duration

```js
var opacity = easeInOut(frame, 0, 1, 30);   // fade from 0 to 1 over 30 frames
```

## Normalized helpers

Helpers from `lib/animation.js` (copy them into your project) work with a `0..1` progress value:

| Helper | Signature | Meaning |
|--------|-----------|---------|
| `seg(frame, start, end)` | `(int, int, int) → number` | Clamp to `0..1` over a frame range. |
| `ease(frame, start, end, fn)` | `(int, int, int, fn) → number` | Apply easing function to a range. |
| `ei3(t)` / `eo3(t)` / `eio3(t)` | `(number) → number` | Cubic in / out / in-out. |
| `eoBack(t)` | `(number) → number` | Cubic out with overshoot. |
| `clamp(v, lo, hi)` | `(number, number, number) → number` | Clamp value. |
| `lerp(a, b, t)` | `(number, number, number) → number` | Linear interpolation. |

```js
var t = ease(frame, 10, 40, eio3);
var y = lerp(100, 300, t);
```

## Presence

Fade in, hold, then fade out.

```js
presence(frame, fadeIn, hold, fadeOut)
```

```js
var opacity = presence(frame, 20, 40, 20);   // fade in 20f, hold 40f, fade out 20f
```

## Effects

| Helper | Meaning |
|--------|---------|
| `shimmer(frame, period)` | `0..1` triangle wave. |
| `float(frame, amp, speed, phase)` | Sine wave motion. |
| `blink(frame, period)` | Toggles every `period` frames. |
| `typewriter(text, frame, start, cps)` | Reveals characters based on `cps` (chars per second). |

```js
var glow = 0.5 + 0.5 * shimmer(frame, 60);
var text = typewriter('Hello, world', frame, 15, 30);
```

## Composition tip

Keep animation values as functions of `frame` and compose them with widget `opacity`, `offsetX`, `offsetY`, and `scale` props.
