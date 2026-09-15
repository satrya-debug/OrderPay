"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChefHat, Clock, FileText, Plus, ConciergeBell } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { formatRupiah } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";
import type { CartItem } from "@/lib/types";

export default function StatusPesananPage() {
  const router = useRouter();
  const { items, totals } = useCart();
  const { tableNumber, orderId } = useSession();

  const stageItems =
    items.length > 0
      ? items
      : [
          { menuItem: { id: "1", name: "Nasi Goreng Kampung", price: 42000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&q=80" }, quantity: 1, note: "Pedas Sedang · Telur 1/2 Matang" },
          { menuItem: { id: "2", name: "Tahu Telur Bumbu Petis", price: 26000, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=200&q=80" }, quantity: 1, note: "Porsi Reguler · Kerupuk Bawang..." },
          { menuItem: { id: "3", name: "Es Teh Manis Jumbo", price: 10200, image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=200&q=80" }, quantity: 1, note: "Sedikit Gula · Es Batu Normal" },
        ] as CartItem[];

  return (
    <div className="px-5 pt-4 pb-8">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[15px] font-semibold text-neutral-900">Payment Checkout</h1>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          Meja {tableNumber}
        </span>
      </header>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-500">STATUS PESANAN SAAT INI</p>
          <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
            <Clock size={11} /> ~12 mnt
          </span>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Sedang Dimasak di Dapur</h2>

        <div className="mt-4 flex items-center justify-between">
          {[
            { label: "Diterima", sub: "13:48", icon: Check, active: true },
            { label: "Dimasak", sub: "Proses", icon: ChefHat, active: true },
            { label: "Disajikan", sub: `Meja ${tableNumber}`, icon: ConciergeBell, active: false },
          ].map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  s.active ? "bg-brand-800 text-white" : "bg-neutral-100 text-neutral-400"
                }`}
              >
                <s.icon size={16} />
              </span>
              <p className="mt-1.5 text-xs font-medium text-neutral-800">{s.label}</p>
              <p className="text-[10px] text-neutral-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-neutral-50 p-3">
          <ChefHat size={16} className="mt-0.5 shrink-0 text-brand-700" />
          <p className="text-xs text-neutral-600">
            Chef kami sedang meracik hidangan segar pesanan Anda dengan api tungku tradisional.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900">Progres Menu Anda</h3>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
          {stageItems.reduce((s, i) => s + i.quantity, 0)} Item
        </span>
      </div>
      <p className="-mt-0.5 mb-3 text-xs text-neutral-500">
        {stageItems.length} hidangan diproses secara paralel
      </p>

      <div className="flex flex-col gap-3">
        {stageItems.map(({ menuItem, quantity, note }, idx) => (
          <div key={menuItem.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <Image
              src={menuItem.image}
              alt={menuItem.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-neutral-900">{menuItem.name}</p>
                <span className="text-sm font-semibold text-neutral-900">
                  {formatRupiah(menuItem.price)}
                </span>
              </div>
              {note && <p className="truncate text-xs text-neutral-400">{note}</p>}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-neutral-500">{quantity} Porsi</span>
                <span className="text-xs font-medium text-brand-600">
                  {idx === stageItems.length - 1 ? "Siap Nikmati" : `Est. ~${6 + idx * 6} mnt`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-500">RINCIAN TRANSAKSI</p>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
            LUNAS · QRIS
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-[11px] text-neutral-500">NOMOR PESANAN</p>
            <p className="font-medium text-neutral-800">#{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-neutral-500">WAKTU PESAN</p>
            <p className="font-medium text-neutral-800">Hari ini, 13:48 WIB</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl bg-neutral-50 p-3">
          <span className="text-sm text-neutral-600">Total Pembayaran</span>
          <span className="text-base font-semibold text-neutral-900">
            {formatRupiah(totals.total || 78200)}
          </span>
        </div>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-neutral-500">
        <FileText size={14} /> Lihat Struk Digital
      </button>
      <button
        onClick={() => router.push("/menu")}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
      >
        <Plus size={16} /> Tambah Menu
      </button>
    </div>
  );
}
