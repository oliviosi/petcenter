(async () => {
  const { chromium } = await import('playwright');
  const sessionCookie = { name: 'petcenter-admin-session', value: JSON.stringify({ token: process.env.DEBUG_ADMIN_TOKEN, userId: process.env.DEBUG_ADMIN_USERID, empresaId: process.env.DEBUG_ADMIN_EMPRESAID }), domain: 'localhost', path: '/', httpOnly: false };
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([sessionCookie]);
  const page = await context.newPage();
  await page.goto(process.env.DEBUG_ADMIN_URL || 'http://localhost:3000/admin/feedback', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const sel = (s) => { const el = document.querySelector(s); if(!el) return null; const cs = window.getComputedStyle(el); return { tag: el.tagName, className: el.className, display: cs.display, position: cs.position, left: cs.left, right: cs.right, width: cs.width, transform: cs.transform, marginLeft: cs.marginLeft, order: cs.order } };
    return {
      body: sel('body'),
      container: sel('div.flex.min-h-screen.bg-surface-page'),
      aside: sel('aside'),
      main: sel('main'),
      pageWrapper: sel('section'),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();