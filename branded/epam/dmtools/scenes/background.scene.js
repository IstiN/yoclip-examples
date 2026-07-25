// BACKGROUND — full-length canvas fill. config.background stays Night for
// the dark cut; this layer repaints the canvas from the theme so the light
// variant gets its Snow background (c('night') is overridden per variant).
scene = {
  id: 'background',
  duration: 2180,
  from: 0,
  timeline: { label: 'Canvas', color: '#2a2a2a', lane: 'video' },
  render: function(frame) {
    return {
      type: 'absolute_fill',
      color: (typeof c !== 'undefined' && c('night')) ? c('night') : '#060606',
    };
  },
};
