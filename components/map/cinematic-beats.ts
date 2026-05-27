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

export const BEATS: readonly Beat[] = [
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
    caption:
      "MODULES: 248   |   kWp: 122.0   |   ANNUAL YIELD: 197.4 MWh",
    mono: true,
  },
] as const;

export type Camera = {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Map p ∈ [0,1] onto the beat sequence. Returns the interpolated camera.
export function interpolateCamera(p: number): Camera {
  const max = BEATS.length - 1;
  const idx = Math.min(Math.max(p, 0), 1) * max;
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, max);
  const t = idx - i0;
  const a = BEATS[i0]!;
  const b = BEATS[i1]!;
  return {
    center: [lerp(a.center[0], b.center[0], t), lerp(a.center[1], b.center[1], t)],
    zoom: lerp(a.zoom, b.zoom, t),
    pitch: lerp(a.pitch, b.pitch, t),
    bearing: lerp(a.bearing, b.bearing, t),
  };
}

// Per-beat caption opacity: 1.0 when p is exactly on the beat boundary,
// fades linearly across half a beat-width on each side.
export function captionOpacity(p: number, beatIndex: number): number {
  const max = BEATS.length - 1;
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
