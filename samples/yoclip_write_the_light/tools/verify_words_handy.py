#!/usr/bin/env python3
"""Independent word audit with the locally installed Handy ASR model.

Handy/Nemotron returns recognized text but no word timestamps. This tool thus
uses musical-context line recognition plus 1.25 s sliding windows (0.25 s step)
to estimate word *centers* from repeated recognition across overlapping windows.
It is diagnostic evidence, not sample-accurate forced alignment. Runtime files
are never overwritten: results go to .yoclip_cache/handy/word_audit.{json,txt}.

Usage (from the sample root):
  python3 tools/verify_words_handy.py                    # verse + GPU story
  python3 tools/verify_words_handy.py --line 4 --line 5
  python3 tools/verify_words_handy.py --range 83,94.14
  python3 tools/verify_words_handy.py --all --limit 10
  python3 tools/verify_words_handy.py --window 1.5 --step 0.25

Requires /Applications/Handy.app and ffmpeg. No downloads or network access.
Every ASR result is cached by audio interval/model, so reruns are cheap.
"""
from __future__ import annotations

import argparse
import difflib
import hashlib
import json
import re
import statistics
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets/audio/write_the_light.wav"
CACHE = ROOT / ".yoclip_cache/handy/windows"
HANDY = Path("/Applications/Handy.app/Contents/MacOS/handy")
MODEL = "handy-computer/nemotron-3.5-asr-streaming-0.6b-gguf/nemotron-3.5-asr-streaming-0.6b-Q8_0.gguf"


def norm(token: str) -> str:
    return re.sub(r"[^a-z0-9]", "", token.lower())


def tokens(text: str) -> list[str]:
    return [token for token in re.split(r"\s+", text.strip()) if norm(token)]


def load_lines() -> list[list[dict]]:
    source = (ROOT / "lib/word_timings.js").read_text()
    payload = source.split("var ALIGNED_WORD_TIMINGS = ", 1)[1].lstrip()
    return json.JSONDecoder().raw_decode(payload)[0]


def transcribe(start: float, duration: float) -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    signature = f"{MODEL}|{start:.5f}|{duration:.5f}"
    cache = CACHE / (hashlib.sha256(signature.encode()).hexdigest()[:20] + ".json")
    if cache.exists():
        return json.loads(cache.read_text())
    wav = CACHE / (cache.stem + ".wav")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-ss", f"{start:.5f}", "-t", f"{duration:.5f}",
        "-i", str(AUDIO), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(wav),
    ], check=True)
    completed = subprocess.run([
        str(HANDY), "--transcribe-file", str(wav), "--model", MODEL, "--json",
    ], check=True, capture_output=True, text=True)
    wav.unlink(missing_ok=True)
    result = json.loads(completed.stdout)
    payload = {"start": round(start, 5), "duration": round(duration, 5), "model": MODEL,
               "text": result.get("text", "").strip(), "transcribeMs": result.get("transcribe_ms")}
    cache.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    return payload


def map_window(expected: list[str], recognized: list[str]) -> dict[int, tuple[str, float]]:
    """Map only unambiguous local tokens; never search repeated words globally."""
    en = [norm(token) for token in expected]
    rn = [norm(token) for token in recognized]
    mapped: dict[int, tuple[str, float]] = {}
    matcher = difflib.SequenceMatcher(a=en, b=rn, autojunk=False)
    for op, e0, e1, r0, r1 in matcher.get_opcodes():
        if op == "equal":
            for ei, ri in zip(range(e0, e1), range(r0, r1)):
                mapped[ei] = (recognized[ri], 1.0)
        elif op == "replace" and e1 - e0 == r1 - r0:
            for ei, ri in zip(range(e0, e1), range(r0, r1)):
                similarity = difflib.SequenceMatcher(a=en[ei], b=rn[ri]).ratio()
                if similarity >= 0.72:
                    mapped[ei] = (recognized[ri], similarity)
    return mapped


def audit_line(index: int, words: list[dict], window: float, step: float) -> tuple[dict, int]:
    expected = [word["text"] for word in words]
    line_start = min(float(word.get("speechStart", word["t"])) for word in words)
    line_end = max(float(word.get("speechEnd", word["end"])) for word in words)
    context_start = max(0.0, line_start - 0.35)
    context_end = line_end + 0.35
    context = transcribe(context_start, context_end - context_start)
    context_map = map_window(expected, tokens(context["text"]))
    votes: list[list[tuple[float, float, str]]] = [[] for _ in words]
    calls = 1
    cursor = max(0.0, line_start - window * 0.65)
    last_start = line_end - window * 0.35
    while cursor <= last_start + 1e-6:
        actual_start = max(0.0, cursor)
        result = transcribe(actual_start, window)
        recognized = tokens(result["text"])
        mapped = map_window(expected, recognized)
        center = actual_start + window / 2
        for word_index, (recognized_token, similarity) in mapped.items():
            votes[word_index].append((center, similarity, recognized_token))
        calls += 1
        cursor += step
    word_reports = []
    for word_index, (word, word_votes) in enumerate(zip(words, votes)):
        current_start = float(word.get("speechStart", word["t"]))
        current_end = float(word.get("speechEnd", word["end"]))
        current_center = (current_start + current_end) / 2
        centers = [vote[0] for vote in word_votes]
        estimate = statistics.median(centers) if centers else None
        spread = (max(centers) - min(centers)) if len(centers) > 1 else None
        coverage = word_index in context_map
        # Handy evidence is intentionally capped: text-only window voting is
        # useful for review, but is not a substitute for forced alignment.
        confidence = min(0.72, 0.18 + len(centers) * 0.07 + (0.16 if coverage else 0.0)) if centers else 0.0
        if spread is not None and spread > window * 1.8:
            confidence *= 0.55
        proposed_start = None if estimate is None else estimate - (current_end - current_start) / 2
        delta = None if proposed_start is None else proposed_start - current_start
        suspect = delta is not None and abs(delta) >= 0.08 and confidence >= 0.42
        word_reports.append({
            "lineIndex": index, "wordIndex": word_index, "text": word["text"],
            "currentStart": round(current_start, 5), "currentEnd": round(current_end, 5),
            "votes": len(centers), "contextRecognized": coverage,
            "recognizedVariants": sorted(set(vote[2] for vote in word_votes)),
            "estimatedCenter": None if estimate is None else round(estimate, 5),
            "centerSpread": None if spread is None else round(spread, 5),
            "proposedStart": None if proposed_start is None else round(proposed_start, 5),
            "delta": None if delta is None else round(delta, 5),
            "confidence": round(confidence, 3), "suspect": suspect,
        })
    return {
        "lineIndex": index, "act": words[0]["act"], "text": " ".join(expected),
        "start": round(line_start, 5), "end": round(line_end, 5),
        "handyText": context["text"],
        "contextCoverage": round(len(context_map) / max(1, len(words)), 3),
        "calls": calls, "words": word_reports,
    }, calls


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--line", type=int, action="append", default=[])
    parser.add_argument("--range", dest="time_range")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--window", type=float, default=1.25)
    parser.add_argument("--step", type=float, default=0.25)
    args = parser.parse_args()
    if args.window < 0.75 or args.step <= 0.05 or args.step > args.window:
        parser.error("use window >= 0.75 and 0.05 < step <= window")
    if not HANDY.exists():
        parser.error("Handy is not installed at /Applications/Handy.app")
    lines = load_lines()
    selected = set(args.line)
    if args.time_range:
        start, end = map(float, args.time_range.split(",", 1))
        selected.update(i for i, words in enumerate(lines) if words and start <= (words[0]["t"] + words[-1]["end"]) / 2 <= end)
    if args.all:
        selected.update(range(len(lines)))
    if not selected:
        selected.update(i for i, words in enumerate(lines) if words and (
            16.0 <= (words[0]["t"] + words[-1]["end"]) / 2 <= 29.0 or
            83.0 <= (words[0]["t"] + words[-1]["end"]) / 2 <= 94.14))
    ordered = sorted(selected)
    if args.limit:
        ordered = ordered[:args.limit]
    reports, total_calls = [], 0
    for index in ordered:
        report, calls = audit_line(index, lines[index], args.window, args.step)
        reports.append(report)
        total_calls += calls
        print(f"LINE {index:02d} calls={calls} coverage={report['contextCoverage']:.0%} :: {report['handyText']}", flush=True)
    suspects = [word for line in reports for word in line["words"] if word["suspect"]]
    output = {
        "model": MODEL, "window": args.window, "step": args.step, "calls": total_calls,
        "limitations": "Text-only ASR sliding-window evidence; estimates are not sample-accurate timestamps. Runtime timings were not modified.",
        "lines": reports,
        "suspects": suspects,
    }
    json_path = ROOT / ".yoclip_cache/handy/word_audit.json"
    json_path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    txt_path = ROOT / ".yoclip_cache/handy/word_audit.txt"
    with txt_path.open("w") as handle:
        handle.write(f"HANDY WORD AUDIT — {total_calls} local ASR calls, {len(suspects)} suspect cues\n")
        handle.write("Text-only estimates; runtime timings unchanged.\n\n")
        for line in reports:
            handle.write(f"LINE {line['lineIndex']:02d} [{line['act']}] {line['text']}\n")
            handle.write(f"HANDY: {line['handyText']}\n")
            for word in line["words"]:
                if word["suspect"]:
                    handle.write(f"  {word['text']}: current={word['currentStart']:.3f} proposed={word['proposedStart']:.3f} delta={word['delta']:+.3f} confidence={word['confidence']:.2f} votes={word['votes']}\n")
            handle.write("\n")
    print(f"HANDY_AUDIT={json_path} suspects={len(suspects)} calls={total_calls}")


if __name__ == "__main__":
    main()
