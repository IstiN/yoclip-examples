
var scene = {
  id: '08_export',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Export', color: '#a78bfa', lane: 'Content' },
  render: function(frame) { return renderExport(frame); },
};
