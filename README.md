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
  demo_ai/          — small AI-assisted demo scenes
  intro/            — Flutter-integrated intro sample
  yoclip_about/     — yoclip self-promo film
  yoclip_intro/     — minimal intro film

branded/epam/
  yoclip/           — EPAM-branded yoclip promo
  dmtools/          — DMTools promo film (EPAM brand system)
```

## Notes

- `build/`, `.dart_tool/`, `.yoclip_cache/` and rendered `.mp4` files are
  excluded from the repo. Run `yoclip render` locally to generate them.
- EPAM-branded examples use the EPAM 2023 brand system and Museo Sans.
  They are shared here as advanced references for branded films.
