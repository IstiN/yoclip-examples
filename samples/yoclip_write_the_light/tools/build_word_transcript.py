#!/usr/bin/env python3
"""Export the same syllable-weighted word cues used by lib/timeline.js.

The hand-aligned line cues remain the timing source. This script makes the
word-level alignment inspectable without adding filesystem APIs to QuickJS.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "lib/timeline.js").read_text()
match = re.search(r"var LYRIC_CUES = (\[.*?\]);\nvar BEAT_TIMES", source, re.S)
if not match:
    raise SystemExit("LYRIC_CUES not found")
lines = json.loads(match.group(1))


def syllables(word: str) -> int:
    clean = re.sub(r"[^a-zа-яё0-9]", "", word.lower())
    if not clean:
        return 1
    count = len(re.findall(r"[aeiouyаеёиоуыэюя]+", clean)) or 1
    if len(clean) > 7 and count < 2:
        count = 2
    return max(1, count)


words: list[dict] = []
for line_index, line in enumerate(lines):
    tokens = line["text"].split()
    weights = [syllables(token) + (0.45 if re.search(r"[.!?…—]$", token) else 0) for token in tokens]
    total = sum(weights)
    start = float(line["t"])
    line["words"] = []
    for word_index, (token, weight) in enumerate(zip(tokens, weights)):
        end = float(line["end"]) if word_index == len(tokens) - 1 else start + (float(line["end"]) - float(line["t"])) * weight / total
        cue = {
            "act": line["act"], "t": start, "end": end, "text": token,
            "syllables": syllables(token), "lineIndex": line_index,
            "wordIndex": word_index, "index": len(words),
        }
        words.append(cue)
        line["words"].append(cue)
        start = end

out = ROOT / "assets/audio/write_the_light.words.json"
out.write_text(json.dumps({
    "source": "write_the_light.wav",
    "alignment": "hand-aligned line cues + deterministic syllable-weighted word subdivision",
    "fps": 30,
    "lines": lines,
    "words": words,
}, ensure_ascii=False, indent=2) + "\n")

text = [
    "# WRITE THE LIGHT — detailed word transcript",
    "# Line starts are hand-aligned to the master; word intervals are syllable-weighted.",
    "# [start–end] word · line/word",
]
for word in words:
    text.append(f"[{word['t']:07.3f}–{word['end']:07.3f}] {word['text']} · {word['lineIndex']:02d}/{word['wordIndex']:02d}")
(ROOT / "assets/audio/write_the_light.transcript.txt").write_text("\n".join(text) + "\n")
print(f"Exported {len(lines)} lines / {len(words)} words to {out.relative_to(ROOT)}")
