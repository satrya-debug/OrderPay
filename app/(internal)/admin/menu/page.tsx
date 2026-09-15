"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, RotateCcw, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { MENU_ITEMS } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  "makanan-utama": "MAKANAN UTAMA",
  camilan: "CAMILAN",
  minuman: "MINUMAN",
};

// Extra rows to mirror the dashboard mockup (stock/status not modeled in MenuItem)
const STOCK_ROWS = [
  { stock: "48 porsi", status: "Tersedia" },
  { stock: "24 porsi", status: "Tersedia" },
  { stock: "0 porsi", status: "Habis" },
  { stock: "35 porsi", status: "Tersedia" },
  { stock: "60 porsi", status: "Tersedia" },
  { stock: "Tak Terbatas", status: "Tersedia" },
  { stock: "20 porsi", status: "Tersedia" },
];

export default function AdminMenuPage() {
  const [query, setQuery] = useState("");
  const rows = MENU_ITEMS.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Katalog Kuliner</p>
      <div className="mt-1 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Kelola Menu Restoran</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {MENU_ITEMS.length} Item Menu Aktif · {new Set(MENU_ITEMS.map((m) => m.category)).size} Kategori
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> Tambah Menu Baru
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
          <Search size={16} className="text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama menu, kode..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
        <select className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-600">
          <option>Semua Kategori</option>
          <option>Makanan Utama</option>
          <option>Camilan</option>
          <option>Minuman</option>
        </select>
        <select className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-600">
          <option>Semua Status</option>
          <option>Tersedia</option>
          <option>Habis</option>
        </select>
        <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-600">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="px-5 py-3">Menu &amp; Foto</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Harga Jual</th>
              <th className="px-5 py-3">Stok / Porsi</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, idx) => {
              const stockInfo = STOCK_ROWS[idx % STOCK_ROWS.length];
              const isHabis = stockInfo.status === "Habis";
              return (
                <tr key={item.id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={44}
                        height={44}
                        className={`h-11 w-11 rounded-lg object-cover ${isHabis ? "grayscale opacity-60" : ""}`}
                      />
                      <div>
                        <p className={`font-medium ${isHabis ? "text-neutral-400" : "text-neutral-900"}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-400">KOD-{item.id.slice(0, 5).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600">
                      {CATEGORY_LABEL[item.category]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{formatRupiah(item.price)}</td>
                  <td className={`px-5 py-3 ${isHabis ? "text-red-500" : "text-neutral-700"}`}>
                    {stockInfo.stock}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${
                        isHabis ? "bg-neutral-100 text-neutral-400" : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isHabis ? "bg-neutral-300" : "bg-brand-500"}`} />
                      {stockInfo.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3 text-neutral-400">
                      <button className="hover:text-neutral-700">
                        <Pencil size={15} />
                      </button>
                      <button className="hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
        <p>
          Menampilkan <span className="font-medium text-neutral-800">{rows.length}</span> dari{" "}
          {MENU_ITEMS.length} total menu
        </p>
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200">
            <ChevronLeft size={15} />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 text-xs font-semibold text-white">
            1
          </span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
