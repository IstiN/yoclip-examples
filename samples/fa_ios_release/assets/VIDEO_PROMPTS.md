# Fa iOS Release — промпты для генерации видео с человеком (Grok и др.)

Вставляем живые кадры как `AnimVideo`-слои в сцены yoclip. Текст, QR и UI
поверх — рисует yoclip, поэтому **в сгенерированном видео не должно быть
никакого текста, логотипов и водяных знаков** (чистый футаж).

## Характер (константа для всех промптов — вставляй в каждый)

```
A man in his early 30s, short dark hair, light stubble, wearing a beige
oversized hoodie and a dark baseball cap. Calm, focused expression, natural
relaxed body language. Same person in every shot.
```

## Технические требования

- Формат: MP4 (h264), 30 fps, без звука
- Длительность: бери с запасом +1 c от требуемой (обрежем в yoclip)
- Без текста, интерфейсов с читаемыми словами, водяных знаков
- Освещение: dark-сцены — тёмная комната, свет от экранов; light-сцены —
  мягкий дневной свет из окна

---

## 1. `hook_typing` → сцена 01_hook (0–170f, нужно ~5.7 c)

Референс: страница 17 PDF (палец на клавишах, shallow DOF, тёмно).

**Dark horizontal (1920×1080):**
```
{CHARACTER} Extreme close-up of fingers typing fast on a backlit laptop
keyboard in a dark room at night, face hidden in shadow, only hands and
keys visible, shallow depth of field, warm key light from the screen,
subtle blue ambient glow, slow cinematic push-in, moody tech-noir,
photorealistic, 4k, no text
```
**Dark vertical (1080×1920):**
```
{CHARACTER} Vertical shot, over-the-shoulder: hands holding an iPhone,
typing a message in a dark room, screen glow on fingers, face out of
frame, shallow depth of field, night mood, slow subtle handheld sway,
photorealistic, no text, no readable UI on the phone
```
**Light horizontal (1920×1080):** то же, что dark horizontal, но:
```
...bright morning light from a large window, clean minimal desk, soft
daylight on the keys, airy high-key look...
```
**Light vertical (1080×1920):** то же, что dark vertical, но дневной свет, светлый интерьер.

---

## 2. `download_qr_scan` → сцена 02_download (170–362f, ~6.4 c)

QR-код и App Store-карточку рисует yoclip; здесь — руки с телефоном.

**Dark vertical (1080×1920) — основной вариант этой сцены:**
```
{CHARACTER} Vertical shot, hands holding a smartphone up as if scanning a
QR code on a wall in a dim hallway, phone screen glowing, elbows and
hoodie sleeves visible, shallow depth of field, teal-violet ambient light,
slow push-in, cinematic, photorealistic, screen shows abstract glow, no
readable text
```
**Dark horizontal (1920×1080):** средний план — человек стоит спиной к камере, подносит телефон к постеру на стене (постер — тёмный прямоугольник), то же освещение.

**Light варианты:** та же композиция, яркий коридор/офис, дневной свет, белые стены.

---

## 3. `build_montage` → сцена 05_build (698–938f, ~8 c) — фоновый слой

Сцена уже плотная (4 карточки приложений); человек — едва заметный фон
за карточками (opacity ~0.35 в yoclip) или левая колонка в landscape.

**Dark horizontal (1920×1080):**
```
{CHARACTER} Medium wide shot, man in beige hoodie and dark cap sitting at
a desk with three monitors showing colorful abstract code (blurred, not
readable), typing, city lights bokeh through a window behind, night,
screen light on his face, slow lateral dolly, tech-noir mood,
photorealistic, no readable text on screens
```
**Dark vertical (1080×1920):** тот же сетап, но вертикальный кроп —
человек по центру, мониторы по краям кадра.
**Light варианты:** дневной офис, белый стол, мягкий свет, те же движения.

---

## 4. `outro_monitors` → сцена 07_lockup (1130–1274f, ~4.8 c) ⭐

Референс: страница 23 PDF — геройский кадр. В yoclip поверх него ляжет
блок «Fa + THE FIRST REAL MOBILE AI HARNESS + QR».

**Dark horizontal (1920×1080):**
```
{CHARACTER} Wide cinematic shot, man in beige hoodie and dark baseball cap
reclining relaxed in an office chair in front of a wall of six monitors
glowing with blurred abstract code, laptop on his lap, paper takeout bags
on the desk, night city skyline through a huge window behind the screens,
dim room lit only by monitor glow, slight slow zoom out, accomplished
mood, photorealistic, anamorphic look, no readable text on screens.
IMPORTANT: keep the left third of the frame dark and empty (negative
space for overlay), subject positioned right of center
```
**Dark vertical (1080×1920):**
```
{CHARACTER} Vertical cinematic shot, same man in beige hoodie and dark cap
leaning back in a chair in front of glowing monitor wall at night, city
lights bokeh through window, takeout food on desk. Keep the top 40% of
the frame dark and empty (negative space for overlay), subject in lower
half of frame, slow push-in, photorealistic, no readable text
```
**Light horizontal (1920×1080):** тот же кадр, но: «bright daytime loft, sunlit monitors wall, white desk, city skyline in daylight, airy high-key, keep left third clean and bright».
**Light vertical (1080×1920):** дневной вариант, вертикальный кроп, верхние 40% — светлая стена/небо (негативное пространство).

---

## Как вставить в yoclip (после генерации)

1. Положи файлы в `samples/fa_ios_release/assets/video/`:
   `hook_typing_dark_h.mp4`, `outro_monitors_dark_v.mp4` и т.д.
2. Добавь в `yoclip.yaml` → `external_assets` (имя → путь).
3. В сцене: `AnimVideo` node, `source: 'external:<имя>'`, `fit: cover`,
   при необходимости `opacity` и затемнение (`AbsoluteFill` чёрный
   поверх с opacity 0.45 для dark-тем, 0.15 для light).
4. Светлая тема dark-слой не примет — генерируй light-варианты отдельно.

## Negative prompt (добавляй везде)

```
text, captions, subtitles, watermark, logo, UI text, readable words,
extra fingers, deformed hands, face close-up, flicker, fast cuts
```
