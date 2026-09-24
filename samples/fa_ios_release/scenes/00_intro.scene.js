// 00 — Intro — Grok-generated hook video (451 frames ≈ 15.04s)
//
// Full-bleed AnimVideo layer. The source clip is 768x1168 portrait at
// 24fps; `fit: cover` crops it to each variant's canvas (portrait
// variants are nearly lossless, landscape crops top/bottom).
// `speed: 0.8` (= 24/30) plays the clip at NATIVE tempo: picture and its
// soundtrack both run to the source end at comp frame 451, keeping A/V in
// sync in the export mixdown (which plays the extracted wav 1:1). From
// frame 360 (12s) the next scene renders above this one; the intro's last
// seconds of audio play on underneath it. Background music is a quiet bed
// from frame 0 (see yoclip.yaml envelope).

// Hook camera — KEEP IN SYNC with scenes/01_hook.scene.js (same function
// there). 00_intro's video tail runs UNDER the hook (global 300–451 =
// hook-local 0–151) and must zoom in lockstep with the content layer, so
// the whole scene reads as one camera push. Returns null when identity.
function hookCamera(frame, F) {
  var isP = F.portrait;
  var pad = isP ? 28 : 24;
  var m = Math.min(F.W, F.H);
  var cardW = isP ? F.W * 0.86 : F.W * 0.38;
  var cardH = m * 0.40;
  var cardX = isP ? (F.W - cardW) / 2 : F.W * 0.55;
  var cardY = isP ? F.H * 0.49 : F.H * 0.24;
  var pillX = cardX + pad;
  var pillY = cardY + pad;
  var pillW = cardW - pad * 2;
  var pillH = cardH - pad * 2;
  var btnD = isP ? 64 : 54;
  var btnX = pillX + pillW - btnD - pad * 0.8;
  var btnY = pillY + pillH - btnD - pad * 0.8;

  function tw(at, dur, from, to) {
    return jsr.motion.tween(frame * 1000 / 30, at * 1000 / 30, dur * 1000 / 30, from, to, 'easeInOut');
  }

  var zoomA = tw(12, 22, 0, 1); // into the typing area
  var shiftP = tw(92, 16, 0, 1); // pill -> button
  var outP = tw(130, 18, 0, 1); // pull back out
  if ((zoomA === 0 && shiftP === 0) || outP === 1) return null;

  var zoomAmt = isP ? 0.22 : 0.30;
  var extraAmt = isP ? 0.10 : 0.12;
  var panAmt = isP ? 0.45 : 1.0;

  var ccx = F.cx;
  var ccy = F.cy;
  var fcx = pillX + pillW / 2; // typing-area focus point
  var fcy = pillY + pillH * 0.35;
  var bcxp = btnX + btnD / 2; // button focus point
  var bcyp = btnY + btnD / 2;
  var tx = fcx + (bcxp - fcx) * panAmt;
  var ty = fcy + (bcyp - fcy) * panAmt;

  var camS = 1 + zoomAmt * zoomA;
  var vx = ccx + (fcx - ccx) * zoomA;
  var vy = ccy + (fcy - ccy) * zoomA;
  if (shiftP > 0) {
    camS += extraAmt * shiftP;
    vx = fcx + (tx - fcx) * shiftP;
    vy = fcy + (ty - fcy) * shiftP;
  }
  if (outP > 0) {
    camS = 1 + (zoomAmt + extraAmt) * (1 - outP);
    vx = tx + (ccx - tx) * outP;
    vy = ty + (ccy - ty) * outP;
  }
  return { scale: camS, offsetX: ccx - vx, offsetY: ccy - vy };
}

scene = {
  id: '00_intro',
  duration: 451,
  from: 0,
  timeline: {
    label: 'Intro · Video',
    color: '#6E74FF',
    lane: 'video',
  },

  render: function(frame) {
    var F = faFormat();
    var video = {
      type: 'video',
      source: 'external:intro_video',
      fit: 'cover',
      speed: 0.8,
      width: F.W,
      height: F.H,
    };
    // Landscape only: `cover` crops a 768x1168 portrait source into 16:9
    // with ~2/3 of its height hidden, centered — the subject rides low.
    // From 5s ease the crop window up so by 6.5s the top shows ~27% more
    // than the bottom (alignment y −0.27 = a quarter of the hidden band),
    // then hold; the hook camera takes over at 10s.
    if (!F.portrait) {
      var bias = Math.min(1, Math.max(0, (frame - 150) / 45)); // 5s→6.5s
      var eased = bias < 1 ? (1 - Math.cos(bias * Math.PI)) / 2 : 1;
      video.alignment = [0, -0.27 * eased];
    }
    // During the hook (global 300–451) zoom the video in lockstep with the
    // content layer's camera — one whole-scene push-in.
    var cam = hookCamera(frame - 300, F);
    if (cam) {
      return {
        type: 'stack',
        fit: 'expand',
        scale: cam.scale,
        offsetX: cam.offsetX,
        offsetY: cam.offsetY,
        children: [video],
      };
    }
    return {
      type: 'stack',
      fit: 'expand',
      children: [video],
    };
  },
};
