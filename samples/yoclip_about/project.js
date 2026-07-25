// Project-wide layout for the yoclip_about promo.
//
// Layers (bottom -> top):
//   - background: animated gradient + drifting color orbs, full length
//   - content:    the promo beats, anchored one after another with a small
//                 negative offset so neighbours crossfade
//   - overlay:    a steady watermark on top of everything
//
// This theme is deep-merged over yoclip.yaml theme and exposed to every scene
// as `yoclipTheme`. The color palette lives in yoclip.yaml (Theme-panel editable);
// keep typography and per-scene JS overrides here. Override once, reuse everywhere.

project = {
  lib: 'lib/animation.js',
  theme: {
    // Color palette lives in yoclip.yaml -> theme.colors (single source of truth,
    // editable from the Studio Theme panel). Scenes read yoclipTheme.colors.* with
    // JS fallbacks so a missing key never blanks a fill.
    headline: {
      fontSize: 96,
      color: '#ffffff',
      fontFamily: 'Geneva',
      fontWeight: 700,
    },
    subline: {
      fontSize: 40,
      color: '#a1a1aa',
      fontFamily: 'Geneva',
    },
    label: {
      fontSize: 26,
      color: '#a78bfa',
      fontFamily: 'Geneva',
      fontWeight: 600,
      letterSpacing: 8,
    },
  },
  // Variant dictionaries — one project, many languages. Scenes read their
  // section via yoclipT('<section>') (lib/animation.js); the active language
  // comes from the variant's `lang` param and English is the fallback. `en`
  // mirrors the original copy verbatim so dark_en / light_en render identically
  // to before variants existed; `ru` keeps overlays short on purpose.
  texts: {
    en: {
      intro: {
        timeline: 'Intro',
        tagline: 'video, scene by scene',
      },
      hook: {
        timeline: 'Hook',
        kicker: 'T H E   I D E A',
        line1: 'What if your timeline',
        line2: 'was code?',
        sub: 'yoclip turns scripts into pixels.',
      },
      scenes: {
        timeline: 'Scenes',
        title: 'Compose in scenes',
        sub: 'each scene is a tiny program',
        cardText: 'Text',
        cardPaths: 'Paths',
        card3d: '3D',
        cardImages: 'Images',
        cardCode: 'Code',
      },
      code: {
        timeline: 'Code',
        title: 'Your timeline is code',
        preview: 'Preview',
      },
      zoom: {
        timeline: 'Zoom',
        title: 'Zoom into any detail',
        navProduct: 'Product',
        navPricing: 'Pricing',
        navDocs: 'Docs',
        search: 'Search docs…',
        heroTitle: 'Edit video in code',
        heroSub: 'Scenes, timelines and exports.',
        ctaStart: 'Get started',
        ctaDemo: 'Watch demo',
        livePreview: 'Live preview',
        featScenes: 'Scenes',
        featScenesDesc: 'Compose clips from reusable JS scenes.',
        featTimeline: 'Timeline',
        featTimelineDesc: 'Seek, scrub and anchor beats to each other.',
        featExport: 'Export',
        featExportDesc: 'Render MP4, GIF or PNG from one timeline.',
      },
      motion: {
        timeline: '3D motion',
        title: 'Motion that feels alive',
      },
      stats: {
        timeline: 'Stats',
        title: 'Built for real output',
        resolution: 'any resolution',
        scriptable: 'scriptable',
      },
      chat: {
        timeline: 'Chat',
        title: 'Automate the boring parts',
        sub: 'script interactions once, replay forever',
        message: 'Make videos from code and scenes.',
        placeholder: 'Type a message...',
      },
      studio: {
        timeline: 'Studio',
      },
      montage: {
        timeline: 'Montage',
        title: 'Anything you can code',
        labels: ['draw', 'breathe', 'spin'],
      },
      export: {
        timeline: 'Export',
        title: 'Export your way',
        sub: 'resolution · frame rate · quality — then queue the rest',
        resolutions: '720 · 1080 · 4K · custom',
        high: 'High',
        quality: 'Low · Medium · High',
      },
      cta: {
        timeline: 'CTA',
        tagline: 'video, scene by scene',
        download: 'Download YoClip',
      },
      fx: {
        timeline: 'FX',
        title: '10 effects, one engine',
        names: [
          'vignette', 'scanlines', 'light leak', 'rings', 'starburst',
          'chromatic', 'shine', 'wave text', 'letter reveal', 'spectrum',
        ],
        wordEffects: 'EFFECTS',
      },
      background: {
        timeline: 'Background',
      },
      logo: {
        timeline: 'Logo',
      },
    },
    ru: {
      intro: {
        timeline: 'Интро',
        tagline: 'видео, сцена за сценой',
      },
      hook: {
        timeline: 'Зацепка',
        kicker: 'И Д Е Я',
        line1: 'Что если таймлайн',
        line2: 'был кодом?',
        sub: 'yoclip превращает скрипты в пиксели.',
      },
      scenes: {
        timeline: 'Сцены',
        title: 'Собирайте из сцен',
        sub: 'каждая сцена — маленькая программа',
        cardText: 'Текст',
        cardPaths: 'Пути',
        card3d: '3D',
        cardImages: 'Картинки',
        cardCode: 'Код',
      },
      code: {
        timeline: 'Код',
        title: 'Ваш таймлайн — это код',
        preview: 'Превью',
      },
      zoom: {
        timeline: 'Зум',
        title: 'Приближайте любую деталь',
        navProduct: 'Продукт',
        navPricing: 'Цены',
        navDocs: 'Доки',
        search: 'Поиск по докам…',
        heroTitle: 'Монтируйте видео кодом',
        heroSub: 'Сцены, таймлайны и экспорт.',
        ctaStart: 'Начать',
        ctaDemo: 'Демо',
        livePreview: 'Живое превью',
        featScenes: 'Сцены',
        featScenesDesc: 'Собирайте ролики из сцен на JS.',
        featTimeline: 'Таймлайн',
        featTimelineDesc: 'Перематывайте и привязывайте биты.',
        featExport: 'Экспорт',
        featExportDesc: 'MP4, GIF или PNG из одного таймлайна.',
      },
      motion: {
        timeline: '3D-движение',
        title: 'Движение, которое оживает',
      },
      stats: {
        timeline: 'Статистика',
        title: 'Сделано для реального результата',
        resolution: 'любое разрешение',
        scriptable: 'программируемо',
      },
      chat: {
        timeline: 'Чат',
        title: 'Автоматизируйте рутину',
        sub: 'скрипт один раз — повторяйте вечно',
        message: 'Делайте видео из кода и сцен.',
        placeholder: 'Введите сообщение...',
      },
      studio: {
        timeline: 'Студия',
      },
      montage: {
        timeline: 'Монтаж',
        title: 'Всё, что можно закодировать',
        labels: ['рисунок', 'дыхание', 'вращение'],
      },
      export: {
        timeline: 'Экспорт',
        title: 'Экспорт на ваш лад',
        sub: 'разрешение · fps · качество — остальное в очередь',
        resolutions: '720 · 1080 · 4K · своё',
        high: 'Высокое',
        quality: 'Низкое · Среднее · Высокое',
      },
      cta: {
        timeline: 'Финал',
        tagline: 'видео, сцена за сценой',
        download: 'Скачать YoClip',
      },
      fx: {
        timeline: 'FX',
        title: '10 эффектов, один движок',
        names: [
          'виньетка', 'скан-линии', 'засветка', 'кольца', 'вспышка',
          'хроматика', 'блик', 'волна текста', 'буквы', 'спектр',
        ],
        wordEffects: 'ЭФФЕКТЫ',
      },
      background: {
        timeline: 'Фон',
      },
      logo: {
        timeline: 'Логотип',
      },
    },
  },
  scenes: [
    { path: 'scenes/background.scene.js', layer: 'background', start: 0, duration: 4170 },

    { path: 'scenes/00_intro.scene.js',   layer: 'content', start: 0 },
    { path: 'scenes/01_hook.scene.js',    layer: 'content', start: { after: 'intro',   offset: -6 } },
    { path: 'scenes/02_scenes.scene.js',  layer: 'content', start: { after: 'hook',    offset: -6 } },
    { path: 'scenes/03_code.scene.js',    layer: 'content', start: { after: 'scenes',  offset: -6 } },
    { path: 'scenes/04_zoom.scene.js',    layer: 'content', start: { after: 'code',    offset: -6 } },
    { path: 'scenes/05_motion.scene.js',  layer: 'content', start: { after: 'zoom',    offset: -6 } },
    { path: 'scenes/06_stats.scene.js',   layer: 'content', start: { after: 'motion',  offset: -6 } },
    { path: 'scenes/07_chat.scene.js',    layer: 'content', start: { after: 'stats',   offset: -6 } },
    { path: 'scenes/08_studio.scene.js',  layer: 'content', start: { after: 'chat',    offset: -6 } },
    { path: 'scenes/09_montage.scene.js', layer: 'content', start: { after: 'studio',  offset: -6 } },
    { path: 'scenes/12_fx.scene.js',      layer: 'content', start: { after: 'montage', offset: -6 } },
    { path: 'scenes/10_export.scene.js',  layer: 'content', start: { after: 'fx',      offset: -6 } },
    { path: 'scenes/11_cta.scene.js',     layer: 'content', start: { after: 'export',  offset: -6 } },

    { path: 'scenes/logo.scene.js',       layer: 'overlay', start: 0, duration: 4170 },
  ],
};
