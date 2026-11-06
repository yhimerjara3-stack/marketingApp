const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function packDist() {
  const zip = new JSZip();
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(rootDir, 'public');

  function addDir(dirPath, zipFolder) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDir(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    }
  }

  addDir(distDir, zip);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = path.join(publicDir, 'mercado-expres-compilado-web.zip');
  fs.writeFileSync(outPath, zipBuffer);

  console.log(`ZIP Compilado Web creado exitosamente en: ${outPath} (${(zipBuffer.length / 1024).toFixed(1)} KB)`);
}

packDist().catch(console.error);
