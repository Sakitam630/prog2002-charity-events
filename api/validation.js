function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function positiveId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) ||
      !Number.isSafeInteger(Number(value)) || Number(value) > 4294967295) {
    throw badRequest('Choose a valid event or category ID.');
  }
  return Number(value);
}

function searchFilters(query) {
  const allowed = new Set(['date', 'location', 'category_id']);
  for (const [key, value] of Object.entries(query)) {
    if (!allowed.has(key) || typeof value !== 'string') {
      throw badRequest('Use one date, location and category filter only.');
    }
  }
  const filters = {};
  if (query.date) {
    const date = query.date;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < '1000-01-01' ||
        !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      throw badRequest('Enter a real date in YYYY-MM-DD format.');
    }
    filters.date = date;
  }
  if (query.location) {
    const location = query.location.trim();
    if (location.length > 180) throw badRequest('Location must be 180 characters or fewer.');
    if (location) filters.location = location;
  }
  if (query.category_id) filters.category_id = positiveId(query.category_id);
  return filters;
}

module.exports = { positiveId, searchFilters };
