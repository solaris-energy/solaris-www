import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-6 md:px-12 xl:px-16"
    >
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)]">
        404 / Not found
      </p>
      <h1
        className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No signal at this coordinate.
      </h1>
      <p className="mt-4 max-w-[56ch] text-[color:var(--color-fg-secondary)]">
        The page you requested does not exist. It may have moved, or never
        existed in the first place.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit items-center gap-2 text-[color:var(--color-accent-flare)] transition-colors duration-[var(--dur-base)] hover:text-[color:var(--color-accent-flare-hot)]"
      >
        Back to base <span aria-hidden="true">-&gt;</span>
      </Link>
    </main>
  );
}
