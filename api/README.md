# API and server (Modules 3-4)

The Express server uses event_db.js to create a MySQL connection pool.
Configuration is loaded from api/.env, independently of the terminal's working directory.
Both /api routes and clientside pages use http://localhost:3101.
The server listens on 127.0.0.1 for local development.

## Run

1. Install Node.js 20 or later and MySQL/MariaDB.
2. Import database/charityevents_db.sql into a fresh database instance using the
   database/README.md instructions. Do not overwrite another project's database.
3. In api/, run npm ci and copy .env.example to .env.
4. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME for your database.
   The example uses the isolated local database port 3307; other installations
   may use 3306. Keep PORT=3101 and DB_NAME=charityevents_db.
   Use an existing account with SELECT access to the assessment database.
5. Run npm start and open http://localhost:3101/api/health.

Credentials stay in the ignored .env file; never commit them.
The database connection uses a bounded pool and disables multiple SQL statements.

## Health check and errors

GET /api/health executes SELECT 1 against MySQL before returning HTTP 200:

```json
{"status":"ok","database":"connected"}
```

A database connection failure returns HTTP 503 with a generic JSON error.
Unknown /api routes return HTTP 404 JSON. Missing pages return HTTP 404 text.
Startup port errors are logged, and SIGINT/SIGTERM close the server and database pool.

## Homepage endpoint (Module 4)

GET /api/events/upcoming returns active events on or after the current Brisbane
time, joined with category and organisation data and sorted by event time then ID.
Past and suspended events are excluded. Timestamps include the +10:00 offset.
The homepage at / or /index.html fetches this endpoint from the same origin and
renders event information through the DOM, including loading, empty and error states.

Search/category and detail endpoints and their pages remain pending modules 5-6.
Registration and administration are outside A2.

If port 3101 is occupied, inspect the existing process before starting another
server. Do not change the agreed port or stop unrelated applications.
