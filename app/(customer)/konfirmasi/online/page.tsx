"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChefHat, Download, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { OrderReceiptCard } from "@/components/payment/OrderReceiptCard";

export default function KonfirmasiOnlinePage() {
  const router = useRouter();
  const { items, totals } = useCart();
  const { tableNumber, orderId } = useSession();

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

      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-800 text-white">
          <Check size={26} />
        </span>
        <span className="mt-3 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-600">
          LUNAS · TERVERIFIKASI
        </span>
        <h1 className="mt-2 text-xl font-semibold text-neutral-900">Pembayaran Berhasil!</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Pesanan Anda untuk Meja {tableNumber} telah diterima dan sedang disiapkan oleh tim dapur kami.
        </p>
      </div>

      <div className="mt-5">
        <OrderReceiptCard
          orderId={orderId}
          items={items}
          subtotal={totals.subtotal}
          tax={totals.tax}
          serviceFee={totals.serviceFee}
          total={totals.total}
          paymentLabel="E-Wallet (GoPay / QRIS)"
        />
      </div>

      <button
        onClick={() => router.push("/status")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
      >
        <ChefHat size={16} /> Pantau Pesanan Dapur
      </button>
      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-700">
        <Download size={15} /> Unduh Struk Digital
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
        <ShieldCheck size={13} /> Pesanan Resmi Tercatat di Sistem Restoran
      </p>
      <p className="mt-1 text-center text-[11px] text-neutral-500 underline">
        Ada pertanyaan atau perubahan pesanan? Panggil Pelayan
      </p>
    </div>
  );
}
