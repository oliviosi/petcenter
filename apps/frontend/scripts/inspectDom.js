(async () => {
  const { chromium } = await import('playwright');
  const sessionCookie = { name: 'petcenter-admin-session', value: JSON.stringify({ token: process.env.DEBUG_ADMIN_TOKEN, userId: process.env.DEBUG_ADMIN_USERID, empresaId: process.env.DEBUG_ADMIN_EMPRESAID }), domain: 'localhost', path: '/', httpOnly: false };
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([sessionCookie]);
  const page = await context.newPage();
  await page.goto(process.env.DEBUG_ADMIN_URL || 'http://localhost:3000/admin/feedback', { waitUntil: 'networkidle' });
  const dom = await page.evaluate(() => {
    const main = document.querySelector('main');
    const aside = document.querySelector('aside');
    return {
      mainHTML: main ? main.innerHTML.slice(0,5000) : null,
      mainChildren: main ? main.children.length : 0,
      asideHTML: aside ? aside.innerHTML.slice(0,2000) : null,
      asideChildren: aside ? aside.children.length : 0,
    };
  });
  console.log(JSON.stringify(dom, null, 2));
  await browser.close();
})();