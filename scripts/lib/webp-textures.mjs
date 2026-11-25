/**
 * Stand-alone texture pass (runs in its own process – libvips misbehaves when
 * sharp shares a process with the meshoptimizer WASM module).
 *
 * node scripts/lib/webp-textures.mjs <in.glb> <out.glb> <maxSize>
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';

const [, , input, output, sizeArg] = process.argv;
const size = Number(sizeArg) || 2048;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(input);
const root = doc.getRoot();
const normalTextures = new Set(root.listMaterials().map((m) => m.getNormalTexture()).filter(Boolean));

let before = 0;
let after = 0;
for (const tex of root.listTextures()) {
  const src = tex.getImage();
  if (!src) continue;
  before += src.byteLength;
  const isNormal = normalTextures.has(tex);
  const out = await sharp(src)
    .resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: isNormal ? 90 : 82, effort: 4, smartSubsample: !isNormal })
    .toBuffer();
  after += out.byteLength;
  tex.setImage(out).setMimeType('image/webp');
  if (tex.getURI()) tex.setURI(tex.getURI().replace(/\.(png|jpe?g)$/i, '.webp'));
}
await io.write(output, doc);
console.log(`  textures: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB (${root.listTextures().length} textures @ ≤${size}px)`);
