# Creative cookbook — scene patterns with working reference code

This catalog maps **what a user asks for** (natural language) to **how to build it** (mechanism + a real scene that implements it). Use it like this:

1. **Read the goal**, decompose into beats (see SKILL.md → Goal-driven workflow).
2. For each beat, **pick the closest pattern below** — one beat, one idea.
3. **Adapt, don't copy blind:** the snippets are distilled from real scenes; replace sizes, colors, copy and timings with the project's own theme aliases (`yoclipColor`/`yoclipColorA`/`yoclipSize`/`yoclipFont`), dictionaries (`yoclipT`), format branches (`yoclipIsPortrait`) and beat timings. Respect the Shared rules in SKILL.md (no hardcoded colors/fonts/sizes, English fallbacks, `duration: auto`, boomerang `startFrame`).
4. `samples/yoclip_about/` references are readable directly by agents (and by the Studio assistant through its reference tools) — **open the file before adapting**. The `my_love` references (`~/Downloads/my_love`) are an **external project outside the reference roots** — the key code is inlined below; don't assume you can read those files.

Node types used across patterns: `stack` (root, `fit: 'expand'` — always give children `alignment`), `container` (fill/gradient/border/shadow/clip), `text`, `image`, `path` (stroked, `progress`-animatable), `video`, `absolute_fill` (transparent layout surface or colored overlay). Any node takes `opacity/offsetX/offsetY/scale/rotation/blur`.

---

## 1. Boomerang — reverse a video segment

**User asks for...** "Loop this clip back and forth like an Instagram boomerang." / "Play the video forward then bounce it back with a flash."

**Technique.** Split the scene into two halves; render a forward `video` node for `frame < half` and a `reverse: true` node after. Reverse source frame = `sourceStart − clipFrame * speed`, `clipFrame` counted from the node's `startFrame` — so the reversed segment **must** set `startFrame` to its first scene frame, otherwise the source clamps to frame 0 and freezes. A white `flashIn` overlay at the turnaround hides the seam; `muted: true` because the music track carries the film.

**Reference** (external, inlined): `~/Downloads/my_love/scenes/01_boom1.scene.js` — also `03_boom2.scene.js` (same bounce, `sourceStart: 112/225` slicing further into the clip).

```js
var half = 75;                          // 2.5 s forward + 2.5 s back @ 30fps
var backward = frame >= half;
var local = backward ? frame - half : frame;
var children = [
  backward
    ? { type: 'video', source: 'external:reel', fit: 'cover', width: 1080, height: 1920,
        speed: 1.5, sourceStart: 112, startFrame: 75, reverse: true, muted: true }
    : { type: 'video', source: 'external:reel', fit: 'cover', width: 1080, height: 1920,
        speed: 1.5, sourceStart: 0, muted: true },
  vignette(0.28),
  { type: 'text', alignment: 'center',
    text: backward ? (T.rev || 'REV') : (T.fwd || 'FWD'),
    offsetX: 378, offsetY: -852, opacity: ease(local, 8, 24, eo3),
    style: { fontFamily: 'Geneva', fontSize: 26, color: tagColor, letterSpacing: 6 } },
];
var flash = flashIn(local, 6);          // strobe at the turnaround
if (flash) children.push(flash);
```

---

## 2. Beat-synced diptych with crash-in cover

**User asks for...** "Sync the photos to the music beats." / "Two portraits land on the beat, then a full-bleed shot slams in on the drop."

**Technique.** Write a **beat map**: scene-local frames where each beat lands, tuned by ear against the track. Animate each element so it **completes exactly on its beat** (`ease(frame, beat - dur, beat, eo4)`), with post-beat drift so nothing sits still. The third beat is a takeover: a full-bleed `image` scaled 1.3→1.06 (Ken Burns) fades in over the diptych while the paper-phase elements fade out via `(1 - coverIn)`, plus a strobe (`flashIn(frame - b3, 6)`).

**Reference** (external, inlined): `~/Downloads/my_love/scenes/04_duo.scene.js`.

```js
var b1 = 45;  // "one"   — print I lands
var b2 = 60;  // "two"   — print II lands
var b3 = 75;  // "three" — cover crashes in
var topX = lerp(-1180, 0, ease(frame, b1 - 24, b1, eo4));   // lands ON b1
var botX = lerp(1180, 0, ease(frame, b2 - 24, b2, eo4));
var topDrift = lerp(0, 34, ease(frame, b2 + 20, 150, ei3)); // never still
var coverIn = seg(frame, b3, b3 + 8);
var cover = coverPhoto('external:cover', frame - b3, 150 - b3, 1.3, 1.06);
cover.opacity = coverIn;                // full-bleed takeover on beat 3
// paper-phase layers multiply opacity by (1 - coverIn)
var beatFlash = flashIn(frame - b3, 6); // strobe exactly on the beat
```

---

## 3. Fashion editorial still: vignette, inset frame, REC tag, tracked captions

**User asks for...** "Make it look like a Vogue/magazine spread." / "Put a thin frame around the photo with a REC dot and letter-spaced captions."

**Technique.** Compose editorial primitives from a shared lib (`lib/editorial.js`): `vignette()` = `absolute_fill` + radial-gradient `container` (transparent center → ink edges); a thin inset `container` with `borderColor`/`borderWidth: 1.5` and no fill; a **drawn** REC dot (small round `container`, opacity blinking via `frame % 36 < 20`) — never a `●` glyph, Geneva has none and renders tofu; captions are Geneva with `letterSpacing: 6–12`. Landscape photo in a vertical frame: `blurredFill()` behind (same image, `scale: 1.18, blur: 26, opacity: 0.85`) + sharp framed print on top.

**Reference** (external, inlined): `~/Downloads/my_love/scenes/03_reel.scene.js`, `02_terrace.scene.js`; helpers in `~/Downloads/my_love/lib/editorial.js`.

```js
function vignette(strength) {
  return { type: 'absolute_fill', child: { type: 'container', width: 1080, height: 1920,
    gradient: { type: 'radial', colors: ['#00000000', yoclipTheme.colors.ink],
                stops: [0.45, 1.0], radius: 0.85 }, opacity: strength } };
}
// Inset frame — borderColor only, no fill:
{ type: 'container', alignment: 'center', width: 996, height: 1800,
  borderColor: C.paper, borderWidth: 1.5, opacity: frameIn * 0.9 }
// REC tag — drawn dot + text, opacity blinks:
var recOn = frame % 36 < 20 ? 1 : 0.25;
{ type: 'container', width: 14, height: 14, color: C.dressRed, borderRadius: 7,
  alignment: 'center', offsetX: 316, offsetY: -852, opacity: frameIn * recOn }
```

---

## 4. Pull-quote scene with large serif typography

**User asks for...** "Add an inspirational quote scene." / "Show a Chanel-style quote over her photo, classy serif."

**Technique.** Full-bleed portrait with a slow Ken Burns pull (`coverPhoto(..., 1.06, 1.0)`), dark ink scrim (`absolute_fill` at ~0.58) + vignette for legibility. Quote lines come from the texts dictionary (`T.lines || [...]`) and rise in with a **staggered loop**: each line `offsetY` eases from +36→0 with opacity, `14 + i*12` frames apart. Serif role (family/size/lineHeight) lives in the theme (`yoclipTheme.quote`, declared in `project.js`) so a variant can swap the font; the attribution is a tracked-sans kicker in gold, later than the last line.

**Reference** (external, inlined): `~/Downloads/my_love/scenes/01_quote.scene.js` — typography roles in `~/Downloads/my_love/project.js` (`masthead`/`statement`/`quote`/`kicker`).

```js
var lines = T.lines || ['«Beauty begins', 'the moment you decide', 'to be yourself.»'];
var children = [ coverPhoto('external:selfie', frame, 150, 1.06, 1.0),
  { type: 'absolute_fill', color: C.ink, opacity: 0.58 }, vignette(0.3) ];
for (var i = 0; i < lines.length; i++) {
  var p = ease(frame, 14 + i * 12, 38 + i * 12, eo3);      // staggered fade-up
  children.push({ type: 'text', alignment: 'center', text: lines[i],
    offsetY: -110 + i * 100 + (1 - p) * 36, opacity: p,
    style: { fontFamily: q.fontFamily, fontSize: q.fontSize, color: q.color, lineHeight: q.lineHeight } });
}
// attribution after the lines: ease(frame, 66, 88, eo3), letterSpacing: 8, gold
```

---

## 5. Forward + reverse loop with speed ramp on a sliced clip

**User asks for...** "Play the rest of the video at 1.5x and rewind the ending." / "Fast-forward the clip then bounce the last seconds back."

**Technique.** One long source clip is sliced across scenes with `sourceStart` (boomerangs consumed source 0–225; the reel starts at `sourceStart: 225`). The segment plays at `speed: 1.5` — the speed ramp is just the `speed` prop. The ending bounces back: after `revStart` scene frames, switch to a reversed node whose `sourceStart` equals where the forward run ended (225 + 150×1.5 = 449) and whose `startFrame` = `revStart` (the same boomerang rule as #1). White flashes mark scene entry **and** the turnaround.

**Reference** (external, inlined): `~/Downloads/my_love/scenes/03_reel.scene.js`.

```js
var revStart = 150;                       // forward run: source 225..449 @1.5x
var backward = frame >= revStart;
backward
  ? { type: 'video', source: 'external:reel', fit: 'cover', width: 1080, height: 1920,
      speed: 1.5, sourceStart: 449, startFrame: revStart, reverse: true, muted: true }
  : { type: 'video', source: 'external:reel', fit: 'cover', width: 1080, height: 1920,
      speed: 1.5, sourceStart: 225, muted: true };
// flashes: flashIn(frame, 8) on entry; flashIn(frame - revStart, 6) on the bounce
```

---

## 6. Logo draw-on via path progress

**User asks for...** "Animate the logo drawing itself on." / "A ring draws itself, then the logo pops in."

**Technique.** A `path` node with `progress: ease(frame, 0, 90, eio3)` — the stroke draws from 0→1. Paths are stroked (not filled), auto-scaled to the `width`/`height` box, and support `M/L/H/V/C/S/Q/T/Z/A` — arcs included: the sample's ring is `M 260 30 A 230 230 0 1 1 259.9 30` (near-full circle via a large-arc sweep; arcs are approximated by cubic segments internally). Cross-fade: ring opacity `1 − seg(frame, 70, 120)` while the logo image pops in with `eoBack` overshoot and a `shimmer`-pulsing glow. Tagline types out after (`typewriter` + blinking caret — see #7).

**Reference:** `samples/yoclip_about/scenes/00_intro.scene.js` (also `logo.scene.js`).

```js
var ringP = ease(frame, 0, 90, eio3);
var ringOpacity = (1 - seg(frame, 70, 120)) * 0.9;      // dissolve as logo arrives
var logoIn = ease(frame, 70, 170, eoBack);              // overshoot snap
{ type: 'path', path: 'M 30 260 C 30 130 130 30 260 30 C 390 30 490 130 490 260',
  progress: ringP, color: yoclipTheme.colors.primaryLight, strokeWidth: 3,
  width: 520, height: 520, alignment: 'center', opacity: ringOpacity }
{ type: 'image', source: yoclipLogoSource(), fit: 'contain', width: 640, height: 406,
  alignment: 'center', scale: 0.82 + 0.18 * logoIn, opacity: eo3(seg(frame, 70, 150)) }
```

---

## 7. Typing effect + chat simulation with cursor and send button

**User asks for...** "Show a chat where a message types itself and gets sent." / "Typing animation with a blinking cursor."

**Technique.** `typewriter(text, frame, start, cps)` returns the first N chars (fps-30-based cps). The caret is a thin `container` whose opacity follows `blink(frame, 12)`. Send flow: button `scale` dips 0.9 for a "pressed" window, the input clears (`sent` flag), and a gradient bubble lifts in (`ease` → `offsetY` 40→0, scale 0.9→1). The send glyph is a tiny `path` (`M 8 6 L 18 14 L 8 22`) — glyphs for icons are unreliable; stroke them. Glow note: a shadow on a container whose child is a `path` hides the fill — put the fill on the container and the glow works, or separate the layers.

**Reference:** `samples/yoclip_about/scenes/07_chat.scene.js` (`typewriter`/`blink` in `samples/yoclip_about/lib/animation.js`).

```js
var typed = typewriter(message, frame, 40, 46);
var sent = frame >= 196;
var showCursor = !sent && frame >= 40 && blink(frame, 12) === 1;
var sendScale = (frame >= 188 && frame < 202) ? 0.9 : 1.0;   // press
var bubbleIn = ease(frame, 200, 228, eo3);                    // lift-off
{ type: 'text', text: sent ? '' : typed, textAlign: 'left', style: { ... } }
{ type: 'container', width: 3, height: 32, color: primaryLight,
  opacity: showCursor ? 1 : 0, offsetX: 4 }                   // caret
{ type: 'container', width: 620, borderRadius: 28,
  gradient: { colors: [primary, violetDeep], begin: 'topLeft', end: 'bottomRight' },
  shadow: { color: yoclipColorA('primary', 0x80), blur: 34, offsetY: 16 },
  opacity: bubbleIn, scale: 0.9 + 0.1 * bubbleIn, offsetY: (1 - bubbleIn) * 40,
  child: { type: 'text', text: message, padding: 18, style: { ... } } }
```

---

## 8. Ken Burns / zoom into a detail

**User asks for...** "Slowly zoom into the screenshot." / "Ken Burns effect panning across the page."

**Technique.** Two flavors. Simple: `scale` an `image` over time (`coverPhoto` in #3 does 1.0→1.06). Full flight: put the content in a fixed-size `container` viewport with `clip: true`, and move an inner layer with `offsetX/offsetY` + `scale`. Flight math — for focus point `(fx, fy)` at scale `s` in a viewport centered at `(cx, cy)`: `tx = cx − fx`, `ty = cy − fy`; interpolate `fx/fy/s` together with `eio3` between waypoints for a smooth glide. The page never leaves its clipped viewport — the zoom is pure transform. Portrait variants scale the whole coordinate system by a factor `k` (`px(v) = v * k`).

**Reference:** `samples/yoclip_about/scenes/04_zoom.scene.js`.

```js
var f1 = seg(frame, 40, 130);              // full page -> feature card
var s  = lerp(1.0, 2.7, eio3(f1));
var fx = lerp(750, 270, eio3(f1));         // viewport center (750, 360)
var fy = lerp(360, 556, eio3(f1));
var zoomLayer = { type: 'container', width: 1500, height: 720, color: C.background,
  offsetX: 750 - fx, offsetY: 360 - fy, scale: s, child: pageContent };
var viewport = { type: 'container', width: 1500, height: 720, borderRadius: 26,
  borderColor: panel, borderWidth: 1.5, clip: true, alignment: 'center', child: zoomLayer };
```

---

## 9. Count-up stats

**User asks for...** "Animate numbers counting up." / "Show stats with ticking counters."

**Technique.** `counter(frame, start, dur, from, to)` — eased integer (`Math.round` over `eo3` progress). Each stat card pops in with `pop()` (overshoot scale + opacity), staggered by `index * 16` frames, then its counter starts a beat later. Big number + suffix baseline-aligned in a `row` (`crossAxisAlignment: 'end'`, suffix nudged `offsetY: -24`); label below. Number glow = text `shadows: [{ color: accent, blur: 34 }]`. Portrait variants switch `row` → `column` for the cards.

**Reference:** `samples/yoclip_about/scenes/06_stats.scene.js` (`counter`/`pop` in `lib/animation.js`).

```js
function stat(index, target, suffix, label, accent) {
  var p = pop(frame, 34 + index * 16, 28);
  var value = counter(frame, 60 + index * 16, 90, 0, target);
  return { type: 'container', width: 460, height: 380, borderRadius: 32,
    color: yoclipTheme.colors.surface, borderColor: accent, borderWidth: 1.5,
    shadow: { color: accent, blur: 40, offsetY: 22 }, scale: p.scale, opacity: p.opacity,
    child: { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center',
      children: [
        { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'end', children: [
          { type: 'text', text: '' + value, style: { fontSize: yoclipSize('display', 132),
            color: C.text, fontFamily: yoclipFont(), fontWeight: 700,
            shadows: [{ color: accent, blur: 34 }] } },
          { type: 'text', text: suffix, offsetY: -24, offsetX: 8, style: { ... } } ] },
        { type: 'text', text: label, style: { ... } } ] } };
}
```

---

## 10. FX reel — ten transition effects in one scene

**User asks for...** "Show off a bunch of visual effects." / "Make a reel of transition effects."

**Technique.** One scene, a `SLOT` of frames per effect, and a `win(i, node)` wrapper that gives each effect its own `presence` window (fade 6 in, hold, fade 6 out) plus a label. Every effect is built from plain nodes — no per-effect engine code. Actual effects in the sample: **e0 vignette** (radial-gradient container, `shimmer`-breathing stops) · **e1 scanlines** (loop of 3px white containers at 5% opacity, scrolling via `(f*3) % 14`) · **e2 light leak** (rotated warm-gradient band sweeping `offsetX`) · **e3 rings** (concentric border circles scaling 0.3→3.4 with fading opacity) · **e4 starburst** (dots flying out on `cos/sin` of evenly spaced angles) · **e5 chromatic aberration** (three copies of the same text, red/cyan split by `±offsetX`, white on top) · **e6 shine** (bright gradient band sweeping inside a `clip: true` container over the logo) · **e7 wave text** (per-letter `offsetY = sin(f*0.32 + i*0.85) * 26`) · **e8 letter reveal** (per-letter `staggerItem` rise + opacity) · **e9 spectrum** (equalizer bars, height from layered `|sin|` sums, glow shadow).

**Reference:** `samples/yoclip_about/scenes/12_fx.scene.js`.

```js
var SLOT = 34;
function win(i, node) {
  var f = frame - (TITLE + i * SLOT);
  var a = presence(f, 6, 22, 6);
  if (a <= 0) return null;
  return { type: 'stack', fit: 'expand', opacity: a, children: [ node(f, a), label(names[i]) ] };
}
function e3(f) {                                  // rings
  var rings = [ logo(300, 190, 1) ];
  for (var i = 0; i < 4; i++) {
    var p = seg(f, i * 6, 30);
    rings.push({ type: 'container', width: 240, height: 240, borderRadius: 120,
      borderColor: i % 2 ? accent : primaryLight, borderWidth: 3,
      alignment: 'center', scale: lerp(0.3, 3.4, eo3(p)), opacity: (1 - p) * 0.7 });
  }
  return { type: 'stack', fit: 'expand', children: rings };
}
```

---

## 11. Code typing window

**User asks for...** "Show code typing itself in an editor window." / "An IDE mockup with syntax highlighting next to a live preview."

**Technique.** Fake editor chrome: rounded `container` card + header row with three colored dots (`container`, `borderRadius: 9`) and a file name. Code lines are data (`{ t, c, indent }`); each line fades/slides in via `staggerItem(frame, i, 12, 7, 10)`. **Indent is `offsetX`, not spaces** — Geneva is proportional, so space-based indents drift. Syntax palette follows the theme and flips for light themes (`yoclipIsLight()`). Cause-and-effect: a connector (`path` play triangle, opacity `0.4 + 0.6 * shimmer`) lights up when typing completes, then the preview panel fades in with a `pop()` logo and a scrub bar (`width: 560 * seg(...)`).

**Reference:** `samples/yoclip_about/scenes/03_code.scene.js`.

```js
var codeLines = [
  { t: '// scene.render(frame)', c: K.comment, indent: 0 },
  { t: "type: 'stack',", c: K.kw, indent: 1 },
  { t: "text: 'Hello'", c: K.str, indent: 3 },
];
for (var i = 0; i < codeLines.length; i++) {
  var p = staggerItem(frame, i, 12, 7, 10);
  codeChildren.push({ type: 'text', text: codeLines[i].t, textAlign: 'left',
    style: { fontSize: yoclipSize('label', 26), color: codeLines[i].c, fontFamily: yoclipFont() },
    opacity: eo3(p), offsetX: codeLines[i].indent * 28 + (1 - eo3(p)) * -24 });
}
// chrome dots: { type: 'container', width: 18, height: 18, borderRadius: 9, color: '#ff5f57' }
```

---

## 12. Export showcase — feature chips

**User asks for...** "Show the export options." / "Highlight 4K / 60fps / quality as feature cards."

**Technique.** The sample's export scene is **chips, not device frames**: three cards (`pop()` in, staggered `index * 18`), each with a big value, a caption, and a check badge (accent circle + stroked `path` check `M 8 22 L 17 31 L 33 10`). One value is live: the fps chip counts up 0→60 with `Math.round(lerp(0, 60, ease(...)))` so it reads as a real number. Portrait variants restack the row of chips into a column with spacer containers. (There is no phone/device-frame mockup in the sample — build one as a rounded `container` frame around a clipped preview if asked.)

**Reference:** `samples/yoclip_about/scenes/10_export.scene.js`.

```js
var fpsBig = String(Math.round(lerp(0, 60, ease(frame, 80, 190, eo3))));   // live count
function chip(index, big, small, accent) {
  var p = pop(frame, 30 + index * 18, 30);
  return { type: 'container', width: 420, height: 320, borderRadius: 32,
    color: C.surface, borderColor: accent, borderWidth: 1.5,
    shadow: { color: accent, blur: 40, offsetY: 22 }, scale: p.scale, opacity: p.opacity,
    child: { type: 'column', mainAxisAlignment: 'center', crossAxisAlignment: 'center', children: [
      { type: 'text', text: big, style: { fontSize: yoclipSize('h4', 76), fontWeight: 700,
        color: C.text, fontFamily: yoclipFont(), shadows: [{ color: accent, blur: 26 }] } },
      { type: 'text', text: small, offsetY: 10, style: { ... } },
      { type: 'container', width: 56, height: 56, borderRadius: 28, color: accent, offsetY: 26,
        alignment: 'center', child: { type: 'path', path: 'M 8 22 L 17 31 L 33 10',
        color: C.background, strokeWidth: 4, width: 30, height: 30 } } ] } };
}
```

---

## 13. CTA with glowing breathing button

**User asks for...** "End with a call-to-action and a download button." / "A glowing button that pulses."

**Technique.** Finale scene that **holds to the end** (no `presence` fade-out — just `fadeIn`). Button = gradient `container` (3-stop primaryLight→primary→deep), glow via `shadow` whose `blur` shimmers (`44 + 20 * shimmer(frame, 60)`), breathing `scale = 1 + 0.03 * sin(frame * 0.1)`, and a `pop()` entrance. Button glyph (chevron) is a stroked `path`; URL is letter-spaced text below. Slow-rising sparkles behind the logo: small round containers, `opacity` from `shimmer`, `offsetY` bobbed by `float()`.

**Reference:** `samples/yoclip_about/scenes/11_cta.scene.js`.

```js
var btnIn = pop(frame, 150, 30);
var breathe = 1 + 0.03 * Math.sin(frame * 0.1);
{ type: 'container', width: 520, borderRadius: 40,
  gradient: { colors: [primaryLight, primary, violetDeep], begin: 'topLeft', end: 'bottomRight' },
  shadow: { color: yoclipColorA('primary', 0xb3), blur: 44 + 20 * shimmer(frame, 60) },
  alignment: 'center', offsetY: 310,
  scale: (0.92 + 0.08 * btnIn.scale) * breathe, opacity: btnIn.opacity,
  child: { type: 'row', mainAxisAlignment: 'center', crossAxisAlignment: 'center', children: [
    { type: 'path', path: 'M 8 10 L 18 20 L 28 10', color: white, strokeWidth: 4, width: 36, height: 28 },
    { type: 'text', text: T.download || 'Download YoClip', offsetX: 18, style: { ... } } ],
    padding: 26 } }
```

---

## 14. Multi-language pattern: dictionaries + variants

**User asks for...** "Make an English and a Russian version." / "Localize the video."

**Technique.** Variants in `yoclip.yaml` carry `params: { lang: 'en' | 'ru' }` (and can retarget resolution — see #15). Text dictionaries live in `project.js → texts: { en: {...}, ru: {...} }` (yaml `texts:` deep-merges over them); scenes read `yoclipT('<section>').key || 'English fallback'` — the fallback is mandatory so a missing dictionary degrades, never crashes. Structure dictionaries **per scene** (`texts.en.cover.kicker`). When languages differ in length, branch on `yoclipLang()` (the my_love finale shrinks the ru masthead font). Theme typography roles (serif vs sans) are also per-variant-overridable in `project.js → theme`.

**Reference:** `samples/yoclip_about/yoclip.yaml` (`variants:`), `samples/yoclip_about/project.js` + `lib/animation.js` (`yoclipT`, `yoclipLang`); external: `~/Downloads/my_love/project.js` (full en/ru dictionaries, per-language font tweak).

```yaml
variants:
  - id: dark_en
    params: { lang: 'en' }
  - id: dark_ru
    params: { lang: 'ru' }
```
```js
// project.js
texts: { en: { cover: { kicker: 'THE SUMMER ISSUE' } },
         ru: { cover: { kicker: 'ЛЕТНИЙ ВЫПУСК' } } }
// scene
var T = yoclipT('cover');
text: T.kicker || 'THE SUMMER ISSUE',
fontSize: yoclipLang() === 'ru' ? 146 : 168,   // wider word in ru
```

---

## 15. Portrait / shorts adaptation via variant resolution

**User asks for...** "Make a vertical version for Shorts/Reels." / "Adapt the video to 9:16."

**Technique.** A variant with explicit `width`/`height` **retargets the render natively** (no letterbox): every scene sees `yoclipFormat` and branches via `yoclipIsPortrait()` (from the lib). Typical branches: bigger logo/ring using vertical room, `row` → `column` for card layouts, retucked `offsetY`s, smaller titles that clear watermarks, and a global coordinate scale factor (`px(v) = v * k`) for fixed-size mockups. Variants without a resolution keep the base aspect; export-preset Shorts on a landscape master is letterboxed by design — a true vertical cut needs a resolution variant. Studio auto-selects the matching export preset for resolution variants.

**Reference:** `samples/yoclip_about/yoclip.yaml` (`shorts_en`), branches throughout e.g. `samples/yoclip_about/scenes/00_intro.scene.js`, `06_stats.scene.js`.

```yaml
variants:
  - id: shorts_en
    label: 'Shorts · EN'
    width: 1080            # <- re-renders natively at 9:16
    height: 1920
    params: { lang: 'en' }
```
```js
var portrait = yoclipIsPortrait();
width: portrait ? 760 : 640,
offsetY: portrait ? -260 : -70,
children: portrait ? columnOfCards : rowOfCards,     // restack layouts
var k = portrait ? 0.64 : 1.0; function px(v) { return v * k; }  // scale fixed mockups
```
