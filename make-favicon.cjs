const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, 'images', 'favicon-source.png');
const outDir = path.join(__dirname, 'images');

async function run() {
  // Square crop on a transparent/white canvas, trimmed and fit
  const sizes = [16, 32, 48, 180, 192, 512];
  for (const size of sizes) {
    const outFile = path.join(outDir, `favicon-${size}.png`);
    await sharp(src)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(outFile);
    console.log('wrote', outFile);
  }
  // Also write a standard favicon.ico-equivalent (32x32 png renamed) and apple-touch-icon
  await sharp(src).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, 'favicon.png'));
  await sharp(src).resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('done');
}

run().catch(e => { console.error(e); process.exit(1); });
