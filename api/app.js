const express = require('express');
const path = require('node:path');

function createApp(db) {
  const app = express();
  app.disable('x-powered-by');
  const route = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

  app.get('/api/health', route(async (_req, res) => {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
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
