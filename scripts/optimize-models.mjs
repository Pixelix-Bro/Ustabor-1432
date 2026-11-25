/**
 * Optimizes the raw Sketchfab GLBs in source-assets/models into web-ready
 * files in public/models.
 *
 *  - converts KHR_materials_pbrSpecularGlossiness -> metal/rough (three.js dropped SG support)
 *  - removes unused vertex attributes (the scans carry 5 UV sets + tangents)
 *  - welds + simplifies dense scan meshes with meshoptimizer
 *  - resizes textures and re-encodes as WebP
 *  - meshopt-compresses geometry
 *
 * Usage: node scripts/optimize-models.mjs [name-filter]
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup, prune, flatten, join, weld, simplify, resample,
  metalRough, meshopt, sparse,
} from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = 'source-assets/models';
const OUT = 'public/models';

/** @type {Array<{src:string,out:string,ratio:number,error:number,tex:number,texSmall?:number,skinned?:boolean}>} */
const MODELS = [
  { src: 'pointing_construction_worker.glb',   out: 'pointing-worker.glb',  ratio: 0.45, error: 0.0008, tex: 2048 },
  { src: 'construction_worker_in_training.glb', out: 'trainee-worker.glb',   ratio: 0.45, error: 0.0008, tex: 2048 },
  { src: 'blue_collar_worker_in_overalls.glb', out: 'overalls-worker.glb',  ratio: 0.45, error: 0.0008, tex: 2048 },
  { src: 'industrial_safety_worker_walking.glb', out: 'safety-worker.glb',  ratio: 0.5,  error: 0.0008, tex: 2048 },
  { src: 'oilfield_worker_portrait.glb',       out: 'oilfield-worker.glb',  ratio: 0.5,  error: 0.0008, tex: 2048 },
  { src: '009_male_worker_welder_06.glb',      out: 'welder.glb',           ratio: 0.3,  error: 0.01,   tex: 2048 },
  { src: 'pete.glb',                           out: 'pete.glb',             ratio: 1,    error: 0,      tex: 2048, skinned: true },
  { src: 'worker_male_stylized_clothed.glb',   out: 'stylized-worker.glb',  ratio: 1,    error: 0,      tex: 1024, skinned: true },
];

const filter = process.argv[2];
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const mb = (p) => (statSync(p).size / 1e6).toFixed(1) + ' MB';

for (const m of MODELS) {
  if (filter && !m.src.includes(filter) && !m.out.includes(filter)) continue;
  const srcPath = path.join(SRC, m.src);
  const outPath = path.join(OUT, m.out);
  console.log(`\n→ ${m.src} (${mb(srcPath)})`);
  const t0 = Date.now();
  // Stage 1 (child process): textures → WebP
  const tmpPath = path.join(OUT, `.tmp-${m.out}`);
  execFileSync(process.execPath, ['scripts/lib/webp-textures.mjs', srcPath, tmpPath, String(m.tex)], { stdio: 'inherit' });
  // Stage 2 (this process): geometry
  const doc = await io.read(tmpPath);
  rmSync(tmpPath);

  const steps = [
    metalRough(),
    dedup(),
  ];
  if (!m.skinned) steps.push(flatten(), join());
  steps.push(
    prune({ keepAttributes: false, keepLeaves: false }),
    weld(),
  );
  if (m.ratio < 1) steps.push(simplify({ simplifier: MeshoptSimplifier, ratio: m.ratio, error: m.error, lockBorder: false }));
  if (m.skinned) steps.push(resample());
  steps.push(
    sparse(),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  await doc.transform(...steps);

  // report
  const root = doc.getRoot();
  let tris = 0;
  for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
    const idx = prim.getIndices();
    tris += idx ? idx.getCount() / 3 : prim.getAttribute('POSITION').getCount() / 3;
  }
  await io.write(outPath, doc);
  console.log(`  ✓ ${m.out}: ${mb(outPath)}, ${Math.round(tris).toLocaleString()} tris, ${root.listMeshes().length} meshes, ${root.listMaterials().length} materials, ${root.listTextures().length} textures, ${((Date.now()-t0)/1000).toFixed(0)}s`);
}
console.log('\nDone.');
