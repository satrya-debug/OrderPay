"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Download, MapPin, ChefHat, Repeat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { useOrder, formatTime } from "@/lib/order-store";
import { formatRupiah } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";

export default function BayarCashPage() {
  const router = useRouter();
  const { setPaymentMethod, clearCart } = useCart();
  const { tableNumber, mode, orderId } = useSession();
  const order = useOrder(orderId);

  const isPaid = order?.paymentStatus === "paid";

  useEffect(() => {
    if (isPaid) {
      clearCart();
      router.replace("/status");
    }
  }, [isPaid, clearCart, router]);

  const header = (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 p-2">
          <ArrowLeft size={16} />
        </button>
        <div className="leading-tight">
          <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[15px] font-semibold text-neutral-900">Bayar di Kasir</h1>
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
            <p className="text-sm font-medium text-neutral-700">Pesanan tidak ditemukan</p>
            <p className="mt-1 text-xs text-neutral-500">Kembali ke keranjang untuk membuat pesanan.</p>
            <button
              onClick={() => router.push("/keranjang")}
              className="mt-4 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Ke Keranjang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}

      <div className="px-5 pt-4 pb-8">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white">
              <Printer size={17} />
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Menunggu Pembayaran Kasir
            </span>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">Bayar Langsung di Kasir</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Silakan menuju kasir untuk melakukan pembayaran tunai. Tunjukkan nomor pesanan atau kode
            barcode kepada petugas kasir.
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
            Pindai di Meja Kasir
          </p>
          <div className="rounded-xl bg-neutral-50 p-5">
            <div className="mx-auto flex h-16 w-full max-w-[220px] items-end justify-center gap-[2px]">
              {Array.from({ length: 38 }).map((_, i) => (
                <span
                  key={i}
                  className="bg-neutral-800"
                  style={{ width: 2, height: `${18 + ((i * 7) % 40)}px` }}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-sm tracking-widest text-neutral-700">{order.id}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-left">
            <p className="text-xs text-neutral-500">Tunjukkan barcode ke pemindai optik kasir</p>
            <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600">
              <Download size={13} /> Simpan Tiket
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-neutral-500">ID PESANAN</p>
              <p className="text-sm font-semibold text-neutral-900">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-500">WAKTU TRANSAKSI</p>
              <p className="text-sm font-medium text-neutral-700">
                Hari ini, {formatTime(order.createdAt)} WIB
              </p>
            </div>
          </div>
          <div className="flex justify-between border-t border-neutral-100 py-2 text-sm text-neutral-600">
            <span>Metode Pembayaran</span>
            <span className="font-medium text-neutral-800">Cash</span>
          </div>
          <p className="mb-1 mt-1 text-xs font-medium text-neutral-500">DAFTAR PESANAN</p>
          {order.items.map(({ menuItem, quantity, note }) => (
            <div key={menuItem.id} className="flex justify-between border-t border-neutral-100 py-2 text-sm">
              <div>
                <p className="font-medium text-neutral-800">
                  {quantity}x {menuItem.name}
                </p>
                {note && <p className="text-xs text-neutral-400">{note}</p>}
              </div>
              <span className="text-neutral-700">{formatRupiah(menuItem.price * quantity)}</span>
            </div>
          ))}
          <div className="mt-2 space-y-1 border-t border-neutral-100 pt-2 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-600">
                <span>Diskon Promo ({order.promoCode})</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>PB1 / Pajak Restoran (10%)</span>
              <span>{formatRupiah(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan (5%)</span>
              <span>{formatRupiah(order.serviceFee)}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
            <span className="text-base font-semibold text-neutral-900">Total Pembayaran</span>
            <div className="text-right">
              <p className="text-lg font-semibold text-neutral-900">{formatRupiah(order.total)}</p>
              <p className="text-[10px] font-medium text-amber-600">BELUM DIBAYAR</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
            <MapPin size={16} className="text-neutral-600" />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Meja Kasir Utama (Lantai 1)</p>
            <p className="text-xs text-neutral-500">
              Tepat di sebelah pintu keluar utama / area bar kopi. Jarak sekitar 12 langkah dari Meja{" "}
              {tableNumber}.
            </p>
          </div>
        </div>

        <button
          disabled
          className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white opacity-60"
        >
          <ChefHat size={16} /> Menunggu Konfirmasi Kasir
        </button>
        <button
          onClick={() => {
            setPaymentMethod("ewallet");
            router.push("/keranjang");
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-brand-700 hover:text-brand-800"
        >
          <Repeat size={15} /> Ubah Metode Pembayaran
        </button>
        <p className="mt-3 text-center text-[11px] text-neutral-400">
          Pesanan akan segera dimasak oleh dapur setelah pembayaran diverifikasi oleh petugas kasir.
        </p>
      </div>
    </div>
  );
}