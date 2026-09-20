// lib/qr.js — fa1.dev QR code as a raw module matrix + vector renderer.
//
// Matrix generated with segno (https://pypi.org/project/segno/), ECC level M,
// boost_error=False, 25x25 modules (33x33 with the 4-module quiet zone). Rendered as run-length horizontal strips so a frame costs
// ~150 rect nodes instead of 625.
//
// faQrNode(x, y, size, dark, opts) — top-left anchored QR node.
//   opts.quiet  — quiet-zone modules (default 1, per QR spec minimum)
//   opts.radius — module corner radius (default 0)
//   opts.opacity

var QR_FA1DEV = [
  '1111111011111111001111111',
  '1000001010010111001000001',
  '1011101010001110001011101',
  '1011101000010011101011101',
  '1011101011101101001011101',
  '1000001001100110101000001',
  '1111111010101010101111111',
  '0000000000011010000000000',
  '1001111111110111110010111',
  '0100010010110010100111110',
  '1100011101001011011001001',
  '1110100110010011001101111',
  '0010101000010111011100001',
  '1001110000101001110010010',
  '1110101011100011001011111',
  '1000000010101110011101101',
  '1010101001011001111110110',
  '0000000011010000100010110',
  '1111111011001110101010001',
  '1000001011110101100010010',
  '1011101010010101111110010',
  '1011101010001100101000001',
  '1011101001010100010011111',
  '1000001001011100000110111',
  '1111111011111100110001001'
];

function faQrNode(x, y, size, dark, opts) {
  var o = opts || {};
  var quiet = o.quiet != null ? o.quiet : 4;
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
