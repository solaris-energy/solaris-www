// Walks the cinematic at three viewports, captures beats 0/2/4 at each.
// Run AFTER `npx serve out -p 3838` is up.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "screenshots");
mkdirSync(OUT_DIR, { recursive: true });

const URL = process.env.URL ?? "http://127.0.0.1:3838/solaris-www/";

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844, label: "mobile" },
  { name: "768x1024", width: 768, height: 1024, label: "tablet" },
  { name: "1440x900", width: 1440, height: 900, label: "desktop" },
];

const BEAT_INDICES = [0, 2, 4];
const BEAT_COUNT = 5;

const browser = await chromium.launch();
try {
  for (const v of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      deviceScaleFactor: 1,
      isMobile: v.label === "mobile",
      hasTouch: v.label !== "desktop",
    });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });

    // Confirm zero horizontal overflow at this viewport.
    const overflow = await page.evaluate(() => ({
      bodyScrollW: document.body.scrollWidth,
      windowW: window.innerWidth,
    }));
    const overflowFlag = overflow.bodyScrollW > overflow.windowW + 1;

    for (const i of BEAT_INDICES) {
      // Scroll so progress ~ i / (BEAT_COUNT - 1). Re-measure inside the loop
      // because layout shifts as fonts and the map canvas finish loading.
      const p = i / (BEAT_COUNT - 1);
      const geom = await page.evaluate(() => {
        const el = document.querySelector('[data-testid="hero-cinematic-mount"]');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top + window.scrollY,
          height: rect.height,
          viewH: window.innerHeight,
        };
      });
      if (!geom) throw new Error("cinematic mount not found at " + v.name);
      const targetScroll = geom.top + p * (geom.height - geom.viewH);
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        targetScroll,
      );
      // Tile servers (EOX, Esri) are external and slow on cold loads — wait
      // long enough that the visible viewport is populated before the shot.
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(2500);
      const file = resolve(OUT_DIR, `responsive-${v.name}-beat-${i}.png`);
      await page.screenshot({ path: file, fullPage: false });
      const recordedProgress = await page
        .locator('[data-testid="hero-cinematic-mount"]')
        .first()
        .getAttribute("data-cinematic-progress");
      console.log(
        `[${v.label}] beat ${i} (target p=${p.toFixed(2)}, observed=${recordedProgress}) -> ${file}`,
      );
    }

    console.log(
      `[${v.label}] horizontal-overflow=${overflowFlag} bodyW=${overflow.bodyScrollW} winW=${overflow.windowW}`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
