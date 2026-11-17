# Level Up! — audio analysis

## Source and tools

- Master: `assets/audio/level_up.wav`, PCM signed 16-bit, 48 kHz stereo, **102.000 s**.
- Decode/features: `ffmpeg` mono float PCM → `numpy 2.5.3` RMS, 4096-point FFT bands and spectral flux.
- Speech: local `faster-whisper 1.2.1`, `small.en`, word timestamps, no fabricated prompt.
- Rebuild all machine-readable artifacts with `python3 tools/analyze_audio.py`.

## Clock

- Nominal tempo: **140 BPM**; autocorrelation estimate: **139.998 BPM**.
- Beat period: **0.428571 s**; refined local-onset grid phase: **0.032 s**.
- **238 beats**, downbeats every four beats. The grid is stored explicitly in `audio_events.json` and compiled into `lib/audio_features.js` as `LEVEL_BEAT_TIMES`.
- A beat is 12.857142 frames at 30 fps, so animation uses fractional beat positions rather than rounding every beat to 13 frames.
- Strong-grid onset audit from the analysis pass: about 99% within 40 ms; median residual about −2.7 ms.

## Per-frame features

`audio_features.json` contains exactly **3060** entries. Each entry has:

```text
time, rms, bass, mid, high, onset, beatPulse, sectionIndex
```

RMS and FFT bands use robust 8th–96th percentile normalization, clipping and a 0.72 display gamma. Onset is positive spectral flux with local-peak emphasis. These are visual control signals, not a claim about loudness standards. Generated means: RMS 0.498, bass 0.459, high 0.552. The explicit impact list has 220 spaced spectral-onset events.

## Musical/narrative sections

Section boundaries combine measured announcer events with onset/energy transitions. They are stored in both seconds and beats in `audio_events.json`.

| Section | Beats | Approx. seconds | Evidence |
|---|---:|---:|---|
| boot | 0–24 | 0–10.286 | Arena build; `System loading` at 9.58 |
| versus | 24–60 | 10.286–25.714 | Yoclip/CapCut name calls and introductions |
| duel | 60–96 | 25.714–41.143 | `Ready?` at 25.74 and `FIGHT!` at 27.04 |
| overclock | 96–116 | 41.143–49.714 | First long waka phrase begins at 40.86 |
| chase | 116–160 | 49.714–68.571 | Sustained waka-waka arcade passage |
| showdown | 160–182 | 68.571–78.000 | Final combat build before result call |
| ko | 182–186 | 78.000–79.714 | `YOCLIP WINS` at 78.66 |
| victory | 186–238 | 79.714–102.000 | `LEVEL UP` at 80.24; victory sound at 98.66 |

## Detected announcer/vocal events

The actual audio contains the following useful cues (display spelling is normalized for the two product names):

- 9.58–11.18 — `System loading.`
- 12.48–13.94 — Yoclip name call, with a stuttered/chopped delivery.
- 17.24–17.50 and 19.94–20.94 — CapCut name calls.
- 24.12–25.18 — Yoclip name call.
- 25.74–26.82 — `Ready? Ready?`
- 27.04–27.60 — `Fight! Fight!`
- 40.86 through about 78.66 — repeated `waka-waka` vocal/chomp material; curated into short caption windows rather than one 38-second subtitle.
- 78.66–79.70 — Yoclip wins.
- 80.24–82.76 — `Level up!`
- 98.66–100.14 — victory-sound segment.

Raw model output is preserved in `vocal_transcription_raw.json`. It sometimes hears the product names as `YALL CLIP`, `JAP CUT` or `Your Clips`; those are ASR spelling errors, not new lyrics. The supplied `brief_audio_script.txt` is a creative brief only. Undetected lines such as `Finish him`, `Let's go` or crowd chants are **not** represented as transcription facts.
