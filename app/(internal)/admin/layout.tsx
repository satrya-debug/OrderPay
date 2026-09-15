"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Utensils, Archive, Users, Bell } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { RESTAURANT_NAME, APP_NAME } from "@/lib/constants";

const NAV = [
  { href: "/admin/menu", label: "Menu & Produk", icon: Utensils },
  { href: "/admin/inventaris", label: "Inventaris Stok", icon: Archive },
  { href: "/admin/pengguna", label: "Pengguna/Staff", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f4f4f2]">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-black/5 bg-white px-4 py-5">
        <div>
          <div className="flex items-center gap-2.5 px-2">
            <Logo size={32} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-neutral-900">{APP_NAME}</p>
              <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
            </div>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active ? "bg-brand-800 text-white" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-neutral-50 p-3">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-xs font-semibold text-white">
            SA
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-brand-500" />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-neutral-800">Manager Ops</p>
            <p className="text-[10px] text-neutral-400">Admin Status: Active</p>
          </div>
        </div>
      </aside>

      <div className="flex-1">
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
