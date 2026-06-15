(async () => {
  const { chromium } = (await import('playwright'));

  const sessionCookie = {
    name: 'petcenter-admin-session',
    value: JSON.stringify({
      token: process.env.DEBUG_ADMIN_TOKEN,
      userId: process.env.DEBUG_ADMIN_USERID,
      empresaId: process.env.DEBUG_ADMIN_EMPRESAID
    }),
    domain: 'localhost',
    path: '/',
    httpOnly: false,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies([sessionCookie]);
  const page = await context.newPage();

  page.on('console', msg => {
    console.log('CONSOLE:', msg.type(), msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGEERROR:', err.toString());
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`XHR ${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  try {
    const res = await page.goto('http://localhost:3000/admin/profile', { waitUntil: 'networkidle' , timeout: 30000});
    console.log('NAV STATUS:', res.status());
    console.log('TITLE:', await page.title());
    // capture a screenshot
    await page.screenshot({ path: 'admin_profile_debug.png', fullPage: true });
    console.log('Screenshot saved: admin_profile_debug.png');
  } catch (err) {
    console.error('NAV ERROR', err);
  } finally {
    await browser.close();
  }
})();