import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgContent = readFileSync(join(publicDir, 'favicon.svg'));

// Generate apple-touch-icon (180x180)
await sharp(svgContent)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));

console.log('Generated apple-touch-icon.png (180x180)');

// Generate favicon-32x32
await sharp(svgContent)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon-32x32.png'));

console.log('Generated favicon-32x32.png');

// Generate favicon-16x16
await sharp(svgContent)
  .resize(16, 16)
  .png()
  .toFile(join(publicDir, 'favicon-16x16.png'));

console.log('Generated favicon-16x16.png');

// Generate PWA icons (192 and 512)
await sharp(svgContent)
  .resize(192, 192)
  .png()
  .toFile(join(publicDir, 'logo-192.png'));

console.log('Generated logo-192.png (192x192)');

await sharp(svgContent)
  .resize(512, 512)
  .png()
  .toFile(join(publicDir, 'logo-512.png'));

console.log('Generated logo-512.png (512x512)');

// Generate favicon.ico (multi-size ICO from 32x32 PNG)
// ICO format: we'll create a simple 32x32 single-image ICO
const png32 = await sharp(svgContent)
  .resize(32, 32)
  .png()
  .toBuffer();

// Simple ICO file format
function createIco(pngBuffer, width, height) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);    // Reserved
  header.writeUInt16LE(1, 2);    // Type: ICO
  header.writeUInt16LE(1, 4);    // Number of images

  // Directory entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);   // Width
  entry.writeUInt8(height >= 256 ? 0 : height, 1);  // Height
  entry.writeUInt8(0, 2);        // Color palette
  entry.writeUInt8(0, 3);        // Reserved
  entry.writeUInt16LE(1, 4);     // Color planes
  entry.writeUInt16LE(32, 6);    // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);  // Image size
  entry.writeUInt32LE(22, 12);   // Offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

const icoBuffer = createIco(png32, 32, 32);
writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);

console.log('Generated favicon.ico');
console.log('All favicons generated successfully!');
