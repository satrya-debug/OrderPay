"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, LogOut } from "lucide-react";

export default function KokiSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardActive = pathname === "/koki";
  const isHistoryActive = pathname.startsWith("/koki/riwayat");

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        
        {/* HEADER LOGO KOKI */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/images/menu/logo_orderpay1.png"
              alt="Logo OrderPay"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-normal text-slate-900 text-base leading-tight">OrderPay</h1>
            <p className="text-[11px] text-slate-400 font-normal">BISTRO RASA</p>
          </div>
        </div>

        {/* STATUS DAPUR */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-normal text-slate-500">
            <span>STATUS DAPUR</span>
            <span className="font-normal text-slate-700">Koki Aktif</span>
          </div>
          <div className="flex items-center justify-between text-xs font-normal pt-1">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#054B35]"></span>
              Chef Dapur
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              Online
            </span>
          </div>
        </div>

        {/* NAVIGASI */}
        <nav className="space-y-1">
          <Link
            href="/koki"
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-normal transition ${
              isDashboardActive
                ? "bg-[#054B35] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 stroke-[1.8] ${isDashboardActive ? "text-white" : "text-slate-500"}`} />
            <span>Dashboard Koki</span>
          </Link>

          <Link
            href="/koki/riwayat"
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-normal transition ${
              isHistoryActive
                ? "bg-[#054B35] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History className={`w-4 h-4 stroke-[1.8] ${isHistoryActive ? "text-white" : "text-slate-500"}`} />
            <span>Riwayat Pesanan</span>
          </Link>
        </nav>
      </div>

      {/* FOOTER SIDEBAR */}
      <div className="space-y-2">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-normal">KITCHEN SERVER AKTIF</span>
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
  );
}