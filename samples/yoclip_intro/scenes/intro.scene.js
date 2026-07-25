// Yoclip V2 intro scene.
// Replicates the original Dart intro using a JS scene graph.

scene = {
  id: 'intro',
  duration: 90,
  from: 0,
  timeline: {
    label: 'Intro',
    color: '#7c3aed',
    lane: 'video',
  },
  render: function(frame) {
    var opacity = easeInOut(frame, 0, 1, 30);

    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          id: 'intro_video',
          type: 'video',
          source: 'external:laptop_open',
          startFrame: 15,
          speed: 2.0,
          fit: 'cover',
        },
        {
          id: 'intro_logo',
          type: 'image',
          source: 'external:logo',
          width: 240,
          height: 135,
          alignment: 'topRight',
          padding: 32,
        },
        {
          id: 'intro_text',
          type: 'text',
          text: 'Hello, Yoclip!',
          style: {
            fontSize: 96,
            color: '#ffffff',
            fontFamily: 'Geneva',
          },
          alignment: 'center',
          opacity: opacity,
        },
      ],
    };
  },
};
