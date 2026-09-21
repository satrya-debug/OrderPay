"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, ExternalLink, ChevronRight, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { useOrder, markPaid } from "@/lib/order-store";
import { formatRupiah } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";

const EWALLETS = [
  { id: "gopay", name: "GoPay", desc: "Buka aplikasi GoPay langsung · Bebas Biaya", color: "bg-[#00AA13]" },
  { id: "ovo", name: "OVO", desc: "Push notifikasi ke ponsel Anda", color: "bg-[#4C3494]" },
  { id: "dana", name: "DANA", desc: "Verifikasi otomatis · Saldo terhubung", color: "bg-[#108EE9]" },
  { id: "shopeepay", name: "ShopeePay", desc: "Cashback koin · Buka aplikasi", color: "bg-[#EE4D2D]" },
];

const VA_OPTIONS = [
  { id: "bca", name: "BCA mobile / myBCA", desc: "Virtual Account 014892188 · Cek Otomatis" },
  { id: "mandiri", name: "Mandiri Livin'", desc: "Koneksi Mandiri biller · Verifikasi instan" },
  { id: "bri", name: "BRImo", desc: "BRIVA terhubung otomatis" },
  { id: "bni", name: "BNI Mobile Banking", desc: "Virtual Account 988892188" },
];

export default function PaymentEwalletPage() {
  const router = useRouter();
  const { clearCart, items } = useCart();
  const { tableNumber, mode, orderId, setOrderedItems } = useSession();
  const order = useOrder(orderId);
  const [selected, setSelected] = useState("gopay");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const isPendingCash = order?.paymentMethod === "cash" && order.paymentStatus === "unpaid";

  useEffect(() => {
    if (isPendingCash) router.replace("/payment/cash");
  }, [isPendingCash, router]);

  const selectedWallet = EWALLETS.find((w) => w.id === selected);

  async function handlePay() {
    if (!order || paying) return;
    setPaying(true);
    setPayError("");

    const err = await markPaid(order.id, "ewallet");
    if (err) {
      setPayError(err);
      setPaying(false);
      return;
    }

    setOrderedItems(items);
    clearCart();
    router.push("/konfirmasi/online");
  }

  const header = (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 p-2">
          <ArrowLeft size={16} />
        </button>
        <div className="leading-tight">
          <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
          <h1 className="text-[15px] font-semibold text-neutral-900">Payment Checkout</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-[#054B35]">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        {mode === "dine-in" ? `Meja ${tableNumber}` : "Takeaway"}
      </div>
    </header>
  );

  if (isPendingCash) return null;

  if (!order || (order.paymentStatus === "paid" && !paying)) {
    return (
      <div>
        {header}
        <div className="px-5 pt-4">
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-neutral-700">Belum ada pesanan</p>
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

  return (
    <div>
      {header}

      <div className="px-5 pt-4 pb-8">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-500">TOTAL PEMBAYARAN</p>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              Rincian <ChevronRight size={13} />
            </span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{formatRupiah(order.total)}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck size={13} className="text-brand-600" />
            Transaksi Aman Terenkripsi QRIS 128-bit
            <span className="ml-auto rounded-md bg-neutral-100 px-1.5 py-0.5 text-neutral-500">Instan</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">E-Wallet Populer</p>
          <span className="text-xs text-brand-600">Langsung Buka App</span>
        </div>
        <div className="mt-2 flex flex-col gap-2.5">
          {EWALLETS.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelected(w.id)}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left ${
                selected === w.id ? "border-brand-700 bg-brand-50/50" : "border-neutral-200 bg-white"
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white text-xs font-bold ${w.color}`}>
                {w.name[0]}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-neutral-900">{w.name}</span>
                <span className="block text-xs text-neutral-500">{w.desc}</span>
              </span>
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  selected === w.id ? "border-brand-700 bg-brand-700" : "border-neutral-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Mobile Banking &amp; VA</p>
          <span className="text-xs text-brand-600">Konfirmasi Real-Time</span>
        </div>
        <div className="mt-2 flex flex-col gap-2.5">
          {VA_OPTIONS.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelected(v.id)}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left ${
                selected === v.id ? "border-brand-700 bg-brand-50/50" : "border-neutral-200 bg-white"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-[10px] font-bold text-neutral-600">
                {v.name.slice(0, 3).toUpperCase()}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-neutral-900">{v.name}</span>
                <span className="block text-xs text-neutral-500">{v.desc}</span>
              </span>
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  selected === v.id ? "border-brand-700 bg-brand-700" : "border-neutral-300"
                }`}
              />
            </button>
          ))}
        </div>

        {payError && (
          <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
            <XCircle size={14} className="shrink-0" />
            {payError}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={paying}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {paying
            ? "Memproses pembayaran..."
            : `Buka Aplikasi ${selectedWallet?.name ?? ""} & Bayar (${formatRupiah(order.total)})`}
          {!paying && <ExternalLink size={14} />}
        </button>
        <button
          onClick={() => router.push("/verifikasi-kasir")}
          className="mt-3 w-full text-center text-sm font-medium text-neutral-500"
        >
          Sudah Bayar? Lihat QR Gate Kasir →
        </button>

        <p className="mt-6 text-center text-[11px] text-neutral-400">
          Terhubung dengan Gateway QRIS &amp; Bank Indonesia
          <br />
          <span className="text-neutral-500 underline">Butuh bantuan kasir? Panggil Pelayan ke Meja {tableNumber}</span>
        </p>
      </div>
    </div>
  );
}