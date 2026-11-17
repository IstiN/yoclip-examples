scene = {
  id: 'film',
  duration: FILM_DURATION,
  from: 0,
  pptx: false,
  timeline: {
    label: 'WRITE THE LIGHT · narrative + kinetic type',
    color: '#a78bfa',
    lane: 'video',
  },
  render: function(frame) {
    return renderFilm(frame);
  },
};
