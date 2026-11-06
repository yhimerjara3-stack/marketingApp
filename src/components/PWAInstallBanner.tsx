import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenApkModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenApkModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // If already installed or dismissed by user in this session, do not render
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      onOpenApkModal();
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white px-4 py-3 shadow-md border-b border-green-800/40 animate-in slide-in-from-top-2">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">
              Instala Mercado Exprés en tu Android / Móvil
            </p>
            <p className="text-[11px] text-green-100">
              Acceso rápido sin navegador, pedidos offline y pantalla completa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstall}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-white text-green-800 hover:bg-green-50 active:scale-95 text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstallable ? 'Instalar App' : 'Descargar / APK'}</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition active:scale-90"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
