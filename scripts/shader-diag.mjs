// One-off: capture shader compile errors from the dev server.
import { chromium } from "@playwright/test";

const url = "http://localhost:3737";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const logs = [];
page.on("console", (msg) => {
  logs.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("response", (resp) => {
  if (resp.status() >= 400) logs.push(`[http ${resp.status()}] ${resp.url()}`);
});
page.on("pageerror", (err) => {
  logs.push(`[pageerror] ${err.message}\n${err.stack ?? ""}`);
});

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

console.log(logs.join("\n"));

await browser.close();
