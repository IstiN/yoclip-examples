scene = {
  id: 'three_world',
  duration: LEVEL_DURATION,
  from: 0,
  pptx: false,
  timeline: {
    label: 'LEVEL UP · persistent Flutter GPU arena',
    color: '#16e7ff',
    lane: 'video',
  },
  render: function(frame) {
    var format = (typeof yoclipFormat !== 'undefined' && yoclipFormat) || {};
    var ctx = levelContext(frame);
    return {
      type: 'three_scene',
      source: 'three/world.js',
      frame: frame,
      fps: LEVEL_FPS,
      width: format.width || 1920,
      height: format.height || 1080,
      params: {
        time: ctx.time,
        section: ctx.section.id,
        sectionIndex: ctx.sectionIndex,
        sectionProgress: ctx.sectionProgress,
        beat: ctx.beat.index,
        beatPhase: ctx.beat.phase,
        beatPulse: ctx.beat.pulse,
        bar: ctx.beat.bar,
        rms: ctx.audio.rms,
        bass: ctx.audio.bass,
        mid: ctx.audio.mid,
        high: ctx.audio.high,
        onset: ctx.audio.onset,
        impact: ctx.impact,
        glitch: ctx.glitch,
        attack: ctx.attack,
        chomp: ctx.chomp,
        finisher: ctx.finisher,
        playerHealth: ctx.playerHealth,
        bossHealth: ctx.bossHealth,
        cameraShot: ctx.cameraShot,
      },
    };
  },
};
