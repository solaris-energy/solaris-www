import type { ReactNode } from "react";

type Still = {
  key: string;
  caption: string;
  art: ReactNode;
};

const STILLS: Still[] = [
  {
    key: "planet",
    caption: "Every roof is already lit. We just have to see it.",
    art: <PlanetStill />,
  },
  {
    key: "morocco",
    caption: "Morocco. 3,000+ sun-hours per year. A grid waking up.",
    art: <MoroccoStill />,
  },
  {
    key: "casa",
    caption: "Casablanca. The first sites we measure.",
    art: <CasablancaStill />,
  },
  {
    key: "rooftop",
    caption: "The polygon. The setbacks. The shading. All measured.",
    art: <RooftopStill />,
  },
  {
    key: "array",
    caption: "MODULES: 248   |   kWp: 122.0   |   ANNUAL YIELD: 197.4 MWh",
    art: <ArrayStill />,
  },
];

export function HeroCinematicFallback() {
  return (
    <div
      data-testid="hero-cinematic-fallback"
      className="relative w-full"
      role="region"
      aria-label="Five-frame static sequence: planet, Morocco, Casablanca, rooftop, PV array."
    >
      <div className="flex flex-col gap-12">
        {STILLS.map((s, i) => (
          <figure
            key={s.key}
            className="relative w-full overflow-hidden rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)]"
          >
            <div className="aspect-[16/9] w-full">{s.art}</div>
            <figcaption className="absolute bottom-4 left-4 max-w-[56ch] rounded-sm bg-[color:var(--color-bg-void)]/70 px-3 py-2 text-[13px] leading-[1.5] text-[color:var(--color-fg-primary)] backdrop-blur-sm md:bottom-6 md:left-6 md:text-[15px]">
              {i === 4 ? (
                <span
                  className="font-mono tracking-[0.04em] text-[color:var(--color-accent-flare)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.caption}
                </span>
              ) : (
                s.caption
              )}
            </figcaption>
            <div
              className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.08em] text-[color:var(--color-fg-tertiary)] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Frame 0{i + 1} / 05
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}

function PlanetStill() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="planet-body-1" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1B2230" />
          <stop offset="55%" stopColor="#0A0E14" />
          <stop offset="100%" stopColor="#05070B" />
        </radialGradient>
        <radialGradient id="planet-rim-1" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="rgba(255,178,63,0)" />
          <stop offset="92%" stopColor="rgba(255,178,63,0.25)" />
          <stop offset="100%" stopColor="rgba(255,178,63,0)" />
        </radialGradient>
        <radialGradient id="flare-spot-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB23F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFB23F" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 80 }).map((_, i) => {
        const x = (i * 97) % 800;
        const y = (i * 53) % 450;
        const r = ((i * 7) % 3) * 0.4 + 0.3;
        return <circle key={i} cx={x} cy={y} r={r} fill="#6B7488" opacity={0.5} />;
      })}
      <circle cx="400" cy="225" r="160" fill="url(#planet-body-1)" />
      <circle cx="400" cy="225" r="172" fill="url(#planet-rim-1)" />
      <circle cx="360" cy="200" r="22" fill="url(#flare-spot-1)" />
      <circle cx="430" cy="230" r="18" fill="url(#flare-spot-1)" />
      <circle cx="390" cy="260" r="14" fill="url(#flare-spot-1)" />
      <ellipse
        cx="400"
        cy="225"
        rx="245"
        ry="45"
        fill="none"
        stroke="#FFB23F"
        strokeOpacity="0.18"
      />
    </svg>
  );
}

function MoroccoStill() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="morocco-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB23F" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFB23F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="#05070B" />
      {/* Continental sweep — Morocco-shaped silhouette */}
      <path
        d="M260,140 L420,120 L520,170 L560,240 L520,310 L440,340 L320,330 L240,280 L220,200 Z"
        fill="#0F141C"
        stroke="#1B2230"
        strokeWidth="1"
      />
      {/* Atlas mountains hint */}
      <path
        d="M300,220 L380,200 L440,230 L500,220"
        fill="none"
        stroke="#1B2230"
        strokeWidth="1.5"
      />
      {/* Sahara heat */}
      <circle cx="430" cy="270" r="120" fill="url(#morocco-glow)" />
      <circle cx="380" cy="240" r="80" fill="url(#morocco-glow)" opacity="0.7" />
      {/* Atlantic coast pin */}
      <circle cx="300" cy="220" r="3" fill="#FFB23F" />
      <circle
        cx="300"
        cy="220"
        r="8"
        fill="none"
        stroke="#FFB23F"
        strokeOpacity="0.5"
      />
      <text
        x="312"
        y="218"
        fill="#A7B0C0"
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
      >
        32.00°N -6.00°W
      </text>
    </svg>
  );
}

function CasablancaStill() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <rect width="800" height="450" fill="#05070B" />
      {/* Coastline */}
      <path
        d="M0,260 Q120,250 240,270 T520,290 T800,300"
        fill="none"
        stroke="#1B2230"
        strokeWidth="1.5"
      />
      <path
        d="M0,260 Q120,250 240,270 T520,290 T800,300 L800,450 L0,450 Z"
        fill="#070A10"
      />
      {/* Port jetties */}
      <path
        d="M340,290 L380,260 M360,290 L400,260 M380,290 L420,260"
        stroke="#1B2230"
        strokeWidth="1"
      />
      {/* Industrial blocks — north */}
      {Array.from({ length: 36 }).map((_, i) => {
        const col = i % 9;
        const row = Math.floor(i / 9);
        const x = 220 + col * 40;
        const y = 60 + row * 32;
        const w = 24 + ((i * 7) % 12);
        const h = 18 + ((i * 5) % 10);
        const seed = (i * 13) % 100;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#11161F"
            stroke="#1B2230"
            opacity={0.4 + (seed / 100) * 0.4}
          />
        );
      })}
      {/* Highlighted candidate sites */}
      <rect
        x="320"
        y="92"
        width="40"
        height="22"
        fill="none"
        stroke="#FFB23F"
        strokeWidth="1.2"
      />
      <rect
        x="424"
        y="156"
        width="32"
        height="20"
        fill="none"
        stroke="#FFB23F"
        strokeWidth="1.2"
      />
      <rect
        x="260"
        y="124"
        width="28"
        height="18"
        fill="none"
        stroke="#FFB23F"
        strokeWidth="1.2"
      />
      <text
        x="20"
        y="40"
        fill="#6B7488"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
      >
        CASABLANCA · 33.57°N -7.59°W · Tile 18/05798
      </text>
    </svg>
  );
}

function RooftopStill() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="roof-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2230" />
          <stop offset="100%" stopColor="#0F141C" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="#05070B" />
      {/* Rooftop quad — perspective */}
      <path
        d="M160,140 L640,160 L660,360 L120,340 Z"
        fill="url(#roof-grad)"
        stroke="#1B2230"
      />
      {/* Setback dashed border */}
      <path
        d="M190,168 L610,184 L626,332 L150,316 Z"
        fill="none"
        stroke="#FFB23F"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* HVAC + shadows */}
      <rect x="280" y="220" width="46" height="30" fill="#0A0E14" stroke="#1B2230" />
      <path d="M326,250 L380,280 L334,280 Z" fill="#05070B" opacity="0.7" />
      <rect x="460" y="240" width="36" height="24" fill="#0A0E14" stroke="#1B2230" />
      <path d="M496,264 L540,290 L504,290 Z" fill="#05070B" opacity="0.7" />
      <rect x="380" y="280" width="28" height="20" fill="#0A0E14" stroke="#1B2230" />
      {/* Sun position marker */}
      <circle cx="620" cy="80" r="14" fill="#FFB23F" opacity="0.85" />
      <circle
        cx="620"
        cy="80"
        r="22"
        fill="none"
        stroke="#FFB23F"
        strokeOpacity="0.3"
      />
      <text
        x="20"
        y="40"
        fill="#6B7488"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
      >
        SOLAR NOON · AZ 180° · ALT 70°
      </text>
    </svg>
  );
}

function ArrayStill() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <rect width="800" height="450" fill="#05070B" />
      <path d="M160,140 L640,160 L660,360 L120,340 Z" fill="#0F141C" stroke="#1B2230" />
      <path
        d="M190,168 L610,184 L626,332 L150,316 Z"
        fill="none"
        stroke="#FFB23F"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* Module grid, skipping shadowed cells */}
      {Array.from({ length: 14 }).map((_, row) =>
        Array.from({ length: 22 }).map((_, col) => {
          // Skip a wedge to suggest HVAC shadow exclusion
          const skip =
            (col >= 7 && col <= 11 && row >= 6 && row <= 9) ||
            (col >= 14 && col <= 17 && row >= 8 && row <= 10);
          if (skip) return null;
          const x = 196 + col * 19;
          const y = 178 + row * 11.2;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width={16}
              height={9}
              fill="#FFB23F"
              fillOpacity={0.55 + ((row + col) % 3) * 0.12}
              stroke="#A86F1F"
              strokeWidth={0.4}
            />
          );
        }),
      )}
      <rect x="280" y="220" width="46" height="30" fill="#0A0E14" stroke="#1B2230" />
      <rect x="460" y="240" width="36" height="24" fill="#0A0E14" stroke="#1B2230" />
    </svg>
  );
}
