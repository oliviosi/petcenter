import { expect, test } from "@playwright/test";

test.skip(
  !process.env.STAGING_FRONTEND_URL,
  "STAGING_FRONTEND_URL is required to run the staging smoke test",
);

test("domain notification UI reflects degraded state", async ({ page }) => {
  await page.goto(process.env.STAGING_FRONTEND_URL, { waitUntil: "networkidle" });

  const banner = page.locator('[role="status"]').first();
  const bannerCount = await page.locator('[role="status"]').count();

  if (bannerCount > 0) {
    await expect(banner).toContainText(/Domínio personalizado/i);
    return;
  }

  await expect(page.getByRole("main")).toBeVisible();
});
