
var scene = {
  id: '00_intro',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Programmable', color: '#a78bfa', lane: 'Content' },
  render: function(frame) { return renderIntro(frame); },
};
