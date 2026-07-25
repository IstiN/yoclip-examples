// Promo scene 4 — "zoom into any detail".
//
// A fake landing page sits inside a browser chrome. We Ken-Burns it: glide from
// the full page into a feature card, pan across to the hero CTA, then snap back
// to the full picture. Everything (chrome, page, icons) is built from themed
// v2 nodes, so the same trick works on any screenshot or live UI a user drops
// in. The page never leaves its clipped viewport — the zoom is pure transform.

scene = {
  id: 'zoom',
  duration: 330,
  from: 0,
  timeline: {
    label: yoclipT('zoom').timeline || 'Zoom',
    color: yoclipTheme.colors.accent,
    lane: 'video',
  },
  render: function(frame) {
    var T = yoclipT('zoom');
    var C = yoclipTheme.colors;
    var life = presence(frame, 14, 300, 16);
    var titleIn = ease(frame, 0, 24, eo3);
    // Portrait variants (e.g. shorts 1080x1920): the fake page is 1500px
    // wide — too wide for a 1080px canvas (the frame's SizedBox would clamp
    // and the rows would overflow). Build the whole page at scale k instead:
    // every page coordinate and size is multiplied by k, so the Ken Burns
    // flight keeps the same proportions.
    var portrait = yoclipIsPortrait();
    var k = portrait ? 0.64 : 1.0;
    function px(v) { return v * k; }

    // --- Ken Burns flight plan -------------------------------------------
    // Viewport/page is 1500x720, center (750, 360). For a focus point (fx, fy)
    // at scale s we translate by (center - focus); the compiler applies
    // translate before scale, so the focus stays pinned to the viewport center
    // at any zoom. Interpolate fx/fy/s together for a smooth flight.
    // Coordinates are for a 1200x576 virtual page (was 1500x720).
    // Keeping the zoom scale moderate (max 2.4x) reduces the offscreen
    // bitmap size and avoids browser rasterization stalls on this scene.
    var f1 = seg(frame, 40, 130);   // full -> feature card (bottom-left)
    var f2 = seg(frame, 130, 220);  // pan to profile avatar (top-right)
    var f3 = seg(frame, 220, 290);  // snap back to full page

    var s, fx, fy;
    if (frame < 130) {
      s  = lerp(1.0, 2.2, eio3(f1));
      fx = px(lerp(600, 216, eio3(f1)));
      fy = px(lerp(288, 445, eio3(f1)));
    } else if (frame < 220) {
      s  = lerp(2.2, 2.4, eio3(f2));
      fx = px(lerp(216, 1072, eio3(f2)));
      fy = px(lerp(445, 96, eio3(f2)));
    } else {
      s  = lerp(2.4, 1.0, eio3(f3));
      fx = px(lerp(1072, 600, eio3(f3)));
      fy = px(lerp(96, 288, eio3(f3)));
    }
    var tx = px(600) - fx;
    var ty = px(288) - fy;

    // --- small themed helpers --------------------------------------------
    function dot(color) {
      return { type: 'container', width: 16, height: 16, borderRadius: 8, color: color };
    }
    function icon(path, color, size) {
      return { type: 'path', path: path, color: color, strokeWidth: 3.2, width: size, height: size };
    }
    function featureCard(title, desc, d, tint) {
      tint = tint || yoclipColor('lavender', '#a78bfa');
      var primary = C.primary || yoclipColor('primary', '#7c3aed');
      return {
        type: 'container',
        width: px(376),
        height: px(184),
        borderRadius: px(18),
        color: C.surface || yoclipColor('surfaceDark', '#15131f'),
        borderColor: yoclipColor('panel', '#2a2a36'),
        borderWidth: 1,
        child: {
          type: 'column',
          crossAxisAlignment: 'start',
          children: [
            { type: 'container', height: px(20) },
            {
              type: 'container',
              width: px(52), height: px(52), borderRadius: px(26),
              gradient: { colors: [tint, primary], begin: 'topLeft', end: 'bottomRight' },
              shadow: { color: tint, blur: 12, offsetY: 4 },
              alignment: 'center',
              offsetX: px(28),
              child: icon(d, yoclipColor('white', '#ffffff'), px(28)),
            },
            { type: 'container', height: px(14) },
            {
              type: 'text', text: title,
              style: { fontSize: px(yoclipSize('caption', 24)), color: C.text, fontFamily: yoclipFont(), fontWeight: 700 },
              offsetX: px(28),
            },
            { type: 'container', height: px(6) },
            {
              type: 'text', text: desc,
              style: { fontSize: px(yoclipSize('micro', 17)), color: C.textMuted, fontFamily: yoclipFont(), lineHeight: 1.32 },
              offsetX: px(28),
            },
          ],
        },
      };
    }

    // --- the fake web page (1500 x 720) ----------------------------------
    var siteTopbar = {
      type: 'container',
      height: px(52),
      color: C.surface,
      child: {
        type: 'row',
        crossAxisAlignment: 'center',
        children: [
          { type: 'container', width: px(32) },
          {
            type: 'image',
            source: yoclipLogoSource(),
            fit: 'contain',
            width: px(160),
            height: px(38),
            alignment: 'centerLeft',
          },
          { type: 'container', width: px(56) },
          { type: 'text', text: T.navProduct || 'Product', style: { fontSize: px(yoclipSize('labelSm', 20)), color: C.textMuted, fontFamily: yoclipFont() } },
          { type: 'container', width: px(36) },
          { type: 'text', text: T.navPricing || 'Pricing', style: { fontSize: px(yoclipSize('labelSm', 20)), color: C.textMuted, fontFamily: yoclipFont() } },
          { type: 'container', width: px(36) },
          { type: 'text', text: T.navDocs || 'Docs', style: { fontSize: px(yoclipSize('labelSm', 20)), color: C.textMuted, fontFamily: yoclipFont() } },
          { type: 'container', width: px(280) },
          {
            type: 'container', width: px(240), height: px(36), borderRadius: px(18),
            color: C.surface, borderColor: yoclipColor('panel', '#2a2a36'), borderWidth: 1,
            child: { type: 'text', text: T.search || 'Search docs…', alignment: 'centerLeft', offsetX: px(18),
              style: { fontSize: px(yoclipSize('tiny', 18)), color: C.textMuted, fontFamily: yoclipFont() } },
          },
          { type: 'container', width: px(18) },
          { type: 'container', width: px(38), height: px(38), borderRadius: px(19), color: C.accent },
        ],
      },
    };

    var heroText = {
      type: 'column',
      crossAxisAlignment: 'start',
      width: px(624),
      children: [
        { type: 'container', height: px(32) },
        { type: 'text', text: 'YOCLIP STUDIO', offsetX: px(56),
          style: { fontSize: px(yoclipSize('tiny', 18)), color: C.primaryLight, fontFamily: yoclipFont(), fontWeight: 600, letterSpacing: px(5) } },
        { type: 'container', height: px(12) },
        { type: 'text', text: T.heroTitle || 'Edit video in code', offsetX: px(56),
          style: { fontSize: px(yoclipSize('bodyXl', 36)), color: C.text, fontFamily: yoclipFont(), fontWeight: 700 } },
        { type: 'container', height: px(12) },
        { type: 'text', text: T.heroSub || 'Scenes, timelines and exports.', offsetX: px(56),
          style: { fontSize: px(yoclipSize('small', 19)), color: C.textMuted, fontFamily: yoclipFont(), lineHeight: 1.35 } },
        { type: 'container', height: px(20) },
        {
          type: 'row', offsetX: px(56), crossAxisAlignment: 'center',
          children: [
            {
              type: 'container', width: px(200), height: px(52), borderRadius: px(26),
              gradient: { colors: [C.primaryLight || yoclipColor('lavender', '#a78bfa'), C.primary || yoclipColor('primary', '#7c3aed')], begin: 'centerLeft', end: 'centerRight' },
              shadow: { color: yoclipColorA('primary', 0x80), blur: 12, offsetY: 6 },
              child: { type: 'text', text: T.ctaStart || 'Get started', alignment: 'center',
                style: { fontSize: px(yoclipSize('small', 19)), color: yoclipColor('white', '#ffffff'), fontFamily: yoclipFont(), fontWeight: 700 } },
            },
            { type: 'container', width: px(20) },
            {
              type: 'container', width: px(200), height: px(52), borderRadius: px(26),
              borderColor: yoclipColor('panelAlt', '#3a3a48'), borderWidth: 1,
              child: { type: 'text', text: T.ctaDemo || 'Watch demo', alignment: 'center',
                style: { fontSize: px(yoclipSize('small', 19)), color: C.text, fontFamily: yoclipFont(), fontWeight: 600 } },
            },
          ],
        },
      ],
    };

    var heroCard = {
      type: 'container',
      width: px(368), height: px(200), borderRadius: px(20), offsetY: px(18),
      color: C.surface, borderColor: yoclipColor('panel', '#2a2a36'), borderWidth: 1,
      shadow: { color: yoclipColorA('cyan', 0x80), blur: 20, offsetY: 10 },
      child: {
        type: 'stack', fit: 'expand',
        children: [
          { type: 'container', width: px(96), height: px(96), borderRadius: px(48),
            gradient: { colors: [C.primaryLight || yoclipColor('lavender', '#a78bfa'), C.primary || yoclipColor('primary', '#7c3aed')], begin: 'topLeft', end: 'bottomRight' },
            alignment: 'center', opacity: 0.9 },
          { type: 'text', text: T.livePreview || 'Live preview', alignment: 'bottomCenter', offsetY: px(-20),
            style: { fontSize: px(yoclipSize('label', 21)), color: C.textMuted, fontFamily: yoclipFont(), fontWeight: 600 } },
        ],
      },
    };

    var hero = {
      type: 'container', height: px(292),
      child: {
        type: 'row', crossAxisAlignment: 'center',
        children: [ heroText, { type: 'container', width: px(104) }, heroCard ],
      },
    };

    var features = {
      type: 'container', height: px(228),
      child: {
        type: 'row', crossAxisAlignment: 'start',
        children: [
          { type: 'container', width: px(12) },
          featureCard(T.featScenes || 'Scenes', T.featScenesDesc || 'Compose clips from reusable JS scenes.',
            'M 24 8 L 42 18 L 24 28 L 6 18 Z M 6 24 L 24 34 L 42 24 M 6 30 L 24 40 L 42 30', C.primaryLight),
          { type: 'container', width: px(12) },
          featureCard(T.featTimeline || 'Timeline', T.featTimelineDesc || 'Seek, scrub and anchor beats to each other.',
            'M 6 30 L 42 30 M 10 22 L 10 30 M 18 20 L 18 30 M 26 22 L 26 30 M 34 20 L 34 30', C.accent),
          { type: 'container', width: px(12) },
          featureCard(T.featExport || 'Export', T.featExportDesc || 'Render MP4, GIF or PNG from one timeline.',
            'M 24 8 L 24 34 M 14 19 L 24 8 L 34 19 M 10 38 L 10 44 L 38 44 L 38 38', C.primaryLight),
        ],
      },
    };

    var pageContent = {
      type: 'column', crossAxisAlignment: 'stretch',
      children: [ siteTopbar, hero, features ],
    };

    // The moving layer: translated + scaled for the Ken Burns flight.
    var zoomLayer = {
      type: 'container',
      width: px(1200), height: px(576),
      color: C.background,
      offsetX: tx, offsetY: ty, scale: s,
      child: pageContent,
    };

    // The visible "screenshot" window: rounded, clipped, with a glow. The
    // zoom layer moves inside it and is clipped to its bounds.
    var frame = {
      type: 'container',
      width: px(1200), height: px(576), borderRadius: px(20),
      color: yoclipColor('codeBg', '#0c0c12'), borderColor: yoclipColor('panel', '#2a2a36'), borderWidth: 1,
      shadow: { color: yoclipColorA('ink', 0x80), blur: 30, offsetY: 16 },
      clip: true,
      alignment: 'center',
      offsetY: portrait ? 160 : 150,
      child: zoomLayer,
    };

    return {
      type: 'stack', fit: 'expand', opacity: life,
      children: [
        { type: 'text', text: 'Zoom into any detail',
          style: { fontSize: yoclipSize('lg', 56), color: C.text, fontFamily: yoclipFont(), fontWeight: 700 },
          alignment: 'topCenter', offsetY: portrait ? 260 : 80, opacity: titleIn },
        frame,
      ],
    };
  },
};
