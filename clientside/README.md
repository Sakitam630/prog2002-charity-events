# Public website (Module 4)

The homepage uses HTML, CSS and plain JavaScript DOM operations.
Start the Express server using api/README.md, then open http://localhost:3101.
Do not open index.html with file://: website and API share port 3101.

## Included

- index.html: shared navigation, welcome, mission, contact details and event agenda.
- assets/styles.css: shared foundation, homepage layout and mobile breakpoints.
- assets/site.js: same-origin API requests, safe DOM rendering, Brisbane date/time,
  ticket price formatting, category photographs and request/status handling.
- assets/home.js: loads /api/events/upcoming into the homepage agenda.

Event names, dates, locations, categories, descriptions and prices come from MySQL
through the API. The homepage displays active upcoming events only, with an
Upcoming badge. Loading, empty and API error states are visible in the page.
Photographs require internet access; see docs/image-sources.md for attribution notes.

Search and event-detail navigation URLs are retained from the complete local
project. The destination pages and their APIs will be delivered in modules 5-6;
following those links in this module snapshot currently returns 404.
The complete A2 project remains separate from this staged delivery.
