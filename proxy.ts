import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin and /api/admin routes (except login page)
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
  const isAdminApiRoute = path.startsWith("/api/admin");

  if (isAdminRoute || isAdminApiRoute) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const session = await decrypt(sessionCookie);

    if (!session) {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Prevent logged-in users from accessing the login page
  if (path === "/admin/login") {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const session = await decrypt(sessionCookie);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
