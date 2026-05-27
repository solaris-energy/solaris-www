# Sitemap — solaris-www

Eleven routes for v1. Each entry: purpose, hero copy, primary call.

---

## `/` — Home

**Purpose.** Land the category and the time-to-proposal claim within
eight seconds. Send qualified visitors to `/platform` or to pilot intake.

**Hero copy.**

> **Satellite tile to signed proposal. 28 minutes.**
> SOLARIS designs, simulates, and prices commercial solar from the first
> pixel. Built for EPCs and asset owners who refuse the 21-day cycle.

**Primary CTA.** `Request pilot access`
**Secondary.** `See how it works` -> `/platform`

---

## `/platform` — How it works

**Purpose.** End-to-end flow, four steps, each with the product
screenshot and the underlying engine called out by name.

**Hero copy.**

> **Four steps. One workspace. Versioned for twenty-five years.**
> Site, simulation, proposal, twin. Each step is auditable, each output
> is round-trippable to coordinates, every number traces back to a model
> version and an input revision.

**Primary CTA.** `Request pilot access`

---

## `/satellite-intelligence` — The vision layer

**Purpose.** Show the rooftop-detection pipeline, the data sources,
confidence intervals, and the fallback to manual polygon entry.

**Hero copy.**

> **Every roof on Earth is a polygon waiting to be found.**
> Rooftop segmentation, obstruction detection, setback enforcement.
> Source-attributed. Confidence-scored. Human-correctable.

**Primary CTA.** `See the pipeline` (anchor to diagram)

> Note: Phase 0 ships manual polygon entry only. Page sets expectation
> for the vision layer and offers a `[v2]` tag where appropriate. Be
> honest about what is shipping today versus on the roadmap.

---

## `/simulation-engine` — The physics layer

**Purpose.** Earn trust with engineers. Show the pvlib backbone, the
PVGIS / ERA5 weather backbone, the loss model, and the benchmark plan
against PVsyst.

**Hero copy.**

> **pvlib under the hood. PVsyst on the bench.**
> Hourly 8760 yield simulations, temperature and soiling losses,
> inverter clipping. P50 / P90 outputs with the assumptions printed
> on the page.

**Primary CTA.** `Read the methods` -> `/docs/simulation` (external)

---

## `/for-epcs` — Segment page (ship in v1)

**Purpose.** Convert the wedge ICP — mid-market European EPCs.

**Hero copy.**

> **Close 30 deals a year per sales engineer. Not 8.**
> SOLARIS replaces the screenshot-and-Excel proposal stack. Your
> engineering team keeps its CAD. Your sales team stops waiting.

**Primary CTA.** `Request pilot access`

---

## `/for-asset-owners` — Segment page (ship in v1)

**Purpose.** Convert logistics REITs and multi-site industrials.

**Hero copy.**

> **A hundred warehouses. One viewport.**
> Score every rooftop in your portfolio against irradiance, tariff, and
> structural envelope. Prioritize the ten that pay back fastest.

**Primary CTA.** `Request portfolio scoring`

---

## `/for-energy-managers` — Segment page (defer to v1.1)

**Purpose.** Convert single-site industrial energy managers.
**Ship decision:** **defer to v1.1.** The wedge motion is EPCs and
asset owners; energy managers convert through partnerships, not direct.

**Hero copy (drafted, parked).**

> **Your bill is your blueprint.**
> Twelve months of consumption, one tariff schedule, one site. We size
> the system that fits.

---

## `/trust` — Security, compliance, sovereignty

**Purpose.** Survive the procurement security questionnaire on the
first read. Link the trust pack.

**Hero copy.**

> **Multi-tenant by design. Single-tenant by request.**
> Row-level security in Postgres. OIDC SSO. MENA+EU-resident by default.
> Sovereign and on-prem profiles documented, not improvised.

**Primary CTA.** `Download the security pack (PDF)`

---

## `/changelog` — MDX-driven

**Purpose.** Public release notes. Establishes velocity and discipline.

**Hero copy.**

> **What shipped, when, and what it does.**
> Every release. Every contract change. Every deprecation, with the
> sunset date attached.

**Primary CTA.** `Subscribe to the RSS feed`

---

## `/company` — Mission, careers, contact

**Purpose.** Mission paragraph (one screen), open roles, press kit,
contact paths.

**Hero copy.**

> **Energy decisions are too important to be slow.**
> SOLARIS is a small team building the operating system for industrial
> solar. We are based in Casablanca and hire across MENA and the EU.

**Primary CTA.** `See open roles`

---

## `/docs` — External link

Sends to `docs.solaris.energy` (the published `solaris-docs` site).
Visually styled as an outbound, with the destination domain shown.

---

## Footer

Permanent links: Platform, Satellite Intelligence, Simulation Engine,
For EPCs, For Asset Owners, Trust, Changelog, Docs, Company, Contact,
Status (link to status page), GitHub (public OpenAPI specs), Legal,
Privacy, Cookie policy (none — we run cookie-free analytics).

---

## v1 ship list

`/`, `/platform`, `/satellite-intelligence`, `/simulation-engine`,
`/for-epcs`, `/for-asset-owners`, `/trust`, `/changelog`, `/company`,
`/docs` (link). Ten routes. `/for-energy-managers` parked for v1.1.
