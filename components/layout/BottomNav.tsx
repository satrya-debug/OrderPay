"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, ShoppingBag, Receipt, ChefHat } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/keranjang", label: "Keranjang", icon: ShoppingBag, showBadge: true },
  { href: "/payment", label: "Bayar", icon: Receipt },
  { href: "/status", label: "Status", icon: ChefHat },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItemCount } = useCart();

  const isActive = (href: string) =>
    pathname === href ||
    pathname?.startsWith(href + "/") ||
    (href === "/menu" && (pathname === "/takeaway" || pathname?.startsWith("/takeaway/")));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
      <div className="relative bg-white/95 backdrop-blur-2xl border-t border-black/[0.04] px-2 pt-1.5 pb-2 flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon, showBadge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-300 ${
                active
                  ? "text-[#054B35]"
                  : "text-[#A1A1AA] hover:text-[#52525B]"
              }`}
            >
              {active && (
                <span className="absolute inset-0 bg-emerald-50 rounded-2xl"></span>
              )}
              {active && (
                <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-gradient-to-r from-[#054B35] to-emerald-500"></span>
              )}
              <span className="relative z-10">
                <Icon
                  className={`w-[22px] h-[22px] transition-all duration-300 ${
                    active ? "stroke-[2.2] scale-105" : "stroke-[1.6]"
                  }`}
                />
                {showBadge && totalItemCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br bg-[#F59E0B] to-orange-500 text-white px-1 text-[9px] font-bold shadow-md ring-2 ring-white">
                    {totalItemCount}
                  </span>
                )}
              </span>
              <span className={`relative z-10 text-[10px] transition-all duration-300 ${
                active ? "font-bold tracking-tight" : "font-medium"
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
