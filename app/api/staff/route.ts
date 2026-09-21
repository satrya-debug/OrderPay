import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ROLES = ["kasir", "koki", "admin"] as const;
type Role = (typeof ROLES)[number];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SECRET_KEY belum diisi di .env.local (lalu restart npm run dev).");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function requireAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const admin = adminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin" || !profile.is_active) return null;
  return { admin, userId: data.user.id };
}

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const ctx = await requireAdmin(request);
    if (!ctx) return fail("Hanya admin yang boleh menambah staf.", 403);

    const body = (await request.json().catch(() => null)) as {
      staffId?: unknown;
      fullName?: unknown;
      role?: unknown;
      pin?: unknown;
    } | null;

    const staffId = typeof body?.staffId === "string" ? body.staffId.trim().toUpperCase() : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const pin = typeof body?.pin === "string" ? body.pin : "";

    if (!/^[A-Z0-9-]{3,20}$/.test(staffId)) {
      return fail("ID staf 3-20 karakter: huruf, angka, atau tanda hubung.", 400);
    }
    if (fullName.length < 2 || fullName.length > 60) {
      return fail("Nama harus 2-60 karakter.", 400);
    }
    if (!isRole(body?.role)) {
      return fail("Peran tidak valid.", 400);
    }
    if (pin.length < 6 || pin.length > 72) {
      return fail("PIN minimal 6 karakter.", 400);
    }

    const { admin } = ctx;

    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("staff_id", staffId)
      .maybeSingle();
    if (existing) return fail(`ID ${staffId} sudah dipakai.`, 409);

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: `${staffId.toLowerCase()}@orderpay.local`,
      password: pin,
      email_confirm: true,
    });

    if (createError || !created.user) {
      const already = /already|exists|registered/i.test(createError?.message ?? "");
      return fail(
        already ? `ID ${staffId} sudah terdaftar.` : (createError?.message ?? "Gagal membuat akun."),
        already ? 409 : 400
      );
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: created.user.id,
      staff_id: staffId,
      full_name: fullName,
      role: body.role,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return fail(profileError.message, 500);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Terjadi kesalahan pada server.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const ctx = await requireAdmin(request);
    if (!ctx) return fail("Hanya admin yang boleh mengubah staf.", 403);

    const body = (await request.json().catch(() => null)) as {
      id?: unknown;
      fullName?: unknown;
      role?: unknown;
      isActive?: unknown;
      pin?: unknown;
    } | null;

    const id = typeof body?.id === "string" ? body.id : "";
    if (!id) return fail("ID akun tidak valid.", 400);

    const { admin, userId } = ctx;
    const update: { full_name?: string; role?: Role; is_active?: boolean } = {};

    if (body?.fullName !== undefined) {
      const name = typeof body.fullName === "string" ? body.fullName.trim() : "";
      if (name.length < 2 || name.length > 60) return fail("Nama harus 2-60 karakter.", 400);
      update.full_name = name;
    }

    if (body?.role !== undefined) {
      if (!isRole(body.role)) return fail("Peran tidak valid.", 400);
      if (id === userId && body.role !== "admin") {
        return fail("Anda tidak bisa menurunkan peran akun Anda sendiri.", 400);
      }
      update.role = body.role;
    }

    if (body?.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") return fail("Status tidak valid.", 400);
      if (id === userId && body.isActive === false) {
        return fail("Anda tidak bisa menonaktifkan akun Anda sendiri.", 400);
      }
      update.is_active = body.isActive;
    }

    let newPin: string | null = null;
    if (body?.pin !== undefined) {
      newPin = typeof body.pin === "string" ? body.pin : "";
      if (newPin.length < 6 || newPin.length > 72) return fail("PIN minimal 6 karakter.", 400);
    }

    if (Object.keys(update).length === 0 && newPin === null) {
      return fail("Tidak ada perubahan.", 400);
    }

    if (Object.keys(update).length > 0) {
      const { error } = await admin.from("profiles").update(update).eq("id", id);
      if (error) return fail(error.message, 500);
    }

    if (newPin !== null) {
      const { error } = await admin.auth.admin.updateUserById(id, { password: newPin });
      if (error) return fail(error.message, 500);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Terjadi kesalahan pada server.", 500);
  }
}