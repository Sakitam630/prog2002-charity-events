const express = require('express');
const path = require('node:path');

const selectEvents = `SELECT e.*, c.name AS category_name,
  o.name AS organisation_name, o.contact_email, o.contact_phone,
  CASE WHEN e.event_datetime < UTC_TIMESTAMP() + INTERVAL 10 HOUR
       THEN 'past' ELSE 'upcoming' END AS time_status
  FROM events e JOIN categories c ON c.category_id = e.category_id
  JOIN organisations o ON o.organisation_id = e.organisation_id`;

function serialise(event) {
  return { ...event, event_datetime: `${event.event_datetime.replace(' ', 'T')}+10:00` };
}

function createApp(db) {
  const app = express();
  app.disable('x-powered-by');
  const route = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

  app.get('/api/health', route(async (_req, res) => {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  }));
  app.get('/api/events/upcoming', route(async (_req, res) => {
    const [rows] = await db.execute(`${selectEvents}
      WHERE e.status = 'active' AND e.event_datetime >= UTC_TIMESTAMP() + INTERVAL 10 HOUR
      ORDER BY e.event_datetime, e.event_id`);
    res.json(rows.map(serialise));
  }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  app.use(express.static(path.join(__dirname, '..', 'clientside')));
  app.use((_req, res) => res.status(404).send('Page not found.'));
  app.use((error, _req, res, _next) => {
    if (error.status === 400) return res.status(400).json({ error: error.message });
    console.error('API request failed:', error.code || error.name);
    res.status(503).json({ error: 'Event data is temporarily unavailable. Please try again shortly.' });
  });
  return app;
}

module.exports = { createApp };
