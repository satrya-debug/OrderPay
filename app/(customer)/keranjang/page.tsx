"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Minus, Plus, PlusCircle, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { formatRupiah, generateOrderId } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";

export default function KeranjangPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, paymentMethod, setPaymentMethod, totals, clearCart } =
    useCart();
  const { tableNumber, mode, setOrderId } = useSession();

  function handleConfirm() {
    const id = generateOrderId(tableNumber);
    setOrderId(id);
    if (paymentMethod === "ewallet") {
      router.push("/payment");
    } else {
      router.push("/payment/cash");
    }
  }

  return (
    <div>
      <header className="flex items-center justify-between px-5 py-3 bg-neutral-100">
        <div>
          <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[17px] font-semibold text-neutral-900">Keranjang</h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Meja {tableNumber}
        </span>
      </header>

      <div className="px-5 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="rounded-full border border-neutral-200 bg-white p-2">
            <ArrowLeft size={16} />
          </button>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            {mode === "dine-in" ? "DINE IN" : "TAKEAWAY"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-neutral-700">Keranjang kamu masih kosong</p>
            <p className="mt-1 text-xs text-neutral-500">Yuk pilih menu favoritmu dulu.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Lihat Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {items.map(({ menuItem, quantity, note }) => (
                <div key={menuItem.id} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <Image
                    src={menuItem.image}
                    alt={menuItem.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-neutral-900">{menuItem.name}</p>
                      <button onClick={() => removeItem(menuItem.id)} className="text-neutral-400">
                        <X size={15} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-400">{formatRupiah(menuItem.price)}</p>
                    {note && (
                      <p className="mt-1 truncate text-xs font-medium text-brand-600">{note}</p>
                    )}
                    <div className="mt-2 flex w-fit items-center gap-3 rounded-full border border-neutral-200 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-3 text-center text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-800 text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/menu")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-600"
            >
              <PlusCircle size={16} />
              Tambah Menu Lainnya
            </button>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Metode Pembayaran
              </p>
              <span className="text-xs text-brand-600">Pilih salah satu</span>
            </div>

            <div className="mt-2 flex flex-col gap-2.5">
              <button
                onClick={() => setPaymentMethod("ewallet")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left ${
                  paymentMethod === "ewallet" ? "border-brand-700 bg-brand-50/60" : "border-neutral-200 bg-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
                  <Wallet size={17} />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    E-Wallet / QRIS Digital
                    <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-500">
                      Instan
                    </span>
                  </span>
                  <span className="block text-xs text-brand-600">GoPay, OVO, ShopeePay, DANA, BCA</span>
                </span>
                {paymentMethod === "ewallet" && (
                  <CheckCircle2 size={20} className="fill-brand-700 text-white" />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left ${
                  paymentMethod === "cash" ? "border-brand-700 bg-brand-50/60" : "border-neutral-200 bg-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
                  <Banknote size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-neutral-900">Tunai di Kasir</span>
                  <span className="block text-xs text-neutral-500">Selesaikan pembayaran saat hendak pulang</span>
                </span>
                {paymentMethod === "cash" && (
                  <CheckCircle2 size={20} className="fill-brand-700 text-white" />
                )}
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Rincian Tagihan
              </p>
              <div className="flex justify-between py-1 text-sm text-neutral-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} Item)</span>
                <span>{formatRupiah(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm text-neutral-600">
                <span>Pajak Restoran (PB1 10%)</span>
                <span>{formatRupiah(totals.tax)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm text-neutral-600">
                <span>Biaya Layanan</span>
                <span>{formatRupiah(totals.serviceFee)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
                <div>
                  <p className="text-xs font-medium text-brand-600">TOTAL PEMBAYARAN</p>
                  <p className="text-lg font-semibold text-neutral-900">{formatRupiah(totals.total)}</p>
                </div>
                <span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-500">
                  Pesanan Meja
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-brand-800 px-4 py-3.5 text-sm font-semibold text-white"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Konfirmasi &amp; Pesan Sekarang
              </span>
              <span>{formatRupiah(totals.total)}</span>
            </button>
            <button onClick={clearCart} className="mt-3 w-full text-center text-xs text-neutral-400">
              Batalkan Seluruh Pesanan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
