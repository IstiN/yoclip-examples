# Scene object

A scene file assigns a scene object to the global `scene` variable.

```js
scene = {
  id: 'intro',
  duration: 90,
  from: 0,
  description: 'Ring draws in, logo snaps on, tagline types out.',
  voicePrompts: { en: 'Your video, scene by scene.' },
  timeline: { label: 'Intro', color: '#7c3aed' },
  render: function (frame) {
    return { type: 'stack', fit: 'expand', children: [] };
  },
};
```

## Fields

| Field | Type | Meaning |
|-------|------|---------|
| `id` | `string` | Unique scene identifier. |
| `duration` | `int` | Scene length in frames. |
| `from` | `int` | Absolute start frame. Ignored when `project.js` provides an anchored start. |
| `description` | `string` | Human/AI-readable plan. Not rendered. |
| `voicePrompts` | `object` | Map of language → voiceover prompt. Not rendered. |
| `timeline` | `object` | `{ label, color, lane }` metadata for Studio timeline. |
| `render` | `function` | Returns the widget tree for a given local frame. |

## `render(frame)`

`frame` is the local scene frame, starting at `0`. The function must return a widget tree object. All drawing happens through this tree.

```js
render: function (frame) {
  return {
    type: 'stack',
    fit: 'expand',
    children: [
      { type: 'image', source: 'external:logo', alignment: 'center' },
      {
        type: 'text',
        text: 'Hello',
        alignment: 'center',
        style: { fontSize: 96, color: '#ffffff' },
      },
    ],
  };
}
```

## Built-ins available in scenes

- `scene` — the scene object itself.
- `yoclipTheme` — merged theme from `yoclip.yaml` and `project.js`.
- `yoclipVariant` — active variant object `{ id, params }`.
- `yoclipFormat` — `{ width, height, aspect, orientation }`.
- `yoclipTexts` — merged text dictionaries.
- Penner easings: `easeInOut`, `easeOut`, `easeIn`, `linear` with signature `(t, b, c, d)`.

Helpers from `project.js → lib` are also available as globals.
