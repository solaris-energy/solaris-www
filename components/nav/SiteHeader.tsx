import Link from "next/link";

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/trust", label: "Trust" },
  { href: "/company", label: "Company" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-bg-edge)]/60 bg-[color:var(--color-bg-void)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:px-12 xl:px-16">
        <Link
          href="/"
          className="group flex items-baseline gap-0 text-[18px] font-semibold tracking-[-0.04em] text-[color:var(--color-fg-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label="solaris — home"
        >
          <span>solar</span>
          <span className="relative">
            i
            <span
              aria-hidden="true"
              className="absolute -top-[6px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-[color:var(--color-accent-flare)] shadow-[0_0_10px_var(--color-accent-flare)] transition-shadow group-hover:shadow-[0_0_16px_var(--color-accent-flare)]"
            />
          </span>
          <span>s</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-[color:var(--color-fg-secondary)] transition-colors duration-[var(--dur-base)] hover:text-[color:var(--color-fg-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#pilot"
          className="inline-flex items-center gap-2 rounded-sm border border-[color:var(--color-bg-edge)] px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-[color:var(--color-fg-primary)] transition-colors duration-[var(--dur-base)] hover:border-[color:var(--color-accent-flare)] hover:text-[color:var(--color-accent-flare)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Request pilot
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </header>
  );
}
