import Link from "next/link";
import { HeroMapCinematicMount } from "../components/map/HeroMapCinematic.client";
import { RoofResolution } from "../components/sections/RoofResolution";
import { YearSimulation } from "../components/sections/YearSimulation";
import { DealPricing } from "../components/sections/DealPricing";
import { GridDivider } from "../components/sections/SectionShell";
import { SiteFooter } from "../components/nav/SiteFooter";

export default function HomePage() {
  return (
    <main id="main" className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 -z-10"
      />

      <section className="relative mx-auto flex max-w-[1440px] flex-col px-6 pt-24 pb-12 md:px-12 xl:px-16">
        <p
          className="font-mono text-xs uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Industrial Energy Intelligence Platform
        </p>

        <h1
          className="mt-6 max-w-[18ch] text-balance text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Satellite tile to signed proposal.
        </h1>

        <p className="mt-6 max-w-[56ch] text-[18px] leading-[1.55] text-[color:var(--color-fg-secondary)]">
          SOLARIS designs, simulates, and prices commercial solar from the
          first satellite pixel. Built for EPCs and asset owners who refuse the
          21-day cycle.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/#pilot"
            className="inline-flex items-center gap-2 rounded-sm bg-[color:var(--color-accent-flare)] px-5 py-3 text-[14px] font-medium text-[color:var(--color-bg-void)] transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-[color:var(--color-accent-flare-hot)]"
          >
            Request pilot access
            <span aria-hidden="true">-&gt;</span>
          </Link>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 text-[14px] text-[color:var(--color-fg-secondary)] transition-colors duration-[var(--dur-base)] hover:text-[color:var(--color-fg-primary)]"
          >
            See the platform
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color:var(--color-bg-edge)] pt-8 md:grid-cols-4">
          {[
            { v: "28 min", l: "Site to proposal, median, pilot" },
            { v: "8,760 h", l: "Per-site yield simulation, hourly" },
            { v: "< 3 s", l: "Simulation P95, single site" },
            { v: "MENA+EU", l: "Data residency, default" },
          ].map((m) => (
            <div key={m.l}>
              <dt
                className="text-[20px] font-medium tracking-[-0.01em] text-[color:var(--color-fg-primary)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {m.v}
              </dt>
              <dd className="mt-1 font-mono text-[12px] uppercase tracking-[0.06em] text-[color:var(--color-fg-tertiary)]">
                {m.l}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-[56ch] font-mono text-[12px] text-[color:var(--color-fg-tertiary)]">
          Pilot figures from internal benchmark on flat-roof warehouses, 200
          kWp to 2 MWp. Production SLAs published per tier.
        </p>
      </section>

      <HeroMapCinematicMount />

      <GridDivider />
      <RoofResolution />
      <GridDivider />
      <YearSimulation />
      <GridDivider />
      <DealPricing />

      <SiteFooter />
    </main>
  );
}
