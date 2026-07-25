# MUSIC — DMTOOLS (EPAM open-source promo)

## Slot

`assets/audio/system_pulse.mp3` — the final track ("System Pulse", 88 s),
wired into `yoclip.yaml → audio.tracks` at `start: 0`. This file documents
the brief that produced it, for future recuts.

## Direction

Precise, engineered, quietly confident — the sound of an automation factory
coming online, not a startup launch. Dark cinematic electronica with a
mechanical pulse: this film is about machines doing delivery work while
humans approve. Energy lifts into the architecture run (~0:29, the
step-by-step light-up), peaks at the pull request, resolves warm and open
for the open-source CTA. No vocals — the film may carry a voiceover.

## Suno prompt

```
[style]
dark cinematic electronica, modern tech-corporate, deep pulsing sub bass,
precise digital percussion with subtle mechanical clicks and servo ticks,
evolving synth arpeggios, sparse piano accents, spacious atmospheric pads,
confident and premium, no vocals, instrumental, 116 bpm, 4/4, minor key
with a hopeful lift, steady build to a crisp final hit, high-end
production, wide clean mix

[structure]
0:00 sparse pulse + air (cover wordmark)
0:06 bass and arps enter, tension (the duct-tape problem)
0:15 groove locks in, connected and flowing (orchestration layer)
0:24 rhythmic counters, precise and numeric (320+ tools)
0:32 energy lift — tighter percussion, rising arp sequence
      (architecture: ticket -> PR, step by step)
0:46 confident plateau, code-like arps (jobs in JavaScript)
0:56 warm opening, pads widen (four ways in)
1:04 final build
1:09 resolve and dissolve — long soft tail (CTA + QR, fade out)
```

## Timing notes (30 fps, 2180 frames ≈ 73 s)

- Scene cuts (project.js): cover 0–190 · problem 170–470 · layer 450–730 ·
  numbers 710–990 · architecture 970–1390 · code 1370–1700 ·
  paths 1680–1940 · cta 1920–2180 · fadeout 2130–2180.
- After dropping in the real track, fine-tune scene starts in `project.js`
  so cuts land on downbeats (1 bar @116 BPM ≈ 62 frames) — keep the ~20
  frame overlaps for the crossfades.
- End: no hard cut — the track should dissolve under the QR card; the
  `yoclip.yaml` envelope (frame 2070, ramp 110) carries the last bars to
  silence as the frame fades to the canvas color.
- If a voiceover is added (see `VOICE_PROMPTS.md`), duck the bed ~8–10 dB
  under speech; keep the step "ticks" audible under the architecture scene.

## Licensing

Per EPAM social media guidelines, music must be copyright-cleared before
any external use. Suno output with a paid plan is commercial-use cleared;
otherwise use a licensed library track with the same character.
