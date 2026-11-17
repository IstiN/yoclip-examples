# WRITE THE LIGHT — a YoClip music film

A **200.72-second narrative music video** built entirely from JavaScript scene graphs, native Three.js geometry and the supplied `write_the_light.wav`. It is not a slideshow or a single 3D logo loop: 18 hard-cut acts tell the story of Yo, a tiny developer bot asked for a product film at Friday 4:59.

## What is in the film

- **6,022 frames**, 1920×1080, 30 fps, with the original stereo master.
- **18 acts:** Slack cold open → repo boot → code verse → first build → paper typography → chorus → split-screen → GPU story → formats → export roulette → second chorus → phone notes → riser → breakdown → two finales → boss's last question → outro.
- **399 word-level cues** across 74 master-aligned lyric lines. A local faster-whisper full/line hybrid preserves measured speech onsets, resolves cross-line collisions and validates act boundaries; active words change color and pulse while past/future words keep distinct brightness. There is no artificial karaoke lead or entry-opacity delay: the active word is visible on its first rendered onset frame.
- **Eight final-chorus Three.js variants** alternating every two beats: Ferrari drift / 3D wordmark, wheel-detail camera, Yo, Ferrari night drive, neon city, Ferrari inside an architectural light tunnel, DJ Yo and the close-up RobotExpressive dance / LDraw construction lab.
- **Cinematic scene language:** the former toy-rocket shot and empty tunnel insert are replaced by a blue/amber tunnel with the Ferrari physically inside it. Moving architectural frames and a contact shadow connect the car to the tunnel; no lane-light streaks or detached headlight/tail-light reflection sprites remain. Final choruses have no confetti or second Flutter zoom, so typography stays inside the frame.
- **Night drive and detail cameras:** three hard-cut low chase/tracking/front cameras replace the showroom orbit. Scrolling lane markings, guard rails, sodium lamps, textured asphalt, soft light pools, spinning wheels and restrained emissive tail lights make the road—not a turntable—the source of motion. `WATCH THE WHOLE THING OPEN UP` dollies toward the front wheel, holds the brake/rim detail and pulls back to the full car. Drift turns the body sideways and emits soft gray tire smoke from the actual `wheel_rl`/`wheel_rr` rigs. In chorus and final beat-mode repeats the car brakes into a short action stop in front of the official extruded YoClip lockup, preserving 3.1 world units of depth clearance; a small deterministic left/right body sway keeps the stopped car alive while the smoke fades. The camera widens to show the whole car and full lockup with a visible gap. The approved outro retains its separate left/right hand-off timing. The compact rear-axle smoke swirl fades near the camera, preventing billboards from covering the car; skid generation stops before the exit and the marks fade before the logo-only frame.
- **Close-up construction lab:** RobotExpressive blends `Dance / Jump / Wave / Yes / ThumbsUp` with deterministic action weights while the 28-step LDraw X-Wing assembles. A full-head robot shot cuts to a close view of the first bricks; the camera pulls back as the aircraft grows, then finishes on a two-shot instead of spinning the model through multiple showroom orbits.
- **Physical 3D sign-off:** the official brand anatomy is built as real geometry: an open white C ring, violet→indigo→blue `Yo` speech bubble with recording squares and tail, a separate `lip`, and a small blue `.studio` placed forward of the `p` descender so every suffix letter stays readable. The bubble uses a saturated violet→indigo→blue gradient with restrained key light rather than a washed-out pastel fill. Local typeface outlines run through Three.js `ShapePath` + `ExtrudeGeometry`; cool brand lights, a contact shadow and a subtle floor reflection ground the mark. No gray URL-as-logo, flat title, orbiting rings or cropped car remains.
- **Procedural anime city:** 56 growing buildings, 280 neon window strips, six torii gates, moon, street grid and 96 speed-lines.
- **Textured PBR car hero:** the old wireframe torus knot is replaced by the native-loaded JSR `Ferrari.glb`; its four wheel rigs rotate from the master frame. RobotExpressive remains the recurring driver, scaled and positioned inside the cockpit so his head clears the windshield without crossing its frame; his body and head stay oriented toward the steering wheel and the car's forward direction in every drive, drift and tunnel shot—never turned back toward the viewer. The model's separate leg/foot meshes are hidden because the cockpit occludes them, preventing cartoon feet from piercing the floor or side sill. The `Sitting` rest pose is established once, then only head/neck/arm tracks play: the source `Body.translation`, torso and leg motion are excluded so the driver never bounces against the seat. Facial morphs and a cool cabin rim keep the character readable without extra glow sprites.
- **Native contact shadows:** a 2048² PCF-soft directional shadow pass grounds heroes on the city floor.
- A recurring Yo character with blinking eyes, mouth movement, dancing arms and a reactive antenna.
- Paper/ink acts, explicit split-screens, phone UI, format frames, code, particles and hard cuts.
- Active-word camera focus with eased previous→current-word travel, selective hero-phrase dolly/push-in with a soft vignette, and synchronized Three.js optical zoom. Long lines are amplitude-compensated so the camera move does not crop them.
- Deterministic 2× Three.js supersampling: the native backend renders 3840×2160 and export composites it down to 1920×1080 with an average filter (the native R1 renderer has no MSAA).
- Beat-synced shockwaves, emissive shards and anime impact-lines shared by the character variants.

No browser, DOM, WebGL context, HTML harness, footage or pre-rendered 3D movie is used. `three/world.source.js` builds a real `THREE.Scene`; `npm run build:three` bundles it with the pinned r186 addons into the single `three/world.js` IIFE consumed by the runtime, which executes its draw calls with Flutter GPU. Edit `world.source.js`, not the generated `world.js`. The default build selects the verified RenderPass → OutputPass → FXAA chain; `YOCLIP_FXAA=0 npm run build:three` keeps direct rendering for A/B diagnostics.

Runtime baseline: `js_widget_runtime 0.4.204`. Its real GLB morph path, faster animation submission, native shadow lane and corrected per-pass presentation orientation are used. Production now renders through **RenderPass → OutputPass → FXAA at 2× supersampling**. Production A/B captures at car, robot and outro frames verified upright output, one output color transform, opaque alpha and visibly smoother edges. Direct and composer output still have a moderate color response difference; this is recorded separately from the fixed double-transfer defect. UnrealBloom, Bokeh and transmission are not enabled in the production pipeline; native MSAA and >2× capture remain unsupported.

**Current car limitations:** the drive retains an explicit open-cockpit fallback: the Ferrari glass node is removed during asset load, before the first render. Earlier 0.4.201 tests of native `MeshPhysicalMaterial.transmission` and explicit `MeshStandardMaterial({ transparent: true, opacity: 0.08 })` did not produce reliable see-through glass in this workload. The bounded-transmission fix in 0.4.202 has not yet been validated here, so this fallback is not presented as working glass transmission. Wheel contact is derived from the loaded car bounding box (`bounds.min.y`) and the road plane rather than a hand-tuned ride height.

## Timing and art direction

`lib/timeline.js` is the master-map base: acts, lyric lines, fallback cues and 390 analysed audio beats. Generated `lib/word_timings.js` overlays measured act/line/word timing without changing the audio. Both `scenes/film.scene.js` and `scenes/background.scene.js` call `filmContext(frame)`, so Flutter typography and Three.js cannot drift onto different act or beat indices.

- **Anton** carries the giant music-video typography.
- **Space Mono** carries code, timecode and technical labels.
- **Source Sans 3** remains available for small UI text. All three bundled font families include their OFL licenses in `assets/fonts/`.
- Paper acts use warm `#f1efe8`, black ink and orange; night acts use near-black, violet, cyan and orange.
- Every animation is a pure function of the composition frame. Arbitrary screenshot seeks and sequential export use the same inputs.

Regenerate the measured transcript after editing line cues (requires `ffmpeg` and a local Python environment with `faster-whisper`):

```bash
python3 -m venv /tmp/yoclip-whisper-venv
/tmp/yoclip-whisper-venv/bin/pip install faster-whisper
/tmp/yoclip-whisper-venv/bin/python tools/align_words_faster.py
/tmp/yoclip-whisper-venv/bin/python tools/align_words_faster.py --apply
flutter test test/yoclip_project_test.dart
# assets/audio/write_the_light.words.json
# assets/audio/write_the_light.transcript.txt
# lib/word_timings.js (loaded by project.js after timeline.js)
```

The aligner combines a full master pass with known-lyric line windows, maps recognition back to expected tokens and preserves measured speech onsets. It rejects implausible recognition, prevents a new line from hiding the previous line's last word, and reconciles measured onsets with act boundaries. `speechStart/speechEnd` preserve speech boundaries while `t/end` drive gap-free karaoke activation. `KARAOKE_VISUAL_LEAD` is intentionally zero. Two visual-only lines have no fabricated word timings. The project test probes all 399 words at their first real render frame and fails if a different cue or word is selected. `tools/build_word_transcript.py` remains only a deterministic syllable-weighted fallback.

## Project layout

```text
yoclip.yaml                  # 200.72 s composition, bundled fonts, master audio
project.js                   # shared libraries and layered scene order
lib/
  timeline.js                # acts, lyric lines, fallback cues, 390 analysed beats
  word_timings.js            # generated faster-whisper act/line/word intervals
  animation.js               # deterministic scene-graph primitives
  film.js                    # 18 narrative acts and active-word typography
scenes/
  background.scene.js        # shared act/beat/word context → THREE params
  film.scene.js              # editorial/narrative overlay
three/
  world.source.js            # Editable Yo, night drive, tunnel, wheel macro, drift, dance/LDraw lab
  world.js                   # GENERATED single IIFE — run `npm run build:three`
  addons_bundle.js           # Pinned r186 addons used by the bundle
  three_global_shim.js       # Build-time alias to the host global THREE
  helvetiker_bold.typeface.json # outlines for Yo, lip and the .studio suffix
  Helvetiker.THREE_LICENSE.txt  # upstream Three.js example asset license
assets/audio/                # supplied master + detailed transcript exports
test/
  yoclip_project_test.dart   # all 18 acts, graph validity and determinism
  three_smoke_test.dart      # native Flutter-GPU smoke frame
  yoclip_review_frames_test.dart
  yoclip_render_test.dart
```

## Verify and render

From this directory:

```bash
flutter test test/yoclip_project_test.dart

# One composed frame (defaults to film, local frame 1605).
YOCLIP_SCENE=film YOCLIP_FRAME=1080 YOCLIP_OUTPUT=build/car_drive.png \
  flutter test --enable-impeller --enable-flutter-gpu \
  test/yoclip_review_frames_test.dart

# Native GPU smoke test.
flutter test --enable-impeller --enable-flutter-gpu test/three_smoke_test.dart

# Full MP4 through the normal YoClip CLI.
dart run ../../../packages/yoclip_cli/bin/yoclip.dart \
  render -C . -o build/write_the_light.mp4

# Or through the test harness.
YOCLIP_OUTPUT=build/write_the_light.mp4 \
  flutter test --enable-impeller --enable-flutter-gpu test/yoclip_render_test.dart
```

Headless export captures the native Three.js surface, captures the ordinary Flutter scene with transparency, and composites the RGBA layers. This avoids the Flutter test-binding GPU readback deadlock while preserving the exact Three.js frame and normal YoClip layout.
