"use client";

import { motion, useReducedMotion } from "framer-motion";

const LAYERS = [
  {
    key: "sat",
    label: "Satellite",
    sub: "Polygon · GeoJSON · tile reference",
    detail: "Polygon ingest, setback, ground sample distance.",
  },
  {
    key: "sim",
    label: "Simulation",
    sub: "pvlib · PVGIS · ERA5 · 8,760 h",
    detail: "Hourly yield, loss model, P50 / P90, capacity factor.",
  },
  {
    key: "pdf",
    label: "Proposal",
    sub: "PDF · branded · audit-trailed",
    detail: "Executive summary, design, yield, financials.",
  },
];

export function PlatformDiagram() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
      <div className="overflow-x-auto rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)] p-6 md:p-10">
        <svg
          viewBox="0 0 1100 340"
          className="block w-full min-w-[800px]"
          aria-label="Three-layer architecture: satellite layer feeds simulation, simulation feeds proposal."
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#FFB23F" />
            </marker>
          </defs>

          {LAYERS.map((layer, i) => {
            const x = 60 + i * 340;
            const y = 80;
            return (
              <motion.g
                key={layer.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduced ? 0 : 0.6,
                  delay: reduced ? 0 : i * 0.18,
                  ease: [0.2, 0.6, 0.1, 1],
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={260}
                  height={180}
                  rx={2}
                  fill="#11161F"
                  stroke="#1B2230"
                />
                <rect
                  x={x}
                  y={y}
                  width={260}
                  height={3}
                  fill="#FFB23F"
                  fillOpacity={0.75}
                />
                <text
                  x={x + 20}
                  y={y + 36}
                  fill="#6B7488"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="1.2"
                >
                  LAYER 0{i + 1}
                </text>
                <text
                  x={x + 20}
                  y={y + 68}
                  fill="#F4F6FA"
                  fontSize="26"
                  fontFamily="Inter Display, Inter, sans-serif"
                  fontWeight="600"
                  letterSpacing="-0.4"
                >
                  {layer.label}
                </text>
                <text
                  x={x + 20}
                  y={y + 96}
                  fill="#A7B0C0"
                  fontSize="12"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {layer.sub}
                </text>
                <line
                  x1={x + 20}
                  x2={x + 240}
                  y1={y + 116}
                  y2={y + 116}
                  stroke="#1B2230"
                />
                <text
                  x={x + 20}
                  y={y + 140}
                  fill="#A7B0C0"
                  fontSize="13"
                  fontFamily="Inter, sans-serif"
                >
                  {layer.detail.split(",").map((part, j) => (
                    <tspan key={j} x={x + 20} dy={j === 0 ? 0 : 16}>
                      • {part.trim()}
                    </tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}

          {LAYERS.slice(0, -1).map((_, i) => {
            const x1 = 60 + i * 340 + 260;
            const x2 = 60 + (i + 1) * 340;
            return (
              <motion.line
                key={i}
                x1={x1}
                x2={x2}
                y1={170}
                y2={170}
                stroke="#FFB23F"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduced ? 0 : 0.5,
                  delay: reduced ? 0 : 0.5 + i * 0.18,
                }}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}
