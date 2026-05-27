export const EASE_OUT = [0.2, 0.6, 0.1, 1] as const;
export const EASE_INOUT = [0.5, 0, 0.2, 1] as const;
export const EASE_CINEMATIC = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  instant: 0.08,
  fast: 0.16,
  base: 0.22,
  slow: 0.4,
  cinematic: 1.2,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
