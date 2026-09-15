import { CartItem } from "./types";
import { TAX_RATE, SERVICE_FEE_RATE } from "./constants";

export function formatRupiah(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
}

export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = calculateSubtotal(items);
  const tax = subtotal * TAX_RATE;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + tax + serviceFee;
  return { subtotal, tax, serviceFee, total };
}

export function generateOrderId(tableNumber: string): string {
  const timestamp = Date.now() % 10000;
  const rand = Math.floor(timestamp / 10) % 9000 + 1000;
  return `ORD-${rand}-M${tableNumber}`;
}
