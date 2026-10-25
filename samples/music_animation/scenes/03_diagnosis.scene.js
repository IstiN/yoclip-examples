// 03 · «Диагноз — ненормальный, психолог может врать» — тёмное медицинское
// приложение: иконка мозга с ERROR, кардиограмма, красная тревога.
scene = {
  id: 's3',
  duration: 95,
  from: 129,
  timeline: { label: 'Диагноз', color: '#ff2d55', lane: 'video' },
  render: function(f) {
    var kids = [];
    var alarm = 0.05 + 0.09 * pulse(f);

    // Иконка: «мозг»-облако с извилинами и трещиной + плашка ERROR.
    var brain = svgOpen(220, 220);
    brain += '<rect x="6" y="6" width="208" height="208" rx="52" fill="#140a14" stroke="#ff2d55" stroke-opacity="0.6" stroke-width="2.5"/>';
    brain += '<path d="M52 142 Q34 108 62 96 Q58 62 96 70 Q112 40 136 66 Q172 58 168 96 Q194 116 164 136 Q140 166 104 154 Q70 168 52 142 Z" ' +
      'fill="#ff2d5518" stroke="#ff8fa3" stroke-width="3.5" stroke-linejoin="round"/>';
    brain += '<path d="M74 104 Q92 86 108 104 T146 102 M70 128 Q92 116 112 130 M118 78 Q128 92 146 86" fill="none" stroke="#ff8fa3" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>';
    brain += '<path d="M112 46 L100 96 L122 92 L106 150" fill="none" stroke="#ff2d55" stroke-width="4" stroke-linejoin="round"/>';
    brain += '<path d="M112 46 L100 96 L122 92 L106 150" fill="none" stroke="#ff2d55" stroke-opacity="0.25" stroke-width="14" stroke-linejoin="round"/>';
    brain += '</svg>';

    // Кардиограмма: спайк на каждом бите, разворачивается по строке.
    var ecg = svgOpen(840, 150);
    var pts = '';
    for (var x = 0; x <= 840; x += 6) {
      var ph = (x % 105) / 105; // 105px ~ один бит
      var y = 78;
      if (ph > 0.40 && ph < 0.46) y = 78 - (ph - 0.40) * 1400;
      else if (ph >= 0.46 && ph < 0.52) y = -6 + (ph - 0.46) * 2100;
      else if (ph >= 0.52 && ph < 0.60) y = 120 - (ph - 0.52) * 525;
      else if (ph >= 0.72 && ph < 0.80) y = 78 - Math.sin((ph - 0.72) / 0.08 * Math.PI) * 18;
      y += Math.sin(f * 0.4 + x) * 1.5;
      pts += x + ',' + y + ' ';
    }
    ecg += '<polyline points="' + pts + '" fill="none" stroke="#ff2d55" stroke-opacity="0.25" stroke-width="9"/>';
    ecg += '<polyline points="' + pts + '" fill="none" stroke="#ff5c7a" stroke-width="2.6"/>';
    // Бегущий фронт записи: яркий сегмент + точка на кривой.
    var headX = 40 + seg(f, 0, 92) * 780;
    var segPts = '';
    var headY = 78;
    for (var hx = Math.max(0, headX - 130); hx <= headX; hx += 6) {
      var hp = (hx % 105) / 105;
      var hy = 78;
      if (hp > 0.40 && hp < 0.46) hy = 78 - (hp - 0.40) * 1400;
      else if (hp >= 0.46 && hp < 0.52) hy = -6 + (hp - 0.46) * 2100;
      else if (hp >= 0.52 && hp < 0.60) hy = 120 - (hp - 0.52) * 525;
      else if (hp >= 0.72 && hp < 0.80) hy = 78 - Math.sin((hp - 0.72) / 0.08 * Math.PI) * 18;
      hy += Math.sin(f * 0.4 + hx) * 1.5;
      segPts += hx + ',' + hy + ' ';
      headY = hy;
    }
    ecg += '<polyline points="' + segPts + '" fill="none" stroke="#ffd6de" stroke-width="4"/>';
    ecg += '<circle cx="' + headX + '" cy="' + headY + '" r="7" fill="#ffffff"/>';
    ecg += '</svg>';

    function meter(label, value, target, color, delay) {
      var p = eo3(seg(f, 10 + delay, 62 + delay)) * target;
      return { type: 'column', crossAxisAlignment: 'start', spacing: 10, children: [
        { type: 'row', mainAxisAlignment: 'spaceBetween', width: 800, children: [
          cap(label, C.muted, 24), T(value, 28, color, { style: { fontFamily: F.bold } }),
        ] },
        { type: 'row', children: [
          { type: 'rect', width: Math.max(8, 800 * p), height: 10, fill: color, radius: 5 },
          { type: 'rect', width: Math.max(0, 800 - Math.max(8, 800 * p)), height: 10, fill: '#1c2340', radius: 5 },
        ] },
      ] };
    }

    var card = panel(920, 1120, {
      type: 'column', crossAxisAlignment: 'center', mainAxisAlignment: 'spaceEvenly',
      children: [
        { type: 'row', mainAxisAlignment: 'spaceBetween', width: 800, children: [
          cap('PSY.CHECK · ДИАГНОСТИКА', C.muted, 26),
          cap(f % 24 < 14 ? '● LIVE' : '  LIVE', C.red, 26),
        ] },
        { type: 'row', mainAxisAlignment: 'center', spacing: 40, children: [
          svg(brain, 220, 220),
          { type: 'column', crossAxisAlignment: 'start', spacing: 12, children: [
            cap('ПАЦИЕНТ: АРТИСТ', C.muted, 24),
            cap('ДИАГНОЗ', C.muted, 24),
            glowText('НЕНОРМАЛЬНЫЙ', 46, C.red, C.red, 24),
            { type: 'container', padding: { left: 18, right: 18, top: 8, bottom: 8 },
              borderColor: C.red, borderWidth: 2.5, borderRadius: 10,
              opacity: 0.6 + 0.4 * pulse(f),
              child: cap('ERROR 404 · НОРМА НЕ НАЙДЕНА', C.red, 22) },
          ] },
        ] },
        svg(ecg, 840, 150),
        meter('ТРЕВОЖНОСТЬ', '98%', 0.98, C.red, 0),
        meter('СОН', '4%', 0.04, C.ice, 12),
        meter('ЧСВ', '110%', 1.0, C.violet, 24),
        cap('ЗАКЛЮЧЕНИЕ МОЖЕТ ВРАТЬ', C.dim, 24),
      ],
    }, { padding: 30, borderColor: '#4a1e30' });
    kids.push(at(card, 540, 1070));

    // Тревожная рамка + красный отсвет.
    kids.push({ type: 'absolute_fill', color: C.red, opacity: alarm });
    kids.push({ type: 'container', width: W - 48, height: H - 200, borderRadius: 40,
      positioned: { left: 24, top: 100 }, borderColor: C.red, borderWidth: 2,
      opacity: 0.12 + 0.25 * pulse(f) });

    // Красная сканирующая полоса едет вниз.
    var sy = 200 + (f * 14) % 1500;
    kids.push({ type: 'container', width: W, height: 90, positioned: { left: 0, top: sy },
      gradient: { colors: ['#00000000', '#26ff2d55', '#00000000'] } });

    var all = [sceneIn(f, { type: 'stack', fit: 'expand', children: kids })];
    all.push(lyric(f, [
      [ { t: 'Диагноз' }, { t: '—' }, { t: 'ненормальный,', c: C.red, g: C.red } ],
      [ { t: 'психолог' }, { t: 'может' }, { t: 'врать' } ],
    ], { line: 2, size: 62 }));
    all = all.concat(glitchBars(f, C.red, 3));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
