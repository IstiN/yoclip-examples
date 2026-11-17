#!/usr/bin/env python3
"""Measure word timings with MLX Whisper, one known lyric line at a time.

Unlike build_word_transcript.py (deterministic syllable estimation), this uses
Whisper cross-attention DTW timestamps on the real master audio. Recognition is
mapped back to the known lyric tokens, cached per line, and exported to the JS
runtime plus inspectable JSON/TXT transcripts.

Run with a Python environment containing mlx-whisper and ffmpeg on PATH.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets/audio/write_the_light.wav"
CACHE = ROOT / ".yoclip_cache/alignment"


def syllables(word: str) -> int:
    clean = re.sub(r"[^a-zа-яё0-9]", "", word.lower())
    if not clean:
        return 1
    count = len(re.findall(r"[aeiouyаеёиоуыэюя]+", clean)) or 1
    if len(clean) > 7 and count < 2:
        count = 2
    return max(1, count)


def norm(word: str) -> str:
    return re.sub(r"[^a-z0-9а-яё]", "", word.lower())


def recognized_words(result: dict, offset: float) -> list[dict]:
    words = []
    for segment in result.get("segments", []):
        for word in segment.get("words", []):
            words.append({
                "text": word["word"].strip(),
                "start": float(word["start"]) + offset,
                "end": float(word["end"]) + offset,
                "probability": float(word.get("probability", 0)),
            })
    return words


def map_to_expected(line: dict, recognized: list[dict]) -> list[dict]:
    expected = line["text"].split()
    en = [norm(token) for token in expected]
    rn = [norm(word["text"]) for word in recognized]
    mapped: list[dict | None] = [None] * len(expected)
    matcher = difflib.SequenceMatcher(a=en, b=rn, autojunk=False)
    for op, e0, e1, r0, r1 in matcher.get_opcodes():
        if op == "insert":
            continue
        if op == "delete" or r0 == r1:
            continue
        start, end = recognized[r0]["start"], recognized[r1 - 1]["end"]
        probability = sum(w["probability"] for w in recognized[r0:r1]) / (r1 - r0)
        if op == "equal" and e1 - e0 == r1 - r0:
            for ei, ri in zip(range(e0, e1), range(r0, r1)):
                mapped[ei] = {**recognized[ri], "text": expected[ei]}
        else:
            weights = [syllables(token) for token in expected[e0:e1]]
            cursor = start
            for offset, weight in enumerate(weights):
                word_end = end if offset == len(weights) - 1 else cursor + (end - start) * weight / sum(weights)
                mapped[e0 + offset] = {
                    "text": expected[e0 + offset], "start": cursor, "end": word_end,
                    "probability": probability,
                }
                cursor = word_end
    # Fill tokens Whisper missed using nearby measured anchors only.
    for index, word in enumerate(mapped):
        if word is not None:
            continue
        previous = next((mapped[j] for j in range(index - 1, -1, -1) if mapped[j]), None)
        following = next((mapped[j] for j in range(index + 1, len(mapped)) if mapped[j]), None)
        start = previous["end"] if previous else float(line["t"])
        end = following["start"] if following else float(line["end"])
        mapped[index] = {
            "text": expected[index], "start": start, "end": max(start + 0.06, end),
            "probability": 0.0, "estimated": True,
        }
    return [word for word in mapped if word]


def align_line(index: int, line: dict, model: str, force: bool, full_words: list[dict]) -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    cache = CACHE / f"line_{index:02d}.json"
    start = max(0.0, float(line["t"]) - 0.35)
    end = float(line["end"]) + 0.35
    signature = {"text": line["text"], "t": line["t"], "end": line["end"]}
    if cache.exists() and not force:
        cached = json.loads(cache.read_text())
        result = cached if cached.get("_yoclipLine") == signature else None
        if result is None:
            force = True
    else:
        result = None
    if result is None:
        excerpt = CACHE / f"line_{index:02d}.wav"
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{start:.5f}", "-t", f"{end - start:.5f}",
            "-i", str(AUDIO), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(excerpt),
        ], check=True)
        import mlx_whisper
        result = mlx_whisper.transcribe(
            str(excerpt), path_or_hf_repo=model, language="en", initial_prompt=line["text"],
            word_timestamps=True, condition_on_previous_text=False, temperature=0.0,
        )
        cache.write_text(json.dumps({**result, "_yoclipLine": signature}, ensure_ascii=False, indent=2))
        excerpt.unlink(missing_ok=True)
    speech = map_to_expected(line, recognized_words(result, start))
    source = "line"
    candidates = [word for word in full_words if float(line["t"]) - 0.15 <= (word["start"] + word["end"]) / 2 <= float(line["end"]) + 0.15]
    if candidates:
        full_speech = map_to_expected(line, candidates)
        missing = sum(1 for word in speech if word.get("estimated"))
        full_missing = sum(1 for word in full_speech if word.get("estimated"))
        # The full musical-context pass has more reliable relative word timing;
        # use it whenever it covers the same tokens, not only when it has fewer
        # misses. Narrow windows fill omissions and refine individual words.
        if full_missing <= missing:
            speech = full_speech
            source = "full"
            result = {**result, "text": " ".join(word["text"] for word in candidates)}
    for word in speech:
        word["start"] = max(float(line["t"]) - 0.3, word["start"])
        word["end"] = max(word["start"] + 0.06, min(float(line["end"]) + 0.3, word["end"]))
    # Display activation stays alive between words; speechStart/speechEnd retain
    # the actual measured boundaries for inspection and future refinement.
    starts = []
    for word in speech:
        value = min(float(line["end"]) - 0.04, max(float(line["t"]), word["start"]))
        if starts:
            value = max(value, starts[-1] + 0.03)
        starts.append(min(float(line["end"]) - 0.02, value))
    cues = []
    for word_index, (word, display_start) in enumerate(zip(speech, starts)):
        display_end = starts[word_index + 1] if word_index + 1 < len(starts) else float(line["end"])
        cues.append({
            "act": line["act"], "t": round(display_start, 5), "end": round(max(display_start + 0.02, display_end), 5),
            "speechStart": round(word["start"], 5), "speechEnd": round(word["end"], 5),
            "text": word["text"], "syllables": syllables(word["text"]),
            "probability": round(word["probability"], 5),
            **({"estimated": True} if word.get("estimated") else {}),
        })
    return {"recognized": result.get("text", "").strip(), "words": cues, "source": source}


def refine_word(line_index: int, word_index: int, word: dict, model: str, force: bool) -> tuple[dict, bool]:
    """Re-transcribe a tight word excerpt; accept only a plausible interior match."""
    if word.get("estimated") or not norm(word["text"]):
        return word, False
    cache = ROOT / ".yoclip_cache/word_alignment"
    cache.mkdir(parents=True, exist_ok=True)
    path = cache / f"{line_index:02d}_{word_index:02d}.json"
    coarse_start = float(word.get("coarseStart", word["speechStart"]))
    coarse_end = float(word.get("coarseEnd", word["speechEnd"]))
    start, end = max(0.0, coarse_start - 0.18), coarse_end + 0.18
    signature = {"text": word["text"], "speechStart": round(coarse_start, 5), "speechEnd": round(coarse_end, 5)}
    if path.exists() and not force:
        cached = json.loads(path.read_text())
        result = cached if cached.get("_yoclipWord") == signature else None
        if result is None:
            force = True
    else:
        result = None
    if result is None:
        excerpt = cache / f"{line_index:02d}_{word_index:02d}.wav"
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{start:.5f}", "-t", f"{end - start:.5f}",
            "-i", str(AUDIO), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(excerpt),
        ], check=True)
        import mlx_whisper
        result = mlx_whisper.transcribe(
            str(excerpt), path_or_hf_repo=model, language="en", initial_prompt=word["text"],
            word_timestamps=True, condition_on_previous_text=False, temperature=0.0,
        )
        path.write_text(json.dumps({"chunkStart": start, "chunkEnd": end, "result": result, "_yoclipWord": signature}, ensure_ascii=False, indent=2))
        excerpt.unlink(missing_ok=True)
    payload = result.get("result", result)
    chunk_start = float(result.get("chunkStart", start))
    chunk_end = float(result.get("chunkEnd", end))
    candidates = recognized_words(payload, chunk_start)
    expected = norm(word["text"])
    best = None
    for candidate in candidates:
        recognized = norm(candidate["text"])
        similarity = difflib.SequenceMatcher(a=expected, b=recognized).ratio()
        center = (candidate["start"] + candidate["end"]) / 2
        coarse_center = (coarse_start + coarse_end) / 2
        score = similarity - abs(center - coarse_center) * 0.04
        if best is None or score > best[0]:
            best = (score, similarity, candidate)
    if best is None:
        word["fineSource"] = "coarse-no-recognition"
        return word, False
    _, similarity, candidate = best
    interior = candidate["start"] > chunk_start + 0.025 and candidate["end"] < chunk_end - 0.025
    plausible = similarity >= 0.5 or (len(expected) <= 2 and len(candidates) == 1)
    new_start, new_end = candidate["start"], candidate["end"]
    bounded = abs(new_start - coarse_start) <= 0.22 and abs(new_end - coarse_end) <= 0.25 and new_end > new_start + 0.04
    if not (interior and plausible and bounded):
        word["fineSource"] = "coarse-rejected-window"
        word["fineRecognized"] = candidate["text"]
        return word, False
    word["coarseStart"], word["coarseEnd"] = round(coarse_start, 5), round(coarse_end, 5)
    word["speechStart"], word["speechEnd"] = round(new_start, 5), round(new_end, 5)
    word["fineProbability"] = round(candidate["probability"], 5)
    word["fineRecognized"] = candidate["text"]
    word["fineSource"] = "word-mlx"
    return word, True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="mlx-community/whisper-large-v3-turbo")
    parser.add_argument("--force", action="store_true", help="ignore per-line transcription cache")
    parser.add_argument("--force-full", action="store_true", help="regenerate the full unprompted fallback transcript")
    parser.add_argument("--fine", action="store_true", help="run a second tight-window transcription pass per word")
    parser.add_argument("--force-fine", action="store_true", help="ignore cached word-level refinement windows")
    parser.add_argument("--only", type=int, action="append", help="align only this zero-based line index")
    args = parser.parse_args()
    source = (ROOT / "lib/timeline.js").read_text()
    match = re.search(r"var LYRIC_CUES = (\[.*?\]);\nvar BEAT_TIMES", source, re.S)
    if not match:
        raise SystemExit("LYRIC_CUES not found")
    lines = json.loads(match.group(1))
    CACHE.mkdir(parents=True, exist_ok=True)
    full_path = CACHE / "full_unprompted.json"
    if args.force_full or not full_path.exists():
        print("Full unprompted pass · building hybrid fallback transcript", flush=True)
        import mlx_whisper
        full_result = mlx_whisper.transcribe(
            str(AUDIO), path_or_hf_repo=args.model, language="en", word_timestamps=True,
            condition_on_previous_text=False, temperature=0.0, verbose=False,
        )
        full_path.write_text(json.dumps(full_result, ensure_ascii=False, indent=2))
    full_words = recognized_words(json.loads(full_path.read_text()), 0.0)
    aligned_path = ROOT / "assets/audio/write_the_light.aligned.json"
    existing = json.loads(aligned_path.read_text())["lines"] if aligned_path.exists() else [None] * len(lines)
    output_lines = []
    for index, line in enumerate(lines):
        if not line.get("spoken", True):
            aligned = {"recognized": "[visual only — no sung vocal]", "words": []}
            print(f"[{index + 1:02d}/{len(lines)}] visual · {line['text']}", flush=True)
        elif args.only is not None and index not in args.only:
            aligned = existing[index] if index < len(existing) else None
            if aligned is None:
                raise SystemExit(f"line {index} has no cached alignment; run without --only first")
        elif (index < len(existing) and existing[index] is not None and not args.force
              and existing[index].get("text") == line["text"]
              and float(existing[index].get("t", -1)) == float(line["t"])
              and float(existing[index].get("end", -1)) == float(line["end"])):
            aligned = existing[index]
            print(f"[{index + 1:02d}/{len(lines)}] cached · {line['text']}", flush=True)
        else:
            print(f"[{index + 1:02d}/{len(lines)}] Whisper · {line['text']}", flush=True)
            aligned = align_line(index, line, args.model, args.force, full_words)
        line["alignmentSource"] = aligned.get("source", "visual")
        for word_index, word in enumerate(aligned["words"]):
            word.update({"lineIndex": index, "wordIndex": word_index, "aligned": True})
        line["words"] = aligned["words"]
        line["recognized"] = aligned["recognized"]
        output_lines.append(line)
    refined_count = 0
    if args.fine:
        for line_index, line in enumerate(output_lines):
            if args.only is not None and line_index not in args.only:
                continue
            for word_index, word in enumerate(line["words"]):
                refined, accepted = refine_word(line_index, word_index, word, args.model, args.force_fine)
                line["words"][word_index] = refined
                refined_count += int(accepted)
            starts = []
            for word in line["words"]:
                value = min(float(line["end"]) - 0.04, max(float(line["t"]), float(word["speechStart"])))
                if starts:
                    value = max(value, starts[-1] + 0.02)
                starts.append(min(float(line["end"]) - 0.02, value))
            for word_index, word in enumerate(line["words"]):
                word["t"] = round(starts[word_index], 5)
                display_end = starts[word_index + 1] if word_index + 1 < len(starts) else float(line["end"])
                word["end"] = round(max(word["t"] + 0.02, display_end), 5)
            print(f"Fine [{line_index + 1:02d}/{len(lines)}] · {refined_count} accepted · {line['text']}", flush=True)
    for line in output_lines:
        expected_count = len(line["text"].split()) if line.get("spoken", True) else 0
        if len(line["words"]) != expected_count:
            raise ValueError(f"word-count mismatch on {line['text']!r}: {len(line['words'])} != {expected_count}")
        previous_end = float(line["t"])
        for word in line["words"]:
            if float(word["t"]) < previous_end - 0.021 or float(word["end"]) <= float(word["t"]):
                raise ValueError(f"non-monotonic display cue: {word}")
            if not (0 <= float(word["t"]) <= float(word["end"]) <= 201):
                raise ValueError(f"out-of-composition display cue: {word}")
            previous_end = float(word["end"])
    words = []
    for line in output_lines:
        for word in line["words"]:
            word["index"] = len(words)
            words.append(word)
    aligned_path.write_text(json.dumps({
        "source": AUDIO.name, "model": args.model,
        "alignment": "per-line MLX Whisper cross-attention DTW + validated tight-word-window refinement",
        "fineRefinedWords": refined_count,
        "lines": output_lines,
    }, ensure_ascii=False, indent=2) + "\n")
    # JS is generated as ordinary source data; no QuickJS filesystem API needed.
    arrays = [line["words"] for line in output_lines]
    js = "// Generated by tools/align_words_mlx.py from the real master audio.\n"
    js += "var ALIGNED_WORD_TIMINGS = " + json.dumps(arrays, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += "WORD_CUES.length = 0;\n"
    js += "for (var alignedLine = 0; alignedLine < ALIGNED_WORD_TIMINGS.length; alignedLine++) {\n"
    js += "  LYRIC_CUES[alignedLine].words = ALIGNED_WORD_TIMINGS[alignedLine];\n"
    js += "  for (var alignedWord = 0; alignedWord < LYRIC_CUES[alignedLine].words.length; alignedWord++) {\n"
    js += "    LYRIC_CUES[alignedLine].words[alignedWord].index = WORD_CUES.length;\n"
    js += "    WORD_CUES.push(LYRIC_CUES[alignedLine].words[alignedWord]);\n  }\n}\n"
    (ROOT / "lib/word_timings.js").write_text(js)
    (ROOT / "assets/audio/write_the_light.words.json").write_text(json.dumps({
        "source": AUDIO.name, "alignment": "MLX Whisper per-line measured word timings",
        "fps": 30, "lines": output_lines, "words": words,
    }, ensure_ascii=False, indent=2) + "\n")
    text = ["# WRITE THE LIGHT — MLX Whisper measured word transcript", "# display [start–end] · speech [start–end] · probability · word"]
    for word in words:
        text.append(f"[{word['t']:07.3f}–{word['end']:07.3f}] · speech [{word['speechStart']:07.3f}–{word['speechEnd']:07.3f}] · {word['probability']:.3f} · {word['text']}")
    (ROOT / "assets/audio/write_the_light.transcript.txt").write_text("\n".join(text) + "\n")
    estimated = sum(1 for word in words if word.get("estimated"))
    print(f"Exported {len(lines)} lines / {len(words)} words; {refined_count} tight-word refinements; {estimated} fallback tokens")


if __name__ == "__main__":
    main()
