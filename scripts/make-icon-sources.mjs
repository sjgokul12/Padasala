// Renders resources/icon.svg into the PNG sources that `npx capacitor-assets generate` expects.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(import.meta.dirname, '..', 'resources');
const svg = readFileSync(join(dir, 'icon.svg'), 'utf8');
const foregroundOnly = svg.replace(/<rect[^>]*\/>/, '');
const backgroundOnly = svg.replace(/<g[\s\S]*<\/g>/, '').replace(/<!--.*?-->/, '');

const png = (src, size) => sharp(Buffer.from(src)).resize(size, size).png();

await png(svg, 1024).toFile(join(dir, 'icon-only.png'));
await png(foregroundOnly, 1024).toFile(join(dir, 'icon-foreground.png'));
await png(backgroundOnly, 1024).toFile(join(dir, 'icon-background.png'));

// Splash: rounded app icon centred on the site's white / dark background.
const logo = await sharp(Buffer.from(svg))
  .resize(600, 600)
  .composite([{ input: Buffer.from('<svg width="600" height="600"><rect width="600" height="600" rx="300" fill="#fff"/></svg>'), blend: 'dest-in' }])
  .png()
  .toBuffer();
for (const [name, bg] of [['splash.png', '#ffffff'], ['splash-dark.png', '#0b1f33']]) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: bg } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(join(dir, name));
}
console.log('Icon sources written to resources/');
