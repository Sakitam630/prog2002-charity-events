# Public website (Modules 4-6)

The homepage, search and detail pages use HTML, CSS and plain JavaScript DOM operations.
Start the Express server using api/README.md, then open http://localhost:3101.
Do not open index.html with file://: website and API share port 3101.

## Included

- index.html: shared navigation, welcome, mission, contact details and event agenda.
- assets/styles.css: shared foundation, homepage/search/detail layouts and mobile breakpoints.
- assets/site.js: same-origin API requests, safe DOM rendering, Brisbane date/time,
  ticket price formatting, category photographs and request/status handling.
- assets/home.js: loads /api/events/upcoming into the homepage agenda.
- search.html and assets/search.js: category dropdown, single/combined date,
  location and category filters, URL query restoration and Clear Filters.
- detail.html and assets/detail.js: event information, organisation contact,
  ticket price, fundraising progress and the A2 registration placeholder.

Event names, dates, locations, categories, descriptions and prices come from MySQL
through the API. The homepage displays active upcoming events only, with an
Upcoming badge. Loading, empty and API error states are visible in the page.
Photographs require internet access; see docs/image-sources.md for attribution notes.

Search is available from homepage navigation or /search.html. Submitting filters
updates the URL and results through the DOM. Clear Filters resets all fields,
clears validation feedback and reloads all active events. Invalid form values,
API errors and empty results are shown in the page. If categories cannot load,
date and location search remain available.

Follow a Details link from the homepage or search results to /detail.html?id=1.
The page fetches the event by URL ID, renders its full information and shows the
fundraising amount, goal, percentage and progress bar. Free events display Free
admission; past events are labelled as finished. Missing/invalid IDs, unavailable
events and API failures display an error while the detail content remains hidden.

Register only alerts: This feature is currently under construction.
It does not submit data or implement A3 registration, ticket purchases or admin CRUD.
The complete A2 project remains separate from this staged delivery.
