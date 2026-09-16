"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  History,
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

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  note?: string;
}

interface Order {
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
  items: OrderItem[];
}

export default function CashierDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string>("ORD-8824-M14");
  const [cashReceived, setCashReceived] = useState<string>("100.000");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");

  const orders: Order[] = [
    {
      id: "ORD-8824-M14",
      table: "14",
      status: "Menunggu Pembayaran",
      statusType: "pending",
      itemsCount: 3,
      time: "13:48 WIB",
      subtotal: 68000,
      tax: 6800,
      service: 3400,
      total: 78200,
      items: [
        { name: "Nasi Goreng Kampung", qty: 1, price: 38000, note: "Pedas Sedang, Telur 1/2 Matang" },
        { name: "Tahu Telur Bumbu Petis", qty: 1, price: 22000, note: "Porsi Regular, Kerupuk Tambahan" },
        { name: "Es Teh Manis Jumbo", qty: 1, price: 8000, note: "Siap Santap" },
      ],
    },
    {
      id: "ORD-8821-M03",
      table: "03",
      status: "Menunggu Pembayaran",
      statusType: "pending",
      itemsCount: 3,
      time: "13:30 WIB",
      subtotal: 123913,
      tax: 12391,
      service: 6196,
      total: 142500,
      items: [
        { name: "Soto Ayam Ambengan", qty: 2, price: 70000, note: "Koya BANYAK" },
        { name: "Sate Ayam Madura", qty: 2, price: 56000, note: "Bumbu Kacang Terpisah" },
        { name: "Es Jeruk Peras", qty: 1, price: 16500, note: "Es Sedikit" },
      ],
    },
    {
      id: "ORD-8823-M08",
      table: "08",
      status: "Lunas • QRIS",
      statusType: "paid",
      itemsCount: 2,
      time: "13:42 WIB",
      subtotal: 46957,
      tax: 4696,
      service: 2347,
      total: 54000,
      items: [
        { name: "Nasi Goreng Kampung", qty: 1, price: 38000, note: "Tidak Pedas" },
        { name: "Es Jeruk Peras", qty: 1, price: 16000, note: "Normal" },
      ],
    },
    {
      id: "ORD-8820-M12",
      table: "12",
      status: "Lunas • GoPay",
      statusType: "paid",
      itemsCount: 1,
      time: "13:25 WIB",
      subtotal: 21739,
      tax: 2174,
      service: 1087,
      total: 25000,
      items: [
        { name: "Tahu Telur Bumbu Petis", qty: 1, price: 25000, note: "Pedas Lvl 1" },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? order.statusType === "pending"
        : order.statusType === "paid";
    return matchesSearch && matchesStatus;
  });

  const activeOrder = orders.find((o) => o.id === selectedOrder) || orders[0];
  const numCash = parseFloat(cashReceived.replace(/\./g, "")) || 0;
  const change = numCash > (activeOrder.total || 0) ? numCash - (activeOrder.total || 0) : 0;

  const pendingCount = orders.filter((o) => o.statusType === "pending").length;
  const paidCount = orders.filter((o) => o.statusType === "paid").length;

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] font-sans text-slate-800 antialiased">
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#054B35] flex items-center justify-center text-white font-normal">
              <span className="text-xl font-bold">O</span>
            </div>
            <div>
              <h1 className="font-normal text-slate-900 text-base leading-tight">OrderPay</h1>
              <p className="text-[11px] text-slate-400 font-normal">BISTRO RASA</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-normal text-slate-500">
              <span>STATUS MEJA</span>
              <span className="font-normal text-slate-700">24 Total</span>
            </div>
            <div className="flex items-center justify-between text-xs font-normal pt-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#054B35]"></span>
                18 Terisi
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                6 Kosong
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/kasir"
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#054B35] text-white text-xs font-normal shadow-sm"
            >
              <Receipt className="w-4 h-4 stroke-[1.8]" />
              <span>Kasir / Transaksi</span>
            </Link>
            <Link
              href="/kasir/history"
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-normal transition"
            >
              <History className="w-4 h-4 stroke-[1.8] text-slate-500" />
              <span>Riwayat Pesanan</span>
            </Link>
          </nav>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-normal">POS SERVER AKTIF</span>
          </div>
          <p className="text-[10px] text-slate-400 font-light mt-0.5">Versi 2.4.1 — Regional ID</p>
        </div>
      </aside>

      {/* AREA UTAMA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-normal text-slate-700 uppercase tracking-wider text-[11px]">SISTEM KASIR ONLINE</span>
          </div>
          <div className="flex items-center gap-6 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
              <span>11:42 WIB</span>
            </div>
            <span>Shift 1: <strong className="font-normal text-slate-800">Siti Aisyah</strong></span>
          </div>
        </header>

        <div className="p-6 flex-1 space-y-5 overflow-y-auto">
          {/* STATS CARDS ATAS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">TOTAL PENJUALAN HARI INI</p>
                <p className="text-xl font-normal text-slate-900 mt-1">Rp 3.420.000</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Banknote className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">MENUNGGU BAYAR KASIR</p>
                <p className="text-xl font-normal text-slate-900 mt-1">2 Meja</p>
                <p className="text-[11px] text-slate-500 font-light mt-1">Meja 14, Meja 03</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#054B35] text-white flex items-center justify-center">
                <Clock className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-normal text-slate-400 tracking-wider">KETERISIAN MEJA</p>
                <p className="text-xl font-normal text-slate-900 mt-1">18 / 24 <span className="text-xs text-slate-400 font-light">(75%)</span></p>
                <p className="text-[11px] text-emerald-600 font-normal mt-1">6 Meja Tersedia</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Armchair className="w-5 h-5 stroke-[1.8]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* DAFTAR PESANAN KIRI (7 COLUMNS) */}
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
                      <span className="bg-slate-700 text-white text-[10px] font-normal px-1.5 py-0.2 rounded-full">
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
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder === order.id;
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
                              {order.table}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-normal text-slate-900">#{order.id}</h3>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-normal ${
                                  order.statusType === "pending"
                                    ? "bg-[#054B35] text-white"
                                    : "bg-emerald-100 text-emerald-800 flex items-center gap-1"
                                }`}
                              >
                                {order.statusType === "paid" && (
                                  <Check className="w-3 h-3 text-emerald-600 stroke-[1.8]" />
                                )}
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-light mt-1">
                              • {order.itemsCount} Item • {order.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-normal tracking-wider">
                              {order.statusType === "paid" ? "LUNAS" : "TOTAL TAGIHAN"}
                            </p>
                            <p className="text-sm font-normal text-slate-900 mt-0.5">
                              Rp {order.total.toLocaleString("id-ID")}
                            </p>
                          </div>
                          {order.statusType === "paid" && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
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
                })}

                {filteredOrders.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-500 text-xs font-normal">
                    Tidak ada pesanan yang sesuai.
                  </div>
                )}
              </div>
            </div>

            {/* DETAIL & PEMBAYARAN KANAN (5 COLUMNS) */}
            <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-normal text-slate-900">
                        Meja {activeOrder.table}
                      </h2>
                      <span className="text-xs text-slate-400 font-light">#{activeOrder.id}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">
                      ({activeOrder.time})
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-3 py-1 rounded-full font-normal ${
                      activeOrder.statusType === "pending"
                        ? "bg-[#054B35] text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {activeOrder.status}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">
                    RINCIAN PESANAN
                  </p>

                  <div className="space-y-2.5 text-xs">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <p className="font-normal text-slate-800">
                            {item.qty}x {item.name}
                          </p>
                          {item.note && (
                            <p className="text-[11px] text-slate-400 font-light">{item.note}</p>
                          )}
                        </div>
                        <span className="font-normal text-slate-800">
                          Rp {item.price.toLocaleString("id-ID")}
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
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>PB1 Restoran (10%)</span>
                    <span>Rp {activeOrder.tax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>Service (5%)</span>
                    <span>Rp {activeOrder.service.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-normal pt-2 border-t border-slate-200/60 text-sm">
                    <span>Total Pembayaran</span>
                    <span className="font-normal text-slate-900">
                      Rp {activeOrder.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {activeOrder.statusType === "pending" && (
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
                            Serahkan ke Meja {activeOrder.table}
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
                {activeOrder.statusType === "pending" && (
                  <button
                    type="button"
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
