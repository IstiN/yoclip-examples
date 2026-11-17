# Level Up — Final Export Validation

- **Master:** `build/level_up.mp4`
- **Size:** 100,886,322 bytes (~96 MiB)
- **Duration:** 102.000 seconds
- **Video:** H.264, 1920×1080, 30 fps, exactly 3060 frames
- **Audio:** AAC stereo, 44.1 kHz
- **Three.js backend:** 3840×2160 supersampled rendering, composited to 1920×1080
- **Full decode:** `ffmpeg -v error -i build/level_up_work.mp4 -f null -` completed without errors
- **Measured audio:** mean volume −18.2 dB, max volume −4.0 dB
- **SHA-256:** `f670176aea8632d6082eaef7118b223a36f49b94642ba8233419589de53959c2`

## Encoded-frame review

Reviewed frames extracted from the actual MP4, not only the renderer:

- 20 s — CapCut close hero orbit with lower-third identity.
- 29 s — counter-hit choreography and health HUD.
- 44 s — fighter/city disassembly and Pac-form recompilation.
- 52 s — Pac mouth facing the ghost during the maze pursuit.
- 75 s — boss charge phase.
- 76 s — separated fighters and pass-through `RENDER BREAK`.
- 79 s — `YOCLIP WINS` following K.O.
- 99 s — podium, `LEVEL UP`, logo and victory sound caption.

The extracted review images are preserved in `build/encoded_review/`.

## Project checks

- `node --check three/world.js` — passed
- `node --check lib/film.js` — passed
- `flutter test test/yoclip_project_test.dart` — 2 tests passed, including the full 3060-frame state audit
- GPU review harness — passed
