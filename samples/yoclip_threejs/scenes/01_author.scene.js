
var scene = {
  id: '01_author',
  duration: 300,
  layer: 'content',
  timeline: { label: 'Author', color: '#22d3ee', lane: 'Content' },
  render: function(frame) { return renderAuthor(frame); },
};
