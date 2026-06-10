import type { Metadata } from "next";
import { PlatformDiagram } from "../../components/sections/PlatformDiagram";
import { SiteFooter } from "../../components/nav/SiteFooter";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Three layers — satellite, simulation, proposal. One workspace, versioned for twenty-five years.",
};

export default function PlatformPage() {
  return (
    <>
      <main id="main" className="relative isolate">
        <section className="mx-auto max-w-[1440px] px-6 pt-24 pb-12 md:px-12 xl:px-16">
          <p
            className="text-[11px] tracking-[0.12em] text-[color:var(--color-accent-flare)] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Platform
          </p>
          <h1
            className="mt-4 max-w-[20ch] text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Four steps. One workspace.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.6] text-[color:var(--color-fg-secondary)]">
            Site, simulation, proposal, twin. Each step is auditable, each output
            round-trippable to coordinates, every number traceable to a model version
            and an input revision.
          </p>
        </section>

        <PlatformDiagram />

        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 xl:px-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Satellite",
                b: "Drop a polygon, upload GeoJSON, or paste a coordinate pair. SOLARIS holds the site as a versioned object for twenty-five years.",
              },
              {
                n: "02",
                t: "Simulation",
                b: "pvlib runs an 8,760-hour yield against PVGIS irradiance and ERA5 weather. Loss model, performance ratio, capacity factor — all printed with their inputs.",
              },
              {
                n: "03",
                t: "Proposal",
                b: "A branded PDF in your colors, your logo, your language. Executive summary, design, yield, financials. Optional narrative drafted by a local LLM you can audit.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="border-t border-[color:var(--color-bg-edge)] pt-6"
              >
                <p
                  className="text-[11px] tracking-[0.08em] text-[color:var(--color-fg-tertiary)] uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Step {s.n}
                </p>
                <h3
                  className="mt-2 text-[22px] font-semibold tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.t}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--color-fg-secondary)]">
                  {s.b}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-[60ch] font-mono text-[12px] text-[color:var(--color-fg-tertiary)]">
            Steps 01–03 ship today. Step 04 — digital twin — ships when a paying
            customer connects an inverter. We do not pretend otherwise.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
