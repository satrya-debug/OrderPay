"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  History,
  Search,
  SlidersHorizontal,
  Printer,
  Share2,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  Utensils,
  ShoppingBag,
} from "lucide-react";

export default function OrderHistoryDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string>("ORD-8820-M12");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const historyOrders = [
    {
      id: "ORD-8824-M14",
      table: "14",
      type: "Dine-in",
      status: "Lunas",
      paymentMethod: "QRIS",
      itemsCount: 3,
      date: "16 Sep 2026",
      time: "13:48 WIB",
      total: 78200,
      customer: "Bpk. Adityawarman",
      items: [
        { name: "1x Nasi Goreng Kampung", notes: "Pedas Sedang, Telur 1/2 Matang", price: 38000 },
        { name: "1x Tahu Telur Bumbu Petis", notes: "Porsi Regular, Kerupuk Tambahan", price: 22000 },
        { name: "1x Es Teh Manis Jumbo", notes: "Siap Santap", price: 8000 },
      ],
      subtotal: 68000,
      pb1: 6800,
      service: 3400,
    },
    {
      id: "ORD-8823-M08",
      table: "08",
      type: "Dine-in",
      status: "Lunas",
      paymentMethod: "QRIS",
      itemsCount: 2,
      date: "16 Sep 2026",
      time: "13:42 WIB",
      total: 54000,
      customer: "Dine-in Pelanggan",
      items: [
        { name: "1x Ayam Bakar Madu Taliwang", notes: "Pedas Sedang", price: 45000 },
        { name: "1x Es Jeruk Kelapa Muda", notes: "Es Sedikit", price: 9000 },
      ],
      subtotal: 48000,
      pb1: 4800,
      service: 1200,
    },
    {
      id: "ORD-8821-M03",
      table: "03",
      type: "Dine-in",
      status: "Lunas",
      paymentMethod: "Tunai",
      itemsCount: 5,
      date: "16 Sep 2026",
      time: "13:30 WIB",
      total: 142500,
      customer: "Ibu Rina",
      items: [
        { name: "2x Soto Betawi Kuah Santan", notes: "Daging Empuk", price: 96000 },
        { name: "2x Es Kopi Susu Gula Aren", notes: "Normal Ice", price: 36000 },
        { name: "1x Tahu Cabe Garam Crispy", notes: "Extra Pedas", price: 10500 },
      ],
      subtotal: 125000,
      pb1: 12500,
      service: 5000,
    },
    {
      id: "ORD-8820-M12",
      table: "12",
      type: "Dine-in",
      status: "Lunas",
      paymentMethod: "GoPay",
      itemsCount: 1,
      date: "16 Sep 2026",
      time: "13:25 WIB",
      total: 25000,
      customer: "Dine-in Pelanggan",
      items: [
        { name: "1x Es Kopi Susu Gula Aren", notes: "Extra Shot Kopi", price: 25000 },
      ],
      subtotal: 22000,
      pb1: 2000,
      service: 1000,
    },
    {
      id: "ORD-8819-TKW",
      table: "Takeaway",
      type: "Takeaway",
      status: "Selesai & Diambil",
      paymentMethod: "ShopeePay",
      itemsCount: 2,
      date: "16 Sep 2026",
      time: "13:10 WIB",
      total: 62000,
      customer: "Sdr. Dimas",
      items: [
        { name: "1x Paket Liwet Komplit", notes: "Bungkus Rapi", price: 42000 },
        { name: "1x Es Teh Manis Jumbo", notes: "Tanpa Es", price: 20000 },
      ],
      subtotal: 55000,
      pb1: 5500,
      service: 1500,
    },
  ];

  const filteredOrders = historyOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua"
        ? true
        : statusFilter === "Takeaway"
        ? order.type === "Takeaway"
        : order.paymentMethod === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeOrder = historyOrders.find((o) => o.id === selectedOrder) || historyOrders[3];

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
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-normal transition"
            >
              <Receipt className="w-4 h-4 stroke-[1.8] text-slate-500" />
              <span>Kasir / Transaksi</span>
            </Link>
            <Link
              href="/kasir/history"
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#054B35] text-white text-xs font-normal shadow-sm"
            >
              <History className="w-4 h-4 stroke-[1.8]" />
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
            <span className="font-normal text-slate-700 uppercase tracking-wider text-[11px]">RIWAYAT TRANSAKSI TERHUBUNG</span>
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
          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[1.8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi ID, meja, atau nama..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#054B35] transition font-normal"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {["Semua", "QRIS", "Tunai", "GoPay", "Takeaway"].map((filter) => (
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-700 hover:bg-slate-100 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
                <span>Hari Ini (16 Sep 2026)</span>
              </button>
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
            {/* RIWAYAT DAFTAR PESANAN KIRI (7 COLUMNS) */}
            <div className="col-span-7 space-y-2.5">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder === order.id;
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
                            order.type === "Takeaway"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : isSelected
                              ? "bg-[#054B35] text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {order.type === "Takeaway" ? (
                            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                          ) : (
                            <>
                              <span className="text-[9px] font-normal uppercase leading-none opacity-80">MEJA</span>
                              <span className="text-base font-normal leading-none mt-0.5">{order.table}</span>
                            </>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-normal text-slate-900">{order.id}</h3>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-normal flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[1.8]" />
                              {order.status} • {order.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-light mt-1">
                            {order.customer} • {order.itemsCount} Item • {order.time}
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
              })}
            </div>

            {/* DETAIL STRUK LUNAS KANAN (5 COLUMNS) */}
            <div className="col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-normal text-slate-900">
                        {activeOrder.type === "Takeaway" ? "Takeaway" : `Meja ${activeOrder.table}`}
                      </h2>
                      <span className="text-xs text-slate-400 font-light">#{activeOrder.id}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">
                      {activeOrder.customer} • {activeOrder.date} ({activeOrder.time})
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] px-3 py-1 rounded-full font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[1.8]" />
                    <span>Selesai</span>
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <p className="text-[10px] uppercase tracking-wider font-normal text-slate-400">RINCIAN STRUK TRANSAKSI</p>

                  <div className="space-y-2.5 text-xs">
                    {activeOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <p className="font-normal text-slate-800">{item.name}</p>
                          <p className="text-[11px] text-slate-400 font-light">{item.notes}</p>
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
                    <span>Rp {activeOrder.subtotal?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>PB1 Restoran (10%)</span>
                    <span>Rp {activeOrder.pb1?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>Service (5%)</span>
                    <span>Rp {activeOrder.service?.toLocaleString("id-ID")}</span>
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
                    <span className="font-normal">Metode Bayar: {activeOrder.paymentMethod}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-normal">STATUS: LUNAS</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
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
          </div>
        </div>

        {/* FOOTER SYSTEM STATUS */}
        <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Database Transaksi Terhubung & Tersinkronkan</span>
          </div>
          <span className="text-slate-400 font-light">Total 5 Transaksi Hari Ini</span>
        </footer>
      </main>
    </div>
  );
}