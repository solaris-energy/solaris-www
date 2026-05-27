import { test, expect } from "@playwright/test";

test.describe("home", () => {
  test("hero renders with headline and primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /satellite tile/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /request pilot access/i }),
    ).toBeVisible();
  });

  test("metric strip shows four values", async ({ page }) => {
    await page.goto("/");
    const terms = page.locator("section dl").first().locator("dt");
    await expect(terms).toHaveCount(4);
  });

  test("skip link reaches main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();
  });

  test("hero scene mount exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-scene-mount")).toBeVisible();
  });

  test("primary nav is keyboard reachable in order", async ({ page }) => {
    await page.goto("/");
    // skip-link, wordmark, nav links (3), nav CTA
    await page.keyboard.press("Tab"); // skip
    await page.keyboard.press("Tab"); // wordmark
    await expect(page.getByRole("link", { name: /solaris — home/i })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /^platform$/i })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /^trust$/i })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /^company$/i })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /request pilot/i })).toBeFocused();
  });

  test("set-piece sections render", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: /we see the roof/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /we simulate the year/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /we price the deal/i }),
    ).toBeVisible();
  });

  test("footer columns and brand line", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo")).toContainText(/built in France/i);
    await expect(page.getByRole("contentinfo")).toContainText(/Product/);
    await expect(page.getByRole("contentinfo")).toContainText(/Company/);
    await expect(page.getByRole("contentinfo")).toContainText(/Legal/);
  });
});

test.describe("secondary pages", () => {
  for (const path of ["/platform", "/trust", "/company"]) {
    test(`${path} renders an h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
