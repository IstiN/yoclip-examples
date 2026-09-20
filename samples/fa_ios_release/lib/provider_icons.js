// provider_icons.js — monochrome vector marks for AI providers (24×24,
// single-color fills so they adapt to the active theme).
//
// providerIconSvg(name, color) -> raw <svg> string
// providerIconNode(name, color, size, {positioned, opacity}) -> node
//
// Marks are simplified geometric identities (not official logos):
//   astra      — OpenAI rosette: center dot + 3 petals (6-way symmetry)
//   gpt        — GPT double chevron
//   kimi       — Kimi crescent moon
//   claude     — Claude sunburst: 6 rounded rays + center
//   gemini     — Gemini 4-point sparkle
//   glm        — bold Z (Z.AI)
//   aiin       — model stack: 3 layered chevrons (300+ models)
//   openrouter — route: 2 waypoints + curved path + midpoint node

function providerIconSvg(name, color) {
  var c = color || '#FFFFFF';
  function svg(body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<g fill="' + c + '">' + body + '</g></svg>';
  }
  switch (name) {
    case 'astra':
      return svg(
        '<circle cx="12" cy="12" r="2.1"/>' +
        '<ellipse cx="12" cy="7.2" rx="2.1" ry="4.8"/>' +
        '<ellipse cx="12" cy="7.2" rx="2.1" ry="4.8" transform="rotate(60 12 12)"/>' +
        '<ellipse cx="12" cy="7.2" rx="2.1" ry="4.8" transform="rotate(120 12 12)"/>'
      );
    case 'gpt':
      return svg(
        '<path d="M12 2.6l8.4 7.4h-4.7L12 7.2 8.3 10H3.6z"/>' +
        '<path d="M12 12.6l8.4 7.4h-4.7L12 17.2l-3.7 2.8H3.6z" opacity="0.55"/>'
      );
    case 'kimi':
      return svg(
        '<path d="M20.6 14.4A8.6 8.6 0 1 1 9.7 3.4a7.1 7.1 0 1 0 10.9 11z"/>'
      );
    case 'claude':
      var rays = '';
      for (var i = 0; i < 6; i++) {
        rays += '<rect x="11" y="3.2" width="2" height="5.6" rx="1" ' +
          'transform="rotate(' + (i * 60) + ' 12 12)"/>';
      }
      return svg(rays + '<circle cx="12" cy="12" r="2.6"/>');
    case 'gemini':
      return svg(
        '<path d="M12 2c.7 5.4 4.6 9.3 10 10-5.4.7-9.3 4.6-10 10-.7-5.4-4.6-9.3-10-10 5.4-.7 9.3-4.6 10-10z"/>'
      );
    case 'glm':
      return svg(
        '<path d="M4.2 4.6h15.6v2.9L9.8 16.9H20v2.9H4.2v-2.9L14.2 7.5H4.2z"/>'
      );
    case 'aiin':
      return svg(
        '<path d="M12 2.4L21 6.9 12 11.4 3 6.9z"/>' +
        '<path d="M3.4 11.4L12 15.7l8.6-4.3 1.9 1L12 17.7l-10.5-5.3z" opacity="0.72"/>' +
        '<path d="M3.4 15.9L12 20.2l8.6-4.3 1.9 1L12 22.2l-10.5-5.3z" opacity="0.45"/>'
      );
    case 'openrouter':
      return svg(
        '<circle cx="5" cy="19" r="2.4"/>' +
        '<circle cx="19" cy="5" r="2.4"/>' +
        '<path d="M6.9 17.1c2.6-3.2 5.1-5.5 10-10.2l1.5 1.5C14 13 11.5 15.3 8.4 18.6z"/>' +
        '<circle cx="12.2" cy="12.2" r="1.7"/>'
      );
  }
  return svg('<circle cx="12" cy="12" r="8"/>');
}

function providerIconNode(name, color, size, opts) {
  var o = opts || {};
  return {
    type: 'svg',
    svg: providerIconSvg(name, color),
    width: size,
    height: size,
    opacity: o.opacity != null ? o.opacity : 1,
    positioned: o.positioned,
  };
}
