"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useOrders, markPaid, formatTime } from "@/lib/order-store";
import type { Order } from "@/lib/types";
import {
  Receipt,
  Search,
  SlidersHorizontal,
  Check,
  Printer,
  Share2,
  Banknote,
  CreditCard,
  Clock,
  Armchair,
  CheckCircle2,
} from "lucide-react";

function statusLabel(order: Order) {
  if (order.paymentStatus === "unpaid") return "Menunggu Kasir";
  return order.paymentMethod === "cash" ? "Lunas • Tunai" : "Lunas • QRIS";
}

export default function CashierDashboard() {
  const allOrders = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [cashReceived, setCashReceived] = useState<string>("100.000");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date()
          .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          .replace(".", ":") + " WIB"
      );
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);

  const orders = allOrders.filter(
    (o) => o.paymentStatus === "paid" || o.paymentMethod === "cash"
  );

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(query) || order.tableNumber.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? order.paymentStatus === "unpaid"
        : order.paymentStatus === "paid";
    return matchesSearch && matchesStatus;
  });

  const activeOrder = orders.find((o) => o.id === selectedOrder) || filteredOrders[0] || null;
  const numCash = parseFloat(cashReceived.replace(/\./g, "")) || 0;
  const change = activeOrder && numCash > activeOrder.total ? numCash - activeOrder.total : 0;

  const pendingCount = orders.filter((o) => o.paymentStatus === "unpaid").length;
  const paidCount = orders.filter((o) => o.paymentStatus === "paid").length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans text-slate-800 antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-normal text-slate-700 uppercase tracking-wider text-[11px]">SISTEM KASIR ONLINE</span>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">TOTAL PENJUALAN HARI INI</p>
                <p className="text-xl font-normal text-slate-900 mt-1">Rp {totalRevenue.toLocaleString("id-ID")}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Banknote className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">MENUNGGU BAYAR KASIR</p>
                <p className="text-xl font-normal text-slate-900 mt-1">{pendingCount} Pesanan</p>
                <p className="text-[11px] text-slate-500 font-light mt-1">
                  {pendingCount > 0 ? "Perlu konfirmasi pembayaran" : "Tidak ada antrean"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#054B35] text-white flex items-center justify-center">
                <Clock className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">TOTAL PESANAN MASUK</p>
                <p className="text-xl font-normal text-slate-900 mt-1">{orders.length} Pesanan</p>
                <p className="text-[11px] text-emerald-600 font-normal mt-1">{paidCount} Selesai, {pendingCount} Pending</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Armchair className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-7 space-y-3">
              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[1.8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari meja atau nomor order..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#054B35] transition font-normal"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-normal transition ${
                        statusFilter === "all"
                          ? "bg-[#054B35] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Semua ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("pending")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-normal transition flex items-center gap-1.5 ${
                        statusFilter === "pending"
                          ? "bg-[#054B35] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>Menunggu Kasir</span>
                      <span className="bg-slate-700 text-white text-[10px] font-normal px-1.5 rounded-full">
                        {pendingCount}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("paid")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-normal transition ${
                        statusFilter === "paid"
                          ? "bg-[#054B35] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Selesai ({paidCount})
                    </button>
                  </div>
                  <button type="button" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-normal">
                    <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span>Terbaru</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200/80 text-center shadow-sm">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Receipt className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Masih belum ada pesanan</h3>
                    <p className="text-xs text-slate-400 font-light mt-1">
                      Pesanan pelanggan dari halaman menu akan muncul di sini secara real-time.
                    </p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-500 text-xs font-normal">
                    Tidak ada pesanan yang sesuai filter.
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = activeOrder?.id === order.id;
                    const isPaid = order.paymentStatus === "paid";
                    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order.id)}
                        className={`bg-white rounded-2xl p-4 border-2 transition cursor-pointer shadow-sm ${
                          isSelected
                            ? "border-[#054B35] ring-1 ring-[#054B35]/20"
                            : "border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-[#054B35] text-white"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <span
                                className={`text-[9px] font-normal uppercase leading-none ${
                                  isSelected ? "opacity-80" : "text-slate-400"
                                }`}
                              >
                                MEJA
                              </span>
                              <span className="text-base font-normal leading-none mt-0.5">
                                {order.tableNumber}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-normal text-slate-900">#{order.id}</h3>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-normal ${
                                    isPaid
                                      ? "bg-emerald-100 text-emerald-800 flex items-center gap-1"
                                      : "bg-[#054B35] text-white"
                                  }`}
                                >
                                  {isPaid && <Check className="w-3 h-3 text-emerald-600 stroke-[1.8]" />}
                                  {statusLabel(order)}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-light mt-1">
                                • {itemCount} Item • {formatTime(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-normal tracking-wider">
                                {isPaid ? "LUNAS" : "TOTAL TAGIHAN"}
                              </p>
                              <p className="text-sm font-normal text-slate-900 mt-0.5">
                                Rp {order.total.toLocaleString("id-ID")}
                              </p>
                            </div>
                            {isPaid && (
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
                              >
                                <Printer className="w-4 h-4 stroke-[1.8]" />
                              </button>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1 text-[11px] text-[#054B35] font-normal">
                            <span>Dipilih</span>
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {!activeOrder ? (
              <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-10 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Receipt className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Masih belum ada pesanan</h3>
                <p className="text-xs text-slate-400 font-light mt-1 max-w-xs">
                  Pilih salah satu pesanan untuk memproses pembayaran dan mencetak struk.
                </p>
              </div>
            ) : (
              <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-normal text-slate-900">
                          Meja {activeOrder.tableNumber}
                        </h2>
                        <span className="text-xs text-slate-400 font-light">#{activeOrder.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        ({formatTime(activeOrder.createdAt)})
                      </p>
                    </div>
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-normal ${
                        activeOrder.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#054B35] text-white"
                      }`}
                    >
                      {statusLabel(activeOrder)}
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">
                      RINCIAN PESANAN
                    </p>

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
                      <span className="font-normal text-slate-900">
                        Rp {activeOrder.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {activeOrder.paymentStatus === "unpaid" && (
                    <>
                      <div className="space-y-2 pt-1">
                        <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">
                          METODE PEMBAYARAN
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#054B35] text-white text-xs font-normal shadow-sm"
                          >
                            <Banknote className="w-4 h-4 stroke-[1.8]" />
                            <span>Tunai</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-normal transition"
                          >
                            <CreditCard className="w-4 h-4 stroke-[1.8]" />
                            <span>Debit / EDC</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3.5 space-y-3 border border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">
                          UANG DITERIMA (CASH)
                        </p>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-normal">
                            Rp
                          </span>
                          <input
                            type="text"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-base font-normal text-slate-900 focus:outline-none focus:border-[#054B35] transition"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <div>
                            <p className="text-[10px] uppercase font-normal text-slate-400">KEMBALIAN</p>
                            <p className="text-[11px] text-slate-500 font-light">
                              Serahkan ke Meja {activeOrder.tableNumber}
                            </p>
                          </div>
                          <span className="text-base font-normal text-emerald-600">
                            Rp {change.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  {activeOrder.paymentStatus === "unpaid" && (
                    <button
                      type="button"
                      onClick={() => markPaid(activeOrder.id, "cash")}
                      className="w-full bg-[#054B35] text-white py-3 rounded-xl text-xs font-normal hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check className="w-4 h-4 stroke-[1.8]" />
                      <span>Konfirmasi Bayar</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-normal transition"
                    >
                      <Printer className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>Cetak Struk</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-normal transition"
                    >
                      <Share2 className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>Kirim Struk WA</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Printer Kasir & Dapur Terhubung (Bluetooth)</span>
          </div>
          <span className="text-emerald-600 font-normal">Siap Cetak</span>
        </footer>
      </main>
    </div>
  );
}