(async () => {
  const { chromium } = await import('playwright');

  const sessionCookie = {
    name: 'petcenter-admin-session',
    value: JSON.stringify({
      token: process.env.DEBUG_ADMIN_TOKEN,
      userId: process.env.DEBUG_ADMIN_USERID,
      empresaId: process.env.DEBUG_ADMIN_EMPRESAID,
    }),
    domain: 'localhost',
    path: '/',
    httpOnly: false,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies([sessionCookie]);
  const page = await context.newPage();

  page.on('console', (msg) => {
    console.log('CONSOLE:', msg.type(), msg.text());
  });

  page.on('pageerror', (err) => {
    console.log('PAGEERROR:', err.toString());
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.log(`XHR ${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  try {
    const target = process.env.DEBUG_ADMIN_URL || 'http://localhost:3000/admin/profile';
    const res = await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('NAV STATUS:', res.status());
    console.log('TITLE:', await page.title());

    const rects = await page.evaluate(() => {
      function r(sel) {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { left: b.left, top: b.top, width: b.width, height: b.height };
      }

      const container = document.querySelector('div.flex.min-h-screen.bg-surface-page');
      const containerHtml = container ? container.outerHTML.slice(0, 800) : null;

      return {
        containerHtml,
        aside: r('aside'),
        main: r('main'),
        pageWrapper: r('section[data-debug="page-wrapper"]') || r('section'),
      };
    });

    console.log('RECTS:', JSON.stringify(rects, null, 2));

    await page.screenshot({ path: 'admin_profile_debug.png', fullPage: true });
    console.log('Screenshot saved: admin_profile_debug.png');
  } catch (err) {
    console.error('NAV ERROR', err);
  } finally {
    await browser.close();
  }
})();