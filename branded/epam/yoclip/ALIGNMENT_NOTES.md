# EPAM brand film — alignment audit notes

## What changed

1. **Talent scene headline flashiness**
   - `Engineers` no longer uses the brand text gradient.
   - It is now rendered in flat `sea` (`#00F6FF`) via `headline('Engineers', 92, false, undefined, { style: { color: c('sea') } })`.
   - The rest of the line stays white: `who consult.`.
   - This keeps the keyword accent but removes the rainbow-flash feel.

2. **Baseline alignment applied to mixed-size rows**
   All rows that combine numbers + smaller text now use `crossAxisAlignment: 'baseline'` with `blh(fs, rowMax)` so every text widget shares the same line-box height.

   | Scene | Location |
   |---|---|
   | `01_hype_gap` | headline row `Few are capturing the value.` |
   | `01_hype_gap` | stat rows `49% / of enterprises…` and `23% / have AI use cases…` |
   | `03_postnl` | `40 minutes.` giant stat row |
   | `04_baker` | card stats `7 weeks`, `54 + pages`, `85 %` |
   | `04_baker` | act-2 `0 hours` giant stat row |
   | `05_tools` | headline `Agentic platforms that accelerate value.` |
   | `05_tools` | product rows `01 DIAL Open-source…` etc. |
   | `06_talent` | `55,800+ consultants & engineers worldwide` stat row |

3. **Renderer support already present**
   `packages/yoclip_core/lib/src/v2/scene_compiler.dart` maps `crossAxisAlignment: 'baseline'` to Flutter `CrossAxisAlignment.baseline` with `TextBaseline.alphabetic`.

## Remaining hard-coded offsets

These are the only visual-compensation offsets left in the film. They are either generic font-metrics corrections (in `lib/brand.js`) or one-off cover fixes for the `y` descender.

### Generic, reused offsets (`lib/brand.js`)

```js
preheader: offsetX = -size * 0.08        // line 69
headline:  offsetX = -(fontSize || 130) * 0.09  // line 132
emphasis:  offsetX = -size * 0.08        // line 150
```

They trim Museo Sans’ left side-bearing so left-aligned text visually starts at the intended margin.

### Cover-specific absolute offsets (`scenes/00_cover.scene.js`)

These compensate for the deep descender on `y` in `your enterprise.` so the `Redefine` / `AI/RUN™ TRANSFORM` / rule / subline all line up with the visual left edge:

```js
preheader('AI/RUN™ TRANSFORM', …, { offsetX: -13 })
headline('Redefine', 150, true, undefined, { offsetX: -15 })
body('AI-native transformation…', 32, …, { offsetX: -15 })
ruleDraw(frame, 75, 30, 140, undefined, -15)
```

### PostNL two-line caption

`scenes/03_postnl.scene.js` still uses `crossAxisAlignment: 'end'` for the `20+ types of AI agents` block because the caption is a two-line `Column`, not a single baseline text. The small `offsetY: -12` nudges that column to sit better next to the giant number.

## Latest audit frames

All frames are in `build/audit_frames/`:

- `talent_sea_1650.png` — flat-sea `Engineers`, baseline stat row
- `hype_gap_baseline.png` — baseline stats + headline
- `postnl_baseline.png` — `40 minutes.` baseline row
- `postnl_types.png` — `20+ types` block (still end-aligned)
- `baker_baseline.png` — card stats baseline
- `baker_act2_baseline.png` — `0 hours` baseline
- `tools_baseline2.png` — product rows + headline baseline
- `cover_current.png` — cover with cover offsets
- `framework_current.png` — framework cards
- `quote_current.png`, `cta_current.png` — no mixed-size rows

Final video was **not** assembled per instruction.
