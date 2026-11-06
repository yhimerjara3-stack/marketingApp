import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  X,
  FileCode,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadProjectZip } from '../utils/downloadZip';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwabuilder' | 'capacitor' | 'direct'>('pwabuilder');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mercado-expres.app';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Mercado Exprés" "com.mercadoexpres.tienda" --web-dir dist
npm run build
npx cap add android
npx cap open android`;

  // Download manifest & Android configuration package
  const downloadConfigBundle = () => {
    const configData = {
      appId: "com.mercadoexpres.tienda",
      appName: "Mercado Exprés",
      webDir: "dist",
      bundledWebRuntime: false,
      server: {
        url: currentUrl,
        cleartext: true,
      },
      android: {
        backgroundColor: "#16a34a",
        allowMixedContent: true,
      },
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Generador de APK para Android
              </h2>
              <p className="text-xs text-slate-500">
                Convierte Mercado Exprés en un archivo instalable .APK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <strong>PWA Validada:</strong> Manifiesto web, iconos adaptativos maskable (192px/512px) y Service Worker offline están activos y listos para compilar.
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200/80">
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'pwabuilder'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Método 1: PWABuilder (Sin Código)
          </button>

          <button
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'capacitor'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Método 2: Capacitor (APK Nativo)
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'direct'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Método 3: Instalar Directo
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
          {activeTab === 'pwabuilder' && (
            <div className="space-y-3.5">
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>El método oficial de Microsoft & Google para generar APK</span>
                </div>
                <p className="text-purple-700 leading-relaxed text-[11px]">
                  No requiere instalar Android Studio ni programar nada. Toma menos de 2 minutos generar el archivo <code>.apk</code> listo para instalar en cualquier teléfono.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <div>
                    <strong className="text-slate-800">Copia la URL de tu aplicación:</strong>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={currentUrl}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-mono text-[11px] flex-1"
                      />
                      <button
                        onClick={() => copyToClipboard(currentUrl, 'url')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold flex items-center gap-1 shrink-0"
                      >
                        {copiedCmd === 'url' ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCmd === 'url' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <div>
                    <strong className="text-slate-800">Abre PWABuilder:</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Pega la URL y presiona <em>Start</em>. Verificará el manifiesto y el Service Worker que ya dejamos configurados.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <div>
                    <strong className="text-slate-800">Descarga tu APK:</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Haz clic en <strong>Android Package</strong> y descarga directamente tu archivo <code>.apk</code> firmado para tu celular o <code>.aab</code> para Google Play Store.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir PWABuilder con mi App</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="space-y-3">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Si deseas compilar directamente el proyecto en Android Studio con código fuente Kotlin/Java:
              </p>

              <div className="relative bg-slate-900 text-slate-100 p-3.5 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                <pre>{capacitorCommands}</pre>
                <button
                  onClick={() => copyToClipboard(capacitorCommands, 'cap')}
                  className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1"
                >
                  {copiedCmd === 'cap' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'cap' ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={downloadConfigBundle}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Descargar capacitor.config.json preconfigurado</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'direct' && (
            <div className="space-y-3.5">
              <div className="bg-green-50 p-3.5 rounded-2xl border border-green-200">
                <strong className="text-green-900 block mb-1">¡No necesitas descargar un archivo externo!</strong>
                <p className="text-green-700 text-[11px] leading-relaxed">
                  Gracias a los estándares de PWA moderna, puedes instalar esta app directamente desde el navegador en tu teléfono Android y funcionará idéntico a un APK nativo: icono en pantalla de inicio, modo pantalla completa sin barra de navegación y funcionamiento offline.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">En Android (Chrome / Edge / Samsung):</h4>
                <p className="text-slate-600 text-[11px]">
                  1. Toca el botón <strong>"Instalar App"</strong> en la esquina superior o en el banner inferior.<br />
                  2. O abre el menú de tres puntos (⋮) en Chrome y pulsa <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">En iPhone (Safari):</h4>
                <p className="text-slate-600 text-[11px]">
                  1. Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).<br />
                  2. Desliza hacia abajo y selecciona <strong>"Agregar a la pantalla de inicio"</strong>.
                </p>
              </div>

              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-green-600/20 transition active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Instalar App en este Dispositivo Ahora</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with Direct ZIP Download */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <a
            href="/mercado-expres-codigo-fuente.zip"
            download="mercado-expres-codigo-fuente.zip"
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer no-underline"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Código Fuente Completo (.ZIP)</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
