# Common Ground Brisbane

PROG2002 Assessment 2: charity events website.

## Current delivery: Modules 1-6

Module 1 contains project structure, documentation and example configuration.
Module 2 adds the database schema, eight sample events and import/verification guidance.
Module 3 adds the Express server, MySQL connection pool, environment configuration
and GET /api/health database connectivity check.
Module 4 adds the homepage, shared navigation and responsive agenda, plus
GET /api/events/upcoming for active upcoming events from MySQL.
Open http://localhost:3101 after configuring and starting the API.
Module 5 adds search.html with date, location and category filters, Clear Filters,
input validation, and GET /api/categories and /api/events/search.
Module 6 adds detail.html and GET /api/events/:id, including complete event
information, ticket prices, fundraising goal/progress and the A2 Register alert.
The homepage, search and event details are now linked. Modules 7-8 remain pending.

- api/: Node.js / Express server and MySQL connection.
- clientside/: homepage, search and detail HTML, CSS and JavaScript DOM rendering.
- database/: schema, sample SQL and read-only verification queries.
- docs/: module plan and future setup/testing guidance.

Required technologies: Node.js, HTML, JavaScript, DOM and MySQL.
Database name: charityevents_db. Connection filename: event_db.js.
Website and API share port 3101 through the same Express server.
Database port 3307 is reserved for an isolated local instance; configure the
actual database connection in api/.env. See api/README.md for startup instructions.

See docs/a2-a3-module-plan.md for the agreed eight A2 modules.
Prepare, verify, commit and upload one module at a time after user confirmation.
Existing complete local code remains a reference/backup and is not part of this upload.
Commit dates record actual work and must not be fabricated.

Target A2 submission: 2026-10-10, before October 11; confirm the exact school time.
A3 is outside the current implementation scope.

Do not commit .env, node_modules, runtime data or the requirements-notes document.
Use assistance in accordance with the assessment GenAI rules and acknowledge it accurately.
