import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Store,
  Lightbulb,
  AlertCircle,
  Eye,
  TrendingUp,
  Maximize2,
  Clock,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  Zap,
  Users,
  ShieldCheck,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import logoImg from '../assets/images/mercado_expres_logo_1793933617201.jpg';

interface PitchPresentationProps {
  onBackToStore: () => void;
}

export const PitchPresentation: React.FC<PitchPresentationProps> = ({ onBackToStore }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Keyboard navigation (Arrow keys to change slides)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const slides = [
    // SLIDE 0: PORTADA DE MARCA ENFOCADA EN UNASAM
    {
      id: 'portada',
      category: 'UNASAM · Ecosistema Emprendedor',
      title: 'Mercado Exprés',
      tagline: 'Digitalizando el talento y comercio santiaguino',
      description:
        'La solución tecnológica diseñada para que los estudiantes de la UNASAM automaticen y escalen sus emprendimientos sin descuidar sus estudios.',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-xl shadow-green-600/25 flex items-center justify-center animate-in zoom-in-95 duration-500 border border-slate-200/80">
            <img
              src={logoImg}
              alt="Logo Mercado Exprés"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proyecto de Emprendimiento Universitario · UNASAM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Mercado Exprés
            </h1>
            <p className="text-base sm:text-xl font-bold text-green-700">
              La tienda digital de bolsillo para el estudiante emprendedor de la UNASAM
            </p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto pt-1">
              Ventas automáticas por WhatsApp, catálogo profesional en Soles y entregas en el campus universitario sin comisiones.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              🎓 Hecho para la UNASAM
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              📱 Pagos con Yape / Plin
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              📍 Entregas en Campus o Huaraz
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 1: EL PROBLEMA (FOCALIZADO EN ESTUDIANTES DE LA UNASAM)
    {
      id: 'problema',
      category: '01 · Diagnóstico del Problema',
      title: 'El Problema',
      tagline: '¿Qué frena al estudiante de la UNASAM al emprender?',
      description:
        'El estudiante santiaguino necesita generar ingresos, pero el caos de vender por grupos de WhatsApp choca directamente con sus horarios de clase.',
      content: (
        <div className="space-y-5 py-2">
          <div className="bg-red-50/90 border border-red-200/90 rounded-2xl p-4 sm:p-5 text-red-950 text-center max-w-3xl mx-auto">
            <p className="text-base sm:text-xl font-extrabold leading-snug">
              «Los estudiantes de la UNASAM que emprenden pierden ventas y descuidan sus clases por atender mensajes desordenados en WhatsApp, mandar fotos una por una y anotar cuentas a mano en su cuaderno.»
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Clases vs. Pedidos</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Si estás en clase o laboratorio en Shancayan, no puedes responder WhatsApp. El cliente se cansa de esperar y le compra a otro.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-red-600">
                Pérdida del 35% de ventas diarias
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Caos en Grupos UNASAM</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tus productos se pierden entre cientos de memes y stickers en los grupos de la universidad. No hay catálogo claro ni precios fijos.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-amber-700">
                Cero imagen profesional
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-2.5">
                  <Store className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Barrera Económica</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Shopify cobra US$ 39 al mes y las apps de delivery se quedan con el 25% de comisión. El estudiante no tiene ese capital.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                Costos imposibles para estudiantes
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: EL INSIGHT
    {
      id: 'insight',
      category: '02 · Verdad Humana del Universitario',
      title: 'El Insight',
      tagline: 'La realidad del estudiante santiaguino',
      description:
        'El estudiante de la UNASAM tiene talento y ganas de emprender, pero su recurso más escaso es el tiempo.',
      content: (
        <div className="space-y-5 py-2">
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 text-amber-950 text-center max-w-3xl mx-auto">
            <p className="text-base sm:text-xl font-extrabold leading-snug">
              «El estudiante de la UNASAM no carece de ganas ni de buenos productos: carece de tiempo y de tecnología accesible. No necesita un sistema complejo de oficina; necesita que su tienda funcione sola mientras él está en el aula.»
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                La realidad del estudiante UNASAM:
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emprende para pagar pasajes, copias, materiales o alimentación.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prepara postres, comida, snacks, ropa o productos tecnológicos.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sus clientes son sus propios compañeros y docentes universitarios.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lo que necesita urgentemente:
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Un link donde el compañero vea todo su catálogo con precios claros.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Que el pedido le llegue ya sumado, calculado y listo con pago Yape.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cero costos mensuales ni comisiones que le resten sus ganancias.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: LA IDEA CENTRAL
    {
      id: 'idea',
      category: '03 · Propuesta de Valor',
      title: 'La Idea Central',
      tagline: 'El puente digital para el emprendedor universitario',
      description:
        'Mercado Exprés empodera a los estudiantes de la UNASAM para que tengan su propio e-commerce profesional en 5 minutos.',
      content: (
        <div className="space-y-5 py-3 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-7 text-white shadow-lg space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Idea Memorable
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              «Mercado Exprés: El e-commerce de bolsillo que permite a cualquier estudiante de la UNASAM vender sin dejar de estudiar.»
            </h3>
            <p className="text-xs sm:text-sm text-green-100 max-w-xl mx-auto pt-1 font-medium">
              Convierte un chat informal en un canal de ventas digital, automatizado y formal para la comunidad de Huaraz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
              <span className="text-xl mb-1 block">🚀</span>
              <h5 className="font-bold text-slate-900 text-xs">Listo en 5 Minutos</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">El estudiante carga sus productos, precios y su Yape sin saber programación.</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
              <span className="text-xl mb-1 block">💰</span>
              <h5 className="font-bold text-slate-900 text-xs">100% Ganancia Neta</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Cero comisiones por venta. Cada sol cobrado va íntegro al estudiante.</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
              <span className="text-xl mb-1 block">📍</span>
              <h5 className="font-bold text-slate-900 text-xs">Campus & Delivery</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">Entrega programada en pabellones de la UNASAM o con GPS en Huaraz.</p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: LA EJECUCIÓN (CÓMO OPERA EN LA UNASAM)
    {
      id: 'ejecucion',
      category: '04 · Funcionamiento en el Campus',
      title: 'La Ejecución',
      tagline: 'Flujo sencillo en 3 pasos para la comunidad universitaria',
      description:
        'Cero fricción: el compañero compra desde su celular y el emprendedor recibe la comanda lista para entregar.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-green-100 text-green-700 font-black text-xs flex items-center justify-center font-mono">
                1
              </span>
              <span className="text-[11px] font-bold text-slate-400">Compañero / Cliente</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Catálogo & Carrito Móvil</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              El cliente abre el link de Mercado Exprés desde su celular, ve fotos, precios en Soles y arma su pedido en 30 segundos.
            </p>
            <div className="bg-slate-50 p-2 rounded-xl text-[11px] font-mono text-slate-600 border border-slate-100">
              Suma automática sin calculadora
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center font-mono">
                2
              </span>
              <span className="text-[11px] font-bold text-slate-400">Entrega & Pago</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pabellón UNASAM o GPS</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Selecciona recojo en su facultad (FCM, FCAM, FIA, etc.) o delivery en Huaraz con GPS, paga por Yape/Plin y confirma a WhatsApp.
            </p>
            <div className="bg-slate-50 p-2 rounded-xl text-[11px] font-mono text-blue-700 border border-blue-100">
              Punto exacto de encuentro sin confusiones
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center font-mono">
                3
              </span>
              <span className="text-[11px] font-bold text-slate-400">Estudiante Emprendedor</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Panel de Control & Ventas</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              El emprendedor recibe la comanda limpia, actualiza el estado (Preparando / Listo) y descarga sus ventas a Excel para cuadrar su caja.
            </p>
            <div className="bg-slate-50 p-2 rounded-xl text-[11px] font-mono text-purple-700 border border-purple-100">
              Control comercial profesional con PIN
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: EL EFECTO & MÉTRICAS
    {
      id: 'efecto',
      category: '05 · Impacto & Métricas',
      title: 'El Efecto en la UNASAM',
      tagline: 'Resultados reales y medición del éxito',
      description:
        'Multiplicando las ventas de los estudiantes santiaguinos mientras mantienen su concentración académica.',
      content: (
        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                Tiempo de Atención
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
                30 seg
              </p>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                De 15 minutos de chat disperso a 30 segundos por pedido automático.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-0.5">
                Capacidad de Ventas
              </span>
              <p className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
                +40%
              </p>
              <p className="text-xs text-blue-700 mt-1 font-medium">
                Incremento en pedidos semanales sin interrumpir horas de clase.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-0.5">
                Costo para el Estudiante
              </span>
              <p className="text-2xl sm:text-3xl font-black text-purple-950 font-mono">
                S/ 0.00
              </p>
              <p className="text-xs text-purple-700 mt-1 font-medium">
                Cero comisiones bancarias o de plataformas externas.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-mono text-green-400 font-bold uppercase tracking-wider">
                Claim Oficial / Eslogan
              </span>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                «Mercado Exprés: Emprende en la UNASAM sin frenar tus estudios.»
              </h4>
              <p className="text-xs text-slate-400">
                Métricas de éxito: Tasa de pedidos recurrentes semanales y monto total vendido por estudiante.
              </p>
            </div>

            <button
              onClick={onBackToStore}
              className="px-5 py-2.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-lg transition active:scale-95 shrink-0 cursor-pointer"
            >
              Ver Demostración en Vivo
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Slide Control Header */}
      <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-slate-900">
            Pitch UNASAM
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Indicators */}
        <div className="hidden sm:flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-green-600'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Diapositiva ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            title="Diapositiva anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            title="Diapositiva siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer ml-1"
            title="Pantalla completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 min-h-[460px] flex flex-col justify-between">
        <div>
          {/* Slide Category & Tagline */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
            <div>
              <span className="text-xs font-mono font-bold text-green-700 uppercase tracking-widest block mb-0.5">
                {current.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {current.title}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {current.tagline}
            </span>
          </div>

          {/* Slide Interactive Content */}
          <div className="animate-in fade-in duration-300">
            {current.content}
          </div>
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-5">
          <span>Usa las flechas del teclado (← / →) o los botones para avanzar</span>
          
          <div className="flex items-center gap-3">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(0)}
                className="hover:text-slate-700 transition cursor-pointer underline"
              >
                Ir al Inicio
              </button>
            )}
            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => prev + 1)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <span>Siguiente Diapositiva</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onBackToStore}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Abrir Tienda Interactiva</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
