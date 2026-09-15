"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Star,
  Plus,
  Minus,
  Utensils,
  ShoppingBag,
  Receipt,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MENU_ITEMS } from "@/lib/mock-data";
import { MenuItem } from "@types/menu";

export default function DetailMenuPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : "1";

  // Penegasan tipe data (as MenuItem) agar TypeScript tidak menganggap menu bernilai undefined
  const foundMenu = MENU_ITEMS.find((item) => String(item.id) === id);
  const menu: MenuItem = (foundMenu || {
    id: id,
    name: "Nasi Goreng Kampung Spesial",
    price: 38000,
    description:
      "Nasi goreng racikan bumbu terasi khas Nusantara yang harum gurih, disajikan dengan telur mata sapi setengah matang, 2 tusuk sate ayam empuk bumbu kacang, kerupuk udang renyah, acar segar, dan taburan bawang goreng renyah.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isPopular: true,
  }) as MenuItem;

  const { addItem, totalItemCount } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const noteOptions = [
    "+ Pedas Sedang",
    "+ Tidak Pedas",
    "+ Pedas Banget",
    "+ Telur Setengah Matang",
    "+ Tanpa Daun Bawang",
    "+ Kerupuk Dipisah",
  ];

  const toggleNote = (option: string) => {
    if (selectedNotes.includes(option)) {
      setSelectedNotes(selectedNotes.filter((item) => item !== option));
    } else {
      setSelectedNotes([...selectedNotes, option]);
    }
  };

  const handleAddToCart = () => {
    const combinedNotes = [...selectedNotes, customNote].filter(Boolean).join(", ");
    addItem(menu, quantity, combinedNotes);
    router.push("/menu");
  };

  const estimatedTotal = menu.price * quantity;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-44 text-[#1A1A18] font-sans">
      <div className="max-w-md mx-auto relative bg-white min-h-screen shadow-sm">
        {/* Header Melayang (Back, Meja 14, Favorit) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-stone-200/60 shadow-sm text-slate-800 hover:bg-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md text-[#3F3F46] text-xs px-3 py-1.5 rounded-full font-medium border border-stone-200/60 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#054B35]"></span>
              Meja 14
            </span>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-stone-200/60 shadow-sm text-slate-800 hover:bg-white transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-slate-700"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full h-72 bg-stone-100">
          <Image
            src={menu.image}
            alt={menu.name}
            fill
            priority
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover"
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
              <span className="text-stone-300 font-normal">(120+ ulasan)</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-stone-200/60 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>~15 mnt</span>
            </div>
          </div>
        </div>

        {/* Informasi Detail & Catatan */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E4E4E7] shadow-sm space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
              PILIHAN CHEF
            </span>
            <h1 className="text-xl font-bold text-[#09090B] tracking-tight leading-snug">
              {menu.name}
            </h1>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-lg font-bold text-[#09090B]">
                Rp {menu.price.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-stone-400 line-through">
                Rp 45.000
              </span>
            </div>

            <p className="text-xs text-stone-600 font-normal leading-relaxed pt-1">
              {menu.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E4E4E7] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#09090B]">
                  Catatan Pesanan / Preferensi Sajian
                </h2>
                <p className="text-[11px] text-stone-500 font-normal mt-0.5">
                  Tuliskan tingkat kepedasan, pilihan telur, atau catatan khusus
                </p>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-normal">
                Opsional
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {noteOptions.map((option) => {
                const isSelected = selectedNotes.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleNote(option)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      isSelected
                        ? "bg-[#054B35] text-white border-[#054B35]"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Contoh: Pedas sedang, telur mata sapi setengah matang, kerupuk dipisah..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#054B35] focus:bg-white transition resize-none"
            />
          </div>
        </div>

        {/* Floating Estimasi & Tombol Tambah */}
        <div className="fixed bottom-14 left-0 right-0 p-4 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                  ESTIMASI TOTAL
                </p>
                <p className="text-lg font-bold text-[#09090B]">
                  Rp {estimatedTotal.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center border border-stone-300 rounded-full px-2 py-1 bg-white gap-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-[#054B35] text-white flex items-center justify-center hover:bg-emerald-900 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#054B35] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-emerald-900 transition shadow-md flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Pesanan</span>
              </div>
              <span>Rp {estimatedTotal.toLocaleString("id-ID")}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-medium pt-0.5">
              <RefreshCw className="w-3 h-3 text-[#054B35]" />
              <span>Langsung terhubung dengan sistem kasir Meja 14</span>
            </div>
          </div>
        </div>

        {/* Bottom Navbar Presisi Figma */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-2 flex items-center justify-between z-40 max-w-md mx-auto">
          <Link
            href="/menu"
            className="flex flex-col items-center gap-1 text-[#054B35]"
          >
            <Utensils className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">Menu</span>
          </Link>
          <Link
            href="/keranjang"
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-slate-800 relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 right-2 bg-amber-400 text-slate-950 font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
            <span className="text-[10px] font-normal">Keranjang</span>
          </Link>
          <Link
            href="/pembayaran"
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-slate-800"
          >
            <Receipt className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-normal">Pembayaran</span>
          </Link>
          <Link
            href="/status"
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-slate-800"
          >
            <Clock className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-normal">Status</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}