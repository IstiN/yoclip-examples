# MUSIC — REDEFINE (EPAM AI/Run promo, v2)

## Slot

`assets/audio/score_placeholder.mp3` — 72 s of silence standing in for the
final score. Replace it with the real track (same filename, or update
`yoclip.yaml → audio.tracks`), then tune `start` so the first downbeat lands
on the cover headline reveal (~frame 40 ≈ 1.3 s).

## Direction

Confident, engineered, forward-moving. Not EDM-drop loud, not corporate
ukulele. Think: dark cinematic electronica with a pulse — the sound of a
technology leader, not a startup. The v2 cut is case-driven: the music
should lift noticeably into the PostNL punch (~0:22) and keep energy through
both client stories, then resolve warm for the CTA.

## Suno prompt

```
[style]
dark cinematic electronica, modern tech-corporate, deep pulsing bass,
clean digital percussion, evolving synth arpeggios, subtle piano accents,
spacious atmospheric pads, confident and premium, no vocals, instrumental,
118 bpm, 4/4, minor key with a hopeful lift, builds steadily to a crisp
final hit, high-end production, wide mix

[structure]
0:00 sparse pulse + air (logo moment)
0:07 bass and arps enter, momentum builds (the hype gap)
0:15 full groove, driving but restrained (AI 360)
0:22 energy lift — tighter percussion, rising arps (PostNL punch)
0:36 second lift, warmer synths (Baker Hughes value quote)
0:45 confident plateau (tools + talent)
0:55 human warm breakdown, piano lead (analyst quote)
1:02 final build
1:07 crisp last hit, short tail (CTA)
```

## Timing notes (30 fps, 2070 frames ≈ 69 s)

- Scene cuts (project.js): cover 0–170 · hype_gap 150–430 ·
  framework 410–660 · postnl 640–1070 · baker 1050–1360 · tools 1340–1570 ·
  talent 1550–1750 · quote 1730–1900 · cta 1880–2070.
- After dropping in the real track, fine-tune scene starts in `project.js`
  so cuts land on downbeats (1 bar @118 BPM ≈ 61 frames) — overlap
  neighbours by ~10–20 frames to keep the crossfades.
- End: hard cut on the last hit, no fade-out (CTA holds to the final frame).

## Licensing

Per EPAM social media guidelines, music must be copyright-cleared before
any external use. Suno output with a paid plan is commercial-use cleared;
otherwise use a licensed library track with the same character.
