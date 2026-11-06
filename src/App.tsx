import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  ShieldCheck,
  Store,
  Sparkles,
  Presentation,
} from 'lucide-react';
import { Product, CartItem, Order, CategoryId, OrderStatus } from './types/store';
import { DEFAULT_PRODUCTS, CATEGORIES } from './data/defaultProducts';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminPanel } from './components/AdminPanel';
import { PitchPresentation } from './components/PitchPresentation';
import logoImg from './assets/images/mercado_expres_logo_1793933617201.jpg';

export default function App() {
  // 1. CARGA DE PRODUCTOS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('marketProducts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved products', e);
    }
    return DEFAULT_PRODUCTS;
  });

  // 2. CARGA DE PEDIDOS
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('marketOrders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved orders', e);
    }
    return [];
  });

  // 3. ESTADOS DE LA TIENDA
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'pitch'>('store');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Sincronizar catálogo con localStorage
  useEffect(() => {
    localStorage.setItem('marketProducts', JSON.stringify(products));
  }, [products]);

  // Sincronizar pedidos con localStorage
  useEffect(() => {
    localStorage.setItem('marketOrders', JSON.stringify(orders));
  }, [orders]);

  // Manejadores del Carrito
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Manejadores de Pedidos
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsCartOpen(false);
    setCreatedOrder(newOrder);
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem('marketOrders');
  };

  // Manejadores del Catálogo
  const handleAddProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Filtro de productos por categoría y buscador
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'todos' || prod.categoryId === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-24 sm:pb-12">
      {/* Cabecera Principal */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 py-5 flex-1 w-full">
        {/* VISTA 1: TIENDA PARA EL CLIENTE */}
        {activeView === 'store' && (
          <div className="space-y-4">
            {/* Banner de Bienvenida con Acceso al Pitch y Logo Oficial */}
            <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-1 shadow-lg shrink-0 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Logo Oficial Mercado Exprés"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="max-w-lg space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-green-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Envíos rápidos a domicilio</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                    Frutas, Verduras & Abarrotes del Día
                  </h2>
                  <p className="text-xs text-green-100">
                    Precios justos de mercado directo a tu cocina en minutos.
                  </p>
                </div>
              </div>

              {/* Botón Destacado de Modo Pitch */}
              <button
                onClick={() => setActiveView('pitch')}
                className="relative z-10 px-4 py-2.5 rounded-2xl bg-white text-green-900 hover:bg-green-50 active:scale-95 text-xs font-extrabold shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Presentation className="w-4 h-4 text-purple-600" />
                <span>Ver Pitch (60–90s)</span>
              </button>

              {/* Decoración gráfica */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar frutas, carnes, verduras o abarrotes..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs shadow-xs focus:ring-2 focus:ring-green-500 focus:outline-hidden transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Selector de Categorías */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Encabezado de la lista */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-extrabold text-sm text-slate-800">
                {selectedCategory === 'todos'
                  ? 'Catálogo Completo'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {filteredProducts.length} productos
              </span>
            </div>

            {/* Cuadrícula de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 my-4">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm font-bold text-slate-800">No encontramos productos</p>
                <p className="text-xs text-slate-400 mt-1">
                  Intenta con otra palabra clave o cambia de categoría.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                  }}
                  className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((prod) => {
                  const cartItem = cart.find((i) => i.product.id === prod.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  return (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      quantityInCart={qty}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: PRESENTACIÓN DEL PITCH (60–90 SEG) */}
        {activeView === 'pitch' && (
          <PitchPresentation onBackToStore={() => setActiveView('store')} />
        )}

        {/* VISTA 3: PANEL DE ADMINISTRACIÓN */}
        {activeView === 'admin' && (
          <AdminPanel
            orders={orders}
            products={products}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onClearOrders={handleClearOrders}
            onClose={() => setActiveView('store')}
          />
        )}
      </main>

      {/* Botón Flotante del Carrito para Móviles */}
      {cartTotalItems > 0 && activeView === 'store' && (
        <div className="fixed bottom-18 sm:bottom-6 right-4 z-40 animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-3.5 rounded-full shadow-xl shadow-orange-500/30 transition font-bold text-sm cursor-pointer border-2 border-white"
            aria-label="Ver carrito de compras"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartTotalItems}
              </span>
            </div>
            <span>Ver Pedido</span>
            <span className="bg-orange-600/60 px-2 py-0.5 rounded-full text-xs font-mono tabular-nums">
              S/ {cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Barra de Navegación Táctil Móvil */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 grid grid-cols-3 items-center h-16 px-4 safe-area-bottom">
        <button
          onClick={() => setActiveView('store')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 transition cursor-pointer ${
            activeView === 'store' ? 'text-green-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">Tienda</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center h-full gap-0.5 text-slate-400 hover:text-slate-600 relative transition cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {cartTotalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Carrito</span>
        </button>

        <button
          onClick={() => setActiveView('admin')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 transition cursor-pointer ${
            activeView === 'admin' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      </nav>

      {/* Hoja Deslizable del Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      {/* Modal de Confirmación y WhatsApp */}
      <OrderConfirmationModal
        order={createdOrder}
        onClose={() => setCreatedOrder(null)}
      />

      {/* Pie de Página */}
      <footer className="mt-12 py-8 border-t border-slate-200/80 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Mercado Exprés · Fresco y rápido a tu puerta</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('pitch')}
              className="text-purple-600 hover:text-purple-700 transition underline font-semibold cursor-pointer"
            >
              Presentación Pitch (60–90s)
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="text-slate-400 hover:text-slate-600 transition underline cursor-pointer"
            >
              Acceso Administrativo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
