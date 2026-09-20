"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { OrderMode, CartItem } from "@/lib/types";
import { DEFAULT_TABLE_NUMBER } from "@/lib/constants";
import { calculateOrderTotals } from "@/lib/utils";

export interface OrderItemRecord {
  name: string;
  qty: number;
  price: number;
  note?: string;
}

export interface OrderRecord {
  id: string;
  table: string;
  status: string;
  statusType: "pending" | "paid" | "cash";
  itemsCount: number;
  time: string;
  total: number;
  subtotal: number;
  tax: number;
  service: number;
  customer?: string;
  paymentMethod?: string;
  type: "Dine-in" | "Takeaway";
  items: OrderItemRecord[];
  kokiStatus: "baru" | "dimasak" | "siap";
  createdAt: number;
}

interface SessionContextValue {
  tableNumber: string;
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  orderId: string;
  setOrderId: (id: string) => void;
  orderedItems: CartItem[];
  setOrderedItems: (items: CartItem[]) => void;
  orderedTotals: ReturnType<typeof calculateOrderTotals>;
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  createOrderFromCart: (items: CartItem[], method?: string) => OrderRecord;
  updateOrderStatus: (orderId: string, status: string, statusType?: "pending" | "paid" | "cash") => void;
  updateKokiStatus: (orderId: string, kokiStatus: "baru" | "dimasak" | "siap") => void;
}

const STORAGE_KEY = "orderpay_orders";

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<OrderMode>("dine-in");
  const [orderId, setOrderId] = useState<string>("");
  const [orderedItems, setOrderedItemsState] = useState<CartItem[]>([]);

  // Live orders shared across customer, kasir, koki, and admin
  const [orders, setOrdersState] = useState<OrderRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const setOrders = useCallback((updater: React.SetStateAction<OrderRecord[]>) => {
    setOrdersState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
      }
      return next;
    });
  }, []);

  // Sync across tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setOrdersState(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === order.id);
      if (exists) {
        return prev.map((o) => (o.id === order.id ? order : o));
      }
      return [order, ...prev];
    });
  }, [setOrders]);

  const updateOrderStatus = useCallback(
    (targetId: string, newStatus: string, newStatusType?: "pending" | "paid" | "cash") => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetId
            ? {
                ...o,
                status: newStatus,
                ...(newStatusType ? { statusType: newStatusType } : {}),
              }
            : o
        )
      );
    },
    [setOrders]
  );

  const updateKokiStatus = useCallback(
    (targetId: string, newKokiStatus: "baru" | "dimasak" | "siap") => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetId
            ? {
                ...o,
                kokiStatus: newKokiStatus,
              }
            : o
        )
      );
    },
    [setOrders]
  );

  const createOrderFromCart = useCallback(
    (items: CartItem[], method = "QRIS") => {
      const totals = calculateOrderTotals(items);
      const newId = orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}-M${DEFAULT_TABLE_NUMBER}`;
      const isCash = method.toLowerCase().includes("tunai") || method.toLowerCase().includes("cash");

      const newOrder: OrderRecord = {
        id: newId,
        table: mode === "dine-in" ? DEFAULT_TABLE_NUMBER : "Takeaway",
        status: isCash ? "Menunggu Pembayaran" : `Lunas • ${method}`,
        statusType: isCash ? "pending" : "paid",
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        time: `${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
        subtotal: totals.subtotal,
        tax: totals.tax,
        service: totals.serviceFee,
        total: totals.total,
        customer: mode === "dine-in" ? `Pelanggan Meja ${DEFAULT_TABLE_NUMBER}` : "Pelanggan Takeaway",
        paymentMethod: method,
        type: mode === "dine-in" ? "Dine-in" : "Takeaway",
        items: items.map((i) => ({
          name: i.menuItem.name,
          qty: i.quantity,
          price: i.menuItem.price * i.quantity,
          note: i.note,
        })),
        kokiStatus: "baru",
        createdAt: Date.now(),
      };

      setOrderId(newId);
      addOrder(newOrder);
      return newOrder;
    },
    [orderId, mode, addOrder]
  );

  const setOrderedItems = useCallback(
    (newItems: CartItem[]) => {
      setOrderedItemsState((prev) => {
        const map = new Map<string, CartItem>();
        for (const item of prev) {
          map.set(item.menuItem.id, { ...item });
        }
        for (const item of newItems) {
          if (map.has(item.menuItem.id)) {
            const existing = map.get(item.menuItem.id)!;
            existing.quantity += item.quantity;
            if (item.note) existing.note = item.note;
          } else {
            map.set(item.menuItem.id, { ...item });
          }
        }
        return Array.from(map.values());
      });

      // Also ensure order is registered into live orders if not empty
      if (newItems.length > 0) {
        createOrderFromCart(newItems);
      }
    },
    [createOrderFromCart]
  );

  const orderedTotals = useMemo(() => calculateOrderTotals(orderedItems), [orderedItems]);

  const value: SessionContextValue = {
    tableNumber: DEFAULT_TABLE_NUMBER,
    mode,
    setMode,
    orderId,
    setOrderId,
    orderedItems,
    setOrderedItems,
    orderedTotals,
    orders,
    addOrder,
    createOrderFromCart,
    updateOrderStatus,
    updateKokiStatus,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}