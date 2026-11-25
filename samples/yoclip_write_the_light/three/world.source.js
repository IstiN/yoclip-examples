// WRITE THE LIGHT — editable source. Build the production IIFE with
// `npm run build:three` (FXAA on); YOCLIP_FXAA=0 selects direct A/B output.
// No browser, DOM, RAF or wall clock. YoClip supplies one master frame event.
import { EffectComposer, RenderPass, ShaderPass, OutputPass, FXAAShader } from './addons_bundle.js';

var W = 1920, H = 1080, FPS = 30, MASTER_FPS = 30, RENDER_SCALE = 3, USE_FXAA = __YOCLIP_FXAA__;
var OUTPUT_PASS_ONLY = __YOCLIP_OUTPUT_ONLY__;
var TWO_PI = Math.PI * 2;
// Before the first master frame the effective output is unknown, so attach a
// harmless 1× surface. The desired DPR is applied only in the first payload;
// this avoids a transient 3×→1× resize on 8K engines.
var hasMasterFrame = false;
// The project loader publishes the effective format before world evaluation.
// Use it immediately so a native 8K master creates one 7680×4320 surface
// instead of briefly creating a 3× surface that no backend can materialize.
var projectFormat = (typeof yoclipFormat !== 'undefined' && yoclipFormat) || {};
W = Math.max(1, Math.round(Number(projectFormat.width) || W));
H = Math.max(1, Math.round(Number(projectFormat.height) || H));
// Native R1 has no MSAA. Render at 3× and average-downsample in the export
// composite; 4K/8K exports are already target-native, so do not oversubscribe
// the GPU surface there. Higher DPR currently stalls native presentation readback.
function outputPixelRatio(width) {
  if (!hasMasterFrame) return 1;
  return width >= 3840 ? 1 : RENDER_SCALE;
}
var canvas = jsr.three.createCanvas('main', { width: W, height: H, pixelRatio: outputPixelRatio(W) });
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(outputPixelRatio(W));
renderer.setSize(W, H, false);
// The scene graph owns camera/exposure per frame. Composer output must keep
// the same color path on every frame instead of using the WebGLRenderer
// constructor defaults.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMappingExposure = 1.0;

var world = new THREE.Scene();
world.background = new THREE.Color(0x05050a);
world.fog = new THREE.FogExp2(0x05050a, 0.017);
var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 180);
var cameraTarget = new THREE.Vector3();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.set(0, 0, 15);

var fxaaComposer = null, fxaaPass = null;
function resizeFxaa(width, height) {
  if (!fxaaComposer) return;
  var pixelRatio = renderer.getPixelRatio();
  fxaaComposer.setSize(width, height);
  fxaaPass.uniforms.resolution.value.set(
    1 / Math.max(1, Math.floor(width * pixelRatio)),
    1 / Math.max(1, Math.floor(height * pixelRatio))
  );
}
function ensureFxaaComposer() {
  if (!USE_FXAA || fxaaComposer) return;
  var composerSize = renderer.getSize(new THREE.Vector2());
  var composerTarget = new THREE.WebGLRenderTarget(
    Math.max(1, composerSize.x | 0), Math.max(1, composerSize.y | 0),
    { type: THREE.UnsignedByteType }
  );
  fxaaComposer = new EffectComposer(renderer, composerTarget);
  fxaaComposer.addPass(new RenderPass(world, camera));
  fxaaComposer.addPass(new OutputPass());
  // Passing an existing material avoids the addon clone path, which cannot
  // resolve the imported FXAAShader binding in this direct engine.run bundle.
  var fxaaMaterial = new THREE.ShaderMaterial({
    name: FXAAShader.name,
    defines: Object.assign({}, FXAAShader.defines),
    uniforms: FXAAShader.uniforms,
    vertexShader: FXAAShader.vertexShader,
    fragmentShader: FXAAShader.fragmentShader,
  });
  fxaaPass = new ShaderPass(fxaaMaterial);
  fxaaPass.enabled = !OUTPUT_PASS_ONLY;
  fxaaComposer.addPass(fxaaPass);
  resizeFxaa(composerSize.x, composerSize.y);
}

var VIOLET = 0x7c3aed, LILAC = 0xa78bfa, CYAN = 0x22d3ee;
var WHITE = 0xf8f7ff, INK = 0x05050a, ORANGE = 0xff5a36, LIME = 0xc7f464;
var dummy = new THREE.Object3D(), tempColor = new THREE.Color();

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
function out3(t) { var u = 1 - clamp(t, 0, 1); return 1 - u * u * u; }
function inOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function rnd(i, salt) { var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233) * 43758.5453; return x - Math.floor(x); }
function standard(color, emissive, intensity, roughness, metalness) {
  return new THREE.MeshStandardMaterial({
    color: color, emissive: emissive || 0, emissiveIntensity: intensity || 0,
    roughness: roughness === undefined ? 0.35 : roughness,
    metalness: metalness === undefined ? 0.55 : metalness,
  });
}
function glow(color, opacity) {
  return new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false });
}
function makeRadialTexture() {
  var data = new Uint8Array(64 * 64 * 4);
  for (var y = 0; y < 64; y++) for (var x = 0; x < 64; x++) {
    var dx = (x - 31.5) / 31.5, dy = (y - 31.5) / 31.5;
    var falloff = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
    var index = (y * 64 + x) * 4, alpha = Math.round(Math.pow(falloff, 2.2) * 255);
    data[index] = 255; data[index + 1] = 255; data[index + 2] = 255; data[index + 3] = alpha;
  }
  var texture = new THREE.DataTexture(data, 64, 64, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter; texture.needsUpdate = true;
  return texture;
}
var radialTexture = makeRadialTexture();
function softGlow(color, opacity) {
  return new THREE.MeshBasicMaterial({ color: color, map: radialTexture, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false });
}
function makeAsphaltTexture() {
  var data = new Uint8Array(128 * 128 * 4);
  for (var i = 0; i < 128 * 128; i++) {
    var value = 105 + Math.floor(rnd(i, 207) * 55), index = i * 4;
    data[index] = value; data[index + 1] = value; data[index + 2] = value + 3; data[index + 3] = 255;
  }
  var texture = new THREE.DataTexture(data, 128, 128, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(5, 60);
  texture.minFilter = THREE.LinearMipmapLinearFilter; texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = true; texture.needsUpdate = true;
  return texture;
}
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
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

world.add(new THREE.HemisphereLight(0xaab4ff, 0x080810, 0.75));
var key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(3, 6, 8); world.add(key);
key.castShadow = true;
key.shadow.mapSize.width = 2048; key.shadow.mapSize.height = 2048;
key.shadow.camera.left = -18; key.shadow.camera.right = 18;
key.shadow.camera.top = 18; key.shadow.camera.bottom = -18;
key.shadow.camera.near = 1; key.shadow.camera.far = 60;
key.shadow.bias = -0.0008; key.shadow.normalBias = 0.03; key.shadow.radius = 3.0;
key.shadow.camera.updateProjectionMatrix();
key.target.position.set(0, 0, -8); world.add(key.target);
var violetLight = new THREE.PointLight(VIOLET, 52, 34, 2); world.add(violetLight);
var cyanLight = new THREE.PointLight(CYAN, 58, 32, 2); world.add(cyanLight);
var orangeLight = new THREE.PointLight(ORANGE, 0, 25, 2); world.add(orangeLight);
// A neutral travelling key separates the red bodywork from the neon city.
var carKey = new THREE.PointLight(0xfff4e8, 34, 18, 2); carKey.visible = false; world.add(carKey);

// Quiet depth field.
var STAR_COUNT = 650, starPositions = new Float32Array(STAR_COUNT * 3), starColors = new Float32Array(STAR_COUNT * 3);
for (var si = 0; si < STAR_COUNT; si++) {
  var sr = 10 + rnd(si, 1) * 58, sa = rnd(si, 2) * Math.PI * 2;
  starPositions[si * 3] = Math.cos(sa) * sr;
  starPositions[si * 3 + 1] = (rnd(si, 3) - 0.5) * 38;
  starPositions[si * 3 + 2] = Math.sin(sa) * sr - 16;
  tempColor.setHex(si % 9 === 0 ? ORANGE : (si % 4 === 0 ? CYAN : WHITE));
  var sb = 0.2 + rnd(si, 4) * 0.55;
  starColors[si * 3] = tempColor.r * sb; starColors[si * 3 + 1] = tempColor.g * sb; starColors[si * 3 + 2] = tempColor.b * sb;
}
var starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
var stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.045, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
world.add(stars);

// Yo — the film's recurring character.
var bot = new THREE.Group(); world.add(bot);
var botBody = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.25, 1.6, 0.38), { depth: 0.44, bevelEnabled: true, bevelSegments: 6, bevelSize: 0.08, bevelThickness: 0.07, curveSegments: 20 }), standard(VIOLET, VIOLET, 0.22, 0.38, 0.48), bot);
var face = mesh(new THREE.ShapeGeometry(roundedRectShape(1.78, 1.08, 0.18), 16), new THREE.MeshBasicMaterial({ color: 0x08080d }), bot); face.position.set(0, 0.05, 0.54);
var eyeGeo = new THREE.ShapeGeometry(roundedRectShape(0.2, 0.32, 0.045), 10);
var eyeMat = new THREE.MeshBasicMaterial({ color: CYAN });
var eyeL = mesh(eyeGeo, eyeMat, bot), eyeR = mesh(eyeGeo, eyeMat, bot);
eyeL.position.set(-0.38, 0.18, 0.59); eyeR.position.set(0.38, 0.18, 0.59);
var mouth = mesh(new THREE.ShapeGeometry(roundedRectShape(0.56, 0.07, 0.03), 8), new THREE.MeshBasicMaterial({ color: WHITE }), bot); mouth.position.set(0, -0.28, 0.6);
var antenna = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.52, 16), standard(LILAC, VIOLET, 0.2, 0.4, 0.6), bot); antenna.position.set(0, 1.02, 0.05);
var antennaTip = mesh(new THREE.SphereGeometry(0.14, 24, 18), glow(ORANGE, 0.9), bot); antennaTip.position.set(0, 1.34, 0.05);
bot.traverse(function(node) {
  if (node.isMesh && node.material && node.material.isMeshStandardMaterial) {
    node.castShadow = true;
    node.receiveShadow = true;
  }
});
var armGeo = new THREE.CylinderGeometry(0.07, 0.09, 1.05, 16);
var armL = mesh(armGeo, standard(LILAC, VIOLET, 0.15, 0.4, 0.5), bot), armR = mesh(armGeo, standard(LILAC, VIOLET, 0.15, 0.4, 0.5), bot);
armL.position.set(-1.38, -0.03, 0.05); armR.position.set(1.38, -0.03, 0.05); armL.rotation.z = -0.82; armR.rotation.z = 0.82;
var legL = mesh(new THREE.BoxGeometry(0.28, 0.62, 0.34), standard(LILAC, VIOLET, 0.1, 0.45, 0.45), bot), legR = mesh(new THREE.BoxGeometry(0.28, 0.62, 0.34), standard(LILAC, VIOLET, 0.1, 0.45, 0.45), bot);
legL.position.set(-0.5, -1.04, 0); legR.position.set(0.5, -1.04, 0);
var footL = mesh(new THREE.BoxGeometry(0.52, 0.18, 0.62), standard(VIOLET, VIOLET, 0.1, 0.42, 0.5), bot), footR = mesh(new THREE.BoxGeometry(0.52, 0.18, 0.62), standard(VIOLET, VIOLET, 0.1, 0.42, 0.5), bot);
footL.position.set(-0.55, -1.4, 0.15); footR.position.set(0.55, -1.4, 0.15);

// Code lines become a physical world around Yo.
var CODE_COUNT = 72;
var codeMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.035), standard(WHITE, VIOLET, 0.25, 0.5, 0.25), CODE_COUNT);
codeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); world.add(codeMesh);
for (var ci = 0; ci < CODE_COUNT; ci++) codeMesh.setColorAt(ci, new THREE.Color(ci % 11 === 0 ? ORANGE : (ci % 4 === 0 ? CYAN : LILAC)));
if (codeMesh.instanceColor) codeMesh.instanceColor.needsUpdate = true;

// Sculptural YoClip mark.
var brand = new THREE.Group(); world.add(brand);
var arc = mesh(new THREE.TorusGeometry(2.2, 0.16, 18, 128, Math.PI * 1.63), standard(LILAC, VIOLET, 0.25, 0.38, 0.62), brand); arc.rotation.z = -0.19;
var arcGlow = mesh(new THREE.TorusGeometry(2.2, 0.025, 8, 128, Math.PI * 1.63), glow(CYAN, 0.45), brand); arcGlow.rotation.z = -0.19; arcGlow.position.z = 0.23;
var bubble = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.45, 1.55, 0.42), { depth: 0.38, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.09, bevelThickness: 0.08, curveSegments: 16 }), standard(VIOLET, VIOLET, 0.32, 0.36, 0.48), brand); bubble.position.set(0.42, 0, 0.18);
var playShape = new THREE.Shape(); playShape.moveTo(-0.28, -0.43); playShape.lineTo(0.48, 0); playShape.lineTo(-0.28, 0.43); playShape.closePath();
var play = mesh(new THREE.ExtrudeGeometry(playShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.035, bevelThickness: 0.03 }), standard(WHITE, CYAN, 0.2, 0.42, 0.45), brand); play.position.set(0.42, 0, 0.72);
var halo = mesh(new THREE.TorusGeometry(3.1, 0.018, 6, 144), glow(CYAN, 0.3), brand); halo.position.z = -0.5;
// Premium layered mark: chrome enclosure, dark glass inset and bevelled play.
var brandChrome = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.78, 1.88, 0.5), { depth: 0.24, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.11, bevelThickness: 0.1, curveSegments: 20 }), standard(0xf8f7ff, CYAN, 0.16, 0.16, 0.94), brand);
brandChrome.position.set(0.42, 0, -0.06);
var brandInset = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.14, 1.24, 0.34), { depth: 0.055, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.045, bevelThickness: 0.035 }), standard(0x100c1c, VIOLET, 0.4, 0.13, 0.72), brand);
brandInset.position.set(0.42, 0, 0.61);
var playEdge = mesh(new THREE.ExtrudeGeometry(playShape, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.055, bevelThickness: 0.045 }), standard(ORANGE, ORANGE, 0.38, 0.18, 0.82), brand);
playEdge.position.set(0.42, 0, 0.68); playEdge.scale.setScalar(1.18);
var brandOrbit = new THREE.Group(); brand.add(brandOrbit);
var orbitA = mesh(new THREE.TorusGeometry(2.86, 0.045, 8, 128), standard(0xf8f7ff, CYAN, 0.32, 0.16, 0.92), brandOrbit); orbitA.rotation.x = 0.72;
var orbitB = mesh(new THREE.TorusGeometry(2.66, 0.026, 8, 128), glow(VIOLET, 0.48), brandOrbit); orbitB.rotation.y = 0.92;
var orbitC = mesh(new THREE.TorusGeometry(3.28, 0.012, 6, 128), glow(ORANGE, 0.35), brandOrbit); orbitC.rotation.set(0.35, 0.55, 0.2);
var BRAND_GEMS = 24;
var brandGems = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.095, 1), standard(WHITE, CYAN, 0.55, 0.18, 0.8), BRAND_GEMS);
brandGems.instanceMatrix.setUsage(THREE.DynamicDrawUsage); brand.add(brandGems);
for (var bgm = 0; bgm < BRAND_GEMS; bgm++) brandGems.setColorAt(bgm, new THREE.Color(bgm % 5 === 0 ? ORANGE : (bgm % 2 ? CYAN : LILAC)));
if (brandGems.instanceColor) brandGems.instanceColor.needsUpdate = true;
var brandSweep = mesh(new THREE.PlaneGeometry(0.13, 3.3), glow(WHITE, 0.34), brand); brandSweep.position.z = 1.02; brandSweep.rotation.z = -0.42;
function updateBrand(frame, pulse) {
  brandOrbit.rotation.set(Math.sin(frame * 0.006) * 0.12, frame * 0.0045, frame * 0.003);
  arcGlow.material.opacity = 0.35 + pulse * 0.35;
  halo.material.opacity = 0.2 + pulse * 0.22;
  brandSweep.position.x = -2.4 + ((frame % 150) / 150) * 5.4;
  brandSweep.material.opacity = 0.12 + pulse * 0.25;
  play.scale.setScalar(1 + pulse * 0.045); playEdge.scale.setScalar(1.18 + pulse * 0.05);
  for (var i = 0; i < BRAND_GEMS; i++) {
    var a = i / BRAND_GEMS * Math.PI * 2 + frame * (0.004 + (i % 3) * 0.001);
    var r = 2.75 + (i % 4) * 0.19, y = Math.sin(a * 2 + i) * 0.72;
    var s = 0.65 + (i % 3) * 0.18 + pulse * 0.22;
    setMatrix(brandGems, i, Math.cos(a) * r, y, Math.sin(a) * r * 0.55, s, s, s, frame * 0.01, a, 0);
  }
  brandGems.instanceMatrix.needsUpdate = true;
}

// Textured native-loaded JSR car hero replaces the old wireframe knot.
var knotGroup = new THREE.Group(); world.add(knotGroup);
var carRig = new THREE.Group(); knotGroup.add(carRig);
var carAssetState = 'loading', carWheels = [], carScale = 1, carOffset = new THREE.Vector3(), carBottomLocal = 0, carGlassNodes = [];
var driverRig = new THREE.Group(); carRig.add(driverRig); driverRig.visible = false;
var carDriver = null, driverMixer = null, driverFace = null, driverHead = null, driverActions = {}, driverAssetState = 'loading';
var driverRim = new THREE.PointLight(0x9fd8ff, 10, 4, 2); driverRim.position.set(0.3, 1.0, 0.75); driverRig.add(driverRim);
function positionDriver() {
  if (!carDriver || carAssetState !== 'ready') return;
  // driverRig is outside the scaled GLB, so cabin offsets are already in
  // normalized car units; multiplying by carScale here made them vanish.
  driverRig.position.set(-0.3 + carOffset.x, -0.03 + carOffset.y, -0.3 + carOffset.z);
  driverRig.rotation.y = Math.PI; // Face the steering wheel / Ferrari −Z forward.
}
// Initialize frame state before any loader can invoke a cached asset callback.
var latestFrame = 0, latestFps = FPS, latestParams = {}, worldReady = false;
function renderLatestFrame() {
  // Asset callbacks can fire before the first yoclip.frame payload. Emitting a
  // tree then would attach a legacy-sized surface and force an 8K resize race.
  if (!worldReady || !hasMasterFrame) return;
  renderFrame(timelineFrame(latestFrame), MASTER_FPS, latestParams);
  jsr.render({ type: 'three', canvasId: 'main', width: W, height: H, pixelRatio: outputPixelRatio(W) });
}
function timelineFrame(frame) { return frame * (MASTER_FPS / Math.max(1, FPS)); }
var studioRig = new THREE.Group(); world.add(studioRig); studioRig.visible = false;
new THREE.GLTFLoader().load('three/RobotExpressive.glb', function(gltf) {
  carDriver = gltf.scene; carDriver.scale.setScalar(0.3);
  carDriver.traverse(function(node) {
    if (node.isMesh) {
      node.castShadow = false; node.receiveShadow = true;
      // Only the upper body is visible in the open cockpit. Hide the separate
      // cartoon leg/foot meshes rather than letting them pierce the car floor.
      if (/^(Foot|LowerLeg|Leg)/.test(node.name || '')) node.visible = false;
    }
  });
  driverRig.add(carDriver);
  var sitting = gltf.animations.find(function(item) { return item.name === 'Sitting'; });
  if (sitting) {
    // Establish the seated rest pose once, then animate only head and arms.
    // The source clip's Body.translation makes the whole character bounce
    // against the seat; body/leg tracks must remain fixed relative to the car.
    var restMixer = new THREE.AnimationMixer(carDriver);
    restMixer.clipAction(sitting).play(); restMixer.setTime(0);
    var gestureTracks = sitting.tracks.filter(function(track) {
      return /^(Head|Neck|Shoulder|UpperArm|LowerArm|Arm|Hand|Palm|Thumb|Index|Middle|Ring|Pinky)/.test(track.name);
    });
    driverMixer = new THREE.AnimationMixer(carDriver);
    driverActions.Sitting = driverMixer.clipAction(new THREE.AnimationClip('DriverGestures', sitting.duration, gestureTracks));
    driverActions.Sitting.play();
  }
  driverHead = carDriver.getObjectByName('Head');
  carDriver.traverse(function(node) { if (node.morphTargetDictionary && node.morphTargetDictionary.Smile !== undefined) driverFace = node; });
  driverAssetState = 'ready'; positionDriver();
  renderLatestFrame();
}, undefined, function(error) { driverAssetState = 'error'; console.error('Ferrari driver: ' + error); });
function updateCarDrive(frame, progress, pulse) {
  knotGroup.visible = true; nodes.visible = false; driverRig.visible = true;
  driverRig.rotation.y = Math.PI;
  knotGroup.scale.setScalar(1.15); knotGroup.rotation.set(0, 0, 0);
  carRig.rotation.set(0, Math.sin(frame * 0.025) * 0.008, Math.sin(frame * 0.07) * 0.006);
  carRig.position.y = Math.sin(frame * 0.18) * 0.012;
  knotGroup.position.set(
    Math.sin(frame * 0.018) * 0.22,
    -0.04 - (carBottomLocal + carRig.position.y) * 1.15 + 0.012,
    0.8
  );
  updateRoad(frame);
  for (var w = 0; w < carWheels.length; w++) carWheels[w].rotation.x = -frame * 0.32;
  var talk = clamp((progress - 0.52) / 0.2, 0, 1) * (0.5 + Math.sin(frame * 0.32) * 0.5);
  if (driverActions.Yes) driverActions.Yes.setEffectiveWeight(talk * 0.18);
  if (driverActions.Sitting) driverActions.Sitting.setEffectiveWeight(1 - talk * 0.18);
  if (driverMixer) driverMixer.setTime(frame / Math.max(1, FPS));
  // Head and lower-arm tracks provide restrained life; torso, hips and legs
  // stay locked to the seated rest pose and never bounce against the chair.
  if (driverFace && driverFace.morphTargetDictionary && driverFace.morphTargetDictionary.Smile !== undefined) {
    driverFace.morphTargetInfluences[driverFace.morphTargetDictionary.Smile] = 0.45 + talk * 0.5;
  }
}
function carDriveShot(progress) {
  var p = progress;
  if (latestParams.act >= 14 && latestParams.act <= 15) p = ((latestParams.beat % 2) + (latestParams.beatPhase || 0)) / 2;
  var x = knotGroup.position.x, z = knotGroup.position.z;
  // Three editorial road shots. Hard cuts replace the old 360° showroom orbit.
  if (p < 0.34) {
    var chase = p / 0.34;
    shotCamera(x + 4.4 - chase * 0.7, 1.35 + chase * 0.18, z + 7.2 - chase * 0.8, x, 0.86, z - 1.4, 56);
  } else if (p < 0.67) {
    var track = (p - 0.34) / 0.33;
    shotCamera(x + 7.4 - track * 1.1, 1.02, z + 1.7 - track * 3.2, x, 0.88, z - 0.65, 50);
  } else {
    var front = (p - 0.67) / 0.33;
    shotCamera(x - 3.6 + front * 0.8, 1.08 + front * 0.15, z - 7.0 + front * 0.55, x, 0.9, z + 0.1, 52);
  }
}
function carDetailShot(progress) {
  var wheel = carWheels[1] || carWheels[0];
  if (!wheel) { carDriveShot(progress); return; }
  var focus = wheel.getWorldPosition(new THREE.Vector3());
  var close = focus.clone().add(new THREE.Vector3(1.15, 0.3, 0.82));
  var closeTarget = focus.clone().add(new THREE.Vector3(-0.18, 0, 0.12));
  var startTarget = focus.clone().add(new THREE.Vector3(-0.55, 0.05, 0.35));
  var wide = new THREE.Vector3(knotGroup.position.x + 4.5, 1.45, knotGroup.position.z + 6.5);
  var carTarget = new THREE.Vector3(knotGroup.position.x, 0.88, knotGroup.position.z);
  if (progress < 0.52) {
    var q = inOut(progress / 0.52);
    var start = focus.clone().add(new THREE.Vector3(3.1, 1.05, 2.45));
    shotCamera(start.x + (close.x - start.x) * q, start.y + (close.y - start.y) * q, start.z + (close.z - start.z) * q,
      startTarget.x + (closeTarget.x - startTarget.x) * q, startTarget.y + (closeTarget.y - startTarget.y) * q, startTarget.z + (closeTarget.z - startTarget.z) * q, 48 - q * 9);
  } else {
    var pull = inOut((progress - 0.52) / 0.48);
    shotCamera(close.x + (wide.x - close.x) * pull, close.y + (wide.y - close.y) * pull, close.z + (wide.z - close.z) * pull,
      closeTarget.x + (carTarget.x - closeTarget.x) * pull, closeTarget.y + (carTarget.y - closeTarget.y) * pull, closeTarget.z + (carTarget.z - closeTarget.z) * pull, 39 + pull * 13);
  }
}
function driftPose(progress) {
  var drift = inOut(clamp(progress / 0.72, 0, 1));
  var park = inOut(clamp((progress - 0.68) / 0.32, 0, 1));
  return {
    drift: drift,
    park: park,
    x: -3.4 + drift * 4.5 - park * 0.8,
    z: 0.8 - drift * 1.1 - park * 2.0,
    yaw: drift * 1.18 * (1 - park) + park * 0.03,
  };
}
var activeDriftPose = null;
function updateCarDrift(frame, progress, pulse) {
  updateCarDrive(frame, progress, pulse);
  var pose = driftPose(progress);
  var outroDrift = frame / FPS >= 199.32;
  if (outroDrift) {
    // Preserve the approved outro: car exits left, lockup enters right.
    var exit = inOut(clamp((progress - 0.42) / 0.58, 0, 1));
    knotGroup.position.x = pose.x - exit * 9.0;
    knotGroup.position.z = pose.z + exit * 0.8;
    carRig.rotation.y = pose.yaw - exit * 0.22;
    activeDriftPose = pose;
  } else {
    // Chorus drift becomes a short action stop in front of the stationary
    // sign. Keep 3.1 world units of depth clearance instead of parking under
    // it or throwing the car out of frame. A small deterministic sway keeps
    // the stopped car alive without translating it towards the logo.
    var stop = inOut(clamp((progress - 0.42) / 0.34, 0, 1));
    var action = clamp((progress - 0.76) / 0.12, 0, 1);
    var sway = Math.sin(frame * 0.21) * 0.18 * action;
    knotGroup.position.x = pose.x * (1 - stop) + sway;
    knotGroup.position.z = pose.z + (0.9 - pose.z) * stop;
    carRig.rotation.y = (pose.yaw + (0.03 - pose.yaw) * stop) + Math.sin(frame * 0.21 + 0.8) * 0.025 * action;
    activeDriftPose = { x: knotGroup.position.x, z: knotGroup.position.z, yaw: carRig.rotation.y };
  }
  carRig.rotation.z = Math.sin(pose.drift * Math.PI) * 0.045 * (1 - pose.park);
  if (!outroDrift) carRig.rotation.z += Math.sin(frame * 0.21) * 0.008 * clamp((progress - 0.76) / 0.12, 0, 1);
  if (progress > 0.68) {
    // Integrate a linear brake instead of reversing wheel rotation at the stop.
    var brake = clamp((progress - 0.68) / 0.32, 0, 1);
    var brakeFrames = (progress - 0.68) * 0.68 * FPS;
    wheelSpin = (frame - brakeFrames) * 0.12 + brakeFrames * 0.12 * (brake - brake * brake * 0.5);
  }
  tailReflection.position.x = knotGroup.position.x; tailReflection.rotation.z = carRig.rotation.y;
  carContactShadow.position.x = knotGroup.position.x; carContactShadow.rotation.z = carRig.rotation.y * 0.5;
  var logoStart = outroDrift ? 0.34 : 0.38;
  var logoDuration = outroDrift ? 0.56 : 0.38;
  studioRig.visible = progress > logoStart;
  var logoIn = out3(clamp((progress - logoStart) / logoDuration, 0, 1));
  studioRig.scale.setScalar(outroDrift ? 0.72 + logoIn * 0.18 : 0.66 + logoIn * 0.16);
  studioRig.position.x = outroDrift ? (1 - logoIn) * 3.4 : 0;
  studioRig.position.y = outroDrift ? 1.65 + logoIn * 0.5 : 2.55 + logoIn * 0.55;
  studioRig.rotation.y = (1 - logoIn) * (outroDrift ? -0.28 : -0.18);
}
function carDriftShot(progress) {
  var outroDrift = latestParams.act === 17;
  var follow = inOut(clamp(progress / 0.75, 0, 1));
  var reveal = outroDrift
    ? inOut(clamp((progress - 0.44) / 0.56, 0, 1))
    : inOut(clamp((progress - 0.28) / 0.32, 0, 1));
  var arc = Math.sin(reveal * Math.PI);
  var roadX = 4.8 - follow * 2.0, roadY = 1.1 + follow * 0.5, roadZ = 7.4 + follow * 1.2;
  var endX = outroDrift ? 1.5 : 1.4;
  var endY = outroDrift ? 3.5 : 3.4;
  var endZ = outroDrift ? 6.4 : 8.4;
  var targetX = outroDrift ? 1.25 : 0;
  var targetY = outroDrift ? 1.5 : 1.35;
  var targetZ = outroDrift ? -1.8 : -0.8;
  shotCamera(
    roadX + (endX - roadX) * reveal,
    roadY + (endY - roadY) * reveal + arc * 1.7,
    roadZ + (endZ - roadZ) * reveal - arc * 4.8,
    knotGroup.position.x * (1 - reveal) + targetX * reveal,
    0.85 + reveal * (targetY - 0.85),
    -0.4 + reveal * (targetZ + 0.4),
    54 - reveal * 8
  );
  updateDriftEffects(progress);
}

// Tire smoke is a deterministic frame function: no wall-clock particles or
// export-only state. Skid marks were rejected for this film and are not drawn.
var DRIFT_SMOKE_COUNT = 48;
var rearWheelLocalLeft = null, rearWheelLocalRight = null;
var driftSmokeMaterial = new THREE.MeshBasicMaterial({
  color: 0x9aa6b5, map: radialTexture, transparent: true, opacity: 0,
  depthWrite: false,
});
var driftSmoke = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), driftSmokeMaterial, DRIFT_SMOKE_COUNT);
driftSmoke.visible = false; driftSmoke.frustumCulled = false; world.add(driftSmoke);
function driftWheelPosition(pose, side) {
  var local = side < 0 ? rearWheelLocalLeft : rearWheelLocalRight;
  var localX = local ? local.x : side * 0.82, localZ = local ? local.z : 1.28;
  var c = Math.cos(pose.yaw), s = Math.sin(pose.yaw);
  return {
    x: pose.x + (localX * c + localZ * s) * 1.15,
    z: pose.z + (-localX * s + localZ * c) * 1.15,
  };
}
function updateDriftEffects(progress) {
  var smokeIn = clamp((progress - 0.06) / 0.12, 0, 1);
  var smokeOut = latestParams.act === 17
    ? 1 - clamp((progress - 0.72) / 0.2, 0, 1)
    : 1 - clamp((progress - 0.44) / 0.22, 0, 1);
  var smokeStrength = smokeIn * smokeOut;
  driftSmoke.visible = smokeStrength > 0.015;
  driftSmokeMaterial.opacity = 0.48 * smokeStrength;
  var pose = activeDriftPose || driftPose(progress);
  // A compact rear-axle swirl stays outside the body instead of drawing a
  // gray streak across the door; near-camera fading still prevents giant cards.
  var backX = Math.sin(pose.yaw), backZ = Math.cos(pose.yaw);
  var sideX = -backZ, sideZ = backX;
  for (var i = 0; i < DRIFT_SMOKE_COUNT; i++) {
    var side = i % 2 === 0 ? -1 : 1;
    var age = (progress * 2.2 + Math.floor(i / 2) / (DRIFT_SMOKE_COUNT / 2) + rnd(i, 301) * 0.06) % 1;
    var base = driftWheelPosition(pose, side);
    var spread = (rnd(i, 302) - 0.5) * 0.6 * age;
    var size = (0.42 + age * 1.05) * (0.72 + rnd(i, 303) * 0.5);
    var outwardX = Math.cos(pose.yaw) * side * 0.28;
    var outwardZ = -Math.sin(pose.yaw) * side * 0.28;
    dummy.position.set(
      base.x + outwardX + backX * age * 1.15 + sideX * spread,
      0.24 + age * 0.6 + rnd(i, 304) * 0.1,
      base.z + outwardZ + backZ * age * 1.15 + sideZ * spread
    );
    var cameraDx = dummy.position.x - camera.position.x;
    var cameraDy = dummy.position.y - camera.position.y;
    var cameraDz = dummy.position.z - camera.position.z;
    var cameraDistance = Math.sqrt(cameraDx * cameraDx + cameraDy * cameraDy + cameraDz * cameraDz);
    size *= clamp((cameraDistance - 1.4) / 2.2, 0, 1);
    dummy.scale.set(size, size, 1);
    dummy.quaternion.copy(camera.quaternion);
    dummy.updateMatrix(); driftSmoke.setMatrixAt(i, dummy.matrix);
  }
  driftSmoke.instanceMatrix.needsUpdate = true;
}
new THREE.GLTFLoader().load('three/Ferrari.glb', function(gltf) {
  var model = gltf.scene;
  var bounds = new THREE.Box3().setFromObject(model);
  var center = bounds.getCenter(new THREE.Vector3());
  var size = bounds.getSize(new THREE.Vector3());
  var scale = 5.4 / Math.max(size.x, size.y, size.z);
  carScale = scale;
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  carOffset.copy(model.position);
  carBottomLocal = bounds.min.y * scale + model.position.y;
  carWheels = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].map(function(name) { return model.getObjectByName(name); }).filter(Boolean);
  // The GLB already has emissive tail-light glass. Extra halo/core sprites
  // produced two detached orange trails, so the road reflection is the only
  // additional tail-light effect.
  model.traverse(function(node) {
    var glassName = (node.name || '').toLowerCase();
    var materials = node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : [];
    for (var mi = 0; mi < materials.length; mi++) {
      var material = materials[mi], materialName = (material.name || '').toLowerCase();
      if (glassName.indexOf('glass') >= 0 || materialName === 'glass_gray' || material.transmission > 0) carGlassNodes.push(node);
      // The FBX conversion gives every material the same rough 0.8 / metal 0.2
      // response. Preserve its colors and textures, but restore distinct finishes.
      if (materialName === 'body_color') { material.roughness = 0.26; material.metalness = 0.48; }
      else if (materialName === 'taillight_glass') {
        material.roughness = 0.2; material.metalness = 0.08;
        material.emissive.setHex(0xff1808); material.emissiveIntensity = 2.4;
      }
      else if (materialName === 'projector_glass') {
        material.roughness = 0.16; material.metalness = 0.16;
        material.emissive.setHex(0xbfdcff); material.emissiveIntensity = 0.5;
      }
      else if (materialName === 'metal_chrome') { material.roughness = 0.18; material.metalness = 0.92; }
      else if (materialName === 'tires') { material.roughness = 0.88; material.metalness = 0.02; }
      else if (materialName.indexOf('leather') >= 0 || materialName.indexOf('interior') >= 0) {
        material.roughness = 0.68; material.metalness = 0.04;
      } else if (material.isMeshStandardMaterial) {
        material.roughness = Math.min(material.roughness, 0.58);
      }
      material.needsUpdate = true;
    }
    if (node.isMesh) { node.castShadow = carGlassNodes.indexOf(node) < 0; node.receiveShadow = true; }
  });
  for (var glassIndex = 0; glassIndex < carGlassNodes.length; glassIndex++) {
    if (carGlassNodes[glassIndex].parent) carGlassNodes[glassIndex].parent.remove(carGlassNodes[glassIndex]);
  }
  console.log('Ferrari open cockpit until native glass alpha lands: removed nodes = ' + carGlassNodes.length);
  carRig.add(model);
  knotGroup.updateMatrixWorld(true);
  var rearLeft = carRig.getObjectByName('wheel_rl'), rearRight = carRig.getObjectByName('wheel_rr');
  if (rearLeft && rearRight) {
    var rearLeftPosition = new THREE.Vector3(), rearRightPosition = new THREE.Vector3();
    rearLeft.getWorldPosition(rearLeftPosition); rearRight.getWorldPosition(rearRightPosition);
    rearWheelLocalLeft = { x: rearLeftPosition.x / 1.15, z: rearLeftPosition.z / 1.15 };
    rearWheelLocalRight = { x: rearRightPosition.x / 1.15, z: rearRightPosition.z / 1.15 };
    console.log('Drift wheel rigs: L ' + rearWheelLocalLeft.x.toFixed(3) + ',' + rearWheelLocalLeft.z.toFixed(3) +
      ' R ' + rearWheelLocalRight.x.toFixed(3) + ',' + rearWheelLocalRight.z.toFixed(3));
  }
  carAssetState = 'ready'; positionDriver();
  renderLatestFrame();
}, undefined, function(error) { carAssetState = 'error'; console.error('Ferrari: ' + error); });
var NODE_COUNT = 42, nodePositions = [];
var nodes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.09, 1), standard(WHITE, CYAN, 0.35, 0.35, 0.55), NODE_COUNT);
nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); knotGroup.add(nodes);
for (var ni = 0; ni < NODE_COUNT; ni++) {
  var ny = 1 - ni / (NODE_COUNT - 1) * 2, nr = Math.sqrt(Math.max(0, 1 - ny * ny)), nt = ni * Math.PI * (3 - Math.sqrt(5));
  nodePositions.push(new THREE.Vector3(Math.cos(nt) * nr * 4.4, ny * 3.2, Math.sin(nt) * nr * 3.4));
  nodes.setColorAt(ni, new THREE.Color(ni % 6 === 0 ? ORANGE : (ni % 2 ? CYAN : LILAC)));
}
if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;

// Beat particles.
var PARTICLE_COUNT = 900, particlePositions = new Float32Array(PARTICLE_COUNT * 3), particleColors = new Float32Array(PARTICLE_COUNT * 3);
for (var pi = 0; pi < PARTICLE_COUNT; pi++) {
  tempColor.setHex(pi % 13 === 0 ? ORANGE : (pi % 4 === 0 ? CYAN : LILAC));
  particleColors[pi * 3] = tempColor.r; particleColors[pi * 3 + 1] = tempColor.g; particleColors[pi * 3 + 2] = tempColor.b;
}
var particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
var particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 0.065, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
world.add(particles);

// Camera-light choreography, without post-processing.
var beams = new THREE.Group(); world.add(beams);
for (var bi = 0; bi < 8; bi++) {
  var beam = mesh(new THREE.PlaneGeometry(0.055, 18), glow(bi % 3 === 0 ? ORANGE : (bi % 2 ? CYAN : VIOLET), 0.24), beams);
  beam.position.set((bi - 3.5) * 1.8, 0, -3 - bi * 0.25); beam.rotation.z = -0.48 + bi * 0.13;
}
var grid = new THREE.GridHelper(40, 40, CYAN, 0x252032); grid.position.y = -4; grid.material.transparent = true; grid.material.opacity = 0.16; world.add(grid);

// Beat-synced anime impact language: shockwaves, shards and radial streaks.
var shockwaves = new THREE.Group(); world.add(shockwaves);
var shockRings = [];
for (var sw = 0; sw < 4; sw++) {
  var ring = mesh(new THREE.TorusGeometry(1, 0.025, 6, 96), glow(sw % 2 ? CYAN : ORANGE, 0.25), shockwaves);
  ring.position.z = -1.5 - sw * 0.12; shockRings.push(ring);
}
var SHARD_COUNT = 84;
var shards = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(LILAC, 0.42), SHARD_COUNT);
shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage); world.add(shards);
for (var shi = 0; shi < SHARD_COUNT; shi++) shards.setColorAt(shi, new THREE.Color(shi % 7 === 0 ? ORANGE : (shi % 3 === 0 ? CYAN : LILAC)));
if (shards.instanceColor) shards.instanceColor.needsUpdate = true;
var IMPACT_COUNT = 48;
var impactLines = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(CYAN, 0.25), IMPACT_COUNT);
impactLines.instanceMatrix.setUsage(THREE.DynamicDrawUsage); world.add(impactLines);
function updateEnergyEffects(frame, beatPhase, pulse, intensity) {
  for (var i = 0; i < shockRings.length; i++) {
    var phase = (beatPhase + i * 0.22) % 1;
    shockRings[i].scale.setScalar(0.5 + phase * 5.8 * intensity);
    shockRings[i].material.opacity = (1 - phase) * 0.28 * intensity;
    shockRings[i].rotation.set(0.2 + i * 0.17, i * 0.24, frame * 0.002 * (i % 2 ? 1 : -1));
  }
  for (var s = 0; s < SHARD_COUNT; s++) {
    var angle = rnd(s, 61) * Math.PI * 2 + frame * (0.003 + rnd(s, 62) * 0.008);
    var radius = 2.2 + rnd(s, 63) * 5.5 + pulse * 0.8;
    var x = Math.cos(angle) * radius, y = Math.sin(angle) * radius * 0.65, z = -2 + (rnd(s, 64) - 0.5) * 7;
    var length = 0.15 + rnd(s, 65) * 0.65;
    setMatrix(shards, s, x, y, z, 0.035, 0.035, length * intensity, frame * 0.02 + s, angle, angle * 0.5);
  }
  shards.instanceMatrix.needsUpdate = true;
  impactLines.material.opacity = (0.035 + pulse * 0.24) * intensity;
  for (var a = 0; a < IMPACT_COUNT; a++) {
    var ia = a / IMPACT_COUNT * Math.PI * 2 + frame * 0.0015;
    var ir = 3.0 + rnd(a, 67) * 2.0;
    setMatrix(impactLines, a, Math.cos(ia) * ir, Math.sin(ia) * ir, -2.4, 0.018, 0.35 + pulse * (0.7 + rnd(a, 68) * 1.4), 0.018, 0, 0, -ia);
  }
  impactLines.instanceMatrix.needsUpdate = true;
}

// Anime city: growing towers, neon windows, torii gates, moon and speed-lines.
var city = new THREE.Group(); world.add(city);
var CITY_COUNT = 56, WINDOWS_PER_BUILDING = 5, cityData = [];
var buildings = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0x171525, VIOLET, 0.08, 0.58, 0.45), CITY_COUNT);
var windows = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.035), glow(CYAN, 0.7), CITY_COUNT * WINDOWS_PER_BUILDING);
buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage); windows.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
city.add(buildings); city.add(windows);
for (var cityIndex = 0; cityIndex < CITY_COUNT; cityIndex++) {
  var side = cityIndex % 2 ? 1 : -1;
  cityData.push({
    // Keep the fly-by camera corridor (x = -4.5…4.5) free of solid towers.
    x: side * (8.2 + rnd(cityIndex, 31) * 7), z: -5 - Math.floor(cityIndex / 2) * 2.7,
    w: 1.5 + rnd(cityIndex, 32) * 2.1, h: 3.5 + rnd(cityIndex, 33) * 8.5,
    d: 1.6 + rnd(cityIndex, 34) * 2.2,
  });
  buildings.setColorAt(cityIndex, new THREE.Color(cityIndex % 7 === 0 ? 0x272044 : 0x171525));
  for (var cw = 0; cw < WINDOWS_PER_BUILDING; cw++) windows.setColorAt(cityIndex * WINDOWS_PER_BUILDING + cw, new THREE.Color((cityIndex + cw) % 9 === 0 ? ORANGE : ((cityIndex + cw) % 3 === 0 ? LILAC : CYAN)));
}
if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
if (windows.instanceColor) windows.instanceColor.needsUpdate = true;
var cityGround = mesh(new THREE.PlaneGeometry(42, 130), standard(0x090911, 0x090911, 0.05, 0.32, 0.7), city);
cityGround.rotation.x = -Math.PI / 2; cityGround.position.set(0, -0.04, -45); cityGround.receiveShadow = true;
var cityGrid = new THREE.GridHelper(110, 55, VIOLET, 0x182238); cityGrid.position.set(0, 0, -35); cityGrid.material.transparent = true; cityGrid.material.opacity = 0.22; city.add(cityGrid);

// NIGHT RUN — a real road, not a turntable. The car stays in the camera's
// corridor while lane markings, barriers and sodium lamps stream backwards.
var road = new THREE.Group(); world.add(road); road.visible = false;
var roadSurface = mesh(new THREE.PlaneGeometry(14, 180), standard(0x303641, 0x05070b, 0.02, 0.3, 0.58), road);
roadSurface.material.map = makeAsphaltTexture(); roadSurface.material.needsUpdate = true;
roadSurface.rotation.x = -Math.PI / 2; roadSurface.position.set(0, 0.002, -62); roadSurface.receiveShadow = true;
var ROAD_DASHES = 40;
var roadDashes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0xbcc5cc, 0xb8c5d4, 0.04, 0.48, 0.08), ROAD_DASHES);
roadDashes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); road.add(roadDashes);
var ROAD_POSTS = 24;
var roadPosts = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0x343943, 0, 0, 0.34, 0.78), ROAD_POSTS);
var roadLamps = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(0xffb36a, 0.9), ROAD_POSTS);
var roadPools = new THREE.InstancedMesh(new THREE.PlaneGeometry(4.5, 8), softGlow(0xff9a4c, 0.22), ROAD_POSTS);
roadPosts.instanceMatrix.setUsage(THREE.DynamicDrawUsage); roadLamps.instanceMatrix.setUsage(THREE.DynamicDrawUsage); roadPools.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
road.add(roadPosts); road.add(roadLamps); road.add(roadPools);
var railMat = standard(0x59616d, 0, 0, 0.28, 0.86);
for (var roadSide = -1; roadSide <= 1; roadSide += 2) {
  var rail = mesh(new THREE.BoxGeometry(0.13, 0.16, 180), railMat, road); rail.position.set(roadSide * 7.15, 0.62, -62);
  var edge = mesh(new THREE.BoxGeometry(0.09, 0.018, 180), standard(0xc9d2d8, 0x8b9cac, 0.06, 0.4, 0.1), road); edge.position.set(roadSide * 6.55, 0.018, -62);
}
var carShadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, map: radialTexture, transparent: true, opacity: 0.55, depthWrite: false });
var carContactShadow = mesh(new THREE.PlaneGeometry(6.2, 7.2), carShadowMaterial, road); carContactShadow.rotation.x = -Math.PI / 2;
var tailReflection = mesh(new THREE.PlaneGeometry(2.4, 7.5), softGlow(0xff1808, 0.32), road);
tailReflection.rotation.x = -Math.PI / 2; tailReflection.position.set(0, 0.026, 4.0); tailReflection.visible = false;
var headlightReflection = mesh(new THREE.PlaneGeometry(3.6, 10), softGlow(0xbfdcff, 0.16), road); headlightReflection.visible = false;
headlightReflection.rotation.x = -Math.PI / 2; headlightReflection.position.set(0, 0.024, -5.2);
function updateRoad(frame) {
  for (var i = 0; i < ROAD_DASHES; i++) {
    var lane = i % 2 ? 1 : -1, index = Math.floor(i / 2);
    var z = ((index * 9 + frame * 0.48 + 140) % 180) - 140;
    setMatrix(roadDashes, i, lane * 2.45, 0.025, z, 0.11, 0.025, 3.4, 0, 0, 0);
  }
  roadDashes.instanceMatrix.needsUpdate = true;
  for (var p = 0; p < ROAD_POSTS; p++) {
    var side = p % 2 ? 1 : -1, row = Math.floor(p / 2);
    var pz = ((row * 15 + frame * 0.48 + 140) % 180) - 140;
    setMatrix(roadPosts, p, side * 7.65, 2.85, pz, 0.11, 5.7, 0.11, 0, 0, 0);
    setMatrix(roadLamps, p, side * 7.15, 5.65, pz, 1.1, 0.09, 0.24, 0, 0, 0);
    setMatrix(roadPools, p, side * 5.3, 0.022, pz, 1, 1, 1, -Math.PI / 2, 0, 0);
  }
  roadPosts.instanceMatrix.needsUpdate = true; roadLamps.instanceMatrix.needsUpdate = true; roadPools.instanceMatrix.needsUpdate = true;
  carContactShadow.position.set(knotGroup.position.x, 0.018, knotGroup.position.z + 0.2); carContactShadow.rotation.z = carRig.rotation.y * 0.5;
  tailReflection.position.x = knotGroup.position.x; tailReflection.rotation.z = 0;
  headlightReflection.position.x = knotGroup.position.x;
}
var moon = mesh(new THREE.SphereGeometry(3.3, 32, 20), new THREE.MeshBasicMaterial({ color: 0xdcd8ff }), city); moon.position.set(-12, 12, -48);
var moonGlow = mesh(new THREE.SphereGeometry(4.4, 24, 16), glow(VIOLET, 0.12), city); moonGlow.position.copy(moon.position);
var GATE_COUNT = 6;
var gates = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(ORANGE, ORANGE, 0.35, 0.42, 0.35), GATE_COUNT * 3);
gates.instanceMatrix.setUsage(THREE.DynamicDrawUsage); city.add(gates);
var SPEED_COUNT = 96;
var speedLines = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(CYAN, 0.35), SPEED_COUNT);
speedLines.instanceMatrix.setUsage(THREE.DynamicDrawUsage); city.add(speedLines);
function updateCity(frame, growth, running, towerScale) {
  var towerAmount = towerScale === undefined ? 1 : Math.max(0.04, towerScale);
  gates.visible = running;
  speedLines.visible = running;
  var travel = frame * (running ? 0.16 : 0.025);
  for (var i = 0; i < CITY_COUNT; i++) {
    var b = cityData[i], g = clamp(growth * 1.55 - i / CITY_COUNT * 0.55, 0.02, 1) * towerAmount;
    var z = ((b.z + travel + 70) % 90 + 90) % 90 - 70;
    setMatrix(buildings, i, b.x, b.h * g / 2, z, b.w, b.h * g, b.d, 0, 0, 0);
    for (var w = 0; w < WINDOWS_PER_BUILDING; w++) {
      var wy = 0.65 + (w + 1) * (b.h - 1.3) / (WINDOWS_PER_BUILDING + 1) * g;
      setMatrix(windows, i * WINDOWS_PER_BUILDING + w, b.x, wy, z + b.d / 2 + 0.03, b.w * (w % 2 ? 0.55 : 0.72), 0.075, 1, 0, 0, 0);
    }
  }
  buildings.instanceMatrix.needsUpdate = true; windows.instanceMatrix.needsUpdate = true;
  var gateSpan = running ? 9.0 : 6.2;
  var gateHeight = running ? 7.5 : 4.2;
  for (var gi = 0; gi < GATE_COUNT; gi++) {
    var gz = ((-(gi * 15 + 7) + travel + 70) % 90 + 90) % 90 - 70;
    setMatrix(gates, gi * 3, -gateSpan, gateHeight / 2, gz, 0.22, gateHeight, 0.25, 0, 0, 0);
    setMatrix(gates, gi * 3 + 1, gateSpan, gateHeight / 2, gz, 0.22, gateHeight, 0.25, 0, 0, 0);
    setMatrix(gates, gi * 3 + 2, 0, gateHeight - 0.05, gz, gateSpan * 2 + 1.0, 0.24, 0.32, 0, 0, 0);
  }
  gates.instanceMatrix.needsUpdate = true;
  for (var si2 = 0; si2 < SPEED_COUNT; si2++) {
    var sx = (rnd(si2, 40) - 0.5) * 24, sy = 0.4 + rnd(si2, 41) * 8;
    var sz = ((-55 + rnd(si2, 42) * 75 + frame * (running ? 0.65 : 0.12) + 70) % 90 + 90) % 90 - 70;
    setMatrix(speedLines, si2, sx, sy, sz, 0.018, 0.018, 0.6 + rnd(si2, 43) * 2.8, 0, 0, 0);
  }
  speedLines.instanceMatrix.needsUpdate = true;
}

// WORLD IN FLIGHT — a restrained architectural light tunnel. No mascot,
// confetti or toy rocket: one camera move, one vanishing point, two light colors.
var flight = new THREE.Group(); world.add(flight); flight.visible = false;
var FLIGHT_SEGMENTS = 22;
var flightFrames = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(0x171c26, 0, 0, 0.3, 0.72), FLIGHT_SEGMENTS * 3);
var flightStrips = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(WHITE, 0.52), FLIGHT_SEGMENTS * 3);
flightFrames.instanceMatrix.setUsage(THREE.DynamicDrawUsage); flightStrips.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
flight.add(flightFrames); flight.add(flightStrips);
for (var fc = 0; fc < FLIGHT_SEGMENTS; fc++) {
  var flightColor = new THREE.Color(fc % 6 === 0 ? 0xff9a62 : 0x8fb7ff);
  flightStrips.setColorAt(fc * 3, flightColor); flightStrips.setColorAt(fc * 3 + 1, flightColor); flightStrips.setColorAt(fc * 3 + 2, flightColor);
}
if (flightStrips.instanceColor) flightStrips.instanceColor.needsUpdate = true;
var flightFloor = mesh(new THREE.PlaneGeometry(15, 180), standard(0x0d121b, 0x05070d, 0.03, 0.2, 0.76), flight);
flightFloor.rotation.x = -Math.PI / 2; flightFloor.position.set(0, -0.02, -65); flightFloor.receiveShadow = true;
flightFloor.material.map = roadSurface.material.map; flightFloor.material.roughness = 0.28; flightFloor.material.needsUpdate = true;
var flightLaneLights = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), glow(0xc4dcff, 0.18), FLIGHT_SEGMENTS * 2);
flightLaneLights.instanceMatrix.setUsage(THREE.DynamicDrawUsage); flight.add(flightLaneLights); flightLaneLights.visible = false;
var flightContact = mesh(new THREE.PlaneGeometry(5.4, 7.4), softGlow(0x8fb7ff, 0.1), flight); flightContact.rotation.x = -Math.PI / 2; flightContact.visible = false;
var flightShadow = mesh(new THREE.PlaneGeometry(6.2, 7.2), carShadowMaterial, flight); flightShadow.rotation.x = -Math.PI / 2;
var flightTailReflection = mesh(new THREE.PlaneGeometry(2.4, 5.8), softGlow(0xff3828, 0.2), flight); flightTailReflection.rotation.x = -Math.PI / 2; flightTailReflection.visible = false;
var flightVanishingLight = mesh(new THREE.PlaneGeometry(11, 5.5), softGlow(0x709dff, 0.52), flight); flightVanishingLight.position.set(0, 3, -132); flightVanishingLight.material.fog = false;
function updateFlight(frame, progress, pulse) {
  updateCarDrive(frame, progress, pulse);
  for (var i = 0; i < FLIGHT_SEGMENTS; i++) {
    var z = ((-i * 7 + frame * 0.23 + 140) % 154) - 140;
    setMatrix(flightFrames, i * 3, -6.4, 3.1, z, 0.42, 6.2, 0.65, 0, 0, 0);
    setMatrix(flightFrames, i * 3 + 1, 6.4, 3.1, z, 0.42, 6.2, 0.65, 0, 0, 0);
    setMatrix(flightFrames, i * 3 + 2, 0, 6.1, z, 13.2, 0.36, 0.65, 0, 0, 0);
    setMatrix(flightStrips, i * 3, -6.13, 3.15, z + 0.04, 0.07, 5.1, 0.1, 0, 0, 0);
    setMatrix(flightStrips, i * 3 + 1, 6.13, 3.15, z + 0.04, 0.07, 5.1, 0.1, 0, 0, 0);
    setMatrix(flightStrips, i * 3 + 2, 0, 5.88, z + 0.04, 10.8, 0.07, 0.1, 0, 0, 0);
    setMatrix(flightLaneLights, i * 2, -1.8, 0.025, z, 0.035, 2.8, 1, -Math.PI / 2, 0, 0);
    setMatrix(flightLaneLights, i * 2 + 1, 1.8, 0.025, z, 0.035, 2.8, 1, -Math.PI / 2, 0, 0);
  }
  flightFrames.instanceMatrix.needsUpdate = true; flightStrips.instanceMatrix.needsUpdate = true; flightLaneLights.instanceMatrix.needsUpdate = true;
  flightStrips.material.opacity = 0.66 + pulse * 0.14;
  flightContact.position.set(knotGroup.position.x, 0.028, knotGroup.position.z);
  flightShadow.position.set(knotGroup.position.x, 0.024, knotGroup.position.z + 0.2);
  flightTailReflection.position.set(knotGroup.position.x, 0.032, knotGroup.position.z + 3.0);
  shotCamera(knotGroup.position.x + 3.5 + Math.sin(frame * 0.009) * 0.3, 1.18 + Math.sin(frame * 0.006) * 0.08, knotGroup.position.z + 7.1 - progress * 0.5, knotGroup.position.x, 0.68, knotGroup.position.z - 1.6, 54);
}

// Official YoClip lockup revealed by the drift: open C, gradient Yo bubble,
// lip and a compact .studio suffix. Real extruded geometry, not a flat URL.
var studioText = null, studioAssetState = 'loading';
function typefaceShapes(text, data, size) {
  var scale = size / data.resolution, paths = [], offsetX = 0, offsetY = 0;
  var lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;
  for (var i = 0; i < text.length; i++) {
    var character = text[i];
    if (character === '\n') { offsetX = 0; offsetY -= lineHeight; continue; }
    var glyph = data.glyphs[character] || data.glyphs['?'];
    if (!glyph) continue;
    var path = new THREE.ShapePath();
    if (glyph.o) {
      var outline = glyph.o.split(' ');
      for (var j = 0; j < outline.length;) {
        var action = outline[j++];
        if (action === 'm') { path.moveTo(outline[j++] * scale + offsetX, outline[j++] * scale + offsetY); }
        else if (action === 'l') { path.lineTo(outline[j++] * scale + offsetX, outline[j++] * scale + offsetY); }
        else if (action === 'q') {
          var qx = outline[j++] * scale + offsetX, qy = outline[j++] * scale + offsetY;
          var qcx = outline[j++] * scale + offsetX, qcy = outline[j++] * scale + offsetY;
          path.quadraticCurveTo(qcx, qcy, qx, qy);
        } else if (action === 'b') {
          var bx = outline[j++] * scale + offsetX, by = outline[j++] * scale + offsetY;
          var bc1x = outline[j++] * scale + offsetX, bc1y = outline[j++] * scale + offsetY;
          var bc2x = outline[j++] * scale + offsetX, bc2y = outline[j++] * scale + offsetY;
          path.bezierCurveTo(bc1x, bc1y, bc2x, bc2y, bx, by);
        }
      }
    }
    offsetX += glyph.ha * scale; paths.push(path);
  }
  var shapes = [];
  for (var p = 0; p < paths.length; p++) shapes = shapes.concat(paths[p].toShapes());
  return shapes;
}
jsr.three.loadAsset('three/helvetiker_bold.typeface.json').then(function(record) {
  var data = JSON.parse(new TextDecoder().decode(record.bytes));
  studioText = new THREE.Group(); studioRig.add(studioText);
  var brandWhite = standard(0xf8f7ff, 0xa8caff, 0.12, 0.22, 0.42);
  var brandBlue = standard(0x1677ff, 0x075fe4, 0.32, 0.3, 0.22);
  function word(text, size, material, x, y, z, depth) {
    var geometry = new THREE.ExtrudeGeometry(typefaceShapes(text, data, size), {
      depth: depth || 0.12, curveSegments: 8, bevelEnabled: true,
      bevelThickness: 0.035, bevelSize: 0.018, bevelSegments: 3,
    });
    geometry.center();
    var item = mesh(geometry, material, studioText); item.position.set(x, y, z);
    item.castShadow = true; item.receiveShadow = true; return item;
  }
  function gradientGeometry(geometry) {
    geometry.computeBoundingBox();
    var box = geometry.boundingBox, positions = geometry.attributes.position;
    var colors = [], left = new THREE.Color(0x7c3aed), middle = new THREE.Color(0x4f46e5), right = new THREE.Color(0x1677ff);
    for (var i = 0; i < positions.count; i++) {
      var t = clamp((positions.getX(i) - box.min.x) / Math.max(0.001, box.max.x - box.min.x), 0, 1);
      var color = t < 0.55 ? left.clone().lerp(middle, t / 0.55) : middle.clone().lerp(right, (t - 0.55) / 0.45);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }
  var bubbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, emissive: 0x16083f, emissiveIntensity: 0.16,
    roughness: 0.3, metalness: 0.28,
  });
  // Official YoClip anatomy: open C ring, gradient Yo speech bubble,
  // two recording/filmstrip squares and the separate `lip` word.
  var ring = mesh(new THREE.TorusGeometry(2.0, 0.17, 20, 128, Math.PI * 1.64), brandWhite, studioText);
  ring.position.set(-1.75, 0.12, -0.18); ring.castShadow = true;
  var bubbleGeometry = gradientGeometry(new THREE.ExtrudeGeometry(roundedRectShape(3.05, 1.86, 0.44), {
    depth: 0.3, curveSegments: 20, bevelEnabled: true, bevelThickness: 0.075, bevelSize: 0.065, bevelSegments: 5,
  }));
  var bubble = mesh(bubbleGeometry, bubbleMaterial, studioText); bubble.position.set(-0.85, 0.1, 0.28); bubble.castShadow = true;
  var tailShape = new THREE.Shape(); tailShape.moveTo(-0.05, -0.78); tailShape.lineTo(0.45, -1.38); tailShape.lineTo(0.9, -0.72); tailShape.closePath();
  var tail = mesh(gradientGeometry(new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.28, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.035, bevelSegments: 3,
  })), bubbleMaterial, studioText); tail.position.set(-0.85, 0.1, 0.3); tail.castShadow = true;
  word('Yo', 0.98, brandWhite, -1.2, 0.12, 0.76, 0.07);
  for (var dot = 0; dot < 2; dot++) {
    var dotMesh = mesh(new THREE.ExtrudeGeometry(roundedRectShape(0.23, 0.23, 0.055), {
      depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 3,
    }), brandWhite, studioText); dotMesh.position.set(0.22, 0.4 - dot * 0.55, 0.76);
  }
  word('lip', 1.7, brandWhite, 2.15, -0.02, 0.12, 0.2);
  // Keep the suffix in front of the p descender, not coplanar with `lip`.
  word('.studio', 0.36, brandBlue, 2.35, -1.12, 0.9, 0.09);
  var studioShadow = mesh(new THREE.PlaneGeometry(10, 4.2), new THREE.MeshBasicMaterial({ color: 0x000000, map: radialTexture, transparent: true, opacity: 0.48, depthWrite: false }), studioRig);
  studioShadow.rotation.x = -Math.PI / 2; studioShadow.position.set(0, -2.02, 0);
  var studioReflection = mesh(new THREE.PlaneGeometry(9, 4.8), softGlow(0x6366f1, 0.06), studioRig); studioReflection.rotation.x = -Math.PI / 2; studioReflection.position.set(0, -2.0, 0);
  var studioKey = new THREE.PointLight(0xe5edff, 95, 28, 2); studioKey.position.set(0, 3.2, 5); studioRig.add(studioKey);
  var studioRim = new THREE.PointLight(0x8b5cf6, 65, 22, 2); studioRim.position.set(-4, 1.5, 1.5); studioRig.add(studioRim);
  studioRig.position.set(0, 1.2, -2.2);
  studioAssetState = 'ready';
  renderLatestFrame();
}).catch(function(error) { studioAssetState = 'error'; console.error('Studio wordmark: ' + error); });

// DJ Yo: headphones, twin spinning decks and a spectrum that dances on the beat.
var dj = new THREE.Group(); world.add(dj);
var djBooth = mesh(new THREE.BoxGeometry(5.8, 1.35, 1.7), standard(0x151220, VIOLET, 0.25, 0.3, 0.55), dj); djBooth.position.set(0, -1.05, 0.6);
var boothRail = mesh(new THREE.BoxGeometry(6.1, 0.1, 1.85), glow(CYAN, 0.65), dj); boothRail.position.set(0, -0.35, 0.6);
var djDecks = [];
for (var d = 0; d < 2; d++) {
  var deck = new THREE.Group(); dj.add(deck); deck.position.set(d ? 1.65 : -1.65, -0.25, 0.65);
  var platter = mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.15, 32), standard(0x08080d, VIOLET, 0.2, 0.3, 0.6), deck);
  var vinylRing = mesh(new THREE.TorusGeometry(0.64, 0.045, 8, 48), glow(d ? ORANGE : CYAN, 0.72), deck); vinylRing.rotation.x = Math.PI / 2; vinylRing.position.y = 0.1;
  var spindle = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16), glow(WHITE, 0.8), deck); spindle.position.y = 0.12;
  djDecks.push(deck);
}
var EQ_COUNT = 36;
var djEqualizer = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(VIOLET, 0.65), EQ_COUNT);
djEqualizer.instanceMatrix.setUsage(THREE.DynamicDrawUsage); dj.add(djEqualizer);
for (var eq = 0; eq < EQ_COUNT; eq++) djEqualizer.setColorAt(eq, new THREE.Color(eq % 5 === 0 ? ORANGE : (eq % 2 ? CYAN : VIOLET)));
if (djEqualizer.instanceColor) djEqualizer.instanceColor.needsUpdate = true;
var headphones = new THREE.Group(); bot.add(headphones);
var headband = mesh(new THREE.TorusGeometry(1.02, 0.1, 8, 32, Math.PI), glow(ORANGE, 0.75), headphones); headband.position.set(0, 0.25, 0.12);
for (var hp = 0; hp < 2; hp++) {
  var cup = mesh(new THREE.BoxGeometry(0.34, 0.68, 0.38), standard(ORANGE, ORANGE, 0.3, 0.35, 0.45), headphones); cup.position.set(hp ? 1.14 : -1.14, 0.1, 0.12);
}
function updateDJ(frame, pulse) {
  dj.position.set(0, 0.2, -1.5); dj.rotation.y = Math.sin(frame * 0.009) * 0.08;
  for (var i = 0; i < djDecks.length; i++) djDecks[i].rotation.y = frame * (i ? -0.19 : 0.23);
  for (var b = 0; b < EQ_COUNT; b++) {
    var wave = 0.3 + Math.abs(Math.sin(frame * 0.12 + b * 0.63)) * (0.5 + pulse * 2.4) + rnd(b, 101) * 0.35;
    var x = (b - (EQ_COUNT - 1) / 2) * 0.24;
    setMatrix(djEqualizer, b, x, -1.45 + wave / 2, -1.6, 0.12, wave, 0.12, 0, 0, 0);
  }
  djEqualizer.instanceMatrix.needsUpdate = true;
  bot.position.set(Math.sin(frame * 0.04) * 0.12, 1.05 + Math.abs(Math.sin(frame * 0.16)) * 0.18, -1.35);
  bot.scale.setScalar(0.78); headphones.visible = true;
}

// Real JSR showpieces: RobotExpressive dance + LDraw X-Wing construction.
// Both are ordinary local assets driven by the composition frame.
var showcase = new THREE.Group(); world.add(showcase); showcase.visible = false;
var showcaseFloor = mesh(new THREE.CylinderGeometry(6.1, 6.45, 0.32, 72), standard(0x111326, VIOLET, 0.09, 0.24, 0.78), showcase);
showcaseFloor.position.y = -0.18; showcaseFloor.receiveShadow = true;
for (var sr = 0; sr < 3; sr++) {
  var stageRing = mesh(new THREE.TorusGeometry(4.4 + sr * 0.65, 0.035 + sr * 0.008, 10, 128), glow(sr === 1 ? ORANGE : (sr === 2 ? VIOLET : CYAN), 0.72), showcase);
  stageRing.rotation.x = Math.PI / 2; stageRing.position.y = 0.015 + sr * 0.012;
}
var danceRig = new THREE.Group(); showcase.add(danceRig);
danceRig.position.set(-1.65, 0.06, 0.35); danceRig.scale.setScalar(1.25);
var danceMixer = null, danceFace = null, danceAssetState = 'loading', danceActions = {};
new THREE.GLTFLoader().load('three/RobotExpressive.glb', function(gltf) {
  var model = gltf.scene;
  model.traverse(function(node) {
    if (node.isMesh) {
      node.castShadow = true; node.receiveShadow = true;
      if (node.material && node.material.roughness !== undefined) node.material.roughness = Math.max(0.28, node.material.roughness);
    }
  });
  danceRig.add(model);
  danceMixer = new THREE.AnimationMixer(model);
  ['Dance', 'Jump', 'Wave', 'Yes', 'ThumbsUp'].forEach(function(name) {
    var clip = gltf.animations.find(function(item) { return item.name === name; });
    if (!clip) return;
    var action = danceMixer.clipAction(clip);
    action.play(); action.setEffectiveWeight(name === 'Dance' ? 1 : 0);
    danceActions[name] = action;
  });
  danceFace = model.getObjectByName('Head_4');
  danceAssetState = 'ready';
  renderLatestFrame();
}, undefined, function(error) { danceAssetState = 'error'; console.error('RobotExpressive: ' + error); });

var legoRig = new THREE.Group(); showcase.add(legoRig);
legoRig.position.set(2.55, 2.7, -2.1);
var legoModel = null, legoNodes = [], legoAssetState = 'loading';
function readJldrFloats(bytes, view, descriptor) {
  var count = descriptor.count * descriptor.itemSize;
  var width = descriptor.encoding === 'float32' || descriptor.encoding === 'int16' ? descriptor.encoding === 'float32' ? 4 : 2 : 1;
  var values = new Float32Array(count);
  for (var i = 0; i < count; i++) {
    var offset = descriptor.offset + i * width;
    if (descriptor.encoding === 'int16') {
      var channel = i % descriptor.itemSize;
      values[i] = view.getInt16(offset, true) * descriptor.scale[channel] + descriptor.center[channel];
    } else if (descriptor.encoding === 'int8') values[i] = view.getInt8(offset) / 127;
    else if (descriptor.encoding === 'uint8') values[i] = view.getUint8(offset) / 255;
    else values[i] = view.getFloat32(offset, true);
  }
  return values;
}
function parseJldrModel(bytes) {
  var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 12 || view.getUint32(0, true) !== 1380207690) throw new Error('invalid JLDR magic');
  var headerLength = view.getUint32(4, true);
  var data = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + headerLength)));
  if (data.magic !== 'JLDR' || data.version !== 2) throw new Error('unsupported JLDR version');
  var materials = data.materials.map(function(source) {
    var material = source.kind === 'standard' ? new THREE.MeshStandardMaterial() : new THREE.MeshBasicMaterial();
    material.name = source.name; material.color.setHex(source.color);
    if (material.isMeshStandardMaterial) { material.roughness = source.roughness; material.metalness = source.metalness; }
    material.opacity = source.opacity; material.transparent = source.transparent;
    material.depthWrite = source.depthWrite; material.side = source.side; material.vertexColors = source.vertexColors;
    material.polygonOffset = source.polygonOffset; material.polygonOffsetFactor = source.polygonOffsetFactor; material.polygonOffsetUnits = source.polygonOffsetUnits;
    return material;
  });
  var geometries = data.geometries.map(function(source) {
    var geometry = new THREE.BufferGeometry();
    Object.keys(source.attributes).forEach(function(name) {
      if (name === 'smoothNormal') return;
      var descriptor = name === 'normal' && source.attributes.smoothNormal ? source.attributes.smoothNormal : source.attributes[name];
      geometry.setAttribute(name, new THREE.BufferAttribute(readJldrFloats(bytes, view, descriptor), descriptor.itemSize));
    });
    if (source.index) {
      var indices = new Uint32Array(source.index.count);
      for (var i = 0; i < indices.length; i++) indices[i] = view.getUint32(source.index.offset + i * 4, true);
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }
    for (var g = 0; g < source.groups.length; g++) {
      var group = source.groups[g]; geometry.addGroup(group.start, group.count, group.materialIndex);
    }
    return geometry;
  });
  var nodes = data.nodes.map(function(source) {
    var node = source.kind === 'mesh' ? new THREE.Mesh() : source.kind === 'line' ? new THREE.LineSegments() : new THREE.Group();
    node.name = source.name; node.matrix.fromArray(source.matrix); node.matrix.decompose(node.position, node.quaternion, node.scale);
    if (source.buildingStep !== undefined) node.userData.buildingStep = source.buildingStep;
    if (source.geometry >= 0) node.geometry = geometries[source.geometry];
    if (source.materials.length === 1) node.material = materials[source.materials[0]];
    else if (source.materials.length) node.material = source.materials.map(function(index) { return materials[index]; });
    return node;
  });
  data.nodes.forEach(function(source, index) { if (source.parent >= 0) nodes[source.parent].add(nodes[index]); });
  nodes[0].userData.numBuildingSteps = data.numBuildingSteps;
  return nodes[0];
}
jsr.three.loadAsset('three/ldraw/30051-1-X-wingFighter-Mini.mpd_Packed.mpd.bin').then(function(record) {
  var model = parseJldrModel(record.bytes);
  model.rotation.x = Math.PI;
  var bounds = new THREE.Box3().setFromObject(model);
  var center = bounds.getCenter(new THREE.Vector3());
  var size = bounds.getSize(new THREE.Vector3());
  var scale = 5.6 / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  model.traverse(function(node) {
    legoNodes.push(node);
    if (node.isLineSegments) node.visible = false;
    if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
  });
  legoRig.add(model); legoModel = model; legoAssetState = 'ready';
  renderLatestFrame();
}).catch(function(error) { legoAssetState = 'error'; console.error('LDraw X-Wing: ' + error); });

function updateShowcase(frame, progress, pulse) {
  if (latestParams.act >= 14) progress = ((latestParams.beat % 2) + (latestParams.beatPhase || 0)) / 2;
  var buildProgress = clamp((progress - 0.16) / 0.66, 0, 1);
  var actionNames = ['Dance', 'Jump', 'Wave', 'Yes', 'ThumbsUp'];
  var actionPhase = clamp(progress, 0, 0.99999) * actionNames.length;
  var actionIndex = Math.floor(actionPhase);
  var actionBlend = clamp((actionPhase - actionIndex - 0.72) / 0.28, 0, 1);
  actionBlend = actionBlend * actionBlend * (3 - 2 * actionBlend);
  for (var ai = 0; ai < actionNames.length; ai++) {
    var action = danceActions[actionNames[ai]];
    if (!action) continue;
    var weight = ai === actionIndex ? 1 - actionBlend : (ai === (actionIndex + 1) % actionNames.length ? actionBlend : 0);
    action.setEffectiveWeight(weight);
  }
  if (danceMixer) danceMixer.setTime(frame / Math.max(1, FPS));
  danceRig.position.x = -1.65 + Math.sin(progress * TWO_PI) * 0.55;
  danceRig.position.z = 0.35 + Math.sin(progress * TWO_PI * 2) * 0.32;
  danceRig.rotation.y = 0.28 + Math.sin(progress * TWO_PI) * 0.55;
  if (danceFace && danceFace.morphTargetDictionary && danceFace.morphTargetDictionary.Smile !== undefined) {
    danceFace.morphTargetInfluences[danceFace.morphTargetDictionary.Smile] = 0.55 + pulse * 0.35;
  }
  if (legoModel) {
    var steps = Math.max(1, legoModel.userData.numBuildingSteps || 1);
    var step = Math.min(steps - 1, Math.floor(buildProgress * steps));
    for (var i = 0; i < legoNodes.length; i++) {
      var node = legoNodes[i];
      if (node.isLineSegments) node.visible = false;
      else if (node.isGroup && node.userData.buildingStep !== undefined) node.visible = node.userData.buildingStep <= step;
    }
  }
  legoRig.rotation.set(0.08 + Math.sin(frame * 0.013) * 0.06, -0.55 + progress * 0.7, 0.05);
  legoRig.position.x = 2.3 + Math.cos(progress * TWO_PI) * 0.18;
  legoRig.position.y = 2.35 + Math.sin(frame * 0.035) * 0.1;
  legoRig.position.z = -1.8;
  showcase.rotation.y = Math.sin(frame * 0.006) * 0.05;
}
function showcaseShot(progress) {
  if (latestParams.act >= 14) progress = ((latestParams.beat % 2) + (latestParams.beatPhase || 0)) / 2;
  if (progress < 0.16) {
    var robotMove = inOut(progress / 0.16);
    shotCamera(0.8 - robotMove * 0.5, 2.45, 9.2 - robotMove * 0.8, danceRig.position.x, 2.0, 0.2, 45);
  } else if (progress < 0.82) {
    var build = clamp((progress - 0.16) / 0.66, 0, 1);
    var reveal = inOut(build);
    shotCamera(4.6 + reveal * 1.2, 3.0 + reveal * 0.65, 2.2 + reveal * 4.0, legoRig.position.x, legoRig.position.y, legoRig.position.z, 42);
  } else {
    var wide = inOut((progress - 0.82) / 0.18);
    shotCamera(4.8 - wide * 1.0, 3.4, 10.2 + wide * 1.3, 0.3, 1.55, -0.5, 45);
  }
}

function shotCamera(x, y, z, tx, ty, tz, fov) {
  cameraTarget.set(tx || 0, ty || 0, tz || 0);
  camera.position.set(x, y, z); camera.lookAt(cameraTarget);
  if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
}
function updateBot(frame, act, beat, pulse, lyric) {
  var blink = frame % 89 < 6 ? 0.1 : 1;
  eyeL.scale.y = blink; eyeR.scale.y = blink;
  eyeMat.color.setHex(act === 16 ? ORANGE : CYAN);
  var talking = lyric ? 1 : 0;
  mouth.scale.x = 0.65 + talking * (0.35 + 0.25 * Math.sin(frame * 0.65));
  mouth.scale.y = act === 16 ? 4 : 1;
  eyeL.scale.x = act === 16 ? 1.5 : 1; eyeR.scale.x = act === 16 ? 1.5 : 1;
  bot.rotation.x = 0;
  bot.rotation.z = Math.sin(beat * 0.7) * 0.045;
  bot.rotation.y = Math.sin(frame * 0.018) * 0.18;
  armL.rotation.z = -0.82 - Math.sin(beat * 0.9) * 0.42;
  armR.rotation.z = 0.82 + Math.cos(beat * 0.9) * 0.42;
  legL.rotation.z = 0; legR.rotation.z = 0;
  antennaTip.scale.setScalar(0.85 + pulse * 0.5);
}
function updateCode(frame, act, progress, pulse) {
  for (var i = 0; i < CODE_COUNT; i++) {
    var row = Math.floor(i / 8), col = i % 8;
    var x = (col - 3.5) * 2.25 + (rnd(i, 2) - 0.5) * 0.6;
    var y = (row - 4) * 0.62;
    var z = -3 - rnd(i, 3) * 5;
    if (act === 3) { z += (1 - progress) * 10; y += Math.sin(frame * 0.035 + i) * 0.15; }
    if (act === 12) { var gather = 1 - progress * 0.82; x *= gather; y *= gather; z += progress * 4; }
    if (act === 14 || act === 15) { x += Math.sin(frame * 0.03 + i) * 1.2; y += Math.cos(frame * 0.025 + i) * 0.35; }
    var w = 0.5 + rnd(i, 5) * 1.55;
    setMatrix(codeMesh, i, x, y, z, w, 0.035 + pulse * 0.018, 1, 0, 0, 0);
  }
  codeMesh.instanceMatrix.needsUpdate = true;
}
function updateParticles(frame, act, progress, pulse) {
  var count = act === 7 ? 320 : (act === 12 ? 500 : PARTICLE_COUNT);
  particleGeometry.setDrawRange(0, count);
  particles.material.size = act >= 14 ? 0.085 : 0.06;
  particles.material.opacity = act === 12 ? 0.35 : 0.58;
  for (var i = 0; i < count; i++) {
    var angle = rnd(i, 20) * Math.PI * 2 + frame * (0.003 + rnd(i, 22) * 0.006);
    var radius = 1.4 + rnd(i, 21) * 7;
    var z = (rnd(i, 23) - 0.5) * 14;
    if (act === 5 || act === 10 || act >= 14) z = -10 + ((rnd(i, 23) * 24 + frame * (0.025 + rnd(i, 24) * 0.03)) % 24);
    if (act === 12) { var gather = 1 - progress * 0.9; radius *= gather; z *= gather; }
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
    particlePositions[i * 3 + 2] = z;
  }
  particleGeometry.attributes.position.needsUpdate = true;
}
function updateNodes(frame) {
  for (var i = 0; i < NODE_COUNT; i++) {
    var p = nodePositions[i], s = 0.65 + 0.35 * Math.sin(frame * 0.06 + i);
    setMatrix(nodes, i, p.x, p.y, p.z, s, s, s, frame * 0.01, frame * 0.008, 0);
  }
  nodes.instanceMatrix.needsUpdate = true;
}

function renderFrame(frame, fps, params) {
  var act = params.act || 0, progress = params.actProgress || 0;
  var beat = params.beat || 0, pulse = params.beatPulse || 0, lyric = params.lyricStyle || '';
  var variant = params.variant || 'auto';
  stars.visible = false; bot.visible = false; codeMesh.visible = false; brand.visible = false;
  knotGroup.visible = false; particles.visible = false; beams.visible = false; grid.visible = false;
  city.visible = false; driverRig.visible = false; nodes.visible = true; gates.visible = true;
  road.visible = false; flight.visible = false; cityGrid.visible = true; moon.visible = true; moonGlow.visible = true;
  dj.visible = false; headphones.visible = false; showcase.visible = false; studioRig.visible = false;
  shockwaves.visible = false; shards.visible = false; impactLines.visible = false;
  driftSmoke.visible = false;
  var bg = act === 16 ? 0x020204 : 0x05050a;
  world.background.setHex(bg); world.fog.color.setHex(bg); world.fog.density = 0.017;
  stars.material.opacity = 0.32;
  brand.rotation.set(0, 0, 0);
  beams.rotation.set(0, 0, 0);
  carRig.rotation.set(0.08 + Math.sin(frame * 0.008) * 0.05, frame * 0.012, Math.sin(frame * 0.01) * 0.04);
  carRig.position.y = Math.sin(frame * 0.02) * 0.16;
  violetLight.position.set(Math.cos(frame * 0.01) * 7, 2 + Math.sin(frame * 0.015) * 2, 5); violetLight.intensity = 52;
  cyanLight.position.set(Math.cos(frame * 0.009 + Math.PI) * 7, -1 + Math.sin(frame * 0.012) * 2, 4); cyanLight.intensity = 58;
  orangeLight.position.set(0, 3, 5); orangeLight.intensity = act >= 14 ? 25 + pulse * 30 : (act === 3 ? 8 + pulse * 10 : 0);
  var finalMode = Math.floor(beat / 2) % 8;
  var detailHero = (act === 9 && frame / fps >= 108.18) || ((act === 14 || act === 15) && variant === 'auto' && finalMode === 1);
  var driftHero = ((act === 5 || act === 10) && variant === 'auto') || ((act === 14 || act === 15) && variant === 'auto' && finalMode === 0) || (act === 17 && frame / fps >= 199.32);
  var carHero = act === 3 || detailHero || driftHero || ((act === 14 || act === 15) && variant === 'car_drive');
  var flightHero = variant === 'flight' && (act === 5 || act === 10 || act === 14 || act === 15);
  carKey.visible = carHero || flightHero;
  carKey.intensity = 34 + pulse * 5;
  key.intensity = 2.1 + pulse * 0.35;
  stars.rotation.y = frame * 0.0005;

  if (act === 0) {
    stars.visible = true; stars.material.opacity = 0.12;
    shotCamera(0, 0, 16, 0, 0, 0, 42);
  } else if (act === 1) {
    codeMesh.visible = true; bot.visible = true; stars.visible = true;
    bot.position.set(3.8, -0.4, -1); bot.scale.setScalar(0.75 + progress * 0.3);
    updateBot(frame, act, beat, pulse, lyric); updateCode(frame, act, progress, pulse);
    shotCamera(-0.5, 0.5, 15 - progress * 2, 0.8, 0, 0, 42);
  } else if (act === 2) {
    codeMesh.visible = true; bot.visible = true; stars.visible = true; city.visible = true;
    // Feet bottom is -1.49 in local space: place them on the city ground (y=0),
    // not the body centre below it, which used to slice the robot horizontally.
    bot.position.set(4.8, 1.55, -1); bot.scale.setScalar(1.05);
    updateBot(frame, act, beat, pulse, lyric); updateCode(frame, act, progress, pulse); updateCity(frame, 0.3 + progress * 0.45, false);
    shotCamera(Math.sin(frame * 0.008) * 1.1, 0.4, 14.5, 0.7, 0, 0, 43);
  } else if (act === 3) {
    codeMesh.visible = true; particles.visible = true; stars.visible = true; city.visible = true;
    updateCarDrive(frame, progress, pulse); updateCode(frame, act, progress, pulse); updateParticles(frame, act, progress, pulse); updateCity(frame, 1, true, 1);
    carDriveShot(progress);
  } else if (act === 4 || act === 6) {
    // Flutter owns these paper/split screens. Keep a valid quiet GPU surface.
    shotCamera(0, 0, 16, 0, 0, 0, 42);
  } else if (act === 5) {
    particles.visible = true; beams.visible = true; stars.visible = true;
    updateParticles(frame, act, progress, pulse);
    if (variant === 'flight') {
      flight.visible = true; particles.visible = false; beams.visible = false; stars.visible = false;
      updateFlight(frame, progress, pulse);
    } else if (variant === 'dj') {
      dj.visible = true; bot.visible = true;
      updateDJ(frame, pulse); updateBot(frame, act, beat, pulse, lyric);
      shotCamera(3.8, 3.4, 12.2, 0, 0.2, -1, 43);
    } else if (variant === 'car_drive') {
      city.visible = true; beams.visible = false;
      updateCarDrive(frame, progress, pulse); updateCity(frame, 1, true);
      carDriveShot(progress);
    } else if (variant === 'city') {
      city.visible = true; updateCity(frame, 1, true);
      shotCamera(0, 3.2, 13.5, 0, 3.0, -16, 46);
    } else {
      city.visible = true;
      updateCarDrift(frame, progress, pulse); updateCity(frame, 1, true, 0.65); carDriftShot(progress);
    }
  } else if (act === 7) {
    particles.visible = true; stars.visible = true; beams.visible = true; showcase.visible = true;
    updateParticles(frame, act, progress, pulse);
    updateShowcase(frame, progress, pulse);
    showcaseShot(progress);
  } else if (act === 8) {
    particles.visible = true; stars.visible = true; beams.visible = true; codeMesh.visible = true;
    updateParticles(frame, act, progress, pulse); updateCode(frame, act, progress, pulse);
    beams.rotation.z = -0.18 + Math.sin(frame * 0.008) * 0.12;
    shotCamera(Math.sin(frame * 0.009) * 2.4, 1.4, 16 - progress * 2.5, 0, 0.4, -2, 44);
  } else if (act === 9) {
    if (detailHero) {
      city.visible = true;
      updateCarDrive(frame, progress, pulse); updateCity(frame, 1, true, 0.65);
      carDetailShot(clamp((frame / fps - 108.18) / 2.04, 0, 1));
    } else {
      codeMesh.visible = true; particles.visible = true; stars.visible = true; city.visible = true;
      updateCode(frame, act, progress, pulse); updateParticles(frame, act, progress, pulse); updateCity(frame, 1, false);
      shotCamera(0, 0.5, 15 - progress * 2, 0, 0, 0, 44);
    }
  } else if (act === 10) {
    particles.visible = true; beams.visible = true;
    updateParticles(frame, act, progress, pulse);
    if (variant === 'flight') {
      flight.visible = true; particles.visible = false; beams.visible = false; stars.visible = false;
      updateFlight(frame, progress, pulse);
    } else if (variant === 'dj') {
      dj.visible = true; bot.visible = true;
      updateDJ(frame, pulse); updateBot(frame, act, beat, pulse, lyric);
      shotCamera(-3.8, 3.4, 12.2, 0, 0.2, -1, 43);
    } else if (variant === 'car_drive') {
      city.visible = true; beams.visible = false;
      updateCarDrive(frame, progress, pulse); updateCity(frame, 1, true);
      carDriveShot(progress);
    } else if (variant === 'city') {
      city.visible = true; updateCity(frame, 1, true);
      shotCamera(0, 2.6, 12.5, 0, 3.2, -16, 48);
    } else {
      city.visible = true;
      updateCarDrift(frame, progress, pulse); updateCity(frame, 1, true, 0.65); carDriftShot(progress);
    }
  } else if (act === 11) {
    bot.visible = true; stars.visible = true; codeMesh.visible = true; city.visible = true;
    bot.position.set(0, -3.1, -1); bot.scale.setScalar(0.68); updateBot(frame, act, beat, pulse, lyric); updateCode(frame, act, progress, pulse); updateCity(frame, 1, false);
    shotCamera(0, 0.2, 15.5, 0, -0.8, 0, 42);
  } else if (act === 12) {
    particles.visible = true; codeMesh.visible = true; stars.visible = true;
    updateParticles(frame, act, progress, pulse); updateCode(frame, act, progress, pulse);
    shotCamera(0, 0, 15 - progress * 5, 0, 0, 0, 42);
  } else if (act === 13) {
    particles.visible = true; stars.visible = true; beams.visible = true;
    updateParticles(frame, act, progress, pulse);
    shotCamera(Math.sin(frame * 0.015) * 2.8, 0.4, 14.5 - progress * 2, 0, 0, -1, 44);
  } else if (act === 14 || act === 15) {
    var mode = Math.floor(beat / 2) % 8;
    if (variant === 'car_drive') mode = 3;
    else if (variant === 'city') mode = 4;
    else if (variant === 'flight') mode = 5;
    else if (variant === 'dj') mode = 6;
    else if (variant === 'showcase') mode = 7;
    var segmentProgress = ((beat % 2) + (params.beatPhase || 0)) / 2;
    brand.visible = false; knotGroup.visible = mode === 0 || mode === 1 || mode === 3;
    bot.visible = mode === 2 || mode === 6;
    city.visible = mode === 0 || mode === 1 || mode === 3 || mode === 4;
    flight.visible = mode === 5; dj.visible = mode === 6; showcase.visible = mode === 7;
    particles.visible = mode !== 5; beams.visible = mode > 1 && mode !== 3 && mode !== 5; codeMesh.visible = mode === 2 || mode === 4; stars.visible = mode !== 5;
    if (mode === 0) updateCarDrift(frame, segmentProgress, pulse);
    else if (mode === 1 || mode === 3) updateCarDrive(frame, segmentProgress, pulse);
    else if (mode !== 5 && mode !== 6) {
      bot.scale.setScalar(1.15 + pulse * 0.035); bot.position.set(0, -0.2, -2);
    }
    if (bot.visible) updateBot(frame, act, beat, pulse, lyric);
    if (mode === 5) updateFlight(frame, progress, pulse);
    if (mode === 6) updateDJ(frame, pulse);
    if (mode === 7) updateShowcase(frame, progress, pulse);
    if (codeMesh.visible) updateCode(frame, act, progress, pulse);
    if (city.visible) updateCity(frame, 1, true);
    updateParticles(frame, act, progress, pulse);
    if (mode === 0) carDriftShot(segmentProgress);
    else if (mode === 1) carDetailShot(segmentProgress);
    else if (mode === 3) carDriveShot(progress);
    else if (mode === 4) shotCamera(0, 3.0, 12.8, 0, 3.0, -16, 47);
    else if (mode === 6) shotCamera(3.8, 3.4, 12.2, 0, 0.2, -1, 43);
    else if (mode === 7) showcaseShot(progress);
    else shotCamera(Math.sin(frame * 0.018) * 3.5, 0.8 + Math.sin(frame * 0.012), 13.8, 0, 0, -1, 45);
  } else if (act === 16) {
    bot.visible = true; bot.position.set(0, -2.5, -2); bot.scale.setScalar(0.72);
    updateBot(frame, act, beat, 0, lyric); shotCamera(0, 0, 14, 0, -0.7, 0, 42);
  } else {
    if (driftHero) {
      var outroDrift = clamp((frame / fps - 199.32) / 0.68, 0, 1);
      city.visible = false;
      updateCarDrift(frame, outroDrift, pulse); carDriftShot(outroDrift);
    } else {
      brand.visible = true; particles.visible = true; beams.visible = true; stars.visible = true;
      brand.scale.setScalar(0.9 + pulse * 0.025); brand.position.set(0, 0.8, -2.5); brand.rotation.set(0, Math.sin(frame * 0.01) * 0.25, 0);
      updateParticles(frame, act, progress, pulse); shotCamera(0, 0.2, 15 - progress * 3.5, 0, 0.2, 0, 43);
    }
  }
  if (brand.visible) updateBrand(frame, pulse);
  // Hero scenes use physical space and motivated light, not overlapping effects.
  if (carHero) {
    world.background.setHex(0x03060d); world.fog.color.setHex(0x03060d); world.fog.density = 0.011;
    road.visible = true; cityGrid.visible = false; moon.visible = false; moonGlow.visible = false;
    particles.visible = false; codeMesh.visible = false; speedLines.visible = false; gates.visible = false; beams.visible = false; nodes.visible = false;
    carKey.position.set(camera.position.x * 0.65, 4.4, camera.position.z * 0.65); carKey.intensity = 48 + pulse * 5;
    violetLight.intensity = 6; cyanLight.intensity = 6;
    orangeLight.position.set(0, 5.4, 7 - ((frame * 0.48) % 18)); orangeLight.intensity = 10 + pulse * 2;
  }
  if (flightHero) {
    world.background.setHex(0x030711); world.fog.color.setHex(0x030711); world.fog.density = 0.008;
    carKey.position.set(0, 4.5, 7); carKey.intensity = 48 + pulse * 5;
    violetLight.intensity = 7; cyanLight.intensity = 8; orangeLight.intensity = 0;
  }
  var energyAct = !carHero && !flightHero && (act === 5 || act === 7 || act === 10 || act === 14 || act === 15 || act === 17);
  if (energyAct) {
    var energy = act >= 14 && act <= 15 ? 1.25 : 0.8;
    shockwaves.visible = true; shards.visible = true; impactLines.visible = true;
    shockwaves.position.set(0, 0, 0);
    updateEnergyEffects(frame, params.beatPhase || 0, pulse, energy);
  }
  var wordProgress = params.wordProgress || 0;
  var focusPush = params.focusPush || 0;
  if (focusPush > 0) camera.position.lerp(cameraTarget, focusPush * 0.08);
  var hasWord = (params.wordIndex === undefined ? -1 : params.wordIndex) >= 0;
  camera.zoom = 1 + focusPush * 0.12 + (hasWord ? Math.exp(-wordProgress * 5) * 0.035 : 0) + pulse * 0.008 + (act === 12 ? progress * 0.08 : 0);
  camera.updateProjectionMatrix();
  camera.rotation.z += Math.sin(frame * 0.025) * (act >= 14 && act <= 15 ? 0.006 : 0.0025);
  renderer.toneMappingExposure = 1.0 + pulse * 0.035;
  if (USE_FXAA && hasMasterFrame) {
    ensureFxaaComposer();
    fxaaComposer.render(0);
  } else {
    renderer.render(world, camera);
  }
}

function handleEvent(action, payload) {
  if (action !== 'yoclip.frame') return;
  payload = payload || {};
  hasMasterFrame = true;
  var nextW = Math.max(1, Math.round(payload.width || W)), nextH = Math.max(1, Math.round(payload.height || H));
  var nextScale = outputPixelRatio(nextW);
  var sizeChanged = nextW !== W || nextH !== H;
  // Never combine the old dimensions with the new DPR. In particular, going
  // from the native 8K master to a 1080p poster with a 3× ratio would briefly
  // request a 23040×12960 buffer before setSize() applies the smaller size.
  // A neutral 1× ratio keeps both the old and new buffers within the limit.
  if (sizeChanged || nextScale !== RENDER_SCALE) {
    renderer.setPixelRatio(1);
    if (sizeChanged) {
      W = nextW; H = nextH;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    RENDER_SCALE = nextScale;
    renderer.setPixelRatio(RENDER_SCALE);
    if (sizeChanged) resizeFxaa(W, H);
  }
  FPS = payload.fps || FPS;
  var frame = Math.max(0, Math.round(payload.frame || 0));
  latestFrame = frame;
  latestFps = FPS;
  latestParams = payload.params || {};
  renderFrame(timelineFrame(frame), MASTER_FPS, latestParams);
  jsr.render({ type: 'three', canvasId: 'main', width: W, height: H, pixelRatio: RENDER_SCALE });
  jsr.exportState({ renderer: 'THREE r186', backend: 'Flutter GPU', frame: frame, act: latestParams.act || 0, particles: PARTICLE_COUNT, carAsset: carAssetState, driverAsset: driverAssetState });
}
jsr.onEvent(handleEvent);
worldReady = true;
renderLatestFrame();
console.log('WRITE THE LIGHT — THREE world ready / deterministic master frames');
