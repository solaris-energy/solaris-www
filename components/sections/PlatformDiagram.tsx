"use client";

import { motion, useReducedMotion } from "framer-motion";

type Layer = {
  key: string;
  label: string;
  sub: string;
  bullets: string[];
};

const LAYERS: Layer[] = [
  {
    key: "sat",
    label: "Satellite",
    sub: "Polygon · GeoJSON · tile reference",
    bullets: [
      "Polygon ingest",
      "Setback resolution",
      "Ground sample distance",
    ],
  },
  {
    key: "sim",
    label: "Simulation",
    sub: "pvlib · PVGIS · ERA5 · 8,760 h",
    bullets: [
      "Hourly yield",
      "Loss model",
      "P50 / P90",
      "Capacity factor",
    ],
  },
  {
    key: "pdf",
    label: "Proposal",
    sub: "PDF · branded · audit-trailed",
    bullets: [
      "Executive summary",
      "Design",
      "Yield",
      "Financials",
    ],
  },
];

export function PlatformDiagram() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 xl:px-16">
      <div className="rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((layer, i) => (
            <motion.article
              key={layer.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduced ? 0 : 0.6,
                delay: reduced ? 0 : i * 0.18,
                ease: [0.2, 0.6, 0.1, 1],
              }}
              className="relative flex min-w-0 flex-col rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-elevated)] p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-sm bg-[color:var(--color-accent-flare)]/75"
              />

              <p
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-fg-tertiary)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Layer 0{i + 1}
              </p>

              <h3
                className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-[color:var(--color-fg-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {layer.label}
              </h3>

              <p
                className="mt-2 max-w-[28ch] font-mono text-[12px] leading-[1.5] text-[color:var(--color-fg-secondary)] [text-wrap:pretty]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {layer.sub}
              </p>

              <hr className="my-5 border-0 border-t border-[color:var(--color-bg-edge)]" />

              <ul className="flex max-w-[28ch] flex-col gap-2 text-[13px] leading-[1.5] text-[color:var(--color-fg-secondary)] [text-wrap:pretty]">
                {layer.bullets.map((b) => (
                  <li key={b} className="flex min-w-0 items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] inline-block size-[3px] shrink-0 rounded-full bg-[color:var(--color-accent-flare)]"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {i < LAYERS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[-1.25rem] top-1/2 hidden -translate-y-1/2 items-center text-[color:var(--color-accent-flare)] lg:flex"
                >
                  <span className="h-px w-6 bg-[color:var(--color-accent-flare)]" />
                  <span className="-ml-[1px] text-[14px] leading-none">&rsaquo;</span>
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
