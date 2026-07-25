# VOICE — DMTOOLS (EPAM open-source promo)

Narration spec for the ~73 s film, in the studio format: Scene, Sample
Context, then per-scene speaker blocks with inline delivery tags.
Timing assumes 30 fps, 2180 frames; every block carries a **target
duration** — a take that runs over target must be regenerated faster,
not trimmed further.

Style: **storytelling, not documentation**. Short sentences. One idea per
sentence. The arc: you already have AI but no factory → one layer →
proof at scale → a run end-to-end → it's just JavaScript → adopt your
way → join us. The listener is an enterprise platform lead asking
"why do I need this?" — every scene answers a piece of it.

## Scene

```
The Sound Stage Booth.
```

## Sample Context

```
A calm storyteller, not a salesperson and not a robot. An engineer
telling a colleague how their factory works — warm, dry, confident.
Short sentences, clear beats, tiny pauses between them. Conversational
pace ~165 wpm, brisk but never rushed. Neutral international English,
low register, close-mic. The numbers land with quiet pride; the
architecture run feels like watching machines work; the ending is an
invitation, not a pitch.
```

## Supported delivery tags (engine vocabulary)

Use ONLY these in `[brackets]` (verified against the tool's tag list):
`admiration, adoration, aggression, agitation, amusement, anger,
annoyance, awe, confusion, curiosity, determination, enthusiasm,
excitement, frustration, hope, interest, laughs, negative, nervousness,
neutral, positive, tension, whispers`.

## Speaker blocks

**Speaker 1 — Narrator** (one voice for the whole film)

**00 · Cover (frames 0–190) — start ~0.5 s, target ≤ 5 s**
```
[interest] Every enterprise wants an AI factory. [curiosity] Few know where to start. [determination] This is DMTools — from EPAM.
```

**01 · Problem (frames 170–470) — target ≤ 8 s**
```
[neutral] You already have AI. Copilots in every team. [frustration] But delivery still runs on handoffs — and scripts nobody owns. [negative] The tools don't talk to each other.
```

**02 · Layer (frames 450–730) — target ≤ 8.5 s**
```
[positive] DMTools is the layer between them. [determination] One CLI — and any agent you run: [neutral] Claude Code, Copilot, Codex, Antigravity — [determination] can reach every system in the company.
```

**03 · Numbers (frames 710–990) — target ≤ 8 s**
```
[admiration] Three hundred twenty tools. Twenty-plus integrations. [neutral] Jira, Azure DevOps, GitHub, Figma, Teams, Bitrise, Jenkins. [positive] Wired. Documented. Ready.
```

**04 · Architecture (frames 970–1390) — target ≤ 12 s**
```
[curiosity] Here's what that buys you. [neutral] A ticket changes state — [awe] and a factory wakes up. [determination] Clean runner. Fresh tools. Full context. The model reasons. A pull request waits for a human. [positive] Nothing to deploy. Nothing to babysit.
```

**05 · Code (frames 1370–1700) — target ≤ 8 s**
```
[neutral] And it's just JavaScript. [determination] Read the ticket. Pull the page. Ask the model. Ship the result. [positive] Your engineers already speak this language.
```

**06 · Paths (frames 1680–1940) — target ≤ 7 s**
```
[enthusiasm] Adopt it your way. [neutral] The CLI. Reusable jobs. Your CI pipelines. [positive] Or skills for the agents your teams already use.
```

**07 · CTA (frames 1920–2180) — target ≤ 8 s**
```
[hope] DMTools. Open source, from EPAM. [enthusiasm] Scan the code. One command to install. [determination] And build your AI factory with us.
```

## One-block version (whole film, single paste)

```
[interest] Every enterprise wants an AI factory. [curiosity] Few know where to start. [determination] This is DMTools — from EPAM. [neutral] You already have AI. Copilots in every team. [frustration] But delivery still runs on handoffs — and scripts nobody owns. [negative] The tools don't talk to each other. [positive] DMTools is the layer between them. [determination] One CLI — and any agent you run: Claude Code, Copilot, Codex, Antigravity — can reach every system in the company. [admiration] Three hundred twenty tools. Twenty-plus integrations. [neutral] Jira, Azure DevOps, GitHub, Figma, Teams, Bitrise, Jenkins. [positive] Wired. Documented. Ready. [curiosity] Here's what that buys you. [neutral] A ticket changes state — [awe] and a factory wakes up. [determination] Clean runner. Fresh tools. Full context. The model reasons. A pull request waits for a human. [positive] Nothing to deploy. Nothing to babysit. [neutral] And it's just JavaScript. [determination] Read the ticket. Pull the page. Ask the model. Ship the result. [positive] Your engineers already speak this language. [enthusiasm] Adopt it your way. [neutral] The CLI. Reusable jobs. Your CI pipelines. [positive] Or skills for the agents your teams already use. [hope] DMTools. Open source, from EPAM. [enthusiasm] Scan the code. One command to install. [determination] And build your AI factory with us.
```

## Timing budget (words ≈ target at ~165 wpm)

| Scene | Frames | Voice window | Words | Target |
|-------|--------|--------------|-------|--------|
| 00 cover | 0–190 | ~0.5–6 s | 17 | ≤ 5 s |
| 01 problem | 170–470 | ~6.5–15 s | 25 | ≤ 8 s |
| 02 layer | 450–730 | ~15–24 s | 25 | ≤ 8.5 s |
| 03 numbers | 710–990 | ~24.3–32.5 s | 16 | ≤ 8 s |
| 04 architecture | 970–1390 | ~34–46 s | 39 | ≤ 12 s |
| 05 code | 1370–1700 | ~47–56 s | 22 | ≤ 8 s |
| 06 paths | 1680–1940 | ~56–64 s | 20 | ≤ 7 s |
| 07 cta | 1920–2180 | ~64–72 s | 19 | ≤ 8 s |

Scene-local audio starts (frames): 00: 15 · 01: 25 · 02: 0 · 03: 20 ·
04: 55 · 05: 45 · 06: 0 · 07: 0 — already wired in the scene files;
keep new takes within their targets and the mix will land on the cuts.

## Mix notes

- Record dry; the music bed is already mixed at 0.3 with a fade-out
  envelope at frame 2070 (69 s). Monitor against the current MP4.
- If a take runs long, regenerate with "brisker, shorter beats" — do not
  trim sentences; the script is already minimal.
