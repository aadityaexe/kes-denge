import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
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

  // Add security headers to ALL responses (was previously admin-only)
  const response = NextResponse.next();

  // ---- Existing headers (unchanged) ----
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // ---- HSTS ----
  // 1-year max-age with includeSubDomains. Safe given mark2.in → www.mark2.in
  // redirect is already configured as permanent in next.config.ts.
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // ---- Content Security Policy ----
  // Image hosts match next.config.ts remotePatterns (Cloudinary, Unsplash, placehold.co).
  // 'unsafe-inline' for script-src is required for Next.js hydration chunks and
  // JSON-LD <script> tags. A nonce-based approach would require streaming changes
  // and is deferred — see TODO below.
  // 'unsafe-inline' for style-src is required for Tailwind/CSS-in-JS.
  // frame-ancestors 'none' reinforces X-Frame-Options: DENY.
  //
  // TODO(security): Migrate script-src to nonce-based CSP (Next.js App Router
  // supports per-request nonces via generateNonce()). This eliminates the blanket
  // 'unsafe-inline' allowance. Blocked by: hydration chunk compatibility testing.
  // Track at: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://placehold.co",
    "media-src 'self' blob: https://res.cloudinary.com",
    "connect-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Apply to all routes except Next.js internals and static assets.
  // Auth gating is handled inside the middleware function above.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)",
  ],
};
