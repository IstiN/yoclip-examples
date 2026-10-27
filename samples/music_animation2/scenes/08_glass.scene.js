// Сцена 8 (1230–1380 · 3:55): разбитое стекло (экран телефона), сквозь трещины —
// размытый силуэт пары. Строка: «И засыпаешь рядом с тем, кого я бы убил.»
scene = {
  id: 'glass',
  duration: 150,
  from: 1230,
  description: 'Камера смотрит сквозь разбитый экран: тёмный размытый силуэт пары за стеклом, из точки удара справа расходятся трещины — три волны на бит, каждая со вспышкой и дрожью. Холодные тона, красный отсвет слева.',
  voicePrompts: { ru: 'И засыпаешь рядом с тем, кого я бы убил.' },
  timeline: { label: '08 · Разбитое стекло', color: '#ff2d55', lane: 'video' },
  render: function(f) {
    var kids = [];
    kids.push({ type: 'absolute_fill', color: '#04050b' });
    kids.push(aura(200, 900, 1000, C.red, 0.3));
    kids.push(aura(900, 500, 900, C.ice, 0.1));

    // размытая пара за стеклом
    var sil = { type: 'stack', children: [
      { type: 'circle', size: 220, fill: '#10131f',
        positioned: { left: Math.round(250 + Math.sin(f * 0.008) * 10), top: 760 } },
      { type: 'container', width: 400, height: 460, borderRadius: 140,
        color: '#0e1120', positioned: { left: 160, top: 930 } },
      { type: 'circle', size: 200, fill: '#121527',
        positioned: { left: Math.round(650 + Math.cos(f * 0.007) * 8), top: 780 } },
      { type: 'container', width: 380, height: 440, borderRadius: 130,
        color: '#0f1223', positioned: { left: 570, top: 940 } },
    ], blur: 20 };
    kids.push(sil);

    // стекло: лёгкий блик-градиент поверх
    kids.push({ type: 'container', width: W, height: H,
      gradient: { colors: [AA(C.ice, '0c'), '#00000000', AA(C.violet, '0a')],
        stops: [0, 0.5, 1], begin: 'topLeft', end: 'bottomRight' } });

    // трещины: три волны из точки удара (760, 640)
    var hx = 700, hy = 640;
    var waves = [20, 70, 125];
    var radii = [280, 420, 560];
    for (var w = 0; w < waves.length; w++) {
      var wf = waves[w];
      if (f < wf) continue;
      var prog = eo3(seg(f, wf, wf + 60));
      var reach = radii[w] * prog;
      var rays = w === 0 ? 7 : (w === 1 ? 6 : 5);
      for (var r = 0; r < rays; r++) {
        var ang = rnd(w * 31 + r * 7) * Math.PI * 2;
        var len = reach * (0.55 + rnd(w * 13 + r * 3) * 0.45);
        var x2 = hx + Math.cos(ang) * len;
        var y2 = hy + Math.sin(ang) * len * 0.9;
        // ломаная трещина
        var mx1 = hx + Math.cos(ang + 0.18) * len * 0.45;
        var my1 = hy + Math.sin(ang + 0.18) * len * 0.4;
        var d = 'M ' + hx + ' ' + hy + ' L ' + mx1.toFixed(0) + ' ' + my1.toFixed(0) +
          ' L ' + x2.toFixed(0) + ' ' + y2.toFixed(0);
        kids.push({ type: 'path', path: d, width: 1080, height: 1920,
          color: AA('#dceaff', 'cc'), strokeWidth: w === 0 ? 3 : 2,
          progress: prog, opacity: 0.9 });
        // тонкий хвост
        var x3 = hx + Math.cos(ang - 0.12) * len * 1.25;
        var y3 = hy + Math.sin(ang - 0.12) * len * 1.1;
        kids.push({ type: 'path', path: 'M ' + x2.toFixed(0) + ' ' + y2.toFixed(0) +
          ' L ' + x3.toFixed(0) + ' ' + y3.toFixed(0), width: 1080, height: 1920,
          color: AA('#dceaff', '77'), strokeWidth: 1.4, progress: prog, opacity: 0.7 });
      }
      // соединительные паутинки
      if (w >= 1) {
        for (var web = 0; web < 5; web++) {
          var a1 = rnd(w * 7 + web * 11) * Math.PI * 2, a2 = a1 + 0.5 + rnd(web) * 0.4;
          var rr = reach * (0.4 + rnd(w * 3 + web) * 0.4);
          kids.push({ type: 'path',
            path: 'M ' + (hx + Math.cos(a1) * rr).toFixed(0) + ' ' + (hy + Math.sin(a1) * rr * 0.9).toFixed(0) +
              ' Q ' + (hx + Math.cos((a1 + a2) / 2) * rr * 1.12).toFixed(0) + ' ' + (hy + Math.sin((a1 + a2) / 2) * rr).toFixed(0) +
              ' ' + (hx + Math.cos(a2) * rr).toFixed(0) + ' ' + (hy + Math.sin(a2) * rr * 0.9).toFixed(0),
            width: 1080, height: 1920, color: AA('#dceaff', '55'), strokeWidth: 1.2,
            progress: eo3(seg(f, wf + 30, wf + 80)), opacity: 0.8 });
        }
      }
      // вспышка при появлении волны
      var fl = flash(f, wf, 10, '#cfe4ff', 0.16);
      if (fl) kids.push(fl);
      var shk = shake(f, 6);
      if (f > wf && f < wf + 26) { shk.x *= 3; shk.y *= 3; }
      kids.push({ type: 'container', width: 0, height: 0, offsetX: shk.x, offsetY: shk.y });
    }
    // центр удара: маленькая паутинка
    if (f > 20) {
      kids.push({ type: 'path',
        path: 'M ' + hx + ' ' + (hy - 34) + ' L ' + (hx + 30) + ' ' + (hy - 10) + ' L ' + (hx + 22) + ' ' + (hy + 26) +
          ' L ' + (hx - 18) + ' ' + (hy + 30) + ' L ' + (hx - 32) + ' ' + (hy - 6) + ' Z',
        width: 1080, height: 1920, color: AA('#eaf3ff', 'dd'), strokeWidth: 2.4,
        progress: eo3(seg(f, 20, 60)), opacity: 0.9 });
    }

    // строка трека — караоке по транскрипту («И засыпаешь рядом с тем...» 235–240 c)
    kids.push(sung(f, 1230));

    var sh = shake(f, 3);
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y };
    var out = flash(f, 134, 16, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 20));
  },
};
