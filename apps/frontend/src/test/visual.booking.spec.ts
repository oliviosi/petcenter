import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL ?? 'http://127.0.0.1:5000';
const FRONTEND_BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

test.describe('Visual: client booking page', () => {
  test('desktop snapshot', async ({ page }) => {
    // fetch a public petshop to obtain slug
    const res = await page.request.get(`${API_BASE}/petshops/public`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const shop = Array.isArray(body) ? body[0] : body;
    expect(shop).toBeTruthy();

    const slug = shop.slug ?? shop.nome?.replace(/\s+/g, '-').toLowerCase();
    await page.goto(`${FRONTEND_BASE}/petshops/${slug}/book`, { waitUntil: 'networkidle' });
    // wait for booking content
    await page.waitForSelector('text=Serviços', { timeout: 10000 });

    await expect(page).toHaveScreenshot('booking-desktop.png', { fullPage: true });
  });

  test('mobile snapshot', async ({ page }) => {
    // mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const res = await page.request.get(`${API_BASE}/petshops/public`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const shop = Array.isArray(body) ? body[0] : body;
    expect(shop).toBeTruthy();

    const slug = shop.slug ?? shop.nome?.replace(/\s+/g, '-').toLowerCase();
    await page.goto(`${FRONTEND_BASE}/petshops/${slug}/book`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Serviços', { timeout: 10000 });

    await expect(page).toHaveScreenshot('booking-mobile.png', { fullPage: true });
  });
});
