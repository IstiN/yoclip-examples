scene = {
  id: 'film',
  duration: LEVEL_DURATION,
  from: 0,
  pptx: false,
  timeline: {
    label: 'LEVEL UP · combat HUD + kinetic typography',
    color: '#ff304f',
    lane: 'video',
  },
  render: function(frame) {
    return renderLevelUp(frame);
  },
};
