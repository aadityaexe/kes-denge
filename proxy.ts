import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  decrypt,
  encrypt,
  getSessionCookieName,
  SESSION_DURATION_SECONDS,
  setSessionCookie,
} from "@/lib/auth";

function isSameOriginMutation(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "none") {
    return false;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const expectedOrigin = request.nextUrl.origin;

  if (origin) {
    if (origin === expectedOrigin) return true;
    // Also allow matching host header when behind a reverse proxy
    if (host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host === host) return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (refUrl.origin === expectedOrigin) return true;
      if (host && refUrl.host === host) return true;
      return false;
    } catch {
      return false;
    }
  }

  // Allow non-browser clients (e.g. curl/server-to-server) ONLY if Sec-Fetch-Site wasn't cross-site
  // and no Origin/Referer was sent; browser cross-origin POSTs always send Origin.
  return true;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  // CSRF / Origin check on all mutating /api/* requests
  if (
    path.startsWith("/api/") &&
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
  ) {
    if (!isSameOriginMutation(request)) {
      return NextResponse.json(
        { error: "Forbidden: Cross-origin state-changing request rejected" },
        { status: 403 }
      );
    }
  }

  const cookieName = getSessionCookieName();
  const sessionCookie =
    request.cookies.get(cookieName)?.value ??
    request.cookies.get("admin_session")?.value;

  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
  const isAdminApiRoute = path.startsWith("/api/admin");

  let session = null;
  if (isAdminRoute || isAdminApiRoute || path === "/admin/login") {
    session = await decrypt(sessionCookie);
  }

  if (isAdminRoute || isAdminApiRoute) {
    if (!session) {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (path === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Nonce-based strict CSP for /admin/* (always dynamic), static-friendly CSP for public pages
  const isAdminPage = path.startsWith("/admin");
  const nonce = isAdminPage
    ? Buffer.from(globalThis.crypto.randomUUID()).toString("base64")
    : "";

  const requestHeaders = new Headers(request.headers);
  if (nonce) {
    requestHeaders.set("x-nonce", nonce);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Sliding session renewal: re-issue cookie if < 50% lifetime remains
  if (session && typeof session.exp === "number") {
    const nowSec = Math.floor(Date.now() / 1000);
    const remainingSec = session.exp - nowSec;
    if (remainingSec > 0 && remainingSec < SESSION_DURATION_SECONDS / 2) {
      try {
        const refreshed = await encrypt({
          userId: session.userId,
          role: session.role,
          email: session.email,
          name: session.name,
          tokenVersion: session.tokenVersion ?? 0,
        });
        setSessionCookie(response, refreshed);
      } catch {
        // Non-fatal: existing token is still valid
      }
    }
  }

  // Security headers
  const isDev = process.env.NODE_ENV !== "production";

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");

  if (
    path.startsWith("/admin") ||
    path.startsWith("/api/admin") ||
    path.startsWith("/api/auth")
  ) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  let scriptSrc: string;
  if (isAdminPage && !isDev) {
    scriptSrc = `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  } else if (isDev) {
    scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  } else {
    scriptSrc = "script-src 'self' 'unsafe-inline'";
  }

  const csp = [
    "default-src 'self'",
    scriptSrc,
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
    ...(!isDev ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)",
  ],
};
