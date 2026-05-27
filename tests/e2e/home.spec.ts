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
    const terms = page.locator("dl dt");
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
});
