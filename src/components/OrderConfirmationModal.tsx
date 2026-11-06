import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, X } from 'lucide-react';
import { Order } from '../types/store';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  // Format WhatsApp Message
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.product.emoji} ${item.product.name} (S/ ${(item.product.price * item.quantity).toFixed(2)})`)
    .join('\n');

  const gpsLine = order.mapsUrl ? `\n📍 *Ubicación GPS:* ${order.mapsUrl}` : '';
  const addressLine = order.address ? `\n🏠 *Dirección:* ${order.address}` : '';
  const notesLine = order.notes ? `\n📝 *Notas:* ${order.notes}` : '';
  const clientNameLine = order.clientName ? `\n👤 *Cliente:* ${order.clientName}` : '';

  const whatsappMessage = `¡Hola! Vengo de la App *Mercado Exprés* 🍎🛒\n\n` +
    `*Orden:* #${order.id}\n` +
    `*Fecha:* ${order.date}${clientNameLine}\n` +
    `*Teléfono:* ${order.clientPhone}\n` +
    `*Tipo de Entrega:* ${order.deliveryType}${addressLine}${gpsLine}\n` +
    `*Método de Pago:* ${order.paymentMethod}${notesLine}\n\n` +
    `*Productos:*\n${itemsText}\n\n` +
    `*Subtotal:* S/ ${order.subtotal.toFixed(2)}\n` +
    `*Envío:* S/ ${order.deliveryFee.toFixed(2)}\n` +
    `*TOTAL:* S/ ${order.total.toFixed(2)}\n\n` +
    `Por favor confirmen la recepción de mi pedido. ¡Gracias!`;

  const storePhone = '51999888777'; // Store customer service line
  const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center relative overflow-hidden">
        {/* Top green glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-emerald-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-1">¡Pedido Registrado con Éxito!</h3>
        <p className="text-xs text-slate-500 mb-4">
          Tu orden es la <span className="font-bold text-green-700 font-mono">#{order.id}</span>
        </p>

        {/* Order Card Preview */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left text-xs space-y-2 mb-5">
          <div className="flex justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
            <span>Resumen del Pedido</span>
            <span className="text-green-700 font-mono tabular-nums">S/ {order.total.toFixed(2)}</span>
          </div>
          <div className="text-slate-600 space-y-1">
            <p><strong>Entrega:</strong> {order.deliveryType} {order.address ? `(${order.address})` : ''}</p>
            <p><strong>Pago:</strong> {order.paymentMethod}</p>
            <p><strong>WhatsApp:</strong> {order.clientPhone}</p>
            {order.mapsUrl && (
              <p className="text-emerald-700 font-semibold truncate">📍 GPS adjunto al mensaje</p>
            )}
          </div>
          <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
            {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'} listos para preparar.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-green-600/20 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar Pedido a WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Texto copiado al portapapeles!' : 'Copiar texto del pedido'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};
