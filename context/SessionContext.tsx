"use client";

import React, { createContext, useContext, useState } from "react";
import { OrderMode } from "@/lib/types";
import { DEFAULT_TABLE_NUMBER } from "@/lib/constants";

interface SessionContextValue {
  tableNumber: string;
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  orderId: string;
  setOrderId: (id: string) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<OrderMode>("dine-in");
  const [orderId, setOrderId] = useState<string>(`ORD-8824-M${DEFAULT_TABLE_NUMBER}`);

  const value: SessionContextValue = {
    tableNumber: DEFAULT_TABLE_NUMBER,
    mode,
    setMode,
    orderId,
    setOrderId,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
