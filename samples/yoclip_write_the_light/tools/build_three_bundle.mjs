// Bundle the editable scene and the pinned r186 addons into the single IIFE
// consumed by YoclipThreeSceneWidget._start() -> engine.run(source).
// Production defaults to OutputPass -> FXAA; YOCLIP_FXAA=0 selects direct R1
// rendering for A/B diagnostics. YOCLIP_OUTPUT_ONLY=1 isolates OutputPass.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['three/world.source.js'],
  outfile: 'three/world.js',
  bundle: true,
  write: true,
  format: 'iife',
  platform: 'neutral',
  target: 'es2020',
  minify: false,
  sourcemap: false,
  define: {
    __YOCLIP_FXAA__: JSON.stringify(process.env.YOCLIP_FXAA !== '0'),
    __YOCLIP_OUTPUT_ONLY__: JSON.stringify(process.env.YOCLIP_OUTPUT_ONLY === '1'),
  },
  plugins: [{
    name: 'three-host-global',
    setup(build) {
      build.onResolve({ filter: /^three$/ }, () => ({
        path: path.join(root, 'three/three_global_shim.js'),
      }));
    },
  }],
});
console.log(`THREE bundle: three/world.js (FXAA=${process.env.YOCLIP_FXAA !== '0' ? 'on' : 'off'}, ${result.warnings.length} warnings)`);
