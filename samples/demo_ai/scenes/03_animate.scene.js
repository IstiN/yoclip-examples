scene = {
  id: '03_animate',
  duration: 300,
  from: 600,
  description: 'Rapid-fire transitions or motion graphics demonstrating smooth easing and movement.',
  timeline: { label: 'Animate', color: yoclipTheme.colors.accent, lane: 'video' },
  render: function(frame) {
    return {
      type: 'stack',
      children: [
        { type: 'container', color: '#1e1e2e' },
        { type: 'text', text: "Smooth Animations", style: { fontSize: 60, color: yoclipTheme.colors.text } }
      ]
    };
  }
};
