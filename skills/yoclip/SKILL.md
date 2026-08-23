# Yoclip Skill

## Overview

Yoclip is a CLI-first video generation framework. A video project is a plain
folder with a `yoclip.yaml` manifest, an optional `project.js` layout, JavaScript
scenes, and assets. The same Dart core (`yoclip_core`) powers the `yoclip` CLI,
headless render, golden screenshots, and the **Yoclip Studio** desktop app
(`packages/yoclip_player`). Scenes render through a QuickJS runtime
(`YoclipJsRuntime`) into a JSON node tree that Dart compiles to Flutter widgets —
so preview, export and goldens are pixel-identical.

Workflow:

1. Create or edit a project folder (`yoclip.yaml`, `project.js`, `scenes/*.scene.js`, `lib/`).
2. Launch **Yoclip Studio** (`flutter run -d macos` in `packages/yoclip_player`,
   or open a folder from inside the app) — JS scenes reload automatically on
   file save via watchers (no manual refresh, no keybinding).
3. Export to MP4 from the Studio **Export** dialog (preset + quality + fps) or
   `yoclip render --output video.mp4`.
4. Capture golden frames with
   `yoclip screenshot --project . --frame <n> --output frame.png`.

> The legacy Dart-first composition API still exists for old projects, but all
> new work uses the V2 JS-scene architecture below. The Dart examples in
> `skills/yoclip/examples/*.dart` are legacy and are kept for reference only.

---

## Project structure

```
my_video/
├── yoclip.yaml              # config, theme, scene manifest, external assets, audio, subtitles
├── project.js               # optional: shared lib, theme overrides, layered/anchored scene layout
├── lib/                     # shared JS helpers (eased math, etc.), loaded before scenes
│   └── animation.js
├── scenes/
│   ├── intro.scene.js
│   └── ...
├── assets/
│   ├── audio/
│   ├── images/
│   └── fonts/
└── .yoclip_cache/           # decoded frames, resolved assets
```

### `yoclip.yaml`

```yaml
config:
  duration: auto        # 'auto' = timeline length computed from scenes;
                        # an explicit frame count (e.g. 4170) still works
  fps: 30
  width: 1920
  height: 1080
  background: '#0a0a12'

theme:                  # project-wide theme, exposed to JS as `yoclipTheme`
  colors:
    accent: '#22d3ee'
  headline:
    fontSize: 96
    fontFamily: Geneva
    fontWeight: 700

project_js: project.js  # optional layout file (see below)

fonts:                  # custom fonts loaded into preview, screenshots, export
  - family: Playfair Bold
    path: assets/fonts/PlayfairDisplay-Bold.ttf

scenes:                 # ordered manifest used by Studio's Scenes panel
  - scenes/intro.scene.js

external_assets:        # files outside the project, referenced as external:<id>
  logo:
    type: image
    path: assets/images/yoclip_logo.svg

audio:
  tracks:
    - source: assets://audio/click_loop_drive.mp3
      start: 0
      volume: 0.8

subtitles:              # optional burn-in tracks (srt/vtt) — Studio export only
  - id: en
    path: captions/en.srt
    label: English
```

- `duration` — total timeline length in frames. `auto` (recommended) resolves
  to `max(scene.from + scene.duration)` once scenes are loaded
  (`resolveYoclipAutoDuration`), so editing a scene's duration never desyncs
  the export; an explicit frame count still works but must cover the last
  scene's end. Defaults to 90 when omitted; `background` defaults to `#000000`.
- `scenes` — ordered list used by Studio. The actual timeline order/timing comes
  from each scene's `from`/`duration` or, when present, from `project.js` —
  which then **fully replaces** this list: scenes absent from `project.js` are
  not loaded at all.
- `plugins` — list of plugin paths parsed from yaml but currently unused.
- `external_assets` — large files kept outside the repo. Referenced in JS as
  `external:<id>`. Image/svg/video are supported. `path` may be a glob
  (`*`, `?`, `**`) or a `regex:` pattern may be given instead; each matched
  file becomes its own asset with a generated id
  (`<parentId>/<relativePathWithoutExtension>`).
- `fonts` — custom TTFs (one entry per font file: family + path) loaded into
  Studio preview, CLI screenshots and export. Scenes reference them via
  `style.fontFamily`.
- `audio` — composition-level tracks. Sources resolve as `assets://...`,
  `assets/...` (no scheme), or any project-relative/absolute path. `start` is
  in composition frames; `volume` defaults to 1.0.
- `subtitles` — `srt`/`vtt` files parsed by `yoclip_core` and burned into the
  **Studio export** only (CLI `yoclip render` has no subtitle logic; the
  preview does not show them).
- `texts` — optional language dictionaries exposed to scenes as `yoclipTexts`,
  deep-merged OVER the `project.js` dictionaries (yaml wins).
- `overlay` — optional static node rendered on top of every scene (an
  alternative to an overlay-layer scene in `project.js`).

### `project.js` (layers, anchors, shared lib, theme overrides)

When scenes need to crossfade, share helpers, or sit on background/overlay
layers, declare the layout in `project.js` instead of relying on `from`:

```js
project = {
  lib: 'lib/animation.js',          // loaded once before every scene; its globals
                                    // (seg, ease, presence, …) are usable in scenes.
                                    // May also be a LIST of paths, concatenated in order
  theme: { colors: { accent: '#22d3ee' } },  // deep-merged OVER yoclip.yaml theme
  texts: { en: { intro: { title: 'Hello' } } },  // dictionaries → yoclipTexts
  scenes: [
    { path: 'scenes/background.scene.js', layer: 'background', start: 0, duration: 4170 },

    { path: 'scenes/00_intro.scene.js',  layer: 'content', start: 0 },
    'scenes/01_hook.scene.js',           // plain-string entry (content layer, module timing)
    { path: 'scenes/02_scenes.scene.js', layer: 'content', start: { after: 'hook',  offset: -6 } },

    { path: 'scenes/logo.scene.js',      layer: 'overlay',  start: 0, duration: 4170 },
  ],
};
```

- **Layers** are sorted `background → content → overlay`, then rendered in that
  order; unknown layer names sort as `content`. Use `background` for
  full-length backdrops, `overlay` for watermarks that sit on top of everything.
- **Anchors**: `start: { after: '<sceneId>', offset: -6 }` places a scene
  relative to another's start+duration. A small negative `offset` makes neighbours
  crossfade. Anchors must reference a scene declared earlier in the list.
- When `project.js` exists it **fully replaces** the `yoclip.yaml → scenes`
  list — a scene not declared here is never loaded. A scene module's own
  `duration`/`from` default to 90 / 0 when omitted.
- The loader (`loadYoclipProjectScenes`) deep-merges
  `yoclip.yaml theme` ← `project.js theme`, resolves anchors to absolute `from`
  frames, and sorts by layer.

---

## JavaScript scenes

A scene file assigns a scene object to the global `scene`:

```js
scene = {
  id: 'intro',
  duration: 90,
  from: 0,                              // absolute start frame (ignored when
                                        // project.js provides an anchored start)
  description: 'Ring draws in, logo snaps on, tagline types out.',  // optional
  voicePrompts: { en: 'Your video, scene by scene.', ru: '...' },   // optional
  timeline: { label: 'Intro', color: '#7c3aed', lane: 'video' },
  render: function(frame) {             // `frame` is the LOCAL frame of the scene
    return {
      type: 'stack', fit: 'expand',
      children: [
        { type: 'image', source: 'external:logo', width: 240, height: 135,
          alignment: 'topRight' },
        { type: 'text', text: 'Hello', alignment: 'center',
          style: { fontSize: 96, color: '#ffffff', fontFamily: 'Geneva' } },
      ],
    };
  },
};
```

- `description` — optional plain string: the plan of what happens in the
  scene (human/AI-authored, any language). It drives the goal → scenario →
  scenes workflow and is shown/editable in the Studio Scenes panel.
- `voicePrompts` — optional map of language code → voiceover prompt text,
  keyed by the project's variant/texts languages (`en`, `ru`, …). Reading a
  prompt for a language falls back: exact language → `'en'` → first available
  key (`YoclipScene.voicePrompt(lang)`).
- Both are **metadata only — not rendered, not played, not mixed into audio**.
  They are plan data plus Studio display/editing and agent context today, and
  the source for future TTS audio and subtitle generation.

Every scene (with or without a lib) gets engine builtins pre-declared:
`var scene = null` and Penner-style easings `easeInOut`, `easeOut`, `easeIn`,
`linear` — all with signature `(t, b, c, d)` (time, begin, change, duration).

### Theme (`yoclipTheme`)

The merged project theme is injected as a global `yoclipTheme`. Use it to keep
scenes consistent and overridable in one place. Beyond `colors`, the theme can
carry a type scale and font family:
```yaml
theme:
  colors:
    primary: '#7c3aed'
    panel: '#2a2a36'        # custom aliases are first-class — name anything
  font:
    family: Geneva
  sizes:
    h1: 96
    caption: 28
```

Reference them from scenes through helpers (defined in the about sample's
`lib/animation.js`; copy them into your own lib):

```js
yoclipColor('panel', '#2a2a36')     // theme color with hex fallback
yoclipColorA('primary', 0x80)       // same color at 50% alpha (AARRGGBB);
                                    // optional 3rd arg = hex fallback
yoclipSize('caption', 28)           // theme.sizes.caption with fallback
yoclipFont()                        // theme.font.family with Geneva fallback
```

One YAML edit then recolors/rescales every scene, and variants (see below) can
override any key per theme/language. Keep hardcoded hex / fontSize / fontFamily
out of scenes — put them in the theme and reference by alias.

> **Important — always provide a hex fallback for `yoclipTheme.colors.*`.**
> `yoclip_core` ships **no default colors**, so any `colors.*` the project does
> not define is `undefined` in the **headless/CLI render and export**, even though
> Studio may show a value. An `undefined` color makes fills transparent and
> gradients collapse (only `boxShadow` glow remains), which looks like a
> "missing background". Write theme colors as:
>
> ```js
> var primary = yoclipTheme.colors.primary || '#7c3aed';
> ```
>
> This keeps Studio and exported MP4 identical. The cleanest fix is to define the
> full palette once in `project.js → theme.colors`
> (`background, surface, text, textMuted, primary, primaryLight, accent`).

### Render format (`yoclipFormat`) and variant resolutions

Scenes always see the effective render format as a global:

```js
yoclipFormat = { width, height, aspect, orientation }
// orientation: 'landscape' | 'portrait' | 'square'
```

Alongside it, variant `params` reach scenes as the `yoclipVariant` global
(e.g. `yoclipVariant.lang` drives language lookups), and the merged text
dictionaries (`project.js` + `yoclip.yaml → texts:`) as `yoclipTexts`.

A variant can **retarget the render resolution** by declaring `width`/`height`
in `yoclip.yaml` — the whole project then re-renders natively at that aspect
(no letterboxing), and scenes adapt their layout via `yoclipFormat`:

```yaml
variants:
  - id: shorts_en
    label: 'Shorts · EN'
    width: 1080            # <- retargets the render to vertical
    height: 1920
    params: { lang: 'en' }
    theme: { colors: { ... } }
```

```js
var portrait = (typeof yoclipFormat !== 'undefined' && yoclipFormat
  && yoclipFormat.orientation === 'portrait');
width: portrait ? 760 : 640,
offsetY: portrait ? -260 : -70,
```

The `about` sample demonstrates this: `shorts_en` renders the same scenes at
1080x1920, with `yoclipIsPortrait()` (lib/animation.js) branching the intro
and CTA layouts. When a variant sets a resolution, Studio auto-selects the
matching export preset so the preview shows the variant full-frame.
Variants without `width`/`height` keep the project's base resolution; the
toolbar presets (Shorts/Square) only affect the **export** frame — a
landscape master exported as Shorts is letterboxed by design. If you want a
true vertical cut, make a variant with a resolution and adapt the scenes.

### Shared lib helpers (`lib/animation.js`)

The `about` sample ships a reusable helper lib; declare it via `project.js → lib`
and its globals are available in every scene. Build scenes from these instead of
hand-rolling easing math:

| Helper | Purpose |
|--------|---------|
| `seg(frame, start, end)` | clamped linear 0..1 progress between two frames — the workhorse |
| `ease(frame, start, end, fn)` | `seg` shaped by a normalized easing fn |
| `eo3, ei3, eio3, eo4, eio4, eoExpo, eoBack, eoElastic` | normalized (0..1→0..1) easing curves |
| `lerp(a, b, t)`, `clamp(v, lo, hi)` | scalar helpers |
| `presence(frame, fadeIn, hold, fadeOut)` | opacity fade-in / hold / fade-out |
| `fadeIn(frame, dur)`, `fadeOut(frame, end, dur)` | simple fades |
| `riseIn(frame, dur, from)` | vertical slide-in offsetY → 0 |
| `pop(frame, start, dur)` | `{ scale, opacity }` overshoot entrance |
| `float(frame, amp, speed, phase)` | sine bob around 0 |
| `spin(frame, degPerFrame)` | constant rotation in degrees |
| `shimmer(frame, period)` | 0..1 triangle wave for pulsing glows |
| `counter(frame, start, dur, from, to)` | animated integer counter |
| `typewriter(text, frame, start, cps)` | returns first N chars, typing at `cps` chars/sec (fps 30) |
| `staggerItem(frame, index, start, delay, dur)` | per-item 0..1 stagger |
| `blink(frame, period)` | 0/1 square wave |
| `yoclipOrientation()` | 'landscape' \| 'portrait' \| 'square' from `yoclipFormat` |
| `yoclipIsPortrait()` | true when rendering a vertical frame (variant resolution) |
| `yoclipVariantParams()` | active variant's `params` ({} when none selected) |
| `yoclipLang()` | active language — variant param `lang`, default `'en'` |
| `yoclipT(section)` | dictionary section for the active language from `yoclipTexts` (falls back to English, then `{}` — keep an inline `|| 'English fallback'` on lookups) |
| `yoclipLogoSource()` | logo asset for the active variant (`logo` param, default `external:logo`) |
| `yoclipIsLight()` | true when the theme background is light (swap to dark-on-light palettes) |

A project's own `lib/*.js` can add more; list them in `project.js → lib`.

### Node types

Produced by `render()` and compiled to Flutter widgets by the unified
`YoclipWidgetRenderer` (the one renderer for preview, export, Studio edit
mode and PPTX — hooks plug in via `overrides` / `nodeDecorator` /
`hideText`).

| Type | Purpose | Key props |
|------|---------|-----------|
| `stack` | layer children | `children`, `fit: 'expand' \| 'loose'` |
| `row` | horizontal layout | `children`, `mainAxisAlignment`, `crossAxisAlignment` |
| `column` | vertical layout | `children`, `mainAxisAlignment`, `crossAxisAlignment` |
| `container` | box / fill / gradient / border / shadow / clip | `color`, `gradient`, `borderColor`, `borderWidth`, `borderRadius`, `shadow`/`shadows`, `clip`, `child` |
| `text` | text | `text`, `style`, `textAlign` |
| `image` | image / external image | `source`, `fit`, `width`, `height` |
| `path` | SVG path (stroked, drawable) | `path`, `progress`, `color`, `strokeWidth`, `width`, `height` |
| `video` | external video clip | `source`, `fit`, `startFrame`, `speed`, `sourceStart`, `reverse` |
| `audio_player` | frame-driven audio playback (zero-size) | `src`, `playing`, `volume`, `loop`, `seekToMs` |
| `absolute_fill` / `fill` | absolute color fill layer | `color`, `child` |

`volume`/`muted` on a `video` node are **not render props** — the compiler and
`AnimVideo` never see them. They are consumed only by the audio resolver, only
for `external:` videos, and only affect the mixed audio track; the values are
sampled from the render tree **at frame 0** (per-frame animation is ignored).
Preview video is silent either way (decoded frames only).

An optional `id` prop on any node drives Studio selection and edit-mode.

**Props that apply to ANY node** (wrapped by the compiler, `absolute_fill`
included): `opacity`, `width`, `height`, `padding`, `margin`, `alignment`,
`offsetX`, `offsetY`, `scale`, `rotation`, `rotateX`, `rotateY`, `blur`.
Each of them is also accepted **inside `style`** (CSS habit) — node level
wins when both are set.

**Prop vocabularies:**

- `alignment` (and gradient `begin`/`end`/`center`): `topLeft`, `topCenter`,
  `topRight`, `centerLeft`, `center`, `centerRight`, `bottomLeft`,
  `bottomCenter`, `bottomRight`.
- `mainAxisAlignment`: `start` (default) / `end` / `center` / `spaceBetween` /
  `spaceAround` / `spaceEvenly`; `crossAxisAlignment`: `start` / `end` /
  `center` (default) / `stretch` / `baseline`.
- `textAlign`: `left` / `right` / `center` (default) / `justify`. Canonical
  on the text node; the style-level aliases `style.textAlign` /
  `style.alignment` (CSS habit) are also accepted.
- image/video `fit`: `cover` / `contain` (default) / `fill` / `fitWidth` /
  `fitHeight` / `none`.
- `fontWeight`: int 100–900 or strings `'normal'`/`'bold'`/`'100'`…`'900'`.
- `padding` is uniform only (`EdgeInsets.all`) — no per-side padding.
- `margin` is outer space around the node: a number or a
  `{top, right, bottom, left}` map (per-side). Also accepted inside `style`.
- A gradient with fewer than 2 valid colors is silently dropped.

- `blur: <sigma>` applies a Gaussian blur (ImageFiltered) — the editorial
  "blurred fill" look: a scaled, blurred copy of a photo behind a sharp framed
  print (see `blurredFill()` in the MON AMOUR project).
- An `absolute_fill` **without `color` is transparent** — use it as a
  full-frame layout surface for a `child` (gradients, vignettes). With a
  `color` plus `opacity` it is the standard fade-to-black / flash-cut /
  scrim overlay.
- ⚠️ The root scene `stack` uses `fit: 'expand'`, whose **tight constraints
  stretch any child without `alignment` to the full frame** and break
  `offsetX`/`offsetY` positioning. Always add `alignment: 'center'` (or any
  alignment) to positioned/sized nodes — texts, rules, framed prints.

**`container`** detail:

```js
{
  type: 'container',
  width: 200, height: 120, borderRadius: 24,
  color: '#15131f',                                   // solid fill, OR
  gradient: {                                         // linear (default) or radial
    colors: ['#a78bfa', '#7c3aed'],
    stops: [0.0, 1.0],
    begin: 'topLeft', end: 'bottomRight',             // linear
    // type: 'radial', center: 'center', radius: 0.6,  // radial; radius defaults to 0.5
  },
  borderColor: '#2a2a36', borderWidth: 1.5,
  shadow: { color: '#807c3aed', blur: 30, offsetX: 0, offsetY: 12, spread: 0 },  // or shadows: [...]
  clip: true,                                         // clips child to borderRadius
  child: { /* any node */ },
}
```

> ⚠️ A `boxShadow` on a `container` whose `child` is a `path` currently hides the
> container's own fill (only the glow shows). For a glowing icon button, put the
> glow on a separate layer behind a solid filled circle (see the chat send button
> in `samples/yoclip_about/scenes/07_chat.scene.js`).

**`text.style`** detail: `fontSize`, `color`, `fontFamily`, `fontWeight`,
`fontStyle: 'italic'`, `letterSpacing`, `lineHeight`, `shadows`/`shadow`
(`[{ color, blur, offsetX, offsetY }]`). `gradient` paints the glyphs with a
linear/radial gradient instead of a flat `color` (brand-style highlighted
keywords) — same shape as container gradients
(`{ colors: [...], stops?, begin, end }` or `type: 'radial'`); the solid
`color` then only acts as the alpha mask, so keep it opaque.

**`path`** detail: `path` is an SVG path string; `progress` (0..1, default 1.0)
animates the draw length; `color` (default white) / `strokeWidth` (default 4.0)
style the stroke; `width`/`height` set the layout box. Paths are **stroked,
not filled**, with round caps/joins, auto-scaled to the box preserving aspect
ratio. Supported commands: `M/L/H/V/C/S/Q/T/Z/A` (absolute and relative).
`A rx ry x-axis-rotation large-arc-flag sweep-flag x y` draws an elliptical
arc, approximated by cubic segments (e.g. a near-full circle ring:
`M 260 30 A 230 230 0 1 1 259.9 30`). Invalid path data draws nothing.

`source` values for `image`/`video`:

- `external:<id>` — resolves to an `external_assets` entry.
- A plain path resolves as a Flutter asset.
- `assets://path` is **audio-only** — the image/video compiler never strips
  the scheme, so don't use it here.

---

## Fonts

Use the bundled **Geneva** so preview, export and goldens match:

```js
style: { fontSize: 96, color: '#ffffff', fontFamily: 'Geneva', fontWeight: 700 }
```

`packages/yoclip_core/fonts/Geneva.ttf` is bundled with `yoclip_core`. Forgetting
`fontFamily: 'Geneva'` in headless render produces tofu boxes. For custom fonts,
declare them in `yoclip.yaml` — they load into preview, CLI screenshots and
export automatically (project-level, one entry per font file: family + path;
scenes reference `style.fontFamily`):

```yaml
fonts:
  - family: Playfair Bold
    path: assets/fonts/PlayfairDisplay-Bold.ttf
  - family: Playfair Italic
    path: assets/fonts/PlayfairDisplay-Italic.ttf
```

---

## Audio

Three sources: composition tracks (`yoclip.yaml`), scene-level tracks, and
external-video audio (extracted with `ffmpeg` and mixed in at the video's
`startFrame`). Set `muted: true` on a `video` node to drop its sound entirely
(e.g. when a music track carries the film), or `volume: 0..1` to duck it.
`sourceStart: <frame>` starts playback mid-clip — e.g. split one video across
two scenes by playing `sourceStart: 0` and `sourceStart: <half>` (note:
extracted audio is not seeked, so mute clips that start mid-source).
`reverse: true` plays backwards from `sourceStart` (clamped at frame 0) — pair
a forward and a reversed segment of the same clip for a "boomerang" scene.
The source frame is `sourceStart - clipFrame * speed`, where `clipFrame`
counts from the node's `startFrame` — so a reversed segment that starts
mid-scene MUST set `startFrame` to its first scene frame, otherwise
`clipFrame` counts from the scene start and the source clamps to frame 0
(the segment renders as a static image).

**Scene-level tracks** are declared on the scene object; their `start` is
scene-local (the resolver adds `scene.from`). Unlike composition tracks they
**cannot carry an envelope** — only `{source, start, volume}`:

```js
scene = {
  id: 'hook',
  duration: 150,
  audio: [ { source: 'assets://audio/swoosh.mp3', start: 12, volume: 0.6 } ],
  render: function(frame) { /* ... */ },
};
```

**Composition tracks** support a volume/pause **envelope** — keyframes in
absolute composition frames, so a music bed can duck under a voice-over:

```yaml
audio:
  tracks:
    - source: assets://audio/bed.mp3
      start: 0
      volume: 0.8            # base level (used until the first keyframe)
      envelope:
        - frame: 3000        # absolute composition frame
          volume: 0.2        # target level at/after this keyframe
          ramp: 60           # frames to fade in (0 = abrupt step;
                             # `rampFrames` is also accepted)
        - frame: 3900
          volume: 0.8
          ramp: 90
        - frame: 4050
          pause: true        # pause the track (omit `volume` to leave it)
```

The envelope is honored by the Studio preview and **by both export paths**:
volume ramps are baked into the MP4 mix (`pause` keyframes remain
preview-only — export prints a note and keeps the volume ramps). The CLI
passes the envelope through `YoclipAudioTrackSpec.encode()`
(`path,volume,startFrame,f:v:ramp;f:pause`), and the Studio export hands
it to the plugin encoder directly. `assets://audio/*.mp3` is fully
supported; other formats depend on the native encoder. Studio shows each
track on its own timeline lane with
mute/solo and a master mute (the "Delete clip" menu action is a no-op).
Preview audio tracks loop. The resolver re-reads `yoclip.yaml` from disk at
resolve time, so track edits apply without touching Dart state. Verify muxed
audio with `ffprobe video.mp4`.

**`audio_player` node** — the third, code-driven way to place sound. Unlike
the two declarative track lists above, its props are ordinary JS values
computed inside `render(frame)`, so play/pause, volume rides and seeks can
depend on anything the frame knows:

```js
{
  type: 'audio_player',
  src: 'assets://audio/hit.mp3',
  playing: frame >= 30 && frame < 90,   // play/pause from code
  volume: 0.8 * fadeOut(frame, 70, 20), // per-frame volume → fades in code
  loop: false,                          // preview loops; export ignores it
  seekToMs: null,                       // seeks when the value CHANGES
}
```

- In the **Studio preview** a real player is created per node and reconciled
  every frame (play/pause/volume/loop, seek on `seekToMs` change).
- At **export** the resolver samples every frame of the scene and converts
  the node into a regular timeline `AudioTrack`: start = first playing
  frame, pause/resume and volume envelope points on change. The MP4 mix
  therefore matches the preview without you touching the audio file.

**Which one when:** composition yaml tracks for the static music bed and
its ducking envelope; scene `audio: [...]` entries for one-off stingers on a
scene (`start` is scene-local, no envelope); `audio_player` when timing or
level must be computed in JS — character-by-character sync, conditional
hits, fades driven by the same easing helpers as the visuals.

---

## Export

Export is configured independently for **resolution (preset)**, **video
quality**, **audio quality**, and **frame rate** — so a 4K/60fps export is the
same timeline at higher resolution and smoother motion, not a longer video.

**Presets** (`YoclipExportPreset`):

| id | label | resolution |
|----|-------|------------|
| `youtube_1080` | FHD 1080p | 1920×1080 |
| `qhd_1440` | 2K 1440p | 2560×1440 |
| `youtube_4k` | 4K 2160p | 3840×2160 |
| `uhd_8k` | 8K 4320p | 7680×4320 |
| `shorts_1080` | Shorts 1080p | 1080×1920 |
| `square_1080` | Square 1080p | 1080×1080 |

A **custom** resolution is also supported from the export dialog.

**Video quality** (`YoclipExportQuality`): `low` / `medium` / `high` multiply the
base H.264 bitrate (`width × height × fps × 0.12`) by `0.5 / 1.0 / 1.5`.
**Audio quality** (`YoclipAudioQuality`): `low` / `medium` / `high` = AAC
96 / 128 / 192 kbps, set independently from video quality. **Frame rate** is
chosen separately (24 / 30 / 60; any other value falls back to 30).

**Encoding queue**: exports run one at a time; new exports (this project or
another) are queued. The export progress dialog shows percent, an animated ring,
ETA, target folder, and lets you collapse it into a compact queue bar.

**Subtitles burn-in**: tracks declared in `yoclip.yaml → subtitles` are rendered
into the MP4 — **Studio export only** (CLI renders carry no subtitles, and the
preview doesn't show them).

**Rasterization**: a same-aspect export (e.g. 1080p → 4K) re-rasterizes
vector/text content at native export fidelity; a mismatched aspect
(Shorts/Square from a landscape master) letterboxes with `BoxFit.contain`.

CLI:

```bash
yoclip init my_video                                        # scaffold a new V2 project
yoclip preview --project .                                  # launch Studio for a project
yoclip render --project . --output video.mp4
yoclip render --project . --output video.mp4 --preset youtube_4k --variant shorts_en
yoclip render --project . --output video.mp4 --clean-cache     # delete raw frame cache after render
yoclip render --project . --output frames/                  # non-.mp4 output → PNG sequence
yoclip screenshot --project . --frame 3200 --output frame.png   # one golden frame
yoclip screenshot --project . --at 1.5 --scene intro --output frame.png
```

- `render` flags: `--output/-o`, `--project/-C`, `--preset/-p`, `--variant/-V`,
  `--test`, `--no-run`, `--clean-cache`. `--preset` accepts **only** `youtube_1080`,
  `shorts_1080`, `square_1080`, `youtube_4k` (no `qhd_1440`/`uhd_8k`), and
  overrides a variant's resolution retargeting.
- `screenshot` flags: `--frame`, `--at <seconds>`, `--scene <id>`,
  `--variant/-V`, `--output/-o`, `--test`, `--no-run`.
- The CLI has **no fps/quality/bitrate flags** — those come from
  `yoclip.yaml → config`; Studio's quality multipliers don't apply to CLI
  renders. Both commands work by generating a Flutter test file
  (`--no-run` skips executing it).

---

## Studio (`packages/yoclip_player`)

The desktop app is a thin shell over the same core. Run it with
`flutter run -d macos` from `packages/yoclip_player`; it reopens the last project
and remembers the timeline zoom between launches.

- **Left rail**: Goal · Assets · Scenes · Variants · Texts · Theme · Subtitles ·
  Settings (+ Help; panels open to the right of the rail at a consistent
  width). Assets show image/audio/video previews; audio can be played inline.
- **Scenes panel**: lists scenes with their `timeline` color/label; clicking a
  scene seeks the playhead and the timeline highlights the active scene. The
  selected scene's **Preview** button opens an in-app JS source editor with
  syntax highlighting; ⌘/Ctrl+S saves (Studio reloads automatically).
- **Variants / Texts / Theme panels**: edit variants, language dictionaries and
  theme colors — all write back to `yoclip.yaml` directly.
- **Properties / Theme / Subtitles panels**: edit node props (nodes need an
  explicit `id` to be editable), theme colors, and subtitle tracks.
- **Timeline**: iMovie-style lanes, pinch-to-zoom (timeframe scale persisted),
  real audio waveforms, scene markers, current-scene highlight, click-to-seek.
- **Drawing overlay**: draw on top of the video, add text, then **Copy
  screenshot** (frame + drawing) for sharing with an LLM; hide/clear drawing.
- **Export**: preset + video quality + audio quality + fps + custom resolution;
  queued encoding with progress/ETA. Selecting a variant with an explicit
  resolution auto-selects the matching export preset.
- **AI chat history** persists across restarts in
  `<project>/.yoclip_cache/ai_sessions.db` (SQLite; falls back to in-memory).

### Editing nodes in Studio

A node is editable only if it declares `id: 'unique_id'`. Selected-node edits are
written back to the `.scene.js` as string replacements; complex expressions
outside `style.*` may not round-trip.

---

## AI agents (Studio assistant & external CLI agents)

Two kinds of agents edit yoclip projects under **the same contract**:

- **Studio AI assistant** — built into the desktop app (adk_dart agent,
  `packages/yoclip_player/lib/src/ai_backend.dart`). It calls project tools
  directly and sees the live preview frame with the user's annotations.
- **External CLI agents** — Claude Code, GitHub Copilot, Kimi CLI and friends
  use THIS skill: plain file operations plus the `yoclip` CLI for rendering
  and verification.

### Shared rules

> The numbered list below is embedded **verbatim** in the Studio assistant's
> system prompt (`packages/yoclip_player/lib/src/ai_backend.dart`,
> `yoclipSharedRules`), and `shared_rules_sync_test.dart` fails CI when the
> two copies drift apart — edit both in one change.

<!-- shared-rules:start -->
1. Always read a file before rewriting it, and keep edits minimal.
2. `yoclip.yaml → scenes` lists paths **relative to the project root**
   (`scenes/intro.scene.js`, never a bare file name).
3. Never hardcode colors, font sizes or font families in scenes. Use the
   theme aliases (`yoclipColor` / `yoclipColorA` / `yoclipSize` /
   `yoclipFont`) when the project declares a lib via `project.js → lib`;
   otherwise read the `yoclipTheme` global directly
   (`yoclipTheme.colors.primary`). Add new keys to `yoclip.yaml → theme`
   when needed — remember the hex-fallback rule from the Theme section.
4. Texts that vary by language belong in `project.js` texts dictionaries,
   referenced via `yoclipT('<section>').key` with an inline English fallback.
5. Prefer `duration: auto` in `yoclip.yaml → config` — the timeline length
   is then computed from the scenes (`max(scene.from + scene.duration)`), so
   editing a scene's duration never desyncs the export. An explicit frame
   count still works.
6. Boomerang clips: `reverse: true` plays a `video` node backwards from
   `sourceStart` (source frame = `sourceStart - clipFrame * speed`, clamped
   at 0, with `clipFrame` counting from the node's `startFrame`). A reversed
   segment MUST set `startFrame` to its first scene frame — otherwise the
   source clamps to frame 0 and renders as a static image.
7. After files are written the Studio preview reloads automatically — no
   restart, no manual refresh.
8. Verify visually before declaring done, and tell the user what changed and
   where.
9. Broken scenes are not fatal: the studio collects load/render errors per
   scene. After ANY file write, check for errors and fix them before
   declaring done — the in-app assistant gets them via
   `get_studio_context → errors` (and as automatic chat messages), external
   agents via `yoclip screenshot` failing or the user pasting the error.
<!-- shared-rules:end -->

### Operations

| Task | Studio assistant (tool) | External agent (CLI equivalent) |
|------|------------------------|----------------------------------|
| List project files | `list_project_files` | `ls` / `find` in the project folder |
| Read a file | `read_project_file` | read the file (paths relative to project root) |
| Write a file | `write_project_file` | write the file — Studio hot-reloads on save |
| Live studio state (project, active scene, playhead frame, variant, user's drawings) | `get_studio_context` | ask the user, or infer from the files |
| See the current frame | PNG attached to each message (frame + the user's pen/arrow/text annotations) | `yoclip screenshot --project . --frame <n> --output /tmp/frame.png`, then view the image |
| Check JS syntax | (runtime reports errors on load) | `node --check scenes/<file>.scene.js` |

### Goal-driven workflow

`GOAL.md` in the project root is the project's north star. Both agents follow
the same loop:

1. **Read the goal first.** If `GOAL.md` is missing or empty and the user
   hasn't stated a goal, ask what the video should achieve before building.
2. **Make sure the goal is clear to you.** Before building anything, restate
   your understanding in one or two sentences — what video we are making,
   about what, for whom, in what format/style — and confirm with the user
   when anything is ambiguous. A guessed goal produces a guessed video.
3. **You own `GOAL.md` — write it yourself and keep it up to date.** As soon
   as the goal is agreed, write it into `GOAL.md` (goal + scenario with
   beats and timings). Afterwards treat it as a living document: whenever
   the user steers — new direction, scope, style, audience, format — update
   `GOAL.md` in the same turn so it always reflects the current intent, not
   the original one.
4. **Decompose:** goal → scenario (beats with timings) → scenes. Give every
   scene a `description` — it is the per-scene plan (what happens and when).
   When voiceover is planned, also write `voicePrompts` per project language
   on the scene.
5. **Build the scenes** — they do NOT have to be uniform: vary layout,
   motion and pacing per beat.
6. **Study the reference first:** `samples/yoclip_about/` demonstrates
   layered layouts, eased motion, chat typing, logo draws, counters and a
   whole FX reel. Steal patterns, not content. (The Studio assistant reads
   it through its read-only reference tools; external agents just read the
   files.)

> The Studio assistant's system prompt embeds the Shared rules above verbatim —
> sync is enforced by `packages/yoclip_player/test/shared_rules_sync_test.dart`.

---

## 3D scenes cookbook (proven recipes)

Hard limits of the render stack (learned by debugging renders — trust these,
do not rediscover):

- flame GLB loader: no `alphaMode: BLEND` (renders opaque/milky), no
  `doubleSided` (backfaces always culled — build an explicit back quad with
  flipped winding instead), no `emissiveTexture` (renders black — rebake
  emissive maps into `baseColorTexture`), no JPEG textures (rebake to PNG).
- GLB materials must be `TextureVisuals` + `PBRMaterial` (baseColorFactor
  pre-linearized pow 2.2 for solid colors, raw sRGB PNG for textures) —
  `ColorVisuals` renders as a red fallback slab.
- GLB models have NO opacity. Entrances = scale pop (`eoBack`); handoffs =
  same-place full-scale single-frame swap (reads as a morph, e.g. column ->
  lgrad -> white `l` in 01_monolith). A scale "crossfade" paints both
  models = ghosting.
- Every asset subdirectory must be listed in the sample's `pubspec.yaml`
  (`assets/models/panels/` etc.) or the loader renders red fallback slabs.
- Software scene3d has NO z-buffer — never let meshes intersect; keep
  separate lanes. A software layer and a flame layer may share one camera
  object (see 01_monolith, 02_kaleido).
- Clamp every opacity to [0,1] (`cap01`) — the widget asserts otherwise.
- The `path` widget clips to its own box: for screen-space graphics use
  full-frame `width: 1920, height: 1080` and draw in screen coordinates.
- 2D ellipse ring = container with `borderRadius: 999` on a 2rx x 2ry box +
  `borderColor`/`borderWidth`; a blurred, wider, dimmer copy underneath
  reads as a glow band.

Recipes (all battle-tested in samples/samples/yoclip_big_idea_v2):

1. **HDRI star skybox** (02_kaleido): a sphere GLB with the panorama
   rebaked from `emissiveTexture` to `baseColorTexture` (PIL), scaled ~40,
   `unlit: true`, slow rotation. Deletes the need for a 2D starfield.
2. **Hologram panels** (`tools/build_panels_3d.py`): thin dark box + front
   quad textured with a "holoized" screenshot — local contrast
   `|lum - blur(lum)| * 6` tinted with an accent color on black (glass is
   faked with black, never alpha) + explicit mirrored back quad =
   see-through glass. Panels: billboard `atan2` yaw to camera, or "TV
   ring" with yaw facing the ring center.
3. **External GLB with unrenderable materials** (platform): bake world
   transforms via `scene.dump()`, re-center; when textures will not
   render, stylize with per-part `PBRMaterial` factor colors
   (`tools/build_platform_3d.py`).
4. **Gargantua black hole** (02_kaleido): 2D composite — black void disc,
   photon ring (crisp + blurred path circles), accretion disk of 3–4
   blurred ellipse band containers + a white-hot inner band, Doppler via a
   blurred black mask blob on the far side + a white fireball on the near
   side, lensed arcs as thin path arcs above/below the void. All paths
   full-frame; brightness pattern swirls slowly.
5. **Star-map constellation** (07_space): golden-angle nodes on an
   ellipsoid (jewel colors), edges to the 1–2 nearest neighbours as thin
   dim-amber boxes, the whole web auto-rotating; nodes twinkle by scale.
6. **Globe with dots** (07_space): icosphere GLB (lit, roughness 0.55) +
   tiny orb GLBs on the surface (lat/lon golden-angle spread), positions
   recomputed per frame with the SAME rotation as the sphere — one rigid
   group. `tools/build_panels_3d.py` builds `globe.glb` + colored orbs.

## Verifying changes

- JS scene syntax: `node --check scenes/<file>.scene.js`.
- One-frame render (layout/colors/timing):
  `yoclip screenshot --project . --frame <n> --output /tmp/x.png` then view it.
- Core: `flutter test` in `packages/yoclip_core` (scene compiler, audio envelope,
  subtitles).
- Player: `flutter analyze` in `packages/yoclip_player` (expect 0 errors).

Studio reloads JS scenes automatically on file save (watchers) — there is no
reload keybinding. In the `flutter run` console, lowercase `r` is hot reload
and uppercase `R` is hot restart; native/Swift changes need a full restart.

---

## Samples

- `samples/yoclip_intro/` — minimal V2 project.
- `CREATIVE.md` in this folder — creative cookbook: 15 scene patterns
  (boomerang, beat-synced diptych, editorial stills, quote typography, logo
  draw-on, chat typing, Ken Burns, counters, FX reel, code window, export
  chips, CTA, localization, portrait adaptation) mapped to working reference
  code. Consult it when decomposing a goal into scenes.
- `samples/yoclip_about/` — full promo: layered layout (`project.js`), shared
  `lib/animation.js`, theme overrides, anchors, code-typing, Ken-Burns zoom,
  count-up stats, chat typing/send, a 10-effect FX reel (`12_fx.scene.js`),
  export showcase and CTA — the reference for most engine features.
- `samples/demo_ai/` — 4-scene promo (intro / code / animate / vision).
- `samples/intro/` — legacy V1-style Flutter app project, kept for reference.
