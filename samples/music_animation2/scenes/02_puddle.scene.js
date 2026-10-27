// Сцена 2 (60–120 · 3:16): тёмная лужа на асфальте ночью. В воде — размытые неоновые
// отражения города, капли дождя создают рябь. Строка: «Мои терзания — всего лишь
// буря в грязной луже.»
scene = {
  id: 'puddle',
  duration: 60,
  from: 60,
  description: 'Крупный план тёмной лужи на асфальте: вертикальные неоновые отражения (синий, фиолетовый, красный) плывут в воде, на бит расходятся круги ряби от капель, моросит дождь. Камера медленно наезжает.',
  voicePrompts: { ru: 'Мои терзания — всего лишь буря в грязной луже.' },
  timeline: { label: '02 · Лужа', color: '#3b82f6', lane: 'video' },
  render: function(f) {
    var kids = [];
    var zoom = 1.02 + 0.10 * seg(f, 0, 60);

    // асфальт: глубокий тёмный фон + крапинки
    kids.push({ type: 'absolute_fill', color: '#04050b' });
    for (var i = 0; i < 130; i++) {
      var sx = rnd(i * 3.3) * W, sy = rnd(i * 7.1) * H;
      kids.push({ type: 'container', width: 2 + rnd(i) * 3, height: 2 + rnd(i * 2) * 3,
        borderRadius: 2, color: i % 5 ? '#161a2c' : '#232a45',
        opacity: 0.25 + rnd(i * 5) * 0.4,
        positioned: { left: Math.round(sx), top: Math.round(sy) } });
    }
    // мокрые блики-протяжки на асфальте
    for (var s = 0; s < 5; s++) {
      kids.push({ type: 'container', width: 5 + rnd(s * 11) * 8, height: 200 + rnd(s) * 420,
        rotation: 3 + rnd(s * 2) * 5,
        gradient: { colors: ['#00000000', AA(C.ice, '16'), '#00000000'], stops: [0, 0.5, 1] },
        positioned: { left: Math.round(rnd(s * 17) * W), top: Math.round(rnd(s * 23) * 500) },
        blur: 6 });
    }

    // лужа
    var pw = 980, ph = 560, py = 980;
    var pond = { type: 'container', width: pw, height: ph, borderRadius: 280,
      clip: true, borderColor: AA(C.ice, '22'), borderWidth: 2,
      child: { type: 'stack', children: [
        { type: 'container', width: pw, height: ph,
          gradient: { type: 'radial', colors: ['#0c1631', '#070c1d', '#04060e'],
            stops: [0, 0.6, 1], radius: 0.7 } },
      ] } };
    // неоновые отражения внутри лужи (вертикальные смазанные полосы)
    var neons = [
      { x: 0.22, w: 26, c: C.ice, seed: 4 },
      { x: 0.38, w: 14, c: C.violet, seed: 9 },
      { x: 0.55, w: 34, c: C.blue, seed: 2 },
      { x: 0.72, w: 18, c: C.red, seed: 6 },
      { x: 0.86, w: 24, c: C.violet, seed: 12 },
    ];
    var pondKids = [];
    for (var n = 0; n < neons.length; n++) {
      var nn = neons[n];
      var sway = Math.sin(f * 0.02 + n * 2.1) * 14;
      var glow = 0.4 + 0.25 * pulse(f, 1) * (n % 2 ? 1 : 0.4);
      pondKids.push({ type: 'container', width: nn.w, height: ph * 0.86,
        borderRadius: nn.w / 2,
        gradient: { colors: ['#00000000', AA(nn.c, 'aa'), '#00000000'], stops: [0, 0.5, 1] },
        opacity: glow, blur: 10,
        positioned: { left: Math.round(nn.x * pw - nn.w / 2 + sway), top: Math.round(ph * 0.05) } });
      pondKids.push({ type: 'container', width: nn.w * 0.4, height: ph * 0.7,
        borderRadius: nn.w / 4, color: AA(nn.c, 'cc'), opacity: 0.35, blur: 3,
        positioned: { left: Math.round(nn.x * pw - nn.w * 0.2 + sway * 0.6), top: Math.round(ph * 0.12) } });
    }
    // рябь от капель: круги, расходящиеся на бит
    var bi = beatIdx(f);
    for (var k = 0; k < 4; k++) {
      var age = f - (bi - k) * BEAT - (rnd(bi - k) * 8);
      if (age < 0 || age > 34) continue;
      var rp = eo3(seg(age, 0, 34));
      var rx = 140 + rnd(bi * 3.7 + k) * (pw - 280);
      var ry = 120 + rnd(bi * 9.1 + k * 5) * (ph - 240);
      pondKids.push({ type: 'container', width: 40, height: 16, borderRadius: 999,
        borderColor: AA(C.ice, '88'), borderWidth: 2, opacity: (1 - rp) * 0.8,
        scale: 0.4 + rp * 2.4,
        positioned: { left: Math.round(rx - 20), top: Math.round(ry - 8) } });
    }
    pond.child.children.push({ type: 'stack', children: pondKids });
    var pondWrap = at(pond, 540 + Math.sin(f * 0.008) * 10, py);
    pondWrap.scale = zoom;
    kids.push(pondWrap);

    // морось: падающие штрихи дождя
    for (var d = 0; d < 46; d++) {
      var dx = rnd(d * 13.7) * W;
      var dy2 = (rnd(d * 5.3) * H + f * (7 + rnd(d) * 6)) % (H + 60) - 30;
      kids.push({ type: 'container', width: 2, height: 22 + rnd(d * 3) * 14,
        rotation: 8, color: AA(C.ice, '66'), opacity: 0.12 + rnd(d * 7) * 0.14,
        positioned: { left: Math.round(dx), top: Math.round(H - dy2) } });
    }

    // строка трека — караоке по транскрипту («Мои терзания...» 196–198 c)
    kids.push(sung(f, 60));

    var sh = shake(f, 2);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 48, 12, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 24));
  },
};
