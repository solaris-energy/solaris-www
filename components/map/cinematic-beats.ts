// Cinematic beats and interpolation for the MapLibre hero stage.
// Pure data + helpers; no React, no MapLibre imports.

export type Beat = {
  center: [number, number]; // [lon, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  caption: string;
  mono?: boolean;
};

// Mobile caption for beat 4 — newline-separated so the flex-column layout can
// render each KPI on its own row inside a narrow viewport. The desktop string
// uses "|" separators and stays as a single line.
const BEAT_4_KPI_MOBILE = "MODULES: 248\nkWp: 122.0\nANNUAL YIELD: 197.4 MWh";
const BEAT_4_KPI_DESKTOP =
  "MODULES: 248   |   kWp: 122.0   |   ANNUAL YIELD: 197.4 MWh";

export const BEATS_DESKTOP: readonly Beat[] = [
  {
    center: [0, 20],
    zoom: 1.6,
    pitch: 0,
    bearing: 0,
    caption: "Every roof is already lit. We just have to see it.",
  },
  {
    center: [-6, 32],
    zoom: 4.8,
    pitch: 0,
    bearing: 0,
    caption: "Morocco. 3,000+ sun-hours per year. A grid waking up.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 12.5,
    pitch: 0,
    bearing: 0,
    caption: "Sidi Bernoussi. The first sites we measure.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 17.8,
    pitch: 60,
    bearing: 25,
    caption: "Optima. Polygon · setbacks · shading.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 18.2,
    pitch: 60,
    bearing: 25,
    caption: BEAT_4_KPI_DESKTOP,
    mono: true,
  },
] as const;

// Portrait-friendly retunes — wider Earth at beat 0, gentler zoom on beats
// 1-2, softer tilt on beats 3-4. Same five beats, same coords, same MapLibre
// driver. Tablets (>=768px) still use BEATS_DESKTOP.
export const BEATS_MOBILE: readonly Beat[] = [
  {
    center: [0, 20],
    zoom: 1.2,
    pitch: 0,
    bearing: 0,
    caption: "Every roof is already lit. We just have to see it.",
  },
  {
    center: [-6, 32],
    zoom: 4.0,
    pitch: 0,
    bearing: 0,
    caption: "Morocco. 3,000+ sun-hours per year. A grid waking up.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 11.5,
    pitch: 0,
    bearing: 0,
    caption: "Sidi Bernoussi. The first sites we measure.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 16.8,
    pitch: 50,
    bearing: 20,
    caption: "Optima. Polygon · setbacks · shading.",
  },
  {
    center: [-7.51308, 33.62553],
    zoom: 17.2,
    pitch: 50,
    bearing: 20,
    caption: BEAT_4_KPI_MOBILE,
    mono: true,
  },
] as const;

// Default export keeps backward compatibility for any importer that pulled
// BEATS directly. Desktop is the safe default — server render has no window.
export const BEATS = BEATS_DESKTOP;

export type Camera = {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Map p ∈ [0,1] onto the beat sequence. Returns the interpolated camera.
export function interpolateCamera(p: number, beats: readonly Beat[] = BEATS): Camera {
  const max = beats.length - 1;
  const idx = Math.min(Math.max(p, 0), 1) * max;
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, max);
  const t = idx - i0;
  const a = beats[i0]!;
  const b = beats[i1]!;
  return {
    center: [lerp(a.center[0], b.center[0], t), lerp(a.center[1], b.center[1], t)],
    zoom: lerp(a.zoom, b.zoom, t),
    pitch: lerp(a.pitch, b.pitch, t),
    bearing: lerp(a.bearing, b.bearing, t),
  };
}

// Per-beat caption opacity: 1.0 when p is exactly on the beat boundary,
// fades linearly across half a beat-width on each side.
export function captionOpacity(
  p: number,
  beatIndex: number,
  beatCount: number = BEATS.length,
): number {
  const max = beatCount - 1;
  const target = beatIndex / max;
  const beatWidth = 1 / max;
  const dist = Math.abs(p - target);
  return Math.max(0, Math.min(1, 1 - dist / beatWidth));
}

// Helper: linear ramp from a -> b clamped to [0,1].
export function ramp(p: number, a: number, b: number): number {
  if (b <= a) return p >= b ? 1 : 0;
  return Math.max(0, Math.min(1, (p - a) / (b - a)));
}
