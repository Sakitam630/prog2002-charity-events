# Public website (Modules 4-5)

The homepage and search page use HTML, CSS and plain JavaScript DOM operations.
Start the Express server using api/README.md, then open http://localhost:3101.
Do not open index.html with file://: website and API share port 3101.

## Included

- index.html: shared navigation, welcome, mission, contact details and event agenda.
- assets/styles.css: shared foundation, homepage/search layouts and mobile breakpoints.
- assets/site.js: same-origin API requests, safe DOM rendering, Brisbane date/time,
  ticket price formatting, category photographs and request/status handling.
- assets/home.js: loads /api/events/upcoming into the homepage agenda.
- search.html and assets/search.js: category dropdown, single/combined date,
  location and category filters, URL query restoration and Clear Filters.

Event names, dates, locations, categories, descriptions and prices come from MySQL
through the API. The homepage displays active upcoming events only, with an
Upcoming badge. Loading, empty and API error states are visible in the page.
Photographs require internet access; see docs/image-sources.md for attribution notes.

Search is available from homepage navigation or /search.html. Submitting filters
updates the URL and results through the DOM. Clear Filters resets all fields,
clears validation feedback and reloads all active events. Invalid form values,
API errors and empty results are shown in the page. If categories cannot load,
date and location search remain available.

Event-detail URLs are retained for module 6. The detail page and its API are not
included yet; following a detail link in this snapshot currently returns 404.
The complete A2 project remains separate from this staged delivery.
