# yoclip examples

A collection of example yoclip films. Each folder is a self-contained yoclip
project with `yoclip.yaml`, scenes, assets, and optional tests.

## Quick start

```bash
# Clone the main yoclip repo next to this one
git clone https://github.com/IstiN/yoclip.git ../yoclip

# Render an example
cd samples/yoclip_about
dart run ../../../yoclip/packages/yoclip_cli/bin/yoclip.dart render -V dark -o about.mp4
```

## Layout

```
samples/
  demo_ai/            — small AI-assisted demo scenes
  intro/              — Flutter-integrated intro sample
  yoclip_about/       — yoclip self-promo film
  yoclip_intro/       — minimal intro film
  yoclip_motion_shapes/ — motion & shapes playground (jsr.motion, shape nodes, sequence helper)

branded/epam/
  yoclip/           — EPAM-branded yoclip promo
  dmtools/          — DMTools promo film (EPAM brand system)

docs/               — public scene API reference
skills/yoclip/      — agent skill + creative cookbook for AI assistants
```

## Studio Samples gallery

`gallery.json` is the editorial catalog for the native Studio **Samples & remix**
gallery. `.github/workflows/gallery.yml` renders the MP4/poster, packages an
immutable source ZIP, publishes `samples.json` plus artifacts to GitHub Pages,
and never includes caches, AI history or build outputs in a source ZIP.

To publish another example, add it to `gallery.json`, extend the render steps
in the workflow, and bump its immutable `revision` whenever its source or media
changes. Studio caches the catalog, poster, MP4 and extracted source on demand;
Remix creates an empty project and gives the agent the source as a read-only
reference rather than cloning it.

## Documentation & agent skill

- `docs/scene_api/` — public reference for `yoclip.yaml`, `project.js`, scenes, widgets, animation, theme, assets and examples.
- `skills/yoclip/SKILL.md` — complete agent skill: project structure, JS scene API, export, Studio usage and shared rules.
- `skills/yoclip/CREATIVE.md` — creative cookbook with 15 reusable scene patterns and working code snippets.

## Notes

- `build/`, `.dart_tool/`, `.yoclip_cache/` and rendered `.mp4` files are
  excluded from the repo. Run `yoclip render` locally to generate them.
- EPAM-branded examples use the EPAM 2023 brand system and Museo Sans.
  They are shared here as advanced references for branded films.
