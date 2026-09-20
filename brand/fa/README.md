# Fa Brand Kit (`brand/fa/`)

Единый источник Fa-бренда для всех yoclip-проектов. **fa_trailer — лидер:**
kit извлечён 1:1 из `samples/fa_trailer` (проверено md5), любые правки геометрии
знака, палитры или иконок делаются ТОЛЬКО здесь.

## Файлы

- **`fa_kit.js`** — палитра бренда + векторная геометрия знака Fa и примитивы:
  - `FA_PALETTE` / `BRAND` — каноническая геометрия (F stem, a bowl, подчёркивание-улыбка, tile)
  - `fPathNode`, `faBrandMark`, `faLogoSvgNode`, `faHardwareChip` — готовые ноды знака
  - `completeFaMark(fP, accentP, bowlP, stemP, alpha)` — знак «рисует сам себя»
  - `chevPoints`, `ringPoints`, `bendPoints`, `morphPts` — морфинги линий
  - `polylineNode(pts, sw, progress, color, alpha)`, `trace(...)` — прогрессивная отрисовка путей
  - `setMapper / brandToScreen` — бренд-координаты → экран
- **`fa_icons.js`** — официальные векторные SVG-иконки экосистемы
  (Chrome, macOS, Windows, iOS, Android, Outlook, Word, PowerPoint и др.),
  рендерятся нодой `type: 'svg'`.

## Как подключить к проекту

```js
// project.js — пути резолвятся от корня проекта (поддерживаются ../../)
project = {
  lib: ['../../brand/fa/fa_kit.js', '../../brand/fa/fa_icons.js'],
  scenes: [ /* ... */ ],
};
```

Сцены используют глобалы напрямую: `completeFaMark(...)`, `faHardwareChip(...)`,
`brandToScreen(...)`, `ringPoints(...)` — как в `samples/fa_trailer/scenes/`.

## Правила

1. Палитра — строго брендовая: Royal Violet `#5B61F6/#8F6BFF/#A092ED`,
   Emerald Teal `#2EBD9E/#1E826C`, Titanium `#FFFFFF/#ECECEF/#9E9EA8/#7A8CB6`,
   Obsidian `#05070D/#0A0F1D/#0C1322/#1E2638`. Никаких generic blue/cyan.
2. Знак Fa — только через kit (никогда текстом, никогда хардкод-координатами).
3. Изменения kit'а прогоняются тестами `fa_trailer` — он дымовой тест бренда.
4. Не копируйте этот файл в проекты — ссылка через `lib:` единственная.

## Куда класть новое reusable

- Геометрия знака, палитра, иконки → `fa_kit.js` / `fa_icons.js`
- Параметризованные визуальные блоки (HUD-окно, металлический заголовок,
  spec-slam, карточка платформы) → новый `fa_components.js` здесь же,
  по аналогии с `samples/branded/epam/*/lib/brand.js`.
