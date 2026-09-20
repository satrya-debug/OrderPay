"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChefHat,
  FileText,
  Plus,
  ConciergeBell,
  Banknote,
  Wallet,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useOrder, formatTime } from "@/lib/order-store";
import { formatRupiah } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";
import type { KitchenStatus } from "@/lib/types";

const HEADLINE: Record<KitchenStatus, string> = {
  waiting_payment: "Menunggu Pembayaran",
  received: "Pesanan Diterima Dapur",
  cooking: "Sedang Dimasak di Dapur",
  ready: "Siap Disajikan",
  served: "Selamat Menikmati",
};

const NOTE: Record<KitchenStatus, string> = {
  waiting_payment: "Pesanan akan diteruskan ke dapur setelah pembayaran dikonfirmasi.",
  received: "Pesanan Anda sudah masuk antrean dapur dan segera diproses.",
  cooking: "Chef kami sedang meracik hidangan segar pesanan Anda dengan api tungku tradisional.",
  ready: "Hidangan sudah selesai dan sedang diantar ke meja Anda.",
  served: "Semua hidangan sudah disajikan. Selamat menikmati!",
};

export default function StatusPesananPage() {
  const router = useRouter();
  const { tableNumber, mode, orderId } = useSession();
  const order = useOrder(orderId);

  const header = (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 p-2">
          <ArrowLeft size={16} />
        </button>
        <div className="leading-tight">
          <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[15px] font-semibold text-neutral-900">Status Pesanan</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-[#054B35]">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        {mode === "dine-in" ? `Meja ${tableNumber}` : "Takeaway"}
      </div>
    </header>
  );

  if (!order) {
    return (
      <div>
        {header}
        <div className="px-5 pt-4">
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-neutral-700">Belum ada pesanan aktif</p>
            <p className="mt-1 text-xs text-neutral-500">Yuk pilih menu favoritmu dulu.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Lihat Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (order.paymentStatus === "unpaid") {
    const isCash = order.paymentMethod === "cash";

    return (
      <div>
        {header}
        <div className="px-5 pt-4 pb-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500">STATUS PESANAN SAAT INI</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                {isCash ? <Banknote size={16} /> : <Wallet size={16} />}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-semibold text-neutral-900">
              {isCash ? "Menunggu Konfirmasi Kasir" : "Pembayaran Belum Selesai"}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {isCash
                ? "Tunjukkan nomor pesanan ini ke kasir dan bayar tunai. Status pesanan terbuka setelah kasir mengonfirmasi."
                : "Selesaikan pembayaran online agar pesanan Anda diteruskan ke dapur."}
            </p>

            <div className="mt-4 rounded-xl bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-500">NOMOR PESANAN</p>
              <p className="mt-0.5 text-lg font-semibold tracking-wide text-neutral-900">#{order.id}</p>
              <p className="mt-2 text-[11px] text-neutral-500">TOTAL</p>
              <p className="text-base font-semibold text-neutral-900">{formatRupiah(order.total)}</p>
            </div>

            {isCash && (
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-[#054B35]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Menunggu konfirmasi kasir
              </div>
            )}
          </div>

          {!isCash && (
            <button
              onClick={() => router.push("/payment")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
            >
              Lanjutkan Pembayaran
            </button>
          )}
        </div>
      </div>
    );
  }

  const status = order.kitchenStatus;
  const cooked = status === "cooking" || status === "ready" || status === "served";
  const served = status === "served";
  const itemDone = status === "ready" || status === "served";
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  const steps = [
    { label: "Diterima", sub: formatTime(order.paidAt ?? order.createdAt), icon: Check, active: true },
    {
      label: "Dimasak",
      sub: status === "cooking" ? "Proses" : cooked ? "Selesai" : "Menunggu",
      icon: ChefHat,
      active: cooked,
    },
    { label: "Disajikan", sub: `Meja ${order.tableNumber}`, icon: ConciergeBell, active: served },
  ];

  return (
    <div>
      {header}

      <div className="px-5 pt-4 pb-8">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-medium text-neutral-500">STATUS PESANAN SAAT INI</p>
          <h2 className="text-xl font-semibold text-neutral-900">{HEADLINE[status]}</h2>

          <div className="mt-4 flex items-center justify-between">
            {steps.map((s) => (
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
            <p className="text-xs text-neutral-600">{NOTE[status]}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">Progres Menu Anda</h3>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
            {totalQty} Item
          </span>
        </div>
        <p className="-mt-0.5 mb-3 text-xs text-neutral-500">
          {order.items.length} hidangan diproses secara paralel
        </p>

        <div className="flex flex-col gap-3">
          {order.items.map(({ menuItem, quantity, note }) => (
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
                    {itemDone ? "Siap Nikmati" : `Est. ${menuItem.prepTime ?? "~10 mnt"}`}
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
              {order.paymentMethod === "cash" ? "LUNAS · TUNAI" : "LUNAS · QRIS"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-[11px] text-neutral-500">NOMOR PESANAN</p>
              <p className="font-medium text-neutral-800">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-500">WAKTU PESAN</p>
              <p className="font-medium text-neutral-800">Hari ini, {formatTime(order.createdAt)} WIB</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-neutral-50 p-3">
            <span className="text-sm text-neutral-600">Total Pembayaran</span>
            <span className="text-base font-semibold text-neutral-900">{formatRupiah(order.total)}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/konfirmasi/online")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-700 shadow-sm"
        >
          <FileText size={16} /> Lihat Struk Digital
        </button>
        <button
          onClick={() => router.push("/menu")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> Tambah Menu
        </button>
      </div>
    </div>
  );
}