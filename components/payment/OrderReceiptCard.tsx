import { CartItem } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface OrderReceiptCardProps {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  paymentLabel: string;
}

export function OrderReceiptCard({
  orderId,
  items,
  subtotal,
  tax,
  serviceFee,
  total,
  paymentLabel,
}: OrderReceiptCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">ID PESANAN</p>
          <p className="text-sm font-semibold text-neutral-900">#{orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-neutral-500">WAKTU TRANSAKSI</p>
          <p className="text-sm font-medium text-neutral-700">Hari ini, 13:48 WIB</p>
        </div>
      </div>
      <div className="flex justify-between border-t border-neutral-100 py-2 text-sm text-neutral-600">
        <span>Metode Pembayaran</span>
        <span className="font-medium text-neutral-800">{paymentLabel}</span>
      </div>
      <p className="mb-1 mt-1 text-xs font-medium text-neutral-500">DAFTAR PESANAN</p>
      {items.map(({ menuItem, quantity, note }) => (
        <div key={menuItem.id} className="flex justify-between border-t border-neutral-100 py-2 text-sm">
          <div>
            <p className="font-medium text-neutral-800">
              {quantity}x {menuItem.name}
            </p>
            {note && <p className="text-xs text-neutral-400">{note}</p>}
          </div>
          <span className="text-neutral-700">{formatRupiah(menuItem.price * quantity)}</span>
        </div>
      ))}
      <div className="mt-2 space-y-1 border-t border-neutral-100 pt-2 text-sm text-neutral-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>PB1 / Pajak Restoran (10%)</span>
          <span>{formatRupiah(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya Layanan (5%)</span>
          <span>{formatRupiah(serviceFee)}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
        <span className="text-base font-semibold text-neutral-900">Total Pembayaran</span>
        <div className="text-right">
          <p className="text-lg font-semibold text-neutral-900">{formatRupiah(total)}</p>
          <p className="text-[10px] font-medium text-brand-600">LUNAS</p>
        </div>
      </div>
    </div>
  );
}
