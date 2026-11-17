
var scene = {
  id: '04_direct',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Direct', color: '#22d3ee', lane: 'Content' },
  render: function(frame) { return renderDirect(frame); },
};
