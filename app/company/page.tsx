import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/nav/SiteFooter";

export const metadata: Metadata = {
  title: "Company",
  description:
    "A small team building the operating system for industrial solar. Based in Casablanca, hiring across MENA and the EU.",
};

const CONTACTS = [
  {
    key: "hello",
    label: "General",
    email: "hello@solaris.energy",
    note: "Partnership, product, anything else.",
  },
  {
    key: "security",
    label: "Security",
    email: "security@solaris.energy",
    note: "Vulnerability disclosure. PGP key on request.",
  },
  {
    key: "press",
    label: "Press",
    email: "press@solaris.energy",
    note: "Media kit, founder bios, logo files.",
  },
];

export default function CompanyPage() {
  return (
    <main id="main" className="relative isolate">
      <section className="mx-auto max-w-[1440px] px-6 pt-24 pb-12 md:px-12 xl:px-16">
        <p
          className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-accent-flare)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Company
        </p>
        <h1
          className="mt-4 max-w-[22ch] text-balance text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Energy decisions are too important to be slow.
        </h1>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-12 border-t border-[color:var(--color-bg-edge)] pt-12 md:grid-cols-[1fr_1.4fr]">
          <p
            className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Mission
          </p>
          <p className="max-w-[60ch] text-[20px] leading-[1.55] text-[color:var(--color-fg-primary)]">
            SOLARIS is a small team building the operating system for
            industrial solar. We replace the screenshot-and-Excel proposal
            stack with a versioned workspace that takes a satellite tile and
            returns a bankable proposal in under thirty minutes. We are based
            in Casablanca and hire across MENA and the EU. We ship on commodity
            hardware, default to EU hosting, and publish the spec for every
            contract we serve.
          </p>
        </div>
      </section>

      <section
        id="careers"
        className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 xl:px-16"
      >
        <div className="grid grid-cols-1 gap-12 border-t border-[color:var(--color-bg-edge)] pt-12 md:grid-cols-[1fr_1.4fr]">
          <p
            className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Careers
          </p>
          <p className="max-w-[60ch] text-[16px] leading-[1.6] text-[color:var(--color-fg-secondary)]">
            We are not hiring at scale. We are hiring two senior engineers and
            one solar engineer who can defend a yield model in a permit review.
            Comp ranges and scope on request.{" "}
            <Link
              href="mailto:hello@solaris.energy?subject=Careers"
              className="text-[color:var(--color-accent-flare)] underline-offset-4 hover:underline"
            >
              Write to hello@solaris.energy
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-12 border-t border-[color:var(--color-bg-edge)] pt-12 md:grid-cols-[1fr_1.4fr]">
          <p
            className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-fg-tertiary)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Contact
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CONTACTS.map((c) => (
              <Link
                key={c.key}
                href={`mailto:${c.email}`}
                className="group block rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)] p-5 transition-colors duration-[var(--dur-base)] hover:border-[color:var(--color-accent-flare)]"
              >
                <p
                  className="text-[11px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.label}
                </p>
                <p
                  className="mt-3 text-[15px] text-[color:var(--color-fg-primary)] group-hover:text-[color:var(--color-accent-flare)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.email}
                </p>
                <p className="mt-2 text-[13px] leading-[1.5] text-[color:var(--color-fg-secondary)]">
                  {c.note}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 xl:px-16">
        <div className="border-t border-[color:var(--color-bg-edge)] pt-12">
          <p
            className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-fg-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built in Casablanca. Designed for a planet running on the sun.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
