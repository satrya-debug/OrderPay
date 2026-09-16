"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Star,
  UtensilsCrossed,
  ReceiptText,
  CookingPot,
  Utensils
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { MENU_ITEMS } from "@/lib/mock-data";
import { OrderMode } from "@/lib/types";

interface MenuPageContentProps {
  initialMode?: OrderMode;
}

export function MenuPageContent({ initialMode }: MenuPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [sortBy, setSortBy] = useState("default");
  const [dietFilter, setDietFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { addItem, updateQuantity, getQuantity, totalItemCount, totals } = useCart();
  const { tableNumber, mode, setMode } = useSession();

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  const currentMode = initialMode || mode;

  const categories = [
    "Semua",
    "Populer & Chef's Pick",
    "Makanan Utama",
    "Minuman Segar",
    "Snack & Camilan",
  ];

  const getBadgeTags = (menu: any) => {
    if (menu.tags) return menu.tags;

    switch (String(menu.id)) {
      case "1":
        return [
          { text: "Bestseller", bg: "bg-[#F4F4F5] text-[#3F3F46]" },
          { text: "4.9", bg: "bg-[#FEF3C7] text-[#92400E]", isStar: true },
        ];
      case "2":
        return [
          { text: "Pedas Lvl 2", bg: "bg-[#F4F4F5] text-[#3F3F46]" },
          { text: "Chef Pick", bg: "bg-[#F4F4F5] text-[#3F3F46]" },
        ];
      case "3":
        return [{ text: "Khas Jakarta", bg: "bg-[#F4F4F5] text-[#3F3F46]" }];
      case "4":
        return [{ text: "100% Jeruk Murni", bg: "bg-[#F4F4F5] text-[#3F3F46]" }];
      case "5":
        return [{ text: "Camilan Renyah", bg: "bg-[#F4F4F5] text-[#3F3F46]" }];
      case "6":
        return [{ text: "Favorit Kopi", bg: "bg-[#F4F4F5] text-[#3F3F46]" }];
      default:
        return [{ text: "Rekomendasi", bg: "bg-[#F4F4F5] text-[#3F3F46]" }];
    }
  };

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" ||
      (selectedCategory === "Populer & Chef's Pick"
        ? item.isPopular
        : item.category === selectedCategory);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDiet = true;
    if (dietFilter === "pedas") {
      matchesDiet = item.description.toLowerCase().includes("pedas") || item.name.toLowerCase().includes("pedas");
    } else if (dietFilter === "halal") {
      matchesDiet = true;
    } else if (dietFilter === "vegetarian") {
      matchesDiet = item.category === "minuman" || item.category === "camilan";
    } else if (dietFilter === "bebas-kacang") {
      matchesDiet = !item.description.toLowerCase().includes("kacang");
    }

    return matchesCategory && matchesSearch && matchesDiet;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-36 text-[#1A1A18] font-normal" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <header className="sticky top-0 z-20 bg-white border-b border-[#E4E4E7] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#054B35] flex items-center justify-center p-1.5 shadow-sm">
            <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center relative">
              <div className="w-2 h-1 bg-amber-400 rounded-t-full"></div>
            </div>
          </div>
          <div>
            <p className="text-[9px] text-[#71717A] tracking-wider uppercase">
              Bistro Rasa Nusantara
            </p>
            <h1 className="text-sm text-[#09090B] leading-tight">
              {currentMode === "takeaway" ? "Menu Takeaway" : "Menu Makanan"}
            </h1>
          </div>
        </div>
        <div className="bg-[#F4F4F5] text-[#27272A] text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#E4E4E7]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#054B35]"></span>
          {currentMode === "dine-in" ? `Meja ${tableNumber}` : "Takeaway"}
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-4 border border-[#E4E4E7] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 bg-[#F4F4F5] text-[#3F3F46] px-2.5 py-1 rounded-full">
              <span>{currentMode === "dine-in" ? `Meja ${tableNumber} • Makan di Tempat` : "Takeaway • Bawa Pulang"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#054B35]">
              <span className="w-2 h-2 rounded-full bg-[#054B35] animate-pulse"></span>
              <span>Sesi Aktif</span>
            </div>
          </div>
          <div>
            <h2 className="text-base text-[#09090B] tracking-tight">
              Selamat Datang di Bistro
            </h2>
            <p className="text-xs text-[#52525B] leading-relaxed mt-0.5">
              {currentMode === "dine-in"
                ? "Pesan langsung dari meja Anda tanpa antre. Nikmati masakan Nusantara hangat & lezat."
                : "Pesan langsung untuk dibawa pulang tanpa antre. Nikmati masakan Nusantara hangat & lezat."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Cari menu makanan dan minuman ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E4E4E7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#054B35] transition"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2.5 bg-white border border-[#E4E4E7] rounded-xl text-[#3F3F46] hover:bg-[#F4F4F5] transition relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(sortBy !== "default" || dietFilter !== "all") && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#054B35] rounded-full border border-white"></span>
            )}
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar py-1 -mx-4 px-4 touch-pan-x">
          <div className="flex items-center gap-2 w-max">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#054B35] text-white shadow-sm"
                      : "bg-white border border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2A1508] via-[#1C1917] to-[#054B35] text-white p-4 shadow-md min-h-[130px] flex flex-col justify-between">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-amber-300 border border-amber-500/30">
                {currentMode === "dine-in" ? `PROMO MEJA ${tableNumber}` : "PROMO TAKEAWAY"}
              </span>
              <span className="text-[#D4D4D8]">Hanya Hari Ini</span>
            </div>
            <h3 className="text-sm leading-tight max-w-[70%] text-white">
              Diskon 20% Paket Liwet Komplit
            </h3>
            <p className="text-[10px] text-[#A1A1AA] line-clamp-1 max-w-[70%]">
              Nasi aromatik, ayam suwir gurih, sambal
            </p>
          </div>
          <div className="relative z-10 pt-2">
            <button className="bg-white text-[#09090B] text-[11px] px-3.5 py-1.5 rounded-full hover:bg-stone-100 transition flex items-center gap-1 shadow-sm">
              Klaim Promo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-sm text-[#09090B]">
              Menu Populer &amp; Rekomendasi
            </h2>
            <p className="text-[11px] text-[#71717A]">
              Paling digemari para pengunjung hari ini
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-[#A1A1AA]" />
        </div>

        <div className="space-y-3">
          {filteredMenuItems.map((menu) => {
            const qty = getQuantity(menu.id);
            const tags = getBadgeTags(menu);
            const isBroken = imgError[menu.id];

            return (
              <div
                key={menu.id}
                className="bg-white rounded-2xl p-3 border border-[#E4E4E7] shadow-sm flex justify-between gap-3 items-center hover:shadow-md transition"
              >
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {tags.map((tag: any, idx: number) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-2 py-0.5 rounded-md flex items-center gap-0.5 ${tag.bg}`}
                        >
                          {tag.isStar && (
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          )}
                          {tag.text}
                        </span>
                      ))}
                    </div>

                    <Link href={`/menu/${menu.id}`}>
                      <h3 className="text-xs text-[#09090B] line-clamp-1 hover:text-[#054B35] transition">
                        {menu.name}
                      </h3>
                    </Link>

                    <p className="text-[10px] text-[#71717A] line-clamp-2 mt-0.5 leading-relaxed">
                      {menu.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[#09090B]">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => addItem(menu)}
                        className="border border-[#D4D4D8] text-[#27272A] text-[11px] px-3 py-1 rounded-full hover:bg-emerald-50 hover:border-[#054B35] hover:text-[#054B35] transition"
                      >
                        + Tambah
                      </button>
                    ) : (
                      <div className="flex items-center border border-[#D4D4D8] rounded-full px-1 py-0.5 bg-white gap-2">
                        <button
                          onClick={() => updateQuantity(menu.id, qty - 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#3F3F46] hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-[#09090B] min-w-[12px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(menu.id, qty + 1)}
                          className="w-5 h-5 rounded-full bg-[#054B35] text-white flex items-center justify-center hover:bg-emerald-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center">
                  {!isBroken && menu.image ? (
                    <Image
                      src={menu.image}
                      alt={menu.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      onError={() => setImgError((prev) => ({ ...prev, [menu.id]: true }))}
                    />
                  ) : (
                    <div className="text-[#A1A1AA] flex flex-col items-center gap-1">
                      <Utensils className="w-5 h-5" />
                      <span className="text-[8px]">No Image</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalItemCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 px-4 z-30 max-w-md mx-auto pointer-events-none">
          <div className="bg-[#054B35] text-white p-2.5 pl-3.5 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto border border-emerald-900/40">
            <div className="flex items-center gap-3">
              <div className="relative bg-white/10 p-2.5 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white stroke-[1.8]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-[#09090B] font-medium text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#054B35]">
                  {totalItemCount}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-emerald-100/90 font-normal">
                  {totalItemCount} Menu Dipilih
                </p>
                <p className="text-sm font-normal tracking-tight">
                  Rp {(totals?.total ?? 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <Link
              href="/keranjang"
              className="bg-white text-[#09090B] text-xs font-normal px-4 py-2 rounded-xl hover:bg-stone-100 transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Lihat Keranjang</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4E4E7] px-6 py-2 flex items-center justify-between z-20 max-w-md mx-auto">
        <Link href={currentMode === "takeaway" ? "/takeaway" : "/menu"} className="flex flex-col items-center gap-1 text-[#054B35]">
          <UtensilsCrossed className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] font-normal">Menu</span>
        </Link>
        <Link href="/keranjang" className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-[#3F3F46]">
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] font-normal">Keranjang</span>
        </Link>
        <Link href="/pembayaran" className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-[#3F3F46]">
          <ReceiptText className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] font-normal">Pembayaran</span>
        </Link>
        <Link href="/status" className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-[#3F3F46]">
          <CookingPot className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] font-normal">Status</span>
        </Link>
      </nav>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center max-w-md mx-auto">
          <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-sm font-bold text-[#09090B]">Urutkan &amp; Filter Menu</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Urutkan Berdasarkan</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "default", label: "Default" },
                  { id: "price-low", label: "Harga Termurah" },
                  { id: "price-high", label: "Harga Termahal" },
                  { id: "rating", label: "Rating / Populer" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`px-3 py-2 rounded-xl text-xs text-left transition border ${
                      sortBy === s.id
                        ? "bg-[#054B35]/10 border-[#054B35] text-[#054B35] font-semibold"
                        : "bg-white border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Filter Preferensi / Diet</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "Semua Menu" },
                  { id: "halal", label: "100% Halal" },
                  { id: "vegetarian", label: "Vegetarian" },
                  { id: "bebas-kacang", label: "Bebas Kacang" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietFilter(d.id)}
                    className={`px-3 py-2 rounded-xl text-xs text-left transition border ${
                      dietFilter === d.id
                        ? "bg-[#054B35]/10 border-[#054B35] text-[#054B35] font-semibold"
                        : "bg-white border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  setSortBy("default");
                  setDietFilter("all");
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#3F3F46] hover:bg-[#F4F4F5] transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#054B35] text-white text-xs font-bold hover:bg-emerald-900 transition shadow-sm"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
