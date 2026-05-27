"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import maplibregl, { type Map as MaplibreMap } from "maplibre-gl";
import { HeroCinematicFallback } from "../three/HeroCinematic.fallback";
import {
  BEATS,
  captionOpacity,
  interpolateCamera,
  ramp,
} from "./cinematic-beats";
import { buildPvModules, buildSetback, PV_ROW_COUNT } from "./pv-grid";

// Hybrid raster satellite style built inline. Low zoom = EOX Sentinel-2
// cloudless (cloud-free planetary mosaic, CC-BY-SA). High zoom = Esri World
// Imagery (sub-meter rooftop detail, free with attribution). The two layers
// overlap by one zoom level so the swap at z≈10 is invisible.
const HYBRID_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "sat-low": {
      type: "raster",
      tiles: [
        "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2023_3857/default/g/{z}/{y}/{x}.jpg",
      ],
      tileSize: 256,
      maxzoom: 11,
      attribution:
        "© EOX · Sentinel-2 cloudless · ESA",
    },
    "sat-high": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© Esri, Maxar, Earthstar Geographics",
    },
  },
  layers: [
    {
      id: "bg",
      type: "background",
      paint: { "background-color": "#000814" },
    },
    {
      id: "sat-low-layer",
      type: "raster",
      source: "sat-low",
      maxzoom: 10,
    },
    {
      id: "sat-high-layer",
      type: "raster",
      source: "sat-high",
      minzoom: 9,
    },
  ],
};

function shouldRenderRich(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;
  type NetworkInformation = { saveData?: boolean; effectiveType?: string };
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return false;
  return true;
}

// Beat-4 hero image. Generated externally by AI from a satellite reference
// of the chosen warehouse (see docs/prompts/04-pv-preview-ai-image.md). If
// the asset is absent (404), we silently fall back to the programmatic
// GeoJSON PV grid already rendered on the map below.
const PV_PREVIEW_SRC = "/textures/pv-preview.png";

function HeroMapCinematicRich() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const styleReadyRef = useRef(false);
  const [styleReady, setStyleReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewAvailable, setPreviewAvailable] = useState(true);
  const previewOpacity = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  // Map lifecycle: create once on mount, destroy on unmount.
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: HYBRID_STYLE,
      center: BEATS[0]!.center as [number, number],
      zoom: BEATS[0]!.zoom,
      pitch: BEATS[0]!.pitch,
      bearing: BEATS[0]!.bearing,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      // Globe projection for beats 0-1 reads as planetary scale.
      try {
        map.setProjection({ type: "globe" });
      } catch {
        /* maplibre <5 won't have setProjection; skip silently */
      }

      // Setback wireframe (revealed at beat 3).
      if (!map.getSource("pv-setback")) {
        map.addSource("pv-setback", {
          type: "geojson",
          data: buildSetback(),
        });
        map.addLayer({
          id: "pv-setback-line",
          source: "pv-setback",
          type: "line",
          paint: {
            "line-color": "#FFB23F",
            "line-width": 1,
            "line-opacity": 0,
            "line-dasharray": [3, 2],
          },
        });
      }

      // PV modules grid (revealed at beat 4).
      if (!map.getSource("pv-modules")) {
        map.addSource("pv-modules", {
          type: "geojson",
          data: buildPvModules(),
        });
        map.addLayer({
          id: "pv-fill",
          source: "pv-modules",
          type: "fill",
          paint: {
            "fill-color": "#FFB23F",
            "fill-opacity": 0,
          },
        });
        map.addLayer({
          id: "pv-edge",
          source: "pv-modules",
          type: "line",
          paint: {
            "line-color": "#A86F1F",
            "line-width": 0.4,
            "line-opacity": 0,
          },
        });
      }

      styleReadyRef.current = true;
      setStyleReady(true);
      // The container can have zero/near-zero size at construction time when
      // the cinematic section is still below the fold. Force a resize once
      // the style is loaded so the canvas matches the sticky stage.
      map.resize();
    });

    // Keep the canvas in sync with the sticky container as the user scrolls
    // / resizes the viewport.
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.resize();
    });
    ro.observe(mapContainerRef.current);

    return () => {
      ro.disconnect();
      mapRef.current = null;
      styleReadyRef.current = false;
      map.remove();
    };
  }, []);

  // Scroll driver.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setProgress(p);
    const map = mapRef.current;
    if (!map || !styleReadyRef.current) return;

    const cam = interpolateCamera(p);
    map.jumpTo({
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });

    // Beat 3 setback wireframe: fade in over p ∈ [0.55, 0.80].
    const setbackT = ramp(p, 0.55, 0.8);
    if (map.getLayer("pv-setback-line")) {
      map.setPaintProperty("pv-setback-line", "line-opacity", setbackT * 0.5);
    }

    // Beat 4 PV array stagger: rows reveal sequentially over p ∈ [0.78, 1.0].
    const arrayT = ramp(p, 0.78, 1.0);
    if (map.getLayer("pv-fill")) {
      // Per-feature opacity: reveal rows in sequence as arrayT advances.
      // No zoom-interpolate (stops would have to be constants, not data
      // expressions) — the module footprints are only visible at city zoom
      // anyway because the map is tilted in close.
      const advanced = arrayT * (PV_ROW_COUNT + 1);
      const fillExpr = [
        "case",
        ["<", ["get", "row"], advanced],
        0.85,
        0,
      ] as unknown as number;
      map.setPaintProperty("pv-fill", "fill-opacity", fillExpr);
      map.setPaintProperty(
        "pv-edge",
        "line-opacity",
        arrayT * 0.7,
      );
    }
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic scroll sequence: planet, Morocco, Casablanca, rooftop, PV array."
      data-testid="hero-cinematic-mount"
      data-cinematic-progress={progress.toFixed(3)}
      className="relative mt-16 h-[500vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden border-y border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-void)]">
        {/* MapLibre overrides this element's position to relative, so we give
            it explicit width/height instead of relying on inset-0. */}
        <div
          ref={mapContainerRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {!styleReady && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0A0E14_0%,#05070B_75%)]"
          />
        )}

        {/* Beat-4 AI-generated PV preview overlay. Sits above the map canvas
            and below the captions. Fades in over p ∈ [0.85, 1.0]. If the
            asset is missing the onError handler hides the element and the
            programmatic GeoJSON PV grid on the map shows through. */}
        {previewAvailable && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PV_PREVIEW_SRC}
            alt=""
            aria-hidden="true"
            onError={() => setPreviewAvailable(false)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: previewOpacity,
              pointerEvents: "none",
              transition: "opacity 120ms linear",
            }}
          />
        )}

        {/* Caption overlay */}
        <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-6 pb-12 md:px-12 md:pb-20 xl:px-16">
          {BEATS.map((b, i) => {
            const opacity = captionOpacity(progress, i);
            return (
              <figcaption
                key={i}
                aria-hidden={opacity < 0.5}
                style={{ opacity }}
                className="absolute bottom-12 left-6 max-w-[56ch] rounded-sm border border-[color:var(--color-bg-edge)] bg-[color:var(--color-bg-void)]/75 px-4 py-3 backdrop-blur-md transition-opacity duration-200 md:bottom-20 md:left-12 xl:left-16"
              >
                {b.mono ? (
                  <span
                    className="font-mono text-[13px] tracking-[0.04em] text-[color:var(--color-accent-flare)] md:text-[15px]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {b.caption}
                  </span>
                ) : (
                  <span className="text-[15px] leading-[1.5] text-[color:var(--color-fg-primary)] md:text-[18px]">
                    {b.caption}
                  </span>
                )}
              </figcaption>
            );
          })}

          {/* Beat tick HUD */}
          <div
            className="absolute right-6 top-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-fg-tertiary)] md:right-12 md:top-8 xl:right-16"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>
              Beat 0{Math.min(BEATS.length, Math.floor(progress * (BEATS.length - 1)) + 1)} /
              0{BEATS.length}
            </span>
            <span className="flex gap-1">
              {BEATS.map((_, i) => {
                const active = i / (BEATS.length - 1) <= progress + 1e-4;
                return (
                  <span
                    key={i}
                    className={`block h-[2px] w-4 ${
                      active
                        ? "bg-[color:var(--color-accent-flare)]"
                        : "bg-[color:var(--color-bg-edge)]"
                    }`}
                  />
                );
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroMapCinematicMount() {
  const [rich, setRich] = useState(false);
  useEffect(() => {
    setRich(shouldRenderRich());
  }, []);

  if (!rich) {
    return (
      <div data-testid="hero-cinematic-mount" className="relative mt-16 w-full">
        <HeroCinematicFallback />
      </div>
    );
  }

  return <HeroMapCinematicRich />;
}

export default HeroMapCinematicMount;
