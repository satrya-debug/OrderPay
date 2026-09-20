"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  X,
  Minus,
  Plus,
  PlusCircle,
  Wallet,
  Banknote,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { createOrder } from "@/lib/order-store";
import { formatRupiah, generateOrderId } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";

const PAYMENT_OPTIONS = [
  {
    id: "ewallet" as const,
    name: "E-Wallet & QRIS",
    desc: "GoPay, OVO, ShopeePay, DANA · Instan",
    Icon: Wallet,
  },
  {
    id: "cash" as const,
    name: "Tunai di Kasir",
    desc: "Bayar setelah makan selesai",
    Icon: Banknote,
  },
];

const PROMO_CODES: Record<string, number> = {
  LIWET20: 0.2,
};

export default function KeranjangPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, paymentMethod, setPaymentMethod, totals, clearCart } =
    useCart();
  const { tableNumber, mode, orderId, setOrderId } = useSession();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  const discountRate = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discount = totals.subtotal * discountRate;
  const grandTotal = totals.total - discount;

  function handleApplyPromo() {
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setPromoError("Masukkan kode promo terlebih dahulu");
      return;
    }

    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoInput(code);
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError("Kode promo tidak valid");
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  function handleConfirm() {
    const id = generateOrderId(tableNumber);
    createOrder(
      {
        id,
        tableNumber: String(tableNumber),
        mode,
        items,
        paymentMethod,
        promoCode: appliedPromo ?? undefined,
        subtotal: totals.subtotal,
        discount,
        tax: totals.tax,
        serviceFee: totals.serviceFee,
        total: grandTotal,
      },
      orderId
    );
    setOrderId(id);
    router.push(paymentMethod === "ewallet" ? "/payment" : "/payment/cash");
  }

  return (
    <div>
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-full border border-neutral-200 p-2">
            <ArrowLeft size={16} />
          </button>
          <div className="leading-tight">
            <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
            <h1 className="text-[15px] font-semibold text-neutral-900">Keranjang</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-[#054B35]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {mode === "dine-in" ? `Meja ${tableNumber}` : "Takeaway"}
        </div>
      </header>

      <div className="px-5 pt-4 pb-8">
        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-neutral-700">Keranjang kamu masih kosong</p>
            <p className="mt-1 text-xs text-neutral-500">Yuk pilih menu favoritmu dulu.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Lihat Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              {items.map(({ menuItem, quantity, note }) => (
                <div
                  key={menuItem.id}
                  className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md"
                >
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
                      <button
                        onClick={() => removeItem(menuItem.id)}
                        className="text-neutral-400 transition hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatRupiah(menuItem.price)}</p>
                    {note && <p className="mt-1 truncate text-xs font-medium text-brand-600">{note}</p>}

                    <div className="mt-2 flex w-fit items-center gap-3 rounded-full border border-brand-800 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 active:scale-90"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-3 text-center text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-800 text-white transition hover:bg-brand-700 active:scale-90"
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
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-600 transition hover:border-brand-700 hover:bg-brand-50/50 hover:text-brand-800"
            >
              <PlusCircle size={16} />
              Tambah Menu Lainnya
            </button>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Kode Promo</p>
            </div>
            <div className="mt-2 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: LIWET20"
                  value={promoInput}
                  disabled={!!appliedPromo}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !appliedPromo) handleApplyPromo();
                  }}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm uppercase text-neutral-900 focus:border-brand-700 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500"
                />
                {appliedPromo ? (
                  <button
                    onClick={handleRemovePromo}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-red-300 hover:text-red-500 active:scale-95"
                  >
                    Hapus
                  </button>
                ) : (
                  <button
                    onClick={handleApplyPromo}
                    className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-95"
                  >
                    Terapkan
                  </button>
                )}
              </div>

              {appliedPromo && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <CheckCircle2 size={13} className="text-brand-600" />
                  Kode {appliedPromo} berhasil dipakai (Diskon {Math.round(discountRate * 100)}%)
                </div>
              )}
              {promoError && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-red-500">
                  <XCircle size={13} />
                  {promoError}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Metode Pembayaran
              </p>
              <span className="text-xs text-brand-600">Pilih salah satu</span>
            </div>
            <div className="mt-2 flex flex-col gap-2.5">
              {PAYMENT_OPTIONS.map(({ id, name, desc, Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition hover:border-brand-700 ${
                    paymentMethod === id ? "border-brand-700 bg-brand-50/50" : "border-neutral-200 bg-white"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                    <Icon size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-neutral-900">{name}</span>
                    <span className="block text-xs text-neutral-500">{desc}</span>
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      paymentMethod === id ? "border-brand-700 bg-brand-700" : "border-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-neutral-500">RINCIAN TAGIHAN</p>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                  Meja {tableNumber}
                </span>
              </div>

              <div className="mt-2 flex justify-between py-1 text-sm text-neutral-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span>{formatRupiah(totals.subtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between py-1 text-sm text-brand-600">
                  <span>Diskon Promo ({appliedPromo})</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 text-sm text-neutral-600">
                <span>PB1 / Pajak Restoran (10%)</span>
                <span>{formatRupiah(totals.tax)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm text-neutral-600">
                <span>Biaya Layanan (5%)</span>
                <span>{formatRupiah(totals.serviceFee)}</span>
              </div>

              <div className="mt-3 border-t border-neutral-100 pt-3">
                <p className="text-xs font-medium text-neutral-500">TOTAL PEMBAYARAN</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{formatRupiah(grandTotal)}</p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
            >
              Konfirmasi &amp; Bayar ({formatRupiah(grandTotal)})
            </button>
            <button
              onClick={clearCart}
              className="mt-3 w-full text-center text-sm font-medium text-neutral-500 transition hover:text-red-500"
            >
              Batalkan Seluruh Pesanan
            </button>
          </>
        )}
      </div>
    </div>
  );
}