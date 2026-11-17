# LEVEL UP! — a YoClip arcade boss-fight film

A **102-second audio-reactive cyberpunk boss fight** built entirely from JavaScript scene graphs and a persistent native Three.js world. Yoclip battles the CapCut Template Titan, unlocks Pac-Mode during the real waka-waka bridge, scores a voxel K.O., and levels up on the podium.

- **3060 frames**, 1920×1080, 30 fps, 140 BPM / 238 beats.
- Original stereo `Level Up!.wav` master.
- Eight timed rounds: boot → versus → duel → overclock → chase → showdown → K.O. → victory.
- Local faster-whisper transcription aligns the actual announcer events; the concept script is not treated as a transcript.
- Per-frame RMS, bass, mid, high and onset features drive lights, camera, HUD and impacts.
- Native 2× Three.js supersampling (3840×2160) with average downsampling on export.
- Flutter GPU scene composited with editable Flutter HUD, typography, captions and glitch effects.

See `analysis/STORYBOARD.md` for the round map and `analysis/AUDIO_ANALYSIS.md` for the measured audio report.

## Verify

```bash
flutter pub get
flutter test test/yoclip_project_test.dart

# Targeted native-GPU review frames.
YOCLIP_FRAMES=90,810,1700,2800 \
  flutter test --enable-impeller --enable-flutter-gpu \
  test/yoclip_review_frames_test.dart
```

Set `YOCLIP_OUTPUT_DIR=build/review` to choose a capture directory, and `YOCLIP_FRAMES` to any comma-separated frame list.

## Render

```bash
dart run ../../../packages/yoclip_cli/bin/yoclip.dart \
  render --project . --output build/level_up.mp4
```

The full master is deterministic: arbitrary seeking and sequential export use the same frame/audio state. No browser, DOM, footage, pre-rendered character movie or wall-clock animation is used.
