# GOAL — DMTOOLS: an EPAM open-source promo film

## Goal

A **~73-second, 1920×1080 animated promo** for **DMTools** — EPAM's
open-source enterprise AI-factory orchestrator
(https://github.com/epam/dm.ai, Apache 2.0) — that makes an engineer want to
`curl | bash` it and a platform lead want to standardize on it. Sleek,
confident, engineered — in the EPAM 2023 brand system, delivered in **both
brandbook modes**: Night (dark) and Snow (light), as yoclip render variants.

**Every number on screen is a verified fact from the repo**
(/Users/Uladzimir_Klyshevich/git/dm.ai/dm.ai — see Facts below).

## Brand system (EPAM Brandbook 2023 — dark + light, enforced)

- Canvas: **Night `#060606`** (dark variant) / **Snow `#FBFAFA`** (light
  variant). Surface cards `#161616`/`#FFFFFF` with `#2a2a2a`/`#E4E4E0`
  hairlines.
- Palette: Sea `#00F6FF`, Mint `#00FFF0`, Lilac `#B896FF`, Sky `#7BA8FF`;
  the light variant deepens them (`#00ACBD`, `#00B3A6`, `#7E5BD6`,
  `#3D6FD1`) for contrast on white.
- Type: **Museo Sans** — 100 for big headlines, 300 body, 500 emphasis,
  900 uppercase letter-spaced preheaders. **Always left-aligned**,
  sentence case.
- **One gradient keyword per headline** — the 3-stop text gradient
  Mint → Sea → Lilac, on the single important word only.
- The **blur glow** is the signature: soft out-of-focus cyan/lilac light,
  one or two per scene, never wallpaper.
- `<epam>` wordmark: white cut on Night, dark cut on Snow (variant-swapped
  via `params.logo`), top-left, quiet.
- No DMTools product logo exists (repo ships only a text wordmark) — the
  name is typeset in Museo Sans with the brand gradient, like a headline.

## Verified facts used on screen (sources: repo README + docs)

- Positioning: "Enterprise AI-factory orchestrator for automating delivery
  workflows across trackers, source control, documentation, design systems,
  AI providers, and CI/CD." (README)
- **320+ CLI tools across 20+ integrations** — from the repo's generated
  per-integration tool reference (dmtools-ai-docs/references,
  2026-07-22): Jira 69,
  ADO 38, GitHub 35, GitLab 30, Teams 31, Bitrise 23, Figma 22,
  Confluence 19, TestRail 17, Jenkins 5, plus SharePoint, KB, Mermaid,
  file and AI providers (Anthropic, Bedrock, DIAL, Gemini, Ollama, OpenAI,
  Vertex). On screen the totals are rounded (320+ / 20+) — the list grows.
- CLI tools are callable as plain JavaScript functions inside jobs:
  `jira_get_ticket('PROJ-123')`, `file_write(...)`, `gemini_ai_chat(...)`.
- Four usage paths (README): CLI tools · Jobs + agents · CI/CD pipeline
  automation (GitHub Actions, Jenkins, Bitrise, GitLab CI, Bitbucket) ·
  AI assistant skills (Cursor, Claude, Codex, Copilot).
- The AI-teammate architecture (user-supplied diagram, "DMT AI Teammate —
  Architecture v2"): a ticket state change in ADO fires a service hook →
  Azure Function bridge → `workflow_dispatch` → a GitHub Actions runner
  installs the DMTools CLI per run → **preJSAction** builds context via CLI
  tools (ticket, wiki, repo, knowledge) → **LLM reasoning** (Copilot CLI /
  Codex) → **postJSAction** publishes: git branch + **Pull Request**, work
  item updated — with a human approving in the loop. Nothing is deployed;
  everything is per-run.
- Open source, Apache 2.0, Java 17+ baseline.
- Install: `curl -fsSL https://github.com/epam/dm.ai/releases/latest/download/install.sh | bash`

## Scenario (beats @30fps, 2180 frames ≈ 73 s)

| # | Scene | Start | Dur | Beat |
|---|-------|-------|-----|------|
| 00 | cover | 0 | 190 | `<epam>` + blur bloom; EPAM OPEN SOURCE; "DMTools" gradient wordmark; "Enterprise AI-factory orchestrator." |
| 01 | problem | 170 | 300 | "Delivery runs on duct tape." — disconnected tool cards (tracker, repo, docs, CI, AI), broken links; "One-off scripts don't scale." |
| 02 | layer | 450 | 280 | "One orchestration layer." — DMTools hub draws in; AI-harness chips (Claude Code, Copilot, Codex, Antigravity) dock on an inner ring, then spokes to 8 integration chips (chips condense out of the spoke color) |
| 03 | numbers | 710 | 280 | "320+ CLI tools. 20+ integrations." — count-up + top-integration bars (Jira 69 … Jenkins 5) |
| 04 | architecture | 970 | 420 | "From ticket to pull request." — animated AI-teammate flow: ADO ticket → bridge → CICD Container Runner (CLI → context → LLM → publish) → PR; human-in-the-loop; steps light up 1–7 |
| 05 | code | 1370 | 330 | "Jobs and agents in plain JavaScript." — code window types a job: read context (jira_get_ticket, confluence_content_by_title, github_list_prs, file_write), then Copilot via cli_execute_command |
| 06 | paths | 1680 | 260 | "Run it your way." — 4 usage-path cards: CLI tools · Jobs & agents · CI/CD Pipelines · Agent skills |
| 07 | cta | 1920 | 260 | "Build your AI factory." + install one-liner + GitHub mark + repo QR card (SCAN TO STAR) + `<epam>` sign-off |
| 09 | fadeout | 2130 | 50 | Closing fade to the canvas color (overlay) |

Background: full-length canvas fill (Night/Snow per variant).
Overlay: small `<epam>` wordmark top-left persists across scenes 01–06
(start 160, dur 1740).

## Music

Final track in place: `assets/audio/system_pulse.mp3` ("System Pulse", 88 s,
starts at frame 0, volume 0.3, fade-out envelope at frame 2070 → 0 by the
last frame — see `MUSIC_PROMPT.md` for the original Suno brief).

## Voice

Scene `voicePrompts.en` hold the voiceover plan per scene; the full
narration script with delivery notes lives in `VOICE_PROMPTS.md`.
English only.

## Fonts & assets

- `assets/fonts/` — Museo Sans 100/300/500/700/900 (+ Cyrillic cuts).
- `assets/images/` — official `<epam>` wordmark PNG, white + dark cuts.
