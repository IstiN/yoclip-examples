# `yoclip.yaml` reference

The manifest declares render settings, the scene list, theme, assets, fonts, and audio.

## Minimal manifest

```yaml
config:
  duration: auto
  fps: 30
  width: 1920
  height: 1080

scenes:
  - scenes/intro.scene.js
```

## `config`

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `duration` | `int` or `auto` | `90` | Total timeline length in frames. `auto` computes it from the last scene end. |
| `fps` | `int` | `30` | Frames per second. |
| `width` | `int` | `1920` | Render width in pixels. |
| `height` | `int` | `1080` | Render height in pixels. |
| `background` | `string` | `#000000` | Background color. |

## `theme`

The merged theme is exposed to scenes as the global `yoclipTheme`.

```yaml
theme:
  colors:
    background: '#0a0a12'
    surface: '#1a1a2e'
    text: '#ffffff'
    textMuted: '#a1a1aa'
    primary: '#8c5cf6'
    accent: '#22d3ee'
  font:
    family: Geneva
  sizes:
    h1: 96
    h2: 64
    body: 32
```

Use the helper functions `yoclipColor`, `yoclipColorA`, `yoclipSize`, and `yoclipFont` to read theme values with fallbacks.

## `scenes`

Ordered list of scene files used by Studio. The actual timing can be overridden by `project.js`.

```yaml
scenes:
  - scenes/00_intro.scene.js
  - scenes/01_hero.scene.js
```

## `external_assets`

Files outside the project referenced in scenes as `external:<id>`.

```yaml
external_assets:
  logo:
    type: image
    path: assets/images/yoclip_logo.svg
```

Supported types: `image`, `svg`, `video`.

## `fonts`

Custom TTF fonts loaded for preview and export.

```yaml
fonts:
  - family: Playfair Bold
    path: assets/fonts/PlayfairDisplay-Bold.ttf
```

Reference them from scenes via `style.fontFamily`.

## `audio`

Composition-level audio tracks.

```yaml
audio:
  tracks:
    - source: assets://audio/music.mp3
      start: 0
      volume: 0.5
```

Sources may be `assets://...`, `assets/...`, or project-relative/absolute paths.

## `texts`

Language dictionaries exposed as `yoclipTexts`, deep-merged over any `project.js` texts.

```yaml
texts:
  en:
    intro:
      title: Hello
  ru:
    intro:
      title: Привет
```

## `variants`

Variants produce localized or branded cuts from the same scenes.

```yaml
variants:
  - id: dark_en
    params: { lang: 'en' }
  - id: light_ru
    params: { lang: 'ru' }
    theme:
      colors:
        background: '#f4f4f8'
```

A variant can also retarget resolution with `width`/`height`.
