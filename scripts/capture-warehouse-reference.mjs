// Capture a clean top-down Esri World Imagery screenshot of the chosen
// warehouse in ZI Sidi Bernoussi. The output is the reference photo the
// user feeds (alongside docs/prompts/04-pv-preview-ai-image.md) to their
// AI image generator. No overlays, no labels, no PV — just the roof.
//
// Output: public/textures/warehouse-reference.png (1024×1024)

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const LAT = 33.62553;
const LON = -7.51308;
const ZOOM = 18;

const OUT_DIR = path.resolve("public/textures");
await mkdir(OUT_DIR, { recursive: true });

const html = `<!doctype html>
<html><head>
<meta charset="utf-8">
<title>warehouse-reference</title>
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">
<style>html,body,#m{margin:0;width:1024px;height:1024px;background:#000814}</style>
</head><body>
<div id="m"></div>
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<script>
window.__ready = false;
const map = new maplibregl.Map({
  container: 'm',
  interactive: false,
  attributionControl: false,
  fadeDuration: 0,
  center: [${LON}, ${LAT}],
  zoom: ${ZOOM},
  pitch: 0,
  bearing: 0,
  style: {
    version: 8,
    sources: {
      sat: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#000814' } },
      { id: 'sat', type: 'raster', source: 'sat' }
    ]
  }
});
map.on('idle', () => { window.__ready = true; });
</script>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1024, height: 1024 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
// Extra settle time so all tiles finish drawing crisp.
await page.waitForTimeout(1500);

const out = path.join(OUT_DIR, "warehouse-reference.png");
await page.screenshot({ path: out, fullPage: false, omitBackground: false });
await writeFile(
  path.join(OUT_DIR, ".warehouse-reference.meta.json"),
  JSON.stringify(
    { name: "Optima", lat: LAT, lon: LON, zoom: ZOOM, source: "Esri World Imagery" },
    null,
    2,
  ),
  "utf8",
);
console.log(`wrote ${out}`);
await browser.close();
