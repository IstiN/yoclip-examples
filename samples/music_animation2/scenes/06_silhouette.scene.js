// Сцена 6 (630–750 · 3:35): размытые силуэты двоих, разделённые светящимся экраном
// телефона. Багровый неон нарастает слева. Строка: «И засыпаешь рядом с тем,
// кого я бы убил,»
scene = {
  id: 'silhouette',
  duration: 120,
  from: 630,
  description: 'Тёмная спальня: два размытых силуэта под одеялом, между ними — вертикальная полоса света телефона. Слева медленно разгорается багровый неон. На середине сцены — красная вспышка на бит, камера наезжает, свет телефона теплеет к красному.',
  voicePrompts: { ru: 'И засыпаешь рядом с тем, кого я бы убил. Если только бы встретил — и если хватило бы сил.' },
  timeline: { label: '06 · Силуэты', color: '#ff2d55', lane: 'video' },
  render: function(f) {
    var kids = [];
    var mid = 60;
    var zoom = 1.0 + 0.06 * seg(f, 0, mid) + 0.12 * seg(f, mid, 120);
    var redRamp = 0.25 + 0.55 * seg(f, 0, 120);

    kids.push({ type: 'absolute_fill', color: '#04040a' });
    // багровый неон слева, нарастает всю сцену
    kids.push({ type: 'container', width: 700, height: H * 1.2,
      positioned: { left: -420, top: -100 },
      gradient: { type: 'radial', colors: [AA(C.red, '5a'), AA(C.redDeep, '22'), '#00000000'],
        stops: [0, 0.5, 1], radius: 0.55 },
      opacity: redRamp + 0.12 * pulse(f, 1), blur: 4 });
    // холодный остаток справа
    kids.push(aura(1000, 500, 900, C.ice, 0.12));

    // кровать: мягкие тёмные формы
    kids.push({ type: 'container', width: 1200, height: 900, borderRadius: 120,
      positioned: { left: -60, top: 900 }, color: '#0a0c18', blur: 10 });

    // силуэты двоих (абстрактно, без лиц): голова + плечо, сильный blur
    var shiftA = Math.sin(f * 0.008) * 12;
    var shiftB = Math.cos(f * 0.007) * 10;
    var sil = [];
    sil.push({ type: 'circle', size: 210, fill: '#10131f',
      positioned: { left: Math.round(205 + shiftA), top: 780 } });
    sil.push({ type: 'container', width: 380, height: 420, borderRadius: 130,
      color: '#0e1120', positioned: { left: Math.round(120 + shiftA), top: 940 } });
    sil.push({ type: 'circle', size: 190, fill: '#121527',
      positioned: { left: Math.round(700 + shiftB), top: 800 } });
    sil.push({ type: 'container', width: 360, height: 400, borderRadius: 120,
      color: '#0f1223', positioned: { left: Math.round(620 + shiftB), top: 950 } });
    kids.push({ type: 'stack', children: sil, blur: 22 });

    // экран телефона между ними: вертикальная полоса света
    var phGlow = (f < mid ? C.ice : lerpColor(C.ice, C.red, seg(f, mid, mid + 60)));
    kids.push(at({ type: 'container', width: 92, height: 420, borderRadius: 18,
      color: '#0b0e1a', borderColor: AA('#ffffff', '40'), borderWidth: 2,
      shadow: { color: AA(phGlow, '66'), blur: 60 } }, 540 + shiftA * 0.4, 950));
    kids.push(at({ type: 'container', width: 74, height: 380, borderRadius: 12,
      gradient: { colors: [AA(phGlow, 'e6'), AA(phGlow, '55')], stops: [0, 1] },
      opacity: 0.75 + 0.2 * pulse(f, 1), blur: 6 }, 540 + shiftA * 0.4, 950));
    // световой конус от экрана вверх
    kids.push(at({ type: 'container', width: 340, height: 620,
      positioned: { left: 370, top: 380 },
      gradient: { type: 'radial', colors: [AA(phGlow, '3c'), '#00000000'],
        stops: [0, 1], radius: 0.5 }, opacity: 0.8 }, 540, 700));

    // красная вспышка на середине (бит)
    var fl = flash(f, mid, 14, AA(C.red, 'ff'), 0.5);
    if (fl) kids.push(fl);

    // строка трека — караоке по транскрипту («И засыпаешь рядом с тем...» 215–219 c)
    kids.push(sung(f, 630));

    var sh = shake(f, 2 + 2 * seg(f, mid, mid + 30));
    var all = { type: 'stack', fit: 'expand', children: kids, offsetX: sh.x, offsetY: sh.y,
      scale: zoom };
    var out = flash(f, 106, 14, '#000000', 0.55);
    if (out) all.children.push(out);
    return finish(sceneIn(f, all, 26));
  },
};

function lerpColor(a, b, t) {
  function px(h, i) { return parseInt(h.substring(1 + i * 2, 3 + i * 2), 16); }
  var r = Math.round(lerp(px(a, 0), px(b, 0), t));
  var g = Math.round(lerp(px(a, 1), px(b, 1), t));
  var bl = Math.round(lerp(px(a, 2), px(b, 2), t));
  function hx(v) { var s = v.toString(16); return s.length < 2 ? '0' + s : s; }
  return '#' + hx(r) + hx(g) + hx(bl);
}
