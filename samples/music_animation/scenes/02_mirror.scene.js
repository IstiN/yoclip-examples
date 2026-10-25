// 02 · «Если прощу тебя сейчас, то не прощу себя потом» — разбитое зеркало.
// Размытый силуэт за стеклом, 7 осколков медленно расходятся, трещины светятся.
scene = {
  id: 's2',
  duration: 90,
  from: 39,
  timeline: { label: 'Зеркало', color: '#7dd3fc', lane: 'video' },
  render: function(f) {
    var spread = eo3(seg(f, 10, 85));
    var kids = [];

    // Силуэт за стеклом — едва узнаваемый, размытый.
    var shards = [
      [[500, 520], [330, 180], [520, 120]],
      [[500, 520], [520, 120], [700, 210]],
      [[500, 520], [700, 210], [760, 470]],
      [[500, 520], [760, 470], [640, 760]],
      [[500, 520], [640, 760], [420, 880]],
      [[500, 520], [420, 880], [240, 660]],
      [[500, 520], [240, 660], [330, 180]],
    ];
    var s = svgOpen(1000, 1000);
    s += '<defs><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.34"/>' +
      '<stop offset="55%" stop-color="#8b5cf6" stop-opacity="0.26"/>' +
      '<stop offset="100%" stop-color="#0b0e1c" stop-opacity="0.55"/></linearGradient></defs>';
    for (var i = 0; i < shards.length; i++) {
      var sh = shards[i];
      var cx = (sh[0][0] + sh[1][0] + sh[2][0]) / 3;
      var cy = (sh[0][1] + sh[1][1] + sh[2][1]) / 3;
      var dx = (cx - 500) / 380, dy = (cy - 520) / 380;
      var mx = dx * (10 + 60 * spread) + Math.sin(f * 0.03 + i * 2) * 5;
      var my = dy * (10 + 60 * spread) + Math.cos(f * 0.024 + i * 1.7) * 5;
      var rot = (rnd(i * 9.1) - 0.5) * 16 * spread;
      var points = sh.map(function(p) { return p[0] + ',' + p[1]; }).join(' ');
      s += '<g transform="translate(' + mx + ' ' + my + ') rotate(' + rot + ' ' + cx + ' ' + cy + ')">' +
        '<polygon points="' + points + '" fill="url(#glass)" stroke="#7dd3fc" stroke-opacity="0.45" stroke-width="1.6"/>' +
        '<polygon points="' + points + '" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="4"/></g>';
    }
    // Трещины проступают по мере строки.
    var crackOp = 0.15 + 0.75 * seg(f, 30, 85);
    var tips = [[330, 180], [700, 210], [760, 470], [420, 880], [240, 660], [520, 120]];
    for (var j = 0; j < tips.length; j++) {
      var midX = 500 + (tips[j][0] - 500) * 0.45 + (rnd(j * 4.4) - 0.5) * 60;
      var midY = 520 + (tips[j][1] - 520) * 0.45 + (rnd(j * 8.8) - 0.5) * 60;
      var d = 'M500 520 L' + midX + ' ' + midY + ' L' + tips[j][0] + ' ' + tips[j][1];
      s += '<path d="' + d + '" stroke="#ffffff" stroke-opacity="' + (crackOp * 0.16) + '" stroke-width="7" fill="none"/>';
      s += '<path d="' + d + '" stroke="#eaf6ff" stroke-opacity="' + crackOp + '" stroke-width="1.6" fill="none"/>';
    }
    s += '</svg>';
    kids.push(at(svg(s, 1000, 1000), 540, 1060));

    // Отражение проступает поверх осколков.
    kids.push(at({ type: 'image', source: 'external:silhouette', width: 620, height: 775,
      blur: 5, opacity: 0.92, scale: 1 + 0.05 * seg(f, 0, 190) }, 540, 1075));

    // Блик на стекле медленно проходит слева направо.
    var glintX = -300 + seg(f, 0, 190) * 1600;
    kids.push({ type: 'container', width: 130, height: 1300, rotation: 24,
      positioned: { left: glintX, top: 420 },
      gradient: { colors: ['#00000000', '#147dd3fc', '#00000000'] }, blur: 8 });

    var all = [sceneIn(f, { type: 'stack', fit: 'expand', children: kids })];
    all.push(lyric(f, [
      [ { t: 'Если' }, { t: 'прощу' }, { t: 'тебя' }, { t: 'сейчас,' } ],
      [ { t: 'то' }, { t: 'не' }, { t: 'прощу', c: C.ice, g: C.ice }, { t: 'себя' }, { t: 'потом' } ],
    ], { line: 1 }));
    all = all.concat(glitchBars(f, C.ice, 2));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
