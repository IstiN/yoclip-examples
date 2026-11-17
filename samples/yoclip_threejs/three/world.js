// YoClip — FROM PROMPT TO PREMIERE
// Upstream THREE r186, evaluated by js_widget_runtime and rendered by Flutter
// GPU. No requestAnimationFrame and no wall-clock state: YoClip sends one
// `yoclip.frame` event per timeline frame, including random-access screenshots.

var W = 1920;
var H = 1080;
var FPS = 30;
var canvas = jsr.three.createCanvas('main', {
  width: W,
  height: H,
  pixelRatio: 1,
});
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

var world = new THREE.Scene();
world.background = new THREE.Color(0x05050c);
world.fog = new THREE.FogExp2(0x05050c, 0.018);
var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 180);
camera.position.set(0, 0, 15);

var VIOLET = 0x7c3aed;
var LILAC = 0xa78bfa;
var CYAN = 0x22d3ee;
var WHITE = 0xf8f7ff;
var INK = 0x05050c;
var dummy = new THREE.Object3D();
var tempColor = new THREE.Color();

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
function out3(t) { var u = 1 - clamp(t, 0, 1); return 1 - u * u * u; }
function inOut(t) {
  t = clamp(t, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function back(t) {
  var c1 = 1.70158;
  var c3 = c1 + 1;
  t = clamp(t, 0, 1);
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function rnd(i, salt) {
  var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
function standard(color, emissive, intensity, roughness, metalness) {
  return new THREE.MeshStandardMaterial({
    color: color,
    emissive: emissive || 0x000000,
    emissiveIntensity: intensity || 0,
    roughness: roughness === undefined ? 0.28 : roughness,
    metalness: metalness === undefined ? 0.62 : metalness,
  });
}
function glow(color, opacity) {
  return new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity === undefined ? 1 : opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
function lineGlow(color, opacity) {
  return new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: opacity === undefined ? 0.65 : opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
function mesh(geometry, material, parent) {
  var m = new THREE.Mesh(geometry, material);
  if (parent) parent.add(m);
  return m;
}
function setMatrix(instanced, index, x, y, z, sx, sy, sz, rx, ry, rz) {
  dummy.position.set(x, y, z);
  dummy.scale.set(sx, sy, sz);
  dummy.rotation.set(rx || 0, ry || 0, rz || 0);
  dummy.updateMatrix();
  instanced.setMatrixAt(index, dummy.matrix);
}

// Lighting is deliberately sculptural: a soft white key, violet body light,
// and two moving cyan/violet rims. No post-processing is needed for the look.
world.add(new THREE.HemisphereLight(0x9eaaff, 0x080812, 0.85));
var key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(3, 6, 8);
world.add(key);
var violetLight = new THREE.PointLight(VIOLET, 60, 34, 2);
violetLight.position.set(-6, 1, 5);
world.add(violetLight);
var cyanLight = new THREE.PointLight(CYAN, 70, 32, 2);
cyanLight.position.set(6, -1, 4);
world.add(cyanLight);

// ── Deep-space field ────────────────────────────────────────────────────────
var starCount = 650;
var starPositions = new Float32Array(starCount * 3);
var starColors = new Float32Array(starCount * 3);
for (var si = 0; si < starCount; si++) {
  var sr = 10 + rnd(si, 1) * 62;
  var sa = rnd(si, 2) * Math.PI * 2;
  var sy = (rnd(si, 3) - 0.5) * 44;
  starPositions[si * 3] = Math.cos(sa) * sr;
  starPositions[si * 3 + 1] = sy;
  starPositions[si * 3 + 2] = Math.sin(sa) * sr - 15;
  tempColor.setHex(si % 7 === 0 ? CYAN : (si % 3 === 0 ? LILAC : WHITE));
  var sb = 0.25 + rnd(si, 4) * 0.75;
  starColors[si * 3] = tempColor.r * sb;
  starColors[si * 3 + 1] = tempColor.g * sb;
  starColors[si * 3 + 2] = tempColor.b * sb;
}
var starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
var stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.38,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
world.add(stars);

// ── The YoClip mark, modeled rather than textured ───────────────────────────
var brand = new THREE.Group();
world.add(brand);
var arc = mesh(
  new THREE.TorusGeometry(2.2, 0.19, 20, 128, Math.PI * 1.63),
  standard(LILAC, VIOLET, 0.45, 0.3, 0.58),
  brand
);
arc.rotation.z = -0.19;
var arcGlow = mesh(
  new THREE.TorusGeometry(2.2, 0.035, 8, 128, Math.PI * 1.63),
  glow(CYAN, 0.52),
  brand
);
arcGlow.rotation.z = -0.19;
arcGlow.position.z = 0.23;

function roundedRectShape(w, h, r) {
  var s = new THREE.Shape();
  var x = -w / 2;
  var y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
var bubbleShape = roundedRectShape(2.45, 1.55, 0.42);
var bubble = mesh(
  new THREE.ExtrudeGeometry(bubbleShape, {
    depth: 0.38,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.09,
    bevelThickness: 0.08,
    curveSegments: 16,
  }),
  standard(VIOLET, VIOLET, 0.72, 0.2, 0.58),
  brand
);
bubble.position.set(0.42, 0, 0.18);
var playShape = new THREE.Shape();
playShape.moveTo(-0.28, -0.43);
playShape.lineTo(0.48, 0);
playShape.lineTo(-0.28, 0.43);
playShape.closePath();
var play = mesh(
  new THREE.ExtrudeGeometry(playShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.03,
  }),
  standard(WHITE, CYAN, 0.35, 0.45, 0.42),
  brand
);
play.position.set(0.42, 0, 0.72);
var brandHalo = mesh(
  new THREE.TorusGeometry(3.05, 0.022, 6, 160),
  glow(LILAC, 0.42),
  brand
);
brandHalo.position.z = -0.35;
var brandHalo2 = mesh(
  new THREE.TorusGeometry(3.48, 0.012, 6, 160),
  glow(CYAN, 0.28),
  brand
);
brandHalo2.position.z = -0.6;
brandHalo2.rotation.x = 0.32;

// ── Scene-graph constellation: instanced nodes + batched connections ────────
var graph = new THREE.Group();
world.add(graph);
var NODE_COUNT = 42;
var nodePositions = [];
var nodes = new THREE.InstancedMesh(
  new THREE.IcosahedronGeometry(0.085, 1),
  standard(WHITE, VIOLET, 0.35, 0.32, 0.55),
  NODE_COUNT
);
nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
for (var ni = 0; ni < NODE_COUNT; ni++) {
  var ny = 1 - (ni / (NODE_COUNT - 1)) * 2;
  var nr = Math.sqrt(Math.max(0, 1 - ny * ny));
  var nt = ni * Math.PI * (3 - Math.sqrt(5));
  var np = new THREE.Vector3(
    Math.cos(nt) * nr * 4.1,
    ny * 3.25,
    Math.sin(nt) * nr * 3.2
  );
  nodePositions.push(np);
  nodes.setColorAt(ni, new THREE.Color(ni % 5 === 0 ? CYAN : (ni % 2 ? VIOLET : LILAC)));
}
if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
graph.add(nodes);
var links = [];
for (var li = 0; li < NODE_COUNT; li++) {
  for (var lj = li + 1; lj < NODE_COUNT; lj++) {
    if (nodePositions[li].distanceTo(nodePositions[lj]) < 1.48 && links.length < 230) {
      links.push([li, lj]);
    }
  }
}
var linkPositions = new Float32Array(links.length * 6);
for (var lk = 0; lk < links.length; lk++) {
  var la = nodePositions[links[lk][0]];
  var lb = nodePositions[links[lk][1]];
  linkPositions.set([la.x, la.y, la.z, lb.x, lb.y, lb.z], lk * 6);
}
var linkGeometry = new THREE.BufferGeometry();
linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));
var linkCloud = new THREE.LineSegments(linkGeometry, lineGlow(LILAC, 0.32));
graph.add(linkCloud);
var graphCore = mesh(
  new THREE.IcosahedronGeometry(0.48, 2),
  standard(CYAN, CYAN, 0.65, 0.28, 0.65),
  graph
);
var graphCoreWire = mesh(
  new THREE.IcosahedronGeometry(0.72, 1),
  new THREE.MeshBasicMaterial({ color: LILAC, wireframe: true, transparent: true, opacity: 0.5 }),
  graph
);

// ── Director's kinetic knot ─────────────────────────────────────────────────
var knotGroup = new THREE.Group();
world.add(knotGroup);
var knotGeometry = new THREE.TorusKnotGeometry(1.72, 0.43, 192, 24, 2, 3);
var knot = mesh(knotGeometry, standard(VIOLET, VIOLET, 0.72, 0.19, 0.78), knotGroup);
var knotWire = mesh(
  knotGeometry,
  new THREE.MeshBasicMaterial({
    color: CYAN,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  knotGroup
);
knotWire.scale.setScalar(1.035);
for (var kr = 0; kr < 3; kr++) {
  var ring = mesh(
    new THREE.TorusGeometry(3.25 + kr * 0.46, 0.025, 8, 128),
    glow(kr === 1 ? CYAN : LILAC, 0.48 - kr * 0.09),
    knotGroup
  );
  ring.rotation.set(0.45 + kr * 0.37, kr * 0.55, kr * 0.8);
}

// ── Timeline city: real instanced clips in four lanes ───────────────────────
var timeline = new THREE.Group();
world.add(timeline);
var CLIP_COUNT = 96;
var clips = new THREE.InstancedMesh(
  new THREE.BoxGeometry(1, 1, 1),
  standard(WHITE, VIOLET, 0.2, 0.5, 0.5),
  CLIP_COUNT
);
clips.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
for (var ci = 0; ci < CLIP_COUNT; ci++) {
  clips.setColorAt(ci, new THREE.Color(ci % 7 === 0 ? CYAN : (ci % 3 === 0 ? LILAC : VIOLET)));
}
if (clips.instanceColor) clips.instanceColor.needsUpdate = true;
timeline.add(clips);
var grid = new THREE.GridHelper(34, 34, CYAN, 0x242039);
grid.position.y = -2.7;
grid.material.transparent = true;
grid.material.opacity = 0.32;
timeline.add(grid);

// ── Output-format frames ────────────────────────────────────────────────────
var formats = new THREE.Group();
world.add(formats);
function makeFrame(w, h, color, x) {
  var g = new THREE.Group();
  var bar = 0.075;
  var mat = glow(color, 0.92);
  var horizontal = new THREE.BoxGeometry(w + bar, bar, bar);
  var vertical = new THREE.BoxGeometry(bar, h + bar, bar);
  var top = mesh(horizontal, mat, g); top.position.y = h / 2;
  var bottom = mesh(horizontal, mat, g); bottom.position.y = -h / 2;
  var left = mesh(vertical, mat, g); left.position.x = -w / 2;
  var right = mesh(vertical, mat, g); right.position.x = w / 2;
  var panel = mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.075,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    g
  );
  panel.position.z = -0.04;
  var mark = mesh(new THREE.TorusGeometry(Math.min(w, h) * 0.18, 0.055, 10, 64, Math.PI * 1.63), glow(WHITE, 0.7), g);
  mark.rotation.z = -0.19;
  g.position.x = x;
  formats.add(g);
  return g;
}
var wideFrame = makeFrame(5.1, 2.87, LILAC, -5.4);
var verticalFrame = makeFrame(1.85, 3.29, CYAN, 0);
var squareFrame = makeFrame(3.05, 3.05, VIOLET, 5.0);

// ── Golden-frame review wall ────────────────────────────────────────────────
var review = new THREE.Group();
world.add(review);
var reviewFrames = [];
for (var ri = 0; ri < 12; ri++) {
  var rg = new THREE.Group();
  var rw = 2.5;
  var rh = 1.4;
  var rc = ri === 5 ? CYAN : (ri % 2 ? VIOLET : LILAC);
  var rm = lineGlow(rc, ri === 5 ? 1 : 0.45);
  var rect = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-rw / 2, -rh / 2, 0), new THREE.Vector3(rw / 2, -rh / 2, 0),
    new THREE.Vector3(rw / 2, -rh / 2, 0), new THREE.Vector3(rw / 2, rh / 2, 0),
    new THREE.Vector3(rw / 2, rh / 2, 0), new THREE.Vector3(-rw / 2, rh / 2, 0),
    new THREE.Vector3(-rw / 2, rh / 2, 0), new THREE.Vector3(-rw / 2, -rh / 2, 0),
  ]);
  rg.add(new THREE.LineSegments(rect, rm));
  var inner = mesh(new THREE.PlaneGeometry(rw * 0.9, rh * 0.82), new THREE.MeshBasicMaterial({
    color: rc, transparent: true, opacity: ri === 5 ? 0.18 : 0.06, depthWrite: false,
  }), rg);
  inner.position.z = -0.03;
  rg.position.set((ri % 4 - 1.5) * 3.15, (1.5 - Math.floor(ri / 4)) * 2.15, -Math.abs(ri - 5) * 0.13);
  review.add(rg);
  reviewFrames.push(rg);
}
var scanBar = mesh(new THREE.BoxGeometry(2.5, 0.045, 0.04), glow(CYAN, 1), reviewFrames[5]);
scanBar.position.z = 0.08;

// ── Render tunnel, four instanced bars per ring ─────────────────────────────
var tunnel = new THREE.Group();
world.add(tunnel);
var RING_COUNT = 30;
var tunnelBars = new THREE.InstancedMesh(
  new THREE.BoxGeometry(1, 1, 1),
  glow(WHITE, 0.82),
  RING_COUNT * 4
);
tunnelBars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
for (var ti = 0; ti < RING_COUNT; ti++) {
  for (var tb = 0; tb < 4; tb++) {
    tunnelBars.setColorAt(ti * 4 + tb, new THREE.Color(ti % 5 === 0 ? CYAN : (ti % 2 ? VIOLET : LILAC)));
  }
}
if (tunnelBars.instanceColor) tunnelBars.instanceColor.needsUpdate = true;
tunnel.add(tunnelBars);

// ── GPU particle vortex for the showreel ────────────────────────────────────
var PARTICLE_COUNT = 900;
var particlePositions = new Float32Array(PARTICLE_COUNT * 3);
var particleColors = new Float32Array(PARTICLE_COUNT * 3);
for (var pi = 0; pi < PARTICLE_COUNT; pi++) {
  tempColor.setHex(pi % 4 === 0 ? CYAN : (pi % 3 === 0 ? WHITE : VIOLET));
  particleColors.set([tempColor.r, tempColor.g, tempColor.b], pi * 3);
}
var particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
var particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
  size: 0.055,
  vertexColors: true,
  transparent: true,
  opacity: 0.38,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
world.add(particles);

function shotCamera(frame, x, y, z, tx, ty, tz, fov) {
  camera.position.set(x, y, z);
  camera.lookAt(tx || 0, ty || 0, tz || 0);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  camera.rotateZ(Math.sin(frame * 0.006) * 0.006);
}

function updateBrand(frame, local, mode) {
  brand.visible = true;
  var enter = back(seg(local, 8, 76));
  var scale = Math.max(0.001, enter);
  if (mode === 'intro') scale *= 0.72;
  if (mode === 'outro') scale = 0.46 + 0.12 * out3(seg(local, 0, 100));
  if (mode === 'mockup') scale = enter * (0.66 + Math.sin(local * 0.025) * 0.025);
  if (mode === 'assemble') scale = 0.75 * back(seg(local, 95, 225));
  brand.scale.setScalar(Math.max(0.001, scale));
  brand.rotation.x = Math.sin(frame * 0.009) * 0.13;
  brand.rotation.y = mode === 'mockup' ? local * 0.006 : Math.sin(frame * 0.007) * 0.28;
  brand.rotation.z = Math.sin(frame * 0.005) * 0.045;
  var baseY = mode === 'intro' ? 1.55 : (mode === 'mockup' ? 1.1 : (mode === 'outro' ? 1.45 : 0));
  brand.position.y = baseY + Math.sin(frame * 0.018) * 0.12;
  brand.position.x = mode === 'assemble' ? 2.8 * (1 - out3(seg(local, 95, 220))) : 0;
  brandHalo.rotation.z = frame * 0.004;
  brandHalo2.rotation.z = -frame * 0.006;
  play.scale.setScalar(1 + Math.sin(frame * 0.09) * 0.045);
}

function updateGraph(frame, local, mode) {
  graph.visible = true;
  graph.position.set(mode === 'code' ? 3.25 : 0, 0, 0);
  graph.scale.setScalar(mode === 'code' ? 0.83 : (mode === 'assemble' ? 1 - 0.35 * seg(local, 95, 220) : 1));
  graph.rotation.y = frame * 0.0045;
  graph.rotation.x = Math.sin(frame * 0.006) * 0.18;
  for (var i = 0; i < NODE_COUNT; i++) {
    var p = nodePositions[i];
    var pulse = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(frame * 0.065 + i * 1.7));
    var gather = mode === 'assemble' ? 1 - 0.7 * inOut(seg(local, 95, 225)) : 1;
    setMatrix(nodes, i, p.x * gather, p.y * gather, p.z * gather, pulse, pulse, pulse, frame * 0.01, frame * 0.008, 0);
  }
  nodes.instanceMatrix.needsUpdate = true;
  linkCloud.material.opacity = mode === 'assemble' ? 0.32 * (1 - seg(local, 95, 210)) : 0.32;
  graphCore.rotation.set(frame * 0.011, frame * 0.014, 0);
  graphCore.scale.setScalar(0.86 + Math.sin(frame * 0.08) * 0.13);
  graphCoreWire.rotation.set(-frame * 0.008, frame * 0.01, frame * 0.006);
}

function updateKnot(frame, local) {
  knotGroup.visible = true;
  knotGroup.rotation.set(0.32 + Math.sin(frame * 0.008) * 0.2, frame * 0.009, frame * 0.004);
  knotGroup.scale.setScalar(0.82 + 0.18 * out3(seg(local, 0, 70)));
  knotWire.rotation.y = -frame * 0.006;
}

function updateTimeline(frame, local) {
  timeline.visible = true;
  timeline.rotation.y = Math.sin(frame * 0.006) * 0.12;
  for (var i = 0; i < CLIP_COUNT; i++) {
    var lane = i % 4;
    var col = Math.floor(i / 4);
    var width = 0.55 + rnd(i, 8) * 1.5;
    var x = (col - 11.5) * 1.38;
    var y = 1.65 - lane * 1.25;
    var z = -2.5 + rnd(i, 9) * 2.2 + Math.sin(frame * 0.01 + i) * 0.08;
    var active = (col + Math.floor(local / 18)) % 24 === 0;
    var h = active ? 0.72 : 0.28 + rnd(i, 10) * 0.24;
    setMatrix(clips, i, x, y, z, width, h, 0.7 + rnd(i, 11) * 1.5, 0, 0, 0);
  }
  clips.instanceMatrix.needsUpdate = true;
}

function updateFormats(frame, local) {
  formats.visible = true;
  formats.rotation.y = Math.sin(frame * 0.007) * 0.14;
  var frames = [wideFrame, verticalFrame, squareFrame];
  for (var i = 0; i < frames.length; i++) {
    var enter = back(seg(local, 12 + i * 14, 70 + i * 14));
    frames[i].scale.setScalar(Math.max(0.001, enter));
    frames[i].position.y = Math.sin(frame * 0.018 + i * 2) * 0.22;
    frames[i].rotation.y = Math.sin(frame * 0.009 + i) * 0.12;
  }
}

function updateReview(frame, local) {
  review.visible = true;
  review.rotation.y = Math.sin(frame * 0.005) * 0.1;
  for (var i = 0; i < reviewFrames.length; i++) {
    var enter = out3(seg(local, i * 3, 45 + i * 3));
    reviewFrames[i].scale.setScalar(0.72 + enter * 0.28);
    reviewFrames[i].position.z = -Math.abs(i - 5) * 0.13 + Math.sin(frame * 0.015 + i) * 0.08;
  }
  scanBar.position.y = -0.62 + ((local * 0.025) % 1.24);
  scanBar.material.opacity = 0.65 + Math.sin(frame * 0.2) * 0.3;
}

function updateTunnel(frame, local, speedScale) {
  tunnel.visible = true;
  var depth = 58;
  var speed = (speedScale || 1) * 0.19;
  for (var i = 0; i < RING_COUNT; i++) {
    var z = -52 + ((i * (depth / RING_COUNT) + frame * speed) % depth);
    var angle = i * 0.19 + frame * 0.003;
    var radius = 3.3 + Math.sin(i * 0.7 + frame * 0.012) * 0.35;
    var len = radius * 2 + 0.14;
    var thick = i % 5 === 0 ? 0.12 : 0.065;
    var c = Math.cos(angle) * 0.35;
    var s = Math.sin(angle) * 0.35;
    setMatrix(tunnelBars, i * 4, c, radius + s, z, len, thick, thick, 0, 0, angle);
    setMatrix(tunnelBars, i * 4 + 1, c, -radius + s, z, len, thick, thick, 0, 0, angle);
    setMatrix(tunnelBars, i * 4 + 2, radius + c, s, z, thick, len, thick, 0, 0, angle);
    setMatrix(tunnelBars, i * 4 + 3, -radius + c, s, z, thick, len, thick, 0, 0, angle);
  }
  tunnelBars.instanceMatrix.needsUpdate = true;
}

function updateParticles(frame, local, mode) {
  particles.visible = true;
  var count = mode === 'vortex' ? PARTICLE_COUNT : 240;
  particleGeometry.setDrawRange(0, count);
  particles.material.opacity = mode === 'vortex' ? 0.72 : 0.24;
  particles.material.size = mode === 'vortex' ? 0.085 : 0.05;
  for (var i = 0; i < count; i++) {
    var base = rnd(i, 20) * Math.PI * 2;
    var radius = 1.2 + rnd(i, 21) * 6.8;
    var speed = 0.003 + rnd(i, 22) * 0.008;
    var angle = base + frame * speed;
    var z = (rnd(i, 23) - 0.5) * 15 + Math.sin(frame * 0.008 + i) * 0.6;
    if (mode === 'vortex') z = -10 + ((rnd(i, 23) * 24 + frame * (0.025 + rnd(i, 24) * 0.04)) % 24);
    if (mode === 'collapse') {
      var gather = 1 - 0.82 * inOut(seg(local, 0, 120));
      radius *= gather;
      z *= gather;
    }
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
    particlePositions[i * 3 + 2] = z;
  }
  particleGeometry.attributes.position.needsUpdate = true;
  particles.rotation.z = Math.sin(frame * 0.005) * 0.12;
}

function renderFrame(frame, fps, params) {
  var shot = Math.min(11, Math.floor(frame / 300));
  var local = frame - shot * 300;
  brand.visible = false;
  graph.visible = false;
  knotGroup.visible = false;
  knotGroup.position.set(0, 0, 0);
  timeline.visible = false;
  timeline.position.set(0, 0, 0);
  formats.visible = false;
  review.visible = false;
  tunnel.visible = false;
  particles.visible = false;

  stars.rotation.y = frame * 0.00045;
  stars.rotation.x = Math.sin(frame * 0.0015) * 0.06;
  violetLight.position.set(Math.cos(frame * 0.009) * 7, 2 + Math.sin(frame * 0.012) * 2, 5);
  cyanLight.position.set(Math.cos(frame * 0.008 + Math.PI) * 7, -1 + Math.sin(frame * 0.01) * 2, 4);

  if (shot === 0) {
    updateBrand(frame, local, 'intro');
    shotCamera(frame, 0, 0.15, 16.5 - 4.2 * out3(seg(local, 0, 260)), 0, 0, 0, 42);
  } else if (shot === 1) {
    updateGraph(frame, local, 'code');
    shotCamera(frame, -0.8, 0.8, 15.5, 1.1, 0, 0, 42);
  } else if (shot === 2) {
    updateGraph(frame, local, 'neural');
    graph.position.y = -2.2;
    updateParticles(frame, local, 'orbit');
    shotCamera(frame, Math.sin(local * 0.006) * 3.2, 1.1, 14.2, 0, 0, 0, 44);
  } else if (shot === 3) {
    updateBrand(frame, local, 'mockup');
    updateParticles(frame, local, 'orbit');
    shotCamera(frame, Math.sin(local * 0.008) * 2.5, 0.4, 11.8, 0, 0, 0, 42);
  } else if (shot === 4) {
    updateKnot(frame, local);
    knotGroup.scale.multiplyScalar(0.55);
    knotGroup.position.set(-3.2, 0.4, -2);
    shotCamera(frame, Math.sin(local * 0.009) * 3.2, 1.4 + Math.sin(local * 0.012), 13.8, 0, 0, 0, 43);
  } else if (shot === 5) {
    // The editorial timeline is the hero in this chapter. Keep the 3D stage
    // quiet instead of competing with it using large plastic clip blocks.
    shotCamera(frame, 0, 0.4, 16.5, 0, 0, 0, 43);
  } else if (shot === 6) {
    // Native format cards carry this chapter; no duplicate 3D frames.
    shotCamera(frame, 0, 0.4, 16.5, 0, 0, 0, 43);
  } else if (shot === 7) {
    // Keep the golden-frame UI crisp and free of background geometry.
    shotCamera(frame, 0, 0.2, 16.5, 0, 0, 0, 43);
  } else if (shot === 8) {
    // The export panel is the hero. A quiet stage reads more confidently
    // than a full-screen tunnel crossing the typography and progress data.
    shotCamera(frame, 0, 0.4, 16.5, 0, 0, 0, 43);
  } else if (shot === 9) {
    var showPart = Math.floor(local / 75);
    if (showPart === 0) {
      updateKnot(frame, local);
      shotCamera(frame, 4.8, 1.2, 9.2, 0, 0, 0, 44);
    } else if (showPart === 1) {
      updateGraph(frame, local, 'neural');
      shotCamera(frame, -4.6, 2.2, 10.5, 0, 0, 0, 48);
    } else if (showPart === 2) {
      updateParticles(frame, local, 'vortex');
      shotCamera(frame, 0, 0, 10.5, 0, 0, -4, 52);
    } else {
      updateTimeline(frame, local);
      timeline.position.y = -1.5;
      updateParticles(frame, local, 'orbit');
      shotCamera(frame, 8, 8, 26, 0, -1, 0, 42);
    }
  } else if (shot === 10) {
    // Repository and CLI panels are the content; keep the stage restrained.
    shotCamera(frame, 0, 0.4, 16.5, 0, 0, 0, 43);
  } else {
    updateBrand(frame, local, 'outro');
    updateParticles(frame, local, 'collapse');
    shotCamera(frame, 0, 0.1, 14.5 - 3.4 * out3(seg(local, 0, 220)), 0, 0, 0, 42);
  }

  renderer.render(world, camera);
}

function handleEvent(action, payload) {
  if (action !== 'yoclip.frame') return;
  payload = payload || {};
  var nextW = Math.max(1, Math.round(payload.width || W));
  var nextH = Math.max(1, Math.round(payload.height || H));
  if (nextW !== W || nextH !== H) {
    W = nextW;
    H = nextH;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  FPS = payload.fps || FPS;
  var frame = Math.max(0, Math.round(payload.frame || 0));
  renderFrame(frame, FPS, payload.params || {});
  jsr.render({
    type: 'three',
    canvasId: 'main',
    width: W,
    height: H,
  });
  jsr.exportState({
    renderer: 'THREE r186',
    backend: 'Flutter GPU',
    frame: frame,
    shot: Math.min(11, Math.floor(frame / 300)),
    instancedClips: CLIP_COUNT,
    particles: PARTICLE_COUNT,
  });
}

jsr.onEvent(handleEvent);

console.log('YoClip THREE world ready — r186 / Flutter GPU / deterministic frames');
