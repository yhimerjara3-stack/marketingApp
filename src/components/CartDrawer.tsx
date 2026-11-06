import React, { useState } from 'react';
import { X, Trash2, MapPin, Navigation, Phone, User, FileText, CreditCard, Banknote, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, DeliveryType, PaymentMethod, Order } from '../types/store';
import { useGeolocation } from '../hooks/useGeolocation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
}) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Recojo');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { lat, lng, mapsUrl, loading: gpsLoading, error: gpsError, requestLocation } = useGeolocation();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'Delivery' ? 5.00 : 0.00;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Tu carrito está vacío. Agrega productos para continuar.');
      return;
    }

    if (!clientPhone.trim()) {
      setErrorMsg('Por favor ingresa tu número de WhatsApp para confirmar el pedido.');
      return;
    }

    if (deliveryType === 'Delivery' && !address.trim() && !mapsUrl) {
      setErrorMsg('Para entrega por delivery, por favor indica tu dirección o activa el GPS.');
      return;
    }

    const orderId = Math.floor(Math.random() * 9000) + 1000;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: orderId,
      date: dateFormatted,
      items: [...cart],
      deliveryType,
      address: address.trim() || undefined,
      coordinates: lat && lng ? { lat, lng } : undefined,
      mapsUrl: mapsUrl || undefined,
      paymentMethod,
      clientPhone: clientPhone.trim(),
      clientName: clientName.trim() || undefined,
      notes: notes.trim() || undefined,
      subtotal,
      deliveryFee,
      total,
      status: 'Pendiente',
    };

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#16a34a', '#ea580c', '#3b82f6', '#f59e0b'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    onOrderCreated(newOrder);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-base font-extrabold text-slate-900">Tu Pedido</h2>
            <span className="text-xs text-slate-500 font-medium font-mono tabular-nums">
              ({cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'ítem' : 'ítems'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-95 transition"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-2">🛍️</span>
              <p className="text-sm font-bold text-slate-700">Tu carrito está vacío</p>
              <p className="text-xs text-slate-400 mt-1">Explora nuestro menú y añade tus productos frescos favoritos.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{item.product.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                        S/ {item.product.price.toFixed(2)} x {item.quantity} ={' '}
                        <span className="font-bold text-green-700">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold active:scale-90"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-black font-mono tabular-nums text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold active:scale-90"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center text-xs ml-1 active:scale-90"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              {/* Delivery Option */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <label className="text-xs font-bold text-slate-900 block">Método de entrega:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('Recojo')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryType === 'Recojo'
                        ? 'border-green-600 bg-green-50/80 text-green-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">🏪 Recojo en Tienda</div>
                    <div className="text-[11px] text-green-700 font-mono tabular-nums font-semibold mt-0.5">S/ 0.00</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('Delivery')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryType === 'Delivery'
                        ? 'border-green-600 bg-green-50/80 text-green-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">🛵 Delivery Express</div>
                    <div className="text-[11px] text-green-700 font-mono tabular-nums font-semibold mt-0.5">+ S/ 5.00</div>
                  </button>
                </div>

                {deliveryType === 'Delivery' && (
                  <div className="pt-2 space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Dirección, calle y número..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-hidden"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={requestLocation}
                        disabled={gpsLoading}
                        className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition disabled:opacity-50"
                        title="Obtener ubicación GPS actual"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                        <span>{gpsLoading ? 'GPS...' : 'GPS'}</span>
                      </button>
                    </div>

                    {mapsUrl && (
                      <div className="text-[11px] text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center justify-between">
                        <span>📍 Ubicación GPS capturada exitosamente</span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline text-green-900"
                        >
                          Ver mapa
                        </a>
                      </div>
                    )}

                    {gpsError && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        {gpsError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-900 block">Método de pago:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Efectivo')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Efectivo'
                        ? 'border-green-600 bg-green-50 text-green-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mx-auto mb-1 text-green-600" />
                    <span className="text-[11px]">Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Yape/Plin')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Yape/Plin'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px]">Yape / Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tarjeta')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Tarjeta'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px]">Tarjeta</span>
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <label className="text-xs font-bold text-slate-900 block">Datos del cliente:</label>
                
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Tu WhatsApp (ej: 999888777) *"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-hidden"
                  />
                </div>

                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-hidden"
                  />
                </div>

                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas o instrucciones (ej: tocar timbre, etc.)"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Costo de envío ({deliveryType}):</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? 'Gratis' : `S/ ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total a Pagar:</span>
                <span className="font-mono tabular-nums text-green-700">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full min-h-[48px] py-3 px-4 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-green-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirmar Pedido S/ {total.toFixed(2)}</span>
              <span>👉</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
