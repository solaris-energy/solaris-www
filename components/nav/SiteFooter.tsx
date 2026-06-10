import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "Platform" },
      { href: "/trust", label: "Trust" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/company#careers", label: "Careers" },
      { href: "mailto:hello@solaris.energy", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/trust#license", label: "License" },
      { href: "/trust#privacy", label: "Privacy" },
      { href: "mailto:security@solaris.energy", label: "Security" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[color:var(--color-bg-edge)]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 xl:px-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-baseline text-[18px] font-semibold tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-display)" }}
              aria-label="solaris — home"
            >
              <span>solar</span>
              <span className="relative">
                i
                <span
                  aria-hidden="true"
                  className="absolute -top-[6px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-[color:var(--color-accent-flare)] shadow-[0_0_10px_var(--color-accent-flare)]"
                />
              </span>
              <span>s</span>
            </Link>
            <p className="mt-4 max-w-[28ch] text-[13px] leading-[1.6] text-[color:var(--color-fg-tertiary)]">
              Industrial solar, instrumented end-to-end. From the first satellite pixel
              to the last kilowatt-hour traded.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3
                className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--color-fg-tertiary)] uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[color:var(--color-fg-secondary)] transition-colors duration-[var(--dur-base)] hover:text-[color:var(--color-fg-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[color:var(--color-bg-edge)] pt-6 text-[12px] md:flex-row md:items-center md:justify-between">
          <p
            className="text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SOLARIS — built in Casablanca. Designed for a planet running on the sun.
          </p>
          <p
            className="text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            BUSL-1.1 · MENA+EU-resident · {new Date().getFullYear()}
          </p>
        </div>
        <small
          className="mt-3 block text-[10px] text-[color:var(--color-fg-tertiary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Imagery: © Esri, Maxar · © EOX · Sentinel-2 cloudless · ESA · ©
          OpenStreetMap contributors
        </small>
      </div>
    </footer>
  );
}
