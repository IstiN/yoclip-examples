scene = {
  id: '04_vision',
  duration: 300,
  from: 900,
  description: 'Final summary screen with the call-to-action message: "Your vision, instantly realized."',
  timeline: { label: 'Final', color: yoclipTheme.colors.primary, lane: 'video' },
  render: function(frame) {
    return {
      type: 'stack',
      children: [
        { type: 'container', color: '#1e1e2e' },
        { type: 'text', text: "Your vision, instantly realized.", style: { fontSize: 60, color: yoclipTheme.colors.text } }
      ]
    };
  }
};
