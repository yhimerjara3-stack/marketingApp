const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter type 0 before each scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = width * (isMaskable ? 0.42 : 0.45);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base color: Fresh Market Green (#16a34a -> r:22, g:163, b:74)
      let r = 22, g = 163, b = 74, a = 255;

      if (!isMaskable) {
        // Squircle / Rounded rect background
        const cornerDist = Math.max(Math.abs(dx) - width * 0.35, Math.abs(dy) - height * 0.35);
        if (cornerDist > width * 0.12) {
          a = 0; // Transparent outside
        }
      }

      // Drawing bag/apple silhouette in center
      if (a > 0) {
        // Inner bag body: white
        if (Math.abs(dx) < width * 0.22 && dy > -height * 0.05 && dy < height * 0.32) {
          r = 255; g = 255; b = 255;
        }
        // Handle: white arch
        const handleDist = Math.sqrt(dx * dx + (dy + height * 0.1) * (dy + height * 0.1));
        if (handleDist > width * 0.1 && handleDist < width * 0.16 && dy < -height * 0.05) {
          r = 255; g = 255; b = 255;
        }
        // Center red accent (apple): #ef4444 -> r:239, g:68, b:68
        const appleDist = Math.sqrt(dx * dx + (dy - height * 0.12) * (dy - height * 0.12));
        if (appleDist < width * 0.09) {
          r = 239; g = 68; b = 68;
        }
        // Leaf accent: #22c55e
        if (dx > 0 && dx < width * 0.05 && dy > -height * 0.01 && dy < height * 0.05) {
          r = 34; g = 197; b = 94;
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Icons created successfully in public directory!');
