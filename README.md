# solaris-www

Public marketing site for SOLARIS — the industrial-solar intelligence platform.

This repo is intentionally separate from `solaris-fe` (the product). Different
audience, different release cadence, different stack. The product app is built
for energy engineers; this site is built for the people who decide whether
their team gets to use it.

## Purpose

- Communicate what SOLARIS is in under eight seconds.
- Earn technical credibility with EPCs, asset owners, and energy managers.
- Drive qualified pilot requests to the design-partner pipeline.

## Stack

| Layer       | Choice                                         | Why this, not the alternative                                                                                                                                                       |
| ----------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router, RSC)                   | RSC keeps marketing HTML on the edge; client islands for 3D. Astro was tempting but the team already knows Next; one stack across `solaris-www` and `solaris-fe`'s public previews. |
| 3D          | React Three Fiber + drei + postprocessing      | R3F composes like React, degrades to `<canvas>` placeholder. Three.js direct = imperative, harder to maintain.                                                                      |
| Motion (2D) | GSAP (ScrollTrigger) + Framer Motion           | GSAP for cinematic timelines, Framer for component-local transitions. Lottie rejected — JSON payload too heavy for the budget.                                                      |
| Styling     | Tailwind v4 + CSS variables                    | CSS variables bridge tokens to `solaris-fe` design system. Vanilla CSS would diverge fast.                                                                                          |
| Content     | MDX                                            | Changelog and case studies authored as prose with embedded components. Sanity/Contentful rejected — no editorial team to justify a CMS.                                             |
| Deploy      | Cloudflare Pages (edge)                        | Free for our traffic envelope, global PoPs, R2 colocates with site for asset hosting. Vercel rejected for cost at scale.                                                            |
| Analytics   | Plausible (self-host)                          | Cookie-free, no consent banner, EU-hosted. GA4 rejected on GDPR + bundle weight.                                                                                                    |
| Testing     | Playwright (visual regression) + Lighthouse CI | Both run in CI under 5 min. Cypress rejected — Playwright is faster on parallel shards.                                                                                             |

## Run

```bash
nvm use            # Node 22 LTS
npm install        # do not commit node_modules
npm run dev        # http://localhost:3000
npm run build      # production build
npm run check      # typecheck + lint + format
npm run test:e2e   # Playwright
npm run lhci       # Lighthouse CI against local build
```

## Performance budget (enforced in CI)

| Metric                                     | Budget   |
| ------------------------------------------ | -------- |
| Lighthouse Performance (mobile, throttled) | >= 90    |
| First Contentful Paint                     | < 1.5 s  |
| Largest Contentful Paint                   | < 2.5 s  |
| Cumulative Layout Shift                    | < 0.05   |
| Total Blocking Time                        | < 200 ms |
| Hero-route JS, gzipped (excl. 3D chunk)    | < 250 KB |
| 3D asset payload (lazy)                    | < 1.5 MB |

Budget violations fail the build. See `.github/workflows/ci.yml` and
`lighthouserc.json`.

## Accessibility

- WCAG 2.2 AA across all pages.
- `prefers-reduced-motion` cuts every shader and parallax to a static frame.
- Full keyboard navigation, focus rings preserved, skip-to-content link.
- No information conveyed by motion or color alone.

## Deploy target

Cloudflare Pages, with the `@cloudflare/next-on-pages` adapter. Preview
deploys per pull request. Production deploy on push to `main`.

Asset CDN: Cloudflare R2 for 3D GLB/Draco models and high-resolution
imagery, served through the same Pages domain.

## Cross-repo

- Design tokens (color, type, motion) are mirrored from `solaris-fe/src/styles/tokens.css`. Update in `solaris-fe` first.
- Product screenshots in `public/shots/` are regenerated from `solaris-fe` Playwright suites.
- This repo does not depend on `solaris-be` or `solaris-contracts` at runtime.

## What this repo is not

- Not the product app (`solaris-fe`).
- Not the docs site (`solaris-docs`).
- Not a CMS-driven landing page builder. Edits are PRs.
