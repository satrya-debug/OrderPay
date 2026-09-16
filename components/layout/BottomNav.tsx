"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, ShoppingBag, Receipt, ChefHat } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/keranjang", label: "Keranjang", icon: ShoppingBag, showBadge: true },
  { href: "/payment", label: "Pembayaran", icon: Receipt },
  { href: "/status", label: "Status", icon: ChefHat },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 mx-auto flex max-w-md items-center justify-between border-t border-black/5 bg-white px-6 py-2.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon, showBadge }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-col items-center gap-1 px-2 py-1 text-[11px] ${
              active ? "text-brand-600 font-semibold" : "text-neutral-400"
            }`}
          >
            <span className="relative">
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {showBadge && totalItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-semibold text-white">
                  {totalItemCount}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
