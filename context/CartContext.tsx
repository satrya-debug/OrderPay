"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CartItem, MenuItem, PaymentMethod } from "@/lib/types";
import { calculateOrderTotals } from "@/lib/utils";

interface CartContextValue {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  addItem: (menuItem: MenuItem, quantity?: number, note?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  getQuantity: (menuItemId: string) => number;
  clearCart: () => void;
  totalItemCount: number;
  totals: ReturnType<typeof calculateOrderTotals>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ewallet");

  const addItem = useCallback((menuItem: MenuItem, quantity = 1, note?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity, note: note ?? i.note }
            : i
        );
      }
      return [...prev, { menuItem, quantity, note }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.menuItem.id !== menuItemId);
      }
      return prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i));
    });
  }, []);

  const getQuantity = useCallback(
    (menuItemId: string) => items.find((i) => i.menuItem.id === menuItemId)?.quantity ?? 0,
    [items]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totals = useMemo(() => calculateOrderTotals(items), [items]);

  const value: CartContextValue = {
    items,
    paymentMethod,
    setPaymentMethod,
    addItem,
    removeItem,
    updateQuantity,
    getQuantity,
    clearCart,
    totalItemCount,
    totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
