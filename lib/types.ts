export type StaffRole = "kasir" | "koki" | "admin";

export type OrderMode = "dine-in" | "takeaway";

export type PaymentMethod = "ewallet" | "cash";

export type PaymentStatus = "unpaid" | "paid";

export type KitchenStatus =
  | "waiting_payment"
  | "received"
  | "cooking"
  | "ready"
  | "served";

export type OrderStage = "diterima" | "dimasak" | "disajikan";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "makanan-utama" | "camilan" | "minuman";
  tag?: string;
  rating?: number;
  reviewCount?: number;
  prepTime?: string;
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface OrderStatusItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
  estMinutes?: number;
  ready?: boolean;
}

export interface Order {
  id: string;
  tableNumber: string;
  mode: OrderMode;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  kitchenStatus: KitchenStatus;
  promoCode?: string;
  subtotal: number;
  discount: number;
  tax: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  servedAt?: string;
}