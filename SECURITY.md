# Security Architecture & Operations (`MARK 2`)

## Threat Model & Controls

1. **Authentication & Sessions (`lib/auth.ts`, `lib/auth-guard.ts`)**
   - Admin sessions use HS256 JWTs (`jose`) with `issuer: "mark2.in"`, `audience: "mark2-admin"`, unique `jti`, and a `12h` expiration with sliding renewal in `proxy.ts` when `< 50%` lifetime remains.
   - Cookies use `HttpOnly`, `SameSite=Lax`, `Secure` (production), and the `__Host-admin_session` prefix in production.
   - `tokenVersion` on `User` enables instant revocation across all instances (verified with a 30s TTL cache).
   - Role-based access control (`requireRole("admin")`) restricts settings, lead bulk-deletion, media deletion, and category deletion to `admin` users (`editor` users retain content CRUD only).
   - Logout is `POST`-only (`/api/auth/logout`) to prevent CSRF logout attacks.

2. **CSRF Protection (`proxy.ts`)**
   - All mutating `/api/*` requests (`POST`, `PUT`, `PATCH`, `DELETE`) verify `Sec-Fetch-Site` and `Origin`/`Referer` against the request host/origin, returning `403` on cross-origin requests.

3. **XSS & Injection Defense**
   - Blog HTML content is sanitized on write and on render via `sanitize-html` (`lib/blog-sanitize.ts`) with a strict tag/attribute allowlist and `rel="noopener noreferrer"`.
   - All JSON-LD `<script type="application/ld+json">` blocks use `safeJsonLd()` (`lib/json-ld.tsx`) to escape `<`, `>`, `&`, U+2028, and U+2029.
   - All URL fields in admin settings are validated with Zod (`lib/schemas.ts`) to allow only relative `/...` paths or `http(s):` URLs.
   - Regex queries escape user input via `escapeRegex()`.

4. **Content Security Policy (CSP) Trade-off**
   - `/admin/*` routes (always dynamic) receive a per-request cryptographic `nonce` (`script-src 'self' 'nonce-...' 'strict-dynamic'`).
   - Public marketing pages use `revalidate = 3600` (ISR / static prerendering). Per Next.js 16 architecture, per-request nonces force dynamic rendering on every request, which would disable static ISR. Therefore public pages retain `'unsafe-inline'` for Next.js hydration chunks while all user-controlled HTML/JSON-LD sinks are sanitized.

5. **Rate Limiting (`lib/rate-limit.ts`)**
   - Supports Upstash Redis (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, sliding window) with automatic fallback to MongoDB (`RateLimit` TTL collection with `E11000` race retry).
   - Sensitive endpoints (`login`, `contact`, `upload`) fail closed when the rate-limit store is unavailable.

6. **File Uploads (`app/api/admin/upload/route.ts`)**
   - Enforces 10 MB max size, extension + MIME allowlist (SVG & executables blocked), magic-byte signature verification (including `ftyp` brand disambiguation between AVIF and MP4), derived `mimeType` from magic bytes, and folder name allowlisting.

## Rotating `JWT_SECRET`
1. Generate a new secret (`>= 32` chars): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update `JWT_SECRET` in Vercel Environment Variables and redeploy.
3. All existing admin sessions are immediately invalidated and admins will re-authenticate cleanly.
