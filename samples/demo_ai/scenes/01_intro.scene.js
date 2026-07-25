scene = {
  id: '01_intro',
  duration: 300,
  from: 0,
  description: 'Dynamic gradient background with animated, stylized Yoclip logo.',
  timeline: { label: 'Intro', color: yoclipTheme.colors.primary, lane: 'video' },
  render: function(frame) {
    const progress = Math.min(frame / 60, 1);
    // Slight ease-out scale for the text
    const scale = 0.9 + (progress * 0.1); 
    const yOffset = (1 - progress) * 50;

    return {
      type: 'stack',
      children: [
        { type: 'container', color: yoclipTheme.colors.background },
        { type: 'container', style: { background: `radial-gradient(circle at ${50 + Math.sin(frame / 120) * 10}% 50%, #252538, #0a0a12)` } },
        { 
          type: 'stack',
          style: { alignment: 'center', opacity: progress, transform: `translateY(${yOffset}px)` },
          children: [
            { 
              type: 'text', 
              text: "Yoclip", 
              style: { 
                fontSize: 200, 
                color: yoclipTheme.colors.primary, 
                fontWeight: '900', 
                alignment: 'center',
                letterSpacing: -5
              } 
            },
            { 
              type: 'text', 
              text: "AI Video Editor", 
              style: { 
                fontSize: 40, 
                color: '#ffffff', 
                alignment: 'center', 
                margin: { top: 220 },
                textTransform: 'uppercase',
                letterSpacing: 10
              } 
            }
          ]
        }
      ]
    };
  }
};
