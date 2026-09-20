"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useOrders, formatTime } from "@/lib/order-store";
import type { Order } from "@/lib/types";
import {
  Receipt,
  Search,
  Printer,
  Share2,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  ShoppingBag,
  X,
} from "lucide-react";

type DateRange = "today" | "yesterday" | "lastWeek";

const DAY_MS = 86400000;
const FILTERS = ["Semua", "QRIS / E-Wallet", "Tunai", "Takeaway"];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function methodLabel(order: Order) {
  return order.paymentMethod === "cash" ? "Tunai" : "QRIS / E-Wallet";
}

function matchesRange(iso: string, range: DateRange, now: Date | null) {
  if (!now) return true;
  const day = startOfDay(new Date(iso));
  const today = startOfDay(now);
  if (range === "today") return day === today;
  if (range === "yesterday") return day === today - DAY_MS;
  return day >= today - 6 * DAY_MS;
}

export default function OrderHistoryDashboard() {
  const allOrders = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateRange>("today");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const historyOrders = allOrders
    .filter((o) => o.paymentStatus === "paid")
    .sort(
      (a, b) =>
        new Date(b.paidAt ?? b.createdAt).getTime() - new Date(a.paidAt ?? a.createdAt).getTime()
    );

  const filteredOrders = historyOrders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(query) || order.tableNumber.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "Semua"
        ? true
        : statusFilter === "Takeaway"
        ? order.mode === "takeaway"
        : methodLabel(order) === statusFilter;

    const matchesDate = matchesRange(order.paidAt ?? order.createdAt, dateFilter, now);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const activeOrder = filteredOrders.find((o) => o.id === selectedOrder) || filteredOrders[0] || null;

  const todayLabel = now ? formatDate(now) : "";
  const yesterdayLabel = now ? formatDate(new Date(now.getTime() - DAY_MS)) : "";
  const clock = now
    ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WIB"
    : "";
  const todayCount = historyOrders.filter((o) =>
    matchesRange(o.paidAt ?? o.createdAt, "today", now)
  ).length;

  const dateLabel =
    dateFilter === "today"
      ? `Hari Ini${todayLabel ? ` (${todayLabel})` : ""}`
      : dateFilter === "yesterday"
      ? `Kemarin${yesterdayLabel ? ` (${yesterdayLabel})` : ""}`
      : "7 Hari Terakhir";

  const dateOptions: { id: DateRange; label: string }[] = [
    { id: "today", label: `Hari Ini${todayLabel ? ` (${todayLabel})` : ""}` },
    { id: "yesterday", label: `Kemarin${yesterdayLabel ? ` (${yesterdayLabel})` : ""}` },
    { id: "lastWeek", label: "7 Hari Terakhir" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans text-slate-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-normal text-slate-700 uppercase tracking-wider text-[11px]">RIWAYAT TRANSAKSI TERHUBUNG</span>
          </div>
          <div className="flex items-center gap-6 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
              <span>{clock}</span>
            </div>
            <span>Shift 1: <strong className="font-normal text-slate-800">Siti Aisyah</strong></span>
          </div>
        </header>

        <div className="p-6 flex-1 space-y-5 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[1.8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor order atau meja..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#054B35] transition font-normal"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal transition ${
                      statusFilter === filter
                        ? "bg-[#054B35] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-700 hover:bg-slate-100 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
                  <span>{dateLabel}</span>
                </button>

                {isDatePickerOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-normal text-slate-700">Pilih Rentang Waktu</span>
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 pt-1">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setDateFilter(opt.id);
                            setIsDatePickerOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-normal transition ${
                            dateFilter === opt.id
                              ? "bg-[#054B35] text-white"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
                <span>Ekspor Laporan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-7 space-y-2.5">
              {historyOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border border-slate-200/80 text-center shadow-sm">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Receipt className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Belum ada pesanan</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">
                    Transaksi yang sudah lunas akan muncul di sini.
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-500 text-xs font-normal shadow-sm">
                  Tidak ada transaksi yang sesuai filter.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = activeOrder?.id === order.id;
                  const isTakeaway = order.mode === "takeaway";
                  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm ${
                        isSelected
                          ? "border-[#054B35] ring-1 ring-[#054B35]/20"
                          : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                              isTakeaway
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : isSelected
                                ? "bg-[#054B35] text-white"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {isTakeaway ? (
                              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                            ) : (
                              <>
                                <span className="text-[9px] font-normal uppercase leading-none opacity-80">MEJA</span>
                                <span className="text-base font-normal leading-none mt-0.5">{order.tableNumber}</span>
                              </>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-normal text-slate-900">{order.id}</h3>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-normal flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[1.8]" />
                                Lunas • {methodLabel(order)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-light mt-1">
                              {isTakeaway ? "Takeaway" : "Dine-in"} • {itemCount} Item •{" "}
                              {formatTime(order.paidAt ?? order.createdAt)} WIB
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-normal tracking-wider">TOTAL LUNAS</p>
                            <p className="text-sm font-normal text-slate-900 mt-0.5">
                              Rp {order.total.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {!activeOrder ? (
              <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-10 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Receipt className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Belum ada pesanan</h3>
                <p className="text-xs text-slate-400 font-light mt-1 max-w-xs">
                  Pilih salah satu transaksi untuk melihat rincian struk.
                </p>
              </div>
            ) : (
              <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-normal text-slate-900">
                          {activeOrder.mode === "takeaway" ? "Takeaway" : `Meja ${activeOrder.tableNumber}`}
                        </h2>
                        <span className="text-xs text-slate-400 font-light">#{activeOrder.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        {formatDate(new Date(activeOrder.paidAt ?? activeOrder.createdAt))} (
                        {formatTime(activeOrder.paidAt ?? activeOrder.createdAt)} WIB)
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] px-3 py-1 rounded-full font-normal flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[1.8]" />
                      <span>{activeOrder.kitchenStatus === "served" ? "Selesai" : "Diproses"}</span>
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">RINCIAN STRUK TRANSAKSI</p>

                    <div className="space-y-2.5 text-xs">
                      {activeOrder.items.map((item) => (
                        <div key={item.menuItem.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-normal text-slate-800">
                              {item.quantity}x {item.menuItem.name}
                            </p>
                            {item.note && (
                              <p className="text-[11px] text-slate-400 font-light">{item.note}</p>
                            )}
                          </div>
                          <span className="font-normal text-slate-800">
                            Rp {(item.menuItem.price * item.quantity).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-100">
                    <div className="flex justify-between text-slate-600 font-light">
                      <span>Subtotal</span>
                      <span>Rp {activeOrder.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    {activeOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-light">
                        <span>Diskon ({activeOrder.promoCode})</span>
                        <span>-Rp {activeOrder.discount.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600 font-light">
                      <span>PB1 Restoran (10%)</span>
                      <span>Rp {activeOrder.tax.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-light">
                      <span>Service (5%)</span>
                      <span>Rp {activeOrder.serviceFee.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-normal pt-2 border-t border-slate-200/60 text-sm">
                      <span>Total Pembayaran</span>
                      <span className="font-normal text-[#054B35]">
                        Rp {activeOrder.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <Receipt className="w-4 h-4 text-[#054B35] stroke-[1.8]" />
                      <span className="font-normal">Metode Bayar: {methodLabel(activeOrder)}</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-normal">STATUS: LUNAS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#054B35] text-white hover:bg-emerald-900 text-xs font-normal transition shadow-sm"
                  >
                    <Printer className="w-4 h-4 stroke-[1.8]" />
                    <span>Cetak Ulang Struk</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-normal transition"
                  >
                    <Share2 className="w-4 h-4 stroke-[1.8]" />
                    <span>Kirim Struk WA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Database Transaksi Terhubung & Tersinkronkan</span>
          </div>
          <span className="text-slate-400 font-light">Total {todayCount} Transaksi Hari Ini</span>
        </footer>
      </main>
    </div>
  );
}