# Assets, fonts & audio

Assets live in the project `assets/` folder or are referenced as external files.

## Asset URIs

| Scheme | Example | Resolves to |
|--------|---------|-------------|
| `assets://audio/click.mp3` | `assets://images/logo.png` | `<project>/assets/images/logo.png` |
| `assets/images/logo.png` | `assets/images/logo.png` | `<project>/assets/images/logo.png` |
| `external:<id>` | `external:logo` | Path from `yoclip.yaml → external_assets` |

## Images

Use `external:` for files outside the project and `assets://` for committed assets:

```js
{
  type: 'image',
  source: 'external:logo',
  width: 240,
  height: 135,
  fit: 'contain',
}
```

Supported formats: PNG, JPG, SVG, GIF, WebP.

## Fonts

Declare custom fonts in `yoclip.yaml`:

```yaml
fonts:
  - family: Playfair Bold
    path: assets/fonts/PlayfairDisplay-Bold.ttf
```

Then reference them by family name:

```js
{
  type: 'text',
  text: 'Title',
  style: { fontFamily: 'Playfair Bold', fontSize: 96 },
}
```

## Audio

Audio tracks are declared in `yoclip.yaml` and mixed at render time:

```yaml
audio:
  tracks:
    - source: assets://audio/music.mp3
      start: 0
      volume: 0.5
    - source: assets://audio/voiceover.wav
      start: 90
      volume: 1.0
```

`start` is in composition frames. `volume` defaults to `1.0`.

## External assets

Use `external_assets` for large files you do not want in version control:

```yaml
external_assets:
  logo:
    type: image
    path: /Users/me/Downloads/logo.svg
  background_video:
    type: video
    path: /Users/me/Downloads/background.mp4
```

Video assets are decoded to frame sequences in `.yoclip_cache/`.
