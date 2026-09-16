"use client";

import React, { createContext, useContext, useState } from "react";
import { OrderMode, CartItem } from "@/lib/types";
import { DEFAULT_TABLE_NUMBER } from "@/lib/constants";
import { calculateOrderTotals } from "@/lib/utils";

interface SessionContextValue {
  tableNumber: string;
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  orderId: string;
  setOrderId: (id: string) => void;
  orderedItems: CartItem[];
  setOrderedItems: (items: CartItem[]) => void;
  orderedTotals: ReturnType<typeof calculateOrderTotals>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<OrderMode>("dine-in");
  const [orderId, setOrderId] = useState<string>("");
  const [orderedItems, setOrderedItemsState] = useState<CartItem[]>([]);

  const setOrderedItems = React.useCallback((newItems: CartItem[]) => {
    setOrderedItemsState((prev) => {
      // Merge items if same menuItem.id
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
  }, []);

  const orderedTotals = React.useMemo(() => calculateOrderTotals(orderedItems), [orderedItems]);

  const value: SessionContextValue = {
    tableNumber: DEFAULT_TABLE_NUMBER,
    mode,
    setMode,
    orderId,
    setOrderId,
    orderedItems,
    setOrderedItems,
    orderedTotals,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
