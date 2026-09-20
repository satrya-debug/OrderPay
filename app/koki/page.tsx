"use client";

import React from "react";
import Link from "next/link";
import {
  Clock3,
  CookingPot,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  Utensils,
} from "lucide-react";
import KokiSidebar from "@/components/koki/KokiSidebar";
import { useOrders, updateKitchenStatus, formatTime } from "@/lib/order-store";
import type { Order } from "@/lib/types";

interface KokiCard {
  id: string;
  table: string;
  time: string;
  items: { name: string; qty: number }[];
  note?: string;
}

function toCard(order: Order): KokiCard {
  const notes = order.items
    .filter((i) => i.note)
    .map((i) => `${i.menuItem.name}: ${i.note}`)
    .join(" · ");

  return {
    id: order.id,
    table: order.mode === "dine-in" ? `Meja ${order.tableNumber}` : "Takeaway",
    time: formatTime(order.paidAt ?? order.createdAt),
    items: order.items.map((i) => ({ name: i.menuItem.name, qty: i.quantity })),
    note: notes || undefined,
  };
}

export default function KokiDashboardPage() {
  const orders = useOrders().filter((o) => o.paymentStatus === "paid");

  const byStatus = (status: Order["kitchenStatus"]) =>
    orders
      .filter((o) => o.kitchenStatus === status)
      .reverse()
      .map(toCard);

  const newOrders = byStatus("received");
  const cookingOrders = byStatus("cooking");
  const readyOrders = byStatus("ready");

  const totalOrders = newOrders.length + cookingOrders.length + readyOrders.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A18]">
      <KokiSidebar />

      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E4E7] bg-white/90 px-8 py-5 backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#71717A]">
              Kitchen Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#09090B]">
              Dashboard Koki
            </h1>

            <p className="mt-1 text-sm text-[#71717A]">
              Pantau dan proses pesanan dapur hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCEFE7] text-[#054B35]">
              <ChefHat className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#09090B]">Chef Dapur</p>
              <p className="text-[10px] text-[#71717A]">Aktif</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-6 rounded-2xl border border-[#DDECE5] bg-[#F1F8F4] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#054B35] text-white">
                <Utensils className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#09090B]">
                  Selamat bekerja, Chef 👨‍🍳
                </h2>

                <p className="mt-0.5 text-xs text-[#52525B]">
                  Berikut kondisi pesanan dapur saat ini.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Pesanan Baru"
              value={newOrders.length}
              icon={Clock3}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />

            <StatCard
              title="Sedang Dimasak"
              value={cookingOrders.length}
              icon={CookingPot}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />

            <StatCard
              title="Siap Disajikan"
              value={readyOrders.length}
              icon={CheckCircle2}
              iconBg="bg-emerald-50"
              iconColor="text-[#054B35]"
            />
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#09090B]">Pesanan Dapur</h2>

                <p className="mt-0.5 text-xs text-[#71717A]">
                  Kelola pesanan berdasarkan status pengerjaan.
                </p>
              </div>

              <span className="rounded-full bg-[#E8F4EE] px-3 py-1.5 text-[11px] font-semibold text-[#054B35]">
                {totalOrders} Pesanan
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <OrderColumn
                title="Pesanan Baru"
                subtitle="Menunggu dimasak"
                count={newOrders.length}
                dot="bg-amber-500"
              >
                {newOrders.length === 0 ? (
                  <EmptyState text="Semua pesanan baru sudah dikerjakan." />
                ) : (
                  newOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      actionLabel="Mulai Masak"
                      onAction={() => updateKitchenStatus(order.id, "cooking")}
                    />
                  ))
                )}
              </OrderColumn>

              <OrderColumn
                title="Sedang Dimasak"
                subtitle="Sedang diproses di dapur"
                count={cookingOrders.length}
                dot="bg-blue-500"
              >
                {cookingOrders.length === 0 ? (
                  <EmptyState text="Tidak ada pesanan yang sedang dimasak." />
                ) : (
                  cookingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      actionLabel="Tandai Siap"
                      onAction={() => updateKitchenStatus(order.id, "ready")}
                    />
                  ))
                )}
              </OrderColumn>

              <OrderColumn
                title="Siap Disajikan"
                subtitle="Pesanan sudah selesai"
                count={readyOrders.length}
                dot="bg-[#054B35]"
              >
                {readyOrders.length === 0 ? (
                  <EmptyState text="Belum ada pesanan siap." />
                ) : (
                  readyOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      actionLabel="Selesaikan"
                      onAction={() => updateKitchenStatus(order.id, "served")}
                    />
                  ))
                )}
              </OrderColumn>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/koki/riwayat"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#054B35] hover:underline"
            >
              Lihat semua riwayat
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#71717A]">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#09090B]">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-[#A1A1AA]">Hari ini</p>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function OrderColumn({
  title,
  subtitle,
  count,
  dot,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  dot: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-[#F7F7F8] p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`}></span>

            <h3 className="text-sm font-bold text-[#09090B]">{title}</h3>
          </div>

          <p className="mt-1 text-[10px] text-[#71717A]">{subtitle}</p>
        </div>

        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#52525B] shadow-sm">
          {count}
        </span>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function OrderCard({
  order,
  actionLabel,
  onAction,
}: {
  order: KokiCard;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#09090B]">#{order.id}</p>

          <p className="mt-0.5 text-[10px] text-[#71717A]">{order.table}</p>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-[#71717A]">
          <Clock3 className="h-3 w-3" />
          {order.time}
        </div>
      </div>

      <div className="my-3 border-t border-[#F0F0F1]"></div>

      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-start justify-between gap-3"
          >
            <p className="text-xs leading-relaxed text-[#3F3F46]">{item.name}</p>

            <span className="flex-shrink-0 rounded-md bg-[#F4F4F5] px-2 py-1 text-[10px] font-bold text-[#3F3F46]">
              ×{item.qty}
            </span>
          </div>
        ))}
      </div>

      {order.note && (
        <div className="mt-3 rounded-xl bg-[#FFF9E8] px-3 py-2">
          <p className="text-[10px] font-semibold text-[#946200]">Catatan</p>

          <p className="mt-0.5 text-[10px] leading-relaxed text-[#8A6A1E]">
            {order.note}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onAction}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#054B35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#043D2B] active:scale-[0.98]"
      >
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D4D4D8] bg-white px-4 py-8 text-center">
      <CookingPot className="mx-auto h-6 w-6 text-[#A1A1AA]" />

      <p className="mt-2 text-xs text-[#71717A]">{text}</p>
    </div>
  );
}