// lib/qr.js — fa1.dev QR code as a raw module matrix + vector renderer.
//
// Matrix generated with segno (https://pypi.org/project/segno/), ECC level M,
// 25x25 modules. Rendered as run-length horizontal strips so a frame costs
// ~150 rect nodes instead of 625.
//
// faQrNode(x, y, size, dark, opts) — top-left anchored QR node.
//   opts.quiet  — quiet-zone modules (default 1, per QR spec minimum)
//   opts.radius — module corner radius (default 0)
//   opts.opacity

var QR_FA1DEV = [
  '1111111011101010001111111',
  '1000001000110000101000001',
  '1011101011000011001011101',
  '1011101011001100001011101',
  '1011101001111000001011101',
  '1000001010100001001000001',
  '1111111010101010101111111',
  '0000000011100111000000000',
  '1101101110111000110110101',
  '0111001000101110010010110',
  '1000111011010011101111001',
  '1110110000010100011010011',
  '0000011010001101000011100',
  '0011101111010101101101110',
  '0110010111111111010110100',
  '1000101001101010110000111',
  '1100010101011010010101100',
  '0011010100011110101011101',
  '0111011101011111110010110',
  '1000011001000111100110111',
  '1110110101110010100011101',
  '1001101111010101111000010',
  '0000000010010010100110011',
  '1111111010001101111011111',
  '1000001011010110010000001',
  '1011101001100111101110101',
];

function faQrNode(x, y, size, dark, opts) {
  var o = opts || {};
  var quiet = o.quiet != null ? o.quiet : 1;
  var n = QR_FA1DEV.length;
  var total = n + quiet * 2;
  var cell = size / total;
  var kids = [];

  // Background plate (quiet zone) — theme surface so the QR reads on both.
  kids.push({
    type: 'rect',
    width: size,
    height: size,
    radius: o.radius || 0,
    fill: o.plate || '#FFFFFF',
    opacity: o.opacity != null ? o.opacity : 1,
    positioned: { left: x, top: y },
  });

  for (var r = 0; r < n; r++) {
    var row = QR_FA1DEV[r];
    var c = 0;
    while (c < n) {
      if (row.charAt(c) === '1') {
        var start = c;
        while (c < n && row.charAt(c) === '1') c++;
        var run = c - start;
        kids.push({
          type: 'rect',
          width: cell * run,
          height: cell,
          radius: o.moduleRadius || 0,
          fill: dark,
          opacity: o.opacity != null ? o.opacity : 1,
          positioned: {
            left: x + (quiet + start) * cell,
            top: y + (quiet + r) * cell,
          },
        });
      } else {
        c++;
      }
    }
  }
  return { type: 'stack', fit: 'expand', children: kids };
}
