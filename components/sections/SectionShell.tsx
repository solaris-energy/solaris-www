import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  id?: string;
};

export function SectionShell({ eyebrow, title, children, id }: Props) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1280px] px-6 py-28 md:px-12 md:py-36"
    >
      <header className="mb-12 max-w-[60ch]">
        <p
          className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-accent-flare)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[color:var(--color-fg-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

export function GridDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto max-w-[1280px] px-6 md:px-12"
    >
      <div className="h-px w-full bg-[color:var(--color-grid-line)]" />
    </div>
  );
}
