"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Eye, EyeOff, ChefHat, ShieldQuestion, LogIn, KeyRound, XCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { RESTAURANT_NAME, APP_NAME } from "@/lib/constants";
import { StaffRole } from "@/lib/types";

const ROLES: { id: StaffRole; label: string; icon: typeof Briefcase; placeholder: string }[] = [
  { id: "kasir", label: "Kasir", icon: Briefcase, placeholder: "Contoh: KSR-014" },
  { id: "koki", label: "Koki", icon: ChefHat, placeholder: "Contoh: KOK-021" },
  { id: "admin", label: "Admin", icon: ShieldQuestion, placeholder: "Contoh: ADM-001" },
];

const ROLE_REDIRECT: Record<StaffRole, string> = {
  kasir: "/kasir",
  koki: "/koki",
  admin: "/admin/menu",
};

const ACCOUNTS: { role: StaffRole; id: string; pin: string }[] = [
  { role: "kasir", id: "KSR-014", pin: "142024" },
  { role: "koki", id: "KOK-021", pin: "210521" },
  { role: "admin", id: "ADM-001", pin: "900100" },
];

const SHOW_DEMO_HINT = true;

export default function LoginKaryawanPage() {
  const router = useRouter();
  const [role, setRole] = useState<StaffRole>("kasir");
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const currentRole = ROLES.find((r) => r.id === role)!;
  const demoAccount = ACCOUNTS.find((a) => a.role === role);

  function handleSelectRole(next: StaffRole) {
    setRole(next);
    setStaffId("");
    setPin("");
    setShowPin(false);
    setError("");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!staffId.trim() || !pin) {
      setError("Masukkan ID karyawan dan PIN.");
      return;
    }

    const account = ACCOUNTS.find(
      (a) =>
        a.role === role &&
        a.id.toLowerCase() === staffId.trim().toLowerCase() &&
        a.pin === pin
    );

    if (!account) {
      setError(`ID atau PIN salah untuk peran ${currentRole.label}.`);
      return;
    }

    router.push(ROLE_REDIRECT[role]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f2]">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <div className="leading-tight">
            <p className="text-[10px] tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
            <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              {APP_NAME} POS System
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                Internal Station
              </span>
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
        </span>
      </header>

      <div className="flex flex-1 items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="flex flex-col items-center text-center">
            <Logo size={56} />
            <p className="mt-3 text-xs tracking-wide text-neutral-500">{RESTAURANT_NAME}</p>
            <h1 className="text-2xl font-semibold text-brand-800">Login Karyawan</h1>
            <p className="mt-1 text-xs text-neutral-500">
              Pilih peran dan masukkan kredensial staf untuk masuk.
            </p>
          </div>

          <div className="mt-5 flex rounded-xl border border-neutral-200 bg-neutral-50 p-1">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => handleSelectRole(r.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
                  role === r.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400"
                }`}
              >
                <r.icon size={15} />
                {r.label}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-xs font-medium text-neutral-600">ID Karyawan / Staf</label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2.5 focus-within:border-brand-700">
            <Briefcase size={15} className="text-neutral-400" />
            <input
              value={staffId}
              onChange={(e) => {
                setStaffId(e.target.value);
                setError("");
              }}
              placeholder={currentRole.placeholder}
              autoComplete="off"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-600">PIN / Kata Sandi</label>
            <button
              type="button"
              onClick={() => {
                setPin("");
                setError("");
              }}
              className="text-xs text-neutral-400"
            >
              Bersihkan
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2.5 focus-within:border-brand-700">
            <KeyRound size={15} className="text-neutral-400" />
            <input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              type={showPin ? "text" : "password"}
              placeholder="Masukkan PIN"
              autoComplete="off"
              className="w-full bg-transparent text-sm outline-none"
            />
            <button type="button" onClick={() => setShowPin((s) => !s)} className="text-neutral-400">
              {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
              <XCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
          >
            <LogIn size={16} />
            Masuk ke Dashboard {currentRole.label}
          </button>

          {SHOW_DEMO_HINT && demoAccount && (
            <p className="mt-4 text-center text-[11px] text-neutral-400">
              Akun demo {currentRole.label}:{" "}
              <span className="font-mono text-neutral-500">{demoAccount.id}</span> /{" "}
              <span className="font-mono text-neutral-500">{demoAccount.pin}</span>
            </p>
          )}
        </form>
      </div>

      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-neutral-500">
          Kendala akses? Hubungi <span className="font-medium text-neutral-700 underline">Bantuan Teknis IT</span>
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
          <span>© 2025 {APP_NAME} POS · {RESTAURANT_NAME}</span>
          <span>🔒 Koneksi Terenkripsi TLS 1.3</span>
        </div>
      </footer>
    </div>
  );
}