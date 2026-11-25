/**
 * Derives web assets from the official logo (source-assets/brand/logo.jpg):
 *  - public/brand/logo-mark.png  : the UB mark only, white background removed
 *  - public/brand/logo-full.png  : full lockup, white background removed
 *  - public/brand/favicon.png    : 64px mark on white
 *  - public/brand/apple-touch-icon.png : 180px mark on white
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'source-assets/brand/logo.jpg';
mkdirSync('public/brand', { recursive: true });

async function knockoutWhite(input, threshold = 232) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const min = Math.min(r, g, b);
    if (min >= threshold) {
      data[i + 3] = 0;
    } else if (min >= threshold - 40) {
      // soften the edge
      data[i + 3] = Math.round(((threshold - min) / 40) * 255);
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
}

const meta = await sharp(SRC).metadata();
console.log('logo', meta.width, meta.height);

// Full lockup
const full = await knockoutWhite(await sharp(SRC).toBuffer());
await full.trim({ threshold: 10 }).toFile('public/brand/logo-full.png');

// Mark only – the top ~48% of the artwork holds the UB symbol
const markRegion = await sharp(SRC)
  .extract({ left: 0, top: 0, width: meta.width, height: Math.round(meta.height * 0.49) })
  .toBuffer();
const mark = await knockoutWhite(markRegion);
await mark.trim({ threshold: 10 }).toFile('public/brand/logo-mark.png');

// Favicons (on white, rounded by the browser)
const markBuf = await sharp('public/brand/logo-mark.png').toBuffer();
for (const [size, name] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
  const pad = Math.round(size * 0.1);
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: await sharp(markBuf).resize(size - pad * 2, size - pad * 2, { fit: 'inside' }).toBuffer(), gravity: 'centre' }])
    .png()
    .toFile(`public/brand/${name}`);
}
for (const f of ['logo-full.png', 'logo-mark.png']) {
  const m = await sharp(`public/brand/${f}`).metadata();
  console.log(f, m.width, m.height);
}
console.log('brand assets ready');

// Badge: the full lockup on a white rounded patch – projected onto the
// characters' clothing as a decal (see src/three/useBrandDecal.ts).
{
  const full = await sharp('public/brand/logo-full.png').metadata();
  const pad = 56;
  const w = full.width + pad * 2;
  const h = full.height + pad * 2;
  const r = 64;
  const rounded = Buffer.from(`<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#ffffff"/></svg>`);
  await sharp(rounded)
    .composite([{ input: 'public/brand/logo-full.png', left: pad, top: pad }])
    .png()
    .toFile('public/brand/logo-badge.png');
  const m = await sharp('public/brand/logo-badge.png').metadata();
  console.log('logo-badge.png', m.width, m.height);
}
