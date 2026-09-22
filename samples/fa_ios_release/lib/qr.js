// lib/qr.js — App Store QR code as a raw module matrix + vector renderer.
//
// Matrix encodes https://apps.apple.com/by/app/fa-ai-agent/id6793815163,
// generated with segno (https://pypi.org/project/segno/), ECC level M,
// boost_error=False, 33x33 modules (41x41 with the 4-module quiet zone
// used at render time). Rendered as run-length horizontal strips so a
// frame costs ~300 rect nodes instead of 1089.
//
// faQrNode(x, y, size, dark, opts) — top-left anchored QR node.
//   opts.quiet  — quiet-zone modules (default 1, per QR spec minimum)
//   opts.radius — module corner radius (default 0)
//   opts.opacity

var QR_APPSTORE = [
  '111111100010000000111101001111111',
  '100000100101100101001010101000001',
  '101110101001001100111101001011101',
  '101110101110100101111001001011101',
  '101110101001111111010111101011101',
  '100000101011111000001100101000001',
  '111111101010101010101010101111111',
  '000000001000101010000110000000000',
  '101111100110011011100010101111100',
  '010010011011010010111111101101101',
  '010000101111011101101010010010110',
  '001011010110110100010111110011110',
  '011110101111001110101000110111011',
  '110100001000010101110111001000111',
  '010010111100001111001100011011110',
  '011110000110111100001100111001100',
  '000111111100101111000011010110001',
  '110010010000111010111011001101101',
  '101101110010111110100100111110100',
  '100011010011010100111110101111110',
  '000110110101101100111000110111000',
  '101001011101111110110111011000001',
  '100001110101110001101100000001110',
  '101010001001011010100101010100101',
  '100100101100100001000011111110010',
  '000000001010010011010101100010101',
  '111111100111100111001001101010110',
  '100000101110101011101111100011101',
  '101110101110110010001000111111010',
  '101110101010000101110010110011011',
  '101110101110110110100110111101100',
  '100000100011111100000100010011100',
  '111111101110011101110010100100010',
];

function faQrNode(x, y, size, dark, opts) {
  var o = opts || {};
  var quiet = o.quiet != null ? o.quiet : 4;
  var n = QR_APPSTORE.length;
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
    var row = QR_APPSTORE[r];
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
