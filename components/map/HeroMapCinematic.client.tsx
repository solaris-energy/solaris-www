"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeroCinematicFallback } from "../cinematic/HeroCinematic.fallback";

function StaticFallback() {
  return (
    <div data-testid="hero-cinematic-mount" className="relative mt-16 w-full">
      <HeroCinematicFallback />
    </div>
  );
}

// maplibre-gl is ~1 MB of JS; loading it eagerly blows the 250 KB hero-route
// budget (scripts/check-budgets.mjs). The rich cinematic is split into its
// own chunk and only fetched after hydration, when shouldRenderRich() says
// the device wants it. Until the chunk arrives we show the same static
// fallback, so the hero never flashes empty.
const HeroMapCinematicRich = dynamic(() => import("./HeroMapCinematicRich.client"), {
  ssr: false,
  loading: StaticFallback,
});

// Rich MapLibre cinematic now runs on all viewports >= 360px (MapLibre is far
// lighter than the static-cinematic stack the original gate was sized for). The only
// fallback path is prefers-reduced-motion or save-data / 2G.
function shouldRenderRich(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 360) return false;
  type NetworkInformation = { saveData?: boolean; effectiveType?: string };
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return false;
  return true;
}

// First user interaction (scroll / pointer / key / touch) arms the rich
// cinematic. Booting MapLibre at hydration cost ~16 s of main-thread
// blocking on CPU-throttled runs (software WebGL) and tanked the
// Lighthouse TBT gate; a real user always interacts long before the
// cinematic section matters, so the chunk is fetched on first intent and
// the static fallback covers the gap.
const INTENT_EVENTS = [
  "scroll",
  "pointerdown",
  "pointermove",
  "keydown",
  "touchstart",
] as const;

export function HeroMapCinematicMount() {
  const [rich, setRich] = useState(false);

  useEffect(() => {
    if (!shouldRenderRich()) return;
    if (window.scrollY > 0) {
      setRich(true);
      return;
    }
    const arm = () => setRich(true);
    for (const e of INTENT_EVENTS) {
      window.addEventListener(e, arm, { passive: true, once: true });
    }
    return () => {
      for (const e of INTENT_EVENTS) {
        window.removeEventListener(e, arm);
      }
    };
  }, []);

  if (!rich) {
    return <StaticFallback />;
  }

  return <HeroMapCinematicRich />;
}

export default HeroMapCinematicMount;
