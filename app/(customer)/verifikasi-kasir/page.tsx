"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Printer, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { formatRupiah } from "@/lib/utils";
import { RESTAURANT_NAME } from "@/lib/constants";

const STEPS = [
  "Tunjukkan QR ini ke kasir atau dekatkan ke mesin scanner kasir mandiri.",
  "Mesin kasir akan otomatis memverifikasi dan mencetak struk fisik Meja.",
  "Pesanan Anda langsung otomatis diteruskan ke antrean masak dapur.",
];

export default function VerifikasiKasirPage() {
  const router = useRouter();
  const { totals } = useCart();
  const { tableNumber, orderId } = useSession();

  return (
    <div className="px-5 pt-4 pb-8">
      <header className="mb-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 bg-white p-2">
          <ArrowLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-[10px] text-neutral-500">{RESTAURANT_NAME}</p>
          <p className="text-sm font-semibold text-neutral-900">Verifikasi Kasir</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          Meja {tableNumber}
        </span>
      </header>

      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-medium text-neutral-500">
          MEJA {tableNumber} · ID #{orderId.replace("ORD-", "")}
        </p>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
          LUNAS / TERHUBUNG
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs text-neutral-500">STATUS PEMBAYARAN</p>
          <p className="text-lg font-semibold text-neutral-900">
            {formatRupiah(totals.total)} <span className="text-sm font-normal text-neutral-500">(GoPay)</span>
          </p>
          <p className="mt-1 text-xs text-neutral-500">2 Menu Spesial + Pajak PB1 · 14:48 WIB</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
          Terkonfirmasi
        </span>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 text-center shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Siap Dipindai di Kasir
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
            Auto-Print Struk
          </span>
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">QR Gate Verifikasi Kasir</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Pindai QR ini pada scanner kasir atau mesin mandiri untuk mencetak struk fisik dan otomatis
          mengirim pesanan ke antrean dapur.
        </p>

        <div className="mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-xl bg-neutral-50 p-3">
          <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-[3px]">
            {Array.from({ length: 64 }).map((_, i) => (
              <span key={i} className={`${(i * 37) % 5 === 0 ? "bg-neutral-900" : "bg-transparent"} rounded-[1px]`} />
            ))}
          </div>
        </div>
        <p className="mt-2 font-mono text-xs tracking-widest text-neutral-500">
          TOKEN: OP-MEJA{tableNumber}-PAID
        </p>

        <div className="mt-4 flex flex-col gap-3 text-left">
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-800 text-[10px] font-semibold text-white">
                {idx + 1}
              </span>
              <p className="text-xs text-neutral-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/status")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
      >
        <Printer size={16} /> Cetak Struk di Kasir
      </button>
      <button
        onClick={() => router.push("/status")}
        className="mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-neutral-500"
      >
        Lihat Status Pesanan Meja {tableNumber} <ArrowRight size={14} />
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
        <ShieldCheck size={13} /> Sistem Kasir Terintegrasi POS &amp; Dapur
      </p>
      <p className="mt-1 text-center text-[11px] text-neutral-500 underline">
        Butuh bantuan kasir? Panggil Pelayan ke Meja {tableNumber}
      </p>
    </div>
  );
}
