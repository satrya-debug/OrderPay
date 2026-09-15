# OrderPay POS — Bistro Rasa Nusantara

Aplikasi pemesanan & pembayaran restoran berbasis Next.js (App Router) + TypeScript + Tailwind CSS.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — otomatis diarahkan ke `/menu`.

## Peta halaman

**Customer (pemesanan via meja)**
- `/menu` — Daftar menu makanan
- `/menu/[menuId]` — Detail menu & catatan pesanan
- `/keranjang` — Keranjang & pilih metode pembayaran
- `/payment` — Checkout e-wallet / VA
- `/payment/cash` — Bayar tunai di kasir (barcode)
- `/konfirmasi/online` — Konfirmasi pembayaran online berhasil
- `/konfirmasi/cash` — Konfirmasi pembayaran cash berhasil
- `/verifikasi-kasir` — QR gate verifikasi kasir
- `/status` — Status pesanan / progres dapur

**Internal (staff)**
- `/login` — Login karyawan (Kasir/Koki/Admin)
- `/admin/menu` — Dashboard admin: kelola menu restoran
- `/admin/inventaris`, `/admin/pengguna` — placeholder (belum ada desain)
- `/kasir`, `/koki` — placeholder (belum ada desain)

## Catatan

- Semua data (menu, harga, stok) masih **mock data** di `lib/mock-data.ts` — belum terhubung ke backend/database.
- State keranjang & sesi meja pakai React Context (`context/CartContext.tsx`, `context/SessionContext.tsx`), disimpan di memori (reset saat refresh).
- Untuk menghubungkan ke backend sungguhan, ganti pemanggilan `MENU_ITEMS` / `getMenuItemById` di `lib/mock-data.ts` dengan fetch API kamu.
