"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  X,
  Upload,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

type Category = "makanan-utama" | "camilan" | "minuman";
type StatusKey = "tersedia" | "habis" | "nonaktif";

interface MenuRow {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: Category;
  tag: string | null;
  rating: number | null;
  review_count: number;
  prep_time: string | null;
  is_popular: boolean;
  is_available: boolean;
  stock: number | null;
  sort_order: number;
}

const CATEGORY_LABEL: Record<Category, string> = {
  "makanan-utama": "Makanan Utama",
  camilan: "Camilan",
  minuman: "Minuman",
};

const PAGE_SIZE = 10;
const BUCKET = "menu-images";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054B35] focus:outline-none";

function rupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function statusOf(row: MenuRow): StatusKey {
  if (!row.is_available) return "nonaktif";
  if (row.stock !== null && row.stock <= 0) return "habis";
  return "tersedia";
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "menu"
  );
}

function generateId(name: string, existing: string[]) {
  const initials =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .slice(0, 4)
      .map((w) => w[0])
      .join("") || "mn";

  let n = existing.length + 1;
  let id = `${initials}${String(n).padStart(2, "0")}`;
  while (existing.includes(id)) {
    n += 1;
    id = `${initials}${String(n).padStart(2, "0")}`;
  }
  return id;
}

async function resizeToWebp(file: File, maxWidth = 800): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung pengolahan gambar");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar"))),
      "image/webp",
      0.8
    );
  });
}

function Thumb({ src, alt, size }: { src: string | null; alt: string; size: number }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"
        style={{ width: size, height: size }}
      >
        <UtensilsCrossed size={Math.round(size / 2.5)} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-xl object-cover"
      style={{ width: size, height: size }}
    />
  );
}

function StatusPill({ status }: { status: StatusKey }) {
  const cfg = {
    tersedia: { label: "Tersedia", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    habis: { label: "Habis", cls: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
    nonaktif: { label: "Nonaktif", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-[#054B35]" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

interface FormState {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  stock: string;
  category: Category;
  tag: string;
  prepTime: string;
  imageUrl: string;
  isPopular: boolean;
  isAvailable: boolean;
}

function MenuFormModal({
  row,
  existingIds,
  nextSort,
  onClose,
  onSaved,
}: {
  row: MenuRow | null;
  existingIds: string[];
  nextSort: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = row === null;

  const [form, setForm] = useState<FormState>(() =>
    row
      ? {
          name: row.name,
          description: row.description,
          price: String(row.price),
          originalPrice: row.original_price ? String(row.original_price) : "",
          stock: row.stock === null ? "" : String(row.stock),
          category: row.category,
          tag: row.tag ?? "",
          prepTime: row.prep_time ?? "",
          imageUrl: row.image_url ?? "",
          isPopular: row.is_popular,
          isAvailable: row.is_available,
        }
      : {
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          category: "makanan-utama",
          tag: "",
          prepTime: "",
          imageUrl: "",
          isPopular: false,
          isAvailable: true,
        }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("File harus berupa gambar");
      return;
    }

    setUploading(true);
    setFormError("");

    try {
      const blob = await resizeToWebp(file);
      const path = `${slugify(form.name || file.name)}-${Date.now()}.webp`;
      const supabase = getSupabase();

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      set("imageUrl", data.publicUrl);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setFormError("");

    const name = form.name.trim();
    if (!name) {
      setFormError("Nama menu wajib diisi");
      return;
    }

    const price = Number(form.price);
    if (form.price.trim() === "" || !Number.isInteger(price) || price < 0) {
      setFormError("Harga jual harus berupa angka bulat");
      return;
    }

    let originalPrice: number | null = null;
    if (form.originalPrice.trim() !== "") {
      originalPrice = Number(form.originalPrice);
      if (!Number.isInteger(originalPrice) || originalPrice <= price) {
        setFormError("Harga coret harus lebih besar dari harga jual");
        return;
      }
    }

    let stock: number | null = null;
    if (form.stock.trim() !== "") {
      stock = Number(form.stock);
      if (!Number.isInteger(stock) || stock < 0) {
        setFormError("Stok harus berupa angka bulat 0 atau lebih");
        return;
      }
    }

    const payload = {
      name,
      description: form.description.trim(),
      price,
      original_price: originalPrice,
      image_url: form.imageUrl || null,
      category: form.category,
      tag: form.tag.trim() || null,
      prep_time: form.prepTime.trim() || null,
      stock,
      is_popular: form.isPopular,
      is_available: form.isAvailable,
    };

    setSaving(true);
    const supabase = getSupabase();

    const { error } = isNew
      ? await supabase
          .from("menu_items")
          .insert({ id: generateId(name, existingIds), sort_order: nextSort, ...payload })
      : await supabase.from("menu_items").update(payload).eq("id", row.id);

    setSaving(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isNew ? "Tambah Menu Baru" : "Ubah Menu"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {isNew ? "Menu baru langsung muncul di halaman pelanggan." : `Kode: KOD-${row.id.toUpperCase()}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 p-3">
          <Thumb key={form.imageUrl} src={form.imageUrl || null} alt={form.name || "Foto menu"} size={80} />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">Foto Menu</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Foto otomatis dikecilkan (lebar 800 px, WebP) supaya hemat penyimpanan.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200">
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Mengunggah..." : "Pilih Foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    void handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => set("imageUrl", "")}
                  className="text-xs text-slate-400 transition hover:text-red-500"
                >
                  Hapus foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nama Menu">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Contoh: Nasi Goreng Kampung Spesial"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Kategori">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
              className={inputCls}
            >
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Label / Tag" hint="Opsional, contoh: Bestseller, Chef Pick">
            <input value={form.tag} onChange={(e) => set("tag", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Harga Jual (Rp)">
            <input
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              inputMode="numeric"
              placeholder="38000"
              className={inputCls}
            />
          </Field>

          <Field label="Harga Coret (Rp)" hint="Opsional, harus lebih besar dari harga jual">
            <input
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              inputMode="numeric"
              placeholder="45000"
              className={inputCls}
            />
          </Field>

          <Field label="Stok (porsi)" hint="Kosongkan jika tak terbatas. Stok 0 = Habis.">
            <input
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              inputMode="numeric"
              placeholder="Tak terbatas"
              className={inputCls}
            />
          </Field>

          <Field label="Waktu Penyajian" hint="Opsional, contoh: ~15 mnt">
            <input
              value={form.prepTime}
              onChange={(e) => set("prepTime", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Deskripsi">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>

          <Switch label="Tampilkan ke pelanggan" checked={form.isAvailable} onChange={(v) => set("isAvailable", v)} />
          <Switch label="Menu populer" checked={form.isPopular} onChange={(v) => set("isPopular", v)} />
        </div>

        {formError && (
          <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="rounded-xl bg-[#054B35] px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : isNew ? "Tambah Menu" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [status, setStatus] = useState<"all" | StatusKey>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<{ row: MenuRow | null } | null>(null);
  const [deleting, setDeleting] = useState<MenuRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: queryError } = await getSupabase()
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
    } else {
      setRows((data ?? []) as MenuRow[]);
      setError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery =
        !q || r.name.toLowerCase().includes(q) || `kod-${r.id}`.toLowerCase().includes(q);
      const matchesCategory = category === "all" || r.category === category;
      const matchesStatus = status === "all" || statusOf(r) === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [rows, query, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = rows.filter((r) => r.is_available).length;
  const categoryCount = new Set(rows.map((r) => r.category)).size;
  const nextSort = rows.reduce((max, r) => Math.max(max, r.sort_order), 0) + 1;

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setPage(1);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);

    const { error: deleteError } = await getSupabase()
      .from("menu_items")
      .delete()
      .eq("id", deleting.id);

    setDeleteBusy(false);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setRows((prev) => prev.filter((r) => r.id !== deleting.id));
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Katalog Kuliner</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Kelola Menu Restoran
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {activeCount} Item Menu Aktif · {categoryCount} Kategori
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ row: null })}
          className="flex items-center gap-2 rounded-xl bg-[#054B35] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-900 active:scale-[0.98]"
        >
          <Plus size={16} />
          Tambah Menu Baru
        </button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="shrink-0 text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama menu, kode..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054B35] focus:outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as "all" | Category);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#054B35] focus:outline-none"
        >
          <option value="all">Semua Kategori</option>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | StatusKey);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#054B35] focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="tersedia">Tersedia</option>
          <option value="habis">Habis</option>
          <option value="nonaktif">Nonaktif</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Menu &amp; Foto</th>
                <th className="px-4 py-4 font-semibold">Kategori</th>
                <th className="px-4 py-4 font-semibold">Harga Jual</th>
                <th className="px-4 py-4 font-semibold">Stok / Porsi</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Memuat menu...
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    {rows.length === 0
                      ? "Belum ada menu. Klik Tambah Menu Baru untuk memulai."
                      : "Tidak ada menu yang sesuai filter."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const st = statusOf(row);
                  const dim = st !== "tersedia";

                  return (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-6 py-3">
                        <div className={`flex items-center gap-3 ${dim ? "opacity-60" : ""}`}>
                          <Thumb key={row.image_url ?? "none"} src={row.image_url} alt={row.name} size={56} />
                          <div className="min-w-0">
                            <p className="truncate text-[15px] text-slate-900">{row.name}</p>
                            <p className="text-xs text-slate-400">KOD-{row.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] uppercase tracking-wide text-slate-600">
                          {CATEGORY_LABEL[row.category]}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-[15px] text-slate-800 ${dim ? "opacity-60" : ""}`}>
                        {rupiah(row.price)}
                      </td>
                      <td className="px-4 py-3 text-[15px]">
                        {row.stock === null ? (
                          <span className="text-slate-700">Tak Terbatas</span>
                        ) : row.stock <= 0 ? (
                          <span className="text-red-500">{row.stock} porsi</span>
                        ) : (
                          <span className="text-slate-700">{row.stock} porsi</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={st} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button
                            type="button"
                            title="Ubah"
                            onClick={() => setEditing({ row })}
                            className="transition hover:text-[#054B35]"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => setDeleting(row)}
                            className="transition hover:text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Menampilkan <span className="text-slate-800">{pageRows.length}</span> dari{" "}
          <span className="text-slate-800">{filtered.length}</span> total menu
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm transition ${
                n === currentPage
                  ? "bg-[#054B35] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {editing && (
        <MenuFormModal
          row={editing.row}
          existingIds={rows.map((r) => r.id)}
          nextSort={nextSort}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-slate-900">Hapus menu ini?</h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="text-slate-900">{deleting.name}</span> akan dihapus dari daftar menu.
              Riwayat pesanan yang sudah ada tetap tersimpan. Kalau hanya ingin menyembunyikannya
              sementara, pilih Ubah lalu matikan &quot;Tampilkan ke pelanggan&quot;.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteBusy}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteBusy ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}