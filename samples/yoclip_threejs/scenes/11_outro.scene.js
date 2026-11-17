
var scene = {
  id: '11_outro',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Render', color: '#34d399', lane: 'Content' },
  render: function(frame) { return renderOutro(frame); },
};
