# Copy Deck — Home Page

Production-ready. No lorem. No placeholders. Numbers are illustrative
until pilot data lands; review with the founder before any number ships
that implies an SLA.

---

## Meta

**Title tag.** `SOLARIS — Industrial solar, from satellite to signature.`

**Meta description.** `SOLARIS designs, simulates, and prices commercial
and industrial solar from satellite imagery. Built for EPCs and asset
owners who refuse the 21-day proposal cycle.` (155 chars)

**OG image.** `/og/home.png` — generated from the hero scene, 1200x630,
amber accent on near-black, headline rendered in Inter Display 56.

**Theme color (mobile chrome).** `#05070B`

---

## Hero (above the fold)

**Eyebrow (mono, 12 px, tracking 0.08em, uppercase, `--fg-tertiary`).**
`Industrial Energy Intelligence Platform`

**Headline (display-1, `--fg-primary`).**
`Satellite tile to signed proposal.`

**Subhead (body-l, `--fg-secondary`, max 56ch).**
`SOLARIS designs, simulates, and prices commercial solar from the first
satellite pixel. Built for EPCs and asset owners who refuse the 21-day
cycle.`

**Primary CTA.** `Request pilot access` -> opens intake form
**Secondary CTA (text link).** `See the platform` -> `/platform`

**Metric strip (mono, 14 px, four columns).**

| Value     | Label                             |
| --------- | --------------------------------- |
| `28 min`  | Site to proposal, median, pilot   |
| `8,760 h` | Per-site yield simulation, hourly |
| `< 3 s`   | Simulation P95, single site       |
| `MENA+EU` | Data residency, default           |

**Legal sub-line.** `Pilot figures from internal benchmark on flat-roof
warehouses, 200 kWp to 2 MWp. Production SLAs published per tier.`

---

## Section 2 — The four-step flow (set-piece: scroll-linked diagram)

**Section eyebrow.** `01 / Platform`
**Section head (h2).** `Four steps. One workspace.`

**Step 01 — Site.**
`Drop a polygon, upload GeoJSON, or paste a coordinate pair. SOLARIS
holds the site as a versioned object for twenty-five years.`

**Step 02 — Simulation.**
`pvlib runs an 8,760-hour yield against PVGIS irradiance and ERA5
weather. Loss model, performance ratio, capacity factor, all printed
with their inputs.`

**Step 03 — Proposal.**
`A branded PDF in your colors, your logo, your language. Executive
summary, design, yield, financials. Optional narrative drafted by a
local LLM you can audit.`

**Step 04 — Twin.**
`When the asset is installed, the design becomes a digital twin.
Telemetry, performance versus expected, predictive maintenance.`

> Footer line under step 04: `Steps 01-03 ship today. Step 04 ships
when a paying customer connects an inverter. We do not pretend
otherwise.`

---

## Section 3 — Earn the engineers (set-piece: methods preview)

**Section eyebrow.** `02 / Simulation engine`
**Section head (h2).** `Numbers you can defend in a permit review.`

**Body.**
`Every kWh on a SOLARIS proposal traces back to a model version, an
input revision, and a confidence interval. We benchmark against
PVsyst on a public flat-roof test set; the gap and the methodology
are published.`

**Pull quote (mono, accent rule on the left).**
`If a number on a SOLARIS PDF cannot be reproduced from its inputs, it
is a defect. Open a ticket.`

**Inline link.** `Read the simulation methods ->` -> `/simulation-engine`

---

## Section 4 — Built for the wedge (set-piece: two side-by-side ICPs)

**Section eyebrow.** `03 / Who buys`
**Section head (h2).** `Two audiences. One platform.`

**Card A — EPCs.**
**Title.** `For EPCs.`
**Body.** `Close more deals per sales engineer. Replace the
screenshot-and-Excel stack. Your engineering team keeps its CAD; your
sales team stops waiting on it.`
**Link.** `For EPCs ->` -> `/for-epcs`

**Card B — Asset owners.**
**Title.** `For asset owners.`
**Body.** `Score a hundred rooftops against irradiance, tariff, and
structural envelope. Prioritize the ten that pay back fastest. Track
each one from design to twin.`
**Link.** `For asset owners ->` -> `/for-asset-owners`

---

## Section 5 — Trust (set-piece: minimal compliance grid)

**Section eyebrow.** `04 / Trust`
**Section head (h2).** `Multi-tenant by design. Single-tenant by request.`

**Body.**
`Row-level security in Postgres, enforced by integration test.
Keycloak OIDC for single sign-on. MENA+EU-resident by default; sovereign
and on-prem profiles documented in the trust pack, not improvised on
the call.`

**Compliance grid (icons + labels, mono captions).**
`GDPR` / `EU data residency` / `RLS-enforced isolation` / `OIDC SSO` /
`OpenAPI 3.1 + AsyncAPI 3 specs` / `Audit log per state change`

**Inline link.** `Download the security pack ->` -> `/trust`

---

## Section 6 — Closing CTA (set-piece: full-bleed accent rule)

**Section head (display-2).** `Stop screenshotting. Start proposing.`

**Body (body-l).**
`We are taking three to five design-partner EPCs in 2026. Pilots run
ninety days. Success metrics agreed in writing on day one.`

**Primary CTA.** `Request pilot access`
**Secondary CTA.** `Email the founder ->` -> `mailto:pilots@solaris.energy`

---

## Footer

**Column 1 — Product.**
Platform / Satellite intelligence / Simulation engine / Changelog / Docs

**Column 2 — Who it's for.**
EPCs / Asset owners / Energy managers (soon)

**Column 3 — Company.**
Mission / Open roles / Contact / Press

**Column 4 — Trust.**
Security pack / Status / Privacy / Legal

**Sign-off line (mono, `--fg-tertiary`).**
`SOLARIS — built in Casablanca. Designed for a planet running on the sun.`

---

## Three alternative hero headlines

The brief asks for three. Here they are; founder picks. The deck above
uses option A.

- **A.** `Satellite tile to signed proposal.`
  (8 words. Implies the full arc; pairs cleanly with the metric strip.)
- **B.** `Industrial solar, from the first pixel.`
  (7 words. Anchors on the satellite-first principle (`P2`). Less
  action, more category.)
- **C.** `Stop drawing solar. Start designing it.`
  (6 words. Most pointed at the Aurora/Helioscope competitive wedge;
  risk: combative tone may alienate engineers who like their CAD.)
