#!/usr/bin/env python3
"""Unprompted local ASR diagnostic for level_up.wav; never aligns to the fantasy script."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets/audio/level_up.wav"
OUT = ROOT / "analysis/vocal_transcription_raw.json"
MODEL = "small.en"


def main() -> None:
    model = WhisperModel(MODEL, device="cpu", compute_type="int8", cpu_threads=8)
    audio = np.frombuffer(subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(AUDIO), "-ac", "1", "-ar", "16000",
        "-f", "f32le", "-",
    ]), dtype="<f4")
    segments, info = model.transcribe(
        audio, language="en", beam_size=5, temperature=0.0,
        word_timestamps=True, condition_on_previous_text=False,
        vad_filter=False, initial_prompt=None,
    )
    output = []
    for segment in segments:
        item = {
            "id": segment.id,
            "start": round(float(segment.start), 5),
            "end": round(float(segment.end), 5),
            "text": segment.text.strip(),
            "avgLogprob": round(float(segment.avg_logprob), 6),
            "noSpeechProb": round(float(segment.no_speech_prob), 6),
            "compressionRatio": round(float(segment.compression_ratio), 6),
            "words": [
                {
                    "start": None if word.start is None else round(float(word.start), 5),
                    "end": None if word.end is None else round(float(word.end), 5),
                    "word": word.word,
                    "probability": round(float(word.probability), 6),
                }
                for word in (segment.words or [])
            ],
        }
        output.append(item)
        print(f"[{item['start']:7.3f}–{item['end']:7.3f}] {item['text']} "
              f"(logp={item['avgLogprob']:.3f}, ns={item['noSpeechProb']:.3f})", flush=True)
    payload = {
        "source": "assets/audio/level_up.wav",
        "tool": "faster-whisper",
        "toolVersion": "1.2.1",
        "model": MODEL,
        "settings": {
            "language": "en", "beamSize": 5, "temperature": 0.0,
            "wordTimestamps": True, "conditionOnPreviousText": False,
            "vadFilter": False, "initialPrompt": None,
        },
        "detectedLanguage": info.language,
        "languageProbability": round(float(info.language_probability), 6),
        "duration": round(float(info.duration), 6),
        "durationAfterVad": round(float(info.duration_after_vad), 6),
        "segments": output,
        "caution": "Raw ASR on a dense musical mix is diagnostic, not ground truth. No fantasy-script prompt or lyric vocabulary was supplied.",
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
