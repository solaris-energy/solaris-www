import type { Metadata } from "next";
import { SiteFooter } from "../../components/nav/SiteFooter";

export const metadata: Metadata = {
  title: "Trust",
  description:
    "Security, compliance, and sovereignty facts. BUSL-1.1, MENA+EU-resident, RLS-enforced, OIDC, cosign-signed, SBOM.",
};

const FACTS = [
  {
    key: "License",
    value: "BUSL-1.1",
    note: "Business Source License. Converts to Apache-2.0 four years after each release.",
  },
  {
    key: "Data residency",
    value: "Customer choice, EU default",
    note: "Default region eu-west-3 (Paris) — closest AWS region to Morocco. Sovereign and on-prem profiles available for in-country residency.",
  },
  {
    key: "Tenant isolation",
    value: "Postgres RLS, integration-tested",
    note: "Row-level security enforced at the database. A failing isolation test fails CI.",
  },
  {
    key: "Identity",
    value: "OIDC via Keycloak",
    note: "Single sign-on, MFA-ready, group-claim to role mapping.",
  },
  {
    key: "Supply chain",
    value: "cosign-signed images, SBOM published",
    note: "Every container signed with Sigstore cosign. SPDX SBOM attached to each release tag.",
  },
  {
    key: "Contracts",
    value: "OpenAPI 3.1 · AsyncAPI 3 · Protobuf",
    note: "Source of truth in solaris-contracts. Consumers pin a tag, CI runs version-pin checks.",
  },
  {
    key: "Auditability",
    value: "Outbox + event log per state change",
    note: "Transactional outbox writes every domain event. Logs are append-only, queryable per tenant.",
  },
  {
    key: "Offboarding",
    value: "Cryptographic key erase",
    note: "Per-tenant data key destruction renders ciphertext unrecoverable within minutes.",
  },
  {
    key: "AI",
    value: "Local Ollama by default",
    note: "No data leaves the deployment unless an external provider is explicitly enabled per tenant.",
  },
];

export default function TrustPage() {
  return (
    <main id="main" className="relative isolate">
      <section className="mx-auto max-w-[1440px] px-6 pt-24 pb-12 md:px-12 xl:px-16">
        <p
          className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-accent-flare)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Trust
        </p>
        <h1
          className="mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Multi-tenant by design. Single-tenant by request.
        </h1>
        <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.6] text-[color:var(--color-fg-secondary)]">
          Facts on the table. Not aspirations. Every claim below corresponds to
          a working control, a passing test, or a published artifact.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-24 md:px-12 xl:px-16">
        <div className="overflow-hidden rounded-sm border border-[color:var(--color-bg-edge)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr
                className="border-b border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-elevated)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <th className="w-[28%] px-6 py-3 text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]">
                  Control
                </th>
                <th className="w-[32%] px-6 py-3 text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]">
                  Implementation
                </th>
                <th className="px-6 py-3 text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {FACTS.map((f) => (
                <tr
                  key={f.key}
                  id={f.key.toLowerCase().replace(/\s+/g, "-")}
                  className="border-b border-[color:var(--color-bg-edge)] last:border-b-0 transition-colors hover:bg-[color:var(--color-bg-elevated)]"
                >
                  <td className="px-6 py-5 align-top">
                    <span
                      className="text-[13px] uppercase tracking-[0.06em] text-[color:var(--color-fg-secondary)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {f.key}
                    </span>
                  </td>
                  <td
                    className="px-6 py-5 align-top text-[15px] text-[color:var(--color-fg-primary)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {f.value}
                  </td>
                  <td className="px-6 py-5 align-top text-[14px] leading-[1.55] text-[color:var(--color-fg-secondary)]">
                    {f.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-[60ch] font-mono text-[12px] text-[color:var(--color-fg-tertiary)]">
          Full security pack on request — architecture diagrams, threat model,
          ADRs, penetration test summary. Email security@solaris.energy.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
