"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroSceneFallback } from "./HeroScene.fallback";

const HeroSceneClient = dynamic(() => import("./HeroScene.client"), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

function shouldRenderRich(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  type NetworkInformation = { saveData?: boolean; effectiveType?: string };
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return false;
  return true;
}

export function HeroSceneMount() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldRenderRich()) return;

    const node = containerRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Defer past LCP — wait for browser idle, fall back to a short timeout.
    type Idle = (cb: () => void, opts?: { timeout?: number }) => number;
    const w = window as Window & { requestIdleCallback?: Idle };
    const handle =
      w.requestIdleCallback?.(() => setShouldLoad(true), { timeout: 1500 }) ??
      window.setTimeout(() => setShouldLoad(true), 600);

    return () => {
      const cancelIdle = (window as Window & {
        cancelIdleCallback?: (h: number) => void;
      }).cancelIdleCallback;
      if (cancelIdle) cancelIdle(handle);
      else window.clearTimeout(handle);
    };
  }, [visible]);

  return (
    <div
      ref={containerRef}
      data-testid="hero-scene-mount"
      className="relative mt-20 aspect-[16/9] w-full overflow-hidden rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-deep)]"
    >
      {shouldLoad ? <HeroSceneClient /> : <HeroSceneFallback />}
    </div>
  );
}
