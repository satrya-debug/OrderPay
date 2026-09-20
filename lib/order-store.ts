"use client";

import { useSyncExternalStore } from "react";
import type { CartItem, KitchenStatus, Order, OrderMode, PaymentMethod } from "@/lib/types";

const KEY = "orderpay:orders";
const EVENT = "orderpay:orders-changed";
const EMPTY: Order[] = [];

let cache: { raw: string | null; value: Order[] } = { raw: null, value: EMPTY };

function read(): Order[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(KEY);
  if (raw === cache.raw) return cache.value;
  try {
    cache = { raw, value: raw ? (JSON.parse(raw) as Order[]) : EMPTY };
  } catch {
    cache = { raw, value: EMPTY };
  }
  return cache.value;
}

function write(orders: Order[]) {
  window.localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function patch(id: string, fn: (order: Order) => Order) {
  write(read().map((o) => (o.id === id ? fn(o) : o)));
}

export function useOrders(): Order[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useOrder(id?: string | null): Order | undefined {
  const orders = useOrders();
  return id ? orders.find((o) => o.id === id) : undefined;
}

interface NewOrderInput {
  id: string;
  tableNumber: string;
  mode: OrderMode;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  promoCode?: string;
  subtotal: number;
  discount: number;
  tax: number;
  serviceFee: number;
  total: number;
}

export function createOrder(input: NewOrderInput, replaceId?: string | null): Order {
  const order: Order = {
    ...input,
    paymentStatus: "unpaid",
    kitchenStatus: "waiting_payment",
    createdAt: new Date().toISOString(),
  };
  const rest = read().filter(
    (o) => !(o.id === replaceId && o.paymentStatus === "unpaid") && o.id !== input.id
  );
  write([order, ...rest]);
  return order;
}

export function markPaid(id: string, method?: PaymentMethod) {
  patch(id, (o) =>
    o.paymentStatus === "paid"
      ? o
      : {
          ...o,
          paymentMethod: method ?? o.paymentMethod,
          paymentStatus: "paid",
          kitchenStatus: o.kitchenStatus === "waiting_payment" ? "received" : o.kitchenStatus,
          paidAt: new Date().toISOString(),
        }
  );
}

export function updateKitchenStatus(id: string, status: KitchenStatus) {
  patch(id, (o) => ({
    ...o,
    kitchenStatus: status,
    servedAt: status === "served" ? new Date().toISOString() : o.servedAt,
  }));
}

const TZ = "Asia/Jakarta";

export function formatTime(iso?: string) {
  if (!iso) return "-";
  return new Date(iso)
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: TZ })
    .replace(".", ":");
}

export function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  const dayKey = (x: Date) => x.toLocaleDateString("en-CA", { timeZone: TZ });
  const date =
    dayKey(d) === dayKey(new Date())
      ? "Hari ini"
      : d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: TZ,
        });
  return `${date}, ${formatTime(iso)} WIB`;
}