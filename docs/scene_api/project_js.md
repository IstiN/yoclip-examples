# `project.js` reference

`project.js` is optional. Use it when scenes need shared helpers, crossfades, background/overlay layers, or anchored timing.

## Minimal layout

```js
project = {
  lib: 'lib/animation.js',
  theme: {
    colors: { accent: '#22d3ee' },
  },
  scenes: [
    { path: 'scenes/intro.scene.js', layer: 'content', start: 0 },
  ],
};
```

## `lib`

A single path or list of paths to JS files loaded before every scene. Their globals are available inside scenes.

```js
lib: ['lib/easing.js', 'lib/components.js']
```

## `theme` and `texts`

Deep-merged over `yoclip.yaml`. Use them for per-variant or per-layout overrides.

```js
project = {
  theme: { colors: { accent: '#22d3ee' } },
  texts: {
    en: { intro: { title: 'Hello' } },
  },
};
```

## `scenes` and layers

When `project.scenes` exists it fully replaces the `scenes` list from `yoclip.yaml`.

Layers are rendered bottom-to-top:

1. `background`
2. `content`
3. `overlay`

```js
scenes: [
  { path: 'scenes/background.scene.js', layer: 'background', start: 0, duration: 4170 },
  { path: 'scenes/intro.scene.js', layer: 'content', start: 0 },
  { path: 'scenes/logo.scene.js', layer: 'overlay', start: 0, duration: 4170 },
]
```

## Anchors

Place a scene relative to another scene's end.

```js
{
  path: 'scenes/next.scene.js',
  layer: 'content',
  start: { after: 'intro', offset: -6 }
}
```

This starts `next` 6 frames before `intro` ends, producing a crossfade. `after` references a scene declared earlier in the list.

## Plain-string entries

A plain string is shorthand for `{ path: '...', layer: 'content', start: 0 }`.

```js
scenes: [
  'scenes/intro.scene.js',
  'scenes/hero.scene.js',
]
```
