// video_slots.js — visible placeholders for future AI-generated person
// clips (see assets/VIDEO_PROMPTS.md for the matching generation prompts).
//
// Each slot draws teal corner marks around the full frame plus an optional
// centered chip naming the exact clip file to drop in. Once Grok videos
// land in assets/video/, set VIDEO_SLOTS = false and replace the slot
// with an AnimVideo node (source: 'external:<name>').

var VIDEO_SLOTS = true;

// faVideoSlot(label, T, F, opts) — opts: {opacity, chip: bool, chipX, chipY}
function faVideoSlot(label, T, F, opts) {
  var o = opts || {};
  var op = o.opacity != null ? o.opacity : 1;
  var withChip = o.chip !== false;
  var kids = [];

  // Corner marks
  var L = 46, th = 5, inset = 30;
  var marks = [
    { x: inset, y: inset, sx: 1, sy: 1 },
    { x: F.W - inset, y: inset, sx: -1, sy: 1 },
    { x: inset, y: F.H - inset, sx: 1, sy: -1 },
    { x: F.W - inset, y: F.H - inset, sx: -1, sy: -1 },
  ];
  for (var i = 0; i < marks.length; i++) {
    var mk = marks[i];
    kids.push(faRRect(L, th, th / 2, T.teal, {
      opacity: 0.5 * op,
      positioned: { left: mk.x + (mk.sx < 0 ? -L : 0), top: mk.y - th / 2 },
    }));
    kids.push(faRRect(th, L, th / 2, T.teal, {
      opacity: 0.5 * op,
      positioned: { left: mk.x - th / 2, top: mk.y + (mk.sy < 0 ? -L : 0) },
    }));
  }

  if (withChip) {
    var chipW = Math.min(F.W * 0.66, 920);
    var chipH = 80;
    var chipX = o.chipX != null ? o.chipX : F.cx - chipW / 2;
    var chipY = o.chipY != null ? o.chipY : F.cy - chipH / 2;
    kids.push(faRRect(chipW, chipH, chipH / 2, T.surface2, {
      opacity: 0.94 * op,
      border: { color: T.border, width: 1.5 },
      positioned: { left: chipX, top: chipY },
    }));
    kids.push(faText('VIDEO SLOT · ' + label, {
      width: chipW,
      opacity: 0.9 * op,
      style: {
        fontSize: 27,
        fontFamily: 'monospace',
        fontWeight: '700',
        color: T.dim,
        textAlign: 'center',
        letterSpacing: 2,
      },
      positioned: { left: chipX, top: chipY + 25 },
    }));
  }

  return { type: 'stack', fit: 'expand', children: kids };
}
