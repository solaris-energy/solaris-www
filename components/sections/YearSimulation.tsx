"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionShell } from "./SectionShell";

const POINTS = 365;
const WIDTH = 800;
const HEIGHT = 280;
const PADDING = { top: 20, right: 20, bottom: 30, left: 44 };

function generateSeries() {
  const series: number[] = [];
  for (let d = 0; d < POINTS; d++) {
    const seasonal = Math.sin(((d - 80) / POINTS) * Math.PI * 2) * 0.45 + 0.5;
    const noise = (Math.sin(d * 13.37) + Math.cos(d * 7.21)) * 0.06;
    series.push(Math.max(0.05, Math.min(0.98, seasonal + noise)));
  }
  return series;
}

function buildPath(values: number[]) {
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  return values
    .map((v, i) => {
      const x = PADDING.left + (i / (values.length - 1)) * innerW;
      const y = PADDING.top + (1 - v) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildBand(values: number[], spread = 0.08) {
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const top = values.map((v, i) => {
    const x = PADDING.left + (i / (values.length - 1)) * innerW;
    const y = PADDING.top + (1 - Math.min(1, v + spread)) * innerH;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const bot = [...values].reverse().map((v, i) => {
    const idx = values.length - 1 - i;
    const x = PADDING.left + (idx / (values.length - 1)) * innerW;
    const y = PADDING.top + (1 - Math.max(0, v - spread)) * innerH;
    return `L${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return [...top, ...bot, "Z"].join(" ");
}

export function YearSimulation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const active = inView || reduced;

  const data = useMemo(() => generateSeries(), []);
  const path = useMemo(() => buildPath(data), [data]);
  const band = useMemo(() => buildBand(data), [data]);

  return (
    <SectionShell eyebrow="02 / Physics" title="We simulate the year.">
      <div ref={ref} className="space-y-8">
        <div className="relative w-full overflow-hidden rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)] p-4 md:p-6">
          <div
            className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>Hourly yield · 8,760 h · downsampled 24:1</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-flare)]" />
              kWh/kWp · daily
            </span>
          </div>

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="size-full"
            aria-hidden="true"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((g) => {
              const y = PADDING.top + (1 - g) * (HEIGHT - PADDING.top - PADDING.bottom);
              return (
                <g key={g}>
                  <line
                    x1={PADDING.left}
                    x2={WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="#1B2230"
                    strokeWidth={1}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 3}
                    fill="#6B7488"
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {(g * 7).toFixed(1)}
                  </text>
                </g>
              );
            })}

            {["Jan", "Apr", "Jul", "Oct"].map((m, i) => {
              const x = PADDING.left + (i / 4) * (WIDTH - PADDING.left - PADDING.right);
              return (
                <text
                  key={m}
                  x={x}
                  y={HEIGHT - 10}
                  fill="#6B7488"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {m}
                </text>
              );
            })}

            <motion.path
              d={band}
              fill="#FFB23F"
              fillOpacity={0.08}
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            />

            <motion.path
              d={path}
              fill="none"
              stroke="#FFB23F"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{
                duration: reduced ? 0 : 2.4,
                ease: [0.5, 0, 0.2, 1],
              }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color:var(--color-bg-edge)] pt-8 md:grid-cols-4">
          {[
            { v: "1,284 MWh", l: "Annual yield, P50" },
            { v: "1,196 MWh", l: "Annual yield, P90" },
            { v: "± 6.8 %", l: "95% confidence band" },
            { v: "1,247 kWh/kWp", l: "Specific production" },
          ].map((m) => (
            <div key={m.l}>
              <motion.dt
                className="text-[20px] text-[color:var(--color-fg-primary)]"
                style={{ fontFamily: "var(--font-mono)" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: active ? 1 : 0,
                  y: active ? 0 : 6,
                }}
                transition={{ duration: 0.4, delay: 2 }}
              >
                {m.v}
              </motion.dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[color:var(--color-fg-tertiary)]">
                {m.l}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
