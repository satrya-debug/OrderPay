"use client";

import { useState } from "react";
import { Search, Receipt, Banknote, Clock, CheckCircle2 } from "lucide-react";
import { useOrders, formatTime } from "@/lib/order-store";
import type { KitchenStatus } from "@/lib/types";

const KITCHEN_LABEL: Record<KitchenStatus, string> = {
  waiting_payment: "Menunggu Pembayaran",
  received: "Diterima",
  cooking: "Dimasak",
  ready: "Siap Disajikan",
  served: "Disajikan",
};

export default function AdminPesananPage() {
  const orders = useOrders().filter(
    (o) => o.paymentStatus === "paid" || o.paymentMethod === "cash"
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    const matchesQuery = o.id.toLowerCase().includes(q) || o.tableNumber.toLowerCase().includes(q);
    const matchesFilter = filter === "all" ? true : o.paymentStatus === filter;
    return matchesQuery && matchesFilter;
  });

  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const unpaid = orders.filter((o) => o.paymentStatus === "unpaid");
  const revenue = paid.reduce((sum, o) => sum + o.total, 0);

  const filters = [
    { id: "all" as const, label: `Semua (${orders.length})` },
    { id: "unpaid" as const, label: "Belum Dibayar" },
    { id: "paid" as const, label: "Lunas" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Daftar Pesanan</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Pantau semua pesanan pelanggan beserta status pembayaran dan dapur.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Pendapatan Lunas</p>
            <p className="mt-1 text-xl text-slate-900">Rp {revenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Banknote size={20} />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Menunggu Kasir</p>
            <p className="mt-1 text-xl text-slate-900">{unpaid.length} Pesanan</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#054B35] text-white">
            <Clock size={20} />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Pesanan Lunas</p>
            <p className="mt-1 text-xl text-slate-900">{paid.length} Pesanan</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari meja atau nomor order..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-800 transition focus:border-[#054B35] focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                filter === f.id
                  ? "bg-[#054B35] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Receipt size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Belum ada pesanan</p>
            <p className="mt-1 text-xs text-slate-400">Pesanan pelanggan akan muncul di sini.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Tidak ada pesanan yang sesuai filter.
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-normal">Pesanan</th>
                <th className="px-4 py-3 font-normal">Menu</th>
                <th className="px-4 py-3 font-normal">Metode</th>
                <th className="px-4 py-3 font-normal">Pembayaran</th>
                <th className="px-4 py-3 font-normal">Dapur</th>
                <th className="px-4 py-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {o.mode === "dine-in" ? `Meja ${o.tableNumber}` : "Takeaway"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      #{o.id} · {formatTime(o.createdAt)}
                    </p>
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-slate-600">
                    <p className="truncate">
                      {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {o.paymentMethod === "cash" ? "Tunai" : "QRIS / E-Wallet"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] ${
                        o.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.paymentStatus === "paid" ? "Lunas" : "Belum dibayar"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{KITCHEN_LABEL[o.kitchenStatus]}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    Rp {o.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}