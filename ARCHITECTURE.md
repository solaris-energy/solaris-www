# Architecture — solaris-www

Next.js 15, App Router, React Server Components for content, client
islands for interactivity. Every choice below has a one-line tradeoff.

---

## 1. App structure

```
solaris-www/
  app/
    layout.tsx              # root layout, fonts, theme provider
    page.tsx                # / (home)
    platform/page.tsx
    satellite-intelligence/page.tsx
    simulation-engine/page.tsx
    for-epcs/page.tsx
    for-asset-owners/page.tsx
    trust/page.tsx
    changelog/
      page.tsx              # MDX index
      [slug]/page.tsx       # MDX entry
    company/page.tsx
    api/
      pilot-intake/route.ts # POST -> webhook -> CRM (Plausible event)
    not-found.tsx
    robots.ts
    sitemap.ts
    opengraph-image.tsx     # dynamic OG renderer
  components/
    layout/                 # Header, Footer, Nav
    primitives/             # Button, Link, Eyebrow, MetricCell
    sections/               # HeroBlock, FlowDiagram, ICPGrid, TrustGrid
    cinematic/              # static SVG cinematic stills (post-3D removal, 2026-05-28)
      HeroCinematic.fallback.tsx
  content/
    changelog/*.mdx
  lib/
    seo.ts
    analytics.ts            # Plausible wrapper
    motion.ts               # GSAP registration, reduced-motion guard
  styles/
    globals.css             # tokens + base
    fonts.css               # font-face declarations
  public/
    fonts/                  # self-hosted woff2
    shots/                  # product screenshots (avif + fallback)
    og/                     # static OG images
    hero-still.avif         # reduced-motion fallback for 3D
  scripts/
    check-budgets.mjs       # bundle-size + image-weight gates
  tests/
    e2e/                    # Playwright
    visual/                 # Playwright visual regressions
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  lighthouserc.json
  playwright.config.ts
```

**Tradeoff.** Co-locating components by feature (`sections/`) over
domain-driven folders. Marketing pages have few cross-cuts; flat wins.

---

## 2. RSC vs Client split

| Where                       | Component type | Reason                              |
| --------------------------- | -------------- | ----------------------------------- |
| Layout, headers, footers    | Server         | Zero JS for nav.                    |
| Hero text + metric strip    | Server         | LCP candidate. Must not hydrate.    |
| Hero cinematic (5 stills)   | Server         | Pure SVG; no client JS, no hydrate. |
| Scroll-linked map cinematic | Client (lazy)  | MapLibre requires window.           |
| Scroll-linked diagrams      | Client (lazy)  | GSAP requires window.               |
| MDX changelog               | Server         | Renders to static HTML.             |
| Pilot intake form           | Client         | Validation + optimistic state.      |

**Hero cinematic.** The hero ships as server-rendered HTML containing a
five-frame static cinematic (`components/cinematic/HeroCinematic.fallback.tsx`),
all SVG, zero client JS. The scroll-linked MapLibre cinematic on the home
page is dynamically loaded post-LCP for users who pass the
`shouldRenderRich()` gate (no reduced-motion preference, viewport ≥ 768 px,
no `saveData`).

**Tradeoff.** A 3D hero (R3F + Three.js) was removed on 2026-05-28 per
`CLAUDE.md §3` (Three.js / CesiumJS banned, marketing site must be cheap
to ship and audit). The SVG cinematic preserves the visual intent at
zero JS cost and ships entirely from the server.

---

## 3. Asset pipeline

- All cinematic stills are inline SVG generated at render time. No GLB,
  no Draco, no KTX2 textures.
- Product screenshots live in `/public/shots/` (AVIF + WebP fallback),
  served from the static export.
- The MapLibre cinematic streams raster tiles from EOX (low zoom) and
  Esri (high zoom) at runtime; no tile-server bill.

**Tradeoff.** Keeping all hero assets as SVG / static images trades the
high-end "wow" of a real 3D scene for a zero-JS hero, a smaller bundle,
and a marketing site that builds in < 30 s.

---

## 4. Tile / imagery hosting

The marketing site does not run MapLibre. Map cutouts on
`/satellite-intelligence` and `/for-asset-owners` are baked as static
AVIF / WebP, exported from MapLibre during a content build step
(`scripts/bake-maps.mjs`, runs on demand). Reason: a live map on a
marketing page costs ~250 KB of JS and a tile-server bill, with no
interactive payoff we are willing to fund yet.

---

## 5. Fonts

Inter Display + Inter + JetBrains Mono. Self-hosted woff2, subset to
Latin + Latin-Ext + a small symbol set. `font-display: swap`. Preloaded
in `app/layout.tsx`. Total font payload: ~140 KB across four faces.

**Tradeoff.** Self-hosting over Google Fonts: removes a DNS lookup and
keeps us cookie-free for analytics consent purposes.

---

## 6. Styling

Tailwind v4 with CSS variables for tokens. Token file
(`styles/tokens.css`) is the canonical source; Tailwind reads it through
`@theme inline`. Same token names as `solaris-fe`'s upcoming token
file — rename now, save a refactor later.

**Tradeoff.** Tailwind v4 is new (released 2025); we accept the bleeding
edge in exchange for native CSS variable integration and a smaller
runtime than v3 + PostCSS plugins.

---

## 7. Analytics

Plausible, self-hosted on the same Cloudflare account. Single script,
~1 KB, no cookies, no consent banner needed under GDPR. Custom events:
`hero_cta_click`, `pilot_intake_submit`, `secondary_cta_click`,
`changelog_subscribe`.

**Tradeoff.** Self-hosting costs us 4 EUR/mo on a Hetzner box but
removes the third-party domain (so no extra DNS lookup, no CSP
exception) and keeps the page cookie-free.

---

## 8. CSP and security headers

Set in `next.config.ts` via `headers()`. The full set:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://plausible.solaris.energy;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

`COEP: credentialless` is kept for forward compatibility with cross-origin
font / image loading. `wasm-unsafe-eval` is retained even though Three.js

- Draco were removed, because MapLibre's terrain mode may use WASM in
  future; if it is not actually used, this directive can be tightened.

`'unsafe-inline'` for `style-src` is the only loosened directive — Next
inlines critical CSS at build, and the alternative (nonce per request)
defeats edge caching.

---

## 9. Performance budget enforcement

Three gates, all in CI:

1. **Lighthouse CI** (`lighthouserc.json`) — fails the build below 90
   Performance, 95 Accessibility, 95 Best Practices, 95 SEO.
2. **Bundle size check** (`scripts/check-budgets.mjs`) — parses
   `.next/build-manifest.json`, asserts hero-route JS ≤ 250 KB gzipped.
   (The previous `three/` chunk exclusion was removed when the 3D hero
   was deleted.)
3. **Image weight check** (`scripts/check-budgets.mjs`) — asserts no
   single image in `/public/shots/` exceeds 180 KB.

**Tradeoff.** Three checks over one big one: each failure points at a
single owner, faster to fix.

---

## 10. Testing

- **Playwright** for E2E (smoke per page) + visual regression (Percy-style
  snapshots stored in-repo under `tests/visual/__snapshots__/`).
- **TypeScript** for types; no Jest, no Vitest. This is a marketing site;
  the only logic to unit-test would be the SEO helper, which is exercised
  by E2E.
- **Lighthouse CI** for performance budgets.

**Tradeoff.** Skipping a unit-test framework saves ~40 MB of deps and a
config file. Acceptable for a content site.

---

## 11. Deploy

Cloudflare Pages via `@cloudflare/next-on-pages`. Preview deploys on
every PR. Production deploys on push to `main`. The 3D assets ship in
the same deployment (they live under `/public/`), so there is no
asset-pipeline race on releases.

Edge runtime for all routes that do not need Node (`runtime = 'edge'`
in `route.ts` files). The pilot-intake `POST` runs on edge and forwards
to the CRM webhook with a 250 ms timeout; if the webhook is down we
queue to a Cloudflare Durable Object for replay. (Durable Object is a
v1.1 add-on; v1 returns a 503 and the form retries client-side.)

**Tradeoff.** Cloudflare over Vercel: lower cost at projected traffic,
same DX after the adapter, R2 collocation. Cost of switching: we lose
Vercel's preview comment UI; PR descriptions will link the deploy URL
manually.
