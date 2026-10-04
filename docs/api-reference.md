# A2 API reference

All endpoints use GET because they read data and do not change server state.
Responses are JSON. No request body is needed. Pages use relative /api URLs.

| Endpoint | Purpose |
| --- | --- |
| /api/health | Check server and database connectivity |
| /api/categories | Category options for the search form |
| /api/events/upcoming | Active events at or after the current Brisbane time |
| /api/events/search | Active events matching optional filters; includes past events |
| /api/events/:id | One active event including organisation and fundraising details |

## Search example

GET /api/events/search?date=2026-11-07&location=New%20Farm&category_id=1

- date: optional real calendar date, YYYY-MM-DD, interpreted in Brisbane time.
- location: optional case-insensitive substring, up to 180 characters.
- category_id: optional positive integer category ID.
- All supplied filters must match. Empty filters mean all active events.
- Unknown parameters or repeated filter parameters produce 400.
- No matches produces 200 with an empty JSON array.

Each returned object includes event_id, name, event_datetime, location, purpose,
short_description, full_description, ticket_price, fundraising_goal,
current_progress, status, category_id, category_name, organisation_name,
contact_email, contact_phone and time_status (past/upcoming).
Decimal money fields are returned as decimal strings to preserve database precision.
event_datetime includes +10:00 so the browser can render Brisbane time consistently.

Errors return an object containing an error message: 400 for invalid input,
404 for an unavailable event/endpoint, 503 for a database/service problem.
Database credentials and internal database errors are not returned to the browser.
