# GOAL — REDEFINE: an EPAM AI/Run promo film

## Goal

A **~69-second, 1920×1080 animated promo** for **EPAM AI/Run™** — enterprise
AI-native transformation — that makes a viewer want to work with EPAM.
Sleek, confident, engineered: not a startup ad, a technology-leader statement.

v2 is **case-driven**: the AI hype gap (EPAM research) opens the film, the
AI 360 framework answers it, then two real client stories (PostNL, Baker
Hughes) carry the proof, followed by the platform stack, talent scale,
analyst recognition and the CTA.

**Every number on screen is a verified fact from epam.com** (see Facts below).

## Brand system (EPAM Brandbook 2023, dark mode — enforced)

- Canvas: **Night `#060606`**, generous empty space, surface cards `#161616`
  with `#2a2a2a` hairlines.
- Palette: Sea `#00F6FF`, Mint `#00FFF0`, Lilac `#B896FF`, Sky `#7BA8FF`;
  secondary colors NOT used (brandbook: "very minimally").
- Type: **Museo Sans** — 100 for big headlines, 300 body, 500 emphasis,
  900 uppercase letter-spaced preheaders. **Always left-aligned**,
  sentence case, no negative tracking.
- **One gradient keyword per headline** — the 3-stop text gradient
  `#00FFF0 → #00F6FF → #B896FF`, on the single important word only.
- The **blur glow** is the signature: soft out-of-focus cyan/lilac light on
  black, used sparingly (one or two per scene, never wallpaper).
- `<epam>` wordmark: **official `epam_logo_light.svg` from epam.com**
  (user-supplied), recolored white → `assets/images/epam_logo_white.png`
  (2400×895), white only, top-left, quiet.
- Client logos, persistent for the whole client scene, bottom-right:
  PostNL — user-supplied `assets/images/postnl_logo_white.png` (white);
  Baker Hughes — official logo from Wikimedia Commons, wordmark recolored
  white → `assets/images/baker_hughes_logo.png` (symbol keeps brand green).
- Mixed-size text in bottom-aligned rows must share the glyph baseline. The
  engine aligns baselines proportionally within the line box, so force every
  text in such a row to the same line-box height: use `blh(fs, rowMax)`
  (`lib/brand.js`) where `rowMax` is the largest font size in the row.
  This makes `lineHeight = 1.2 * rowMax / fs`; the biggest text keeps its
  natural box, smaller texts get expanded to match.
- Photography: candid, diverse, natural-light people (Image Library) as the
  human counterweight — full-bleed with dark scrim, text on top.

## Verified facts used on screen (sources: epam.com)

- EPAM "From Hype to Impact" AI research (with Censuswide, 7,300 enterprises):
  49% consider themselves advanced in AI; only 26% have use cases live in
  production; 5% are true disruptors; disruptors attribute **53%** of expected
  2025 profits to AI; **+14%** planned YoY AI spending growth.
- **PostNL** (client work): millions of letters & parcels daily; work that
  took **more than a week accomplished by AI agents in 40 minutes**; **20+
  types of AI agents** across teams/business units; AI-native SDLC stages
  (business analysis → testing → coding → defect management); quote —
  Sander Lukaart, IT Manager, PostNL.
- **Baker Hughes** (client work): two GenAI digital assistants with EPAM &
  AWS; **8 weeks** to a fully functional prototype; **200+** pages of
  technical documents processed; **85%** answer accuracy; ~**10,000 hours**
  of expert time freed per year; "millions of dollars of customer value" —
  Sebastiano Barbarino, Leucipa Director of Product & Engineering.
- Talent: **55,800+** consultants & engineers (Q2 2025).
- Tools: **DIAL** (open-source GenAI orchestration, 3.0 released), migVisor™,
  EPAM AI/Run™ Platform, EPAM Agentic QA™.
- Analyst recognition quote (AI/Run page): "best-in-class platform
  engineering capabilities … above-par AI and data governance".

## Scenario (beats @30fps, 2070 frames ≈ 69 s)

| # | Scene | Start | Dur | Beat |
|---|-------|-------|-----|------|
| 00 | cover | 0 | 170 | `<epam>` + blur bloom; AI/RUN™ TRANSFORM; "Redefine your enterprise" |
| 01 | hype_gap | 150 | 280 | "Everyone is investing in AI. Few are capturing the value." — 49% vs 26% bars; then 53% / 5% / +14% punch |
| 02 | framework | 410 | 250 | "It's engineered." — AI 360: 4 pillar cards |
| 03 | postnl | 640 | 430 | Client story: millions of parcels → 1 week → **40 minutes** → 20+ agents → AI-native SDLC → Lukaart quote |
| 04 | baker | 1050 | 310 | Client story: 8 weeks / 200+ pages / 85% → **10,000 hours** freed → Barbarino quote |
| 05 | tools | 1340 | 230 | "Agentic platforms that accelerate value." — DIAL 3.0, migVisor™, AI/Run™, Agentic QA™ |
| 06 | talent | 1550 | 200 | "AI-native teams who code. Engineers who consult." + 55,800+ — photography, Ken Burns |
| 07 | quote | 1730 | 170 | Analyst recognition card |
| 08 | cta | 1880 | 190 | "Let's build your AI-powered future." + GET IN TOUCH + URL; `<epam>` sign-off |

Overlay: small `<epam>` wordmark top-left persists across scenes 01–07
(start 160, dur 1700).

## Music

`assets/audio/score_placeholder.mp3` is 72 s of silence — replace with the
final track (see `MUSIC_PROMPT.md` for the Suno brief: modern cinematic
electronic, ~118 BPM, confident, no vocals), then tune `start` so the first
beat lands on the cover headline reveal (~frame 40).

## Languages

English only (B2B global audience). Scene `voicePrompts.en` hold the
voiceover plan per scene for future TTS/subtitles.

## Fonts & assets

- `assets/fonts/` — Museo Sans 100/300/500/700/900 (+ Cyrillic cuts for
  future ru variant).
- `assets/images/` — official `<epam>` logo PNG (from epam.com SVG),
  PostNL + Baker Hughes client logos, 4 Image Library photos
  (team_office, event, laptop_loft, corridor).
