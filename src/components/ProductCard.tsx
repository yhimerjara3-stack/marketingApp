import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { Product } from '../types/store';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: number, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group">
      <div>
        {/* Product Visual & Icon Box */}
        <div className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center mb-3 overflow-hidden border border-slate-100">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none">
            {product.emoji}
          </span>
          {product.popular && (
            <span className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Product Details */}
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 mb-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <span>{product.unit}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className={product.inStock ? 'text-emerald-600' : 'text-red-500'}>
            {product.inStock ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">Precio</span>
          <div className="text-base font-extrabold text-green-700 font-mono tabular-nums">
            S/ {product.price.toFixed(2)}
          </div>
        </div>

        {quantityInCart === 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20 transition cursor-pointer"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        ) : (
          <div className="flex items-center bg-orange-50 border border-orange-200/90 rounded-xl p-1 gap-1 min-h-[44px]">
            <button
              onClick={() => onUpdateQuantity(product.id, -1)}
              className="w-8 h-8 rounded-lg bg-white text-orange-700 flex items-center justify-center hover:bg-orange-100 active:scale-90 transition font-bold shadow-xs"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-xs text-orange-950 font-mono tabular-nums">
              {quantityInCart}
            </span>
            <button
              onClick={() => onUpdateQuantity(product.id, 1)}
              className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-90 transition font-bold shadow-xs"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
