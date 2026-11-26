# Cleanup Report

## Phase 1 — Junk Files
| Item | Category | Evidence |
|---|---|---|
| `audit.json` | Junk | Generated audit output, not source; 0 references |
| `audit_results.json` | Junk | Generated audit output, not source; 0 references |
| `eslint-report.json` | Junk | Generated lint output (~884 KB), not source; 0 references |
| `scratch/fix_brand.py` | Junk | One-off local script with hard-coded Windows path; 0 references |
| `scripts/seed-team.ts` (`scripts/archive/seed-team.ts`) | Junk | One-time DB seed script; 0 references in `package.json`, CI, or source |
| `scripts/fix-phone.ts` (`scripts/archive/fix-phone.ts`) | Junk | One-off DB fix script; 0 references in `package.json`, CI, or source |

## Phase 2 — Unused Source Files, Duplicates & Exports
| Item | Category | Evidence |
|---|---|---|
| `components/ui/Card.tsx` | Dead file | `knip` + `git grep` 0 importers |
| `components/ui/CustomCursor.tsx` | Dead file | `knip` + `git grep` 0 importers |
| `components/layout/SmoothScrollProvider.tsx` | Dead file | Duplicate of `components/providers/SmoothScroll.tsx`; `knip` + `git grep` 0 importers |
| `hooks/useLenis.ts` | Dead file | Only imported by dead `SmoothScrollProvider.tsx`; `knip` + `git grep` |
| `hooks/useMouseParallax.ts` | Dead file | `knip` + `git grep` 0 importers |
| `lib/seo.ts` | Dead file | `knip` + `git grep` 0 importers |
| `lib/revalidate.ts` | Dead file | `knip` + `git grep` 0 importers |
| `app/(site)/opengraph-image.tsx` | Duplicate route | Re-exported `@/app/opengraph-image`, creating duplicate `/opengraph-image-12o0cb`; root `app/opengraph-image.tsx` serves `/opengraph-image` |
| `app/(site)/twitter-image.tsx` | Duplicate route | Re-exported `@/app/twitter-image`, creating duplicate `/twitter-image-12o0cb`; root `app/twitter-image.tsx` serves `/twitter-image` |
| `public/logo/logo.svg` | Dead asset | 590,570 bytes; `git grep` 0 references anywhere |
| `public/logo/logo.png` | Asset optimization | Optimized from 442,804 bytes to 19,026 bytes via `sharp` |
| `lib/types.ts` (10 unused types) | Dead code | `ServiceWhyChooseUsItem`, `TestimonialEntry`, `ContactStatus`, `ContactSubmission`, `PricingFeature`, `PricingTier`, `FAQItem`, `ProcessStep`, `Technology`, `StatItem` — `knip` + `git grep` 0 references |
| `useDirectionalEntrance`, `scaleIn`, `cn`, `formatStat`, `clamp` | Dead exports | `knip` + `git grep` 0 callers |

## Phase 3 — Dependencies
| Item | Category | Evidence |
|---|---|---|
| `@gsap/react` | Dependency | `knip` + `git grep` 0 imports |
| `clsx` | Dependency | `git grep` 0 imports after removing unused `cn()` |
| `.npmrc` (`legacy-peer-deps=true`) | Config | Removed; `npm uninstall`/`dedupe`/`prune` and build succeed without it |
