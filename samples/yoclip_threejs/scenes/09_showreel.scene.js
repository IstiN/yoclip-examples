
var scene = {
  id: '09_showreel',
  duration: 300,
  layer: 'content',
  timeline: { label: 'GPU showreel', color: '#22d3ee', lane: 'Content' },
  render: function(frame) { return renderShowreel(frame); },
};
