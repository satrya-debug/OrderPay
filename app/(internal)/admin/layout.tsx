"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Utensils, Archive, Users, Bell, LogOut, Receipt } from "lucide-react";
import { useOrders } from "@/lib/order-store";

const NAV = [
  { href: "/admin/pesanan", label: "Daftar Pesanan", icon: Receipt },
  { href: "/admin/menu", label: "Menu & Produk", icon: Utensils },
  { href: "/admin/inventaris", label: "Inventaris Stok", icon: Archive },
  { href: "/admin/pengguna", label: "Pengguna/Staff", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const orders = useOrders().filter(
  (o) => o.paymentStatus === "paid" || o.paymentMethod === "cash"
);

  const totalToday = orders.length;
  const pendingCount = orders.filter((o) => o.paymentStatus === "unpaid").length;
  const paidCount = orders.filter((o) => o.paymentStatus === "paid").length;

  return (
    <div className="flex min-h-screen bg-[#f4f4f2]">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#054B35] flex items-center justify-center text-white font-normal">
              <span className="text-xl font-bold">O</span>
            </div>
            <div>
              <h1 className="font-normal text-slate-900 text-base leading-tight">OrderPay</h1>
              <p className="text-[11px] text-slate-400 font-normal">BISTRO RASA</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-normal text-slate-500">
              <span>STATUS ADMIN</span>
              <span className="font-normal text-slate-700">Manager Ops</span>
            </div>
            <div className="flex items-center justify-between text-xs font-normal pt-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#054B35]"></span>
                Siti Aisyah
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-normal text-slate-500">
              <span>PESANAN MASUK</span>
              <span className="font-normal text-slate-700">{totalToday} Total</span>
            </div>
            <div className="flex items-center justify-between text-xs font-normal pt-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {pendingCount} Menunggu
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#054B35]"></span>
                {paidCount} Lunas
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-normal transition ${
                    active
                      ? "bg-[#054B35] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[1.8] ${active ? "text-white" : "text-slate-500"}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-normal">ADMIN PANEL AKTIF</span>
            </div>
            <p className="text-[10px] text-slate-400 font-light mt-0.5">Versi 2.4.1 — Regional ID</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
            <span>Keluar / Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-3">
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> DASHBOARD ADMIN
            </span>
            <span className="text-neutral-300">|</span>
            <span>{new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
            <span className="text-neutral-300">|</span>
            <span>Admin: Siti Aisyah</span>
          </div>
          <button className="rounded-full bg-neutral-100 p-2 text-neutral-500">
            <Bell size={16} />
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}