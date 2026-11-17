scene = {
  id: 'three_world',
  duration: FILM_DURATION,
  from: 0,
  pptx: false,
  timeline: {
    label: 'WRITE THE LIGHT · Flutter GPU',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var format = (typeof yoclipFormat !== 'undefined' && yoclipFormat) || {};
    var ctx = filmContext(frame);
    return {
      type: 'three_scene',
      source: 'three/world.js',
      frame: frame,
      fps: FILM_FPS,
      width: format.width || 7680,
      height: format.height || 4320,
      params: {
        act: ctx.actIndex,
        actProgress: ctx.progress,
        beat: ctx.beat.index,
        beatPulse: ctx.beat.pulse,
        beatPhase: ctx.beat.phase,
        bar: ctx.beat.bar,
        lyricStyle: ctx.lyric ? ctx.lyric.style : '',
        lyricText: ctx.lyric ? ctx.lyric.text : '',
        wordIndex: ctx.word ? ctx.word.wordIndex : -1,
        wordProgress: ctx.wordProgress,
        focusPush: focusPushForContext(ctx),
        variant: ctx.actIndex === 7 ? 'showcase' : (
          ctx.lyric && ctx.lyric.text.indexOf('WORLD IN FLIGHT') >= 0 ? 'flight' : (
            ctx.lyric && (ctx.lyric.text.indexOf('NATIVE GPU') >= 0 || ctx.lyric.text.indexOf('SPIN THE CAMERA') >= 0) ? 'flight' : (
              ctx.lyric && ctx.lyric.text.indexOf('EVERY SINGLE PIXEL') >= 0 ? 'dj' : (
                ctx.lyric && ctx.lyric.text.indexOf('ROLL CAMERA') >= 0 ? 'city' : 'auto')))),
      },
    };
  },
};
