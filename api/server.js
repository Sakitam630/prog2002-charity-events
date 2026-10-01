const db = require('./event_db');
const { createApp } = require('./app');
const port = Number(process.env.PORT || 3101);
const server = createApp(db).listen(port, '127.0.0.1', () => {
  console.log(`Common Ground: http://localhost:${port}`);
});
server.on('error', error => {
  console.error(`Cannot start server: ${error.code}`);
  process.exitCode = 1;
  db.end();
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => db.end()));
}
