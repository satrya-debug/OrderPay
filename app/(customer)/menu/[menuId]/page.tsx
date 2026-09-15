"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart, Star, Clock, Minus, Plus, ShoppingBag } from "lucide-react";
import { getMenuItemById } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";

const QUICK_NOTES = [
  "Pedas Sedang",
  "Tidak Pedas",
  "Pedas Banget",
  "Telur Setengah Matang",
  "Tanpa Daun Bawang",
  "Kerupuk Dipisah",
];

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams<{ menuId: string }>();
  const item = getMenuItemById(params.menuId);
  const { addItem } = useCart();
  const { tableNumber } = useSession();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!item) {
    return (
      <div className="p-6 text-center text-sm text-neutral-500">
        Menu tidak ditemukan.
        <button onClick={() => router.push("/menu")} className="mt-3 block text-brand-700 underline">
          Kembali ke menu
        </button>
      </div>
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setNote((prev) => {
      if (prev.includes(tag)) return prev;
      return prev ? `${prev}, ${tag}` : tag;
    });
  }

  function handleAddToCart() {
    addItem(item!, quantity, note || undefined);
    router.push("/menu");
  }

  return (
    <div className="pb-32">
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-black/5">
        <button onClick={() => router.back()} className="rounded-full border border-neutral-200 p-2">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Meja {tableNumber}
          </span>
          <button className="rounded-full border border-neutral-200 p-2 text-neutral-500">
            <Heart size={16} />
          </button>
        </div>
      </header>

      <div className="relative">
        <Image
          src={item.image}
          alt={item.name}
          width={800}
          height={500}
          className="h-64 w-full object-cover"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-800">
          <Star size={12} className="fill-amber-500 text-amber-500" />
          {item.rating ?? "4.8"} ({item.reviewCount ?? 80}+ ulasan)
        </div>
        {item.prepTime && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-800">
            <Clock size={12} />
            {item.prepTime}
          </div>
        )}
      </div>

      <div className="px-5">
        <div className="-mt-4 rounded-t-2xl bg-white p-4 shadow-sm">
          {item.tag && (
            <span className="mb-2 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
              {item.tag}
            </span>
          )}
          <h1 className="text-xl font-semibold text-neutral-900">{item.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-semibold text-brand-700">{formatRupiah(item.price)}</span>
            {item.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatRupiah(item.originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.description}</p>
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-900">
              Catatan Pesanan / Preferensi Sajian
            </p>
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">
              Opsional
            </span>
          </div>
          <p className="mb-3 text-xs text-neutral-500">
            Tuliskan tingkat kepedasan, pilihan telur, atau catatan khusus
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_NOTES.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  selectedTags.includes(tag)
                    ? "border-brand-700 bg-brand-50 text-brand-800"
                    : "border-neutral-200 text-neutral-600"
                }`}
              >
                + {tag}
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Pedas sedang, telur mata sapi setengah matang, kerupuk dipisah..."
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md border-t border-black/5 bg-white px-5 py-3">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-neutral-500">Estimasi Total</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatRupiah(item.price * quantity)}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-2 py-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-800 text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3.5 text-sm font-semibold text-white"
        >
          <ShoppingBag size={16} />
          Tambah ke Pesanan · {formatRupiah(item.price * quantity)}
        </button>
        <p className="mt-2 text-center text-[10px] text-neutral-400">
          Langsung terhubung dengan sistem kasir Meja {tableNumber}
        </p>
      </div>
    </div>
  );
}
