export type StaffRole = "kasir" | "koki" | "admin";

export type OrderMode = "dine-in" | "takeaway";

export type PaymentMethod = "ewallet" | "cash";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "makanan-utama" | "camilan" | "minuman";
  tag?: string; // e.g. "Bestseller", "Chef Pick", "Pedas Lvl 2"
  rating?: number;
  reviewCount?: number;
  prepTime?: string; // e.g. "~15 mnt"
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export type OrderStage = "diterima" | "dimasak" | "disajikan";

export interface OrderStatusItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
  estMinutes?: number;
  ready?: boolean;
}

export interface Order {
  id: string; // e.g. ORD-8824-M14
  tableNumber: string; // e.g. "14"
  mode: OrderMode;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  isPaid: boolean;
  stage: OrderStage;
}
