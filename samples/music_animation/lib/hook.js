// hook.js — генератор сцен хука (строки 9–16): одна фабрика, четыре мотива.
// Куплет (1–8) расписан вручную; здесь мотив + кинетика по LINES[cfg.line].

function hookScene(cfg) {
  return {
    id: cfg.id,
    duration: cfg.duration,
    from: cfg.from,
    timeline: { label: cfg.id + ' (' + cfg.motif + ')', color: cfg.accent, lane: 'video' },
    render: function(f) {
      var kids = [];
      if (cfg.motif === 'crown') kids = hookCrown(f, cfg.accent);
      else if (cfg.motif === 'iphone') kids = hookIphone(f, cfg.accent);
      else if (cfg.motif === 'concert') kids = hookConcert(f, cfg.accent);
      else kids = hookMicoff(f, cfg.accent, cfg.line);

      var all = [sceneIn(f, { type: 'stack', fit: 'expand', children: kids })];
      all.push(hookLyric(f, cfg));
      if (cfg.caption) all.push(fullW(cap(cfg.caption, cfg.accent, 26), 1640));
      if (cfg.outroTag && f >= OUTRO_TAG_FRAME) {
        all.push(at({ type: 'container', width: 500, height: 130, alignment: 'center',
          child: glowText('LEXY', 84, C.white, cfg.accent, 30) }, 540, 700));
      }
      all = all.concat(glitchBars(f, cfg.accent, cfg.line));
      return finish({ type: 'stack', fit: 'expand', children: all });
    },
  };
}

// Авто-разбивка строки на ряды + подсветка ключевых слов.
function hookRows(cfg) {
  var words = LINES[cfg.line].text.split(' ');
  var hi = cfg.hilites || [];
  function isHi(w) {
    for (var i = 0; i < hi.length; i++) if (w.indexOf(hi[i]) >= 0) return true;
    return false;
  }
  var rows = [[]], len = 0;
  var maxLen = words.length > 7 ? 18 : 24;
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    if (len + w.length > maxLen && rows[rows.length - 1].length) { rows.push([]); len = 0; }
    rows[rows.length - 1].push({ t: w, c: isHi(w) ? cfg.accent : C.white, g: isHi(w) ? cfg.accent : null });
    len += w.length + 1;
  }
  return rows;
}
function hookLyric(f, cfg) {
  return lyric(f, hookRows(cfg), {
    line: cfg.line, size: cfg.size || (LINES[cfg.line].text.length > 34 ? 54 : 62),
    top: LINES[cfg.line].text.length > 40 ? 215 : 250,
    rgb: function(fr) { return glitchOn(fr, cfg.line); },
  });
}

// --- Чемпион: золотая корона + конфетти ---------------------------------------
function hookCrown(f, accent) {
  var kids = [];
  for (var i = 0; i < 20; i++) {
    var x = rnd(i * 3.7) * W;
    var y = (rnd(i * 9.1) * 1500 + f * (1.2 + rnd(i) * 2.4)) % 1500 + 150;
    kids.push({ type: 'rect', width: 8 + rnd(i) * 8, height: 12 + rnd(i * 2) * 10,
      fill: i % 3 ? accent : C.violetL, opacity: 0.35 + rnd(i + Math.floor(f / 8)) * 0.4,
      rotation: (f * (2 + rnd(i) * 4)) % 360,
      positioned: { left: Math.round(x), top: Math.round(y) } });
  }
  var s = svgOpen(560, 470);
  var body = 'M60 340 L40 110 L165 200 L280 55 L395 200 L520 110 L500 340 Z';
  s += '<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#ffe9a8"/><stop offset="45%" stop-color="#fbbf24"/>' +
    '<stop offset="100%" stop-color="#b45309"/></linearGradient></defs>';
  s += '<path d="' + body + '" fill="none" stroke="#fbbf24" stroke-opacity="0.30" stroke-width="16" stroke-linejoin="round"/>';
  s += '<path d="' + body + '" fill="url(#gold)" stroke="#fff3cf" stroke-width="3" stroke-linejoin="round"/>';
  s += '<rect x="60" y="362" width="440" height="62" rx="14" fill="url(#gold)" stroke="#fff3cf" stroke-width="3"/>';
  for (var g = 0; g < 3; g++) {
    s += '<circle cx="' + (160 + g * 120) + '" cy="393" r="14" fill="#0b0e1c" fill-opacity="0.65"/>';
  }
  s += '<circle cx="280" cy="250" r="26" fill="#0b0e1c" fill-opacity="0.5"/>';
  s += '</svg>';
  var crown = at(svg(s, 560, 470), 540, 1010 + Math.sin(f * 0.06) * 16);
  crown.rotation = Math.sin(f * 0.04) * 4;
  kids.push(crown);
  kids.push(at({ type: 'circle', size: 720 + pulse(f) * 60, stroke: accent, strokeWidth: 2,
    opacity: 0.25 }, 540, 1000));
  return kids;
}

// --- iPhone: рамка телефона, идёт запись --------------------------------------
function hookIphone(f, accent) {
  var kids = [];
  var phone = panel(500, 960, {
    type: 'column', mainAxisAlignment: 'spaceEvenly', crossAxisAlignment: 'center',
    children: [
      { type: 'row', mainAxisAlignment: 'center', spacing: 16, children: [
        { type: 'circle', size: 14, fill: C.red, opacity: f % 20 < 12 ? 1 : 0.25 },
        cap('REC · 4K 60', C.red, 28),
      ] },
      { type: 'container', alignment: 'center',
        child: { type: 'image', source: 'external:silhouette', width: 380, height: 475,
          blur: 10, opacity: 0.9 } },
      { type: 'row', mainAxisAlignment: 'center', spacing: 22, children: [
        cap('ФРОНТАЛЬНАЯ', C.muted, 24),
        { type: 'container', width: 90, height: 90, borderRadius: 45,
          borderColor: C.white, borderWidth: 4 },
      ] },
      cap('СНИМАЕМ НА ТЕЛЕФОН', accent, 26),
    ],
  }, { padding: 24, borderRadius: 60, borderColor: '#3a4468' });
  var wrap = at(phone, 540, 1060);
  wrap.scale = 0.98 + 0.07 * seg(f, 0, 90);
  kids.push(wrap);
  return kids;
}

// --- Концерт: световые балки и толпа с телефонами ------------------------------
function hookConcert(f, accent) {
  var kids = [];
  for (var b = 0; b < 2; b++) {
    var apexX = b ? 900 : 180;
    var baseX = (b ? 260 : 820) + Math.sin(f * 0.05 + b * 2) * 180;
    var bs = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1250">' +
      '<defs><linearGradient id="beam' + b + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + accent + '" stop-opacity="0.42"/>' +
      '<stop offset="100%" stop-color="' + accent + '" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="' + apexX + ',-20 ' + (baseX - 260) + ',1250 ' + (baseX + 260) + ',1250" fill="url(#beam' + b + ')"/>' +
      '<polygon points="' + apexX + ',-20 ' + (baseX - 60) + ',1250 ' + (baseX + 60) + ',1250" fill="' + accent + '" fill-opacity="0.18"/>' +
      '</svg>';
    kids.push({ type: 'svg', data: bs, width: W, height: 1250,
      positioned: { left: 0, top: -60 } });
  }
  for (var i = 0; i < 13; i++) {
    var x = 40 + i * 84;
    var bob = Math.sin(f * 0.16 + i * 1.4) * 10;
    var y = 1400 + (i % 3) * 80 + bob;
    if (i % 3 === 0) {
      kids.push(at({ type: 'container', width: 46, height: 78, borderRadius: 8,
        color: '#eaf2ff', borderColor: accent, borderWidth: 2,
        shadow: { color: AA(accent, '66'), blur: 24 }, rotation: Math.sin(f * 0.1 + i) * 10,
      }, x + 20, y - 120 + bob));
    }
    kids.push(at({ type: 'circle', size: 58, fill: '#2b3552' }, x, y));
    kids.push(at({ type: 'container', width: 108, height: 90, borderRadius: 40,
      color: '#202a45' }, x, y + 78));
  }
  // Артист в центре сцены в круге света.
  kids.push({ type: 'container', width: 760, height: 760, borderRadius: 380,
    positioned: { left: 160, top: 560 },
    gradient: { colors: [AA(accent, '66'), '#00000000'] }, opacity: 0.55 });

  kids.push(at({ type: 'image', source: 'external:silhouette', width: 520, height: 650,
    blur: 3, opacity: 0.95 }, 540, 1120 + Math.sin(f * 0.12) * 10));
  kids.push(at({ type: 'container', width: 620, height: 10, borderRadius: 5,
    color: accent, shadow: { color: AA(accent, 'aa'), blur: 40 }, opacity: 0.9 }, 540, 1450));
  kids.push({ type: 'container', width: W, height: 320, positioned: { left: 0, top: 1560 },
    gradient: { colors: ['#00000000', AA(C.bg, 'cc'), C.bg] } });
  return kids;
}

// --- Мама права: микрофон, перечёркнутый красным -------------------------------
function hookMicoff(f, accent, line) {
  var kids = [];
  var m = svgOpen(520, 900);
  m += '<rect x="180" y="60" width="160" height="330" rx="80" fill="#10131f" stroke="#e8ecff" stroke-opacity="0.85" stroke-width="3"/>';
  for (var y = 92; y < 350; y += 18) {
    m += '<line x1="196" y1="' + y + '" x2="324" y2="' + y + '" stroke="#39415f" stroke-width="4"/>';
  }
  for (var x = 208; x < 330; x += 20) {
    m += '<line x1="' + x + '" y1="76" x2="' + x + '" y2="374" stroke="#2a3150" stroke-width="3"/>';
  }
  m += '<path d="M140 300 L140 330 Q140 440 260 440 Q380 440 380 330 L380 300" fill="none" stroke="#e8ecff" stroke-opacity="0.8" stroke-width="4"/>';
  m += '<line x1="260" y1="440" x2="260" y2="600" stroke="#e8ecff" stroke-opacity="0.8" stroke-width="5"/>';
  m += '<path d="M120 640 L400 640 M160 600 L120 640 M360 600 L400 640 M260 600 L260 640" stroke="#e8ecff" stroke-opacity="0.7" stroke-width="5" fill="none"/>';
  m += '</svg>';
  var mic = at(svg(m, 520, 900), 540, 1000);
  mic.rotation = Math.sin(f * 0.05) * 2;
  mic.opacity = 0.85;
  kids.push(mic);

  // Красный срез через микрофон на «Выкинь».
  var banAt = (LINES[line].words[4] || 40) + 4;
  if (f > banAt) {
    var p = eoBack(seg(f, banAt, banAt + 12));
    kids.push(at({ type: 'container', width: 760, height: 18, borderRadius: 9,
      color: C.red, shadow: { color: '#88ff2d55', blur: 40 }, rotation: -32,
      scale: p, opacity: seg(f, banAt, banAt + 5) }, 540, 1000));
    kids.push(at({ type: 'container', width: 640, height: 170, alignment: 'center',
      borderColor: C.red, borderWidth: 7, borderRadius: 16, color: '#14ff2d55',
      rotation: -10, scale: 1.6 - 0.6 * eo3(seg(f, banAt + 8, banAt + 24)),
      opacity: seg(f, banAt + 8, banAt + 13),
      child: glowText('ВЫКИНЬ', 84, C.red, C.red, 22) }, 540, 1450));
  }
  return kids;
}
