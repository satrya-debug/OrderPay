import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Cek user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belum login
  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Ambil role dari profiles
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  // Profile tidak ditemukan
  if (error || !profile) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Akun tidak aktif
  if (!profile.is_active) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const role = profile.role;
  const pathname = request.nextUrl.pathname;

  // Admin hanya boleh masuk /admin
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return redirectByRole(role, request);
    }
  }

  // Kasir hanya boleh masuk /kasir
  if (pathname.startsWith("/kasir")) {
    if (role !== "kasir") {
      return redirectByRole(role, request);
    }
  }

  // Koki hanya boleh masuk /koki
  if (pathname.startsWith("/koki")) {
    if (role !== "koki") {
      return redirectByRole(role, request);
    }
  }

  return response;
}

function redirectByRole(
  role: string,
  request: NextRequest
) {
  if (role === "admin") {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  if (role === "kasir") {
    return NextResponse.redirect(
      new URL("/kasir", request.url)
    );
  }

  if (role === "koki") {
    return NextResponse.redirect(
      new URL("/koki", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/login", request.url)
  );
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/kasir/:path*",
    "/koki/:path*",
  ],
};