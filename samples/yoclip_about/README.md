# yoclip_about

A Yoclip V2 video project.

## Render

```bash
yoclip render --output out.mp4
```

## Screenshot

```bash
yoclip screenshot --frame 30 --output frame.png
```

## Edit scenes

Open `scenes/main.scene.js` and change the `render` function. The scene graph
uses built-in node types such as `stack`, `container`, `text`, `image`, and
`video`.
