const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function buildZip() {
  const zip = new JSZip();
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');

  // List of files and folders to include in the ZIP
  const files = [
    '.gitignore',
    '.github/workflows/deploy.yml',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'capacitor.config.json',
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/types/store.ts',
    'src/data/defaultProducts.ts',
    'src/hooks/usePWAInstall.ts',
    'src/hooks/useOnlineStatus.ts',
    'src/hooks/useGeolocation.ts',
    'src/utils/downloadZip.ts',
    'src/components/Header.tsx',
    'src/components/CategoryFilter.tsx',
    'src/components/ProductCard.tsx',
    'src/components/CartDrawer.tsx',
    'src/components/OrderConfirmationModal.tsx',
    'src/components/AdminPanel.tsx',
    'src/components/PitchPresentation.tsx',
    'public/icon.svg',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/pwa-maskable-512x512.png',
    'public/apple-touch-icon.png',
  ];

  // Also include capacitor.config.json if not present on disk
  const capConfigPath = path.join(rootDir, 'capacitor.config.json');
  if (!fs.existsSync(capConfigPath)) {
    const capConfig = {
      appId: "com.mercadoexpres.tienda",
      appName: "Mercado Exprés",
      webDir: "dist",
      bundledWebRuntime: false,
      server: {
        androidScheme: "https"
      },
      android: {
        backgroundColor: "#16a34a",
        allowMixedContent: true
      }
    };
    fs.writeFileSync(capConfigPath, JSON.stringify(capConfig, null, 2));
  }

  // Include README.md with detailed instructions
  const readmeContent = `# Mercado Exprés - Tienda Móvil & Proyecto APK Android

Aplicación completa de comercio y abarrotes con soporte PWA, geolocalización GPS, panel administrativo, pedidos por WhatsApp y empaquetador para Android APK.

---

## 🚀 1. Instalación y Ejecución en Desarrollo

1. Abre una terminal en esta carpeta y ejecuta:
   \`\`\`bash
   npm install
   \`\`\`

2. Inicia el servidor local:
   \`\`\`bash
   npm run dev
   \`\`\`
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. Para compilar la versión web:
   \`\`\`bash
   npm run build
   \`\`\`

---

## 📱 2. Compilar Archivo APK con Android Studio (Capacitor)

1. En la misma carpeta ejecuta:
   \`\`\`bash
   # Instalar dependencias de Android
   npm install @capacitor/core @capacitor/cli @capacitor/android

   # Compilar el proyecto web a la carpeta dist/
   npm run build

   # Añadir la plataforma nativa de Android
   npx cap add android

   # Abrir el proyecto en Android Studio
   npx cap open android
   \`\`\`

2. En Android Studio:
   - Espera que termine de sincronizar Gradle.
   - Ve al menú superior: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - ¡Listo! En la notificación inferior haz clic en **"locate"** para ver tu archivo \`app-debug.apk\`.

---

## 🌐 3. Publicar este proyecto en GitHub y la Web

### Paso 1: Subir a GitHub
Abre la terminal en la carpeta del proyecto y corre:
\`\`\`bash
git init
git add .
git commit -m "Initial commit - Mercado Expres UNASAM"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mercado-expres.git
git push -u origin main
\`\`\`

### Paso 2: Publicar tu página gratis (Vercel o GitHub Pages)
- **Opción recomendada (Vercel con 1 clic):**
  1. Entra a [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
  2. Haz clic en **Add New Project** y selecciona tu repositorio \`mercado-expres\`.
  3. Haz clic en **Deploy**. ¡Tu página estará pública en 30 segundos con enlace HTTPS propio!

- **Opción GitHub Pages:**
  1. En tu repositorio de GitHub, ve a **Settings** > **Pages**.
  2. En Source selecciona **GitHub Actions** > **Static HTML** o usa el comando \`npx gh-pages -d dist\`.

---

## ⚙️ 4. Credenciales de Administrador
- **PIN por defecto:** \`1234\`
- **Número de atención por WhatsApp:** Configurable en \`src/components/OrderConfirmationModal.tsx\`
`;
  zip.file('README.md', readmeContent);

  // Add all files into the zip
  for (const relPath of files) {
    if (relPath === 'package.json') continue; // Handled separately
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
      console.log(`Added: ${relPath}`);
    } else {
      console.warn(`File not found: ${relPath}`);
    }
  }

  // Use conflict-free package.json for user's local machine
  const cleanPackageJson = {
    name: "mercado-expres",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      "@tailwindcss/vite": "^4.3.3",
      "canvas-confetti": "^1.9.4",
      "jszip": "^3.10.2",
      "lucide-react": "^0.546.0",
      "react": "^19.0.1",
      "react-dom": "^19.0.1",
      "vite": "^8.3.0",
      "vite-plugin-pwa": "^2.0.0"
    },
    devDependencies: {
      "@types/canvas-confetti": "^1.9.0",
      "@types/jszip": "^3.4.0",
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "@vitejs/plugin-react": "^6.1.1",
      "tailwindcss": "^4.3.3",
      "typescript": "^7.0.2"
    }
  };
  zip.file('package.json', JSON.stringify(cleanPackageJson, null, 2));
  console.log('Added: clean package.json without conflicting esbuild');

  // Generate buffer and save to public/
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outputPath = path.join(publicDir, 'mercado-expres-codigo-fuente.zip');
  fs.writeFileSync(outputPath, zipBuffer);

  console.log(`\nZIP creado exitosamente en: ${outputPath} (${(zipBuffer.length / 1024).toFixed(1)} KB)`);
}

buildZip().catch(console.error);
