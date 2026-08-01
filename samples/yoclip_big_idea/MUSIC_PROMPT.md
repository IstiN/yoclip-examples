# Music — "Yoclip: What's Your Big Idea?"

`assets/audio/score_placeholder.mp3` is a stand-in. Generate the real score
(e.g. Suno) and save it **under the same filename** — `yoclip.yaml` already
points at it and the envelope is beat-mapped to the cuts below.

## Suno prompt

> Upbeat cinematic electronic, 120 BPM, 86 seconds, punchy four-on-the-floor
> kick, wide analog synth pads, sparkling arpeggios, no vocals. Structure:
> 0:00 sparse intro (single pulsing synth, room for UI keystroke clicks) →
> 0:04 energy lift with full kick and bass (hard cut feel) → 0:10 confident
> groove, brand-anthem vibe → 1:09 big drop with rising noise sweep into
> driving peak → 1:16 clean resolve to a warm major chord, soft outro to
> 1:26. Mood: optimistic, premium, "the future is now" — Gamma/Apple launch
> film energy.

## Beat map (composition frames @30fps)

| Time | Frame | Moment | Envelope |
|------|-------|--------|----------|
| 0:00 | 0 | hook typewriter | volume 0.85 |
| 0:04 | 120 | cut into 3D montage | duck → slam to 1.0 |
| 0:10 | 300 | logo draw-on | duck → slam to 1.0 |
| 1:09 | 2070 | fly-through drop | duck → slam to 1.0 |
| 1:16 | 2280 | end card | hold |
| 1:22 | 2460 | logo settle | fade to 0 over 120f |

The envelope in `yoclip.yaml → audio.tracks[0]` already encodes these
duck/slam/fade moves (Studio preview + export honor it; the CLI renderer
plays constant volume — known limitation).
