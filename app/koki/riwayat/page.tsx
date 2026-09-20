"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, Search, ChefHat } from "lucide-react";
import KokiSidebar from "@/components/koki/KokiSidebar";
import { useOrders, formatTime } from "@/lib/order-store";

export default function KokiHistoryPage() {
  const orders = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const finishedOrders = orders
    .filter(
      (o) =>
        o.kitchenStatus === "served" &&
        new Date(o.servedAt ?? o.paidAt ?? o.createdAt).toDateString() ===
          new Date().toDateString()
    )
    .sort(
      (a, b) =>
        new Date(b.servedAt ?? b.paidAt ?? b.createdAt).getTime() -
        new Date(a.servedAt ?? a.paidAt ?? a.createdAt).getTime()
    );

  const filtered = finishedOrders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const tableLabel = o.mode === "dine-in" ? `meja ${o.tableNumber}` : "takeaway";
    return o.id.toLowerCase().includes(query) || tableLabel.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A18]">
      <KokiSidebar />

      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E4E7] bg-white/90 px-8 py-5 backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71717A]">
              Kitchen Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#09090B]">
              Riwayat Pesanan
            </h1>

            <p className="mt-1 text-sm text-[#71717A]">
              Daftar pesanan yang telah selesai diproses.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCEFE7] text-[#054B35]">
              <ChefHat className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#09090B]">Chef Dapur</p>
              <p className="text-[10px] text-[#71717A]">Aktif</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#054B35]" />

                <h2 className="text-sm font-bold text-[#09090B]">Pesanan Selesai</h2>
              </div>

              <p className="mt-1 text-xs text-[#71717A]">
                Semua pesanan yang telah selesai hari ini.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor pesanan atau meja..."
                className="w-full rounded-xl border border-[#E4E4E7] bg-[#F8F9FA] py-2.5 pl-10 pr-4 text-xs text-[#09090B] outline-none transition focus:border-[#054B35]"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-sm">
            <div className="hidden grid-cols-[1.2fr_1fr_1.8fr_1fr] gap-4 border-b border-[#E4E4E7] bg-[#FAFAFA] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#71717A] md:grid">
              <span>Pesanan</span>
              <span>Meja</span>
              <span>Menu</span>
              <span>Waktu Selesai</span>
            </div>

            <div className="divide-y divide-[#F0F0F1]">
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center text-xs text-neutral-500">
                  {finishedOrders.length === 0
                    ? "Belum ada pesanan yang selesai."
                    : "Tidak ada pesanan yang sesuai pencarian."}
                </div>
              ) : (
                filtered.map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1fr_1.8fr_1fr] md:items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#09090B]">#{order.id}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-[#71717A]">
                        <Clock3 className="h-3 w-3" />
                        Masuk {formatTime(order.paidAt ?? order.createdAt)}
                      </div>
                    </div>

                    <div>
                      <span className="inline-flex rounded-full bg-[#F4F4F5] px-3 py-1.5 text-[10px] font-medium text-[#3F3F46]">
                        {order.mode === "dine-in" ? `Meja ${order.tableNumber}` : "Takeaway"}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <p className="text-xs text-[#3F3F46]">{item.menuItem.name}</p>
                          <span className="text-[10px] font-semibold text-[#71717A]">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F4EE]">
                        <CheckCircle2 className="h-4 w-4 text-[#054B35]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#054B35]">Selesai</p>
                        <p className="text-[10px] text-[#71717A]">
                          {formatTime(order.servedAt ?? order.paidAt ?? order.createdAt)} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#E4E4E7] bg-white px-5 py-4">
            <p className="text-xs text-[#71717A]">Total pesanan selesai hari ini</p>

            <span className="text-sm font-bold text-[#09090B]">
              {finishedOrders.length} Pesanan
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}