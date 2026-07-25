// 06 — TALENT: full-bleed photography, Ken Burns, crossfade + the scale stat.
scene = {
  id: 'talent',
  duration: 200,
  // This scene stays in the video but is not exported as a standalone slide.
  pptx: false,
  description:
    "Full-bleed brand photography with a slow Ken Burns push: an office team " +
    "shot crossfades into an event crowd at the midpoint. Dark scrim from " +
    "the left. Preheader 'AI/RUN TALENT', headline 'AI-native teams who " +
    "code. Engineers who consult.' — gradient on the second line — then a " +
    "count-up stat: 55,800+ consultants & engineers worldwide.",
  voicePrompts: {
    en: 'AI-native teams who code. Engineers who consult. Over fifty-five ' +
        'thousand consultants and engineers, meeting you where you are.',
  },
  timeline: { label: 'Talent', color: '#FBFAFA', lane: 'video' },
  render: function(frame) {
    var master = presence(frame, 14, 168, 18);

    // Ken Burns: slow push on each photo.
    var kb1 = lerp(1.0, 1.09, seg(frame, 0, 130));
    var kb2 = lerp(1.0, 1.09, seg(frame, 90, 200));
    var cross = eo3(seg(frame, 90, 125));

    var n55 = counter(frame, 95, 55, 0, 55800);
    var n55Text = ('' + n55).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return {
      type: 'stack', fit: 'expand', opacity: master,
      children: [
        // Photo 1 — office team.
        {
          type: 'image',
          source: 'external:team_office',
          fit: 'cover',
          width: 1920,
          height: 1080,
          scale: kb1,
          opacity: 1 - cross,
          alignment: 'center',
        },
        // Photo 2 — event crowd.
        {
          type: 'image',
          source: 'external:event',
          fit: 'cover',
          width: 1920,
          height: 1080,
          scale: kb2,
          opacity: cross,
          alignment: 'center',
        },

        // Scrim: dark gradient from the left for legibility.
        {
          type: 'container',
          width: 1920,
          height: 1080,
          alignment: 'center',
          gradient: {
            colors: ['#F2060606', '#99060606', '#00060606'],
            stops: [0.0, 0.45, 1.0],
            begin: 'centerLeft',
            end: 'centerRight',
          },
        },

        {
          type: 'column',
          alignment: 'topLeft',
          mainAxisAlignment: 'end',
          crossAxisAlignment: 'start',
          margin: { left: 64, bottom: 90 },
          children: [
            withEnter(preheader('AI/RUN™ TALENT', c('sea'), 26), enter(frame, 20, 22, 26)),
            { type: 'container', height: 20, alignment: 'topLeft' },
            withEnter(headline('AI-native teams who code.', 92, false), enter(frame, 30, 26, 44)),
            withEnter(
              {
                type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
                children: [
                headline('Engineers', 92, false, undefined, { style: { color: c('sea') } }),
                  headline(' who consult.', 92, false),
                ],
              },
              enter(frame, 44, 26, 44)
            ),
            { type: 'container', height: 30, alignment: 'topLeft' },
            withEnter(
              {
                type: 'row', alignment: 'topLeft', crossAxisAlignment: 'baseline',
                children: [
                  emphasis(n55Text + '+', 44, c('sea'), blh(44, 44)),
                  { type: 'container', width: 22, height: 1, alignment: 'topLeft' },
                  body('consultants & engineers worldwide', 26, c('snow'), blh(26, 44)),
                ],
              },
              enter(frame, 85, 24, 30)
            ),
          ],
        },
      ],
    };
  },
};
