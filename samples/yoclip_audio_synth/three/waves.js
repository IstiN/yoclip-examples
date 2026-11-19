// NEON DAWN — deterministic native Three.js synth ocean.
// No imports, browser clocks, addons or unseeded randomness: every animated
// value is an absolute function of the master frame supplied by YoClip.
var WIDTH = 1920;
var HEIGHT = 1080;
var canvas = jsr.three.createCanvas('main', {
  width: WIDTH,
  height: HEIGHT,
  pixelRatio: 1,
});
var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: false });
renderer.setPixelRatio(1);
renderer.setSize(WIDTH, HEIGHT, false);

var world = new THREE.Scene();
world.background = new THREE.Color('#080812');
world.fog = new THREE.FogExp2('#080812', 0.032);
var camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 120);

var cyan = new THREE.Color('#22d3ee');
var violet = new THREE.Color('#7c3aed');
var ice = new THREE.Color('#d9faff');
// Exact mirrors of the 14 arpeggio steps and five kicks in stinger.scene.js.
var noteTimes = [
  2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50,
  3.75, 4.00, 4.25, 4.50, 4.75, 5.00, 5.25,
];
var notePans = [
  -0.55, 0.50, -0.40, 0.40, -0.25, 0.25, -0.50,
  0.50, -0.35, 0.35, -0.20, 0.20, -0.45, 0.45,
];
var kickTimes = [2.0, 3.0, 4.0, 5.0, 6.0];

// A fixed-seed PRNG is used only while constructing the star field.
var seed = 0x4e454f4e;
function random01() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}
function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
function pulseAt(time, start, decay) {
  var dt = time - start;
  return dt >= 0 ? Math.exp(-dt * decay) : 0;
}
function musicEnergy(time) {
  var base;
  if (time < 2.0) {
    // RISER: a slow swell accelerates into the 2 s drop.
    var rise = clamp01(time / 2.0);
    base = 0.12 + 0.52 * rise * rise;
  } else if (time < 5.5) {
    // GROOVE: a stable floor leaves headroom for notes and kicks.
    base = 0.30;
  } else {
    // TAIL: the final bell and last kick fade into a calm ocean.
    base = 0.22 - 0.16 * clamp01((time - 5.5) / 2.5);
  }
  var impact = pulseAt(time, 2.0, 3.0);
  var notes = 0;
  var kicks = 0;
  for (var i = 0; i < noteTimes.length; i++) {
    notes += 0.26 * pulseAt(time, noteTimes[i], 10.0);
  }
  for (var k = 0; k < kickTimes.length; k++) {
    var kickGain = k === kickTimes.length - 1 ? 0.22 : 0.38;
    kicks += kickGain * pulseAt(time, kickTimes[k], 7.0);
  }
  var tailBell = 0.22 * pulseAt(time, 5.5, 1.4);
  var fade = time > 7.3 ? clamp01((8.0 - time) / 0.7) : 1;
  return Math.min(1.65, (base + impact * 0.95 + notes + kicks + tailBell) * fade);
}

// Cyan-to-violet wireframe terrain. Geometry is rotated once; animation only
// rewrites Y, so arbitrary seeks and sequential exports produce equal frames.
var terrainGeometry = new THREE.PlaneGeometry(34, 24, 96, 48);
terrainGeometry.rotateX(-Math.PI / 2);
var terrainPosition = terrainGeometry.attributes.position;
var vertexCount = terrainPosition.count;
var baseX = new Float32Array(vertexCount);
var baseZ = new Float32Array(vertexCount);
var terrainColors = new Float32Array(vertexCount * 3);
var color = new THREE.Color();
for (var v = 0; v < vertexCount; v++) {
  baseX[v] = terrainPosition.getX(v);
  baseZ[v] = terrainPosition.getZ(v);
  var mix = clamp01((baseZ[v] + 12) / 24);
  color.copy(cyan).lerp(violet, 0.12 + mix * 0.82);
  color.toArray(terrainColors, v * 3);
}
terrainGeometry.setAttribute('color', new THREE.BufferAttribute(terrainColors, 3));
var terrainMaterial = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  vertexColors: true,
  wireframe: true,
  transparent: true,
  opacity: 0.48,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
var terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.position.z = -3;
world.add(terrain);

// A faint violet echo under the principal grid gives the ocean neon depth.
var echoMaterial = new THREE.MeshBasicMaterial({
  color: '#7c3aed',
  wireframe: true,
  transparent: true,
  opacity: 0.13,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
var terrainEcho = new THREE.Mesh(terrainGeometry, echoMaterial);
terrainEcho.position.set(0, -0.08, -3.02);
terrainEcho.scale.set(1.006, 1, 1.006);
world.add(terrainEcho);

// Seeded drifting star field, split across the brand palette.
var starCount = 850;
var starPositions = new Float32Array(starCount * 3);
var starColors = new Float32Array(starCount * 3);
for (var s = 0; s < starCount; s++) {
  starPositions[s * 3] = (random01() - 0.5) * 76;
  starPositions[s * 3 + 1] = 0.6 + random01() * 23;
  starPositions[s * 3 + 2] = 5 - random01() * 62;
  color.copy(s % 5 === 0 ? ice : (s % 2 === 0 ? cyan : violet));
  color.multiplyScalar(0.55 + random01() * 0.45);
  color.toArray(starColors, s * 3);
}
var starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
var starMaterial = new THREE.PointsMaterial({
  size: 0.105,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.78,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  fog: false,
});
var stars = new THREE.Points(starGeometry, starMaterial);
world.add(stars);

// Three hairline torus rings form a luminous sound portal above the horizon.
var rings = [];
var ringRadii = [2.35, 3.15, 4.05];
for (var r = 0; r < ringRadii.length; r++) {
  var ringMaterial = new THREE.MeshBasicMaterial({
    color: r === 1 ? '#7c3aed' : '#22d3ee',
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
  });
  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(ringRadii[r], 0.038 + r * 0.006, 8, 160),
    ringMaterial
  );
  ring.position.set(0, 2.1, -9.5 - r * 0.12);
  ring.rotation.z = r * 0.32;
  rings.push(ring);
  world.add(ring);
}

jsr.onEvent(function(action, payload) {
  if (action !== 'yoclip.frame') return;
  payload = payload || {};
  var frame = Math.max(0, Math.round(payload.frame || 0));
  var fps = payload.fps || 30;
  var time = frame / fps;
  var energy = musicEnergy(time);
  var impact = pulseAt(time, 2.0, 3.0);
  var notePulse = 0;
  for (var n = 0; n < noteTimes.length; n++) {
    notePulse = Math.max(notePulse, pulseAt(time, noteTimes[n], 10.0));
  }

  for (var i = 0; i < vertexCount; i++) {
    var x = baseX[i];
    var z = baseZ[i];
    var traveling = Math.sin(x * 0.66 + z * 0.34 - time * 2.5) * 0.34;
    traveling += Math.sin(z * 0.88 - time * 1.7 + Math.sin(x * 0.21) * 0.8) * 0.24;
    var y = traveling * (0.30 + energy * 1.12);
    y += Math.sin(x * 0.18 + z * 0.25 - time * 1.2) * energy * 0.22;

    // Each kick launches an expanding radial ripple from the impact point.
    for (var k = 0; k < kickTimes.length; k++) {
      var kickDt = time - kickTimes[k];
      if (kickDt >= 0 && kickDt < 1.45) {
        var dx = x;
        var dz = z - 1.5;
        var distance = Math.sqrt(dx * dx + dz * dz);
        var radius = kickDt * 10.0;
        var band = distance - radius;
        y += Math.sin(band * 2.8) * Math.exp(-(band * band) / (0.32 + kickDt * 0.42))
          * Math.exp(-kickDt * 1.5) * 1.75
          * (k === kickTimes.length - 1 ? 0.55 : 1.0);
      }
    }

    // Arpeggio steps light local spikes at their soundtrack pan positions.
    for (var a = 0; a < noteTimes.length; a++) {
      var noteDt = time - noteTimes[a];
      if (noteDt >= 0 && noteDt < 0.55) {
        var nx = x - notePans[a] * 18;
        var nz = z - (-2.5 + a * 0.9);
        var gaussian = Math.exp(-(nx * nx + nz * nz) / 4.0);
        y += gaussian * Math.exp(-noteDt * 6.0) * (0.72 + a * 0.075);
      }
    }
    terrainPosition.setY(i, y);
  }
  terrainPosition.needsUpdate = true;
  terrainMaterial.opacity = Math.min(0.78, 0.40 + energy * 0.22);
  echoMaterial.opacity = Math.min(0.20, 0.06 + energy * 0.06);

  var portalPulse = 1 + impact * 0.18 + notePulse * 0.065;
  for (var q = 0; q < rings.length; q++) {
    var ringScale = portalPulse + energy * (0.018 + q * 0.012);
    rings[q].scale.set(ringScale, ringScale, ringScale);
    rings[q].rotation.z = q * 0.32 + time * (q % 2 === 0 ? 0.075 : -0.06);
    rings[q].rotation.x = -0.12 + Math.sin(time * 0.35 + q) * 0.025;
    rings[q].position.y = 2.1 + Math.sin(time * 0.8 + q * 0.5) * 0.09;
    rings[q].material.opacity = Math.min(0.92,
      0.23 + energy * 0.15 + impact * (0.32 - q * 0.045) + notePulse * 0.12);
  }

  stars.rotation.y = Math.sin(time * 0.16) * 0.045;
  stars.position.set(Math.sin(time * 0.17) * 0.7, Math.sin(time * 0.23) * 0.16, 0);
  starMaterial.opacity = Math.min(0.98, 0.68 + energy * 0.17);
  starMaterial.size = 0.095 + energy * 0.024;

  var orbit = time * 0.027;
  var riserDolly = 1.1 * (1 - clamp01(time / 2.0));
  var tailDrift = 0.6 * clamp01((time - 5.5) / 2.5);
  var cameraRadius = 13.2 + riserDolly + tailDrift;
  camera.position.set(Math.sin(orbit) * cameraRadius,
    5.8 + impact * 0.35, Math.cos(orbit) * cameraRadius);
  camera.lookAt(0, 0.25, -3.2);
  renderer.render(world, camera);
  jsr.render({
    type: 'three',
    canvasId: 'main',
    width: WIDTH,
    height: HEIGHT,
    pixelRatio: 1,
  });
});
