#!/usr/bin/env python3
"""Independent overlapping-window ASR cross-check, with no script/lyric prompt."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets/audio/level_up.wav"
OUT = ROOT / "analysis/vocal_transcription_windows_raw.json"
MODEL = "small.en"
SR = 16000
WINDOW = 8.0
STEP = 6.0


def main() -> None:
    model = WhisperModel(MODEL, device="cpu", compute_type="int8", cpu_threads=8)
    audio = np.frombuffer(subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(AUDIO), "-ac", "1", "-ar", str(SR),
        "-f", "f32le", "-",
    ]), dtype="<f4")
    duration = len(audio) / SR
    windows = []
    start = 0.0
    while start < duration:
        end = min(duration, start + WINDOW)
        excerpt = audio[round(start * SR):round(end * SR)]
        segments, _ = model.transcribe(
            excerpt, language="en", beam_size=5, temperature=0.0,
            word_timestamps=True, condition_on_previous_text=False,
            vad_filter=False, initial_prompt=None,
            repetition_penalty=1.1, no_repeat_ngram_size=3,
        )
        result = []
        for segment in segments:
            item = {
                "start": round(start + float(segment.start), 5),
                "end": round(start + float(segment.end), 5),
                "text": segment.text.strip(),
                "avgLogprob": round(float(segment.avg_logprob), 6),
                "noSpeechProb": round(float(segment.no_speech_prob), 6),
                "compressionRatio": round(float(segment.compression_ratio), 6),
                "words": [
                    {
                        "start": None if word.start is None else round(start + float(word.start), 5),
                        "end": None if word.end is None else round(start + float(word.end), 5),
                        "word": word.word,
                        "probability": round(float(word.probability), 6),
                    }
                    for word in (segment.words or [])
                ],
            }
            result.append(item)
            print(f"window {start:5.1f}-{end:5.1f}: [{item['start']:7.3f}-{item['end']:7.3f}] "
                  f"{item['text']} (logp={item['avgLogprob']:.3f}, ns={item['noSpeechProb']:.3f})", flush=True)
        windows.append({"windowStart": start, "windowEnd": end, "segments": result})
        if end >= duration:
            break
        start += STEP
    OUT.write_text(json.dumps({
        "source": "assets/audio/level_up.wav", "tool": "faster-whisper 1.2.1",
        "model": MODEL, "windowSeconds": WINDOW, "stepSeconds": STEP,
        "settings": {
            "language": "en", "beamSize": 5, "temperature": 0.0,
            "wordTimestamps": True, "conditionOnPreviousText": False,
            "vadFilter": False, "initialPrompt": None,
            "repetitionPenalty": 1.1, "noRepeatNgramSize": 3,
        },
        "windows": windows,
        "caution": "Independent overlapping-window diagnostic; no fantasy-script vocabulary was supplied. Musical ASR can hallucinate, especially repeated tokens.",
    }, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
