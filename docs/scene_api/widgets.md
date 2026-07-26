# Widget tree reference

Scenes return a JSON-like widget tree. Each node has a `type` and type-specific props. All nodes support a common set of layout and appearance props.

## Common props

| Prop | Type | Meaning |
|------|------|---------|
| `type` | `string` | Node type. Required. |
| `width`, `height` | `number` | Explicit size. |
| `alignment` | `string` | `topLeft`, `topCenter`, `topRight`, `centerLeft`, `center`, `centerRight`, `bottomLeft`, `bottomCenter`, `bottomRight`. |
| `padding` | `number` | Inner padding. |
| `offsetX`, `offsetY` | `number` | Offset after alignment. |
| `opacity` | `number` | `0` to `1`. |
| `scale` | `number` | Uniform scale around the widget center. |

## `stack`

Layers children on top of each other.

```js
{
  type: 'stack',
  fit: 'expand',   // children fill the stack bounds
  children: [
    { type: 'container', color: '#0a0a12' },
    { type: 'text', text: 'Top', alignment: 'center' },
  ],
}
```

## `row` / `column`

Layout children horizontally or vertically.

```js
{
  type: 'row',
  gap: 20,
  mainAxisAlignment: 'center',   // start | center | end | spaceBetween | spaceAround
  crossAxisAlignment: 'center',  // start | center | end
  children: [
    { type: 'text', text: 'A' },
    { type: 'text', text: 'B' },
  ],
}
```

## `container`

A styled box. Use it for backgrounds, cards, and clips.

```js
{
  type: 'container',
  width: 400,
  height: 200,
  color: '#1a1a2e',
  gradient: {
    begin: 'topLeft',
    end: 'bottomRight',
    colors: ['#8C5CF6', '#4D7EF2'],
  },
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#ffffff22',
  shadow: {
    color: '#000000',
    blur: 24,
    offsetX: 0,
    offsetY: 8,
  },
  child: { type: 'text', text: 'Inside' },
}
```

## `text`

```js
{
  type: 'text',
  text: 'Hello',
  alignment: 'center',
  style: {
    fontSize: 96,
    fontFamily: 'Geneva',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 2,
  },
}
```

## `image`

```js
{
  type: 'image',
  source: 'external:logo',   // or 'assets://images/photo.png'
  width: 240,
  height: 135,
  fit: 'contain',            // contain | cover
  alignment: 'topRight',
}
```

## `path`

Draws an SVG path or circle arc.

```js
{
  type: 'path',
  path: 'M 100 100 L 200 100 L 150 200 Z',
  color: '#22d3ee',
  strokeWidth: 4,
  progress: 0.75,   // 0..1, for animated strokes
}
```

## Nesting

Most widgets accept a `child` or `children` prop. Compose complex scenes by nesting stacks, rows, columns, containers, text, images, and paths.
