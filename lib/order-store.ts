"use client";

import { useSyncExternalStore } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type {
  CartItem,
  KitchenStatus,
  MenuItem,
  Order,
  OrderMode,
  PaymentMethod,
} from "@/lib/types";

const TZ = "Asia/Jakarta";
const EMPTY: Order[] = [];

const ORDER_SELECT =
  "*, order_items(id, menu_item_id, name, price, quantity, note, menu_items(description, original_price, image_url, category, tag, rating, review_count, prep_time, is_popular))";

interface ItemRow {
  id: number;
  menu_item_id: string | null;
  name: string;
  price: number;
  quantity: number;
  note: string | null;
  menu_items: {
    description: string;
    original_price: number | null;
    image_url: string | null;
    category: MenuItem["category"];
    tag: string | null;
    rating: number | null;
    review_count: number;
    prep_time: string | null;
    is_popular: boolean;
  } | null;
}

interface OrderRow {
  id: string;
  table_number: string;
  mode: OrderMode;
  payment_method: PaymentMethod;
  payment_status: Order["paymentStatus"];
  kitchen_status: KitchenStatus;
  promo_code: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  service_fee: number;
  total: number;
  created_at: string;
  paid_at: string | null;
  served_at: string | null;
  order_items: ItemRow[] | null;
}

function mapItem(row: ItemRow): CartItem {
  const m = row.menu_items;
  const menuItem: MenuItem = {
    id: row.menu_item_id ?? `hapus-${row.id}`,
    name: row.name,
    description: m?.description ?? "",
    price: row.price,
    originalPrice: m?.original_price ?? undefined,
    image: m?.image_url ?? "",
    category: m?.category ?? "makanan-utama",
    tag: m?.tag ?? undefined,
    rating: m?.rating ?? undefined,
    reviewCount: m?.review_count,
    prepTime: m?.prep_time ?? undefined,
    isPopular: m?.is_popular,
  };
  return { menuItem, quantity: row.quantity, note: row.note ?? undefined };
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    tableNumber: row.table_number,
    mode: row.mode,
    items: (row.order_items ?? []).map(mapItem),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    kitchenStatus: row.kitchen_status,
    promoCode: row.promo_code ?? undefined,
    subtotal: row.subtotal,
    discount: row.discount,
    tax: row.tax,
    serviceFee: row.service_fee,
    total: row.total,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
    servedAt: row.served_at ?? undefined,
  };
}

let orders: Order[] = EMPTY;
let started = false;
let refreshCounter = 0;
let sessionPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function isStaffPath() {
  return (
    typeof window !== "undefined" &&
    /^\/(kasir|koki|admin|login)(\/|$)/.test(window.location.pathname)
  );
}

export async function ensureSession() {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  if (data.session || isStaffPath()) return;

  if (!sessionPromise) {
    sessionPromise = supabase.auth
      .signInAnonymously()
      .then(({ error }) => {
        if (error) console.error("Gagal membuat sesi anonim:", error.message);
      })
      .finally(() => {
        sessionPromise = null;
      });
  }
  await sessionPromise;
}

async function refresh() {
  const id = ++refreshCounter;
  await ensureSession();

  const { data, error } = await getSupabase()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false })
    .order("id", { referencedTable: "order_items", ascending: true })
    .limit(300);

  if (id !== refreshCounter) return;
  if (error) {
    console.error("Gagal memuat pesanan:", error.message);
    return;
  }

  const next = ((data ?? []) as unknown as OrderRow[]).map(mapOrder);
  if (JSON.stringify(next) === JSON.stringify(orders)) return;
  orders = next;
  emit();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  const supabase = getSupabase();
  void refresh();

  supabase
    .channel("orderpay-orders")
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
      void refresh();
    })
    .subscribe();

  supabase.auth.onAuthStateChange(() => {
    setTimeout(() => void refresh(), 0);
  });

  window.setInterval(() => void refresh(), 30000);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  start();
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return orders;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useOrders(): Order[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useOrder(id?: string | null): Order | undefined {
  const all = useOrders();
  return id ? all.find((o) => o.id === id) : undefined;
}

export interface NewOrderInput {
  tableNumber: string;
  mode: OrderMode;
  paymentMethod: PaymentMethod;
  promoCode?: string | null;
  items: CartItem[];
}

export async function createOrder(
  input: NewOrderInput,
  replaceOrderId?: string | null
): Promise<Order> {
  await ensureSession();

  const { data, error } = await getSupabase().rpc("create_order", {
    p_table_number: String(input.tableNumber),
    p_mode: input.mode,
    p_payment_method: input.paymentMethod,
    p_promo_code: input.promoCode ?? null,
    p_items: input.items.map((item) => ({
      menu_item_id: item.menuItem.id,
      quantity: item.quantity,
      note: item.note ?? null,
    })),
    p_replace_order_id: replaceOrderId ?? null,
  });

  if (error) throw new Error(error.message);

  await refresh();
  const created = orders.find((o) => o.id === (data as { id: string }).id);
  if (!created) throw new Error("Pesanan berhasil dibuat tetapi belum bisa dimuat. Coba lagi.");
  return created;
}

async function callRpc(fn: string, args: Record<string, unknown>): Promise<string | null> {
  await ensureSession();
  const { error } = await getSupabase().rpc(fn, args);
  if (error) {
    console.error(`${fn}:`, error.message);
    return error.message;
  }
  await refresh();
  return null;
}

export function markPaid(
  id: string,
  method: PaymentMethod = "ewallet",
  cashReceived?: number
): Promise<string | null> {
  return method === "cash"
    ? callRpc("confirm_cash_payment", { p_order_id: id, p_cash_received: cashReceived ?? null })
    : callRpc("pay_ewallet_demo", { p_order_id: id });
}

export function updateKitchenStatus(id: string, status: KitchenStatus): Promise<string | null> {
  return callRpc("set_kitchen_status", { p_order_id: id, p_status: status });
}

export async function validatePromo(code: string): Promise<number | null> {
  await ensureSession();
  const { data, error } = await getSupabase().rpc("validate_promo", { p_code: code });
  if (error || data === null || data === undefined) return null;
  return Number(data);
}

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