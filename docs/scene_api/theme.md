# Theme & variants

Centralize colors, fonts, and sizes in the theme so scenes stay consistent and variants can override them.

## `yoclipTheme` global

The merged theme is injected as `yoclipTheme`:

```js
var primary = yoclipTheme.colors.primary || '#8c5cf6';
var family = yoclipTheme.font.family || 'Geneva';
```

## Theme helpers

Define these in your `lib/animation.js`:

```js
function yoclipColor(key, fallback) {
  return (yoclipTheme.colors && yoclipTheme.colors[key]) || fallback;
}

function yoclipColorA(key, alpha, fallback) {
  var hex = yoclipColor(key, fallback || '#000000').replace('#', '');
  if (hex.length === 8) hex = hex.slice(2);
  var a = Math.max(0, Math.min(255, Math.round(alpha))).toString(16);
  if (a.length < 2) a = '0' + a;
  return '#' + a + hex;
}

function yoclipSize(key, fallback) {
  return (yoclipTheme.sizes && yoclipTheme.sizes[key]) || fallback;
}

function yoclipFont() {
  return (yoclipTheme.font && yoclipTheme.font.family) || 'Geneva';
}
```

## Variants

Variants let you produce light/dark, localized, or differently-sized cuts from the same scenes.

```yaml
variants:
  - id: dark_en
    params: { lang: 'en' }
  - id: light_en
    params: { lang: 'en' }
    theme:
      colors:
        background: '#f4f4f8'
        text: '#1a1a2e'
```

Access the active variant:

```js
var lang = yoclipVariant.params.lang || 'en';
var isPortrait = yoclipFormat.orientation === 'portrait';
```

## Text dictionaries

Merged `texts` are exposed as `yoclipTexts`. Read a section with a helper:

```js
function yoclipT(section) {
  var lang = (yoclipVariant.params || {}).lang || 'en';
  var dict = (yoclipTexts[lang] || yoclipTexts.en || {})[section] || {};
  return dict;
}

var copy = yoclipT('intro');
// copy.title, copy.sub, ...
```

## Resolution retargeting

A variant can declare `width`/`height` to render natively at a new aspect:

```yaml
variants:
  - id: shorts_en
    width: 1080
    height: 1920
    params: { lang: 'en' }
```

Scenes adapt via `yoclipFormat`:

```js
var w = yoclipFormat.orientation === 'portrait' ? 760 : 640;
```
