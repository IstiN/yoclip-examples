// 08 · «Мой любимый рэпер пиздит мои наработки (упс)» — ноутбук с DAW.
// Две одинаковые волны: мой demo 2019 и его «новый» трек. Штамп COPY, 100% match.
scene = {
  id: 's8',
  duration: 91,
  from: 597,
  timeline: { label: 'COPY (DAW)', color: '#ff2d55', lane: 'video' },
  render: function(f) {
    var kids = [];
    var copied = f > 42;

    function clipRow(label, color, seed) {
      var clips = [];
      for (var i = 0; i < 7; i++) {
        clips.push({ type: 'rect', width: 60 + rnd(seed + i) * 40, height: 44,
          fill: color, radius: 8, opacity: 0.35 + rnd(seed * 2 + i) * 0.4 });
      }
      return { type: 'column', crossAxisAlignment: 'start', spacing: 8, children: [
        cap(label, C.dim, 20),
        { type: 'row', spacing: 10, children: clips },
      ] };
    }
    function waveLane(label, color, hot) {
      return { type: 'container', padding: 16, borderRadius: 16,
        borderColor: hot ? C.red : C.stroke, borderWidth: hot ? 2.5 : 1,
        color: hot ? '#0cff2d55' : '#00000000',
        child: { type: 'column', crossAxisAlignment: 'start', spacing: 10, children: [
          { type: 'row', spacing: 20, children: [
            cap(label, color, 22),
            hot ? cap('· СОВПАДЕНИЕ 100%', C.red, 22) : cap('· ИСХОДНИК', C.dim, 22),
          ] },
          // Один и тот же seed — волны идентичны до бара.
          waveRow(52, 8, 74, function(i) { return 0.15 + rnd(i * 1.37) * 0.85; }, color, 5),
        ] } };
    }

    var screen = panel(960, 900, {
      type: 'column', crossAxisAlignment: 'center', mainAxisAlignment: 'spaceEvenly',
      children: [
        { type: 'row', mainAxisAlignment: 'spaceBetween', width: 860, children: [
          { type: 'row', spacing: 12, children: [
            { type: 'circle', size: 16, fill: C.red }, { type: 'circle', size: 16, fill: C.amber },
            { type: 'circle', size: 16, fill: C.green },
          ] },
          cap('его_новый_хит_FINAL(2).flp', C.muted, 24),
          cap(f % 20 < 12 ? '● REC' : '  REC', C.red, 24),
        ] },
        clipRow('DRUMS', '#3a4468', 3),
        clipRow('BASS', '#8b5cf6', 7),
        waveLane('МОЙ DEMO · 2019', C.ice, false),
        waveLane('ЕГО «НОВЫЙ» ТРЕК · 2025', copied ? C.red : C.muted, copied),
      ],
    }, { padding: 24, borderRadius: 26 });
    kids.push(at(screen, 540, 1030));

    // Нижняя грань ноутбука.
    kids.push(at({ type: 'container', width: 1080, height: 26, borderRadius: 12,
      gradient: { colors: ['#232a45', '#0b0e1c'] } }, 540, 1500));

    // Штамп COPY врезается на «пиздит».
    if (f > 48) {
      var slam = eo3(seg(f, 48, 64));
      var stamp = { type: 'container', width: 600, height: 230, alignment: 'center',
        borderColor: C.red, borderWidth: 9, borderRadius: 18, color: '#18ff2d55',
        rotation: -17, scale: 2.8 - 1.8 * slam, opacity: seg(f, 48, 53),
        blur: (1 - slam) * 6,
        shadow: { color: '#99ff2d55', blur: 60 },
        child: glowText('COPY', 150, C.red, C.red, 26) };
      kids.push(at(stamp, 540, 1000));
    }
    if (f > 74) {
      kids.push(at({ type: 'container', width: 220, height: 110, alignment: 'center',
        child: glowText('(упс)', 64, C.violetL, C.violet, 22) }, 830, 1300));
    }
    kids.push(fullW(cap('СКРИНШОТ ДЛЯ ЮРИСТА · СОХРАНЕНО', C.dim, 24), 1600));

    var main = { type: 'stack', fit: 'expand', children: kids };
    var g = glitchShift(f, 8);
    main.offsetX = g.x;
    var all = [sceneIn(f, main)];
    all.push(lyric(f, [
      [ { t: 'Мой' }, { t: 'любимый' }, { t: 'рэпер' } ],
      [ { t: 'пиздит', c: C.red, g: C.red, late: 18 }, { t: 'мои' }, { t: 'наработки' } ],
    ], { line: 7, size: 64, rgb: function(fr) { return fr > 48 && fr < 66; } }));
    pushIf(all, flash(f, 48, 8, C.red, 0.30));
    all = all.concat(glitchBars(f, C.red, 8));
    return finish({ type: 'stack', fit: 'expand', children: all });
  },
};
