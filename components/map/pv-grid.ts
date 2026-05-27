// Synthetic PV module grid + rooftop setback polygon for the cinematic stage.
// Coordinates centered on Casablanca demo site. All in WGS84 lon/lat.

import type {
  Feature,
  FeatureCollection,
  Polygon,
  LineString,
} from "geojson";

const CENTER: [number, number] = [-7.51308, 33.62553];

// At lat ~33.57°: 1° lon ≈ 92.7 km, 1° lat ≈ 111.0 km.
// Module ~1.7 m × 1 m → dlon ~ 1.83e-5, dlat ~ 9.0e-6. Spec asks 2e-5 × 1e-5.
const DLON = 2e-5;
const DLAT = 1e-5;

const ROWS = 12;
const COLS = 10;

export const PV_ROW_COUNT = ROWS;

// Build a row × col grid of module polygons centered on CENTER.
export function buildPvModules(): FeatureCollection<Polygon> {
  const features: Feature<Polygon>[] = [];
  const startLon = CENTER[0] - (COLS * DLON) / 2;
  const startLat = CENTER[1] - (ROWS * DLAT) / 2;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const lon0 = startLon + col * DLON;
      const lat0 = startLat + row * DLAT;
      const lon1 = lon0 + DLON * 0.9; // small gap between modules
      const lat1 = lat0 + DLAT * 0.85;
      features.push({
        type: "Feature",
        properties: { row, col },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [lon0, lat0],
              [lon1, lat0],
              [lon1, lat1],
              [lon0, lat1],
              [lon0, lat0],
            ],
          ],
        },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

// Wire-frame rectangle one module-pitch outside the array, used as the
// "setback" polygon shown at beat 3 before the modules drop in.
export function buildSetback(): FeatureCollection<LineString> {
  const pad = 1.2;
  const halfLon = (COLS * DLON * pad) / 2;
  const halfLat = (ROWS * DLAT * pad) / 2;
  const lonW = CENTER[0] - halfLon;
  const lonE = CENTER[0] + halfLon;
  const latS = CENTER[1] - halfLat;
  const latN = CENTER[1] + halfLat;
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [lonW, latS],
            [lonE, latS],
            [lonE, latN],
            [lonW, latN],
            [lonW, latS],
          ],
        },
      },
    ],
  };
}
