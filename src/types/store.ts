export type CategoryId = 'todos' | 'frutas' | 'carnes' | 'comidas' | 'abarrotes' | 'bebidas';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: CategoryId;
  price: number;
  emoji: string;
  unit: string;
  description: string;
  inStock: boolean;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryType = 'Recojo' | 'Delivery';
export type PaymentMethod = 'Efectivo' | 'Yape/Plin' | 'Tarjeta';
export type OrderStatus = 'Pendiente' | 'Preparando' | 'En Camino' | 'Entregado';

export interface Order {
  id: number;
  date: string;
  items: CartItem[];
  deliveryType: DeliveryType;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapsUrl?: string;
  paymentMethod: PaymentMethod;
  clientPhone: string;
  clientName?: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
}
