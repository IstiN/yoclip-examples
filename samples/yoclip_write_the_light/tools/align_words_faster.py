#!/usr/bin/env python3
"""Timestamped local cross-check for WRITE THE LIGHT word cues.

Uses cached faster-whisper-small.en full-song musical-context transcription,
then transcribes only lines with missing words. Diagnostic candidate by default;
--apply regenerates lib/word_timings.js and the inspectable assets/audio reports.
No network access: both the model and master audio must already be local.

Handy's independent text/window audit (tools/verify_words_handy.py) is kept as
validation evidence. It is not used as a source of fabricated timestamps.
"""
from __future__ import annotations

import argparse
import copy
import difflib
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from align_words_mlx import norm, recognized_words  # noqa: E402

CACHE = ROOT / ".yoclip_cache/faster_whisper"
MODEL = next((Path.home() / ".cache/huggingface/hub/models--Systran--faster-whisper-small.en/snapshots").glob("*/"))


def load_lines() -> list[dict]:
    source = (ROOT / "lib/timeline.js").read_text()
    match = re.search(r"var LYRIC_CUES = (\[.*?\]);\nvar BEAT_TIMES", source, re.S)
    if not match:
        raise SystemExit("LYRIC_CUES not found")
    return json.loads(match.group(1))


def load_acts() -> list[dict]:
    source = (ROOT / "lib/timeline.js").read_text()
    match = re.search(r"var FILM_ACTS = (\[.*?\]);\n// Line cues", source, re.S)
    if not match:
        raise SystemExit("FILM_ACTS not found")
    return json.loads(match.group(1))


def load_current() -> list[list[dict]]:
    source = (ROOT / "lib/word_timings.js").read_text()
    payload = source.split("var ALIGNED_WORD_TIMINGS = ", 1)[1].lstrip()
    return json.JSONDecoder().raw_decode(payload)[0]


def make_alignment(line: dict, recognized: list[dict]) -> dict:
    """Conservative token mapping: a timestamp needs lexical evidence.

    SequenceMatcher replace blocks are not treated as ground truth. Equal or
    near-equal tokens keep their measured interval; substitutions and uneven
    replace blocks remain estimated and later retain the prior measurement.
    This prevents plausible-looking timestamps for completely wrong ASR text.
    """
    expected = line["text"].split()
    en = [norm(token) for token in expected]
    rn = [norm(word["text"]) for word in recognized]
    mapped: list[dict | None] = [None] * len(expected)
    matcher = difflib.SequenceMatcher(a=en, b=rn, autojunk=False)
    for op, e0, e1, r0, r1 in matcher.get_opcodes():
        if op in ("insert", "delete") or r0 == r1:
            continue
        start, end = recognized[r0]["start"], recognized[r1 - 1]["end"]
        if op == "equal" and e1 - e0 == r1 - r0:
            for ei, ri in zip(range(e0, e1), range(r0, r1)):
                mapped[ei] = {**recognized[ri], "text": expected[ei], "recognizedText": recognized[ri]["text"]}
        elif e1 - e0 == r1 - r0:
            for ei, ri in zip(range(e0, e1), range(r0, r1)):
                similarity = difflib.SequenceMatcher(a=en[ei], b=rn[ri]).ratio()
                accepted = similarity >= 0.72
                mapped[ei] = {
                    **(recognized[ri] if accepted else {"start": start, "end": end, "probability": 0.0}),
                    "text": expected[ei], "recognizedText": recognized[ri]["text"],
                    **({} if accepted else {"estimated": True}),
                }
        else:
            for ei in range(e0, e1):
                mapped[ei] = {"text": expected[ei], "start": start, "end": end,
                              "probability": 0.0, "estimated": True}
    for index, word in enumerate(mapped):
        if word is not None:
            continue
        previous = next((mapped[j] for j in range(index - 1, -1, -1) if mapped[j]), None)
        following = next((mapped[j] for j in range(index + 1, len(mapped)) if mapped[j]), None)
        start = previous["end"] if previous else float(line["t"])
        end = following["start"] if following else float(line["end"])
        mapped[index] = {"text": expected[index], "start": start, "end": max(start + 0.06, end),
                         "probability": 0.0, "estimated": True}
    words = [{**word, "t": word["start"], "speechStart": word["start"], "speechEnd": word["end"]} for word in mapped if word]
    return {
        "recognized": " ".join(word["text"] for word in recognized),
        "words": words,
        "missing": sum(bool(word.get("estimated")) for word in words),
    }


def load_audio() -> np.ndarray:
    path = CACHE / "master16k.wav"
    with wave.open(str(path), "rb") as handle:
        return np.frombuffer(handle.readframes(handle.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0


def transcribe_line(model: WhisperModel, audio: np.ndarray, index: int, line: dict, force: bool) -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"line_{index:02d}.json"
    if path.exists() and not force:
        return json.loads(path.read_text())
    start = max(0.0, float(line["t"]) - 0.35)
    end = float(line["end"]) + 0.35
    excerpt = audio[round(start * 16000):round(end * 16000)]
    segments, _ = model.transcribe(
        excerpt, language="en", word_timestamps=True, beam_size=5,
        condition_on_previous_text=False, vad_filter=False, temperature=0.0,
        initial_prompt=line["text"],
    )
    output = []
    for segment in segments:
        output.append({
            "start": segment.start + start, "end": segment.end + start, "text": segment.text,
            "words": [{"start": word.start + start, "end": word.end + start,
                       "word": word.word, "probability": word.probability} for word in (segment.words or [])],
        })
    result = {"segments": output}
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def generate(apply: bool, force: bool) -> None:
    full_path = CACHE / "full.json"
    if not full_path.exists():
        raise SystemExit("missing .yoclip_cache/faster_whisper/full.json")
    lines, current = load_lines(), load_current()
    full_words = recognized_words(json.loads(full_path.read_text()), 0.0)
    audio = load_audio()
    model = WhisperModel(str(MODEL), device="cpu", compute_type="int8", cpu_threads=8, local_files_only=True)
    output_lines, report = [], []
    for index, line in enumerate(lines):
        if not line.get("spoken", True):
            aligned = {"recognized": "[visual only — no sung vocal]", "words": []}
            chosen_source = "visual"
        else:
            candidates = [word for word in full_words if float(line["t"]) - 0.35 <= (word["start"] + word["end"]) / 2 <= float(line["end"]) + 0.35]
            full = make_alignment(line, candidates)
            chosen, chosen_source = full, "full"
            if full["missing"]:
                excerpt = transcribe_line(model, audio, index, line, force)
                excerpt_words = recognized_words(excerpt, 0.0)
                per_line = make_alignment(line, excerpt_words)
                hybrid = copy.deepcopy(full)
                replacements = 0
                for word_index, (full_word, line_word) in enumerate(zip(full["words"], per_line["words"])):
                    if not full_word.get("estimated") or line_word.get("estimated"):
                        continue
                    previous = next((full["words"][j] for j in range(word_index - 1, -1, -1) if not full["words"][j].get("estimated")), None)
                    following = next((full["words"][j] for j in range(word_index + 1, len(full["words"])) if not full["words"][j].get("estimated")), None)
                    if ((previous and float(line_word["end"]) < float(previous["end"]) - 0.05) or
                            (following and float(line_word["start"]) > float(following["start"]) + 0.05)):
                        continue
                    hybrid["words"][word_index] = line_word
                    replacements += 1
                chosen = hybrid
                chosen_source = "hybrid" if replacements else "full"
                if replacements:
                    chosen["recognized"] = full["recognized"] + " | line: " + per_line["recognized"]
            aligned = chosen
        old_words = current[index] if index < len(current) else []
        if not chosen_source.startswith("rejected-"):
            for word_index, word in enumerate(aligned["words"]):
                if not word.get("estimated") or word_index >= len(old_words):
                    continue
                previous = next((aligned["words"][j] for j in range(word_index - 1, -1, -1) if not aligned["words"][j].get("estimated")), None)
                following = next((aligned["words"][j] for j in range(word_index + 1, len(aligned["words"])) if not aligned["words"][j].get("estimated")), None)
                old = old_words[word_index]
                old_start = float(old.get("speechStart", old["t"]))
                old_end = float(old.get("speechEnd", old["end"]))
                if ((previous and old_end < float(previous["end"]) - 0.05) or
                        (following and old_start > float(following["start"]) + 0.05)):
                    for fallback in aligned["words"]:
                        fallback["estimated"] = True
                    chosen_source = "rejected-conflict"
                    break
        accepted = sum(not word.get("estimated") for word in aligned["words"])
        if not chosen_source.startswith("rejected-") and aligned["words"] and accepted / len(aligned["words"]) < 0.60:
            for word in aligned["words"]:
                word["estimated"] = True
            chosen_source = "rejected-low-coverage"
        starts = []
        for word_index, word in enumerate(aligned["words"]):
            old = old_words[word_index] if word_index < len(old_words) else {}
            previous_start = float(old.get("speechStart", old.get("t", word["t"])))
            previous_end = float(old.get("speechEnd", old.get("end", word["end"])))
            # Never replace a real prior measurement with DTW interpolation for
            # an unrecognized token. Keep that token and mark the fallback.
            if word.get("estimated") and old:
                word["speechStart"], word["speechEnd"] = previous_start, previous_end
                word["source"] = "retained-prior-unrecognized"
            else:
                word["source"] = f"faster-whisper-{chosen_source}"
            word.update({
                "act": line["act"], "lineIndex": index, "wordIndex": word_index, "aligned": True,
                "fasterProbability": word.get("probability", 0.0),
                "previousSpeechStart": round(previous_start, 5),
                "previousSpeechEnd": round(previous_end, 5),
                "delta": round(float(word["speechStart"]) - previous_start, 5),
            })
            value = max(float(line["t"]) - 0.75, min(float(line["end"]) + 0.35, float(word["speechStart"])))
            if starts:
                # DTW occasionally gives adjacent tokens the same onset. Keep
                # their measured speech boundaries, but avoid a 1-frame flash.
                value = max(value, starts[-1] + (0.08 if value <= starts[-1] + 0.021 else 0.02))
            starts.append(value)
        for word_index, word in enumerate(aligned["words"]):
            word["t"] = round(starts[word_index], 5)
            display_end = starts[word_index + 1] if word_index + 1 < len(starts) else float(word["speechEnd"])
            word["end"] = round(max(word["t"] + 0.02, display_end), 5)
        measured_t = float(aligned["words"][0]["speechStart"]) if aligned["words"] else float(line["t"])
        measured_end = float(aligned["words"][-1]["speechEnd"]) if aligned["words"] else float(line["end"])
        cue_t = measured_t
        line["measuredT"] = round(cue_t, 5)
        line["measuredEnd"] = round(max(cue_t + 0.02, measured_end), 5)
        line["alignmentSource"] = f"faster-whisper-{chosen_source}"
        line["recognized"] = aligned["recognized"]
        line["words"] = aligned["words"]
        output_lines.append(line)
        deltas = [float(word["delta"]) for word in line["words"]]
        report.append({
            "lineIndex": index, "text": line["text"], "source": chosen_source,
            "recognized": aligned["recognized"], "originalT": line["t"], "measuredT": line["measuredT"],
            "changedWords": sum(abs(delta) >= 0.04 for delta in deltas),
            "maxAbsDelta": round(max(map(abs, deltas), default=0.0), 5),
            "retainedUnrecognized": sum(word["source"] == "retained-prior-unrecognized" for word in line["words"]),
        })
        print(f"[{index:02d}] {chosen_source:6s} changed={report[-1]['changedWords']} max={report[-1]['maxAbsDelta']:.3f} :: {aligned['recognized']}", flush=True)
    # Align scene boundaries with vocals without cutting the previous lyric.
    # If the prior act is still singing, hold the new cue at the existing act
    # boundary. If the prior act has only a visual tail, move that boundary to
    # the measured onset so the first word is not filtered out by filmAct().
    acts = load_acts()
    act_overrides: dict[str, float] = {}
    for line_index, line in enumerate(output_lines):
        if not line["words"]:
            continue
        act_index = next((i for i, act in enumerate(acts) if act["name"] == line["act"]), None)
        if act_index is None:
            continue
        boundary = float(acts[act_index]["start"])
        onset = float(line["measuredT"])
        if onset >= boundary - 0.00001:
            continue
        previous = output_lines[line_index - 1] if line_index else None
        previous_end = float(previous["measuredEnd"]) if previous and previous["act"] != line["act"] else 0.0
        if previous_end > onset + 0.02:
            line["measuredT"] = boundary
            for word in line["words"]:
                word["t"] = max(float(word["t"]), boundary)
            report[line_index]["actBoundaryAdjustment"] = round(boundary - onset, 5)
        else:
            act_overrides[line["act"]] = round(onset, 5)
            acts[act_index]["start"] = onset
            if act_index:
                acts[act_index - 1]["end"] = onset
            report[line_index]["actStartAdjustment"] = round(onset - boundary, 5)
    # A lyric switch must never hide the previous line's final word. ASR
    # windows can overlap by a few frames at line boundaries, so enforce a
    # monotonic *display* timeline while retaining measured speechStart/End.
    previous_display_end = 0.0
    for line_index, line in enumerate(output_lines):
        if not line["words"]:
            previous_display_end = max(previous_display_end, float(line["t"]))
            continue
        original_cue = float(line["measuredT"])
        cue = max(original_cue, previous_display_end + 0.02 if previous_display_end else original_cue)
        starts = []
        for word_index, word in enumerate(line["words"]):
            value = max(float(word["t"]), cue if word_index == 0 else float(word["t"]))
            if starts:
                value = max(value, starts[-1] + (0.08 if value <= starts[-1] + 0.021 else 0.02))
            starts.append(value)
        for word_index, word in enumerate(line["words"]):
            word["t"] = round(starts[word_index], 5)
            display_end = starts[word_index + 1] if word_index + 1 < len(starts) else max(float(word["speechEnd"]), starts[-1] + 0.02)
            word["end"] = round(max(word["t"] + 0.02, display_end), 5)
        line["measuredT"] = round(cue, 5)
        line["measuredEnd"] = round(max(cue + 0.02, line["words"][-1]["end"]), 5)
        # The next lyric switches on its measured onset. Guarantee only that
        # the previous last word was visible; do not accumulate delays from an
        # uncertain ASR segment end.
        previous_display_end = max(previous_display_end, float(line["words"][-1]["t"]) + 0.06)
        report[line_index]["displayCueAdjustment"] = round(cue - original_cue, 5)
    words = []
    for line in output_lines:
        for word in line["words"]:
            word["index"] = len(words)
            words.append(word)
    candidate = {
        "source": "assets/audio/write_the_light.wav", "model": "faster-whisper-small.en (local)",
        "alignment": "full musical-context DTW + missing-line transcription; prior timing retained for unrecognized tokens",
        "lines": output_lines, "actOverrides": act_overrides,
    }
    (ROOT / "assets/audio/write_the_light.faster.candidate.json").write_text(json.dumps(candidate, ensure_ascii=False, indent=2) + "\n")
    (CACHE / "alignment_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    if not apply:
        print("CANDIDATE_ONLY — rerun with --apply after reviewing the report")
        return
    backup = CACHE / "word_timings_before_faster.js"
    if not backup.exists():
        backup.write_text((ROOT / "lib/word_timings.js").read_text())
    # Runtime input is intentionally minimal and deterministic. Diagnostic
    # previous/delta/source fields belong in the JSON reports, not the film.
    arrays = [[{key: word[key] for key in ("text", "t", "end", "speechStart", "speechEnd", "wordIndex")}
               for word in line["words"]] for line in output_lines]
    cue_times = [{"t": line["measuredT"], "end": line["measuredEnd"]} for line in output_lines]
    act_times = [{"name": act["name"], "start": round(float(act["start"]), 5), "end": round(float(act["end"]), 5)} for act in acts]
    js = "// Generated by tools/align_words_faster.py from local master audio.\n"
    js += "var ALIGNED_WORD_TIMINGS = " + json.dumps(arrays, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += "var ALIGNED_LINE_TIMINGS = " + json.dumps(cue_times, separators=(",", ":")) + ";\n"
    js += "var ALIGNED_ACT_TIMINGS = " + json.dumps(act_times, separators=(",", ":")) + ";\n"
    js += "for (var alignedAct = 0; alignedAct < ALIGNED_ACT_TIMINGS.length; alignedAct++) {\n"
    js += "  FILM_ACTS[alignedAct].start = ALIGNED_ACT_TIMINGS[alignedAct].start;\n"
    js += "  FILM_ACTS[alignedAct].end = ALIGNED_ACT_TIMINGS[alignedAct].end;\n}\n"
    js += "WORD_CUES.length = 0;\n"
    js += "for (var alignedLine = 0; alignedLine < ALIGNED_WORD_TIMINGS.length; alignedLine++) {\n"
    js += "  LYRIC_CUES[alignedLine].words = ALIGNED_WORD_TIMINGS[alignedLine];\n"
    js += "  if (ALIGNED_WORD_TIMINGS[alignedLine].length) {\n"
    js += "    LYRIC_CUES[alignedLine].t = ALIGNED_LINE_TIMINGS[alignedLine].t;\n"
    js += "    LYRIC_CUES[alignedLine].end = ALIGNED_LINE_TIMINGS[alignedLine].end;\n  }\n"
    js += "  for (var alignedWord = 0; alignedWord < LYRIC_CUES[alignedLine].words.length; alignedWord++) {\n"
    js += "    LYRIC_CUES[alignedLine].words[alignedWord].index = WORD_CUES.length;\n"
    js += "    WORD_CUES.push(LYRIC_CUES[alignedLine].words[alignedWord]);\n  }\n}\n"
    (ROOT / "lib/word_timings.js").write_text(js)
    (ROOT / "assets/audio/write_the_light.words.json").write_text(json.dumps({
        "source": "write_the_light.wav", "alignment": candidate["alignment"],
        "fps": 30, "lines": output_lines, "words": words,
    }, ensure_ascii=False, indent=2) + "\n")
    text = ["# WRITE THE LIGHT — faster-whisper measured word transcript", "# display [start–end] · speech [start–end] · probability · delta · word"]
    for word in words:
        text.append(f"[{word['t']:07.3f}–{word['end']:07.3f}] · speech [{word['speechStart']:07.3f}–{word['speechEnd']:07.3f}] · {word['probability']:.3f} · {word['delta']:+.3f} · {word['text']}")
    (ROOT / "assets/audio/write_the_light.transcript.txt").write_text("\n".join(text) + "\n")
    print(f"APPLIED {len(output_lines)} lines / {len(words)} words; previous runtime backed up at {backup}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--force", action="store_true", help="ignore per-line transcription cache")
    args = parser.parse_args()
    generate(args.apply, args.force)


if __name__ == "__main__":
    main()
