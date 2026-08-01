# GOAL — "Yoclip: What's Your Big Idea? — v2 (Gamma 1:1 remake)"

A near-shot-for-shot remake of [Gamma: What's Your Big Idea?](https://www.youtube.com/watch?v=-CU5DdGZdC8)
(83 s, no voiceover) telling **yoclip's** story with the same beats, pacing,
energy and color language — produced entirely with yoclip.

v1 (`samples/yoclip_big_idea`) stays as the "how NOT to do it" reference.
v2 rules: Gamma fidelity first; every product demo shows **real yoclip
artifacts** — golden frames captured by the CLI from this very project
("golden tests for YoClip Studio"); 3D via JSR `scene3d` (software `meshes`
for procedural + `engine: 'flame'` GPU for real GLB with skeletal clips).

Target: **89.5 s @ 30 fps (2685 frames), 1920×1080**, dark-first,
variants dark_en/dark_ru/light_en/shorts_en. Music: placeholder score +
`MUSIC_PROMPT.md` (Suno prompt per Gamma's instrumental synth-pop), envelope
beat-mapped like v1.

## Scene map (Gamma beat → v2 scene)

| # | Gamma (s) | v2 scene | Content |
|---|-----------|----------|---------|
| 00 | 0–5 | `00_hook` | OFF-WHITE bg, lone caret blinks, black typewriter "What's your next video?", hold, then BACKSPACES away to the lone caret |
| 01 | 5–11 | `01_monolith` | caret grows into a glossy gradient monolith in a VIVID sunset world (lavender dunes, glowing sun, stars); camera pulls back as the monolith becomes the "l" of a real 3D yoclip logo (GLB extruded from the brand SVG) assembling on the dunes; dive into the pulsing dot over the "i" |
| 02 | 11–17 | `02_kaleido` | portal dive into a vortex tunnel: counter-rotating neon spirals, polaroid cards with REAL golden frames spiralling into the center, low-poly 3D objects flying past; white flash out |
| 03 | 10–13 | `03_generate` | white bg, yoclip logo + cycling words promos/shorts/docs/demos → "Render videos from code." |
| 04 | 14–17 | `04_prompt` | prompt pill types "A launch video for my app", cursor glides, clicks Render (button dips + glows) |
| 05 | 18–22 | `05_deck` | sky-blue space: deck assembles — golden-frame hero card + left thumbnail nav + eco-bullet list ("zero setup, code-first, GPU 3D") |
| 06 | 23–30 | `06_chat` | AI chat bottom-right: "make the stats pop" → assistant rebuilds a card: bar chart draws on, big counters, material photo cards |
| 07 | 31–34 | `07_space` | dark violet 3D space: floating glossy objects (planet, torus, layout frames, lander), prompt "A rocket for the finale" → lander launches up a light trail |
| 08 | 35–44 | `08_course` | dark deck "What is a Scene Graph?" + code block; "✦ Animate it!" → portrait card plays a LIVE knight (flame GLB, Cheer) inside the frame; formula "y = render(t)"; "Add a video" → LIVE tunnel flythrough embedded in the card |
| 09 | 45–50 | `09_website` | pastel website "ZenClip" (light variant showcase): hero, logos strip, how-it-works steps, tool rail right |
| 10 | 51–67 | `10_carousel` | "✦ Turn into Shorts" → site content explodes into IG-style square posts (1/6…), "Share on social", grid of posts + like counters |
| 11 | 57–63 | `11_upload` | 3D gallery fly-by; "Upload scenes" window: drop `scenes/*.js` → polished render report card (12 scenes · 2580 frames · 0 errors) |
| 12 | 64–73 | `12_polish` | select text → "✦ Improve writing" morphs copy; bullets → drawn pyramid diagram; cursor clicks Share |
| 13 | 74–77 | `13_tunnel` | neon tunnel flythrough w/ GLB helmet, spiral light ribbon → "Your big idea. In code." |
| 14 | 78–83 | `14_end` | white flash → "Describe it. Render it." → yoclip wordmark + yoclip.dev; meta: "Rendered by yoclip." |

Plus full-length `background` (subtle gradient orbs, like v1).

## Golden tests for YoClip Studio

Real CLI-captured frames of THIS project used as in-video content:
`02_kaleido` (promo window), `05_deck` (hero + thumbs), `06_chat` (stats card
top), `08_course` (portrait = live knight instead; code card). Captured to
`assets/goldens/` AFTER the 3D scenes render, declared in
`yoclip.yaml → external_assets`, then final re-render (same loop as v1 08).

## Engineering notes (from v1, keep)

- GLB textures pre-linearized (pow 2.2) — flame_3d shader has no sRGB decode.
- scene3d meshes: export-safe; flame: export-safe via offscreen capture,
  deterministic `time` drives skeletal clips; `id` unique per 3D scene.
- Container styling = direct props only (`color/gradient/border*/shadow`),
  `decoration` is dropped. padding = number; per-side = margin on child.
- fit:'expand' children need alignment; rows/cols position via main/crossAxis.
- Geneva: no ⚙✖✓ glyphs — draw checks as paths.
- Two flutter commands never run in parallel (tool lock).
