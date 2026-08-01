// Project-wide layout for "Yoclip: What's Your Big Idea?".
//
// Layers (bottom -> top):
//   - background: animated gradient + drifting color orbs, full length
//   - content:    the promo beats, chained with a small negative offset so
//                 neighbours crossfade (hard-cut energy where the music hits)
//
// The color palette lives in yoclip.yaml -> theme.colors (single source of
// truth, Theme-panel editable); typography roles are deep-merged over it here
// and exposed to every scene as `yoclipTheme`.

project = {
  lib: 'lib/animation.js',
  theme: {
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
  // section via yoclipT('<section>'); the active language comes from the
  // variant's `lang` param and English is the fallback.
  texts: {
    en: {
      background: { timeline: 'Background' },
      hook: {
        timeline: 'Hook',
        question: "What's your next video?",
      },
      worlds: {
        timeline: 'Worlds',
        captions: ['any world', 'any style', 'any story'],
      },
      logo: {
        timeline: 'Brand',
        verb: 'Render',
        words: ['promos', 'doc videos', 'shorts', 'product demos'],
        tail: 'from code.',
      },
      prompt: {
        timeline: 'Prompt',
        field: 'A launch teaser for my app',
        button: 'Render',
        cards: [
          ['00_hook', 'cursor types the question'],
          ['01_worlds', 'a 3D montage of styles'],
          ['11_cta', 'logo end card, beat-synced'],
        ],
      },
      chat: {
        timeline: 'Agent',
        user: 'make the logo pop on the drop',
        agent: 'On it — updating 11_cta.scene.js',
        activity: '⚙ write_project_file scenes/11_cta.scene.js',
        broken: '✖ 1 scene error',
        fixed: '✓ All scene errors resolved.',
      },
      code: {
        timeline: 'Code',
        filename: 'scenes/rocket.scene.js',
        caption: 'Code in. Video out.',
      },
      variants: {
        timeline: 'Variants',
        title: 'One project. Every format.',
        cards: ['Dark · EN', 'Dark · RU', 'Light · EN', 'Light · RU', 'Shorts 9:16'],
        command: 'yoclip render -V shorts_en',
      },
      stats: {
        timeline: 'Numbers',
        items: [
          ['4', 'packages'],
          ['15', 'creative patterns'],
          ['5', 'variants · 1 source'],
        ],
        pyramid: ['Describe', 'Render', 'Ship'],
      },
      goldens: {
        timeline: 'Goldens',
        title: 'Every pixel is tested.',
        subtitle: 'golden tests · yoclip render --update-goldens',
        passed: '6/6 passed',
        cards: [
          'worlds/hollywood · f175',
          'worlds/banner · f222',
          'worlds/rally · f280',
          'code/rocket · f1160',
          'flythrough/helmet · f2140',
          'cta/endcard · f2440',
        ],
      },
      export: {
        timeline: 'Export',
        command: 'yoclip render -V dark_en -o big_idea.mp4',
        chips: ['MP4 · H.264', '30 fps', '1920×1080', 'EN + RU'],
      },
      flythrough: {
        timeline: 'Fly-through',
        tagline: 'Your big idea. In code.',
      },
      cta: {
        timeline: 'CTA',
        tagline: 'Describe it. Render it.',
        url: 'yoclip.dev',
        meta: 'Rendered by yoclip.',
      },
    },
    ru: {
      background: { timeline: 'Фон' },
      hook: {
        timeline: 'Хук',
        question: 'Каким будет твоё следующее видео?',
      },
      worlds: {
        timeline: 'Миры',
        captions: ['любой мир', 'любой стиль', 'любая история'],
      },
      logo: {
        timeline: 'Бренд',
        verb: 'Рендерь',
        words: ['промо', 'док-видео', 'шортсы', 'демо продукта'],
        tail: 'из кода.',
      },
      prompt: {
        timeline: 'Промпт',
        field: 'Тизер запуска моего приложения',
        button: 'Рендер',
        cards: [
          ['00_hook', 'курсор печатает вопрос'],
          ['01_worlds', '3D-монтаж стилей'],
          ['11_cta', 'финальная карточка с лого'],
        ],
      },
      chat: {
        timeline: 'Агент',
        user: 'сделай лого заметнее на дропе',
        agent: 'Делаю — обновляю 11_cta.scene.js',
        activity: '⚙ write_project_file scenes/11_cta.scene.js',
        broken: '✖ 1 ошибка сцены',
        fixed: '✓ Все ошибки сцен исправлены.',
      },
      code: {
        timeline: 'Код',
        filename: 'scenes/rocket.scene.js',
        caption: 'Код на входе. Видео на выходе.',
      },
      variants: {
        timeline: 'Варианты',
        title: 'Один проект. Все форматы.',
        cards: ['Dark · EN', 'Dark · RU', 'Light · EN', 'Light · RU', 'Shorts 9:16'],
        command: 'yoclip render -V shorts_en',
      },
      stats: {
        timeline: 'Цифры',
        items: [
          ['4', 'пакета'],
          ['15', 'креативных паттернов'],
          ['5', 'вариантов · 1 исходник'],
        ],
        pyramid: ['Опиши', 'Отрендерь', 'Выкатывай'],
      },
      goldens: {
        timeline: 'Голдены',
        title: 'Каждый пиксель под тестом.',
        subtitle: 'золотые тесты · yoclip render --update-goldens',
        passed: '6/6 зелёных',
        cards: [
          'worlds/hollywood · f175',
          'worlds/banner · f222',
          'worlds/rally · f280',
          'code/rocket · f1160',
          'flythrough/helmet · f2140',
          'cta/endcard · f2440',
        ],
      },
      export: {
        timeline: 'Экспорт',
        command: 'yoclip render -V dark_en -o big_idea.mp4',
        chips: ['MP4 · H.264', '30 fps', '1920×1080', 'EN + RU'],
      },
      flythrough: {
        timeline: 'Пролёт',
        tagline: 'Твоя большая идея. В коде.',
      },
      cta: {
        timeline: 'CTA',
        tagline: 'Опиши. Отрендерь.',
        url: 'yoclip.dev',
        meta: 'Отрендерено в yoclip.',
      },
    },
  },

  scenes: [
    { path: 'scenes/background.scene.js',    layer: 'background', start: 0, duration: 2580 },

    { path: 'scenes/00_hook.scene.js',       layer: 'content', start: 0 },
    { path: 'scenes/01_worlds.scene.js',     layer: 'content', start: { after: 'hook',       offset: -6 } },
    { path: 'scenes/02_logo.scene.js',       layer: 'content', start: { after: 'worlds',     offset: -6 } },
    { path: 'scenes/03_prompt.scene.js',     layer: 'content', start: { after: 'logo',       offset: -6 } },
    { path: 'scenes/04_chat.scene.js',       layer: 'content', start: { after: 'prompt',     offset: -6 } },
    { path: 'scenes/05_code.scene.js',       layer: 'content', start: { after: 'chat',       offset: -6 } },
    { path: 'scenes/06_variants.scene.js',   layer: 'content', start: { after: 'code',       offset: -6 } },
    { path: 'scenes/07_stats.scene.js',      layer: 'content', start: { after: 'variants',   offset: -6 } },
    { path: 'scenes/08_goldens.scene.js',     layer: 'content', start: { after: 'stats',      offset: -6 } },
    { path: 'scenes/09_export.scene.js',     layer: 'content', start: { after: 'goldens',    offset: -6 } },
    { path: 'scenes/10_flythrough.scene.js', layer: 'content', start: { after: 'export',     offset: -6 } },
    { path: 'scenes/11_cta.scene.js',        layer: 'content', start: { after: 'flythrough', offset: -6 } },
  ],
};
