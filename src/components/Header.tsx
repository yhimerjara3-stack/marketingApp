import React from 'react';
import { ShoppingCart, ShieldCheck, Store, WifiOff, Presentation } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import logoImg from '../assets/images/mercado_expres_logo_1793933617201.jpg';

interface HeaderProps {
  activeView: 'store' | 'admin' | 'pitch';
  setActiveView: (view: 'store' | 'admin' | 'pitch') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-medium">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo sin conexión — Mostrando catálogo guardado en tu dispositivo</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone (Logo y Nombre de la Tienda) */}
        <button
          onClick={() => setActiveView('store')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
        >
          {/* LOGO DE LA TIENDA */}
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 p-0.5 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={logoImg}
              alt="Logo Mercado Exprés"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
              Mercado Exprés
            </h1>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
              Fresco & Rápido a tu Puerta
            </p>
          </div>
        </button>

        {/* View Switchers (Navegación limpia) */}
        <nav className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveView('store')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'store'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Tienda</span>
          </button>
          
          <button
            onClick={() => setActiveView('pitch')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'pitch'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-purple-600" />
            <span>Pitch (60–90s)</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'admin'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Actions Zone: Carrito de compras */}
        <div className="flex items-center gap-2">
          {/* Quick Pitch button on mobile */}
          <button
            onClick={() => setActiveView('pitch')}
            className="sm:hidden px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Pitch</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito de compras"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm tabular-nums animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
