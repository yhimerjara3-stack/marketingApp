import JSZip from 'jszip';

export async function downloadProjectZip() {
  const zip = new JSZip();

  // Project configuration files
  const filesToFetch = [
    { path: 'package.json', target: 'package.json' },
    { path: 'tsconfig.json', target: 'tsconfig.json' },
    { path: 'vite.config.ts', target: 'vite.config.ts' },
    { path: 'index.html', target: 'index.html' },
    { path: 'src/main.tsx', target: 'src/main.tsx' },
    { path: 'src/App.tsx', target: 'src/App.tsx' },
    { path: 'src/index.css', target: 'src/index.css' },
    { path: 'src/types/store.ts', target: 'src/types/store.ts' },
    { path: 'src/data/defaultProducts.ts', target: 'src/data/defaultProducts.ts' },
    { path: 'src/hooks/usePWAInstall.ts', target: 'src/hooks/usePWAInstall.ts' },
    { path: 'src/hooks/useOnlineStatus.ts', target: 'src/hooks/useOnlineStatus.ts' },
    { path: 'src/hooks/useGeolocation.ts', target: 'src/hooks/useGeolocation.ts' },
    { path: 'src/components/Header.tsx', target: 'src/components/Header.tsx' },
    { path: 'src/components/CategoryFilter.tsx', target: 'src/components/CategoryFilter.tsx' },
    { path: 'src/components/ProductCard.tsx', target: 'src/components/ProductCard.tsx' },
    { path: 'src/components/CartDrawer.tsx', target: 'src/components/CartDrawer.tsx' },
    { path: 'src/components/OrderConfirmationModal.tsx', target: 'src/components/OrderConfirmationModal.tsx' },
    { path: 'src/components/AdminPanel.tsx', target: 'src/components/AdminPanel.tsx' },
    { path: 'src/components/ApkExportModal.tsx', target: 'src/components/ApkExportModal.tsx' },
    { path: 'src/components/PWAInstallBanner.tsx', target: 'src/components/PWAInstallBanner.tsx' },
    { path: 'public/icon.svg', target: 'public/icon.svg' },
  ];

  for (const file of filesToFetch) {
    try {
      const res = await fetch(`/${file.path}`);
      if (res.ok) {
        const text = await res.text();
        zip.file(file.target, text);
      }
    } catch (e) {
      console.warn(`Could not fetch ${file.path}`, e);
    }
  }

  // Pre-configured Capacitor Android configuration
  const capacitorConfig = {
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
  zip.file('capacitor.config.json', JSON.stringify(capacitorConfig, null, 2));

  // Complete README with APK build steps
  const readmeContent = `# Mercado Exprés - Código Fuente Completo & Guía APK

Este proyecto contiene la aplicación completa de **Mercado Exprés** construida con React 19, TypeScript, Tailwind CSS y soporte PWA / Android APK.

---

## 🚀 1. Instalación y Ejecución Local

1. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

2. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. Compilar para producción:
   \`\`\`bash
   npm run build
   \`\`\`

---

## 📱 2. Compilar Archivo APK para Android

### Método A: Con Capacitor y Android Studio (Recomendado)
\`\`\`bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar Capacitor
npx cap init "Mercado Exprés" "com.mercadoexpres.tienda" --web-dir dist

# 3. Compilar los archivos web
npm run build

# 4. Crear la carpeta nativa Android
npx cap add android

# 5. Abrir en Android Studio
npx cap open android
\`\`\`
En Android Studio:
- Menú **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
- El archivo \`.apk\` generado estará en \`android/app/build/outputs/apk/debug/app-debug.apk\`.

---

### Método B: Con PWABuilder (Sin Android Studio)
1. Despliega tu app en Vercel, Netlify o Cloud Run.
2. Ingresa a [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Pega la URL de tu app y pulsa en **Generate Android Package**.
4. ¡Descarga tu archivo \`.apk\` directamente!

---

## 🔑 Credenciales por Defecto
- **Acceso al Panel de Control:** PIN \`1234\`
- **Número de Atención WhatsApp:** Configurable en \`src/components/OrderConfirmationModal.tsx\`
`;

  zip.file('README.md', readmeContent);

  // Generate ZIP and trigger browser download
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'mercado-expres-codigo-fuente.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
