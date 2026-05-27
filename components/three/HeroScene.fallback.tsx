export function HeroSceneFallback() {
  return (
    <div
      role="img"
      aria-label="Earth viewed from low orbit, with amber heat signatures across insolated continents and a ring of satellites overhead."
      className="relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#0A0E14_0%,#05070B_75%)]"
    >
      <svg
        viewBox="0 0 800 450"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="planet-body" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1B2230" />
            <stop offset="55%" stopColor="#0A0E14" />
            <stop offset="100%" stopColor="#05070B" />
          </radialGradient>
          <radialGradient id="planet-rim" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="rgba(255,178,63,0)" />
            <stop offset="92%" stopColor="rgba(255,178,63,0.25)" />
            <stop offset="100%" stopColor="rgba(255,178,63,0)" />
          </radialGradient>
          <radialGradient id="flare-spot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB23F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFB23F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stars */}
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 97) % 800;
          const y = (i * 53) % 450;
          const r = ((i * 7) % 3) * 0.4 + 0.3;
          return <circle key={i} cx={x} cy={y} r={r} fill="#6B7488" opacity={0.5} />;
        })}

        {/* Planet */}
        <circle cx="400" cy="225" r="160" fill="url(#planet-body)" />
        <circle cx="400" cy="225" r="172" fill="url(#planet-rim)" />

        {/* Heat signatures */}
        <circle cx="360" cy="200" r="22" fill="url(#flare-spot)" />
        <circle cx="430" cy="230" r="18" fill="url(#flare-spot)" />
        <circle cx="390" cy="260" r="14" fill="url(#flare-spot)" />
        <circle cx="345" cy="245" r="11" fill="url(#flare-spot)" />
        <circle cx="455" cy="200" r="9" fill="url(#flare-spot)" />

        {/* Satellite ring */}
        <ellipse
          cx="400"
          cy="225"
          rx="245"
          ry="45"
          fill="none"
          stroke="#FFB23F"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const t = (i / 8) * Math.PI * 2;
          const cx = 400 + Math.cos(t) * 245;
          const cy = 225 + Math.sin(t) * 45;
          return (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <rect x="-2" y="-2" width="4" height="4" fill="#A7B0C0" />
              <rect x="-6" y="-1" width="3" height="2" fill="#FFB23F" />
              <rect x="3" y="-1" width="3" height="2" fill="#FFB23F" />
            </g>
          );
        })}
      </svg>

      <div
        className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Static render · reduced motion
      </div>
    </div>
  );
}
