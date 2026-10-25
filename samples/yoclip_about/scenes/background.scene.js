// Background layer: a quiet, animated product-canvas under every scene.
//
// Radial aurora lights replace the old hard-edged circles. A hairline grid and
// soft vignette add depth while leaving the center calm enough for typography.

scene = {
  id: 'background',
  duration: 4170,
  from: 0,
  timeline: {
    label: yoclipT('background').timeline || 'Background',
    color: yoclipTheme.colors.background,
    lane: 'video',
  },
  render: function(frame) {
    var light = yoclipIsLight();
    var gridColor = yoclipColorA(light ? 'primary' : 'white', light ? 0x0b : 0x07,
      light ? '#7c3aed' : '#ffffff');

    function aurora(x, y, key, size, alpha, phase) {
      var color = yoclipColor(key, '#7c3aed');
      return {
        type: 'container',
        width: size,
        height: size,
        alignment: 'center',
        offsetX: x + float(frame, 90, 0.009, phase),
        offsetY: y + float(frame, 64, 0.012, phase + 1.4),
        opacity: light ? 0.82 : 1,
        gradient: {
          type: 'radial',
          center: 'center',
          radius: 0.72,
          colors: [
            yoclipColorA(key, alpha, color),
            yoclipColorA(key, Math.round(alpha * 0.55), color),
            yoclipColorA(key, Math.round(alpha * 0.16), color),
            yoclipColorA(key, 0x00, color),
          ],
          stops: [0.0, 0.34, 0.68, 1.0],
        },
      };
    }

    var children = [
      {
        type: 'container',
        gradient: {
          colors: [
            yoclipTheme.colors.backgroundDeep,
            yoclipTheme.colors.background,
            yoclipTheme.colors.backgroundSoft,
          ],
          stops: [0.0, 0.52, 1.0],
          begin: 'topLeft',
          end: 'bottomRight',
        },
      },
      aurora(-570, -260, 'primary', 1260, 0x46, 0.0),
      aurora(610, 70, 'accent', 1080, 0x28, 2.2),
      aurora(80, 520, 'primaryLight', 940, 0x24, 4.1),
    ];

    // A nearly subliminal layout grid makes the canvas feel engineered rather
    // than decorated. It drifts by only a few pixels over the whole film.
    var driftX = Math.sin(frame * 0.0018) * 5;
    var driftY = Math.cos(frame * 0.0015) * 4;
    var i;
    for (i = -6; i <= 6; i++) {
      children.push({
        type: 'container', width: 1, height: 1080,
        color: gridColor, alignment: 'center',
        offsetX: i * 160 + driftX,
      });
    }
    for (i = -3; i <= 3; i++) {
      children.push({
        type: 'container', width: 1920, height: 1,
        color: gridColor, alignment: 'center',
        offsetY: i * 160 + driftY,
      });
    }

    children.push({
      type: 'container',
      gradient: {
        type: 'radial', center: 'center', radius: 0.82,
        colors: [
          yoclipColorA('backgroundDeep', 0x00, '#07070d'),
          yoclipColorA('backgroundDeep', 0x00, '#07070d'),
          yoclipColorA('backgroundDeep', light ? 0x38 : 0x72, '#07070d'),
        ],
        stops: [0.0, 0.52, 1.0],
      },
    });

    return { type: 'stack', fit: 'expand', children: children };
  },
};
