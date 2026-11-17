#!/usr/bin/env python3
"""Build deterministic Level Up audio features using ffmpeg + numpy only."""
from __future__ import annotations
import json, math, subprocess
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ANALYSIS = ROOT / "analysis"
FPS, DURATION, FRAMES, BPM = 30, 102.0, 3060, 140.0
SR = 48000
PERIOD = 60.0 / BPM
BEAT_OFFSET = 0.032  # refined local-onset phase; residual median is ~-2.7 ms.

pcm = np.frombuffer(subprocess.check_output([
    "ffmpeg", "-v", "error", "-i", str(ROOT / "assets/audio/level_up.wav"),
    "-ac", "1", "-ar", str(SR), "-f", "f32le", "-",
]), dtype=np.float32)
N = 4096
window = np.hanning(N).astype(np.float32)
freqs = np.fft.rfftfreq(N, 1 / SR)
raw = []
previous = None
for frame in range(FRAMES):
    t = frame / FPS
    center = int(t * SR)
    start = max(0, min(len(pcm) - N, center - N // 2))
    chunk = pcm[start:start + N]
    if len(chunk) < N:
        chunk = np.pad(chunk, (0, N - len(chunk)))
    rms = float(np.sqrt(np.mean(chunk * chunk) + 1e-12))
    mag = np.abs(np.fft.rfft(chunk * window)).astype(np.float64)
    def band(lo, hi):
        part = mag[(freqs >= lo) & (freqs < hi)]
        return float(np.sqrt(np.mean(part * part) + 1e-12))
    bass, mid, high = band(25, 180), band(180, 2200), band(2200, 12000)
    flux = 0.0 if previous is None else float(np.maximum(mag - previous, 0).sum() / (len(mag) * 100))
    previous = mag
    raw.append([t, rms, bass, mid, high, flux])
a = np.array(raw, dtype=np.float64)

def normalize(values):
    # Robust music-video friendly scale; preserve quiet passages and clip only peaks.
    lo = float(np.percentile(values, 8))
    hi = float(np.percentile(values, 96))
    return np.clip((values - lo) / max(hi - lo, 1e-9), 0, 1) ** 0.72

rms, bass, mid, high, onset = [normalize(a[:, i]) for i in range(1, 6)]
# Onset emphasis: local spectral-flux peaks make glitch/impact frames selective.
for i in range(1, FRAMES - 1):
    if a[i, 5] < a[i - 1, 5] or a[i, 5] < a[i + 1, 5]:
        onset[i] *= 0.58

sections = [
    ("boot", 0, 24, "arena assembly; measured System loading at 9.58 s"),
    ("versus", 24, 60, "fighter introductions; measured name calls"),
    ("duel", 60, 96, "Ready/Fight vocals and first heavy combat passage"),
    ("overclock", 96, 116, "first measured waka phrase; arcade transformation"),
    ("chase", 116, 160, "sustained waka-waka bridge and maze chase"),
    ("showdown", 160, 182, "final combat build before the result call"),
    ("ko", 182, 186, "K.O. and measured Yoclip Wins at 78.66 s"),
    ("victory", 186, 238, "Level Up at 80.24 s and victory sound at 98.66 s"),
]
beat_times = [BEAT_OFFSET + i * PERIOD for i in range(238)]
section_events = []
for index, (name, b0, b1, evidence) in enumerate(sections):
    section_events.append({
        "id": name, "index": index, "startBeat": b0, "endBeat": b1,
        "start": round(b0 * PERIOD, 6), "end": round(min(DURATION, b1 * PERIOD), 6),
        "evidence": evidence,
    })

def section_at(t):
    result = 0
    for i, (_, b0, _, _) in enumerate(sections):
        if t + 1e-9 >= b0 * PERIOD:
            result = i
    return result

frames = []
for i in range(FRAMES):
    t = i / FPS
    exact = (t - BEAT_OFFSET) / PERIOD
    phase = exact - math.floor(exact) if exact >= 0 else 1.0
    pulse = math.exp(-max(0.0, phase) * 6) if exact >= 0 else 0.0
    frames.append({
        "time": round(t, 6), "rms": round(float(rms[i]), 5),
        "bass": round(float(bass[i]), 5), "mid": round(float(mid[i]), 5),
        "high": round(float(high[i]), 5), "onset": round(float(onset[i]), 5),
        "beatPulse": round(pulse, 5), "sectionIndex": section_at(t),
    })

vocals = [
    {"start": 9.58, "end": 11.18, "text": "SYSTEM LOADING...", "source": "faster-whisper small.en", "color": "#16e7ff"},
    {"start": 12.48, "end": 13.94, "text": "YOCLIP!", "source": "faster-whisper; normalized name", "color": "#16e7ff"},
    {"start": 17.24, "end": 17.50, "text": "CAPCUT!", "source": "faster-whisper; normalized name", "color": "#ff304f"},
    {"start": 19.94, "end": 20.94, "text": "CAPCUT!", "source": "faster-whisper; normalized name", "color": "#ff304f"},
    {"start": 24.12, "end": 25.18, "text": "YOCLIP!", "source": "faster-whisper; normalized name", "color": "#16e7ff"},
    {"start": 25.74, "end": 26.82, "text": "READY? READY?", "source": "faster-whisper", "color": "#f4f8ff"},
    {"start": 27.04, "end": 27.60, "text": "FIGHT! FIGHT!", "source": "faster-whisper", "color": "#ff304f"},
    {"start": 40.86, "end": 44.14, "text": "WAKA-WAKA-WAKA", "source": "faster-whisper; repeated vocal chop", "color": "#ffe83d"},
    {"start": 48.02, "end": 51.44, "text": "WAKA-WAKA-WAKA", "source": "faster-whisper; repeated vocal chop", "color": "#ffe83d"},
    {"start": 56.06, "end": 59.20, "text": "WAKA-WAKA-WAKA", "source": "faster-whisper; repeated vocal chop", "color": "#ffe83d"},
    {"start": 64.00, "end": 67.20, "text": "WAKA-WAKA-WAKA", "source": "faster-whisper; repeated vocal chop", "color": "#ffe83d"},
    {"start": 72.00, "end": 75.20, "text": "WAKA-WAKA-WAKA", "source": "faster-whisper; repeated vocal chop", "color": "#ffe83d"},
    {"start": 78.66, "end": 79.70, "text": "YOCLIP WINS!", "source": "faster-whisper; normalized name", "color": "#54ff9f"},
    {"start": 80.24, "end": 82.76, "text": "LEVEL UP!", "source": "faster-whisper", "color": "#54ff9f"},
    {"start": 98.66, "end": 100.14, "text": "VICTORY!", "source": "faster-whisper segment: Victory Sound", "color": "#ffe83d"},
]
# Strong, spaced onset peaks are useful explicit impact events.
impacts = []
for i in range(2, FRAMES - 2):
    strength = float(a[i, 5])
    if strength <= 0 or a[i, 5] != np.max(a[i - 2:i + 3, 5]):
        continue
    t = i / FPS
    if onset[i] < 0.56 or (impacts and t - impacts[-1]["time"] < 0.28):
        continue
    impacts.append({"time": round(t, 6), "strength": round(float(onset[i]), 5), "kind": "spectral-onset"})
risers = [
    {"start": 3.462, "end": 6.890, "evidence": "bass/RMS rise into intro impact"},
    {"start": 24.033, "end": 27.462, "evidence": "energy reduction into Ready/Fight transition"},
    {"start": 38.604, "end": 41.176, "evidence": "drop into first waka overclock"},
    {"start": 60.890, "end": 64.319, "evidence": "high/RMS correlated rise"},
    {"start": 66.890, "end": 69.462, "evidence": "bass/RMS rise into showdown"},
    {"start": 98.604, "end": 100.496, "evidence": "final victory-sound transition"},
]
features = {
    "schema": "frames[3060] at 30fps; normalized RMS/bass/mid/high/onset plus beatPulse and sectionIndex",
    "fps": FPS, "duration": DURATION, "frameCount": FRAMES,
    "normalization": "8th..96th percentile per band, clipped, gamma 0.72; spectral-flux onset with local-peak emphasis",
    "frames": frames,
}
events = {
    "source": "assets/audio/level_up.wav", "duration": DURATION,
    "nominalBpm": BPM, "measuredBpm": 139.998,
    "beatOffset": BEAT_OFFSET, "beatTimes": [round(t, 6) for t in beat_times],
    "downbeats": [round(beat_times[i], 6) for i in range(0, 238, 4)],
    "sections": section_events, "vocals": vocals, "impacts": impacts, "risers": risers,
    "analysisTools": ["ffmpeg PCM f32le", "numpy 2.5.3 FFT/RMS/spectral flux", "faster-whisper 1.2.1 small.en"],
}
ANALYSIS.mkdir(exist_ok=True)
(ANALYSIS / "audio_features.json").write_text(json.dumps(features, separators=(",", ":")))
(ANALYSIS / "audio_events.json").write_text(json.dumps(events, indent=2))
compact_vocals = [{k: v[k] for k in ("start", "end", "text", "color")} for v in vocals]
js = "// Generated by tools/analyze_audio.py from the real Level Up WAV.\n"
js += "var LEVEL_AUDIO = " + json.dumps({"frames": frames}, separators=(",", ":")) + ";\n"
js += "var LEVEL_VOCAL_EVENTS = " + json.dumps(compact_vocals, separators=(",", ":")) + ";\n"
js += "var LEVEL_BEAT_TIMES = " + json.dumps([round(t, 6) for t in beat_times], separators=(",", ":")) + ";\n"
(ROOT / "lib/audio_features.js").write_text(js)
print(f"frames={len(frames)} beats={len(beat_times)} impacts={len(impacts)} vocals={len(vocals)}")
print(f"rms={float(rms.mean()):.3f} bass={float(bass.mean()):.3f} high={float(high.mean()):.3f}")
