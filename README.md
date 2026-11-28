# MARK2 (`mark2.in`)

Marketing site, product showcase, and admin CMS for **MARK2**.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, GSAP, Framer Motion, Lenis, Three.js (`@react-three/fiber` / `drei`)
- **Database & Auth:** MongoDB + Mongoose, `jose` JWT sessions, `bcryptjs`
- **Media:** Cloudinary (with local `/public/uploads` dev fallback)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical URL for metadata, sitemaps, and OG images |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Admin session signing secret (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Prod | Media uploads (or `CLOUDINARY_URL`) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | No | Distributed rate limiting (falls back to MongoDB) |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL` | No | Contact form email notifications |
| `TURNSTILE_SECRET_KEY`, `TRUSTED_PROXY` | No | Bot protection and proxy IP trust |

## Scripts

```bash
npm run dev        # Start local dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type check
npm test           # Run Vitest unit tests
```

## Creating the First Admin User

```bash
ADMIN_EMAIL=admin@mark2.in ADMIN_PASSWORD=<strong-password> npx tsx scripts/create-admin.ts
```

## Deployment

Deploy on Vercel (or any Node `>=20.9` host). Ensure `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, and Cloudinary credentials are configured in the environment before building.
