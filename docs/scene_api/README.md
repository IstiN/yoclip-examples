# Yoclip Scene API

Yoclip films are written as plain JavaScript scenes. A project is a folder with a `yoclip.yaml` manifest, optional `project.js` layout, scene files, and assets. This reference documents the public API you use to author scenes — it is independent of the closed Yoclip Studio/CLI internals.

A project renders to MP4 video or to a PPTX slide deck from the same scenes. Mark any scene with `exportToPptx: true` and a `slides:` list (or accept the default representative frame) to include it in the deck.

## Quick start

```yaml
# yoclip.yaml
config:
  duration: auto
  fps: 30
  width: 1920
  height: 1080

scenes:
  - scenes/hello.scene.js
```

```js
// scenes/hello.scene.js
scene = {
  id: 'hello',
  duration: 90,
  render: function (frame) {
    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'text',
          text: 'Hello, yoclip',
          alignment: 'center',
          style: { fontSize: 96, color: '#ffffff' },
        },
      ],
    };
  },
};
```

## What you control

| File | Purpose |
|------|---------|
| `yoclip.yaml` | Config, theme, scene manifest, assets, audio |
| `project.js` | Shared helpers, layered scene layout, theme/text overrides |
| `lib/*.js` | Reusable animation / layout helpers |
| `scenes/*.scene.js` | Individual scenes that return a widget tree |

## Guides

- [`yoclip.yaml`](./yoclip_yaml.md)
- [`project.js`](./project_js.md)
- [Scene object](./scene.md)
- [Widget tree](./widgets.md)
- [Animation helpers](./animation.md)
- [Theme & variants](./theme.md)
- [Assets, fonts & audio](./assets.md)
- [Examples](./examples.md)
