"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionShell } from "./SectionShell";

const GRID_COLS = 24;
const GRID_ROWS = 14;

const ROOF_POLYGON =
  "M120,80 L520,80 L560,140 L560,280 L440,280 L420,260 L200,260 L180,280 L120,280 Z";

export function RoofResolution() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const active = inView || reduced;

  return (
    <SectionShell eyebrow="01 / Vision" title="We see the roof.">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div
          ref={ref}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)]"
        >
          <svg
            viewBox="0 0 640 360"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {/* Pixel grid that resolves */}
            <g>
              {Array.from({ length: GRID_ROWS }).map((_, r) =>
                Array.from({ length: GRID_COLS }).map((_, c) => {
                  const x = c * (640 / GRID_COLS);
                  const y = r * (360 / GRID_ROWS);
                  const w = 640 / GRID_COLS;
                  const h = 360 / GRID_ROWS;
                  const seed = (r * 31 + c * 17) % 100;
                  const opacity = active ? 0.06 : 0.18 + (seed / 100) * 0.35;
                  return (
                    <motion.rect
                      key={`${r}-${c}`}
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="#A7B0C0"
                      initial={{ opacity: 0.18 + (seed / 100) * 0.35 }}
                      animate={{ opacity }}
                      transition={{
                        duration: reduced ? 0 : 1.4,
                        delay: reduced ? 0 : (seed / 100) * 0.6,
                        ease: [0.5, 0, 0.2, 1],
                      }}
                    />
                  );
                }),
              )}
            </g>

            {/* Resolved polygon */}
            <motion.path
              d={ROOF_POLYGON}
              fill="none"
              stroke="#FFB23F"
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: active ? 1 : 0,
                opacity: active ? 1 : 0,
              }}
              transition={{
                duration: reduced ? 0 : 1.6,
                delay: reduced ? 0 : 0.8,
                ease: [0.2, 0.6, 0.1, 1],
              }}
            />
            <motion.path
              d={ROOF_POLYGON}
              fill="#FFB23F"
              fillOpacity={0.06}
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            />

            {/* Dimension callouts */}
            {[
              { x: 340, y: 70, text: "47.2 m" },
              { x: 580, y: 180, text: "21.8 m" },
              { x: 340, y: 300, text: "Az 188.4°" },
            ].map((d, i) => (
              <motion.text
                key={d.text}
                x={d.x}
                y={d.y}
                fill="#A7B0C0"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 2.2 + i * 0.15 }}
              >
                {d.text}
              </motion.text>
            ))}
          </svg>

          <div
            className="absolute top-3 right-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-[color:var(--color-fg-tertiary)] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="size-1.5 rounded-full bg-[color:var(--color-accent-flare)] shadow-[0_0_6px_var(--color-accent-flare)]" />
            Tile 18/05798
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[18px] leading-[1.6] text-[color:var(--color-fg-secondary)]">
            Rooftop segmentation against a satellite tile. Pixels resolve into a
            polygon, the polygon resolves into measurements, the measurements resolve
            into a bill of quantities. Every line carries its source.
          </p>
          <dl
            className="grid grid-cols-2 gap-6 border-t border-[color:var(--color-bg-edge)] pt-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {[
              { v: "5,142 m²", l: "Usable surface" },
              { v: "0.91", l: "Confidence (P50)" },
              { v: "11.4 s", l: "Time to polygon" },
              { v: "± 1.8 m", l: "Edge tolerance" },
            ].map((m) => (
              <div key={m.l}>
                <dt className="text-[18px] text-[color:var(--color-fg-primary)]">
                  {m.v}
                </dt>
                <dd className="mt-1 text-[11px] tracking-[0.06em] text-[color:var(--color-fg-tertiary)] uppercase">
                  {m.l}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-[12px] text-[color:var(--color-fg-tertiary)]">
            Phase 0 ships manual polygon entry. Automatic segmentation is on the roadmap
            and clearly tagged on /platform.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
