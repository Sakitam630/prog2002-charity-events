# A2 verification record - Module 7

Run date: 2026-10-04 (Asia/Shanghai).
Target: the module-delivery checkout after modules 1-6 plus the module 7 tests.
Environment: Node.js v24.10.0, MariaDB 10.4.32 on 127.0.0.1:3307,
Playwright 1.63.0 and installed Microsoft Edge (headless).

Website and API configuration remains PORT=3101. For this run, the staged app was
started on a temporary loopback port (3116) and supplied through TEST_URL so the
existing complete project's service on 3101 was not interrupted. Tests exercised
the staged createApp and staged frontend files. No database import or writes were
performed; the existing sample database was queried read-only.

## Automated API and validation tests

Command from api/: npm test. Result: 7 passed, 0 failed, 0 skipped.
These tests use injected database stubs and do not require a live MySQL server.

- Combined search binds parameter values and excludes suspended events.
- Invalid search parameters and IDs return 400 without a database query.
- Unavailable detail and unknown API routes return JSON 404.
- Event timestamps include the explicit Brisbane UTC+10 offset.
- IDs reject SQL fragments, arrays, non-integers and out-of-range values.
- Empty and combined filters are accepted, including a valid leap day.
- Impossible dates, repeated/unknown filters and overlong locations are rejected.

## Live database and browser verification

The browser script api/scripts/browser-check.js completed successfully against
the staged app. Additional read-only checks confirmed database counts, health,
combined search and the missing-event response before the browser run.

- charityevents_db: 1 organisation, 5 categories, 8 events (7 active, 1 suspended).
- Health: HTTP 200 with database connected.
- Homepage API: 5 active upcoming events. Search: 7 active events, including 2 past.
- Combined date/location/category search: 1 matching event.
- Invalid date: HTTP 400. Suspended and missing event details: HTTP 404.
- Homepage, search and detail tested at widths 1440, 390 and 320 pixels.
- No horizontal document overflow or browser JavaScript exceptions.
- Homepage -> search -> detail -> all events -> homepage navigation passed.
- Combined filtering, Clear Filters, field reset and empty results passed.
- Past badges in search, free admission and unavailable suspended detail passed.
- Register displayed exactly: This feature is currently under construction.
- A simulated homepage API failure displayed an error and no event rows.
- Logged event img elements reported loaded=true in all nine page/viewport checks.
  This is a network-dependent diagnostic, not an assertion of image licence or
  a guarantee of future CDN availability.

Nine screenshots were generated under the checkout's .runtime/screenshots/
(index/search/detail at 1440/390/320). Screenshots, credentials and dependencies
are ignored by Git and are not included in the upload.

## Reproduce

Install Node.js 20+, run npm ci in api/, and run npm test.
For browser verification, Microsoft Edge must be installed and the selected app
must already be running against the provided sample database. Configure api/.env
and start the app as described in api/README.md. From another terminal in api/:

```powershell
npm run test:browser
```

The browser test defaults to http://127.0.0.1:3101. If testing an explicitly started
isolated instance, set TEST_URL to that instance before running the command.
The script does not start, stop or reconfigure the selected application server.

The browser checks assume the original sample IDs and the 2026 assessment-period
seed dates (5 upcoming and 2 past events). Review fixtures and expected results
if the seed data changes or those dates pass. The tests are not an exhaustive
accessibility audit; manual interface review remains useful.

Module 8 deliverable preparation remains pending. A3 is not implemented.
