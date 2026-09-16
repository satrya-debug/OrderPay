"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Download, MapPin, ChefHat, Repeat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { formatRupiah } from "@/lib/utils";

export default function BayarCashPage() {
  const router = useRouter();
  const { items, totals, setPaymentMethod, clearCart } = useCart();
  const { tableNumber, orderId, setOrderedItems, orderedItems, orderedTotals } = useSession();

  return (
    <div className="px-5 pt-4 pb-8">
      <header className="mb-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 bg-white p-2">
          <ArrowLeft size={16} />
        </button>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          Meja {tableNumber}
        </span>
      </header>

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
          <p className="mt-2 font-mono text-sm tracking-widest text-neutral-700">8824 0014 9021</p>
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
            <p className="text-sm font-semibold text-neutral-900">#{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-neutral-500">WAKTU TRANSAKSI</p>
            <p className="text-sm font-medium text-neutral-700">Hari ini, {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
          </div>
        </div>
        <div className="flex justify-between border-t border-neutral-100 py-2 text-sm text-neutral-600">
          <span>Metode Pembayaran</span>
          <span className="font-medium text-neutral-800">Cash</span>
        </div>
        <p className="mb-1 mt-1 text-xs font-medium text-neutral-500">DAFTAR PESANAN</p>
        {orderedItems.map(({ menuItem, quantity, note }) => (
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
            <span>{formatRupiah(orderedTotals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>PB1 / Pajak Restoran (10%)</span>
            <span>{formatRupiah(orderedTotals.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Layanan (5%)</span>
            <span>{formatRupiah(orderedTotals.serviceFee)}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
          <span className="text-base font-semibold text-neutral-900">Total Pembayaran</span>
          <div className="text-right">
            <p className="text-lg font-semibold text-neutral-900">{formatRupiah(orderedTotals.total)}</p>
            <p className="text-[10px] font-medium text-brand-600">LUNAS</p>
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
        onClick={() => {
          setOrderedItems(items);
          clearCart();
          router.push("/status");
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
      >
        <ChefHat size={16} /> Pantau Pesanan Dapur
      </button>
      <button
        onClick={() => {
          setPaymentMethod("ewallet");
          router.push("/keranjang");
        }}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-700"
      >
        <Repeat size={15} /> Ubah Metode Pembayaran
      </button>
      <p className="mt-3 text-center text-[11px] text-neutral-400">
        Pesanan akan segera dimasak oleh dapur setelah pembayaran diverifikasi oleh petugas kasir.
      </p>
    </div>
  );
}
