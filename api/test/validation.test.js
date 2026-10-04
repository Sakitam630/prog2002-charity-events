const { test } = require('node:test');
const assert = require('node:assert/strict');
const { positiveId, searchFilters } = require('../validation');

test('positive IDs reject SQL fragments, arrays and out-of-range values', () => {
  assert.equal(positiveId('8'), 8);
  for (const value of ['0', '-1', '1 OR 1=1', '1.2', '4294967296', ['1']]) {
    assert.throws(() => positiveId(value), { status: 400 });
  }
});
test('search supports empty and combined filters', () => {
  assert.deepEqual(searchFilters({}), {});
  assert.deepEqual(searchFilters({ date: '2028-02-29', location: ' Brisbane ', category_id: '2' }),
    { date: '2028-02-29', location: 'Brisbane', category_id: 2 });
});
test('search rejects impossible dates, repeated fields and unknown parameters', () => {
  for (const query of [{ date: '2026-02-29' }, { date: '2026-04-31' },
    { date: '2026-13-01' }, { location: ['A', 'B'] }, { extra: 'x' }, { location: 'x'.repeat(181) }]) {
    assert.throws(() => searchFilters(query), { status: 400 });
  }
});
