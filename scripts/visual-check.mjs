// Cinematic beat screenshot capture. Assumes dev server already running on :3737.
// Writes screenshots/beat-0.png … beat-4.png and screenshots/console.log.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:3737";
const OUT = path.resolve("screenshots");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    errors.push(`[${msg.type()}] ${msg.text()}`);
  }
});
page.on("pageerror", (err) => {
  errors.push(`[pageerror] ${err.message}\n${err.stack ?? ""}`);
});
page.on("response", (resp) => {
  if (resp.status() >= 400) errors.push(`[http ${resp.status()}] ${resp.url()}`);
});

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="hero-cinematic-mount"]', {
  state: "attached",
});
// Let WebGL warm up and first frames render.
await page.waitForTimeout(2500);

// Measure the cinematic section. useScroll(target, ["start start","end end"])
// maps progress 0 to section.top hitting viewport.top, progress 1 to
// section.bottom hitting viewport.bottom. The scrollable sweep is therefore
// (sectionHeight − viewportHeight).
const dims = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="hero-cinematic-mount"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    height: r.height,
    vh: window.innerHeight,
    bodyH: document.body.scrollHeight,
  };
});
if (!dims) {
  console.error("hero-cinematic-mount not found");
  await browser.close();
  process.exit(1);
}
const mountTop = dims.top;
const sweep = dims.height - dims.vh;
console.log(
  `mount top=${mountTop}px h=${dims.height}px sweep=${sweep}px (body=${dims.bodyH})`,
);

// Smooth-scroll: tween to target over N RAF ticks so framer-motion's scroll
// velocity tracking and IntersectionObserver re-measure see real motion.
async function smoothScrollTo(targetY, steps = 30) {
  await page.evaluate(
    async ({ y, steps }) => {
      await new Promise((resolve) => {
        const start = window.scrollY;
        const delta = y - start;
        let i = 0;
        const tick = () => {
          i++;
          const t = Math.min(1, i / steps);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, start + delta * eased);
          if (i < steps) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    { y: targetY, steps },
  );
}

// Anchor at page top before stepping forward through beats.
await smoothScrollTo(0, 10);
await page.waitForTimeout(500);

for (let i = 0; i < 5; i++) {
  const frac = i / 4; // 0, 0.25, 0.5, 0.75, 1.0
  const targetY = Math.round(mountTop + frac * sweep);
  await smoothScrollTo(targetY, 30);
  await page.waitForTimeout(1200);
  const probe = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="hero-cinematic-mount"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      rectTop: r.top,
      scrollY: window.scrollY,
      progress: el.getAttribute("data-cinematic-progress"),
      beat: el.getAttribute("data-cinematic-beat"),
    };
  });
  const file = path.join(OUT, `beat-${i}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`beat-${i} target=${targetY} ${JSON.stringify(probe)}`);
}

await writeFile(path.join(OUT, "console.log"), errors.join("\n"), "utf8");
console.log(`\nconsole errors/warnings: ${errors.length}`);

await browser.close();
