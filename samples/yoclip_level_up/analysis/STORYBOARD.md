# LEVEL UP! — production storyboard

**Master:** 102.000 s · 140 BPM · 238 beats · 30 fps · 3060 frames · 1920×1080.
**Look:** neon cyberpunk arena + arcade broadcast HUD. Yoclip = cyan/violet, CapCut = red/orange, Pac protocol = electric yellow.
**Rule:** frame and measured audio features are the only clocks. No wall-clock animation.

## Rounds

| Round | Approx. time | Narrative and signature visuals |
|---|---:|---|
| SYSTEM BOOT | 0–10.29 s | Insert-coin cold open, dark arena assembly, GPU boot console, cyan/violet columns and floor grid. `SYSTEM ONLINE` lands on the real `System loading` vocal at 9.58 s. |
| ROUND 01 / VERSUS | 10.29–25.71 s | Yoclip and CapCut materialize on opposite sides. Orbiting broadcast camera, character cards, health bars. Real name calls at 12.48 s and 17.24 s. `READY?` meets 25.74 s. |
| NEON DUEL | 25.71–41.14 s | `FIGHT!` at 27.04 s. CapCut fires red template slabs; Yoclip dodges, raises scene-graph widget shields and returns cyan compile beams. Combo counter, impact frames, RGB slices, bass-driven floor EQ. |
| OVERCLOCK | 41.14–49.71 s | The first long waka phrase triggers the arcade transformation. Geometry emphasis changes from fighters to Pac-Man and ghost; arena becomes a neon maze. Camera dives into the maze rather than cutting to a flat illustration. |
| PAC-MODE | 49.71–68.57 s | 3D rectangular-loop chase, glowing pellet trail, chomp motion on the grid, alternating follow/isometric cameras. Waka captions, ghost combo and score escalate with the audio. |
| FINAL SHOWDOWN | 68.57–78.00 s | Fighter forms return for the last clash. Boss HP is critical, finisher prompt appears, camera closes in, beam/shard/shockwave intensity follows the final waka build. |
| K.O. | 78.00–79.71 s | CapCut core disintegrates into red voxels and a radial shockwave. Real `YOCLIP WINS` vocal at 78.66 s carries the result card. |
| VICTORY | 79.71–102.00 s | `LEVEL UP!` at 80.24 s. Yoclip on the podium, arm raised, green/cyan/gold rings and confetti. Rank S, play-again tease, final logo/level-up card at the real victory sound around 98.66 s. |

## Audio truth

The supplied concept script is a creative brief, not a transcript. Timings above come from local faster-whisper analysis of the actual WAV. The film does not fabricate `Finish him`, crowd chants or other words that were not detected. `analysis/audio_events.json` and `analysis/audio_features.json` are the machine-readable sources for timing and per-frame energy.

## Signature YoClip techniques

- Persistent native Three.js scene; deterministic arbitrary seeking.
- Real 3D fighters, Pac mouth geometry, ghost, maze, pellets, shields, beams, voxel shards and podium.
- Two-times supersampling (3840×2160 backend) downsampled to 1920×1080.
- Audio-reactive bass/mid/high/onset features sampled per frame.
- Flutter scene-graph typography, health bars, combo HUD, captions, scanlines, glitch slices and vignette composited over Three.js.
- Shot-specific perspective cameras: orbit, side duel, maze follow, maze top, finisher push and victory orbit.
