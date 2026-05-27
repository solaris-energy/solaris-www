"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionShell } from "./SectionShell";

function useCounter(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduced]);

  return value;
}

const EUR = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function DealPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const npv = useCounter(1247000, inView);
  const irr = useCounter(14.6, inView);
  const payback = useCounter(6.2, inView);
  const lcoe = useCounter(58, inView);

  return (
    <SectionShell eyebrow="03 / Finance" title="We price the deal.">
      <div ref={ref} className="space-y-12">
        <div className="rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)] p-8 md:p-12">
          <div
            className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>Net present value · 25 y · 6.0% discount</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-signal-good)]" />
              Solved
            </span>
          </div>

          <div
            className="text-[clamp(3rem,9vw,7rem)] font-medium tabular-nums leading-none tracking-[-0.04em] text-[color:var(--color-accent-flare)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {EUR.format(npv)}
          </div>

          <div
            className="mt-8 grid grid-cols-2 gap-8 border-t border-[color:var(--color-bg-edge)] pt-8 md:grid-cols-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Stat label="Internal rate of return" value={`${irr.toFixed(1)} %`} />
            <Stat label="Payback period" value={`${payback.toFixed(1)} y`} />
            <Stat label="LCOE" value={`€ ${lcoe.toFixed(0)} / MWh`} />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 1.4 }}
          className="max-w-[60ch] text-[16px] leading-[1.6] text-[color:var(--color-fg-secondary)]"
        >
          NPV, IRR, payback, and LCOE recompute as the design changes — string
          layout, tariff schedule, CAPEX assumptions, financing structure. Every
          number on the proposal traces back to the input revision that
          produced it.
        </motion.p>
      </div>
    </SectionShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[22px] tabular-nums text-[color:var(--color-fg-primary)]">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[color:var(--color-fg-tertiary)]">
        {label}
      </div>
    </div>
  );
}
