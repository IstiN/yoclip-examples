# Music — "Yoclip: What's Your Big Idea? — v2"

The score is `assets/audio/Clap Roll Sunrise.mp3` (wired in `yoclip.yaml`,
envelope beat-mapped below). To replace it, drop a new file under the same
name — or generate one (e.g. Suno) with the prompt further down.

## Suno prompt

> Upbeat cinematic electronic, 120 BPM, 89 seconds, punchy four-on-the-floor
> kick, wide analog synth pads, sparkling arpeggios, no vocals. Structure:
> 0:00 sparse intro (single pulsing synth, room for typewriter clicks and
> the backspace sweep) → 0:05 energy lift with full kick and bass as the
> monolith world opens up → 0:10 a playful peak for the portal vortex →
> 0:16 confident groove, brand-anthem vibe → 1:18 big drop with rising
> noise sweep into driving peak (tunnel flythrough) → 1:23 clean resolve
> to a warm major chord, soft outro to 1:29. Mood: optimistic, premium,
> "the future is now" — Gamma/Apple launch film energy.

## Beat map (composition frames @30fps)

| Time | Frame | Moment | Envelope |
|------|-------|--------|----------|
| 0:00–0:06 | 0–180 | hook typewriter + erase (silent) | — |
| 0:06 | 180 | music starts (monolith world opens) | fade-in 0 → 0.85 over 30f |
| 0:16 | 468 | portal exit → generate | duck → slam to 1.0 (492) |
| 1:18 | 2355 | tunnel flythrough drop | duck → slam to 1.0 (2379) |
| 1:25 | 2565 | end card settle | fade to 0 over 120f |

The envelope in `yoclip.yaml → audio.tracks[0]` already encodes these
fade-in/duck/slam/fade moves (Studio preview + export honor it; the CLI
renderer mixes the track into the mp4).
