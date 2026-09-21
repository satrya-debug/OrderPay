"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  Pencil,
  KeyRound,
  Power,
  X,
  Shuffle,
  Briefcase,
  ChefHat,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

type Role = "kasir" | "koki" | "admin";

interface StaffRow {
  id: string;
  staff_id: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

const ROLE_LABEL: Record<Role, string> = {
  kasir: "Kasir",
  koki: "Koki",
  admin: "Admin",
};

const ROLE_CLS: Record<Role, string> = {
  kasir: "bg-sky-50 text-sky-700",
  koki: "bg-orange-50 text-orange-700",
  admin: "bg-purple-50 text-purple-700",
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054B35] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400";

async function callStaffApi(method: "POST" | "PATCH", body: Record<string, unknown>) {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sesi login habis. Silakan login ulang.");

  const res = await fetch("/api/staff", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(json.error ?? "Permintaan gagal.");
}

function randomPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
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

function StaffFormModal({
  row,
  myId,
  onClose,
  onSaved,
}: {
  row: StaffRow | null;
  myId: string | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const isNew = row === null;
  const isSelf = row !== null && row.id === myId;

  const [staffId, setStaffId] = useState("");
  const [fullName, setFullName] = useState(row?.full_name ?? "");
  const [role, setRole] = useState<Role>(row?.role ?? "kasir");
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSave() {
    setFormError("");

    if (fullName.trim().length < 2) {
      setFormError("Nama minimal 2 karakter.");
      return;
    }

    if (isNew) {
      if (!/^[A-Za-z0-9-]{3,20}$/.test(staffId.trim())) {
        setFormError("ID staf 3-20 karakter: huruf, angka, atau tanda hubung.");
        return;
      }
      if (pin.length < 6) {
        setFormError("PIN minimal 6 karakter.");
        return;
      }
    }

    setSaving(true);
    try {
      if (isNew) {
        await callStaffApi("POST", { staffId: staffId.trim(), fullName: fullName.trim(), role, pin });
        onSaved(`Akun ${staffId.trim().toUpperCase()} berhasil dibuat. Berikan ID dan PIN-nya ke staf.`);
      } else {
        await callStaffApi("PATCH", { id: row.id, fullName: fullName.trim(), role });
        onSaved(`Data ${row.staff_id} berhasil diperbarui.`);
      }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan.");
      setSaving(false);
    }
  }

  return (
    <ModalShell
      title={isNew ? "Tambah Staf Baru" : "Ubah Data Staf"}
      subtitle={isNew ? "Akun langsung bisa dipakai login." : `ID staf: ${row.staff_id}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        {isNew && (
          <Field label="ID Staf" hint="Contoh: KSR-015. Dipakai untuk login dan tidak bisa diubah.">
            <input
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="KSR-015"
              autoComplete="off"
              className={`${inputCls} uppercase`}
            />
          </Field>
        )}

        <Field label="Nama Lengkap">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className={inputCls}
          />
        </Field>

        <Field label="Peran" hint={isSelf ? "Peran akun Anda sendiri tidak bisa diubah." : undefined}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            disabled={isSelf}
            className={inputCls}
          >
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>

        {isNew && (
          <Field label="PIN Awal" hint="Minimal 6 karakter. Staf bisa meminta admin mengganti kapan saja.">
            <div className="flex gap-2">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="123456"
                autoComplete="off"
                className={`${inputCls} font-mono`}
              />
              <button
                type="button"
                onClick={() => setPin(randomPin())}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-50"
              >
                <Shuffle size={13} />
                Acak
              </button>
            </div>
          </Field>
        )}
      </div>

      {formError && <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</div>}

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
          disabled={saving}
          className="rounded-xl bg-[#054B35] px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : isNew ? "Buat Akun" : "Simpan Perubahan"}
        </button>
      </div>
    </ModalShell>
  );
}

function ResetPinModal({
  row,
  onClose,
  onDone,
}: {
  row: StaffRow;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSave() {
    if (pin.length < 6) {
      setFormError("PIN minimal 6 karakter.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await callStaffApi("PATCH", { id: row.id, pin });
      onDone(`PIN ${row.staff_id} berhasil diganti. Berikan PIN barunya ke ${row.full_name}.`);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal mengganti PIN.");
      setSaving(false);
    }
  }

  return (
    <ModalShell title="Reset PIN" subtitle={`${row.full_name} (${row.staff_id})`} onClose={onClose}>
      <Field label="PIN Baru" hint="Minimal 6 karakter. PIN lama langsung tidak berlaku.">
        <div className="flex gap-2">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="123456"
            autoComplete="off"
            className={`${inputCls} font-mono`}
          />
          <button
            type="button"
            onClick={() => setPin(randomPin())}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs text-slate-600 transition hover:bg-slate-50"
          >
            <Shuffle size={13} />
            Acak
          </button>
        </div>
      </Field>

      {formError && <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{formError}</div>}

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
          disabled={saving}
          className="rounded-xl bg-[#054B35] px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Ganti PIN"}
        </button>
      </div>
    </ModalShell>
  );
}

export default function AdminPenggunaPage() {
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [myId, setMyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "aktif" | "nonaktif">("all");
  const [editing, setEditing] = useState<{ row: StaffRow | null } | null>(null);
  const [resetting, setResetting] = useState<StaffRow | null>(null);
  const [toggling, setToggling] = useState<StaffRow | null>(null);
  const [toggleBusy, setToggleBusy] = useState(false);

  const load = useCallback(async () => {
    const supabase = getSupabase();

    const { data: sessionData } = await supabase.auth.getSession();
    setMyId(sessionData.session?.user.id ?? null);

    const { data, error: queryError } = await supabase
      .from("profiles")
      .select("id, staff_id, full_name, role, is_active, created_at")
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
    } else {
      setRows((data ?? []) as StaffRow[]);
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
        !q || r.full_name.toLowerCase().includes(q) || r.staff_id.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || r.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "aktif" ? r.is_active : !r.is_active);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [rows, query, roleFilter, statusFilter]);

  const activeRows = rows.filter((r) => r.is_active);
  const countByRole = (role: Role) => activeRows.filter((r) => r.role === role).length;

  function resetFilters() {
    setQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  function handleSaved(message: string) {
    setEditing(null);
    setResetting(null);
    setNotice(message);
    setError("");
    void load();
  }

  async function confirmToggle() {
    if (!toggling) return;
    setToggleBusy(true);
    try {
      await callStaffApi("PATCH", { id: toggling.id, isActive: !toggling.is_active });
      setNotice(
        toggling.is_active
          ? `${toggling.staff_id} dinonaktifkan dan tidak bisa login lagi.`
          : `${toggling.staff_id} diaktifkan kembali.`
      );
      setError("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengubah status.");
    }
    setToggleBusy(false);
    setToggling(null);
  }

  const summary = [
    { label: "Total Staf Aktif", value: activeRows.length, icon: Users, cls: "bg-slate-100 text-slate-600" },
    { label: "Kasir", value: countByRole("kasir"), icon: Briefcase, cls: "bg-sky-50 text-sky-600" },
    { label: "Koki", value: countByRole("koki"), icon: ChefHat, cls: "bg-orange-50 text-orange-600" },
    { label: "Admin", value: countByRole("admin"), icon: ShieldCheck, cls: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Akses Karyawan</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Kelola Pengguna / Staf</h1>
          <p className="mt-1 text-sm text-slate-500">
            {activeRows.length} Staf Aktif · {rows.length - activeRows.length} Nonaktif
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ row: null })}
          className="flex items-center gap-2 rounded-xl bg-[#054B35] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-900 active:scale-[0.98]"
        >
          <Plus size={16} />
          Tambah Staf Baru
        </button>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} className="shrink-0 text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="shrink-0 text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className="mt-1 text-2xl text-slate-900">{s.value}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.cls}`}>
              <s.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau ID staf..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054B35] focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | Role)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#054B35] focus:outline-none"
        >
          <option value="all">Semua Peran</option>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "aktif" | "nonaktif")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#054B35] focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="aktif">Aktif</option>
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
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Staf</th>
                <th className="px-4 py-4 font-semibold">Peran</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                    Memuat data staf...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                    {rows.length === 0 ? "Belum ada staf." : "Tidak ada staf yang sesuai filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const isSelf = row.id === myId;
                  return (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-6 py-3">
                        <div className={`flex items-center gap-3 ${row.is_active ? "" : "opacity-60"}`}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#054B35]/10 text-sm font-medium text-[#054B35]">
                            {initials(row.full_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] text-slate-900">
                              {row.full_name}
                              {isSelf && (
                                <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400">{row.staff_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2.5 py-1 text-[11px] uppercase tracking-wide ${ROLE_CLS[row.role]}`}>
                          {ROLE_LABEL[row.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${
                            row.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {row.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button
                            type="button"
                            title="Ubah data"
                            onClick={() => setEditing({ row })}
                            className="transition hover:text-[#054B35]"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            type="button"
                            title="Reset PIN"
                            onClick={() => setResetting(row)}
                            className="transition hover:text-[#054B35]"
                          >
                            <KeyRound size={17} />
                          </button>
                          <button
                            type="button"
                            title={row.is_active ? "Nonaktifkan" : "Aktifkan kembali"}
                            disabled={isSelf}
                            onClick={() => setToggling(row)}
                            className={`transition disabled:cursor-not-allowed disabled:opacity-30 ${
                              row.is_active ? "hover:text-red-500" : "hover:text-emerald-600"
                            }`}
                          >
                            <Power size={17} />
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

      <p className="text-sm text-slate-500">
        Menampilkan <span className="text-slate-800">{filtered.length}</span> dari{" "}
        <span className="text-slate-800">{rows.length}</span> total akun staf
      </p>

      {editing && (
        <StaffFormModal
          key={editing.row?.id ?? "baru"}
          row={editing.row}
          myId={myId}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {resetting && (
        <ResetPinModal
          key={resetting.id}
          row={resetting}
          onClose={() => setResetting(null)}
          onDone={handleSaved}
        />
      )}

      {toggling && (
        <ModalShell
          title={toggling.is_active ? "Nonaktifkan staf ini?" : "Aktifkan kembali staf ini?"}
          onClose={() => setToggling(null)}
        >
          <p className="text-sm text-slate-600">
            <span className="text-slate-900">
              {toggling.full_name} ({toggling.staff_id})
            </span>{" "}
            {toggling.is_active
              ? "tidak akan bisa login lagi. Riwayat transaksi yang pernah ia proses tetap tersimpan."
              : "akan bisa login lagi dengan ID dan PIN-nya."}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setToggling(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmToggle}
              disabled={toggleBusy}
              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${
                toggling.is_active ? "bg-red-600 hover:bg-red-700" : "bg-[#054B35] hover:bg-emerald-900"
              }`}
            >
              {toggleBusy ? "Memproses..." : toggling.is_active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}