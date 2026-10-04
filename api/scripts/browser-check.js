const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');

async function main() {
  const base = process.env.TEST_URL || 'http://127.0.0.1:3101';
  const output = path.join(__dirname, '..', '..', '.runtime', 'screenshots');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const api = await page.request.get(`${base}/api/events/upcoming`);
    const upcoming = await api.json();
    assert.equal(upcoming.length, 5);
    assert(upcoming.every(event => event.status === 'active' && event.time_status === 'upcoming'));
    assert.equal((await page.request.get(`${base}/api/events/8`)).status(), 404);
    assert.equal((await page.request.get(`${base}/api/events/search?date=2026-02-30`)).status(), 400);
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
      await page.setViewportSize(viewport);
      for (const route of ['index.html', 'search.html', 'detail.html?id=1']) {
        await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => !document.getElementById('status').textContent.includes('Loading'));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow: ${route} at ${viewport.width}`);
        if (route.startsWith('detail')) assert(await page.locator('#detail').isVisible());
        await page.screenshot({ path: path.join(output, `${route.split('.')[0]}-${viewport.width}.png`), fullPage: true });
        const images = await page.locator('img').evaluateAll(nodes => nodes.map(image => ({ src: image.src, loaded: image.complete && image.naturalWidth > 0 })));
        console.log(JSON.stringify({ route, width: viewport.width, images }));
      }
    }
    await page.goto(`${base}/index.html`);
    await page.getByRole('navigation').getByRole('link', { name: 'Find an event' }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '7 events');
    await page.locator('.event-actions a').first().click();
    await page.locator('#detail').waitFor({ state: 'visible' });
    assert.equal(new URL(page.url()).pathname, '/detail.html');
    await page.getByRole('link', { name: 'All events' }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '7 events');
    await page.getByRole('navigation').getByRole('link', { name: "What's on" }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '5 events');
    await page.goto(`${base}/search.html`);
    await page.waitForFunction(() => document.querySelectorAll('#category option').length === 6);
    await page.locator('#date').fill('2026-11-07');
    await page.locator('#location').fill('New Farm');
    await page.locator('#category').selectOption('1');
    await page.getByRole('button', { name: 'Search events' }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '1 event');
    assert.equal(await page.locator('.event-row').count(), 1);
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '7 events');
    assert.equal(await page.locator('#date').inputValue(), '');
    assert.equal(await page.locator('#location').inputValue(), '');
    assert.equal(await page.locator('#category').inputValue(), '');
    assert.equal(await page.locator('.badge.past').count(), 2);
    await page.locator('#location').fill('NoSuchPlace');
    await page.getByRole('button', { name: 'Search events' }).click();
    await page.waitForFunction(() => document.getElementById('status').textContent === '0 events');
    assert(await page.getByText('No events found.', { exact: false }).isVisible());
    await page.goto(`${base}/detail.html?id=1`);
    await page.locator('#detail').waitFor({ state: 'visible' });
    const alert = new Promise(resolve => page.once('dialog', async dialog => { const message = dialog.message(); await dialog.accept(); resolve(message); }));
    await page.getByRole('button', { name: 'Register' }).click();
    assert.equal(await alert, 'This feature is currently under construction.');
    await page.goto(`${base}/detail.html?id=5`);
    await page.locator('#detail').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#ticket-price').textContent(), 'Free admission');
    await page.goto(`${base}/detail.html?id=8`);
    await page.waitForFunction(() => document.getElementById('status').textContent === 'This event is unavailable.');
    assert(await page.locator('#detail').isHidden());
    await page.route('**/api/events/upcoming', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Event data is temporarily unavailable.' }) }));
    await page.goto(`${base}/index.html`);
    await page.waitForFunction(() => document.getElementById('status').textContent.includes('temporarily unavailable'));
    assert.equal(await page.locator('.event-row').count(), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: homepage/search/detail navigation, desktop/mobile layouts, API filters, clear, empty/error states, free ticket, suspended detail and Register alert.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
