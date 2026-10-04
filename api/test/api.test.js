const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../app');

async function withServer(db, check) {
  const server = createApp(db).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await check(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test('combined search binds values and excludes suspended events', async () => {
  const calls = [];
  await withServer({ execute: async (sql, values) => { calls.push({ sql, values }); return [[]]; } }, async base => {
    const response = await fetch(`${base}/api/events/search?date=2026-11-07&location=New%20Farm&category_id=1`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
    assert.deepEqual(calls[0].values, ['2026-11-07', '2026-11-07', 'New Farm', 1]);
    assert.match(calls[0].sql, /e.status = 'active'/);
  });
});
test('invalid search and IDs return 400 without querying the database', async () => {
  let count = 0;
  await withServer({ execute: async () => { count++; return [[]]; } }, async base => {
    for (const endpoint of ['/api/events/0', '/api/events/search?date=2026-02-30', '/api/events/search?category_id=1&category_id=2']) {
      assert.equal((await fetch(base + endpoint)).status, 400);
    }
    assert.equal(count, 0);
  });
});
test('unavailable detail and unknown API return JSON 404', async () => {
  await withServer({ execute: async () => [[]] }, async base => {
    for (const endpoint of ['/api/events/99', '/api/unknown']) {
      const response = await fetch(base + endpoint);
      assert.equal(response.status, 404);
      assert.equal(typeof (await response.json()).error, 'string');
    }
  });
});
test('event timestamps have explicit Brisbane offset', async () => {
  await withServer({ execute: async () => [[{ event_id: 1, event_datetime: '2026-11-07 08:00:00' }]] }, async base => {
    const result = await (await fetch(`${base}/api/events/1`)).json();
    assert.equal(result.event_datetime, '2026-11-07T08:00:00+10:00');
  });
});
