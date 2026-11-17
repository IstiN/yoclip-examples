
var scene = {
  id: '03_realtime',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Real-time', color: '#a78bfa', lane: 'Content' },
  render: function(frame) { return renderRealtime(frame); },
};
