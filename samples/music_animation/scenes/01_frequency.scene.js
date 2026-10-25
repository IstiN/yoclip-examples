// 01 · «Прости, но я немного на другом» — радио, которое не ловит эту волну.
// Шкала FM, дрейфующая частота, помехи, призрачный дубль сигнала.
scene = {
  id: 's1',
  duration: 39,
  from: 0,
  timeline: { label: 'На другом (FM)', color: '#8b5cf6', lane: 'video' },
  render: function(f) {
    var shift = glitchShift(f, 1);
    var kids = [];

    // Призрак сигнала — смещённый контур «другого измерения».
    kids.push(at(panel(920, 700, null, {
      color: '#00000000', borderColor: C.violet, borderWidth: 1.5,
      opacity: 0.35, blur: 2, shadow: { color: '#668b5cf6', blur: 60 },
    }), 540 + 18, 1060 + 10));

    // Частота: дрожит каждые 4 кадра, к концу строки распадается в помехи.
    var freq = (88 + rnd(Math.floor(f / 4) * 3.3) * 20).toFixed(1);
    var broken = f > 150 && rnd(Math.floor(f / 3)) > 0.5;
    var digits = broken ? '--.-' : freq;

    var wave = svgOpen(860, 200);
    wave += '<line x1="0" y1="100" x2="860" y2="100" stroke="#242c4a" stroke-width="1"/>';
    var pts = '', pts2 = '';
    for (var x = 0; x <= 860; x += 12) {
      var n = Math.sin(x * 0.021 + f * 0.22) * 34 + (rnd(x * 0.7 + f * 5.1) - 0.5) * 74;
      var n2 = Math.sin(x * 0.017 - f * 0.13) * 26;
      pts += x + ',' + (100 + n) + ' ';
      pts2 += x + ',' + (100 + n2) + ' ';
    }
    wave += '<polyline points="' + pts2 + '" fill="none" stroke="#22d3ee" stroke-opacity="0.35" stroke-width="2"/>';
    wave += '<polyline points="' + pts + '" fill="none" stroke="#8b5cf6" stroke-opacity="0.25" stroke-width="9"/>';
    wave += '<polyline points="' + pts + '" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>';
    wave += '</svg>';

    // Шкала FM с бегущей иглой.
    var ruler = svgOpen(860, 120);
    for (var i = 0; i <= 40; i++) {
      var tx = 20 + i * 20.5;
      var major = i % 5 === 0;
      ruler += '<line x1="' + tx + '" y1="30" x2="' + tx + '" y2="' + (major ? 70 : 52) +
        '" stroke="' + (major ? '#8b93b8' : '#3a4468') + '" stroke-width="' + (major ? 2.5 : 1.5) + '"/>';
    }
    var nx = 60 + (Math.sin(f * 0.045) * 0.5 + 0.5) * 700 + Math.sin(f * 0.9) * 8;
    ruler += '<polygon points="' + nx + ',6 ' + (nx - 12) + ',26 ' + (nx + 12) + ',26" fill="#ff2d55"/>';
    ruler += '<line x1="' + nx + '" y1="26" x2="' + nx + '" y2="92" stroke="#ff2d55" stroke-width="3"/>';
    ruler += '<line x1="' + nx + '" y1="26" x2="' + nx + '" y2="92" stroke="#ff2d55" stroke-opacity="0.25" stroke-width="12"/>';
    ruler += '</svg>';

    var card = panel(920, 700, {
      type: 'column', crossAxisAlignment: 'center', mainAxisAlignment: 'spaceEvenly',
      children: [
        { type: 'row', mainAxisAlignment: 'center', spacing: 18, children: [
          { type: 'circle', size: 12, fill: C.red, opacity: 0.4 + 0.6 * pulse(f) },
          cap('ПРИЁМНИК · FM 88–108 МГц', C.muted, 26),
        ] },
        { type: 'stack', fit: 'loose', children: [
          T(digits, 140, C.red, { offsetX: -6, opacity: 0.35 }),
          T(digits, 140, C.cyan, { offsetX: 6, opacity: 0.35 }),
          glowText(digits, 140, C.white, C.violet, 26),
        ] },
        svg(ruler, 860, 120),
        svg(wave, 860, 200),
        cap(f % 30 < 18 ? 'СИГНАЛ НЕ НАЙДЕН · ДРУГАЯ ВОЛНА' : 'СИГНАЛ НЕ НАЙДЕН', C.red, 26),
      ],
    }, { padding: 24 });
    kids.push(at(card, 540, 1060));

    var main = { type: 'stack', fit: 'expand', children: kids };
    main.offsetX = shift.x;
    var all = [sceneIn(f, main)];

    all.push(lyric(f, [
      [ { t: 'Прости,' }, { t: 'но' }, { t: 'я' }, { t: 'немного' } ],
      [ { t: 'на', c: C.violetL, g: C.violet, s: 84 }, { t: 'другом', c: C.violetL, g: C.violet, s: 84 } ],
    ], { line: 0, rgb: function(fr) { return glitchOn(fr, 1); } }));

    all = all.concat(glitchBars(f, C.violet, 1));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
