scene = {
  id: '02_code',
  duration: 300,
  from: 300,
  description: 'Visualize a split-screen or code overlay showing that video structure is defined via code.',
  timeline: { label: 'Code', color: yoclipTheme.colors.secondary, lane: 'video' },
  render: function(frame) {
    return {
      type: 'stack',
      children: [
        { type: 'container', color: '#1e1e2e' },
        { type: 'text', text: "Video defined by code", style: { fontSize: 60, color: yoclipTheme.colors.text } }
      ]
    };
  }
};
