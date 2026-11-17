// Persistent upstream THREE r186 world. The module owns no wall-clock state:
// every transform is a pure function of the composition frame, so the same
// file works in Studio, arbitrary-frame screenshots and the MP4 exporter.

scene = {
  id: 'three_world',
  duration: 3600,
  from: 0,
  pptx: false,
  timeline: {
    label: 'THREE r186 · Flutter GPU',
    color: '#22d3ee',
    lane: 'video',
  },
  render: function(frame) {
    var format = (typeof yoclipFormat !== 'undefined' && yoclipFormat) || {};
    return {
      type: 'three_scene',
      source: 'three/world.js',
      frame: frame,
      fps: 30,
      width: format.width || 1920,
      height: format.height || 1080,
      params: {
        shot: Math.floor(frame / 300),
        shotFrame: frame % 300,
      },
    };
  },
};
