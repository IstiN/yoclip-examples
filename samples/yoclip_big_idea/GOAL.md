# GOAL — "Yoclip: What's Your Big Idea?"

A creative, cinematic **about-video for yoclip, made entirely with yoclip** —
modeled shot-by-shot on the reference [Gamma: What's Your Big Idea?](https://www.youtube.com/watch?v=-CU5DdGZdC8)
(83 s, 1080p30, no voiceover — story told by on-screen text, motion graphics
and a driving music track).

Target: **~86 s @ 30 fps (≈2580 frames), 1920×1080**, dark-first brand look,
variants `dark_en` / `dark_ru` / `light_en` / `light_ru` / `shorts_en`
(same pattern as `samples/yoclip_about`).

This project doubles as a stress test of the new **JSR `scene3d`** software-3D
node (meshes path) — the surreal montage and the finale fly-through are 3D.

---

## 1. Reference breakdown (Gamma, frame-by-frame)

| Time | Beat | Techniques |
|------|------|------------|
| 0–4s | Blinking cursor types **"What's your big idea?"** on off-white; camera zoomed tight on the typing, then pulls back | typewriter + caret, camera zoom-out |
| 4–9s | Hard cut into **surreal 3D montage**: monolith in snowy dunes under aurora → fuzzy cactus collage w/ floating portfolio card → psychedelic baroque eye collage | cinematic 3D renders, rapid hard cuts, "limitless creativity" |
| 9–14s | Sparkle logo morphs small; **"Generate docs / sites / socials / presentations in a click"** — words cycle, then type out | logo morph, word-cycling, typewriter |
| 14–21s | **UI demo**: prompt "A pitch deck for a sustainable fashion" typed into pill input → Generate button click → finished "FutureFibre" slides materialize and scroll | simulated UI typing, cursor click, cards flying in, vertical scroll |
| 21–30s | **Chat**: user asks "What is the impact of fashion on the environment?" → AI replies "I'll be glad to show you!" → "✨ Create a card" chip → stat card with bar chart appears | chat bubbles w/ typing indicator, action chips, content materializing |
| 30–42s | **Dark purple 3D space** with floating glossy objects; prompt "An astronomy course for children" → dark deck generates: "What is Relativity?", Einstein card, rocket-quote card; "✨ Animate it!", AI edit menu | 3D camera drift, neon glow objects, selection handles, context menus |
| 42–57s | Prompt "Mindfulness coach website" → full website generates → **"Turn into a carousel"** → Instagram carousel posts → likes counters | cross-format repurpose, counters, card scatter/collapse in 3D |
| 57–63s | **3D "content universe"**: PDF drops onto prompt "Read my research and summarize" → report slide generates | spatial panels, file-drop animation |
| 63–73s | "Improve writing" rewrites a paragraph; collaborator cursor converts bullets into a **pyramid smart-diagram**; chat "Cherry on top"; image swap | text morph, bullet→diagram transform, collab cursor |
| 73–78s | Cursor clicks **Share** → **3D neon-tunnel fly-through** with spiral path and floating UI panels → "Your big idea." | fast camera fly-through, light bloom |
| 78–83s | White flash → **"One click from creation."** → GAMMA wordmark (iridescent fill → solid blue) + gamma.app | typographic end card, logo fill morph |

Music: single upbeat electronic track, kick-driven; energy lifts at the 3D
montage, drops at the fly-through (~73s), resolves on the logo. Beat hits are
aligned to cuts and element landings. No voiceover.

## 2. Adaptation concept — same arc, yoclip story

Same emotional arc: **question → wonder → product magic → magic again →
finale**. The product truth we demo: you *describe a video in code/text* and
yoclip renders it — scenes, animations, variants, export. Meta-twist to state
in the video itself: **"This video was rendered by yoclip."**

| # | Time (s) | Frames | Scene | Reference beat | Content |
|---|----------|--------|-------|----------------|---------|
| 00 | 0–4 | 0–120 | `00_hook` | typewriter question | Cursor types **"What's your next video?"** on minimal dark bg; tight crop → pull back |
| 01 | 4–10 | 120–300 | `01_worlds` | surreal 3D montage | 3 quick 3D worlds via **`scene3d`**: monolith w/ gradient faces in a dune field → torus portal + floating logo panels → kaleidoscope of rotating brand-colored prisms. Hard cuts every ~2s |
| 02 | 10–15 | 300–450 | `02_logo` | logo + word cycling | yoclip logo draws on (path `progress`), shrinks inline; **"Render promos / docs videos / shorts / product demos — from code"** — words cycle, then type out |
| 03 | 15–22 | 450–660 | `04_prompt` | UI demo | Studio-like UI mockup: goal typed into a prompt pill ("A launch teaser for my app") → **Render** click → scene cards materialize and scroll (chat-typing + code-window patterns) |
| 04 | 22–31 | 660–930 | `04_chat` | chat + create card | AI-agent chat simulation: user bubble "make the logo pop on beat" → agent replies, `⚙ write_project_file` activity line → broken-scene error flashes red → **self-heals green** (signature yoclip trick) |
| 05 | 31–39 | 930–1170 | `05_code` | dark 3D space demo | Dark violet scene, floating `scene3d` rocket/planet; code window types a scene live while the preview updates beside it |
| 06 | 39–48 | 1170–1440 | `06_variants` | website → carousel | **One project → many renders**: master frame explodes into a fan of variant cards — Dark/Light, EN/RU, 16:9 + 9:16 Shorts — settling into a grid |
| 07 | 48–55 | 1440–1650 | `07_stats` | report + pyramid | Count-up stat cards ("4 packages", "15 creative patterns", "∞ variants") + a bullet list morphing into a drawn pyramid/bar diagram |
| 08 | 55–62 | 1650–1860 | `08_fx` | (montage energy) | Fast FX reel — 6 hand-built effects in slots (rings, chromatic text, wave text, spectrum bars, shine, scanlines) |
| 09 | 62–69 | 1860–2070 | `09_export` | share click | Export showcase chips (`yoclip render -V dark_en -o out.mp4` typed into a terminal chip, MP4/GIF badges, check paths draw on) |
| 10 | 69–76 | 2070–2280 | `10_flythrough` | 3D tunnel | **`scene3d` fly-through**: concentric neon rounded-rect tunnel rings + floating scene panels, camera pushes through; tagline appears: **"Your big idea. In code."** |
| 11 | 76–86 | 2280–2580 | `11_cta` | end card | Flash to brand bg → **"Describe it. Render it."** → yoclip wordmark with iridescent-gradient fill morphing to solid brand violet + `yoclip.dev`; final line: **"Rendered by yoclip."** |

Plus the always-on `background` scene (pinned full-length, subtle
gradient/grain) — same layering as `yoclip_about`.

## 3. Technical plan

### 3.0 Phase 0 — `scene3d` export spike (do first, blocks 01/05/10)
- `scene3d` + `meshes` renders in Studio preview via `YoclipWidgetRenderer`,
  but headless export goes through `YoclipV2Renderer`/`YoclipSceneCompiler`
  (only the 10 yoclip node types). **Verify `yoclip render` / screenshot CLI on
  a minimal `scene3d` scene first**; if it fails, add `scene3d` support to the
  v2 compiler (software painter already exists in JSR — reuse
  `parseScene3dConfig`/`Scene3dMeshPainter`) before building the 3D scenes.
- Budget: ≤ ~500 triangles per 3D frame; flat Lambert shading only; avoid
  intersecting faces; animate via `rotation: {x,y,z}` computed from `frame`.
- No 2D `rotation` prop on the same node as `scene3d.rotation`.

### 3.1 Scaffolding
- Copy the `samples/yoclip_about` skeleton: `yoclip.yaml` (config 2580×30fps,
  theme, variants, `external_assets` logo svgs from `branding/`), `project.js`
  (`lib`, `theme`, `texts: {en, ru}` per scene id, `scenes` list with
  negative-offset crossfades), `lib/animation.js` (reuse helpers verbatim:
  `seg/ease/eoBack/typewriter/counter/staggerItem/presence/float/shimmer/pop`).
- Every scene: `id`, `duration`, `description`, `voicePrompts {en, ru}`
  (metadata for future TTS), `timeline` label, `render(frame)` returning a
  `stack` with `alignment` on every positioned child; portrait branches via
  `yoclipIsPortrait()`.

### 3.2 Signature techniques to implement (reference → yoclip primitive)
- Typewriter Q&A: `typewriter()` + `blink()` caret; zoom = `scale` on a
  centered text layer eased with `eio3`.
- Word cycling: dictionary array + per-word `presence()` windows, accent color
  on the active word.
- UI/chat mockups: container chrome + `typewriter` bubbles, typing indicator
  dots (`blink`), send-button dip (`pop`), agent activity lines (mono font).
- Self-heal beat: red error pill → spinner → green ✓, timed to a beat hit.
- Materialize: cards `riseIn`/`pop` staggered (`staggerItem`), slide scroll =
  `offsetY` on a clipped column.
- Variants fan-out: one card cloned N times, each eased from center to its
  grid slot (`seg` windows + `eoBack`).
- Pyramid morph: bullets fade/scale out while `path`/`container` tiers draw on.
- Fly-through: `scene3d` rings whose scale/z-position is a function of `frame`
  (recycled modulo depth) — fake camera dolly without a moving camera.
- End card: logo `path` draw-on → fill crossfade (two layered logos: outline →
  gradient → solid), tagline `letterSpacing` expand.

### 3.3 Music
- Follow the `MUSIC_PROMPT.md` convention (see `samples/branded/epam/yoclip`):
  ship `assets/audio/score_placeholder.mp3` + `MUSIC_PROMPT.md` with a Suno
  prompt; swap the real track under the same filename later.
- Prompt direction: *"upbeat cinematic electronic, punchy kick, 120 BPM,
  86 s, energy lift at 0:04, drop at 1:09, clean resolve at 1:16"*.
- Beat-sync: put `envelope` keyframes on the composition track so downbeats
  land on the hard cuts (4s, 10s, 69s) and the logo reveal (76s).

### 3.4 Variants & tests
- Variants: `dark_en` (default), `dark_ru`, `light_en`, `light_ru`,
  `shorts_en` (1080×1920 native retarget). All copy via `yoclipT('<id>')` with
  English fallbacks; `logo` param swaps wordmark on light.
- Tests (copy pattern from `yoclip_about/test/`): `yoclip_project_test.dart`
  (project loads, all scenes render first/last frame),
  `yoclip_cli_render_test.dart`, `yoclip_cli_screenshot_test.dart` — must run
  green per `samples/README.md`.

## 4. Milestones

1. **M0 — 3D export spike**: `scene3d` renders headlessly (fix compiler if needed).
2. **M1 — Skeleton**: yaml + project.js + lib + background + 00_hook renders.
3. **M2 — Act 1** (01_worlds, 02_logo): hook → montage → brand, beat-cut.
4. **M3 — Act 2** (prompt, chat, code): the "product magic" block.
5. **M4 — Act 3** (variants, stats, fx, export): proof block.
6. **M5 — Finale** (flythrough, cta) + music + envelope beat-sync.
7. **M6 — Variants green**: all 5 variants render; tests pass; screenshots reviewed.

## 5. Open questions (resolved)

- ~~Does headless export support `scene3d` today?~~ **Yes** — the
  preview/export paths both route through `YoclipWidgetRenderer` (JSR), so the
  `meshes` path renders headless (spiked in M0). `YoclipWidgetRenderer` now
  also passes `js3dHost: createJs3dHost()` by default: `flutter_cube`
  primitives work headless too; the `flame_3d` GLB path is Studio-preview-only
  (renders nothing in offscreen capture, GLBs must be app assets).
- ~~GLB in the video~~ — solved by baking: the Khronos DamagedHelmet.glb was
  decimated offline (trimesh + fast-simplification) to 1400 tris into
  `lib/mesh_helmet.js` and flies through the finale tunnel via the software
  meshes path — export-safe.
- Final CTA domain: `yoclip.dev` (used in `texts.cta.url`; swap if another
  landing domain is canonical).
- Voiceover: reference has none — music-only (`voicePrompts` stay metadata).
