// LEVEL UP — persistent deterministic Three.js boss-fight world.
var W = 1920, H = 1080, FPS = 30, RENDER_SCALE = 2;
var canvas = jsr.three.createCanvas('main', { width: W, height: H, pixelRatio: RENDER_SCALE });
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(RENDER_SCALE);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
var world = new THREE.Scene();
world.background = new THREE.Color(0x02030a);
world.fog = new THREE.FogExp2(0x02030a, 0.022);
var camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 180);
var cameraTarget = new THREE.Vector3();
camera.position.set(0, 4, 18);

var CYAN = 0x16e7ff, BLUE = 0x377dff, VIOLET = 0x8b4dff;
var RED = 0xff304f, ORANGE = 0xff7a32, YELLOW = 0xffe83d;
var GREEN = 0x54ff9f, WHITE = 0xf4f8ff, BLACK = 0x02030a;
var dummy = new THREE.Object3D(), tempColor = new THREE.Color();
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * clamp(t, 0, 1); }
function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
function out3(t) { var u = 1 - clamp(t, 0, 1); return 1 - u * u * u; }
function inOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function rnd(i, salt) { var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233) * 43758.5453; return x - Math.floor(x); }
function standard(color, emissive, intensity, roughness, metalness) {
  return new THREE.MeshStandardMaterial({ color: color, emissive: emissive || 0, emissiveIntensity: intensity || 0, roughness: roughness === undefined ? 0.32 : roughness, metalness: metalness === undefined ? 0.55 : metalness });
}
function glow(color, opacity) { return new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false }); }
function mesh(geometry, material, parent) { var m = new THREE.Mesh(geometry, material); if (parent) parent.add(m); return m; }
function setMatrix(target, i, x, y, z, sx, sy, sz, rx, ry, rz) {
  dummy.position.set(x, y, z); dummy.scale.set(sx, sy, sz); dummy.rotation.set(rx || 0, ry || 0, rz || 0);
  dummy.updateMatrix(); target.setMatrixAt(i, dummy.matrix);
}
function roundedRectShape(w, h, r) {
  var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function positionMesh(m, x, y, z, sx, sy, sz) { m.position.set(x, y, z); m.scale.set(sx || 1, sy || 1, sz || 1); return m; }

world.add(new THREE.HemisphereLight(0x99bbff, 0x07030c, 0.75));
var key = new THREE.DirectionalLight(0xffffff, 1.65); key.position.set(2, 8, 7); world.add(key);
var cyanLight = new THREE.PointLight(CYAN, 70, 32, 2); cyanLight.position.set(-5, 3, 4); world.add(cyanLight);
var redLight = new THREE.PointLight(RED, 75, 32, 2); redLight.position.set(5, 3, 3); world.add(redLight);
var violetLight = new THREE.PointLight(VIOLET, 48, 28, 2); violetLight.position.set(0, 6, -4); world.add(violetLight);

// Depth field.
var STAR_COUNT = 520, starPositions = new Float32Array(STAR_COUNT * 3), starColors = new Float32Array(STAR_COUNT * 3);
for (var si = 0; si < STAR_COUNT; si++) {
  var sr = 12 + rnd(si, 1) * 52, sa = rnd(si, 2) * Math.PI * 2;
  starPositions[si * 3] = Math.cos(sa) * sr;
  starPositions[si * 3 + 1] = rnd(si, 3) * 28 - 4;
  starPositions[si * 3 + 2] = Math.sin(sa) * sr - 16;
  tempColor.setHex(si % 11 === 0 ? RED : (si % 4 === 0 ? VIOLET : CYAN));
  var sb = 0.25 + rnd(si, 4) * 0.65;
  starColors[si * 3] = tempColor.r * sb; starColors[si * 3 + 1] = tempColor.g * sb; starColors[si * 3 + 2] = tempColor.b * sb;
}
var starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
var stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.065, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
world.add(stars);

// Arena and audio-reactive architectural grid.
var arena = new THREE.Group(); world.add(arena);
var floor = mesh(new THREE.PlaneGeometry(80, 80), standard(0x050812, 0x02030a, 0.2, 0.28, 0.82), arena);
floor.rotation.x = -Math.PI / 2; floor.position.y = -2.15;
var GRID_COUNT = 84, grid = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(CYAN, 0.22), GRID_COUNT); arena.add(grid);
var gi = 0;
for (var gx = -20; gx <= 20; gx += 2) { setMatrix(grid, gi++, gx, -2.08, -5, 0.018, 0.018, 60, 0, 0, 0); }
for (var gz = -30; gz <= 30; gz += 2) { setMatrix(grid, gi++, 0, -2.07, gz, 42, 0.018, 0.018, 0, 0, 0); }
grid.count = gi; grid.instanceMatrix.needsUpdate = true;
var COLUMN_COUNT = 36, columns = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0x10162e, VIOLET, 1.2, 0.25, 0.75), COLUMN_COUNT); arena.add(columns);
for (var ci = 0; ci < COLUMN_COUNT; ci++) {
  var side = ci % 2 ? 1 : -1, row = Math.floor(ci / 2), ch = 2.5 + rnd(ci, 8) * 8;
  setMatrix(columns, ci, side * (9 + rnd(ci, 2) * 8), -2 + ch / 2, -24 + row * 2.8, 0.5 + rnd(ci, 4) * 0.7, ch, 0.55, 0, 0, 0);
  columns.setColorAt(ci, tempColor.setHex(ci % 5 === 0 ? RED : (ci % 2 ? VIOLET : CYAN)));
}
columns.instanceMatrix.needsUpdate = true; if (columns.instanceColor) columns.instanceColor.needsUpdate = true;
var arenaRings = [];
for (var ar = 0; ar < 4; ar++) {
  var ring = mesh(new THREE.TorusGeometry(4.5 + ar * 2.2, 0.035 + ar * 0.01, 8, 96), glow(ar % 2 ? VIOLET : CYAN, 0.26), arena);
  ring.rotation.x = Math.PI / 2; ring.position.set(0, -1.95 + ar * 0.03, -2); arenaRings.push(ring);
}
var halo = mesh(new THREE.TorusGeometry(4.6, 0.09, 10, 96), glow(CYAN, 0.45), arena); halo.position.set(0, 2.2, -5);
var halo2 = mesh(new THREE.TorusGeometry(3.7, 0.045, 8, 96), glow(VIOLET, 0.34), arena); halo2.position.set(0, 2.2, -5); halo2.rotation.y = 0.5;

// Yoclip fighter.
var yo = new THREE.Group(), yoLeftArm, yoRightArm, yoHead, yoCore;
var yoMetal = standard(0x17275e, VIOLET, 0.32, 0.24, 0.88);
var yoArmor = standard(0x315889, 0x102a55, 0.28, 0.26, 0.92);
var yoTrim = standard(0x9bf6ff, CYAN, 1.9, 0.18, 0.65);
var faceMaterial = standard(0x01030a, 0x01030a, 0.1, 0.2, 0.25);
function makeArm(parent, x, y, material, trim, heavy) {
  var pivot = new THREE.Group(); pivot.position.set(x, y, 0); parent.add(pivot);
  var shoulder = mesh(heavy ? new THREE.DodecahedronGeometry(0.58, 1) : new THREE.SphereGeometry(0.4, 24, 16), heavy ? trim : yoArmor, pivot);
  shoulder.scale.set(1.25, 0.8, 1.1);
  var upper = mesh(new THREE.CylinderGeometry(heavy ? 0.25 : 0.17, heavy ? 0.32 : 0.21, 0.95, 20), material, pivot); upper.position.y = -0.55;
  var elbow = mesh(new THREE.SphereGeometry(heavy ? 0.3 : 0.21, 20, 12), trim, pivot); elbow.position.y = -1.08;
  var forearm = mesh(new THREE.CylinderGeometry(heavy ? 0.3 : 0.19, heavy ? 0.4 : 0.26, 1.0, 20), heavy ? trim : yoArmor, pivot); forearm.position.y = -1.62;
  var hand = mesh(heavy ? new THREE.DodecahedronGeometry(0.43, 1) : new THREE.SphereGeometry(0.25, 24, 16), material, pivot); hand.position.y = -2.22;
  return pivot;
}
var yoBody = mesh(new THREE.SphereGeometry(1, 48, 32), yoMetal, yo); positionMesh(yoBody, 0, 0.65, 0, 1.12, 1.55, 0.78);
var yoChest = mesh(new THREE.TorusGeometry(0.5, 0.075, 10, 48), glow(CYAN, 0.8), yo); yoChest.position.set(0, 1.05, 0.82);
yoCore = mesh(new THREE.SphereGeometry(0.19, 24, 16), yoTrim, yo); yoCore.position.set(0, 1.05, 0.87);
yoHead = new THREE.Group(); yoHead.position.y = 2.85; yoHead.scale.setScalar(0.78); yo.add(yoHead);
var yoHelmet = standard(0x426db0, VIOLET, 0.25, 0.24, 0.9);
var yoHeadShell = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.2, 1.45, 0.25), { depth: 0.72, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.1, bevelSegments: 3, curveSegments: 8 }), yoHelmet, yoHead); yoHeadShell.position.z = -0.34;
var yoFace = mesh(new THREE.ShapeGeometry(roundedRectShape(1.9, 1.02, 0.2), 8), faceMaterial, yoHead); yoFace.position.set(0, 0, 0.5);
for (var ye = -1; ye <= 1; ye += 2) {
  var eye = mesh(new THREE.SphereGeometry(0.13, 20, 12), yoTrim, yoHead); positionMesh(eye, ye * 0.48, 0.12, 0.51, 1.15, 0.72, 0.35);
}
var yoMouth = mesh(new THREE.BoxGeometry(0.55, 0.07, 0.05), glow(CYAN, 0.9), yoHead); yoMouth.position.set(0, -0.3, 0.52);
var yoCrest = mesh(new THREE.BoxGeometry(0.16, 0.42, 1.0), yoArmor, yoHead); yoCrest.position.set(0, 0.92, -0.05);
yoLeftArm = makeArm(yo, -1.23, 1.4, yoMetal, yoTrim, false); yoRightArm = makeArm(yo, 1.23, 1.4, yoMetal, yoTrim, false);
for (var yp = -1; yp <= 1; yp += 2) {
  var pectoral = mesh(new THREE.BoxGeometry(0.9, 0.58, 0.2, 2, 2, 1), yoArmor, yo); pectoral.position.set(yp * 0.47, 1.52, 0.69); pectoral.rotation.z = yp * -0.12;
  var hipArmor = mesh(new THREE.BoxGeometry(0.5, 0.7, 0.25), yoArmor, yo); hipArmor.position.set(yp * 0.72, -0.55, 0.35); hipArmor.rotation.z = yp * 0.2;
}
for (var ya = 0; ya < 3; ya++) { var abdomen = mesh(new THREE.BoxGeometry(0.9 - ya * 0.1, 0.2, 0.18), yoArmor, yo); abdomen.position.set(0, 0.42 - ya * 0.3, 0.72); }
var yoPelvis = mesh(new THREE.DodecahedronGeometry(0.65, 1), yoMetal, yo); positionMesh(yoPelvis, 0, -0.65, 0, 1.15, 0.65, 0.8);
for (var yl = -1; yl <= 1; yl += 2) {
  var thigh = mesh(new THREE.CylinderGeometry(0.23, 0.28, 1.05, 20), yoArmor, yo); thigh.position.set(yl * 0.53, -0.85, 0);
  var knee = mesh(new THREE.SphereGeometry(0.26, 20, 12), yoTrim, yo); knee.position.set(yl * 0.53, -1.4, 0.05);
  var shin = mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.72, 20), yoMetal, yo); shin.position.set(yl * 0.53, -1.78, 0);
  var foot = mesh(new THREE.BoxGeometry(0.62, 0.32, 1.05), yoArmor, yo); foot.position.set(yl * 0.53, -2.08, 0.22);
}
world.add(yo);

// CapCut boss: broad, angular and intentionally different from Yo.
var boss = new THREE.Group(), bossLeftArm, bossRightArm, bossHead;
var bossMetal = standard(0x1c1018, 0x3d0712, 0.32, 0.28, 0.9);
var bossArmor = standard(0x741426, RED, 0.5, 0.24, 0.86);
var bossTrim = standard(0x32151d, RED, 0.28, 0.26, 0.92);
var bossBody = mesh(new THREE.DodecahedronGeometry(1.45, 1), bossMetal, boss); positionMesh(bossBody, 0, 0.75, 0, 1.4, 1.35, 0.95);
var bossCore = mesh(new THREE.OctahedronGeometry(0.5, 1), standard(0x9b241f, ORANGE, 1.2, 0.2, 0.72), boss); bossCore.position.set(0, 1.05, 1.25);
bossHead = new THREE.Group(); bossHead.position.y = 3.05; bossHead.scale.set(0.92, 0.78, 0.9); boss.add(bossHead);
var bossSkull = mesh(new THREE.BoxGeometry(2.65, 1.45, 1.25, 3, 2, 2), bossMetal, bossHead);
var bossFace = mesh(new THREE.BoxGeometry(2.15, 0.82, 0.08), faceMaterial, bossHead); bossFace.position.set(0, 0.03, 0.67);
for (var be = -1; be <= 1; be += 2) {
  var bossEye = mesh(new THREE.BoxGeometry(0.55, 0.13, 0.08), glow(RED, 1), bossHead); bossEye.position.set(be * 0.53, 0.13, 0.74); bossEye.rotation.z = be * -0.18;
  var shoulder = mesh(new THREE.OctahedronGeometry(0.8, 1), bossTrim, boss); shoulder.position.set(be * 1.85, 1.65, 0);
  var horn = mesh(new THREE.ConeGeometry(0.24, 0.9, 8), bossArmor, bossHead); horn.position.set(be * 1.05, 1.0, 0); horn.rotation.z = be * -0.35;
}
bossLeftArm = makeArm(boss, -1.8, 1.55, bossMetal, bossTrim, true); bossRightArm = makeArm(boss, 1.8, 1.55, bossMetal, bossTrim, true);
for (var bp = -1; bp <= 1; bp += 2) {
  var bossChestPlate = mesh(new THREE.BoxGeometry(1.15, 0.78, 0.28), bossArmor, boss); bossChestPlate.position.set(bp * 0.62, 1.65, 1.0); bossChestPlate.rotation.z = bp * 0.15;
  var bossHipPlate = mesh(new THREE.BoxGeometry(0.72, 0.9, 0.35), bossArmor, boss); bossHipPlate.position.set(bp * 0.82, -0.45, 0.45); bossHipPlate.rotation.z = bp * 0.18;
}
for (var ba = 0; ba < 3; ba++) { var bossAbdomen = mesh(new THREE.BoxGeometry(1.25 - ba * 0.12, 0.26, 0.24), bossTrim, boss); bossAbdomen.position.set(0, 0.55 - ba * 0.34, 0.92); }
var bossPelvis = mesh(new THREE.DodecahedronGeometry(0.8, 1), bossMetal, boss); positionMesh(bossPelvis, 0, -0.65, 0, 1.2, 0.65, 0.85);
for (var bl = -1; bl <= 1; bl += 2) {
  var bossThigh = mesh(new THREE.CylinderGeometry(0.34, 0.4, 1.05, 12), bossArmor, boss); bossThigh.position.set(bl * 0.72, -0.85, 0);
  var bossKnee = mesh(new THREE.OctahedronGeometry(0.36, 1), bossTrim, boss); bossKnee.position.set(bl * 0.72, -1.42, 0.08);
  var bossShin = mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.72, 12), bossMetal, boss); bossShin.position.set(bl * 0.72, -1.8, 0);
  var bossFoot = mesh(new THREE.BoxGeometry(0.85, 0.36, 1.25), bossArmor, boss); bossFoot.position.set(bl * 0.72, -2.08, 0.22);
}
world.add(boss);

// Holographic widget shields and template projectiles.
var shields = new THREE.Group(); world.add(shields);
for (var sh = 0; sh < 3; sh++) {
  var panel = new THREE.Group(); panel.position.set(-2.25, 0.4 + sh * 1.25, (sh - 1) * 1.4); panel.rotation.y = 0.65; shields.add(panel);
  var pane = mesh(new THREE.ShapeGeometry(roundedRectShape(2.2, 0.95, 0.15), 8), glow(CYAN, 0.17), panel);
  var top = mesh(new THREE.BoxGeometry(2.2, 0.045, 0.04), glow(CYAN, 0.85), panel); top.position.y = 0.48;
  for (var wl = 0; wl < 4; wl++) { var line = mesh(new THREE.BoxGeometry(0.3 + wl * 0.3, 0.035, 0.03), glow(wl === 3 ? VIOLET : CYAN, 0.75), panel); line.position.set(-0.65 + wl * 0.15, 0.24 - wl * 0.16, 0.03); }
}
var hexShield = new THREE.Group(); world.add(hexShield);
var hexGeometry = new THREE.CylinderGeometry(2.25, 2.25, 4.7, 6, 1, true);
var hexVolume = mesh(hexGeometry, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), hexShield);
var hexEdges = new THREE.LineSegments(new THREE.EdgesGeometry(hexGeometry), new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending, depthWrite: false })); hexShield.add(hexEdges);
var hexFront = mesh(new THREE.TorusGeometry(2.25, 0.035, 6, 6), glow(CYAN, 0.9), hexShield); hexFront.rotation.y = Math.PI / 2;
hexShield.visible = false;
var bossCharge = mesh(new THREE.SphereGeometry(0.65, 28, 20), glow(RED, 0.75), world); bossCharge.visible = false;
var finisherSlash = mesh(new THREE.TorusGeometry(2.7, 0.12, 8, 64, Math.PI * 1.35), glow(CYAN, 0.9), world); finisherSlash.visible = false;
var TEMPLATE_COUNT = 20, templates = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.85, 0.12), standard(0x651325, RED, 1.5, 0.3, 0.5), TEMPLATE_COUNT); world.add(templates);

function makeBeam(color) {
  var b = mesh(new THREE.CylinderGeometry(0.055, 0.11, 1, 10), glow(color, 0.85), world);
  b.visible = false; return b;
}
var redBeams = [], cyanBeams = [];
for (var rb = 0; rb < 6; rb++) redBeams.push(makeBeam(RED));
for (var cb = 0; cb < 6; cb++) cyanBeams.push(makeBeam(CYAN));
var upAxis = new THREE.Vector3(0, 1, 0), beamDirection = new THREE.Vector3();
function setBeam(beam, ax, ay, az, bx, by, bz, width) {
  beam.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
  beamDirection.set(bx - ax, by - ay, bz - az);
  var length = beamDirection.length(); beamDirection.normalize();
  beam.quaternion.setFromUnitVectors(upAxis, beamDirection);
  beam.scale.set(width, length, width);
}

// Pac-Man geometry variants: actual missing wedge, not a flat sprite.
var pac = new THREE.Group(), pacVariants = []; world.add(pac);
var pacAngles = [0.06, 0.18, 0.34, 0.52, 0.7];
for (var pa = 0; pa < pacAngles.length; pa++) {
  var angle = pacAngles[pa];
  var pm = mesh(new THREE.SphereGeometry(1.55, 56, 36, angle, Math.PI * 2 - angle * 2), standard(0xd8a400, YELLOW, 0.55, 0.28, 0.55), pac);
  pm.visible = pa === 0; pacVariants.push(pm);
}
var pacRing = mesh(new THREE.TorusGeometry(1.63, 0.055, 8, 64), glow(CYAN, 0.72), pac); pacRing.rotation.x = Math.PI / 2;
var pacVisor = mesh(new THREE.BoxGeometry(1.25, 0.3, 0.12), standard(0x061222, 0x061222, 0.1, 0.25, 0.8), pac); pacVisor.position.set(0.28, 0.7, 1.29); pacVisor.rotation.z = -0.12;
var pacEye = mesh(new THREE.SphereGeometry(0.14, 16, 12), glow(CYAN, 0.95), pac); pacEye.position.set(0.62, 0.72, 1.4);
var pacCrest = mesh(new THREE.BoxGeometry(0.18, 0.62, 0.72), standard(0x5d3ee8, VIOLET, 0.8, 0.25, 0.65), pac); pacCrest.position.set(-0.15, 1.45, -0.15);

// Red ghost with a shaped/extruded body and 3D eyes.
var ghost = new THREE.Group(); world.add(ghost);
var ghostShape = new THREE.Shape();
ghostShape.moveTo(-1.25, -1.1); ghostShape.lineTo(-1.25, 0.25);
ghostShape.quadraticCurveTo(-1.25, 1.65, 0, 1.65); ghostShape.quadraticCurveTo(1.25, 1.65, 1.25, 0.25);
ghostShape.lineTo(1.25, -1.1); ghostShape.lineTo(0.72, -0.62); ghostShape.lineTo(0.25, -1.1);
ghostShape.lineTo(-0.25, -0.62); ghostShape.lineTo(-0.72, -1.1); ghostShape.closePath();
var ghostBody = mesh(new THREE.ExtrudeGeometry(ghostShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 3, curveSegments: 16 }), standard(0x650a20, RED, 0.55, 0.42, 0.45), ghost); ghostBody.position.z = -0.4;
for (var ge = -1; ge <= 1; ge += 2) {
  var gEye = mesh(new THREE.SphereGeometry(0.34, 20, 14), faceMaterial, ghost); positionMesh(gEye, ge * 0.48, 0.45, 0.56, 1.0, 0.58, 0.35);
  var gPupil = mesh(new THREE.SphereGeometry(0.12, 16, 10), glow(ORANGE, 0.95), ghost); gPupil.position.set(ge * 0.48 + 0.08, 0.42, 0.69);
}
var ghostCore = mesh(new THREE.OctahedronGeometry(0.4, 1), glow(RED, 0.8), ghost); ghostCore.position.set(0, -0.3, 0.65);

// Neon maze and pellet loop.
var maze = new THREE.Group(); world.add(maze);
var mazeFloor = mesh(new THREE.PlaneGeometry(30, 24), standard(0x050518, 0x090525, 0.55, 0.35, 0.65), maze); mazeFloor.rotation.x = -Math.PI / 2; mazeFloor.position.y = -1.7;
var mazeWallsData = [];
for (var mw = -9; mw <= 9; mw++) { mazeWallsData.push([mw * 1.4, -8.4]); mazeWallsData.push([mw * 1.4, 8.4]); }
for (var mz = -5; mz <= 5; mz++) { mazeWallsData.push([-12.6, mz * 1.4]); mazeWallsData.push([12.6, mz * 1.4]); }
for (var ix = -4; ix <= 4; ix++) for (var iz = -3; iz <= 3; iz++) {
  if ((ix * 2 + iz) % 3 === 0 && !(Math.abs(ix) === 4 && Math.abs(iz) < 2)) mazeWallsData.push([ix * 1.65, iz * 1.55]);
}
var mazeWalls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0x17134f, VIOLET, 1.5, 0.24, 0.62), mazeWallsData.length); maze.add(mazeWalls);
for (var mwi = 0; mwi < mazeWallsData.length; mwi++) {
  var md = mazeWallsData[mwi]; setMatrix(mazeWalls, mwi, md[0], -1.2, md[1], 0.28, 1.0, 1.15, 0, 0, 0);
  mazeWalls.setColorAt(mwi, tempColor.setHex(mwi % 7 === 0 ? CYAN : VIOLET));
}
mazeWalls.instanceMatrix.needsUpdate = true; if (mazeWalls.instanceColor) mazeWalls.instanceColor.needsUpdate = true;
var PELLET_COUNT = 96, pellets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 12, 8), glow(YELLOW, 0.95), PELLET_COUNT); maze.add(pellets);
function trackPosition(p) {
  var d = ((p % 1) + 1) % 1 * 40;
  if (d < 12) return { x: -6 + d, z: -4, angle: 0 };
  if (d < 20) return { x: 6, z: -4 + (d - 12), angle: -Math.PI / 2 };
  if (d < 32) return { x: 6 - (d - 20), z: 4, angle: Math.PI };
  return { x: -6, z: 4 - (d - 32), angle: Math.PI / 2 };
}
for (var pi = 0; pi < PELLET_COUNT; pi++) { var tp = trackPosition(pi / PELLET_COUNT); setMatrix(pellets, pi, tp.x, -0.65, tp.z, 1, 1, 1, 0, 0, 0); }
pellets.instanceMatrix.needsUpdate = true;

// Impact shards and expanding shockwaves.
var SHARD_COUNT = 180, shards = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), glow(WHITE, 0.8), SHARD_COUNT); world.add(shards);
for (var sci = 0; sci < SHARD_COUNT; sci++) shards.setColorAt(sci, tempColor.setHex(sci % 3 === 0 ? RED : (sci % 3 === 1 ? CYAN : VIOLET)));
if (shards.instanceColor) shards.instanceColor.needsUpdate = true;
var shockwaves = [];
for (var sw = 0; sw < 4; sw++) { var wave = mesh(new THREE.TorusGeometry(1, 0.035 + sw * 0.012, 8, 80), glow(sw % 2 ? RED : CYAN, 0.4), world); wave.visible = false; shockwaves.push(wave); }

// Victory podium and confetti.
var victoryGroup = new THREE.Group(); world.add(victoryGroup);
var podium = mesh(new THREE.CylinderGeometry(3.2, 3.8, 0.8, 64), standard(0x101a32, CYAN, 0.65, 0.2, 0.85), victoryGroup); podium.position.y = -1.8;
var podiumRing = mesh(new THREE.TorusGeometry(3.25, 0.1, 10, 96), glow(GREEN, 0.75), victoryGroup); podiumRing.rotation.x = Math.PI / 2; podiumRing.position.y = -1.37;
var victoryRings = [];
for (var vr = 0; vr < 3; vr++) { var vring = mesh(new THREE.TorusGeometry(3.7 + vr * 1.2, 0.06, 8, 96), glow(vr === 1 ? YELLOW : (vr === 2 ? GREEN : CYAN), 0.4), victoryGroup); vring.position.set(0, 2 + vr * 0.8, -3 - vr); vring.rotation.y = vr * 0.5; victoryRings.push(vring); }
var CONFETTI_COUNT = 180, confetti = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.25, 0.05), glow(WHITE, 0.8), CONFETTI_COUNT); world.add(confetti);
for (var cf = 0; cf < CONFETTI_COUNT; cf++) confetti.setColorAt(cf, tempColor.setHex([CYAN, VIOLET, YELLOW, GREEN, RED][cf % 5]));
if (confetti.instanceColor) confetti.instanceColor.needsUpdate = true;

function updateFighters(time, section, progress, attack, finisher, bass) {
  var versus = section === 'versus', duel = section === 'duel', overclock = section === 'overclock', showdown = section === 'showdown', ko = section === 'ko', victory = section === 'victory';
  yo.visible = versus || duel || showdown || ko || victory || (overclock && progress < 0.58);
  boss.visible = versus || duel || showdown || (ko && progress < 0.3) || (overclock && progress < 0.58);
  if (!yo.visible) return;
  var enter = versus ? out3(progress * 3) : 1;
  var dance = Math.sin(time * 7) * 0.06, phase = (time * 140 / 60 / 4) % 1;
  var morph = overclock ? clamp(progress / 0.58, 0, 1) : 0;
  yo.scale.setScalar((victory ? 0.75 : 0.9) * enter * (1 - morph * 0.9));
  boss.scale.setScalar((showdown ? 1.12 : 1) * enter * (ko ? 1 - progress * 0.7 : 1) * (1 - morph * 0.9));
  yo.position.set(victory ? 0 : (showdown ? -3.2 : -4), victory ? 0 : dance, 0);
  boss.position.set(showdown ? 3.4 : 4, -dance, ko ? progress * 1.5 : 0);
  yo.rotation.set(0, duel || showdown ? 1.05 : 0.35, 0);
  boss.rotation.set(0, duel || showdown ? -1.05 : -0.35, 0);
  if (versus && time > 21.3 && time < 24.0) {
    var circle = (time - 21.3) * 1.35;
    yo.position.set(-4 * Math.cos(circle), 0, 4 * Math.sin(circle));
    boss.position.set(4 * Math.cos(circle), 0, -4 * Math.sin(circle));
    yo.rotation.y = Math.atan2(boss.position.x - yo.position.x, boss.position.z - yo.position.z);
    boss.rotation.y = Math.atan2(yo.position.x - boss.position.x, yo.position.z - boss.position.z);
  }
  if (versus && time >= 12.2 && time < 15.8) yo.rotation.y = 0;
  if (versus && time >= 17.0 && time < 21.5) boss.rotation.y = 0;
  if (duel) {
    var dodge = Math.sin(clamp((phase - 0.38) / 0.38, 0, 1) * Math.PI);
    yo.position.z = dodge * 2.2; yo.position.y = -dodge * 0.35;
    yo.rotation.z = -dodge * 0.32; boss.rotation.z = phase > 0.76 ? -Math.sin((phase - 0.76) / 0.24 * Math.PI) * 0.22 : 0;
  }
  if (showdown) {
    var dash = inOut(seg(finisher, 0.35, 0.72));
    yo.position.x = lerp(-3.2, 8.5, dash); yo.position.z = -Math.sin(dash * Math.PI) * 1.5;
    yo.rotation.z = -Math.sin(dash * Math.PI) * 0.55;
    boss.rotation.z = -seg(finisher, 0.62, 0.85) * 0.65;
  }
  if (overclock) { yo.rotation.y = time * 4; boss.rotation.y = -time * 4; yo.rotation.z = morph * 0.5; boss.rotation.z = -morph * 0.5; }
  yoHead.rotation.y = Math.sin(time * 1.8) * 0.08; bossHead.rotation.y = Math.sin(time * 1.3) * 0.06;
  yoLeftArm.rotation.z = victory ? -2.65 : (duel && phase >= 0.42 && phase < 0.76 ? -1.25 : (duel || showdown ? -0.55 - attack * 0.65 : -0.25 + dance));
  yoRightArm.rotation.z = victory ? 0.45 : (duel && phase >= 0.42 && phase < 0.76 ? 1.25 : (duel || showdown ? 0.65 + attack * 0.75 : 0.25 - dance));
  yoLeftArm.rotation.x = showdown ? -finisher * 1.1 : 0; yoRightArm.rotation.x = showdown ? -finisher * 1.1 : 0;
  bossLeftArm.rotation.z = duel || showdown ? 0.5 + attack * 0.9 : 0.2;
  bossRightArm.rotation.z = duel || showdown ? -0.5 - attack * 0.9 : -0.2;
  yoCore.scale.setScalar(1 + bass * 0.5 + finisher * 0.7); bossCore.rotation.y = time * 2.2; bossCore.scale.setScalar(1 + attack * 0.5);
}

function updateCombat(time, beat, beatPhase, attack, finisher, visible) {
  var phase = (time * 140 / 60 / 4) % 1;
  var bossFire = phase > 0.18 && phase < 0.53;
  var defend = phase >= 0.42 && phase < 0.76;
  var counter = phase >= 0.76 || phase < 0.08;
  templates.visible = visible && bossFire; shields.visible = visible && counter;
  for (var i = 0; i < TEMPLATE_COUNT; i++) {
    var p = clamp((phase - 0.18) / 0.35 + i * 0.025, 0, 1);
    var x = boss.position.x - p * (boss.position.x - yo.position.x), y = 0.5 + (i % 4) * 0.65, z = yo.position.z + (rnd(i, 3) - 0.5) * 2;
    var s = visible && bossFire && i < 5 ? Math.sin(p * Math.PI) * 0.85 : 0;
    setMatrix(templates, i, x, y, z, s, s, s, p * 2, p * 3, p);
  }
  templates.instanceMatrix.needsUpdate = true;
  shields.position.set(yo.position.x + 2, yo.position.y + 0.4, yo.position.z);
  shields.children.forEach(function(panel, i) { panel.rotation.y = 0.65 + Math.sin(time * 2 + i) * 0.15; panel.scale.setScalar(0.85 + attack * 0.25); });
  hexShield.visible = visible && (defend || (finisher > 0 && finisher < 0.38));
  hexShield.position.set(yo.position.x, yo.position.y + 1, yo.position.z);
  hexShield.rotation.y = time * 0.32;
  hexShield.scale.setScalar(0.82 + Math.sin(clamp((phase - 0.42) / 0.34, 0, 1) * Math.PI) * 0.18 + finisher * 0.15);
  hexEdges.material.opacity = 0.55 + attack * 0.4;
  for (var r = 0; r < redBeams.length; r++) {
    var active = visible && bossFire && r < 3;
    redBeams[r].visible = active;
    if (active) setBeam(redBeams[r], boss.position.x - 0.8, 1.1 + r * 0.42, boss.position.z, yo.position.x + 0.8, 0.8 + (r % 2) * 0.6, yo.position.z + (r - 1) * 0.35, 0.65 + attack * 0.45);
  }
  for (var c = 0; c < cyanBeams.length; c++) {
    var counterActive = visible && counter && c < 4;
    cyanBeams[c].visible = counterActive;
    if (counterActive) setBeam(cyanBeams[c], yo.position.x + 0.8, 1.0 + c * 0.32, yo.position.z, boss.position.x - 0.8, 1.0 + (c % 3) * 0.55, boss.position.z + (c - 2) * 0.25, 0.65 + attack * 0.45);
  }
  if (visible && finisher > 0.35 && finisher < 0.76) {
    for (var d = 0; d < cyanBeams.length; d++) {
      cyanBeams[d].visible = d < 6;
      if (d < 6) setBeam(cyanBeams[d], yo.position.x - 5.5, 0.4 + d * 0.36, yo.position.z + (d - 3) * 0.12, yo.position.x - 0.4, 0.7 + d * 0.3, yo.position.z, 0.45 + attack * 0.35);
    }
  }
  bossCharge.visible = visible && finisher > 0.02 && finisher < 0.62;
  if (bossCharge.visible) { bossCharge.position.set(boss.position.x - 1.2, boss.position.y + 1.2, boss.position.z); bossCharge.scale.setScalar(0.4 + finisher * 2.5 + Math.sin(time * 16) * 0.12); }
  finisherSlash.visible = visible && finisher > 0.58;
  if (finisherSlash.visible) { finisherSlash.position.set(boss.position.x, boss.position.y + 1.1, boss.position.z + 0.5); finisherSlash.rotation.set(0.3, 0.4, -0.8 + finisher * 1.6); finisherSlash.scale.setScalar(0.6 + finisher * 0.9); }
}

function updatePac(time, progress, chomp, bass, overclock) {
  var p = time * 0.055 + 0.12;
  var pos = trackPosition(p), gp = trackPosition(p + 0.16 + Math.sin(time * 0.3) * 0.015);
  var morph = overclock ? inOut(seg(progress, 0.28, 0.88)) : 1;
  var born = overclock ? out3(seg(progress, 0.18, 0.45)) : 1;
  pac.position.set(lerp(-4, pos.x, morph), lerp(0, -0.05 + Math.sin(time * 8) * 0.08, morph), lerp(0, pos.z, morph));
  ghost.position.set(lerp(4, gp.x, morph), lerp(0, 0.1 + Math.sin(time * 6) * 0.18, morph), lerp(0, gp.z, morph));
  pac.rotation.y = lerp(time * 3, Math.atan2(-(ghost.position.z - pac.position.z), ghost.position.x - pac.position.x) + Math.PI, morph);
  ghost.rotation.y = lerp(-time * 3, gp.angle, morph);
  pac.scale.setScalar(born * (0.9 + bass * 0.12)); ghost.scale.setScalar(born * (0.9 + Math.sin(time * 5) * 0.04));
  var mouthIndex = Math.min(pacVariants.length - 1, Math.floor(clamp(chomp, 0, 0.999) * pacVariants.length));
  for (var i = 0; i < pacVariants.length; i++) pacVariants[i].visible = i === mouthIndex;
  pacRing.rotation.z = time * 0.8; ghostCore.rotation.y = time * 2.5;
  for (var j = 0; j < PELLET_COUNT; j++) {
    var pellet = trackPosition(j / PELLET_COUNT);
    var distance = (j / PELLET_COUNT - (p % 1) + 1) % 1;
    var eaten = distance > 0.94 ? 0.05 : 1;
    var pulse = eaten * (0.75 + bass * 0.65 + (j % 8 === 0 ? 0.6 : 0));
    setMatrix(pellets, j, pellet.x, -0.65, pellet.z, pulse, pulse, pulse, 0, 0, 0);
  }
  pellets.instanceMatrix.needsUpdate = true;
}

function updateEffects(frame, time, beatPhase, impact, section, progress, finisher) {
  var active = section === 'duel' || section === 'showdown' || section === 'ko' || section === 'overclock';
  shards.visible = active;
  if (active) {
    var phase = section === 'ko' ? clamp(progress * 1.4, 0, 1) : (section === 'overclock' ? clamp(progress * 1.2, 0, 1) : beatPhase);
    for (var i = 0; i < SHARD_COUNT; i++) {
      var originX = section === 'duel' ? -2.5 : (section === 'overclock' ? (i % 2 === 0 ? -4 : 4) : 2.5);
      var angle = rnd(i, 1) * Math.PI * 2, elevation = rnd(i, 2) * Math.PI - Math.PI / 2;
      var distance = (0.5 + rnd(i, 3) * 8) * phase;
      var x = originX + Math.cos(angle) * Math.cos(elevation) * distance;
      var y = 0.8 + Math.sin(elevation) * distance + phase * phase * 2;
      var z = Math.sin(angle) * Math.cos(elevation) * distance;
      var scale = (1 - phase) * (0.35 + impact * 1.4 + finisher * 0.5) * (section === 'ko' ? 1.8 : 1);
      setMatrix(shards, i, x, y, z, scale, scale, scale, phase * 4 + i, phase * 3, phase * 2);
    }
    shards.instanceMatrix.needsUpdate = true;
  }
  for (var w = 0; w < shockwaves.length; w++) {
    var wave = shockwaves[w]; wave.visible = active || section === 'victory';
    var wp = section === 'victory' ? (time * 0.22 + w / 4) % 1 : (beatPhase + w / 4) % 1;
    wave.position.set(section === 'duel' ? -2.5 : (section === 'victory' ? 0 : 2.5), 0.8, 0);
    wave.scale.setScalar(1 + wp * (section === 'ko' ? 13 : 7));
    wave.material.opacity = (1 - wp) * (section === 'victory' ? 0.2 : 0.5);
    wave.rotation.set(w % 2 ? Math.PI / 2 : 0, w * 0.35, 0);
  }
}

function updateConfetti(time, visible) {
  confetti.visible = visible; if (!visible) return;
  for (var i = 0; i < CONFETTI_COUNT; i++) {
    var x = (rnd(i, 1) - 0.5) * 18, z = (rnd(i, 2) - 0.5) * 12 - 2;
    var y = 10 - ((time * (0.8 + rnd(i, 3)) + rnd(i, 4) * 14) % 14);
    setMatrix(confetti, i, x, y, z, 1, 1, 1, time * 2 + i, time + i * 0.4, time * 1.3 + i);
  }
  confetti.instanceMatrix.needsUpdate = true;
}

function shot(x, y, z, tx, ty, tz, fov) {
  camera.position.set(x, y, z); cameraTarget.set(tx, ty, tz); camera.lookAt(cameraTarget);
  camera.fov = fov || 44; camera.updateProjectionMatrix();
}

function renderFrame(frame, fps, params) {
  var time = params.time === undefined ? frame / fps : params.time;
  var section = params.section || 'boot', progress = params.sectionProgress || 0;
  var beat = params.beat || 0, beatPhase = params.beatPhase || 0, beatPulse = params.beatPulse || 0;
  var bass = params.bass || 0, high = params.high || 0, impact = params.impact || 0;
  var attack = params.attack || 0, chomp = params.chomp || 0, finisher = params.finisher || 0;
  var isPac = section === 'overclock' || section === 'chase';
  world.background.setHex(isPac ? 0x050316 : (section === 'victory' ? 0x020b10 : 0x02030a));
  world.fog.color.copy(world.background); world.fog.density = isPac ? 0.026 : 0.02;
  stars.rotation.y = time * 0.012; stars.rotation.z = Math.sin(time * 0.08) * 0.03;
  arena.visible = !isPac || (section === 'overclock' && progress < 0.62);
  maze.visible = isPac;
  pac.visible = section === 'chase' || (section === 'overclock' && progress > 0.2);
  ghost.visible = section === 'chase' || (section === 'overclock' && progress > 0.28);
  victoryGroup.visible = section === 'victory';
  halo.visible = (!isPac || (section === 'overclock' && progress < 0.4)) && section !== 'duel' && section !== 'showdown' && section !== 'ko'; halo2.visible = halo.visible;
  halo.rotation.z = time * 0.12; halo2.rotation.z = -time * 0.18;
  for (var ar = 0; ar < arenaRings.length; ar++) { arenaRings[ar].rotation.z = time * (ar % 2 ? -0.05 : 0.06); arenaRings[ar].scale.setScalar(1 + beatPulse * 0.025 + bass * 0.02); }
  columns.scale.y = (1 + bass * 0.035) * (section === 'overclock' ? 1 - out3(seg(progress, 0.1, 0.6)) : 1);
  mazeWalls.scale.y = section === 'overclock' ? out3(seg(progress, 0.12, 0.58)) : 1;
  updateFighters(time, section, progress, attack, finisher, bass);
  updateCombat(time, beat, beatPhase, attack, finisher, section === 'duel' || section === 'showdown');
  if (isPac) updatePac(time, progress, chomp, bass, section === 'overclock');
  updateEffects(frame, time, beatPhase, impact, section, progress, finisher);
  updateConfetti(time, section === 'victory');
  for (var vr = 0; vr < victoryRings.length; vr++) { victoryRings[vr].rotation.z = time * (0.12 + vr * 0.05); victoryRings[vr].rotation.y = Math.sin(time * 0.2 + vr) * 0.6; }
  cyanLight.intensity = 32 + bass * 52 + beatPulse * 24; redLight.intensity = section === 'victory' ? 0 : 32 + attack * 52 + beatPulse * 22;
  violetLight.intensity = 26 + high * 34;
  var shake = impact * 0.1 + finisher * 0.05;
  var sx = Math.sin(frame * 2.17) * shake, sy = Math.cos(frame * 1.73) * shake;
  if (section === 'boot') shot(Math.sin(time * 0.25) * 4 + sx, 4.2, 19 - out3(progress) * 6, 0, 0.8, -2, 46 - progress * 4);
  else if (section === 'versus') {
    if (time >= 12.2 && time < 15.8) {
      var yoOrbit = 0.45 + (time - 12.2) * 1.65;
      shot(yo.position.x + Math.sin(yoOrbit) * 4.8, 3.3, yo.position.z + Math.cos(yoOrbit) * 4.8, yo.position.x, 1.15, yo.position.z, 42);
    } else if (time >= 15.8 && time < 17.0) {
      var whip = inOut(seg(time, 15.8, 17.0));
      shot(lerp(-0.2, 7.8, whip), 3.5, lerp(4.2, 5.0, whip), lerp(-4, 4, whip), 1.15, 0, 43);
    } else if (time >= 17.0 && time < 21.5) {
      var bossOrbit = -0.35 + (time - 17.0) * 1.55;
      shot(boss.position.x + Math.sin(bossOrbit) * 5.2, 3.6, boss.position.z + Math.cos(bossOrbit) * 5.2, boss.position.x, 1.25, boss.position.z, 42);
    } else {
      var angle = time * 0.18; shot(Math.sin(angle) * 10 + sx, 4.3 + sy, 14 + Math.cos(angle) * 2, 0, 1.0, 0, 47);
    }
  }
  else if (section === 'duel') {
    if (params.cameraShot === 'duelSide') shot(-9 + sx, 3.6 + sy, 9.5, 0, 0.8, 0, 44);
    else if (params.cameraShot === 'duelOrbit') { var da = time * 0.4; shot(Math.sin(da) * 10 + sx, 4.0 + sy, Math.cos(da) * 10, 0, 0.9, 0, 44); }
    else shot(7 + sx, 3.6 + sy, 11.5, 0, 0.9, 0, 43);
  } else if (section === 'overclock') {
    var pp = trackPosition(time * 0.055 + 0.12);
    if (progress < 0.25) { var oa = progress * 8; shot(-4 + Math.sin(oa) * 5, 3.3, Math.cos(oa) * 5, -4, 1.0, 0, 43); }
    else if (progress < 0.72) shot(0, 17 - progress * 4, 12, 0, -0.6, 0, 48);
    else shot(pp.x + 7 + sx, 5 + sy, pp.z + 10, pp.x, 0, pp.z, 46);
  }
  else if (section === 'chase') {
    var cp = trackPosition(time * 0.055 + 0.12);
    var cg = trackPosition(time * 0.055 + 0.12 + 0.16 + Math.sin(time * 0.3) * 0.015);
    var mx = (cp.x + cg.x) * 0.5, mz = (cp.z + cg.z) * 0.5;
    if (params.cameraShot === 'mazeTop') shot(mx * 0.2 + sx, 21 + sy, 7, mx * 0.3, -0.4, mz * 0.2, 46);
    else shot(mx + 7 + sx, 7.5 + sy, mz + 12, mx, 0, mz, 47);
  } else if (section === 'showdown') {
    if (finisher < 0.35) shot(boss.position.x + 4.5, 3.4, 7.5, boss.position.x, 1.2, 0, 43);
    else if (finisher < 0.72) shot(0, 3.5, 13, yo.position.x * 0.35, 1.0, 0, 45);
    else shot(2.5, 4.5, 17, 2.2, 1.0, 0, 48);
  }
  else if (section === 'ko') shot(5 + sx * 3, 3 + sy * 3, 11 - progress * 3, 0.8, 1, 0, 46 - progress * 5);
  else { var va = time * 0.13; shot(Math.sin(va) * 6, 4.3, 14 + Math.cos(va) * 2, 0, 1.8, -1, 43); }
  camera.zoom = 1 + bass * 0.025 + impact * 0.025 + finisher * 0.08; camera.updateProjectionMatrix();
  camera.rotation.z += Math.sin(frame * 0.7) * (params.glitch || 0) * 0.012;
  renderer.toneMappingExposure = 0.84 + bass * 0.1 + beatPulse * 0.05 + (section === 'ko' ? (1 - progress) * 0.24 : 0);
  renderer.render(world, camera);
}

function handleEvent(action, payload) {
  if (action !== 'yoclip.frame') return;
  payload = payload || {};
  var nextW = Math.max(1, Math.round(payload.width || W)), nextH = Math.max(1, Math.round(payload.height || H));
  if (nextW !== W || nextH !== H) { W = nextW; H = nextH; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
  FPS = payload.fps || FPS;
  var frame = Math.max(0, Math.round(payload.frame || 0));
  renderFrame(frame, FPS, payload.params || {});
  jsr.render({ type: 'three', canvasId: 'main', width: W, height: H, pixelRatio: RENDER_SCALE });
  jsr.exportState({ renderer: 'THREE r186', backend: 'Flutter GPU', frame: frame, section: (payload.params || {}).section || 'boot', supersampling: RENDER_SCALE });
}
jsr.onEvent(handleEvent);
console.log('LEVEL UP — boss-fight world ready / deterministic 140 BPM');
