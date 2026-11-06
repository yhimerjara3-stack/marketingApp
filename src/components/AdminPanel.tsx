import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  ShoppingBag,
  Package,
  BarChart3,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  FileSpreadsheet,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowUpDown,
  CheckCircle,
} from 'lucide-react';
import { Order, Product, OrderStatus, CategoryId } from '../types/store';
import { CATEGORIES } from '../data/defaultProducts';

interface AdminPanelProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: number) => void;
  onClearOrders: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onAddProduct,
  onDeleteProduct,
  onClearOrders,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'metrics'>('orders');

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdEmoji, setNewProdEmoji] = useState('🍎');
  const [newProdUnit, setNewProdUnit] = useState('Kg');
  const [newProdCategory, setNewProdCategory] = useState<CategoryId>('frutas');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');

  // Login PIN verification (default: 1234)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
  };

  // WhatsApp status notification generator
  const sendWhatsAppStatus = (order: Order) => {
    if (!order.clientPhone || order.clientPhone === 'No registrado') {
      alert('Este pedido no cuenta con número de WhatsApp registrado.');
      return;
    }

    const cleanPhone = order.clientPhone.replace(/\D/g, '');
    const phoneWithPrefix = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;

    const statusEmojis: Record<OrderStatus, string> = {
      Pendiente: '⏳',
      Preparando: '🍳',
      'En Camino': '🛵',
      Entregado: '✅',
    };

    const message = `¡Hola! Somos *Mercado Exprés* 🍎.\n\n` +
      `Te informamos que tu orden *#${order.id}* se encuentra actualmente:\n` +
      `👉 *${order.status.toUpperCase()}* ${statusEmojis[order.status]}\n\n` +
      `*Total:* S/ ${order.total.toFixed(2)}\n` +
      `*Tipo:* ${order.deliveryType}\n\n` +
      `¡Agradecemos tu preferencia! En breve estaremos contigo.`;

    window.open(`https://wa.me/${phoneWithPrefix}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // CSV Export
  const exportCSV = () => {
    if (orders.length === 0) {
      alert('No hay pedidos registrados para exportar.');
      return;
    }

    const headers = ['ID_Orden', 'Fecha', 'Cliente', 'Telefono', 'Tipo_Entrega', 'Direccion', 'Metodo_Pago', 'Subtotal', 'Envio', 'Total', 'Estado', 'Detalle_Productos'];
    const rows = orders.map((o) => {
      const itemsList = o.items.map((i) => `${i.quantity}x ${i.product.name}`).join(' - ');
      return [
        o.id,
        `"${o.date}"`,
        `"${o.clientName || 'Sin nombre'}"`,
        `"${o.clientPhone}"`,
        `"${o.deliveryType}"`,
        `"${o.address || (o.mapsUrl ? 'Ubicación GPS' : 'Recojo')}"`,
        `"${o.paymentMethod}"`,
        o.subtotal.toFixed(2),
        o.deliveryFee.toFixed(2),
        o.total.toFixed(2),
        `"${o.status}"`,
        `"${itemsList}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mercado_Expres_Ventas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Add Product Handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProdPrice);
    if (!newProdName.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor ingresa un nombre y un precio válido mayor a 0.');
      return;
    }

    onAddProduct({
      name: newProdName.trim(),
      categoryId: newProdCategory,
      price: priceNum,
      emoji: newProdEmoji.trim() || '📦',
      unit: newProdUnit.trim() || 'Unidad',
      description: newProdDesc.trim() || 'Producto fresco garantizado.',
      inStock: true,
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    alert('✅ ¡Producto añadido exitosamente al catálogo!');
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Filtered products for admin catalog view
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryId.toLowerCase().includes(productSearch.toLowerCase())
  );

  // If not logged in, show PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-slate-200 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Acceso Administrativo</h2>
        <p className="text-xs text-slate-500 mb-6">
          Ingresa el PIN de seguridad del comercio (Por defecto: <strong className="text-slate-800">1234</strong>)
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="PIN de 4 dígitos"
            autoFocus
            className="w-full text-center tracking-widest text-2xl font-mono py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />

          {pinError && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 py-2 rounded-lg">
              PIN incorrecto. Prueba con 1234.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl active:scale-95 transition"
            >
              Volver a la Tienda
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition"
            >
              Ingresar al Panel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Admin Top Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
            ⚙️
          </div>
          <div>
            <h2 className="text-base font-extrabold">Centro de Control</h2>
            <p className="text-xs text-slate-400">Administración de Mercado Exprés</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catálogo ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'metrics'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas & Exportar</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex gap-1.5">
              {(['all', 'Pendiente', 'Preparando', 'En Camino', 'Entregado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    orderFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-mono shrink-0">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No hay pedidos con este filtro</p>
              <p className="text-xs text-slate-400">Los nuevos pedidos de clientes aparecerán aquí en tiempo real.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const statusColors: Record<OrderStatus, string> = {
                  Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
                  Preparando: 'bg-blue-100 text-blue-800 border-blue-200',
                  'En Camino': 'bg-purple-100 text-purple-800 border-purple-200',
                  Entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                };

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base font-mono">
                            Orden #{order.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.date} · Cel: <strong className="text-slate-700">{order.clientPhone}</strong>
                          {order.clientName ? ` (${order.clientName})` : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium block">Total</span>
                        <span className="text-base font-black text-green-700 font-mono tabular-nums">
                          S/ {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Delivery & Items details */}
                    <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <span>📍 {order.deliveryType}</span>
                        {order.address && <span>— {order.address}</span>}
                        {order.mapsUrl && (
                          <a
                            href={order.mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-bold underline flex items-center gap-1 hover:text-blue-800"
                          >
                            <MapPin className="w-3 h-3" />
                            GPS Maps
                          </a>
                        )}
                        <span>· 💳 {order.paymentMethod}</span>
                      </div>

                      {order.notes && (
                        <p className="text-amber-800 bg-amber-50/80 p-1.5 rounded-lg border border-amber-100">
                          📝 <strong>Nota cliente:</strong> {order.notes}
                        </p>
                      )}

                      <div className="pt-1 text-slate-700 border-t border-slate-200/70">
                        {order.items.map((i) => (
                          <span key={i.product.id} className="inline-block mr-3">
                            {i.quantity}x {i.product.emoji} {i.product.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="py-2 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      >
                        <option value="Pendiente">⏳ Pendiente</option>
                        <option value="Preparando">🍳 Preparando</option>
                        <option value="En Camino">🛵 En Camino</option>
                        <option value="Entregado">✅ Entregado</option>
                      </select>

                      <button
                        onClick={() => sendWhatsAppStatus(order)}
                        className="flex-1 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Avisar WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Add Product Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Añadir Nuevo Producto al Catálogo</span>
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Ej: Fresas con Crema"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="Ej: 8.50"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Categoría</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryId)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Emoji / Icono</label>
                  <input
                    type="text"
                    value={newProdEmoji}
                    onChange={(e) => setNewProdEmoji(e.target.value)}
                    placeholder="Ej: 🍓"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Unidad de Venta</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="Ej: Kg, Unidad, Litro"
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Descripción Breve</label>
                <input
                  type="text"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detalles sobre frescura, origen o presentación..."
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition"
              >
                Guardar Producto en Catálogo
              </button>
            </form>
          </div>

          {/* Catalog List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-slate-800">
                Productos Actuales ({filteredProducts.length})
              </h3>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{prod.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {prod.unit} · Categoría: {prod.categoryId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-green-700 font-mono tabular-nums">
                      S/ {prod.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${prod.name} del catálogo?`)) {
                          onDeleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 active:scale-90 transition"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-green-700 mb-1">Ventas Totales</p>
              <p className="text-2xl font-black text-green-950 font-mono tabular-nums">
                S/ {totalSales.toFixed(2)}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-blue-700 mb-1">Total Pedidos</p>
              <p className="text-2xl font-black text-blue-950 font-mono tabular-nums">
                {totalOrders}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-purple-700 mb-1">Ticket Promedio</p>
              <p className="text-2xl font-black text-purple-950 font-mono tabular-nums">
                S/ {averageTicket.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportCSV}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Reporte Completo a Excel (CSV)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('⚠️ ¿Estás seguro de borrar todo el historial de pedidos? Esta acción no se puede deshacer.')) {
                  onClearOrders();
                  alert('Historial de pedidos eliminado.');
                }
              }}
              className="w-full py-3 px-4 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Borrar Historial de Pedidos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
